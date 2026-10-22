import type { Guide } from "@/lib/guides";

// Editorial copy lives separately from routing, tags, and publication metadata.
export const guideSections: Record<string, Guide["sections"]> = {
  "understanding-moon-phases": [
    {
      id: "sunlight", heading: "A phase is a viewing angle, not a shadow",
      paragraphs: [
        "The Moon does not change shape. Sunlight illuminates roughly half of its globe, and its orbit changes how much of that daylight side faces Earth. A crescent is a mostly dark near side with a narrow sunlit edge. The unlit part has not disappeared, and Earth's shadow is not covering it: that is a different event, a lunar eclipse.",
        "Picture a ball lit by a lamp. Moving around the ball changes the bright portion you can see without changing the ball or the lamp. The Moon's monthly cycle works through this same geometry. New Moon places it roughly in the Sun's direction; full Moon puts it roughly opposite the Sun. The alignment is usually not exact enough for an eclipse."
      ], sourceUrls: ["https://science.nasa.gov/moon/moon-phases/"]
    },
    {
      id: "names", heading: "Read the phase before memorizing eight names",
      paragraphs: [
        "Two words describe the trend: waxing means the illuminated fraction is growing, and waning means it is shrinking. Two describe the shape: crescent means less than half of the visible disk is lit; gibbous means more than half. First and last quarter both look half-lit. Quarter describes the Moon's progress around the cycle, not the fraction of the disk that is bright.",
        "Illumination alone cannot distinguish a waxing Moon from a waning one: both pass through 40%, for example. You also need the phase name or observations on successive days. Avoid a universal right-side/left-side rule, because the apparent orientation changes with hemisphere, latitude, and how the Moon is tilted in your sky."
      ]
    },
    {
      id: "timing", heading: "What the phase suggests about timing",
      paragraphs: ["These are rough relationships, not a replacement for local rise and set calculations. Latitude, season, and the Moon's changing path alter the details."],
      table: { caption: "Phase and a useful observing window", columns: ["Phase", "Rough timing", "Good reason to look"], rows: [
        ["Waxing crescent", "After sunset", "Earthshine and a thin sunlit edge"],
        ["First quarter", "Evening; sets around midnight", "Long crater shadows near the terminator"],
        ["Full", "Rises around sunset", "Broad dark plains and bright ray systems"],
        ["Last quarter", "Late night and morning", "The opposite lighting on familiar terrain"]
      ] }
    },
    {
      id: "cycle", heading: "Why a lunar month is about 29.5 days",
      paragraphs: [
        "An orbit relative to the background stars takes about 27.3 days. During that orbit, Earth also moves around the Sun. The Moon must travel farther to repeat the same Sun-Earth-Moon angle, so new Moon to new Moon averages about 29.5 days. Neither number means that every calendar month contains the same sequence on the same dates.",
        "The far side is not a permanently dark side. It experiences lunar day and night too. Tidal locking explains why nearly the same lunar hemisphere faces Earth; it does not stop sunlight from reaching the other hemisphere."
      ], sourceUrls: ["https://science.nasa.gov/moon/facts/"]
    },
    {
      id: "practice", heading: "Try a three-evening observation",
      paragraphs: ["Choose evenings a day or two apart when the Moon is visible from the same spot. Record the local time, a rough sketch, and the Moon's position relative to a landmark. The useful result is the pattern, not a perfect drawing."],
      list: { ordered: true, items: [
        "Estimate whether less or more than half the disk is bright before checking a phase label.",
        "Compare your next sketch: is the illuminated area growing or shrinking? That identifies waxing or waning.",
        "Separate phase from visibility. A correct phase prediction cannot tell you whether a building, clouds, or your horizon hides the Moon."
      ] }
    }
  ],
  "how-to-observe-the-moon": [
    {
      id: "target", heading: "Choose a forgiving first session",
      paragraphs: [
        "A first-quarter Moon on a clear evening is a better classroom than a list of dozens of craters. It is conveniently placed after sunset, and sunlight arrives at a shallow angle along the day-night boundary, called the terminator. There, small changes in terrain cast conspicuous shadows. Full Moon is still worth observing, but frontal illumination flattens much of that relief.",
        "Start from a safe, comfortable place with a clear view. You do not need a remote dark-sky site for this bright target. Avoid observing through a closed window or directly above a warm roof if possible: glass and rising warm air can degrade fine detail. If the view shimmers, wait and compare rather than immediately increasing magnification."
      ], sourceUrls: ["https://science.nasa.gov/moon/viewing-tips/"]
    },
    {
      id: "landscape", heading: "Learn three kinds of landscape",
      paragraphs: [
        "The broad dark areas are maria: ancient volcanic plains, not present-day seas. The brighter, more rugged areas are highlands. Circular depressions are usually impact craters. This three-part vocabulary makes a lunar map much less intimidating, because you can classify a feature before knowing its name.",
        "Begin with one large dark plain, such as Mare Imbrium when it is illuminated, and one nearby crater shown on your map. Do not force an identification in shadow. A named feature may be invisible tonight because of the phase, and a telescope or diagonal may rotate or mirror the view. Match several neighboring shapes before deciding which way the map should face."
      ], sourceUrls: ["https://science.nasa.gov/moon/facts/"]
    },
    {
      id: "session", heading: "A simple 15-minute observing sequence",
      paragraphs: ["Keep the first session small enough to repeat. Eyes alone are sufficient for the first step; binoculars or a telescope add detail, not permission to begin."],
      list: { ordered: true, items: [
        "Spend two minutes looking without equipment. Sketch the outline and the largest dark patches.",
        "With binoculars, brace your elbows or use a supported position. Adjust the eyecups and focus for a comfortable single image.",
        "At a telescope, begin with the lowest useful power. Trace a short stretch of the terminator and notice a bright rim beside a dark crater floor.",
        "Use a map to identify only two features. Write down what supported each identification.",
        "Finish by noting the time, phase, equipment, and whether the air looked steady or rippling."
      ] }
    },
    {
      id: "troubleshooting", heading: "If the view is disappointing",
      paragraphs: [
        "A trembling image usually calls for better support; a boiling image often points to atmospheric turbulence or a telescope still adjusting to outdoor temperature. An image that becomes larger but blurrier at higher power is a reason to go back down. More magnification does not manufacture information missing from the light reaching the instrument.",
        "The Moon can feel dazzling through a telescope at night. That discomfort is not the same hazard as looking at the Sun. Keep equipment firmly away from the Sun, especially during daytime lunar viewing; ordinary lunar filters and sunglasses are not solar protection."
      ]
    },
    {
      id: "return", heading: "Return to the same feature",
      paragraphs: [
        "Look again one or two nights later. A crater that looked dramatic may now be difficult to pick out because its shadows have shortened. That is the lesson: you are watching illumination reveal topography, not watching the terrain change.",
        "Keep the original sketch beside the new one and label the differences. A useful observing record says what you actually saw, including uncertainty. 'Likely the same crater; rim less distinct' is more honest and more helpful than adding a confident name you could not verify."
      ]
    }
  ],
  "moonrise-moonset-and-local-time": [
    {
      id: "changing-times", heading: "The Moon does not keep a nighttime-only schedule",
      paragraphs: [
        "A daytime Moon is ordinary. Its position relative to the Sun changes through the month, so it can be above the horizon in daylight, darkness, or both. A full Moon is roughly opposite the Sun and usually rises near sunset; a first-quarter Moon is generally an evening target. These relationships explain the broad pattern, not the exact time at your address.",
        "You may hear that moonrise becomes about 50 minutes later each day. That is an average, not a dependable daily increment. The Moon's changing declination, your latitude, and the geometry of its path against the horizon all matter. Use a location-specific calculation instead of adding 50 minutes to yesterday's result."
      ], sourceUrls: ["https://science.nasa.gov/skywatching/faq/"]
    },
    {
      id: "horizon", heading: "Predicted rise is not first visibility",
      paragraphs: [
        "A rise/set table assumes a defined horizon and atmospheric model. It does not know that your eastern view contains a ridge or an apartment block. If moonrise is listed as 19:10, the Moon may not clear that obstruction until later. Haze can also make a low crescent hard to see even after it has technically risen.",
        "Near the poles, there can be long intervals when the Moon stays above or below the horizon. Even elsewhere, a calendar date may lack a rise or a set. A dash in a well-documented table can therefore be a real result rather than an outage. Check the provider's definitions before treating it as missing data."
      ]
    },
    {
      id: "utc", heading: "Convert the date as well as the hour",
      paragraphs: [
        "UTC provides a shared time reference; local civil time applies the offset in effect where you are. India Standard Time is UTC plus 5 hours 30 minutes. Many other locations change their offset seasonally, so a named time zone and a date are safer than a remembered fixed difference.",
        "Worked example: an illustrative event at 20:40 UTC on 12 November converts to 02:10 IST on 13 November. Add 5 hours 30 minutes, then carry the result into the next day. In reverse, 01:00 IST on 13 November is 19:30 UTC on 12 November. Neither example is a prediction of an actual event."
      ], sourceUrls: ["https://aa.usno.navy.mil/faq/UT"]
    },
    {
      id: "labels", heading: "Read timestamp labels literally",
      paragraphs: [
        "In an ISO timestamp, a trailing Z identifies UTC; an explicit offset such as +05:30 identifies that offset. If a page already displays 'your local time', do not add your offset again. A bare date and hour without a zone is ambiguous, especially for international launch coverage.",
        "Some astronomical services distinguish Earth-rotation time, UT1, from civil UTC. Follow the service's documentation for precision work. For a casual lunar observation, confusing the calendar day or using another city's forecast is far more consequential than the sub-second difference between those time scales."
      ]
    },
    {
      id: "checklist", heading: "Before leaving home",
      paragraphs: ["Write one complete observing appointment rather than saving a loose time such as '8:30'. That makes it easier to catch mistakes when sharing the plan."],
      list: { items: [
        "Confirm the coordinates or city, observing date, and time-zone label.",
        "Record the converted local date, local time, and the original UTC timestamp together.",
        "Check both rise and set times, then allow for your real horizon and the Moon's altitude during the session.",
        "For a time-critical event, verify the original source again rather than relying on an old screenshot."
      ] }
    }
  ],
  "solar-eclipses-and-eye-safety": [
    {
      id: "alignment", heading: "First find out what your location will see",
      paragraphs: [
        "A solar eclipse happens when the Moon passes in front of the Sun from an observer's viewpoint. Within the narrow path of a total eclipse, the bright solar surface is completely covered for a time. An annular eclipse leaves a bright ring; a partial eclipse leaves part of the surface exposed. A globally famous total eclipse may be only partial, or not visible at all, from your location.",
        "Your first planning task is therefore a map, not a countdown. Find your observing site, the eclipse type there, the local contact times, and the Sun's altitude. A label such as '99% covered' is not totality: the remaining bright surface still requires solar protection."
      ], sourceUrls: ["https://science.nasa.gov/eclipses/types/"]
    },
    {
      id: "protection", heading: "Direct viewing: two different kinds of protection",
      paragraphs: [
        "For unaided viewing during partial or annular phases, use undamaged eclipse glasses or a handheld solar viewer from a trustworthy supplier that complies with ISO 12312-2. Sunglasses are not a substitute. A printed claim alone does not establish that a product is genuine; consult the American Astronomical Society's supplier guidance. Inspect viewers and supervise children.",
        "Binoculars, telescopes, and optical camera viewfinders are a separate case. Never look through them while wearing eclipse glasses: concentrated sunlight can destroy the viewer and injure your eyes. Those instruments need appropriate securely fitted filters over the front apertures, following specialist and manufacturer guidance. A dark eyepiece filter is not an equivalent arrangement."
      ], sourceUrls: ["https://science.nasa.gov/eclipses/safety/", "https://eclipse.aas.org/eye-safety"]
    },
    {
      id: "projection", heading: "The simplest alternative is an indirect image",
      paragraphs: [
        "You can observe a projected image with your back to the Sun. A small pinhole in a card lets sunlight fall onto another light-colored surface. Watch the image on that surface; do not look through the hole. A colander can produce many little solar crescents on the ground during partial phases.",
        "This is a good first-eclipse activity because several people can compare the changing shape without aiming optical equipment. Set it up beforehand and check that children understand which surface to watch. Do not improvise projection through a telescope or binoculars: concentrated sunlight can damage equipment and creates additional hazards."
      ], sourceUrls: ["https://eclipse.aas.org/eye-safety/projection"]
    },
    {
      id: "totality", heading: "Totality is a precise, local exception",
      paragraphs: [
        "Only during actual totality, within the path where the bright solar surface is completely covered, may unaided observers remove solar viewers. Protection must be back in place before that surface reappears. Partial and annular eclipses have no such safe unfiltered interval. Clouds do not create one.",
        "For a first observation, arrange guidance from a reputable astronomy group and establish the exact local sequence before the event. If you are unsure whether totality has begun or ended, keep protection in place. Observing a safe projected image is preferable to guessing from the dimness of the landscape."
      ]
    },
    {
      id: "plan", heading: "A practical pre-eclipse checklist",
      paragraphs: ["Keep the equipment plan simple enough that you can follow it without troubleshooting during the eclipse. Weather and road access can change; eye safety does not."],
      list: { items: [
        "Verify the observing location on a trusted eclipse map and convert all contact times to the correct local date.",
        "Obtain and inspect viewers in advance; arrange a projection option if supplies or conditions are uncertain.",
        "Do not let photography distract you from safe viewing procedures or supervising children.",
        "Read the complete NASA and AAS guidance below before using any optical setup."
      ] }
    }
  ],
  "lunar-eclipses-explained": [
    {
      id: "shadow", heading: "A full Moon passes through Earth's shadow",
      paragraphs: [
        "A lunar eclipse requires the Sun, Earth, and Moon to line up so that Earth's shadow reaches the Moon. That can happen only around full Moon. It does not happen every month because the lunar orbit is tilted relative to Earth's orbital plane: the Moon usually passes above or below the shadow.",
        "Unlike a solar eclipse, you are not trying to stand inside a narrow shadow crossing Earth. You are watching a change on the Moon itself. Observers across the night side of Earth can share the event, provided the Moon is above their horizon during the relevant stages. Some locations see the whole sequence; others see an already-eclipsed Moon rise or lose it at moonset."
      ], sourceUrls: ["https://science.nasa.gov/moon/eclipses/"]
    },
    {
      id: "stages", heading: "Know which stage you are waiting for",
      paragraphs: ["The penumbra is the outer, lighter shadow where Earth blocks only part of the Sun. In the central umbra, Earth blocks the direct solar disk. The distinction explains why the first predicted contact may look uneventful."],
      table: { caption: "Three kinds of lunar eclipse", columns: ["Type", "What happens", "What to expect"], rows: [
        ["Penumbral", "Moon enters only the outer shadow", "A subtle shading change; easy to miss"],
        ["Partial", "Part of the disk enters the umbra", "A dark curved bite in the bright Moon"],
        ["Total", "The whole disk enters the umbra", "A dimmer Moon, often coppery or reddish"]
      ] }
    },
    {
      id: "color", heading: "Red does not mean the Moon is producing red light",
      paragraphs: [
        "During totality, some sunlight passes through Earth's atmosphere and bends into the shadow. Shorter wavelengths are scattered more strongly, so the light reaching the Moon is enriched in red and orange. The Moon reflects that filtered sunlight back toward us.",
        "The exact brightness and color depend on the eclipse geometry and Earth's atmosphere, including clouds and aerosols. 'Blood Moon' is a popular nickname, not a separate event category or a guarantee of a vivid red view. Camera settings also matter: a long exposure can make a dark eclipse appear much brighter than it looked to your eyes."
      ]
    },
    {
      id: "watch", heading: "Plan around your horizon, not just the maximum",
      paragraphs: [
        "Lunar eclipses are safe to observe without eclipse glasses. Binoculars help reveal color differences and the shadow edge; a telescope gives a closer view, while unaided eyes keep the full scene in context. The useful equipment choice is whichever lets you observe comfortably for an extended session.",
        "Read the local start, partial-phase, totality, and end times alongside moonrise and moonset. If totality happens with the Moon near your horizon, choose a site with an unobstructed view in that direction. Check the time-zone label and date rollover before setting an alarm. A worldwide event time is not a statement that the event will be visible from every city."
      ], sourceUrls: ["https://science.nasa.gov/eclipses/"]
    },
    {
      id: "record", heading: "Make a record that captures the change",
      paragraphs: ["Use the same viewing method at several stages so the comparison is meaningful. For photographs, record whether you changed exposure; otherwise a camera adjustment can masquerade as a change in lunar brightness."],
      list: { ordered: true, items: [
        "Sketch or photograph the ordinary full Moon before the obvious umbral phase, if visible locally.",
        "Record the time when the curved shadow first becomes unmistakable to you; distinguish this from the calculated contact time.",
        "During totality, note color, whether the disk looks evenly lit, and whether more background stars are visible.",
        "Repeat as the Moon leaves the shadow, or note exactly when your horizon ends the session."
      ] }
    }
  ],
  "how-to-watch-a-meteor-shower": [
    {
      id: "what", heading: "Watch the whole sky, not just the radiant",
      paragraphs: [
        "A meteor is the brief light produced as a small object enters the atmosphere at high speed. During a shower, Earth passes through a stream of debris, usually left by a comet. The particles follow similar paths, so their streaks appear to spread from one point in the sky: the radiant. That is a perspective effect, like parallel railway tracks appearing to converge.",
        "The shower name identifies the radiant's region, not the only place meteors appear. Staring directly at the radiant is unnecessary. A broad, comfortable view lets you notice streaks elsewhere, and meteors farther from the radiant can make longer-looking tracks. Binoculars and telescopes restrict the field, so your unaided eyes are usually the best tool."
      ], sourceUrls: ["https://spaceplace.nasa.gov/meteor-shower/en/"]
    },
    {
      id: "conditions", heading: "Choose a useful hour, not just a famous date",
      paragraphs: [
        "A predicted maximum is a time interval, not a switch that turns the shower on. Compare it with darkness at your location, the radiant's altitude, Moon conditions, and weather. A peak during your daylight may make an adjacent night the more practical choice. Some showers favor the hours after midnight, but follow shower-specific advice rather than treating that as universal.",
        "A high radiant places more of the incoming stream above your horizon. Bright moonlight, haze, clouds, and buildings remove part of the usable sky or hide faint meteors. A modest shower under good conditions can therefore make a better session than a stronger one behind clouds or city glare."
      ]
    },
    {
      id: "plan", heading: "Set up for an hour of looking, not waiting uncomfortably",
      paragraphs: ["A reclining chair, warm layers, and a clear view are more useful than elaborate optics. Choose legal access and a safe return route; do not make a roadside stop where traffic or headlights create a hazard."],
      list: { ordered: true, items: [
        "Check the shower's current activity period, local darkness, and the Moon's rise and set times.",
        "Find a broad view away from exposed lamps. If the Moon is up, keep it out of your direct gaze while choosing the darkest useful part of the sky.",
        "Allow roughly 20-30 minutes for your eyes to adapt; avoid resetting that adaptation with a bright screen.",
        "Watch for a sustained period. Meteors arrive unevenly, so a quiet five minutes is not a reliable verdict on the night."
      ] }
    },
    {
      id: "rates", heading: "Why '100 an hour' is not your personal forecast",
      paragraphs: [
        "A zenithal hourly rate normalizes counts to ideal conditions, including a radiant overhead and a dark sky. It is useful for comparing shower activity, but it is not the number every observer should see. Real counts depend on radiant height, sky brightness, the visible area, and how long you are actually watching.",
        "Imagine two observers at the same site: one watches continuously for an hour, while another spends half that time checking a phone. Their totals are not directly comparable. Record effective watching time, not just the time between arrival and departure. Do not extrapolate one lucky minute into a dramatic hourly claim."
      ], sourceUrls: ["https://www.nasa.gov/blogs/watch-the-skies/2019/11/19/about-the-upcoming-maybe-alpha-monocerotid-meteor-shower-outburst/"]
    },
    {
      id: "record", heading: "Make a useful informal log",
      paragraphs: [
        "Record your location, start and stop times, cloud cover, Moon conditions, and any breaks. You can count in short intervals to see how variable the activity feels. A few unrelated sporadic meteors may appear too; a single streak is not automatically a member of the named shower.",
        "If you want to contribute scientific observations, use the reporting organization's instructions for shower identification and observing geometry. For a first session, success can simply mean recognizing several meteors and understanding why your view differed from the headline rate."
      ]
    }
  ],
  "planets-conjunctions-and-opposition": [
    {
      id: "line", heading: "A planet pairing is an angle in your sky",
      paragraphs: [
        "When the Moon and a bright planet appear close together, they have not become neighbors in space. You are seeing two objects at very different distances along nearby directions. Their apparent separation is an angle. The full Moon spans roughly half a degree, a useful visual reference for understanding a chart that lists a one-degree pairing.",
        "Planets tend to follow a broad arc near the ecliptic because their orbits share approximately the same plane. 'Planet parade' is an informal headline, not a promise that every named planet will be conspicuous. Some may be faint, low in twilight, or invisible without equipment. The useful question is which objects you can actually see from your location."
      ], sourceUrls: ["https://science.nasa.gov/solar-system/skywatching/planetary-alignments-and-planet-parades/"]
    },
    {
      id: "conjunction", heading: "Conjunction and closest approach are not always identical",
      paragraphs: [
        "A conjunction is defined using a shared celestial coordinate, such as right ascension or ecliptic longitude. Objects can satisfy that definition while retaining a noticeable separation in the other coordinate. Their smallest apparent separation may happen at a somewhat different time.",
        "This matters when a calendar gives an exact conjunction time. You do not necessarily need to observe at that minute. Read the local visibility guidance and separation instead. For a Moon-planet pairing, observers in different places can see somewhat different geometry because the nearby Moon shifts against the distant background with the observer's position."
      ]
    },
    {
      id: "opposition", heading: "Opposition is a different observing opportunity",
      paragraphs: [
        "At opposition, a planet with an orbit outside Earth's appears opposite the Sun. It generally rises around sunset, reaches its highest part of the sky during the night, and sets around sunrise. The surrounding period often offers favorable observing geometry. Mercury and Venus cannot reach opposition as seen from Earth because their orbits lie inside ours.",
        "Opposition does not make a planet Moon-sized, and exact closest distance need not occur at the same instant. Apparent size and brightness vary from one opposition to another, especially for Mars. To see fine detail, the planet's altitude and atmospheric steadiness may matter more than observing at the exact geometric moment."
      ], sourceUrls: ["https://science.nasa.gov/skywatching/"]
    },
    {
      id: "example", heading: "Turn a listing into an observing plan",
      paragraphs: [
        "Suppose an illustrative listing says 'Moon and planet, two degrees apart, low west after sunset.' Two degrees is about four apparent lunar diameters. 'Low west' is the operational detail: a rooftop or ridge could hide the pair before the sky gets dark. The exact conjunction timestamp alone cannot solve that problem.",
        "Check a chart set to your location and time, identify an unobstructed western horizon, and start with unaided eyes. Confirm the planet rather than assuming the nearest bright point must be it. Do not sweep binoculars near the Sun while searching; wait for a safely separated nighttime target."
      ]
    },
    {
      id: "checklist", heading: "Five details worth saving",
      paragraphs: ["A useful event note contains more than a date. Save these details together so you can judge whether the event fits your view."],
      list: { items: [
        "The objects involved and whether the event is a conjunction, closest pairing, or opposition.",
        "Your location, local date, and observing window, with the original time zone identified.",
        "Direction and altitude above the horizon, not just a compass bearing.",
        "Angular separation and whether all objects fit in your binocular field.",
        "Visibility limits: twilight, Moon glare, clouds, buildings, and any need for optical assistance."
      ] }
    }
  ],
  "constellations-and-star-charts": [
    {
      id: "regions", heading: "Use constellations as sky addresses",
      paragraphs: [
        "A constellation is an officially defined region of the sky, not simply a stick-figure drawing. There are 88 such regions covering the whole celestial sphere. Their bright-star patterns are useful landmarks, but the stars in one pattern can lie at very different distances and need not form a physical group.",
        "An asterism is a recognizable pattern that is not a complete official constellation. The Big Dipper belongs to Ursa Major; the Summer Triangle joins bright stars in several constellations. For a beginner, an easy asterism is often a better first landmark than an elaborate outline whose faint stars are hidden by city light."
      ], sourceUrls: ["https://spaceplace.nasa.gov/constellations/en/", "https://starchild.gsfc.nasa.gov/docs/StarChild/questions/question9.html"]
    },
    {
      id: "setup", heading: "Set place, date, and time before identifying anything",
      paragraphs: [
        "A sky chart is a prediction for a viewpoint. Set your location or latitude, the date, and the correct local time zone. Earth's rotation changes the view during a night; Earth's orbit changes the evening sky through the year. A chart for another hemisphere or season may be perfectly correct and still be useless for your current view.",
        "On an all-sky chart, the center usually represents the zenith, directly overhead, and the outer edge represents the horizon. Symbols and dot sizes are a key, not a literal picture: larger dots usually mean brighter stars, not stars with larger apparent disks. Read the legend before interpreting a symbol as a real object."
      ]
    },
    {
      id: "orientation", heading: "Why east can seem to be on the wrong side",
      paragraphs: [
        "A sky map is meant to represent looking upward, unlike a ground map viewed downward. Its east-west arrangement can therefore feel reversed when you lay it flat on a desk. Face the direction you want to study and rotate the relevant horizon label toward that direction, following the chart's instructions.",
        "Phone compass views add another source of error: nearby metal, magnetic calibration, or an inaccurate location can shift the overlay. Use two or three bright stars to confirm the view instead of accepting a label because the phone points there. Once oriented, dim or put away the screen so you can see fainter stars."
      ]
    },
    {
      id: "practice", heading: "Learn one patch of sky in three passes",
      paragraphs: ["You do not need to learn the whole sky in one evening. Choose a simple pattern that your current chart places comfortably above the horizon, then build out from it."],
      list: { ordered: true, items: [
        "Find the brightest obvious landmark with your eyes. Compare its direction and height with the chart.",
        "Identify a second bright star and compare their spacing. Look for a triangle or distinctive bend, not an imagined illustration.",
        "Add one nearby star or object. Return to the first landmark whenever you lose your place.",
        "Sketch the pattern with a roofline or tree for orientation, then check it an hour later to notice daily sky motion."
      ] }
    },
    {
      id: "limits", heading: "A chart is not a visibility guarantee",
      paragraphs: [
        "A catalog may plot a galaxy, nebula, or planet that your eyes cannot detect from that location. Brightness, angular size, skyglow, haze, and equipment all affect visibility. Seeing its label does not mean you should see a bright colored patch like a photograph.",
        "If the pattern will not match, check the time and direction before doubting your eyesight. Then consider cloud or light pollution. A few securely recognized stars are a stronger foundation for finding meteor radiants and binocular targets than a long list of names learned without a view of the real sky."
      ]
    }
  ],
  "light-pollution-and-dark-skies": [
    {
      id: "contrast", heading: "The problem is lost contrast",
      paragraphs: [
        "A faint galaxy does not become brighter when you leave a city; the background around it becomes darker. Artificial light scattered by the atmosphere produces skyglow, reducing the contrast that lets your eye distinguish the object. A nearby unshielded lamp adds glare, which can spoil your view even where the wider sky is relatively dark.",
        "Light trespass is unwanted illumination spilling into another space, such as a neighbor's floodlight shining into your observing area. These are related problems, but they have different remedies. Blocking a lamp can reduce direct glare immediately; it does not remove the dome of scattered light from an entire city."
      ], sourceUrls: ["https://www.nps.gov/subjects/nightskies/lightpollution.htm"]
    },
    {
      id: "conditions", heading: "Separate darkness, transparency, and steadiness",
      paragraphs: [
        "Darkness describes the sky background. Transparency describes how well light passes through the atmosphere: haze and thin cloud can hide faint targets. Seeing describes the steadiness of the image through turbulent air. A dark site can have poor seeing, while a city can occasionally offer steady views of the Moon or planets.",
        "This distinction helps you choose a target rather than declaring a night simply good or bad. For broad faint structures such as the Milky Way, seek darkness and transparency. For fine planetary detail, altitude and steady air are particularly important. Moonlight is natural sky brightness, but it still affects your plan for faint objects."
      ]
    },
    {
      id: "city", heading: "Make a city session worthwhile",
      paragraphs: [
        "Begin with bright targets: lunar terrain, bright planets, double stars, or recognizable star patterns. Use a building or a safe screen to block direct lamps without blocking the target. Avoid looking at bright phone screens between observations. Keeping a small useful list is more rewarding than searching unsuccessfully for objects chosen from dark-sky photographs.",
        "Filters are not a universal cure. Some specialist filters improve contrast for particular emission nebulae, but they do not erase all artificial light, and they also remove some target light. Before adding equipment, improve your position and match the target to the sky you actually have."
      ]
    },
    {
      id: "trip", heading: "Evaluate a darker site before making the trip",
      paragraphs: ["A light-pollution map is a planning aid, not a forecast for one evening. A dark-colored patch on a map may still have restricted access, a blocked horizon, cloud, or a bright Moon."],
      list: { items: [
        "Confirm legal nighttime access, safe parking, mobile coverage if needed, and a return plan.",
        "Check cloud, haze, wind, and the Moon's actual observing-hour position, not just its phase name.",
        "Look for the horizon your target needs. A low southern object will not benefit from darkness behind a southern ridge.",
        "Bring warm clothing and use only the dim task lighting necessary. Avoid headlights or bright screens around other observers."
      ] }
    },
    {
      id: "lighting", heading: "Improve the light you control",
      paragraphs: [
        "Useful outdoor lighting puts light where and when it is needed. Shield fixtures, aim them down, avoid excessive brightness, and use timers or motion controls where appropriate. A warmer color can help reduce short-wavelength output, but a warm lamp that shines upward all night is still poorly controlled lighting.",
        "Try a small comparison from the same observing spot with your own nearby light on and off. Record which stars you can see, keeping Moon and weather conditions in mind. The aim is not to eliminate necessary safety lighting; it is to stop wasting light into eyes, neighboring properties, and the sky."
      ], sourceUrls: ["https://www.nps.gov/subjects/nightskies/outdoor-lighting-principles.htm"]
    }
  ],
  "binoculars-for-stargazing": [
    {
      id: "numbers", heading: "Understand the pair you already have",
      paragraphs: [
        "A label such as 7 x 50 means seven-times magnification and 50-millimeter front lenses. The first number enlarges both the target and your hand movement. The second describes aperture, which affects light gathering. Neither number alone tells you whether the instrument will be comfortable to use or well suited to a particular target.",
        "The exit pupil, approximately aperture divided by magnification, describes the diameter of the light bundle leaving the eyepiece. For 7 x 50 binoculars it is about 7.1 millimeters. That is an optical relationship, not a guarantee that your eye can use all that light: your pupil size and observing conditions matter. Do not treat one specification as a universal best choice."
      ], sourceUrls: ["https://science.nasa.gov/solar-system/skywatching/night-sky-network/binoculars-a-great-first-telescope/"]
    },
    {
      id: "setup", heading: "Adjust the fit before judging the view",
      paragraphs: [
        "Change the hinge spacing until you see one comfortable circular view. Set the eyecups appropriately for glasses, following the binocular instructions. If there is a separate diopter adjustment, use it to account for differences between your eyes rather than trying to solve everything with the central focus wheel.",
        "Brace your elbows, lean against a stable support, or observe from a reclining chair. A supported modest-power view can reveal more than a higher-power image that never stops shaking. If you see two images that do not merge comfortably after adjusting the fit, stop straining: the instrument may need alignment or service."
      ], sourceUrls: ["https://science.nasa.gov/skywatching/"]
    },
    {
      id: "targets", heading: "Choose targets that suit a wide view",
      paragraphs: ["Binoculars excel at putting an object in context. They are not miniature replacements for a high-power planetary telescope, and they will not reproduce observatory photographs."],
      table: { caption: "Useful first binocular targets", columns: ["Target", "What to look for", "Limit to expect"], rows: [
        ["Moon", "Mare patterns and relief near the terminator", "Hand shake can hide small detail"],
        ["A bright open cluster", "More stars than you see unaided", "Choose one visible from your latitude and season"],
        ["A rich star field", "Crowded and sparse patches", "Moonlight and city skyglow reduce contrast"],
        ["A bright planet", "Its setting among nearby stars", "Little or no useful surface detail at low power"]
      ] }, sourceUrls: ["https://science.nasa.gov/moon/viewing-tips/"]
    },
    {
      id: "finding", heading: "Find the target before lifting the binoculars",
      paragraphs: [
        "Locate an obvious target with your eyes. Keep looking at it while bringing the binoculars into position rather than looking down first and losing your direction. Once it is centered, adjust focus slowly. If you get lost, lower the binoculars and restart from the landmark instead of sweeping randomly.",
        "For a fainter target, use a chart showing a nearby bright star and move in small steps. Check the binocular field of view printed on the instrument or in its manual: an angular separation on a chart only helps if you know roughly how much sky fits in the view. Keep the chart dim and do not expect its drawn lines to exist overhead."
      ]
    },
    {
      id: "session", heading: "A short exercise, with one firm safety rule",
      paragraphs: [
        "Spend a few minutes comparing the Moon unaided and through supported binoculars. Sketch one dark plain and the shape of the terminator, then repeat on another night. Or choose a well-placed open cluster and mark which stars become visible only with the binoculars. These comparisons teach you what your actual instrument adds.",
        "Never point binoculars at the Sun without a properly designed specialist solar setup. Eclipse glasses worn over your eyes do not make binocular solar viewing safe. For early practice, choose nighttime targets comfortably away from twilight and concentrate on pointing, steadiness, and a relaxed view."
      ]
    }
  ],
  "telescope-basics-aperture-and-magnification": [
    {
      id: "light", heading: "Start with what the telescope collects",
      paragraphs: [
        "A telescope's main lens or mirror gathers light and forms an image; the eyepiece lets your eye examine that image. A refractor uses a lens as its main collecting element, while a reflector uses a mirror. Aperture is that element's diameter. Focal length describes how the optical system brings light to focus. They are different quantities, even though both may be printed in millimeters.",
        "Aperture affects light gathering and potential resolving power. For similar unobstructed optics, doubling the diameter gives four times the collecting area, not twice. Real performance also depends on optical quality, obstructions, alignment, atmosphere, and support. A large aperture on an unstable mount can be less useful in practice than a smaller instrument you can point and focus comfortably."
      ], sourceUrls: ["https://spaceplace.nasa.gov/telescopes/en/"]
    },
    {
      id: "magnification", heading: "Calculate power without being impressed by the biggest number",
      paragraphs: [
        "For a basic visual setup, magnification equals telescope focal length divided by eyepiece focal length. Use the same units. A 600-millimeter telescope with a 20-millimeter eyepiece gives 600 / 20 = 30 times. Changing to a 10-millimeter eyepiece gives 60 times; a 5-millimeter gives 120 times. The telescope's aperture has not changed.",
        "Higher power enlarges blur and movement along with the target. It usually makes finding and following objects harder, and spreads an extended object's light across a larger apparent area. Use it when it reveals useful detail, not because an eyepiece offers it. A bigger fuzzy planet is not necessarily a better observation."
      ], sourceUrls: ["https://www.bu.edu/astronomy/files/2024/01/Optics_newtonian-1-16-24.pdf"]
    },
    {
      id: "first-session", heading: "Learn the controls on one easy target",
      paragraphs: ["Practice with a nighttime Moon or another bright target identified on a current chart. Never point an ordinary telescope toward the Sun; solar observation requires a suitable specialist setup and secure front-mounted filtration."],
      list: { ordered: true, items: [
        "Set the mount on stable ground, allow the instrument to adjust to outdoor temperature, and read its basic pointing instructions.",
        "Begin with the longest-focal-length eyepiece in your set for low power. Center the target before changing eyepieces.",
        "Focus slowly in both directions to find the sharpest point. If the mount shakes, stop touching it and let the vibration settle.",
        "Increase power one step and compare actual detail. Return to lower power if the view becomes less informative.",
        "Record which eyepiece worked and why. Learning one reliable setup is more useful than testing every accessory at once."
      ] }
    },
    {
      id: "diagnosis", heading: "Match the symptom to the likely problem",
      paragraphs: [
        "If the whole scene jumps when you touch the focuser, investigate the mount and observing position. If fine detail ripples even when the telescope is untouched, atmospheric seeing or thermal currents may be involved. If stars never focus cleanly, check the manual for optical alignment, dew, or setup issues rather than assuming more power will help.",
        "A high target generally offers a shorter atmospheric path than one near the horizon. Avoid aiming through a window or over a warm roof when you can. These inexpensive changes often matter more than adding a new eyepiece to a poorly placed setup."
      ]
    },
    {
      id: "expectations", heading: "Set expectations for eyes, not photographs",
      paragraphs: [
        "A camera can accumulate long exposures and combine many frames. Your eye sees an immediate view, so faint nebulae often look subtle and largely gray. Planets can show real detail, but they remain small enough that patient observing matters. Some of the best moments occur briefly when the air steadies.",
        "Before buying anything, attend a local astronomy club's observing session if practical. Try focusing, tracking, carrying, and looking through several instruments. The best fit is not just an optical specification; it is a setup you can actually use often."
      ], sourceUrls: ["https://science.nasa.gov/skywatching/"]
    }
  ],
  "why-earth-has-seasons": [
    {
      id: "tilt", heading: "Tilt changes both sunlight angle and daylight length",
      paragraphs: [
        "Earth's spin axis is tilted by about 23.4 degrees relative to the perpendicular to its orbital plane. As Earth moves around the Sun, the axis keeps roughly the same direction in space over the year. Each hemisphere therefore takes a turn leaning toward the Sun. Sunlight arrives more directly and the days are longer in that hemisphere, increasing the energy received.",
        "The hemisphere tilted away gets a lower Sun and shorter days. This is why the Northern and Southern Hemispheres have opposite astronomical seasons. Distance from the Sun cannot explain that opposition: both hemispheres share essentially the same Earth-Sun distance at a given moment. Earth's elliptical orbit affects incoming energy, but axial tilt is the principal explanation for the familiar seasonal pattern."
      ], sourceUrls: ["https://spaceplace.nasa.gov/seasons/en/"]
    },
    {
      id: "milestones", heading: "Four moments define the astronomical year",
      paragraphs: ["An equinox or solstice happens at a particular instant worldwide, although its calendar date depends on your time zone. These are geometrical markers, not promises about the day's temperature."],
      table: { caption: "Seasonal milestones by hemisphere", columns: ["Event", "Northern Hemisphere", "Southern Hemisphere"], rows: [
        ["March equinox", "Astronomical spring begins", "Astronomical autumn begins"],
        ["June solstice", "Longest daylight around this period", "Shortest daylight around this period"],
        ["September equinox", "Astronomical autumn begins", "Astronomical spring begins"],
        ["December solstice", "Shortest daylight around this period", "Longest daylight around this period"]
      ] }
    },
    {
      id: "equinox", heading: "Why an equinox is not exactly twelve hours of daylight",
      paragraphs: [
        "At an equinox, the Sun crosses the celestial equator. Day and night are close in length, but sunrise is usually defined when the Sun's upper edge appears, and sunset when that edge disappears. The Sun has a visible disk rather than being a point. Atmospheric refraction also lifts its apparent position near the horizon.",
        "Those effects extend the measured daylight interval, so the date with nearly equal day and night can differ from the equinox. Latitude matters too. For the same reason, the earliest sunset or latest sunrise need not fall exactly on the winter solstice: civil clock time and the Sun's seasonal motion are not interchangeable."
      ], sourceUrls: ["https://aa.usno.navy.mil/faq/equinoxes"]
    },
    {
      id: "weather", heading: "Weather seasons are a different description",
      paragraphs: [
        "Astronomical seasons use Earth's position and tilt. Meteorological seasons organize months for weather records, and local climate can be better described by wet and dry seasons or a monsoon cycle. These systems answer different questions, so they do not have to line up with the same everyday experience.",
        "Land and oceans also take time to heat and cool. The longest day is not automatically the hottest day. A skywatching article's phrase 'winter sky' therefore needs a hemisphere and a location; it is not a worldwide instruction about which constellations are visible or what clothes to wear."
      ]
    },
    {
      id: "observe", heading: "Notice the pattern without measuring the Sun directly",
      paragraphs: ["You can follow seasonal geometry with ordinary observations. Never look directly at the Sun to judge its position, and do not use unfiltered optical equipment."],
      list: { items: [
        "Compare the length of a fixed vertical object's midday shadow over several weeks from the same level location.",
        "Record the direction of the sunset glow against a distant landmark after the Sun has gone below the horizon.",
        "Compare local sunrise and sunset tables through the year, keeping daylight-saving changes separate from the astronomical trend.",
        "Note how your evening stargazing window changes. Longer darkness does not necessarily mean better weather or clearer air."
      ] }
    }
  ],
  "auroras-and-space-weather": [
    {
      id: "glow", heading: "The glow belongs to Earth's atmosphere",
      paragraphs: [
        "An aurora begins when energetic particles excite gases high in the atmosphere. Those gases emit light as they release the energy. Earth's magnetic environment guides the particle interactions into regions around the magnetic poles, producing the familiar northern and southern lights. They are not sunlight reflecting from clouds, although clouds can obscure the view.",
        "Oxygen contributes common green and red emissions; nitrogen contributes other colors, including blue and pink. Color depends on the gas, altitude, and excitation process. Shapes and brightness can change quickly as conditions evolve, which is why a still image cannot tell you how a display moved or how long it lasted."
      ], sourceUrls: ["https://science.nasa.gov/sun/auroras/"]
    },
    {
      id: "sun", heading: "A solar eruption is a clue, not a local guarantee",
      paragraphs: [
        "The solar wind continually interacts with Earth's magnetic field. Some disturbances, including suitably directed coronal mass ejections, intensify that interaction. But an eruption photographed on the Sun does not automatically mean a bright display at your location: direction, arrival, and the magnetic conditions at Earth matter.",
        "A solar flare and a coronal mass ejection are not interchangeable terms. A flare is an intense burst of radiation; a coronal mass ejection expels plasma and magnetic field. They can occur together, but a dramatic headline about one is not a complete aurora forecast. Official space-weather services track the evolving measurements."
      ]
    },
    {
      id: "forecast", heading: "Read a forecast as a layer of evidence",
      paragraphs: [
        "The Kp index describes global geomagnetic disturbance, not the brightness over your street. A higher forecast can indicate better chances at lower magnetic latitudes, but it is not a simple yes/no viewing threshold. Auroral-oval maps and short-term products add context; their timestamp and validity interval matter as much as the colors on the map.",
        "Then apply ordinary observing conditions: is it dark, is the relevant horizon clear, and is cloud cover low enough? A strong geomagnetic storm behind solid cloud is still invisible from the ground. Treat older social posts as observations from another time and place, not a live forecast."
      ], sourceUrls: ["https://www.spaceweather.gov/content/aurora-tutorial"]
    },
    {
      id: "camera", heading: "A camera can see a different-looking sky",
      paragraphs: [
        "Long exposures and sensitive sensors can show stronger color than your eyes perceive in a faint aurora. A pale arc may produce a vivid photograph without the photographer inventing the underlying light. Conversely, a bright active display can be striking to the naked eye. Exposure and processing determine how useful the image is as a viewing expectation.",
        "Record what you saw separately from what the photograph shows. If photographing, stabilize the camera and experiment with exposure according to the motion; a long exposure can blur rapidly changing structure. Do not stare at a bright preview screen so often that you miss the actual display."
      ], sourceUrls: ["https://science.nasa.gov/feature/nasas-guide-to-finding-and-photographing-auroras/"]
    },
    {
      id: "plan", heading: "Before heading out",
      paragraphs: ["This is a forecast-dependent activity. Make the plan easy to change rather than relying on a single numerical index or a viral photograph."],
      list: { ordered: true, items: [
        "Check a current official space-weather product and its time zone; distinguish observed activity from a forecast.",
        "Confirm darkness, cloud cover, and a safe unobstructed view toward the likely auroral region.",
        "Use a legal observing location, prepare for cold and waiting, and avoid unsafe driving in pursuit of a view.",
        "Keep expectations flexible. A quiet interval does not disprove a regional forecast, and a bright photograph elsewhere does not guarantee local visibility."
      ] }
    }
  ],
  "asteroids-comets-and-meteorites": [
    {
      id: "distinction", heading: "The word can describe an object, an event, or a survivor",
      paragraphs: [
        "A space rock does not need five different origins to acquire five different labels. Some terms describe the body orbiting the Sun, others its size or composition, and others what happens when it enters an atmosphere. Keeping those questions separate makes news headlines much easier to interpret.",
        "Asteroids are generally rocky or metallic small bodies. Comets contain volatile material that can release gas and dust when heated. A meteoroid is a smaller natural body traveling through space. The boundaries are not perfectly tidy: active asteroids and other transitional objects show why a simple 'rock versus ice' slogan cannot classify every discovery."
      ], sourceUrls: ["https://science.nasa.gov/asteroids-comets-meteors/facts/"]
    },
    {
      id: "terms", heading: "A quick translation table",
      paragraphs: ["The key transition is from material in space to a luminous atmospheric event, and then, only sometimes, to material on the ground."],
      table: { caption: "Which term answers which question?", columns: ["Term", "Meaning", "Does not imply"], rows: [
        ["Asteroid", "A small, usually rocky or metallic orbiting body", "That it is approaching Earth"],
        ["Comet", "A volatile-rich body that can develop a coma and tails", "That a bright tail is always visible"],
        ["Meteoroid", "A small natural object in space", "That it will survive atmospheric entry"],
        ["Meteor", "The luminous atmospheric phenomenon", "That a star fell or a rock landed"],
        ["Meteorite", "Material surviving entry to reach the surface", "That every unusual dark rock is extraterrestrial"]
      ] }, sourceUrls: ["https://science.nasa.gov/solar-system/meteors-meteorites/"]
    },
    {
      id: "showers", heading: "A shower is not a queue of large incoming asteroids",
      paragraphs: [
        "Meteor showers occur when Earth crosses debris streams. Many visible streaks come from small particles; atmospheric entry turns their kinetic energy into heat and light. The shared stream geometry makes shower meteors appear to radiate from a common region of the sky.",
        "A near-Earth asteroid listing describes a tracked orbit and a predicted approach distance. It is a different kind of record from a shower forecast. A meteor image accompanying an asteroid headline can be illustrative rather than evidence that the listed asteroid entered the atmosphere. Check the caption before connecting the two."
      ]
    },
    {
      id: "brightness", heading: "A bright fireball does not prove a meteorite landed",
      paragraphs: [
        "A fireball is a particularly bright meteor. Brightness depends on factors including speed, composition, viewing geometry, and how energy is deposited. A dramatic flash or trail does not by itself establish the size of any surviving material or identify a landing site.",
        "If you witness one, record the time, location, direction of travel, duration, and what you actually observed. Keep an original video if available. Avoid guessing a nearby impact from a distant flash: apparent direction is not a distance measurement. Formal reports from multiple locations can help specialists reconstruct a trajectory."
      ]
    },
    {
      id: "reading", heading: "Ask the question the record can answer",
      paragraphs: ["Use the type of evidence to decide what you can responsibly conclude. An exciting label is not a substitute for measurements."],
      list: { items: [
        "For an asteroid approach: inspect the date, miss distance, uncertainty, and original orbit record. 'Near' is not an impact prediction.",
        "For a comet: inspect recent activity and an observing chart, not just the date of closest approach.",
        "For a shower: check radiant height, darkness, Moon interference, and realistic observing rates.",
        "For a suspected meteorite: seek a qualified identification process. A photograph, magnet response, or unusual appearance alone is not a conclusive test."
      ] }
    }
  ],
  "why-comets-have-tails": [
    {
      id: "nucleus", heading: "Separate the solid body from the surrounding display",
      paragraphs: [
        "A comet's nucleus is a solid mixture of volatile ices, dust, and rocky material. As solar heating increases, some ices turn directly into gas, carrying dust away. This creates a diffuse surrounding atmosphere, the coma. A spectacular photograph can therefore show an enormous cloud around a much smaller nucleus that the image does not resolve.",
        "Activity depends on the material present and how heat reaches it, so distance from the Sun is not the whole story. Two comets at similar distances can behave differently, and one comet can change unexpectedly. A neat orbit prediction is not an equally precise brightness prediction."
      ], sourceUrls: ["https://science.nasa.gov/solar-system/comets/facts/"]
    },
    {
      id: "tails", heading: "Two tails respond to different forces",
      paragraphs: [
        "Solar radiation pushes released dust grains, while their orbital motion helps shape a broad, often curved dust tail. Gas that becomes ionized interacts with the solar wind and its magnetic field, often making a straighter ion tail directed broadly away from the Sun. The two structures need not overlap in a photograph.",
        "The tail is not engine exhaust. It does not simply point opposite the comet's direction of travel. A comet leaving the inner solar system can have a tail extending partly ahead of its motion. The useful reference direction is the Sun, with viewing geometry and the different particle behaviors explaining departures from a simple straight arrow."
      ], sourceUrls: ["https://spaceplace.nasa.gov/comets/en/"]
    },
    {
      id: "geometry", heading: "Your viewing angle changes the apparent shape",
      paragraphs: [
        "A long tail viewed nearly end-on may look short. Looking through a thin sheet of dust from near its plane can create unusual apparent structures, including an anti-tail that seems to point toward the Sun. That appearance does not mean solar wind suddenly reversed; it is a projection of a three-dimensional distribution onto your sky.",
        "A photograph should therefore be read with its observing date, orientation, field size, and caption. The nucleus, coma, and tail may have very different angular scales. A tightly cropped bright head is not evidence that a wide, faint tail was absent beyond the frame."
      ], sourceUrls: ["https://science.nasa.gov/image-article/apod-2024-june-4-comet-pons-brooks-develops-opposing-tails/"]
    },
    {
      id: "brightness", heading: "Why a promising magnitude can disappoint",
      paragraphs: [
        "A star concentrates its visible light into a tiny point. A comet may spread a similar total amount of light over a diffuse coma and tail. That lower surface brightness makes it harder to distinguish against moonlight, twilight, or skyglow. Total magnitude alone is therefore a poor description of how obvious the comet will be.",
        "The closest approach to Earth and the closest approach to the Sun, called perihelion, are different milestones. Neither guarantees the best view. At the brightest part of its orbit, a comet might be inconveniently close to the Sun in our sky or below your local horizon at useful times. Recent observations and a location-aware chart matter more than an old superlative."
      ]
    },
    {
      id: "plan", heading: "Build a realistic comet session",
      paragraphs: ["Treat charts and brightness reports as dated information. A comet moves against the stars, so last week's finder chart can send you to the wrong place."],
      list: { ordered: true, items: [
        "Find a recent observing report and chart for your hemisphere, noting the date and time zone.",
        "Check the object's altitude, twilight conditions, and Moon interference during the actual observing window.",
        "Start from a bright chart landmark and expect a faint patch rather than a photographic tail.",
        "Keep binoculars and telescopes away from the Sun. Do not sweep a twilight sky near it while searching.",
        "Record what was visible and the equipment used; a non-detection under poor conditions is not proof that the comet faded."
      ] }
    }
  ],
  "astronomical-distances-au-and-light-years": [
    {
      id: "scale", heading: "Choose a ruler that fits the journey",
      paragraphs: [
        "Kilometers work well for a city trip and become unwieldy for a star. Astronomers use several distance units because they make different comparisons easier, not because space needs a different kind of length. Before interpreting a number, ask what it is measured from, at what time, and in which unit.",
        "A distance from Earth, a distance from the Sun, and a spacecraft's total path traveled can all be different numbers for the same mission. Similarly, a listed asteroid miss distance describes one encounter geometry, not the size of the object's orbit. A unit label is necessary, but it is not the complete definition of the quantity."
      ]
    },
    {
      id: "units", heading: "Three useful astronomical yardsticks",
      paragraphs: ["The astronomical unit is now an exact defined length. Lunar distance is usually a conventional average for comparison, while the real Earth-Moon separation varies. Check a data provider's specific conversion when precision matters."],
      table: { caption: "Distance units at a glance", columns: ["Unit", "Length", "Useful context"], rows: [
        ["Astronomical unit (AU)", "149,597,870.7 km exactly", "Planetary orbits and solar-system distances"],
        ["Lunar distance (LD)", "About 384,400 km", "Near-Earth approach comparisons"],
        ["Light-year", "About 9.46 trillion km", "Distances to stars and galaxies"]
      ] }, sourceUrls: ["https://syrte.obspm.fr/IAU_resolutions/IAUResol_2012.html", "https://cneos.jpl.nasa.gov/ca/neo_ca_info.html"]
    },
    {
      id: "worked-example", heading: "Convert an asteroid distance without losing its meaning",
      paragraphs: [
        "Suppose an illustrative approach is listed at 0.010 AU from Earth's center. Multiply 0.010 by 149,597,870.7 to obtain about 1,496,000 kilometers. Divide that by 384,400 and the result is about 3.9 lunar distances. The values describe the same separation in three units; they are not three separate predictions.",
        "That number alone does not provide an impact probability, and it is not an altitude above Earth's surface. For a real encounter, read the reference point, uncertainty interval, and data notes. Keep sensible rounding: quoting many decimal places in a conversion does not make the underlying orbit estimate more precise."
      ]
    },
    {
      id: "light", heading: "A light-year measures distance, with a time consequence",
      paragraphs: [
        "A light-year is how far light travels in a year, not a unit of age. If a nearby star is ten light-years away, the light reaching you now left it about ten years ago. The star is not necessarily ten years old. Distance gives the delay in the information, not the time since the object formed.",
        "For a smaller scale, light takes about 8 minutes 19 seconds to cover one AU. Two AU of separation corresponds to roughly 16 minutes 38 seconds of one-way light travel, so a radio exchange needs at least twice that before processing time is added. A spacecraft's Earth distance changes, so communication delay is not one permanent number for a destination."
      ], sourceUrls: ["https://science.nasa.gov/exoplanets/what-is-a-light-year/"]
    },
    {
      id: "limits", heading: "Where the simple picture needs care",
      paragraphs: [
        "For very distant galaxies, cosmic expansion separates light-travel time from several present-day distance definitions. Do not multiply a quoted lookback time by the speed of light and assume you have the galaxy's current distance. Read which cosmological quantity the source means.",
        "For everyday space news, a short habit handles most confusion: keep the unit, reference body, epoch, and uncertainty attached to the number. Then convert only to answer a useful comparison. 'Several times the average Earth-Moon distance' often communicates more honestly than a long, unexplained string of kilometers."
      ]
    }
  ],
  "how-stars-are-born-and-die": [
    {
      id: "birth", heading: "Star formation starts with gravity, not fire",
      paragraphs: [
        "A star begins in a cold cloud of gas and dust when a region contracts under gravity. As material falls inward, the developing protostar heats up. Some material can collect in a surrounding disk, and young stars may drive outflows. This is not a chemical flame: the eventual long-lived energy source is nuclear fusion in the core.",
        "If enough mass collects and the core reaches suitable conditions, sustained hydrogen fusion becomes possible. An object with too little mass does not become an ordinary hydrogen-burning star. Star-forming regions contain objects at different stages, so a single image is not a sequential photograph of one star assembling itself."
      ], sourceUrls: ["https://science.nasa.gov/mission/webb/star-lifecycle/"]
    },
    {
      id: "main-sequence", heading: "The longest chapter is often the least dramatic",
      paragraphs: [
        "During the main-sequence stage, a star fuses hydrogen in its core. Its structure balances inward gravity with outward pressure. The resulting equilibrium can last a very long time, although the star gradually changes as its internal composition evolves. The Sun is in this stage; it is not burning oxygen like a campfire.",
        "Mass strongly affects the pace. Massive stars have more fuel, but their hotter cores use it far faster, so they live much shorter lives than low-mass stars. A large fuel tank is not a long-life guarantee when the engine runs much more intensely. Composition and interactions with a companion can also alter the path."
      ], sourceUrls: ["https://science.nasa.gov/universe/stars/"]
    },
    {
      id: "endings", heading: "There is no single ending for every star",
      paragraphs: ["The table describes broad routes, not a precise mass-to-remnant calculator. Mass loss, chemical composition, and binary interactions complicate individual outcomes."],
      table: { caption: "Two broad stellar life paths", columns: ["Starting point", "Later evolution", "Possible remnant"], rows: [
        ["A Sun-like star", "Giant stages; outer layers lost", "White dwarf"],
        ["A much more massive star", "Advanced core evolution; possible core collapse", "Neutron star or black hole"]
      ] }
    },
    {
      id: "nebulae", heading: "A nebula can mark a beginning or an ending",
      paragraphs: [
        "A stellar nursery is gas and dust in which stars are forming. A planetary nebula is material shed by an evolved star; despite the historical name, it is not a newly forming planetary system. A supernova remnant records an explosive event. The word nebula means cloud, not one specific stage of a star's life.",
        "Stars return material to their surroundings through winds and explosions. Later generations can form from enriched gas, linking stellar evolution to the chemistry of planets. But a star does not create every element in the same way or at the same stage: the detailed origin of elements involves several processes and environments."
      ]
    },
    {
      id: "reading", heading: "Read a star image as evidence, not a time-lapse",
      paragraphs: [
        "A photograph's brightness is not a reliable age label. Distance, dust, intrinsic luminosity, wavelength, and exposure change what stands out. Blue can reflect a color assignment rather than the star's visible color; a red object can be cool, dust-obscured, or represented through infrared filters. Read the instrument and caption before deciding which.",
        "Try classifying three images: a star-forming cloud, a planetary nebula, and a supernova remnant. For each, identify the stage and the source's evidence. Then ask what you cannot tell from the image alone, such as a precise age or the original stellar mass. That habit turns a gallery into a connected story without pretending every cloud is a birthplace."
      ]
    }
  ],
  "black-holes-explained": [
    {
      id: "horizon", heading: "The event horizon is a boundary, not a surface",
      paragraphs: [
        "A black hole contains a region from which light cannot escape to distant observers. Its event horizon is the boundary of that region, not a solid crust or a visible black wall. Light and matter outside the horizon can still emit signals that reach us, which is why a black hole can sit inside a spectacularly bright environment.",
        "Stellar-mass black holes can form after massive stars collapse. Supermassive black holes reside in the centers of many galaxies. Their formation histories and environments differ, so one illustration of a star being torn apart is not a representative scene around every black hole. Many are relatively quiet."
      ], sourceUrls: ["https://science.nasa.gov/universe/black-holes/"]
    },
    {
      id: "gravity", heading: "Strong gravity is not unlimited suction",
      paragraphs: [
        "Far from a compact object, its gravity is governed largely by its mass and distance, just as for other gravitating bodies. Objects can orbit a black hole without inevitably falling in. To accrete, orbiting material usually has to redistribute energy and angular momentum. A galactic black hole does not automatically consume the galaxy surrounding it.",
        "As a thought experiment, replacing the Sun with a black hole of the same mass would not suddenly pull Earth out of its orbit. We would lose sunlight, an entirely different catastrophe. This is not something the Sun can actually do: its mass is insufficient to follow the stellar-collapse route to a black hole."
      ]
    },
    {
      id: "evidence", heading: "Different observations reveal different properties",
      paragraphs: ["Astronomers do not need light from inside the horizon to study the object. They measure its effects on matter, light, and spacetime outside it."],
      table: { caption: "What a black-hole observation can measure", columns: ["Evidence", "What is measured", "Important limitation"], rows: [
        ["Nearby stellar orbits", "Motion around an unseen compact mass", "Mass and compactness need careful modeling"],
        ["Accretion emission", "Light from hot surrounding material", "The glow is not a visible solid surface"],
        ["Gravitational waves", "Signals consistent with compact-object mergers", "Properties come from waveform analysis"],
        ["Radio interferometry", "Reconstructed emission around the shadow region", "Not an ordinary optical snapshot"]
      ] }, sourceUrls: ["https://science.nasa.gov/mission/webb/science-overview/science-explainers/how-do-we-know-there-are-black-holes/"]
    },
    {
      id: "image", heading: "What the familiar bright ring actually shows",
      paragraphs: [
        "Material outside a black hole can heat up in an accretion flow. Gravity bends the paths of its emitted light, and the resulting appearance depends on the geometry, motion, and observing wavelength. A bright ring around a dark central region is therefore not the hole's physical surface shining.",
        "Some widely shared black-hole visuals are simulations or artists' impressions. Others are reconstructions from measurements made by widely separated radio telescopes. Both can be informative, but they answer different questions. Check the caption, observing method, scale, and processing description before interpreting a rendered feature as a directly photographed structure."
      ]
    },
    {
      id: "questions", heading: "Ask what made the discovery persuasive",
      paragraphs: ["For a new black-hole story, identify the chain from observation to interpretation. A dramatic visual should help explain that chain, not replace it."],
      list: { items: [
        "What was observed: a stellar orbit, an emission spectrum, a merger signal, or an image reconstruction?",
        "Which quantities were inferred, and what assumptions or uncertainty ranges accompany them?",
        "Is the object described as a candidate, and what alternative explanations were tested?",
        "Does the picture depict these measurements, a simulation, or an artist's illustration?"
      ] }
    }
  ],
  "galaxies-and-our-milky-way": [
    {
      id: "scales", heading: "Put the solar system inside the larger structure",
      paragraphs: [
        "Our solar system consists of the Sun and the bodies associated with it, including planets, moons, comets, and asteroids. It belongs to the Milky Way galaxy, a much larger gravitationally bound system of stars, gas, dust, and dark matter. The universe contains many galaxies; the Milky Way is our address within it, not a synonym for everything that exists.",
        "A nebula is a cloud of gas or dust, often inside a galaxy. A star cluster is a group of stars. These are different structural scales, even though all can look like a fuzzy patch through a small instrument. An image caption identifying the object is a better starting point than its apparent shape on a screen."
      ], sourceUrls: ["https://science.nasa.gov/exoplanets/what-is-the-universe/"]
    },
    {
      id: "inside", heading: "Why our galaxy looks like a pale band",
      paragraphs: [
        "We live within the Milky Way's disk. Looking along it means looking through a crowded depth of stars and dust, producing the broad luminous band visible under dark skies. Dark lanes are often dust obscuring background light, not empty cuts through the galaxy. Looking away from the disk samples a different direction through the structure.",
        "No spacecraft has traveled outside the Milky Way to take a portrait of the whole galaxy. Top-down views labeled as our galaxy are illustrations or reconstructions informed by measurements. We can, however, photograph other galaxies from outside, and use those views alongside our internal measurements to understand galactic structure."
      ], sourceUrls: ["https://science.nasa.gov/universe/galaxies/"]
    },
    {
      id: "forms", heading: "Shape is useful, but it is not a complete biography",
      paragraphs: [
        "Spiral galaxies have disks and spiral structure; elliptical galaxies are generally smoother in overall appearance; irregular galaxies do not fit those simple patterns. Viewing angle changes what a disk looks like: a face-on spiral and an edge-on disk may seem entirely different at first glance.",
        "Galaxy evolution depends on interactions, gas supply, star formation, and other processes. A category is a description, not proof of a single history. Color also depends on stellar populations, dust, and wavelength. An infrared or assigned-color image should not be read as a literal human-eye color portrait without checking how it was constructed."
      ]
    },
    {
      id: "observing", heading: "Plan a view of the Milky Way, not a telescope photograph",
      paragraphs: [
        "The naked-eye Milky Way needs a dark, transparent sky and a suitable observing direction. A bright Moon can erase much of the contrast. Its most prominent regions change with season, local time, and latitude, so a northern summer observing recommendation is not a universal schedule.",
        "Use a current chart to find where the galactic band lies during your session, then choose a site with that part of the horizon open. Allow your eyes to adapt. Expect a subtle structured glow, not the saturated detail of a long-exposure photograph. Binoculars can turn some of that glow into richer star fields without revealing a top-down view of the disk."
      ]
    },
    {
      id: "compare", heading: "Compare galaxy images fairly",
      paragraphs: ["Two images filling the same screen can represent very different physical and angular scales. Make the comparison deliberately rather than ranking objects by screen size."],
      list: { ordered: true, items: [
        "Identify the galaxy and its viewing angle: face-on, edge-on, or somewhere between.",
        "Read the distance and scale bar. Separate apparent size in the sky from physical size.",
        "Check the telescope and wavelength: dust, gas, and stars stand out differently in different bands.",
        "Look for the caption's explanation of bright knots or dark lanes before assigning a physical cause.",
        "Distinguish an observation from a reconstruction, especially for an outside view of the Milky Way."
      ] }
    }
  ],
  "how-we-find-exoplanets": [
    {
      id: "signal", heading: "Usually we measure an effect, not a tiny planet picture",
      paragraphs: [
        "An exoplanet is a planet outside our solar system. Most discovery methods detect its effect on a star's light or motion rather than resolving a small world beside a dazzling star. That distinction matters: a colorful planet illustration often communicates a scientific interpretation, not a photographed landscape.",
        "A detection method also shapes what is easiest to find. Repeated transits favor suitable viewing geometry and shorter periods within a survey's observing time. Strong stellar wobbles favor larger gravitational effects. A catalog reflects those selection effects, so its most common detected objects are not automatically the universe's most common kinds of planet."
      ]
    },
    {
      id: "transits", heading: "Transits measure a relative size and a repeating clock",
      paragraphs: [
        "A transit occurs when a planet crosses the star's face from our viewpoint, reducing the measured light. In a simplified case, fractional depth is approximately the squared ratio of planet radius to stellar radius. A hypothetical 1% dip gives a radius ratio of about 0.10: the square root of 0.01. This is an illustrative calculation, not a universal model for every transit.",
        "Real analysis accounts for the star's brightness profile, contamination by other light, and the crossing geometry. To turn a radius ratio into a planet radius, researchers need information about the star. The spacing of repeat transits gives an orbital period; it does not by itself reveal an ocean, a breathable atmosphere, or a surface temperature."
      ], sourceUrls: ["https://science.nasa.gov/exoplanets/how-we-find-and-characterize/"]
    },
    {
      id: "methods", heading: "Other methods supply different pieces of the puzzle",
      paragraphs: ["Combining suitable observations is often more informative than collecting another attractive rendering. Each method carries its own geometry and modeling limits."],
      table: { caption: "What common planet-finding methods reveal", columns: ["Method", "Signal", "Typical information"], rows: [
        ["Transit", "Repeated dips in stellar light", "Radius ratio and orbital period"],
        ["Radial velocity", "Periodic Doppler shifts in starlight", "Companion's gravitational influence; mass constraint"],
        ["Direct imaging", "Separated planetary light", "Brightness, spectrum, and motion over time"],
        ["Microlensing", "A distortion in gravitational magnification", "A planet inferred from a temporary lensing event"]
      ] }
    },
    {
      id: "mass", heading: "Mass and radius are stronger together",
      paragraphs: [
        "Radial velocity measures the star's motion toward and away from us as an orbiting companion tugs on it. Without knowing the orbit's inclination, the usual measurement gives a minimum-mass constraint rather than a unique true mass. A transiting system can supply useful inclination information.",
        "When suitable mass and radius measurements describe the same planet, researchers can calculate bulk density. That narrows possible compositions, but does not provide a unique interior blueprint. Different mixtures and atmospheric layers can produce similar overall properties. A density consistent with a rocky world is not evidence of a living one."
      ]
    },
    {
      id: "confirmation", heading: "A candidate must survive alternative explanations",
      paragraphs: [
        "An eclipsing binary blended with another star, stellar activity, or instrumental effects can imitate some planet signals. Follow-up observations, statistical validation, and independent measurements test those alternatives. The appropriate confirmation process depends on the signal and the system; it is not always a single second photograph.",
        "When reading a discovery, separate four claims: a planetary signal exists; its size or mass is constrained; its atmosphere is characterized; its environment could support life. Evidence for the first does not automatically establish the other three. Look for uncertainty ranges and the authors' candidate/confirmed wording before turning a promising target into a second Earth."
      ], sourceUrls: ["https://science.nasa.gov/universe/exoplanets/10-steps-to-confirm-a-planet-around-another-star/"]
    }
  ],
  "what-the-habitable-zone-means": [
    {
      id: "definition", heading: "A habitable zone is a conditional calculation",
      paragraphs: [
        "A star's habitable zone is a range of distances where a planet with suitable atmospheric conditions could support liquid water on its surface. The phrase contains an important 'could'. It does not say that the planet has an atmosphere, an ocean, a solid surface, or life. It identifies an energy environment worth investigating.",
        "A cooler, dimmer star has a closer-in habitable zone than a more luminous star. A planet can therefore receive roughly Earth-like stellar energy while having a much shorter year. Distance measured in astronomical units is not enough by itself; the star's output is part of the calculation. Different climate assumptions can also produce different inner and outer boundaries."
      ], sourceUrls: ["https://science.nasa.gov/exoplanets/habitable-zone/"]
    },
    {
      id: "conditions", heading: "An orbit does not determine the surface climate",
      paragraphs: [
        "Atmospheric pressure and composition, clouds, surface reflectivity, rotation, and a planet's history all influence whether liquid water can persist. A planet could lose its atmosphere, retain too much heat, or have no suitable surface despite occupying an interesting orbit. Being in the right energy range does not solve these other conditions.",
        "The zone is designed around surface liquid water, not every possible environment for life. An icy moon with an internally heated subsurface ocean illustrates why 'outside the surface habitable zone' is not the same claim as 'no liquid water anywhere'. That possibility does not establish life either; it simply shows the limits of the definition."
      ]
    },
    {
      id: "claims", heading: "Keep five different claims separate",
      paragraphs: ["These phrases are often compressed into 'Earth-like' in a headline. Restoring the distinctions is more informative than debating the headline alone."],
      table: { caption: "What discovery language actually establishes", columns: ["Phrase", "What it describes", "Still unanswered"], rows: [
        ["Earth-sized", "A radius comparable to Earth's", "Composition and atmosphere"],
        ["Rocky", "An inferred bulk composition", "Surface conditions and water"],
        ["In the habitable zone", "A conditional stellar-energy range", "Actual climate and liquid water"],
        ["Potentially habitable", "A possibility under stated assumptions", "Whether those assumptions hold"],
        ["Inhabited", "Life is actually present", "Requires much stronger evidence than an orbit"]
      ] }
    },
    {
      id: "measurements", heading: "Ask which step was measured and which was modeled",
      paragraphs: [
        "Transit observations can constrain size relative to the star and an orbital period. Stellar information and orbital analysis help estimate how much energy reaches the planet. A quoted equilibrium temperature is a model quantity with assumptions; it is not automatically a measured ground-level weather report.",
        "Spectroscopy can test atmospheric composition for some targets, but the interpretation depends on signal quality, models, clouds, and the star. A molecule is not a biological verdict. Even a potentially interesting chemical combination requires tests of nonbiological explanations and independent scrutiny. The scientifically useful question is what additional observation would distinguish the possibilities."
      ], sourceUrls: ["https://science.nasa.gov/exoplanets/how-we-find-and-characterize/"]
    },
    {
      id: "reading", heading: "A four-question check for the next discovery",
      paragraphs: ["A promising target can be exciting without being a second Earth. Read the original research or agency explanation and preserve its uncertainty rather than translating every 'may' into 'is'."],
      list: { ordered: true, items: [
        "What was directly observed: a brightness dip, stellar motion, or a spectrum?",
        "Which quantities depend on the star's properties or a climate model, and what uncertainty is given?",
        "Is an atmosphere detected, only allowed by the data, or completely unknown?",
        "What evidence would be needed next to test water, surface conditions, or a possible biological explanation?"
      ] }
    }
  ],
  "webb-and-hubble-compared": [
    {
      id: "question", heading: "Ask which light answers the scientific question",
      paragraphs: [
        "Webb and Hubble are complementary observatories, not two identical cameras competing for a single best photograph. Hubble observes ultraviolet, visible, and some near-infrared light. Webb works primarily in the near- and mid-infrared. An object can therefore reveal different structures in each without either image being wrong.",
        "Some infrared wavelengths pass through dust more readily than visible light, exposing previously obscured stars. Other infrared measurements reveal emission from dust itself. Distant galaxies are another reason to observe infrared: cosmic expansion stretches their emitted light toward longer wavelengths. 'Infrared sees through everything' is too simple; the object, dust, and wavelength still matter."
      ], sourceUrls: ["https://science.nasa.gov/mission/hubble/observatory/hubble-vs-webb/"]
    },
    {
      id: "design", heading: "Their engineering follows their observing jobs",
      paragraphs: ["These differences help explain their strengths. They do not rank the value of one mission above the other."],
      table: { caption: "Hubble and Webb: the useful distinctions", columns: ["Property", "Hubble", "Webb"], rows: [
        ["Primary mirror diameter", "About 2.4 m", "About 6.5 m"],
        ["Main wavelength coverage", "Ultraviolet, visible, some near-infrared", "Near- and mid-infrared"],
        ["Operating region", "Low Earth orbit", "Orbit around the Sun-Earth L2 region"],
        ["Thermal design emphasis", "Conditions for its instrument suite", "Sunshield and cold infrared observing environment"]
      ] }, sourceUrls: ["https://science.nasa.gov/mission/webb/faqs-full/"]
    },
    {
      id: "resolution", heading: "Why bigger does not mean sharper at every wavelength",
      paragraphs: [
        "For a diffraction-limited telescope, angular resolution scales roughly with wavelength divided by aperture. A larger aperture helps at a fixed wavelength; a longer wavelength works in the other direction. You cannot decide whether every feature in a Webb image should look sharper by comparing mirror diameters alone.",
        "Instrument sampling, exposure, processing, and target contrast also affect the presented image. A faint structure may become much easier to see because it is bright in infrared, not simply because every small detail has been resolved more finely. Sensitivity and resolution answer different questions."
      ]
    },
    {
      id: "comparison", heading: "Compare the same object in a controlled way",
      paragraphs: [
        "Choose a published side-by-side comparison with matched orientation and field of view. Identify a few stars that appear in both images, then examine the surrounding dust and gas. If a feature disappears, ask whether it is obscured, faint in that band, or outside the displayed field before declaring it physically absent.",
        "Read the filter/color key. Public images translate measured bands into display colors; a blue or red region need not match the color a human eye would see nearby. A composite combining several telescopes can be especially useful, provided you know which observatory contributed each signal."
      ], sourceUrls: ["https://esawebb.org/images/comparisons/"]
    },
    {
      id: "exercise", heading: "Try a caption-first comparison",
      paragraphs: ["Use one matched comparison from the ESA/Webb collection below. Write three short observations and keep them separate from explanations that need the caption."],
      list: { ordered: true, items: [
        "Record the instruments, wavelength bands, field size, and observing dates before discussing the colors.",
        "Describe one feature visible in both views and one that changes prominence.",
        "Check the scientific caption for the physical explanation; do not infer a new object solely from a color difference.",
        "State one limit: different wavelengths, processing, or observation dates may prevent a direct one-to-one comparison."
      ] }
    }
  ],
  "how-to-read-space-images": [
    {
      id: "measurement", heading: "First identify what kind of image it is",
      paragraphs: [
        "An astronomy image can be an observation, a mosaic, a reconstruction from measured signals, a simulation, or an artist's impression. All can communicate science, but they provide different evidence. A realistic rendering of an exoplanet's surface is not a photographed landscape just because it appears beside a real discovery.",
        "Look for those labels before interpreting detail. Then identify the target, observatory, instrument, and date. A composite may combine observations from several telescopes or epochs. It can reveal relationships invisible in one band while still not representing a single instant or the view through a human eye."
      ]
    },
    {
      id: "colors", heading: "Color is a key to the data, not just decoration",
      paragraphs: [
        "Detectors measure light in particular wavelength bands. To create a display image, processors map those measurements to visible colors and adjust brightness ranges. Infrared, ultraviolet, and X-ray measurements need a visible representation because our eyes cannot see those wavelengths directly. Assigned color makes real differences in the measurements legible.",
        "Imagine three infrared filters displayed as blue, green, and red. A red patch indicates a relative contribution from the band mapped to red; it does not automatically mean cool gas, hot gas, or visible red light. The interpretation comes from the filter key and the physics of the target, not a universal color-temperature legend."
      ], sourceUrls: ["https://science.nasa.gov/mission/webb/multimedia/about-webb-images/"]
    },
    {
      id: "scale", heading: "Separate screen size, sky size, and physical size",
      paragraphs: [
        "A close-up of a crater and a wide mosaic of a galaxy can fill the same screen. That says nothing about their physical dimensions. Angular scale describes how much sky an image covers; physical scale depends on distance. A scale bar and the source's distance estimate make a meaningful comparison possible.",
        "Orientation is not universal either. North need not be at the top, and an attractive crop may omit important context. Before comparing two images, align the field, orientation, and scale. Check the dates if you are looking for a real change: different filters or processing can create apparent differences without the object evolving."
      ]
    },
    {
      id: "artifacts", heading: "Not every visible shape belongs to the object",
      paragraphs: [
        "Diffraction spikes around bright stars arise from telescope optics, including aperture shape and support structures. They are not giant physical beams projecting from those stars. Detector effects, saturated regions, and processing choices can also leave signatures. A striking shape deserves a caption check before a physical story.",
        "Do not jump to the opposite conclusion that every unusual feature is an artifact. Jets, arcs, and shells can be real astrophysical structures. The point is to ask how the interpretation was established: comparison across exposures, instruments, wavelengths, or other measurements can support it. Appearance alone rarely settles the explanation."
      ]
    },
    {
      id: "practice", heading: "Use a five-line image reading checklist",
      paragraphs: ["Choose one official gallery image and write these five lines in your own words. Where the caption does not answer a question, leave it unknown rather than filling the gap with a guess."],
      list: { ordered: true, items: [
        "Identity: what object or region is shown, and is this an observation or an illustration?",
        "Measurement: which telescope, instrument, bands, and observing dates contributed?",
        "Scale: what angle or physical distance does the field or scale bar represent?",
        "Interpretation: which visible feature does the scientific caption explain, and how?",
        "Credit: who produced the data and image, where is the original, and what reuse terms apply?"
      ] }, sourceUrls: ["https://science.nasa.gov/mission/webb/multimedia/images/"]
    }
  ],
  "rocket-launch-windows-and-countdowns": [
    {
      id: "window", heading: "The destination helps set the departure time",
      paragraphs: [
        "A launch window is the interval in which a vehicle can depart while satisfying mission constraints. Target orbit, destination geometry, performance, safety, and operations all matter. A mission meeting an orbiting station may have a very narrow opportunity, while another mission can use a wider range of liftoff times. A window opening is not a guarantee that launch occurs then.",
        "Interplanetary missions also have departure opportunities shaped by the changing positions of Earth and the destination. A daily window and a broader planetary opportunity are different ideas. Missing one attempt does not always mean waiting for the next major orbital alignment; read what period the mission team actually describes."
      ], sourceUrls: ["https://science.nasa.gov/learn/basics-of-space-flight/chapter14-1/"]
    },
    {
      id: "terms", heading: "Translate the status before trusting the clock",
      paragraphs: ["Operational terminology varies between providers. Use the mission's own definitions where available rather than imposing one launch system's procedure on every rocket."],
      table: { caption: "Common launch-listing language", columns: ["Term", "Practical meaning", "Not a promise of"], rows: [
        ["NET: no earlier than", "Earliest currently targeted timing", "A confirmed final departure time"],
        ["TBD", "A detail remains to be determined", "A midnight launch on the listed date"],
        ["Hold", "Countdown paused, planned or unplanned", "A mission cancellation"],
        ["Recycle", "Return to an earlier countdown point", "An immediate launch after the issue clears"],
        ["Scrub", "This launch attempt has ended", "Cancellation of the entire mission"]
      ] }
    },
    {
      id: "countdown", heading: "Countdown time and wall-clock time can diverge",
      paragraphs: [
        "A T-minus display tracks a countdown sequence that can include holds. Some missions also publish a separate elapsed planning clock. Planned pauses let teams complete checks; unplanned ones may allow a problem to be assessed. If the display stops at T-minus ten minutes, you cannot always add ten minutes to your clock and predict liftoff.",
        "Suppose an illustrative window runs from 18:00 to 18:20 UTC. A delay might still permit launch at 18:15 if procedures and constraints allow. It might also require a recycle too long to fit before the window closes. The outcome depends on the mission, so the livestream team's update is more useful than arithmetic on the frozen countdown."
      ], sourceUrls: ["https://www.nasa.gov/artemis-ii-press-kit/"]
    },
    {
      id: "milestones", heading: "Liftoff is only the first outcome",
      paragraphs: [
        "A launch can leave the pad successfully while later milestones remain unverified. Stage separation, engine burns, orbital insertion, payload deployment, and spacecraft contact answer different questions. A booster landing is another milestone and is not identical to delivering the payload to the required orbit.",
        "When reading a status update, preserve that distinction. 'Liftoff confirmed' does not yet mean every objective succeeded; 'payload deployed' does not necessarily mean the spacecraft has finished commissioning. Wait for the relevant provider or mission team to confirm the outcome being discussed."
      ]
    },
    {
      id: "plan", heading: "Follow a launch without being caught by an old listing",
      paragraphs: ["Launch schedules are provisional by nature. A calendar is useful for discovery and planning, while the provider's latest update is the authority for a last-minute change."],
      list: { ordered: true, items: [
        "Save the launch time zone, current status, window, and source together, not a time-only screenshot.",
        "Convert the complete date and time. A late UTC launch can occur on the next local calendar day.",
        "Recheck before travel or joining a stream, and allow for webcast start time differing from launch time.",
        "During a hold, follow official procedural updates rather than interpreting every silence as a failure.",
        "After liftoff, look for the specific insertion or deployment confirmation before recording mission success."
      ] }
    }
  ],
  "orbits-and-lagrange-points": [
    {
      id: "orbit", heading: "Orbit is continuous falling, not an escape from gravity",
      paragraphs: [
        "An orbiting spacecraft moves sideways while gravity continually curves its path. In a stable orbit it keeps missing the surface rather than falling straight down. Astronauts float because they and their surroundings are falling together, not because Earth's gravity has vanished at their altitude.",
        "Altitude alone does not specify an orbit. Shape, inclination, period, and orientation also matter. A polar orbit describes inclination, while low Earth orbit describes a broad altitude regime: a satellite can be both low and polar. These labels are not mutually exclusive destinations in a menu."
      ], sourceUrls: ["https://www.esa.int/Enabling_Support/Space_Transportation/Types_of_orbits"]
    },
    {
      id: "types", heading: "Match the geometry to the mission's job",
      paragraphs: ["An orbit trades coverage, revisit timing, distance, and other constraints. No single choice is best for every mission."],
      table: { caption: "Common orbit descriptions", columns: ["Description", "Useful characteristic", "A limitation or distinction"], rows: [
        ["Low Earth orbit", "Relatively close views and crewed operations", "A satellite passes over changing ground regions"],
        ["Polar orbit", "Coverage across high latitudes as Earth rotates below", "Describes inclination, not one fixed altitude"],
        ["Geostationary orbit", "Appears fixed over one equatorial longitude", "Requires a circular equatorial orbit with the correct period"],
        ["Transfer orbit", "Connects stages toward a final working orbit", "Initial insertion may not be the final destination"]
      ] }
    },
    {
      id: "geo", heading: "Geosynchronous is broader than geostationary",
      paragraphs: [
        "A geosynchronous orbit has a period matching Earth's sidereal rotation, about 23 hours 56 minutes. To appear stationary over one longitude, the orbit must also be circular, equatorial, and in the same rotational direction as Earth. That special case is geostationary, at roughly 35,786 kilometers above the equator.",
        "An inclined or eccentric geosynchronous satellite does not stay at one point in the sky. This is why a single word in a launch listing can carry important operational meaning. Similarly, a payload launched toward geostationary transfer orbit usually still needs maneuvers to reach its operational orbit."
      ]
    },
    {
      id: "lagrange", heading: "Lagrange points belong to a moving two-body system",
      paragraphs: [
        "In a system such as the Sun and Earth, five Lagrange points identify special locations in a frame rotating with the two bodies. The combined gravitational and orbital geometry allows a small object near such a location to keep a useful relationship with them. These are not places where gravity simply switches off.",
        "The Sun-Earth L1 region lies sunward of Earth and is useful for solar monitoring. L2 lies beyond Earth away from the Sun and suits observatories requiring controlled illumination and thermal conditions. Missions commonly follow orbits around these regions rather than sitting exactly on a point. L1 and L2 are not passively stable parking spots: station-keeping corrections are needed."
      ], sourceUrls: ["https://www.esa.int/Enabling_Support/Operations/What_are_Lagrange_points"]
    },
    {
      id: "reading", heading: "Decode a mission's destination in four questions",
      paragraphs: ["The destination often explains the spacecraft's design better than the rocket's name. Read orbital language as part of the mission's purpose."],
      list: { items: [
        "Which body or two-body region is the mission associated with: Earth, the Moon, the Sun, or a Lagrange region?",
        "Which properties are specified: altitude, inclination, shape, period, or a transfer stage?",
        "How does that geometry support the job: ground coverage, a fixed view, communication, or a cold observing environment?",
        "Has the vehicle reached its final working orbit, or does orbit raising, transfer, or commissioning still lie ahead?"
      ] }
    }
  ],
};
