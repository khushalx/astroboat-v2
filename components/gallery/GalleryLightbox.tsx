"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import type { GalleryImage } from "@/lib/types";

type GalleryLightboxProps = {
  image: GalleryImage | null;
  images: GalleryImage[];
  onClose: () => void;
  onSelectImage: (image: GalleryImage) => void;
};

export function GalleryLightbox({ image, images, onClose, onSelectImage }: GalleryLightboxProps) {
  const [copied, setCopied] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const currentIndex = image ? images.findIndex((img) => img.id === image.id) : -1;
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < images.length - 1 && currentIndex >= 0;

  const prevImage = hasPrev ? images[currentIndex - 1] : null;
  const nextImage = hasNext ? images[currentIndex + 1] : null;

  const handlePrev = useCallback(() => {
    if (prevImage) {
      setImageLoaded(false);
      onSelectImage(prevImage);
    }
  }, [prevImage, onSelectImage]);

  const handleNext = useCallback(() => {
    if (nextImage) {
      setImageLoaded(false);
      onSelectImage(nextImage);
    }
  }, [nextImage, onSelectImage]);

  // Keyboard navigation
  useEffect(() => {
    if (!image) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNext();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    // Prevent body scrolling while modal is open
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [image, onClose, handlePrev, handleNext]);

  // Mobile Touch Swipe Handling
  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.targetTouches[0].clientX;
  }

  function handleTouchMove(e: React.TouchEvent) {
    touchEndX.current = e.targetTouches[0].clientX;
  }

  function handleTouchEnd() {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance && hasNext) {
      handleNext();
    } else if (distance < -minSwipeDistance && hasPrev) {
      handlePrev();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  }

  // Copy share URL to clipboard
  const handleShare = async () => {
    if (!image) return;
    const url = `${window.location.origin}/gallery?image=${encodeURIComponent(image.id)}`;

    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
      } else {
        const input = document.createElement("input");
        input.value = url;
        document.body.appendChild(input);
        input.select();
        document.execCommand("copy");
        document.body.removeChild(input);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } catch {
      // Fallback
    }
  };

  if (!image) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Immersive viewer: ${image.title}`}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-2xl p-2 sm:p-4 md:p-6 transition-all duration-300"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Top action bar: index counter, share button, close button */}
      <div className="absolute left-4 right-4 top-4 z-50 flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/70 px-3.5 py-1.5 backdrop-blur-md">
          <span className="font-mono text-xs text-astro-muted">
            {currentIndex + 1} / {images.length}
          </span>
          {image.category ? (
            <>
              <span className="text-white/20" aria-hidden="true">·</span>
              <span className="text-xs font-medium text-astro-blue">{image.category}</span>
            </>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          {/* Share button */}
          <button
            type="button"
            onClick={handleShare}
            aria-label="Share capture link"
            className="flex items-center gap-1.5 rounded-full border border-white/10 bg-black/70 px-3 py-1.5 text-xs text-astro-text backdrop-blur-md transition hover:border-astro-blue/40 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-astro-blue/40"
          >
            {copied ? (
              <>
                <svg className="h-3.5 w-3.5 text-astro-green" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-astro-green font-medium">Link Copied</span>
              </>
            ) : (
              <>
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                  <circle cx="18" cy="5" r="3" />
                  <circle cx="6" cy="12" r="3" />
                  <circle cx="18" cy="19" r="3" />
                  <path d="m8.59 13.51 6.83 3.98M15.41 6.51l-6.82 3.98" strokeLinecap="round" />
                </svg>
                <span>Share</span>
              </>
            )}
          </button>

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close image viewer (Escape)"
            className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-black/70 text-astro-muted backdrop-blur-md transition hover:bg-white/15 hover:text-white focus:outline-none focus:ring-2 focus:ring-astro-blue/40"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* Navigation Buttons (Desktop) */}
      {hasPrev ? (
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous astronomical image (Left Arrow)"
          className="absolute left-4 top-1/2 z-40 hidden -translate-y-1/2 md:grid h-12 w-12 place-items-center rounded-full border border-white/10 bg-black/60 text-astro-text backdrop-blur-md transition hover:scale-105 hover:border-astro-blue/50 hover:bg-black/85 focus:outline-none focus:ring-2 focus:ring-astro-blue/50"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="m15 18-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      ) : null}

      {hasNext ? (
        <button
          type="button"
          onClick={handleNext}
          aria-label="Next astronomical image (Right Arrow)"
          className="absolute right-4 top-1/2 z-40 hidden -translate-y-1/2 md:grid h-12 w-12 place-items-center rounded-full border border-white/10 bg-black/60 text-astro-text backdrop-blur-md transition hover:scale-105 hover:border-astro-blue/50 hover:bg-black/85 focus:outline-none focus:ring-2 focus:ring-astro-blue/50"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="m9 18 6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      ) : null}

      {/* Main Lightbox Content Area */}
      <div className="flex h-full w-full max-w-6xl flex-col items-center justify-between pt-16 pb-2 sm:pb-4 overflow-y-auto">
        {/* Centered Image Container */}
        <div className="relative flex min-h-[50vh] max-h-[68vh] w-full flex-1 items-center justify-center">
          {!imageLoaded ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-astro-blue/30 border-t-astro-blue" />
            </div>
          ) : null}

          <div className="relative h-full w-full">
            <Image
              src={image.imageUrl}
              alt={image.title}
              fill
              priority
              sizes="(max-width: 1200px) 100vw, 1200px"
              onLoad={() => setImageLoaded(true)}
              className={`object-contain transition-opacity duration-300 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
            />
          </div>
        </div>

        {/* Metadata & Astronomy Context Card */}
        <div className="mt-3 w-full rounded-xl border border-astro-border/70 bg-astro-surface/90 p-4 backdrop-blur-xl sm:p-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div className="flex-1 max-w-3xl">
              {image.objectName ? (
                <p className="text-xs font-semibold uppercase tracking-wider text-astro-gold">
                  {image.objectName} {image.distance ? `· ${image.distance}` : ""}
                </p>
              ) : null}

              <h2 className="font-display text-lg font-normal leading-snug text-astro-text sm:text-2xl mt-0.5">
                {image.title}
              </h2>

              <p className="mt-2 text-xs leading-relaxed text-astro-muted sm:text-sm">
                {image.description}
              </p>

              {/* Attribution and Observatory Information */}
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-[color:var(--text-dim)]">
                <span>Credit: <strong className="font-normal text-astro-muted">{image.credit}</strong></span>
                {image.observatory ? (
                  <>
                    <span aria-hidden="true">·</span>
                    <span>Observatory: <strong className="font-normal text-astro-muted">{image.observatory}</strong></span>
                  </>
                ) : null}
                <span aria-hidden="true">·</span>
                <time dateTime={image.date} className="font-mono">{image.date}</time>
              </div>
            </div>

            {/* Official Source and HD Action Links */}
            <div className="flex shrink-0 flex-wrap items-center gap-2 pt-2 md:pt-0">
              {image.hdImageUrl ? (
                <a
                  href={image.hdImageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cosmic-primary inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium"
                >
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>View HD</span>
                </a>
              ) : null}

              {image.sourceUrl ? (
                <a
                  href={image.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cosmic-secondary inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium"
                >
                  <span>View Original Source</span>
                  <svg className="h-3 w-3 text-astro-blue" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
