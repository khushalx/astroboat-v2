import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ShareButton, TrackArticleOpen, TrackedLink } from "@/components/analytics/EditorialActions";
import { getPublishedGuide, publishedGuides } from "@/lib/guides";
import { absoluteUrl, breadcrumbSchema, pageMetadata, safeJsonLd } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return publishedGuides.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = getPublishedGuide(slug);
  if (!guide) return { robots: { index: false, follow: false } };
  const base = pageMetadata({
    title: guide.seoTitle ?? guide.title,
    description: guide.seoDescription ?? guide.description,
    path: `/guides/${slug}`,
    image: guide.ogImage ?? guide.heroImage?.src
  });
  return {
    ...base,
    openGraph: {
      ...base.openGraph,
      type: "article",
      publishedTime: guide.publishedAt,
      ...(guide.updatedAt ? { modifiedTime: guide.updatedAt } : {})
    }
  };
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const guide = getPublishedGuide(slug);
  if (!guide) notFound();
  const path = `/guides/${slug}`;
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.description,
    datePublished: guide.publishedAt,
    ...(guide.updatedAt ? { dateModified: guide.updatedAt } : {}),
    author: { "@type": "Organization", name: guide.author, url: absoluteUrl("/about") },
    publisher: { "@type": "Organization", name: "Astroboat", url: absoluteUrl("/") },
    mainEntityOfPage: absoluteUrl(path),
    image: absoluteUrl(guide.ogImage ?? guide.heroImage?.src ?? "/og-image.png")
  };

  return (
    <article className="mx-auto max-w-4xl pb-12">
      <TrackArticleOpen path={path} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd([articleSchema, breadcrumbSchema([
        { name: "Home", path: "/" }, { name: "Guides", path: "/guides" }, { name: guide.title, path }
      ])]) }} />
      <nav aria-label="Breadcrumb" className="text-sm text-astro-muted">
        <Link href="/" className="hover:text-astro-text">Home</Link> <span aria-hidden="true">/</span>{" "}
        <Link href="/guides" className="hover:text-astro-text">Guides</Link> <span aria-hidden="true">/</span> {guide.title}
      </nav>
      <header className="mt-8 border-b border-astro-border pb-8">
        <p className="font-mono text-xs uppercase tracking-widest text-astro-gold">{guide.category}</p>
        <h1 className="mt-4 font-display text-4xl leading-tight text-astro-text sm:text-5xl">{guide.title}</h1>
        <p className="mt-5 max-w-[68ch] text-lg leading-8 text-astro-muted">{guide.description}</p>
        <div className="mt-5 flex flex-wrap items-center gap-3 text-xs text-astro-muted">
          <Link href="/about" className="hover:underline">By {guide.author}</Link>
          <span>Published <time dateTime={guide.publishedAt}>{guide.publishedAt}</time></span>
          {guide.updatedAt ? <span>Updated <time dateTime={guide.updatedAt}>{guide.updatedAt}</time></span> : null}
          <span>{guide.readingMinutes} min read</span>
        </div>
        {guide.aiAssisted ? <p className="mt-3 text-xs leading-6 text-astro-muted">Prepared with AI assistance using the primary sources linked below. <Link href="/editorial-policy" className="text-astro-blue underline">How Astroboat works</Link></p> : null}
        <ShareButton url={absoluteUrl(path)} title={guide.title} />
      </header>
      {guide.heroImage ? (
        <figure className="mt-7">
          <Image src={guide.heroImage.src} alt={guide.heroImage.alt} width={1200} height={675} sizes="(max-width: 768px) 100vw, 768px" className="h-auto w-full rounded-xl" priority />
          <figcaption className="mt-2 text-xs text-astro-muted">Image: <a href={guide.heroImage.creditUrl} className="underline">{guide.heroImage.credit}</a></figcaption>
        </figure>
      ) : null}
      <div className="mt-9 grid gap-10 md:grid-cols-[minmax(0,1fr)_12rem]">
        <div className="max-w-[68ch]">
          {guide.sections.map((section) => (
            <section key={section.id} id={section.id} className="mb-10 scroll-mt-24">
              <h2 className="font-display text-2xl text-astro-text">{section.heading}</h2>
              {section.paragraphs.map((paragraph) => <p key={paragraph} className="mt-4 text-base leading-8 text-astro-muted">{paragraph}</p>)}
            </section>
          ))}
          <section className="border-t border-astro-border pt-8">
            <h2 className="font-display text-2xl text-astro-text">Sources and further reading</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-7 text-astro-muted">
              {guide.sources.map((source) => <li key={source.url}><TrackedLink event="original_source_clicked" href={source.url} className="text-astro-blue hover:underline">{source.label}</TrackedLink></li>)}
            </ul>
          </section>
          <aside className="mt-10 border-t border-astro-border pt-8">
            <h2 className="font-display text-2xl text-astro-text">Explore next</h2>
            <ul className="mt-4 space-y-3">
              {guide.relatedPaths.map((item) => <li key={item.href}><TrackedLink event="related_article_clicked" href={item.href} className="text-astro-blue hover:underline">{item.label} →</TrackedLink></li>)}
            </ul>
          </aside>
        </div>
        {guide.showTableOfContents ? (
          <nav aria-label="On this page" className="self-start md:sticky md:top-28">
            <p className="font-mono text-xs uppercase tracking-widest text-astro-gold">On this page</p>
            <ul className="mt-3 space-y-2 text-sm text-astro-muted">{guide.sections.map((section) => <li key={section.id}><a href={`#${section.id}`} className="hover:text-astro-text">{section.heading}</a></li>)}</ul>
          </nav>
        ) : null}
      </div>
    </article>
  );
}
