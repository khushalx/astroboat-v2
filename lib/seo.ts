import type { Metadata } from "next";

// Production redirects the apex host to www. Keep this independent of local preview URLs.
export const SITE_URL = "https://www.astroboat.in";
export const SITE_NAME = "Astroboat";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

export function absoluteUrl(path: string) {
  return new URL(path, SITE_URL).toString();
}

type PageSeo = {
  title: string;
  description: string;
  path: string;
  image?: string;
  imageAlt?: string;
  noindex?: boolean;
};

export function pageMetadata({ title, description, path, image, imageAlt, noindex = false }: PageSeo): Metadata {
  const url = absoluteUrl(path);
  const imageUrl = image ? absoluteUrl(image) : DEFAULT_OG_IMAGE;
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;

  return {
    title: { absolute: fullTitle },
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title: fullTitle,
      description,
      url,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: imageAlt ?? title }]
    },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: [imageUrl] },
    ...(noindex ? { robots: { index: false, follow: true } } : {})
  };
}

// JSON placed in a script tag must not allow an upstream title to terminate the tag.
export function safeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c").replace(/>/g, "\\u003e").replace(/&/g, "\\u0026");
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path)
    }))
  };
}
