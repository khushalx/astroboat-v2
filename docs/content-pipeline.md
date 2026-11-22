# Briefs and Gallery content pipeline

How `/briefs`, `/briefs/[slug]`, `/gallery` and `/api/gallery` ingest, filter,
attribute and persist third-party astronomy content.

## Durable store (required for permanent links in production)

Brief permalinks, gallery share links, last-known-good snapshots and pipeline
diagnostics are kept in Redis through the Upstash REST protocol
(`lib/durable-store.ts`). No SDK or new npm dependency is used.

| Variable | Purpose |
| --- | --- |
| `KV_REST_API_URL` / `KV_REST_API_TOKEN` | Set automatically by Vercel's Marketplace **Upstash for Redis** (KV) integration. |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | Accepted as an alternative when Upstash is connected directly. |
| `CONTENT_DIAGNOSTICS_TOKEN` | Optional. Enables `GET /api/diagnostics/content` in production (≥ 24 characters, sent as `Authorization: Bearer …`). |
| `NASA_API_KEY` | Optional. Used only for the APOD API fallback; without it the shared, heavily rate-limited `DEMO_KEY` is used. |

**Setup (Vercel):** Project → Storage → Marketplace → *Upstash for Redis* →
connect to the project for Production (and Preview if wanted) → redeploy. No
schema or migration is needed; keys are created on first write under the
`astroboat:v1:` prefix.

Without these variables the store falls back to process memory. The site keeps
working, but memory is per serverless instance and lost on cold start, so old
brief URLs and rotated gallery share links can 404. A warning is logged in
production: `[store] KV_REST_API_URL/KV_REST_API_TOKEN are not configured…`.

Stored keys (all bounded):

| Key | Contents | Bound |
| --- | --- | --- |
| `briefs:records` (hash) | Published briefs by stable id | 5,000 most recent |
| `briefs:aliases` (hash) | Legacy and duplicate slugs → id | 20,000 |
| `briefs:lkg` | Last verified list (ids + source feed) | single value |
| `gallery:images` (hash) | Published images by id, with HD-check time | 4,000 |
| `gallery:lkg:<source>` | Last verified ids per source | one per source |
| `gallery:known-ids` | Current collection ids | single value |
| `diagnostics:briefs`, `diagnostics:gallery` | Latest run report | single value |

## Briefs

`services/briefs-service.ts`, `lib/brief-editorial.ts`, `lib/brief-dedupe.ts`, `lib/content-utils.ts`

1. **Fetch** nine feeds with bounded concurrency (5), a 10 s timeout and one retry
   for network errors / 429 / 5xx (timeouts are not retried). An HTML page in
   place of a feed is reported as a moved feed, not parsed.
2. **Validate the source link.** The item link must be an `http(s)` URL on the
   feed's own publisher host (e.g. `nasa.gov` for NASA feeds); credentials,
   odd ports, `javascript:` and off-site redirectors are rejected. Tracking
   parameters (`utm_*`, `fbclid`, `gclid`, …) are removed.
3. **Summarize** from publisher text only (`buildSummary`): entities decoded,
   markup stripped, WordPress "The post … appeared first on …", truncation
   markers, bilingual cross-links, credits and APOD navigation removed,
   repeated sentences and title echoes dropped, abbreviation-safe sentence
   splitting. If the feed text is thin, the publisher's own article metadata
   (`og:description`) or first paragraphs are used (trusted hosts only, manual
   redirect checks, 6 s timeout). Items still without a usable summary are
   excluded; nothing is generated.
4. **Editorial score** (`assessBrief`, 0–100, accept ≥ 42). Named, weighted
   signals: source credibility, topic relevance (title counts double, word
   boundaries everywhere), positive feed categories, significance verbs; and
   penalties for commerce, entertainment, personnel, events/admin, publicity,
   history listicles, unrelated medicine, static pages and person-name titles.
   People/event penalties are halved when the headline is a strong science
   result, and medicine is exempt in a spaceflight context. Every decision is
   explainable via `reasons`.
5. **Classify** with weighted, word-bounded category evidence and fixed
   precedence (`classifyBrief`); arXiv is always Research.
