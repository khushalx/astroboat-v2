import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";
import { publishedGuides } from "@/lib/guides";

// Only canonical public pages are listed. A deployment is not an edit.
export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = [
    "/", "/gallery", "/briefs", "/events", "/moon", "/asteroids",
    "/guides", "/about", "/data-sources", "/contact", "/editorial-policy",
    "/privacy", "/terms"
  ];

  return [
    ...staticPaths.map((path) => ({ url: absoluteUrl(path) })),
    ...publishedGuides.map((guide) => ({
      url: absoluteUrl(`/guides/${guide.slug}`),
      lastModified: new Date(guide.updatedAt ?? guide.publishedAt)
    }))
  ];
}
