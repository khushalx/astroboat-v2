import { GALLERY_REVALIDATE_SECONDS, NASA_APOD_API_URL, NASA_IMAGE_LIBRARY_API_BASE } from "@/lib/constants";
import type { GalleryCategory, GalleryImage, GalleryResult, GallerySource } from "@/lib/types";

// Comprehensive negative pattern for non-space, people, portraits, press events, and administrative imagery
export const REJECTED_CONTENT_PATTERN =
  /\b(person|people|portrait|portraits|headshot|selfie|standing|sitting|smiles|smiling|handshake|speaks|speaking|speaker|speakers|podium|speech|speeches|talk|talks|interview|interviews|administrator|director|directors|manager|managers|engineer|engineers|technician|technicians|worker|workers|crew member|crew members|crew portrait|astronaut portrait|official portrait|team photo|group photo|panelist|panelists|audience|audiences|crowd|crowds|spectator|spectators|visitor|visitors|student|students|children|child|kid|kids|family|families|classroom|school|schools|tour|tours|intern|interns|internship|fellow|fellows|honoree|honorees|recipient|recipients|retiree|retirees|hall of fame|signing ceremony|press conference|media briefing|news briefing|town hall|keynote|celebration|reception|symposium|meeting|meetings|briefing|briefings|conference|conferences|gathering|gatherings|discussion|roundtable|workshop|workshops|logo|logos|patch|patches|emblem|emblems|insignia|poster|posters|flyer|flyers|diagram|diagrams|schematic|schematics|infographic|infographics|flowchart|flowcharts|chart|charts|graph|graphs|table|tables|slide|slides|presentation|certificate|certificates|award|awards|trophy|trophies|coin|coins|stamp|stamps|pin|pins|badge|badges|mockup|mockups|model of|miniature|scale model|toy|toys|cake|exhibit|booth|hallway|lobby|auditorium|conference room|office|desk|building exterior|building interior|headquarters|facility exterior|gate|road|roads|fence|parking lot|bus|van|truck|crane|forklift|scaffolding|clean room|cleanroom|fabrication|machining|welding|assembly line|inspection|installing|installation|testing in chamber|lifted into|transporting|rollout onto|unloading|shipping container|crate|crates|screenshot|screengrab|document|paper|report|whitepaper|book cover|magazine|newspaper|receipt|memo|history of|commemoration|anniversary of|commemorative)\b/i;

