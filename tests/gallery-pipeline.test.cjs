// Gallery pipeline: APOD sources and fallbacks, attribution, HD verification,
// duplicate removal, relevance filters, durable share links and the client
// image-fallback logic. All network access is mocked.
const assert = require("node:assert/strict");
const test = require("node:test");
const { loadModule, fixture, createFakeRedis, routeFetch } = require("./helpers/harness.cjs");

const APOD_FEED = /^https:\/\/science\.nasa\.gov\/feed\/apod-basic\/$/;
const APOD_API = /^https:\/\/api\.nasa\.gov\/planetary\/apod/;
const LIBRARY = /^https:\/\/images-api\.nasa\.gov\/search/;
const image = { status: 200, body: "", headers: { "content-type": "image/jpeg" } };
const rss = (body) => ({ status: 200, body, headers: { "content-type": "application/rss+xml" } });
const html = (body) => ({ status: 200, body, headers: { "content-type": "text/html" } });

function libraryItem({ nasaId, title, description, keywords = [], center = "JPL", secondaryCreator, photographer, links }) {
  return {
    data: [{ nasa_id: nasaId, title, description, keywords, center, media_type: "image", date_created: "2025-06-01T00:00:00Z", secondary_creator: secondaryCreator, photographer }],
    links: links ?? [
      { rel: "preview", render: "image", href: `https://images-assets.nasa.gov/image/${nasaId}/${nasaId}~thumb.jpg` },
      { rel: "alternate", render: "image", href: `https://images-assets.nasa.gov/image/${nasaId}/${nasaId}~medium.jpg` },
      { rel: "alternate", render: "image", href: `https://images-assets.nasa.gov/image/${nasaId}/${nasaId}~large.jpg` },
      { rel: "canonical", render: "image", href: `https://images-assets.nasa.gov/image/${nasaId}/${nasaId}~orig.jpg` }
    ]
  };
}

const LIBRARY_ITEMS = [
  libraryItem({
    nasaId: "PIA10392",
    title: "NGC 6090 - a Pair of Spiral Galaxies",
    description: "This Hubble Space Telescope image shows a pair of interacting spiral galaxies.",
    keywords: ["Hubble Space Telescope"],
    secondaryCreator: "NASA, ESA, the Hubble Heritage Team (STScI/AURA)"
  }),
  libraryItem({
    nasaId: "PIA04603",
    title: "Cassini Spacecraft in a JPL Assembly Room",
    description: "The Cassini spacecraft is prepared in a cleanroom before launch.",
    keywords: ["Cassini"]
  }),
  libraryItem({
    nasaId: "PIA99999",
    title: "Saturn's Rings in Natural Color",
    description: "Cassini captured Saturn's rings and the planet's shadow.",
    keywords: ["Cassini", "Saturn"],
    // The library canonical link sometimes points to a non-image resource.
    links: [
      { rel: "preview", render: "image", href: "https://images-assets.nasa.gov/image/PIA99999/PIA99999~thumb.jpg" },
      { rel: "canonical", render: "image", href: "https://images-assets.nasa.gov/image/PIA99999/PIA99999~orig.jpg" }
    ]
  })
];

