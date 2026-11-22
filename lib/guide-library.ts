import type { Guide } from "@/lib/guides";
import { guideSections } from "@/lib/guide-content";

type GuideEntry = Pick<Guide, "slug" | "title" | "description" | "publishedAt" | "updatedAt" | "category" | "tags" | "sources" | "relatedPaths">;

const entries: GuideEntry[] = [
  {
    slug: "what-does-space-smell-like", publishedAt: "2026-11-22",
    title: "What Does Space Smell Like?",
    description: "Astronauts report a metallic smell after spacewalks, but they are not sniffing a vacuum. Explore what they actually smell and what remains uncertain.",
    category: "Space Science", tags: ["Smell of space", "Spacewalks", "Astronauts", "Spacecraft air"],
    sources: [
      { label: "Canadian Space Agency: Astronaut questions and the smell of space", url: "https://www.csa-asc.gc.ca/eng/astronauts/faq.asp" },
      { label: "ANU astrophysicist Brad Tucker: What does space smell like?", url: "https://reporter.anu.edu.au/all-stories/what-does-space-smell-like" },
      { label: "NASA White Sands: Odor evaluation for spacecraft", url: "https://www.nasa.gov/centers-and-facilities/white-sands/odor-evaluation/" }
    ],
    relatedPaths: [
      { label: "Can sound travel through space?", href: "/guides/can-sound-travel-through-space" },
      { label: "Why astronauts become taller", href: "/guides/why-do-astronauts-grow-taller-in-space" },
      { label: "Why a vacuum does not have a simple temperature", href: "/guides/why-is-space-cold" }
    ]
  },
  {
    slug: "can-you-see-apollo-landing-sites-from-earth", publishedAt: "2026-11-22",
    title: "Can You See the Apollo Landing Sites From Earth?",
    description: "You can locate the Apollo landing regions, but not resolve their flags from Earth. Learn why magnification is not enough and how lunar orbiters see them.",
    category: "Moon", tags: ["Apollo landing sites", "Telescope resolution", "Hubble", "Lunar Reconnaissance Orbiter"],
    sources: [
      { label: "ESA/Hubble: Apollo landing sites and resolution limits", url: "https://esahubble.org/about/faq/" },
      { label: "NASA: Hubble optics and visible-light resolution", url: "https://science.nasa.gov/mission/hubble/observatory/design/optics/" },
      { label: "NASA SVS: Revisiting Apollo landing sites", url: "https://svs.gsfc.nasa.gov/31052/" }
    ],
    relatedPaths: [
      { label: "Plan your first lunar observation", href: "/guides/how-to-observe-the-moon" },
      { label: "How telescope field of view works", href: "/guides/telescope-field-of-view" },
      { label: "Read real space images carefully", href: "/guides/how-to-read-space-images" },
      { label: "Explore the lunar observatory", href: "/moon" }
    ]
  },
  {
    slug: "what-if-the-sun-disappeared", publishedAt: "2026-11-22",
    title: "What Would Happen If the Sun Suddenly Disappeared?",
    description: "Would Earth notice darkness or lost gravity first? Use a clearly hypothetical disappearing Sun to understand light-travel time, gravity, and orbital motion.",
    category: "Astronomy Basics", tags: ["Sun", "Speed of gravity", "Light-travel time", "Orbits"],
    sources: [
      { label: "NASA JPL GRACE-FO: Gravity and the disappearing-Sun thought experiment", url: "https://gracefo.jpl.nasa.gov/news/5/what-is-gravity/" },
      { label: "NASA Cosmicopia: How fast gravitational changes travel", url: "https://science.gsfc.nasa.gov/attic/cosmicopia.gsfc.nasa.gov/qa_sp_gr.html" },
      { label: "NASA: Sun facts and stellar evolution", url: "https://science.nasa.gov/sun/facts/" }
    ],
    relatedPaths: [
      { label: "Why Earth does not fall into the Sun", href: "/guides/why-doesnt-earth-fall-into-the-sun" },
      { label: "Why light cannot be outrun", href: "/guides/why-cant-we-travel-faster-than-light" },
      { label: "The much slower journey inside the Sun", href: "/guides/how-long-does-sunlight-take-to-escape-the-sun" }
    ]
  },
  {
    slug: "can-moons-have-moons", publishedAt: "2026-11-22",
    title: "Can Moons Have Moons? Submoons Explained",
    description: "A moon can theoretically host a smaller moon, but stable orbits are difficult. Explore submoons, tidal limits, and why a possible orbit is not a discovery.",
    category: "Moon", tags: ["Submoons", "Moonmoons", "Orbital stability", "Tides"],
    sources: [
      { label: "Kollmeier and Raymond: Can Moons Have Moons?", url: "https://arxiv.org/abs/1810.03304" },
      { label: "Carnegie Science: Where is Earth's submoon?", url: "https://carnegiescience.edu/news/where-earths-submoon" },
      { label: "Rosario-Franco and colleagues: Orbital stability of exomoons and submoons", url: "https://arxiv.org/abs/2005.06521" }
    ],
    relatedPaths: [
      { label: "Why our Moon is moving away", href: "/guides/why-is-the-moon-moving-away" },
      { label: "What tidal locking means", href: "/guides/why-the-moon-has-a-far-side" },
      { label: "Gravity assists and competing gravitational influences", href: "/guides/gravity-assists-and-spacecraft-flybys" }
    ]
  },
  {
    slug: "why-do-astronauts-grow-taller-in-space", publishedAt: "2026-11-22",
    title: "Why Do Astronauts Grow Taller in Space?",
    description: "Astronauts can become temporarily taller as their spines unload in microgravity. Learn how much height can change and why it matters for spacecraft design.",
    category: "Space Science", tags: ["Astronaut height", "Microgravity", "Spinal elongation", "Spacecraft design"],
    sources: [
      { label: "NASA: What's your space height?", url: "https://www.nasa.gov/wp-content/uploads/2018/05/whatisyourspaceheight.pdf" },
      { label: "NASA: Astronaut health monitoring and spinal ultrasound", url: "https://www.nasa.gov/directorates/esdmd/hhp/lifetime-surveillance-of-astronaut-health-lsah/" },
      { label: "NASA Glenn: What is microgravity?", url: "https://www.nasa.gov/centers-and-facilities/glenn/what-is-microgravity/" }
    ],
    relatedPaths: [
      { label: "Why astronauts float despite Earth's gravity", href: "/guides/why-astronauts-float-in-microgravity" },
      { label: "What astronauts mean by the smell of space", href: "/guides/what-does-space-smell-like" },
      { label: "Does time pass differently in space?", href: "/guides/does-time-pass-differently-in-space" }
    ]
  },
  {
    slug: "why-cant-we-travel-faster-than-light", publishedAt: "2026-11-22",
    title: "Why Can't We Travel Faster Than Light?",
    description: "The light-speed limit is not just a problem of better engines. Learn what relativity predicts for spacecraft and why apparent exceptions do not overturn it.",
    category: "Space Science", tags: ["Speed of light","Special relativity","Space travel"],
    sources: [
      { label: "Max Planck Institute: The speed of light", url: "https://www.einstein-online.info/en/speed_of_light/" },
      { label: "Max Planck Institute: Energy and relativistic motion", url: "https://www.einstein-online.info/en/emc/" },
      { label: "Fermilab: Is relativistic mass real?", url: "https://www.youtube.com/watch?v=LTJauaefTZM" }
    ],
    relatedPaths: [
      { label: "How time changes in space", href: "/guides/does-time-pass-differently-in-space" },
      { label: "Are wormholes real?", href: "/guides/are-wormholes-real" },
      { label: "What cosmic expansion means", href: "/guides/what-is-the-universe-expanding-into" }
    ]
  },
  {
    slug: "can-black-holes-evaporate", publishedAt: "2026-11-22",
    title: "Can Black Holes Evaporate? Hawking Radiation Explained",
    description: "Hawking radiation predicts that black holes can lose mass. Learn why this is not light escaping from inside and why evaporation remains unobserved.",
    category: "Deep Space", tags: ["Hawking radiation","Black holes","Quantum physics"],
    sources: [
      { label: "Max Planck Institute: Evaporating black holes", url: "https://www.einstein-online.info/en/evaporating_bh/" },
      { label: "NASA: Ten questions about black holes", url: "https://science.nasa.gov/universe/10-questions-you-might-have-about-black-holes/" }
    ],
    relatedPaths: [
      { label: "What lies inside a black hole?", href: "/guides/what-is-inside-a-black-hole" },
      { label: "Can a black hole swallow Earth?", href: "/guides/can-a-black-hole-swallow-earth" },
      { label: "Why light cannot be outrun", href: "/guides/why-cant-we-travel-faster-than-light" }
    ]
  },
  {
    slug: "what-is-a-rogue-planet", publishedAt: "2026-11-22",
    title: "What Is a Rogue Planet, and How Can We Find One?",
    description: "Rogue planets travel without orbiting a star. Explore possible origins, infrared searches, and the microlensing clues that can reveal these dark worlds.",
    category: "Deep Space", tags: ["Rogue planets","Microlensing","Free-floating planets"],
    sources: [
      { label: "NASA: Unveiling rogue planets", url: "https://www.nasa.gov/universe/unveiling-rogue-planets-with-nasas-roman-space-telescope/" },
      { label: "NASA Roman: Microlensing explained", url: "https://science.nasa.gov/mission/roman-space-telescope/microlensing/" },
      { label: "Research: Free-floating or wide-orbit planets in microlensing data", url: "https://ntrs.nasa.gov/citations/20210012890" },
      { label: "NASA: A young free-floating world in infrared", url: "https://science.nasa.gov/resource/where-the-nightlife-never-ends/" }
    ],
    relatedPaths: [
      { label: "How astronomers find exoplanets", href: "/guides/how-we-find-exoplanets" },
      { label: "What the habitable zone means", href: "/guides/what-the-habitable-zone-means" },
      { label: "Light and astronomical distances", href: "/guides/astronomical-distances-au-and-light-years" }
    ]
  },
  {
    slug: "why-are-meteors-different-colors", publishedAt: "2026-11-22",
    title: "Why Are Meteors Different Colors?",
    description: "Meteor colors come from glowing material and the atmosphere, not a simple rock-color chart. Learn what green, yellow, and white streaks can really tell us.",
    category: "Skywatching", tags: ["Meteor colors","Fireballs","Emission spectra"],
    sources: [
      { label: "NASA Ames: Meteor and fireball colors", url: "https://www.nasa.gov/space-science-and-astrobiology-at-ames/interesting-fact-of-the-month-current/interesting-fact-of-the-month-2021/" },
      { label: "ESO: A measured meteor spectrum", url: "https://www.eso.org/public/images/eso0424b/" },
      { label: "NASA research archive: The nature of meteor spectra", url: "https://ntrs.nasa.gov/api/citations/19810015593/downloads/19810015593.pdf" }
    ],
    relatedPaths: [
      { label: "Watch a meteor shower", href: "/guides/how-to-watch-a-meteor-shower" },
      { label: "Photograph meteor streaks", href: "/guides/photograph-a-meteor-shower" },
      { label: "How spectroscopy works", href: "/guides/spectroscopy-reading-starlight" }
    ]
  },
  {
    slug: "where-does-space-begin-karman-line", publishedAt: "2026-11-22",
    title: "Where Does Space Begin? The Karman Line Explained",
    description: "The Karman line is a useful boundary, not the end of Earth's air or gravity. Learn why reaching space and entering orbit are different achievements.",
    category: "Astronomy Basics", tags: ["Karman line","Atmosphere","Suborbital flight"],
    sources: [
      { label: "FAI: Statement about the Karman line", url: "https://www.fai.org/news/statement-about-karman-line" },
      { label: "NASA JPL: How far away is space?", url: "https://www.jpl.nasa.gov/edu/resources/lesson-plan/how-far-away-is-space/" },
      { label: "NASA Earth Observatory: The top of the atmosphere", url: "https://science.nasa.gov/earth/earth-observatory/the-top-of-the-atmosphere-7373/" }
    ],
    relatedPaths: [
      { label: "Why Earth stays in orbit", href: "/guides/why-doesnt-earth-fall-into-the-sun" },
      { label: "Why astronauts float", href: "/guides/why-astronauts-float-in-microgravity" },
      { label: "Why space feels cold", href: "/guides/why-is-space-cold" }
    ]
  },
  {
    slug: "how-long-does-sunlight-take-to-escape-the-sun", publishedAt: "2026-11-22",
    title: "How Long Does Sunlight Take to Escape the Sun?",
    description: "Sunlight takes about eight minutes to reach Earth after leaving the Sun. Its earlier journey through the solar interior is far slower and less direct.",
    category: "Space Science", tags: ["Sunlight","Photon diffusion","Solar interior"],
    sources: [
      { label: "NASA: Ancient sunlight and the random walk", url: "https://cdaweb.gsfc.nasa.gov/pub/documents/old/websites/sunearthday.nasa.gov/2007/locations/ttt_sunlight.php" },
      { label: "NASA: Sun facts and internal layers", url: "https://science.nasa.gov/sun/facts/" },
      { label: "NASA HEAT: Modeling a random walk", url: "https://assets.science.nasa.gov/content/dam/science/hpd/heliophysics-big-year/9%20July%20-%20Random%20Walk%20Problem%20-%20HBY%20and%20Math%20Odenwald%20Slide%20Deck.pdf" },
      { label: "Borexino research: Solar fusion neutrinos", url: "https://www.nature.com/articles/nature13702" }
    ],
    relatedPaths: [
      { label: "How fusion powers the Sun", href: "/guides/how-does-the-sun-burn-without-oxygen" },
      { label: "Why the corona is hotter", href: "/guides/why-is-the-suns-corona-hotter-than-its-surface" },
      { label: "Light travel and space communication", href: "/guides/deep-space-communication-and-light-delay" }
    ]
  },
  {
    slug: "why-is-the-suns-corona-hotter-than-its-surface", publishedAt: "2026-11-22",
    title: "Why Is the Sun's Corona Hotter Than Its Surface?",
    description: "The solar corona reaches millions of degrees above a much cooler visible surface. Explore magnetic heating, observational clues, and the remaining puzzle.",
    category: "Space Science", tags: ["Solar corona","Coronal heating","Magnetic reconnection"],
    sources: [
      { label: "NASA: Nanojets and coronal heating", url: "https://www.nasa.gov/solar-system/nasas-iris-spots-nanojets-shining-light-on-heating-the-solar-corona/" },
      { label: "NASA: Observing a possible nanoflare", url: "https://www.nasa.gov/solar-system/this-may-be-the-first-complete-observation-of-a-nanoflare/" },
      { label: "NASA Goddard: The coronal heating problem", url: "https://hesperia.gsfc.nasa.gov/sftheory/heatf.htm" },
      { label: "NASA: Sun facts", url: "https://science.nasa.gov/sun/facts/" }
    ],
    relatedPaths: [
      { label: "How the Sun produces energy", href: "/guides/how-does-the-sun-burn-without-oxygen" },
      { label: "Why sunlight takes time to escape", href: "/guides/how-long-does-sunlight-take-to-escape-the-sun" },
      { label: "Solar flares versus CMEs", href: "/guides/solar-flares-versus-coronal-mass-ejections" }
    ]
  },
  {
    slug: "nova-vs-supernova", publishedAt: "2026-11-22",
    title: "Nova vs. Supernova: What Is the Difference?",
    description: "A nova and a supernova are different stellar events, not simply small and large explosions. Learn what erupts, what survives, and how astronomers tell.",
    category: "Deep Space", tags: ["Nova","Supernova","White dwarfs"],
    sources: [
      { label: "NASA: What is a nova?", url: "https://science.nasa.gov/universe/whats-a-nova-inside-the-chaos-of-erupting-and-exploding-stars/" },
      { label: "NASA Hubble: The science of stellar explosions", url: "https://science.nasa.gov/mission/hubble/science/science-behind-the-discoveries/hubble-stellar-explosions/" },
      { label: "NASA Astrobiology: White dwarfs and unusual supernovae", url: "https://astrobiology.nasa.gov/news/of-white-dwarfs-zombie-stars-and-supernovae-explosions/" }
    ],
    relatedPaths: [
      { label: "How stars evolve", href: "/guides/how-stars-are-born-and-die" },
      { label: "Why the Sun will not become a black hole", href: "/guides/will-the-sun-become-a-black-hole" },
      { label: "Neutron stars and pulsars", href: "/guides/neutron-stars-and-pulsars" }
    ]
  },
  {
    slug: "are-the-stars-we-see-already-dead", publishedAt: "2026-11-22",
    title: "Are the Stars We See Already Dead?",
    description: "Starlight shows the past, but that does not mean most visible stars are dead. Compare light-travel time with stellar lifetimes to understand the claim.",
    category: "Astronomy Basics", tags: ["Starlight","Lookback time","Stellar lifetimes"],
    sources: [
      { label: "NASA: What is a light-year?", url: "https://science.nasa.gov/exoplanets/what-is-a-light-year/" },
      { label: "NASA StarChild: How long do stars live?", url: "https://starchild.gsfc.nasa.gov/docs/StarChild/questions/question41.html" },
      { label: "NASA Webb: The first stars", url: "https://science.nasa.gov/mission/webb/science-overview/science-explainers/what-were-the-first-stars-like/" }
    ],
    relatedPaths: [
      { label: "Nova versus supernova", href: "/guides/nova-vs-supernova" },
      { label: "Distances and light-years", href: "/guides/astronomical-distances-au-and-light-years" },
      { label: "Redshift and lookback time", href: "/guides/cosmological-redshift-and-lookback-time" }
    ]
  },
  {
    slug: "does-time-pass-differently-in-space", publishedAt: "2026-11-22",
    title: "Does Time Pass Differently in Space?",
    description: "Motion and gravity both affect elapsed time. Learn why space clocks can run faster or slower than Earth clocks and how GPS puts relativity to work.",
    category: "Space Science", tags: ["Time dilation","Relativity","Atomic clocks"],
    sources: [
      { label: "NIST: Putting Einstein to the test", url: "https://www.nist.gov/atomic-clocks/a-powerful-tool-for-science/putting-einstein-test" },
      { label: "NIST and JILA: Gravity measured across a millimeter", url: "https://www.nist.gov/news-events/news/2022/02/jila-atomic-clocks-measure-einsteins-general-relativity-millimeter-scale" },
      { label: "NIST: Relativity at everyday speeds and heights", url: "https://www.nist.gov/news-events/news/2010/09/nist-pair-aluminum-atomic-clocks-reveal-einsteins-relativity-personal-scale" }
    ],
    relatedPaths: [
      { label: "Why light has a speed limit", href: "/guides/why-cant-we-travel-faster-than-light" },
      { label: "How GPS works", href: "/guides/how-gps-finds-your-location" },
      { label: "Gravity and orbital free fall", href: "/guides/why-astronauts-float-in-microgravity" }
    ]
  },
  {
    slug: "why-does-venus-spin-backwards", publishedAt: "2026-11-22",
    title: "Why Does Venus Spin Backwards?",
    description: "Venus rotates in the opposite direction to most planets. Learn what retrograde rotation means, why its day is unusual, and what remains unexplained.",
    category: "Solar System", tags: ["Venus","Retrograde rotation","Planetary days"],
    sources: [
      { label: "NASA: Venus facts", url: "https://science.nasa.gov/venus/venus-facts/" },
      { label: "ESA: Venus and Earth, worlds apart", url: "https://blogs.esa.int/venustransit/2012/05/31/venus-and-earth-worlds-apart/" },
      { label: "Research: Atmospheric tides and planetary rotation", url: "https://arxiv.org/abs/1611.05678" }
    ],
    relatedPaths: [
      { label: "Why Uranus is tilted", href: "/guides/why-is-uranus-tilted-sideways" },
      { label: "Venus in the evening sky", href: "/guides/venus-morning-evening-star-and-phases" },
      { label: "Why Venus is so hot", href: "/guides/why-is-venus-hotter-than-mercury" }
    ]
  },
  {
    slug: "why-is-uranus-tilted-sideways", publishedAt: "2026-11-22",
    title: "Why Is Uranus Tilted Sideways?",
    description: "Uranus spins with an extreme axial tilt. Discover what that does to its seasons and why the event that tipped it remains an open question.",
    category: "Solar System", tags: ["Uranus","Axial tilt","Planetary seasons"],
    sources: [
      { label: "NASA: Uranus facts", url: "https://science.nasa.gov/uranus/facts/" },
      { label: "NASA and Hubble: Uranus's changing polar appearance", url: "https://science.nasa.gov/asset/hubble/uranus-nov-2014-and-nov-2022/" },
      { label: "NASA research archive: Uranus tilt and giant impacts", url: "https://ntrs.nasa.gov/citations/19910010699" }
    ],
    relatedPaths: [
      { label: "Why Venus spins backwards", href: "/guides/why-does-venus-spin-backwards" },
      { label: "Uranus and Neptune explained", href: "/guides/uranus-and-neptune-ice-giants" },
      { label: "What causes seasons", href: "/guides/why-earth-has-seasons" }
    ]
  },
  {
    slug: "why-are-sunsets-blue-on-mars", publishedAt: "2026-11-22",
    title: "Why Are Sunsets Blue on Mars?",
    description: "Martian dust makes the sky near the setting Sun look blue. Learn why the effect differs from Earth's sunsets and how camera processing changes images.",
    category: "Solar System", tags: ["Mars","Blue sunsets","Atmospheric scattering"],
    sources: [
      { label: "NASA: Sunrise and sunset on Mars", url: "https://science.nasa.gov/solar-system/planets/mars/what-does-a-sunrise-sunset-look-like-on-mars/" },
      { label: "NASA JPL: Color variations at Martian sunset", url: "https://www.jpl.nasa.gov/images/pia00917-color-variations-in-the-sky-at-sunset/" },
      { label: "NASA: Mars facts", url: "https://science.nasa.gov/mars/facts/" }
    ],
    relatedPaths: [
      { label: "Why Mars looks red", href: "/guides/mars-red-color-and-observing" },
      { label: "How to read space image colors", href: "/guides/how-to-read-space-images" },
      { label: "What color is the Sun?", href: "/guides/what-color-is-the-sun" }
    ]
  },
  {
    slug: "why-does-pluto-have-a-heart", publishedAt: "2026-11-22",
    title: "Why Does Pluto Have a Heart-Shaped Region?",
    description: "Pluto's heart is a landscape, not a marking painted on ice. Explore Tombaugh Regio, nitrogen glaciers, and the slowly overturning Sputnik Planitia.",
    category: "Solar System", tags: ["Pluto","Sputnik Planitia","Nitrogen ice"],
    sources: [
      { label: "NASA: Pluto facts", url: "https://science.nasa.gov/dwarf-planets/pluto/facts/" },
      { label: "NASA: Pluto's heart and solid-ice convection", url: "https://www.nasa.gov/solar-system/plutos-heart-like-a-cosmic-lava-lamp/" },
      { label: "NASA: The two lobes of Pluto's heart", url: "https://www.nasa.gov/image-article/plutos-heart/" },
      { label: "NASA: Probing Pluto's icy heart", url: "https://www.nasa.gov/missions/scientists-probe-mystery-of-plutos-icy-heart/" }
    ],
    relatedPaths: [
      { label: "What makes a dwarf planet?", href: "/guides/dwarf-planets-pluto-and-ceres" },
      { label: "How Mercury keeps water ice", href: "/guides/how-can-mercury-have-ice" },
      { label: "Oceans inside icy moons", href: "/guides/europa-and-enceladus-oceans" }
    ]
  },
  {
    slug: "how-does-the-sun-burn-without-oxygen", publishedAt: "2026-11-22",
    title: "How Does the Sun Burn Without Oxygen?",
    description: "The Sun is powered by nuclear fusion, not ordinary fire. Learn how hydrogen becomes helium and what observations tell us about the solar core.",
    category: "Space Science", tags: ["Sun","Nuclear fusion","Solar neutrinos"],
    sources: [
      { label: "NASA StarChild: How the Sun burns without oxygen", url: "https://starchild.gsfc.nasa.gov/docs/StarChild/questions/question36.html" },
      { label: "NASA: Sun facts", url: "https://science.nasa.gov/sun/facts/" },
      { label: "Borexino research: Neutrinos from proton-proton fusion", url: "https://www.nature.com/articles/nature13702" }
    ],
    relatedPaths: [
      { label: "How sunlight escapes the Sun", href: "/guides/how-long-does-sunlight-take-to-escape-the-sun" },
      { label: "Why the corona is hotter", href: "/guides/why-is-the-suns-corona-hotter-than-its-surface" },
      { label: "The Sun's future", href: "/guides/will-the-sun-become-a-black-hole" }
    ]
  },
  {
    slug: "why-cant-we-feel-earth-spinning", publishedAt: "2026-11-22",
    title: "Why Can't We Feel Earth Spinning?",
    description: "Earth spins rapidly, but you, the ground, and the atmosphere move together. Learn why rotation feels subtle and how experiments reveal it.",
    category: "Astronomy Basics", tags: ["Earth rotation","Gravity","Foucault pendulum"],
    sources: [
      { label: "NASA: Earth's rotation and acceleration", url: "https://pwg.gsfc.nasa.gov/stargaze/StarFAQ21.htm" },
      { label: "UNSW Physics: The Foucault pendulum", url: "https://www.animations.physics.unsw.edu.au/jw/foucault_pendulum.html" },
      { label: "NASA: Earth facts", url: "https://science.nasa.gov/earth/facts/" }
    ],
    relatedPaths: [
      { label: "Why Earth stays in orbit", href: "/guides/why-doesnt-earth-fall-into-the-sun" },
      { label: "Where space begins", href: "/guides/where-does-space-begin-karman-line" },
      { label: "Why astronauts float", href: "/guides/why-astronauts-float-in-microgravity" }
    ]
  },
  {
    slug: "why-doesnt-earth-fall-into-the-sun", publishedAt: "2026-11-22",
    title: "Why Doesn't Earth Fall Into the Sun?",
    description: "Earth is falling toward the Sun while moving sideways fast enough to keep missing it. Understand orbital motion without the misleading force balance.",
    category: "Astronomy Basics", tags: ["Orbits","Gravity","Earth"],
    sources: [
      { label: "NASA: Orbital mechanics", url: "https://science.nasa.gov/learn/basics-of-space-flight/chapter3-4/" },
      { label: "NASA: Why reaching the Sun is difficult", url: "https://www.nasa.gov/solar-system/its-surprisingly-hard-to-go-to-the-sun/" }
    ],
    relatedPaths: [
      { label: "What if the Sun disappeared?", href: "/guides/what-if-the-sun-disappeared" },
      { label: "Why we cannot feel Earth's spin", href: "/guides/why-cant-we-feel-earth-spinning" },
      { label: "How gravity assists work", href: "/guides/gravity-assists-and-spacecraft-flybys" },
      { label: "Why astronauts float", href: "/guides/why-astronauts-float-in-microgravity" }
    ]
  },
  {
    slug: "why-does-the-moon-have-so-many-craters", publishedAt: "2026-11-22",
    title: "Why Does the Moon Have So Many Craters?",
    description: "The Moon preserves impacts that Earth often erases. Learn how air, erosion, lava, and overlapping craters shape the record we see today.",
    category: "Moon", tags: ["Lunar craters","Impacts","Planetary geology"],
    sources: [
      { label: "NASA: Lunar craters", url: "https://science.nasa.gov/moon/lunar-craters/" },
      { label: "NASA: Why study craters?", url: "https://science.nasa.gov/moon/lunar-craters/why-study-craters/" },
      { label: "NASA Space Place: Why Earth has fewer visible craters", url: "https://spaceplace.nasa.gov/craters/en/" }
    ],
    relatedPaths: [
      { label: "Does the Moon have an atmosphere?", href: "/guides/does-the-moon-have-an-atmosphere" },
      { label: "Lunar seas and highlands", href: "/guides/lunar-maria-and-highlands" },
      { label: "Observe lunar craters", href: "/guides/how-to-observe-the-moon" }
    ]
  },
  {
    slug: "does-the-moon-have-an-atmosphere", publishedAt: "2026-11-22",
    title: "Does the Moon Have an Atmosphere?",
    description: "The Moon has a tenuous exosphere, not breathable air. Explore where its particles come from and why they behave differently from Earth's atmosphere.",
    category: "Moon", tags: ["Lunar atmosphere","Exosphere","Solar wind"],
    sources: [
      { label: "NASA: The Moon's atmosphere", url: "https://science.nasa.gov/moon/lunar-atmosphere/" },
      { label: "NASA: Weather on the Moon", url: "https://science.nasa.gov/moon/weather-on-the-moon/" },
      { label: "NASA: The solar wind and the Moon", url: "https://science.nasa.gov/moon/solar-wind/" }
    ],
    relatedPaths: [
      { label: "Why the Moon has craters", href: "/guides/why-does-the-moon-have-so-many-craters" },
      { label: "How Mercury can have ice", href: "/guides/how-can-mercury-have-ice" },
      { label: "Why sound needs a medium", href: "/guides/can-sound-travel-through-space" }
    ]
  },
  {
    slug: "how-can-mercury-have-ice", publishedAt: "2026-11-22",
    title: "How Can Mercury Have Ice So Close to the Sun?",
    description: "Mercury's polar shadows can trap water ice despite its scorching days. See what spacecraft measurements reveal and what remains uncertain.",
    category: "Solar System", tags: ["Mercury","Water ice","Permanently shadowed regions"],
    sources: [
      { label: "NASA: Mercury facts", url: "https://science.nasa.gov/mercury/facts/" },
      { label: "NASA Goddard: Mercury polar deposits", url: "https://pgda.gsfc.nasa.gov/products/85" },
      { label: "NASA: Mercury's permanently shadowed craters", url: "https://svs.gsfc.nasa.gov/30341/" }
    ],
    relatedPaths: [
      { label: "The Moon's thin exosphere", href: "/guides/does-the-moon-have-an-atmosphere" },
      { label: "Why Venus is hotter than Mercury", href: "/guides/why-is-venus-hotter-than-mercury" },
      { label: "How to observe Mercury", href: "/guides/how-to-see-mercury" }
    ]
  },
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
    relatedPaths: [{ label: "Check lunar conditions", href: "/moon" }, { label: "Understand lunar phases", href: "/guides/understanding-moon-phases" }, { label: "Can a telescope show Apollo hardware?", href: "/guides/can-you-see-apollo-landing-sites-from-earth" }]
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
    relatedPaths: [{ label: "Check upcoming sky events", href: "/events" }, { label: "Plan for the August 2027 solar eclipse", href: "/guides/august-2027-solar-eclipse" }, { label: "Learn about lunar eclipses", href: "/guides/lunar-eclipses-explained" }]
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
    relatedPaths: [
      { label: "2026 Geminids viewing guide", href: "/guides/geminid-meteor-shower-2026" },
      { label: "Why meteors have different colors", href: "/guides/why-are-meteors-different-colors" },
      { label: "2027 Quadrantids viewing guide", href: "/guides/quadrantid-meteor-shower-2027" },
      { label: "2027 Perseids viewing guide", href: "/guides/perseid-meteor-shower-2027" },
      { label: "Photograph a meteor shower", href: "/guides/photograph-a-meteor-shower" },
      { label: "Browse sky events", href: "/events" },
      { label: "Check Moon conditions", href: "/moon" }
    ]
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
    relatedPaths: [{ label: "Find the Pleiades", href: "/guides/how-to-find-pleiades" }, { label: "Find the Andromeda Galaxy", href: "/guides/how-to-find-andromeda-galaxy" }, { label: "Observe the Moon", href: "/guides/how-to-observe-the-moon" }, { label: "Understand telescope basics", href: "/guides/telescope-basics-aperture-and-magnification" }]
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
    relatedPaths: [
      { label: "Are the stars we see already dead?", href: "/guides/are-the-stars-we-see-already-dead" },
      { label: "Compare novae and supernovae", href: "/guides/nova-vs-supernova" },
      { label: "Explore the astronomy gallery", href: "/gallery" },
      { label: "Learn about black holes", href: "/guides/black-holes-explained" }
    ]
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
    relatedPaths: [
      { label: "What is inside a black hole?", href: "/guides/what-is-inside-a-black-hole" },
      { label: "Can black holes evaporate?", href: "/guides/can-black-holes-evaporate" },
      { label: "Could a black hole swallow Earth?", href: "/guides/can-a-black-hole-swallow-earth" },
      { label: "Are wormholes real?", href: "/guides/are-wormholes-real" },
      { label: "Follow the life cycle of stars", href: "/guides/how-stars-are-born-and-die" },
      { label: "Read deep-space briefs", href: "/briefs" }
    ]
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
    relatedPaths: [
      { label: "What happens when galaxies collide?", href: "/guides/what-happens-when-galaxies-collide" },
      { label: "Dark matter vs. dark energy", href: "/guides/dark-matter-vs-dark-energy" },
      { label: "Does the universe have a center?", href: "/guides/does-the-universe-have-a-center" },
      { label: "Understand astronomical distances", href: "/guides/astronomical-distances-au-and-light-years" },
      { label: "Explore galaxy images", href: "/gallery" }
    ]
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
    relatedPaths: [
      { label: "Could a tidally locked planet support life?", href: "/guides/can-tidally-locked-planets-support-life" },
      { label: "What is a rogue planet?", href: "/guides/what-is-a-rogue-planet" },
      { label: "Why is Venus hotter than Mercury?", href: "/guides/why-is-venus-hotter-than-mercury" },
      { label: "Learn how exoplanets are detected", href: "/guides/how-we-find-exoplanets" },
      { label: "Follow astronomy discoveries", href: "/briefs" }
    ]
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
    relatedPaths: [{ label: "Recognize Webb's diffraction spikes", href: "/guides/why-webb-stars-have-eight-spikes" }, { label: "Practice in the gallery", href: "/gallery" }, { label: "Compare Webb and Hubble", href: "/guides/webb-and-hubble-compared" }]
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
    relatedPaths: [
      { label: "Why is the Moon moving away?", href: "/guides/why-is-the-moon-moving-away" },
      { label: "Learn lunar phases", href: "/guides/understanding-moon-phases" },
      { label: "Explore the Moon page", href: "/moon" }
    ]
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
    relatedPaths: [
      { label: "Why sunsets are blue on Mars", href: "/guides/why-are-sunsets-blue-on-mars" },
      { label: "Learn about opposition", href: "/guides/planets-conjunctions-and-opposition" },
      { label: "Read the limits of magnification", href: "/guides/telescope-basics-aperture-and-magnification" }
    ]
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
    relatedPaths: [
      { label: "Can sound travel through space?", href: "/guides/can-sound-travel-through-space" },
      { label: "Learn light-travel distances", href: "/guides/astronomical-distances-au-and-light-years" },
      { label: "Follow mission events", href: "/events" }
    ]
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
    relatedPaths: [{ label: "Explore orbital motion", href: "/guides/orbits-and-lagrange-points" }, { label: "Spot an orbiting station", href: "/guides/how-to-spot-the-space-station" }, { label: "Why astronauts grow taller", href: "/guides/why-do-astronauts-grow-taller-in-space" }]
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
    relatedPaths: [
      { label: "Will the Sun become a black hole?", href: "/guides/will-the-sun-become-a-black-hole" },
      { label: "Why are there no green stars?", href: "/guides/why-are-there-no-green-stars" },
      { label: "Understand stellar life cycles", href: "/guides/how-stars-are-born-and-die" },
      { label: "Read image colors", href: "/guides/how-to-read-space-images" }
    ]
  },
  {
    slug: "telescope-field-of-view", publishedAt: "2026-11-09",
    title: "Telescope Field of View: Will the Target Fit?",
    description: "Estimate how much sky an eyepiece shows before trying to frame a Moon, planet pair, or cluster.",
    category: "Skywatching", tags: ["Eyepieces", "Field of view", "Magnification"],
    sources: [
      { label: "AAVSO: Visual Observing Manual", url: "https://www.aavso.org/sites/default/files/EnglishManual-2013.pdf" },
      { label: "Celestron: Measuring True Field by Drift", url: "https://www.celestron.com/blogs/knowledgebase/how-much-magnification-and-true-field-of-view-does-the-neximage-camera-have-when-placed-in-my-eyepiece-holder" }
    ],
    relatedPaths: [{ label: "Check telescope basics", href: "/guides/telescope-basics-aperture-and-magnification" }, { label: "Choose a cluster", href: "/guides/open-and-globular-star-clusters" }]
  },
  {
    slug: "night-sky-observing-log", publishedAt: "2026-11-09",
    title: "Keep a Skywatching Log You Can Use Again",
    description: "Make a short record that lets you compare nights without mistaking changing conditions for changing objects.",
    category: "Skywatching", tags: ["Observing log", "Sketching", "UTC"],
    sources: [
      { label: "AAVSO: Visual Observing Manual", url: "https://www.aavso.org/sites/default/files/EnglishManual-2013.pdf" },
      { label: "NASA: Skywatching FAQ", url: "https://science.nasa.gov/skywatching/faq/" }
    ],
    relatedPaths: [{ label: "Read sky times", href: "/guides/moonrise-moonset-and-local-time" }, { label: "Sketch Jupiter and its moons", href: "/guides/observing-jupiter-and-its-moons" }]
  },
  {
    slug: "find-polaris-and-true-north", publishedAt: "2026-11-09",
    title: "Find Polaris and Estimate Your Latitude",
    description: "Use the Big Dipper's pointer stars to locate true north, then check how high the pole appears from your site.",
    category: "Skywatching", tags: ["Polaris", "Latitude", "Celestial pole", "True north"],
    sources: [
      { label: "NASA: How to Find the North Star", url: "https://science.nasa.gov/solar-system/skywatching/what-is-the-north-star-and-how-do-you-find-it/" },
      { label: "NASA Goddard: Finding Latitude with the Pole Star", url: "https://pwg.gsfc.nasa.gov/stargaze/Snavigat.htm" }
    ],
    relatedPaths: [{ label: "Read altitude and azimuth", href: "/guides/sky-coordinates-altitude-and-azimuth" }, { label: "Identify star patterns", href: "/guides/constellations-and-star-charts" }]
  },
  {
    slug: "airmass-and-atmospheric-extinction", publishedAt: "2026-11-09",
    title: "Airmass: Why Stars Fade Near the Horizon",
    description: "Understand what airmass means and use it to choose a better time to observe a faint target.",
    category: "Skywatching", tags: ["Airmass", "Atmospheric extinction", "Transparency"],
    sources: [
      { label: "ESO: La Silla Extinction Coefficients", url: "https://www.eso.org/sci/observing/tools/Extinction.html" },
      { label: "AAVSO: DSLR Observing Manual", url: "https://www.aavso.org/sites/default/files/publications_files/dslr_manual/AAVSO_DSLR_Observing_Manual_V1-4.pdf" }
    ],
    relatedPaths: [{ label: "Distinguish seeing from transparency", href: "/guides/why-stars-twinkle-and-seeing" }, { label: "Read stellar magnitudes", href: "/guides/stellar-magnitudes-and-brightness" }]
  },
  {
    slug: "lunar-and-asteroid-occultations", publishedAt: "2026-11-09",
    title: "Occultations: When a Star Briefly Disappears",
    description: "Read a local prediction, understand what a timed disappearance measures, and distinguish a missed event from lost data.",
    category: "Skywatching", tags: ["Occultation", "Lunar limb", "Asteroid shadow", "Timing"],
    sources: [
      { label: "IOTA: Occultation Observing Basics", url: "https://occultations.org/observing/observing-basics/" },
      { label: "IOTA India: Occultation Observing Guide", url: "https://iota-india.in/occultations/" }
    ],
    relatedPaths: [{ label: "Check sky events", href: "/events" }, { label: "Understand asteroid light curves", href: "/guides/asteroid-light-curves-and-rotation" }]
  },
  {
    slug: "lunar-libration", publishedAt: "2026-11-09",
    title: "Lunar Libration: A Peek Around the Moon's Edge",
    description: "See why the Moon's visible edge shifts and compare two views without confusing libration with phase.",
    category: "Moon", tags: ["Libration", "Lunar limb", "Moon orbit"],
    sources: [
      { label: "NASA Goddard: Librations of the Moon", url: "https://cdaweb.gsfc.nasa.gov/pub/documents/archived_websites/pwg.gsfc.nasa.gov/stargaze/Smoon4.htm" },
      { label: "NASA: Moon Phases and Libration", url: "https://science.nasa.gov/moon/moon-phases/" }
    ],
    relatedPaths: [{ label: "Why the Moon keeps one face toward Earth", href: "/guides/why-the-moon-has-a-far-side" }, { label: "Explore the Moon page", href: "/moon" }]
  },
  {
    slug: "why-the-moon-has-a-far-side", publishedAt: "2026-11-09",
    title: "The Moon Rotates: Why We Still See the Same Face",
    description: "Use a simple tabletop model to distinguish lunar rotation, orbital motion, and the far side's daylight.",
    category: "Moon", tags: ["Tidal locking", "Far side", "Synchronous rotation"],
    sources: [
      { label: "NASA: Tidal Locking", url: "https://science.nasa.gov/moon/tidal-locking/" },
      { label: "NASA: Moon Phases", url: "https://science.nasa.gov/moon/moon-phases/" },
      { label: "NASA: Moon Fact Sheet", url: "https://nssdc.gsfc.nasa.gov/planetary/factsheet/moonfact.html" }
    ],
    relatedPaths: [{ label: "See how libration shifts the view", href: "/guides/lunar-libration" }, { label: "Understand the phases", href: "/guides/understanding-moon-phases" }]
  },
  {
    slug: "lunar-maria-and-highlands", publishedAt: "2026-11-09",
    title: "Read the Moon's Dark Plains and Bright Highlands",
    description: "Tell broad lunar terrain apart from moving shadows, and trace an impact basin in a binocular view.",
    category: "Moon", tags: ["Maria", "Highlands", "Basalt", "Impact basins"],
    sources: [
      { label: "NASA: Lunar Craters and Basins", url: "https://science.nasa.gov/moon/lunar-craters/" },
      { label: "NASA LRO: Wrinkle Ridge in Mare Crisium", url: "https://science.nasa.gov/resource/wrinkle-ridge-in-mare-crisium/" }
    ],
    relatedPaths: [{ label: "Try a first lunar observation", href: "/guides/how-to-observe-the-moon" }, { label: "See how the lunar edge shifts", href: "/guides/lunar-libration" }]
  },
  {
    slug: "dwarf-planets-pluto-and-ceres", publishedAt: "2026-11-09",
    title: "Dwarf Planets: Why Pluto and Ceres Share a Category",
    description: "Read the Solar System classification as a test of orbital dominance, not a ranking by size or scientific interest.",
    category: "Solar System", tags: ["Dwarf planets", "Pluto", "Ceres", "IAU"],
    sources: [
      { label: "IAU: 2006 Solar System Classification", url: "https://www.iau.org/IAU/Iau/News/PR2006/iau-2006-general-assembly-resolution-votes.aspx" },
      { label: "NASA: Ceres Facts", url: "https://science.nasa.gov/dwarf-planets/ceres/facts/" },
      { label: "NASA: New Horizons", url: "https://science.nasa.gov/mission/new-horizons/" }
    ],
    relatedPaths: [
      { label: "Why Pluto has a heart-shaped region", href: "/guides/why-does-pluto-have-a-heart" },
      { label: "Understand asteroid and comet differences", href: "/guides/asteroids-comets-and-meteorites" },
      { label: "Meet the ice giants", href: "/guides/uranus-and-neptune-ice-giants" }
    ]
  },
  {
    slug: "uranus-and-neptune-ice-giants", publishedAt: "2026-11-09",
    title: "Uranus and Neptune: What Makes an Ice Giant?",
    description: "Compare two distant planets without taking the word ice or a processed blue photograph too literally.",
    category: "Solar System", tags: ["Uranus", "Neptune", "Ice giants", "Voyager 2"],
    sources: [
      { label: "NASA: Uranus Facts", url: "https://science.nasa.gov/uranus/facts/" },
      { label: "NASA: Neptune Facts", url: "https://science.nasa.gov/neptune/neptune-facts/" },
      { label: "NASA: Color and Haze on the Ice Giants", url: "https://science.nasa.gov/solar-system/why-uranus-and-neptune-are-different-colors/" }
    ],
    relatedPaths: [{ label: "Read a space image", href: "/guides/how-to-read-space-images" }, { label: "Compare with Saturn", href: "/guides/saturn-rings-and-changing-views" }]
  },
  {
    slug: "asteroid-light-curves-and-rotation", publishedAt: "2026-11-09",
    title: "Asteroid Light Curves: Find a Spin Without Seeing the Shape",
    description: "Learn how brightness changes reveal a possible rotation period and why two peaks can be one turn.",
    category: "Asteroids", tags: ["Light curve", "Rotation period", "Photometry"],
    sources: [
      { label: "Rosetta team: The Light Curve of Asteroid Steins", url: "https://arxiv.org/abs/astro-ph/0612097" },
      { label: "TESS research: Rotation Periods from Asteroid Light Curves", url: "https://arxiv.org/abs/2501.07189" }
    ],
    relatedPaths: [{ label: "How occultations measure a silhouette", href: "/guides/lunar-and-asteroid-occultations" }, { label: "Browse near-Earth approaches", href: "/asteroids" }]
  },
  {
    slug: "asteroid-sample-return", publishedAt: "2026-11-09",
    title: "Why Bring Asteroid Samples Back to Earth?",
    description: "Compare Bennu and Ryugu and learn why collecting a little material can answer questions a flyby cannot.",
    category: "Missions", tags: ["Sample return", "Bennu", "Ryugu", "OSIRIS-REx", "Hayabusa2"],
    sources: [
      { label: "NASA: OSIRIS-REx In Depth", url: "https://science.nasa.gov/mission/osiris-rex/in-depth/" },
      { label: "ISAS/JAXA: Science from Asteroid Sample Returns", url: "https://www.isas.jaxa.jp/en/topics/004280.html" },
      { label: "ISAS/JAXA: Sample Curation Archive", url: "https://darts.isas.jaxa.jp/en/missions/curation" }
    ],
    relatedPaths: [{ label: "Read asteroid light curves", href: "/guides/asteroid-light-curves-and-rotation" }, { label: "Explore near-Earth objects", href: "/guides/what-is-a-near-earth-object" }]
  },
  {
    slug: "read-landsat-false-color-images", publishedAt: "2026-11-09",
    title: "Read a Landsat Image: What Does the Color Mean?",
    description: "Decode the band numbers in a Landsat image and avoid mistaking a useful color assignment for a literal photograph.",
    category: "Earth Observation", tags: ["Landsat", "False color", "Near infrared", "Resolution"],
    sources: [
      { label: "USGS: Landsat Band Designations", url: "https://www.usgs.gov/faqs/what-are-band-designations-landsat-satellites" },
      { label: "NASA Earth Observatory: Interpret a False-Color Image", url: "https://science.nasa.gov/earth/earth-observatory/how-to-interpret-a-false-color-satellite-image/" }
    ],
    relatedPaths: [{ label: "Read other space images", href: "/guides/how-to-read-space-images" }, { label: "Compare weather satellite orbits", href: "/guides/weather-satellite-orbits" }]
  },
  {
    slug: "weather-satellite-orbits", publishedAt: "2026-11-09",
    title: "Weather Satellites: One Stays Put, One Sweeps the Globe",
    description: "Choose between a rapid regional loop and a polar-orbiting swath, and check what the image timestamp actually means.",
    category: "Earth Observation", tags: ["Weather satellites", "Geostationary orbit", "Polar orbit", "GOES", "JPSS"],
    sources: [
      { label: "NOAA: Weather Satellites", url: "https://www.noaa.gov/jetstream/weather-satellites" },
      { label: "NOAA NESDIS: Why Satellites Have Different Orbits", url: "https://www.nesdis.noaa.gov/about/k-12-education/satellites-technology/why-do-satellites-have-different-orbits" },
      { label: "ESA: Spacecraft Orbits", url: "https://www.esa.int/Science_Exploration/Space_Science/Spacecraft_orbits" }
    ],
    relatedPaths: [{ label: "Understand orbit fundamentals", href: "/guides/orbits-and-lagrange-points" }, { label: "Decode satellite colors", href: "/guides/read-landsat-false-color-images" }]
  },
  {
    slug: "rocket-stages-fairings-and-deployment", publishedAt: "2026-11-09",
    title: "Rocket Stages and Fairings: Read a Launch Timeline",
    description: "Tell engine cutoff, stage separation, fairing release, and payload deployment apart on a mission webcast.",
    category: "Missions", tags: ["Rocket staging", "Fairing", "Upper stage", "Deployment"],
    sources: [
      { label: "ESA: Ariane 6 Components", url: "https://www.esa.int/articles/about-us/directorates/space-transportation/ariane/ariane-6-what-s-it-made-of" },
      { label: "SpaceX: Falcon Payload User's Guide", url: "https://www.spacex.com/assets/media/falcon-users-guide-2025-05-09.pdf" }
    ],
    relatedPaths: [{ label: "Understand countdowns and launch windows", href: "/guides/rocket-launch-windows-and-countdowns" }, { label: "Browse upcoming launches", href: "/events" }]
  },
  {
    slug: "radio-interferometry-and-alma", publishedAt: "2026-11-09",
    title: "Radio Interferometry: How ALMA Links Its Antennas",
    description: "See how antenna spacing sets image detail and why a wider array can miss broad emission.",
    category: "Space Science", tags: ["ALMA", "Interferometry", "Baseline", "Radio astronomy"],
    sources: [
      { label: "ALMA Observatory: Interferometry", url: "https://www.almaobservatory.org/en/about-alma/how-alma-works/technologies/interferometry/" },
      { label: "NRAO: ALMA Basics", url: "https://almascience.nrao.edu/about-alma/alma-basics" }
    ],
    relatedPaths: [{ label: "Read a space image", href: "/guides/how-to-read-space-images" }, { label: "Understand wavelengths and spectra", href: "/guides/spectroscopy-reading-starlight" }]
  },
  {
    slug: "neutron-stars-and-pulsars", publishedAt: "2026-11-09",
    title: "Pulsars: How a Neutron Star Keeps Time",
    description: "Read a pulse period and understand why a flashing signal does not mean the whole star switches on and off.",
    category: "Deep Space", tags: ["Neutron stars", "Pulsars", "Rotation", "Timing"],
    sources: [
      { label: "NASA Goddard: Neutron Stars and Pulsars", url: "https://imagine.gsfc.nasa.gov/science/objects/neutron_stars1.html" },
      { label: "NASA Hubble: Pulsars", url: "https://science.nasa.gov/mission/hubble/science/science-behind-the-discoveries/hubble-pulsars/" }
    ],
    relatedPaths: [{ label: "Follow stellar life cycles", href: "/guides/how-stars-are-born-and-die" }, { label: "See how mergers are measured", href: "/guides/gravitational-waves-and-ligo" }]
  },
  {
    slug: "gravitational-waves-and-ligo", publishedAt: "2026-11-09",
    title: "Gravitational Waves: Read a LIGO Chirp",
    description: "Understand what a laser interferometer measures and how scientists check that a brief signal came from space.",
    category: "Deep Space", tags: ["Gravitational waves", "LIGO", "Strain", "Compact mergers"],
    sources: [
      { label: "LIGO Lab: What Are Gravitational Waves?", url: "https://www.ligo.caltech.edu/page/what-are-gw" },
      { label: "LIGO Collaboration: The GW150914 Detection", url: "https://ligo.org/science-summaries/GW150914/" },
      { label: "LIGO Collaboration: Vetting GW150914", url: "https://ligo.org/science-summaries/GW150914Detchar/" }
    ],
    relatedPaths: [{ label: "Understand black holes", href: "/guides/black-holes-explained" }, { label: "Meet neutron stars", href: "/guides/neutron-stars-and-pulsars" }]
  },
  {
    slug: "cosmic-microwave-background", publishedAt: "2026-11-09",
    title: "The Cosmic Microwave Background: Read the Oldest Light",
    description: "Understand what a Planck map shows, what its colors encode, and why it is not a picture of the Big Bang itself.",
    category: "Deep Space", tags: ["Cosmic microwave background", "CMB", "Planck", "Early universe"],
    sources: [
      { label: "ESA: Planck and the Cosmic Microwave Background", url: "https://www.esa.int/articles/about-us/directorates/science/planck/planck-and-the-cosmic-microwave-background" },
      { label: "ESA: Planck Science Highlights", url: "https://www.esa.int/Science_Exploration/Space_Science/Planck/Planck_science_highlights" },
      { label: "Planck Team at IPAC: Interactive Data Viewer", url: "https://planck.ipac.caltech.edu/wwt" }
    ],
    relatedPaths: [{ label: "Learn how expansion shifts light", href: "/guides/cosmological-redshift-and-lookback-time" }, { label: "Read a space image", href: "/guides/how-to-read-space-images" }]
  },
  {
    slug: "cosmological-redshift-and-lookback-time", publishedAt: "2026-11-09",
    title: "Cosmological Redshift: How Old Light Reaches Webb",
    description: "Calculate a simple redshift and distinguish stretched wavelengths, light travel time, and distance today.",
    category: "Deep Space", tags: ["Redshift", "Lookback time", "Webb", "Expansion"],
    sources: [
      { label: "NASA Hubble: Cosmological Redshift", url: "https://science.nasa.gov/mission/hubble/science/science-behind-the-discoveries/hubble-cosmological-redshift/" },
      { label: "NASA Webb: Early Universe", url: "https://science.nasa.gov/mission/webb/early-universe/" }
    ],
    relatedPaths: [{ label: "Read spectral lines", href: "/guides/spectroscopy-reading-starlight" }, { label: "Explore the cosmic microwave background", href: "/guides/cosmic-microwave-background" }]
  },
  {
    slug: "geminid-meteor-shower-2026", publishedAt: "2026-11-17",
    title: "Geminid Meteor Shower 2026: When and Where to Look",
    description: "Plan your December 2026 Geminid watch around the broad peak, local darkness, and the rising radiant.",
    category: "Skywatching", tags: ["Geminids", "Meteor shower", "December 2026", "3200 Phaethon"],
    sources: [
      { label: "International Meteor Organization: 2026 Shower Calendar", url: "https://www.imo.net/files/meteor-shower/cal2026.pdf" },
      { label: "NASA: Geminids", url: "https://science.nasa.gov/solar-system/meteors-meteorites/geminids/" }
    ],
    relatedPaths: [{ label: "Check Astroboat's sky calendar", href: "/events" }, { label: "Learn how to photograph meteors", href: "/guides/photograph-a-meteor-shower" }]
  },
  {
    slug: "quadrantid-meteor-shower-2027", publishedAt: "2026-11-17",
    title: "Quadrantid Meteor Shower 2027: Plan for the Short Peak",
    description: "Find the January 2027 Quadrantid peak in local time and decide whether the radiant will be above your horizon.",
    category: "Skywatching", tags: ["Quadrantids", "January 2027", "Meteor shower", "Bootes"],
    sources: [
      { label: "International Meteor Organization: 2027 Shower Calendar", url: "https://www.imo.net/files/data/calendar/cal2027.pdf" },
      { label: "NASA: Quadrantids", url: "https://science.nasa.gov/solar-system/meteors-meteorites/quadrantids/" }
    ],
    relatedPaths: [{ label: "Read UTC and local sky times", href: "/guides/moonrise-moonset-and-local-time" }, { label: "Plan a naked-eye meteor watch", href: "/guides/how-to-watch-a-meteor-shower" }]
  },
  {
    slug: "perseid-meteor-shower-2027", publishedAt: "2026-11-17",
    title: "Perseid Meteor Shower 2027: Find the Darkest Window",
    description: "Use the August 2027 Perseid peak, local moonset, and the start of twilight to choose an observing window.",
    category: "Skywatching", tags: ["Perseids", "August 2027", "Meteor shower", "Swift-Tuttle"],
    sources: [
      { label: "International Meteor Organization: 2027 Shower Calendar", url: "https://www.imo.net/files/data/calendar/cal2027.pdf" },
      { label: "NASA: Perseids", url: "https://science.nasa.gov/solar-system/meteors-meteorites/perseids/" }
    ],
    relatedPaths: [{ label: "Check local Moon timing", href: "/guides/moonrise-moonset-and-local-time" }, { label: "Understand twilight limits", href: "/guides/twilight-civil-nautical-astronomical" }]
  },
  {
    slug: "august-2027-solar-eclipse", publishedAt: "2026-11-17",
    title: "August 2, 2027 Solar Eclipse: Path, Times, and Safe Viewing",
    description: "Find out where the August 2027 eclipse is total or partial, how to read your local map, and how to view it safely.",
    category: "Skywatching", tags: ["Solar eclipse", "2027 eclipse", "Totality", "Eclipse map", "Eye safety"],
    sources: [
      { label: "NASA Goddard: August 2, 2027 Eclipse Path Map", url: "https://eclipse.gsfc.nasa.gov/SEgoogle/SEgoogle2001/SE2027Aug02Tgoogle.html" },
      { label: "National Solar Observatory: 2027 Eclipse Map", url: "https://nso.edu/eclipse-map-2027-aug2/" },
      { label: "NASA: Eclipse Viewing Safety", url: "https://science.nasa.gov/eclipses/safety/" }
    ],
    relatedPaths: [{ label: "Understand solar eclipse geometry", href: "/guides/solar-eclipses-and-eye-safety" }, { label: "Browse space events", href: "/events" }]
  },
  {
    slug: "photograph-a-meteor-shower", publishedAt: "2026-11-17",
    title: "How to Photograph a Meteor Shower With a Camera",
    description: "Set up a wide lens and a continuous exposure sequence, then distinguish likely meteors from aircraft and satellites.",
    category: "Skywatching", tags: ["Meteor photography", "Astrophotography", "Wide lens", "Camera settings"],
    sources: [
      { label: "NASA: How to Photograph a Meteor Shower", url: "https://science.nasa.gov/solar-system/meteors-meteorites/how-to-photograph-a-meteor-shower/" },
      { label: "NASA: Meteor Showers", url: "https://science.nasa.gov/solar-system/meteors-meteorites/meteor-showers/" }
    ],
    relatedPaths: [{ label: "Try a phone setup", href: "/guides/photographing-the-night-sky-with-a-phone" }, { label: "Plan for the Geminids", href: "/guides/geminid-meteor-shower-2026" }]
  },
  {
    slug: "how-to-find-andromeda-galaxy", publishedAt: "2026-11-17",
    title: "How to Find the Andromeda Galaxy With Binoculars",
    description: "Follow a short hop from the Great Square of Pegasus to M31 and recognize the faint glow through binoculars.",
    category: "Skywatching", tags: ["Andromeda Galaxy", "M31", "Binoculars", "Star hopping"],
    sources: [
      { label: "NASA Night Sky Network: Finding Andromeda", url: "https://nightsky.jpl.nasa.gov/documents/918/Oct24_Andromeda_Refresh_20240917_123354.pdf" },
      { label: "NASA Hubble: Messier 31", url: "https://science.nasa.gov/mission/hubble/science/explore-the-night-sky/hubble-messier-catalog/messier-31/" }
    ],
    relatedPaths: [{ label: "Choose a binocular field", href: "/guides/binoculars-for-stargazing" }, { label: "See another binocular target", href: "/guides/how-to-find-pleiades" }]
  },
  {
    slug: "how-to-find-orion-nebula", publishedAt: "2026-11-17",
    title: "How to Find the Orion Nebula Below Orion's Belt",
    description: "Use Orion's Belt and Sword to locate M42, then know what detail to expect with eyes, binoculars, or a small telescope.",
    category: "Skywatching", tags: ["Orion Nebula", "M42", "Orion's Belt", "Trapezium"],
    sources: [
      { label: "NASA: Discovering Orion", url: "https://science.nasa.gov/universe/stories/quick-reads/discovering-the-universe-through-the-constellation-orion/" },
      { label: "NASA Hubble: Messier 42", url: "https://science.nasa.gov/mission/hubble/science/explore-the-night-sky/hubble-messier-catalog/messier-42/" }
    ],
    relatedPaths: [{ label: "Estimate your telescope's field", href: "/guides/telescope-field-of-view" }, { label: "Trace the Belt to Sirius", href: "/guides/how-to-find-sirius" }]
  },
  {
    slug: "how-to-find-pleiades", publishedAt: "2026-11-17",
    title: "How to Find the Pleiades: The Seven Sisters in Taurus",
    description: "Identify the compact M45 cluster, tell it apart from the Little Dipper, and choose a wide enough binocular view.",
    category: "Skywatching", tags: ["Pleiades", "Seven Sisters", "M45", "Taurus", "Binoculars"],
    sources: [
      { label: "NASA Night Sky Network: Hyades and Pleiades", url: "https://science.nasa.gov/solar-system/skywatching/night-sky-network/spot-the-young-stars-of-the-hyades-and-pleiades/" },
      { label: "NASA Hubble: Messier 45", url: "https://science.nasa.gov/mission/hubble/science/explore-the-night-sky/hubble-messier-catalog/messier-45/" }
    ],
    relatedPaths: [{ label: "Learn how open clusters form", href: "/guides/open-and-globular-star-clusters" }, { label: "Choose a wide field of view", href: "/guides/telescope-field-of-view" }]
  },
  {
    slug: "how-to-find-sirius", publishedAt: "2026-11-17",
    title: "How to Find Sirius, the Brightest Star in the Night Sky",
    description: "Use Orion's Belt to identify Sirius and tell an intensely twinkling star from a bright planet.",
    category: "Skywatching", tags: ["Sirius", "Dog Star", "Canis Major", "Orion's Belt", "White dwarf"],
    sources: [
      { label: "NASA: Skywatching FAQ and Stellar Brightness", url: "https://science.nasa.gov/skywatching/faq/" },
      { label: "ESA/Hubble: Sirius A and Sirius B", url: "https://esahubble.org/images/heic0516a/" },
      { label: "NASA: Orion Constellation", url: "https://science.nasa.gov/asset/hubble/orion-constellation/" }
    ],
    relatedPaths: [{ label: "Find the Orion Nebula", href: "/guides/how-to-find-orion-nebula" }, { label: "Understand why stars twinkle", href: "/guides/why-stars-twinkle-and-seeing" }]
  },
  {
    slug: "best-time-to-see-milky-way", publishedAt: "2026-11-17",
    title: "When Is the Best Time to See the Milky Way?",
    description: "Find the overlap between a dark sky, a low Moon, and a high Galactic center instead of relying on a universal month.",
    category: "Skywatching", tags: ["Milky Way season", "Galactic center", "Sagittarius", "Dark sky"],
    sources: [
      { label: "NASA Night Sky Network: The Great Rift", url: "https://science.nasa.gov/solar-system/skywatching/night-sky-network/augusts-night-sky-notes-the-great-rift/" },
      { label: "NASA: Skywatching FAQ", url: "https://science.nasa.gov/skywatching/faq/" },
      { label: "NASA Goddard: Night Sky Questions", url: "https://imagine.gsfc.nasa.gov/ask_astro/night_sky.html" }
    ],
    relatedPaths: [{ label: "Choose a darker site", href: "/guides/light-pollution-and-dark-skies" }, { label: "Know when twilight ends", href: "/guides/twilight-civil-nautical-astronomical" }]
  },
  {
    slug: "how-to-see-mercury", publishedAt: "2026-11-17",
    title: "How to See Mercury After Sunset or Before Sunrise",
    description: "Find Mercury in twilight by checking its elongation, local altitude, and the direction of the horizon.",
    category: "Skywatching", tags: ["Mercury", "Planet spotting", "Elongation"],
    sources: [
      { label: "NASA Mercury facts", url: "https://science.nasa.gov/mercury/facts/" },
      { label: "NASA Goddard: Mercury and elongation", url: "https://spdf.gsfc.nasa.gov/pub/documents/archived_websites/pwg.gsfc.nasa.gov/stargaze/Smercury.htm" }
    ],
    relatedPaths: [{ label: "Read altitude and azimuth", href: "/guides/sky-coordinates-altitude-and-azimuth" }, { label: "Understand the stages of twilight", href: "/guides/twilight-civil-nautical-astronomical" }]
  },
  {
    slug: "why-moon-visible-during-day", publishedAt: "2026-11-17",
    title: "Why Can You See the Moon During the Day?",
    description: "Learn why the Moon is visible in daylight and which phases are easiest to look for in the morning or afternoon.",
    category: "Moon", tags: ["Daytime Moon", "Moon phases", "First quarter"],
    sources: [
      { label: "NASA: Why can you see the Moon during the day?", url: "https://www.nasa.gov/solar-system/why-can-you-see-the-moon-during-the-day-we-asked-a-nasa-scientist-episode-19/" },
      { label: "NASA Moon phases", url: "https://science.nasa.gov/moon/moon-phases/" }
    ],
    relatedPaths: [{ label: "Explore Moon phases", href: "/moon" }, { label: "Read moonrise and moonset times", href: "/guides/moonrise-moonset-and-local-time" }]
  },
  {
    slug: "what-is-a-blue-moon", publishedAt: "2026-11-17",
    title: "What Is a Blue Moon? Two Definitions, No Color Change",
    description: "Understand calendar and seasonal blue moons, and why the date can differ with your time zone.",
    category: "Moon", tags: ["Blue Moon", "Full Moon", "Time zones"],
    sources: [
      { label: "NASA: Super blue moons explained", url: "https://science.nasa.gov/solar-system/moon/super-blue-moons-your-questions-answered/" },
      { label: "US Naval Observatory Moon phase tables", url: "https://aa.usno.navy.mil/data/MoonPhases" }
    ],
    relatedPaths: [{ label: "Understand Moon phases", href: "/guides/understanding-moon-phases" }, { label: "Moon illusion and supermoons", href: "/guides/moon-illusion-and-supermoons" }]
  },
  {
    slug: "how-to-see-zodiacal-light", publishedAt: "2026-11-17",
    title: "How to See Zodiacal Light Before Dawn or After Dusk",
    description: "Find the faint cone of sunlight scattered by interplanetary dust and tell it apart from twilight or city glow.",
    category: "Skywatching", tags: ["Zodiacal light", "Dark skies", "Ecliptic"],
    sources: [
      { label: "NASA Night Sky Network: Night lights", url: "https://science.nasa.gov/solar-system/skywatching/night-sky-network/nsn-night-lights/" },
      { label: "ESO zodiacal glow over Paranal", url: "https://www.hq.eso.org/public/images/potw1348a/" }
    ],
    relatedPaths: [{ label: "Plan a Milky Way session", href: "/guides/best-time-to-see-milky-way" }, { label: "Check astronomical twilight", href: "/guides/twilight-civil-nautical-astronomical" }]
  },
  {
    slug: "earth-shadow-and-belt-of-venus", publishedAt: "2026-11-17",
    title: "How to See Earth's Shadow and the Belt of Venus",
    description: "Look opposite the setting Sun for a blue-gray shadow and the pink twilight arch above it. No telescope needed.",
    category: "Skywatching", tags: ["Belt of Venus", "Earth's shadow", "Twilight"],
    sources: [
      { label: "ESO: The Belt of Venus", url: "https://www.eso.org/public/images/potw1331a/" },
      { label: "ESO: Twilight over Paranal", url: "https://www.hq.eso.org/public/images/potw1251a/" }
    ],
    relatedPaths: [{ label: "Learn the stages of twilight", href: "/guides/twilight-civil-nautical-astronomical" }, { label: "Find the zodiacal light", href: "/guides/how-to-see-zodiacal-light" }]
  },
  {
    slug: "starlink-train-lights-in-sky", publishedAt: "2026-11-17",
    title: "A Line of Lights in the Sky? How to Identify a Starlink Train",
    description: "Tell a satellite train from aircraft lights and meteors, and check whether a pass matches what you saw.",
    category: "Skywatching", tags: ["Starlink", "Satellite train", "Twilight"],
    sources: [
      { label: "FCC: Starlink satellite brightness and deployment", url: "https://docs.fcc.gov/public/attachments/DA-26-36A1.pdf" },
      { label: "AARO: Satellite reflections and observed Starlink trains", url: "https://www.aaro.mil/Portals/136/PDFs/Information%20Papers/AARO_Satellite_Flaring_Paper.pdf" },
      { label: "Heavens-Above: Observing location and Starlink passes", url: "https://www.heavens-above.com/" }
    ],
    relatedPaths: [{ label: "Find an International Space Station pass", href: "/guides/how-to-spot-the-space-station" }, { label: "Understand satellite deployment", href: "/guides/rocket-stages-fairings-and-deployment" }]
  },
  {
    slug: "why-comet-brightness-is-hard-to-predict", publishedAt: "2026-11-17",
    title: "Will That Comet Be Visible? How to Read a Brightness Forecast",
    description: "Learn why comet brightness can surprise observers and how to check elongation, altitude, twilight, and recent reports.",
    category: "Skywatching", tags: ["Comets", "Brightness forecasts", "Magnitude", "Elongation"],
    sources: [
      { label: "NASA: When and how to spot comet 12P/Pons-Brooks", url: "https://www.nasa.gov/blogs/watch-the-skies/2024/04/05/when-and-how-to-spot-the-devil-comet/" },
      { label: "NASA: Observing comet Tsuchinshan-ATLAS", url: "https://www.nasa.gov/blogs/watch-the-skies/2024/10/02/ancient-oort-cloud-comet-to-make-first-documented-pass-by-earth-in-mid-october/" }
    ],
    relatedPaths: [{ label: "Why comet tails point away from the Sun", href: "/guides/why-comets-have-tails" }, { label: "Read the magnitude scale", href: "/guides/stellar-magnitudes-and-brightness" }]
  },
  {
    slug: "why-webb-stars-have-eight-spikes", publishedAt: "2026-11-17",
    title: "Why Do Stars in Webb Images Have Eight Spikes?",
    description: "See how Webb's hexagonal mirror and support struts leave six bright spikes and two fainter ones around point sources.",
    category: "Astronomy Basics", tags: ["James Webb Space Telescope", "Diffraction spikes", "Optics"],
    sources: [
      { label: "NASA and STScI: Webb's diffraction spikes", url: "https://science.nasa.gov/asset/webb/webbs-diffraction-spikes/" },
      { label: "NASA: About Webb images", url: "https://science.nasa.gov/mission/webb/multimedia/about-webb-images/" }
    ],
    relatedPaths: [{ label: "Compare Webb and Hubble", href: "/guides/webb-and-hubble-compared" }, { label: "Practice with Astroboat's gallery", href: "/gallery" }]
  },
  {
    slug: "europa-and-enceladus-oceans", publishedAt: "2026-11-17",
    title: "Europa and Enceladus: How Do We Know They Have Oceans?",
    description: "Compare the magnetic evidence at Europa with the plume and wobble evidence at Enceladus, and see what it says about habitability.",
    category: "Astronomy Basics", tags: ["Europa", "Enceladus", "Ocean worlds", "Cassini", "Galileo"],
    sources: [
      { label: "NASA Europa Clipper: Why Europa?", url: "https://science.nasa.gov/mission/europa-clipper/why-europa-overview/" },
      { label: "NASA Cassini: Enceladus", url: "https://science.nasa.gov/mission/cassini/science/enceladus/" },
      { label: "NASA: Evidence for possible Europa plumes", url: "https://www.nasa.gov/missions/are-water-plumes-spraying-from-europa-nasas-europa-clipper-is-on-the-case/" }
    ],
    relatedPaths: [{ label: "Observe Jupiter's moons", href: "/guides/observing-jupiter-and-its-moons" }, { label: "What a habitable zone means", href: "/guides/what-the-habitable-zone-means" }]
  },
  {
    slug: "how-gps-finds-your-location", publishedAt: "2026-11-17",
    title: "How GPS Finds Your Location and Why It Drifts Near Buildings",
    description: "Follow the timing measurements that locate your phone, and learn how reflected signals and poor satellite geometry move the map dot.",
    category: "Missions", tags: ["GPS", "Satellite navigation", "Timing", "Multipath"],
    sources: [
      { label: "NIST: How GPS measures location", url: "https://www.nist.gov/how-do-you-measure-it/how-do-you-measure-your-location-using-gps" },
      { label: "FAA: How GPS works", url: "https://www.faa.gov/about/office_org/headquarters_offices/ato/service_units/techops/navservices/gnss/gps/howitworks" },
      { label: "GPS.gov: Factors that affect accuracy", url: "https://archive.gps.gov/systems/gps/performance/accuracy/" }
    ],
    relatedPaths: [{ label: "Compare weather satellite orbits", href: "/guides/weather-satellite-orbits" }, { label: "Understand light travel time", href: "/guides/deep-space-communication-and-light-delay" }]
  },
  {
    slug: "why-is-space-black", publishedAt: "2026-11-20",
    title: "Why Is Space Black If There Are So Many Stars?",
    description: "Two different questions explain the dark sky: why sunlight does not fill a vacuum with blue, and why distant stars do not light every direction.",
    category: "Astronomy Basics", tags: ["Dark sky","Olbers' paradox","Scattered light"],
    sources: [
      { label: "NASA StarChild: Why is space black?", url: "https://starchild.gsfc.nasa.gov/docs/StarChild/questions/question52.html" },
      { label: "NASA John Mather: Cosmology FAQ (archive)", url: "https://lhea.gsfc.nasa.gov/archive/mather/faq/cosmology.html" },
      { label: "NASA: Cosmic microwave background", url: "https://science.nasa.gov/mission/wmap/wmap-overview/" }
    ],
    relatedPaths: [
      { label: "Understand the cosmic microwave background", href: "/guides/cosmic-microwave-background" },
      { label: "Read what space expands into", href: "/guides/what-is-the-universe-expanding-into" },
      { label: "How stars produce light", href: "/guides/how-stars-are-born-and-die" }
    ]
  },
  {
    slug: "can-sound-travel-through-space", publishedAt: "2026-11-20",
    title: "Can Sound Travel Through Space?",
    description: "Sound needs matter, but space is not empty everywhere. Learn why astronauts use radios and what NASA's black-hole recordings actually represent.",
    category: "Space Science", tags: ["Sound in space","Sonification","Pressure waves","Radio"],
    sources: [
      { label: "NASA: Black-hole data sonifications", url: "https://science.nasa.gov/science-research/astrophysics/data-sonifications/" },
      { label: "Chandra: How the M87 sonification works", url: "https://chandra.harvard.edu/sound/m87.html" },
      { label: "NASA: Space data sonification", url: "https://science.nasa.gov/open-science/astronomy-data-sonification/" }
    ],
    relatedPaths: [
      { label: "Can astronauts smell space?", href: "/guides/what-does-space-smell-like" },
      { label: "Read why space looks black", href: "/guides/why-is-space-black" },
      { label: "Understand radio communication", href: "/guides/deep-space-communication-and-light-delay" },
      { label: "Explore black holes", href: "/guides/black-holes-explained" }
    ]
  },
  {
    slug: "why-is-space-cold", publishedAt: "2026-11-20",
    title: "Why Is Space Cold If the Sun Is So Hot?",
    description: "Space has no single everyday temperature. Learn how sunlight, radiation, shade, and thin gas determine whether an object heats up or cools down.",
    category: "Space Science", tags: ["Temperature","Heat transfer","Thermal radiation","Vacuum"],
    sources: [
      { label: "NASA Cosmicopia: Heat and temperature in space", url: "https://science.gsfc.nasa.gov/attic/cosmicopia.gsfc.nasa.gov/qa_sp_ht.html" },
      { label: "NASA: Spacecraft thermal control", url: "https://science.nasa.gov/learn/basics-of-space-flight/chapter11-4/" },
      { label: "NASA: Cosmic microwave background", url: "https://science.nasa.gov/mission/wmap/wmap-overview/" }
    ],
    relatedPaths: [
      { label: "Read why space is black", href: "/guides/why-is-space-black" },
      { label: "Understand the Sun's light", href: "/guides/what-color-is-the-sun" },
      { label: "Why Venus is hotter than Mercury", href: "/guides/why-is-venus-hotter-than-mercury" }
    ]
  },
  {
    slug: "what-is-inside-a-black-hole", publishedAt: "2026-11-20",
    title: "What Is Inside a Black Hole? What Physics Can Tell Us",
    description: "Separate the event horizon, tidal forces, and the predicted singularity from the parts of a black-hole interior that science has not established.",
    category: "Deep Space", tags: ["Event horizon","Singularity","General relativity","Black holes"],
    sources: [
      { label: "NASA: Anatomy of a black hole", url: "https://science.nasa.gov/universe/black-holes/anatomy/" },
      { label: "NASA: Ten black-hole questions", url: "https://science.nasa.gov/solar-system/10-questions-you-might-have-about-black-holes/" },
      { label: "NASA: Black-hole questions on infalling observers", url: "https://science.nasa.gov/apod/frequently-asked-questions-faqs-on-black-holes/" }
    ],
    relatedPaths: [
      { label: "Start with black-hole basics", href: "/guides/black-holes-explained" },
      { label: "Could a black hole swallow Earth?", href: "/guides/can-a-black-hole-swallow-earth" },
      { label: "Are wormholes real?", href: "/guides/are-wormholes-real" }
    ]
  },
  {
    slug: "can-a-black-hole-swallow-earth", publishedAt: "2026-11-20",
    title: "Could a Black Hole Swallow Earth?",
    description: "Black holes are not cosmic vacuum cleaners. Understand how mass, distance, and an object's orbit matter more than the frightening name.",
    category: "Deep Space", tags: ["Black-hole gravity","Earth","Orbits","Sagittarius A*"],
    sources: [
      { label: "NASA: Black-hole overview and misconceptions", url: "https://science.nasa.gov/universe/black-holes/" },
      { label: "NASA: Ten black-hole questions", url: "https://science.nasa.gov/solar-system/10-questions-you-might-have-about-black-holes/" },
      { label: "NASA: Black-hole anatomy and accretion disks", url: "https://science.nasa.gov/universe/black-holes/anatomy/" }
    ],
    relatedPaths: [
      { label: "Read black-hole basics", href: "/guides/black-holes-explained" },
      { label: "What is inside a black hole?", href: "/guides/what-is-inside-a-black-hole" },
      { label: "Why the Sun will not become a black hole", href: "/guides/will-the-sun-become-a-black-hole" }
    ]
  },
  {
    slug: "are-wormholes-real", publishedAt: "2026-11-20",
    title: "Are Wormholes Real, or Just Science Fiction?",
    description: "Wormholes appear in mathematical models, but none has been confirmed. Learn why a black hole or quantum experiment is not a usable space tunnel.",
    category: "Deep Space", tags: ["Wormholes","Einstein-Rosen bridge","Quantum models","Spacetime"],
    sources: [
      { label: "Einstein Online: Wormholes", url: "https://www.einstein-online.info/en/explandict/Wormhole/" },
      { label: "Caltech: Questions about the 2022 wormhole experiment", url: "https://inqnet.caltech.edu/wormhole2022/" },
      { label: "NASA: What black holes are not", url: "https://science.nasa.gov/universe/black-holes/" }
    ],
    relatedPaths: [
      { label: "What is inside a black hole?", href: "/guides/what-is-inside-a-black-hole" },
      { label: "Understand gravitational waves", href: "/guides/gravitational-waves-and-ligo" },
      { label: "Read about the universe's expansion", href: "/guides/what-is-the-universe-expanding-into" }
    ]
  },
  {
    slug: "what-is-the-universe-expanding-into", publishedAt: "2026-11-20",
    title: "What Is the Universe Expanding Into?",
    description: "Cosmic expansion does not require an outside room. Understand growing distances, the limits of the balloon analogy, and what telescopes measure.",
    category: "Deep Space", tags: ["Cosmic expansion","Spacetime","Scale factor","Big Bang"],
    sources: [
      { label: "NASA John Mather: Cosmology FAQ (archive)", url: "https://lhea.gsfc.nasa.gov/archive/mather/faq/cosmology.html" },
      { label: "NASA Webb: Big Bang questions with John Mather", url: "https://science.nasa.gov/mission/webb/big-bang-q-and-a/" },
      { label: "NASA Webb: Studying the early universe", url: "https://science.nasa.gov/mission/webb/early-universe/" }
    ],
    relatedPaths: [
      { label: "Does the universe have a center?", href: "/guides/does-the-universe-have-a-center" },
      { label: "Read redshift and lookback time", href: "/guides/cosmological-redshift-and-lookback-time" },
      { label: "Dark matter versus dark energy", href: "/guides/dark-matter-vs-dark-energy" }
    ]
  },
  {
    slug: "does-the-universe-have-a-center", publishedAt: "2026-11-20",
    title: "Does the Universe Have a Center?",
    description: "Earth is central to our observable horizon, not necessarily to space. See why expansion looks similar from other galaxies without a central blast site.",
    category: "Deep Space", tags: ["Center of the universe","Observable universe","Expansion","Cosmology"],
    sources: [
      { label: "NASA Webb: The Big Bang did not have a central location", url: "https://science.nasa.gov/mission/webb/big-bang-q-and-a/" },
      { label: "NASA John Mather: Cosmology FAQ (archive) and expansion", url: "https://lhea.gsfc.nasa.gov/archive/mather/faq/cosmology.html" },
      { label: "NASA Imagine the Universe: Cosmology questions", url: "https://imagine.gsfc.nasa.gov/ask_astro/cosmology.html" }
    ],
    relatedPaths: [
      { label: "What is the universe expanding into?", href: "/guides/what-is-the-universe-expanding-into" },
      { label: "What came before the Big Bang?", href: "/guides/what-was-before-the-big-bang" },
      { label: "Learn about the microwave background", href: "/guides/cosmic-microwave-background" }
    ]
  },
  {
    slug: "what-was-before-the-big-bang", publishedAt: "2026-11-20",
    title: "What Was Before the Big Bang? What We Actually Know",
    description: "The hot Big Bang describes an early cosmic history, not a confirmed answer to ultimate origins. Separate evidence, inflation models, and speculation.",
    category: "Deep Space", tags: ["Big Bang","Cosmic inflation","Origins","Early universe"],
    sources: [
      { label: "NASA Webb: Early-universe science and inflation", url: "https://science.nasa.gov/mission/webb/early-universe/" },
      { label: "NASA WMAP: Limits of the Big Bang model", url: "https://lhea.gsfc.nasa.gov/archive/mather/faq/cosmology.html" },
      { label: "NASA Hubble: Evidence for the Big Bang", url: "https://science.nasa.gov/mission/hubble/science/science-behind-the-discoveries/hubble-big-bang/" }
    ],
    relatedPaths: [
      { label: "Does the universe have a center?", href: "/guides/does-the-universe-have-a-center" },
      { label: "Read the cosmic microwave background", href: "/guides/cosmic-microwave-background" },
      { label: "What is space expanding into?", href: "/guides/what-is-the-universe-expanding-into" }
    ]
  },
  {
    slug: "dark-matter-vs-dark-energy", publishedAt: "2026-11-20",
    title: "Dark Matter vs. Dark Energy: What Is the Difference?",
    description: "Dark matter helps explain gravitational structure; dark energy describes accelerated expansion. Compare the evidence without treating either as a known substance.",
    category: "Deep Space", tags: ["Dark matter","Dark energy","Gravitational lensing","Cosmic acceleration"],
    sources: [
      { label: "NASA: What dark matter means", url: "https://science.nasa.gov/dark-matter/" },
      { label: "NASA: Investigating dark energy", url: "https://science.nasa.gov/astrophysics/programs/physics-of-the-cosmos/expand-our-knowledge-of-dark-energy/" },
      { label: "ESA: Dark matter and dark energy", url: "https://www.esa.int/Science_Exploration/Space_Science/What_are_dark_matter_and_dark_energy" }
    ],
    relatedPaths: [
      { label: "What is the universe expanding into?", href: "/guides/what-is-the-universe-expanding-into" },
      { label: "Read cosmic redshift and lookback time", href: "/guides/cosmological-redshift-and-lookback-time" },
      { label: "Understand galaxy structure", href: "/guides/galaxies-and-our-milky-way" }
    ]
  },
  {
    slug: "will-the-sun-become-a-black-hole", publishedAt: "2026-11-20",
    title: "Will the Sun Become a Black Hole?",
    description: "No: the Sun will leave a white dwarf, not a black hole. Follow the red-giant stage, mass loss, and the difference between shrinking and collapsing.",
    category: "Space Science", tags: ["Sun's future","White dwarf","Red giant","Stellar evolution"],
    sources: [
      { label: "NASA: Why the Sun will not become a black hole", url: "https://www.nasa.gov/image-article/why-sun-wont-become-black-hole/" },
      { label: "NASA: Sun facts and lifetime", url: "https://science.nasa.gov/sun/facts/" },
      { label: "NASA: The lives of stars", url: "https://science.nasa.gov/universe/stars/" }
    ],
    relatedPaths: [
      { label: "How stars are born and die", href: "/guides/how-stars-are-born-and-die" },
      { label: "Why planetary nebulae are not planets", href: "/guides/planetary-nebulae-not-planets" },
      { label: "Could a black hole swallow Earth?", href: "/guides/can-a-black-hole-swallow-earth" }
    ]
  },
  {
    slug: "what-color-is-the-sun", publishedAt: "2026-11-20",
    title: "What Color Is the Sun: White, Yellow, or Something Else?",
    description: "Sunlight contains a broad mix of visible colors. Learn why the Sun looks white from space, warmer near the horizon, and different in observatory images.",
    category: "Astronomy Basics", tags: ["Sunlight","Star colors","Atmospheric scattering","Solar images"],
    sources: [
      { label: "NASA HEAT: Portrayals of the Sun in art", url: "https://science.nasa.gov/learn/heat/resource/hby-math-7-portrayals-of-the-sun-in-art/" },
      { label: "NASA: Why observe the Sun in different colors?", url: "https://svs.gsfc.nasa.gov/vis/a010000/a013800/a013859/script_31299_00.html" },
      { label: "NASA: Eclipse viewing safety", url: "https://science.nasa.gov/eclipses/safety/" }
    ],
    relatedPaths: [
      { label: "Why are there no green stars?", href: "/guides/why-are-there-no-green-stars" },
      { label: "Read space-image colors", href: "/guides/how-to-read-space-images" },
      { label: "Learn safe solar viewing", href: "/guides/solar-eclipses-and-eye-safety" }
    ]
  },
  {
    slug: "why-is-venus-hotter-than-mercury", publishedAt: "2026-11-20",
    title: "Why Is Venus Hotter Than Mercury?",
    description: "Distance from the Sun is only part of a planet's temperature. Compare Venus's thick atmosphere with Mercury's nearly airless, hot-and-cold surface.",
    category: "Solar System", tags: ["Venus","Mercury","Greenhouse effect","Planetary temperatures"],
    sources: [
      { label: "NASA: Venus facts", url: "https://science.nasa.gov/venus/venus-facts/" },
      { label: "NASA: Mercury facts", url: "https://science.nasa.gov/mercury/facts/" },
      { label: "NASA: Temperatures across the solar system", url: "https://science.nasa.gov/solar-system/temperatures-across-our-solar-system/" }
    ],
    relatedPaths: [
      { label: "What makes a planet potentially habitable?", href: "/guides/what-the-habitable-zone-means" },
      { label: "Why space can be hot or cold", href: "/guides/why-is-space-cold" },
      { label: "How to see Mercury", href: "/guides/how-to-see-mercury" }
    ]
  },
  {
    slug: "can-you-land-on-jupiter", publishedAt: "2026-11-20",
    title: "Can You Land on Jupiter? Does It Have a Surface?",
    description: "Jupiter has no ground beneath its clouds like Earth's. Follow what changes as a probe descends, and why a dense core does not provide a landing site.",
    category: "Solar System", tags: ["Jupiter","Gas giant","Galileo probe","Metallic hydrogen"],
    sources: [
      { label: "NASA: Jupiter facts and interior", url: "https://science.nasa.gov/jupiter/jupiter-facts/" },
      { label: "NASA: Galileo atmospheric probe", url: "https://science.nasa.gov/mission/galileo-jupiter-atmospheric-probe/" }
    ],
    relatedPaths: [
      { label: "Observe Jupiter and its moons", href: "/guides/observing-jupiter-and-its-moons" },
      { label: "Would Saturn float in water?", href: "/guides/would-saturn-float-in-water" },
      { label: "Europa and Enceladus ocean evidence", href: "/guides/europa-and-enceladus-oceans" }
    ]
  },
  {
    slug: "would-saturn-float-in-water", publishedAt: "2026-11-20",
    title: "Would Saturn Really Float in Water?",
    description: "The famous bathtub fact compares average densities, not a realistic experiment. Learn what it says about Saturn and what the comparison leaves out.",
    category: "Solar System", tags: ["Saturn","Density","Buoyancy","Gas giants"],
    sources: [
      { label: "NASA: Saturn facts", url: "https://science.nasa.gov/saturn/facts/" },
      { label: "NASA Cassini: Saturn questions", url: "https://science.nasa.gov/mission/cassini/faq/" },
      { label: "NASA Cassini: Density reference", url: "https://science.nasa.gov/wp-content/uploads/2023/09/cassini-arrival-1.pdf" }
    ],
    relatedPaths: [
      { label: "Why Jupiter has no landing surface", href: "/guides/can-you-land-on-jupiter" },
      { label: "See Saturn's rings", href: "/guides/saturn-rings-and-changing-views" },
      { label: "Why planets are nearly round", href: "/guides/why-are-planets-round" }
    ]
  },
  {
    slug: "why-is-the-moon-moving-away", publishedAt: "2026-11-20",
    title: "Why Is the Moon Moving Away From Earth?",
    description: "Laser measurements show the Moon's orbit slowly widening. Understand the tidal energy exchange, why Earth's day changes, and why the current rate is not eternal.",
    category: "Moon", tags: ["Lunar recession","Laser ranging","Tides","Angular momentum"],
    sources: [
      { label: "NASA: The Apollo experiment that keeps on giving", url: "https://www.nasa.gov/missions/apollo/apollo-11/the-apollo-experiment-that-keeps-on-giving/" },
      { label: "NASA: Tidal locking and orbital evolution", url: "https://science.nasa.gov/moon/tidal-locking/" },
      { label: "NASA Eclipse: Lunar secular acceleration", url: "https://eclipse.gsfc.nasa.gov/LEcat5/secular.html" }
    ],
    relatedPaths: [
      { label: "Could our Moon have a moon?", href: "/guides/can-moons-have-moons" },
      { label: "Why the Moon causes tides", href: "/guides/why-the-moon-causes-tides" },
      { label: "Why we see the same lunar face", href: "/guides/why-the-moon-has-a-far-side" },
      { label: "Read lunar distance and apparent size", href: "/guides/moon-illusion-and-supermoons" }
    ]
  },
  {
    slug: "why-are-there-no-green-stars", publishedAt: "2026-11-20",
    title: "Why Are There No Green Stars?",
    description: "Stars emit green light, but that rarely makes them look green. Learn how a broad thermal spectrum differs from a single-color lamp or a colored nebula.",
    category: "Astronomy Basics", tags: ["Green stars","Stellar colors","Blackbody radiation","Color perception"],
    sources: [
      { label: "NASA Ames: Stellar colors and the green-star question", url: "https://www.nasa.gov/space-science-and-astrobiology-at-ames/interesting-fact-of-the-month-current/interesting-fact-of-the-month-2020/" },
      { label: "NASA Webb: Continuous stellar spectra", url: "https://science.nasa.gov/asset/webb/continuous-spectra-blackbody-curves-of-stars/" },
      { label: "NASA: Why solar images use different colors", url: "https://svs.gsfc.nasa.gov/vis/a010000/a013800/a013859/script_31299_00.html" }
    ],
    relatedPaths: [
      { label: "What color is the Sun?", href: "/guides/what-color-is-the-sun" },
      { label: "Read a stellar spectrum", href: "/guides/spectroscopy-reading-starlight" },
      { label: "Why planetary nebulae are not planets", href: "/guides/planetary-nebulae-not-planets" }
    ]
  },
  {
    slug: "why-are-planets-round", publishedAt: "2026-11-20",
    title: "Why Are Planets Round but Many Asteroids Are Not?",
    description: "Gravity reshapes large worlds, while material strength preserves small bodies' bumps. Learn why size, composition, rotation, and history all matter.",
    category: "Astronomy Basics", tags: ["Planet shapes","Hydrostatic equilibrium","Asteroids","Gravity"],
    sources: [
      { label: "NASA Space Place: Why are planets round?", url: "https://spaceplace.nasa.gov/planets-round/en/" },
      { label: "NASA Space Place: Small-body shapes and composition", url: "https://spaceplace.nasa.gov/review/posters/small-bodies/small-bodies-factsheet.pdf" },
      { label: "NASA: What is a planet?", url: "https://science.nasa.gov/solar-system/planets/what-is-a-planet/" }
    ],
    relatedPaths: [
      { label: "Pluto, Ceres, and dwarf planets", href: "/guides/dwarf-planets-pluto-and-ceres" },
      { label: "How asteroid rotation is measured", href: "/guides/asteroid-light-curves-and-rotation" },
      { label: "Would Saturn float in water?", href: "/guides/would-saturn-float-in-water" }
    ]
  },
  {
    slug: "what-happens-when-galaxies-collide", publishedAt: "2026-11-20",
    title: "What Happens When Two Galaxies Collide?",
    description: "Galaxy collisions can rearrange orbits and trigger star birth without most stars hitting each other. Learn what images show and what simulations infer.",
    category: "Deep Space", tags: ["Galaxy collisions","Mergers","Starbursts","Andromeda"],
    sources: [
      { label: "NASA: How galaxies evolve", url: "https://science.nasa.gov/universe/galaxies/evolution/" },
      { label: "NASA and ESA: The colliding galaxies NGC 6052", url: "https://science.nasa.gov/missions/hubble/hubbles-dazzling-display-of-2-colliding-galaxies/" },
      { label: "NASA Hubble: Uncertainty in the Milky Way-Andromeda encounter", url: "https://science.nasa.gov/missions/hubble/apocalypse-when-hubble-casts-doubt-on-certainty-of-galactic-collision/" }
    ],
    relatedPaths: [
      { label: "Understand the Milky Way and other galaxies", href: "/guides/galaxies-and-our-milky-way" },
      { label: "Find Andromeda in the sky", href: "/guides/how-to-find-andromeda-galaxy" },
      { label: "How gravitational waves reveal mergers", href: "/guides/gravitational-waves-and-ligo" }
    ]
  },
  {
    slug: "can-tidally-locked-planets-support-life", publishedAt: "2026-11-20",
    title: "Could Life Exist on a Tidally Locked Planet?",
    description: "Permanent day and night do not automatically rule out habitability. Explore how air, oceans, clouds, and stellar activity affect the possible climates.",
    category: "Space Science", tags: ["Tidally locked planets","Habitability","Exoplanet climates","Red dwarfs"],
    sources: [
      { label: "NASA: Exoplanet terminology and tidal locking", url: "https://science.nasa.gov/exoplanets/glossary/" },
      { label: "Yang and colleagues: Ocean dynamics on tidally locked worlds", url: "https://arxiv.org/abs/1902.02103" },
      { label: "Yang, Cowan, and Abbot: Cloud feedback on locked planets", url: "https://arxiv.org/abs/1307.0515" },
      { label: "NASA: Conditions for planetary habitability", url: "https://science.nasa.gov/astrobiology/learning-resources/alp/if-a-planet-can-have-life/" }
    ],
    relatedPaths: [
      { label: "What the habitable zone really means", href: "/guides/what-the-habitable-zone-means" },
      { label: "How we discover exoplanets", href: "/guides/how-we-find-exoplanets" },
      { label: "Ocean worlds beyond Earth", href: "/guides/europa-and-enceladus-oceans" }
    ]
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