// Strong positive astronomy and space-exploration signals
export const POSITIVE_SPACE_SIGNALS =
  /\b(galaxy|galaxies|spiral galaxy|elliptical galaxy|barred spiral|andromeda|milky way|sombrero galaxy|cartwheel galaxy|whirlpool galaxy|pinwheel galaxy|deep field|hubble ultra deep|smacs 0723|stephan'?s quintet|ngc\s*\d+|messier\s*\d+|m\d+|ic\s*\d+|nebula|nebulae|planetary nebula|emission nebula|reflection nebula|dark nebula|supernova remnant|crab nebula|eagle nebula|carina nebula|orion nebula|pillars of creation|ring nebula|veil nebula|tarantula nebula|helix nebula|horsehead nebula|bubble nebula|star cluster|globular cluster|open cluster|pleiades|protostar|binary star|red giant|white dwarf|pulsar|magnetar|black hole|event horizon|gravitational lens|jupiter|saturn|mars|venus|mercury|uranus|neptune|pluto|titan|europa|io|ganymede|enceladus|callisto|ceres|gas giant|rings of saturn|great red spot|jovian|martian|olympus mons|valles marineris|jezero crater|gale crater|lunar surface|moon crater|tycho crater|mare |apollo landing|lunar horizon|earthrise|earth from orbit|earth from space|blue marble|aurora australis|aurora borealis|atmospheric limb|the sun|solar flare|coronal loop|coronal mass ejection|prominence|sunspot|solar dynamics observatory|rocket launch|liftoff|night launch|launch pad|pad 39a|spacecraft in orbit|space station|international space station|iss cupola|satellite in orbit|hubble space telescope|james webb space telescope|jwst|chandra x-ray|spitzer|voyager|cassini|juno spacecraft|perseverance rover|curiosity rover|rosetta|solar orbiter)\b/i;

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
  },
  {
    id: "jwst-phantom-galaxy-m74",
    title: "The Phantom Galaxy — Messier 74 in Mid-Infrared",
    description:
      "A grand design spiral galaxy showcasing Webb's MIRI instrument penetrating through interstellar dust lanes to map glowing polycyclic aromatic hydrocarbon filaments.",
    imageUrl: "https://images-assets.nasa.gov/image/PIA25440/PIA25440~large.jpg",
    thumbnailUrl: "https://images-assets.nasa.gov/image/PIA25440/PIA25440~medium.jpg",
    hdImageUrl: "https://images-assets.nasa.gov/image/PIA25440/PIA25440~orig.jpg",
    source: "ESA / Webb",
    sourceUrl: "https://webbtelescope.org/contents/media/images/2022/046/01GAE845KGB5W3550M9QJ1QJ7N",
    credit: "ESA/Webb, NASA & CSA, J. Lee and the PHANGS-JWST Team",
    date: "2022-08-29",
    category: "Galaxies",
    objectName: "Messier 74 (NGC 628)",
    observatory: "James Webb Space Telescope (MIRI)",
    distance: "32 million light-years",
    aspectRatio: 1.0,
    isFallback: true
  },
  {
    id: "hubble-whirlpool-galaxy-m51",
    title: "The Whirlpool Galaxy — Messier 51",
    description:
      "The graceful, curving arms of the majestic spiral galaxy NGC 5194 colliding and gravitationally interacting with its smaller companion NGC 5195.",
    imageUrl: "https://images-assets.nasa.gov/image/PIA04223/PIA04223~large.jpg",
    thumbnailUrl: "https://images-assets.nasa.gov/image/PIA04223/PIA04223~medium.jpg",
    hdImageUrl: "https://images-assets.nasa.gov/image/PIA04223/PIA04223~orig.jpg",
    source: "Hubble",
    sourceUrl: "https://photojournal.jpl.nasa.gov/catalog/PIA04223",
    credit: "NASA, ESA, S. Beckwith (STScI), and The Hubble Heritage Team (STScI/AURA)",
    date: "2005-04-25",
    category: "Galaxies",
    objectName: "Messier 51 (NGC 5194)",
    observatory: "Hubble Space Telescope (ACS)",
    distance: "23 million light-years",
    aspectRatio: 1.25,
    isFallback: true
  },
  {
    id: "hubble-pleiades-seven-sisters",
    title: "Reflection Nebula in the Pleiades Star Cluster",
    description:
      "Wispy filaments of interstellar dust passing close to star Merope in the Pleiades (Seven Sisters), reflecting brilliant blue light from the hot young stars.",
    imageUrl: "https://images-assets.nasa.gov/image/PIA02298/PIA02298~large.jpg",
    thumbnailUrl: "https://images-assets.nasa.gov/image/PIA02298/PIA02298~medium.jpg",
    hdImageUrl: "https://images-assets.nasa.gov/image/PIA02298/PIA02298~orig.jpg",
    source: "Hubble",
    sourceUrl: "https://photojournal.jpl.nasa.gov/catalog/PIA02298",
    credit: "NASA and The Hubble Heritage Team (STScI/AURA)",
    date: "2000-12-06",
    category: "Stars",
    objectName: "Messier 45 (The Pleiades)",
    observatory: "Hubble Space Telescope (WFPC2)",
    distance: "444 light-years",
    aspectRatio: 1.0,
    isFallback: true
  },
  {
    id: "artemis-orion-earth-moon-voyage",
    title: "Orion Spacecraft Captures Earth and Moon",
    description:
      "Taken from a camera mounted on the Orion spacecraft's solar array wing on flight day 20 of the uncrewed Artemis I mission, capturing Earth and the Moon together in deep space.",
    imageUrl: "https://images-assets.nasa.gov/image/art001e002047/art001e002047~large.jpg",
    thumbnailUrl: "https://images-assets.nasa.gov/image/art001e002047/art001e002047~medium.jpg",
    hdImageUrl: "https://images-assets.nasa.gov/image/art001e002047/art001e002047~orig.jpg",
    source: "NASA Image Library",
    sourceUrl: "https://images.nasa.gov/details/art001e002047",
    credit: "NASA / Artemis I Mission",
    date: "2022-12-05",
    category: "Missions",
    objectName: "Orion Spacecraft & Cislunar Space",
    observatory: "Artemis I Optical Navigation Camera",
    distance: "432,210 km from Earth",
    aspectRatio: 1.5,
    isFallback: true
  },
  {
    id: "apollo17-blue-marble",
    title: "The Blue Marble — Earth from Apollo 17",
    description:
      "One of the most famous photographs in human history, capturing the fully illuminated Earth from a distance of about 29,000 kilometers as Apollo 17 traveled to the Moon.",
    imageUrl: "https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000496/GSFC_20171208_Archive_e000496~large.jpg",
    thumbnailUrl: "https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000496/GSFC_20171208_Archive_e000496~medium.jpg",
    hdImageUrl: "https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000496/GSFC_20171208_Archive_e000496~orig.jpg",
    source: "NASA Image Library",
    sourceUrl: "https://images.nasa.gov/details/GSFC_20171208_Archive_e000496",
    credit: "NASA / Apollo 17 Crew",
    date: "1972-12-07",
    category: "Earth",
    objectName: "Planet Earth",
    observatory: "Hasselblad 500EL (70mm Zeiss lens)",
    distance: "29,000 km",
    aspectRatio: 1.0,
    isFallback: true
  },
  {
    id: "hubble-westerlund-2-star-cluster",
    title: "Westerlund 2 Star Cluster in Gum 29",
    description:
      "Hubble’s 25th anniversary image featuring a brilliant tapestry of roughly 3,000 young stars in the giant star-forming region Gum 29 in the constellation Carina.",
    imageUrl: "https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000742/GSFC_20171208_Archive_e000742~large.jpg",
    thumbnailUrl: "https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000742/GSFC_20171208_Archive_e000742~medium.jpg",
    hdImageUrl: "https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000742/GSFC_20171208_Archive_e000742~orig.jpg",
    source: "Hubble",
    sourceUrl: "https://images.nasa.gov/details/GSFC_20171208_Archive_e000742",
    credit: "NASA, ESA, the Hubble Heritage Team (STScI/AURA), A. Nota, and the Westerlund 2 Science Team",
    date: "2015-04-23",
    category: "Stars",
    objectName: "Westerlund 2 (Gum 29)",
    observatory: "Hubble Space Telescope (WFC3 & ACS)",
    distance: "20,000 light-years",
    aspectRatio: 1.25,
    isFallback: true
  },
  {
    id: "artemis-sls-liftoff-pad-39b",
    title: "Artemis I SLS Moon Rocket Night Liftoff",
    description:
      "NASA's Space Launch System rocket, carrying the Orion spacecraft, roars into the night sky from Launch Pad 39B at Kennedy Space Center on its maiden lunar voyage.",
    imageUrl: "https://images-assets.nasa.gov/image/KSC-20221116-PH-ILW01_0008/KSC-20221116-PH-ILW01_0008~large.jpg",
    thumbnailUrl: "https://images-assets.nasa.gov/image/KSC-20221116-PH-ILW01_0008/KSC-20221116-PH-ILW01_0008~medium.jpg",
    hdImageUrl: "https://images-assets.nasa.gov/image/KSC-20221116-PH-ILW01_0008/KSC-20221116-PH-ILW01_0008~orig.jpg",
    source: "NASA Image Library",
    sourceUrl: "https://images.nasa.gov/details/KSC-20221116-PH-ILW01_0008",
    credit: "NASA / Joel Kowsky",
    date: "2022-11-16",
    category: "Missions",
    objectName: "Space Launch System (SLS) & Orion",
    observatory: "Kennedy Space Center Pad 39B",
    aspectRatio: 1.5,
    isFallback: true
  },
  {
    id: "jwst-southern-ring-nebula",
    title: "Southern Ring Nebula — NGC 3132 in Infrared",
    description:
      "Webb’s infrared vision reveals the intricate expanding shells of gas and dust ejected by a dying binary star system in the Southern Ring planetary nebula.",
    imageUrl: "https://images-assets.nasa.gov/image/southern_ring_nebula/southern_ring_nebula~large.jpg",
    thumbnailUrl: "https://images-assets.nasa.gov/image/southern_ring_nebula/southern_ring_nebula~medium.jpg",
    hdImageUrl: "https://images-assets.nasa.gov/image/southern_ring_nebula/southern_ring_nebula~orig.jpg",
    source: "ESA / Webb",
    sourceUrl: "https://webbtelescope.org/contents/media/images/2022/033/01G70BGTTF89PNT6W5NDMD1S68",
    credit: "NASA, ESA, CSA, STScI",
    date: "2022-07-12",
    category: "Nebulae",
    objectName: "NGC 3132",
    observatory: "James Webb Space Telescope (NIRCam & MIRI)",
    distance: "2,500 light-years",
    aspectRatio: 1.0,
    isFallback: true
  },
  {
    id: "iss-night-earth-city-lights",
    title: "Earth Atmospheric Limb and Aurora from ISS",
    description:
      "Photographed from the International Space Station, Earth’s curved atmospheric limb glows with green airglow as night lights trace geography across the planet below.",
    imageUrl: "https://images-assets.nasa.gov/image/iss039e005387/iss039e005387~large.jpg",
    thumbnailUrl: "https://images-assets.nasa.gov/image/iss039e005387/iss039e005387~medium.jpg",
    hdImageUrl: "https://images-assets.nasa.gov/image/iss039e005387/iss039e005387~orig.jpg",
    source: "NASA Image Library",
    sourceUrl: "https://images.nasa.gov/details/iss039e005387",
    credit: "NASA / ISS Expedition 39 Crew",
    date: "2014-04-02",
    category: "Earth",
    objectName: "Earth's Atmospheric Limb",
    observatory: "International Space Station (Low Earth Orbit)",
    distance: "415 km altitude",
    aspectRatio: 1.5,
    isFallback: true
  }
];

