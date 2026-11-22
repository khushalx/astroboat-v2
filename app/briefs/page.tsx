import { pageMetadata } from "@/lib/seo";
import { BriefsClient } from "@/components/briefs/BriefsClient";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { PageShell } from "@/components/ui/PageShell";
import { getAstronomyBriefs } from "@/services/briefs-service";

// Source feeds are cached for an hour; regenerate the page on the same cadence.
export const revalidate = 3600;

export const metadata = pageMetadata({
  title: 'Astronomy Briefs & Space Science Updates',
  description: 'Browse recent astronomy and space science updates with concise context and direct links to original sources.',
  path: '/briefs',
  noindex: false
})

export default async function BriefsPage() {
  const result = await getAstronomyBriefs();

  return (
    <PageShell>
      <PageHeader
        eyebrow="The latest dispatches"
        title="Astronomy briefs"
        subtitle="Concise astronomy and space-science updates from public sources, with links to the original reporting."
      />

      {result.isFallback ? (
        <div className="data-notice" role="status">
          Live brief sources are temporarily unavailable. Showing saved Astroboat sample briefs.
        </div>
      ) : null}

      {!result.isFallback && result.warnings.length > 0 ? (
        <div className="data-notice" role="status">
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
