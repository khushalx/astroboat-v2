import { XMLParser } from "fast-xml-parser";
import { GALLERY_REVALIDATE_SECONDS, NASA_APOD_API_URL, NASA_IMAGE_LIBRARY_API_BASE } from "@/lib/constants";
import type { GalleryCategory, GalleryImage, GalleryResult, GallerySource } from "@/lib/types";

// Subject-level exclusions. This is intentionally evaluated against titles and
// keywords, not full science descriptions: APOD explanations often mention
// people or researchers even when the image itself is purely astronomical.
export const REJECTED_CONTENT_PATTERN =
  /\b(person|people|portrait|portraits|headshot|selfie|standing|sitting|smiles|smiling|handshake|speaks|speaking|speaker|podium|interview|administrator|director|manager|engineer|technician|scientist|astronomer|researcher|worker|crew member|crew portrait|astronaut portrait|official portrait|team photo|group photo|panelist|audience|crowd|spectator|visitor|student|children|child|family|classroom|school|intern|honoree|retiree|signing ceremony|press conference|media briefing|news briefing|town hall|keynote|celebration|reception|symposium|meeting|conference|roundtable|workshop|logo|patch|emblem|insignia|poster|flyer|diagram|schematic|infographic|flowchart|chart|graph|table|slide|presentation|certificate|award|trophy|stamp|badge|mockup|model of|miniature|scale model|toy|cake|exhibit|booth|hallway|lobby|auditorium|conference room|office|desk|building exterior|building interior|headquarters|facility exterior|gate|road|fence|parking lot|bus|van|truck|crane|forklift|scaffolding|clean room|cleanroom|fabrication|machining|welding|assembly line|assembly room|inspection|installing|installation|testing in chamber|lifted into|transporting|rollout onto|unloading|shipping container|crate|screenshot|screengrab|document|whitepaper|book cover|magazine|newspaper|memo|history of|commemoration|commemorative|prototype|prototyping|development kit|processor unit|antennas?|groundwork|tunnels?|main structure|welcome to|hotel|feature names|informal names|animation|artist[’']s (?:impression|concept)|illustration|rendering|locator|finding chart|context|comparison image|compass image|annotated|spectrum|spectra|simulation|square layout)\b/i;

const DESCRIBED_HUMAN_SCENE_PATTERN =
  /\b(pictured (?:at|with|from)|from left|poses? (?:with|for)|stands? (?:with|beside|in front)|sits? (?:with|beside)|speaks? (?:at|during|to)|participants?|attendees?|technicians? work|workers? (?:clear|install|prepare)|during (?:a|the) (?:ceremony|meeting|conference|briefing|event|visit|tour))\b/i;

const DESCRIBED_HARDWARE_SCENE_PATTERN =
  /\b(development kit|processor unit|instrument inside (?:a )?cleanroom|telescope mirror segments?|observatory construction|telescope construction|under construction|assembly (?:and|of)|group of antennas?|line of antennas?|\d+ antennas?)\b/i;

const NON_PHOTOGRAPHIC_DESCRIPTION_PATTERN =
  /\b(?:this\s+)?artist[’']s\s+(?:concept|impression)|\billustration of\b|\bcomputer-generated (?:image|view|rendering)\b/i;

const ANNOTATED_SCIENCE_IMAGE_PATTERN =
  /\b(?:solid|dashed) (?:curve|line)\b|\borbit is (?:shown|displayed)\b|\bmarked with (?:a |an )?(?:crosshair|circle|arrow)\b|\barrows? (?:in (?:this|the) image )?indicate\b/i;

// Strong positive astronomy and space-exploration signals
export const POSITIVE_SPACE_SIGNALS =
  /\b(galaxy|galaxies|spiral galaxy|elliptical galaxy|barred spiral|andromeda|milky way|sombrero galaxy|cartwheel galaxy|whirlpool galaxy|pinwheel galaxy|deep field|hubble ultra deep|smacs\s*\d+|stephan'?s quintet|ngc\s*\d+|messier\s*\d+|m\d+|ic\s*\d+|nebula|nebulae|planetary nebula|emission nebula|reflection nebula|dark nebula|supernova remnant|supernova|nova remnant|crab nebula|eagle nebula|carina nebula|orion nebula|pillars of creation|ring nebula|veil nebula|tarantula nebula|helix nebula|horsehead nebula|bubble nebula|star cluster|globular cluster|open cluster|stellar cluster|stellar nursery|star-forming|star field|pleiades|protostar|binary star|red giant|red supergiant|white dwarf|betelgeuse|pulsar|magnetar|quasar|black hole|sagittarius a\*?|event horizon|gravitational lens|cosmic web|interstellar|jupiter|saturn|mars|venus|mercury|uranus|neptune|pluto|titan|europa|io|ganymede|enceladus|callisto|ceres|asteroid|comet|exoplanet|gas giant|rings of saturn|great red spot|jovian|martian|olympus mons|valles marineris|jezero crater|gale crater|lunar surface|moon crater|tycho crater|mare |apollo landing|lunar horizon|earthrise|earth from orbit|earth from space|blue marble|aurora australis|aurora borealis|atmospheric limb|the sun|solar flare|coronal loop|coronal mass ejection|prominence|sunspot|solar dynamics observatory|rocket launch|liftoff|night launch|launch pad|spacecraft in orbit|space station|international space station|iss cupola|satellite in orbit|hubble space telescope|james webb space telescope|jwst|very large telescope|vlt|alma|chandra x-ray|spitzer|voyager|cassini|juno spacecraft|perseverance rover|curiosity rover|rosetta|solar orbiter)\b/i;

export const RAW_CODE_TITLE_REGEX =
  /^([A-Z]{2,6}[-_]?[0-9a-z]{4,}[\w-]*|\d{4}[-_]\w+|DSC_\d+|IMG_\d+|PIA\d+|NHQ\d+|KSC\w+|JSC\w+|MSFC\w+|GSFC\w+|ARC\w+|GRC\w+)$/i;

type ObservatoryFeedConfig = {
  id: string;
  url: string;
  source: GallerySource;
  credit: string;
  observatory: string;
};

const OBSERVATORY_IMAGE_FEEDS: ObservatoryFeedConfig[] = [
  {
    id: "esa-webb",
    url: "https://esawebb.org/images/feed/",
    source: "ESA / Webb",
    credit: "ESA/Webb, NASA & CSA",
    observatory: "James Webb Space Telescope"
  },
  {
    id: "esa-hubble",
    url: "https://esahubble.org/images/feed/",
    source: "Hubble",
    credit: "ESA/Hubble & NASA",
    observatory: "Hubble Space Telescope"
  },
  {
    id: "eso",
    url: "https://www.eso.org/public/images/feed/",
    source: "ESO",
    credit: "ESO",
    observatory: "European Southern Observatory"
  }
];

const APOD_RSS_URL = "https://apod.nasa.gov/apod.rss";
const GALLERY_XML_PARSER = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  textNodeName: "#text",
  trimValues: true,
  processEntities: false
});

// Live sources are deliberately preferred over a static photo archive. The
// previous fallback paired hand-written astronomy captions with unrelated NASA
// asset IDs, which produced convincing but incorrect cards. If every provider
// is down, an honest empty state is safer than mislabeled imagery.
export const CURATED_FALLBACK_GALLERY: GalleryImage[] = [];

export function containsRejectedKeywords(text: string): boolean {
  if (!text || typeof text !== "string") return false;
  return REJECTED_CONTENT_PATTERN.test(text);
}

export function hasPositiveSpaceSignals(text: string): boolean {
  if (!text || typeof text !== "string") return false;
  return POSITIVE_SPACE_SIGNALS.test(text);
}

export type CandidateScoreResult = {
  score: number;
  verdict: "include" | "reject";
  reasons: string[];
};

export function scoreGalleryCandidate(candidate: {
  title: string;
  description: string;
  url: string;
  keywords?: string[];
  credit?: string;
  observatory?: string;
  source?: string;
}): CandidateScoreResult {
  const reasons: string[] = [];
  let score = 50;

  // Reject raw archival code titles (e.g. KSC-2009-3793, NHQ202207120012)
  if (RAW_CODE_TITLE_REGEX.test(candidate.title.trim())) {
    reasons.push("Title is an internal archival code rather than descriptive astronomy title");
    return { score: 0, verdict: "reject", reasons };
  }

  const subjectText = `${candidate.title} ${(candidate.keywords || []).join(" ")}`;
  const scienceContext = `${candidate.title} ${candidate.description} ${(candidate.keywords || []).join(" ")} ${candidate.observatory || ""} ${candidate.source || ""}`;

  // 1. Hard Rejection Checks
  if (containsRejectedKeywords(subjectText)) {
    reasons.push("Title or keywords describe people, events, facilities, or non-photographic media");
    return { score: 0, verdict: "reject", reasons };
  }

  if (DESCRIBED_HUMAN_SCENE_PATTERN.test(`${candidate.title} ${candidate.description.slice(0, 500)}`)) {
    reasons.push("Description identifies a people-focused or administrative scene");
    return { score: 0, verdict: "reject", reasons };
  }

  if (DESCRIBED_HARDWARE_SCENE_PATTERN.test(`${candidate.title} ${candidate.description.slice(0, 700)}`)) {
    reasons.push("Description identifies observatory hardware rather than an astronomical subject");
    return { score: 0, verdict: "reject", reasons };
  }

  if (NON_PHOTOGRAPHIC_DESCRIPTION_PATTERN.test(candidate.description.slice(0, 500))) {
    reasons.push("Description identifies an illustration or artist concept rather than observed imagery");
    return { score: 0, verdict: "reject", reasons };
  }

  if (ANNOTATED_SCIENCE_IMAGE_PATTERN.test(candidate.description.slice(0, 900))) {
    reasons.push("Description identifies plotted or annotated scientific media rather than a clean observation");
    return { score: 0, verdict: "reject", reasons };
  }

  // Reject videos / documents / audio
  if (/\.(mp4|webm|avi|mov|mp3|wav|pdf|doc|zip|eps|ai)(\?|$)/i.test(candidate.url)) {
    reasons.push("Invalid media format (video/audio/document)");
    return { score: 0, verdict: "reject", reasons };
  }

  // Reject extremely short or non-descriptive entries
  if (candidate.title.length < 5 || candidate.description.length < 15) {
    score -= 25;
    reasons.push("Insufficient metadata depth");
  }

  // 2. Positive Space and Astronomical Signals
  if (hasPositiveSpaceSignals(candidate.title)) {
    score += 25;
    reasons.push("Strong astronomy subject in title");
  } else if (hasPositiveSpaceSignals(scienceContext)) {
    score += 15;
    reasons.push("Astronomy subject in metadata");
  } else {
    // If neither title nor metadata contains positive space signals, it's not a gallery candidate
    score -= 30;
    reasons.push("Lacks recognized space/astronomy signals");
  }

  // 3. High-Value Scientific Observatories / Instruments
  if (/(james webb|jwst|hubble|hst|chandra|spitzer|juno|cassini|perseverance|curiosity|solar dynamics observatory|sdo|soho|lroc|iss cupola|vlt|alma)/i.test(scienceContext)) {
    score += 15;
    reasons.push("Reputable scientific observatory or space mission instrument");
  }

  // 4. Reputable Scientific Centers & Archives
  if (/(stsci|jpl-caltech|jpl|goddard|esa\s*\/?\s*webb|esa\s*\/?\s*hubble|cxc|eso|nasa)/i.test(`${candidate.credit || ""} ${candidate.source || ""}`)) {
    score += 10;
    reasons.push("Primary astronomical science institution credit");
  }

  // 5. Catalog Identification (NGC, Messier, etc.)
  if (/(messier\s*\d+|m\d+|ngc\s*\d+|ic\s*\d+|smacs\s*\d+|30 doradus)/i.test(candidate.title)) {
    score += 10;
    reasons.push("Standard celestial catalog designation");
  }

  const verdict = score >= 65 ? "include" : "reject";
  return { score: Math.min(100, Math.max(0, score)), verdict, reasons };
}

export function isRelevantSpaceImage(
  title: string,
  description: string,
  url: string,
  keywords: string[] = [],
  credit: string = ""
): boolean {
  if (!url || (!url.startsWith("http://") && !url.startsWith("https://"))) return false;

  const result = scoreGalleryCandidate({
    title,
    description,
    url,
    keywords,
    credit
  });

  return result.verdict === "include";
}

function normalizeTitle(rawTitle: string): string {
  let title = rawTitle.replace(/\s+/g, " ").trim();
  title = title.replace(/\s*\([^)]*(NIRCam|WFC3|ACS|MIRI|Composite)[^)]*\)/gi, "");
  title = title.replace(/^NASA's\s+/i, "");
  title = title.replace(/^Hubble\s+Sees\s+(a\s+)?/i, "");
  title = title.replace(/^Webb\s+Captures\s+(a\s+)?/i, "");
  title = title.replace(/^Webb\s+Images\s+(a\s+)?/i, "");
  title = title.replace(/^Hubble\s+Images\s+(a\s+)?/i, "");
  return title.trim() || rawTitle;
}

export function detectCategory(title: string, keywords: string[] = [], description: string = ""): GalleryCategory {
  const subject = `${title} ${keywords.join(" ")}`.toLowerCase();
  const combined = `${title} ${keywords.join(" ")} ${description}`.toLowerCase();

  if (/(\bnebula\b|\bnebulae\b|\bbubbles?\b|\bbow shocks?\b|pillars of creation|supernova remnant|planetary nebula)/i.test(subject)) return "Nebulae";
  if (/(\bgalaxy\b|\bgalaxies\b|\bspiral\b|andromeda|milky way|smacs|deep field|messier\s*(?:31|51|74|81|82|101|104)\b)/i.test(subject)) return "Galaxies";
  if (/(\bjupiter\b|\bsaturn\b|\bmars\b|\bvenus\b|\bmercury\b|\buranus\b|\bneptune\b|\bpluto\b|\btitan\b|\beuropa\b|\basteroid\b|\bcomet\b|\bexoplanet\b)/i.test(subject)) return "Planets";
  if (/(\bmoon\b|\blunar\b|\btycho crater\b)/i.test(subject)) return "Moon";
  if (/(\bsun\b|\bsolar\b|\bcoronal?\b|\bsunspot\b)/i.test(subject)) return "Sun";
  if (/(\bstar\b|\bstars\b|\bstarry\b|\bstellar\b|\bbetelgeuse\b|\birs\s*3\b|\bpleiades\b|\bprotostar\b|\bcluster\b)/i.test(subject)) return "Stars";
  if (/(\bearth\b|\baurora\b|\bblue marble\b)/i.test(subject)) return "Earth";
  if (/(\bspacecraft\b|\brover\b|\bvoyager\b|\bperseverance\b|\bcuriosity\b|\bartemis\b|\blaunch\b|\bliftoff\b|\brocket\b)/i.test(subject)) return "Missions";

  if (/(\bnebula\b|\bnebulae\b|pillars of creation|carina|orion nebula|crab nebula|ring nebula|veil nebula|tarantula|horsehead|helix nebula|bubble nebula|eagle nebula|supernova remnant|planetary nebula)/i.test(combined)) {
    return "Nebulae";
  }

  if (/(\bgalaxy\b|\bgalaxies\b|spiral galaxy|andromeda|milky way|m31|m51|m81|m82|m101|m104|m74|sombrero|stephan|cartwheel|whirlpool|pinwheel|smacs|deep field|cluster of galaxies)/i.test(combined)) {
    return "Galaxies";
  }

  if (/(\bjupiter\b|\bsaturn\b|\bmars\b|\bvenus\b|\bmercury\b|\buranus\b|\bneptune\b|\bpluto\b|\bgas giant\b|jovian|martian|rings of saturn|great red spot)/i.test(combined)) {
    return "Planets";
  }

  if (/(\bmoon\b|\blunar\b|moon surface|crater tycho|mare |apollo landing|lroc|regolith)/i.test(combined)) {
    return "Moon";
  }

  if (/(\bthe sun\b|\bsolar\b|corona|coronal|solar flare|prominence|photosphere|\bsdo\b|\bsoho\b|sunspot)/i.test(combined)) {
    return "Sun";
  }

  if (/(\bearth\b|earth from space|blue marble|aurora australis|aurora borealis|low earth orbit|iss over earth|limb of earth)/i.test(combined)) {
    return "Earth";
  }

  if (/(\bstar cluster\b|\bglobular cluster\b|\bstellar cluster\b|\bpleiades\b|\bprotostar\b|\bbinary star\b|\bred (?:giant|supergiant)\b|\bwhite dwarf\b|\bbetelgeuse\b|\bstar birth\b|\bstar field\b)/i.test(combined)) {
    return "Stars";
  }

  if (/(\bspacecraft\b|\brover\b|\bvoyager\b|\bperseverance\b|\bcuriosity\b|\bartemis\b|\bjwst deployment\b|\bobservatory\b|\btelescope mirror\b|\blaunch\b|\bliftoff\b|\brockets?\b)/i.test(combined)) {
    return "Missions";
  }

  return "Deep Space";
}

function extractObjectName(title: string, description: string): string | undefined {
  const match = title.match(/(Messier\s*\d+|M\d+|NGC\s*\d+|IC\s*\d+|Pillars of Creation|Carina Nebula|Orion Nebula|Andromeda|Jupiter|Saturn|Mars|The Sun|The Moon|Cartwheel Galaxy|Stephan's Quintet|Cassiopeia A|Ring Nebula|Tarantula Nebula|Crab Nebula|Sombrero Galaxy|Whirlpool Galaxy|Phantom Galaxy|Pleiades)/i);
  if (match) return match[0];
  return undefined;
}

function extractObservatory(title: string, description: string, center?: string): string | undefined {
  const combined = `${title} ${description} ${center || ""}`;
  if (/james webb|jwst|nircam|miri/i.test(combined)) return "James Webb Space Telescope";
  if (/hubble|hst|acs|wfc3|wfpc2/i.test(combined)) return "Hubble Space Telescope";
  if (/solar dynamics observatory|\bsdo\b/i.test(combined)) return "Solar Dynamics Observatory";
  if (/chandra/i.test(combined)) return "Chandra X-ray Observatory";
  if (/spitzer/i.test(combined)) return "Spitzer Space Telescope";
  if (/juno/i.test(combined)) return "Juno Spacecraft";
  if (/cassini/i.test(combined)) return "Cassini Spacecraft";
  if (/perseverance|curiosity/i.test(combined)) return "Mars Rover";
  if (/lunar reconnaissance orbiter|\blro\b/i.test(combined)) return "Lunar Reconnaissance Orbiter";
  if (/international space station|\biss\b/i.test(combined)) return "International Space Station";
  if (center) return `NASA ${center}`;
  return undefined;
}

function asArray<T>(value: T | T[] | undefined): T[] {
  if (value === undefined) return [];
  return Array.isArray(value) ? value : [value];
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function textValue(value: unknown): string {
  if (typeof value === "string" || typeof value === "number") return String(value).trim();
  const record = asRecord(value);
  if (!record) return "";
  return textValue(record["#text"] ?? record["#cdata"] ?? "");
}

function decodeHtmlEntities(value: string): string {
  const namedEntities: Record<string, string> = {
    amp: "&",
    apos: "'",
    gt: ">",
    lt: "<",
    nbsp: " ",
    quot: '"'
  };

  const decodeOnce = (input: string) =>
    input
      .replace(/&#x([0-9a-f]+);/gi, (_, code: string) => String.fromCodePoint(Number.parseInt(code, 16)))
      .replace(/&#(\d+);/g, (_, code: string) => String.fromCodePoint(Number.parseInt(code, 10)))
      .replace(/&([a-z]+);/gi, (entity, name: string) => namedEntities[name.toLowerCase()] ?? entity);

  return decodeOnce(decodeOnce(value));
}

function cleanMarkup(value: string): string {
  return decodeHtmlEntities(value)
    .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<\/p>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function conciseScienceDescription(rawDescription: string): string {
  let description = cleanMarkup(rawDescription)
    .replace(/\[\s*Image description\s*:[\s\S]*$/i, "")
    .replace(/\bLinks?\s+(?:Research paper|Pan video)[\s\S]*$/i, "")
    .trim();

  if (description.length <= 640) return description;

  description = description.slice(0, 640);
  const finalSentence = Math.max(description.lastIndexOf(". "), description.lastIndexOf("! "), description.lastIndexOf("? "));
  return `${description.slice(0, finalSentence > 320 ? finalSentence + 1 : 637).trim()}…`;
}

function normalizeRemoteUrl(value: string, baseUrl?: string): string {
  if (!value) return "";

  try {
    const url = new URL(decodeHtmlEntities(value.trim()), baseUrl);
    if (url.protocol !== "http:" && url.protocol !== "https:") return "";
    if (url.protocol === "http:") url.protocol = "https:";
    return url.toString();
  } catch {
    return "";
  }
}

function firstImageFromMarkup(markup: string, baseUrl?: string): string {
  const decoded = decodeHtmlEntities(markup);
  const match = decoded.match(/<img\b[^>]+src=["']([^"']+)["']/i);
  return match ? normalizeRemoteUrl(match[1], baseUrl) : "";
}

function toIsoDate(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "1970-01-01" : date.toISOString().slice(0, 10);
}

function stableFeedId(configId: string, sourceUrl: string, index: number): string {
  try {
    const slug = new URL(sourceUrl).pathname.split("/").filter(Boolean).pop();
    if (slug) return `${configId}-${slug.toLowerCase().replace(/[^a-z0-9_-]/g, "-")}`;
  } catch {
    // The source URL is validated separately; the index is a deterministic fallback.
  }

  return `${configId}-${index + 1}`;
}

function feedEnclosureUrl(item: Record<string, unknown>, sourceUrl: string): string {
  const enclosures = asArray(item.enclosure);

  for (const enclosureValue of enclosures) {
    const enclosure = asRecord(enclosureValue);
    if (!enclosure) continue;
    const mediaType = textValue(enclosure["@_type"]);
    if (mediaType && !mediaType.startsWith("image/")) continue;
    const url = normalizeRemoteUrl(textValue(enclosure["@_url"]), sourceUrl);
    if (url) return url;
  }

  return "";
}

async function fetchObservatoryFeed(config: ObservatoryFeedConfig): Promise<GalleryImage[]> {
  try {
    const response = await fetch(config.url, {
      headers: {
        Accept: "application/rss+xml, application/xml, text/xml",
        "User-Agent": "Astroboat/1.0 (+https://astroboat.in)"
      },
      next: { revalidate: GALLERY_REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(8000)
    });

    if (!response.ok) {
      console.warn(`${config.source} gallery feed returned HTTP ${response.status}`);
      return [];
    }

    const parsed = asRecord(GALLERY_XML_PARSER.parse(await response.text()));
    const rss = asRecord(parsed?.rss);
    const channel = asRecord(rss?.channel);
    const items = asArray(channel?.item);
    const images: GalleryImage[] = [];

    for (const [index, rawItem] of items.entries()) {
      if (images.length >= 14) break;
      const item = asRecord(rawItem);
      if (!item) continue;

      const sourceUrl = normalizeRemoteUrl(textValue(item.link) || textValue(item.guid), config.url);
      const rawDescription = textValue(item.description);
      const enclosureUrl = feedEnclosureUrl(item, sourceUrl || config.url);
      const previewUrl = firstImageFromMarkup(rawDescription, sourceUrl || config.url);
      const imageUrl = enclosureUrl || previewUrl;
      const title = normalizeTitle(cleanMarkup(textValue(item.title)));
      const description = conciseScienceDescription(rawDescription);

      if (!sourceUrl || !imageUrl || !title || !description) continue;

      const score = scoreGalleryCandidate({
        title,
        description,
        url: imageUrl,
        credit: config.credit,
        observatory: config.observatory,
        source: config.source
      });

      if (score.verdict === "reject") continue;

      images.push({
        id: stableFeedId(config.id, sourceUrl, index),
        title,
        description,
        imageUrl,
        thumbnailUrl: previewUrl || imageUrl,
        source: config.source,
        sourceUrl,
        credit: config.credit,
        date: toIsoDate(textValue(item.pubDate)),
        category: detectCategory(title, [], description),
        objectName: extractObjectName(title, description),
        observatory: extractObservatory(title, description) || config.observatory,
        aspectRatio: 1.5
      });
    }

    return images;
  } catch (error) {
    console.warn(`${config.source} gallery feed failed:`, error);
    return [];
  }
}

function apodDateFromUrl(sourceUrl: string): string {
  const match = sourceUrl.match(/\/ap(\d{2})(\d{2})(\d{2})\.html/i);
  if (!match) return "";
  const year = Number(match[1]) >= 90 ? `19${match[1]}` : `20${match[1]}`;
  return `${year}-${match[2]}-${match[3]}`;
}

async function fetchNasaApodRssImages(): Promise<GalleryImage[]> {
  try {
    const response = await fetch(APOD_RSS_URL, {
      headers: { "User-Agent": "Astroboat/1.0 (+https://astroboat.in)" },
      next: { revalidate: GALLERY_REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(8000)
    });

    if (!response.ok) return [];

    const parsed = asRecord(GALLERY_XML_PARSER.parse(await response.text()));
    const rss = asRecord(parsed?.rss);
    const channel = asRecord(rss?.channel);
    const items = asArray(channel?.item)
      .map(asRecord)
      .filter((item): item is Record<string, unknown> => Boolean(item))
      .map((item) => ({
        item,
        sourceUrl: normalizeRemoteUrl(textValue(item.link), APOD_RSS_URL)
      }))
      .filter(({ sourceUrl }) => Boolean(apodDateFromUrl(sourceUrl)))
      .slice(0, 10);

    const pageResults = await Promise.allSettled(
      items.map(async ({ item, sourceUrl }) => {
        const pageResponse = await fetch(sourceUrl, {
          headers: { "User-Agent": "Astroboat/1.0 (+https://astroboat.in)" },
          next: { revalidate: GALLERY_REVALIDATE_SECONDS },
          signal: AbortSignal.timeout(6000)
        });

        if (!pageResponse.ok) return null;
        const html = await pageResponse.text();
        const linkedImage = html.match(/<a\b[^>]+href=["']([^"']+\.(?:jpe?g|png|webp))["'][^>]*>\s*<img/i)?.[1];
        const displayedImage = html.match(/<img\b[^>]+src=["']([^"']+\.(?:jpe?g|png|webp))["']/i)?.[1];
        const hdImageUrl = linkedImage ? normalizeRemoteUrl(linkedImage, sourceUrl) : "";
        const imageUrl = displayedImage ? normalizeRemoteUrl(displayedImage, sourceUrl) : hdImageUrl;
        const rssPreview = firstImageFromMarkup(textValue(item.description), sourceUrl);
        if (!imageUrl) return null;

        const titleMatch =
          html.match(/<b>\s*([^<]+?)\s*<\/b>\s*<br>\s*<b>\s*Image Credit/i) ||
          html.match(/<title>\s*APOD:\s*\d{4}\s+[A-Za-z]+\s+\d{1,2}\s*[–—-]\s*([\s\S]*?)<\/title>/i);
        const title = normalizeTitle(cleanMarkup(titleMatch?.[1] || "Astronomical Observation"));
        const explanationMatch = html.match(/<b>\s*Explanation:\s*<\/b>([\s\S]*?)(?:<p>\s*<center>|<center>\s*<b>\s*Tomorrow)/i);
        const description = conciseScienceDescription(explanationMatch?.[1] || textValue(item.description));
        const creditMatch = html.match(/<b>\s*Image Credit(?:\s*(?:&amp;|&)\s*Copyright)?:\s*<\/b>([\s\S]*?)<\/center>/i);
        const credit = cleanMarkup(creditMatch?.[1] || "NASA / APOD").slice(0, 180) || "NASA / APOD";
        const date = apodDateFromUrl(sourceUrl);

        const score = scoreGalleryCandidate({
          title,
          description,
          url: imageUrl,
          credit,
          source: "NASA APOD"
        });
        if (score.verdict === "reject") return null;

        return {
          id: `apod-${date}`,
          title,
          description,
          imageUrl,
          thumbnailUrl: rssPreview || imageUrl,
          hdImageUrl: hdImageUrl || undefined,
          source: "NASA APOD" as const,
          sourceUrl,
          credit,
          date,
          category: detectCategory(title, [], description),
          objectName: extractObjectName(title, description),
          observatory: extractObservatory(title, description),
          aspectRatio: 1.33
        } satisfies GalleryImage;
      })
    );

    return pageResults.flatMap((result) =>
      result.status === "fulfilled" && result.value ? [result.value] : []
    );
  } catch (error) {
    console.warn("NASA APOD RSS fallback failed:", error);
    return [];
  }
}

async function fetchNasaApodImages(): Promise<GalleryImage[]> {
  const apiKey = process.env.NASA_API_KEY || "DEMO_KEY";
  const endDate = new Date();
  const startDate = new Date(endDate);
  startDate.setUTCDate(startDate.getUTCDate() - 44);
  const url = `${NASA_APOD_API_URL}?api_key=${encodeURIComponent(apiKey)}&start_date=${startDate.toISOString().slice(0, 10)}&end_date=${endDate.toISOString().slice(0, 10)}&thumbs=false`;

  try {
    const res = await fetch(url, {
      next: { revalidate: GALLERY_REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(8000)
    });

    if (!res.ok) {
      if (res.status !== 403 && res.status !== 429) {
        console.warn(`NASA APOD API returned HTTP ${res.status}`);
      }
      return [];
    }

    const data = (await res.json()) as Array<{
      date?: string;
      explanation?: string;
      hdurl?: string;
      media_type?: string;
      title?: string;
      url?: string;
      copyright?: string;
    }>;

    if (!Array.isArray(data)) return [];

    const results: GalleryImage[] = [];

    for (const item of data) {
      if (item.media_type !== "image" || !item.url) continue;

      const title = normalizeTitle(item.title || "Astronomical Observation");
      const description = item.explanation || "";
      const imageUrl = item.url;
      const thumbnailUrl = item.url;
      const credit = item.copyright ? item.copyright.trim().replace(/\n/g, " ") : "NASA / APOD";

      // Apply strict space and exclusion filtering
      if (!isRelevantSpaceImage(title, description, imageUrl, [], credit)) {
        continue;
      }

      const category = detectCategory(title, [], description);
      const objectName = extractObjectName(title, description);
      const observatory = extractObservatory(title, description);

      results.push({
        id: `apod-${item.date || Math.random().toString(36).slice(2, 8)}`,
        title,
        description,
        imageUrl: normalizeRemoteUrl(imageUrl),
        thumbnailUrl: normalizeRemoteUrl(thumbnailUrl),
        hdImageUrl: item.hdurl ? normalizeRemoteUrl(item.hdurl) : undefined,
        source: "NASA APOD",
        sourceUrl: `https://apod.nasa.gov/apod/ap${(item.date || "").replace(/-/g, "").slice(2)}.html`,
        credit,
        date: item.date || new Date().toISOString().slice(0, 10),
        category,
        objectName,
        observatory,
        aspectRatio: 1.33
      });
    }

    return results.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 30);
  } catch (error) {
    console.warn("NASA APOD fetch failed:", error);
    return [];
  }
}

async function fetchNasaImageLibraryQueries(): Promise<GalleryImage[]> {
  // Tightly targeted astronomy and space-flight queries focused strictly on cosmic photography
  const curatedQueries = [
    { q: "James Webb Space Telescope NIRCam MIRI galaxy deep field", source: "ESA / Webb" as const },
    { q: "James Webb Space Telescope NIRCam MIRI nebula star formation", source: "ESA / Webb" as const },
    { q: "Hubble Space Telescope interacting galaxies Messier NGC", source: "Hubble" as const },
    { q: "Hubble Space Telescope emission planetary nebula star cluster", source: "Hubble" as const },
    { q: "Chandra X-ray black hole galaxy cluster supernova remnant", source: "Observatory Archive" as const },
    { q: "Spitzer infrared galaxy nebula star formation", source: "Observatory Archive" as const },
    { q: "JPL Cassini Saturn rings atmosphere", source: "NASA Image Library" as const },
    { q: "JPL Juno Jupiter Great Red Spot perijove", source: "NASA Image Library" as const },
    { q: "JPL Voyager Uranus Neptune moons", source: "NASA Image Library" as const },
    { q: "JPL Galileo Europa Io Ganymede", source: "NASA Image Library" as const },
    { q: "New Horizons Pluto Charon", source: "NASA Image Library" as const },
    { q: "Solar Dynamics Observatory AIA coronal flare Sun", source: "NASA Image Library" as const },
    { q: "ISS Earth observation atmospheric limb aurora night", source: "NASA Image Library" as const },
    { q: "Perseverance Mastcam-Z Mars panorama crater", source: "NASA Image Library" as const },
    { q: "Lunar Reconnaissance Orbiter LROC Moon crater", source: "NASA Image Library" as const },
    { q: "rocket liftoff night launch pad space", source: "NASA Image Library" as const }
  ];

  const results: GalleryImage[] = [];

  const promises = curatedQueries.map(async ({ q, source }) => {
    try {
      const url = `${NASA_IMAGE_LIBRARY_API_BASE}/search?q=${encodeURIComponent(q)}&media_type=image&page_size=14`;
      const res = await fetch(url, {
        next: { revalidate: GALLERY_REVALIDATE_SECONDS },
        signal: AbortSignal.timeout(8000)
      });

      if (!res.ok) return [];

      const json = await res.json();
      const items = json?.collection?.items || [];
      const queryImages: GalleryImage[] = [];

      for (const item of items) {
        const itemData = item.data?.[0];
        if (!itemData) continue;

        const nasaId = itemData.nasa_id;
        const title = normalizeTitle(itemData.title || "");
        const description = conciseScienceDescription(itemData.description || itemData.description_508 || "");
        const keywords = Array.isArray(itemData.keywords) ? itemData.keywords : [];
        const credit = itemData.secondary_creator || (itemData.center ? `NASA / ${itemData.center}` : "NASA");

        if (!title || !nasaId) continue;

        // Use real verified preview links returned by NASA API
        const links = Array.isArray(item.links) ? item.links : [];
        const previewLink =
          links.find((l: { rel?: string; render?: string; href?: string }) => l.rel === "preview" || l.render === "image")?.href ||
          links[0]?.href;

        if (!previewLink) continue;

        const cleanPreview = normalizeRemoteUrl(previewLink);
        const canonicalLink = links.find((l: { rel?: string; href?: string }) => l.rel === "canonical")?.href;
        const cleanOrig = canonicalLink ? normalizeRemoteUrl(canonicalLink) : "";

        const thumbnailUrl = cleanPreview;
        const imageUrl = cleanPreview;
        const hdImageUrl = cleanOrig || undefined;

        // Apply strict space and exclusion filtering
        if (!isRelevantSpaceImage(title, description, thumbnailUrl, keywords, credit)) {
          continue;
        }

        const category = detectCategory(title, keywords, description);
        const objectName = extractObjectName(title, description);
        const observatory = extractObservatory(title, description, itemData.center);
        const date = itemData.date_created ? itemData.date_created.slice(0, 10) : new Date().toISOString().slice(0, 10);

        queryImages.push({
          id: `nasa-lib-${nasaId.toLowerCase().replace(/[^a-z0-9_-]/g, "-")}`,
          title,
          description,
          imageUrl,
          thumbnailUrl,
          hdImageUrl,
          source,
          sourceUrl: `https://images.nasa.gov/details/${encodeURIComponent(nasaId)}`,
          credit,
          date,
          category,
          objectName,
          observatory,
          aspectRatio: 1.33
        });
      }

      return queryImages;
    } catch (e) {
      console.warn(`NASA Image Library query failed for "${q}":`, e);
      return [];
    }
  });

  const queryResults = await Promise.allSettled(promises);
  for (const r of queryResults) {
    if (r.status === "fulfilled") {
      results.push(...r.value);
    }
  }

  return results;
}

export function deduplicateAndRankGallery(images: GalleryImage[]): GalleryImage[] {
  const seenIds = new Set<string>();
  const seenTitles = new Set<string>();
  const releaseCounts = new Map<string, number>();
  const scoredImages: Array<{ image: GalleryImage; score: number; freshness: number; timestamp: number }> = [];

  for (const img of images) {
    if (!img || !img.id || !img.imageUrl) continue;

    if (seenIds.has(img.id)) continue;

    const titleKey = img.title
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "")
      .slice(0, 24);

    if (titleKey.length > 5 && seenTitles.has(titleKey)) continue;

    const releaseMatch = img.id.match(/(?:weic|heic|potm|potw|eso)\d{4,}[a-z]?/i)?.[0];
    const releaseKey = releaseMatch
      ? `${img.source}-${releaseMatch.replace(/[a-z]$/i, "")}`.toLowerCase()
      : undefined;
    if (releaseKey && (releaseCounts.get(releaseKey) || 0) >= 2) continue;

    // Evaluate relevance score
    const scoreResult = scoreGalleryCandidate({
      title: img.title,
      description: img.description,
      url: img.imageUrl,
      credit: img.credit,
      observatory: img.observatory,
      source: img.source
    });

    if (scoreResult.verdict === "reject") continue;

    seenIds.add(img.id);
    if (titleKey.length > 5) seenTitles.add(titleKey);
    if (releaseKey) releaseCounts.set(releaseKey, (releaseCounts.get(releaseKey) || 0) + 1);

    const timestamp = new Date(img.date).getTime();
    const ageInDays = Number.isFinite(timestamp) ? (Date.now() - timestamp) / 86_400_000 : Number.POSITIVE_INFINITY;
    const freshness = ageInDays <= 550 ? 3 : ageInDays <= 1_825 ? 2 : ageInDays <= 4_380 ? 1 : 0;
    scoredImages.push({ image: img, score: scoreResult.score, freshness, timestamp });
  }

  // Recent observatory releases lead the experience. Curated archive anchors
  // remain available, but no longer pin a four-year-old image to the hero.
  scoredImages.sort((a, b) => {
    if (b.freshness !== a.freshness) return b.freshness - a.freshness;
    if (a.image.isFallback !== b.image.isFallback) return a.image.isFallback ? 1 : -1;
    if (b.score !== a.score) return b.score - a.score;
    return b.timestamp - a.timestamp;
  });

  return scoredImages.map((item) => item.image);
}

export async function getGalleryData(): Promise<GalleryResult> {
  const warnings: string[] = [];

  const [apodResult, apodRssResult, libResult, ...observatoryResults] = await Promise.allSettled([
    fetchNasaApodImages(),
    fetchNasaApodRssImages(),
    fetchNasaImageLibraryQueries(),
    ...OBSERVATORY_IMAGE_FEEDS.map(fetchObservatoryFeed)
  ]);

  const liveImages: GalleryImage[] = [];
  const apodImages = [
    ...(apodResult.status === "fulfilled" ? apodResult.value : []),
    ...(apodRssResult.status === "fulfilled" ? apodRssResult.value : [])
  ];

  if (apodImages.length > 0) {
    liveImages.push(...apodImages);
  } else {
    warnings.push("NASA APOD is temporarily unavailable; other observatory sources remain live.");
  }

  if (libResult.status === "fulfilled" && libResult.value.length > 0) {
    liveImages.push(...libResult.value);
  } else {
    warnings.push("NASA Image Library search is temporarily unavailable.");
  }

  const unavailableObservatories: string[] = [];
  observatoryResults.forEach((result, index) => {
    if (result.status === "fulfilled" && result.value.length > 0) {
      liveImages.push(...result.value);
    } else {
      unavailableObservatories.push(OBSERVATORY_IMAGE_FEEDS[index].source);
    }
  });

  if (unavailableObservatories.length > 0) {
    warnings.push(`${unavailableObservatories.join(", ")} image feed${unavailableObservatories.length > 1 ? "s are" : " is"} temporarily unavailable.`);
  }

  const allImages = [...liveImages, ...CURATED_FALLBACK_GALLERY];
  const deduplicated = deduplicateAndRankGallery(allImages).slice(0, 120);

  const isFallback = liveImages.length === 0;
  const heroCategories: GalleryCategory[] = ["Galaxies", "Nebulae", "Deep Space", "Planets", "Moon", "Sun", "Stars"];
  const featuredImage =
    deduplicated.find(
      (img) =>
        !img.isFallback &&
        heroCategories.includes(img.category) &&
        !/\b(antenna|telescope|observatory|instrument|launch pad|rocket)\b/i.test(img.title)
    ) ||
    deduplicated.find((img) => !img.isFallback) ||
    deduplicated[0] ||
    null;

  const categoryOrder: GalleryCategory[] = [
    "Galaxies",
    "Nebulae",
    "Deep Space",
    "Planets",
    "Moon",
    "Sun",
    "Earth",
    "Stars",
    "Missions"
  ];
  const populatedCategories = new Set(deduplicated.map((image) => image.category));
  const categories = ["All", ...categoryOrder.filter((category) => populatedCategories.has(category))];

  return {
    images: deduplicated,
    featuredImage,
    categories,
    total: deduplicated.length,
    lastUpdated: new Date().toISOString(),
    isFallback,
    warnings
  };
}

export async function getGalleryImageById(id: string): Promise<GalleryImage | null> {
  const data = await getGalleryData();
  return data.images.find((img) => img.id === id) || null;
}
