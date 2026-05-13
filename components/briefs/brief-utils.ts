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

export function getFeaturedBrief(briefs: AstronomyBrief[]) {
  return briefs.find((brief) => brief.source.name === "APOD") ?? briefs[0];
}
