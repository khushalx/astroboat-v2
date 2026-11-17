# Astroboat SEO

## What the site handles

- Canonicals, sitemap URLs, RSS links, and structured data use the production
  canonical host, https://www.astroboat.in. Local preview addresses never become
  public canonical URLs.
- Open Graph and Twitter use the existing Astroboat search banner by default.
  Its declared dimensions match the actual PNG. Guide-specific images can
  override the social preview when provided.
- Article schema describes published guides, their actual publication/edit
  dates, topics, author, and linked references. It only includes an article
  image when one has been supplied; a generic brand banner is not an article
  photograph.
- The guide library has linked topic sections, a CollectionPage/ItemList, and
  breadcrumbs. Every published guide remains in the index, search, RSS, and
  sitemap. No thin category pages or keyword-only pages are created.
- Paused pages and the chatbot remain noindex, follow. They are not in the
  sitemap. Robots allows crawling so search engines can see those directives.
- Publication and modification dates are not bumped just for a deployment.
  Adding metadata does not make an old article newly published.

## Verification

Run npm run build, then start the built app:

    npm run start -- --port 3016

In another terminal:

    npm run test:seo
    SEO_TEST_BASE_URL=http://localhost:3016 npm run test:seo
    GUIDE_TEST_BASE_URL=http://localhost:3016 npm run test:guides
    SEO_AUDIT_BASE_URL=http://localhost:3016 npm run seo:audit

The same URL-based checks can run against https://www.astroboat.in after deploy.
Tests do not contact Google or submit URLs for indexing.

## Separate crawl finding

The local full-link audit found several Briefs detail URLs returning 404 while
still linked from the cached feed page. Feed/detail consistency needs a
separate investigation; this SEO change does not alter Briefs fetching,
retention, or API behavior. The audit deliberately reports these as failures
rather than skipping broken feed links. Guide, sitemap, schema, and metadata
tests run independently.

## Steps requiring the site owner's account

1. Verify the astroboat.in domain property in Google Search Console (DNS is
   preferred). Optional HTML verification tokens can be configured using
   GOOGLE_SITE_VERIFICATION and BING_SITE_VERIFICATION in Vercel; redeploy after
   changing them. These are verification identifiers, not API credentials.
2. Submit https://www.astroboat.in/sitemap.xml in Search Console. URL Inspection
   can check representative guides and request recrawling after meaningful
   changes. Submission does not guarantee indexing or rankings.
3. Use Google's Rich Results Test to inspect a published guide. Markup
   eligibility does not guarantee a rich result; guides with no representative
   image intentionally omit that optional field.
4. Track Search Console impressions, clicks, queries, and indexing for /guides/
   over comparable date ranges. Use country filters to understand the global
   audience, not to force all articles toward one country.
5. Improve articles that earn impressions but few clicks using real query
   evidence. Add useful original explanations and relevant illustrations,
   rather than publishing duplicate topics or changing dates artificially.

## References

- [Google: Article structured data](https://developers.google.com/search/docs/appearance/structured-data/article)
- [Google: Build and submit a sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [Google: Search Console performance reports](https://support.google.com/webmasters/answer/17010961)
- [Next.js: Metadata merging](https://nextjs.org/docs/app/api-reference/functions/generate-metadata#merging)
