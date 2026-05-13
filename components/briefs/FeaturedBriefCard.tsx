import Link from "next/link";
import { AstroCard } from "@/components/ui/AstroCard";
import { DataBadge } from "@/components/ui/DataBadge";
import { SourceBadge } from "@/components/ui/SourceBadge";
import type { AstronomyBrief } from "@/lib/types";
import { formatBriefDate, getBriefCategory, getBriefSummary } from "@/components/briefs/brief-utils";

type FeaturedBriefCardProps = {
  brief: AstronomyBrief;
};

export function FeaturedBriefCard({ brief }: FeaturedBriefCardProps) {
  const originalHref = getOriginalHref(brief.originalUrl);

  return (
    <AstroCard as="article" className="p-6 sm:p-8">
      <div className="flex flex-wrap items-center gap-2">
        <SourceBadge source={brief.source.name} />
        <DataBadge label={getBriefCategory(brief)} />
        <span className="font-mono text-xs text-astro-muted">{formatBriefDate(brief.publishedAt)}</span>
      </div>

      <Link href={`/briefs/${brief.slug}`} className="group mt-5 block focus:outline-none focus:ring-2 focus:ring-astro-blue/40">
        <h2 className="text-2xl font-semibold leading-tight text-astro-text transition group-hover:text-astro-blue sm:text-3xl">
          {brief.title}
        </h2>
      </Link>
      <p className="mt-5 max-w-4xl text-base leading-8 text-astro-muted">{getBriefSummary(brief, 3)}</p>

      <div className="mt-6 rounded-lg border border-astro-border bg-astro-bg/35 p-4">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-astro-gold">Why it matters</p>
        <p className="mt-2 text-sm leading-7 text-astro-muted">{brief.why}</p>
      </div>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {brief.tags.map((tag) => (
            <span key={tag} className="rounded-full border border-astro-border bg-astro-bg/30 px-2.5 py-1 text-xs text-astro-muted">
              {tag}
            </span>
          ))}
        </div>
        {originalHref ? (
          <Link
            href={originalHref}
            target={originalHref.startsWith("http") ? "_blank" : undefined}
            rel={originalHref.startsWith("http") ? "noopener noreferrer" : undefined}
            className="inline-flex justify-center rounded-md border border-astro-gold/45 bg-astro-gold/10 px-4 py-3 text-sm font-semibold text-astro-text transition hover:bg-astro-gold/15 focus:outline-none focus:ring-2 focus:ring-astro-gold/45"
          >
            Read original
          </Link>
        ) : null}
      </div>
    </AstroCard>
  );
}

function getOriginalHref(value: string) {
  const href = value.trim();

  return href && href !== "#" ? href : undefined;
}
