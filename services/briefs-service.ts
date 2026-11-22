import { XMLParser } from "fast-xml-parser";
import { BRIEFS_REVALIDATE_SECONDS, FINAL_BRIEFS_LIMIT, MAX_BRIEFS_PER_SOURCE, NASA_APOD_FEED_URL } from "@/lib/constants";
import { briefs as mockBriefs } from "@/lib/mock-data";
import { assessBrief, classifyBrief, inferBriefTags, ACCEPT_THRESHOLD, type EditorialAssessment } from "@/lib/brief-editorial";
import { clusterCandidates } from "@/lib/brief-dedupe";
import {
  buildSummary,
  canonicalUrlKey,
  cleanInlineText,
  cleanPublisherUrl,
  CONTENT_USER_AGENT,
  decodeEntities,
  describeFetchError,
  fetchFromTrustedHosts,
  fetchWithRetry,
  hostMatches,
  legacyHash,
  logInfo,
  mapWithConcurrency,
  parseWebUrl,
  readMetaTags,
  slugify,
  stableHash,
  verifyRemoteImage,
  type SummaryResult
} from "@/lib/content-utils";
import { getDurableStore } from "@/lib/durable-store";
import type { AstronomyBrief, BriefSourceStatus, BriefsResult, SourceInfo } from "@/lib/types";

type BriefSourceConfig = {
  id: string;
  name: string;
  type: "rss" | "atom";
  url: string;
  enabled: boolean;
  categoryHint?: string;
  maxItems?: number;
  source: SourceInfo;
  /** Hosts allowed for the original article link. Anything else is rejected as unverifiable attribution. */
  publisherHosts: string[];
  /** Hosts allowed for article images. */
  imageHosts: string[];
  /** Whether thin items may be completed from the publisher's own article metadata. */
  enrichFromArticle: boolean;
};

type ParsedFeedItem = Record<string, unknown>;

type Candidate = {
  brief: AstronomyBrief;
  assessment: EditorialAssessment;
  urls: string[];
  aliases: string[];
  language: "en" | "es" | "other";
  summaryQuality: SummaryResult["quality"];
};

type RejectedSample = { source: string; title: string; score: number; reasons: string[] };

type SourceReport = {
  id: string;
  ok: boolean;
  error?: string;
  httpStatus?: number;
  fetched: number;
  accepted: number;
  rejectedEditorial: number;
  rejectedSummary: number;
  invalidLinks: number;
  enrichedFromArticle: number;
  articleGone: number;
  durationMs: number;
};

type SourceFetchResult = {
  config: BriefSourceConfig;
  candidates: Candidate[];
  status: BriefSourceStatus;
  report: SourceReport;
  rejected: RejectedSample[];
};

export const BRIEF_SOURCE_CONFIGS: BriefSourceConfig[] = [
  {
    id: "nasa-news",
    name: "NASA",
    type: "rss",
    url: "https://www.nasa.gov/news-release/feed/",
    enabled: true,
    categoryHint: "Missions",
    source: { id: "nasa", name: "NASA", kind: "agency", credibility: "Primary" },
    publisherHosts: ["nasa.gov"],
    imageHosts: ["nasa.gov"],
    enrichFromArticle: true
  },
  {
    id: "nasa-science",
    name: "NASA Science",
    type: "rss",
    url: "https://science.nasa.gov/feed/",
    enabled: true,
    categoryHint: "Astrophysics",
    source: { id: "nasa-science", name: "NASA", kind: "agency", credibility: "Primary" },
    publisherHosts: ["nasa.gov"],
    imageHosts: ["nasa.gov"],
    enrichFromArticle: true
  },
  {
    id: "nasa-artemis",
    name: "NASA Artemis",
    type: "rss",
    url: "https://www.nasa.gov/missions/artemis/feed/",
    enabled: true,
    categoryHint: "Missions",
    source: { id: "nasa-artemis", name: "NASA", kind: "agency", credibility: "Primary" },
    publisherHosts: ["nasa.gov"],
    imageHosts: ["nasa.gov"],
    enrichFromArticle: true
  },
  {
    id: "esa-space-science",
    name: "ESA Space Science",
    type: "rss",
    url: "https://www.esa.int/rss/science.rss",
    enabled: true,
    categoryHint: "Astrophysics",
    source: { id: "esa-space-science", name: "ESA", kind: "agency", credibility: "Primary" },
    publisherHosts: ["esa.int"],
    imageHosts: ["esa.int", "esawebb.org", "esahubble.org"],
    enrichFromArticle: true
  },
  {
    id: "esa-exploration",
    name: "ESA Exploration",
    type: "rss",
    url: "https://www.esa.int/rss/human-and-robotic-exploration.rss",
    enabled: true,
    categoryHint: "Missions",
    source: { id: "esa-exploration", name: "ESA", kind: "agency", credibility: "Primary" },
    publisherHosts: ["esa.int"],
    imageHosts: ["esa.int", "esawebb.org", "esahubble.org"],
    enrichFromArticle: true
  },
  {
    id: "arxiv-astro-ph",
    name: "arXiv astro-ph",
    type: "rss",
    url: "https://export.arxiv.org/rss/astro-ph",
    enabled: true,
    categoryHint: "Research",
    maxItems: 15,
    source: { id: "arxiv", name: "arXiv", kind: "research", credibility: "Preprint" },
    publisherHosts: ["arxiv.org"],
    imageHosts: ["arxiv.org"],
    enrichFromArticle: false
  },
  {
    id: "apod",
    name: "NASA APOD",
    type: "rss",
    url: NASA_APOD_FEED_URL,
    enabled: true,
    categoryHint: "Skywatching",
    maxItems: 10,
    source: { id: "apod", name: "APOD", kind: "archive", credibility: "Primary" },
    publisherHosts: ["science.nasa.gov", "nasa.gov"],
    imageHosts: ["nasa.gov"],
    enrichFromArticle: false
  },
  {
    id: "space-com",
    name: "Space.com",
    type: "rss",
    url: "https://www.space.com/feeds.xml",
    enabled: true,
    categoryHint: "Space News",
    maxItems: 20,
    source: { id: "space-com", name: "Space.com", kind: "platform", credibility: "Editorial" },
    publisherHosts: ["space.com"],
    imageHosts: ["space.com", "futurecdn.net"],
    enrichFromArticle: true
  },
  {
    id: "universe-today",
    name: "Universe Today",
    type: "rss",
    url: "https://www.universetoday.com/rss.xml",
    enabled: true,
    categoryHint: "Space News",
    maxItems: 15,
    source: { id: "universe-today", name: "Universe Today", kind: "platform", credibility: "Editorial" },
    publisherHosts: ["universetoday.com"],
    imageHosts: ["universetoday.com"],
    enrichFromArticle: true
  }
];

