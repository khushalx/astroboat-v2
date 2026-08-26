"use client";

import { GalleryCard } from "@/components/gallery/GalleryCard";
import type { GalleryImage } from "@/lib/types";

type GalleryGridProps = {
  images: GalleryImage[];
  onSelectImage: (image: GalleryImage) => void;
  hasMore: boolean;
  onLoadMore: () => void;
  isLoadingMore?: boolean;
  onResetFilters: () => void;
};

export function GalleryGrid({
  images,
  onSelectImage,
  hasMore,
  onLoadMore,
  isLoadingMore = false,
  onResetFilters
}: GalleryGridProps) {
  if (images.length === 0) {
    return (
      <div className="flex min-h-[18rem] flex-col items-center justify-center rounded-xl border border-astro-border/70 bg-astro-surface/40 p-8 text-center">
        <svg className="h-10 w-10 text-astro-dim" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <circle cx="12" cy="12" r="10" />
          <path d="M8 12h8m-4-4v8" strokeLinecap="round" />
        </svg>
        <h3 className="mt-4 font-display text-xl font-normal text-astro-text">No astronomical captures found</h3>
        <p className="mt-2 max-w-sm text-sm text-astro-muted">
          No captures matched your current search or category filter. Try clearing your search query or choosing another category.
        </p>
        <button
          type="button"
          onClick={onResetFilters}
          className="cosmic-primary mt-5 rounded-lg px-4 py-2 text-xs font-medium sm:text-sm"
        >
          Reset Filters & Show All
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Editorial Grid Layout */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
        {images.map((image, index) => (
          <GalleryCard
            key={image.id}
            image={image}
            onSelect={onSelectImage}
            priority={index < 6}
          />
        ))}
      </div>

      {/* Load More Action */}
      {hasMore ? (
        <div className="mt-10 flex flex-col items-center justify-center gap-2">
          <button
            type="button"
            onClick={onLoadMore}
            disabled={isLoadingMore}
            className="cosmic-secondary inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-6 py-2.5 text-sm font-medium transition hover:border-astro-blue/40 disabled:opacity-50"
          >
            {isLoadingMore ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-astro-blue/30 border-t-astro-blue" />
                <span>Loading Captures...</span>
              </>
            ) : (
              <>
                <span>Load More Astronomy Captures</span>
                <span aria-hidden="true">↓</span>
              </>
            )}
          </button>
        </div>
      ) : null}
    </div>
  );
}
