// Briefs pipeline: editorial relevance, summaries, dedupe, stable identity,
// durable history and source-link validation. Network access is fully mocked
// with fixtures that mirror the structure of the real feeds.
const assert = require("node:assert/strict");
const test = require("node:test");
const { loadModule, fixture, createFakeRedis, routeFetch } = require("./helpers/harness.cjs");

const DAY = 86_400_000;
const rfc822 = (daysAgo) => new Date(Date.now() - daysAgo * DAY - 3_600_000).toUTCString();
const dated = (xml) => xml.replace(/\{\{DATE_(\d)\}\}/g, (_, days) => rfc822(Number(days)));
const xml = (body) => ({ status: 200, body, headers: { "content-type": "application/rss+xml" } });

function feedRoutes(overrides = {}) {
  const feeds = {
    "https://www.nasa.gov/news-release/feed/": dated(fixture("briefs", "nasa-news.xml")),
    "https://science.nasa.gov/feed/": dated(fixture("briefs", "nasa-science.xml")),
    "https://www.space.com/feeds.xml": dated(fixture("briefs", "spacecom.xml")),
    ...overrides
  };
  return [
    ...Object.entries(feeds).map(([url, body]) => [new RegExp(`^${url.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`), () => (typeof body === "function" ? body() : xml(body))]),
    ["https://www.space.com/astronomy/einstein-cross-distant-galaxy", () => ({ status: 200, body: fixture("briefs", "einstein-cross-article.html"), headers: { "content-type": "text/html; charset=utf-8" } })],
    ["https://cdn.mos.cms.futurecdn.net/", () => ({ status: 200, body: "", headers: { "content-type": "image/jpeg" } })],
    // Every other configured feed (Artemis, ESA, arXiv, APOD, Universe Today) is valid but empty.
    [/\/(feed|rss|feeds)(\.xml|\.rss|\/)|apod-basic|astro-ph|\.rss$/, () => xml(fixture("briefs", "empty.xml"))]
  ];
}

function loadBriefs({ routes = feedRoutes(), redis } = {}) {
  const fetch = routeFetch(routes, { redis });
  const service = loadModule("services/briefs-service.ts", { fetch, process: { env: redis ? redis.env : {} } });
  return { service, fetch };
}

const editorial = loadModule("lib/brief-editorial.ts");
const assess = (title, summary, extra = {}) =>
  editorial.assessBrief({ title, summary, url: extra.url ?? "https://www.nasa.gov/news/example/", feedCategories: extra.categories ?? [], credibility: extra.credibility ?? "Primary", sourceFeedId: extra.sourceFeedId ?? "nasa-news" });

test("NASA biographies, appointments and personnel announcements are rejected with reasons", () => {
  const cases = [
    ["NASA Names Troy Asher Armstrong Flight Research Center Director", "NASA has named Troy Asher as director of the Armstrong Flight Research Center.", {}],
    ["Contractor to Civil Servant: NASA Welcomes Jared Spiers", "Jared Spiers has joined the NASA workforce as a civil servant engineer.", {}],
    ["David J. Miranda", "David J. Miranda is a program analyst supporting the science mission directorate.", { url: "https://www.nasa.gov/people/david-j-miranda/" }],
    ["National Space Club Scholars Meeting", "Students met with mentors during a meeting to discuss internships and careers.", {}]
  ];
  for (const [title, summary, extra] of cases) {
    const result = assess(title, summary, extra);
    assert.equal(result.decision, "reject", `${title} should be rejected (score ${result.score})`);
    assert.ok(result.reasons.some((reason) => /personnel|person-name|event-admin|no-astronomy/.test(reason)), `${title}: ${result.reasons.join("; ")}`);
  }
});

