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
  description:
    "Astroboat helps you explore astronomy briefs, global space events, Moon phase data, and near-Earth object tracking through a clean observatory-style platform.",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "Astroboat — Astronomy Intelligence & Sky Tools",
    description:
      "Astroboat helps you explore astronomy briefs, global space events, Moon phase data, and near-Earth object tracking through a clean observatory-style platform.",
    url: "https://astroboat.in",
    images: [
      {
        url: "/astroboat-search-banner.png",
        width: 1200,
        height: 630,
        alt: "Astroboat astronomy intelligence and sky tools"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Astroboat — Astronomy Intelligence & Sky Tools",
    description:
      "Astroboat helps you explore astronomy briefs, global space events, Moon phase data, and near-Earth object tracking through a clean observatory-style platform.",
    images: ["/astroboat-search-banner.png"]
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
        <div className="rounded-lg border border-astro-border bg-astro-surface/60 px-4 py-3 text-xs leading-6 text-[color:var(--text-dim)]">
          Data from NASA JPL, The Space Devs, USNO, RSS/API feeds, and open astronomical sources.
        </div>
      </section>
    </>
  );
}
