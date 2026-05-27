import Link from "next/link";
import { AstroCard } from "@/components/ui/AstroCard";
import { MoonPhaseVisual } from "@/components/visuals/MoonPhaseVisual";
import type { MoonData, SpaceEvent } from "@/lib/types";

type HeroProps = {
  moon: MoonData;
  nextEvent: SpaceEvent | null;
};

export function Hero({ moon, nextEvent }: HeroProps) {
  return (
    <section className="grid gap-5 py-4 lg:grid-cols-[1.12fr_0.88fr] lg:items-center lg:py-7">
      <div>
        <p className="mb-3 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-astro-gold">
          <span className="h-px w-8 bg-astro-gold/70" aria-hidden="true" />
          Astroboat
        </p>
        <h1 className="font-display max-w-2xl text-4xl font-normal leading-tight text-astro-text text-balance sm:text-5xl lg:text-[3.4rem]">
          Understand space, simply.
        </h1>
        <p className="mt-4 max-w-[540px] text-sm leading-6 text-astro-muted sm:text-[15px] sm:leading-7">
          Explore space through simple astronomy updates, sky events, Moon data, and an AI astronomy assistant.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/briefs"
            className="inline-flex min-h-11 justify-center rounded-md border border-astro-gold bg-astro-gold px-4 py-3 text-sm font-semibold text-astro-bg transition hover:bg-astro-text focus:outline-none focus:ring-2 focus:ring-astro-gold/45"
          >
            Explore Briefs
          </Link>
          <Link
            href="/ask"
            className="inline-flex min-h-11 justify-center rounded-md border border-astro-blue/45 px-4 py-3 text-sm font-semibold text-astro-blue transition hover:border-astro-blue hover:text-astro-text focus:outline-none focus:ring-2 focus:ring-astro-blue/40"
          >
            Ask Astroboat
          </Link>
        </div>
      </div>

      <AstroCard className="p-3.5 sm:p-4">
        <div className="mb-3 border-b border-astro-border pb-2.5">
          <div>
            <h2 className="text-base font-semibold text-astro-text">Start with today’s sky</h2>
          </div>
        </div>

        <div className="space-y-2.5">
          <div className="flex items-center gap-3 rounded-lg border border-astro-border bg-astro-elevated p-3">
            <MoonPhaseVisual phaseName={moon.phaseName} illuminationPercent={moon.illuminationPercent} size="sm" className="shrink-0" />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-astro-text">Moon: {moon.phaseName}</p>
              <p className="mt-1 text-xs text-astro-muted">{moon.illuminationPercent}% illuminated</p>
            </div>
          </div>

          <div className="rounded-lg border border-astro-border bg-astro-elevated p-3">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-astro-blue/35 bg-astro-blue/10" aria-hidden="true">
                <span className="h-2 w-2 rounded-full bg-astro-blue" />
              </span>
              <div className="min-w-0">
                <p className="line-clamp-1 text-sm font-medium text-astro-text">{nextEvent?.title ?? "Next space event"}</p>
                <p className="mt-1 text-xs text-astro-muted">{nextEvent?.dateDisplay ?? "Event calendar available"}</p>
              </div>
            </div>
          </div>

          <Link
            href="/ask"
            className="flex items-center gap-3 rounded-lg border border-astro-border bg-astro-elevated p-3 transition hover:border-astro-blue/45 hover:bg-astro-blue/10 focus:outline-none focus:ring-2 focus:ring-astro-blue/25"
          >
            <span className="relative grid h-9 w-9 shrink-0 place-items-center rounded-full border border-astro-gold/35 bg-astro-gold/10" aria-hidden="true">
              <span className="h-2 w-2 rounded-full bg-astro-gold" />
              <span className="absolute h-px w-7 rotate-[-22deg] bg-astro-blue/50" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-medium text-astro-text">Ask Astroboat</p>
              <p className="mt-1 line-clamp-1 text-xs text-astro-muted">Try: “Why does the Moon change shape?”</p>
            </div>
          </Link>
        </div>
      </AstroCard>
    </section>
  );
}
