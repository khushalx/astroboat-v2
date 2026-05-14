import type { Metadata } from "next";
import { AstroCard } from "@/components/ui/AstroCard";
import { DataBadge } from "@/components/ui/DataBadge";
import { PageHeader } from "@/components/ui/PageHeader";
import { PageShell } from "@/components/ui/PageShell";
import { SourceBadge } from "@/components/ui/SourceBadge";
import { MoonPhaseVisual } from "@/components/visuals/MoonPhaseVisual";
import type { MoonEvent, PrimaryMoonPhase } from "@/lib/types";
import { getCurrentMoonData } from "@/services/moon-service";

export const metadata: Metadata = {
  title: "Moon Phase Dashboard",
  description: "Track the current Moon phase, illumination, moonrise, moonset, and upcoming lunar phases.",
  alternates: {
    canonical: "/moon"
  },
  openGraph: {
    title: "Moon Phase Dashboard — Astroboat",
    description: "Track the current Moon phase, illumination, moonrise, moonset, and upcoming lunar phases.",
    url: "/moon",
    images: ["/opengraph-image"]
  }
};

export default async function MoonPage() {
  const moon = await getCurrentMoonData();
  const metricCards = [
    ["Moonrise", moon.moonrise ?? "Unavailable"],
    ["Moonset", moon.moonset ?? "Unavailable"],
    ["Next full moon", moon.nextFullMoon ? `${moon.nextFullMoon.dateDisplay} · ${countdown(moon.nextFullMoon)}` : "Unavailable"],
    ["Next new moon", moon.nextNewMoon ? `${moon.nextNewMoon.dateDisplay} · ${countdown(moon.nextNewMoon)}` : "Unavailable"]
  ];

  return (
    <PageShell>
      <PageHeader
        title="Moon"
        subtitle="Current phase, illumination, rise/set times, and the next lunar milestones."
      />

      {moon.isFallback ? (
        <div className="rounded-lg border border-astro-gold/35 bg-astro-gold/10 p-3.5 text-sm leading-6 text-astro-text">
          Live Moon data is temporarily unavailable. Showing saved Astroboat sample data.
        </div>
      ) : null}

      <AstroCard className="p-5 sm:p-6">
        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div className="flex flex-col items-center text-center">
            <MoonPhaseVisual
              phaseName={moon.phaseName}
              illuminationPercent={moon.illuminationPercent}
              size="lg"
              showLabel
            />
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
              <SourceBadge source={moon.source} />
              <DataBadge label={moon.locationName} />
            </div>
          </div>

          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-astro-muted">Illumination</p>
            <p className="mt-2 font-mono text-6xl font-semibold leading-none text-astro-gold sm:text-7xl">
              {moon.illuminationPercent}%
            </p>
            <p className="mt-3 text-sm leading-6 text-astro-muted">
              {trimAdvice(moon.viewingAdvice)}
            </p>
            <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--text-dim)]">
              {moon.date} / {moon.locationName}
            </p>
          </div>
        </div>
      </AstroCard>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {metricCards.map(([label, value]) => (
          <StatTile key={label} label={label} value={value} />
        ))}
      </div>

      <AstroCard className="p-4">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl font-normal text-astro-text">Lunar cycle</h2>
            <p className="mt-1 text-sm text-astro-muted">Primary phases from USNO, shown in UTC.</p>
          </div>
          <DataBadge label={moon.source} />
        </div>
        <div className="flex gap-3 overflow-x-auto pb-1">
          {moon.upcomingPhases.map((item) => (
            <div
              key={`${item.phase}-${item.dateUtc}`}
              className="min-w-36 rounded-lg border border-astro-border bg-astro-elevated p-3 text-center"
            >
              <MoonPhaseVisual
                phaseName={item.phase}
                illuminationPercent={phaseIllumination(item.phase)}
                size="sm"
                className={item.phase === moon.closestPrimaryPhase?.phase ? "rounded-full ring-1 ring-astro-gold/70" : undefined}
              />
              <p className="mt-3 text-sm font-medium text-astro-text">{item.phase}</p>
              <p className="mt-1 font-mono text-[11px] text-astro-muted">{item.dateDisplay}</p>
            </div>
          ))}
        </div>
      </AstroCard>

      <AstroCard className="p-4">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-astro-gold">Viewing advice</p>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-astro-muted">{trimAdvice(moon.beginnerExplanation)}</p>
      </AstroCard>
    </PageShell>
  );
}

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <AstroCard className="p-3.5">
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-astro-muted">{label}</p>
      <p className="mt-2 text-sm font-semibold leading-6 text-astro-text">{value}</p>
    </AstroCard>
  );
}

function phaseIllumination(phase: PrimaryMoonPhase) {
  switch (phase) {
    case "New Moon":
      return 0;
    case "First Quarter":
    case "Last Quarter":
      return 50;
    case "Full Moon":
      return 100;
  }
}

function countdown(event: MoonEvent) {
  const date = new Date(event.dateUtc);

  if (Number.isNaN(date.getTime())) {
    return "date pending";
  }

  const days = Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  if (days <= 0) {
    return "today";
  }

  return `in ${days} day${days === 1 ? "" : "s"}`;
}

function trimAdvice(value: string) {
  return value.split(". ").slice(0, 2).join(". ").replace(/\.$/, "") + ".";
}