const FEED_TIMEOUT_MS = 10_000;
const ARTICLE_TIMEOUT_MS = 6_000;
const MEMO_TTL_MS = 60_000;
const STALE_MAX_AGE_MS = 14 * 86_400_000;
const STORE_RECORDS = "briefs:records";
const STORE_ALIASES = "briefs:aliases";
const STORE_SNAPSHOT = "briefs:lkg";
const STORE_DIAGNOSTICS = "diagnostics:briefs";
const BRIEF_ID_PATTERN = /-(b[0-9a-z]{6,12})$/;

const xmlParser = new XMLParser({
  attributeNamePrefix: "@_",
  cdataPropName: "#cdata",
  ignoreAttributes: false,
  processEntities: true,
  trimValues: true
});

type Snapshot = { savedAt: string; items: Array<{ id: string; sourceFeedId: string }> };

type PipelineState = {
  result: BriefsResult;
  aliasIndex: Map<string, string>;
};

let memo: { at: number; promise: Promise<PipelineState> } | null = null;
let lastPersistedFingerprint = "";

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function getAstronomyBriefs(): Promise<BriefsResult> {
  return (await loadPipeline()).result;
}

export async function getLatestBriefs(limit?: number): Promise<AstronomyBrief[]> {
  const result = await getAstronomyBriefs();
  return typeof limit === "number" ? result.briefs.slice(0, limit) : result.briefs;
}

/**
 * Resolves a brief from the live feed, its legacy aliases, or durable history.
 * Old links keep working after a story leaves the latest feed, provided the
 * durable store is configured (see docs/content-pipeline.md).
 */
export async function getBriefBySlug(slug: string): Promise<AstronomyBrief | undefined> {
  if (!/^[a-z0-9-]{1,160}$/i.test(slug)) return undefined;
  const key = slug.toLowerCase();
  const { result, aliasIndex } = await loadPipeline();

  const live = result.briefs.find((brief) => brief.slug === key);
  if (live) return live;

  const aliasedId = aliasIndex.get(key);
  if (aliasedId) {
    const aliased = result.briefs.find((brief) => brief.id === aliasedId);
    if (aliased) return aliased;
  }

  const store = getDurableStore();
  const readRecord = async (id: string | null | undefined) => {
    if (!id) return undefined;
    const record = await store.hashGetJson<AstronomyBrief>(STORE_RECORDS, id);
    return record?.id === id && record.slug && record.title ? { ...record, isStale: undefined } : undefined;
  };

  // Current slugs end in the stable id. Legacy slugs (and any slug whose
  // suffix merely looks like an id) are resolved through the alias map.
  const stored =
    (await readRecord(key.match(BRIEF_ID_PATTERN)?.[1])) ??
    (await readRecord(aliasedId)) ??
    (await readRecord(await store.hashGetJson<string>(STORE_ALIASES, key)));

  return stored ?? mockBriefs.find((brief) => brief.slug === key);
}

export async function getBriefDiagnostics() {
  const store = getDurableStore();
  return { store: store.kind, latest: await store.getJson<unknown>(STORE_DIAGNOSTICS) };
}

// ---------------------------------------------------------------------------
// Pipeline
// ---------------------------------------------------------------------------

function loadPipeline(): Promise<PipelineState> {
  const now = Date.now();
  if (memo && now - memo.at < MEMO_TTL_MS) return memo.promise;
  const promise = runPipeline().catch((error) => {
    memo = null;
    throw error;
  });
  memo = { at: now, promise };
  return promise;
}

