import { Suspense } from "react";
import type { Metadata } from "next";
import { GalleryClient } from "@/components/gallery/GalleryClient";
import { PageHeader } from "@/components/ui/PageHeader";
import { PageShell } from "@/components/ui/PageShell";
import { GALLERY_REVALIDATE_SECONDS } from "@/lib/constants";
import { getGalleryData } from "@/services/gallery-service";

export const revalidate = 21600;

export const metadata: Metadata = {
  title: "Astronomy Image Gallery",
  description:
    "Explore high-resolution images of galaxies, nebulae, planets, stars and space missions from NASA and leading astronomical observatories.",
  alternates: {
    canonical: "/gallery"
  },
  openGraph: {
    title: "Astronomy Image Gallery — Astroboat",
    description:
      "Explore high-resolution images of galaxies, nebulae, planets, stars and space missions from NASA and leading astronomical observatories.",
    url: "/gallery",
    images: ["/og-image.png"]
  },
  twitter: {
    card: "summary_large_image",
    title: "Astronomy Image Gallery — Astroboat",
    description:
      "Explore high-resolution images of galaxies, nebulae, planets, stars and space missions from NASA and leading astronomical observatories.",
    images: ["/og-image.png"]
  }
};

export default async function GalleryPage() {
  const result = await getGalleryData();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    name: "Astroboat Astronomy Image Gallery",
    description:
      "Explore high-resolution images of galaxies, nebulae, planets, stars and space missions from NASA and leading astronomical observatories.",
    url: "https://astroboat.in/gallery",
    hasPart: result.images.slice(0, 12).map((image) => ({
      "@type": "ImageObject",
      name: image.title,
      description: image.description,
      contentUrl: image.imageUrl,
      thumbnailUrl: image.thumbnailUrl,
      creator: {
        "@type": "Organization",
        name: image.credit
      },
      datePublished: image.date
    }))
  };

  return (
    <PageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <PageHeader
        eyebrow="ASTROBOAT GALLERY"
        title="The universe, frame by frame."
        subtitle="A constantly evolving collection of astronomical imagery from observatories, spacecraft and missions exploring our universe."
      />

      {result.isFallback ? (
        <div className="rounded-lg border border-astro-gold/25 bg-astro-gold/[0.06] p-4 text-sm leading-6 text-astro-text">
          Live astronomy image sources are temporarily unavailable. Astroboat will retry them automatically; no
          unrelated substitute photos are shown.
        </div>
      ) : null}

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
