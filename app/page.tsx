import { CoreTools } from "@/components/home/CoreTools";
import { Hero } from "@/components/home/Hero";
import type { Metadata } from "next";
import { getUpcomingEvents } from "@/services/events-service";
import { getCurrentMoonData } from "@/services/moon-service";

export const metadata: Metadata = {
  title: {
    absolute: "Astroboat — Astronomy Intelligence & Sky Tools"
  },
  description:
    "Astroboat helps you explore simple astronomy updates, sky events, Moon data, and AI-powered space explanations.",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "Astroboat — Astronomy Intelligence & Sky Tools",
    description:
      "Astroboat helps you explore simple astronomy updates, sky events, Moon data, and AI-powered space explanations.",
    url: "https://astroboat.in",
    images: [
      {
        url: "/og-image.png",
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
      "Astroboat helps you explore simple astronomy updates, sky events, Moon data, and AI-powered space explanations.",
    images: ["/og-image.png"]
  }
};

export default async function HomePage() {
  const [events, moon] = await Promise.all([
    getUpcomingEvents(),
    getCurrentMoonData()
  ]);

  return (
    <>
      <Hero
        moon={moon}
        nextEvent={events[0] ?? null}
      />
      <CoreTools moon={moon} />
    </>
  );
}
