# Astroboat: actions outside the codebase

## Before deployment

1. Read the new [NEO guide](lib/guides.ts), verify its scientific statements against the linked NASA/JPL pages, and confirm `publishedAt` is the actual first public date. Add `updatedAt` only after a real content edit. The guide uses the organization name Astroboat as author.
2. Deploy to the production domain and verify `https://astroboat.in/` redirects in one hop to `https://www.astroboat.in/`. Confirm Vercel has `www.astroboat.in` as the primary domain. The code always emits `www` canonicals regardless of the old `NEXT_PUBLIC_SITE_URL` setting; remove that obsolete variable if configured.
3. Visit `https://www.astroboat.in/robots.txt`, `https://www.astroboat.in/sitemap.xml`, `https://www.astroboat.in/feed.xml`, and the new guide. Check live feed availability and the latest Moon/event timestamps after deployment.

## Google Search Console

1. Add a **Domain property** for `astroboat.in` and verify it using the DNS TXT record Google provides. DNS verification covers both apex and `www`. If DNS access is unavailable, add a URL-prefix property for `https://www.astroboat.in/` and put its HTML-tag token (the `content` value only) into Vercel's `GOOGLE_SITE_VERIFICATION` environment variable, then redeploy.
2. Submit exactly `https://www.astroboat.in/sitemap.xml` in **Sitemaps**. The sitemap already includes `https://www.astroboat.in/guides/what-is-a-near-earth-object`; it does not need a separate sitemap submission.
3. Use **URL Inspection** on `https://www.astroboat.in/`, `https://www.astroboat.in/moon`, `https://www.astroboat.in/asteroids`, and `https://www.astroboat.in/guides/what-is-a-near-earth-object`. Check that the Google-selected canonical matches the declared `www` URL. Monitor Pages and Core Web Vitals after Google recrawls; indexing is not immediate.

## Bing Webmaster Tools

Add the same domain, verify via its DNS method or use its meta-tag token in `BING_SITE_VERIFICATION`, redeploy, and submit `https://www.astroboat.in/sitemap.xml`. Do not block Bingbot or use instant-indexing shortcuts for normal articles.

## Analytics, editorial, and promotion

- GA4 is optional. Create a web data stream and put its `G-...` Measurement ID in `NEXT_PUBLIC_GA_ID` on Vercel, then redeploy. With no ID, no GA script loads. Check privacy obligations and consent requirements for the locations you serve before enabling it. Do not put API keys in public variables.
- Regularly review live-source health and fallback notices. Fix broken image credits or report links. Update guide dates only when text changes.
- Publish a few genuinely useful source-linked guides using `lib/guides.ts`. Set `status: "published"` only after review; draft records are omitted from routes, feed, and sitemap. Link guides contextually from relevant tools.
- Seek relevant, honest links from astronomy communities or collaborators; do not buy links or syndicate copied publisher articles.

## Exact environment variables

| Variable | Required? | Value |
| --- | --- | --- |
| `GOOGLE_SITE_VERIFICATION` | Optional | Google URL-prefix HTML-tag `content` token, if using meta verification |
| `BING_SITE_VERIFICATION` | Optional | Bing Webmaster meta-tag token |
| `NEXT_PUBLIC_GA_ID` | Optional | GA4 web Measurement ID beginning with `G-` |

`GROQ_API_KEY` and `NASA_API_KEY` are existing product settings, unrelated to search verification. Keep them server-side. `NEXT_PUBLIC_SITE_URL` is no longer used for canonical URLs.
