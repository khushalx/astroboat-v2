// Shared test harness: transpiles TypeScript modules on the fly and runs them
// in an isolated VM context with injectable globals (fetch, process, console),
// so every test controls the network deterministically.
const { readFileSync } = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");

const root = path.resolve(__dirname, "../..");

function loadModule(file, overrides = {}) {
  const cache = new Map();
  const context = vm.createContext({
    Date, URL, URLSearchParams, Intl, Number, Math, JSON, AbortSignal, AbortController, Response, Headers,
    setTimeout: (fn) => setImmediate(fn), clearTimeout: () => undefined,
    console: { info() {}, warn() {}, error() {}, log() {} },
    process: { env: {} },
    ...overrides
  });

  function load(relative) {
    if (cache.has(relative)) return cache.get(relative);
    const exports = {};
    cache.set(relative, exports);
    const source = readFileSync(path.join(root, relative), "utf8");
    const output = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX } }).outputText;
    const wrapper = vm.runInContext(`(function (exports, require) {${output}\n})`, context, { filename: relative });
    wrapper(exports, (id) => {
      if (id === "fast-xml-parser" || id === "react") return require(id);
      if (id.startsWith("@/")) {
        const base = id.slice(2);
        for (const candidate of [`${base}.ts`, `${base}.tsx`]) {
          try {
            readFileSync(path.join(root, candidate));
            return load(candidate);
          } catch {
            // try next extension
          }
        }
      }
      throw new Error(`Unexpected dependency: ${id}`);
    });
    return exports;
  }

  return load(file);
}

function fixture(...parts) {
  return readFileSync(path.join(root, "tests", "fixtures", ...parts), "utf8");
}

/** Minimal in-memory implementation of the Upstash/Vercel KV REST protocol. */
function createFakeRedis(baseUrl = "https://kv.example.test") {
  const strings = new Map();
  const hashes = new Map();
  const zsets = new Map();
  let requests = 0;

  const hash = (key) => hashes.get(key) ?? hashes.set(key, new Map()).get(key);
  const zset = (key) => zsets.get(key) ?? zsets.set(key, new Map()).get(key);

  function run([command, key, ...args]) {
    switch (String(command).toUpperCase()) {
      case "GET": return strings.get(key) ?? null;
      case "SET": strings.set(key, args[0]); return "OK";
      case "HGET": return hash(key).get(args[0]) ?? null;
      case "HMGET": return args.map((field) => hash(key).get(field) ?? null);
      case "HSET": { let added = 0; for (let i = 0; i < args.length; i += 2) { if (!hash(key).has(args[i])) added += 1; hash(key).set(args[i], args[i + 1]); } return added; }
      case "HDEL": { let removed = 0; for (const field of args) if (hash(key).delete(field)) removed += 1; return removed; }
      case "ZADD": { const nx = args[0] === "NX"; const rest = nx ? args.slice(1) : args; for (let i = 0; i < rest.length; i += 2) { if (nx && zset(key).has(rest[i + 1])) continue; zset(key).set(rest[i + 1], Number(rest[i])); } return 1; }
      case "ZCARD": return zset(key).size;
      case "ZRANGE": { const sorted = [...zset(key).entries()].sort((a, b) => a[1] - b[1]).map(([member]) => member); return sorted.slice(Number(args[0]), Number(args[1]) + 1); }
      case "ZREM": { for (const member of args) zset(key).delete(member); return args.length; }
      default: throw new Error(`Unsupported command ${command}`);
    }
  }

  async function handle(url, init) {
    requests += 1;
    if (init?.headers?.Authorization !== "Bearer test-token") return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401 });
    const body = JSON.parse(init.body);
    if (url.endsWith("/pipeline")) return new Response(JSON.stringify(body.map((cmd) => ({ result: run(cmd) }))), { status: 200 });
    return new Response(JSON.stringify({ result: run(body) }), { status: 200 });
  }

  return {
    env: { KV_REST_API_URL: baseUrl, KV_REST_API_TOKEN: "test-token" },
    owns: (url) => String(url).startsWith(baseUrl),
    handle,
    get requests() { return requests; },
    hash: (key) => hashes.get(`astroboat:v1:${key}`) ?? new Map()
  };
}

/** Route-table fetch mock. Handlers receive (url, init) and return a Response or a plain object. */
function routeFetch(routes, { redis, onUnmatched } = {}) {
  const calls = [];
  const fetch = async (input, init = {}) => {
    const url = String(input);
    calls.push({ url, method: init.method ?? "GET" });
    if (redis?.owns(url)) return redis.handle(url, init);
    for (const [match, handler] of routes) {
      if (typeof match === "string" ? url.startsWith(match) : match.test(url)) {
        const result = await handler(url, init);
        return result instanceof Response ? result : new Response(result.body ?? "", { status: result.status ?? 200, headers: result.headers ?? {} });
      }
    }
    if (onUnmatched) return onUnmatched(url, init);
    return new Response("not found", { status: 404, headers: { "content-type": "text/plain" } });
  };
  fetch.calls = calls;
  return fetch;
}

module.exports = { loadModule, fixture, createFakeRedis, routeFetch, root };
