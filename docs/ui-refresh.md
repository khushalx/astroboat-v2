# Observatory UI refresh

The app is a Next.js App Router project. Route pages load astronomy data through the existing `services/` modules; interactive search, filters, image viewers, and the assistant live in client components. The root layout owns navigation, the main content container, global search, and the footer.

The refresh keeps that architecture and the existing data providers. Shared colors and base typography are in `app/globals.css`; the new navigation, responsive home composition, and footer styles are in `app/discovery.css`. The home page presents one spatial hero, a compact Moon/event snapshot, five active exploration destinations, and the assistant. Satellite and learning routes are paused in the existing app and are intentionally absent from the main navigation.

`EarthScene.tsx` loads the Three.js implementation only when the hero enters the viewport. `earth-scene.ts` owns GPU resources, textures, lighting, orbit geometry, pointer controls, and cleanup. Rendering stops while paused, offscreen, or in a hidden tab. Reduced-motion preferences disable automatic rotation. The static NASA image remains visible if WebGL or texture loading fails. The scene is an illustration, not live tracking.

`MoonPhaseVisual.tsx` uses the projected elliptical day/night boundary to represent illumination, with mirrored waxing and waning phases. The same component appears on the home page and lunar dashboard.

Image origins, transformations, and credits are recorded in `public/textures/README.md` and displayed on the data sources page.
