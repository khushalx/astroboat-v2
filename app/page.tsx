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
      "Astroboat helps you explore simple astronomy updates, sky events, Moon data, and AI-powered space explanations.",
    images: ["/astroboat-search-banner.png"]
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
      <section className="pb-7 pt-1">
        <div className="flex flex-col gap-2 rounded-lg border border-astro-border bg-astro-surface/60 px-3.5 py-3 text-sm text-astro-muted sm:flex-row sm:items-center sm:justify-between sm:px-4">
          <span>Beginner friendly</span>
          <span className="hidden h-1 w-1 rounded-full bg-astro-border sm:block" aria-hidden="true" />
          <span>Uses public astronomy data</span>
          <span className="hidden h-1 w-1 rounded-full bg-astro-border sm:block" aria-hidden="true" />
          <span>AI assistant for quick explanations</span>
        </div>
      </section>
    </>
  );
}
