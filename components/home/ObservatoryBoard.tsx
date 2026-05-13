import { AstroCard } from "@/components/ui/AstroCard";
import { DataBadge } from "@/components/ui/DataBadge";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { MoonPhaseVisual } from "@/components/visuals/MoonPhaseVisual";
import { OrbitLineVisual } from "@/components/visuals/OrbitLineVisual";
import type { AstronomyBrief, MoonData, NearEarthObject, SpaceEvent } from "@/lib/types";
import { formatLunarDistance, formatSpeedKps, humanizeToken } from "@/lib/utils";

type ObservatoryBoardProps = {
  moon: MoonData;
  nextEvent: SpaceEvent;
  closestNeo: NearEarthObject;
  latestBrief: AstronomyBrief;
};

export function ObservatoryBoard({ moon, nextEvent, closestNeo, latestBrief }: ObservatoryBoardProps) {
  return (
    <section className="py-8">
      <SectionHeader
        title="Today's Observatory Board"
        subtitle="A concise daily board for Moon conditions, sky events, asteroid context, and astronomy briefings."
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <AstroCard className="p-5" interactive>
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-astro-muted">Moon phase</p>
              <h3 className="mt-2 text-lg font-semibold text-astro-text">{moon.phaseName}</h3>
            </div>
            <MoonPhaseVisual phaseName={moon.phaseName} illuminationPercent={moon.illuminationPercent} size="sm" />
          </div>
          <p className="text-sm leading-6 text-astro-muted">{moon.beginnerExplanation}</p>
        </AstroCard>

        <AstroCard className="p-5" interactive>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-astro-muted">Next space event</p>
              <h3 className="mt-2 text-lg font-semibold text-astro-text">{nextEvent.title}</h3>
            </div>
            <DataBadge label={humanizeToken(nextEvent.status)} />
          </div>
          <div className="mt-5 flex items-center gap-2" aria-label="Event progress status">
            <span className="h-2 w-2 rounded-full bg-astro-gold" />
            <span className="h-px flex-1 bg-astro-border" />
            <span className="h-2 w-2 rounded-full bg-astro-blue" />
            <span className="h-px flex-1 bg-astro-border" />
            <span className="h-2 w-2 rounded-full border border-astro-muted" />
          </div>
          <p className="mt-4 font-mono text-xs text-astro-blue">{nextEvent.dateDisplay}</p>
        </AstroCard>

        <AstroCard className="p-5" interactive>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-astro-muted">Closest NEO</p>
              <h3 className="mt-2 text-lg font-semibold text-astro-text">{closestNeo.name}</h3>
            </div>
            <DataBadge label={humanizeToken(closestNeo.riskLevel)} />
          </div>
          <OrbitLineVisual className="mt-2 h-24" />
          <p className="font-mono text-xs text-astro-muted">
            {formatLunarDistance(closestNeo.distanceLunar)} / {formatSpeedKps(closestNeo.speedKps)}
          </p>
        </AstroCard>

        <AstroCard className="p-5" interactive>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-astro-muted">Latest Astronomy Brief</p>
              <h3 className="mt-2 text-lg font-semibold text-astro-text">{latestBrief.title}</h3>
            </div>
            <DataBadge label="Ready" />
          </div>
          <SignalFeedVisual className="mt-4 h-16" label={latestBrief.source.name} />
          <p className="mt-3 text-sm leading-6 text-astro-muted">{latestBrief.summary[0]}</p>
        </AstroCard>
      </div>
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
