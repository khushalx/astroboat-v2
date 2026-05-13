import type { Metadata } from "next";
import { AstroCard } from "@/components/ui/AstroCard";
import { DataBadge } from "@/components/ui/DataBadge";
import { MetricCard } from "@/components/ui/MetricCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { PageShell } from "@/components/ui/PageShell";
import { SourceBadge } from "@/components/ui/SourceBadge";
import { MoonPhaseVisual } from "@/components/visuals/MoonPhaseVisual";
import type { PrimaryMoonPhase } from "@/lib/types";
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
    ["Transit", moon.transit ?? "Unavailable"],
    ["Next full moon", moon.nextFullMoon?.dateDisplay ?? "Unavailable"],
    ["Next new moon", moon.nextNewMoon?.dateDisplay ?? "Unavailable"],
    ["Photography score", `${moon.photographyScore}/10`]
  ];

  return (
    <PageShell>
      <PageHeader
        title="Moon Phase Dashboard"
        subtitle="Live lunar phase, illumination, rise/set times, and upcoming Moon events."
      />

      {moon.isFallback ? (
        <div className="rounded-lg border border-astro-gold/35 bg-astro-gold/10 p-4 text-sm leading-6 text-astro-text">
          Live Moon data is temporarily unavailable. Showing saved Astroboat sample data.
        </div>
      ) : null}

      <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
        <AstroCard className="mission-surface p-6">
          <div className="flex flex-col items-center justify-center text-center">
            <MoonPhaseVisual
              phaseName={moon.phaseName}
              illuminationPercent={moon.illuminationPercent}
              size="lg"
              showLabel
            />
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
              <SourceBadge source={moon.source} />
              <DataBadge label={`${moon.illuminationPercent}% illuminated`} />
            </div>
            <p className="mt-4 font-mono text-xs uppercase tracking-[0.18em] text-astro-muted">{moon.date}</p>
            <p className="mt-2 text-sm text-astro-muted">{moon.locationName}</p>
            <p className="mt-4 rounded-md border border-astro-border px-3 py-2 text-sm text-astro-muted">
              Location changes coming later
            </p>
          </div>
        </AstroCard>

        <div className="grid gap-4 sm:grid-cols-2">
          {metricCards.map(([label, value]) => (
            <MetricCard key={label} label={label} value={value} />
          ))}
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <AstroCard className="p-5">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-astro-gold">Beginner explanation</p>
          <p className="mt-3 text-sm leading-7 text-astro-muted">{moon.beginnerExplanation}</p>
        </AstroCard>

        <AstroCard className="p-5">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-astro-gold">Viewing advice</p>
          <p className="mt-3 text-sm leading-7 text-astro-muted">{moon.viewingAdvice}</p>
        </AstroCard>
      </div>

      <AstroCard className="p-5">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-astro-text">Upcoming lunar phases</h2>
            <p className="mt-2 text-sm leading-6 text-astro-muted">Primary Moon phases from USNO, shown in UTC.</p>
          </div>
          <DataBadge label={moon.source} />
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 xl:grid-cols-8">
          {moon.upcomingPhases.map((item) => (
            <div key={`${item.phase}-${item.dateUtc}`} className="rounded-lg border border-astro-border bg-astro-elevated/90 p-3 text-center">
              <MoonPhaseVisual
                phaseName={item.phase}
                illuminationPercent={phaseIllumination(item.phase)}
                size="sm"
              />
              <p className="mt-3 text-sm font-medium text-astro-text">{item.phase}</p>
              <p className="mt-1 font-mono text-xs text-astro-muted">{item.dateDisplay}</p>
            </div>
          ))}
        </div>
      </AstroCard>

      <AstroCard className="p-5">
        <div className="grid gap-5 md:grid-cols-[220px_1fr] md:items-center">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-astro-gold">Photography score</p>
            <p className="mt-3 text-5xl font-semibold text-astro-text">{moon.photographyScore}</p>
            <p className="mt-2 text-sm text-astro-muted">out of 10</p>
          </div>
          <div>
            <div className="h-3 overflow-hidden rounded-full border border-astro-border bg-astro-bg">
              <div className="h-full rounded-full bg-gradient-to-r from-astro-blue/65 to-astro-gold" style={{ width: `${moon.photographyScore * 10}%` }} />
            </div>
            <p className="mt-4 text-sm leading-6 text-astro-muted">
              Moon data is calculated from USNO Astronomical Applications. Times are shown for the selected/default location.
            </p>
          </div>
        </div>
      </AstroCard>
    </PageShell>
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
