const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');
const ts = require('typescript');

// Load the typed editorial data without Next, network access, or another test dependency.
const root = path.resolve(__dirname, '..');
const cache = new Map();
function load(relativePath) {
  const filename = path.join(root, relativePath);
  if (cache.has(filename)) return cache.get(filename);
  const exports = {};
  cache.set(filename, exports);
  const { outputText } = ts.transpileModule(readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    fileName: filename
  });
  const context = vm.createContext({ exports, require: (id) => {
    if (!id.startsWith('@/lib/')) throw new Error(`Unexpected guide dependency: ${id}`);
    return load(`${id.slice(2)}.ts`);
  } });
  new vm.Script(outputText, { filename }).runInContext(context);
  return exports;
}

const { publishedGuides, getPublishedGuide } = load('lib/guides.ts');
const { astronomyGuides } = load('lib/guide-library.ts');
const { guideSections } = load('lib/guide-content.ts');
const { searchIndex } = load('lib/search-index.ts');
const shortSlugs = new Set([
  'how-to-spot-the-space-station',
  'twilight-civil-nautical-astronomical',
  'photographing-the-night-sky-with-a-phone'
]);
const newSlugs = new Set([
  'sky-coordinates-altitude-and-azimuth',
  'stellar-magnitudes-and-brightness',
  'earthshine-on-the-crescent-moon',
  'why-the-moon-causes-tides',
  'how-planetary-defense-works',
  'isro-science-missions-and-instruments',
  'spectroscopy-reading-starlight',
  'why-stars-twinkle-and-seeing',
  'stellar-parallax-and-distance',
  'open-and-globular-star-clusters',
  'observing-jupiter-and-its-moons',
  'saturn-rings-and-changing-views',
  'venus-morning-evening-star-and-phases',
  'mars-red-color-and-observing',
  'gravity-assists-and-spacecraft-flybys',
  'deep-space-communication-and-light-delay',
  'why-astronauts-float-in-microgravity',
  'solar-flares-versus-coronal-mass-ejections',
  'moon-illusion-and-supermoons',
  'planetary-nebulae-not-planets'
]);

function readingText(guide) {
  return guide.sections.flatMap((section) => [section.heading, ...section.paragraphs,
    ...(section.list?.items ?? []),
    ...(section.table ? [section.table.caption, ...section.table.columns, ...section.table.rows.flat()] : [])
  ]).join(' ');
}

test('20 new guides join the existing 29 without dropping or duplicating a guide', () => {
  assert.equal(astronomyGuides.length, 48);
  assert.equal(publishedGuides.length, 49);
  assert.equal(Object.keys(guideSections).sort().join(','), astronomyGuides.map((guide) => guide.slug).sort().join(','));
  assert.equal(new Set(publishedGuides.map((guide) => guide.slug)).size, publishedGuides.length);
  assert.equal(getPublishedGuide('what-is-a-near-earth-object').publishedAt, '2026-09-30');
  assert.equal(getPublishedGuide('not-a-published-guide'), undefined);
  assert.equal(new Set(publishedGuides.map((guide) => guide.title.toLowerCase())).size, publishedGuides.length);
  assert.equal(publishedGuides.slice(0, newSlugs.size).map((guide) => guide.slug).sort().join(','), [...newSlugs].sort().join(','));
  for (let i = 1; i < publishedGuides.length; i++) {
    assert.ok(publishedGuides[i - 1].publishedAt >= publishedGuides[i].publishedAt);
  }
});

test('every published guide has exactly one searchable entry', () => {
  for (const guide of publishedGuides) {
    const entries = searchIndex.filter((item) => item.url === `/guides/${guide.slug}`);
    assert.equal(entries.length, 1, guide.slug);
    assert.equal(entries[0].title, guide.title);
    assert.equal(entries[0].description, guide.description);
    assert.equal(entries[0].kind, 'Guide');
    assert.ok(entries[0].keywords.includes(guide.category));
    for (const tag of guide.tags) assert.ok(entries[0].keywords.includes(tag));
  }
});

