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
    name: "Google Vertex AI / Gemini",
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

      <AstroCard className="p-5 sm:p-6">
        <div className="grid gap-3 sm:grid-cols-2">
          {sources.map((source) => (
            <div key={source.name} className="rounded-lg border border-astro-border bg-astro-elevated p-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-astro-gold">{source.name}</p>
              <p className="mt-2 text-sm leading-6 text-astro-muted">{source.use}</p>
            </div>
          ))}
        </div>
      </AstroCard>

      <AstroCard className="p-5 sm:p-6">
        <h2 className="text-lg font-semibold text-astro-text">Source Transparency</h2>
        <p className="mt-3 text-sm leading-7 text-astro-muted">
          Astroboat links back to original sources whenever possible and does not republish full articles. Briefs
          are designed as short summaries or context cards that encourage readers to open the original source for
          complete details.
        </p>
      </AstroCard>
    </PageShell>
  );
}