async function runPipeline(): Promise<PipelineState> {
  const startedAt = Date.now();
  const lastChecked = new Date(startedAt).toISOString();
  const store = getDurableStore();
  const enabledSources = BRIEF_SOURCE_CONFIGS.filter((source) => source.enabled);
  const sourceResults = await mapWithConcurrency(enabledSources, 5, fetchBriefSource);
  const sourceStatuses = sourceResults.map((result) => result.status);
  const failedSources = sourceResults.filter((result) => !result.status.ok);
  const liveCandidates = sourceResults.flatMap((result) => result.candidates);

  // Last-known-good: a temporarily failing source keeps its recent verified items.
  const snapshot = await store.getJson<Snapshot>(STORE_SNAPSHOT);
  const restored = failedSources.length > 0 ? await restoreFromSnapshot(snapshot, new Set(failedSources.map((result) => result.config.id))) : [];
  for (const status of sourceStatuses) {
    const count = restored.filter((brief) => brief.sourceFeedId === status.id).length;
    if (count > 0) status.staleCount = count;
  }

  const clusters = clusterCandidates(
    [...liveCandidates, ...restored.map(candidateFromStored)].map((candidate) => ({
      ...candidate,
      id: candidate.brief.id,
      title: candidate.brief.title,
      publishedAt: candidate.brief.publishedAt,
      preference: preferenceScore(candidate)
    }))
  );

  const aliasIndex = new Map<string, string>();
  const representatives = clusters.map(({ representative, members }) => {
    const brief = representative.brief;
    for (const member of members) {
      for (const alias of [...member.aliases, member.brief.slug]) {
        if (alias !== brief.slug) aliasIndex.set(alias, brief.id);
      }
    }
    return { brief, assessment: representative.assessment, summaryQuality: representative.summaryQuality };
  });

  const now = Date.now();
  const published = representatives
    .map(({ brief, assessment, summaryQuality }) => ({ ...brief, featureScore: computeFeatureScore(brief, assessment, summaryQuality, now) }))
    .sort(sortBriefsByDateDesc)
    .slice(0, FINAL_BRIEFS_LIMIT);

  const duplicates = liveCandidates.length + restored.length - clusters.length;
  const report = {
    generatedAt: lastChecked,
    durationMs: Date.now() - startedAt,
    store: store.kind,
    totals: {
      candidates: liveCandidates.length,
      restoredFromSnapshot: restored.length,
      duplicatesMerged: duplicates,
      published: published.length
    },
    sources: sourceResults.map((result) => result.report),
    rejectedSamples: sourceResults.flatMap((result) => result.rejected).slice(0, 40)
  };

  logInfo(
    `[briefs] published=${published.length} candidates=${liveCandidates.length} duplicates=${duplicates} restored=${restored.length} failedSources=${failedSources.map((result) => result.config.id).join(",") || "none"} store=${store.kind} durationMs=${report.durationMs}`
  );

  if (published.length === 0) {
    const stale = await restoreFromSnapshot(snapshot, null);
    await store.setJson(STORE_DIAGNOSTICS, report);

    if (stale.length > 0) {
      console.warn(`[briefs] every live source returned no usable items; serving ${stale.length} briefs from the snapshot saved ${snapshot?.savedAt}.`);
      return {
        aliasIndex,
        result: {
          briefs: stale.sort(sortBriefsByDateDesc).slice(0, FINAL_BRIEFS_LIMIT),
          sourceStatuses,
          lastChecked,
          latestItemDate: latestPublishedDate(stale),
          isFallback: false,
          isStale: true,
          staleSavedAt: snapshot?.savedAt,
          warnings: ["Live brief sources are temporarily unavailable. Showing the last verified briefs; publication dates are the original sources' dates."]
        }
      };
    }

    console.warn("[briefs] every live source returned no usable items and no snapshot exists; showing bundled sample briefs.");
    return {
      aliasIndex,
      result: {
        briefs: markFallbackBriefs(mockBriefs),
        sourceStatuses,
        lastChecked,
        latestItemDate: latestPublishedDate(mockBriefs),
        isFallback: true,
        warnings: ["Live brief sources are temporarily unavailable. Showing saved Astroboat sample briefs."]
      }
    };
  }

  await persist(store, representatives.map((entry) => entry.brief), aliasIndex, published, report);

  const featured = [...published].sort((a, b) => (b.featureScore ?? 0) - (a.featureScore ?? 0))[0];
  const warnings: string[] = [];
  const onlyStale = published.every((brief) => brief.isStale);
  if (onlyStale) {
    warnings.push("Live brief sources are temporarily unavailable. Showing the last verified briefs; publication dates are the original sources' dates.");
  } else if (failedSources.length > 0) {
    warnings.push(
      restored.length > 0
        ? "Some sources could not be reached. Their most recent verified briefs are shown until they recover."
        : "Some sources could not be loaded. Showing available briefs."
    );
  }

  return {
    aliasIndex,
    result: {
      briefs: published,
      sourceStatuses,
      lastChecked,
      latestItemDate: latestPublishedDate(published),
      isFallback: false,
      warnings,
      ...(onlyStale ? { isStale: true, staleSavedAt: snapshot?.savedAt } : {}),
      featuredId: featured && (featured.featureScore ?? 0) > 0 ? featured.id : undefined
    }
  };
}

