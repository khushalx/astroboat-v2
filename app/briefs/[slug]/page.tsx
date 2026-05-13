import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBriefCategory, getBriefSummary, formatBriefDate } from "@/components/briefs/brief-utils";
import { AstroCard } from "@/components/ui/AstroCard";
import { DataBadge } from "@/components/ui/DataBadge";
import { SourceBadge } from "@/components/ui/SourceBadge";
import { getBriefBySlug, getLatestBriefs } from "@/services/briefs-service";

type BriefDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const briefs = await getLatestBriefs();

  return briefs.map((brief) => ({
    slug: brief.slug
  }));
}

export async function generateMetadata({ params }: BriefDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const brief = await getBriefBySlug(slug);

  if (!brief) {
    return {
      title: "Brief Not Found — Astroboat"
    };
  }

  return {
    title: `${brief.title} — Astroboat Briefs`,
    description: getBriefSummary(brief, 2)
  };
}

export default async function BriefDetailPage({ params }: BriefDetailPageProps) {
  const { slug } = await params;
  const brief = await getBriefBySlug(slug);

  if (!brief) {
    notFound();
  }

  const originalHref = getOriginalHref(brief.originalUrl);

  return (
    <article className="mx-auto max-w-3xl space-y-6">
      <Link
        href="/briefs"
        className="inline-flex rounded-md border border-astro-border px-3 py-2 text-sm text-astro-muted transition hover:border-astro-blue/45 hover:text-astro-blue focus:outline-none focus:ring-2 focus:ring-astro-blue/40"
      >
        Back to Briefs
      </Link>

      <header>
        <div className="flex flex-wrap items-center gap-2">
          <SourceBadge source={brief.source.name} />
          <DataBadge label={getBriefCategory(brief)} />
          <span className="font-mono text-xs text-astro-muted">{formatBriefDate(brief.publishedAt)}</span>
          <span className="font-mono text-xs text-astro-muted">{brief.readingTime}</span>
        </div>
        <h1 className="mt-5 text-3xl font-semibold leading-tight text-astro-text sm:text-4xl">{brief.title}</h1>
      </header>

      <AstroCard className="p-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-astro-gold">Astroboat summary</p>
        <div className="mt-4 space-y-4">
          {brief.summary.map((line) => (
            <p key={line} className="text-base leading-8 text-astro-muted">{line}</p>
          ))}
        </div>
      </AstroCard>

      <AstroCard className="p-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-astro-gold">Why it matters</p>
        <p className="mt-4 text-base leading-8 text-astro-muted">{brief.why}</p>
      </AstroCard>

      {brief.beginnerExplanation ? (
        <AstroCard className="p-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-astro-gold">Beginner explanation</p>
          <p className="mt-4 text-base leading-8 text-astro-muted">{brief.beginnerExplanation}</p>
        </AstroCard>
      ) : null}

      <AstroCard className="p-6">
        <div className="flex flex-wrap gap-2">
          {brief.tags.map((tag) => (
            <span key={tag} className="rounded-full border border-astro-border px-2.5 py-1 text-xs text-astro-muted">
              {tag}
            </span>
          ))}
        </div>
        <p className="mt-5 text-sm leading-7 text-astro-muted">
          Read the original source for the complete article or paper.
        </p>
        {originalHref ? (
          <Link
            href={originalHref}
            target={originalHref.startsWith("http") ? "_blank" : undefined}
            rel={originalHref.startsWith("http") ? "noopener noreferrer" : undefined}
            className="mt-5 inline-flex rounded-md border border-astro-gold/45 bg-astro-gold/10 px-4 py-3 text-sm font-semibold text-astro-text transition hover:bg-astro-gold/15 focus:outline-none focus:ring-2 focus:ring-astro-gold/45"
          >
            Read original source
          </Link>
        ) : null}
      </AstroCard>
    </article>
  );
}

function getOriginalHref(value: string) {
  const href = value.trim();

  return href && href !== "#" ? href : undefined;
}
