"use client";

import Image from "next/image";
import type { GalleryImage } from "@/lib/types";
import { cn } from "@/lib/utils";
import { imageCandidates, useImageFallback } from "@/components/gallery/useImageFallback";

type GalleryCardProps = {
  image: GalleryImage;
  onSelect: (image: GalleryImage) => void;
  priority?: boolean;
};

export function GalleryCard({ image, onSelect, priority = false }: GalleryCardProps) {
  // Cards load the small rendition first and fall back to the display size.
  // The HD original is never used for a thumbnail (it can be tens of megabytes).
  const { src, status, imgRef, onLoad, onError } = useImageFallback(imageCandidates(image.thumbnailUrl, image.imageUrl));
  const loaded = status === "loaded";
  const error = status === "failed";

  return (
    <article
      onClick={() => onSelect(image)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(image);
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`View ${image.title} in high resolution`}
      className="gallery-card group relative focus:outline-none focus:ring-2 focus:ring-astro-blue/50"
    >
      {/* Image container */}
      <div className="gallery-photo relative w-full overflow-hidden bg-astro-surface">
        {/* Placeholder skeleton while loading */}
        {!loaded && !error ? (
          <div className="absolute inset-0 animate-pulse bg-white/[0.03]" aria-hidden="true" />
        ) : null}

        {error || !src ? (
          <div className="flex h-full w-full flex-col items-center justify-center p-4 text-center text-xs text-astro-muted">
            <svg className="mb-2 h-6 w-6 text-astro-dim" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4m0 4h.01" strokeLinecap="round" />
            </svg>
            <span className="font-medium text-astro-text/80">{image.title}</span>
            <span className="mt-1 text-[11px] text-astro-dim">Preview unavailable · open for the source</span>
          </div>
        ) : (
          <Image
            key={src}
            ref={imgRef}
            src={src ?? ""}
            alt={image.alt || image.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={priority}
            loading={priority ? "eager" : "lazy"}
            unoptimized
            referrerPolicy="no-referrer"
            onLoad={onLoad}
            onError={onError}
            className={cn(
              "object-cover transition-transform duration-500 ease-out group-hover:scale-105",
              loaded ? "opacity-100" : "opacity-0"
            )}
          />
        )}


      </div>

      <div className="pb-3 pt-3">
        <p className="mb-1 text-[11px] text-astro-blue">{image.category}{image.observatory ? ` · ${image.observatory.replace("James Webb Space Telescope", "Webb").replace("Hubble Space Telescope", "Hubble")}` : ""}</p>
        <h3 className="line-clamp-2 transition-colors group-hover:text-astro-gold">{image.title}</h3>
        <div className="gallery-card-credit-line">
          <span title={image.credit || image.source}>{image.credit || image.source}</span>
          <time dateTime={image.date}>{image.date}</time>
        </div>
      </div>
    </article>
  );
}
