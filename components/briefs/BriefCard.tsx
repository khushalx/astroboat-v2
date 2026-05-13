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
    <AstroCard as="article" className="flex h-full flex-col p-6 sm:p-7" interactive>
      <div className="flex flex-wrap items-center gap-2">
        <SourceBadge source={brief.source.name} />
        <DataBadge label={category} />
        <span className="font-mono text-xs text-astro-muted">{formatBriefDate(brief.publishedAt)}</span>
        <span className="font-mono text-xs text-astro-muted">{brief.readingTime}</span>
      </div>

      <Link href={`/briefs/${brief.slug}`} className="group mt-5 block focus:outline-none focus:ring-2 focus:ring-astro-blue/40">
        <h2 className="text-xl font-semibold leading-8 text-astro-text transition group-hover:text-astro-blue">{brief.title}</h2>
      </Link>
      <p className="mt-4 text-base leading-8 text-astro-muted">{getBriefSummary(brief, 2)}</p>

      <div className="mt-6 rounded-lg border border-astro-border bg-astro-bg/35 p-4">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-astro-gold">Why it matters</p>
        <p className="mt-2 text-sm leading-7 text-astro-muted">{brief.why}</p>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {brief.tags.map((tag) => (
          <span key={tag} className="rounded-full border border-astro-border bg-astro-bg/30 px-2.5 py-1 text-xs text-astro-muted">
            {tag}
          </span>
        ))}
      </div>

      {originalHref ? (
        <div className="mt-auto flex flex-col gap-3 pt-6 sm:flex-row">
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
