import { GALLERY_REVALIDATE_SECONDS, NASA_APOD_API_URL, NASA_IMAGE_LIBRARY_API_BASE } from "@/lib/constants";
import type { GalleryCategory, GalleryImage, GalleryResult, GallerySource } from "@/lib/types";

export const CURATED_FALLBACK_GALLERY: GalleryImage[] = [
  {
    id: "jwst-cosmic-cliffs-carina",
    title: "Cosmic Cliffs in the Carina Nebula",
    description:
      "Captured in infrared light by the James Webb Space Telescope, this landscape of 'mountains' and 'valleys' is the edge of a star-forming region named NGC 3324 in the Carina Nebula, revealing previously invisible areas of star birth.",
    imageUrl: "https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000356/GSFC_20171208_Archive_e000356~large.jpg",
    thumbnailUrl: "https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000356/GSFC_20171208_Archive_e000356~medium.jpg",
    hdImageUrl: "https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000356/GSFC_20171208_Archive_e000356~orig.jpg",
    source: "ESA / Webb",
    sourceUrl: "https://webbtelescope.org/contents/media/images/2022/031/01G77PKGF7BM3HDNV20794MG1E",
    credit: "NASA, ESA, CSA, STScI",
    date: "2022-07-12",
    category: "Nebulae",
    objectName: "NGC 3324 (Carina Nebula)",
    observatory: "James Webb Space Telescope (NIRCam)",
    distance: "7,600 light-years",
    aspectRatio: 1.77,
    featured: true,
    isFallback: true
  },
  {
    id: "jwst-pillars-of-creation",
    title: "Pillars of Creation in Near-Infrared",
    description:
      "A three-dimensional panorama of dense columns of interstellar gas and dust in the Eagle Nebula (Messier 16), where newborn stars trigger energetic ejections from surrounding material.",
    imageUrl: "https://images-assets.nasa.gov/image/PIA25442/PIA25442~large.jpg",
    thumbnailUrl: "https://images-assets.nasa.gov/image/PIA25442/PIA25442~medium.jpg",
    hdImageUrl: "https://images-assets.nasa.gov/image/PIA25442/PIA25442~orig.jpg",
    source: "ESA / Webb",
    sourceUrl: "https://webbtelescope.org/contents/media/images/2022/052/01GF423GBQSK6ANC89ED569PDG",
    credit: "NASA, ESA, CSA, STScI, J. DePasquale, A. Pagan, A. M. Koekemoer",
    date: "2022-10-19",
    category: "Nebulae",
    objectName: "Messier 16 (Eagle Nebula)",
    observatory: "James Webb Space Telescope (NIRCam)",
    distance: "6,500 light-years",
    aspectRatio: 0.85,
    isFallback: true
  },
  {
    id: "hubble-andromeda-galaxy",
    title: "Andromeda Galaxy — Messier 31",
    description:
      "The sharpest visible-light and ultraviolet composite of our nearest galactic spiral neighbor, containing over one trillion stars and orbiting satellite galaxies in the Local Group.",
    imageUrl: "https://images-assets.nasa.gov/image/PIA04921/PIA04921~large.jpg",
    thumbnailUrl: "https://images-assets.nasa.gov/image/PIA04921/PIA04921~medium.jpg",
    hdImageUrl: "https://images-assets.nasa.gov/image/PIA04921/PIA04921~orig.jpg",
    source: "NASA Image Library",
    sourceUrl: "https://images.nasa.gov/details/PIA04921",
    credit: "NASA / JPL-Caltech",
    date: "2003-12-10",
    category: "Galaxies",
    objectName: "Messier 31 (NGC 224)",
    observatory: "GALEX & Space Telescopes",
    distance: "2.537 million light-years",
    aspectRatio: 1.05,
    isFallback: true
  },
  {
    id: "jwst-stephans-quintet",
    title: "Stephan's Quintet Visual and Infrared Composite",
    description:
      "An enormous mosaic of five galaxies, four of which are locked in a gravitational dance of repeated close encounters, triggering massive shockwaves as galaxy NGC 7318B smashes through the cluster gas.",
    imageUrl: "https://images-assets.nasa.gov/image/PIA25381/PIA25381~large.jpg",
    thumbnailUrl: "https://images-assets.nasa.gov/image/PIA25381/PIA25381~medium.jpg",
    hdImageUrl: "https://images-assets.nasa.gov/image/PIA25381/PIA25381~orig.jpg",
    source: "ESA / Webb",
    sourceUrl: "https://webbtelescope.org/contents/media/images/2022/034/01G79R0A3FPKYFDV1F5E16W2RV",
    credit: "NASA, ESA, CSA, STScI",
    date: "2022-07-12",
    category: "Galaxies",
    objectName: "HCG 92 (Stephan's Quintet)",
    observatory: "James Webb Space Telescope (NIRCam & MIRI)",
    distance: "290 million light-years",
    aspectRatio: 1.15,
    isFallback: true
  },
  {
    id: "juno-jupiter-great-red-spot",
    title: "Jupiter's Dynamic Atmosphere & Great Red Spot",
    description:
      "Perijove close-up by the Juno spacecraft capturing the turbulent Jovian cloud tops, ammonia ice crystals, and high-altitude storm belts churning in Jupiter's southern hemisphere.",
    imageUrl: "https://images-assets.nasa.gov/image/PIA21972/PIA21972~large.jpg",
    thumbnailUrl: "https://images-assets.nasa.gov/image/PIA21972/PIA21972~medium.jpg",
    hdImageUrl: "https://images-assets.nasa.gov/image/PIA21972/PIA21972~orig.jpg",
    source: "NASA Image Library",
    sourceUrl: "https://photojournal.jpl.nasa.gov/catalog/PIA21972",
    credit: "NASA / JPL-Caltech / SwRI / MSSS / Gerald Eichstädt / Seán Doran",
    date: "2017-09-01",
    category: "Planets",
    objectName: "Jupiter",
    observatory: "Juno Spacecraft (JunoCam)",
    distance: "628 million km from Earth",
    aspectRatio: 0.82,
    isFallback: true
  },
  {
    id: "cassini-saturn-rings-backlit",
    title: "The Day the Earth Smiled — Saturn & Rings Backlit",
    description:
      "Cassini slipped into Saturn's shadow and turned its cameras back toward the eclipsed Sun, capturing the outer E-ring illuminated and pinpointing Earth as a faint blue dot in the distance.",
    imageUrl: "https://images-assets.nasa.gov/image/PIA17172/PIA17172~large.jpg",
    thumbnailUrl: "https://images-assets.nasa.gov/image/PIA17172/PIA17172~medium.jpg",
    hdImageUrl: "https://images-assets.nasa.gov/image/PIA17172/PIA17172~orig.jpg",
    source: "NASA Image Library",
    sourceUrl: "https://photojournal.jpl.nasa.gov/catalog/PIA17172",
    credit: "NASA / JPL-Caltech / Space Science Institute",
    date: "2013-11-12",
    category: "Planets",
    objectName: "Saturn & Ring System",
    observatory: "Cassini Spacecraft (ISS)",
    distance: "1.4 billion km from Earth",
    aspectRatio: 1.85,
    isFallback: true
  },
  {
    id: "sdo-sun-coronal-flare",
    title: "Magnificent Coronal Loop Eruption",
    description:
      "An extreme ultraviolet perspective of an M-class solar flare observed by NASA's Solar Dynamics Observatory, tracing twisted magnetic field lines glowing in superheated plasma at millions of degrees.",
    imageUrl: "https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e001427/GSFC_20171208_Archive_e001427~large.jpg",
    thumbnailUrl: "https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e001427/GSFC_20171208_Archive_e001427~medium.jpg",
    hdImageUrl: "https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e001427/GSFC_20171208_Archive_e001427~orig.jpg",
    source: "NASA Image Library",
    sourceUrl: "https://images.nasa.gov/details/GSFC_20171208_Archive_e001427",
    credit: "NASA / SDO / AIA Consortium",
    date: "2012-07-20",
    category: "Sun",
    objectName: "The Sun (Active Region 1515)",
    observatory: "Solar Dynamics Observatory (AIA 171Å)",
    distance: "149.6 million km",
    aspectRatio: 1.0,
    isFallback: true
  },
  {
    id: "lro-tycho-crater-moon",
    title: "Central Peak of Tycho Crater",
    description:
      "A dramatic low-sun angle oblique view across Tycho crater's central peak complex on the lunar near-side, revealing boulder-strewn volcanic and impact melt terraces.",
    imageUrl: "https://images-assets.nasa.gov/image/PIA14421/PIA14421~large.jpg",
    thumbnailUrl: "https://images-assets.nasa.gov/image/PIA14421/PIA14421~medium.jpg",
    hdImageUrl: "https://images-assets.nasa.gov/image/PIA14421/PIA14421~orig.jpg",
    source: "NASA Image Library",
    sourceUrl: "https://photojournal.jpl.nasa.gov/catalog/PIA14421",
    credit: "NASA / Goddard / Arizona State University",
    date: "2011-06-29",
    category: "Moon",
    objectName: "Tycho Crater (Moon)",
    observatory: "Lunar Reconnaissance Orbiter (LROC)",
    distance: "384,400 km",
    aspectRatio: 1.33,
    isFallback: true
  },
  {
    id: "iss-earth-aurora-limb",
    title: "Aurora Australis Over the Southern Ocean",
    description:
      "Expedition crew members aboard the International Space Station photographed this vibrant atmospheric glow as energized solar wind particles collided with oxygen and nitrogen in Earth's upper atmosphere.",
    imageUrl: "https://images-assets.nasa.gov/image/iss064e028445/iss064e028445~large.jpg",
    thumbnailUrl: "https://images-assets.nasa.gov/image/iss064e028445/iss064e028445~medium.jpg",
    hdImageUrl: "https://images-assets.nasa.gov/image/iss064e028445/iss064e028445~orig.jpg",
    source: "NASA Image Library",
    sourceUrl: "https://images.nasa.gov/details/iss064e028445",
    credit: "NASA / ISS Expedition Crew",
    date: "2021-01-29",
    category: "Earth",
    objectName: "Earth's Ionosphere & Aurora",
    observatory: "International Space Station (Low Earth Orbit)",
    distance: "418 km altitude",
    aspectRatio: 1.5,
    isFallback: true
  },
  {
    id: "chandra-cassiopeia-a-supernova",
    title: "Cassiopeia A Supernova Remnant",
    description:
      "A multi-wavelength composite combining X-rays from Chandra, optical data from Hubble, and infrared from Spitzer, showing the expanding wreckage and neutron star core of a massive star that exploded ~340 years ago.",
    imageUrl: "https://images-assets.nasa.gov/image/PIA17842/PIA17842~large.jpg",
    thumbnailUrl: "https://images-assets.nasa.gov/image/PIA17842/PIA17842~medium.jpg",
    hdImageUrl: "https://images-assets.nasa.gov/image/PIA17842/PIA17842~orig.jpg",
    source: "Hubble",
    sourceUrl: "https://photojournal.jpl.nasa.gov/catalog/PIA17842",
    credit: "NASA / CXC / SAO / STScI / JPL-Caltech",
    date: "2013-12-19",
    category: "Deep Space",
    objectName: "Cassiopeia A (3C 461)",
    observatory: "Chandra X-ray Observatory & Hubble",
    distance: "11,000 light-years",
    aspectRatio: 1.0,
    isFallback: true
  },
  {
    id: "jwst-cartwheel-galaxy",
    title: "The Cartwheel Galaxy Unveiled by Webb",
    description:
      "A rare ring galaxy formed following a high-speed collision between a large spiral galaxy and a smaller companion, showing spokes of intense star formation ignited by expanding shock rings.",
    imageUrl: "https://images-assets.nasa.gov/image/PIA25386/PIA25386~large.jpg",
    thumbnailUrl: "https://images-assets.nasa.gov/image/PIA25386/PIA25386~medium.jpg",
    hdImageUrl: "https://images-assets.nasa.gov/image/PIA25386/PIA25386~orig.jpg",
    source: "ESA / Webb",
    sourceUrl: "https://webbtelescope.org/contents/media/images/2022/039/01G8N1PQ8CQH1H1X0QHQW97B2A",
    credit: "NASA, ESA, CSA, STScI",
    date: "2022-08-02",
    category: "Galaxies",
    objectName: "Cartwheel Galaxy (ESO 350-40)",
    observatory: "James Webb Space Telescope (NIRCam & MIRI)",
    distance: "500 million light-years",
    aspectRatio: 1.12,
    isFallback: true
  },
  {
    id: "hubble-orion-nebula-m42",
    title: "The Orion Nebula in High-Resolution",
    description:
      "One of the sharpest astronomical views ever produced: the Orion Nebula star-birth stellar nursery, sculpted by fierce ultraviolet radiation from the massive young Trapezium cluster stars.",
    imageUrl: "https://images-assets.nasa.gov/image/PIA08006/PIA08006~large.jpg",
    thumbnailUrl: "https://images-assets.nasa.gov/image/PIA08006/PIA08006~medium.jpg",
    hdImageUrl: "https://images-assets.nasa.gov/image/PIA08006/PIA08006~orig.jpg",
    source: "Hubble",
    sourceUrl: "https://photojournal.jpl.nasa.gov/catalog/PIA08006",
    credit: "NASA, ESA, M. Robberto (Space Telescope Science Institute/ESA) and the Hubble Space Telescope Orion Treasury Project Team",
    date: "2006-01-11",
    category: "Nebulae",
    objectName: "Messier 42 (NGC 1976)",
    observatory: "Hubble Space Telescope (ACS)",
    distance: "1,344 light-years",
    aspectRatio: 1.0,
    isFallback: true
  },
  {
    id: "jwst-tarantula-nebula",
    title: "Tarantula Nebula 30 Doradus",
    description:
      "The largest and brightest star-forming region in the Local Group of galaxies, harboring the most massive stars known in the universe within the Large Magellanic Cloud.",
    imageUrl: "https://images-assets.nasa.gov/image/PIA25439/PIA25439~large.jpg",
    thumbnailUrl: "https://images-assets.nasa.gov/image/PIA25439/PIA25439~medium.jpg",
    hdImageUrl: "https://images-assets.nasa.gov/image/PIA25439/PIA25439~orig.jpg",
    source: "ESA / Webb",
    sourceUrl: "https://webbtelescope.org/contents/media/images/2022/041/01GBQC0N9GCHV62EBEFHKPFFQZ",
    credit: "NASA, ESA, CSA, STScI",
    date: "2022-09-06",
    category: "Nebulae",
    objectName: "30 Doradus (NGC 2070)",
    observatory: "James Webb Space Telescope (NIRCam)",
    distance: "161,000 light-years",
    aspectRatio: 1.48,
    isFallback: true
  },
  {
    id: "perseverance-mars-jezero-crater",
    title: "Mars Jezero Crater Ancient River Delta",
    description:
      "High-resolution panorama captured by the Mastcam-Z instrument on NASA's Perseverance Mars rover, revealing stratified sedimentary layers deposited by an ancient Martian river billions of years ago.",
    imageUrl: "https://images-assets.nasa.gov/image/PIA24836/PIA24836~large.jpg",
    thumbnailUrl: "https://images-assets.nasa.gov/image/PIA24836/PIA24836~medium.jpg",
    hdImageUrl: "https://images-assets.nasa.gov/image/PIA24836/PIA24836~orig.jpg",
    source: "NASA Image Library",
    sourceUrl: "https://photojournal.jpl.nasa.gov/catalog/PIA24836",
    credit: "NASA / JPL-Caltech / ASU / MSSS",
    date: "2021-10-07",
    category: "Missions",
    objectName: "Mars (Jezero Crater)",
    observatory: "Perseverance Mars Rover (Mastcam-Z)",
    distance: "225 million km average",
    aspectRatio: 2.1,
    isFallback: true
  },
  {
    id: "hubble-sombrero-galaxy-m104",
    title: "The Majestic Sombrero Galaxy — M104",
    description:
      "A landmark optical observation of Messier 104, distinguished by its brilliant white bulbous core encircled by thick lanes of cosmic dust carrying rich clusters of stars.",
    imageUrl: "https://images-assets.nasa.gov/image/PIA04215/PIA04215~large.jpg",
    thumbnailUrl: "https://images-assets.nasa.gov/image/PIA04215/PIA04215~medium.jpg",
    hdImageUrl: "https://images-assets.nasa.gov/image/PIA04215/PIA04215~orig.jpg",
    source: "Hubble",
    sourceUrl: "https://photojournal.jpl.nasa.gov/catalog/PIA04215",
    credit: "NASA and The Hubble Heritage Team (STScI/AURA)",
    date: "2003-10-02",
    category: "Galaxies",
    objectName: "Messier 104 (NGC 4594)",
    observatory: "Hubble Space Telescope (ACS)",
    distance: "29.3 million light-years",
    aspectRatio: 1.77,
    isFallback: true
  },
  {
    id: "hubble-crab-nebula-pulsar",
    title: "The Crab Nebula Supernova Debris Field",
    description:
      "A sprawling mosaic of the expanding filamentary remnant of a supernova observed by earthly astronomers in the year 1054, powered by a rapidly spinning central neutron star.",
    imageUrl: "https://images-assets.nasa.gov/image/PIA03606/PIA03606~large.jpg",
    thumbnailUrl: "https://images-assets.nasa.gov/image/PIA03606/PIA03606~medium.jpg",
    hdImageUrl: "https://images-assets.nasa.gov/image/PIA03606/PIA03606~orig.jpg",
    source: "Hubble",
    sourceUrl: "https://photojournal.jpl.nasa.gov/catalog/PIA03606",
    credit: "NASA, ESA, J. Hester and A. Loll (Arizona State University)",
    date: "2005-12-01",
    category: "Nebulae",
    objectName: "Messier 1 (NGC 1952)",
    observatory: "Hubble Space Telescope (WFPC2)",
    distance: "6,500 light-years",
    aspectRatio: 1.0,
    isFallback: true
  },
  {
    id: "jwst-deep-field-smacs-0723",
    title: "Webb's First Deep Field — SMACS 0723",
    description:
      "The deepest and sharpest infrared image of the distant universe to date, showing galaxy cluster SMACS 0723 acting as a gravitational lens that magnifies extremely faint background galaxies from over 13 billion years ago.",
    imageUrl: "https://images-assets.nasa.gov/image/PIA25379/PIA25379~large.jpg",
    thumbnailUrl: "https://images-assets.nasa.gov/image/PIA25379/PIA25379~medium.jpg",
    hdImageUrl: "https://images-assets.nasa.gov/image/PIA25379/PIA25379~orig.jpg",
    source: "ESA / Webb",
    sourceUrl: "https://webbtelescope.org/contents/media/images/2022/035/01G7DCWB7137MYJ05CSH1Q5Z1Z",
    credit: "NASA, ESA, CSA, STScI",
    date: "2022-07-11",
    category: "Deep Space",
    objectName: "SMACS J0723.3-7327",
    observatory: "James Webb Space Telescope (NIRCam)",
    distance: "4.6 billion light-years (lens cluster)",
    aspectRatio: 1.0,
    isFallback: true
  },
  {
    id: "hubble-ring-nebula-m57",
    title: "The Ring Nebula — Messier 57",
    description:
      "A glowing barrel-shaped shroud of incandescent gas cast off by a dying Sun-like star, captured in visible and infrared light revealing intricate knotty outer halos.",
    imageUrl: "https://images-assets.nasa.gov/image/PIA17078/PIA17078~large.jpg",
    thumbnailUrl: "https://images-assets.nasa.gov/image/PIA17078/PIA17078~medium.jpg",
    hdImageUrl: "https://images-assets.nasa.gov/image/PIA17078/PIA17078~orig.jpg",
    source: "Hubble",
    sourceUrl: "https://photojournal.jpl.nasa.gov/catalog/PIA17078",
    credit: "NASA, ESA, and C.R. O'Dell (Vanderbilt University)",
    date: "2013-05-23",
    category: "Nebulae",
    objectName: "Messier 57 (NGC 6720)",
    observatory: "Hubble Space Telescope (WFC3)",
    distance: "2,570 light-years",
    aspectRatio: 1.02,
    isFallback: true
  }
];

