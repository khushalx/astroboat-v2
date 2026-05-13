import { briefs } from "@/lib/mock-data";
import type { AstronomyBrief } from "@/lib/types";

export async function getLatestBriefs(limit?: number): Promise<AstronomyBrief[]> {
  return typeof limit === "number" ? briefs.slice(0, limit) : briefs;
}

export async function getBriefBySlug(slug: string): Promise<AstronomyBrief | undefined> {
  return briefs.find((brief) => brief.slug === slug);
}
