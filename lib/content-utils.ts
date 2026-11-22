// Shared, dependency-free helpers for the content pipelines (briefs and
// gallery). Everything here is deterministic so it can be unit tested with
// recorded fixtures and mocked network calls.

export const CONTENT_USER_AGENT = "Astroboat/1.0 (+https://www.astroboat.in)";

// ---------------------------------------------------------------------------
// Text
// ---------------------------------------------------------------------------

const NAMED_ENTITIES: Record<string, string> = {
  amp: "&",
  apos: "'",
  gt: ">",
  lt: "<",
  nbsp: " ",
  quot: '"',
  hellip: "…",
  mdash: "—",
  ndash: "–",
  lsquo: "‘",
  rsquo: "’",
  ldquo: "“",
  rdquo: "”",
  laquo: "«",
  raquo: "»",
  deg: "°",
  times: "×",
  minus: "−",
  copy: "©",
  reg: "®",
  trade: "™",
  eacute: "é",
  aacute: "á",
  iacute: "í",
  oacute: "ó",
  uacute: "ú",
  ntilde: "ñ",
  uuml: "ü",
  ouml: "ö",
  auml: "ä",
  ccedil: "ç",
  middot: "·",
  bull: "•",
  prime: "′",
  Prime: "″",
  thinsp: " ",
  ensp: " ",
  emsp: " ",
  zwj: "",
  zwnj: ""
};

function safeCodePoint(code: number): string {
  if (!Number.isFinite(code) || code < 0 || code > 0x10ffff) return "";
  try {
    return String.fromCodePoint(code);
  } catch {
    return "";
  }
}

/** Decodes numeric and common named HTML entities. Runs twice for double-encoded feeds. */
export function decodeEntities(value: string): string {
  const once = (input: string) =>
    input
      .replace(/&#x([0-9a-f]+);/gi, (_, code: string) => safeCodePoint(Number.parseInt(code, 16)))
      .replace(/&#(\d+);/g, (_, code: string) => safeCodePoint(Number.parseInt(code, 10)))
      .replace(/&([a-z]+);/gi, (entity, name: string) => NAMED_ENTITIES[name] ?? NAMED_ENTITIES[name.toLowerCase()] ?? entity);

  return once(once(value));
}

/** Removes markup while keeping paragraph and line breaks as sentence boundaries. */
export function stripHtml(value: string): string {
  return value
    .replace(/<!\[CDATA\[|\]\]>/g, " ")
    .replace(/<(script|style|noscript|figure|figcaption|iframe|video|audio|svg)\b[\s\S]*?<\/\1>/gi, " ")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|li|h[1-6]|blockquote|tr)>/gi, "\n")
    .replace(/<[^>]*>/g, " ")
    // A truncated tag at the end of a description ("<img src=... ") leaves junk.
    .replace(/<[^>]*$/g, " ");
}

export function normalizeWhitespace(value: string): string {
  return value
    .replace(/[​-‍﻿]/g, "")
    .replace(/ /g, " ")
    .replace(/[ \t\r\f\v]+/g, " ")
    .replace(/\s*\n\s*/g, "\n")
    .trim();
}

