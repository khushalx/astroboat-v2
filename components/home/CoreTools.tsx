import Link from "next/link";
import { AstroCard } from "@/components/ui/AstroCard";
import { MoonPhaseVisual } from "@/components/visuals/MoonPhaseVisual";
import { OrbitLineVisual } from "@/components/visuals/OrbitLineVisual";
import type { MoonData } from "@/lib/types";

type CoreToolsProps = {
  moon: MoonData;
};

const tools = [
  {
    title: "Astronomy Briefs",
    copy: "Short astronomy updates from trusted sources, rewritten for quick understanding.",
    href: "/briefs",
    action: "Open Briefs",
    visual: "signal"
  },
  {
    title: "Space Events",
    copy: "Track upcoming launches, mission events, and selected sky events.",
    href: "/events",
    action: "View Events",
    visual: "timeline"
  },
  {
    title: "Moon Dashboard",
    copy: "Check Moon phase, illumination, rise/set times, and viewing advice.",
    href: "/moon",
    action: "View Moon",
    visual: "moon"
  },
  {
    title: "Asteroid Watch",
    copy: "Follow near-Earth object close approaches with calm risk context.",
    href: "/asteroids",
    action: "Track Asteroids",
    visual: "orbit"
  }
] as const;

export function CoreTools({ moon }: CoreToolsProps) {
  return (
    <section className="py-8">
      <div className="mb-5">
        <p className="mb-2 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.22em] text-astro-gold">
          <span className="h-px w-6 bg-astro-gold/60" aria-hidden="true" />
          Core tools
        </p>
        <h2 className="text-2xl font-semibold text-astro-text">Explore Astroboat</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {tools.map((tool) => (
          <AstroCard key={tool.href} as="article" className="p-4 sm:p-5" interactive>
            <div className="mb-4 h-16 rounded-lg border border-astro-border bg-astro-bg/35 p-2">
              <ToolVisual type={tool.visual} moon={moon} />
            </div>
            <h3 className="text-lg font-semibold text-astro-text">{tool.title}</h3>
            <p className="mt-2 min-h-12 text-sm leading-6 text-astro-muted">{tool.copy}</p>
            <Link
              href={tool.href}
              className="mt-5 inline-flex rounded-md border border-astro-border px-3 py-2 text-sm font-medium text-astro-text transition hover:border-astro-blue/45 hover:text-astro-blue focus:outline-none focus:ring-2 focus:ring-astro-blue/40"
            >
              {tool.action}
            </Link>
          </AstroCard>
        ))}
      </div>
    </section>
  );
}

function ToolVisual({ type, moon }: { type: (typeof tools)[number]["visual"]; moon: MoonData }) {
  if (type === "moon") {
    return (
      <div className="flex h-full items-center gap-3">
        <MoonPhaseVisual phaseName={moon.phaseName} illuminationPercent={moon.illuminationPercent} size="sm" />
        <div className="h-2 flex-1 overflow-hidden rounded-full border border-astro-border bg-astro-surface">
          <div className="h-full rounded-full bg-gradient-to-r from-astro-blue/60 to-astro-gold/80" style={{ width: `${moon.illuminationPercent}%` }} />
        </div>
      </div>
    );
  }

  if (type === "orbit") {
    return <OrbitLineVisual className="h-full" />;
  }

  if (type === "timeline") {
    return (
      <div className="flex h-full items-center px-2" aria-label="Event timeline marker visual">
        <span className="h-2.5 w-2.5 rounded-full bg-astro-gold" />
        <span className="h-px flex-1 bg-astro-border" />
        <span className="h-2.5 w-2.5 rounded-full border border-astro-blue bg-astro-blue/15" />
        <span className="h-px flex-1 bg-astro-border" />
        <span className="h-2.5 w-2.5 rounded-full border border-astro-muted" />
      </div>
    );
  }

  return (
    <div className="flex h-full items-center gap-3" aria-label="Source signal visual">
      <div className="relative grid h-10 w-10 place-items-center rounded-full border border-astro-blue/35 bg-astro-blue/10">
        <span className="h-2.5 w-2.5 rounded-full bg-astro-blue" />
        <span className="absolute h-7 w-7 rounded-full border border-astro-blue/20" />
      </div>
      <div className="flex-1 space-y-2">
        <div className="h-1.5 w-4/5 rounded-full bg-astro-border" />
        <div className="h-1.5 w-3/5 rounded-full bg-astro-blue/45" />
        <div className="h-1.5 w-2/5 rounded-full bg-astro-gold/45" />
      </div>
    </div>
  );
}
