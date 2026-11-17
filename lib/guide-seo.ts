import type { Guide } from "@/lib/guides";
import { absoluteUrl, SITE_NAME } from "@/lib/seo";

export function guideCategoryId(category: string) {
  return category.toLowerCase().replace(/\s+/g, "-");
}

export function guideArticleSchema(guide: Guide) {
  const url = absoluteUrl(`/guides/${guide.slug}`);
  const image = guide.ogImage ?? guide.heroImage?.src;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#article`,
    url,
    headline: guide.title,
    description: guide.description,
    datePublished: guide.publishedAt,
    ...(guide.updatedAt ? { dateModified: guide.updatedAt } : {}),
    author: { "@type": "Organization", name: guide.author, url: absoluteUrl("/about") },
    publisher: { "@id": absoluteUrl("/#organization") },
    isPartOf: { "@id": absoluteUrl("/#website") },
    mainEntityOfPage: url,
    inLanguage: "en",
    articleSection: guide.category,
    keywords: guide.tags,
    citation: guide.sources.map((source) => source.url),
    // A brand banner is a social preview, not a representative article photograph.
    ...(image ? { image: absoluteUrl(image) } : {})
  };
}

export function guideCollectionSchema(guides: Guide[]) {
  const url = absoluteUrl("/guides");
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${url}#collection`,
    url,
    name: `Astronomy Guides & Explainers | ${SITE_NAME}`,
    description: "Source-linked astronomy guides on skywatching, the Moon, asteroids, space missions, and the universe.",
    inLanguage: "en",
    isPartOf: { "@id": absoluteUrl("/#website") },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: guides.length,
      itemListElement: guides.map((guide, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: guide.title,
        url: absoluteUrl(`/guides/${guide.slug}`)
      }))
    }
  };
}
