import Link from "next/link";
import { AstroCard } from "@/components/ui/AstroCard";
import { DataBadge } from "@/components/ui/DataBadge";
import { MoonPhaseVisual } from "@/components/visuals/MoonPhaseVisual";
import { OrbitLineVisual } from "@/components/visuals/OrbitLineVisual";
import type { AstronomyBrief, MoonData, NearEarthObject, SpaceEvent } from "@/lib/types";
import { humanizeToken } from "@/lib/utils";

type HeroProps = {
  moon: MoonData;
  nextEvent: SpaceEvent;
  closestNeo: NearEarthObject;
  latestBrief: AstronomyBrief;
  counts: {
    briefs: number;
    events: number;
    neos: number;
    core: number;
  };
};

export function Hero({ moon, nextEvent, closestNeo, latestBrief, counts }: HeroProps) {
  return (
    <section className="grid gap-8 py-4 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-8">
      <div>
        <p className="mb-4 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.24em] text-astro-gold">
          <span className="h-px w-8 bg-astro-gold/70" aria-hidden="true" />
          Calm astronomy intelligence
        </p>
        <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-astro-text text-balance sm:text-5xl lg:text-6xl">
          Understand the sky. Track space. Stay curious.
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-8 text-astro-muted sm:text-lg">
          Astroboat brings astronomy briefs, global space events, Moon data, and asteroid tracking into one calm, beginner-friendly platform.
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/events"
            className="inline-flex justify-center rounded-md border border-astro-gold/45 bg-astro-gold/10 px-4 py-3 text-sm font-semibold text-astro-text transition hover:bg-astro-gold/15 focus:outline-none focus:ring-2 focus:ring-astro-gold/45"
          >
            View Space Events
          </Link>
          <Link
            href="/briefs"
            className="inline-flex justify-center rounded-md border border-astro-border px-4 py-3 text-sm font-semibold text-astro-muted transition hover:border-astro-blue/45 hover:text-astro-blue focus:outline-none focus:ring-2 focus:ring-astro-blue/40"
          >
            Read Briefs
          </Link>
        </div>
        <dl className="mt-8 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            ["Briefs", String(counts.briefs)],
            ["Events", String(counts.events)],
            ["NEOs", String(counts.neos)],
            ["Core", String(counts.core)]
          ].map(([label, value]) => (
            <div key={label} className="mission-surface rounded-lg border border-astro-border bg-astro-surface/70 p-3">
              <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-astro-muted">{label}</dt>
              <dd className="mt-1 text-xl font-semibold text-astro-text">{value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <AstroCard className="mission-surface p-4 sm:p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-astro-muted">
              Today&apos;s Sky Snapshot
            </p>
            <h2 className="mt-1 text-xl font-semibold text-astro-text">Observatory panel</h2>
          </div>
          <DataBadge label="Ready" />
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 2xl:grid-cols-2">
          <div className="rounded-lg border border-astro-border bg-astro-elevated/90 p-4">
            <div className="flex items-center gap-4">
              <MoonPhaseVisual phaseName={moon.phaseName} illuminationPercent={moon.illuminationPercent} size="sm" className="shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-astro-text">{moon.phaseName}</p>
                <p className="mt-1 font-mono text-xs text-astro-muted">{moon.illuminationPercent}% illuminated</p>
                <p className="mt-2 text-xs leading-5 text-astro-muted">{moon.locationName}</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-astro-border bg-astro-elevated/90 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-astro-muted">Next launch</p>
                <p className="mt-2 line-clamp-3 text-sm font-medium leading-5 text-astro-text">{nextEvent.title}</p>
              </div>
              <DataBadge label={humanizeToken(nextEvent.status)} />
            </div>
            <p className="mt-3 font-mono text-xs text-astro-blue">{nextEvent.dateDisplay}</p>
          </div>

          <div className="rounded-lg border border-astro-border bg-astro-elevated/90 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-astro-muted">Near-Earth object</p>
                <p className="mt-2 text-sm font-medium text-astro-text">{closestNeo.name}</p>
              </div>
              <DataBadge label={humanizeToken(closestNeo.riskLevel)} />
            </div>
            <OrbitLineVisual className="mt-2 h-20" />
          </div>

          <div className="rounded-lg border border-astro-border bg-astro-elevated/90 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-astro-muted">Astronomy Briefs</p>
                <p className="mt-2 text-sm font-medium leading-5 text-astro-text">Short, clear explanations of major astronomy and space updates.</p>
              </div>
              <DataBadge label="Ready" />
            </div>
            <SignalFeedVisual className="mt-3 h-16" label={latestBrief.source.name} />
          </div>
        </div>
      </AstroCard>
    </section>
  );
}

function SignalFeedVisual({ className, label }: { className?: string; label: string }) {
  return (
    <div className={className} aria-label="Astronomy brief signal feed visual">
      <div className="flex h-full items-center gap-3">
        <div className="relative grid h-11 w-11 place-items-center rounded-full border border-astro-blue/35 bg-astro-blue/10">
          <span className="h-2.5 w-2.5 rounded-full bg-astro-blue" />
          <span className="absolute h-7 w-7 rounded-full border border-astro-blue/20" />
        </div>
        <div className="flex-1 space-y-2">
          <div className="h-1.5 w-4/5 rounded-full bg-astro-border" />
          <div className="h-1.5 w-3/5 rounded-full bg-astro-blue/45" />
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-astro-muted">{label}</p>
        </div>
      </div>
    </div>
  );
}
