import Link from "next/link";
import { BriefImage } from "@/components/briefs/BriefImage";
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
    <article className="group grid min-h-36 grid-cols-[6.5rem_minmax(0,1fr)] gap-4 p-3 transition-colors hover:bg-white/[0.018] sm:grid-cols-[10rem_minmax(0,1fr)] sm:p-4">
      <BriefImage
        src={brief.imageUrl}
        alt={`${brief.title} source image`}
        source={brief.source.name}
        category={category}
        tags={brief.tags}
        title={brief.title}
        className="!h-full min-h-28"
      />

      <div className="flex min-w-0 flex-col">
        <div className="flex flex-wrap items-center gap-2">
          <SourceBadge source={brief.source.name} />
          <DataBadge label={category} />
          <span className="font-mono text-[11px] text-[color:var(--text-dim)] sm:ml-auto">{formatBriefDate(brief.publishedAt)}</span>
        </div>

        <Link href={`/briefs/${brief.slug}`} className="mt-3 block focus:outline-none focus:ring-2 focus:ring-astro-blue/35">
          <h2 className="line-clamp-2 font-display text-lg font-normal leading-6 tracking-[-0.01em] text-astro-text transition group-hover:text-astro-blue sm:text-xl sm:leading-7">{brief.title}</h2>
        </Link>
        <p className="mt-1.5 hidden line-clamp-2 text-sm leading-6 text-astro-muted sm:block">{getBriefSummary(brief, 1)}</p>

        {originalHref ? (
          <Link
            href={originalHref}
            target={originalHref.startsWith("http") ? "_blank" : undefined}
            rel={originalHref.startsWith("http") ? "noopener noreferrer" : undefined}
            className="mt-auto w-fit pt-3 text-xs font-medium text-astro-blue transition hover:text-astro-text focus:outline-none focus:ring-2 focus:ring-astro-blue/35"
          >
            Original source <span aria-hidden="true">↗</span>
          </Link>
        ) : null}
      </div>
    </article>
  );
}

function getOriginalHref(value: string) {
  const href = value.trim();

  return href && href !== "#" ? href : undefined;
}
