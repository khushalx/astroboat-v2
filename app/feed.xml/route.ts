import { publishedGuides } from "@/lib/guides";
import { absoluteUrl, SITE_URL } from "@/lib/seo";

function xml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export function GET() {
  const items = publishedGuides.map((guide) => {
    const url = absoluteUrl(`/guides/${guide.slug}`);
    return `<item><title>${xml(guide.title)}</title><link>${xml(url)}</link><guid isPermaLink="true">${xml(url)}</guid><description>${xml(guide.description)}</description><pubDate>${new Date(guide.publishedAt).toUTCString()}</pubDate></item>`;
  }).join("");
  const feed = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Astroboat Guides</title><link>${SITE_URL}</link><description>Original, source-linked astronomy explainers from Astroboat.</description><language>en</language>${items}</channel></rss>`;
  return new Response(feed, { headers: { "Content-Type": "application/rss+xml; charset=utf-8", "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" } });
}
