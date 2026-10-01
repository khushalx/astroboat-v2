"use client";

import { useState } from "react";
import Image from "next/image";
import type { GalleryImage } from "@/lib/types";
import { cn } from "@/lib/utils";

type GalleryHeroProps = {
  image: GalleryImage;
  onSelect: (image: GalleryImage) => void;
};

export function GalleryHero({ image, onSelect }: GalleryHeroProps) {
  const [loaded, setLoaded] = useState(false);
  const [srcIndex, setSrcIndex] = useState(0);
  const [error, setError] = useState(false);

  const candidateUrls = Array.from(
    new Set(
      [image.imageUrl, image.thumbnailUrl, image.hdImageUrl].filter(
        (url): url is string => Boolean(url && url.length > 0)
      )
    )
  );

  const currentSrc = candidateUrls[srcIndex] || image.imageUrl;

  const handleImageError = () => {
    setLoaded(false);
    if (srcIndex + 1 < candidateUrls.length) {
      setSrcIndex(srcIndex + 1);
    } else {
      setError(true);
    }
  };

  return (
    <section className="relative mb-10 overflow-hidden rounded-2xl border border-astro-border/80 bg-astro-surface/60 shadow-astro sm:mb-14">
      {/* Background Image Container */}
      <div
        onClick={() => onSelect(image)}
        className="group relative min-h-[22rem] sm:min-h-[26rem] md:min-h-[30rem] lg:min-h-[34rem] w-full cursor-pointer overflow-hidden"
        role="button"
        tabIndex={0}
        aria-label={`Featured Astronomy Capture: ${image.title}`}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onSelect(image);
          }
        }}
      >
        {!loaded && !error ? (
          <div className="absolute inset-0 animate-pulse bg-white/[0.03]" aria-hidden="true" />
        ) : null}

        {error ? (
          <div className="absolute inset-0 flex items-center justify-center bg-astro-base px-6 text-center text-sm text-astro-muted">
            This capture is temporarily unavailable. Its title, context, and original source are still preserved below.
          </div>
        ) : (
          <Image
            key={currentSrc}
            src={currentSrc}
            alt={image.title}
            fill
            priority
            sizes="(max-width: 1200px) 100vw, 1180px"
            unoptimized
            referrerPolicy="no-referrer"
            onLoad={() => {
              setLoaded(true);
              setError(false);
            }}
            onError={handleImageError}
            className={cn(
              "object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105",
              loaded ? "opacity-100" : "opacity-0"
            )}
          />
        )}

        {/* Cinematic Vignette & Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-astro-bg via-astro-bg/40 to-transparent opacity-95 sm:opacity-85" />
        <div className="absolute inset-0 bg-gradient-to-r from-astro-bg/80 via-transparent to-transparent hidden md:block" />

        {/* Featured Tag */}
        <div className="absolute left-4 top-4 z-10 sm:left-6 sm:top-6 flex items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-full border border-astro-gold/40 bg-astro-bg/85 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-astro-gold backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-astro-gold animate-pulse" />
            Featured Capture
          </span>
          <span className="rounded-full border border-white/10 bg-astro-bg/80 px-2.5 py-1 text-xs text-astro-muted backdrop-blur-md">
            {image.category}
          </span>
        </div>

        {/* Content Container (Positioned at bottom with quiet, refined typography) */}
        <div className="absolute inset-x-0 bottom-0 z-10 p-5 sm:p-8 md:p-10 flex flex-col justify-end">
          <div className="max-w-3xl">
            {image.objectName ? (
              <p className="mb-2 text-xs font-medium tracking-wider uppercase text-astro-blue sm:text-sm">
                {image.objectName} {image.distance ? `· ${image.distance}` : ""}
              </p>
            ) : null}

            <h2 className="font-display text-2xl font-normal leading-[1.15] text-astro-text transition-colors group-hover:text-astro-blue sm:text-3xl md:text-4xl">
              {image.title}
            </h2>

            <p className="mt-2.5 max-w-2xl text-xs leading-relaxed text-astro-muted sm:text-sm md:text-base line-clamp-2 sm:line-clamp-3">
              {image.description}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[color:var(--text-dim)] sm:text-sm">
              <span>{image.credit}</span>
              {image.observatory ? (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-astro-muted">{image.observatory}</span>
                </>
              ) : null}
              <span aria-hidden="true">·</span>
              <span className="font-mono text-xs">{image.date}</span>
            </div>
          </div>

          {/* Action Trigger Button */}
          <div className="mt-5 flex items-center gap-3">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSelect(image);
              }}
              className="cosmic-primary inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-medium sm:text-sm"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>Explore High-Res Capture</span>
            </button>
            <span className="text-xs text-astro-muted hidden sm:inline-block">
              Click anywhere on the image to inspect
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
