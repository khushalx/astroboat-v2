import type { Metadata } from "next";
import { AstroCard } from "@/components/ui/AstroCard";
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
    images: ["/og-image.png"]
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
        <div className="rounded-lg border border-astro-gold/25 bg-astro-gold/[0.06] p-4 text-sm leading-6 text-astro-text">
          Live Moon data is temporarily unavailable. Showing saved Astroboat sample data.
        </div>
      ) : null}

      <AstroCard className="p-0">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch">
          <div className="moon-feature min-h-[24rem] border-b border-astro-border/70 p-6 text-center lg:min-h-[30rem] lg:border-b-0 lg:border-r">
            <MoonPhaseVisual
              phaseName={moon.phaseName}
              illuminationPercent={moon.illuminationPercent}
              size="lg"
              className="scale-110 drop-shadow-[0_20px_24px_rgba(0,0,0,0.35)] sm:scale-125"
            />
            <div className="absolute bottom-5 left-5 right-5 z-10 flex flex-wrap items-center justify-center gap-2">
              <SourceBadge source={moon.source} />
              <span className="text-xs text-astro-muted">{moon.locationName}</span>
            </div>
          </div>

          <div className="flex flex-col justify-center p-5 sm:p-7 lg:p-9">
            <div className="mb-7 flex items-center justify-between gap-3 border-b border-astro-border/70 pb-4 text-xs text-astro-muted">
              <span>Current conditions</span>
              <time className="font-mono">{moon.date}</time>
            </div>
            <p className="font-display text-2xl text-astro-text">{moon.phaseName}</p>
            <p className="mt-5 text-sm text-astro-muted">Illumination</p>
            <p className="mt-2 font-mono text-6xl font-medium leading-none tracking-[-0.06em] text-astro-gold sm:text-7xl">
              {moon.illuminationPercent}%
            </p>
            <div className="mt-5 h-1 overflow-hidden rounded-full bg-white/[0.06]">
              <div
                className="h-full rounded-full bg-astro-gold"
                style={{ width: `${moon.illuminationPercent}%` }}
              />
            </div>
            <p className="mt-5 max-w-xl text-sm leading-7 text-astro-muted">
              {trimAdvice(moon.viewingAdvice)}
            </p>
            <p className="mt-4 text-xs text-[color:var(--text-dim)]">Based on {moon.locationName}</p>
          </div>
        </div>
      </AstroCard>

      <AstroCard className="p-0">
        <dl className="grid gap-px bg-astro-border/70 sm:grid-cols-2 lg:grid-cols-4">
          {metricCards.map(([label, value]) => (
            <div key={label} className="bg-astro-surface/95 p-4 sm:p-5">
              <dt className="text-xs text-astro-muted">{label}</dt>
              <dd className="mt-2 text-sm font-medium leading-6 text-astro-text">{value}</dd>
            </div>
          ))}
        </dl>
      </AstroCard>

      <AstroCard className="p-0">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div className="px-5 pt-5 sm:px-6 sm:pt-6">
            <h2 className="font-display text-2xl font-normal text-astro-text sm:text-3xl">Lunar cycle</h2>
            <p className="mt-1 text-sm text-astro-muted">Primary phases from USNO, shown in UTC.</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-px border-t border-astro-border/70 bg-astro-border/70 sm:grid-cols-4">
          {moon.upcomingPhases.map((item) => (
            <div
              key={`${item.phase}-${item.dateUtc}`}
              className="bg-astro-surface/95 p-4 text-center sm:p-5"
            >
              <MoonPhaseVisual
                phaseName={item.phase}
                illuminationPercent={phaseIllumination(item.phase)}
                size="sm"
                className={item.phase === moon.closestPrimaryPhase?.phase && item.dateUtc === moon.closestPrimaryPhase?.dateUtc ? "rounded-full ring-1 ring-astro-gold/50" : undefined}
              />
              <p className="mt-3 text-sm font-medium text-astro-text">{item.phase}</p>
              <p className="mt-1 font-mono text-[11px] text-astro-muted">{item.dateDisplay}</p>
            </div>
          ))}
        </div>
      </AstroCard>

      <aside className="border-l-2 border-astro-gold/60 pl-5 sm:pl-6">
        <h2 className="font-display text-xl font-normal text-astro-text">Viewing advice</h2>
        <p className="mt-2 max-w-3xl text-sm leading-7 text-astro-muted">{trimAdvice(moon.beginnerExplanation)}</p>
      </aside>
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
