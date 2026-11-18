import Link from "next/link";
import { ArrowIcon } from "@/components/ui/ArrowIcon";
import { EarthScene } from "@/components/visuals/EarthScene";
import { MoonPhaseVisual } from "@/components/visuals/MoonPhaseVisual";
import { NavIcon } from "@/components/layout/NavIcon";
import type { MoonData, SpaceEvent } from "@/lib/types";

type HeroProps = { moon: MoonData; nextEvent: SpaceEvent | null };

export function Hero({ moon, nextEvent }: HeroProps) {
  return (
    <>
      <section className="discovery-hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow hero-eyebrow"><span className="h-1.5 w-1.5 rounded-full bg-astro-gold" />A field guide to the universe</p>
          <h1 id="hero-title" className="discovery-title">The universe,<br /><em>a little closer.</em></h1>
          <p className="hero-description">Extraordinary images, the stories behind the science, and a clearer view of your night sky.</p>
          <div className="hero-actions">
            <Link href="#explore" className="cosmic-primary hero-button">Start exploring<ArrowIcon /></Link>
            <Link href="/briefs" className="hero-secondary">Read the latest briefs<ArrowIcon diagonal /></Link>
          </div>
          <div className="hero-source-note">
            <p>Grounded in science. Open to everyone.<br /><Link href="/data-sources">NASA · ESA · Research & observatories <span aria-hidden="true">↗</span></Link></p>
          </div>
        </div>
        <EarthScene />
      </section>

      <section className="sky-snapshot" aria-label="Your sky at a glance">
        <div className="snapshot-heading">
          <span className="eyebrow">The observatory</span>
          <span className="snapshot-location"><svg width="13" height="15" viewBox="0 0 16 20" fill="none" aria-hidden="true"><path d="M14 8c0 4-6 10-6 10S2 12 2 8a6 6 0 1 1 12 0Z" stroke="currentColor" strokeWidth="1.4" /><circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.4" /></svg>{moon.locationName}</span>
        </div>
        <Link href="/moon" className="snapshot-item snapshot-moon">
          {!moon.isFallback && <MoonPhaseVisual phaseName={moon.phaseName} illuminationPercent={moon.illuminationPercent} size="sm" />}
          <div><span className="snapshot-label">{moon.isFallback ? "Moon · data unavailable" : `Moon · ${moon.date}`}</span><strong>{moon.isFallback ? "Awaiting lunar data" : moon.phaseName}</strong><span className="snapshot-detail">{moon.isFallback ? "Check the lunar observatory" : `${moon.illuminationPercent}% illuminated`}</span></div>
          <ArrowIcon diagonal className="snapshot-arrow" />
        </Link>
        <Link href="/events" className="snapshot-item">
          <span className="snapshot-icon"><NavIcon label="Events" className="h-5 w-5" /></span>
          <div className="min-w-0"><span className="snapshot-label">{nextEvent?.source === "Mock" ? "Event calendar · sample data" : "Next on the horizon"}</span><strong className="line-clamp-1">{nextEvent?.title ?? "Find your next space event"}</strong><span className="snapshot-detail line-clamp-1">{nextEvent?.dateDisplay ?? "Explore the event calendar"}</span></div>
          <ArrowIcon diagonal className="snapshot-arrow" />
        </Link>
      </section>
    </>
  );
}
