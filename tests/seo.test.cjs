const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');
const ts = require('typescript');

const root = path.resolve(__dirname, '..');
const cache = new Map();
function load(relativePath) {
  if (cache.has(relativePath)) return cache.get(relativePath);
  const exports = {};
  cache.set(relativePath, exports);
  const { outputText } = ts.transpileModule(readFileSync(path.join(root, relativePath), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 }
  });
  vm.runInNewContext(outputText, { exports, URL, require: (id) => {
    assert.ok(id.startsWith('@/lib/'), id);
    return load(id.slice(2) + '.ts');
  } }, { filename: relativePath });
  return exports;
}

const { SITE_URL, DEFAULT_OG_IMAGE, DEFAULT_OG_IMAGE_SIZE, pageMetadata, safeJsonLd, breadcrumbSchema } = load('lib/seo.ts');
const { guideArticleSchema, guideCategoryId, guideCollectionSchema } = load('lib/guide-seo.ts');
const { publishedGuides } = load('lib/guides.ts');
const plain = (value) => JSON.parse(JSON.stringify(value));

test('canonical host and the preferred banner are consistent', () => {
  assert.equal(SITE_URL, 'https://www.astroboat.in');
  assert.equal(DEFAULT_OG_IMAGE, SITE_URL + '/astroboat-search-banner.png');
  const png = readFileSync(path.join(root, 'public/astroboat-search-banner.png'));
  assert.equal(png.subarray(1, 4).toString(), 'PNG');
  assert.equal(DEFAULT_OG_IMAGE_SIZE.width, png.readUInt32BE(16));
  assert.equal(DEFAULT_OG_IMAGE_SIZE.height, png.readUInt32BE(20));
});

test('page metadata preserves RSS discovery alongside a canonical URL', () => {
  for (const pagePath of ['/', '/guides', '/moon', '/ask', '/guides/how-to-see-mercury']) {
    const metadata = pageMetadata({ title: 'Astronomy', description: 'A useful description.', path: pagePath });
    assert.equal(metadata.alternates.canonical, new URL(pagePath, SITE_URL).href);
    assert.equal(metadata.alternates.types['application/rss+xml'], SITE_URL + '/feed.xml');
    assert.equal(metadata.openGraph.url, metadata.alternates.canonical);
    assert.equal(metadata.openGraph.images[0].url, DEFAULT_OG_IMAGE);
    assert.equal(metadata.openGraph.images[0].width, DEFAULT_OG_IMAGE_SIZE.width);
    assert.equal(metadata.twitter.images[0], DEFAULT_OG_IMAGE);
    assert.equal(metadata.twitter.card, 'summary_large_image');
    assert.equal(metadata.title.absolute, 'Astronomy | Astroboat');
  }
});

test('explicit images retain their own URL without fabricated dimensions', () => {
  const metadata = pageMetadata({
    title: 'Astroboat', description: 'Description', path: '/guides',
    image: '/example.png', imageAlt: 'Example'
  });
  assert.equal(metadata.openGraph.images[0].url, SITE_URL + '/example.png');
  assert.equal(metadata.openGraph.images[0].alt, 'Example');
  assert.equal(metadata.openGraph.images[0].width, undefined);
  assert.equal(metadata.title.absolute, 'Astroboat');
});

test('noindex pages stay followable and indexable pages do not opt out', () => {
  const common = { title: 'Test', description: 'Test', path: '/ask' };
  assert.deepEqual(plain(pageMetadata({ ...common, noindex: true }).robots), { index: false, follow: true });
  assert.equal(pageMetadata(common).robots, undefined);
});

test('JSON-LD cannot close its containing script', () => {
  const value = { title: '</script><script>alert("test")</script>&' };
  const output = safeJsonLd(value);
  assert.doesNotMatch(output, /[<>&]/);
  assert.deepEqual(JSON.parse(output), value);
});

test('article markup describes real content without fake images or refreshed dates', () => {
  for (const guide of publishedGuides) {
    const schema = guideArticleSchema(guide);
    assert.equal(schema['@type'], 'Article');
    assert.equal(schema.mainEntityOfPage, SITE_URL + '/guides/' + guide.slug);
    assert.equal(schema.headline, guide.title);
    assert.equal(schema.datePublished, guide.publishedAt);
    assert.equal(schema.dateModified, guide.updatedAt);
    assert.equal(schema.articleSection, guide.category);
    assert.equal(schema.inLanguage, 'en');
    assert.deepEqual(plain(schema.citation), plain(guide.sources.map((source) => source.url)));
    assert.deepEqual(plain(schema.keywords), plain(guide.tags));
    assert.equal(schema.publisher['@id'], SITE_URL + '/#organization');
    assert.equal(schema.isPartOf['@id'], SITE_URL + '/#website');
    if (!guide.ogImage && !guide.heroImage) assert.equal(schema.image, undefined);
  }
  const illustrated = { ...publishedGuides[0], heroImage: { src: '/nebula.png' } };
  assert.equal(guideArticleSchema(illustrated).image, SITE_URL + '/nebula.png');
});

