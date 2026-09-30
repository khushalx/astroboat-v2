# Astroboat SEO audit

Audit date: 30 September 2026. Canonical production origin: `https://www.astroboat.in` (the apex host redirects there).

## CURRENT STATE

- Next.js 15 App Router with server-rendered home, Moon, event, asteroid, gallery, and brief routes. Most external data is cached for one or six hours. A small number of interactive client components handle filters, search, chat, and the Earth visual.
- Public routes: `/`, `/gallery`, `/briefs`, `/briefs/[slug]`, `/events`, `/moon`, `/asteroids`, `/ask`, `/about`, `/data-sources`, `/contact`, `/privacy`, `/terms`. `/articles`, `/learn`, and `/satellites` are paused notices. There are no event, object, or topic detail routes.
- Briefs aggregate nine feeds, keep at most 40 current items, and form short summaries from publisher text. There is no persistent editorial database or old-brief archive. Article and learning service files contain mock content but were not a publishable content system.
- Existing metadata, robots, sitemap, and site identity JSON-LD were present. Search was a client-side route launcher. The gallery already uses `next/image` for its prominent image and keeps image credits. The Earth scene is dynamically imported when visible. Fonts use `next/font`.
- No analytics integration, RSS feed, Search Console verification setting, custom 404, or crawlable guide system existed.

## CRITICAL ISSUES

1. The live apex domain redirects to `www`, but metadata and sitemap used the apex or a configurable local host. This could split canonical signals.
2. The sitemap stamped every URL with the build date, implying content changed when it had not. It omitted any editorial detail URLs.
3. Brief detail pages used upstream descriptions plus generic category text. They were indexable and lacked canonical, social, and quality controls. Their slugs depended on feed position, and old briefs can disappear without an archive.
4. Pages without a route canonical inherited the root `/` canonical. Paused pages remained indexable.
5. Search results were JavaScript buttons, and only the first 12 of up to 40 briefs appeared before a client click.

## HIGH-IMPACT OPPORTUNITIES

- Build a small set of source-linked guides connected to live tools, starting with NEOs, the Moon, and sky events.
- Add contextual HTML around live datasets so readers understand place, timestamp, units, source, and uncertainty.
- Keep a durable editorial archive before making individual feed briefs indexable; source digest pages are not a substitute for original reporting.
- Watch actual Core Web Vitals and prioritize changes from Search Console and field data. A production build alone cannot measure LCP, INP, or CLS.

## IMPLEMENTED CHANGES

- One `www` URL and metadata utility now creates unique titles, descriptions, canonicals, Open Graph, Twitter cards, and optional `noindex`. Feed digests, the assistant, and paused notice pages use `noindex,follow`.
- Sitemap contains only indexable static pages and published guides. Guide modification dates come from editorial records. Robots references the canonical sitemap and allows public assets and content.
- Added escaped JSON-LD utilities, global Organization/WebSite identity, guide Article and breadcrumb schema, brief breadcrumbs, and safer gallery image schema.
- Added a guide registry with publish/draft gate, metadata, dates, author, category, tags, optional images/credits, sections, sources, related links, and table of contents. One original NEO explainer is linked to NASA/JPL sources and the live asteroid tool. No bulk pages were generated.
- Brief model now has optional editorial depth fields and an explicit quality field. Ingested and fallback briefs remain source digests and are not indexable. Brief template renders original fields when supplied, source attribution, sharing, breadcrumbs, and related content. It no longer prebuilds transient feed detail pages. New slugs derive from source URLs; currently resolvable old slugs redirect.
- Added a guides hub, editorial methodology, custom 404, guide RSS, guide navigation/search links, contextual links from Moon/events/asteroids, and normal anchor navigation in global search. Removing the root loading boundary lets missing dynamic routes return a real 404 status.
- Optional GA4 loading and event hooks, optional Google/Bing verification metadata, a corrected lint command, and a lightweight `npm run seo:audit` route scanner.
- Kept prominent brief images eager and gave brief/event images dimensions; existing image fallback and credits remain intact.

## MANUAL ACTIONS REQUIRED

See [SEO_MANUAL_ACTIONS.md](SEO_MANUAL_ACTIONS.md). Submit the canonical sitemap, verify ownership, decide whether to configure GA4, review guide copy and dates before deployment, and monitor source freshness and Search Console indexing.

## FUTURE CONTENT OPPORTUNITIES

Ranked by likely usefulness to Astroboat readers relative to development cost. Each needs verified sources and original explanation.

| Priority | Opportunity | Effort |
| --- | --- | --- |
| 1 | How to read a close-approach distance and uncertainty | Low |
| 2 | Moon phases versus illumination: what changes each night | Low |
| 3 | Next full/new Moon: observing guide linked to the live Moon tool | Low |
| 4 | Meteor showers: radiant, peak, and Moon interference | Medium |
| 5 | How to verify a launch date and why schedules move | Low |
| 6 | What NASA's potentially hazardous asteroid label means | Low |
| 7 | Beginner's guide to reading astronomy images and credits | Medium |
| 8 | How Webb and Hubble observations differ | Medium |
| 9 | What can I see tonight? location-aware guide/tool | High |
| 10 | Monthly skywatching guide with human review and archive | High ongoing |

### Intentional limits and follow-up risks

- No topic, location, object, or date pages were generated: the current data does not justify thousands of distinct search pages.
- No dynamic OG-image generator was added; the existing 1200×630 Astroboat image is valid, and remote publisher-image rights vary.
- No historic brief sitemap or RSS entries: live feeds have no durable archive, stable editorial review, or reliable modification record. Keep digests `noindex` until those exist.
- No event or asteroid detail pages were added because individual records do not yet have durable, independently useful editorial context.
- No claim of measured Core Web Vitals improvement: field metrics need post-deployment monitoring. Local build logs showed an APOD TLS certificate mismatch; the app's fallback behavior handled it, but the provider should be checked from production.

### Validation

`npm run lint`, `npm run typecheck`, `npm run build`, and `npm run test:assistant` passed. A local production server passed `npm run seo:audit`: representative metadata and JSON-LD, robots, sitemap, feed, source-digest noindex, dynamic 404s, and 56 internal links. The new guide, Moon, and asteroid pages were visually checked at 390px width.

Before pushing, run:

```bash
npm run lint
npm run typecheck
npm run test:assistant
npm run build
npm run start -- -p 3000
# In another terminal:
npm run seo:audit
```

Use `SEO_AUDIT_BASE_URL` when the local server runs on a different port.