function normalizeTitle(rawTitle: string): string {
  let title = rawTitle.replace(/\s+/g, " ").trim();
  title = title.replace(/\s*\([^)]*(NIRCam|WFC3|ACS|MIRI|Composite|Artist|Illustration)[^)]*\)/gi, "");
  title = title.replace(/^NASA's\s+/i, "");
  title = title.replace(/^Hubble\s+Sees\s+/i, "");
  title = title.replace(/^Webb\s+Captures\s+/i, "");
  return title.trim() || rawTitle;
}

function detectCategory(title: string, keywords: string[] = [], description: string = ""): GalleryCategory {
  const combined = `${title} ${keywords.join(" ")} ${description}`.toLowerCase();

  if (/(\bgalaxy\b|\bgalaxies\b|spiral galaxy|andromeda|milky way|m31|m51|m81|m82|m101|m104|m74|sombrero|stephan|cartwheel|whirlpool|pinwheel|smacs|deep field|cluster of galaxies)/i.test(combined)) {
    return "Galaxies";
  }

  if (/(\bnebula\b|\bnebulae\b|pillars of creation|carina|orion nebula|crab nebula|ring nebula|veil nebula|tarantula|horsehead|helix nebula|bubble nebula|eagle nebula|supernova remnant|planetary nebula)/i.test(combined)) {
    return "Nebulae";
  }

  if (/(\bjupiter\b|\bsaturn\b|\bmars\b|\bvenus\b|\bmercury\b|\buranus\b|\bneptune\b|\bpluto\b|\bgas giant\b|jovian|martian|rings of saturn|great red spot)/i.test(combined)) {
    return "Planets";
  }

  if (/(\bthe moon\b|\blunar\b|moon surface|crater tycho|mare |apollo landing|lroc|regolith)/i.test(combined)) {
    return "Moon";
  }

  if (/(\bthe sun\b|\bsolar\b|corona|coronal|solar flare|prominence|photosphere|\bsdo\b|\bsoho\b|sunspot)/i.test(combined)) {
    return "Sun";
  }

  if (/(\bearth\b|earth from space|blue marble|aurora australis|aurora borealis|low earth orbit|iss over earth|limb of earth)/i.test(combined)) {
    return "Earth";
  }

  if (/(\bstar cluster\b|\bglobular cluster\b|\bpleiades\b|\bprotostar\b|\bbinary star\b|\bred giant\b|\bwhite dwarf\b|\bbetelgeuse\b|\bstar birth\b)/i.test(combined)) {
    return "Stars";
  }

  if (/(\bspacecraft\b|\brover\b|\bvoyager\b|\bperseverance\b|\bcuriosity\b|\bartemis\b|\bjwst deployment\b|\bobservatory\b|\btelescope mirror\b|\blaunch\b)/i.test(combined)) {
    return "Missions";
  }

  return "Deep Space";
}

