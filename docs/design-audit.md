# Astroboat design and functionality audit

Implemented on `codex/observatory-refinement`, 18 November 2026.

## Direction and system

A dark mineral palette, warm ivory text, restrained brass and pale blue accents, DM Serif Display headlines, DM Sans body text, and tabular monospace measurements. Rectangular panels and controls replace decorative rules, floating labels, excessive gradients, glows, and capsule styling. Context stays inside the component it explains.

Shared spacing, page widths, surfaces, controls, focus states, responsive grids, and reading styles live in `app/globals.css` and `app/discovery.css`. The existing Next.js architecture, URLs, APIs, content, metadata, structured data, and source attribution remain in place. No new top-level dependencies were introduced.

## Page review and changes

| Surface | Findings and implementation |
| --- | --- |
| Homepage | Rebalanced text and Earth composition; contained the globe in a rectangular panel; reduced mobile globe height; rebuilt Moon/event snapshots and the five discovery destinations; clarified the assistant invitation. |
| Gallery | Replaced text over photography with a separate caption panel; retained complete descriptions and credits in the viewer; reduced eager image loading; added unobtrusive partial-source status; kept category browsing, search, pagination, random discovery, and shareable URLs. |
| Briefs | Replaced four statistic cards with one source/check summary; simplified metadata and filters; made the lead a current illustrated science story; refined compact rows, image loading/failure states, no-results feedback, and article reading width. |
| Events | Compact date tiles, explicit UTC/year, readable titles, restrained status labels, source and webcast links; removed oversized rows and repeated metadata. Upcoming/Past update as time passes. |
| Moon | Clear phase/illumination dashboard, four facts, and a compact phase calendar. Explicit location, civil date, IST rise/set times, UTC milestones, and illustration orientation. |
| Asteroids | Calm distance explanation, compact metrics and four-value object panels; removed misleading risk shorthand and an unscaled distance bar; PHA remains an orbital classification. Reduced overhead on phones. |
| Ask Astroboat | Integrated conversation panel, prompt boxes, new conversation, bounded scrolling, retry, timeout feedback, composition-safe submission, and source-backed tool links. |
| Guides | Searchable index of all 89 guides, topic anchors, consistent rectangular entries, readable article typography, and an accessible table of contents. |
| Supporting pages | Shared reading width, paragraph rhythm, and boxed sections for About, Contact, Sources, Editorial Policy, Privacy, Terms, and the intentionally paused routes. |
| Shared UI | Refined desktop/mobile navigation, active states, search, footer, focus, touch targets, buttons, loading, empty, failure, and 404 states. Removed the unrelated footer badge and decorative fallback drawings. |

## Verified functional corrections

- The live Moon page showed the previous civil date during the initial audit. USNO requests now use the location's date rather than the UTC date. The local page returned 18 November, waxing gibbous, 58% illumination for Ahmedabad during verification.
- Moon provider failures previously substituted dated sample conditions and milestones. Those samples are now withheld; independently available lunar milestones remain usable. Missing illumination is unavailable; explicit percentages such as `1%` are parsed correctly.
- Upcoming events exclude completed, failed, expired, and sample entries. A stale live flag expires after 24 hours. Homepage limits apply after time filtering so past entries cannot hide the next event.
- ESA's two old Briefs endpoints returned 404. Their replacement ESA-hosted RSS endpoints returned valid XML with 15 entries each. The resulting Briefs page reported seven active feeds without the former ESA failure notices.
- Gallery viewer close/back navigation synchronizes the URL, Escape closes, keyboard focus returns to the trigger, Tab stays in the viewer, and previous/next controls work on phones.
- Assistant retries do not duplicate the user's message. Missing configuration produces a calm unavailable message. Successful live answers require the deployment's existing Groq configuration.
- Data requests for Moon, events, and asteroids have bounded timeouts. Partial gallery feeds are disclosed in an expandable status panel. Provider timeouts produce concise source-specific warnings, and regression tests verify that remaining sources still populate the gallery without fabricated fallback imagery.
- Loading screens are scoped to data routes. The integration suite verifies that unknown guide URLs still return HTTP 404 rather than a streamed HTTP 200.

## Validation

- `npm run build`: production compilation, lint/type validation, and 115 prerendered pages.
- `npm run lint` and `npm run typecheck`.
- 129 automated tests: assistant 15; guides 93; SEO 11; data integrity 10. Guide and SEO HTTP integration checks run against the production server, with no skipped tests.
- Browser review of all eight main pages at 320, 768, 1024, 1440, and 1920px; additional 390px phone checks. No document-level horizontal overflow. Supporting and paused routes also fit 320px.
- Rendered checks include desktop and phone homepage, gallery, Briefs and a source digest, events, Moon, asteroids, assistant, guides and a guide article, informational pages, and 404.
- Interaction checks: gallery search/filter/random/load-more/viewer navigation/Escape/focus/back; Briefs no-results; asteroid filters; guide search; navigation dismissal; global search; assistant retry and reset.
- Core text tokens have strong contrast; visible keyboard focus and reduced-motion handling are shared across the app. Existing WebGL pause/offscreen/hidden-tab cleanup is retained.
- `git diff --check`.

## Limits and follow-up

- The local checkout has no Groq key. Assistant request/error UI and 15 provider-mocked tests are verified; a real provider answer is not verified locally.
- Astronomy feeds and remote images can time out or rate-limit. The application retains attribution and communicates unavailable/partial data; it does not invent replacement scientific facts.
- Compatible dependency security patches updated the lockfile, including Next.js 15.5.18 to 15.5.29. Audit findings reduced from 30 (one critical) to 22 (zero critical). Remaining advisories involve XML parsing and the existing build/tooling dependency tree; major framework, parser, and Tailwind migrations were not folded into the visual refresh.
- Responsive inspection and production bundle output were checked; no laboratory Lighthouse/Core Web Vitals score or real mid-range device measurement is claimed.

Run locally with `npm ci` and `npm run dev`. Screenshots are stored alongside this report in `docs/screenshots/`.

## Final captures

- [Desktop homepage](screenshots/home-desktop.jpg)
- [Phone homepage](screenshots/home-mobile.jpg)
- [Desktop gallery](screenshots/gallery-desktop.jpg)
- [Lunar dashboard](screenshots/moon-desktop.jpg)

## Event image refinement

Rocket and spacecraft photographs now lead event cards at up to 320 × 208px on desktop (previously 112 × 96px). Images remain visible across the card width on phones; cards without source images stay compact. Date tiles, text columns, padding, and tablet sizing were rebalanced. Browser checks at 320, 390, 768, 1024, and 1440px showed no horizontal overflow. The production build validates compilation, lint, and types.
