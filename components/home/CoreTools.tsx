import Link from "next/link";
import { AstroCard } from "@/components/ui/AstroCard";
import { MoonPhaseVisual } from "@/components/visuals/MoonPhaseVisual";
import type { MoonData } from "@/lib/types";

type CoreToolsProps = {
  moon: MoonData;
};

const tools = [
  {
    title: "Astronomy Briefs",
    copy: "Short space updates from trusted sources, simplified for quick reading.",
    href: "/briefs",
    action: "Open Briefs",
    visual: "signal"
  },
  {
    title: "Space Events",
    copy: "Track launches, sky events, and mission milestones.",
    href: "/events",
    action: "View Events",
    visual: "timeline"
  },
  {
    title: "Moon Tracker",
    copy: "Check Moon phase, illumination, and viewing times.",
    href: "/moon",
    action: "View Moon",
    visual: "moon"
  },
  {
    title: "Ask Astroboat",
    copy: "Ask beginner-friendly questions about space and astronomy.",
    href: "/ask",
    action: "Ask Now",
    visual: "assistant"
  }
] as const;

export function CoreTools({ moon }: CoreToolsProps) {
  return (
    <section className="py-5 sm:py-7">
      <div className="mb-4">
        <h2 className="font-display text-2xl font-normal text-astro-text">Explore Astroboat</h2>
        <p className="mt-1 text-sm text-astro-muted">Four simple ways to start exploring space.</p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {tools.map((tool) => (
          <AstroCard key={tool.href} as="article" className="p-3.5 sm:p-4" interactive>
            <div className="mb-3 h-12 rounded-lg border border-astro-border bg-astro-bg/35 p-2">
              <ToolVisual type={tool.visual} moon={moon} />
            </div>
            <h3 className="text-base font-semibold text-astro-text">{tool.title}</h3>
            <p className="mt-1.5 text-sm leading-6 text-astro-muted">{tool.copy}</p>
            <Link
              href={tool.href}
              className="mt-4 inline-flex min-h-11 items-center rounded-md border border-astro-border px-3 py-2 text-sm font-medium text-astro-text transition hover:border-astro-blue/45 hover:text-astro-blue focus:outline-none focus:ring-2 focus:ring-astro-blue/40"
            >
              {tool.action} <span className="ml-2" aria-hidden="true">→</span>
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
          <div className="h-full rounded-full bg-astro-gold" style={{ width: `${moon.illuminationPercent}%` }} />
        </div>
      </div>
    );
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

  if (type === "assistant") {
    return (
      <div className="flex h-full items-center gap-3" aria-label="Assistant signal visual">
        <div className="relative h-10 w-12 rounded-lg border border-astro-blue/35 bg-astro-blue/10">
          <span className="absolute left-2 top-2 h-1.5 w-1.5 rounded-full bg-astro-gold" />
          <span className="absolute left-5 top-2 h-1.5 w-5 rounded-full bg-astro-blue/60" />
          <span className="absolute bottom-2 left-2 h-1.5 w-8 rounded-full bg-astro-border" />
        </div>
        <div className="flex-1 space-y-2">
          <div className="h-px w-full bg-astro-border" />
          <div className="h-px w-4/5 bg-astro-blue/35" />
          <div className="h-px w-2/5 bg-astro-gold/45" />
        </div>
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