test("shopping, promotional and entertainment stories are rejected even when they mention stars or planets", () => {
  const projector = assess(
    "This viral star projector has been hyped to Mars and back, but we hunted down the best version you can buy",
    "The adverts for this Galaxy Projector Night Light are bizarre — we found a version that delivers stars and planets on your ceiling.",
    { url: "https://www.space.com/stargazing/skywatching-kit/viral-star-projector", categories: ["Skywatching Kit", "Stargazing"], credibility: "Editorial", sourceFeedId: "space-com" }
  );
  assert.equal(projector.decision, "reject");
  assert.ok(projector.reasons.some((reason) => reason.startsWith("commerce")));

  const review = assess("'Star Trek: First Contact' at 30: Resistance is futile", "How cyber-zombies gave Picard one of his finest hours.", {
    url: "https://www.space.com/entertainment/space-movies-shows/star-trek-first-contact-at-30-review",
    categories: ["Space Movies & Shows", "Entertainment"],
    credibility: "Editorial",
    sourceFeedId: "space-com"
  });
  assert.equal(review.decision, "reject");
  assert.ok(review.reasons.some((reason) => reason.startsWith("entertainment")));
});

test("legitimate Webb discoveries and NASA mission launches are accepted", () => {
  const webb = assess(
    "NASA's Webb Telescope Discovers Carbon Dioxide in the Atmosphere of a Distant Exoplanet",
    "The James Webb Space Telescope captured the first clear evidence of carbon dioxide in the atmosphere of a gas giant planet 700 light-years away.",
    { categories: ["Exoplanets", "James Webb Space Telescope"], sourceFeedId: "nasa-science" }
  );
  assert.equal(webb.decision, "accept");
  assert.equal(webb.featureEligible, true);

  const launch = assess(
    "NASA's Europa Clipper Launches on Journey to Jupiter's Icy Moon",
    "Europa Clipper lifted off aboard a Falcon Heavy rocket, beginning a five-year journey to study whether Jupiter's moon Europa could support life.",
    { categories: ["Europa Clipper", "Missions"] }
  );
  assert.equal(launch.decision, "accept");
});

test("scientific relevance protects against single-word false positives", () => {
  // A discovery led by a newly appointed scientist is still science.
  const appointedDiscovery = assess(
    "Newly Appointed Mission Scientist Discovers Water Ice in Lunar Crater",
    "Using data from the Lunar Reconnaissance Orbiter, the team detected water ice in a permanently shadowed crater near the Moon's south pole."
  );
  assert.equal(appointedDiscovery.decision, "accept", appointedDiscovery.reasons.join("; "));

  // Medically relevant spaceflight research is in scope; unrelated medicine is not.
  const spaceflightMedicine = assess(
    "Space Station Experiment Tracks How Astronauts' Bones Change in Microgravity",
    "Researchers aboard the International Space Station measured bone density changes in astronauts during six-month missions in microgravity."
  );
  assert.equal(spaceflightMedicine.decision, "accept", spaceflightMedicine.reasons.join("; "));
  const unrelatedMedicine = assess("New Cancer Drug Shows Promise for Hospital Patients", "A clinical trial found a new drug helped patients in hospitals.");
  assert.equal(unrelatedMedicine.decision, "reject");

  // A mission hardware milestone must not be mistaken for a personnel story.
  const hardware = assess("Artemis III SLS Core Stage Joins Boosters at Kennedy", "Teams stacked the Space Launch System core stage for the Artemis III mission to the Moon.", { categories: ["Artemis"] });
  assert.equal(hardware.decision, "accept", hardware.reasons.join("; "));
});