async function persist(
  store: ReturnType<typeof getDurableStore>,
  briefs: AstronomyBrief[],
  aliasIndex: Map<string, string>,
  published: AstronomyBrief[],
  report: unknown
) {
  const live = briefs.filter((brief) => !brief.isStale);
  const fingerprint = live.map((brief) => `${brief.id}:${brief.slug}`).sort().join("|");

  try {
    await store.setJson(STORE_DIAGNOSTICS, report);
    // Never replace the last-known-good snapshot with an outage result.
    if (live.length === 0 || fingerprint === lastPersistedFingerprint) return;

    const records: Record<string, AstronomyBrief> = {};
    for (const brief of live) records[brief.id] = { ...brief, isStale: undefined };
    const aliases: Record<string, string> = {};
    for (const [alias, id] of aliasIndex) aliases[alias] = id;

    await store.hashSetManyJson(STORE_RECORDS, records, { maxEntries: 5000 });
    await store.hashSetManyJson(STORE_ALIASES, aliases, { maxEntries: 20000 });
    await store.setJson(STORE_SNAPSHOT, {
      savedAt: new Date().toISOString(),
      items: published.filter((brief) => !brief.isStale).map((brief) => ({ id: brief.id, sourceFeedId: brief.sourceFeedId ?? "" }))
    } satisfies Snapshot);
    lastPersistedFingerprint = fingerprint;
  } catch {
    // Persistence is best effort; the live page must still render.
  }
}

async function restoreFromSnapshot(snapshot: Snapshot | null, onlySources: Set<string> | null): Promise<AstronomyBrief[]> {
  if (!snapshot?.items?.length) return [];
  const wanted = snapshot.items.filter((item) => !onlySources || onlySources.has(item.sourceFeedId));
  if (wanted.length === 0) return [];

  const records = await getDurableStore().hashGetManyJson<AstronomyBrief>(STORE_RECORDS, wanted.map((item) => item.id));
  const cutoff = Date.now() - STALE_MAX_AGE_MS;

  return records
    .filter((record): record is AstronomyBrief => Boolean(record?.id && record.slug && record.title))
    // A per-source outage should not resurrect old items indefinitely.
    .filter((record) => !onlySources || dateScore(record.publishedAt) >= cutoff)
    .map((record) => ({ ...record, isStale: true }));
}

function candidateFromStored(brief: AstronomyBrief): Candidate {
  return {
    brief,
    assessment: { score: brief.editorialScore ?? ACCEPT_THRESHOLD, decision: "accept", featureEligible: false, significance: 0, signals: [], reasons: [] },
    urls: [brief.originalUrl],
    aliases: [],
    language: "en",
    summaryQuality: "good"
  };
}

// ---------------------------------------------------------------------------
// Source fetching
// ---------------------------------------------------------------------------

async function fetchBriefSource(config: BriefSourceConfig): Promise<SourceFetchResult> {
  const startedAt = Date.now();
  const report: SourceReport = {
    id: config.id,
    ok: false,
    fetched: 0,
    accepted: 0,
    rejectedEditorial: 0,
    rejectedSummary: 0,
    invalidLinks: 0,
    enrichedFromArticle: 0,
    articleGone: 0,
    durationMs: 0
  };
  const rejected: RejectedSample[] = [];

  const fail = (error: string): SourceFetchResult => {
    report.error = error;
    report.durationMs = Date.now() - startedAt;
    console.warn(`[briefs] source=${config.id} failed: ${error}`);
    return { config, candidates: [], rejected, report, status: { id: config.id, name: config.name, enabled: config.enabled, count: 0, ok: false, error } };
  };

  let xml: string;
  try {
    const response = await fetchWithRetry(
      config.url,
      {
        headers: { Accept: "application/rss+xml, application/atom+xml, application/xml, text/xml;q=0.9, */*;q=0.5", "User-Agent": CONTENT_USER_AGENT },
        next: { revalidate: BRIEFS_REVALIDATE_SECONDS }
      },
      { timeoutMs: FEED_TIMEOUT_MS }
    );
    report.httpStatus = response.status;
    if (!response.ok) return fail(`HTTP ${response.status}`);
    xml = await response.text();
  } catch (error) {
    return fail(describeFetchError(error, FEED_TIMEOUT_MS).reason);
  }

  if (/Just a moment|cf-chl|challenge-platform/i.test(xml)) return fail("blocked by a bot-challenge page");
  if (/^\s*<!doctype html|^\s*<html/i.test(xml)) return fail("returned an HTML page instead of a feed (the feed may have moved)");

  let items: ParsedFeedItem[];
  try {
    items = extractFeedItems(xmlParser.parse(xml)).slice(0, config.maxItems ?? MAX_BRIEFS_PER_SOURCE);
  } catch {
    return fail("feed XML could not be parsed");
  }

  report.fetched = items.length;

  const prepared = items.map((item, index) => prepareItem(item, config, index));
  const enriched = await mapWithConcurrency(prepared, 3, async (entry) => {
    if (!entry) return entry;
    // Skip network work for items that are clearly off-topic.
    if (entry.preAssessment.score < ACCEPT_THRESHOLD - 15) return entry;
    return enrichFromArticle(entry, config, report);
  });

  const candidates: Candidate[] = [];

  for (const entry of enriched) {
    if (!entry) {
      report.invalidLinks += 1;
      continue;
    }

    const summary = entry.summary;
    const assessment = assessBrief({
      title: entry.title,
      summary: summary.text,
      url: entry.url,
      feedCategories: entry.categories,
      credibility: config.source.credibility,
      sourceFeedId: config.id
    });

    if (assessment.decision === "reject") {
      report.rejectedEditorial += 1;
      rejected.push({ source: config.id, title: entry.title.slice(0, 140), score: assessment.score, reasons: assessment.reasons });
      continue;
    }

    const summaryWords = summary.text.split(/\s+/).filter(Boolean).length;
    if (summary.quality === "empty" || (summary.quality === "thin" && summaryWords < 7)) {
      report.rejectedSummary += 1;
      rejected.push({ source: config.id, title: entry.title.slice(0, 140), score: assessment.score, reasons: ["no usable summary in feed or article metadata"] });
      continue;
    }

    const category = classifyBrief({ title: entry.title, summary: summary.text, feedCategories: entry.categories, sourceFeedId: config.id, categoryHint: config.categoryHint });
    const tags = inferBriefTags({ title: entry.title, summary: summary.text, feedCategories: entry.categories, category });
    const id = createBriefId(entry.url);
    const brief: AstronomyBrief = {
      id,
      slug: createBriefSlug(entry.title, id),
      source: config.source,
      sourceFeedId: config.id,
      originalUrl: entry.url,
      title: entry.title,
      summary: [summary.text],
      why: createWhyItMatters(category, config.source.name),
      tags,
      readingTime: estimateReadingTime(entry.bodyText || summary.text),
      publishedAt: entry.publishedAt,
      category,
      quality: "source_digest",
      imageUrl: entry.imageUrl,
      editorialScore: assessment.score
    };

    report.accepted += 1;
    candidates.push({ brief, assessment, urls: [entry.url, ...entry.alternates], aliases: entry.aliases, language: entry.language, summaryQuality: summary.quality });
  }

  report.ok = true;
  report.durationMs = Date.now() - startedAt;
  logInfo(
    `[briefs] source=${config.id} http=${report.httpStatus} fetched=${report.fetched} accepted=${report.accepted} rejectedEditorial=${report.rejectedEditorial} rejectedSummary=${report.rejectedSummary} invalidLinks=${report.invalidLinks} enriched=${report.enrichedFromArticle} durationMs=${report.durationMs}`
  );
  if (report.fetched > 0 && report.accepted === 0) {
    console.warn(`[briefs] source=${config.id} returned ${report.fetched} items but none passed editorial and summary checks.`);
  }

  return {
    config,
    candidates,
    rejected,
    report,
    status: { id: config.id, name: config.name, enabled: config.enabled, count: candidates.length, ok: true }
  };
}