function extractObjectName(title: string, description: string): string | undefined {
  const match = title.match(/(Messier\s*\d+|M\d+|NGC\s*\d+|IC\s*\d+|Pillars of Creation|Carina Nebula|Orion Nebula|Andromeda|Jupiter|Saturn|Mars|The Sun|The Moon|Cartwheel Galaxy|Stephan's Quintet|Cassiopeia A|Ring Nebula|Tarantula Nebula|Crab Nebula|Sombrero Galaxy)/i);
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

function isValidAstronomyImage(title: string, description: string, url: string): boolean {
  if (!url || typeof url !== "string") return false;
  if (!url.startsWith("http://") && !url.startsWith("https://")) return false;

  const lower = `${title} ${description} ${url}`.toLowerCase();

  // Reject videos, audio, documents
  if (/\.(mp4|webm|avi|mov|mp3|wav|pdf|doc|zip|eps|ai)(\?|$)/i.test(url)) return false;

  // Reject logos, infographics, press charts, generic icons, personnel portraits
  if (/(logo|patch|insignia|emblem|poster|diagram|schematic|infographic|flowchart|chart|certificate|group photo|portrait of|headshot|press conference|administrator|audience|handshake|award)/i.test(lower)) {
    return false;
  }

  return true;
}

async function fetchNasaApodImages(): Promise<GalleryImage[]> {
  const apiKey = process.env.NASA_API_KEY || "DEMO_KEY";
  const url = `${NASA_APOD_API_URL}?api_key=${encodeURIComponent(apiKey)}&count=24`;

  try {
    const res = await fetch(url, {
      next: { revalidate: GALLERY_REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(8000)
    });

    if (!res.ok) {
      console.warn(`NASA APOD API returned HTTP ${res.status}`);
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
      const imageUrl = item.hdurl || item.url;
      const thumbnailUrl = item.url;

      if (!isValidAstronomyImage(title, description, imageUrl)) continue;

      const category = detectCategory(title, [], description);
      const objectName = extractObjectName(title, description);
      const observatory = extractObservatory(title, description);

      results.push({
        id: `apod-${item.date || Math.random().toString(36).slice(2, 8)}`,
        title,
        description,
        imageUrl: imageUrl.replace(/^http:\/\//i, "https://"),
        thumbnailUrl: thumbnailUrl.replace(/^http:\/\//i, "https://"),
        hdImageUrl: item.hdurl ? item.hdurl.replace(/^http:\/\//i, "https://") : undefined,
        source: "NASA APOD",
        sourceUrl: `https://apod.nasa.gov/apod/ap${(item.date || "").replace(/-/g, "").slice(2)}.html`,
        credit: item.copyright ? item.copyright.trim().replace(/\n/g, " ") : "NASA / APOD",
        date: item.date || new Date().toISOString().slice(0, 10),
        category,
        objectName,
        observatory,
        aspectRatio: 1.33
      });
    }

    return results;
  } catch (error) {
    console.warn("NASA APOD fetch failed:", error);
    return [];
  }
}

async function fetchNasaImageLibraryQueries(): Promise<GalleryImage[]> {
  const curatedQueries = [
    { q: "James Webb Space Telescope galaxy", source: "ESA / Webb" as const },
    { q: "Hubble Space Telescope nebula", source: "Hubble" as const },
    { q: "Jupiter Juno Cassini Saturn", source: "NASA Image Library" as const },
    { q: "Solar Dynamics Observatory Sun flare", source: "NASA Image Library" as const },
    { q: "Earth atmospheric limb ISS", source: "NASA Image Library" as const },
    { q: "Chandra supernova remnant", source: "Observatory Archive" as const }
  ];

  const results: GalleryImage[] = [];

  const promises = curatedQueries.map(async ({ q, source }) => {
    try {
      const url = `${NASA_IMAGE_LIBRARY_API_BASE}/search?q=${encodeURIComponent(q)}&media_type=image&page_size=8`;
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
        const description = itemData.description || itemData.description_508 || "";
        const keywords = Array.isArray(itemData.keywords) ? itemData.keywords : [];

        if (!title || !nasaId) continue;

        const encodedId = encodeURIComponent(nasaId);
        const baseUrl = `https://images-assets.nasa.gov/image/${encodedId}/${encodedId}`;
        const imageUrl = `${baseUrl}~large.jpg`;
        const thumbnailUrl = `${baseUrl}~medium.jpg`;
        const hdImageUrl = `${baseUrl}~orig.jpg`;

        if (!isValidAstronomyImage(title, description, imageUrl)) continue;

        const category = detectCategory(title, keywords, description);
        const objectName = extractObjectName(title, description);
        const observatory = extractObservatory(title, description, itemData.center);
        const credit = itemData.secondary_creator || (itemData.center ? `NASA / ${itemData.center}` : "NASA");
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
  const unique: GalleryImage[] = [];

  for (const img of images) {
    if (!img || !img.id || !img.imageUrl) continue;

    if (seenIds.has(img.id)) continue;

    const titleKey = img.title
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "")
      .slice(0, 24);

    if (titleKey.length > 5 && seenTitles.has(titleKey)) continue;

    seenIds.add(img.id);
    if (titleKey.length > 5) seenTitles.add(titleKey);

    unique.push(img);
  }

  unique.sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return unique;
}

export async function getGalleryData(): Promise<GalleryResult> {
  const warnings: string[] = [];

  const [apodResult, libResult] = await Promise.allSettled([
    fetchNasaApodImages(),
    fetchNasaImageLibraryQueries()
  ]);

  let liveImages: GalleryImage[] = [];

  if (apodResult.status === "fulfilled" && apodResult.value.length > 0) {
    liveImages.push(...apodResult.value);
  } else {
    warnings.push("Live NASA APOD stream is temporarily resting; showing archive selection.");
  }

  if (libResult.status === "fulfilled" && libResult.value.length > 0) {
    liveImages.push(...libResult.value);
  }

  const allImages = [...liveImages, ...CURATED_FALLBACK_GALLERY];
  const deduplicated = deduplicateAndRankGallery(allImages);

  const isFallback = liveImages.length === 0;
  const featuredImage = deduplicated.find((img) => img.featured) || deduplicated[0] || null;

  const categories = [
    "All",
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