for (const guide of astronomyGuides) {
  test(`${guide.slug}: navigable sections, valid citations, and complete reading time`, () => {
    assert.equal(guide.status, 'published');
    const isNew = newSlugs.has(guide.slug);
    const isShort = shortSlugs.has(guide.slug);
    assert.equal(guide.publishedAt, isNew ? '2026-10-27' : isShort ? '2026-10-24' : '2026-10-21');
    assert.equal(guide.updatedAt, isNew || isShort ? undefined : '2026-10-22');
    assert.ok(guide.aiAssisted);
    assert.ok(guide.sections.length >= 4);
    const ids = new Set();
    const sources = new Set(guide.sources.map((source) => source.url));
    assert.ok(sources.size >= 2);
    for (const source of sources) assert.equal(new URL(source).protocol, 'https:');

    for (const section of guide.sections) {
      assert.match(section.id, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
      assert.ok(!ids.has(section.id), `Duplicate anchor ${section.id}`);
      ids.add(section.id);
      assert.ok(section.heading.trim());
      assert.ok(section.paragraphs.length);
      for (const paragraph of section.paragraphs) assert.ok(paragraph.trim());
      for (const url of section.sourceUrls ?? []) assert.ok(sources.has(url), `Unlisted reference ${url}`);
      if (section.list) {
        assert.ok(section.list.items.length >= 2);
        assert.equal(new Set(section.list.items).size, section.list.items.length);
      }
      if (section.table) {
        assert.ok(section.table.caption);
        assert.ok(section.table.columns.length >= 2);
        assert.ok(section.table.rows.length >= 2);
        assert.equal(new Set(section.table.rows.map((row) => row[0])).size, section.table.rows.length);
        for (const row of section.table.rows) {
          assert.equal(row.length, section.table.columns.length);
          for (const cell of row) assert.ok(cell.trim());
        }
      }
    }

    assert.ok(guide.sections.some((section) => section.sourceUrls?.length));
    const words = readingText(guide).split(/\s+/).length;
    if (isShort) assert.ok(words >= 250 && words <= 400, `Keep simple guides short and useful: ${words} words`);
    if (isNew) assert.ok(words >= 300 && words <= 600, `Keep new guides focused and useful: ${words} words`);
    assert.equal(guide.readingMinutes, Math.max(1, Math.ceil(words / 200)));
    for (const item of guide.relatedPaths) {
      if (item.href.startsWith('/guides/')) assert.ok(getPublishedGuide(item.href.slice('/guides/'.length)), `Missing related guide ${item.href}`);
    }
    assert.doesNotMatch(readingText(guide), /\b(?:TODO|coming soon|lorem ipsum)\b/i);
  });
}

test('guides do not repeat whole explanatory paragraphs across topics', () => {
  const seen = new Set();
  for (const guide of astronomyGuides) {
    for (const paragraph of guide.sections.flatMap((section) => section.paragraphs)) {
      assert.ok(!seen.has(paragraph), `Repeated paragraph in ${guide.slug}`);
      seen.add(paragraph);
    }
  }
});

const baseUrl = process.env.GUIDE_TEST_BASE_URL;
test('published HTML, citations, tables, RSS, and sitemap', { skip: !baseUrl }, async () => {
  const index = await fetch(new URL('/guides', baseUrl));
  assert.equal(index.status, 200);
  const indexHtml = await index.text();
  for (const guide of astronomyGuides) {
    const route = `/guides/${guide.slug}`;
    assert.ok(indexHtml.includes(route), `Index missing ${route}`);
    const response = await fetch(new URL(route, baseUrl));
    assert.equal(response.status, 200, route);
    const html = await response.text();
    const escapeHtml = (value) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;');
    assert.ok(html.includes(escapeHtml(guide.title)), `Missing title: ${route}`);
    const schemas = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].flatMap((match) => JSON.parse(match[1]));
    const article = schemas.find((schema) => schema['@type'] === 'Article');
    assert.equal(article?.datePublished, guide.publishedAt);
    assert.equal(article?.dateModified, guide.updatedAt);
    assert.ok(html.includes('rel="canonical"'));
    assert.ok(html.includes('On this page'));
    for (const section of guide.sections) {
      assert.ok(html.includes(`id="${section.id}"`));
      for (const paragraph of section.paragraphs) assert.ok(html.includes(escapeHtml(paragraph)), `Missing paragraph: ${route}/${section.id}`);
      for (const item of section.list?.items ?? []) assert.ok(html.includes(escapeHtml(item)));
      if (section.table) {
        assert.ok(html.includes(`<caption class="border-b border-astro-border px-4 py-3 text-left font-medium text-astro-text">${escapeHtml(section.table.caption)}</caption>`));
        assert.ok(html.includes('scope="col"'));
        assert.ok(html.includes('scope="row"'));
      }
      for (const url of section.sourceUrls ?? []) assert.ok(html.includes(`href="${escapeHtml(url)}"`));
    }
  }
  const { XMLParser } = require('fast-xml-parser');
  const parser = new XMLParser();
  const feed = parser.parse(await (await fetch(new URL('/feed.xml', baseUrl))).text());
  assert.equal(feed.rss.channel.item.length, publishedGuides.length);
  const sitemap = parser.parse(await (await fetch(new URL('/sitemap.xml', baseUrl))).text());
  for (const guide of astronomyGuides) {
    const entry = sitemap.urlset.url.find((item) => item.loc.endsWith(`/guides/${guide.slug}`));
    assert.ok(entry, `Missing sitemap entry: ${guide.slug}`);
    assert.ok(String(entry.lastmod).startsWith(guide.updatedAt ?? guide.publishedAt));
  }
  assert.equal((await fetch(new URL('/guides/not-a-published-guide', baseUrl))).status, 404);
});
