import { pageMetadata } from "@/lib/seo";
import { Suspense } from "react";
import { GalleryClient } from "@/components/gallery/GalleryClient";
import { PageHeader } from "@/components/ui/PageHeader";
import { PageShell } from "@/components/ui/PageShell";
import { getGalleryData } from "@/services/gallery-service";
import { absoluteUrl, safeJsonLd } from "@/lib/seo";

// Next.js requires a literal segment config value.
export const revalidate = 21600;

export const metadata = pageMetadata({
  title: 'Astronomy Image Gallery from Space Observatories',
  description: 'Explore astronomy images from NASA, ESA, Hubble, Webb, and ESO, with original source links and image credits.',
  path: '/gallery',
  noindex: false
})

export default async function GalleryPage() {
  const result = await getGalleryData();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    name: "Astroboat Astronomy Image Gallery",
    description:
      "Explore high-resolution images of galaxies, nebulae, planets, stars and space missions from NASA and leading astronomical observatories.",
    url: absoluteUrl("/gallery"),
    hasPart: result.images.slice(0, 12).map((image) => ({
      "@type": "ImageObject",
      name: image.title,
      description: image.description,
      contentUrl: image.imageUrl,
      thumbnailUrl: image.thumbnailUrl,
      creditText: image.credit,
      ...(image.date ? { datePublished: image.date } : {})
    }))
  };

  return (
    <PageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(structuredData) }}
      />

      <PageHeader
        eyebrow="The cosmic collection"
        title="The universe, frame by frame."
        subtitle="Observed by NASA, ESA, Webb, Hubble, and ESO. A window into the universe, with every image credited to its source."
      />

      {result.isFallback ? (
        <div className="data-notice">
          Live astronomy image sources are temporarily unavailable. Astroboat will retry them automatically; no
          unrelated substitute photos are shown.
        </div>
      ) : null}

      {!result.isFallback && result.warnings.length > 0 && <details className="data-notice">
        <summary className="flex min-h-11 cursor-pointer items-center text-sm text-astro-text">Collection status · Some image sources are unavailable</summary>
        <ul className="mt-2 space-y-2 pb-2">{result.warnings.map((warning) => <li key={warning}>{warning}</li>)}</ul>
      </details>}

      <Suspense
        fallback={
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[4/3] animate-pulse rounded-xl border border-astro-border/50 bg-astro-surface/40"
              />
            ))}
          </div>
        }
      >
        <GalleryClient initialResult={result} />
      </Suspense>
    </PageShell>
  );
}
