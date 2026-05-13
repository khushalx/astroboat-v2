import type { Metadata } from "next";
import { BriefsClient } from "@/components/briefs/BriefsClient";
import { AstroCard } from "@/components/ui/AstroCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { PageShell } from "@/components/ui/PageShell";
import { getLatestBriefs } from "@/services/briefs-service";

export const metadata: Metadata = {
  title: "Astronomy Briefs — Astroboat",
  description: "Read short, beginner-friendly summaries of astronomy updates, research papers, and space science stories."
};

export default async function BriefsPage() {
  const briefs = await getLatestBriefs();
  const isFallback = briefs.some((brief) => brief.isFallback);

  return (
    <PageShell>
      <PageHeader
        title="Astronomy Briefs"
        subtitle="Short, clear summaries of trusted astronomy updates, research papers, and space science stories."
      />

      <AstroCard className="p-5">
        <p className="max-w-3xl text-base leading-8 text-astro-muted">
          Astroboat collects public RSS/API updates from sources like NASA, ESA, arXiv, and APOD, then turns them into
          beginner-friendly reading cards with original source links.
        </p>
        <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.18em] text-astro-muted">
          Source summaries point back to the original publisher. Read the original source for complete context and rights information.
        </p>
      </AstroCard>

      {isFallback ? (
        <div className="rounded-lg border border-astro-gold/35 bg-astro-gold/10 p-4 text-sm leading-6 text-astro-text">
          Live brief sources are temporarily unavailable. Showing saved Astroboat sample briefs.
        </div>
      ) : null}

      {briefs.length > 0 ? (
        <BriefsClient briefs={briefs} />
      ) : (
        <EmptyState title="No briefs available" description="New summaries will appear here when source updates are available." />
      )}
    </PageShell>
  );
}
