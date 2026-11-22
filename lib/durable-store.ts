// Durable key-value storage for content history (brief permalinks, gallery
// share links, last-known-good snapshots and diagnostics).
//
// Production uses a Redis database over the Upstash REST protocol, which is
// what Vercel's Marketplace Redis/KV integrations provision. No SDK is needed:
// the protocol is a JSON array command POSTed with a bearer token.
//
// Without credentials (local development, tests, preview builds) the store
// falls back to process memory. Memory is NOT durable on Vercel: each
// serverless instance has its own copy and loses it on cold start. The
// application still works in that mode; it simply cannot resolve history that
// has left the live feeds.

type StoreKind = "redis" | "memory";

export type DurableStore = {
  kind: StoreKind;
  getJson<T>(key: string): Promise<T | null>;
  setJson(key: string, value: unknown): Promise<void>;
  hashGetJson<T>(key: string, field: string): Promise<T | null>;
  hashGetManyJson<T>(key: string, fields: string[]): Promise<Array<T | null>>;
  hashSetManyJson(key: string, entries: Record<string, unknown>, options?: { maxEntries?: number }): Promise<void>;
};

const KEY_PREFIX = "astroboat:v1:";
const STORE_TIMEOUT_MS = 3000;

type RedisConfig = { url: string; token: string };

function readEnv(name: string): string {
  const env = typeof process !== "undefined" ? process.env : undefined;
  return env?.[name]?.trim() ?? "";
}

export function resolveRedisConfig(): RedisConfig | null {
  const url = readEnv("KV_REST_API_URL") || readEnv("UPSTASH_REDIS_REST_URL");
  const token = readEnv("KV_REST_API_TOKEN") || readEnv("UPSTASH_REDIS_REST_TOKEN");

  if (!url || !token) return null;

  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:") return null;
    return { url: parsed.toString().replace(/\/$/, ""), token };
  } catch {
    return null;
  }
}

function storeWarn(message: string) {
  // Never log tokens, URLs with credentials, or stored values.
  console.warn(`[store] ${message}`);
}

function parseJson<T>(value: unknown): T | null {
  if (typeof value !== "string" || !value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

function createRedisStore(config: RedisConfig): DurableStore {
  async function request(path: string, body: unknown): Promise<unknown> {
    try {
      const response = await fetch(`${config.url}${path}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${config.token}`, "Content-Type": "application/json" },
        body: JSON.stringify(body),
        // POST requests are never cached by Next.js; an explicit "no-store" would
        // also force pages that read history out of static generation.
        signal: AbortSignal.timeout(STORE_TIMEOUT_MS)
      });

      if (!response.ok) {
        storeWarn(`Redis request failed with HTTP ${response.status}`);
        return undefined;
      }

      return await response.json();
    } catch (error) {
      const name = (error as { name?: string } | null)?.name;
      storeWarn(name === "TimeoutError" ? `Redis request timed out after ${STORE_TIMEOUT_MS / 1000}s` : "Redis request failed");
      return undefined;
    }
  }

  async function command(args: Array<string | number>): Promise<unknown> {
    const data = (await request("", args)) as { result?: unknown; error?: string } | undefined;
    if (data?.error) storeWarn("Redis command returned an error");
    return data?.result;
  }

  async function pipeline(commands: Array<Array<string | number>>): Promise<unknown[]> {
    if (commands.length === 0) return [];
    const data = (await request("/pipeline", commands)) as Array<{ result?: unknown; error?: string }> | undefined;
    if (!Array.isArray(data)) return [];
    if (data.some((entry) => entry?.error)) storeWarn("Redis pipeline returned an error");
    return data.map((entry) => entry?.result);
  }

  return {
    kind: "redis",
    async getJson<T>(key: string) {
      return parseJson<T>(await command(["GET", KEY_PREFIX + key]));
    },
    async setJson(key, value) {
      await command(["SET", KEY_PREFIX + key, JSON.stringify(value)]);
    },
    async hashGetJson<T>(key: string, field: string) {
      return parseJson<T>(await command(["HGET", KEY_PREFIX + key, field]));
    },
    async hashGetManyJson<T>(key: string, fields: string[]) {
      if (fields.length === 0) return [];
      const result = await command(["HMGET", KEY_PREFIX + key, ...fields]);
      const values = Array.isArray(result) ? result : [];
      return fields.map((_, index) => parseJson<T>(values[index]));
    },
    async hashSetManyJson(key, entries, options = {}) {
      const fields = Object.keys(entries);
      if (fields.length === 0) return;

      const hashKey = KEY_PREFIX + key;
      const indexKey = `${hashKey}:index`;
      const now = Date.now();
      const hset: Array<string | number> = ["HSET", hashKey];
      // NX keeps the first-seen time, which is what retention trims by.
      const zadd: Array<string | number> = ["ZADD", indexKey, "NX"];

      for (const field of fields) {
        hset.push(field, JSON.stringify(entries[field]));
        zadd.push(now, field);
      }

      const results = await pipeline([hset, zadd, ["ZCARD", indexKey]]);
      const size = Number(results[2]);
      const maxEntries = options.maxEntries ?? 0;

      // Trim in batches so the hash cannot grow without bound.
      if (maxEntries > 0 && Number.isFinite(size) && size > maxEntries + 50) {
        const stale = await command(["ZRANGE", indexKey, 0, size - maxEntries - 1]);
        if (Array.isArray(stale) && stale.length > 0) {
          const staleFields = stale.map(String);
          await pipeline([["HDEL", hashKey, ...staleFields], ["ZREM", indexKey, ...staleFields]]);
        }
      }
    }
  };
}

function createMemoryStore(): DurableStore {
  const values = new Map<string, string>();
  const hashes = new Map<string, Map<string, string>>();

  const hash = (key: string) => {
    let entry = hashes.get(key);
    if (!entry) {
      entry = new Map();
      hashes.set(key, entry);
    }
    return entry;
  };

  return {
    kind: "memory",
    async getJson<T>(key: string) {
      return parseJson<T>(values.get(key));
    },
    async setJson(key, value) {
      values.set(key, JSON.stringify(value));
    },
    async hashGetJson<T>(key: string, field: string) {
      return parseJson<T>(hashes.get(key)?.get(field));
    },
    async hashGetManyJson<T>(key: string, fields: string[]) {
      const entry = hashes.get(key);
      return fields.map((field) => parseJson<T>(entry?.get(field)));
    },
    async hashSetManyJson(key, entries, options = {}) {
      const entry = hash(key);
      // Map.set on an existing key keeps its original insertion (first-seen) position.
      for (const [field, value] of Object.entries(entries)) entry.set(field, JSON.stringify(value));
      const maxEntries = options.maxEntries ?? 0;
      while (maxEntries > 0 && entry.size > maxEntries) {
        const oldest = entry.keys().next().value;
        if (oldest === undefined) break;
        entry.delete(oldest);
      }
    }
  };
}

let cachedStore: DurableStore | null = null;
let warnedMemory = false;

export function getDurableStore(): DurableStore {
  if (cachedStore) return cachedStore;

  const redis = resolveRedisConfig();

  if (redis) {
    cachedStore = createRedisStore(redis);
  } else {
    cachedStore = createMemoryStore();
    const isProduction = readEnv("VERCEL_ENV") === "production" || readEnv("NODE_ENV") === "production";
    if (isProduction && !warnedMemory) {
      warnedMemory = true;
      storeWarn(
        "KV_REST_API_URL/KV_REST_API_TOKEN are not configured; brief and gallery history is kept in memory only and old links cannot be resolved after a cold start."
      );
    }
  }

  return cachedStore;
}
