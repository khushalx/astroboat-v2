import { XMLParser } from "fast-xml-parser";
import { BRIEFS_REVALIDATE_SECONDS, FINAL_BRIEFS_LIMIT, MAX_BRIEFS_PER_SOURCE } from "@/lib/constants";
import { briefs as mockBriefs } from "@/lib/mock-data";
import type { AstronomyBrief, BriefSourceStatus, BriefsResult, SourceInfo } from "@/lib/types";

type BriefSourceConfig = {
  id: string;
  name: string;
  type: "rss" | "atom" | "api";
  url: string;
  enabled: boolean;
  categoryHint?: string;
  maxItems?: number;
  source: SourceInfo;
};

type ParsedFeedItem = Record<string, unknown>;

type SourceFetchResult = {
  config: BriefSourceConfig;
  briefs: AstronomyBrief[];
  status: BriefSourceStatus;
};

export const BRIEF_SOURCE_CONFIGS: BriefSourceConfig[] = [
  {
    id: "nasa-news",
    name: "NASA",
    type: "rss",
    url: "https://www.nasa.gov/news-release/feed/",
    enabled: true,
    categoryHint: "Missions",
    source: { id: "nasa", name: "NASA", kind: "agency", credibility: "Primary" }
  },
  {
    id: "nasa-science",
    name: "NASA Science",
    type: "rss",
    url: "https://science.nasa.gov/feed/",
    enabled: true,
    categoryHint: "Astrophysics",
    source: { id: "nasa-science", name: "NASA", kind: "agency", credibility: "Primary" }
  },
  {
    id: "nasa-artemis",
    name: "NASA Artemis",
    type: "rss",
    url: "https://www.nasa.gov/missions/artemis/feed/",
    enabled: true,
    categoryHint: "Missions",
    source: { id: "nasa-artemis", name: "NASA", kind: "agency", credibility: "Primary" }
  },
  {
    id: "esa-space-science",
    name: "ESA Space Science",
    type: "rss",
    url: "https://www.esa.int/rssfeed/Science_Exploration/Space_Science",
    enabled: true,
    categoryHint: "Astrophysics",
    source: { id: "esa-space-science", name: "ESA", kind: "agency", credibility: "Primary" }
  },
  {
    id: "esa-exploration",
    name: "ESA Exploration",
    type: "rss",
    url: "https://www.esa.int/rssfeed/Science_Exploration/Human_and_Robotic_Exploration",
    enabled: true,
    categoryHint: "Missions",
    source: { id: "esa-exploration", name: "ESA", kind: "agency", credibility: "Primary" }
  },
  {
    id: "arxiv-astro-ph",
    name: "arXiv astro-ph",
    type: "rss",
    url: "https://export.arxiv.org/rss/astro-ph",
    enabled: true,
    categoryHint: "Research",
    maxItems: 15,
    source: { id: "arxiv", name: "arXiv", kind: "research", credibility: "Preprint" }
  },
  {
    id: "apod",
    name: "NASA APOD",
    type: "rss",
    url: "https://apod.nasa.gov/apod.rss",
    enabled: true,
    categoryHint: "Skywatching",
    maxItems: 10,
    source: { id: "apod", name: "APOD", kind: "archive", credibility: "Primary" }
  },
  {
    id: "space-com",
    name: "Space.com",
    type: "rss",
    url: "https://www.space.com/feeds.xml",
    enabled: true,
    categoryHint: "Space News",
    maxItems: 12,
    source: { id: "space-com", name: "Space.com", kind: "platform", credibility: "Editorial" }
  },
  {
    id: "universe-today",
    name: "Universe Today",
    type: "rss",
    url: "https://www.universetoday.com/rss.xml",
    enabled: true,
    categoryHint: "Space News",
    maxItems: 12,
    source: { id: "universe-today", name: "Universe Today", kind: "platform", credibility: "Editorial" }
  }
];