test("category classification uses weighted, word-bounded evidence", () => {
  const classify = (title, summary, sourceFeedId = "nasa-news") => editorial.classifyBrief({ title, summary, feedCategories: [], sourceFeedId });
  assert.equal(classify("Planetarium opens on Sunday with new permission rules", "Visitors can book tickets for the planetarium on Sunday."), "Space News");
  assert.equal(classify("Sunspots Launch Plasma Jets Across the Sun", "Sound waves from sunspots drive jets into the solar corona."), "Solar / Space Weather");
  assert.equal(classify("Webb Finds a Galaxy Cluster Bending Light", "The galaxy cluster acts as a gravitational lens for distant galaxies."), "Astrophysics");
  assert.equal(classify("BepiColombo Arrives in Orbit Around Mercury", "The spacecraft reached orbit around Mercury."), "Planetary Science");
  assert.equal(classify("A dusty disc around a young star", "We model the disc.", "arxiv-astro-ph"), "Research");
});

test("summaries drop publisher boilerplate, entities, truncation markers and repeated title text", () => {
  const { buildSummary } = loadModule("lib/content-utils.ts");
  const summary = buildSummary(
    "NASA&#8217;s Webb Telescope Finds Carbon Dioxide. NASA&#8217;s James Webb Space Telescope captured the first clear evidence of carbon dioxide in a distant planet&#8217;s atmosphere. The detection helps researchers study planet formation. The post NASA&#8217;s Webb Telescope Finds Carbon Dioxide appeared first on NASA Science . [&#8230;]",
    { title: "NASA’s Webb Telescope Finds Carbon Dioxide" }
  );
  assert.equal(summary.quality, "good");
  assert.doesNotMatch(summary.text, /appeared first|&#|\[…\]|\[&/);
  assert.match(summary.text, /^NASA’s James Webb Space Telescope captured/);
  assert.equal(summary.text.split("NASA’s James Webb").length, 2, "no repeated sentences");

  const abbreviation = buildSummary("This Nov. 16 collage shows 49 drill holes captured by the Curiosity rover. Each hole represents a rock sample from Mars.");
  assert.match(abbreviation.text, /^This Nov\. 16 collage/);

  const leak = buildSummary('Credit: NASA" width="1280" height="720" /> The European Space Agency released new data from the Euclid mission covering a billion galaxies across the sky.');
  assert.match(leak.text, /^The European Space Agency released/);
});

test("the pipeline publishes relevant briefs and explains every rejection", async () => {
  const { service } = loadBriefs();
  const result = await service.getAstronomyBriefs();
  const titles = result.briefs.map((brief) => brief.title);

  assert.ok(titles.includes("NASA’s Webb Telescope Discovers Carbon Dioxide in the Atmosphere of a Distant Exoplanet"));
  assert.ok(titles.some((title) => title.startsWith("NASA’s Europa Clipper Launches")));
  for (const unwanted of [/Troy Asher/, /Jared Spiers/, /David J\. Miranda/, /Scholars Meeting/, /star projector/, /Star Trek/]) {
    assert.ok(!titles.some((title) => unwanted.test(title)), `${unwanted} must not be published`);
  }

  const diagnostics = await service.getBriefDiagnostics();
  assert.ok(diagnostics.latest.rejectedSamples.some((sample) => /star projector/.test(sample.title) && sample.reasons.some((reason) => /commerce/.test(reason))));
  const spacecom = diagnostics.latest.sources.find((source) => source.id === "space-com");
  assert.equal(spacecom.ok, true);
  assert.equal(spacecom.rejectedEditorial, 2);
});

test("English and Spanish versions of one NASA release become a single English brief", async () => {
  const { service } = loadBriefs();
  const result = await service.getAstronomyBriefs();
  const dragonfly = result.briefs.filter((brief) => /Dragonfly/i.test(brief.title));
  assert.equal(dragonfly.length, 1);
  assert.equal(dragonfly[0].title, "Send Your Name to Titan Aboard NASA’s Dragonfly Mission");
  assert.equal(dragonfly[0].originalUrl, "https://www.nasa.gov/news-release/send-your-name-to-titan-aboard-nasas-dragonfly-mission/");
  assert.doesNotMatch(dragonfly[0].summary[0], /Lea esta|aquí/);
});

test("tracking parameters do not defeat cross-feed URL deduplication and are stripped from source links", async () => {
  const { service } = loadBriefs();
  const result = await service.getAstronomyBriefs();
  const clipper = result.briefs.filter((brief) => /Europa Clipper/.test(brief.title));
  assert.equal(clipper.length, 1, "NASA and NASA Science copies merge");
  assert.equal(clipper[0].originalUrl, "https://www.nasa.gov/news-release/nasas-europa-clipper-launches-on-journey-to-jupiters-icy-moon/");
  // The more complete NASA release summary wins over the one-line NASA Science copy.
  assert.match(clipper[0].summary[0], /Falcon Heavy/);

  const cross = result.briefs.find((brief) => /Einstein cross/.test(brief.title));
  assert.equal(cross.originalUrl, "https://www.space.com/astronomy/einstein-cross-distant-galaxy");
});

test("source links must be valid http(s) URLs on the feed's own publisher host", async () => {
  const { service } = loadBriefs();
  const result = await service.getAstronomyBriefs();
  assert.ok(!result.briefs.some((brief) => /Unsafe Link|Off-Site Link/.test(brief.title)));
  for (const brief of result.briefs) {
    const url = new URL(brief.originalUrl);
    assert.equal(url.protocol, "https:");
    assert.ok(!/utm_|fbclid/.test(url.search), brief.originalUrl);
  }
  const diagnostics = await service.getBriefDiagnostics();
  assert.equal(diagnostics.latest.sources.find((source) => source.id === "nasa-science").invalidLinks, 2);
});

test("a thin feed description is completed from the publisher's own article metadata", async () => {
  const { service, fetch } = loadBriefs();
  const result = await service.getAstronomyBriefs();
  const cross = result.briefs.find((brief) => /Einstein cross/.test(brief.title));
  assert.match(cross.summary[0], /^Astronomers using the Hubble Space Telescope have found a rare Einstein cross/);
  assert.equal(cross.imageUrl, "https://cdn.mos.cms.futurecdn.net/einstein-cross-1200-80.jpg");
  // Off-topic items are never enriched (no request for the projector article).
  assert.ok(!fetch.calls.some((call) => call.url.includes("viral-star-projector")));
});

test("brief IDs and slugs are stable, source-independent and derived from the canonical URL", async () => {
  const first = await loadBriefs().service.getAstronomyBriefs();
  // Reverse the feed item order: IDs must not depend on feed position.
  const reversed = feedRoutes({
    "https://www.nasa.gov/news-release/feed/": () => {
      const body = dated(fixture("briefs", "nasa-news.xml"));
      const items = body.match(/<item>[\s\S]*?<\/item>/g);
      return xml(body.replace(/<item>[\s\S]*<\/item>/, items.reverse().join("\n")));
    }
  });
  const second = await loadBriefs({ routes: reversed }).service.getAstronomyBriefs();

  const byTitle = (result) => new Map(result.briefs.map((brief) => [brief.title, brief]));
  const a = byTitle(first);
  const b = byTitle(second);
  for (const [title, brief] of a) {
    assert.equal(b.get(title)?.id, brief.id, title);
    assert.equal(b.get(title)?.slug, brief.slug, title);
    assert.match(brief.slug, /^[a-z0-9-]+-b[0-9a-z]{6,12}$/);
  }

  const { createBriefId } = loadModule("services/briefs-service.ts", { fetch: async () => new Response("", { status: 503 }) });
  assert.equal(
    createBriefId("http://nasa.gov/news-release/x/?utm_source=rss#top"),
    createBriefId("https://www.nasa.gov/news-release/x")
  );
});

test("featured story is chosen for scientific relevance, not recency", async () => {
  const { service } = loadBriefs();
  const result = await service.getAstronomyBriefs();
  const featured = result.briefs.find((brief) => brief.id === result.featuredId);
  assert.ok(featured, "a featured brief is selected");
  assert.match(featured.title, /Webb|Europa Clipper|Einstein cross/);
  // The newest items in the fixture are the projector, Star Trek and a bio page.
  assert.doesNotMatch(featured.title, /projector|Star Trek|Miranda/);

  const { getFeaturedBrief } = loadModule("components/briefs/brief-utils.ts");
  assert.equal(getFeaturedBrief(result.briefs).id, result.featuredId);
  assert.equal(getFeaturedBrief([{ ...result.briefs[0], featureScore: 0 }]), undefined, "nothing is featured when no brief qualifies");
});

test("old brief links resolve after the story leaves the live feed (durable store, new process)", async () => {
  const redis = createFakeRedis();
  const firstRun = loadBriefs({ redis });
  const live = await firstRun.service.getAstronomyBriefs();
  const webb = live.briefs.find((brief) => /Webb Telescope Discovers/.test(brief.title));
  assert.ok(webb);
  assert.ok(redis.hash("briefs:records").has(webb.id));

  // A later cold start: the Webb story is gone from every feed.
  const laterRoutes = feedRoutes({ "https://science.nasa.gov/feed/": xml(fixture("briefs", "empty.xml")) });
  const laterRun = loadBriefs({ routes: laterRoutes, redis });
  const later = await laterRun.service.getAstronomyBriefs();
  assert.ok(!later.briefs.some((brief) => brief.id === webb.id), "no longer in the live list");

  const resolved = await laterRun.service.getBriefBySlug(webb.slug);
  assert.equal(resolved?.id, webb.id);
  assert.equal(resolved?.title, webb.title);
  assert.equal(resolved?.originalUrl, webb.originalUrl);

  // Earlier releases used "<feed>-<hash>" slugs; those keep resolving (and the page redirects).
  const legacy = [...redis.hash("briefs:aliases").entries()].find(([alias, id]) => id === `"${webb.id}"` && alias.startsWith("nasa-science-"));
  assert.ok(legacy, "legacy slug alias recorded");
  const viaLegacy = await laterRun.service.getBriefBySlug(legacy[0]);
  assert.equal(viaLegacy?.slug, webb.slug);

  assert.equal(await laterRun.service.getBriefBySlug("not-a-real-brief-b0000000000"), undefined);
  assert.equal(await laterRun.service.getBriefBySlug("../../etc/passwd"), undefined);
});

test("a failing source keeps its last verified briefs, marked stale, instead of disappearing", async () => {
  const redis = createFakeRedis();
  await loadBriefs({ redis }).service.getAstronomyBriefs();

  const outage = feedRoutes({ "https://science.nasa.gov/feed/": () => ({ status: 503, body: "unavailable" }) });
  const result = await loadBriefs({ routes: outage, redis }).service.getAstronomyBriefs();
  const webb = result.briefs.find((brief) => /Webb Telescope Discovers/.test(brief.title));
  assert.ok(webb, "restored from the snapshot");
  assert.equal(webb.isStale, true);
  assert.equal(webb.featureScore, 0, "stale items are never featured");
  assert.ok(result.warnings.some((warning) => /most recent verified briefs/.test(warning)));
  assert.equal(result.sourceStatuses.find((status) => status.id === "nasa-science").staleCount, 1);
});

test("when every source fails the last verified snapshot is served before sample data", async () => {
  const redis = createFakeRedis();
  await loadBriefs({ redis }).service.getAstronomyBriefs();

  const down = [[/.*/, () => ({ status: 503, body: "down" })]];
  const stale = await loadBriefs({ routes: down, redis }).service.getAstronomyBriefs();
  assert.equal(stale.isStale, true);
  assert.equal(stale.isFallback, false);
  assert.ok(stale.briefs.length > 0);
  assert.ok(stale.briefs.every((brief) => brief.isStale));

  const empty = await loadBriefs({ routes: down }).service.getAstronomyBriefs();
  assert.equal(empty.isFallback, true, "sample briefs only when no history exists");
});
