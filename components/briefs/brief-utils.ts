import type { AstronomyBrief } from "@/lib/types";

export function getBriefCategory(brief: AstronomyBrief) {
  if (brief.category) {
    return brief.category;
  }

  if (brief.tags.some((tag) => /planet|jupiter|mars|moon/i.test(tag))) {
    return "Planetary Science";
  }

  if (brief.tags.some((tag) => /mission|juno|webb|space weather|esa|nasa/i.test(tag))) {
    return "Missions";
  }

  if (brief.source.name === "arXiv" || brief.tags.some((tag) => /research|survey|spectroscopy/i.test(tag))) {
    return "Research";
  }

  return "Science Update";
}

export function getBriefSummary(brief: AstronomyBrief, maxSentences = 2) {
  return brief.summary.filter(Boolean).slice(0, maxSentences).join(" ");
}

export function formatBriefDate(value: string) {
  const date = new Date(`${value}T00:00:00Z`);

  if (Number.isNaN(date.getTime())) {
    const fallback = new Date(value);
    return Number.isNaN(fallback.getTime())
      ? "Date unavailable"
      : new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(fallback);
  }

  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(date);
}

/**
 * The lead story is chosen by the server-side feature score (editorial
 * relevance, significance, recency, source reliability, summary quality and
 * image availability), never simply the newest item. Off-topic, promotional,
 * stale and low-quality items have a score of 0 and are never featured.
 */
export function getFeaturedBrief(briefs: AstronomyBrief[]) {
  let best: AstronomyBrief | undefined;
  for (const brief of briefs) {
    if ((brief.featureScore ?? 0) > (best?.featureScore ?? 0)) best = brief;
  }
  if (best) return best;

  // Saved sample briefs (no live data) carry no score; lead with one that has artwork.
  return briefs.every((brief) => brief.isFallback) ? briefs.find((brief) => brief.imageUrl) ?? briefs[0] : undefined;
}

/** A link to the original publisher, only for well-formed http(s) URLs without credentials. */
export function getOriginalHref(value: string | undefined) {
  if (!value) return undefined;
  try {
    const url = new URL(value.trim());
    return (url.protocol === "https:" || url.protocol === "http:") && !url.username && !url.password ? url.toString() : undefined;
  } catch {
    return undefined;
  }
}
