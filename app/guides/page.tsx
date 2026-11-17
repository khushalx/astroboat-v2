import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { PageShell } from "@/components/ui/PageShell";
import { publishedGuides } from "@/lib/guides";
import { breadcrumbSchema, pageMetadata, safeJsonLd } from "@/lib/seo";
import { guideCategoryId, guideCollectionSchema } from "@/lib/guide-seo";

export const metadata = pageMetadata({
  title: "Astronomy Guides & Explainers",
  description: "Read source-linked Astroboat guides that explain astronomy ideas behind the live sky tools.",
  path: "/guides"
});

export default function GuidesPage() {
  const categories = [...new Set(publishedGuides.map((guide) => guide.category))];
  const groups = categories.map((category) => ({
    category,
    guides: publishedGuides.filter((guide) => guide.category === category)
  }));

  return (
    <PageShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd([
        guideCollectionSchema(groups.flatMap((group) => group.guides)),
        breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Guides", path: "/guides" }])
      ]) }} />
      <PageHeader title="Explore astronomy" subtitle="Source-linked explainers for the ideas behind Astroboat's sky tools." />
      <nav aria-label="Guide topics" className="flex flex-wrap gap-x-6 gap-y-3 border-b border-astro-border pb-6 text-sm text-astro-blue">
        {groups.map(({ category, guides }) => (
          <a key={category} href={`#${guideCategoryId(category)}`} className="hover:underline">
            {category} <span className="text-astro-muted">({guides.length})</span>
          </a>
        ))}
      </nav>
      {groups.map(({ category, guides }) => (
        <section key={category} id={guideCategoryId(category)} aria-labelledby={`${guideCategoryId(category)}-title`} className="scroll-mt-28">
          <h2 id={`${guideCategoryId(category)}-title`} className="mb-5 font-display text-2xl text-astro-text">{category}</h2>
          <div className="grid gap-5 md:grid-cols-2">
            {guides.map((guide) => (
              <article key={guide.slug} className="astro-card rounded-2xl border border-astro-border p-6">
                <p className="font-mono text-xs uppercase tracking-widest text-astro-gold">{guide.category} · {guide.readingMinutes} min read</p>
                <h3 className="mt-4 font-display text-2xl text-astro-text">
                  <Link href={`/guides/${guide.slug}`} className="hover:text-astro-gold">{guide.title}</Link>
                </h3>
                <p className="mt-3 text-sm leading-7 text-astro-muted">{guide.description}</p>
                <Link href={`/guides/${guide.slug}`} className="mt-5 inline-block text-sm text-astro-blue hover:underline">Read the guide →</Link>
              </article>
            ))}
          </div>
        </section>
      ))}
    </PageShell>
  );
}
