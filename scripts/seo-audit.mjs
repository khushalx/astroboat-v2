const base = process.env.SEO_AUDIT_BASE_URL || "http://localhost:3000";
const paths = ["/", "/gallery", "/briefs", "/events", "/moon", "/asteroids", "/guides", "/guides/what-is-a-near-earth-object", "/about", "/data-sources", "/editorial-policy", "/contact", "/privacy", "/terms", "/ask", "/articles", "/learn", "/satellites"];

function attribute(tag, name) {
  return tag.match(new RegExp(`\\b${name}=(["'])(.*?)\\1`, "i"))?.[2] ?? "";
}

function content(html, tag, attribute, value) {
  const tags = [...html.matchAll(new RegExp(`<${tag}\\b[^>]*>`, "gi"))].map(([match]) => match);
  const found = tags.find((candidate) => new RegExp(`${attribute}=["']${value}["']`, "i").test(candidate));
  return found ? (found.match(/content=(["'])(.*?)\1/i)?.[2] || found.match(/href=(["'])(.*?)\1/i)?.[2] || "") : "";
}

let failures = 0;
const noindexPaths = new Set(["/ask", "/articles", "/learn", "/satellites"]);
const expectedPreview = "https://www.astroboat.in/astroboat-search-banner.png";
const internalLinks = new Set();
for (const path of paths) {
  try {
    const response = await fetch(new URL(path, base));
    const html = await response.text();
    for (const [, href] of html.matchAll(/<a\b[^>]*href="(\/[^"]*)"/gi)) {
      if (!href.startsWith("//")) internalLinks.add(href.split(/[?#]/)[0] || "/");
    }
    const title = html.match(/<title>(.*?)<\/title>/is)?.[1] || "";
    const description = content(html, "meta", "name", "description");
    const canonical = content(html, "link", "rel", "canonical");
    const robots = content(html, "meta", "name", "robots");
    const h1 = html.match(/<h1\b[^>]*>(.*?)<\/h1>/is)?.[1]?.replace(/<[^>]*>/g, "").trim() || "";
    const ogImage = content(html, "meta", "property", "og:image");
    const twitterImage = content(html, "meta", "name", "twitter:image");
    const rss = [...html.matchAll(/<link\b[^>]*>/gi)].some(([tag]) =>
      attribute(tag, "rel") === "alternate" && attribute(tag, "type") === "application/rss+xml" &&
      attribute(tag, "href") === "https://www.astroboat.in/feed.xml");
    const jsonScripts = [...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>(.*?)<\/script>/gis)];
    let jsonValid = jsonScripts.length > 0;
    for (const [, data] of jsonScripts) {
      try { JSON.parse(data); } catch { jsonValid = false; }
    }
    const expectedCanonical = `https://www.astroboat.in${path === "/" ? "/" : path}`;
    const valid = response.status === 200 && Boolean(title && description && h1 && rss && jsonValid) &&
      (html.match(/<h1\b/gi) ?? []).length === 1 &&
      ogImage === expectedPreview && twitterImage === expectedPreview &&
      (canonical === expectedCanonical || (path === "/" && canonical === "https://www.astroboat.in")) &&
      (noindexPaths.has(path) ? robots.includes("noindex") : !robots.includes("noindex"));
    if (!valid) failures++;
    console.log(`${valid ? "OK" : "FAIL"} ${path} ${response.status} | title=${title} | description=${description.slice(0, 65)} | canonical=${canonical} | robots=${robots || "index"} | h1=${h1} | og:image=${ogImage} | json-ld=${jsonValid}`);
  } catch (error) {
    failures++;
    console.error(`FAIL ${path}: ${error.message}`);
  }
}
for (const path of ["/robots.txt", "/sitemap.xml", "/feed.xml"]) {
  try {
    const response = await fetch(new URL(path, base));
    const body = await response.text();
    const valid = response.ok && body.includes("https://www.astroboat.in") &&
      !body.includes("localhost") && !body.includes("https://astroboat.in/") &&
      (path !== "/sitemap.xml" || [...noindexPaths].every((path) => !body.includes(`${path}</loc>`)));
    if (!valid) failures++;
    console.log(`${valid ? "OK" : "FAIL"} ${path} ${response.status}`);
  } catch (error) { failures++; console.error(`FAIL ${path}: ${error.message}`); }
}
const preview = await fetch(expectedPreview.replace("https://www.astroboat.in", base));
const imageValid = preview.ok && (preview.headers.get("content-type") ?? "").startsWith("image/");
if (!imageValid) failures++;
console.log(`${imageValid ? "OK" : "FAIL"} social preview image ${preview.status}`);
for (const path of ["/definitely-missing", "/guides/definitely-missing", "/briefs/definitely-missing"]) {
  const response = await fetch(new URL(path, base));
  const valid = response.status === 404;
  if (!valid) failures++;
  console.log(`${valid ? "OK" : "FAIL"} ${path} ${response.status} (expected 404)`);
}
const briefsHtml = await (await fetch(new URL("/briefs", base))).text();
const briefPath = briefsHtml.match(/href="(\/briefs\/[^\"]+)"/)?.[1];
if (briefPath) {
  const response = await fetch(new URL(briefPath, base));
  const html = await response.text();
  const valid = response.status === 200 && /<meta name="robots" content="noindex, follow"/.test(html);
  if (!valid) failures++;
  console.log(`${valid ? "OK" : "FAIL"} ${briefPath} ${response.status} (source digest noindex)`);
}
const brokenLinks = [];
for (const path of internalLinks) {
  const response = await fetch(new URL(path, base));
  if (response.status >= 400) brokenLinks.push(`${path} (${response.status})`);
}
if (brokenLinks.length) failures += brokenLinks.length;
console.log(`${brokenLinks.length ? "FAIL" : "OK"} internal links: ${internalLinks.size} checked${brokenLinks.length ? `; broken: ${brokenLinks.join(", ")}` : ""}`);
process.exitCode = failures ? 1 : 0;
