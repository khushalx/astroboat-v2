import Link from "next/link";
import { BriefImage } from "@/components/briefs/BriefImage";
import { AstroCard } from "@/components/ui/AstroCard";
import type { AstronomyBrief } from "@/lib/types";
import { formatBriefDate, getBriefCategory, getBriefSummary } from "@/components/briefs/brief-utils";
import { TrackedLink } from "@/components/analytics/EditorialActions";

type FeaturedBriefCardProps = {
  brief: AstronomyBrief;
};

export function FeaturedBriefCard({ brief }: FeaturedBriefCardProps) {
  const originalHref = getOriginalHref(brief.originalUrl);
  const category = getBriefCategory(brief);

  return (
    <AstroCard as="article" className="brief-feature group p-0">
      <div className="grid lg:grid-cols-[0.95fr_1.05fr]">
        <BriefImage
          src={brief.imageUrl}
          alt={brief.title}
          source={brief.source.name}
          category={category}
          tags={brief.tags}
          title={brief.title}
          featured
          className="!h-56 !rounded-none !border-0 lg:!h-full lg:min-h-80"
        />

        <div className="flex flex-col p-5 sm:p-7">
          <div className="flex flex-wrap items-center gap-2">
            <span className="eyebrow text-astro-gold">{brief.source.name} · {category}</span>
            <span className="font-mono text-xs text-astro-muted">{formatBriefDate(brief.publishedAt)}</span>
          </div>

          <Link href={`/briefs/${brief.slug}`} className="mt-5 block focus:outline-none focus:ring-2 focus:ring-astro-blue/35">
            <h2 className="font-display text-2xl font-normal leading-tight tracking-[-0.02em] text-astro-text transition group-hover:text-astro-blue sm:text-3xl">
              {brief.title}
            </h2>
          </Link>
          <p className="mt-3 line-clamp-3 text-sm leading-7 text-astro-muted">{getBriefSummary(brief, 1)}</p>

          <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-6">
            <Link href={`/briefs/${brief.slug}`} className="inline-flex min-h-11 items-center text-sm font-medium text-astro-blue hover:text-astro-text">Read summary →</Link>
            {originalHref ? (
              <TrackedLink event="original_source_clicked"
                href={originalHref}
                className="inline-flex min-h-11 items-center text-sm text-astro-muted hover:text-astro-text"
              >
                Original source ↗
              </TrackedLink>
            ) : null}
          </div>
        </div>
      </div>
    </AstroCard>
  );
}

function getOriginalHref(value: string) {
  const href = value.trim();

  return href && href !== "#" ? href : undefined;
}
