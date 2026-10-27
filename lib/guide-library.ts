import type { Guide } from "@/lib/guides";
import { guideSections } from "@/lib/guide-content";

type GuideEntry = Pick<Guide, "slug" | "title" | "description" | "publishedAt" | "updatedAt" | "category" | "tags" | "sources" | "relatedPaths">;

const entries: GuideEntry[] = [
  {
    slug: "understanding-moon-phases",
    publishedAt: "2026-10-21",
    updatedAt: "2026-10-22",
    title: "Moon Phases: Why the Moon Changes Shape",
    description: "Understand waxing, waning, quarter phases, and illumination so you can make sense of the Moon at a glance.",
    category: "Moon",
    tags: ["Moon phases", "Illumination", "Waxing", "Waning"],
    sources: [
      { label: "NASA: Moon Phases", url: "https://science.nasa.gov/moon/moon-phases/" },
      { label: "NASA: Moon Facts", url: "https://science.nasa.gov/moon/facts/" }
    ],
    relatedPaths: [{ label: "Check the Moon", href: "/moon" }, { label: "Plan your first lunar observation", href: "/guides/how-to-observe-the-moon" }]
  },
  {
    slug: "how-to-observe-the-moon",
    publishedAt: "2026-10-21",
    updatedAt: "2026-10-22",
    title: "How to Observe the Moon for the First Time",
    description: "A simple observing session for finding lunar seas, craters, and shadows with your eyes or binoculars.",
    category: "Moon",
    tags: ["Lunar observing", "Craters", "Binoculars", "Terminator"],
    sources: [
      { label: "NASA: Moon Viewing Tips", url: "https://science.nasa.gov/moon/viewing-tips/" },
      { label: "NASA: Moon Facts", url: "https://science.nasa.gov/moon/facts/" }
    ],
    relatedPaths: [{ label: "Check lunar conditions", href: "/moon" }, { label: "Understand lunar phases", href: "/guides/understanding-moon-phases" }]
  },
  {
    slug: "moonrise-moonset-and-local-time",
    publishedAt: "2026-10-21",
    updatedAt: "2026-10-22",
    title: "Moonrise, Moonset, and UTC: Reading Sky Times",
    description: "Why the Moon is not always up at night, how location changes rise times, and how to convert UTC to your clock.",
    category: "Moon",
    tags: ["Moonrise", "Moonset", "UTC", "Local time", "IST"],
    sources: [
      { label: "NASA: Skywatching FAQ", url: "https://science.nasa.gov/skywatching/faq/" },
      { label: "US Naval Observatory: Universal Time", url: "https://aa.usno.navy.mil/faq/UT" }
    ],
    relatedPaths: [{ label: "See the Moon page", href: "/moon" }, { label: "Browse space events", href: "/events" }]
  },
  {
    slug: "solar-eclipses-and-eye-safety",
    publishedAt: "2026-10-21",
    updatedAt: "2026-10-22",
    title: "Solar Eclipses: What Happens and How to Watch Safely",
    description: "Understand partial, annular, and total eclipses, with the essential distinction between solar viewers and telescope filters.",
    category: "Skywatching",
    tags: ["Solar eclipse", "Eye safety", "Totality", "Annular eclipse"],
    sources: [
      { label: "NASA: Eclipse Viewing Safety", url: "https://science.nasa.gov/eclipses/safety/" },
      { label: "NASA: Types of Solar Eclipses", url: "https://science.nasa.gov/eclipses/types/" },
      { label: "American Astronomical Society: Safe Solar Viewing and Trusted Suppliers", url: "https://eclipse.aas.org/eye-safety" },
      { label: "American Astronomical Society: Pinhole and Optical Projection", url: "https://eclipse.aas.org/eye-safety/projection" }
    ],
    relatedPaths: [{ label: "Check upcoming sky events", href: "/events" }, { label: "Learn about lunar eclipses", href: "/guides/lunar-eclipses-explained" }]
  },
  {
    slug: "lunar-eclipses-explained",
    publishedAt: "2026-10-21",
    updatedAt: "2026-10-22",
    title: "Lunar Eclipses: Why the Moon Can Turn Red",
    description: "Learn what Earth's shadow does to a full Moon and why a lunar eclipse is different from an ordinary phase.",
    category: "Moon",
    tags: ["Lunar eclipse", "Blood Moon", "Umbra", "Penumbral eclipse"],
    sources: [
      { label: "NASA: Eclipses and the Moon", url: "https://science.nasa.gov/moon/eclipses/" },
      { label: "NASA: Eclipses", url: "https://science.nasa.gov/eclipses/" }
    ],
    relatedPaths: [{ label: "Find sky events", href: "/events" }, { label: "Understand solar eclipse safety", href: "/guides/solar-eclipses-and-eye-safety" }]
  },
  {
    slug: "how-to-watch-a-meteor-shower",
    publishedAt: "2026-10-21",
    updatedAt: "2026-10-22",
    title: "How to Watch a Meteor Shower",
    description: "Plan for darkness, the radiant, Moon interference, and realistic expectations rather than headline meteor counts.",
    category: "Skywatching",
    tags: ["Meteor showers", "Radiant", "Shooting stars", "Observing"],
    sources: [
      { label: "NASA Space Place: What Is a Meteor Shower?", url: "https://spaceplace.nasa.gov/meteor-shower/en/" },
      { label: "NASA Meteoroid Environments Office: Why Ideal Meteor Rates Differ from What You See", url: "https://www.nasa.gov/blogs/watch-the-skies/2019/11/19/about-the-upcoming-maybe-alpha-monocerotid-meteor-shower-outburst/" }
    ],
    relatedPaths: [{ label: "Browse sky events", href: "/events" }, { label: "Check Moon conditions", href: "/moon" }]
  },
  {
    slug: "planets-conjunctions-and-opposition",
    publishedAt: "2026-10-21",
    updatedAt: "2026-10-22",
    title: "Planet Conjunctions and Opposition: What to Look For",
    description: "Decode close planetary pairings, the ecliptic, and opposition without mistaking a sky alignment for a physical encounter.",
    category: "Skywatching",
    tags: ["Planets", "Conjunction", "Opposition", "Ecliptic", "Planet parade"],
    sources: [
      { label: "NASA: Planetary Alignments and Planet Parades", url: "https://science.nasa.gov/solar-system/skywatching/planetary-alignments-and-planet-parades/" },
      { label: "NASA: Skywatching", url: "https://science.nasa.gov/skywatching/" }
    ],
    relatedPaths: [{ label: "Find upcoming conjunctions", href: "/events" }, { label: "Read a star chart", href: "/guides/constellations-and-star-charts" }]
  },
  {
    slug: "constellations-and-star-charts",
    publishedAt: "2026-10-21",
    updatedAt: "2026-10-22",
    title: "Constellations and Star Charts for Beginners",
    description: "Find your bearings with a few bright stars, understand asterisms, and avoid using a chart for the wrong place or season.",
    category: "Skywatching",
    tags: ["Constellations", "Star charts", "Asterisms", "Latitude"],
    sources: [
      { label: "NASA Space Place: What Are Constellations?", url: "https://spaceplace.nasa.gov/constellations/en/" },
      { label: "NASA StarChild: What Are Constellations?", url: "https://starchild.gsfc.nasa.gov/docs/StarChild/questions/question9.html" }
    ],
    relatedPaths: [{ label: "Explore sky events", href: "/events" }, { label: "Understand light pollution", href: "/guides/light-pollution-and-dark-skies" }]
  },
  {
    slug: "light-pollution-and-dark-skies",
    publishedAt: "2026-10-21",
    updatedAt: "2026-10-22",
    title: "Light Pollution: Finding a Better View of the Stars",
    description: "Understand skyglow, nearby glare, and the changes that help you observe from a city or a darker site.",
    category: "Skywatching",
    tags: ["Light pollution", "Dark skies", "Skyglow", "Urban astronomy"],
    sources: [
      { label: "US National Park Service: Light Pollution", url: "https://www.nps.gov/subjects/nightskies/lightpollution.htm" },
      { label: "US National Park Service: Outdoor Lighting Principles", url: "https://www.nps.gov/subjects/nightskies/outdoor-lighting-principles.htm" }
    ],
    relatedPaths: [{ label: "Check the Moon before observing", href: "/moon" }, { label: "Plan a meteor-shower session", href: "/guides/how-to-watch-a-meteor-shower" }]
  },
  {
    slug: "binoculars-for-stargazing",
    publishedAt: "2026-10-21",
    updatedAt: "2026-10-22",
    title: "Stargazing with Binoculars You Already Own",
    description: "Use a steady, wide-field view to explore lunar detail, star clusters, and bright targets without starting with a telescope.",
    category: "Skywatching",
    tags: ["Binoculars", "Field of view", "Observing", "Star clusters"],
    sources: [
      { label: "NASA: Binoculars - A Great First Telescope", url: "https://science.nasa.gov/solar-system/skywatching/night-sky-network/binoculars-a-great-first-telescope/" },
      { label: "NASA: Skywatching Tools", url: "https://science.nasa.gov/skywatching/" },
      { label: "NASA: Moon Viewing Tips", url: "https://science.nasa.gov/moon/viewing-tips/" }
    ],
    relatedPaths: [{ label: "Observe the Moon", href: "/guides/how-to-observe-the-moon" }, { label: "Understand telescope basics", href: "/guides/telescope-basics-aperture-and-magnification" }]
  },
  {
    slug: "telescope-basics-aperture-and-magnification",
    publishedAt: "2026-10-21",
    updatedAt: "2026-10-22",
    title: "Telescope Basics: Light Comes Before Magnification",
    description: "Understand aperture, focus, eyepieces, and a steady mount before your first telescope observing session.",
    category: "Skywatching",
    tags: ["Telescopes", "Aperture", "Magnification", "Refractor", "Reflector"],
    sources: [
      { label: "NASA Space Place: How Do Telescopes Work?", url: "https://spaceplace.nasa.gov/telescopes/en/" },
      { label: "Boston University Astronomy: Optics, Aperture, and Magnification (PDF)", url: "https://www.bu.edu/astronomy/files/2024/01/Optics_newtonian-1-16-24.pdf" },
      { label: "NASA: Skywatching Tools", url: "https://science.nasa.gov/skywatching/" }
    ],
    relatedPaths: [{ label: "Try lunar observing", href: "/guides/how-to-observe-the-moon" }, { label: "Find a current observing target", href: "/events" }]
  },
  {
    slug: "why-earth-has-seasons",
    publishedAt: "2026-10-21",
    updatedAt: "2026-10-22",
    title: "Why Earth Has Seasons, Solstices, and Equinoxes",
    description: "See how Earth's tilted axis changes daylight and why the two hemispheres have opposite seasons.",
    category: "Astronomy Basics",
    tags: ["Seasons", "Solstice", "Equinox", "Earth", "Axial tilt"],
    sources: [
      { label: "NASA Space Place: What Causes the Seasons?", url: "https://spaceplace.nasa.gov/seasons/en/" },
      { label: "US Naval Observatory: Length of Day and Night at the Equinoxes", url: "https://aa.usno.navy.mil/faq/equinoxes" }
    ],
    relatedPaths: [{ label: "Find seasonal sky events", href: "/events" }, { label: "Learn to read a star chart", href: "/guides/constellations-and-star-charts" }]
  },
  {
    slug: "auroras-and-space-weather",
    publishedAt: "2026-10-21",
    updatedAt: "2026-10-22",
    title: "Auroras and Space Weather: Why the Sky Glows",
    description: "Connect the northern and southern lights to solar activity, Earth's magnetic environment, and realistic observing forecasts.",
    category: "Space Science",
    tags: ["Aurora", "Space weather", "Solar wind", "Northern lights"],
    sources: [
      { label: "NASA: Auroras", url: "https://science.nasa.gov/sun/auroras/" },
      { label: "NOAA Space Weather Prediction Center: Aurora Tutorial and Forecasting", url: "https://www.spaceweather.gov/content/aurora-tutorial" },
      { label: "NASA: Guide to Finding and Photographing Auroras", url: "https://science.nasa.gov/feature/nasas-guide-to-finding-and-photographing-auroras/" }
    ],
    relatedPaths: [{ label: "Read space science briefs", href: "/briefs" }, { label: "Find a darker observing spot", href: "/guides/light-pollution-and-dark-skies" }]
  },
  {
    slug: "asteroids-comets-and-meteorites",
    publishedAt: "2026-10-21",
    updatedAt: "2026-10-22",
    title: "Asteroid, Comet, Meteor, or Meteorite?",
    description: "Separate the objects traveling through space from the light streaks in our atmosphere and the material that reaches the ground.",
    category: "Asteroids",
    tags: ["Asteroids", "Comets", "Meteoroids", "Meteors", "Meteorites"],
    sources: [
      { label: "NASA: Asteroids, Comets and Meteors Facts", url: "https://science.nasa.gov/asteroids-comets-meteors/facts/" },
      { label: "NASA: Meteors and Meteorites", url: "https://science.nasa.gov/solar-system/meteors-meteorites/" }
    ],
    relatedPaths: [{ label: "Understand near-Earth objects", href: "/guides/what-is-a-near-earth-object" }, { label: "Open Asteroid Watch", href: "/asteroids" }]
  },
  {
    slug: "why-comets-have-tails",
    publishedAt: "2026-10-21",
    updatedAt: "2026-10-22",
    title: "Why Comets Have Tails, and Which Way They Point",
    description: "Meet the nucleus, coma, dust tail, and ion tail, and learn why a comet's tail does not simply trail behind its motion.",
    category: "Solar System",
    tags: ["Comets", "Coma", "Dust tail", "Ion tail", "Solar wind"],
    sources: [
      { label: "NASA: Comet Facts", url: "https://science.nasa.gov/solar-system/comets/facts/" },
      { label: "NASA Space Place: What Is a Comet?", url: "https://spaceplace.nasa.gov/comets/en/" },
      { label: "NASA APOD: Comet Pons-Brooks and Opposing Tails", url: "https://science.nasa.gov/image-article/apod-2024-june-4-comet-pons-brooks-develops-opposing-tails/" }
    ],
    relatedPaths: [{ label: "Read astronomy briefs", href: "/briefs" }, { label: "Compare comets and meteors", href: "/guides/asteroids-comets-and-meteorites" }]
  },
  {
    slug: "astronomical-distances-au-and-light-years",
    publishedAt: "2026-10-21",
    updatedAt: "2026-10-22",
    title: "AU, Lunar Distance, and Light-Years Explained",
    description: "Choose the right scale for a Moon crossing, an asteroid approach, a planetary orbit, or a distant star.",
    category: "Astronomy Basics",
    tags: ["AU", "Light-year", "Lunar distance", "Distance", "Light travel time"],
    sources: [
      { label: "NASA: What Is a Light-Year?", url: "https://science.nasa.gov/exoplanets/what-is-a-light-year/" },
      { label: "Paris Observatory: IAU 2012 Resolution B2 and the Defined Astronomical Unit", url: "https://syrte.obspm.fr/IAU_resolutions/IAUResol_2012.html" },
      { label: "NASA JPL CNEOS: Close-Approach Data Notes", url: "https://cneos.jpl.nasa.gov/ca/neo_ca_info.html" }
    ],
    relatedPaths: [{ label: "Compare asteroid approach distances", href: "/asteroids" }, { label: "Understand near-Earth objects", href: "/guides/what-is-a-near-earth-object" }]
  },
  {
    slug: "how-stars-are-born-and-die",
    publishedAt: "2026-10-21",
    updatedAt: "2026-10-22",
    title: "How Stars Are Born, Shine, and Die",
    description: "Follow a star from a collapsing cloud to a long fusion-powered life and an ending shaped largely by its mass.",
    category: "Deep Space",
    tags: ["Stars", "Fusion", "Stellar evolution", "Supernova", "White dwarf"],
    sources: [
      { label: "NASA: Stars", url: "https://science.nasa.gov/universe/stars/" },
      { label: "NASA Webb: Star Lifecycle", url: "https://science.nasa.gov/mission/webb/star-lifecycle/" }
    ],
    relatedPaths: [{ label: "Explore the astronomy gallery", href: "/gallery" }, { label: "Learn about black holes", href: "/guides/black-holes-explained" }]
  },
  {
    slug: "black-holes-explained",
    publishedAt: "2026-10-21",
    updatedAt: "2026-10-22",
    title: "Black Holes: What They Are and How We Find Them",
    description: "Understand event horizons, glowing accretion disks, and the observations that reveal an object light cannot escape.",
    category: "Deep Space",
    tags: ["Black holes", "Event horizon", "Accretion", "Gravity"],
    sources: [
      { label: "NASA: Black Holes", url: "https://science.nasa.gov/universe/black-holes/" },
      { label: "NASA Webb: How Do We Know There Are Black Holes?", url: "https://science.nasa.gov/mission/webb/science-overview/science-explainers/how-do-we-know-there-are-black-holes/" }
    ],
    relatedPaths: [{ label: "Read deep-space briefs", href: "/briefs" }, { label: "Follow the life cycle of stars", href: "/guides/how-stars-are-born-and-die" }]
  },
  {
    slug: "galaxies-and-our-milky-way",
    publishedAt: "2026-10-21",
    updatedAt: "2026-10-22",
    title: "Galaxies and the Milky Way: Finding Our Place",
    description: "Distinguish a galaxy from a solar system or a nebula, and understand why our home galaxy looks like a band of light.",
    category: "Deep Space",
    tags: ["Galaxies", "Milky Way", "Nebulae", "Spiral galaxies"],
    sources: [
      { label: "NASA: Galaxies", url: "https://science.nasa.gov/universe/galaxies/" },
      { label: "NASA: What Is the Universe?", url: "https://science.nasa.gov/exoplanets/what-is-the-universe/" }
    ],
    relatedPaths: [{ label: "Explore galaxy images", href: "/gallery" }, { label: "Understand astronomical distances", href: "/guides/astronomical-distances-au-and-light-years" }]
  },
  {
    slug: "how-we-find-exoplanets",
    publishedAt: "2026-10-21",
    updatedAt: "2026-10-22",
    title: "How Astronomers Find Planets Around Other Stars",
    description: "Explore transits, stellar wobble, direct imaging, and why a planet candidate needs follow-up observations.",
    category: "Deep Space",
    tags: ["Exoplanets", "Transits", "Radial velocity", "Planet discovery"],
    sources: [
      { label: "NASA: How We Find and Characterize Exoplanets", url: "https://science.nasa.gov/exoplanets/how-we-find-and-characterize/" },
      { label: "NASA: 10 Steps to Confirm a Planet Around Another Star", url: "https://science.nasa.gov/universe/exoplanets/10-steps-to-confirm-a-planet-around-another-star/" }
    ],
    relatedPaths: [{ label: "Read discovery briefs", href: "/briefs" }, { label: "Understand habitable zones", href: "/guides/what-the-habitable-zone-means" }]
  },
  {
    slug: "what-the-habitable-zone-means",
    publishedAt: "2026-10-21",
    updatedAt: "2026-10-22",
    title: "The Habitable Zone Is Not a Promise of Life",
    description: "Understand what a planet's orbit can suggest about liquid water and what it cannot tell us about a living world.",
    category: "Space Science",
    tags: ["Habitable zone", "Exoplanets", "Liquid water", "Astrobiology"],
    sources: [
      { label: "NASA: The Habitable Zone", url: "https://science.nasa.gov/exoplanets/habitable-zone/" },
      { label: "NASA: How We Find and Characterize Exoplanets", url: "https://science.nasa.gov/exoplanets/how-we-find-and-characterize/" }
    ],
    relatedPaths: [{ label: "Learn how exoplanets are detected", href: "/guides/how-we-find-exoplanets" }, { label: "Follow astronomy discoveries", href: "/briefs" }]
  },
  {
    slug: "webb-and-hubble-compared",
    publishedAt: "2026-10-21",
    updatedAt: "2026-10-22",
    title: "Webb and Hubble: Two Different Views of Space",
    description: "Why complementary wavelengths, mirrors, and observing locations matter more than deciding which telescope wins.",
    category: "Missions",
    tags: ["JWST", "Hubble", "Infrared", "Space telescopes"],
    sources: [
      { label: "NASA: Webb FAQs", url: "https://science.nasa.gov/mission/webb/faqs-full/" },
      { label: "NASA: Hubble vs. Webb", url: "https://science.nasa.gov/mission/hubble/observatory/hubble-vs-webb/" },
      { label: "ESA/Webb: Image Comparisons", url: "https://esawebb.org/images/comparisons/" }
    ],
    relatedPaths: [{ label: "Explore observatory images", href: "/gallery" }, { label: "Read colors and captions", href: "/guides/how-to-read-space-images" }]
  },
  {
    slug: "how-to-read-space-images",
    publishedAt: "2026-10-21",
    updatedAt: "2026-10-22",
    title: "How to Read a Space Image Beyond the Colors",
    description: "Use captions, filter keys, scale bars, and credits to understand what an astronomy image actually shows.",
    category: "Astronomy Basics",
    tags: ["Space images", "Image processing", "Filters", "False color", "Gallery"],
    sources: [
      { label: "NASA: About Webb Images", url: "https://science.nasa.gov/mission/webb/multimedia/about-webb-images/" },
      { label: "NASA: Webb Image Galleries", url: "https://science.nasa.gov/mission/webb/multimedia/images/" }
    ],
    relatedPaths: [{ label: "Practice in the gallery", href: "/gallery" }, { label: "Compare Webb and Hubble", href: "/guides/webb-and-hubble-compared" }]
  },
  {
    slug: "rocket-launch-windows-and-countdowns",
    publishedAt: "2026-10-21",
    updatedAt: "2026-10-22",
    title: "Launch Windows, Holds, and Scrubs Explained",
    description: "Read a launch listing and follow a countdown without confusing a scheduled target time with a guaranteed liftoff.",
    category: "Missions",
    tags: ["Launches", "Launch windows", "Countdown", "Scrub", "UTC"],
    sources: [
      { label: "NASA: Basics of Space Flight, Chapter 14 - Launch", url: "https://science.nasa.gov/learn/basics-of-space-flight/chapter14-1/" },
      { label: "NASA: Artemis II Press Kit, Countdown Procedures", url: "https://www.nasa.gov/artemis-ii-press-kit/" }
    ],
    relatedPaths: [{ label: "See upcoming launches", href: "/events" }, { label: "Understand UTC conversion", href: "/guides/moonrise-moonset-and-local-time" }]
  },
  {
    slug: "orbits-and-lagrange-points",
    publishedAt: "2026-10-21",
    updatedAt: "2026-10-22",
    title: "Earth Orbits and Lagrange Points: Where Missions Go",
    description: "Compare low Earth, geostationary, and polar orbits, then understand why some observatories operate around L1 or L2.",
    category: "Missions",
    tags: ["Orbits", "Satellites", "LEO", "Geostationary", "Lagrange points", "L2"],
    sources: [
      { label: "ESA: Types of Orbits", url: "https://www.esa.int/Enabling_Support/Space_Transportation/Types_of_orbits" },
      { label: "ESA: What Are Lagrange Points?", url: "https://www.esa.int/Enabling_Support/Operations/What_are_Lagrange_points" }
    ],
    relatedPaths: [{ label: "Follow mission milestones", href: "/events" }, { label: "Compare Webb and Hubble", href: "/guides/webb-and-hubble-compared" }]
  },
  {
    slug: "how-to-spot-the-space-station",
    publishedAt: "2026-10-24",
    title: "How to Spot the International Space Station",
    description: "Find a visible ISS pass, know where to look, and follow the station with your eyes.",
    category: "Skywatching",
    tags: ["ISS", "International Space Station", "Satellite passes", "Elevation"],
    sources: [
      { label: "NASA: Spot the Station", url: "https://www.nasa.gov/spot-the-station/" },
      { label: "NASA: Space Station Facts and Figures", url: "https://www.nasa.gov/international-space-station/space-station-facts-and-figures/" }
    ],
    relatedPaths: [{ label: "Find your bearings with a star chart", href: "/guides/constellations-and-star-charts" }, { label: "Understand Earth orbits", href: "/guides/orbits-and-lagrange-points" }]
  },
  {
    slug: "twilight-civil-nautical-astronomical",
    publishedAt: "2026-10-24",
    title: "When Is It Dark Enough to Stargaze?",
    description: "Understand the three stages of twilight and choose a simple observing window.",
    category: "Skywatching",
    tags: ["Twilight", "Sunset", "Astronomical darkness", "Observing plans"],
    sources: [
      { label: "US Naval Observatory: Rise, Set, and Twilight Definitions", url: "https://aa.usno.navy.mil/faq/RST_defs" },
      { label: "US National Weather Service: Types of Twilight", url: "https://www.weather.gov/fsd/twilight" }
    ],
    relatedPaths: [{ label: "Plan a meteor-shower session", href: "/guides/how-to-watch-a-meteor-shower" }, { label: "Check Moon conditions", href: "/moon" }]
  },
  {
    slug: "photographing-the-night-sky-with-a-phone",
    publishedAt: "2026-10-24",
    title: "How to Photograph Stars with Your Phone",
    description: "Take a first night-sky photo with a steady phone, a clear target, and a few simple checks.",
    category: "Skywatching",
    tags: ["Astrophotography", "Smartphone", "Night mode", "Exposure", "Photography"],
    sources: [
      { label: "NASA Night Sky Network: Astrophotography with Your Smartphone", url: "https://science.nasa.gov/solar-system/skywatching/night-sky-network/astrophotography-with-your-smartphone/" },
      { label: "NASA HEAT: A Guide to Smartphone Astrophotography", url: "https://science.nasa.gov/learn/heat/resource/a-guide-to-smartphone-astrophotography/" }
    ],
    relatedPaths: [{ label: "Understand twilight", href: "/guides/twilight-civil-nautical-astronomical" }, { label: "Read astronomy image processing", href: "/guides/how-to-read-space-images" }]
  },
  {
    slug: "sky-coordinates-altitude-and-azimuth", publishedAt: "2026-10-27",
    title: "Altitude and Azimuth: Find Your Way Around the Sky",
    description: "Turn a direction and an angle into a place to look, with a worked southwest-sky example.",
    category: "Skywatching", tags: ["Altitude", "Azimuth", "Coordinates", "Horizon"],
    sources: [
      { label: "NASA JPL: Observer Coordinate FAQ", url: "https://ssd.jpl.nasa.gov/faq.html" },
      { label: "NASA JPL: Horizons Manual", url: "https://ssd.jpl.nasa.gov/horizons/manual.html" }
    ],
    relatedPaths: [{ label: "Read a star chart", href: "/guides/constellations-and-star-charts" }, { label: "Spot the ISS", href: "/guides/how-to-spot-the-space-station" }]
  },
  {
    slug: "stellar-magnitudes-and-brightness", publishedAt: "2026-10-27",
    title: "Star Magnitudes: Smaller Numbers, Brighter Stars",
    description: "Compare brightness without reversing the magnitude scale or confusing apparent and intrinsic light.",
    category: "Astronomy Basics", tags: ["Magnitude", "Brightness", "Stars", "Absolute magnitude"],
    sources: [
      { label: "NASA Chandra: Magnitudes", url: "https://wwwastro.msfc.nasa.gov/solar/chandra101/variable_stars/mag.html" },
      { label: "Las Cumbres Observatory: Absolute Magnitude", url: "https://lco.global/spacebook/distance/what-absolute-magnitude/" },
      { label: "Las Cumbres Observatory: Magnitude and Color", url: "https://lco.global/spacebook/distance/magnitude-and-color/" }
    ],
    relatedPaths: [{ label: "Find darker skies", href: "/guides/light-pollution-and-dark-skies" }, { label: "Measure stellar distance", href: "/guides/stellar-parallax-and-distance" }]
  },
  {
    slug: "earthshine-on-the-crescent-moon", publishedAt: "2026-10-27",
    title: "Earthshine: See Earth's Light on the Moon",
    description: "Understand the faint lunar disk beside a bright crescent and try a short evening observation.",
    category: "Moon", tags: ["Earthshine", "Crescent Moon", "Reflected light"],
    sources: [
      { label: "NASA Earth Observatory: Earth's Reflections on the Moon", url: "https://science.nasa.gov/earth/earth-observatory/earths-reflections-on-the-moon-153044/" },
      { label: "NASA Earth Observatory: Earthshine", url: "https://science.nasa.gov/earth/earth-observatory/earthshine-83782/" }
    ],
    relatedPaths: [{ label: "Check Moon conditions", href: "/moon" }, { label: "Understand Moon phases", href: "/guides/understanding-moon-phases" }]
  },
  {
    slug: "why-the-moon-causes-tides", publishedAt: "2026-10-27",
    title: "Why the Moon Causes Tides",
    description: "Understand tidal stretching, spring and neap tides, and why a Moon phase is not a local tide forecast.",
    category: "Moon", tags: ["Tides", "Gravity", "Spring tides", "Neap tides"],
    sources: [
      { label: "NOAA: Gravity and Tidal Bulges", url: "https://oceanservice.noaa.gov/education/tutorial_tides/tides03_gravity.html" },
      { label: "NOAA: Spring and Neap Tides", url: "https://oceanservice.noaa.gov/facts/springtide.html" },
      { label: "NOAA: The Moon and High Tide", url: "https://oceanservice.noaa.gov/facts/moon-tide.html" }
    ],
    relatedPaths: [{ label: "Learn lunar phases", href: "/guides/understanding-moon-phases" }, { label: "Explore the Moon page", href: "/moon" }]
  },
  {
    slug: "how-planetary-defense-works", publishedAt: "2026-10-27",
    title: "Planetary Defense: Finding and Deflecting Asteroids",
    description: "Follow discovery, orbit refinement, and the DART demonstration without mistaking a watch list for an impact prediction.",
    category: "Asteroids", tags: ["Planetary defense", "DART", "Sentry", "Impact probability"],
    sources: [
      { label: "NASA: Planetary Defense Explained", url: "https://science.nasa.gov/solar-system/10-things-you-should-know-about-planetary-defense/" },
      { label: "NASA JPL CNEOS: Sentry Introduction", url: "https://cneos.jpl.nasa.gov/sentry/intro.html" },
      { label: "NASA: DART", url: "https://science.nasa.gov/planetary-defense-dart/" }
    ],
    relatedPaths: [{ label: "Understand near-Earth objects", href: "/guides/what-is-a-near-earth-object" }, { label: "Open Asteroid Watch", href: "/asteroids" }]
  },
  {
    slug: "isro-science-missions-and-instruments", publishedAt: "2026-10-27",
    title: "ISRO Science Missions: What Do They Measure?",
    description: "Compare the scientific jobs of Chandrayaan-3, Aditya-L1, and AstroSat through their instruments.",
    category: "Missions", tags: ["ISRO", "Chandrayaan-3", "Aditya-L1", "AstroSat"],
    sources: [
      { label: "ISRO: Chandrayaan-3 Details", url: "https://www.isro.gov.in/ISRO_EN/Chandrayaan3_Details.html" },
      { label: "ISRO: Aditya-L1 Details", url: "https://www.isro.gov.in/Aditya_L1-MissionDetails.html" },
      { label: "ISRO: AstroSat", url: "https://www.isro.gov.in/AstroSat.html" }
    ],
    relatedPaths: [{ label: "Understand mission orbits", href: "/guides/orbits-and-lagrange-points" }, { label: "Read mission briefs", href: "/briefs" }]
  },
  {
    slug: "spectroscopy-reading-starlight", publishedAt: "2026-10-27",
    title: "Spectroscopy: Read the Information in Starlight",
    description: "Learn what spectral lines can reveal about chemistry and motion, and what one unexplained dip cannot prove.",
    category: "Space Science", tags: ["Spectroscopy", "Spectra", "Absorption", "Emission", "Doppler shift"],
    sources: [
      { label: "NASA Webb: Absorption and Emission Spectra", url: "https://science.nasa.gov/mission/webb/science-overview/science-explainers/spectroscopy-101-how-absorption-and-emission-spectra-work/" },
      { label: "NASA: Hubble Spectroscopy", url: "https://science.nasa.gov/mission/hubble/science/science-behind-the-discoveries/hubble-spectroscopy/" }
    ],
    relatedPaths: [{ label: "Read a space image", href: "/guides/how-to-read-space-images" }, { label: "Learn how exoplanets are found", href: "/guides/how-we-find-exoplanets" }]
  },
  {
    slug: "why-stars-twinkle-and-seeing", publishedAt: "2026-10-27",
    title: "Why Stars Twinkle: Seeing Versus Clear Skies",
    description: "Separate atmospheric steadiness from transparency and make better sense of a shimmering telescope view.",
    category: "Skywatching", tags: ["Twinkling", "Seeing", "Transparency", "Atmosphere"],
    sources: [
      { label: "ESO: Atmospheric Turbulence and Adaptive Optics", url: "https://www.eso.org/public/teles-instr/technology/adaptive_optics/" },
      { label: "NASA: Skywatching FAQ", url: "https://science.nasa.gov/skywatching/faq/" }
    ],
    relatedPaths: [{ label: "Understand telescope basics", href: "/guides/telescope-basics-aperture-and-magnification" }, { label: "Compare star brightness", href: "/guides/stellar-magnitudes-and-brightness" }]
  },
  {
    slug: "stellar-parallax-and-distance", publishedAt: "2026-10-27",
    title: "Stellar Parallax: Measuring Distance with Geometry",
    description: "Try an eye-to-eye demonstration, then work through an arcsecond-to-parsec example without the factor-of-two trap.",
    category: "Astronomy Basics", tags: ["Parallax", "Parsecs", "Distance", "Arcseconds"],
    sources: [
      { label: "Las Cumbres Observatory: Stellar Parallax", url: "https://lco.global/spacebook/distance/parallax-and-distance-measurement/" },
      { label: "Las Cumbres Observatory: Absolute Magnitude", url: "https://lco.global/spacebook/distance/what-absolute-magnitude/" },
      { label: "Gaia Collaboration: Using Gaia Parallaxes", url: "https://doi.org/10.1051/0004-6361/201832964" }
    ],
    relatedPaths: [{ label: "Understand astronomical distances", href: "/guides/astronomical-distances-au-and-light-years" }, { label: "Read the magnitude scale", href: "/guides/stellar-magnitudes-and-brightness" }]
  },
  {
    slug: "open-and-globular-star-clusters", publishedAt: "2026-10-27",
    title: "Open and Globular Clusters: Two Stellar Families",
    description: "Tell a real stellar group from a sky pattern and choose a sensible first cluster observation.",
    category: "Deep Space", tags: ["Star clusters", "Open clusters", "Globular clusters", "Pleiades"],
    sources: [
      { label: "NASA Hubble: Star Clusters", url: "https://science.nasa.gov/mission/hubble/science/universe-uncovered/hubble-star-clusters/" },
      { label: "NASA Hubble: Open Clusters as Stellar Laboratories", url: "https://science.nasa.gov/missions/hubble/gemstones-in-the-southern-sky/" }
    ],
    relatedPaths: [{ label: "Use binoculars for stargazing", href: "/guides/binoculars-for-stargazing" }, { label: "Follow stellar life cycles", href: "/guides/how-stars-are-born-and-die" }]
  },
  {
    slug: "observing-jupiter-and-its-moons", publishedAt: "2026-10-27",
    title: "Jupiter and Its Moons: Your First Observation",
    description: "Find the giant planet, sketch its four bright moons, and understand why they do not always appear together.",
    category: "Solar System", tags: ["Jupiter", "Galilean moons", "Io", "Europa", "Observing"],
    sources: [
      { label: "NASA: Jupiter Facts", url: "https://science.nasa.gov/jupiter/jupiter-facts/" },
      { label: "NASA: Jupiter's Moons", url: "https://science.nasa.gov/jupiter/jupiter-moons/" }
    ],
    relatedPaths: [{ label: "Check upcoming sky events", href: "/events" }, { label: "Understand opposition", href: "/guides/planets-conjunctions-and-opposition" }]
  },
  {
    slug: "saturn-rings-and-changing-views", publishedAt: "2026-10-27",
    title: "Saturn's Rings: Why the View Keeps Changing",
    description: "Learn what the rings are made of and why a familiar ringed planet can look surprisingly thin.",
    category: "Solar System", tags: ["Saturn", "Rings", "Ring plane", "Telescope observing"],
    sources: [
      { label: "NASA: Saturn Facts", url: "https://science.nasa.gov/saturn/facts/" },
      { label: "NASA Space Place: Saturn", url: "https://spaceplace.nasa.gov/all-about-saturn/en/" }
    ],
    relatedPaths: [{ label: "Check telescope fundamentals", href: "/guides/telescope-basics-aperture-and-magnification" }, { label: "Understand atmospheric seeing", href: "/guides/why-stars-twinkle-and-seeing" }]
  },
  {
    slug: "venus-morning-evening-star-and-phases", publishedAt: "2026-10-27",
    title: "Venus: Morning Star, Evening Star, and Crescent",
    description: "Explain Venus's changing place in twilight and why a thin crescent need not be faint.",
    category: "Solar System", tags: ["Venus", "Morning star", "Evening star", "Phases", "Elongation"],
    sources: [
      { label: "NASA: Venus Facts", url: "https://science.nasa.gov/venus/venus-facts/" },
      { label: "NASA: Venus Overview", url: "https://science.nasa.gov/venus/" }
    ],
    relatedPaths: [{ label: "Choose an observing time", href: "/guides/twilight-civil-nautical-astronomical" }, { label: "Understand apparent alignments", href: "/guides/planets-conjunctions-and-opposition" }]
  },
  {
    slug: "mars-red-color-and-observing", publishedAt: "2026-10-27",
    title: "Mars: Why It Is Red and When Detail Is Visible",
    description: "Connect rusty dust to the planet's color and set realistic expectations for a small telescope.",
    category: "Solar System", tags: ["Mars", "Red planet", "Iron oxide", "Dust storms", "Opposition"],
    sources: [
      { label: "NASA: Mars Facts", url: "https://science.nasa.gov/mars/facts/" },
      { label: "NASA Space Place: Mars", url: "https://spaceplace.nasa.gov/all-about-mars/en/" }
    ],
    relatedPaths: [{ label: "Learn about opposition", href: "/guides/planets-conjunctions-and-opposition" }, { label: "Read the limits of magnification", href: "/guides/telescope-basics-aperture-and-magnification" }]
  },
  {
    slug: "gravity-assists-and-spacecraft-flybys", publishedAt: "2026-10-27",
    title: "Gravity Assists: Why Spacecraft Take the Long Way",
    description: "Understand a planetary flyby's energy exchange and why a detour can make a mission possible.",
    category: "Missions", tags: ["Gravity assist", "Flybys", "Trajectories", "Orbital energy"],
    sources: [
      { label: "ESA: Let Gravity Assist You", url: "https://www.esa.int/Science_Exploration/Space_Science/Exploring_space/Let_gravity_assist_you" },
      { label: "NASA: Basics of Space Flight, Trajectories", url: "https://science.nasa.gov/learn/basics-of-space-flight/chapter4-1/" }
    ],
    relatedPaths: [{ label: "Understand orbits", href: "/guides/orbits-and-lagrange-points" }, { label: "Read launch schedules", href: "/guides/rocket-launch-windows-and-countdowns" }]
  },
  {
    slug: "deep-space-communication-and-light-delay", publishedAt: "2026-10-27",
    title: "Talking to Spacecraft: Signals, Antennas, and Delay",
    description: "Follow a command through the Deep Space Network and calculate a simple round-trip light delay.",
    category: "Missions", tags: ["Deep Space Network", "Radio", "Light travel time", "Telemetry"],
    sources: [
      { label: "NASA: Deep Space Network", url: "https://www.nasa.gov/communicating-with-missions/dsn/" },
      { label: "NASA: Basics of Space Flight, Deep Space Network", url: "https://science.nasa.gov/learn/basics-of-space-flight/chapter18-1/" },
      { label: "NASA: Delay/Disruption Tolerant Networking", url: "https://www.nasa.gov/communicating-with-missions/delay-disruption-tolerant-networking/" }
    ],
    relatedPaths: [{ label: "Learn light-travel distances", href: "/guides/astronomical-distances-au-and-light-years" }, { label: "Follow mission events", href: "/events" }]
  },
  {
    slug: "why-astronauts-float-in-microgravity", publishedAt: "2026-10-27",
    title: "Why Astronauts Float When Gravity Is Still There",
    description: "Understand free fall, the difference between mass and apparent weight, and microgravity experiments.",
    category: "Space Science", tags: ["Microgravity", "Free fall", "Astronauts", "Weightlessness", "Mass"],
    sources: [
      { label: "NASA Glenn: What Is Microgravity?", url: "https://www.nasa.gov/centers-and-facilities/glenn/what-is-microgravity/" },
      { label: "NASA: Microgravity for Students", url: "https://www.nasa.gov/learning-resources/for-kids-and-students/what-is-microgravity-grades-5-8/" }
    ],
    relatedPaths: [{ label: "Explore orbital motion", href: "/guides/orbits-and-lagrange-points" }, { label: "Spot an orbiting station", href: "/guides/how-to-spot-the-space-station" }]
  },
  {
    slug: "solar-flares-versus-coronal-mass-ejections", publishedAt: "2026-10-27",
    title: "Solar Flares and CMEs Are Not the Same Thing",
    description: "Separate radiation, moving plasma, and geomagnetic effects before reading a space-weather alert.",
    category: "Space Science", tags: ["Solar flares", "CME", "Space weather", "Radio blackouts", "Geomagnetic storms"],
    sources: [
      { label: "NOAA SWPC: Solar Flares", url: "https://www.spaceweather.gov/phenomena/solar-flares-radio-blackouts" },
      { label: "NOAA SWPC: Coronal Mass Ejections", url: "https://www.spaceweather.gov/phenomena/coronal-mass-ejections" }
    ],
    relatedPaths: [{ label: "Understand auroras", href: "/guides/auroras-and-space-weather" }, { label: "Read solar science briefs", href: "/briefs" }]
  },
  {
    slug: "moon-illusion-and-supermoons", publishedAt: "2026-10-27",
    title: "Huge Horizon Moon or Supermoon? Tell the Difference",
    description: "Separate a visual illusion from a genuine size change and try a repeatable camera comparison.",
    category: "Moon", tags: ["Moon illusion", "Supermoon", "Perigee", "Angular size"],
    sources: [
      { label: "NASA: The Moon Illusion", url: "https://science.nasa.gov/solar-system/moon/the-moon-illusion-why-does-the-moon-look-so-big-sometimes/" },
      { label: "NASA JPL: What Is a Supermoon?", url: "https://www.jpl.nasa.gov/edu/resources/teachable-moment/whats-a-supermoon-and-just-how-super-is-it/" }
    ],
    relatedPaths: [{ label: "Observe the Moon", href: "/guides/how-to-observe-the-moon" }, { label: "Check lunar conditions", href: "/moon" }]
  },
  {
    slug: "planetary-nebulae-not-planets", publishedAt: "2026-10-27",
    title: "Planetary Nebulae: Beautiful Shells, Not Planets",
    description: "Follow a Sun-like star's glowing outer layers and learn how to read a nebula image without confusing stellar endings.",
    category: "Deep Space", tags: ["Planetary nebula", "White dwarf", "Ionization", "Stellar evolution"],
    sources: [
      { label: "ESA/Hubble: Planetary Nebula", url: "https://esahubble.org/wordbank/planetary-nebula/" },
      { label: "ESA/Hubble: Stars Going Out in Style", url: "https://esahubble.org/announcements/ann0710/" }
    ],
    relatedPaths: [{ label: "Understand stellar life cycles", href: "/guides/how-stars-are-born-and-die" }, { label: "Read image colors", href: "/guides/how-to-read-space-images" }]
  }
];

export const astronomyGuides: Guide[] = entries.map((entry) => {
  const sections = guideSections[entry.slug];
  const words = sections.flatMap((section) => [
    section.heading,
    ...section.paragraphs,
    ...(section.list?.items ?? []),
    ...(section.table ? [section.table.caption, ...section.table.columns, ...section.table.rows.flat()] : [])
  ]).join(" ").split(/\s+/).length;

  return {
    ...entry,
    sections,
    author: "Astroboat",
    aiAssisted: true,
    readingMinutes: Math.max(1, Math.ceil(words / 200)),
    showTableOfContents: true,
    status: "published"
  };
});
