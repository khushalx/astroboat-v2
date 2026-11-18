"use client";

import { useState } from "react";
import Image from "next/image";
import type { GalleryImage } from "@/lib/types";
import { cn } from "@/lib/utils";

type GalleryCardProps = {
  image: GalleryImage;
  onSelect: (image: GalleryImage) => void;
  priority?: boolean;
};

export function GalleryCard({ image, onSelect, priority = false }: GalleryCardProps) {
  const [loaded, setLoaded] = useState(false);
  const [srcIndex, setSrcIndex] = useState(0);
  const [error, setError] = useState(false);

  // Candidate URLs in priority order
  const candidateUrls = Array.from(
    new Set(
      [image.thumbnailUrl, image.imageUrl, image.hdImageUrl].filter(
        (url): url is string => Boolean(url && url.length > 0)
      )
    )
  );

  const currentSrc = candidateUrls[srcIndex] || image.thumbnailUrl || image.imageUrl;

  const handleImageError = () => {
    setLoaded(false);
    if (srcIndex + 1 < candidateUrls.length) {
      setSrcIndex(srcIndex + 1);
    } else {
      setError(true);
    }
  };

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

        {error ? (
          <div className="flex h-full w-full flex-col items-center justify-center p-4 text-center text-xs text-astro-muted">
            <svg className="mb-2 h-6 w-6 text-astro-dim" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4m0 4h.01" strokeLinecap="round" />
            </svg>
            <span className="font-medium text-astro-text/80">{image.title}</span>
            <span className="mt-1 text-[11px] text-astro-dim">Preview unavailable</span>
          </div>
        ) : (
          <Image
            key={currentSrc}
            src={currentSrc}
            alt={image.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={priority}
            loading={priority ? "eager" : "lazy"}
            unoptimized
            referrerPolicy="no-referrer"
            onLoad={() => {
              setLoaded(true);
              setError(false);
            }}
            onError={handleImageError}
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
