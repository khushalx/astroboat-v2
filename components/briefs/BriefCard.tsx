import Link from "next/link";
import { BriefImage } from "@/components/briefs/BriefImage";
import type { AstronomyBrief } from "@/lib/types";
import { formatBriefDate, getBriefCategory, getBriefSummary } from "@/components/briefs/brief-utils";
import { TrackedLink } from "@/components/analytics/EditorialActions";

type BriefCardProps = {
  brief: AstronomyBrief;
};

export function BriefCard({ brief }: BriefCardProps) {
  const category = getBriefCategory(brief);
  const originalHref = getOriginalHref(brief.originalUrl);

  return (
    <article className="brief-row group">
      <BriefImage
        src={brief.imageUrl}
        alt={brief.title}
        source={brief.source.name}
        category={category}
        tags={brief.tags}
        title={brief.title}
        className="!h-28 sm:!h-32 !rounded-md"
      />

      <div className="flex min-w-0 flex-col">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-astro-blue">{brief.source.name}</span>
          <span className="font-mono text-[11px] text-[color:var(--text-dim)] sm:ml-auto">{formatBriefDate(brief.publishedAt)}</span>
        </div>

        <Link href={`/briefs/${brief.slug}`} className="mt-2 block focus:outline-none focus:ring-2 focus:ring-astro-blue/35">
          <h2 className="line-clamp-3 text-astro-text transition group-hover:text-astro-gold">{brief.title}</h2>
        </Link>
        <p className="mt-1.5 hidden line-clamp-2 text-sm leading-6 text-astro-muted sm:block">{getBriefSummary(brief, 1)}</p>

        {originalHref ? (
          <TrackedLink event="original_source_clicked"
            href={originalHref}
            className="mt-auto inline-flex min-h-11 w-fit items-center text-xs font-medium text-astro-blue transition hover:text-astro-text focus:outline-none focus:ring-2 focus:ring-astro-blue/35"
          >
            Original source <span aria-hidden="true">↗</span>
          </TrackedLink>
        ) : null}
      </div>
    </article>
  );
}

function getOriginalHref(value: string) {
  const href = value.trim();

  return href && href !== "#" ? href : undefined;
}
