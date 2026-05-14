import Link from "next/link";
import { AstroCard } from "@/components/ui/AstroCard";
import { DataBadge } from "@/components/ui/DataBadge";
import { SourceBadge } from "@/components/ui/SourceBadge";
import type { AstronomyBrief } from "@/lib/types";
import { formatBriefDate, getBriefCategory, getBriefSummary } from "@/components/briefs/brief-utils";

type BriefCardProps = {
  brief: AstronomyBrief;
};

export function BriefCard({ brief }: BriefCardProps) {
  const category = getBriefCategory(brief);
  const originalHref = getOriginalHref(brief.originalUrl);

  return (
    <AstroCard as="article" className="flex h-full flex-col p-3.5 sm:p-4" interactive>
      <div className="flex flex-wrap items-center gap-2">
        <SourceBadge source={brief.source.name} />
        <DataBadge label={category} />
        <span className="ml-auto font-mono text-[11px] text-[color:var(--text-dim)]">{formatBriefDate(brief.publishedAt)}</span>
      </div>

      <Link href={`/briefs/${brief.slug}`} className="group mt-3 block focus:outline-none focus:ring-2 focus:ring-astro-blue/40">
        <h2 className="line-clamp-2 text-base font-semibold leading-6 text-astro-text transition group-hover:text-astro-blue">{brief.title}</h2>
      </Link>
      <p className="mt-2 line-clamp-2 text-[13px] leading-6 text-astro-muted">{getBriefSummary(brief, 1)}</p>

      <div className="mt-3 flex flex-wrap gap-2">
        {brief.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="rounded-full border border-astro-border bg-[color:var(--accent-blue-muted)] px-2.5 py-1 text-xs text-astro-muted">
            {tag}
          </span>
        ))}
      </div>

      {originalHref ? (
        <div className="mt-auto flex justify-end pt-4">
          <Link
            href={originalHref}
            target={originalHref.startsWith("http") ? "_blank" : undefined}
            rel={originalHref.startsWith("http") ? "noopener noreferrer" : undefined}
            className="inline-flex min-h-11 items-center justify-center rounded-md border border-astro-border bg-astro-bg/20 px-3 py-2 text-sm font-medium text-astro-text transition hover:border-astro-blue/45 hover:text-astro-blue focus:outline-none focus:ring-2 focus:ring-astro-blue/40"
          >
            Read Original <span className="ml-1" aria-hidden="true">→</span>
          </Link>
        </div>
      ) : null}
    </AstroCard>
  );
}

function getOriginalHref(value: string) {
  const href = value.trim();

  return href && href !== "#" ? href : undefined;
}
