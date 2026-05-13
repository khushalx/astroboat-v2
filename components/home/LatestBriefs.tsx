import { AstroCard } from "@/components/ui/AstroCard";
import { DataBadge } from "@/components/ui/DataBadge";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SourceBadge } from "@/components/ui/SourceBadge";
import type { AstronomyBrief } from "@/lib/types";

type LatestBriefsProps = {
  briefs: AstronomyBrief[];
};

export function LatestBriefs({ briefs }: LatestBriefsProps) {
  return (
    <section className="py-8">
      <SectionHeader
        title="Latest Astroboat Briefs"
        subtitle="Short astronomy updates rewritten for fast comprehension and beginner-friendly context."
        actionLabel="Open Briefs"
        actionHref="/briefs"
      />
      <div className="grid gap-4 lg:grid-cols-3">
        {briefs.map((brief) => (
          <AstroCard key={brief.id} as="article" className="p-5 sm:p-6" interactive>
            <div className="mb-4 flex items-center justify-between gap-3">
              <SourceBadge source={brief.source.name} />
              <DataBadge label={brief.source.credibility} />
            </div>
            <h3 className="text-lg font-semibold leading-7 text-astro-text">{brief.title}</h3>
            <p className="mt-3 text-sm leading-6 text-astro-muted">{brief.summary[0]}</p>
            <p className="mt-4 border-l border-astro-gold/45 pl-3 text-sm leading-6 text-astro-muted">
              {brief.why}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {brief.tags.map((tag) => (
              <span key={tag} className="rounded-full border border-astro-border bg-astro-bg/30 px-2 py-1 text-xs text-astro-muted">
                {tag}
              </span>
              ))}
            </div>
          </AstroCard>
        ))}
      </div>
    </section>
  );
}
