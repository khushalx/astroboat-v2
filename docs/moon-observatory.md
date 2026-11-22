# Lunar observatory

## Boundaries

Only /moon is redesigned. Moon and Asteroid Watch are direct primary navigation
links, without the former Sky tools dropdown. The global fonts, theme, homepage Moon
glyph, USNO requests, timeouts, caches, rise/set parsing, and other APIs are
unchanged. Moon CSS is a route-local module. The server still fetches USNO
conditions and eight primary phases independently; partial source failures
remain partial failures, not sample-data substitutions.

## Data and scientific approximations

- The default readout retains USNO's named daily phase and illuminated
  fraction for the displayed Ahmedabad civil date. The service does not
  supply an instantaneous timestamp for those daily values.
- Astronomy Engine calculates Sun/Moon geocentric vectors, lunar north,
  phase longitude, distance, and libration. The model reference time is noon
  in the location's offset: 12:00 IST / 06:30 UTC. All dates are passed
  explicitly, never interpreted through a browser's local timezone.
- The default light's z component matches the USNO fraction. Its transverse
  direction uses the calculated position angle and the USNO named waxing or
  waning branch. Illumination alone never determines the branch.
- Timeline changes are local calculations, not USNO API calls. The vector
  Sun direction determines simulated illumination. Simulation labels appear
  beside the date and timeline; the original date, location, rise/set,
  and UTC milestone readouts remain unchanged below it.
- If USNO conditions are unavailable, its zero sentinel is not treated as an
  observed New Moon. A calculated simulation is clearly labeled and rise/set
  remains unavailable. Independently available milestones are retained.
- Orientation is geocentric, lunar north up, with approximate libration.
  It is not an observer's horizon view: topocentric parallax, refraction,
  parallactic rotation, atmospheric color, and local visibility are excluded.
  This is an educational rendering, not a precision ephemeris.
- Earth-facing mode fixes the observing direction. Explore unlocks the
  camera while leaving sunlight fixed in model space. The readout continues
  to describe the Earth-facing phase, not the free camera's visible fraction.
- Terrain uses a 1737.4 km reference sphere and physical LOLA height scale.
  The displacement grid and texture resolution cannot reproduce every small
  crater. Height-derived normals add visual detail; full terrain self-shadow
  ray tracing is not performed.
- The airless-surface shader blends Lommel-Seeliger and Lambert diffuse
  terms. Directional incidence and actual surface normals produce the
  terminator; no phase overlay is used. The tiny neutral night-side floor
  aids readability and is not modeled earthshine. No lunar-eclipse shadow,
  opposition surge, or calibrated photometry is claimed.
- Full/New/Quarter names occupy a one-degree phase-longitude window in the
  simulation. Primary-phase event times remain the exact returned USNO times.

Library documentation: https://github.com/cosinekitty/astronomy/tree/master/source/js
NASA sources and asset processing are recorded in public/textures/moon/README.md.

## Rendering and accessibility

The R3F/Drei viewer is dynamically imported with server rendering disabled.
A NASA-textured reference remains visible during loading, WebGL rejection,
asset failure, and context loss. A failed high-resolution upgrade retains the
complete 1K scene. A renderer error boundary also returns to the reference.

Rendering is on demand, with no automatic Moon rotation. Intersection and
document visibility pause hidden scenes. DPR is capped at 1.5; no bloom,
postprocessing, particle system, environment map, or continuously moving stars
are used. Reduced motion removes camera reveal, light interpolation, and
control damping. Texture/geometry/material resources and event listeners
are disposed on unmount.

Modes, reset, zoom, fullscreen, date and timeline are keyboard accessible.
The canvas keyboard target supports arrows in Explore, +/- zoom, and Home
to reset. Mobile vertical scrolling is retained. Fullscreen uses the native
API when available, otherwise a focus-contained, Escape-dismissable overlay.
Textual conditions and the NASA reference remain available without WebGL.

## Rebuilding assets

Download the two original TIFF URLs from the asset README as color.tif and
height.tif into a temporary directory, then:

```sh
node scripts/prepare-moon-assets.mjs /path/to/source-directory
```

The script checks that the TIFF height values remain physical elevations.
It does not run during a Next build or in any request.

## Verification

```sh
npm run test:moon
npm run test:data
npm run lint
npm run build
MOON_TEST_BASE_URL=http://localhost:3018 npm run test:moon:browser
```

Install Chromium with npx playwright install chromium if needed. An existing
compatible Chromium can be selected with PLAYWRIGHT_CHROMIUM_EXECUTABLE.
Screenshots default to /tmp/astroboat-moon-checks, or MOON_TEST_SCREENSHOTS.
Browser checks exercise canvas pixels, waxing/waning direction, drag,
keyboard rotation, wheel/button zoom, reset, fullscreen, timeline, seven
viewport widths, idle rendering, texture failure, and WebGL/context loss.
Additional checks cover normal-motion settling, data-saver delivery, a failed
detail upgrade retaining the base surface, and no lunar assets on the homepage.
The local production test stubs Vercel's injected analytics script; that
hosting-only endpoint is not served by next start.
GPU performance on physical hardware remains device-dependent; headless
software rendering is a correctness test, not a MacBook Air FPS benchmark.
