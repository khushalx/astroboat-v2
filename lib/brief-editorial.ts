// Explainable editorial relevance scoring and topic classification for
// automatically ingested briefs.
//
// Each rule contributes a named, weighted signal so a decision can be audited
// ("why was this rejected?") from logs and the diagnostics endpoint. There is
// no single blacklist: off-topic material has to accumulate negative evidence
// that outweighs its astronomy relevance.

export type EditorialInput = {
  title: string;
  summary: string;
  url: string;
  feedCategories: string[];
  credibility: "Primary" | "Reviewed" | "Preprint" | "Editorial";
  sourceFeedId: string;
};

export type EditorialSignal = { id: string; weight: number; detail?: string };

export type EditorialAssessment = {
  score: number;
  decision: "accept" | "reject";
  featureEligible: boolean;
  significance: number;
  signals: EditorialSignal[];
  reasons: string[];
};

export const ACCEPT_THRESHOLD = 42;
const FEATURE_THRESHOLD = 62;

type TopicRule = { id: string; weight: number; pattern: RegExp };

// Positive subject matter. Patterns use word boundaries so that "planet" does
// not match "planetarium", "sun" does not match "Sunday" and "neo" does not
// match "neon".
const TOPIC_RULES: TopicRule[] = [
  {
    id: "astrophysics",
    weight: 9,
    pattern:
      /\b(galax(?:y|ies)|nebula[es]?|exoplanets?|black holes?|supernova(?:e|s)?|neutron stars?|pulsars?|magnetars?|quasars?|dark (?:matter|energy)|cosmic microwave background|gravitational (?:waves?|lens(?:es|ing)?)|star[- ]formation|star[- ]forming|stellar|protoplanetary|white dwarfs?|red dwarfs?|brown dwarfs?|binary stars?|star clusters?|cosmolog(?:y|ical)|big bang|interstellar|fast radio bursts?|gamma[- ]ray bursts?|kilonova|accretion|light[- ]years?|redshift|milky way|andromeda|universe)\b/i
  },
  {
    id: "observatory",
    weight: 8,
    pattern:
      /\b(webb|jwst|hubble|chandra|euclid|nancy grace roman|roman space telescope|tess|kepler|spitzer|alma|very large telescope|extremely large telescope|rubin observatory|vera c\. rubin|keck|subaru telescope|simons observatory|fermi|neowise|spherex|ixpe|nustar|event horizon telescope|gaia|xmm-newton|lucy|psyche|telescopes?|observator(?:y|ies))\b/i
  },
  {
    id: "planetary",
    weight: 8,
    pattern:
      /\b(mars|martian|jupiter|jovian|saturn|venus|mercury|uranus|neptune|pluto|titan|europa|enceladus|ganymede|callisto|ceres|vesta|dimorphos|bennu|asteroids?|comets?|meteorites?|kuiper belt|moons?|lunar|planet(?:s|ary)?|exomoons?|dwarf planets?|craters?|volcan(?:o|oes|ic)|regolith|solar system)\b/i
  },
  {
    id: "solar",
    weight: 8,
    pattern:
      /\b(solar (?:flares?|wind|cycle|maximum|minimum|storms?|activity|orbiter|eclipses?)|coronal mass ejections?|sunspots?|space weather|heliophysics|heliosphere|parker solar probe|geomagnetic|auroras?|aurorae|the sun|sun['’]s|corona)\b/i
  },
  {
    id: "spaceflight",
    weight: 6,
    pattern:
      /\b(missions?|spacecraft|rovers?|landers?|orbiters?|probes?|launch(?:es|ed|ing)?|lift(?:s)? off|liftoff|rockets?|artemis|starship|falcon (?:9|heavy)|space launch system|space station|astronauts?|cosmonauts?|spacewalks?|docking|undock(?:s|ed|ing)?|splash(?:es)? ?down|flybys?|orbit(?:al|s|ing)?|satellites?|payloads?|bepicolombo|juice|dragonfly|perseverance|curiosity|juno|voyager|new horizons|osiris-rex|hera|dart)\b/i
  },
  {
    id: "skywatching",
    weight: 6,
    pattern:
      /\b(meteor showers?|meteors?|eclipses?|conjunctions?|opposition|occultations?|night sky|skywatch(?:ing|ers?)|stargazing|naked[- ]eye|full moon|new moon|supermoon|planetary alignment|visible (?:tonight|this week|from)|zodiacal light|noctilucent)\b/i
  },
  {
    id: "research",
    weight: 4,
    pattern:
      /\b(study|studies|research(?:ers)?|scientists?|astronomers?|astrophysicists?|paper|preprint|peer[- ]reviewed|published in|journal|observations?|observed|data release|surveys?|spectr(?:a|um|oscopy|oscopic)|measurements?|measured|detect(?:s|ed|ion|ions)?|discover(?:s|ed|y|ies)?|findings?|simulations?|models? (?:show|suggest|predict))\b/i
  }
];

// Words that signal genuine scientific news when they lead a headline.
const SIGNIFICANCE_PATTERN =
  /\b(discover(?:s|ed|y)?|first(?:[- ]ever)?|detect(?:s|ed)?|reveals?|confirms?|finds?|found|unveils?|captures?|maps?|measures?|observes?|spots?|record|breakthrough|arrives?|lands?|landed|launch(?:es|ed)?|enters? orbit|in orbit|returns? (?:samples|data|images))\b/i;

type NegativeRule = { id: string; weight: number; title?: RegExp; url?: RegExp; category?: RegExp; text?: RegExp };

const NEGATIVE_RULES: NegativeRule[] = [
  {
    id: "entertainment",
    weight: -60,
    title: /\b(star trek|star wars|doctor who|the mandalorian|movies?|films?|trailers?|box office|tv (?:series|shows?)|season \d+|episode \d+|video games?|gaming|sci-fi games?|lego|anime|comic(?:s| books?)|novels?|actors?|actress|director (?:jonathan|ridley|christopher|james)|streaming on|netflix|disney\+?|hbo|paramount\+?)\b/i,
    category: /\b(entertainment|movies?|shows?|tv|games?|books?|culture)\b/i,
    url: /\/(?:entertainment|space-movies-shows|movies|tv|games|books)\//i
  },
  {
    id: "commerce",
    weight: -70,
    title: /\b(deals?|sale|discount|\d+% off|save \$?\d+|black friday|cyber monday|prime day|buy(?:ing guide)?|where to buy|best .{0,40}(?:telescopes?|binoculars?|cameras?|projectors?|lenses|gifts?|lego|deals?|gear)|projectors?|gift(?:s| guide| ideas)|we tested|hands-on|price(?:d| drop)?|bargain|coupon|amazon)\b/i,
    category: /\b(deals?|shopping|buying guides?|skywatching kit|kit|gear|reviews?|best)\b/i,
    url: /\/(?:deals?|shopping|best-|buying-guides?|reviews?)\b|[-/](?:deal|deals|review|buying-guide)(?:[-/]|$)/i
  },
  {
    id: "personnel",
    weight: -45,
    title: /\b(names?\b.{0,60}\b(?:director|administrator|chief|head|deputy|manager|lead|scientist|fellow|officer)|named (?:as |the )?(?:new )?(?:director|administrator|chief|head|deputy|manager|lead)|appoints?|appointed|appointment|selects? .{0,40}\b(?:as|to lead)\b|(?:new|acting|deputy|associate) (?:director|administrator|chief|head)|center director|welcomes|joins (?:nasa|esa|the (?:agency|team|board|center))|retires? (?:after|from)|retirement|obituary|dies at|in memoriam|honor awards?|awards? ceremony|recognizes employees|employees|employee|internships?|careers?|hiring|jobs?|workforce|civil servant|contractor to|promoted|leadership changes?|i am artemis)\b/i,
    url: /\/(?:people|careers?|leadership|biographies|bios?)\//i,
    category: /\b(people|leadership|careers?|workforce|employee|honor awards?)\b/i
  },
  {
    id: "event-admin",
    weight: -40,
    title: /\b(meetings?|conferences?|seminars?|webinars?|symposi(?:um|a)|workshops?|town halls?|panel discussions?|scholars?|media accreditation|media advisory|invites media|media (?:invited|teleconference|briefing)|news conference|to host|hosts? (?:a |an )?(?:event|briefing|discussion)|hackathons?|challenge:|(?:prize|student|design|innovation|public|centennial|lunar|moon|mars|space)\s+challenges?|challenges? (?:winners|finalists|opens?|seeks?|asks?)|prizes?|competitions?|contests?|winners|apply now|call for (?:proposals|papers|entries)|public input|seed funding|small business(?:es)?|grants?|funding opportunit(?:y|ies)|contract (?:award|awarded|to)|awards? contract|budget|procurement|quarterly news|newsletter)\b/i,
    category: /\b(prizes?|challenges?|crowdsourcing|get involved|opportunities|grants?|contracts?|procurement|small business|media advisory|news releases? for media)\b/i
  },
  {
    // History listicles restate old events; never exempted by science words.
    id: "history-listicle",
    weight: -45,
    title: /\b(on this day(?: in (?:space|history))?|this (?:day|week|month) in (?:space )?history|years? ago (?:today|this week))\b/i,
    url: /\/on-this-day-in-space/i
  },
  {
    id: "publicity",
    weight: -25,
    title: /\b(podcast|this week in space|anniversary|turns \d+|at \d+:|celebrat(?:es|ing|ion)|photos of the week|recap|roundup|quiz|tribute|commemorat(?:es|ing|ion)|open house|outreach|students?|classroom|educators?)\b/i,
    category: /\b(podcasts?|history|on this day|education|outreach|stem engagement)\b/i
  },
  {
    id: "medical-unrelated",
    weight: -30,
    text: /\b(cancer|tumou?rs?|patients?|clinical (?:trial|care)|hospitals?|drugs?|disease|vaccines?|alzheimer|diabetes|surgery|medical devices?|pharmaceutical)\b/i
  },
  {
    id: "earth-only",
    weight: -12,
    title: /\b(hurricanes?|cyclones?|typhoons?|wildfires?|floods?|flooding|droughts?|agricultur(?:e|al)|crops?|farm(?:s|ers|ing)?|air quality|pollution|sea level|glaciers?|ice sheets?)\b/i
  },
  {
    id: "business-policy",
    weight: -15,
    title: /\b(entrepreneurs?|space economy|investors?|investment|stocks?|startups?|commerciali[sz]ation|policy|regulations?|lawmakers?|congress|senate|lawsuit|ipo|valuation|revenue|museum piece)\b/i
  },
  {
    id: "static-page",
    weight: -40,
    url: /nasa\.gov\/(?:odpo|about|contact|faq|careers|centers-and-facilities\/[^/]+\/(?:about|contact)|organizations?)\//i
  }
];

const POSITIVE_CATEGORY_PATTERN =
  /\b(astronomy|astrophysics|solar system|planets?|mars|moon|lunar|sun|heliophysics|missions?|launch(?:es)? ?(?:&|and)? ?spacecraft|spacecraft|science|exoplanets?|galaxies|stars|black holes|webb|hubble|pulsars?|asteroids?|comets?|apod|photojournal|space exploration|skywatching|stargazing|eclipses?|meteors?|artemis|international space station|iss research|astro-ph)\b/i;

const NEUTRAL_CATEGORY_PATTERN = /^(general|uncategori[sz]ed|news|feature|nasa centers? & facilities|space technology mission directorate)$/i;

const PERSON_NAME_TITLE = /^(?:dr\.?\s+)?[A-ZÀ-Ý][a-zà-ÿ'’-]+(?:\s+[A-Z]\.)?(?:\s+(?:de|del|van|von|da|la|le)\b)?(?:\s+[A-ZÀ-Ý][a-zà-ÿ'’-]+){1,2}$/;

const CREDIBILITY_BASE: Record<EditorialInput["credibility"], number> = {
  Primary: 30,
  Reviewed: 30,
  Preprint: 30,
  Editorial: 24
};

function topicHits(text: string) {
  return TOPIC_RULES.filter((rule) => rule.pattern.test(text));
}

export function assessBrief(input: EditorialInput): EditorialAssessment {
  const signals: EditorialSignal[] = [];
  const title = input.title.trim();
  const summary = input.summary.trim();
  const categories = input.feedCategories.filter((category) => category && !NEUTRAL_CATEGORY_PATTERN.test(category.trim()));
  const categoryText = categories.join(" | ");

  signals.push({ id: `source:${input.credibility.toLowerCase()}`, weight: CREDIBILITY_BASE[input.credibility] });

  // Topic relevance: headline hits count fully, body-only hits count half.
  const titleTopics = topicHits(title);
  const bodyTopics = topicHits(summary).filter((rule) => !titleTopics.includes(rule));
  let topicScore = 0;
  for (const rule of titleTopics) topicScore += rule.weight * 2;
  for (const rule of bodyTopics) topicScore += rule.weight;
  topicScore = Math.min(45, Math.round(topicScore));
  if (topicScore > 0) {
    signals.push({ id: "topic", weight: topicScore, detail: [...titleTopics.map((rule) => `title:${rule.id}`), ...bodyTopics.map((rule) => `body:${rule.id}`)].join(",") });
  } else {
    signals.push({ id: "no-astronomy-topic", weight: -20 });
  }

  if (categories.some((category) => POSITIVE_CATEGORY_PATTERN.test(category))) {
    signals.push({ id: "feed-category", weight: 8, detail: categoryText.slice(0, 120) });
  }

  if (input.sourceFeedId === "arxiv-astro-ph") signals.push({ id: "astro-ph-paper", weight: 12 });
  if (input.sourceFeedId === "apod") signals.push({ id: "apod-curated", weight: 10 });

  const significance = SIGNIFICANCE_PATTERN.test(title) && titleTopics.length > 0 ? 8 : 0;
  if (significance) signals.push({ id: "significance", weight: significance });

  // A strong science headline (topic + discovery verb) halves people/event
  // penalties so that e.g. "Newly appointed mission scientist discovers…" or a
  // spaceflight medical experiment is not thrown away for a single word.
  const strongScience = titleTopics.some((rule) => rule.id !== "research" && rule.id !== "spaceflight") && significance > 0;
  const spaceflightContext = /\b(astronauts?|spaceflight|microgravity|space station|iss|in space|on orbit|aboard)\b/i.test(`${title} ${summary}`);
  const satelliteContext = /\b(satellites?|from space|from orbit|earth observatory|landsat|modis|viirs|sentinel|imag(?:e|ery|ed) (?:by|from))\b/i.test(`${title} ${summary} ${categoryText}`);

  for (const rule of NEGATIVE_RULES) {
    const matched: string[] = [];
    if (rule.title?.test(title)) matched.push("title");
    if (rule.category && categories.some((category) => rule.category!.test(category))) matched.push("category");
    if (rule.url?.test(input.url)) matched.push("url");
    if (rule.text?.test(`${title} ${summary}`)) matched.push("text");
    if (matched.length === 0) continue;

    let weight = rule.weight;
    if (rule.id === "medical-unrelated" && spaceflightContext) continue;
    if (rule.id === "earth-only" && satelliteContext) weight = -4;
    if ((rule.id === "personnel" || rule.id === "event-admin" || rule.id === "publicity") && strongScience) weight = Math.round(weight / 2);
    // Corroborating evidence (e.g. title and feed category agree) strengthens a penalty.
    if (matched.length > 1) weight = Math.round(weight * 1.25);

    signals.push({ id: rule.id, weight, detail: matched.join("+") });
  }

  if (PERSON_NAME_TITLE.test(title) && titleTopics.length === 0) {
    signals.push({ id: "person-name-title", weight: -45 });
  }

  const titleWords = title.split(/\s+/).filter(Boolean).length;
  if (titleWords <= 3 && titleTopics.length === 0 && !SIGNIFICANCE_PATTERN.test(title)) {
    signals.push({ id: "thin-title", weight: -15 });
  }

  const score = Math.max(0, Math.min(100, signals.reduce((total, signal) => total + signal.weight, 0)));
  const hasNegative = signals.some((signal) => signal.weight < 0);
  const decision = score >= ACCEPT_THRESHOLD ? "accept" : "reject";

  return {
    score,
    decision,
    featureEligible: decision === "accept" && score >= FEATURE_THRESHOLD && !hasNegative && input.sourceFeedId !== "apod",
    significance,
    signals,
    reasons: signals.map((signal) => `${signal.id}${signal.detail ? `(${signal.detail})` : ""} ${signal.weight > 0 ? "+" : ""}${signal.weight}`)
  };
}

// ---------------------------------------------------------------------------
// Category and tags
// ---------------------------------------------------------------------------

export const BRIEF_CATEGORIES = [
  "Solar / Space Weather",
  "Skywatching",
  "Planetary Science",
  "Astrophysics",
  "Missions",
  "Research",
  "Space News"
] as const;

type CategoryRule = { category: (typeof BRIEF_CATEGORIES)[number]; weight: number; pattern: RegExp };

const CATEGORY_RULES: CategoryRule[] = [
  { category: "Solar / Space Weather", weight: 4, pattern: /\b(solar (?:flares?|wind|cycle|storms?|activity|orbiter|maximum)|coronal mass ejections?|sunspots?|space weather|heliophysics|heliosphere|parker solar probe|geomagnetic|auroras?|the sun|sun['’]s|corona|plasma jets?)\b/gi },
  { category: "Skywatching", weight: 4, pattern: /\b(meteor showers?|meteors?|eclipses?|conjunctions?|opposition|occultations?|night sky|skywatch(?:ing)?|stargazing|naked[- ]eye|visible (?:tonight|this week)|how to see|full moon|supermoon|fireballs?)\b/gi },
  { category: "Planetary Science", weight: 3, pattern: /\b(mars|martian|jupiter|jovian|saturn|venus|mercury|uranus|neptune|pluto|titan|europa|enceladus|ganymede|ceres|asteroids?|comets?|meteorites?|kuiper belt|moons?|lunar|dwarf planets?|craters?|volcan(?:o|oes|ic)|planetary|solar system|dimorphos|exomoons?)\b/gi },
  { category: "Astrophysics", weight: 3, pattern: /\b(galax(?:y|ies)|nebula[es]?|black holes?|supernova(?:e|s)?|neutron stars?|pulsars?|magnetars?|quasars?|dark (?:matter|energy)|cosmolog(?:y|ical)|big bang|universe|stellar|stars?|star[- ]formation|white dwarfs?|binary|exoplanets?|gravitational|cosmic|fast radio bursts?|milky way|redshift)\b/gi },
  { category: "Missions", weight: 3, pattern: /\b(launch(?:es|ed)?|liftoff|rockets?|spacecraft|missions?|space station|iss|astronauts?|crew|artemis|docking|undock(?:s|ed)?|splash(?:es)? ?down|starship|falcon|satellites?|landers?|orbit insertion|arrives?|commissioning|payloads?)\b/gi },
  { category: "Research", weight: 2, pattern: /\b(study|research(?:ers)?|paper|preprint|published in|journal|simulations?|models?|data release|surveys?|spectroscop(?:y|ic)|measurements?)\b/gi }
];

function countMatches(pattern: RegExp, text: string) {
  pattern.lastIndex = 0;
  return text.match(pattern)?.length ?? 0;
}

export function classifyBrief(input: { title: string; summary: string; feedCategories: string[]; sourceFeedId: string; categoryHint?: string }): string {
  const scores = new Map<string, number>();
  const add = (category: string, value: number) => scores.set(category, (scores.get(category) ?? 0) + value);
  const categoryText = input.feedCategories.join(" ");

  for (const rule of CATEGORY_RULES) {
    // Headline words are the strongest evidence of what a story is about.
    const titleHits = Math.min(3, countMatches(rule.pattern, input.title));
    const summaryHits = Math.min(4, countMatches(rule.pattern, input.summary));
    const categoryHits = Math.min(2, countMatches(rule.pattern, categoryText));
    const value = rule.weight * (titleHits * 3 + summaryHits + categoryHits * 2);
    if (value > 0) add(rule.category, value);
  }

  if (input.sourceFeedId === "arxiv-astro-ph") add("Research", 40);
  if (input.sourceFeedId === "apod") add("Skywatching", 2);

  let best: string | undefined;
  let bestScore = 0;
  // Ties resolve in BRIEF_CATEGORIES order: specific topics before general ones.
  for (const category of BRIEF_CATEGORIES) {
    const value = scores.get(category) ?? 0;
    if (value > bestScore) {
      best = category;
      bestScore = value;
    }
  }

  if (best && bestScore >= 6) return best;
  const hint = input.categoryHint && (BRIEF_CATEGORIES as readonly string[]).includes(input.categoryHint) ? input.categoryHint : undefined;
  return hint ?? "Space News";
}

const TAG_RULES: Array<[RegExp, string]> = [
  [/\b(webb|jwst)\b/i, "Webb"],
  [/\bhubble\b/i, "Hubble"],
  [/\beuclid\b/i, "Euclid"],
  [/\bartemis\b/i, "Artemis"],
  [/\b(moon|lunar)\b/i, "Moon"],
  [/\b(mars|martian)\b/i, "Mars"],
  [/\b(jupiter|saturn|venus|mercury|uranus|neptune|pluto|planetary)\b/i, "Planetary Science"],
  [/\b(asteroids?|comets?|near-earth|neos?)\b/i, "Asteroids"],
  [/\b(solar (?:flares?|wind|cycle|storms?|orbiter)|sunspots?|space weather|coronal|the sun)\b/i, "Solar / Space Weather"],
  [/\b(galax(?:y|ies)|cosmolog(?:y|ical)|dark matter|black holes?)\b/i, "Astrophysics"],
  [/\bexoplanets?\b/i, "Exoplanets"],
  [/\b(launch(?:es|ed)?|liftoff|rockets?)\b/i, "Launches"],
  [/\b(space station|iss)\b/i, "Space Station"],
  [/\b(meteor showers?|eclipses?|auroras?|skywatch(?:ing)?|stargazing|night sky)\b/i, "Skywatching"],
  [/\b(preprint|arxiv|paper|study)\b/i, "Research"]
];

const JUNK_TAG_PATTERN = /^(general|uncategori[sz]ed|news|feature|nasa centers? & facilities|.*mission directorate|photojournal|apod|stennis space center|ames research center|research and technology.*)$/i;

export function inferBriefTags(input: { title: string; summary: string; feedCategories: string[]; category: string }): string[] {
  const text = `${input.title} ${input.summary}`;
  const inferred = TAG_RULES.filter(([pattern]) => pattern.test(text)).map(([, tag]) => tag);
  const fromFeed = input.feedCategories
    .map((category) => category.replace(/^astro-ph\./i, "Astrophysics ").replace(/\s+/g, " ").trim().slice(0, 32))
    .filter((category) => category && !JUNK_TAG_PATTERN.test(category));

  return Array.from(new Set([input.category, ...inferred, ...fromFeed])).filter(Boolean).slice(0, 5);
}
