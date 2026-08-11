import type { Metadata } from "next";
import { BriefsClient } from "@/components/briefs/BriefsClient";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { PageShell } from "@/components/ui/PageShell";
import { getAstronomyBriefs } from "@/services/briefs-service";

export const metadata: Metadata = {
  title: "Astronomy Briefs",
  description: "Read concise astronomy summaries from trusted space science sources, with links back to the original updates.",
  alternates: {
    canonical: "/briefs"
  },
  openGraph: {
    title: "Astronomy Briefs — Astroboat",
    description: "Read concise astronomy summaries from trusted space science sources, with links back to the original updates.",
    url: "/briefs",
    images: ["/og-image.png"]
  }
};

export default async function BriefsPage() {
  const result = await getAstronomyBriefs();

  return (
    <PageShell>
      <PageHeader
        title="Briefs"
        subtitle="Concise astronomy and space-science updates from public sources, with links to the original reporting."
      />

      {result.isFallback ? (
        <div className="rounded-lg border border-astro-gold/25 bg-astro-gold/[0.06] p-4 text-sm leading-6 text-astro-text">
          Live brief sources are temporarily unavailable. Showing saved Astroboat sample briefs.
        </div>
      ) : null}

      {!result.isFallback && result.warnings.length > 0 ? (
        <div className="rounded-lg border border-astro-border/70 bg-white/[0.018] p-4 text-sm text-astro-muted">
          {result.warnings[0]}
        </div>
      ) : null}

      {result.briefs.length > 0 ? (
        <BriefsClient result={result} />
      ) : (
        <EmptyState title="No briefs available" description="New summaries will appear here when source updates are available." />
      )}
    </PageShell>
  );
}
