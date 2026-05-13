import type { Metadata } from "next";
import { BriefsClient } from "@/components/briefs/BriefsClient";
import { AstroCard } from "@/components/ui/AstroCard";
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
    images: ["/opengraph-image"]
  }
};

export default async function BriefsPage() {
  const result = await getAstronomyBriefs();

  return (
    <PageShell>
      <PageHeader
        title="Astronomy Briefs"
        subtitle="Fresh astronomy and space science updates from trusted public sources."
      />

      <AstroCard className="mission-surface p-4 sm:p-5">
        <p className="max-w-3xl text-sm leading-6 text-astro-muted sm:text-base sm:leading-7">
          Astroboat reads public RSS/API updates, keeps summaries short, and always links back to the original source.
        </p>
        <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.18em] text-astro-muted">
          No full article copying / no article-page scraping
        </p>
      </AstroCard>

      {result.isFallback ? (
        <div className="rounded-lg border border-astro-gold/35 bg-astro-gold/10 p-4 text-sm leading-6 text-astro-text">
          Live brief sources are temporarily unavailable. Showing saved Astroboat sample briefs.
        </div>
      ) : null}

      {!result.isFallback && result.warnings.length > 0 ? (
        <div className="rounded-lg border border-astro-border bg-astro-surface/70 p-3 text-sm text-astro-muted">
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
