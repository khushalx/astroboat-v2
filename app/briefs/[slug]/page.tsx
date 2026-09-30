import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { getBriefCategory, getBriefSummary, formatBriefDate } from "@/components/briefs/brief-utils";
import { BriefImage } from "@/components/briefs/BriefImage";
import { DataBadge } from "@/components/ui/DataBadge";
import { SourceBadge } from "@/components/ui/SourceBadge";
import { getBriefBySlug, getLatestBriefs } from "@/services/briefs-service";
import { pageMetadata, absoluteUrl, breadcrumbSchema, safeJsonLd } from "@/lib/seo";
import { ShareButton, TrackedLink } from "@/components/analytics/EditorialActions";
import type { AstronomyBrief } from "@/lib/types";

type BriefDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function isIndexable(brief: AstronomyBrief) {
  return brief.quality === "original_analysis" && !brief.isFallback && Boolean(brief.author && brief.publishedAt && brief.summary.join(" ").length >= 160 && brief.originalUrl);
}

export async function generateMetadata({ params }: BriefDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const brief = await getBriefBySlug(slug);

  if (!brief) {
    return {
      title: "Brief Not Found | Astroboat",
      robots: { index: false, follow: false }
    };
  }

  return pageMetadata({
    title: brief.title,
    description: getBriefSummary(brief, 2),
    path: `/briefs/${brief.slug}`,
    noindex: !isIndexable(brief)
  });
}

export default async function BriefDetailPage({ params }: BriefDetailPageProps) {
  const { slug } = await params;
  const brief = await getBriefBySlug(slug);

  if (!brief) {
    notFound();
  }
  if (slug !== brief.slug) permanentRedirect(`/briefs/${brief.slug}`);

  const originalHref = getOriginalHref(brief.originalUrl);
  const relatedBriefs = (await getLatestBriefs()).filter((item) => item.slug !== brief.slug && item.tags.some((tag) => brief.tags.includes(tag))).slice(0, 3);
  const relatedGuide = brief.tags.some((tag) => /asteroid|near-earth/i.test(tag)) ? { href: "/guides/what-is-a-near-earth-object", label: "What is a near-Earth object?" } : null;

  return (
    <article className="mx-auto max-w-4xl pb-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbSchema([
        { name: "Home", path: "/" }, { name: "Briefs", path: "/briefs" }, { name: brief.title, path: `/briefs/${brief.slug}` }
      ])) }} />
      <nav aria-label="Breadcrumb" className="text-sm text-astro-muted"><Link href="/" className="hover:text-astro-text">Home</Link> / <Link href="/briefs" className="hover:text-astro-text">Briefs</Link> / {brief.title}</nav>

      <header className="mb-7 mt-8 sm:mt-10">
        <div className="flex flex-wrap items-center gap-2">
          <SourceBadge source={brief.source.name} />
          <DataBadge label={getBriefCategory(brief)} />
          <span className="font-mono text-xs text-astro-muted">{formatBriefDate(brief.publishedAt)}</span>
          <span className="text-xs text-astro-muted">{brief.readingTime}</span>
        </div>
        <h1 className="mt-5 font-display text-4xl font-normal leading-[1.08] tracking-[-0.025em] text-astro-text text-balance sm:text-5xl">{brief.title}</h1>
        <p className="mt-4 text-sm text-astro-muted">Source digest from {brief.source.name}. Published by the source {formatBriefDate(brief.publishedAt)}.</p>
        {brief.updatedAt ? <p className="mt-1 text-xs text-astro-muted">Updated by Astroboat {formatBriefDate(brief.updatedAt)}</p> : null}
        <ShareButton url={absoluteUrl(`/briefs/${brief.slug}`)} title={brief.title} />
      </header>

      <BriefImage
        src={brief.imageUrl}
        alt={brief.title}
        source={brief.source.name}
        category={getBriefCategory(brief)}
        tags={brief.tags}
        title={brief.title}
        featured
        className="!h-64 sm:!h-96"
      />

      <div className="mx-auto mt-10 max-w-[70ch]">
        {brief.takeaway ? <p className="mb-8 border-l-2 border-astro-gold pl-4 text-lg leading-8 text-astro-text">{brief.takeaway}</p> : null}
        <section className="pb-9">
          <h2 className="font-display text-2xl font-normal text-astro-text">Astroboat summary</h2>
          <div className="mt-4 space-y-4">
            {brief.summary.map((line) => (
              <p key={line} className="text-base leading-8 text-astro-muted">{line}</p>
            ))}
          </div>
        </section>

        <section className="border-t border-astro-border/70 py-9">
          <h2 className="font-display text-2xl font-normal text-astro-text">{brief.quality === "original_analysis" ? "Why it matters" : "Topic context"}</h2>
          <p className="mt-4 text-base leading-8 text-astro-muted">{brief.why}</p>
        </section>

        {brief.beginnerExplanation ? (
          <section className="border-t border-astro-border/70 py-9">
            <h2 className="font-display text-2xl font-normal text-astro-text">Beginner explanation</h2>
            <p className="mt-4 text-base leading-8 text-astro-muted">{brief.beginnerExplanation}</p>
          </section>
        ) : null}
        {brief.importantNumbers?.length ? <section className="border-t border-astro-border/70 py-9"><h2 className="font-display text-2xl text-astro-text">Important numbers</h2><ul className="mt-4 list-disc space-y-2 pl-5 text-astro-muted">{brief.importantNumbers.map((number) => <li key={number}>{number}</li>)}</ul></section> : null}
        {brief.context ? <section className="border-t border-astro-border/70 py-9"><h2 className="font-display text-2xl text-astro-text">Background</h2><p className="mt-4 leading-8 text-astro-muted">{brief.context}</p></section> : null}
        {brief.whatNext ? <section className="border-t border-astro-border/70 py-9"><h2 className="font-display text-2xl text-astro-text">What to watch next</h2><p className="mt-4 leading-8 text-astro-muted">{brief.whatNext}</p></section> : null}

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
            <TrackedLink event="original_source_clicked"
              href={originalHref}
              className="cosmic-primary mt-5 inline-flex min-h-11 items-center rounded-lg px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-astro-gold/40"
            >
              Read original source <span className="ml-2" aria-hidden="true">↗</span>
            </TrackedLink>
          ) : null}
        </footer>
        {(relatedGuide || relatedBriefs.length > 0) ? <aside className="mt-10 border-t border-astro-border pt-8"><h2 className="font-display text-2xl text-astro-text">Explore related astronomy</h2><ul className="mt-4 space-y-3 text-sm">{relatedGuide ? <li><Link href={relatedGuide.href} className="text-astro-blue hover:underline">{relatedGuide.label}</Link></li> : null}{relatedBriefs.map((item) => <li key={item.slug}><Link href={`/briefs/${item.slug}`} className="text-astro-blue hover:underline">{item.title}</Link></li>)}</ul></aside> : null}
      </div>
    </article>
  );
}

function getOriginalHref(value: string) {
  const href = value.trim();

  return href && href !== "#" ? href : undefined;
}
