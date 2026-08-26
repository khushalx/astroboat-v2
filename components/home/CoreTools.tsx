import Link from "next/link";
import { NavIcon } from "@/components/layout/NavIcon";
import { AstroCard } from "@/components/ui/AstroCard";
import { MoonPhaseVisual } from "@/components/visuals/MoonPhaseVisual";
import type { MoonData } from "@/lib/types";

type CoreToolsProps = {
  moon: MoonData;
};

const tools = [
  {
    title: "Astronomy Gallery",
    copy: "High-resolution captures of galaxies, nebulae, planets, and deep space from NASA and space observatories.",
    href: "/gallery",
    action: "Explore gallery",
    icon: "Gallery"
  },
  {
    title: "Astronomy Briefs",
    copy: "Concise updates from NASA, ESA, arXiv, APOD, and trusted astronomy sources.",
    href: "/briefs",
    action: "Browse briefs",
    icon: "Briefs"
  },
  {
    title: "Space Events",
    copy: "Upcoming launches, mission milestones, and selected sky events in one calendar.",
    href: "/events",
    action: "View events",
    icon: "Events"
  },
  {
    title: "Moon",
    copy: "Current phase, illumination, rise and set times, and the next lunar milestones.",
    href: "/moon",
    action: "Explore the Moon",
    icon: "Moon"
  },
  {
    title: "Asteroid Watch",
    copy: "Near-Earth object close approaches, distance, velocity, and calm scientific context.",
    href: "/asteroids",
    action: "Track asteroids",
    icon: "Asteroid Watch"
  },
  {
    title: "Ask Astroboat",
    copy: "Clear, beginner-friendly explanations for astronomy and space science questions.",
    href: "/ask",
    action: "Ask a question",
    icon: "Ask Astroboat"
  }
] as const;

export function CoreTools({ moon }: CoreToolsProps) {
  return (
    <section className="pb-12 sm:pb-16">
      <div className="mb-6 max-w-2xl">
        <h2 className="font-display text-3xl font-normal tracking-[-0.02em] text-astro-text">Explore Astroboat</h2>
        <p className="mt-2 text-sm leading-7 text-astro-muted">Choose a starting point and move between tools without losing context.</p>
      </div>

      <AstroCard className="p-0">
        <div className="grid md:grid-cols-2">
          {tools.map((tool, index) => (
            <Link
              key={tool.href}
              href={tool.href}
              className={`group flex min-h-44 gap-4 p-5 transition hover:bg-white/[0.025] sm:p-6 ${
                index < 5 ? "border-b border-astro-border/70" : ""
              } ${index < 4 ? "md:border-b md:border-astro-border/70" : "md:border-b-0"} ${
                index % 2 === 0 ? "md:border-r md:border-astro-border/70" : ""
              }`}
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-white/[0.04] text-astro-blue" aria-hidden="true">
                <NavIcon label={tool.icon} className="h-4 w-4" />
              </span>
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="flex items-start justify-between gap-4">
                  <span className="font-display text-2xl text-astro-text">{tool.title}</span>
                  {tool.href === "/moon" ? (
                    <MoonPhaseVisual phaseName={moon.phaseName} illuminationPercent={moon.illuminationPercent} size="sm" />
                  ) : null}
                </span>
                <span className="mt-2 max-w-md text-sm leading-6 text-astro-muted">{tool.copy}</span>
                <span className="mt-auto pt-4 text-sm font-medium text-astro-blue transition group-hover:text-astro-text">
                  {tool.action} <span aria-hidden="true">→</span>
                </span>
              </span>
            </Link>
          ))}
        </div>
      </AstroCard>
    </section>
  );
}
