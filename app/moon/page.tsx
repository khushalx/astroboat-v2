import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/ui/PageHeader";
import { PageShell } from "@/components/ui/PageShell";
import { EmptyState } from "@/components/ui/EmptyState";
import { MoonPhaseVisual } from "@/components/visuals/MoonPhaseVisual";
import type { PrimaryMoonPhase } from "@/lib/types";
import { getCurrentMoonData } from "@/services/moon-service";

export const revalidate = 900;
export const metadata = pageMetadata({
  title: "Today's Moon Phase, Illumination & Rise Times",
  description: "See the current Moon phase and illumination, rise and set times for Ahmedabad, and the next full and new Moon.",
  path: "/moon"
});

export default async function MoonPage() {
  const moon = await getCurrentMoonData();
  const milestones = moon.upcomingPhases.filter((phase) => Date.parse(phase.dateUtc) >= Date.now());
  const metricCards = [
    ["Moonrise · IST", moon.moonrise ?? "No rise time returned"],
    ["Moonset · IST", moon.moonset ?? "No set time returned"],
    ["Next full Moon · UTC", moon.nextFullMoon?.dateDisplay ?? "Unavailable"],
    ["Next new Moon · UTC", moon.nextNewMoon?.dateDisplay ?? "Unavailable"]
  ];
  return (
    <PageShell>
      <PageHeader eyebrow="The lunar observatory" title="Tonight’s Moon" subtitle="Follow the light. Find your next observing window, with lunar conditions for Ahmedabad, India." />
      <div className="feed-meta">
        <p>{moon.locationName} · Rise & set times in IST (UTC+05:30)</p>
        <p>Conditions for <time dateTime={moon.date}>{moon.date}</time> · <Link className="text-link" href="/data-sources">USNO</Link></p>
      </div>
      {moon.isFallback ? (
        <div className="data-notice" role="status">Current Moon data is unavailable. Phase, illumination, and rise/set times are withheld until the source responds. Available lunar milestones are shown below.</div>
      ) : (
        <section className="moon-dashboard" aria-label="Lunar conditions">
          <div className="moon-feature">
            <MoonPhaseVisual phaseName={moon.phaseName} illuminationPercent={moon.illuminationPercent} size="lg" className="scale-125" />
            <p className="absolute bottom-5 text-[11px] text-astro-muted">Phase illustration · Northern hemisphere orientation</p>
          </div>
          <div className="moon-readout">
            <p className="eyebrow">{moon.phaseName}</p>
            <p className="moon-value">{moon.illuminationPercent}<span className="ml-1 text-4xl">%</span></p>
            <p className="text-sm text-astro-muted">of the visible lunar disc illuminated</p>
            <p className="mt-5 max-w-md text-sm leading-7 text-astro-muted">{moon.viewingAdvice}</p>
          </div>
        </section>
      )}
      <dl className="moon-facts">
        {metricCards.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
      </dl>
      <section aria-labelledby="lunar-cycle-title">
        <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="lunar-cycle-title" className="font-display text-3xl">The next lunar milestones</h2>
          <p className="text-xs text-astro-muted">Primary phases · All dates in UTC</p>
        </div>
        {milestones.length ? <div className="lunar-cycle">
          {milestones.map((item) => <div key={item.dateUtc}>
            <MoonPhaseVisual phaseName={item.phase} illuminationPercent={phaseIllumination(item.phase)} size="sm" />
            <h3 className="mt-3 text-sm font-medium">{item.phase}</h3>
            <time dateTime={item.dateUtc} className="mt-1 text-xs leading-6 text-astro-muted">{item.dateDisplay}</time>
          </div>)}
        </div> : <EmptyState title="Lunar milestones unavailable" description="USNO’s phase calendar could not be loaded. No estimated or sample dates are substituted." />}
      </section>
      <aside className="context-panel">
        <h2 className="font-display text-2xl">A little lunar context</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-astro-muted">{moon.beginnerExplanation}</p>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-astro-muted [&_a]:text-astro-blue [&_a]:underline">Rise and set times apply to the displayed location and date. A missing time means the source returned no rise or set for that civil day. Explore <Link href="/guides/why-moon-visible-during-day">the daytime Moon</Link> or <Link href="/guides/what-is-a-blue-moon">the meaning of a blue Moon</Link>.</p>
      </aside>
    </PageShell>
  );
}
function phaseIllumination(phase: PrimaryMoonPhase) {
  return phase === "New Moon" ? 0 : phase === "Full Moon" ? 100 : 50;
}