6. **Deduplicate** with union-find: identical canonical URLs, publisher-declared
   language alternates (NASA's "Read this release in English" / "Lea esta
   nota de prensa en español" links), identical titles, and near-identical
   titles (token Jaccard ≥ 0.72 within 4 days). The representative prefers
   English, a complete summary, an image, a primary source and the publisher's
   own feed.
7. **Feature**: highest composite of relevance, significance, recency (decays
   after 48 h, zero after 10 days), reliability, summary quality and image.
   Items with any negative signal, stale items and APOD are never featured.
8. **Persist and fall back**: records, aliases and a snapshot are written only
   when the published set changes. A failing source contributes its snapshot
   items from the last 14 days (flagged `isStale`); if every source fails the
   whole snapshot is shown with a notice; sample briefs are used only when no
   history exists. An outage never overwrites the snapshot.

**Identity.** `id = "b" + hash(canonical URL)`; `slug = <title-slug>-<id>`. IDs
are independent of feed order and of which feed (NASA vs NASA Science)
supplied the story. `getBriefBySlug` resolves the live list, then the id
suffix, then the alias map. Legacy `"<feed>-<hash>"` and title-index slugs
from earlier releases are recorded as aliases and 308-redirect to the new
slug.

**Indexing.** Brief pages remain source digests: `noindex, follow`, self
canonical, excluded from the sitemap, labelled "Summary from {source}" and
"not original Astroboat reporting".

## Gallery

`services/gallery-service.ts`, `components/gallery/*`

| Source | Role | Notes |
| --- | --- | --- |
| `https://science.nasa.gov/feed/apod-basic/` | Primary APOD | APOD moved to science.nasa.gov in 2026; `apod.nasa.gov` pages and `apod.rss` 301 to `https://science.nasa.gov/apod/`, whose navigation links this feed as RSS. Fields: page link, `apod:hdurl`, credit, copyright, alt, explanation. Video days (embedded player, 48 px poster) are skipped. Renditions use the asset host's `?w=` parameter (800 / 1600 px). |
| `api.nasa.gov/planetary/apod` | Fallback only | Called when the feed fails or yields < 5 images. As of 2026-11-22 it returns placeholder entries (title "NASA Science", the site logo as the image, identical text for every date); these are detected and reported as an upstream failure. |
| NASA Image Library | Archive | Queries only steer discovery. Credit, publisher (NASA center) and observatory come from each item's metadata. Thumbnail `~thumb` (640 px), viewer `~large` (1920 px), HD `~orig`. |
| ESA/Webb, ESA/Hubble, ESO feeds | Original publishers | Exact credit, image type and download renditions come from the official detail page (bounded concurrency 3, cached). Archive types Artwork/Chart/Illustration/Simulation are excluded. |

* **Relevance** (`scoreGalleryCandidate`): hard rejects for portraits, events,
  graphics, renderings, annotated/spectral media and cleanroom/assembly scenes;
  penalties (not rejects) for facilities/hardware, offset only by a natural
  celestial subject in the title; generic people words ("scientists", "team")
  only lower the score.
* **Dedupe** by id, canonical source page, image-file identity across
  renditions/hosts, release id (`weic2620a`) and title, keeping the
  highest-provenance copy (original observatory > APOD > NASA library), with
  at most two images per multi-image release.
* **HD links** are shown only after a HEAD (or 1-byte range GET) confirms the
  URL serves `image/*` (up to 60 per run, re-checked every 14 days).
* **Share links** `/gallery?image=<id>` open from the live collection, or via
  `GET /api/gallery?id=<id>` from durable history once the image has rotated
  out. Opening pushes one history entry, moving between images replaces it,
  Back closes the viewer; `?category=` is kept in the URL.
* **Image loading** (`useImageFallback`): resets synchronously per image,
  detects images that loaded before hydration, fails over after a timeout,
  rejects 1×1 decodes and ends in an explicit unavailable state.

## Monitoring

Server logs (no secrets):

```
[briefs] source=space-com http=200 fetched=20 accepted=10 rejectedEditorial=10 rejectedSummary=0 invalidLinks=0 enriched=0 durationMs=1198
[briefs] published=40 candidates=75 duplicates=5 restored=0 failedSources=none store=redis durationMs=1802
[gallery] source=apod-feed http=200 fetched=30 accepted=24 rejected=6 invalidImages=0 durationMs=413 reasons={"video or interactive APOD":3,…}
NASA APOD API: returned placeholder entries (same text and a site logo for every date). Continuing with available gallery sources.
```

`GET /api/diagnostics/content` returns the latest per-source report (status,
HTTP code, counts, rejection reasons and sample rejected titles). It is open in
development and requires `CONTENT_DIAGNOSTICS_TOKEN` in production (404
otherwise).

## Tests

```bash
npm run test:briefs
npm run test:gallery
npm test
```

Fixtures in `tests/fixtures/` mirror the real feed structures; all network
calls, including a fake Upstash REST server used to prove durability across
cold starts, are mocked in `tests/helpers/harness.cjs`.
