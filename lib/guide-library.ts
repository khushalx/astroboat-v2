import type { Guide } from "@/lib/guides";

type GuideEntry = Pick<Guide, "slug" | "title" | "description" | "category" | "tags" | "sections" | "sources" | "relatedPaths">;

const entries: GuideEntry[] = [
  {
    slug: "understanding-moon-phases",
    title: "Moon Phases: Why the Moon Changes Shape",
    description: "Understand waxing, waning, quarter phases, and illumination so you can make sense of the Moon at a glance.",
    category: "Moon",
    tags: ["Moon phases", "Illumination", "Waxing", "Waning"],
    sections: [
      { id: "sunlight", heading: "One Moon, changing sunlight", paragraphs: [
        "The Moon reflects sunlight. As it travels around Earth, we see different portions of its sunlit half. A crescent is not a partly missing Moon: most of the hemisphere facing us is simply experiencing lunar night. Earth's shadow causes lunar eclipses, not the ordinary monthly phases.",
        "The phase cycle takes about 29.5 days. The Moon takes less time to complete an orbit relative to the stars, but Earth also moves around the Sun, so the Moon must travel a little farther to repeat the same Sun-Earth-Moon arrangement."
      ] },
      { id: "names", heading: "Read the phase names", paragraphs: [
        "Waxing means the visible illuminated portion is increasing; waning means it is decreasing. Crescent means less than half the disk appears lit, while gibbous means more than half. At first and third quarter, approximately half the visible disk is sunlit; quarter refers to progress through the cycle.",
        "New Moon places the Moon roughly toward the Sun in our sky. Full Moon places it roughly opposite. A phase name describes the lighting geometry, not a guarantee that the Moon is above your horizon."
      ] },
      { id: "planning", heading: "Use the phase to plan a view", paragraphs: [
        "For an evening look, start with a waxing crescent or first-quarter Moon. For faint stars, choose a period when the Moon is below the horizon. A bright Moon is a worthwhile target itself, even when its light washes out nearby faint objects.",
        "Open Astroboat's Moon page, note the illumination and location, and check the rise and set times before heading outside. Compare the view on several nights. Recording the date and a quick sketch makes the cycle much easier to recognize than memorizing eight labels."
      ] }
    ],
    sources: [
      { label: "NASA: Moon Phases", url: "https://science.nasa.gov/moon/moon-phases/" },
      { label: "NASA: Moon Facts", url: "https://science.nasa.gov/moon/facts/" }
    ],
    relatedPaths: [{ label: "Check the Moon", href: "/moon" }, { label: "Plan your first lunar observation", href: "/guides/how-to-observe-the-moon" }]
  },
  {
    slug: "how-to-observe-the-moon",
    title: "How to Observe the Moon for the First Time",
    description: "A simple observing session for finding lunar seas, craters, and shadows with your eyes or binoculars.",
    category: "Moon",
    tags: ["Lunar observing", "Craters", "Binoculars", "Terminator"],
    sections: [
      { id: "target", heading: "Start with a comfortable target", paragraphs: [
        "Choose a night when the Moon is comfortably above the horizon and visible from a safe observing spot. A crescent or quarter phase is especially useful: the boundary between lunar daylight and darkness, called the terminator, makes surface relief easier to notice.",
        "You can begin without equipment. Look for broad dark patches called maria, ancient plains formed by lava, surrounded by brighter highlands. A full Moon shows these large patterns well, although the nearly frontal sunlight makes many crater shadows less conspicuous."
      ] },
      { id: "detail", heading: "Add a little detail", paragraphs: [
        "If you have binoculars, brace your elbows or use a stable support to reduce shaking. Trace the terminator slowly and look for crater rims catching sunlight while their interiors remain dark. A small telescope reveals more, but a steady view matters more than rushing to high magnification.",
        "Use a labeled lunar map to identify one dark plain and one crater rather than trying to learn everything at once. Keep optical equipment away from the Sun; daytime lunar observing requires particular care about where you point it."
      ] },
      { id: "journal", heading: "Repeat the observation", paragraphs: [
        "Write down your time, location, phase, equipment, and two features you recognized. Return a day or two later and compare the shadows. The landscape has not changed, but the direction of illumination has, revealing details that were hard to see before.",
        "Astroboat's Moon page is a useful starting point for the phase and timing. Use the source maps below for surface identification. A short, repeatable session teaches you more than waiting indefinitely for a supposedly perfect full-Moon night."
      ] }
    ],
    sources: [
      { label: "NASA: Moon Viewing Tips", url: "https://science.nasa.gov/moon/viewing-tips/" },
      { label: "NASA: Moon Facts", url: "https://science.nasa.gov/moon/facts/" }
    ],
    relatedPaths: [{ label: "Check lunar conditions", href: "/moon" }, { label: "Understand lunar phases", href: "/guides/understanding-moon-phases" }]
  },
  {
    slug: "moonrise-moonset-and-local-time",
    title: "Moonrise, Moonset, and UTC: Reading Sky Times",
    description: "Why the Moon is not always up at night, how location changes rise times, and how to convert UTC to your clock.",
    category: "Moon",
    tags: ["Moonrise", "Moonset", "UTC", "Local time", "IST"],
    sections: [
      { id: "changing-times", heading: "The Moon keeps its own schedule", paragraphs: [
        "The Moon can be visible in daylight as well as at night. It changes position among the stars as it orbits Earth, so its rise time shifts from day to day. The often-quoted delay of roughly 50 minutes is an average, not a rule to add mechanically to yesterday's time.",
        "Rise and set calculations depend on your location and date. Buildings, hills, trees, and the atmosphere can affect when you actually first see the Moon. A predicted rise at the horizon does not mean it will immediately clear a nearby rooftop."
      ] },
      { id: "utc", heading: "Check the time label before converting", paragraphs: [
        "UTC is the shared clock used for many space-event listings. Local time is UTC plus or minus the offset in effect at your location. India Standard Time is UTC plus 5 hours 30 minutes: an illustrative 20:00 UTC event is at 01:30 IST on the following calendar day.",
        "Use a named time zone when converting for places that observe daylight saving. Do not convert a timestamp twice if a page already displays it in your local time. Astronomical tables may distinguish UT1 from UTC for precise work; a casual skywatching plan rarely needs that precision."
      ] },
      { id: "checklist", heading: "Make a location-aware plan", paragraphs: [
        "On Astroboat, check the displayed observing location first, then the date, then the time-zone label. Read moonrise and moonset together rather than assuming every calendar day contains a convenient evening Moon.",
        "For a trip or a time-critical observation, verify the times with the original observatory service for your coordinates. Save the converted date alongside the hour. Most avoidable timing mistakes come from using another city's forecast or overlooking a change of day."
      ] }
    ],
    sources: [
      { label: "NASA: Skywatching FAQ", url: "https://science.nasa.gov/skywatching/faq/" },
      { label: "US Naval Observatory: Universal Time", url: "https://aa.usno.navy.mil/faq/UT" }
    ],
    relatedPaths: [{ label: "See the Moon page", href: "/moon" }, { label: "Browse space events", href: "/events" }]
  },
  {
    slug: "solar-eclipses-and-eye-safety",
    title: "Solar Eclipses: What Happens and How to Watch Safely",
    description: "Understand partial, annular, and total eclipses, with the essential distinction between solar viewers and telescope filters.",
    category: "Skywatching",
    tags: ["Solar eclipse", "Eye safety", "Totality", "Annular eclipse"],
    sections: [
      { id: "alignment", heading: "An alignment with a narrow viewing path", paragraphs: [
        "A solar eclipse happens when the Moon passes between Earth and the Sun and its shadow reaches Earth. Depending on the alignment and apparent sizes, an observer may see a partial eclipse, a total eclipse, or an annular eclipse with a ring of sunlight still exposed.",
        "Your location determines what happens. A total eclipse elsewhere does not mean totality at your observing site. Use a trusted eclipse map and local contact times; a general calendar entry alone cannot tell you whether the Sun will be fully covered."
      ] },
      { id: "protection", heading: "Protect your eyes and equipment", paragraphs: [
        "For direct viewing during partial and annular phases, use undamaged solar viewers that comply with ISO 12312-2, obtained from a trustworthy supplier. Ordinary sunglasses are unsafe. Inspect viewers before use and supervise children. Never assume clouds make direct solar viewing safe.",
        "Do not look through binoculars, a telescope, or a camera while wearing eclipse glasses. Those devices require appropriate solar filters securely fitted over their front apertures. Concentrated sunlight can destroy a handheld viewer and injure your eyes. Follow the instrument manufacturer's solar-observing guidance."
      ] },
      { id: "observation", heading: "Use a simple observing plan", paragraphs: [
        "Indirect projection is an alternative: watch the Sun's projected image on a surface with your back toward the Sun, never look through a pinhole. For a first eclipse, keeping the setup simple leaves more attention for the experience.",
        "Only during the fully covered phase of a total eclipse may viewers within the totality path look directly without solar protection. Protection must return before any bright solar surface reappears. When unsure about the timing or location, keep protection in place and follow NASA's full safety instructions below."
      ] }
    ],
    sources: [
      { label: "NASA: Eclipse Viewing Safety", url: "https://science.nasa.gov/eclipses/safety/" },
      { label: "NASA: Types of Solar Eclipses", url: "https://science.nasa.gov/eclipses/types/" }
    ],
    relatedPaths: [{ label: "Check upcoming sky events", href: "/events" }, { label: "Learn about lunar eclipses", href: "/guides/lunar-eclipses-explained" }]
  },
  {
    slug: "lunar-eclipses-explained",
    title: "Lunar Eclipses: Why the Moon Can Turn Red",
    description: "Learn what Earth's shadow does to a full Moon and why a lunar eclipse is different from an ordinary phase.",
    category: "Moon",
    tags: ["Lunar eclipse", "Blood Moon", "Umbra", "Penumbral eclipse"],
    sections: [
      { id: "shadow", heading: "Earth casts the shadow", paragraphs: [
        "A lunar eclipse occurs when Earth lies between the Sun and a full Moon and the Moon enters Earth's shadow. It does not happen every full Moon because the Moon's orbit is tilted relative to Earth's path around the Sun. Most months, the alignment misses the shadow.",
        "Earth's shadow has a darker central region, the umbra, and a lighter outer region, the penumbra. A penumbral eclipse can be subtle. A partial eclipse places only part of the lunar disk in the umbra; during totality, the entire disk enters it."
      ] },
      { id: "color", heading: "Why red light reaches the Moon", paragraphs: [
        "During totality, some sunlight passes through Earth's atmosphere and is bent into the shadow. The atmosphere scatters shorter wavelengths more strongly, leaving more red and orange light to illuminate the Moon. Dust and clouds in the atmosphere influence the final appearance.",
        "The phrase blood Moon is a popular nickname, not a separate scientific category or a promise of a particular shade. One eclipse may look coppery while another is much darker."
      ] },
      { id: "watch", heading: "Watch without solar filters", paragraphs: [
        "Unlike direct solar viewing, observing the Moon during a lunar eclipse does not require eclipse glasses. Eyes, binoculars, and a telescope are all useful. Check whether the Moon will be above your local horizon during the relevant phases; global eclipse times do not guarantee local visibility.",
        "Make a simple sequence of notes: the time, how much of the Moon appears shadowed, and the color you see. In Astroboat's Events section, treat the entry as a prompt to open the original source for a detailed visibility map and timing."
      ] }
    ],
    sources: [
      { label: "NASA: Eclipses and the Moon", url: "https://science.nasa.gov/moon/eclipses/" },
      { label: "NASA: Eclipses", url: "https://science.nasa.gov/eclipses/" }
    ],
    relatedPaths: [{ label: "Find sky events", href: "/events" }, { label: "Understand solar eclipse safety", href: "/guides/solar-eclipses-and-eye-safety" }]
  },
  {
    slug: "how-to-watch-a-meteor-shower",
    title: "How to Watch a Meteor Shower",
    description: "Plan for darkness, the radiant, Moon interference, and realistic expectations rather than headline meteor counts.",
    category: "Skywatching",
    tags: ["Meteor showers", "Radiant", "Shooting stars", "Observing"],
    sections: [
      { id: "what", heading: "You are watching small debris arrive", paragraphs: [
        "Meteor showers happen when Earth passes through streams of debris, often left by comets. Incoming particles produce brief luminous streaks in the atmosphere. The stars themselves are not falling. Shower names refer to the constellation near the apparent point of origin, called the radiant.",
        "The streaks can appear across a broad part of the sky, so a telescope is usually the wrong tool for shower watching. Your unaided eyes provide the wide view you need."
      ] },
      { id: "plan", heading: "Choose conditions before chasing the peak", paragraphs: [
        "Check the shower's activity period, your local nighttime hours, and whether its radiant rises high enough from your latitude. Then compare Moon conditions and cloud cover. A night near the predicted maximum can still be disappointing if bright moonlight or haze hides faint streaks.",
        "Pick a safe spot with a broad view, dress for sitting still, and bring a reclining chair or ground mat. Let your eyes adapt to darkness and avoid repeatedly looking at a bright phone. Give yourself a sustained observing period rather than a five-minute glance."
      ] },
      { id: "expectations", heading: "A rate is not a personal forecast", paragraphs: [
        "Published zenithal hourly rates describe standardized ideal conditions, including a dark sky and high radiant. Your observed count depends on weather, obstructions, light pollution, and attention. Treat a quoted rate as a comparison between showers, not a guaranteed number from your balcony.",
        "Use Astroboat's Events page to discover a shower and the Moon page to assess lunar light, then confirm the detailed observing advice at the source. If you keep a count, note your actual observing time and conditions so the record means something later."
      ] }
    ],
    sources: [
      { label: "NASA Space Place: What Is a Meteor Shower?", url: "https://spaceplace.nasa.gov/meteor-shower/en/" },
      { label: "NASA Meteoroid Environments Office: Why Ideal Meteor Rates Differ from What You See", url: "https://www.nasa.gov/blogs/watch-the-skies/2019/11/19/about-the-upcoming-maybe-alpha-monocerotid-meteor-shower-outburst/" }
    ],
    relatedPaths: [{ label: "Browse sky events", href: "/events" }, { label: "Check Moon conditions", href: "/moon" }]
  },
  {
    slug: "planets-conjunctions-and-opposition",
    title: "Planet Conjunctions and Opposition: What to Look For",
    description: "Decode close planetary pairings, the ecliptic, and opposition without mistaking a sky alignment for a physical encounter.",
    category: "Skywatching",
    tags: ["Planets", "Conjunction", "Opposition", "Ecliptic", "Planet parade"],
    sections: [
      { id: "line", heading: "Why planets share an arc", paragraphs: [
        "The planets orbit the Sun in broadly the same plane. From Earth, that plane projects as a path across the sky near the ecliptic. Several planets visible at once therefore tend to trace an arc rather than appear scattered randomly among the stars.",
        "Planet parade is a popular description, not a strict scientific classification. A headline listing many planets does not mean every one is bright enough for your eyes or above your horizon at a convenient hour."
      ] },
      { id: "geometry", heading: "Two useful kinds of alignment", paragraphs: [
        "A conjunction refers to objects sharing a celestial coordinate and often appearing close together in the sky. A planet near the Moon is a line-of-sight pairing: the objects remain far apart in space. The exact coordinate alignment may not be the moment of smallest visible separation.",
        "At opposition, an outer planet lies opposite the Sun as seen from Earth. It is generally well placed for nighttime observing around that period. Opposition does not make a distant planet Moon-sized or guarantee clear views; atmospheric steadiness and local altitude still matter."
      ] },
      { id: "observe", heading: "Read the local observing details", paragraphs: [
        "Look for a date, a direction, a time after sunset or before sunrise, and an angular separation. Confirm the chart is intended for your location or latitude. A low western pairing may set before your buildings or hills allow a clear view.",
        "Use Astroboat's calendar to spot an interesting pairing, then check the source chart. Start with your eyes; use binoculars only once the Sun is safely out of the observing area. Never sweep near the Sun while searching for a planet."
      ] }
    ],
    sources: [
      { label: "NASA: Planetary Alignments and Planet Parades", url: "https://science.nasa.gov/solar-system/skywatching/planetary-alignments-and-planet-parades/" },
      { label: "NASA: Skywatching", url: "https://science.nasa.gov/skywatching/" }
    ],
    relatedPaths: [{ label: "Find upcoming conjunctions", href: "/events" }, { label: "Read a star chart", href: "/guides/constellations-and-star-charts" }]
  },
  {
    slug: "constellations-and-star-charts",
    title: "Constellations and Star Charts for Beginners",
    description: "Find your bearings with a few bright stars, understand asterisms, and avoid using a chart for the wrong place or season.",
    category: "Skywatching",
    tags: ["Constellations", "Star charts", "Asterisms", "Latitude"],
    sections: [
      { id: "regions", heading: "Patterns are not physical star families", paragraphs: [
        "A constellation is an officially defined region of the sky. Familiar stick-figure drawings help us recognize those regions, but stars in the same outline can lie at very different distances. They do not necessarily belong to one physical group.",
        "An asterism is a recognizable pattern that is not itself a whole constellation. The Big Dipper is part of Ursa Major; the Summer Triangle spans several constellations. Learning an easy asterism can be a better starting point than memorizing an elaborate figure."
      ] },
      { id: "chart", heading: "Set the chart before identifying stars", paragraphs: [
        "Use a chart for your latitude, date, and observing time. Earth's rotation changes the view through a night, and its orbit changes which stars appear after dark through the year. A northern-hemisphere seasonal guide may not match a southern-hemisphere observer's view.",
        "Face the direction you are trying to identify and align the chart's horizon label accordingly. Begin with two or three bright stars and compare their spacing. Do not expect a phone display's bright lines to be visible in the actual sky."
      ] },
      { id: "practice", heading: "Build a small observing habit", paragraphs: [
        "Choose one pattern to find repeatedly over a week. Note its direction and approximate height at the same hour, then check it at a later hour on one night. Those observations separate daily motion from the slower seasonal change.",
        "Browse Astroboat's Events for a target and use the chart linked by its source. Keep the screen dim after you have oriented yourself. A handful of confidently recognized stars is a practical foundation for finding planets, meteor radiants, and binocular targets."
      ] }
    ],
    sources: [
      { label: "NASA Space Place: What Are Constellations?", url: "https://spaceplace.nasa.gov/constellations/en/" },
      { label: "NASA StarChild: What Are Constellations?", url: "https://starchild.gsfc.nasa.gov/docs/StarChild/questions/question9.html" }
    ],
    relatedPaths: [{ label: "Explore sky events", href: "/events" }, { label: "Understand light pollution", href: "/guides/light-pollution-and-dark-skies" }]
  },
  {
    slug: "light-pollution-and-dark-skies",
    title: "Light Pollution: Finding a Better View of the Stars",
    description: "Understand skyglow, nearby glare, and the changes that help you observe from a city or a darker site.",
    category: "Skywatching",
    tags: ["Light pollution", "Dark skies", "Skyglow", "Urban astronomy"],
    sections: [
      { id: "contrast", heading: "A brighter background hides faint objects", paragraphs: [
        "Artificial light scattered through the atmosphere produces skyglow, reducing contrast between faint objects and the background sky. A nearby exposed lamp adds glare even if the wider sky is reasonably dark. Clouds and airborne particles can scatter still more light.",
        "Darkness is only one part of a good observing night. Haze affects transparency, turbulent air affects fine detail, and moonlight adds natural sky brightness. A location map cannot guarantee the conditions you will find on a particular evening."
      ] },
      { id: "city", heading: "Match the target to your surroundings", paragraphs: [
        "From a city, begin with the Moon, bright planets, and recognizable bright-star patterns. Faint nebulae and the Milky Way are more demanding. Moving behind a wall that blocks a streetlamp can improve comfort without requiring a long drive.",
        "For a darker outing, choose a legal, accessible spot, check weather and Moon timing, and arrange a safe return. Avoid shining lights at other observers. Keep a dim light for necessary tasks and protect your night vision from unnecessary screen use."
      ] },
      { id: "lighting", heading: "Improve light where you control it", paragraphs: [
        "Outdoor lighting works better for the night sky when it is directed down, limited to the area that needs it, and used only when necessary. Shielding and sensible timing can reduce wasted light without eliminating useful visibility at ground level.",
        "Try a simple comparison: observe the same patch of sky with a nearby light on and off, noting which stars you can distinguish. Use Astroboat's Moon page when planning that comparison so a changing lunar phase does not get mistaken for a change in artificial skyglow."
      ] }
    ],
    sources: [
      { label: "US National Park Service: Light Pollution", url: "https://www.nps.gov/subjects/nightskies/lightpollution.htm" },
      { label: "US National Park Service: Outdoor Lighting Principles", url: "https://www.nps.gov/subjects/nightskies/outdoor-lighting-principles.htm" }
    ],
    relatedPaths: [{ label: "Check the Moon before observing", href: "/moon" }, { label: "Plan a meteor-shower session", href: "/guides/how-to-watch-a-meteor-shower" }]
  },
  {
    slug: "binoculars-for-stargazing",
    title: "Stargazing with Binoculars You Already Own",
    description: "Use a steady, wide-field view to explore lunar detail, star clusters, and bright targets without starting with a telescope.",
    category: "Skywatching",
    tags: ["Binoculars", "Field of view", "Observing", "Star clusters"],
    sections: [
      { id: "numbers", heading: "Read the two numbers", paragraphs: [
        "Binocular labels such as 7 x 50 describe magnification followed by the front lens diameter in millimetres. The first number tells you how much larger an object appears. The second describes the aperture, which helps determine how much light the instrument collects.",
        "More magnification is not automatically more useful. It also magnifies hand movement and often narrows the view. The best first experiment is to use a pair you can hold comfortably, rather than treating equipment specifications as a shopping contest."
      ] },
      { id: "steady", heading: "Make the image steady", paragraphs: [
        "Set the focus carefully, adjust the spacing for your eyes, and brace your elbows or observe from a chair. If the instrument supports a tripod adapter, a stable mount can help during longer looks. Practice locating an easy object before attempting a faint target.",
        "Try the Moon or a bright, well-placed star cluster identified on a current chart. You may resolve more stars than you can see unaided. Expect subtle views; binoculars do not reproduce long-exposure observatory photographs or reveal every planetary detail."
      ] },
      { id: "session", heading: "Keep your first session small", paragraphs: [
        "Choose one target, locate it with your eyes, and only then lift the binoculars without losing your direction. Describe what changes when you lower them: extra stars, a clearer lunar boundary, or a broader patch of glow.",
        "Never point binoculars at or near the Sun without an appropriate, purpose-built solar setup. Eclipse glasses are not a filter for binoculars. For an easy nighttime exercise, use Astroboat's Moon page to select a visible Moon and return on another night to compare its changing shadows."
      ] }
    ],
    sources: [
      { label: "NASA: Skywatching Tools", url: "https://science.nasa.gov/skywatching/" },
      { label: "NASA: Moon Viewing Tips", url: "https://science.nasa.gov/moon/viewing-tips/" }
    ],
    relatedPaths: [{ label: "Observe the Moon", href: "/guides/how-to-observe-the-moon" }, { label: "Understand telescope basics", href: "/guides/telescope-basics-aperture-and-magnification" }]
  },
  {
    slug: "telescope-basics-aperture-and-magnification",
    title: "Telescope Basics: Light Comes Before Magnification",
    description: "Understand aperture, focus, eyepieces, and a steady mount before your first telescope observing session.",
    category: "Skywatching",
    tags: ["Telescopes", "Aperture", "Magnification", "Refractor", "Reflector"],
    sections: [
      { id: "light", heading: "A telescope gathers and focuses light", paragraphs: [
        "The main lens or mirror collects light and brings it to a focus. A refractor uses lenses; a reflector uses mirrors. Aperture is the diameter of that main light-collecting element, and it matters for both light gathering and the detail an instrument can resolve.",
        "An eyepiece magnifies the image. For a visual telescope, magnification is the telescope's focal length divided by the eyepiece focal length. An illustrative 600-millimetre telescope with a 20-millimetre eyepiece gives 30 times magnification."
      ] },
      { id: "limits", heading: "More power can make the view worse", paragraphs: [
        "High magnification makes shaking, atmospheric blur, and focusing errors more obvious. It also makes finding and following a target harder. Start with the lowest useful power, center the object, focus, and increase magnification only while the view still improves.",
        "A stable mount and a comfortable observing position are part of the optical experience. A larger image that constantly wobbles is harder to study than a smaller, steady one. Allow time to learn the controls instead of trying many accessories immediately."
      ] },
      { id: "first-target", heading: "Use one bright target to learn", paragraphs: [
        "Choose the Moon or a bright planet that a current chart shows above your horizon. Compare two eyepieces and record which reveals useful detail. Expect faint objects to look less colorful than processed photographs; your eye and a long-exposure detector collect light differently.",
        "Never point an ordinary observing setup toward the Sun. Solar work needs suitable front-mounted filters and specific guidance. For a first nighttime session, consult Astroboat's Moon page, then spend your time learning focus, pointing, and tracking rather than chasing a magnification number."
      ] }
    ],
    sources: [
      { label: "NASA Space Place: How Do Telescopes Work?", url: "https://spaceplace.nasa.gov/telescopes/en/" },
      { label: "NASA: Skywatching Tools", url: "https://science.nasa.gov/skywatching/" }
    ],
    relatedPaths: [{ label: "Try lunar observing", href: "/guides/how-to-observe-the-moon" }, { label: "Find a current observing target", href: "/events" }]
  },
  {
    slug: "why-earth-has-seasons",
    title: "Why Earth Has Seasons, Solstices, and Equinoxes",
    description: "See how Earth's tilted axis changes daylight and why the two hemispheres have opposite seasons.",
    category: "Astronomy Basics",
    tags: ["Seasons", "Solstice", "Equinox", "Earth", "Axial tilt"],
    sections: [
      { id: "tilt", heading: "The key is Earth's tilted axis", paragraphs: [
        "Earth's rotation axis is tilted by about 23.4 degrees relative to the perpendicular to its orbital plane. As Earth travels around the Sun, that tilt changes how directly sunlight reaches each hemisphere and how long the Sun remains above the horizon.",
        "When the Northern Hemisphere tilts toward the Sun, it has longer days and more direct sunlight, while the Southern Hemisphere has the opposite conditions. Seasonal heating is not mainly caused by Earth moving closer to or farther from the Sun."
      ] },
      { id: "milestones", heading: "Solstices and equinoxes mark the geometry", paragraphs: [
        "At a solstice, the Sun reaches its farthest apparent north or south position in the yearly cycle. At an equinox, it crosses the celestial equator. These are shared astronomical moments, but their local calendar dates can differ by time zone.",
        "Day and night are not exactly twelve hours everywhere on an equinox. Atmospheric refraction, the Sun's apparent disk, and the definition of sunrise and sunset shift the observed balance. Latitude also changes the size of the seasonal variation in daylight."
      ] },
      { id: "observe", heading: "Notice the change from one place", paragraphs: [
        "Pick a safe, fixed viewpoint and note the direction of sunset against a distant landmark over several weeks without looking directly at the Sun. Compare the length of your evening observing window in different months.",
        "Treat seasonal sky guides as location-dependent. A winter constellation description written for Europe does not automatically describe the season in Australia. Use Astroboat's calendar for dates and a chart set to your location for the actual sky. Keep local weather seasons separate from these astronomical definitions."
      ] }
    ],
    sources: [
      { label: "NASA Space Place: What Causes the Seasons?", url: "https://spaceplace.nasa.gov/seasons/en/" },
      { label: "US Naval Observatory: Length of Day and Night at the Equinoxes", url: "https://aa.usno.navy.mil/faq/equinoxes" }
    ],
    relatedPaths: [{ label: "Find seasonal sky events", href: "/events" }, { label: "Learn to read a star chart", href: "/guides/constellations-and-star-charts" }]
  },
  {
    slug: "auroras-and-space-weather",
    title: "Auroras and Space Weather: Why the Sky Glows",
    description: "Connect the northern and southern lights to solar activity, Earth's magnetic environment, and realistic observing forecasts.",
    category: "Space Science",
    tags: ["Aurora", "Space weather", "Solar wind", "Northern lights"],
    sections: [
      { id: "glow", heading: "The light comes from our atmosphere", paragraphs: [
        "Auroras form when energetic particles interact with gases high in Earth's atmosphere. Those gases release light after being energized. Earth's magnetic environment helps organize where particles arrive, so displays are most common around the magnetic polar regions.",
        "Different gases and altitudes produce different colors. Oxygen contributes familiar green and red emissions, while nitrogen can contribute blue and pink tones. The display is not sunlight reflecting from ordinary clouds, although clouds can hide it."
      ] },
      { id: "sun", heading: "Solar activity changes the chances", paragraphs: [
        "The solar wind continually interacts with Earth's magnetic field. Some solar disturbances intensify that interaction and expand auroral activity to lower latitudes. Space weather can also affect satellites, radio communication, and other technologies; its importance extends beyond a beautiful view.",
        "A forecast describes a probability and an evolving environment. It cannot promise a bright display over a particular street. Darkness, clouds, your latitude, and the timing of the disturbance all affect what you can actually see."
      ] },
      { id: "expect", heading: "Separate a forecast from a photograph", paragraphs: [
        "A camera's exposure can reveal colors and faint structures that look much subtler to your eyes. Do not use a vivid photograph as a brightness guarantee. Compare the location and exposure context before deciding what a display should look like.",
        "Use current official space-weather guidance when planning an observation, then check local weather and safe access to a dark viewpoint. Astroboat's Briefs can help explain a solar event, but a general news report is not a site-specific aurora forecast."
      ] }
    ],
    sources: [
      { label: "NASA: Auroras", url: "https://science.nasa.gov/sun/auroras/" },
      { label: "NASA: Guide to Finding and Photographing Auroras", url: "https://science.nasa.gov/feature/nasas-guide-to-finding-and-photographing-auroras/" }
    ],
    relatedPaths: [{ label: "Read space science briefs", href: "/briefs" }, { label: "Find a darker observing spot", href: "/guides/light-pollution-and-dark-skies" }]
  },
  {
    slug: "asteroids-comets-and-meteorites",
    title: "Asteroid, Comet, Meteor, or Meteorite?",
    description: "Separate the objects traveling through space from the light streaks in our atmosphere and the material that reaches the ground.",
    category: "Asteroids",
    tags: ["Asteroids", "Comets", "Meteoroids", "Meteors", "Meteorites"],
    sections: [
      { id: "objects", heading: "Asteroids and comets are objects", paragraphs: [
        "Asteroids are small rocky or metallic bodies orbiting the Sun. Comets contain volatile ices along with dust and rock; solar heating can release material and create a surrounding coma and tails. Both preserve clues to the early solar system.",
        "The distinction is useful but nature includes complicated cases, including active asteroids. Do not assume that every new object with a fuzzy appearance has already been fully characterized. Follow the discovery source for its classification and uncertainty."
      ] },
      { id: "atmosphere", heading: "A meteor is the visible event", paragraphs: [
        "A meteoroid is a smaller piece of material in space. When it enters an atmosphere and produces a luminous streak, the phenomenon is a meteor. If material survives the passage and reaches the ground, that surviving material is a meteorite.",
        "A shooting star is therefore not a star. Brightness alone does not tell you that a meteorite landed. Many visible meteors are produced by small particles, and shower debris is generally very different from a large asteroid appearing on a close-approach list."
      ] },
      { id: "reading", heading: "Use the right question for the right record", paragraphs: [
        "For a meteor shower, ask when its radiant and the local sky are well placed. For a near-Earth asteroid, ask about the predicted approach distance, orbit, and uncertainty. For a possible meteorite, identification needs evidence; an unusual-looking terrestrial rock is not proof of a space origin.",
        "Astroboat's Asteroid Watch is a close-approach browsing tool, while Events can highlight skywatching opportunities. Keeping those purposes separate prevents an impressive meteor image from being mistaken for evidence about the risk of an unrelated asteroid."
      ] }
    ],
    sources: [
      { label: "NASA: Asteroids, Comets and Meteors Facts", url: "https://science.nasa.gov/asteroids-comets-meteors/facts/" },
      { label: "NASA: Meteors and Meteorites", url: "https://science.nasa.gov/solar-system/meteors-meteorites/" }
    ],
    relatedPaths: [{ label: "Understand near-Earth objects", href: "/guides/what-is-a-near-earth-object" }, { label: "Open Asteroid Watch", href: "/asteroids" }]
  },
  {
    slug: "why-comets-have-tails",
    title: "Why Comets Have Tails, and Which Way They Point",
    description: "Meet the nucleus, coma, dust tail, and ion tail, and learn why a comet's tail does not simply trail behind its motion.",
    category: "Solar System",
    tags: ["Comets", "Coma", "Dust tail", "Ion tail", "Solar wind"],
    sections: [
      { id: "nucleus", heading: "A small nucleus can make a large display", paragraphs: [
        "A comet's solid nucleus contains ice, dust, and rocky material. Far from the Sun it may be relatively inactive. As solar heating increases, volatile material turns to gas and carries dust away, creating the diffuse surrounding cloud called the coma.",
        "The coma and tails can extend far beyond the nucleus. A photograph's enormous glowing shape is not a solid object of that size. The nucleus may remain unresolved even in a visually impressive image."
      ] },
      { id: "tails", heading: "Sunlight and solar wind shape the tails", paragraphs: [
        "Sunlight pushes on dust, producing a tail that can curve as particles move along their own paths. Ionized gas interacts with the solar wind and magnetic field, often forming a straighter ion tail directed broadly away from the Sun.",
        "That means tails are not simply exhaust pointing opposite the comet's travel. A comet leaving the inner solar system can move in a direction that puts its tail partly ahead of its motion. Viewing angle changes how the tails appear from Earth."
      ] },
      { id: "viewing", heading: "Treat brightness predictions cautiously", paragraphs: [
        "A comet's activity, distance, and geometry all influence how bright and extended it looks. A close approach does not by itself guarantee a brilliant naked-eye object. A diffuse coma can be difficult to distinguish against a bright sky even when a quoted magnitude sounds promising.",
        "When a comet appears in Astroboat's Briefs, open the original observing source for a current chart, date, and brightness estimate. Plan around darkness and horizon clearance. Do not point binoculars near the Sun while hunting a low twilight comet."
      ] }
    ],
    sources: [
      { label: "NASA: Comet Facts", url: "https://science.nasa.gov/solar-system/comets/facts/" },
      { label: "NASA Space Place: What Is a Comet?", url: "https://spaceplace.nasa.gov/comets/en/" }
    ],
    relatedPaths: [{ label: "Read astronomy briefs", href: "/briefs" }, { label: "Compare comets and meteors", href: "/guides/asteroids-comets-and-meteorites" }]
  },
  {
    slug: "astronomical-distances-au-and-light-years",
    title: "AU, Lunar Distance, and Light-Years Explained",
    description: "Choose the right scale for a Moon crossing, an asteroid approach, a planetary orbit, or a distant star.",
    category: "Astronomy Basics",
    tags: ["AU", "Light-year", "Lunar distance", "Distance", "Light travel time"],
    sections: [
      { id: "nearby", heading: "Use nearby yardsticks in the solar system", paragraphs: [
        "One astronomical unit, abbreviated AU, is exactly 149,597,870.7 kilometres. It is based on the scale of Earth's average distance from the Sun. Saying an object is several AU away is usually easier to follow than a long string of kilometres.",
        "Lunar distance is another useful scale: roughly the average Earth-Moon separation, about 384,400 kilometres. It makes an asteroid approach easier to picture. Neither Earth's distance from the Sun nor the Moon's distance from Earth stays perfectly constant."
      ] },
      { id: "light", heading: "A light-year is a distance", paragraphs: [
        "A light-year is the distance light travels in one year, about 9.46 trillion kilometres. Despite its name, it is not a unit of age or speed. Light-minutes and light-hours use the same idea for shorter distances.",
        "If light from a nearby star takes ten years to reach us, we see that star as it was ten years ago. For very distant galaxies, cosmic expansion makes the relationship between light travel time and present-day distance more complicated than this nearby example."
      ] },
      { id: "comparison", heading: "Keep the definition attached to the number", paragraphs: [
        "An asteroid's closest distance to Earth is not its distance from the Sun. A spacecraft's distance from Earth is not the length of its whole journey. Before comparing two figures, check the reference body, time, and units.",
        "In Astroboat's Asteroid Watch, use the displayed unit labels and source record together. As a simple exercise, compare an approach given in lunar distances with the same approach in kilometres. The conversion builds intuition without turning an astronomical use of close into an impact prediction."
      ] }
    ],
    sources: [
      { label: "NASA: What Is a Light-Year?", url: "https://science.nasa.gov/exoplanets/what-is-a-light-year/" },
      { label: "NASA JPL CNEOS: Close-Approach Data Notes", url: "https://cneos.jpl.nasa.gov/ca/neo_ca_info.html" }
    ],
    relatedPaths: [{ label: "Compare asteroid approach distances", href: "/asteroids" }, { label: "Understand near-Earth objects", href: "/guides/what-is-a-near-earth-object" }]
  },
  {
    slug: "how-stars-are-born-and-die",
    title: "How Stars Are Born, Shine, and Die",
    description: "Follow a star from a collapsing cloud to a long fusion-powered life and an ending shaped largely by its mass.",
    category: "Deep Space",
    tags: ["Stars", "Fusion", "Stellar evolution", "Supernova", "White dwarf"],
    sections: [
      { id: "birth", heading: "Gravity gathers the raw material", paragraphs: [
        "Stars form in clouds of gas and dust when gravity draws material together. A collapsing region heats up and develops into a protostar. If its core reaches suitable conditions, hydrogen fusion begins and the object becomes a star sustained by energy released in its interior.",
        "Star formation is not a neat isolated assembly line. Young stars can form in groups, surrounded by disks and neighboring gas. Images of stellar nurseries capture different stages and environments rather than a single universal scene."
      ] },
      { id: "life", heading: "Mass sets much of the pace", paragraphs: [
        "For much of a star's life, core fusion and its internal structure support it against gravitational collapse. Massive stars consume their fuel more rapidly and live shorter lives than less massive stars. A star's brightness alone does not reveal its age, since distance also changes how bright it looks to us.",
        "As available fuel and internal conditions change, a star evolves. The Sun's path differs from that of a much more massive star; not every star ends in a supernova or becomes a black hole."
      ] },
      { id: "endings", heading: "The ending feeds the next generation", paragraphs: [
        "Sun-like stars eventually shed outer material and leave white dwarfs. Some massive stars undergo core collapse and can leave neutron stars or black holes. Stellar winds and explosive events return material to the surrounding space, enriching later generations of stars and planets.",
        "When exploring Astroboat's Gallery, identify whether a caption describes a forming star, a cluster, or a stellar remnant. Comparing those categories is a useful way to connect beautiful images to different parts of the life cycle, without assuming every nebula is a birthplace."
      ] }
    ],
    sources: [
      { label: "NASA: Stars", url: "https://science.nasa.gov/universe/stars/" },
      { label: "NASA Webb: Star Lifecycle", url: "https://science.nasa.gov/mission/webb/star-lifecycle/" }
    ],
    relatedPaths: [{ label: "Explore the astronomy gallery", href: "/gallery" }, { label: "Learn about black holes", href: "/guides/black-holes-explained" }]
  },
  {
    slug: "black-holes-explained",
    title: "Black Holes: What They Are and How We Find Them",
    description: "Understand event horizons, glowing accretion disks, and the observations that reveal an object light cannot escape.",
    category: "Deep Space",
    tags: ["Black holes", "Event horizon", "Accretion", "Gravity"],
    sections: [
      { id: "horizon", heading: "A boundary for escaping light", paragraphs: [
        "A black hole is a region where gravity is so strong that light cannot escape from inside its event horizon. The horizon is a boundary, not a solid surface. A black hole can have a surrounding environment that shines even though the hole itself does not emit ordinary light from within that boundary.",
        "Some black holes form from the collapse of massive stars. Supermassive black holes inhabit the centers of many galaxies. Their presence does not mean the whole galaxy is being sucked inward; objects can orbit a black hole just as they orbit other gravitating masses."
      ] },
      { id: "evidence", heading: "Look for effects on the surroundings", paragraphs: [
        "Astronomers infer black holes from several kinds of evidence, including the motion of nearby stars, emission from hot infalling material, and gravitational waves from mergers. These observations answer different questions about mass, motion, and the surrounding environment.",
        "An accretion disk is material orbiting and heating outside the horizon. Bright rings in black-hole imagery trace emission affected by strong gravity; they are not photographs of a visible physical surface. Illustrations and simulations should be labeled separately from observations."
      ] },
      { id: "reading", heading: "Read the measurement behind a headline", paragraphs: [
        "When a story announces a black-hole discovery, ask what was measured. Was it a companion star's orbit, an X-ray signal, a merger waveform, or a reconstructed radio image? Note whether the authors describe a candidate or a confirmed interpretation.",
        "Astroboat's Briefs link to the original research or agency explanation. Follow that link for the evidence and uncertainty before interpreting a dramatic artist's image. The strongest beginner question is often simply: what observable effect led scientists to conclude a black hole was there?"
      ] }
    ],
    sources: [
      { label: "NASA: Black Holes", url: "https://science.nasa.gov/universe/black-holes/" },
      { label: "NASA Webb: How Do We Know There Are Black Holes?", url: "https://science.nasa.gov/mission/webb/science-overview/science-explainers/how-do-we-know-there-are-black-holes/" }
    ],
    relatedPaths: [{ label: "Read deep-space briefs", href: "/briefs" }, { label: "Follow the life cycle of stars", href: "/guides/how-stars-are-born-and-die" }]
  },
  {
    slug: "galaxies-and-our-milky-way",
    title: "Galaxies and the Milky Way: Finding Our Place",
    description: "Distinguish a galaxy from a solar system or a nebula, and understand why our home galaxy looks like a band of light.",
    category: "Deep Space",
    tags: ["Galaxies", "Milky Way", "Nebulae", "Spiral galaxies"],
    sections: [
      { id: "scales", heading: "A galaxy contains many stellar systems", paragraphs: [
        "A galaxy is a gravitationally bound system containing stars, gas, dust, and dark matter. Our solar system belongs to the Milky Way. A nebula is a cloud of gas or dust, often within a galaxy; it is not another name for a galaxy.",
        "Galaxies come in several broad forms, including spirals, ellipticals, and irregular systems. Shape is a starting description, not a complete history. Interactions, star formation, and the behavior of gas all contribute to how a galaxy evolves."
      ] },
      { id: "inside", heading: "We see the Milky Way from inside", paragraphs: [
        "Our viewpoint lies within the Milky Way's disk. Looking along that disk reveals many overlapping stars and dust clouds, producing the pale band visible from a dark site. We cannot photograph our entire galaxy from outside with a spacecraft camera.",
        "Top-down pictures of the Milky Way are therefore scientific reconstructions or illustrations informed by observations. Images of other galaxies can show their overall structure directly, but viewing angle and observing wavelength affect the features that stand out."
      ] },
      { id: "look", heading: "Use captions to compare galaxies", paragraphs: [
        "When you open a galaxy image, identify the object, distance, instrument, and wavelength before comparing its colors or apparent size with another. A large image on your screen does not imply a physically larger or nearer galaxy.",
        "For an observing exercise, first learn the bright constellations near the Milky Way in a chart for your location. Then choose a moonless period and a dark site. Astroboat's Gallery offers a separate, detailed view of structures your eyes cannot resolve in that faint band."
      ] }
    ],
    sources: [
      { label: "NASA: Galaxies", url: "https://science.nasa.gov/universe/galaxies/" },
      { label: "NASA: What Is the Universe?", url: "https://science.nasa.gov/exoplanets/what-is-the-universe/" }
    ],
    relatedPaths: [{ label: "Explore galaxy images", href: "/gallery" }, { label: "Understand astronomical distances", href: "/guides/astronomical-distances-au-and-light-years" }]
  },
  {
    slug: "how-we-find-exoplanets",
    title: "How Astronomers Find Planets Around Other Stars",
    description: "Explore transits, stellar wobble, direct imaging, and why a planet candidate needs follow-up observations.",
    category: "Deep Space",
    tags: ["Exoplanets", "Transits", "Radial velocity", "Planet discovery"],
    sections: [
      { id: "transits", heading: "Measure a tiny dip in starlight", paragraphs: [
        "An exoplanet is a planet outside our solar system. In the transit method, astronomers measure a star's brightness and look for repeated dips when an orbiting planet passes in front of it from our viewpoint. The geometry must line up for a transit to be visible.",
        "A transit constrains a planet's size relative to its star. The time between repeated transits gives an orbital period. A light curve is a measurement over time, not necessarily a resolved photograph of the planet crossing the star."
      ] },
      { id: "methods", heading: "Check the star's motion too", paragraphs: [
        "The radial-velocity method detects changes in the star's motion toward and away from us through shifts in its spectrum. Those shifts can reveal the gravitational influence of an orbiting companion. Combined with suitable transit measurements, they can help constrain planetary density.",
        "Other methods include direct imaging and gravitational microlensing. Each favors different systems. A catalog assembled from one detection method is therefore not an unbiased sample of every planet that exists."
      ] },
      { id: "confirmation", heading: "A candidate is the start of the investigation", paragraphs: [
        "Stellar activity, eclipsing stars, and instrumental effects can imitate planetary signals. Follow-up observations and analysis test those alternatives. Confirmation of a planet does not automatically establish its atmosphere, surface conditions, or habitability.",
        "In an Astroboat discovery brief, look for the detection method and whether the result is a candidate or a confirmed planet. Then check what was actually measured. Keeping size, mass, atmospheric evidence, and speculation separate makes a new-world announcement much more informative."
      ] }
    ],
    sources: [
      { label: "NASA: How We Find and Characterize Exoplanets", url: "https://science.nasa.gov/exoplanets/how-we-find-and-characterize/" },
      { label: "NASA: 10 Steps to Confirm a Planet Around Another Star", url: "https://science.nasa.gov/universe/exoplanets/10-steps-to-confirm-a-planet-around-another-star/" }
    ],
    relatedPaths: [{ label: "Read discovery briefs", href: "/briefs" }, { label: "Understand habitable zones", href: "/guides/what-the-habitable-zone-means" }]
  },
  {
    slug: "what-the-habitable-zone-means",
    title: "The Habitable Zone Is Not a Promise of Life",
    description: "Understand what a planet's orbit can suggest about liquid water and what it cannot tell us about a living world.",
    category: "Space Science",
    tags: ["Habitable zone", "Exoplanets", "Liquid water", "Astrobiology"],
    sections: [
      { id: "definition", heading: "A useful starting condition", paragraphs: [
        "A star's habitable zone is the range of distances where a planet with suitable atmospheric conditions could support liquid water on its surface. The idea is useful because liquid water is central to life as we know it. It does not establish that water or life is actually present.",
        "The zone depends on the star's energy output. A cooler, fainter star has a closer-in zone than a hotter, brighter one. An orbit described as Earth-like in temperature terms may therefore be much smaller than Earth's orbit."
      ] },
      { id: "conditions", heading: "Atmosphere and history still matter", paragraphs: [
        "Surface conditions depend on more than distance. Atmospheric composition and pressure, cloud behavior, reflectivity, and a planet's evolution all affect whether water can remain liquid. A measured radius does not by itself tell scientists what the atmosphere is like.",
        "Rocky, Earth-sized, temperate, habitable, and inhabited describe different claims. A discovery may support one while leaving the others unknown. Even an atmospheric molecule associated with biology needs careful interpretation and tests of nonbiological explanations."
      ] },
      { id: "questions", heading: "Read a discovery with three questions", paragraphs: [
        "First ask what scientists directly measured: a transit, mass estimate, spectrum, or something else. Next ask which conditions were inferred from a model. Finally, identify the observations still needed. That sequence prevents a promising target from becoming an unsupported life announcement.",
        "Use Astroboat's source links to inspect the original discovery wording. Notice terms such as candidate, consistent with, or potentially. They signal the authors' level of confidence. A planet can be an exciting place for follow-up without being a second Earth."
      ] }
    ],
    sources: [
      { label: "NASA: The Habitable Zone", url: "https://science.nasa.gov/exoplanets/habitable-zone/" },
      { label: "NASA: How We Find and Characterize Exoplanets", url: "https://science.nasa.gov/exoplanets/how-we-find-and-characterize/" }
    ],
    relatedPaths: [{ label: "Learn how exoplanets are detected", href: "/guides/how-we-find-exoplanets" }, { label: "Follow astronomy discoveries", href: "/briefs" }]
  },
  {
    slug: "webb-and-hubble-compared",
    title: "Webb and Hubble: Two Different Views of Space",
    description: "Why complementary wavelengths, mirrors, and observing locations matter more than deciding which telescope wins.",
    category: "Missions",
    tags: ["JWST", "Hubble", "Infrared", "Space telescopes"],
    sections: [
      { id: "wavelengths", heading: "Different light reveals different features", paragraphs: [
        "Hubble observes ultraviolet, visible, and some near-infrared light. Webb is designed primarily for near- and mid-infrared observations. Comparing them is therefore more interesting than comparing two cameras taking the same photograph.",
        "Infrared observations can reveal warm dust and some objects obscured at visible wavelengths. They also help study distant galaxies whose light has been stretched to longer wavelengths by cosmic expansion. A feature bright in one wavelength band may look faint in another."
      ] },
      { id: "design", heading: "Their designs suit their science", paragraphs: [
        "Webb has a larger primary mirror than Hubble and uses a sunshield to keep its observing instruments cold. Hubble orbits Earth; Webb follows an orbit around the Sun-Earth L2 region. Those environments impose different engineering and operational requirements.",
        "A larger mirror does not mean every Webb picture has finer detail than every Hubble picture. Angular resolution also depends on wavelength. Instrument choice, exposure, target, and processing all affect a fair comparison."
      ] },
      { id: "compare", heading: "Compare the same object carefully", paragraphs: [
        "In Astroboat's Gallery, start with an object observed by both telescopes. Read the instrument and filter information, align the fields of view, and ask which structures become clearer in each image. Dust, stars, and gas need not have the same apparent prominence.",
        "Check whether the image is a single telescope's observation or a composite combining several observatories. A colorful combined view can be scientifically useful, but it should not be interpreted as what human eyes would see from a nearby spacecraft window."
      ] }
    ],
    sources: [
      { label: "NASA: Webb FAQs", url: "https://science.nasa.gov/mission/webb/faqs-full/" },
      { label: "ESA/Webb: Image Comparisons", url: "https://esawebb.org/images/comparisons/" }
    ],
    relatedPaths: [{ label: "Explore observatory images", href: "/gallery" }, { label: "Read colors and captions", href: "/guides/how-to-read-space-images" }]
  },
  {
    slug: "how-to-read-space-images",
    title: "How to Read a Space Image Beyond the Colors",
    description: "Use captions, filter keys, scale bars, and credits to understand what an astronomy image actually shows.",
    category: "Astronomy Basics",
    tags: ["Space images", "Image processing", "Filters", "False color", "Gallery"],
    sections: [
      { id: "measurement", heading: "An image is a presentation of measurements", paragraphs: [
        "Astronomical detectors measure light through instruments and filters. Public color images often combine several exposures, assigning visible display colors to different wavelength bands. This is essential when the telescope measures infrared or other light our eyes cannot see.",
        "Assigned color does not make the measurement imaginary. It makes differences in the data visible. But a red patch might represent a chosen infrared filter rather than an object that would look red to an astronaut. The image key explains the mapping."
      ] },
      { id: "caption", heading: "Read the caption before interpreting detail", paragraphs: [
        "Identify the target, telescope, instrument, wavelengths, and observing date. Then check the scale bar and orientation. A cropped close-up, a wide mosaic, and an artist's impression can all fill the same screen while representing very different things.",
        "Sharp spikes around bright stars can be diffraction patterns caused by the telescope optics, rather than physical jets from those stars. Composites may combine observations made at different times. Those choices should be read from the source description rather than guessed from appearance."
      ] },
      { id: "practice", heading: "Try a three-sentence image description", paragraphs: [
        "Open an Astroboat Gallery item and describe what object is shown, which instrument measured it, and what one visible structure represents. If the caption does not support an interpretation, keep it as a question instead of turning it into a fact.",
        "Follow the original image link for credits and full-resolution context. When sharing, retain attribution and distinguish observations, reconstructed images, simulations, and illustrations. A useful space-image description explains both what you can see and how the image was made."
      ] }
    ],
    sources: [
      { label: "NASA: About Webb Images", url: "https://science.nasa.gov/mission/webb/multimedia/about-webb-images/" },
      { label: "NASA: Webb Image Galleries", url: "https://science.nasa.gov/mission/webb/multimedia/images/" }
    ],
    relatedPaths: [{ label: "Practice in the gallery", href: "/gallery" }, { label: "Compare Webb and Hubble", href: "/guides/webb-and-hubble-compared" }]
  },
  {
    slug: "rocket-launch-windows-and-countdowns",
    title: "Launch Windows, Holds, and Scrubs Explained",
    description: "Read a launch listing and follow a countdown without confusing a scheduled target time with a guaranteed liftoff.",
    category: "Missions",
    tags: ["Launches", "Launch windows", "Countdown", "Scrub", "UTC"],
    sections: [
      { id: "window", heading: "A launch has to meet its destination", paragraphs: [
        "A launch window is a period in which a vehicle can depart and still satisfy mission requirements. The target orbit, destination geometry, vehicle performance, and operational constraints influence that opportunity. Some windows are brief; others allow a range of possible liftoff times.",
        "An interplanetary opportunity also depends on where Earth and the destination are in their orbits. Missing one day's attempt is not always equivalent to missing an entire planetary departure opportunity, so read which kind of window a source is discussing."
      ] },
      { id: "countdown", heading: "Pauses are part of launch operations", paragraphs: [
        "A hold pauses the countdown. Some holds are planned into the procedure; others give teams time to investigate an issue. The clock can be recycled to an earlier point. A countdown display is therefore not always a simple wall-clock promise of liftoff.",
        "A scrub ends a particular launch attempt. It does not mean the entire mission is canceled. Weather, hardware checks, range safety, and other conditions can require another attempt, and a new date may remain unconfirmed while teams assess the situation."
      ] },
      { id: "listing", heading: "Read the status alongside the time", paragraphs: [
        "In Astroboat's Events list, check the event date, time-zone label, and status together. A no-earlier-than time is a planning target. A launch success also needs context: liftoff, orbital insertion, and payload deployment are different milestones.",
        "Open the source link before making travel plans or joining a livestream. Cached listings may lag a late change. Save both the UTC time and your converted local date, then use the provider's live updates for the final countdown and outcome."
      ] }
    ],
    sources: [
      { label: "NASA: Basics of Space Flight, Chapter 14 - Launch", url: "https://science.nasa.gov/learn/basics-of-space-flight/chapter14-1/" },
      { label: "NASA: Artemis II Press Kit, Countdown Procedures", url: "https://www.nasa.gov/artemis-ii-press-kit/" }
    ],
    relatedPaths: [{ label: "See upcoming launches", href: "/events" }, { label: "Understand UTC conversion", href: "/guides/moonrise-moonset-and-local-time" }]
  },
  {
    slug: "orbits-and-lagrange-points",
    title: "Earth Orbits and Lagrange Points: Where Missions Go",
    description: "Compare low Earth, geostationary, and polar orbits, then understand why some observatories operate around L1 or L2.",
    category: "Missions",
    tags: ["Orbits", "Satellites", "LEO", "Geostationary", "Lagrange points", "L2"],
    sections: [
      { id: "orbit", heading: "Orbit is motion under gravity", paragraphs: [
        "An orbiting spacecraft continually falls under gravity while moving sideways fast enough to follow a curved path around a body. It has not escaped gravity simply because astronauts float inside. Its trajectory depends on both position and velocity.",
        "Low Earth orbit brings a satellite relatively near the surface, useful for crewed flight and many observing missions. Polar orbits pass near the poles and can build coverage as Earth turns beneath them. Mission goals determine which geometry is useful."
      ] },
      { id: "geo", heading: "Geostationary has a specific meaning", paragraphs: [
        "A geostationary satellite follows a circular orbit above the equator with Earth's sidereal rotation period, appearing fixed over one longitude. This is useful for communications and continuous regional weather views. Not every high orbit or geosynchronous orbit is geostationary.",
        "An orbit's altitude alone does not describe the whole path. Inclination, shape, and period also matter. A launch may initially place a payload into a transfer orbit rather than its final working orbit."
      ] },
      { id: "lagrange", heading: "Lagrange points move with the system", paragraphs: [
        "In a system such as the Sun and Earth, five Lagrange points describe special locations in a frame rotating with those bodies. Spacecraft near L1 can monitor the Sun; the L2 region is useful for observatories that need controlled lighting and thermal conditions.",
        "Spacecraft commonly follow paths around these regions rather than sitting motionless at a point. L1 and L2 missions need orbit corrections. When a mission appears in Astroboat's Briefs, checking its destination orbit often explains its design more clearly than the launch vehicle name does."
      ] }
    ],
    sources: [
      { label: "ESA: Types of Orbits", url: "https://www.esa.int/Enabling_Support/Space_Transportation/Types_of_orbits" },
      { label: "ESA: What Are Lagrange Points?", url: "https://www.esa.int/Enabling_Support/Operations/What_are_Lagrange_points" }
    ],
    relatedPaths: [{ label: "Follow mission milestones", href: "/events" }, { label: "Compare Webb and Hubble", href: "/guides/webb-and-hubble-compared" }]
  }
];

export const astronomyGuides: Guide[] = entries.map((entry) => ({
  ...entry,
  publishedAt: "2026-10-21",
  author: "Astroboat",
  aiAssisted: true,
  readingMinutes: Math.max(1, Math.ceil(entry.sections.flatMap((section) => section.paragraphs).join(" ").split(/\s+/).length / 200)),
  showTableOfContents: true,
  status: "published"
}));
