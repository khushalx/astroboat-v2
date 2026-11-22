import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { PageShell } from "@/components/ui/PageShell";
import { EmptyState } from "@/components/ui/EmptyState";
import { MoonPhaseVisual } from "@/components/visuals/MoonPhaseVisual";
import { MoonObservatory } from "@/components/moon/MoonObservatory";
import type { PrimaryMoonPhase } from "@/lib/types";
import { getCurrentMoonData } from "@/services/moon-service";
import styles from "@/components/moon/moon.module.css";

export const revalidate = 900;
export const metadata = pageMetadata({
  title: "Today's Moon Phase, Illumination & Rise Times",
  description: "Explore the Moon in 3D with NASA surface maps, today's phase, illumination, rise and set times for Ahmedabad, and upcoming lunar milestones.",
  path: "/moon"
});

export default async function MoonPage() {
  const moon = await getCurrentMoonData();
  const milestones = moon.upcomingPhases.filter((phase) => Date.parse(phase.dateUtc) >= Date.now());
  const facts = [
    { label: "Moonrise / IST", value: moon.moonrise ?? (moon.isFallback ? "Unavailable" : "No rise time returned") },
    { label: "Moonset / IST", value: moon.moonset ?? (moon.isFallback ? "Unavailable" : "No set time returned") },
    { label: "Next full Moon / UTC", value: moon.nextFullMoon?.dateDisplay ?? "Unavailable", iso: moon.nextFullMoon?.dateUtc },
    { label: "Next new Moon / UTC", value: moon.nextNewMoon?.dateDisplay ?? "Unavailable", iso: moon.nextNewMoon?.dateUtc }
  ];
  return <PageShell>
    {moon.isFallback && <div className="data-notice" role="status">USNO daily conditions are unavailable. The observatory shows a labeled calculated simulation, not a live measurement. Rise/set times remain unavailable; any returned lunar milestones are preserved.</div>}
    <MoonObservatory moon={moon} />
    <section className={styles.conditions} aria-labelledby="moon-conditions-title">
      <div className={styles.sectionHeading}>
        <h2 id="moon-conditions-title">Your observing window</h2>
        <p>{moon.locationName} / <time dateTime={moon.date}>{moon.date}</time><br />Rise &amp; set: IST (UTC+05:30) / <Link className="text-link" href="/data-sources">USNO</Link></p>
      </div>
      <dl className={styles.facts}>{facts.map((fact) => <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.iso ? <time dateTime={fact.iso}>{fact.value}</time> : fact.value}</dd></div>)}</dl>
    </section>
    <section aria-labelledby="lunar-cycle-title">
      <div className={styles.sectionHeading}><h2 id="lunar-cycle-title">The next lunar milestones</h2><p>Primary phases / All event times in UTC</p></div>
      {milestones.length ? <ol className={styles.milestones}>
        {milestones.map((item) => <li key={item.dateUtc}>
          <MoonPhaseVisual phaseName={item.phase} illuminationPercent={phaseIllumination(item.phase)} size="sm" />
          <div><h3>{item.phase}</h3><time dateTime={item.dateUtc}>{item.dateDisplay}</time></div>
        </li>)}
      </ol> : <EmptyState title="Lunar milestones unavailable" description="USNO's phase calendar could not be loaded. No estimated or sample dates are substituted." />}
    </section>
    <aside className={styles.context}>
      <p>Rise and set times apply only to the location and USNO date above, not the simulation timeline. A missing time means the source returned no event for that civil day. Read about <Link href="/guides/why-moon-visible-during-day">the daytime Moon</Link> or <Link href="/guides/what-is-a-blue-moon">the meaning of a blue Moon</Link>.</p>
      <p>Surface imagery and relief: <a href="https://svs.gsfc.nasa.gov/4720/">NASA&apos;s Scientific Visualization Studio</a>, LRO / LROC / LOLA. Simulations: <a href="https://github.com/cosinekitty/astronomy">Astronomy Engine</a>.</p>
    </aside>
  </PageShell>;
}

function phaseIllumination(phase: PrimaryMoonPhase) {
  return phase === "New Moon" ? 0 : phase === "Full Moon" ? 100 : 50;
}
