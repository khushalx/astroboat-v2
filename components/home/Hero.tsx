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
    <section className="grid gap-6 py-4 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-8">
      <div>
        <p className="mb-4 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.24em] text-astro-gold">
          <span className="h-px w-8 bg-astro-gold/70" aria-hidden="true" />
          Calm astronomy intelligence
        </p>
        <h1 className="font-display max-w-2xl text-4xl font-normal leading-tight text-astro-text text-balance sm:text-5xl lg:text-6xl">
          Understand space, simply.
        </h1>
        <p className="mt-5 max-w-[540px] text-sm leading-6 text-astro-muted sm:text-[15px] sm:leading-7">
          Astroboat brings astronomy briefs, space events, Moon data, and asteroid tracking into one clean sky intelligence platform.
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/briefs"
            className="inline-flex min-h-11 justify-center rounded-md border border-astro-gold bg-astro-gold px-4 py-3 text-sm font-semibold text-astro-bg transition hover:bg-astro-text focus:outline-none focus:ring-2 focus:ring-astro-gold/45"
          >
            Explore Briefs
          </Link>
          <Link
            href="/events"
            className="inline-flex min-h-11 justify-center rounded-md border border-astro-blue/45 px-4 py-3 text-sm font-semibold text-astro-blue transition hover:border-astro-blue hover:text-astro-text focus:outline-none focus:ring-2 focus:ring-astro-blue/40"
          >
            View Space Events
          </Link>
        </div>
        <div className="mt-8 h-px max-w-xl bg-gradient-to-r from-astro-gold/45 via-astro-blue/25 to-transparent" aria-hidden="true" />
      </div>

      <AstroCard className="p-4 sm:p-5">
        <div className="mb-4 flex items-center justify-between gap-3 border-b border-astro-border pb-3">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-astro-muted">
              Today on Astroboat
            </p>
            <h2 className="mt-1 text-base font-semibold text-astro-text">Sky snapshot</h2>
          </div>
          <DataBadge label="Ready" />
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-4 rounded-lg border border-astro-border bg-astro-elevated p-3">
            <MoonPhaseVisual phaseName={moon.phaseName} illuminationPercent={moon.illuminationPercent} size="sm" className="shrink-0" />
            <div className="min-w-0">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-astro-muted">Moon</p>
              <p className="mt-1 truncate text-sm font-medium text-astro-text">{moon.phaseName}</p>
              <p className="mt-1 font-mono text-xs text-astro-muted">{moon.illuminationPercent}% illuminated</p>
            </div>
          </div>

          <div className="rounded-lg border border-astro-border bg-astro-elevated p-3">
            <div className="flex items-center gap-4">
              <div className="min-w-0">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-astro-muted">Next event</p>
                <p className="mt-1 line-clamp-1 text-sm font-medium text-astro-text">
                  {nextEvent?.title ?? "Event feed loading"}
                </p>
                <p className="mt-1 font-mono text-xs text-astro-blue">{nextEvent?.dateDisplay ?? "Cached update pending"}</p>
              </div>
              <DataBadge label={nextEvent ? humanizeToken(nextEvent.status) : "Scheduled"} className="ml-auto" />
            </div>
          </div>

          <div className="rounded-lg border border-astro-border bg-astro-elevated p-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-astro-muted">Closest NEO</p>
                <p className="mt-1 text-sm font-medium text-astro-text">{closestNeo?.name ?? "NEO data loading"}</p>
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
