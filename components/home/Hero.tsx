import Link from "next/link";
import { AstroCard } from "@/components/ui/AstroCard";
import { DataBadge } from "@/components/ui/DataBadge";
import { MoonPhaseVisual } from "@/components/visuals/MoonPhaseVisual";
import { OrbitLineVisual } from "@/components/visuals/OrbitLineVisual";
import type { MoonData, NearEarthObject, SpaceEvent } from "@/lib/types";
import { humanizeToken } from "@/lib/utils";

type HeroProps = {
  moon: MoonData;
  nextEvent: SpaceEvent | null;
  closestNeo: NearEarthObject | null;
};

export function Hero({ moon, nextEvent, closestNeo }: HeroProps) {
  return (
    <section className="grid gap-6 py-4 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-8">
      <div>
        <p className="mb-4 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.24em] text-astro-gold">
          <span className="h-px w-8 bg-astro-gold/70" aria-hidden="true" />
          Calm astronomy intelligence
        </p>
        <h1 className="max-w-2xl text-4xl font-semibold leading-tight text-astro-text text-balance sm:text-5xl lg:text-6xl">
          Understand space, simply.
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-astro-muted sm:text-lg sm:leading-8">
          Astroboat brings astronomy briefs, space events, Moon data, and asteroid tracking into one clean sky intelligence platform.
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/briefs"
            className="inline-flex justify-center rounded-md border border-astro-gold/45 bg-astro-gold/10 px-4 py-3 text-sm font-semibold text-astro-text transition hover:bg-astro-gold/15 focus:outline-none focus:ring-2 focus:ring-astro-gold/45"
          >
            Explore Briefs
          </Link>
          <Link
            href="/events"
            className="inline-flex justify-center rounded-md border border-astro-border px-4 py-3 text-sm font-semibold text-astro-muted transition hover:border-astro-blue/45 hover:text-astro-blue focus:outline-none focus:ring-2 focus:ring-astro-blue/40"
          >
            View Space Events
          </Link>
        </div>
      </div>

      <AstroCard className="mission-surface p-4 sm:p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-astro-muted">
              Sky snapshot
            </p>
            <h2 className="mt-1 text-lg font-semibold text-astro-text">Today at a glance</h2>
          </div>
          <DataBadge label="Ready" />
        </div>

        <div className="space-y-3">
          <div className="rounded-lg border border-astro-border bg-astro-elevated/90 p-3">
            <div className="flex items-center gap-4">
              <MoonPhaseVisual phaseName={moon.phaseName} illuminationPercent={moon.illuminationPercent} size="sm" className="shrink-0" />
              <div className="min-w-0">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-astro-muted">Moon phase</p>
                <p className="mt-1 text-sm font-medium text-astro-text">{moon.phaseName}</p>
                <p className="mt-1 font-mono text-xs text-astro-muted">{moon.illuminationPercent}% illuminated</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-astro-border bg-astro-elevated/90 p-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-astro-muted">Next event</p>
                <p className="mt-2 line-clamp-2 text-sm font-medium leading-5 text-astro-text">
                  {nextEvent?.title ?? "Next event loading"}
                </p>
                <p className="mt-2 font-mono text-xs text-astro-blue">{nextEvent?.dateDisplay ?? "Cached update pending"}</p>
              </div>
              <DataBadge label={nextEvent ? humanizeToken(nextEvent.status) : "Scheduled"} />
            </div>
          </div>

          <div className="rounded-lg border border-astro-border bg-astro-elevated/90 p-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-astro-muted">Closest NEO</p>
                <p className="mt-2 text-sm font-medium text-astro-text">{closestNeo?.name ?? "NEO data loading"}</p>
              </div>
              <DataBadge label={closestNeo ? humanizeToken(closestNeo.riskLevel) : "Safe"} />
            </div>
            <OrbitLineVisual className="mt-2 h-16" />
          </div>
        </div>
      </AstroCard>
    </section>
  );
}