const xmlParser = new XMLParser({
  attributeNamePrefix: "@_",
  cdataPropName: "#cdata",
  ignoreAttributes: false,
  processEntities: true,
  trimValues: true
});

export async function getAstronomyBriefs(): Promise<BriefsResult> {
  const lastChecked = new Date().toISOString();
  const enabledSources = BRIEF_SOURCE_CONFIGS.filter((source) => source.enabled);
  const sourceResults = await Promise.all(enabledSources.map(fetchBriefSource));
  const liveBriefs = dedupeBriefs(sourceResults.flatMap((result) => result.briefs))
    .sort(sortBriefsByDateDesc)
    .slice(0, FINAL_BRIEFS_LIMIT);
  const sourceStatuses = sourceResults.map((result) => result.status);
  const failedSources = sourceStatuses.filter((status) => !status.ok);

  if (liveBriefs.length === 0) {
    console.warn("Brief sources unavailable. Falling back to Astroboat sample briefs.");

    return {
      briefs: markFallbackBriefs(mockBriefs),
      sourceStatuses,
      lastChecked,
      latestItemDate: latestPublishedDate(mockBriefs),
      isFallback: true,
      warnings: ["Live brief sources are temporarily unavailable. Showing saved Astroboat sample briefs."]
    };
  }

  return {
    briefs: liveBriefs,
    sourceStatuses,
    lastChecked,
    latestItemDate: latestPublishedDate(liveBriefs),
    isFallback: false,
    warnings: failedSources.length > 0 ? ["Some sources could not be loaded. Showing available briefs."] : []
  };
}

export async function getLatestBriefs(limit?: number): Promise<AstronomyBrief[]> {
  const result = await getAstronomyBriefs();

  return typeof limit === "number" ? result.briefs.slice(0, limit) : result.briefs;
}

export async function getBriefBySlug(slug: string): Promise<AstronomyBrief | undefined> {
  const result = await getAstronomyBriefs();

  return result.briefs.find((brief) => brief.slug === slug) ?? mockBriefs.find((brief) => brief.slug === slug);
}

