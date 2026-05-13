import { CoreTools } from "@/components/home/CoreTools";
import { Hero } from "@/components/home/Hero";
import type { Metadata } from "next";
import { getNearEarthObjects } from "@/services/asteroids-service";
import { getUpcomingEvents } from "@/services/events-service";
import { getCurrentMoonData } from "@/services/moon-service";

export const metadata: Metadata = {
  title: {
    absolute: "Astroboat — Astronomy Intelligence & Sky Tools"
  },
  description: "Track astronomy briefs, space events, Moon data, and near-Earth objects in one calm sky dashboard.",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "Astroboat — Astronomy Intelligence & Sky Tools",
    description: "Track astronomy briefs, space events, Moon data, and near-Earth objects in one calm sky dashboard.",
    url: "/",
    images: ["/opengraph-image"]
  }
};

export default async function HomePage() {
  const [events, moon, neos] = await Promise.all([
    getUpcomingEvents(),
    getCurrentMoonData(),
    getNearEarthObjects()
  ]);
  const closestNeo = neos[0] ?? null;

  return (
    <>
      <Hero
        moon={moon}
        nextEvent={events[0] ?? null}
        closestNeo={closestNeo}
      />
      <CoreTools moon={moon} />
      <section className="pb-8 pt-2">
        <div className="rounded-lg border border-astro-border bg-astro-surface/60 px-4 py-3 text-sm leading-6 text-astro-muted">
          Astroboat uses public astronomy data sources such as NASA, ESA, arXiv, USNO, JPL, and The Space Devs, with fallback data when live sources are unavailable.
        </div>
      </section>
    </>
  );
}
