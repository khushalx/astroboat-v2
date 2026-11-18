import { GuidesIndex } from "@/components/guides/GuidesIndex";
import { PageHeader } from "@/components/ui/PageHeader";
import { PageShell } from "@/components/ui/PageShell";
import { publishedGuides } from "@/lib/guides";
import { breadcrumbSchema, pageMetadata, safeJsonLd } from "@/lib/seo";
import { guideCollectionSchema } from "@/lib/guide-seo";

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
      <PageHeader eyebrow="The reading room" title="A little understanding. A lot of wonder." subtitle="Source-linked explainers for the ideas behind Astroboat's sky tools." />
      <GuidesIndex guides={groups.flatMap((group) => group.guides).map(({ slug, title, description, category, readingMinutes }) => ({ slug, title, description, category, readingMinutes }))} />
    </PageShell>
  );
}
