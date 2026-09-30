import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { PageShell } from "@/components/ui/PageShell";
import { publishedGuides } from "@/lib/guides";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Astronomy Guides & Explainers",
  description: "Read source-linked Astroboat guides that explain astronomy ideas behind the live sky tools.",
  path: "/guides"
});

export default function GuidesPage() {
  return (
    <PageShell>
      <PageHeader title="Explore astronomy" subtitle="Source-linked explainers for the ideas behind Astroboat's sky tools." />
      <div className="grid gap-5 md:grid-cols-2">
        {publishedGuides.map((guide) => (
          <article key={guide.slug} className="astro-card rounded-2xl border border-astro-border p-6">
            <p className="font-mono text-xs uppercase tracking-widest text-astro-gold">{guide.category} · {guide.readingMinutes} min read</p>
            <h2 className="mt-4 font-display text-2xl text-astro-text">
              <Link href={`/guides/${guide.slug}`} className="hover:text-astro-gold">{guide.title}</Link>
            </h2>
            <p className="mt-3 text-sm leading-7 text-astro-muted">{guide.description}</p>
            <Link href={`/guides/${guide.slug}`} className="mt-5 inline-block text-sm text-astro-blue hover:underline">Read the guide →</Link>
          </article>
        ))}
      </div>
    </PageShell>
  );
}
