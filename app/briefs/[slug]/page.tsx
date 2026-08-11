import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBriefCategory, getBriefSummary, formatBriefDate } from "@/components/briefs/brief-utils";
import { BriefImage } from "@/components/briefs/BriefImage";
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
    <article className="mx-auto max-w-4xl pb-10">
      <Link
        href="/briefs"
        className="inline-flex items-center text-sm text-astro-muted transition hover:text-astro-text focus:outline-none focus:ring-2 focus:ring-astro-blue/35"
      >
        <span className="mr-2" aria-hidden="true">←</span> Back to Briefs
      </Link>

      <header className="mb-7 mt-8 sm:mt-10">
        <div className="flex flex-wrap items-center gap-2">
          <SourceBadge source={brief.source.name} />
          <DataBadge label={getBriefCategory(brief)} />
          <span className="font-mono text-xs text-astro-muted">{formatBriefDate(brief.publishedAt)}</span>
          <span className="text-xs text-astro-muted">{brief.readingTime}</span>
        </div>
        <h1 className="mt-5 font-display text-4xl font-normal leading-[1.08] tracking-[-0.025em] text-astro-text text-balance sm:text-5xl">{brief.title}</h1>
      </header>

      <BriefImage
        src={brief.imageUrl}
        alt={`${brief.title} source image`}
        source={brief.source.name}
        category={getBriefCategory(brief)}
        tags={brief.tags}
        title={brief.title}
        featured
        className="!h-64 sm:!h-96"
      />

      <div className="mx-auto mt-10 max-w-[70ch]">
        <section className="pb-9">
          <h2 className="font-display text-2xl font-normal text-astro-text">Astroboat summary</h2>
          <div className="mt-4 space-y-4">
            {brief.summary.map((line) => (
              <p key={line} className="text-base leading-8 text-astro-muted">{line}</p>
            ))}
          </div>
        </section>

        <section className="border-t border-astro-border/70 py-9">
          <h2 className="font-display text-2xl font-normal text-astro-text">Why it matters</h2>
          <p className="mt-4 text-base leading-8 text-astro-muted">{brief.why}</p>
        </section>

        {brief.beginnerExplanation ? (
          <section className="border-t border-astro-border/70 py-9">
            <h2 className="font-display text-2xl font-normal text-astro-text">Beginner explanation</h2>
            <p className="mt-4 text-base leading-8 text-astro-muted">{brief.beginnerExplanation}</p>
          </section>
        ) : null}

        <footer className="border-t border-astro-border/70 pt-8">
          <div className="flex flex-wrap gap-2">
            {brief.tags.map((tag) => (
              <span key={tag} className="rounded-md border border-astro-border/80 bg-white/[0.02] px-2 py-1 text-xs text-astro-muted">
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
              className="cosmic-primary mt-5 inline-flex min-h-11 items-center rounded-lg px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-astro-gold/40"
            >
              Read original source <span className="ml-2" aria-hidden="true">↗</span>
            </Link>
          ) : null}
        </footer>
      </div>
    </article>
  );
}

function getOriginalHref(value: string) {
  const href = value.trim();

  return href && href !== "#" ? href : undefined;
}
