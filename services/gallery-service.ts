import { XMLParser } from "fast-xml-parser";
import {
  GALLERY_COLLECTION_LIMIT,
  GALLERY_REVALIDATE_SECONDS,
  NASA_APOD_API_URL,
  NASA_APOD_FEED_URL,
  NASA_IMAGE_LIBRARY_API_BASE
} from "@/lib/constants";
import {
  canonicalUrlKey,
  cleanInlineText,
  cleanPublisherUrl,
  CONTENT_USER_AGENT,
  decodeEntities,
  describeFetchError,
  fetchFromTrustedHosts,
  fetchWithRetry,
  hostMatches,
  mapWithConcurrency,
  logInfo,
  parseWebUrl,
  verifyRemoteImage
} from "@/lib/content-utils";
import { getDurableStore } from "@/lib/durable-store";
import type { GalleryCategory, GalleryImage, GalleryResult, GallerySource } from "@/lib/types";

// ---------------------------------------------------------------------------
// Relevance scoring
// ---------------------------------------------------------------------------

// Subjects that are never observational astronomy imagery. Evaluated against
// titles and keywords, not full science descriptions: APOD explanations often
// mention people or researchers even when the image itself is astronomical.
export const REJECTED_CONTENT_PATTERN =
  /\b(person|people|portraits?|headshot|selfie|standing|sitting|smiles|smiling|handshake|speaks|speaking|speaker|podium|interview|administrator|director|manager|crew portrait|astronaut portrait|official portrait|team photo|group photo|panelist|audience|crowd|spectator|visitor|children|child|family|classroom|school|intern|honoree|retiree|minister|ministra|ministro|profesor|profesora|signing ceremony|press conference|media briefing|news briefing|town hall|keynote|celebration|reception|symposium|meeting|conference|roundtable|workshop|logo|patch|emblem|insignia|poster|flyer|diagram|schematic|infographic|flowchart|chart|graph|table|slide|presentation|certificate|award|trophy|stamp|badge|mockup|model of|miniature|scale model|toy|cake|exhibit|booth|hallway|lobby|auditorium|conference room|office|desk|building exterior|building interior|headquarters|clean ?room|cleanroom|assembly room|assembly line|machining|welding|forklift|scaffolding|fabrication|screenshot|screengrab|document|whitepaper|book cover|magazine|newspaper|memo|history of|commemoration|commemorative|welcome to|hotel|feature names|informal names|animation|artist[’']s (?:impression|concept)|illustration|rendering|renderings|locator|finding chart|context|comparison image|compass image|annotated|spectrum|spectra|simulation|simulated|square layout|placeholder)\b/i;

// Facilities and hardware. Penalized rather than rejected: a telescope under
// the Milky Way or a rocket on the pad can be legitimate space imagery when the
// title also names an astronomical or launch subject.
const HARDWARE_SUBJECT_PATTERN =
  /\b(mirror segments?|segments?|assembly|installing|installation|inspect(?:s|ed|ion|ing)?|testing in chamber|lifted|lifting|transporting|rollout|unloading|shipping|containers?|crates?|cranes?|production|technical facility|facility|construction|groundwork|tunnels?|main structure|prototype|prototyping|development kit|processor unit|antennas?|dome|shelves|warehouse|factory|gate|road|fence|parking lot|bus|van|truck)\b/i;

// Natural astronomical subjects (not instruments or missions). Only these can
// offset a hardware penalty: "telescope under the Milky Way" stays, while
// "Cassini spacecraft in an assembly room" does not.
const CELESTIAL_SUBJECT_PATTERN =
  /\b(galax(?:y|ies)|nebula[es]?|nebulas|milky way|andromeda|stars?|starry|stellar|star trails?|clusters?|supernova|pulsar|quasar|black hole|jupiter|saturn|mars|venus|mercury|uranus|neptune|pluto|charon|titan|europa|enceladus|ganymede|io|comets?|asteroids?|meteors?|fireball|moon|lunar|sun|solar|aurora[es]?|eclipse|conjunction|zodiacal|night sky|sky|constellation|orion|magellanic clouds?)\b/i;

// Generic people words. On their own they only lower the score, so "Scientists
// map a nebula" is not discarded while a staff photo with no astronomical
// subject still falls below the threshold.
const WEAK_PEOPLE_PATTERN = /\b(scientists?|astronomers?|researchers?|engineers?|technicians?|workers?|staff|team|students?|employees?|crew members?)\b/i;

const DESCRIBED_HUMAN_SCENE_PATTERN =
  /\b(pictured (?:at|with|from)|from left|poses? (?:with|for)|stands? (?:with|beside|in front)|sits? (?:with|beside)|speaks? (?:at|during|to)|participants?|attendees?|technicians? work|workers? (?:clear|install|prepare)|staff (?:inspect|examine|prepare)|during (?:a|the) (?:ceremony|meeting|conference|briefing|event|visit|tour))\b/i;

const NON_PHOTOGRAPHIC_DESCRIPTION_PATTERN =
  /\b(?:this\s+)?artist[’']s\s+(?:concept|impression)|\billustration of\b|\bcomputer-generated (?:image|view|rendering)\b|\b(?:depicted|shown) in this rendering\b|\bthis (?:rendering|infographic|graphic|chart|graph|plot|diagram|illustration|animation|artwork)\b/i;

const ANNOTATED_SCIENCE_IMAGE_PATTERN =
  /\b(?:solid|dashed) (?:curve|line)\b|\borbit is (?:shown|displayed)\b|\bmarked with (?:a |an )?(?:crosshair|circle|arrow)\b|\barrows? (?:in (?:this|the) image )?indicate\b/i;

// Strong positive astronomy and space-exploration signals.
export const POSITIVE_SPACE_SIGNALS =
  /\b(galaxy|galaxies|spiral galaxy|elliptical galaxy|barred spiral|andromeda|milky way|sombrero galaxy|cartwheel galaxy|whirlpool galaxy|pinwheel galaxy|deep field|hubble ultra deep|smacs\s*\d+|stephan'?s quintet|ngc\s*\d+|messier\s*\d+|ic\s*\d+|nebula|nebulae|nebulas|planetary nebula|emission nebula|reflection nebula|dark nebula|supernova remnant|supernova|nova remnant|crab nebula|eagle nebula|carina nebula|orion nebula|pillars of creation|ring nebula|veil nebula|tarantula nebula|helix nebula|horsehead nebula|bubble nebula|star cluster|globular cluster|open cluster|stellar cluster|stellar nursery|star-forming|star formation|star field|star clouds|pleiades|protostars?|binary stars?|red giant|red supergiant|white dwarf|betelgeuse|rigel|orion|pulsar|magnetar|quasar|black hole|sagittarius a\*?|event horizon|gravitational lens|cosmic web|interstellar|jupiter|saturn|mars|venus|mercury|uranus|neptune|pluto|charon|titan|europa|io|ganymede|enceladus|callisto|ceres|asteroids?|comets?|meteors?|fireball|exoplanets?|gas giant|rings of saturn|great red spot|jovian|martian|olympus mons|valles marineris|jezero crater|gale crater|lunar surface|moon crater|craters?|tycho crater|mare |apollo landing|lunar horizon|moon|earthrise|earth from orbit|earth from space|blue marble|aurora|auroras|aurora australis|aurora borealis|noctilucent|atmospheric limb|the sun|sun|solar flare|coronal loop|coronal mass ejection|prominence|sunspot|solar dynamics observatory|eclipse|conjunction|occultation|rocket launch|liftoff|night launch|launch pad|spacecraft in orbit|space station|international space station|iss cupola|satellite in orbit|hubble space telescope|james webb space telescope|jwst|very large telescope|vlt|alma|chandra x-ray|spitzer|voyager|cassini|juno spacecraft|juno|perseverance rover|curiosity rover|rosetta|solar orbiter|new horizons|swift)\b/i;

export const RAW_CODE_TITLE_REGEX =
  /^([A-Z]{2,6}[-_]?[0-9a-z]{4,}[\w-]*|\d{4}[-_]\w+|DSC_\d+|IMG_\d+|PIA\d+|NHQ\d+|KSC\w+|JSC\w+|MSFC\w+|GSFC\w+|ARC\w+|GRC\w+)$/i;

const PLACEHOLDER_IMAGE_PATTERN = /\/themes\/|nasa-logo|placeholder|default[-_]image|cq5dam\.thumbnail\.(?:48|140)\./i;

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
  const title = candidate.title.trim();

  if (RAW_CODE_TITLE_REGEX.test(title)) {
    return { score: 0, verdict: "reject", reasons: ["Title is an internal archival code rather than a descriptive title"] };
  }

  if (!parseWebUrl(candidate.url) || PLACEHOLDER_IMAGE_PATTERN.test(candidate.url)) {
    return { score: 0, verdict: "reject", reasons: ["Image URL is missing, invalid, or a site placeholder"] };
  }

  if (/\.(mp4|webm|avi|mov|mp3|wav|pdf|doc|zip|eps|ai|tiff?)(\?|$)/i.test(candidate.url)) {
    return { score: 0, verdict: "reject", reasons: ["Not a web image (video, audio, document, or TIFF)"] };
  }

  const keywords = (candidate.keywords || []).join(" ");
  const subjectText = `${title} ${keywords}`;
  const lead = candidate.description.slice(0, 600);
  const scienceContext = `${title} ${candidate.description} ${keywords} ${candidate.observatory || ""}`;

  if (containsRejectedKeywords(subjectText)) {
    return { score: 0, verdict: "reject", reasons: ["Title or keywords describe people, events, graphics, or non-photographic media"] };
  }
  if (DESCRIBED_HUMAN_SCENE_PATTERN.test(`${title} ${lead}`)) {
    return { score: 0, verdict: "reject", reasons: ["Description identifies a people-focused or administrative scene"] };
  }
  if (NON_PHOTOGRAPHIC_DESCRIPTION_PATTERN.test(lead)) {
    return { score: 0, verdict: "reject", reasons: ["Description identifies an illustration, rendering, or chart rather than observed imagery"] };
  }
  if (ANNOTATED_SCIENCE_IMAGE_PATTERN.test(candidate.description.slice(0, 900))) {
    return { score: 0, verdict: "reject", reasons: ["Description identifies plotted or annotated media rather than a clean observation"] };
  }

  const titleHasSubject = hasPositiveSpaceSignals(title);

  if (titleHasSubject) {
    score += 25;
    reasons.push("Astronomy subject in title");
  } else if (hasPositiveSpaceSignals(scienceContext)) {
    score += 15;
    reasons.push("Astronomy subject in metadata");
  } else {
    score -= 30;
    reasons.push("No recognized astronomy subject");
  }

  if (HARDWARE_SUBJECT_PATTERN.test(subjectText)) {
    score -= CELESTIAL_SUBJECT_PATTERN.test(title) ? 15 : 35;
    reasons.push("Title or keywords describe facilities or hardware");
  }

  if (WEAK_PEOPLE_PATTERN.test(subjectText)) {
    score -= titleHasSubject ? 5 : 20;
    reasons.push("Title or keywords mention people");
  }

  if (candidate.title.length < 5 || candidate.description.length < 15) {
    score -= 25;
    reasons.push("Insufficient metadata depth");
  }

  if (/\b(james webb|jwst|hubble|hst|chandra|spitzer|juno|cassini|perseverance|curiosity|solar dynamics observatory|sdo|soho|lroc|iss cupola|vlt|alma|euclid|new horizons|voyager)\b/i.test(scienceContext)) {
    score += 15;
    reasons.push("Scientific observatory or mission instrument");
  }

  if (/\b(stsci|jpl-caltech|jpl|goddard|esa\s*\/?\s*webb|esa\s*\/?\s*hubble|cxc|eso|nasa|apod)\b/i.test(`${candidate.credit || ""} ${candidate.source || ""}`)) {
    score += 10;
    reasons.push("Primary astronomical institution or archive");
  }

  // Case-sensitive "M42"-style designations; "M1 segments" (mirror hardware) is excluded.
  if (/\b(?:messier\s*\d+|ngc\s*\d+|ic\s*\d+|smacs\s*\d+|30 doradus)\b/i.test(title) || /\bM\s?\d{1,3}\b(?!\s*(?:segments?|mirror))/.test(title)) {
    score += 10;
    reasons.push("Standard celestial catalog designation");
  }

  const verdict = score >= 65 ? "include" : "reject";
  if (verdict === "reject") reasons.push(`Score ${Math.max(0, score)} is below the inclusion threshold`);
  return { score: Math.min(100, Math.max(0, score)), verdict, reasons };
}

export function isRelevantSpaceImage(title: string, description: string, url: string, keywords: string[] = [], credit = ""): boolean {
  return scoreGalleryCandidate({ title, description, url, keywords, credit }).verdict === "include";
}

// ---------------------------------------------------------------------------
// Metadata helpers
// ---------------------------------------------------------------------------

function normalizeTitle(rawTitle: string): string {
  let title = rawTitle.replace(/\s+/g, " ").trim();
  title = title.replace(/\s*\([^)]*(NIRCam|WFC3|ACS|MIRI|Composite|wide view|single filter|image)[^)]*\)/gi, "");
  title = title.replace(/^NASA['’]s\s+/i, "");
  title = title.replace(/^(?:Hubble|Webb)\s+(?:Sees|Captures|Images|Spots)\s+(?:a\s+|an\s+|the\s+)?/i, "");
  title = title.trim() || rawTitle;
  return title.charAt(0).toUpperCase() + title.slice(1);
}

export function detectCategory(title: string, keywords: string[] = [], description = ""): GalleryCategory {
  const subject = `${title} ${keywords.join(" ")}`.toLowerCase();
  const combined = `${title} ${keywords.join(" ")} ${description}`.toLowerCase();

  if (/(\bnebula\b|\bnebulae\b|\bnebulas\b|\bbubbles?\b|\bbow shocks?\b|pillars of creation|supernova remnant|planetary nebula)/i.test(subject)) return "Nebulae";
  if (/(\bgalaxy\b|\bgalaxies\b|\bspiral\b|andromeda|milky way|smacs|deep field|messier\s*(?:31|51|74|81|82|101|104)\b)/i.test(subject)) return "Galaxies";
  if (/(\bjupiter\b|\bsaturn\b|\bmars\b|\bvenus\b|\bmercury\b|\buranus\b|\bneptune\b|\bpluto\b|\bcharon\b|\btitan\b|\beuropa\b|\benceladus\b|\bganymede\b|\bio\b|\basteroids?\b|\bcomets?\b|\bexoplanets?\b)/i.test(subject)) return "Planets";
  if (/(\bmoon\b|\blunar\b|\btycho crater\b|\bapollo\b)/i.test(subject)) return "Moon";
  if (/(\bsun\b|\bsolar\b|\bcoronal?\b|\bsunspots?\b)/i.test(subject)) return "Sun";
  if (/(\bstar\b|\bstars\b|\bstarry\b|\bstellar\b|\bbetelgeuse\b|\brigel\b|\birs\s*3\b|\bpleiades\b|\bprotostars?\b|\bcluster\b)/i.test(subject)) return "Stars";
  if (/(\bearth\b|\baurora\b|\bblue marble\b|\bnoctilucent\b)/i.test(subject)) return "Earth";
  if (/(\bspacecraft\b|\brover\b|\bvoyager\b|\bperseverance\b|\bcuriosity\b|\bartemis\b|\blaunch\b|\bliftoff\b|\brocket\b)/i.test(subject)) return "Missions";

  if (/(\bnebula\b|\bnebulae\b|pillars of creation|carina|orion nebula|crab nebula|ring nebula|veil nebula|tarantula|horsehead|helix nebula|bubble nebula|eagle nebula|supernova remnant|planetary nebula)/i.test(combined)) return "Nebulae";
  if (/(\bgalaxy\b|\bgalaxies\b|spiral galaxy|andromeda|milky way|\bm31\b|\bm51\b|\bm81\b|\bm82\b|\bm101\b|\bm104\b|\bm74\b|sombrero|stephan|cartwheel|whirlpool|pinwheel|smacs|deep field|cluster of galaxies)/i.test(combined)) return "Galaxies";
  if (/(\bjupiter\b|\bsaturn\b|\bmars\b|\bvenus\b|\bmercury\b|\buranus\b|\bneptune\b|\bpluto\b|\bgas giant\b|jovian|martian|rings of saturn|great red spot)/i.test(combined)) return "Planets";
  if (/(\bmoon\b|\blunar\b|moon surface|crater tycho|\bmare\b|apollo landing|lroc|regolith)/i.test(combined)) return "Moon";
  if (/(\bthe sun\b|\bsolar\b|corona|coronal|solar flare|prominence|photosphere|\bsdo\b|\bsoho\b|sunspot)/i.test(combined)) return "Sun";
  // Bare "Earth" in a long description ("light-years from Earth") is not evidence of an Earth image.
  if (/(earth from space|earth from orbit|blue marble|aurora australis|aurora borealis|earth observation|iss over earth|limb of earth|earth['’]s limb)/i.test(combined)) return "Earth";
  if (/(\bstar cluster\b|\bglobular cluster\b|\bstellar cluster\b|\bpleiades\b|\bprotostar\b|\bbinary star\b|\bred (?:giant|supergiant)\b|\bwhite dwarf\b|\bbetelgeuse\b|\bstar birth\b|\bstar field\b|\bstar formation\b)/i.test(combined)) return "Stars";
  if (/(\bspacecraft\b|\brover\b|\bvoyager\b|\bperseverance\b|\bcuriosity\b|\bartemis\b|\blaunch\b|\bliftoff\b|\brockets?\b)/i.test(combined)) return "Missions";

  return "Deep Space";
}

function extractObjectName(title: string, description: string): string | undefined {
  const match = `${title} ${description}`.match(
    /\b(Messier\s*\d+|M\d{1,3}|NGC\s*\d+|IC\s*\d+|Pillars of Creation|Carina Nebula|Orion Nebula|Andromeda|Jupiter|Saturn|Mars|The Sun|The Moon|Cartwheel Galaxy|Stephan's Quintet|Cassiopeia A|Ring Nebula|Tarantula Nebula|Crab Nebula|Sombrero Galaxy|Whirlpool Galaxy|Phantom Galaxy|Pleiades)\b/i
  );
  return match?.[0];
}

/** Observatory or instrument named by the metadata itself. Never inferred from a search query. */
export function extractObservatory(title: string, description: string, keywords: string[] = []): string | undefined {
  const combined = `${title} ${keywords.join(" ")} ${description}`;
  if (/\b(james webb|jwst|nircam|miri)\b/i.test(combined) && !/\bmiriam\b/i.test(combined)) return "James Webb Space Telescope";
  if (/\b(hubble|hst|wfc3|wfpc2)\b|\bACS\b/.test(combined) || /\bhubble\b/i.test(combined)) return "Hubble Space Telescope";
  if (/\b(solar dynamics observatory|sdo)\b/i.test(combined)) return "Solar Dynamics Observatory";
  if (/\bchandra\b/i.test(combined)) return "Chandra X-ray Observatory";
  if (/\bspitzer\b/i.test(combined)) return "Spitzer Space Telescope";
  if (/\beuclid\b/i.test(combined)) return "Euclid";
  if (/\bjuno(?:cam| spacecraft)?\b/i.test(combined)) return "Juno";
  if (/\bcassini\b/i.test(combined)) return "Cassini";
  if (/\bnew horizons\b|\blorri\b/i.test(combined)) return "New Horizons";
  if (/\bvoyager\b/i.test(combined)) return "Voyager";
  if (/\bperseverance\b|\bmastcam-z\b/i.test(combined)) return "Perseverance rover";
  if (/\bcuriosity (?:rover|mars rover)\b/i.test(combined)) return "Curiosity rover";
  if (/\blunar reconnaissance orbiter\b|\blroc?\b/i.test(combined)) return "Lunar Reconnaissance Orbiter";
  if (/\binternational space station\b|\biss\b/i.test(combined)) return "International Space Station";
  return undefined;
}

function asArray<T>(value: T | T[] | undefined): T[] {
  if (value === undefined || value === null) return [];
  return Array.isArray(value) ? value : [value];
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : null;
}

function textValue(value: unknown): string {
  if (typeof value === "string" || typeof value === "number") return String(value).trim();
  const record = asRecord(value);
  if (!record) return "";
  return textValue(record["#text"] ?? record["#cdata"] ?? "");
}

function conciseScienceDescription(rawDescription: string): string {
  let description = cleanInlineText(rawDescription)
    .replace(/^\s*Explanation:\s*/i, "")
    .replace(/\s*Tomorrow['’]s picture:[\s\S]*$/i, "")
    .replace(/\[\s*Image description\s*:[\s\S]*$/i, "")
    .replace(/\bLinks?\s+(?:Research paper|Pan video)[\s\S]*$/i, "")
    .trim();

  if (description.length <= 640) return description;
  description = description.slice(0, 640);
  const finalSentence = Math.max(description.lastIndexOf(". "), description.lastIndexOf("! "), description.lastIndexOf("? "));
  return `${description.slice(0, finalSentence > 320 ? finalSentence + 1 : 637).trim()}…`;
}

function toIsoDate(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
}

function httpsUrl(value: string, base?: string): string {
  const url = parseWebUrl(value, base);
  if (!url) return "";
  url.protocol = "https:";
  url.hash = "";
  return url.toString();
}

/** science.nasa.gov dynamic images accept a width parameter. */
function nasaDynamicRendition(value: string, width: number): string {
  const url = parseWebUrl(value);
  if (!url || url.hostname !== "assets.science.nasa.gov" || !url.pathname.startsWith("/dynamicimage/")) return value;
  url.searchParams.delete("h");
  url.searchParams.set("w", String(width));
  url.searchParams.set("fit", "clip");
  return url.toString();
}

// ---------------------------------------------------------------------------
// Source plumbing
// ---------------------------------------------------------------------------

const GALLERY_FETCH_TIMEOUT_MS = 8000;
const DETAIL_TIMEOUT_MS = 6000;
const MEMO_TTL_MS = 60_000;
const HD_VERIFY_LIMIT = 60;
const HD_REVERIFY_MS = 14 * 86_400_000;
const STORE_IMAGES = "gallery:images";
const STORE_DIAGNOSTICS = "diagnostics:gallery";

const GALLERY_XML_PARSER = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  textNodeName: "#text",
  trimValues: true,
  processEntities: false
});

type SourceId = "apod-feed" | "apod-api" | "nasa-image-library" | "esa-webb" | "esa-hubble" | "eso";

type SourceReport = {
  id: SourceId;
  label: string;
  ok: boolean;
  /** True only for transport/upstream problems, never for editorial filtering. */
  upstreamFailed: boolean;
  skipped?: boolean;
  error?: string;
  httpStatus?: number;
  fetched: number;
  accepted: number;
  rejected: number;
  rejectedReasons: Record<string, number>;
  invalidImages: number;
  restoredFromSnapshot: number;
  durationMs: number;
};

type SourceRun = { report: SourceReport; images: GalleryImage[]; hdCandidates: Map<string, string> };

type StoredImage = GalleryImage & { hdCheckedAt?: string; hdCandidate?: string; detailCredit?: boolean };

const SOURCE_LABELS: Record<SourceId, string> = {
  "apod-feed": "NASA APOD",
  "apod-api": "NASA APOD API",
  "nasa-image-library": "NASA Image Library",
  "esa-webb": "ESA / Webb",
  "esa-hubble": "ESA / Hubble",
  eso: "ESO"
};

// Preferred copy when the same image is available from several archives.
const PROVENANCE_RANK: Record<GallerySource, number> = {
  "ESA / Webb": 5,
  "ESA / Hubble": 5,
  ESO: 5,
  "NASA APOD": 4,
  "NASA Image Library": 3
};

function newReport(id: SourceId): SourceReport {
  return { id, label: SOURCE_LABELS[id], ok: false, upstreamFailed: false, fetched: 0, accepted: 0, rejected: 0, rejectedReasons: {}, invalidImages: 0, restoredFromSnapshot: 0, durationMs: 0 };
}

function reject(report: SourceReport, reason: string) {
  report.rejected += 1;
  report.rejectedReasons[reason] = (report.rejectedReasons[reason] ?? 0) + 1;
}

function failSource(report: SourceReport, reason: string, startedAt: number): SourceRun {
  report.ok = false;
  report.upstreamFailed = true;
  report.error = reason;
  report.durationMs = Date.now() - startedAt;
  // Single-argument message: readable in Vercel logs and free of secrets.
  console.warn(`${report.label}: ${reason}. Continuing with available gallery sources.`);
  return { report, images: [], hdCandidates: new Map() };
}

function finishSource(report: SourceReport, images: GalleryImage[], hdCandidates: Map<string, string>, startedAt: number): SourceRun {
  report.ok = true;
  report.accepted = images.length;
  report.durationMs = Date.now() - startedAt;
  logInfo(
    `[gallery] source=${report.id} http=${report.httpStatus ?? "-"} fetched=${report.fetched} accepted=${report.accepted} rejected=${report.rejected} invalidImages=${report.invalidImages} durationMs=${report.durationMs}${report.rejected ? ` reasons=${JSON.stringify(report.rejectedReasons)}` : ""}`
  );
  if (report.fetched > 0 && images.length === 0) {
    logInfo(`[gallery] source=${report.id} responded normally, but every item was filtered out by the editorial rules.`);
  }
  return { report, images, hdCandidates };
}

async function fetchText(url: string, report: SourceReport, accept: string): Promise<{ text?: string; error?: string }> {
  try {
    const response = await fetchWithRetry(
      url,
      { headers: { Accept: accept, "User-Agent": CONTENT_USER_AGENT }, next: { revalidate: GALLERY_REVALIDATE_SECONDS } },
      { timeoutMs: GALLERY_FETCH_TIMEOUT_MS }
    );
    report.httpStatus = response.status;
    if (!response.ok) return { error: response.status === 429 ? "rate limited (HTTP 429)" : `HTTP ${response.status}` };
    return { text: await response.text() };
  } catch (error) {
    return { error: describeFetchError(error, GALLERY_FETCH_TIMEOUT_MS).reason };
  }
}

function parseRssItems(xml: string): Array<Record<string, unknown>> {
  const parsed = asRecord(GALLERY_XML_PARSER.parse(xml));
  const channel = asRecord(asRecord(parsed?.rss)?.channel);
  return asArray(channel?.item).map(asRecord).filter((item): item is Record<string, unknown> => Boolean(item));
}

// ---------------------------------------------------------------------------
// NASA APOD (primary: official science.nasa.gov feed)
// ---------------------------------------------------------------------------

async function fetchApodFeed(): Promise<SourceRun> {
  const startedAt = Date.now();
  const report = newReport("apod-feed");
  const { text, error } = await fetchText(NASA_APOD_FEED_URL, report, "application/rss+xml, application/xml, text/xml");
  if (!text) return failSource(report, error ?? "empty response", startedAt);
  if (/^\s*<!doctype html|^\s*<html/i.test(text)) return failSource(report, "returned an HTML page instead of the APOD feed", startedAt);

  let items: Array<Record<string, unknown>>;
  try {
    items = parseRssItems(text);
  } catch {
    return failSource(report, "feed XML could not be parsed", startedAt);
  }

  report.fetched = items.length;
  const images: GalleryImage[] = [];
  const hdCandidates = new Map<string, string>();

  for (const item of items) {
    const sourceUrl = cleanPublisherUrl(textValue(item.link) || textValue(item.guid));
    const date = toIsoDate(textValue(item.pubDate));
    const title = normalizeTitle(cleanInlineText(textValue(item.title)));
    const content = decodeEntities(textValue(item["content:encoded"]));
    const hdUrl = httpsUrl(textValue(item["apod:hdurl"]));

    if (!sourceUrl || !hostMatches(sourceUrl, ["science.nasa.gov"]) || !date || !title) {
      reject(report, "missing title, date, or official page");
      continue;
    }
    // Video days embed a player and expose only a 48px poster as "hdurl". Links to
    // videos inside the explanation text do not make the picture itself a video.
    if (/<(?:video|iframe)\b/i.test(content) || /cq5dam\.thumbnail/i.test(hdUrl)) {
      reject(report, "video or interactive APOD");
      continue;
    }
    if (!hdUrl || !hostMatches(hdUrl, ["nasa.gov"]) || PLACEHOLDER_IMAGE_PATTERN.test(hdUrl)) {
      report.invalidImages += 1;
      reject(report, "no valid image URL");
      continue;
    }

    const description = conciseScienceDescription(textValue(item["apod:explanation"]) || textValue(item.description));
    const creditHtml = decodeEntities(textValue(item["apod:credit"]));
    const copyright = cleanInlineText(textValue(item["apod:copyright"]));
    const credit = cleanInlineText(creditHtml).replace(/\s*;\s*/g, "; ").slice(0, 220) || "NASA APOD";
    const licenseUrl = creditHtml.match(/href=["'](https?:\/\/creativecommons\.org\/licenses\/[^"']+)["']/i)?.[1];
    const imageUrl = nasaDynamicRendition(hdUrl, 1600);
    const score = scoreGalleryCandidate({ title, description, url: imageUrl, credit, source: "NASA APOD" });

    if (score.verdict === "reject") {
      reject(report, score.reasons[score.reasons.length - 1] ?? "editorial");
      continue;
    }

    const id = `apod-${date}`;
    hdCandidates.set(id, hdUrl);
    images.push({
      id,
      title,
      description,
      alt: cleanInlineText(textValue(item["apod:alt"])) || undefined,
      imageUrl,
      thumbnailUrl: nasaDynamicRendition(hdUrl, 800),
      source: "NASA APOD",
      publisher: "NASA Astronomy Picture of the Day",
      sourceUrl,
      credit,
      rights: copyright ? `Copyright: ${copyright.slice(0, 220)}` : undefined,
      rightsUrl: licenseUrl ? cleanPublisherUrl(licenseUrl) : copyright ? "https://science.nasa.gov/apod/about-apod/" : undefined,
      date,
      category: detectCategory(title, [], description),
      objectName: extractObjectName(title, description),
      observatory: extractObservatory(title, description),
      aspectRatio: 1.33
    });
  }

  return finishSource(report, images, hdCandidates, startedAt);
}

// ---------------------------------------------------------------------------
// NASA APOD API (secondary; validated because it can return placeholder data)
// ---------------------------------------------------------------------------

type ApodApiEntry = { date?: string; explanation?: string; hdurl?: string; media_type?: string; title?: string; url?: string; copyright?: string };

export function isApodPlaceholderResponse(entries: ApodApiEntry[]): boolean {
  const images = entries.filter((entry) => entry.media_type === "image");
  if (images.length === 0) return false;
  const placeholderUrls = images.filter((entry) => PLACEHOLDER_IMAGE_PATTERN.test(entry.url ?? "") || /^nasa science$/i.test(entry.title?.trim() ?? "")).length;
  const explanations = new Set(images.map((entry) => (entry.explanation ?? "").slice(0, 200)));
  return placeholderUrls >= Math.ceil(images.length / 2) || (images.length >= 4 && explanations.size === 1);
}

async function fetchApodApi(): Promise<SourceRun> {
  const startedAt = Date.now();
  const report = newReport("apod-api");
  const configuredKey = typeof process !== "undefined" ? process.env.NASA_API_KEY?.trim() : "";
  const apiKey = configuredKey && configuredKey !== "your_nasa_api_key_here" ? configuredKey : "DEMO_KEY";
  const endDate = new Date();
  const startDate = new Date(endDate);
  startDate.setUTCDate(startDate.getUTCDate() - 30);
  const url = `${NASA_APOD_API_URL}?api_key=${encodeURIComponent(apiKey)}&start_date=${startDate.toISOString().slice(0, 10)}&end_date=${endDate.toISOString().slice(0, 10)}&thumbs=false`;

  let data: unknown;
  try {
    const response = await fetchWithRetry(url, { next: { revalidate: GALLERY_REVALIDATE_SECONDS } }, { timeoutMs: GALLERY_FETCH_TIMEOUT_MS });
    report.httpStatus = response.status;
    if (!response.ok) {
      const keyNote = apiKey === "DEMO_KEY" ? " using the shared DEMO_KEY; set NASA_API_KEY" : "";
      return failSource(report, `${response.status === 429 ? "rate limited (HTTP 429)" : `HTTP ${response.status}`}${keyNote}`, startedAt);
    }
    data = await response.json();
  } catch (error) {
    return failSource(report, describeFetchError(error, GALLERY_FETCH_TIMEOUT_MS).reason, startedAt);
  }

  if (!Array.isArray(data)) return failSource(report, "unexpected response format", startedAt);
  report.fetched = data.length;

  if (isApodPlaceholderResponse(data as ApodApiEntry[])) {
    return failSource(report, "returned placeholder entries (same text and a site logo for every date)", startedAt);
  }

  const images: GalleryImage[] = [];
  const hdCandidates = new Map<string, string>();

  for (const item of data as ApodApiEntry[]) {
    const date = /^\d{4}-\d{2}-\d{2}$/.test(item.date ?? "") ? item.date! : "";
    const imageUrl = httpsUrl(item.url ?? "");
    if (item.media_type !== "image" || !date) {
      reject(report, "video or missing date");
      continue;
    }
    if (!imageUrl || !hostMatches(imageUrl, ["nasa.gov"]) || PLACEHOLDER_IMAGE_PATTERN.test(imageUrl)) {
      report.invalidImages += 1;
      reject(report, "no valid image URL");
      continue;
    }

    const title = normalizeTitle(cleanInlineText(item.title ?? ""));
    const description = conciseScienceDescription(item.explanation ?? "");
    const copyright = cleanInlineText(item.copyright ?? "");
    const credit = copyright || "NASA APOD";
    const score = scoreGalleryCandidate({ title, description, url: imageUrl, credit, source: "NASA APOD" });
    if (score.verdict === "reject") {
      reject(report, score.reasons[score.reasons.length - 1] ?? "editorial");
      continue;
    }

    const id = `apod-${date}`;
    const hd = httpsUrl(item.hdurl ?? "");
    if (hd && hostMatches(hd, ["nasa.gov"])) hdCandidates.set(id, hd);
    images.push({
      id,
      title,
      description,
      imageUrl,
      thumbnailUrl: imageUrl,
      source: "NASA APOD",
      publisher: "NASA Astronomy Picture of the Day",
      // The historical APOD permalink format; apod.nasa.gov redirects to science.nasa.gov.
      sourceUrl: `https://apod.nasa.gov/apod/ap${date.replace(/-/g, "").slice(2)}.html`,
      credit,
      rights: copyright ? `Copyright: ${copyright}` : undefined,
      date,
      category: detectCategory(title, [], description),
      objectName: extractObjectName(title, description),
      observatory: extractObservatory(title, description),
      aspectRatio: 1.33
    });
  }

  return finishSource(report, images, hdCandidates, startedAt);
}

// ---------------------------------------------------------------------------
// NASA Image and Video Library
// ---------------------------------------------------------------------------

// Queries only steer discovery. Attribution and observatory always come from
// each item's own metadata, never from the query that surfaced it.
const NASA_LIBRARY_QUERIES = [
  "Hubble Space Telescope interacting galaxies Messier NGC",
  "Hubble Space Telescope emission planetary nebula star cluster",
  "Chandra X-ray black hole galaxy cluster supernova remnant",
  "Spitzer infrared galaxy nebula star formation",
  "JPL Cassini Saturn rings atmosphere",
  "JPL Juno Jupiter Great Red Spot perijove",
  "JPL Voyager Uranus Neptune moons",
  "JPL Galileo Europa Io Ganymede",
  "New Horizons Pluto Charon",
  "Solar Dynamics Observatory AIA coronal flare Sun",
  "ISS Earth observation atmospheric limb aurora night",
  "Perseverance Mastcam-Z Mars panorama crater",
  "Lunar Reconnaissance Orbiter LROC Moon crater",
  "rocket liftoff night launch pad space"
];

const NASA_CENTERS: Record<string, string> = {
  JPL: "NASA Jet Propulsion Laboratory",
  GSFC: "NASA Goddard Space Flight Center",
  MSFC: "NASA Marshall Space Flight Center",
  JSC: "NASA Johnson Space Center",
  KSC: "NASA Kennedy Space Center",
  ARC: "NASA Ames Research Center",
  GRC: "NASA Glenn Research Center",
  LRC: "NASA Langley Research Center",
  HQ: "NASA Headquarters",
  SSC: "NASA Stennis Space Center",
  AFRC: "NASA Armstrong Flight Research Center"
};

type LibraryLink = { rel?: string; render?: string; href?: string };

function libraryRendition(links: LibraryLink[], size: "thumb" | "small" | "medium" | "large" | "orig"): string {
  const link = links.find((entry) => typeof entry.href === "string" && new RegExp(`~${size}\\.(?:jpe?g|png|gif|webp)$`, "i").test(entry.href));
  const url = link?.href ? httpsUrl(link.href) : "";
  return url && hostMatches(url, ["images-assets.nasa.gov"]) ? url : "";
}

async function fetchNasaImageLibrary(): Promise<SourceRun> {
  const startedAt = Date.now();
  const report = newReport("nasa-image-library");
  const images: GalleryImage[] = [];
  const hdCandidates = new Map<string, string>();
  let failures = 0;

  await mapWithConcurrency(NASA_LIBRARY_QUERIES, 4, async (query) => {
    let items: Array<{ data?: Array<Record<string, unknown>>; links?: LibraryLink[] }> = [];
    try {
      const url = `${NASA_IMAGE_LIBRARY_API_BASE}/search?q=${encodeURIComponent(query)}&media_type=image&page_size=14`;
      const response = await fetchWithRetry(url, { next: { revalidate: GALLERY_REVALIDATE_SECONDS } }, { timeoutMs: GALLERY_FETCH_TIMEOUT_MS });
      report.httpStatus = response.status;
      if (!response.ok) {
        failures += 1;
        return;
      }
      const json = (await response.json()) as { collection?: { items?: typeof items } };
      items = json?.collection?.items ?? [];
    } catch (error) {
      failures += 1;
      console.warn(`NASA Image Library query "${query}": ${describeFetchError(error, GALLERY_FETCH_TIMEOUT_MS).reason}. Continuing with available gallery sources.`);
      return;
    }

    report.fetched += items.length;
    let acceptedForQuery = 0;

    for (const item of items) {
      // A single query must not flood the collection with one subject.
      if (acceptedForQuery >= 6) break;
      const data = item.data?.[0];
      const nasaId = typeof data?.nasa_id === "string" ? data.nasa_id : "";
      const title = normalizeTitle(cleanInlineText(String(data?.title ?? "")));
      if (!data || !nasaId || !title || (data.media_type !== undefined && data.media_type !== "image")) {
        reject(report, "missing identifier or title");
        continue;
      }

      const links = Array.isArray(item.links) ? item.links : [];
      const thumbnailUrl = libraryRendition(links, "thumb") || libraryRendition(links, "small");
      const imageUrl = libraryRendition(links, "large") || libraryRendition(links, "medium") || thumbnailUrl;
      const original = libraryRendition(links, "orig");

      if (!imageUrl) {
        report.invalidImages += 1;
        reject(report, "no image rendition");
        continue;
      }

      const description = conciseScienceDescription(String(data.description ?? data.description_508 ?? ""));
      const keywords = Array.isArray(data.keywords) ? data.keywords.map(String) : [];
      const center = typeof data.center === "string" ? data.center.toUpperCase() : "";
      const photographer = typeof data.photographer === "string" ? cleanInlineText(data.photographer) : "";
      const secondaryCreator = typeof data.secondary_creator === "string" ? cleanInlineText(data.secondary_creator) : "";
      const publisher = NASA_CENTERS[center] ?? (center ? `NASA ${center}` : "NASA");
      const credit = secondaryCreator || (photographer ? `NASA/${photographer}` : publisher);
      const score = scoreGalleryCandidate({ title, description, url: imageUrl, keywords, credit });

      if (score.verdict === "reject") {
        reject(report, score.reasons[score.reasons.length - 1] ?? "editorial");
        continue;
      }

      const id = `nasa-lib-${nasaId.toLowerCase().replace(/[^a-z0-9_-]/g, "-")}`;
      const rightsNotice = description.match(/(?:©|copyright)[^.]{0,160}\./i)?.[0];
      if (original) hdCandidates.set(id, original);
      acceptedForQuery += 1;
      images.push({
        id,
        title,
        description,
        imageUrl,
        thumbnailUrl: thumbnailUrl || imageUrl,
        source: "NASA Image Library",
        publisher,
        creator: photographer || undefined,
        sourceUrl: `https://images.nasa.gov/details/${encodeURIComponent(nasaId)}`,
        credit,
        rights: rightsNotice,
        date: typeof data.date_created === "string" ? data.date_created.slice(0, 10) : "",
        category: detectCategory(title, keywords, description),
        objectName: extractObjectName(title, description),
        observatory: extractObservatory(title, description, keywords),
        aspectRatio: 1.33
      });
    }
  });

  if (failures === NASA_LIBRARY_QUERIES.length) return failSource(report, "every search request failed", startedAt);
  return finishSource(report, images, hdCandidates, startedAt);
}

// ---------------------------------------------------------------------------
// ESA/Webb, ESA/Hubble and ESO image archives
// ---------------------------------------------------------------------------

type ObservatoryFeedConfig = {
  id: "esa-webb" | "esa-hubble" | "eso";
  url: string;
  source: GallerySource;
  publisher: string;
  observatory?: string;
  hosts: string[];
};

const OBSERVATORY_IMAGE_FEEDS: ObservatoryFeedConfig[] = [
  { id: "esa-webb", url: "https://esawebb.org/images/feed/", source: "ESA / Webb", publisher: "ESA/Webb", observatory: "James Webb Space Telescope", hosts: ["esawebb.org"] },
  { id: "esa-hubble", url: "https://esahubble.org/images/feed/", source: "ESA / Hubble", publisher: "ESA/Hubble", observatory: "Hubble Space Telescope", hosts: ["esahubble.org"] },
  { id: "eso", url: "https://www.eso.org/public/images/feed/", source: "ESO", publisher: "ESO", hosts: ["eso.org"] }
];

type ArchiveDetail = { credit?: string; large?: string; thumb?: string; screen?: string; hasUsagePage: boolean; imageType?: string };

// Archive "Type" values that are not observed imagery.
const NON_OBSERVATIONAL_ARCHIVE_TYPE = /^(artwork|chart|illustration|simulation|animation|diagram|graphic|logo|infographic)/i;

function releaseIdFromUrl(sourceUrl: string): string {
  const url = parseWebUrl(sourceUrl);
  return url?.pathname.split("/").filter(Boolean).pop()?.toLowerCase().replace(/[^a-z0-9_-]/g, "-") ?? "";
}

export function parseArchiveDetail(html: string, releaseId: string, hosts: string[]): ArchiveDetail {
  const creditBlock = html.match(/<div\b[^>]*class=["'][^"']*\bcredit\b[^"']*["'][^>]*>([\s\S]*?)<\/div>/i)?.[1] ?? "";
  const credit = cleanInlineText(creditBlock).replace(/^Credit:\s*/i, "").slice(0, 240);
  const escaped = releaseId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const rendition = (name: string) => {
    const match = html.match(new RegExp(`https://cdn\\.[a-z.]+/(?:archives/)?images/${name}/${escaped}\\.(?:jpe?g|png)`, "i"))?.[0];
    return match && hostMatches(match, hosts) ? match : undefined;
  };
  // Djangoplicity archives list "Type: Observation | Photographic | Artwork | Chart …" in the image details.
  const detailText = cleanInlineText(html.replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, " "));
  const imageType = detailText.match(/\bType:\s*(?:Unspecified\s*:\s*)?([A-Z][A-Za-z]+(?:\s*\/\s*[A-Z][A-Za-z]+)?)/)?.[1];
  return {
    imageType,
    credit: credit || undefined,
    large: rendition("large"),
    screen: rendition("screen"),
    thumb: rendition("thumb700x"),
    hasUsagePage: /href=["'](?:https?:\/\/[^"']+)?\/copyright\/["']/i.test(html)
  };
}

async function fetchObservatoryFeed(config: ObservatoryFeedConfig, stored: Map<string, StoredImage>): Promise<SourceRun> {
  const startedAt = Date.now();
  const report = newReport(config.id);
  const { text, error } = await fetchText(config.url, report, "application/rss+xml, application/xml, text/xml");
  if (!text) return failSource(report, error ?? "empty response", startedAt);

  let items: Array<Record<string, unknown>>;
  try {
    items = parseRssItems(text);
  } catch {
    return failSource(report, "feed XML could not be parsed", startedAt);
  }

  report.fetched = items.length;
  const hdCandidates = new Map<string, string>();
  const prepared: Array<{ image: GalleryImage; releaseId: string; nonObservational?: boolean }> = [];

  for (const item of items) {
    if (prepared.length >= 14) break;
    const sourceUrl = httpsUrl(textValue(item.link) || textValue(item.guid), config.url);
    const releaseId = releaseIdFromUrl(sourceUrl);
    const rawDescription = decodeEntities(textValue(item.description));
    const enclosure = asArray(item.enclosure).map(asRecord).find((entry) => entry && (!textValue(entry["@_type"]) || textValue(entry["@_type"]).startsWith("image/")));
    const enclosureUrl = enclosure ? httpsUrl(textValue(enclosure["@_url"]), sourceUrl) : "";
    const previewUrl = httpsUrl(rawDescription.match(/<img\b[^>]+src=["']([^"']+)["']/i)?.[1] ?? "", sourceUrl);
    const imageUrl = [enclosureUrl, previewUrl].find((url) => url && hostMatches(url, config.hosts)) ?? "";
    const rawTitle = cleanInlineText(textValue(item.title));
    const title = normalizeTitle(rawTitle);
    const description = conciseScienceDescription(rawDescription);

    if (!sourceUrl || !hostMatches(sourceUrl, config.hosts) || !releaseId || !title || !description) {
      reject(report, "missing title, description, or official page");
      continue;
    }
    if (!imageUrl) {
      report.invalidImages += 1;
      reject(report, "no image on an official host");
      continue;
    }
    // Local-language event photography (e.g. "annlocal…-es-cl") is not astronomy imagery.
    if (/^annlocal/i.test(releaseId)) {
      reject(report, "local event photography");
      continue;
    }

    // Score the unedited title: "(NIRCam annotated image)" is evidence, even though it is trimmed for display.
    const score = scoreGalleryCandidate({ title: rawTitle, description, url: imageUrl, credit: config.publisher, observatory: config.observatory, source: config.source });
    if (score.verdict === "reject") {
      reject(report, score.reasons[score.reasons.length - 1] ?? "editorial");
      continue;
    }

    prepared.push({
      releaseId,
      image: {
        id: `${config.id}-${releaseId}`,
        title,
        description,
        imageUrl,
        thumbnailUrl: previewUrl && hostMatches(previewUrl, config.hosts) ? previewUrl : imageUrl,
        source: config.source,
        publisher: config.publisher,
        sourceUrl,
        // Honest placeholder until the official detail page supplies the exact credit line.
        credit: `${config.publisher} (full credit on the source page)`,
        date: toIsoDate(textValue(item.pubDate)),
        category: detectCategory(title, [], description),
        objectName: extractObjectName(title, description),
        observatory: extractObservatory(title, description) ?? config.observatory,
        aspectRatio: 1.5
      }
    });
  }

  // The archive detail page is the authority for credit and download renditions.
  await mapWithConcurrency(prepared, 3, async (entry) => {
    const { image, releaseId } = entry;
    const previous = stored.get(image.id);
    if (previous?.detailCredit && previous.credit) {
      image.credit = previous.credit;
      image.rightsUrl = previous.rightsUrl;
      image.rights = previous.rights;
      image.thumbnailUrl = previous.thumbnailUrl || image.thumbnailUrl;
      if (previous.hdCandidate) hdCandidates.set(image.id, previous.hdCandidate);
      (image as StoredImage).detailCredit = true;
      return;
    }

    try {
      const response = await fetchFromTrustedHosts(
        image.sourceUrl,
        config.hosts,
        { headers: { Accept: "text/html", "User-Agent": CONTENT_USER_AGENT }, next: { revalidate: GALLERY_REVALIDATE_SECONDS * 4 } },
        { timeoutMs: DETAIL_TIMEOUT_MS }
      );
      if (!response?.ok) return;
      const detail = parseArchiveDetail(await response.text(), releaseId, config.hosts);
      if (detail.imageType && NON_OBSERVATIONAL_ARCHIVE_TYPE.test(detail.imageType)) {
        entry.nonObservational = true;
        reject(report, `archive type: ${detail.imageType}`);
        return;
      }
      if (detail.credit) {
        image.credit = detail.credit;
        (image as StoredImage).detailCredit = true;
      }
      if (detail.thumb) image.thumbnailUrl = detail.thumb;
      if (detail.large) hdCandidates.set(image.id, detail.large);
      if (detail.hasUsagePage) {
        const origin = parseWebUrl(image.sourceUrl)?.origin;
        if (origin) {
          image.rightsUrl = `${origin}/copyright/`;
          image.rights = `Usage terms published by ${config.publisher}`;
        }
      }
    } catch {
      // The feed values remain usable; the credit says where to find the full line.
    }
  });

  return finishSource(report, prepared.filter((entry) => !entry.nonObservational).map((entry) => entry.image), hdCandidates, startedAt);
}

// ---------------------------------------------------------------------------
// Dedupe and ranking
// ---------------------------------------------------------------------------

const GENERIC_IMAGE_STEMS = /^(image|images|photo|hero|main|thumb|large|screen|news|original|full|default|picture|img)$/i;

/** Identity of the underlying image file, independent of rendition and host. */
export function imageIdentity(value: string | undefined): string {
  const url = parseWebUrl(value);
  if (!url) return "";
  const file = decodeURIComponent(url.pathname.split("/").pop() ?? "").toLowerCase();
  const stem = file
    .replace(/\.(?:jpe?g|png|gif|webp|tiff?)$/i, "")
    .replace(/~(?:orig|large|medium|small|thumb)$/i, "")
    .replace(/[-_](?:\d{3,5}(?:px)?|\d{2,5}x\d{2,5}|thumb|large|small|medium|screen|hd|full)$/i, "");
  return stem.length >= 6 && !GENERIC_IMAGE_STEMS.test(stem) ? stem : "";
}

function releaseKey(image: GalleryImage): string | undefined {
  return `${image.id} ${image.imageUrl} ${image.hdImageUrl ?? ""}`.match(/\b(?:weic|heic|potm|potw|eso|opo|sci|ann)\d{4,}[a-z]?\b/i)?.[0]?.toLowerCase();
}

export function deduplicateAndRankGallery(images: GalleryImage[]): GalleryImage[] {
  const seen = new Set<string>();
  const familyCounts = new Map<string, number>();
  const scored: Array<{ image: GalleryImage; score: number; freshness: number; timestamp: number }> = [];

  // Highest-provenance copy first, so it wins any duplicate collision.
  const ordered = images
    .map((image, index) => ({ image, index }))
    .filter(({ image }) => image && image.id && image.imageUrl)
    .sort((a, b) => (PROVENANCE_RANK[b.image.source] ?? 0) - (PROVENANCE_RANK[a.image.source] ?? 0) || Number(Boolean(a.image.isStale)) - Number(Boolean(b.image.isStale)) || a.index - b.index);

  for (const { image } of ordered) {
    const release = releaseKey(image);
    const titleKey = image.title.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 32);
    const keys = [
      `id:${image.id}`,
      `page:${canonicalUrlKey(image.sourceUrl)}`,
      ...[image.imageUrl, image.hdImageUrl, image.thumbnailUrl].map(imageIdentity).filter(Boolean).map((key) => `file:${key}`),
      release ? `release:${release}` : "",
      titleKey.length > 8 ? `title:${titleKey}` : ""
    ].filter((key) => key && key !== "page:");

    if (keys.some((key) => seen.has(key))) continue;

    // Allow at most two images from one multi-image release (e.g. weic2622a…f).
    const family = release?.replace(/[a-z]$/i, "");
    if (family && (familyCounts.get(family) ?? 0) >= 2) continue;

    const result = scoreGalleryCandidate({ title: image.title, description: image.description, url: image.imageUrl, credit: image.credit, observatory: image.observatory, source: image.source });
    if (result.verdict === "reject") continue;

    keys.forEach((key) => seen.add(key));
    if (family) familyCounts.set(family, (familyCounts.get(family) ?? 0) + 1);

    const timestamp = new Date(image.date).getTime();
    const ageInDays = Number.isFinite(timestamp) ? (Date.now() - timestamp) / 86_400_000 : Number.POSITIVE_INFINITY;
    const freshness = ageInDays <= 550 ? 3 : ageInDays <= 1_825 ? 2 : ageInDays <= 4_380 ? 1 : 0;
    scored.push({ image, score: result.score, freshness, timestamp });
  }

  scored.sort((a, b) => {
    if (b.freshness !== a.freshness) return b.freshness - a.freshness;
    if (Boolean(a.image.isStale) !== Boolean(b.image.isStale)) return a.image.isStale ? 1 : -1;
    if (b.score !== a.score) return b.score - a.score;
    return (Number.isFinite(b.timestamp) ? b.timestamp : 0) - (Number.isFinite(a.timestamp) ? a.timestamp : 0);
  });

  return scored.map((entry) => entry.image);
}

// ---------------------------------------------------------------------------
// Collection assembly
// ---------------------------------------------------------------------------

let memo: { at: number; promise: Promise<GalleryResult> } | null = null;
let lastPersistedFingerprint = "";

export async function getGalleryData(): Promise<GalleryResult> {
  const now = Date.now();
  if (memo && now - memo.at < MEMO_TTL_MS) return memo.promise;
  const promise = buildGallery().catch((error) => {
    memo = null;
    throw error;
  });
  memo = { at: now, promise };
  return promise;
}

async function buildGallery(): Promise<GalleryResult> {
  const startedAt = Date.now();
  const store = getDurableStore();
  const warnings: string[] = [];

  // Known images let us reuse credits and HD checks instead of refetching every page.
  const knownIds = await store.getJson<string[]>("gallery:known-ids");
  const storedRecords = knownIds?.length ? await store.hashGetManyJson<StoredImage>(STORE_IMAGES, knownIds.slice(0, 400)) : [];
  const stored = new Map<string, StoredImage>();
  for (const record of storedRecords) if (record?.id) stored.set(record.id, record);

  const [apodFeed, library, ...observatories] = await Promise.all([
    fetchApodFeed(),
    fetchNasaImageLibrary(),
    ...OBSERVATORY_IMAGE_FEEDS.map((config) => fetchObservatoryFeed(config, stored))
  ]);

  // The API is a fallback only: it consumes a rate-limited key and is
  // currently known to return placeholder data.
  const apodApi = apodFeed.report.upstreamFailed || apodFeed.images.length < 5 ? await fetchApodApi() : null;
  const runs = [apodFeed, ...(apodApi ? [apodApi] : []), library, ...observatories];

  // Last-known-good: restore recent verified images for any source that is down.
  for (const run of runs) {
    if (!run.report.upstreamFailed) continue;
    if (run.report.id === "apod-api" && !apodFeed.report.upstreamFailed) continue;
    const snapshot = await store.getJson<{ savedAt: string; ids: string[] }>(`gallery:lkg:${run.report.id}`);
    if (!snapshot?.ids?.length) continue;
    const records = await store.hashGetManyJson<StoredImage>(STORE_IMAGES, snapshot.ids);
    const restored = records.filter((record): record is StoredImage => Boolean(record?.id && record.imageUrl)).map((record) => ({ ...stripInternal(record), isStale: true }));
    run.images.push(...restored);
    run.report.restoredFromSnapshot = restored.length;
  }

  const apodRuns = [apodFeed, apodApi].filter(Boolean) as SourceRun[];
  const apodAvailable = apodRuns.some((run) => run.images.length > 0);
  if (!apodAvailable && apodRuns.some((run) => run.report.upstreamFailed)) {
    warnings.push("NASA APOD is temporarily unavailable; other observatory sources remain live.");
  } else if (apodFeed.report.upstreamFailed && apodFeed.report.restoredFromSnapshot > 0) {
    warnings.push("NASA APOD is temporarily unavailable; showing its most recent verified images.");
  }
  if (library.report.upstreamFailed) {
    warnings.push(library.images.length > 0 ? "NASA Image Library search is temporarily unavailable; showing its most recent verified images." : "NASA Image Library search is temporarily unavailable.");
  }
  const downObservatories = observatories.filter((run) => run.report.upstreamFailed).map((run) => run.report.label);
  if (downObservatories.length > 0) {
    warnings.push(`${downObservatories.join(", ")} image feed${downObservatories.length > 1 ? "s are" : " is"} temporarily unavailable.`);
  }

  const hdCandidates = new Map<string, string>();
  for (const run of runs) for (const [id, url] of run.hdCandidates) hdCandidates.set(id, url);

  const allImages = runs.flatMap((run) => run.images);
  const ranked = deduplicateAndRankGallery(allImages).slice(0, GALLERY_COLLECTION_LIMIT);
  await attachVerifiedHdLinks(ranked, hdCandidates, stored);

  const liveCount = ranked.filter((image) => !image.isStale).length;
  const isFallback = ranked.length === 0;
  const featuredImage = await chooseFeaturedImage(ranked);

  const categoryOrder: GalleryCategory[] = ["Galaxies", "Nebulae", "Deep Space", "Planets", "Moon", "Sun", "Earth", "Stars", "Missions"];
  const populated = new Set(ranked.map((image) => image.category));
  const categories = ["All", ...categoryOrder.filter((category) => populated.has(category))];

  const report = {
    generatedAt: new Date(startedAt).toISOString(),
    durationMs: Date.now() - startedAt,
    store: store.kind,
    totals: { candidates: allImages.length, duplicatesOrFiltered: allImages.length - ranked.length, published: ranked.length, live: liveCount, hdVerified: ranked.filter((image) => image.hdImageUrl).length },
    sources: runs.map((run) => run.report)
  };
  logInfo(`[gallery] published=${ranked.length} live=${liveCount} candidates=${allImages.length} hdVerified=${report.totals.hdVerified} store=${store.kind} durationMs=${report.durationMs}`);

  await persistGallery(store, ranked, runs, hdCandidates, report);

  return {
    images: ranked,
    featuredImage,
    categories,
    total: ranked.length,
    lastUpdated: new Date().toISOString(),
    isFallback,
    warnings
  };
}

function stripInternal(record: StoredImage): GalleryImage {
  const { hdCheckedAt: _checked, hdCandidate: _candidate, detailCredit: _detail, ...image } = record;
  void _checked;
  void _candidate;
  void _detail;
  return image;
}

async function attachVerifiedHdLinks(images: GalleryImage[], candidates: Map<string, string>, stored: Map<string, StoredImage>) {
  const toVerify: Array<{ image: GalleryImage; url: string }> = [];
  const now = Date.now();

  for (const image of images) {
    const candidate = candidates.get(image.id) ?? (image.isStale ? image.hdImageUrl : undefined);
    if (!candidate) {
      image.hdImageUrl = undefined;
      continue;
    }
    const previous = stored.get(image.id);
    if (previous?.hdImageUrl === candidate && previous.hdCheckedAt && now - Date.parse(previous.hdCheckedAt) < HD_REVERIFY_MS) {
      image.hdImageUrl = candidate;
      (image as StoredImage).hdCheckedAt = previous.hdCheckedAt;
      continue;
    }
    image.hdImageUrl = undefined;
    if (toVerify.length < HD_VERIFY_LIMIT) toVerify.push({ image, url: candidate });
  }

  await mapWithConcurrency(toVerify, 6, async ({ image, url }) => {
    const host = parseWebUrl(url)?.hostname ?? "";
    // Only link to an HD file after confirming the URL serves an image.
    if ((await verifyRemoteImage(url, [host])) === "verified") {
      image.hdImageUrl = url;
      (image as StoredImage).hdCheckedAt = new Date().toISOString();
    }
  });
}

async function chooseFeaturedImage(images: GalleryImage[]): Promise<GalleryImage | null> {
  const heroCategories: GalleryCategory[] = ["Galaxies", "Nebulae", "Deep Space", "Planets", "Moon", "Sun", "Stars"];
  const candidates = images.filter(
    (image) => !image.isStale && heroCategories.includes(image.category) && !/\b(antenna|telescope|observatory|instrument|launch pad|rocket)\b/i.test(image.title)
  );

  for (const candidate of candidates.slice(0, 3)) {
    const host = parseWebUrl(candidate.imageUrl)?.hostname ?? "";
    if ((await verifyRemoteImage(candidate.imageUrl, [host])) !== "unreachable") return candidate;
  }

  return candidates[0] ?? images.find((image) => !image.isStale) ?? images[0] ?? null;
}

async function persistGallery(store: ReturnType<typeof getDurableStore>, images: GalleryImage[], runs: SourceRun[], hdCandidates: Map<string, string>, report: unknown) {
  try {
    await store.setJson(STORE_DIAGNOSTICS, report);
    const live = images.filter((image) => !image.isStale);
    const fingerprint = live.map((image) => `${image.id}:${image.hdImageUrl ? 1 : 0}:${image.credit.length}`).join("|");
    if (!live.length || fingerprint === lastPersistedFingerprint) return;

    const records: Record<string, StoredImage> = {};
    for (const image of live) {
      records[image.id] = { ...(image as StoredImage), hdCandidate: hdCandidates.get(image.id) };
    }
    await store.hashSetManyJson(STORE_IMAGES, records, { maxEntries: 4000 });
    await store.setJson("gallery:known-ids", live.map((image) => image.id));

    const savedAt = new Date().toISOString();
    const liveIds = new Set(live.map((image) => image.id));
    for (const run of runs) {
      if (run.report.upstreamFailed) continue;
      const ids = run.images.filter((image) => liveIds.has(image.id)).map((image) => image.id);
      if (ids.length > 0) await store.setJson(`gallery:lkg:${run.report.id}`, { savedAt, ids });
    }
    lastPersistedFingerprint = fingerprint;
  } catch {
    // Persistence is best effort.
  }
}

/**
 * Resolves a shared image link. Images that have rotated out of the current
 * collection are served from durable history when the store is configured.
 */
export async function getGalleryImageById(id: string): Promise<GalleryImage | null> {
  if (!isGalleryImageId(id)) return null;
  return findGalleryImage(id, await getGalleryData());
}

export function isGalleryImageId(id: string): boolean {
  return /^[a-z0-9][a-z0-9_-]{2,120}$/i.test(id);
}

/**
 * Looks an id up in an already-loaded collection, then in durable history.
 * Never rebuilds the gallery, so callers holding a cached collection get an
 * answer in milliseconds even on a cold serverless instance.
 */
export async function findGalleryImage(id: string, collection: Pick<GalleryResult, "images" | "featuredImage">): Promise<GalleryImage | null> {
  if (!isGalleryImageId(id)) return null;
  const live = collection.images.find((image) => image.id === id) ?? (collection.featuredImage?.id === id ? collection.featuredImage : undefined);
  if (live) return live;

  const record = await getDurableStore().hashGetJson<StoredImage>(STORE_IMAGES, id);
  return record?.id === id && record.imageUrl ? stripInternal(record) : null;
}

export async function getGalleryDiagnostics() {
  const store = getDurableStore();
  return { store: store.kind, latest: await store.getJson<unknown>(STORE_DIAGNOSTICS) };
}
