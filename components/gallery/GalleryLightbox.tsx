"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import type { GalleryImage } from "@/lib/types";
import { imageCandidates, useImageFallback } from "@/components/gallery/useImageFallback";

type GalleryLightboxProps = {
  image: GalleryImage | null;
  images: GalleryImage[];
  onClose: () => void;
  onSelectImage: (image: GalleryImage) => void;
};

export function GalleryLightbox({ image, images, onClose, onSelectImage }: GalleryLightboxProps) {
  const [copied, setCopied] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const isOpen = Boolean(image);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const currentIndex = image ? images.findIndex((img) => img.id === image.id) : -1;
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < images.length - 1 && currentIndex >= 0;

  const prevImage = hasPrev ? images[currentIndex - 1] : null;
  const nextImage = hasNext ? images[currentIndex + 1] : null;

  const handlePrev = useCallback(() => {
    if (prevImage) onSelectImage(prevImage);
  }, [prevImage, onSelectImage]);

  const handleNext = useCallback(() => {
    if (nextImage) onSelectImage(nextImage);
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

  useEffect(() => {
    if (!isOpen) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    dialogRef.current?.querySelector<HTMLButtonElement>('button[aria-label^="Close image"]')?.focus();
    return () => previousFocus?.focus();
  }, [isOpen]);

  // Mobile Touch Swipe Handling
  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.targetTouches[0].clientX;
    touchEndX.current = null;
  }

  function handleTouchMove(e: React.TouchEvent) {
    touchEndX.current = e.targetTouches[0].clientX;
  }

  function handleTouchEnd() {
    if (touchStartX.current === null || touchEndX.current === null) return;
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
      ref={dialogRef}
      onKeyDown={(event) => {
        if (event.key !== "Tab") return;
        const focusable = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('button:not([disabled]), a[href]'));
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }}
      role="dialog"
      aria-modal="true"
      aria-label={`Immersive viewer: ${image.title}`}
      className="gallery-viewer fixed inset-0 z-50 flex items-center justify-center"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Top action bar: index counter, share button, close button */}
      <div className="absolute left-4 right-4 top-4 z-50 flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/70 px-3.5 py-1.5 backdrop-blur-md">
          <span className="font-mono text-xs text-astro-muted">
            {currentIndex >= 0 ? `${currentIndex + 1} / ${images.length}` : "Shared observation"}
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
            className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-black/70 text-astro-muted backdrop-blur-md transition hover:bg-white/15 hover:text-white focus:outline-none focus:ring-2 focus:ring-astro-blue/40"
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
          className="absolute left-4 top-1/2 z-40 grid -translate-y-1/2 h-11 w-11 place-items-center rounded-full border border-white/10 bg-black/60 text-astro-text backdrop-blur-md transition hover:scale-105 hover:border-astro-blue/50 hover:bg-black/85 focus:outline-none focus:ring-2 focus:ring-astro-blue/50"
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
          className="absolute right-4 top-1/2 z-40 grid -translate-y-1/2 h-11 w-11 place-items-center rounded-full border border-white/10 bg-black/60 text-astro-text backdrop-blur-md transition hover:scale-105 hover:border-astro-blue/50 hover:bg-black/85 focus:outline-none focus:ring-2 focus:ring-astro-blue/50"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="m9 18 6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      ) : null}

      {/* Main Lightbox Content Area */}
      <div className="flex h-full w-full max-w-6xl flex-col items-center justify-between pt-16 pb-2 sm:pb-4 overflow-y-auto">
        {/* Keyed by image id: loading and failure state never leak between images. */}
        <LightboxImage key={image.id} image={image} />

        {/* Metadata & Astronomy Context Card */}
        <div className="viewer-context mt-3 w-full p-4 sm:p-5">
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

              {/* Attribution: credit, publisher, archive, instrument and rights are distinct facts. */}
              <dl className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-[color:var(--text-dim)]">
                <div className="flex gap-1"><dt>Credit:</dt><dd className="text-astro-muted">{image.credit}</dd></div>
                {image.creator && !image.credit.includes(image.creator) ? <div className="flex gap-1"><dt>Creator:</dt><dd className="text-astro-muted">{image.creator}</dd></div> : null}
                {image.observatory ? <div className="flex gap-1"><dt>Observatory:</dt><dd className="text-astro-muted">{image.observatory}</dd></div> : null}
                {image.publisher ? <div className="flex gap-1"><dt>Published by:</dt><dd className="text-astro-muted">{image.publisher}</dd></div> : null}
                {/* The NASA library hosts images published by many centers and partners. */}
                {image.source === "NASA Image Library" ? <div className="flex gap-1"><dt>Archive:</dt><dd className="text-astro-muted">{image.source}</dd></div> : null}
                <div><dt className="sr-only">Date</dt><dd><time dateTime={image.date} className="font-mono">{image.date}</time></dd></div>
              </dl>
              {image.rights ? (
                <p className="mt-1.5 text-[11px] leading-5 text-[color:var(--text-dim)]">
                  {image.rights}
                  {image.rightsUrl ? <> · <a href={image.rightsUrl} target="_blank" rel="noopener noreferrer" className="underline decoration-white/20 underline-offset-2 hover:text-astro-text">Usage terms</a></> : null}
                </p>
              ) : null}
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
                  <span>View HD image</span>
                </a>
              ) : null}

              {image.sourceUrl ? (
                <a
                  href={image.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cosmic-secondary inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium"
                >
                  <span>View original source</span>
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

function LightboxImage({ image }: { image: GalleryImage }) {
  // Display rendition first, then the smaller one. The HD original is offered as a
  // link, not loaded automatically, because it can be tens of megabytes.
  const { src, status, imgRef, onLoad, onError } = useImageFallback(imageCandidates(image.imageUrl, image.thumbnailUrl), 20000);
  const failed = status === "failed" || !src;

  return (
    <div className="relative flex min-h-[50vh] max-h-[68vh] w-full flex-1 items-center justify-center">
      {status === "loading" ? (
        <div className="absolute inset-0 flex items-center justify-center" role="status" aria-label="Loading image">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-astro-blue/30 border-t-astro-blue" />
        </div>
      ) : null}

      <div className="relative h-full w-full">
        {failed ? (
          <div className="flex h-full w-full flex-col items-center justify-center px-6 text-center text-astro-muted" role="status">
            <svg className="mb-3 h-8 w-8 text-astro-dim" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4m0 4h.01" strokeLinecap="round" />
            </svg>
            <p className="text-sm font-medium text-astro-text">Image temporarily unavailable</p>
            <p className="mt-1 max-w-sm text-xs leading-5">
              Astroboat tried every available rendition. You can still open the official source below.
            </p>
          </div>
        ) : (
          <Image
            key={src}
            ref={imgRef}
            src={src}
            alt={image.alt || image.title}
            fill
            priority
            sizes="(max-width: 1200px) 100vw, 1200px"
            unoptimized
            referrerPolicy="no-referrer"
            onLoad={onLoad}
            onError={onError}
            className={`object-contain transition-opacity duration-300 ${status === "loaded" ? "opacity-100" : "opacity-0"}`}
          />
        )}
      </div>
    </div>
  );
}
