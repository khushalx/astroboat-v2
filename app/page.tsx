import { ExploreTools } from "@/components/home/ExploreTools";
import { Hero } from "@/components/home/Hero";
import { LatestBriefs } from "@/components/home/LatestBriefs";
import { ObservatoryBoard } from "@/components/home/ObservatoryBoard";
import { UpcomingEvents } from "@/components/home/UpcomingEvents";
import type { Metadata } from "next";
import { getNearEarthObjects } from "@/services/asteroids-service";
import { getLatestBriefs } from "@/services/briefs-service";
import { getUpcomingEvents } from "@/services/events-service";
import { getCurrentMoonData } from "@/services/moon-service";
import { getToolCards } from "@/services/tools-service";

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
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Astroboat astronomy intelligence and sky tools"
      }
    ]
  }
};

export default async function HomePage() {
  const [briefs, events, moon, neos, tools] = await Promise.all([
    getLatestBriefs(),
    getUpcomingEvents(),
    getCurrentMoonData(),
    getNearEarthObjects(),
    getToolCards()
  ]);
  const closestNeo = neos[4] ?? neos[0];
  const coreToolPreviews = tools.filter((tool) => tool.href === "/moon" || tool.href === "/asteroids");

  return (
    <>
      <Hero
        moon={moon}
        nextEvent={events[1] ?? events[0]}
        closestNeo={closestNeo}
        latestBrief={briefs[0]}
        counts={{
          briefs: briefs.length,
          events: events.length,
          neos: neos.length,
          core: 4
        }}
      />
      <ObservatoryBoard moon={moon} nextEvent={events[0]} closestNeo={closestNeo} latestBrief={briefs[0]} />
      <LatestBriefs briefs={briefs.slice(0, 3)} />
      <UpcomingEvents events={events} />
      <ExploreTools tools={coreToolPreviews} />
    </>
  );
}