type PreparedItem = {
  title: string;
  url: string;
  rawLink: string;
  categories: string[];
  publishedAt: string;
  summary: SummaryResult;
  bodyText: string;
  imageUrl?: string;
  alternates: string[];
  aliases: string[];
  language: "en" | "es" | "other";
  preAssessment: EditorialAssessment;
};

function prepareItem(item: ParsedFeedItem, config: BriefSourceConfig, index: number): PreparedItem | null {
  const rawLink = rawFeedLink(item);
  const url = cleanPublisherUrl(rawLink);
  const title = cleanInlineText(textValue(item.title)).replace(/^APOD:\s*\d{4}\s+\w+\s+\d{1,2}\s*[–—-]\s*/i, "");

  // Attribution must point to the publisher that supplied the item.
  if (!title || !url || !hostMatches(url, config.publisherHosts)) return null;

  const descriptionHtml = textValue(item.description) || textValue(item.summary) || textValue(item.subtitle);
  const contentHtml = textValue(item["content:encoded"]) || textValue(item.content);
  const explanationHtml = textValue(item["apod:explanation"]);
  const categories = asArray(item.category)
    .map((category) => cleanInlineText(typeof category === "string" ? category : isRecord(category) ? textValue(category["#text"]) || textValue(category["#cdata"]) || textValue(category["@_term"]) || textValue(category["@_label"]) : ""))
    .filter(Boolean);

  let summary = buildSummary(explanationHtml || descriptionHtml, { title });
  if (summary.quality !== "good" && contentHtml) {
    const fromContent = buildSummary(firstParagraphs(contentHtml), { title });
    if (fromContent.quality === "good" || (fromContent.quality === "thin" && summary.quality === "empty")) summary = fromContent;
  }

  const publishedAt =
    normalizeDate(textValue(item.pubDate) || textValue(item.published) || textValue(item.updated) || textValue(item["dc:date"])) || "";
  const languageText = `${title} ${summary.text}`;
  const language = categories.some((category) => /en español/i.test(category)) || isLikelySpanish(languageText) ? "es" : "en";
  const alternates = extractLanguageAlternates(`${descriptionHtml} ${contentHtml}`, config.publisherHosts);
  const preAssessment = assessBrief({ title, summary: summary.text, url, feedCategories: categories, credibility: config.source.credibility, sourceFeedId: config.id });

  return {
    title,
    url,
    rawLink,
    categories,
    publishedAt,
    summary,
    bodyText: cleanInlineText(explanationHtml || contentHtml || descriptionHtml),
    imageUrl: extractImageUrlFromFeedItem(item, url, config),
    alternates,
    aliases: legacySlugsFor(config, rawLink, item, index),
    language,
    preAssessment
  };
}

