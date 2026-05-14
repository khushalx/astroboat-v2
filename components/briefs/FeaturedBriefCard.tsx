import Link from "next/link";
import { BriefImage } from "@/components/briefs/BriefImage";
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
  const category = getBriefCategory(brief);

  return (
    <AstroCard as="article" className="p-4 sm:p-5">
      <BriefImage
        src={brief.imageUrl}
        alt={`${brief.title} source image`}
        source={brief.source.name}
        category={category}
        tags={brief.tags}
        title={brief.title}
        featured
        className="mb-4"
      />

      <div className="flex flex-wrap items-center gap-2">
        <SourceBadge source={brief.source.name} />
        <DataBadge label={category} />
        <span className="font-mono text-xs text-astro-muted">{formatBriefDate(brief.publishedAt)}</span>
      </div>

      <Link href={`/briefs/${brief.slug}`} className="group mt-4 block focus:outline-none focus:ring-2 focus:ring-astro-blue/40">
        <h2 className="line-clamp-2 text-xl font-semibold leading-tight text-astro-text transition group-hover:text-astro-blue sm:text-2xl">
          {brief.title}
        </h2>
      </Link>
      <p className="mt-3 line-clamp-2 max-w-4xl text-sm leading-6 text-astro-muted">{getBriefSummary(brief, 1)}</p>

      <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {brief.tags.slice(0, 3).map((tag) => (
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
            className="inline-flex min-h-11 justify-center rounded-md border border-astro-gold bg-astro-gold px-4 py-2.5 text-sm font-semibold text-astro-bg transition hover:bg-astro-text focus:outline-none focus:ring-2 focus:ring-astro-gold/45"
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