async function fetchBriefSource(config: BriefSourceConfig): Promise<SourceFetchResult> {
  try {
    const response = await fetch(config.url, {
      headers: {
        Accept: "application/rss+xml, application/atom+xml, application/xml, text/xml;q=0.9, */*;q=0.5",
        "User-Agent": "Astroboat/1.0 (+https://astroboat.in)"
      },
      next: { revalidate: BRIEFS_REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(10000)
    });

    if (!response.ok) {
      console.warn(`Brief source failed: ${config.name} (${response.status})`);

      return emptySourceResult(config, `HTTP ${response.status}`);
    }

    const xml = await response.text();

    if (/Just a moment|cf-chl|challenge-platform/i.test(xml)) {
      console.warn(`Brief source blocked by challenge page: ${config.name}`);

      return emptySourceResult(config, "Blocked");
    }

    const parsed = xmlParser.parse(xml);
    const items = extractFeedItems(parsed).slice(0, config.maxItems ?? MAX_BRIEFS_PER_SOURCE);
    const mapped = items
      .map((item, index) => mapFeedItemToBrief(item, config, index))
      .filter((brief): brief is AstronomyBrief => Boolean(brief));

    return {
      config,
      briefs: mapped,
      status: {
        id: config.id,
        name: config.name,
        enabled: config.enabled,
        count: mapped.length,
        ok: true
      }
    };
  } catch (error) {
    console.warn(`Brief source errored: ${config.name}`);

    return emptySourceResult(config, error instanceof Error ? error.message : "Unknown error");
  }
}

function emptySourceResult(config: BriefSourceConfig, error: string): SourceFetchResult {
  return {
    config,
    briefs: [],
    status: {
      id: config.id,
      name: config.name,
      enabled: config.enabled,
      count: 0,
      ok: false,
      error
    }
  };
}

function extractFeedItems(parsed: unknown): ParsedFeedItem[] {
  if (!isRecord(parsed)) {
    return [];
  }

  const rss = parsed.rss;
  const feed = parsed.feed;

  if (isRecord(rss) && isRecord(rss.channel)) {
    return asArray(rss.channel.item).filter(isRecord);
  }

  if (isRecord(feed)) {
    return asArray(feed.entry).filter(isRecord);
  }

  return [];
}

function mapFeedItemToBrief(item: ParsedFeedItem, config: BriefSourceConfig, index: number): AstronomyBrief | null {
  const originalUrl = normalizeLink(item);
  const inferredDate = inferPublishedDateFromFeedItem(item, originalUrl);
  const title = createFeedItemTitle(item, config, inferredDate);
  const publishedAt =
    normalizeDate(textValue(item.pubDate) || textValue(item.published) || textValue(item.updated) || textValue(item["dc:date"])) ||
    inferredDate;
  const cleanedSummary = cleanText(textValue(item.description) || textValue(item.summary) || textValue(item.subtitle));
  const rawSummary =
    cleanedSummary ||
    (config.id === "apod"
      ? "NASA Astronomy Picture of the Day features a curated sky image from the APOD archive."
      : "Read the original source for the complete update.");

  if (!title || !originalUrl) {
    return null;
  }

  const summary = createSummaryLines(rawSummary);
  const tags = createTags(item, title, rawSummary, config);
  const category = inferCategory(tags, title, rawSummary, config.categoryHint);
  const idBase = `${config.id}-${index}-${hashString(`${title}-${originalUrl}`)}`;

  return {
    id: idBase,
    slug: createBriefSlug(title, idBase),
    source: config.source,
    originalUrl,
    title,
    summary,
    why: createWhyItMatters(category, config.source.name),
    tags,
    readingTime: estimateReadingTime(rawSummary),
    publishedAt,
    category,
    imageUrl: extractImageUrlFromFeedItem(item, {
      baseUrl: originalUrl || config.url,
      sourceId: config.id
    })
  };
}

function normalizeLink(item: ParsedFeedItem) {
  const link = item.link;

  if (typeof link === "string") {
    return sanitizeUrl(link);
  }

  const linkArray = asArray(link);
  for (const entry of linkArray) {
    if (isRecord(entry)) {
      const rel = textValue(entry["@_rel"]);
      const href = textValue(entry["@_href"]);

      if (href && (!rel || rel === "alternate")) {
        return sanitizeUrl(href);
      }
    }
  }

  return sanitizeUrl(textValue(item.guid) || textValue(item.id));
}

function extractImageUrlFromFeedItem(
  item: ParsedFeedItem,
  context: { baseUrl?: string; sourceId?: string } = {}
): string | undefined {
  const mediaType = textValue(item.media_type || item.mediaType).toLowerCase();
  const candidates = [
    textValue(item.hdurl),
    ...urlCandidatesFromField(item.enclosure),
    ...urlCandidatesFromField(item["media:content"]),
    ...urlCandidatesFromField(item["media:thumbnail"]),
    ...urlCandidatesFromField(item.image),
    ...urlCandidatesFromField(item.thumbnail),
    ...urlCandidatesFromField(item["itunes:image"]),
    ...[
      textValue(item.description),
      textValue(item.summary),
      textValue(item["content:encoded"]),
      textValue(item.content),
      textValue(item.encoded)
    ].flatMap(urlCandidatesFromHtml),
    textValue(item.url)
  ];

  for (const candidate of candidates) {
    const url = sanitizeImageUrl(candidate, context.baseUrl ?? "");

    if (!url) {
      continue;
    }

    if (context.sourceId === "apod" && mediaType && mediaType !== "image") {
      continue;
    }

    if (context.sourceId === "apod" && !mediaType && !isLikelyImageUrl(url)) {
      continue;
    }

    return url;
  }

  return undefined;
}

function urlCandidatesFromField(value: unknown): string[] {
  return asArray(value).flatMap(urlCandidatesFromRecordLike);
}

function urlCandidatesFromRecordLike(entry: unknown): string[] {
  if (typeof entry === "string") {
    return [entry];
  }

  if (!isRecord(entry)) {
    return [];
  }

  const medium = textValue(entry["@_medium"]).toLowerCase();
  const mimeType = textValue(entry["@_type"]) || textValue(entry.type);
  const isVideo = medium === "video" || /^video\//i.test(mimeType);
  const direct = isVideo
    ? []
    : [textValue(entry["@_url"]), textValue(entry.url), textValue(entry["@_href"]), textValue(entry.href)].filter(Boolean);
  const nested = [
    ...urlCandidatesFromField(entry["media:thumbnail"]),
    ...urlCandidatesFromField(entry.thumbnail),
    ...urlCandidatesFromField(entry.image),
    ...urlCandidatesFromField(entry["media:content"])
  ];

  return [...direct, ...nested];
}

function urlCandidatesFromHtml(value: string) {
  const directMatches = [
    ...value.matchAll(/<img[^>]+(?:src|data-src|data-lazy-src|data-original)=["']([^"']+)["']/gi)
  ].map((match) => decodeEntities(match[1] ?? ""));
  const srcSetMatches = [...value.matchAll(/<img[^>]+srcset=["']([^"']+)["']/gi)].flatMap((match) =>
    parseSrcSet(decodeEntities(match[1] ?? ""))
  );

  return [...directMatches, ...srcSetMatches];
}

function sanitizeImageUrl(value: string, baseUrl: string) {
  const decoded = decodeEntities(value).trim();
  const resolved = resolveImageUrl(decoded, baseUrl);
  const url = sanitizeUrl(resolved);

  if (!url || /\.(mp4|m4v|mov|webm)(\?|#|$)/i.test(url) || /(?:youtube\.com|youtu\.be|vimeo\.com)/i.test(url)) {
    return "";
  }

  return url;
}

function parseSrcSet(value: string) {
  return value
    .split(",")
    .map((part) => part.trim().split(/\s+/)[0] ?? "")
    .filter(Boolean);
}

function createFeedItemTitle(item: ParsedFeedItem, config: BriefSourceConfig, inferredDate: string) {
  const title = cleanText(textValue(item.title));

  if (title) {
    return title;
  }

  if (config.id === "apod") {
    const dateLabel = inferredDate ? formatDateForTitle(inferredDate) : "";

    return dateLabel ? `Astronomy Picture of the Day: ${dateLabel}` : "Astronomy Picture of the Day";
  }

  return "";
}

function inferPublishedDateFromFeedItem(item: ParsedFeedItem, originalUrl: string) {
  const combined = `${originalUrl} ${textValue(item.description)} ${textValue(item["content:encoded"])}`;
  const match = combined.match(/(?:ap|S_)(\d{2})(\d{2})(\d{2})/i);

  if (!match) {
    return "";
  }

  const year = 2000 + Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  if (!isValidDateParts(year, month, day)) {
    return "";
  }

  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function formatDateForTitle(value: string) {
  const date = new Date(`${value}T00:00:00Z`);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(date);
}

function isValidDateParts(year: number, month: number, day: number) {
  const date = new Date(Date.UTC(year, month - 1, day));

  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

function isLikelyImageUrl(value: string) {
  return /\.(avif|gif|jpe?g|png|webp)(\?|#|$)/i.test(value);
}

function resolveImageUrl(value: string, baseUrl: string) {
  if (!value) {
    return "";
  }

  if (value.startsWith("//")) {
    return `https:${value}`;
  }

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  try {
    return new URL(value, baseUrl).toString();
  } catch {
    return value;
  }
}

function createSummaryLines(value: string) {
  const withoutArxivPrefix = value
    .replace(/^arXiv:\S+\s+Announce Type:\s+\w+\s+/i, "")
    .replace(/^Abstract:\s*/i, "");
  const sentences = sentenceSplit(withoutArxivPrefix).slice(0, 2);
  const summary = sentences.length > 0 ? sentences.join(" ") : withoutArxivPrefix;
  const compact = truncateText(summary, 360);

  return compact ? [compact] : ["Open the original source for the complete update."];
}

function createTags(item: ParsedFeedItem, title: string, summary: string, config: BriefSourceConfig) {
  const rawCategories = asArray(item.category)
    .flatMap((category) => {
      if (typeof category === "string") return [category];
      if (isRecord(category)) return [textValue(category["#text"]) || textValue(category["@_term"]) || textValue(category["@_label"])];
      return [];
    })
    .filter(Boolean);
  const inferred = inferTags(`${title} ${summary}`);
  const tags = [config.categoryHint, ...rawCategories, ...inferred]
    .filter((tag): tag is string => Boolean(tag))
    .map(normalizeTag)
    .filter(Boolean);

  return Array.from(new Set(tags)).slice(0, 5);
}

function inferTags(text: string) {
  const rules: Array<[RegExp, string]> = [
    [/webb|jwst/i, "Webb"],
    [/hubble/i, "Hubble"],
    [/artemis|moon|lunar/i, "Moon"],
    [/mars|jupiter|saturn|venus|planet/i, "Planetary Science"],
    [/asteroid|comet|near-earth|neo/i, "Asteroids"],
    [/solar|sun|coronal|space weather/i, "Solar / Space Weather"],
    [/galaxy|cosmology|dark matter|black hole/i, "Astrophysics"],
    [/launch|mission|spacecraft|crew/i, "Missions"],
    [/meteor|skywatch|eclipse|aurora/i, "Skywatching"],
    [/research|survey|spectroscopy|arxiv|paper/i, "Research"]
  ];

  return rules.filter(([pattern]) => pattern.test(text)).map(([, tag]) => tag);
}

function inferCategory(tags: string[], title: string, summary: string, fallback = "Space News") {
  const combined = `${tags.join(" ")} ${title} ${summary}`;

  if (/arxiv|research|survey|spectroscopy|paper/i.test(combined)) return "Research";
  if (/solar|sun|space weather|coronal/i.test(combined)) return "Solar / Space Weather";
  if (/moon|mars|jupiter|saturn|planet|asteroid|comet/i.test(combined)) return "Planetary Science";
  if (/launch|mission|artemis|spacecraft|crew/i.test(combined)) return "Missions";
  if (/meteor|eclipse|aurora|skywatch/i.test(combined)) return "Skywatching";
  if (/galaxy|cosmology|black hole|dark matter|star/i.test(combined)) return "Astrophysics";

  return fallback;
}

function createWhyItMatters(category: string, sourceName: string) {
  const categoryText: Record<string, string> = {
    Research: "This research update helps connect current astronomy papers with the questions scientists are actively testing.",
    Missions: "Mission updates show how spacecraft, instruments, and operations move space science from plans to results.",
    "Planetary Science": "Planetary science updates help explain how worlds, small bodies, and Solar System environments change over time.",
    "Solar / Space Weather": "Space-weather updates are useful for understanding solar activity without turning it into alarm.",
    Skywatching: "Skywatching updates help readers connect astronomy news with what can be observed or understood from Earth.",
    Astrophysics: "Astrophysics updates show how observations refine our picture of stars, galaxies, and the wider universe."
  };

  return categoryText[category] ?? `This ${sourceName} update adds useful context to the active astronomy feed.`;
}

function dedupeBriefs(items: AstronomyBrief[]) {
  const seenUrls = new Set<string>();
  const seenTitles = new Set<string>();
  const result: AstronomyBrief[] = [];

  for (const item of items) {
    const urlKey = normalizeUrlKey(item.originalUrl);
    const titleKey = normalizeTitleKey(item.title);

    if ((urlKey && seenUrls.has(urlKey)) || (titleKey && seenTitles.has(titleKey))) {
      continue;
    }

    if (urlKey) seenUrls.add(urlKey);
    if (titleKey) seenTitles.add(titleKey);
    result.push(item);
  }

  return result;
}

function sortBriefsByDateDesc(a: AstronomyBrief, b: AstronomyBrief) {
  return dateScore(b.publishedAt) - dateScore(a.publishedAt);
}

function latestPublishedDate(items: AstronomyBrief[]) {
  const latest = items.map((item) => item.publishedAt).sort((a, b) => dateScore(b) - dateScore(a))[0];

  return latest && dateScore(latest) > 0 ? latest : undefined;
}

function markFallbackBriefs(items: AstronomyBrief[]) {
  return items.map((brief) => ({
    ...brief,
    originalUrl: brief.originalUrl === "#" ? "" : brief.originalUrl,
    isFallback: true
  }));
}

function normalizeDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString().slice(0, 10);
}

function estimateReadingTime(text: string) {
  const words = text.split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.min(8, Math.ceil(words / 220)));

  return `${minutes} min`;
}

function cleanText(value: string) {
  return decodeEntities(stripHtml(value))
    .replace(/\s+/g, " ")
    .replace(/\[[^\]]*…?\]/g, "")
    .trim();
}

function stripHtml(value: string) {
  return value
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ");
}

function decodeEntities(value: string) {
  const named: Record<string, string> = {
    amp: "&",
    apos: "'",
    hellip: "...",
    ldquo: "\"",
    lsquo: "'",
    nbsp: " ",
    quot: "\"",
    rdquo: "\"",
    rsquo: "'"
  };

  return value
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCharCode(parseInt(code, 16)))
    .replace(/&([a-z]+);/gi, (match, name) => named[name.toLowerCase()] ?? match);
}

function sentenceSplit(value: string) {
  return value
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

function truncateText(value: string, maxLength: number) {
  if (value.length <= maxLength) {
    return value;
  }

  const clipped = value.slice(0, maxLength - 1);
  const lastSpace = clipped.lastIndexOf(" ");

  return `${clipped.slice(0, lastSpace > 180 ? lastSpace : clipped.length).trim()}...`;
}

function createBriefSlug(title: string, id: string) {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);

  return `${base || "brief"}-${hashString(id).slice(0, 6)}`;
}

function hashString(value: string) {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }

  return Math.abs(hash).toString(36);
}

function normalizeTag(value: string) {
  return cleanText(value)
    .replace(/^astro-ph\./i, "Astrophysics ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 32);
}

function normalizeUrlKey(value: string) {
  try {
    const url = new URL(value);
    url.hash = "";
    ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"].forEach((param) => url.searchParams.delete(param));

    return url.toString().replace(/\/$/, "").toLowerCase();
  } catch {
    return value.trim().toLowerCase();
  }
}

function normalizeTitleKey(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function sanitizeUrl(value: string) {
  const trimmed = value.trim();

  return /^https?:\/\//i.test(trimmed) ? trimmed : "";
}

function dateScore(value: string) {
  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
}

function textValue(value: unknown): string {
  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }

  if (Array.isArray(value)) {
    return value.map(textValue).find(Boolean) ?? "";
  }

  if (isRecord(value)) {
    return textValue(value["#text"]) || textValue(value["#cdata"]) || textValue(value["@_href"]) || textValue(value["@_term"]);
  }

  return "";
}

function firstRecord(value: unknown) {
  return asArray(value).find(isRecord);
}

function asArray(value: unknown): unknown[] {
  if (Array.isArray(value)) {
    return value;
  }

  return typeof value === "undefined" || value === null ? [] : [value];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