export const RAW_CODE_TITLE_REGEX =
  /^([A-Z]{2,6}[-_]?[0-9a-z]{4,}[\w-]*|\d{4}[-_]\w+|DSC_\d+|IMG_\d+|PIA\d+|NHQ\d+|KSC\w+|JSC\w+|MSFC\w+|GSFC\w+|ARC\w+|GRC\w+)$/i;

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

  const combined = `${candidate.title} ${candidate.description} ${(candidate.keywords || []).join(" ")} ${candidate.credit || ""} ${candidate.observatory || ""}`;

  // 1. Hard Rejection Checks
  if (containsRejectedKeywords(combined)) {
    reasons.push("Matches excluded keyword (person/portrait/press/event/cleanroom/diagram)");
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
  } else if (hasPositiveSpaceSignals(combined)) {
    score += 15;
    reasons.push("Astronomy subject in metadata");
  } else {
    // If neither title nor metadata contains positive space signals, it's not a gallery candidate
    score -= 30;
    reasons.push("Lacks recognized space/astronomy signals");
  }

  // 3. High-Value Scientific Observatories / Instruments
  if (/(james webb|jwst|hubble|hst|chandra|spitzer|juno|cassini|perseverance|curiosity|solar dynamics observatory|sdo|soho|lroc|iss cupola|vlt|alma)/i.test(combined)) {
    score += 15;
    reasons.push("Reputable scientific observatory or space mission instrument");
  }

  // 4. Reputable Scientific Centers & Archives
  if (/(stsci|jpl-caltech|jpl|goddard|esa\/webb|esa\/hubble|cxc|eso|nasa)/i.test(candidate.credit || combined)) {
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
  title = title.replace(/\s*\([^)]*(NIRCam|WFC3|ACS|MIRI|Composite|Artist|Illustration)[^)]*\)/gi, "");
  title = title.replace(/^NASA's\s+/i, "");
  title = title.replace(/^Hubble\s+Sees\s+(a\s+)?/i, "");
  title = title.replace(/^Webb\s+Captures\s+(a\s+)?/i, "");
  title = title.replace(/^Webb\s+Images\s+(a\s+)?/i, "");
  title = title.replace(/^Hubble\s+Images\s+(a\s+)?/i, "");
  return title.trim() || rawTitle;
}

