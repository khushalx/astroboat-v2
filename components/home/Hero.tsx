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
    <section className="grid gap-8 pb-12 pt-3 lg:grid-cols-[minmax(0,1fr)_minmax(25rem,0.9fr)] lg:items-center lg:gap-12 lg:pb-16 lg:pt-6">
      <div>
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.1em] text-astro-gold">Astronomy, made clear</p>
        <h1 className="max-w-2xl font-display text-[2.65rem] font-normal leading-[1.04] tracking-[-0.035em] text-astro-text text-balance sm:text-5xl lg:text-[3.45rem]">
          A clearer view of what&apos;s happening in space.
        </h1>
        <p className="mt-5 max-w-xl text-base leading-8 text-astro-muted">
          Follow astronomy briefs, space events, the changing Moon, and near-Earth objects in one calm, source-linked place.
        </p>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/briefs"
            className="cosmic-primary inline-flex min-h-11 items-center justify-center rounded-lg px-5 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-astro-gold/40"
          >
            Read the latest briefs
          </Link>
          <Link
            href="/ask"
            className="cosmic-secondary inline-flex min-h-11 items-center justify-center rounded-lg px-5 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-astro-blue/35"
          >
            Ask Astroboat
          </Link>
        </div>
      </div>

      <AstroCard className="p-0">
        <div className="flex items-start justify-between gap-4 border-b border-astro-border/70 px-5 py-4 sm:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-astro-muted">Current Moon</p>
            <p className="mt-1 text-sm text-astro-text">{moon.locationName}</p>
          </div>
          <p className="font-mono text-xs text-astro-muted">{moon.date}</p>
        </div>

        <Link href="/moon" className="moon-feature group focus:outline-none focus:ring-2 focus:ring-inset focus:ring-astro-blue/35">
          <div className="relative z-10 text-center">
            <MoonPhaseVisual
              phaseName={moon.phaseName}
              illuminationPercent={moon.illuminationPercent}
              size="lg"
              className="transition duration-300 group-hover:scale-[1.02]"
            />
            <p className="mt-3 text-sm font-medium text-astro-text">{moon.phaseName}</p>
          </div>
        </Link>

        <div className="grid border-t border-astro-border/70 sm:grid-cols-2">
          <Link href="/moon" className="group p-4 transition hover:bg-white/[0.025] sm:border-r sm:border-astro-border/70 sm:px-5">
            <p className="text-xs text-astro-muted">Illumination</p>
            <p className="mt-1.5 font-mono text-lg text-astro-text">{moon.illuminationPercent}%</p>
          </Link>
          <Link href="/events" className="group border-t border-astro-border/70 p-4 transition hover:bg-white/[0.025] sm:border-t-0 sm:px-5">
            <p className="text-xs text-astro-muted">Next space event</p>
            <p className="mt-1.5 line-clamp-1 text-sm font-medium text-astro-text">{nextEvent?.title ?? "View the event calendar"}</p>
            <p className="mt-1 line-clamp-1 text-xs text-astro-muted">{nextEvent?.dateDisplay ?? "Upcoming events"}</p>
          </Link>
        </div>
      </AstroCard>
    </section>
  );
}