async function enrichFromArticle(entry: PreparedItem, config: BriefSourceConfig, report: SourceReport): Promise<PreparedItem> {
  const needsImage = !entry.imageUrl;
  const needsSummary = entry.summary.quality !== "good";

  if (config.id === "arxiv-astro-ph" && needsImage) {
    return { ...entry, imageUrl: await fetchArxivFigure(entry.url) };
  }

  if (!config.enrichFromArticle || (!needsImage && !needsSummary)) return entry;

  try {
    const response = await fetchFromTrustedHosts(
      entry.url,
      config.publisherHosts,
      { headers: { Accept: "text/html,application/xhtml+xml;q=0.9,*/*;q=0.5", "User-Agent": CONTENT_USER_AGENT }, next: { revalidate: BRIEFS_REVALIDATE_SECONDS } },
      { timeoutMs: ARTICLE_TIMEOUT_MS }
    );

    if (!response) return entry;
    if (response.status === 404 || response.status === 410) {
      // Do not delete the brief: an article URL can fail temporarily or move.
      report.articleGone += 1;
      console.warn(`[briefs] source=${config.id} original article returned HTTP ${response.status}: ${entry.url}`);
      return entry;
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (!response.ok || (contentType && !contentType.includes("text/html"))) return entry;

    const html = await response.text();
    if (/Just a moment|cf-chl|challenge-platform/i.test(html)) return entry;

    let next = entry;
    const meta = readMetaTags(html);

    if (needsSummary) {
      const description = meta["og:description"] || meta.description || meta["twitter:description"] || "";
      const fromMeta = buildSummary(description, { title: entry.title });
      const fromBody = buildSummary(firstParagraphs(articleHtml(html)), { title: entry.title });
      const best = [fromBody, fromMeta].find((summary) => summary.quality === "good") ?? (fromMeta.text.length > entry.summary.text.length ? fromMeta : entry.summary);
      if (best !== entry.summary) {
        next = { ...next, summary: best };
        report.enrichedFromArticle += 1;
      }
    }

    if (needsImage) {
      const candidates = extractArticleImageCandidates(html, meta, response.url || entry.url).slice(0, 5);
      for (const candidate of candidates) {
        if (!hostMatches(candidate, config.imageHosts)) continue;
        if ((await verifyRemoteImage(candidate, config.imageHosts)) === "verified") {
          next = { ...next, imageUrl: candidate };
          break;
        }
      }
    }

    return next;
  } catch {
    return entry;
  }
}

// ---------------------------------------------------------------------------
// Feed parsing helpers
// ---------------------------------------------------------------------------

function extractFeedItems(parsed: unknown): ParsedFeedItem[] {
  if (!isRecord(parsed)) return [];
  const rss = parsed.rss;
  const feed = parsed.feed;
  const rdf = parsed["rdf:RDF"];

  if (isRecord(rss) && isRecord(rss.channel)) return asArray(rss.channel.item).filter(isRecord);
  if (isRecord(feed)) return asArray(feed.entry).filter(isRecord);
  if (isRecord(rdf)) return asArray(rdf.item).filter(isRecord);
  return [];
}

function rawFeedLink(item: ParsedFeedItem): string {
  const link = item.link;
  if (typeof link === "string") return link.trim();

  for (const entry of asArray(link)) {
    if (typeof entry === "string") return entry.trim();
    if (isRecord(entry)) {
      const rel = textValue(entry["@_rel"]);
      const href = textValue(entry["@_href"]) || textValue(entry["#text"]) || textValue(entry["#cdata"]);
      if (href && (!rel || rel === "alternate")) return href.trim();
    }
  }

  const guid = item.guid;
  const guidIsLink = isRecord(guid) ? textValue(guid["@_isPermaLink"]) !== "false" : true;
  return guidIsLink ? (textValue(guid) || textValue(item.id)).trim() : "";
}

/** NASA's bilingual releases link to each other with these phrases. */
function extractLanguageAlternates(html: string, allowedHosts: string[]): string[] {
  const decoded = decodeEntities(html);
  const pattern =
    /(?:Read this (?:release|story|article) in (?:English|Spanish)|Lea esta (?:nota de prensa|noticia|historia|nota) en (?:español|inglés))[^<]{0,40}<a\b[^>]*href=["']([^"']+)["']/gi;
  const urls = [...decoded.matchAll(pattern)].map((match) => cleanPublisherUrl(match[1])).filter((url) => url && hostMatches(url, allowedHosts));
  return Array.from(new Set(urls));
}

function isLikelySpanish(text: string) {
  const words = text.toLowerCase().split(/[^a-záéíóúñü]+/).filter(Boolean);
  if (words.length < 8) return false;
  const spanish = words.filter((word) => /^(el|la|los|las|de|del|que|en|y|por|para|con|una|un|su|sus|se|es|al|como|más|esta|este|nasa)$/.test(word)).length;
  const english = words.filter((word) => /^(the|of|and|to|in|is|for|with|on|that|this|from|by|its|are|was)$/.test(word)).length;
  return spanish >= 4 && spanish > english * 2;
}

function firstParagraphs(html: string): string {
  const paragraphs = [...decodeEntities(html).matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)]
    .map((match) => cleanInlineText(match[1] ?? ""))
    .filter((text) => text.split(/\s+/).length >= 12)
    .slice(0, 3);
  return paragraphs.length > 0 ? paragraphs.join("\n") : html;
}

function articleHtml(html: string): string {
  return [...html.matchAll(/<(article|main)\b[\s\S]*?<\/\1>/gi)].map((match) => match[0]).join(" ") || "";
}