/** Decodes entities, strips markup, and normalizes whitespace to a single line. */
export function cleanInlineText(value: string): string {
  return normalizeWhitespace(stripHtml(decodeEntities(value)))
    .replace(/\s*\n\s*/g, " ")
    // Removing inline tags leaves "Team , SSI" and "( STScI )"; tidy that spacing.
    .replace(/\s+([,;:.!?)\]])/g, "$1")
    .replace(/([(\[])\s+/g, "$1")
    .trim();
}

const BOILERPLATE_PATTERNS: RegExp[] = [
  // WordPress feed footer: "The post X appeared first on NASA Science."
  /\bThe post\b[\s\S]{0,400}?\bappeared first on\b[^.\n]{0,120}\.?/gi,
  // Truncation markers: [...], […], [&hellip;], (more...)
  /\[\s*(?:…|\.\.\.|&hellip;|read more|more)\s*\]/gi,
  /\((?:more|read more)\s*(?:…|\.\.\.)?\)/gi,
  /\b(?:Continue reading|Read more|Read the full (?:story|article|release|post))\b[^.\n]*(?:\.|$)/gi,
  // Bilingual NASA release cross-links (not part of the story).
  /\bRead this (?:release|story|article) in (?:English|Spanish)(?: here)?\.?/gi,
  /\bLea esta (?:nota de prensa|noticia|historia|nota) en (?:español|inglés)(?: aquí)?\.?/gi,
  // Feed-embedded attribution fragments.
  /\b(?:Image |Photo |Video )?Credits?:\s*[^.\n]{1,160}(?:\.|$)/gi,
  /^\s*(?:Description|Abstract|Explanation|Summary)\s*:?\s*/i,
  // arXiv announcement prefix.
  /^arXiv:\S+\s+Announce Type:\s*\S+\s*(?:Abstract:\s*)?/i,
  // APOD navigation text that NASA's general feeds copy into descriptions.
  /\bToday[’']s APOD\b[\s\S]{0,200}?\bDiscuss\b/gi,
  /\bAPOD Science APOD\b[^\n]{0,120}/gi
];

const GENERIC_SENTENCES = [
  /^Discover the cosmos!?/i,
  /^Each day a different image or photograph of our fascinating universe is featured/i,
  /^Astronomy Picture of the Day$/i,
  /^(?:Share|Tweet|Email|Print)(?: this)?(?: page| story| article)?\.?$/i,
  /^(?:Return to Top|Back to top)\.?$/i,
  /^(?:Subscribe|Sign up)\b.*newsletter/i,
  /^(?:Advertisement|Sponsored)\b/i
];

function sentenceKey(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

const ABBREVIATION = /\b(Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec|Dr|Mr|Mrs|Ms|Prof|St|Mt|No|Nos|vs|approx|Fig|Figs|Eq|al|Inc|Ltd|Co|Corp|Jr|Sr|Gen|Lt|Col|Capt|Sgt|Adm|Gov|Sen|Rep|U\.S|U\.K|E\.U|a\.m|p\.m|i\.e|e\.g|ca)\.(?=\s)/g;
const DOT_PLACEHOLDER = "\u2024";

export function splitSentences(value: string): string[] {
  return value
    // Protect abbreviations ("Nov. 21", "U.S. Space Force", "Dr. Smith") from being treated as sentence ends.
    .replace(ABBREVIATION, (match) => match.replace(/\./g, DOT_PLACEHOLDER))
    .split(/(?<=[.!?…])["”’)]?\s+(?=["“‘(]?[A-Z])|\n+/)
    .map((sentence) => sentence.replace(/\u2024/g, ".").trim())
    .filter(Boolean);
}

export type SummaryResult = {
  text: string;
  quality: "good" | "thin" | "empty";
};

/**
 * Builds a readable summary strictly from publisher-supplied text. It removes
 * boilerplate and repeated sentences but never adds claims of its own.
 */
export function buildSummary(raw: string, options: { title?: string; maxLength?: number; maxSentences?: number } = {}): SummaryResult {
  const maxLength = options.maxLength ?? 360;
  const maxSentences = options.maxSentences ?? 3;
  let text = decodeEntities(raw);

  // Broken feed HTML sometimes leaks attribute text such as
  // 'Credit: NASA" width="1280" height="720" />' before the real description.
  const attributeLeak = text.lastIndexOf('" />');
  if (attributeLeak >= 0 && /\b(?:width|height|alt|src)=["']/.test(text.slice(0, attributeLeak))) {
    text = text.slice(attributeLeak + 4);
  }

  text = normalizeWhitespace(stripHtml(text));
  for (const pattern of BOILERPLATE_PATTERNS) text = text.replace(pattern, " ");
  text = normalizeWhitespace(text);

  const titleKey = options.title ? sentenceKey(options.title) : "";
  const seen = new Set<string>();
  const sentences: string[] = [];

  for (const sentence of splitSentences(text)) {
    const key = sentenceKey(sentence);
    const words = key.split(" ").filter(Boolean).length;

    if (!key || seen.has(key)) continue;
    if (titleKey && (key === titleKey || (words <= 14 && titleKey.startsWith(key)))) continue;
    if (GENERIC_SENTENCES.some((pattern) => pattern.test(sentence))) continue;
    if (words < 4) continue;

    seen.add(key);
    sentences.push(sentence.replace(/\s+/g, " "));
  }

  const complete = sentences.filter((sentence) => /[.!?]["”’)]?$/.test(sentence));
  // Prefer complete sentences. Fragments (headings, or text cut off by the
  // feed) are only used when nothing else exists, and are then marked with an ellipsis.
  const pool = complete.length > 0 ? complete : sentences;
  const chosen: string[] = [];

  for (const sentence of pool) {
    const next = [...chosen, sentence].join(" ");
    if (chosen.length >= maxSentences || (chosen.length > 0 && next.length > maxLength)) break;
    chosen.push(sentence);
  }

  let summary = chosen.join(" ").trim();

  if (summary.length > maxLength) {
    const clipped = summary.slice(0, maxLength - 1);
    const lastSpace = clipped.lastIndexOf(" ");
    summary = `${clipped.slice(0, lastSpace > maxLength / 2 ? lastSpace : clipped.length).replace(/[,;:\s]+$/, "")}…`;
  } else if (summary && complete.length === 0) {
    summary = `${summary.replace(/[,;:\s…]+$/, "")}…`;
  }

  const words = summary.split(/\s+/).filter(Boolean).length;

  if (!summary) return { text: "", quality: "empty" };
  return { text: summary, quality: words >= 12 && summary.length >= 70 ? "good" : "thin" };
}

export function slugify(value: string, maxLength = 70): string {
  const slug = value
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (slug.length <= maxLength) return slug;
  const clipped = slug.slice(0, maxLength);
  const lastDash = clipped.lastIndexOf("-");
  return (lastDash > maxLength / 2 ? clipped.slice(0, lastDash) : clipped).replace(/-+$/g, "");
}

const STOP_WORDS = new Set(
  "a an and are as at be by for from has have in into is it its of on or that the their this to was were will with new nasa nasas esa esas after over about".split(" ")
);

/** Significant lowercase tokens used for near-duplicate title matching. */
export function titleTokens(value: string): string[] {
  return value
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/['’]s\b/g, "")
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length > 1 && !STOP_WORDS.has(token));
}

export function tokenSimilarity(a: string[], b: string[]): number {
  if (a.length === 0 || b.length === 0) return 0;
  const setA = new Set(a);
  const setB = new Set(b);
  let shared = 0;
  for (const token of setA) if (setB.has(token)) shared += 1;
  return shared / (setA.size + setB.size - shared);
}

// ---------------------------------------------------------------------------
// Hashing
// ---------------------------------------------------------------------------

/** 53-bit non-cryptographic hash (cyrb53), returned in base 36. Stable across runtimes. */
export function stableHash(value: string, seed = 0): string {
  let h1 = 0xdeadbeef ^ seed;
  let h2 = 0x41c6ce57 ^ seed;

  for (let index = 0; index < value.length; index += 1) {
    const char = value.charCodeAt(index);
    h1 = Math.imul(h1 ^ char, 2654435761);
    h2 = Math.imul(h2 ^ char, 1597334677);
  }

  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);

  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36);
}

/** The 32-bit string hash used by earlier Astroboat releases. Kept only to resolve old slugs. */
export function legacyHash(value: string): string {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

// ---------------------------------------------------------------------------
// URLs
// ---------------------------------------------------------------------------

const TRACKING_PARAMS = new Set([
  "fbclid", "gclid", "dclid", "gbraid", "wbraid", "msclkid", "yclid", "twclid", "igshid", "mc_cid", "mc_eid",
  "_ga", "_gl", "_hsenc", "_hsmi", "hsctatracking", "mkt_tok", "oly_anon_id", "oly_enc_id", "rb_clickid",
  "s_cid", "cmpid", "cmp", "ocid", "ncid", "sr_share", "ref", "ref_src", "referrer", "source", "src",
  "trk", "trkcampaign", "spm", "vero_id", "wt.mc_id", "xtor", "at_medium", "at_campaign", "ito", "smid",
  "partner", "feed", "rss", "dicbo", "soc_src", "soc_trk", "amp"
]);

export function isTrackingParam(name: string): boolean {
  const key = name.toLowerCase();
  return key.startsWith("utm_") || key.startsWith("pk_") || key.startsWith("mtm_") || TRACKING_PARAMS.has(key);
}

/** Parses an absolute http(s) URL, rejecting credentials, odd ports and non-web schemes. */
export function parseWebUrl(value: string | undefined | null, base?: string): URL | null {
  if (!value || typeof value !== "string") return null;
  const trimmed = decodeEntities(value).trim();
  if (!trimmed || /^(?:javascript|data|vbscript|file|mailto|tel):/i.test(trimmed) || trimmed === "#") return null;

  try {
    const url = new URL(trimmed.startsWith("//") ? `https:${trimmed}` : trimmed, base);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    if (url.username || url.password) return null;
    if (url.port && url.port !== "80" && url.port !== "443") return null;
    if (!url.hostname.includes(".")) return null;
    return url;
  } catch {
    return null;
  }
}

/** Removes tracking parameters and fragments without otherwise changing the publisher URL. */
export function cleanPublisherUrl(value: string | undefined | null, base?: string): string {
  const url = parseWebUrl(value, base);
  if (!url) return "";
  url.hash = "";
  for (const name of [...url.searchParams.keys()]) {
    if (isTrackingParam(name)) url.searchParams.delete(name);
  }
  return url.toString();
}

/** Identity key for deduplication: scheme, www, trailing slash, AMP and tracking differences collapse. */
export function canonicalUrlKey(value: string | undefined | null): string {
  const url = parseWebUrl(value);
  if (!url) return "";

  const host = url.hostname.toLowerCase().replace(/^(?:www|m|amp)\./, "");
  let path = url.pathname.replace(/\/(?:amp|index\.html?)\/?$/i, "/").replace(/\/+$/, "");
  path = path.replace(/\/+/g, "/");
  const params = [...url.searchParams.entries()]
    .filter(([name]) => !isTrackingParam(name))
    .sort(([a], [b]) => a.localeCompare(b));
  const query = params.length > 0 ? `?${params.map(([key, val]) => `${key}=${val}`).join("&")}` : "";

  return `${host}${path.toLowerCase()}${query}`;
}

export function hostMatches(value: string, allowedSuffixes: readonly string[]): boolean {
  const url = parseWebUrl(value);
  if (!url) return false;
  const hostname = url.hostname.toLowerCase();
  return allowedSuffixes.some((suffix) => hostname === suffix || hostname.endsWith(`.${suffix}`));
}

// ---------------------------------------------------------------------------
// Network
// ---------------------------------------------------------------------------

export type CachedRequestInit = RequestInit & { next?: { revalidate?: number } };

export type FetchFailure = { ok: false; reason: string; status?: number; timedOut?: boolean };

export function describeFetchError(error: unknown, timeoutMs: number): FetchFailure {
  const failure = error as { name?: string; message?: string } | null;
  if (failure?.name === "TimeoutError" || failure?.name === "AbortError") {
    return { ok: false, reason: `request timed out after ${timeoutMs / 1000}s`, timedOut: true };
  }
  return { ok: false, reason: failure?.message ? `request failed (${failure.message.slice(0, 80)})` : "request failed" };
}

function delay(ms: number) {
  return new Promise<void>((resolve) => {
    if (typeof setTimeout === "function") setTimeout(resolve, ms);
    else resolve();
  });
}

function isRetryableStatus(status: number) {
  return status === 429 || status === 502 || status === 503 || status === 504;
}

/**
 * fetch with a timeout and one bounded retry for transient failures (network
 * errors, 429 and 5xx gateway responses). Timeouts are not retried: a slow
 * upstream should not double page-generation time.
 */
export async function fetchWithRetry(
  url: string,
  init: CachedRequestInit,
  options: { timeoutMs: number; retries?: number; backoffMs?: number }
): Promise<Response> {
  const retries = options.retries ?? 1;
  let attempt = 0;

  for (;;) {
    try {
      const response = await fetch(url, { ...init, signal: AbortSignal.timeout(options.timeoutMs) });
      if (attempt < retries && isRetryableStatus(response.status)) {
        const retryAfter = Number(response.headers?.get?.("retry-after"));
        await response.body?.cancel?.().catch(() => undefined);
        attempt += 1;
        await delay(Math.min(2000, Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter * 1000 : (options.backoffMs ?? 400) * attempt));
        continue;
      }
      return response;
    } catch (error) {
      const name = (error as { name?: string } | null)?.name;
      if (attempt >= retries || name === "TimeoutError" || name === "AbortError") throw error;
      attempt += 1;
      await delay((options.backoffMs ?? 400) * attempt);
    }
  }
}

/**
 * Fetches only from allow-listed public hosts. Redirects are followed
 * manually so every hop is re-checked against the allow list; IP literals,
 * internal hostnames and unusual ports can never match.
 */
export async function fetchFromTrustedHosts(
  initialUrl: string,
  allowedHostSuffixes: readonly string[],
  init: CachedRequestInit,
  options: { timeoutMs: number; maxRedirects?: number }
): Promise<Response | undefined> {
  const maxRedirects = options.maxRedirects ?? 3;
  let currentUrl = initialUrl;

  for (let redirectCount = 0; redirectCount <= maxRedirects; redirectCount += 1) {
    if (!hostMatches(currentUrl, allowedHostSuffixes)) return undefined;

    const response = await fetch(currentUrl, { ...init, redirect: "manual", signal: AbortSignal.timeout(options.timeoutMs) });

    if (response.status < 300 || response.status >= 400) return response;

    const location = response.headers.get("location");
    await response.body?.cancel?.().catch(() => undefined);
    if (!location || redirectCount === maxRedirects) return undefined;

    const next = parseWebUrl(location, currentUrl);
    if (!next) return undefined;
    currentUrl = next.toString();
  }

  return undefined;
}

export type ImageCheck = "verified" | "not-image" | "unreachable";

/** Confirms that a URL on an allow-listed host currently serves an image. */
export async function verifyRemoteImage(imageUrl: string, allowedHostSuffixes: readonly string[], timeoutMs = 4000): Promise<ImageCheck> {
  const headers = { Accept: "image/avif,image/webp,image/*,*/*;q=0.5", "User-Agent": CONTENT_USER_AGENT };

  try {
    // No `cache: "no-store"`: that would force every page using this check out of static generation.
    const head = await fetchFromTrustedHosts(imageUrl, allowedHostSuffixes, { method: "HEAD", headers }, { timeoutMs });
    if (!head) return "unreachable";
    const headType = (head.headers.get("content-type") ?? "").toLowerCase();
    if (head.ok && headType.startsWith("image/")) return "verified";
    if (head.ok && headType && !headType.startsWith("image/") && !headType.startsWith("application/octet-stream")) return "not-image";

    // Some CDNs reject HEAD or omit the content type; a one-byte ranged GET is a cheap confirmation.
    const get = await fetchFromTrustedHosts(imageUrl, allowedHostSuffixes, { headers: { ...headers, Range: "bytes=0-0" }, next: { revalidate: 86400 } }, { timeoutMs });
    const getType = (get?.headers.get("content-type") ?? "").toLowerCase();
    const ok = Boolean(get && (get.ok || get.status === 206));
    await get?.body?.cancel?.().catch(() => undefined);
    if (ok && getType.startsWith("image/")) return "verified";
    return ok ? "not-image" : "unreachable";
  } catch {
    return "unreachable";
  }
}

export async function mapWithConcurrency<T, R>(items: T[], limit: number, mapper: (item: T, index: number) => Promise<R>): Promise<R[]> {
  const results = new Array<R>(items.length);
  let nextIndex = 0;
  const workerCount = Math.min(Math.max(1, limit), items.length);

  await Promise.all(
    Array.from({ length: workerCount }, async () => {
      while (nextIndex < items.length) {
        const currentIndex = nextIndex;
        nextIndex += 1;
        results[currentIndex] = await mapper(items[currentIndex], currentIndex);
      }
    })
  );

  return results;
}

export function htmlAttribute(tag: string, attribute: string): string {
  const match = tag.match(new RegExp(`\\b${attribute}\\s*=\\s*(["'])([\\s\\S]*?)\\1`, "i"));
  return decodeEntities(match?.[2] ?? "");
}

/** Reads <meta> values (og:, twitter:, name=) from an HTML document head. */
export function readMetaTags(html: string): Record<string, string> {
  const result: Record<string, string> = {};
  const head = html.slice(0, 200_000);
  for (const match of head.matchAll(/<meta\b[^>]*>/gi)) {
    const tag = match[0];
    const key = (htmlAttribute(tag, "property") || htmlAttribute(tag, "name")).toLowerCase();
    const content = htmlAttribute(tag, "content");
    if (key && content && !(key in result)) result[key] = content;
  }
  return result;
}

// ---------------------------------------------------------------------------
// Logging
// ---------------------------------------------------------------------------

/** Operational log line. Never pass secrets, tokens, or request bodies. */
export function logInfo(message: string): void {
  const sink = typeof console !== "undefined" ? (console as { info?: (message: string) => void }).info : undefined;
  if (typeof sink === "function") sink.call(console, message);
}