export function detectCategory(title: string, keywords: string[] = [], description: string = ""): GalleryCategory {
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

async function fetchNasaApodImages(): Promise<GalleryImage[]> {
  const apiKey = process.env.NASA_API_KEY || "DEMO_KEY";
  const url = `${NASA_APOD_API_URL}?api_key=${encodeURIComponent(apiKey)}&count=30`;

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
        imageUrl: imageUrl.replace(/^http:\/\//i, "https://"),
        thumbnailUrl: thumbnailUrl.replace(/^http:\/\//i, "https://"),
        hdImageUrl: item.hdurl ? item.hdurl.replace(/^http:\/\//i, "https://") : undefined,
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

    return results;
  } catch (error) {
    console.warn("NASA APOD fetch failed:", error);
    return [];
  }
}

async function fetchNasaImageLibraryQueries(): Promise<GalleryImage[]> {
  // Tightly targeted astronomy and space-flight queries focused strictly on cosmic photography
  const curatedQueries = [
    { q: "James Webb Space Telescope NIRCam galaxy nebula", source: "ESA / Webb" as const },
    { q: "Hubble Space Telescope galaxy spiral cluster nebula", source: "Hubble" as const },
    { q: "JPL Cassini Saturn rings atmosphere", source: "NASA Image Library" as const },
    { q: "JPL Juno Jupiter Great Red Spot perijove", source: "NASA Image Library" as const },
    { q: "Solar Dynamics Observatory AIA coronal flare Sun", source: "NASA Image Library" as const },
    { q: "ISS Earth observation atmospheric limb aurora night", source: "NASA Image Library" as const },
    { q: "Chandra X-ray Observatory supernova remnant", source: "Observatory Archive" as const },
    { q: "Perseverance Mastcam-Z Mars panorama crater", source: "NASA Image Library" as const },
    { q: "Lunar Reconnaissance Orbiter LROC Moon crater", source: "NASA Image Library" as const },
    { q: "rocket liftoff night launch pad space", source: "NASA Image Library" as const }
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
        const credit = itemData.secondary_creator || (itemData.center ? `NASA / ${itemData.center}` : "NASA");

        if (!title || !nasaId) continue;

        const encodedId = encodeURIComponent(nasaId);
        const baseUrl = `https://images-assets.nasa.gov/image/${encodedId}/${encodedId}`;
        const imageUrl = `${baseUrl}~large.jpg`;
        const thumbnailUrl = `${baseUrl}~medium.jpg`;
        const hdImageUrl = `${baseUrl}~orig.jpg`;

        // Apply strict space and exclusion filtering
        if (!isRelevantSpaceImage(title, description, imageUrl, keywords, credit)) {
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
  const scoredImages: Array<{ image: GalleryImage; score: number }> = [];

  for (const img of images) {
    if (!img || !img.id || !img.imageUrl) continue;

    if (seenIds.has(img.id)) continue;

    const titleKey = img.title
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "")
      .slice(0, 24);

    if (titleKey.length > 5 && seenTitles.has(titleKey)) continue;

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

    scoredImages.push({ image: img, score: scoreResult.score });
  }

  // Sort by featured priority, then highest quality/relevance score, then recency
  scoredImages.sort((a, b) => {
    if (a.image.featured && !b.image.featured) return -1;
    if (!a.image.featured && b.image.featured) return 1;
    if (b.score !== a.score) return b.score - a.score;
    return new Date(b.image.date).getTime() - new Date(a.image.date).getTime();
  });

  return scoredImages.map((item) => item.image);
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
