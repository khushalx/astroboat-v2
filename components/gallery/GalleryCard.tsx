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
      className="group relative cursor-pointer overflow-hidden rounded-xl border border-astro-border/70 bg-astro-surface/70 transition-all duration-300 hover:border-astro-blue/40 hover:shadow-astro focus:outline-none focus:ring-2 focus:ring-astro-blue/50"
    >
      {/* Image container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-astro-base/80 sm:aspect-[16/11]">
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

        {/* Top Badges */}
        <div className="absolute left-3 top-3 z-10 flex flex-wrap items-center gap-1.5 pointer-events-none">
          <span className="rounded-md border border-white/10 bg-astro-bg/85 px-2 py-0.5 text-[11px] font-medium tracking-wide text-astro-text backdrop-blur-md">
            {image.category}
          </span>
          {image.observatory ? (
            <span className="hidden rounded-md border border-white/10 bg-black/60 px-2 py-0.5 text-[10px] text-astro-muted backdrop-blur-md sm:inline-block">
              {image.observatory.replace("James Webb Space Telescope", "JWST").replace("Hubble Space Telescope", "Hubble")}
            </span>
          ) : null}
        </div>

        {/* Hover / Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-astro-bg via-astro-bg/30 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-85 sm:opacity-40" />

        {/* Floating expand hint icon */}
        <div className="absolute right-3 top-3 z-10 grid h-7 w-7 place-items-center rounded-lg bg-astro-bg/80 text-astro-muted opacity-0 backdrop-blur-md transition-opacity duration-200 group-hover:opacity-100 sm:block hidden">
          <svg className="h-3.5 w-3.5 text-astro-text" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* Card Metadata Footer */}
      <div className="p-3.5 sm:p-4">
        <h3 className="font-display text-base font-normal leading-snug text-astro-text transition-colors group-hover:text-astro-blue line-clamp-1 sm:text-lg">
          {image.title}
        </h3>
        
        <div className="mt-2 flex items-center justify-between gap-2 text-xs text-astro-muted">
          <span className="truncate max-w-[65%] text-[11px] text-[color:var(--text-dim)]">
            {image.credit || image.source}
          </span>
          <time dateTime={image.date} className="shrink-0 font-mono text-[11px] text-[color:var(--text-dim)]">
            {image.date}
          </time>
        </div>
      </div>
    </article>
  );
}
