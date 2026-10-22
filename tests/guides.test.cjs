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

function readingText(guide) {
  return guide.sections.flatMap((section) => [section.heading, ...section.paragraphs,
    ...(section.list?.items ?? []),
    ...(section.table ? [section.table.caption, ...section.table.columns, ...section.table.rows.flat()] : [])
  ]).join(' ');
}

test('all 25 revisions map to published guides without dropping the original guide', () => {
  assert.equal(astronomyGuides.length, 25);
  assert.equal(publishedGuides.length, 26);
  assert.equal(Object.keys(guideSections).sort().join(','), astronomyGuides.map((guide) => guide.slug).sort().join(','));
  assert.equal(new Set(publishedGuides.map((guide) => guide.slug)).size, publishedGuides.length);
  assert.equal(getPublishedGuide('what-is-a-near-earth-object').publishedAt, '2026-09-30');
  assert.equal(getPublishedGuide('not-a-published-guide'), undefined);
});

for (const guide of astronomyGuides) {
  test(`${guide.slug}: navigable sections, valid citations, and complete reading time`, () => {
    assert.equal(guide.status, 'published');
    assert.equal(guide.publishedAt, '2026-10-21');
    assert.equal(guide.updatedAt, '2026-10-22');
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
    assert.equal(guide.readingMinutes, Math.max(1, Math.ceil(words / 200)));
    for (const item of guide.relatedPaths) {
      if (item.href.startsWith('/guides/')) assert.ok(getPublishedGuide(item.href.slice('/guides/'.length)), `Missing related guide ${item.href}`);
    }
    assert.doesNotMatch(readingText(guide), /\b(?:TODO|coming soon|lorem ipsum)\b/i);
  });
}

test('revisions do not repeat whole explanatory paragraphs across topics', () => {
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
    assert.ok(String(entry.lastmod).startsWith(guide.updatedAt));
  }
  assert.equal((await fetch(new URL('/guides/not-a-published-guide', baseUrl))).status, 404);
});