function routes({ apodFeed = () => rss(fixture("gallery", "apod-basic.xml")), apodApi, library = LIBRARY_ITEMS, extra = [] } = {}) {
  return [
    ...extra,
    [APOD_FEED, apodFeed],
    [APOD_API, apodApi ?? (() => ({ status: 503, body: "" }))],
    [LIBRARY, () => ({ status: 200, body: JSON.stringify({ collection: { items: library } }), headers: { "content-type": "application/json" } })],
    ["https://esawebb.org/images/feed/", () => rss(fixture("gallery", "webb-feed.xml"))],
    ["https://esawebb.org/images/weic2620a/", () => html(fixture("gallery", "webb-detail-weic2620a.html"))],
    ["https://esawebb.org/images/weic2618b/", () => html(fixture("gallery", "webb-detail-weic2618b.html"))],
    ["https://images-assets.nasa.gov/image/PIA99999/PIA99999~orig.jpg", () => ({ status: 200, body: "<html></html>", headers: { "content-type": "text/html" } })],
    [/^https:\/\/(images-assets\.nasa\.gov|assets\.science\.nasa\.gov|cdn\.esawebb\.org)\//, () => image],
    ["https://esahubble.org/images/feed/", () => ({ status: 503, body: "" })],
    ["https://www.eso.org/public/images/feed/", () => ({ status: 503, body: "" })]
  ];
}

function loadGallery(options = {}) {
  const fetch = routeFetch(routes(options), { redis: options.redis });
  const service = loadModule("services/gallery-service.ts", { fetch, process: { env: { ...(options.redis?.env ?? {}), ...(options.env ?? {}) } } });
  return { service, fetch };
}

test("the official APOD feed supplies images with page links, renditions, credit and rights", async () => {
  const { service } = loadGallery();
  const result = await service.getGalleryData();
  const horsehead = result.images.find((img) => img.id === "apod-2026-11-19");

  assert.ok(horsehead, "APOD image present");
  assert.equal(horsehead.title, "The Horsehead and Flame Nebulas");
  assert.equal(horsehead.source, "NASA APOD");
  assert.equal(horsehead.sourceUrl, "https://science.nasa.gov/image-article/apod-2026-november-19-the-horsehead-and-flame-nebulas/");
  assert.equal(horsehead.credit, "Mark E. Killion");
  assert.equal(horsehead.rights, "Copyright: Mark E. Killion");
  assert.match(horsehead.thumbnailUrl, /Horsehead_Nebula_Killion\.jpg\?w=800&fit=clip$/);
  assert.match(horsehead.imageUrl, /Horsehead_Nebula_Killion\.jpg\?w=1600&fit=clip$/);
  assert.equal(horsehead.alt, "A dark horse-head shaped cloud of dust appears against a glowing red nebula.");
  assert.doesNotMatch(horsehead.description, /Explanation:|Tomorrow/);
  assert.equal(horsehead.category, "Nebulae");

  // A video day exposes only a 48px poster thumbnail; it is not shown as an image.
  assert.ok(!result.images.some((img) => img.id === "apod-2026-11-08"));
  // A link to a video inside the explanation text does not make an image a video.
  assert.ok(!result.warnings.some((warning) => /APOD/.test(warning)));
});

test("APOD feed failure falls back to the API, and placeholder API data is never shown", async () => {
  const placeholder = Array.from({ length: 5 }, (_, i) => ({
    date: `2026-11-1${i}`,
    title: "NASA Science",
    media_type: "image",
    explanation: "Identical text for every date.",
    url: "https://science.nasa.gov/wp-content/themes/nasa-child/assets/images/nasa-logo@2x.png",
    hdurl: "https://science.nasa.gov/wp-content/themes/nasa-child/assets/images/nasa-logo@2x.png"
  }));
  const { service, fetch } = loadGallery({
    apodFeed: () => ({ status: 200, body: "<!doctype html><html><title>APOD - NASA Science</title></html>", headers: { "content-type": "text/html" } }),
    apodApi: () => ({ status: 200, body: JSON.stringify(placeholder), headers: { "content-type": "application/json" } })
  });
  const result = await service.getGalleryData();

  assert.ok(fetch.calls.some((call) => APOD_API.test(call.url)), "API is tried when the feed fails");
  assert.ok(!result.images.some((img) => img.source === "NASA APOD"));
  assert.ok(!result.images.some((img) => /nasa-logo|\/themes\//.test(img.imageUrl)));
  assert.ok(result.warnings.some((warning) => warning.includes("NASA APOD")));
  assert.ok(result.images.length > 0, "other sources still populate the gallery");

  const diagnostics = await service.getGalleryDiagnostics();
  const api = diagnostics.latest.sources.find((source) => source.id === "apod-api");
  assert.equal(api.upstreamFailed, true);
  assert.match(api.error, /placeholder/);
});

test("a valid APOD API response is used when the feed is down, with the configured key", async () => {
  const entries = [
    { date: "2026-11-19", title: "The Horsehead and Flame Nebulas", media_type: "image", explanation: "The dark Horsehead Nebula and the Flame Nebula in Orion.", url: "https://apod.nasa.gov/apod/image/2611/Horsehead_1024.jpg", hdurl: "https://apod.nasa.gov/apod/image/2611/Horsehead.jpg", copyright: "Mark E. Killion" },
    { date: "2026-11-18", title: "A Medium-Sized Solar Flare", media_type: "image", explanation: "A solar flare erupts from the Sun's surface, seen by the Solar Dynamics Observatory.", url: "https://apod.nasa.gov/apod/image/2611/flare_1024.jpg" },
    { date: "2026-11-17", title: "Leonids", media_type: "video", explanation: "A video of meteors.", url: "https://www.youtube.com/embed/x" }
  ];
  const { service, fetch } = loadGallery({
    env: { NASA_API_KEY: "configured-test-key" },
    apodFeed: () => ({ status: 503, body: "" }),
    apodApi: () => ({ status: 200, body: JSON.stringify(entries), headers: { "content-type": "application/json" } }),
    extra: [[/^https:\/\/apod\.nasa\.gov\/apod\/image\//, () => image]]
  });
  const result = await service.getGalleryData();
  const apiCall = fetch.calls.find((call) => APOD_API.test(call.url));
  assert.match(apiCall.url, /api_key=configured-test-key/);

  const apod = result.images.filter((img) => img.source === "NASA APOD");
  assert.deepEqual(Array.from(apod, (img) => img.id).sort(), ["apod-2026-11-18", "apod-2026-11-19"]);
  const horsehead = apod.find((img) => img.id === "apod-2026-11-19");
  assert.equal(horsehead.credit, "Mark E. Killion");
  assert.equal(horsehead.hdImageUrl, "https://apod.nasa.gov/apod/image/2611/Horsehead.jpg");
});

test("the same APOD day from the feed and the API appears once, preferring the feed copy", async () => {
  // A sparse feed (<5 images) also triggers the API, so both copies arrive.
  const { service } = loadGallery({
    apodApi: () => ({
      status: 200,
      headers: { "content-type": "application/json" },
      body: JSON.stringify([{ date: "2026-11-19", title: "The Horsehead and Flame Nebulas", media_type: "image", explanation: "The Horsehead Nebula in Orion.", url: "https://apod.nasa.gov/apod/image/2611/Horsehead_1024.jpg" }])
    }),
    extra: [[/^https:\/\/apod\.nasa\.gov\/apod\/image\//, () => image]]
  });
  const result = await service.getGalleryData();
  const copies = result.images.filter((img) => img.id === "apod-2026-11-19");
  assert.equal(copies.length, 1);
  assert.equal(copies[0].sourceUrl, "https://science.nasa.gov/image-article/apod-2026-november-19-the-horsehead-and-flame-nebulas/");
});

test("an image published by ESA/Webb and republished by APOD appears once, from the original publisher", async () => {
  const { service } = loadGallery();
  const result = await service.getGalleryData();
  const ngc7129 = result.images.filter((img) => /NGC 7129/.test(img.title));
  assert.equal(ngc7129.length, 1);
  assert.equal(ngc7129[0].id, "esa-webb-weic2620a");
});

test("archive credits come from the official detail page; annotated images and charts are excluded", async () => {
  const { service } = loadGallery();
  const result = await service.getGalleryData();
  const webb = result.images.find((img) => img.id === "esa-webb-weic2620a");

  assert.equal(webb.credit, "NASA, ESA, CSA, STScI; Image Processing: A. Pagan (STScI)");
  assert.equal(webb.publisher, "ESA/Webb");
  assert.equal(webb.source, "ESA / Webb");
  assert.equal(webb.sourceUrl, "https://esawebb.org/images/weic2620a/");
  assert.equal(webb.rightsUrl, "https://esawebb.org/copyright/");
  assert.equal(webb.hdImageUrl, "https://cdn.esawebb.org/archives/images/large/weic2620a.jpg");
  assert.equal(webb.observatory, "James Webb Space Telescope");

  assert.ok(!result.images.some((img) => img.id === "esa-webb-weic2621c"), "annotated image excluded");
  assert.ok(!result.images.some((img) => img.id === "esa-webb-weic2618b"), "archive type 'Chart' excluded");
});

test("NASA Image Library attribution comes from item metadata, never from the search query", async () => {
  const { service } = loadGallery();
  const result = await service.getGalleryData();
  const galaxies = result.images.find((img) => img.id === "nasa-lib-pia10392");

  assert.equal(galaxies.source, "NASA Image Library");
  assert.equal(galaxies.observatory, "Hubble Space Telescope");
  assert.equal(galaxies.credit, "NASA, ESA, the Hubble Heritage Team (STScI/AURA)");
  assert.equal(galaxies.publisher, "NASA Jet Propulsion Laboratory");
  assert.equal(galaxies.sourceUrl, "https://images.nasa.gov/details/PIA10392");
  assert.equal(galaxies.thumbnailUrl, "https://images-assets.nasa.gov/image/PIA10392/PIA10392~thumb.jpg");
  // The viewer shows the 1920px rendition, not the 640px preview.
  assert.equal(galaxies.imageUrl, "https://images-assets.nasa.gov/image/PIA10392/PIA10392~large.jpg");
  assert.ok(!result.images.some((img) => img.source === "ESA / Webb" && img.id.startsWith("nasa-lib-")));
});

test("HD links are only offered after the URL is confirmed to serve an image", async () => {
  const { service } = loadGallery();
  const result = await service.getGalleryData();
  const verified = result.images.find((img) => img.id === "nasa-lib-pia10392");
  assert.equal(verified.hdImageUrl, "https://images-assets.nasa.gov/image/PIA10392/PIA10392~orig.jpg");

  const notAnImage = result.images.find((img) => img.id === "nasa-lib-pia99999");
  assert.ok(notAnImage, "the image itself is still shown");
  assert.equal(notAnImage.hdImageUrl, undefined, "a canonical link that returns HTML is not presented as HD");
});

test("relevance scoring keeps real science images and rejects hardware, people and graphics", () => {
  const { scoreGalleryCandidate } = loadModule("services/gallery-service.ts", { fetch: async () => new Response("", { status: 503 }) });
  const score = (title, description = "An observation of the night sky.", extra = {}) =>
    scoreGalleryCandidate({ title, description, url: "https://cdn.eso.org/images/screen/x.jpg", credit: "ESO", ...extra }).verdict;

  // Generic words such as "scientists" or "team" do not reject genuine observations.
  assert.equal(score("Scientists map the Carina Nebula in infrared", "Webb imaged the Carina Nebula's star-forming cliffs."), "include");
  assert.equal(score("Webb team reveals a distant galaxy cluster", "The galaxy cluster bends light from background galaxies."), "include");
  assert.equal(score("ALMA antennas under the Milky Way", "The Milky Way arcs over ALMA on the Chajnantor plateau."), "include");
  assert.equal(score("Researchers capture the Crab Nebula's expanding filaments", "The supernova remnant's filaments were imaged over two decades."), "include");

  assert.equal(score("Cassini Spacecraft in a JPL Assembly Room", "The spacecraft is prepared before launch.", { credit: "NASA/JPL" }), "reject");
  assert.equal(score("ESO staff inspect segment of the main mirror", "Staff inspect a mirror segment."), "reject");
  assert.equal(score("ELT Technical Facility at Paranal with the latest batch of M1 segments", "Segments stored inside the facility."), "reject");
  assert.equal(score("NASA Administrator speaks at a press conference", "The administrator addressed reporters."), "reject");
  assert.equal(score("Detecting two rings of debris around a white dwarf", "This diagram shows how astronomers infer a gaseous disc."), "reject");
  assert.equal(score("Artist's impression of the debris disc", "An illustration."), "reject");
  assert.equal(score("Spiral galaxy", "A galaxy.", { url: "https://science.nasa.gov/wp-content/themes/nasa-child/assets/images/nasa-logo@2x.png" }), "reject");
  assert.equal(score("Spiral galaxy", "A galaxy.", { url: "javascript:alert(1)" }), "reject");
});

test("gallery categories follow the subject, not incidental words", () => {
  const { detectCategory } = loadModule("services/gallery-service.ts", { fetch: async () => new Response("", { status: 503 }) });
  assert.equal(detectCategory("Haunting the Cepheus Flare", [], "Dusty nebulae drift through the Cepheus Flare region."), "Nebulae");
  // "from Earth" in a description is not an Earth image.
  assert.notEqual(detectCategory("Hubble seeks lensed supernova", [], "The lensing cluster lies billions of light-years from Earth."), "Earth");
  assert.equal(detectCategory("Decagon on Saturn's south pole"), "Planets");
  assert.equal(detectCategory("A Medium-Sized Solar Flare"), "Sun");
  assert.equal(detectCategory("Milky Way versus Aurora"), "Galaxies");
  assert.equal(detectCategory("Earth from orbit at night", [], "City lights seen from the International Space Station."), "Earth");
  assert.equal(detectCategory("Apollo 12 and Surveyor 3"), "Moon");
});

test("shared image links survive collection rotation and cold starts via the durable store", async () => {
  const redis = createFakeRedis();
  const first = loadGallery({ redis });
  const live = await first.service.getGalleryData();
  const shared = live.images.find((img) => img.id === "apod-2026-11-19");
  assert.ok(shared);

  // Days later: the APOD feed has moved on and the image is no longer in the collection.
  const later = loadGallery({ redis, apodFeed: () => rss('<?xml version="1.0"?><rss version="2.0"><channel><title>APOD</title></channel></rss>') });
  const rotated = await later.service.getGalleryData();
  assert.ok(!rotated.images.some((img) => img.id === shared.id));

  const resolved = await later.service.getGalleryImageById(shared.id);
  assert.equal(resolved?.title, shared.title);
  assert.equal(resolved?.sourceUrl, shared.sourceUrl);
  assert.equal(resolved?.credit, shared.credit);
  assert.equal(resolved?.hdCheckedAt, undefined, "internal bookkeeping is not exposed");

  assert.equal(await later.service.getGalleryImageById("apod-1999-01-01"), null);
  assert.equal(await later.service.getGalleryImageById("../secret"), null);
});

test("an unavailable source keeps its last verified images instead of emptying the gallery", async () => {
  const redis = createFakeRedis();
  await loadGallery({ redis }).service.getGalleryData();

  const { service } = loadGallery({ redis, apodFeed: () => ({ status: 503, body: "" }) });
  const result = await service.getGalleryData();
  const restored = result.images.filter((img) => img.source === "NASA APOD");
  assert.ok(restored.length > 0);
  assert.ok(restored.every((img) => img.isStale === true));
  assert.ok(result.warnings.some((warning) => /APOD.*most recent verified images/.test(warning)));
  assert.notEqual(result.featuredImage?.isStale, true, "stale images are not featured");
});

test("client image fallback advances through renditions and resets for a new image", () => {
  const hook = loadModule("components/gallery/useImageFallback.ts");
  assert.deepEqual(
    Array.from(hook.imageCandidates("https://a.test/thumb.jpg", undefined, "", "https://a.test/thumb.jpg", "http://insecure.test/x.jpg", "javascript:alert(1)", "https://a.test/large.jpg")),
    ["https://a.test/thumb.jpg", "https://a.test/large.jpg"]
  );

  const reducer = hook.__imageFallbackReducer;
  let state = { key: "a", index: 0, status: "loading" };
  state = reducer(state, { type: "advance", count: 2 });
  assert.deepEqual({ ...state }, { key: "a", index: 1, status: "loading" }, "a failed thumbnail moves to the next rendition");
  state = reducer(state, { type: "advance", count: 2 });
  assert.equal(state.status, "failed", "after the last rendition the unavailable state is shown, not an endless skeleton");
  state = reducer(state, { type: "reset", key: "b", count: 2 });
  assert.deepEqual({ ...state }, { key: "b", index: 0, status: "loading" }, "a new image starts clean");
  assert.equal(reducer(state, { type: "loaded" }).status, "loaded");
});

test("share-link lookups use a provided collection and durable history without rebuilding the gallery", async () => {
  const redis = createFakeRedis();
  const first = loadGallery({ redis });
  const collection = await first.service.getGalleryData();
  const shared = collection.images.find((img) => img.id === "apod-2026-11-19");

  // A cold instance: only the durable store is reachable, no feeds.
  const fetch = routeFetch([], { redis, onUnmatched: () => { throw new Error("gallery rebuild attempted"); } });
  const cold = loadModule("services/gallery-service.ts", { fetch, process: { env: redis.env } });
  const empty = { images: [], featuredImage: null };

  const fromHistory = await cold.findGalleryImage("apod-2026-11-19", empty);
  assert.equal(fromHistory?.title, shared.title);
  assert.ok(fetch.calls.every((call) => redis.owns(call.url)), "only the store was contacted");

  assert.equal((await cold.findGalleryImage(shared.id, { images: [shared], featuredImage: null }))?.id, shared.id);
  assert.equal((await cold.findGalleryImage(shared.id, { images: [], featuredImage: shared }))?.id, shared.id, "featured image resolves too");
  assert.equal(await cold.findGalleryImage("apod-1999-01-01", empty), null);
  assert.equal(await cold.findGalleryImage("../secret", empty), null);
});