test('collection markup lists each guide once with contiguous positions', () => {
  const schema = guideCollectionSchema(publishedGuides);
  assert.equal(schema['@type'], 'CollectionPage');
  assert.equal(schema.mainEntity.numberOfItems, publishedGuides.length);
  assert.equal(new Set(schema.mainEntity.itemListElement.map((item) => item.url)).size, publishedGuides.length);
  schema.mainEntity.itemListElement.forEach((item, index) => {
    assert.equal(item.position, index + 1);
    assert.equal(item.url, SITE_URL + '/guides/' + publishedGuides[index].slug);
    assert.equal(item.name, publishedGuides[index].title);
  });
});

test('all topic anchors are unique and URL safe', () => {
  const categories = [...new Set(publishedGuides.map((guide) => guide.category))];
  const ids = categories.map(guideCategoryId);
  assert.equal(new Set(ids).size, categories.length);
  for (const id of ids) assert.match(id, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
  assert.equal(guideCategoryId('Astronomy Basics'), 'astronomy-basics');
});

test('breadcrumb positions and URLs agree with the canonical host', () => {
  const schema = breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Guides', path: '/guides' }]);
  assert.equal(schema.itemListElement[0].position, 1);
  assert.equal(schema.itemListElement[1].item, SITE_URL + '/guides');
});

const base = process.env.SEO_TEST_BASE_URL;
const get = async (pagePath) => {
  const response = await fetch(new URL(pagePath, base), { signal: AbortSignal.timeout(20000) });
  assert.equal(response.status, 200, pagePath);
  return response.text();
};
const schemas = (html) => [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
  .flatMap((match) => JSON.parse(match[1]));

test('rendered pages expose the banner, RSS, and appropriate indexing directives', { skip: !base }, async () => {
  for (const pagePath of ['/', '/guides', '/guides/how-to-see-mercury', '/ask', '/articles', '/learn', '/satellites']) {
    const html = await get(pagePath);
    assert.ok(html.includes('property="og:image" content="' + DEFAULT_OG_IMAGE + '"'), pagePath);
    assert.ok(html.includes('name="twitter:image" content="' + DEFAULT_OG_IMAGE + '"'), pagePath);
    assert.ok(html.includes('type="application/rss+xml" href="' + SITE_URL + '/feed.xml"'), pagePath);
    assert.equal((html.match(/<h1\b/g) ?? []).length, 1, pagePath);
    if (['/ask', '/articles', '/learn', '/satellites'].includes(pagePath)) {
      assert.match(html, /<meta name="robots" content="noindex, follow"/, pagePath);
    } else {
      assert.doesNotMatch(html, /<meta name="robots" content="[^"]*noindex/, pagePath);
    }
    assert.doesNotMatch(html, /(?:og:image|twitter:image)" content="[^"]*\/og-image\.png/, pagePath);
  }
  const response = await fetch(new URL('/astroboat-search-banner.png', base));
  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type'), /^image\/png/);
  const rootSchemas = schemas(await get('/'));
  assert.equal(rootSchemas.find((schema) => schema['@type'] === 'Organization')['@id'], SITE_URL + '/#organization');
});

test('rendered topic anchors and ItemList match visible guide order', { skip: !base }, async () => {
  const html = await get('/guides');
  const collection = schemas(html).find((schema) => schema['@type'] === 'CollectionPage');
  assert.equal(collection.mainEntity.numberOfItems, publishedGuides.length);
  const links = [...html.matchAll(/<h3\b[^>]*>\s*<a\b[^>]*\bhref="([^"]+)"/g)].map((match) => SITE_URL + match[1]);
  assert.deepEqual(links, collection.mainEntity.itemListElement.map((item) => item.url));
  for (const category of new Set(publishedGuides.map((guide) => guide.category))) {
    const id = guideCategoryId(category);
    assert.ok(html.includes('href="#' + id + '"'));
    assert.ok(html.includes('id="' + id + '"'));
  }
  const article = schemas(await get('/guides/how-to-see-mercury')).find((schema) => schema['@type'] === 'Article');
  assert.equal(article.articleSection, 'Skywatching');
  assert.equal(article.image, undefined);
});