function extractImageUrlFromFeedItem(item: ParsedFeedItem, pageUrl: string, config: BriefSourceConfig): string | undefined {
  if (config.id === "apod") {
    // APOD video days expose only a 48px poster thumbnail here; use no image rather than a blurry one.
    const hdUrl = cleanPublisherUrl(textValue(item["apod:hdurl"]));
    if (!hdUrl || /cq5dam\.thumbnail|\/themes\//i.test(hdUrl) || !hostMatches(hdUrl, config.imageHosts)) return undefined;
    return resizeNasaDynamicImage(hdUrl, 1200);
  }

  const candidates = [
    ...urlCandidatesFromField(item.enclosure),
    ...urlCandidatesFromField(item["media:content"]),
    ...urlCandidatesFromField(item["media:thumbnail"]),
    ...urlCandidatesFromField(item.image),
    ...urlCandidatesFromField(item.thumbnail),
    ...[textValue(item.description), textValue(item.summary), textValue(item["content:encoded"]), textValue(item.content)].flatMap(urlCandidatesFromHtml)
  ];

  for (const candidate of candidates) {
    const url = sanitizeImageUrl(candidate, pageUrl);
    if (url && hostMatches(url, config.imageHosts) && !isDecorativeImageUrl(url)) return url;
  }

  return undefined;
}

/** science.nasa.gov dynamic images accept a width parameter; the full file can be many megabytes. */
export function resizeNasaDynamicImage(value: string, width: number): string {
  const url = parseWebUrl(value);
  if (!url || url.hostname !== "assets.science.nasa.gov" || !url.pathname.startsWith("/dynamicimage/")) return value;
  url.searchParams.delete("h");
  url.searchParams.set("w", String(width));
  url.searchParams.set("fit", "clip");
  return url.toString();
}

function urlCandidatesFromField(value: unknown): string[] {
  return asArray(value).flatMap((entry) => {
    if (typeof entry === "string") return [entry];
    if (!isRecord(entry)) return [];
    const medium = textValue(entry["@_medium"]).toLowerCase();
    const mimeType = (textValue(entry["@_type"]) || textValue(entry.type)).toLowerCase();
    const isKnownNonImage = (Boolean(medium) && medium !== "image") || (Boolean(mimeType) && !mimeType.startsWith("image/"));
    const direct = isKnownNonImage ? [] : [textValue(entry["@_url"]), textValue(entry.url), textValue(entry["@_href"]), textValue(entry.href)].filter(Boolean);
    return [...direct, ...urlCandidatesFromField(entry["media:thumbnail"]), ...urlCandidatesFromField(entry["media:content"]), ...urlCandidatesFromField(entry["media:group"])];
  });
}

function urlCandidatesFromHtml(value: string): string[] {
  const decoded = decodeEntities(value);
  const srcSets = [...decoded.matchAll(/<(?:img|source)[^>]+(?:srcset|data-srcset)=["']([^"']+)["']/gi)].flatMap((match) => parseSrcSet(match[1] ?? ""));
  const direct = [...decoded.matchAll(/<img[^>]+(?:src|data-src|data-lazy-src|data-original)=["']([^"']+)["']/gi)].map((match) => match[1] ?? "");
  return [...srcSets, ...direct];
}

function parseSrcSet(value: string): string[] {
  // Prefer a mid-size rendition (≈1200px) over the multi-megabyte original.
  return value
    .split(",")
    .map((part, index) => {
      const [url = "", descriptor = ""] = part.trim().split(/\s+/);
      const width = Number.parseFloat(descriptor) || 0;
      return { url, distance: width ? Math.abs(width - 1200) : 5000, index };
    })
    .filter((candidate) => Boolean(candidate.url))
    .sort((a, b) => a.distance - b.distance || a.index - b.index)
    .map((candidate) => candidate.url);
}

function sanitizeImageUrl(value: string, baseUrl: string): string {
  const url = cleanPublisherUrl(value, baseUrl);
  if (!url || /\.(mp4|m4v|mov|webm|svg)(\?|#|$)/i.test(url) || /(?:youtube\.com|youtu\.be|vimeo\.com)/i.test(url)) return "";
  return url;
}

function isDecorativeImageUrl(value: string) {
  return /(?:^|[/_-])(avatar|badge|icon|license|logo|sprite|placeholder|default|blank|pixel|spacer)(?:[/_\-.@]|$)/i.test(value) || /\/themes\//i.test(value);
}

function extractArticleImageCandidates(html: string, meta: Record<string, string>, pageUrl: string): string[] {
  const metaCandidates = [meta["og:image:secure_url"], meta["og:image"], meta["twitter:image"], meta["twitter:image:src"]].filter(Boolean) as string[];
  const bodyCandidates = urlCandidatesFromHtml(articleHtml(html));
  const seen = new Set<string>();

  return [...metaCandidates, ...bodyCandidates]
    .map((candidate) => sanitizeImageUrl(candidate, pageUrl))
    .filter((candidate) => {
      if (!candidate || seen.has(candidate) || isDecorativeImageUrl(candidate)) return false;
      seen.add(candidate);
      return true;
    });
}

async function fetchArxivFigure(abstractUrl: string): Promise<string | undefined> {
  const url = parseWebUrl(abstractUrl);
  if (!url || !/^(?:export\.)?arxiv\.org$/i.test(url.hostname) || !url.pathname.startsWith("/abs/")) return undefined;
  const paperId = url.pathname.slice("/abs/".length).replace(/^\/+|\/+$/g, "");
  if (!paperId) return undefined;

  try {
    const response = await fetchFromTrustedHosts(
      `https://arxiv.org/html/${paperId}`,
      ["arxiv.org"],
      { headers: { Accept: "text/html", "User-Agent": CONTENT_USER_AGENT }, next: { revalidate: BRIEFS_REVALIDATE_SECONDS } },
      { timeoutMs: ARTICLE_TIMEOUT_MS }
    );
    if (!response?.ok) return undefined;
    const html = await response.text();
    const figures = [...html.matchAll(/<figure\b[\s\S]*?<\/figure>/gi)].map((match) => match[0]);
    for (const candidate of figures.flatMap(urlCandidatesFromHtml)) {
      const imageUrl = sanitizeImageUrl(candidate, response.url || `https://arxiv.org/html/${paperId}/`);
      if (imageUrl && hostMatches(imageUrl, ["arxiv.org"]) && !/(?:^|[/_-])(logo|icon|license|funder)(?:[/_\-.]|$)/i.test(imageUrl)) return imageUrl;
    }
  } catch {
    // Figures are optional.
  }
  return undefined;
}

// ---------------------------------------------------------------------------
// Identity
// ---------------------------------------------------------------------------

/** Stable, source-independent ID derived from the canonical article URL. */
export function createBriefId(originalUrl: string): string {
  return `b${stableHash(canonicalUrlKey(originalUrl)).padStart(10, "0").slice(-11)}`;
}

export function createBriefSlug(title: string, id: string): string {
  return `${slugify(title, 70) || "brief"}-${id}`;
}

/**
 * Slugs that earlier releases generated for the same feed item, so links that
 * were shared before this release redirect instead of returning 404.
 */
function legacySlugsFor(config: BriefSourceConfig, rawLink: string, item: ParsedFeedItem, index: number): string[] {
  const link = /^https?:\/\//i.test(rawLink.trim()) ? rawLink.trim() : "";
  if (!link) return [];
  const legacyTitle = decodeEntities(textValue(item.title).replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").replace(/\[[^\]]*…?\]/g, "").trim();
  const urlSlug = `${config.id}-${legacyHash(legacyUrlKey(link))}`;
  const titleBase = legacyTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);
  const titleSlug = `${titleBase || "brief"}-${legacyHash(`${config.id}-${index}-${legacyHash(`${legacyTitle}-${link}`)}`).slice(0, 6)}`;
  return [urlSlug, titleSlug];
}

function legacyUrlKey(value: string) {
  try {
    const url = new URL(value);
    url.hash = "";
    ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"].forEach((param) => url.searchParams.delete(param));
    return url.toString().replace(/\/$/, "").toLowerCase();
  } catch {
    return value.trim().toLowerCase();
  }
}

// ---------------------------------------------------------------------------
// Ranking
// ---------------------------------------------------------------------------

function preferenceScore(candidate: Candidate): number {
  const { brief } = candidate;
  let score = 0;
  if (candidate.language === "en") score += 40;
  if (candidate.summaryQuality === "good") score += 12;
  score += Math.min(8, Math.floor((brief.summary[0]?.length ?? 0) / 45));
  if (brief.imageUrl) score += 5;
  if (brief.source.credibility === "Primary") score += 6;
  // The feed run by the article's own publisher (e.g. APOD for APOD pages) is the most authoritative copy.
  if (brief.sourceFeedId === "apod" && /\/image-article\/apod-/i.test(brief.originalUrl)) score += 15;
  if (!brief.isStale) score += 3;
  score += Math.round((candidate.assessment.score ?? 0) / 10);
  return score;
}

function computeFeatureScore(brief: AstronomyBrief, assessment: EditorialAssessment, summaryQuality: SummaryResult["quality"], now: number): number {
  if (!assessment.featureEligible || brief.isStale) return 0;
  const ageHours = Math.max(0, (now - dateScore(brief.publishedAt)) / 3_600_000);
  if (!Number.isFinite(ageHours) || ageHours > 24 * 10) return 0;

  const relevance = assessment.score * 0.45;
  const recency = ageHours <= 48 ? 20 : Math.max(0, 20 - ((ageHours - 48) / 24) * 2.5);
  const reliability = brief.source.credibility === "Primary" ? 10 : brief.source.credibility === "Preprint" ? 4 : 6;
  const summary = summaryQuality === "good" ? Math.min(10, Math.floor((brief.summary[0]?.length ?? 0) / 36)) : 0;
  const image = brief.imageUrl ? 8 : 0;

  return Math.round((relevance + assessment.significance + recency + reliability + summary + image) * 10) / 10;
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
    quality: "source_digest" as const,
    originalUrl: cleanPublisherUrl(brief.originalUrl),
    isFallback: true
  }));
}

function normalizeDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
}

function estimateReadingTime(text: string) {
  const words = text.split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.min(8, Math.ceil(words / 220)))} min`;
}

function dateScore(value: string) {
  const time = new Date(value).getTime();
  return Number.isNaN(time) ? 0 : time;
}

function textValue(value: unknown): string {
  if (typeof value === "string" || typeof value === "number") return String(value);
  if (Array.isArray(value)) return value.map(textValue).find(Boolean) ?? "";
  if (isRecord(value)) return textValue(value["#text"]) || textValue(value["#cdata"]) || textValue(value["@_href"]) || textValue(value["@_term"]);
  return "";
}

function asArray(value: unknown): unknown[] {
  if (Array.isArray(value)) return value;
  return typeof value === "undefined" || value === null ? [] : [value];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

