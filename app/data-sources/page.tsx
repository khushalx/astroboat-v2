import type { Metadata } from "next";
import { AstroCard } from "@/components/ui/AstroCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { PageShell } from "@/components/ui/PageShell";

const sources = [
  {
    name: "NASA",
    use: "Astronomy updates, mission news, and Astronomy Picture of the Day."
  },
  {
    name: "ESA",
    use: "Space mission updates and European space science news."
  },
  {
    name: "arXiv",
    use: "Astronomy and astrophysics research preprints."
  },
  {
    name: "USNO",
    use: "Moon phase, illumination, moonrise, moonset, and related lunar data."
  },
  {
    name: "JPL SBDB",
    use: "Near-Earth object close-approach data from the Small-Body Database."
  },
  {
    name: "The Space Devs",
    use: "Launches and spaceflight event data from Launch Library 2."
  },
  {
    name: "Groq",
    use: "Astroboat Assistant responses and astronomy explanations."
  }
];

export const metadata: Metadata = {
  title: "Data Sources — Astroboat",
  description: "Review the public astronomy data sources and AI services used by Astroboat."
};

export default function DataSourcesPage() {
  return (
    <PageShell className="max-w-4xl">
      <PageHeader
        eyebrow="Sources"
        title="Data Sources"
        subtitle="Astroboat uses public astronomy sources and clearly links back whenever possible."
      />

      <AstroCard as="article" className="divide-y divide-astro-border/70 p-0">
        <dl className="divide-y divide-astro-border/60 px-5 sm:px-7">
          {sources.map((source) => (
            <div key={source.name} className="grid gap-1 py-4 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-6 sm:py-5">
              <dt className="font-semibold text-astro-text">{source.name}</dt>
              <dd className="text-sm leading-6 text-astro-muted">{source.use}</dd>
            </div>
          ))}
        </dl>

        <section className="p-5 sm:p-7">
          <h2 className="font-display text-2xl font-normal text-astro-text">Source transparency</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-astro-muted">
            Astroboat links back to original sources whenever possible and does not republish full articles. Briefs
            are designed as short summaries or context cards that encourage readers to open the original source for
            complete details.
          </p>
        </section>
      </AstroCard>
    </PageShell>
  );
}
