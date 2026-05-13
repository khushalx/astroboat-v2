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
    <AstroCard as="article" className="flex h-full flex-col p-4 sm:p-5" interactive>
      <div className="flex flex-wrap items-center gap-2">
        <SourceBadge source={brief.source.name} />
        <DataBadge label={category} />
        <span className="font-mono text-xs text-astro-muted">{formatBriefDate(brief.publishedAt)}</span>
        <span className="font-mono text-xs text-astro-muted">{brief.readingTime}</span>
      </div>

      <Link href={`/briefs/${brief.slug}`} className="group mt-4 block focus:outline-none focus:ring-2 focus:ring-astro-blue/40">
        <h2 className="line-clamp-2 text-lg font-semibold leading-7 text-astro-text transition group-hover:text-astro-blue">{brief.title}</h2>
      </Link>
      <p className="mt-3 line-clamp-2 text-sm leading-6 text-astro-muted">{getBriefSummary(brief, 1)}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {brief.tags.slice(0, 4).map((tag) => (
          <span key={tag} className="rounded-full border border-astro-border bg-astro-bg/30 px-2.5 py-1 text-xs text-astro-muted">
            {tag}
          </span>
        ))}
      </div>

      {originalHref ? (
        <div className="mt-auto flex flex-col gap-3 pt-5 sm:flex-row">
          <Link
            href={originalHref}
            target={originalHref.startsWith("http") ? "_blank" : undefined}
            rel={originalHref.startsWith("http") ? "noopener noreferrer" : undefined}
            className="inline-flex justify-center rounded-md border border-astro-border bg-astro-bg/20 px-3 py-2 text-sm font-medium text-astro-text transition hover:border-astro-blue/45 hover:text-astro-blue focus:outline-none focus:ring-2 focus:ring-astro-blue/40"
          >
            Read original
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
