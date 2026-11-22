"use client";

import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { GalleryHero } from "@/components/gallery/GalleryHero";
import { GalleryFilters } from "@/components/gallery/GalleryFilters";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { GalleryLightbox } from "@/components/gallery/GalleryLightbox";
import type { GalleryCategory, GalleryImage, GalleryResult } from "@/lib/types";

const INITIAL_PAGE_SIZE = 24;
const LOAD_MORE_STEP = 18;
const IMAGE_ID_PATTERN = /^[a-z0-9][a-z0-9_-]{2,120}$/i;

type GalleryClientProps = {
  initialResult: GalleryResult;
};

type SharedLookup = { id: string; status: "loading" | "missing" | "error" };

export function GalleryClient({ initialResult }: GalleryClientProps) {
  const searchParams = useSearchParams();
  const requestedCategory = searchParams.get("category");
  const [activeCategory, setActiveCategory] = useState<GalleryCategory>(() =>
    requestedCategory && initialResult.categories.includes(requestedCategory) ? (requestedCategory as GalleryCategory) : "All"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(INITIAL_PAGE_SIZE);
  // Images fetched for shared links that are no longer in the current collection.
  const [resolvedImages, setResolvedImages] = useState<Record<string, GalleryImage>>({});
  const [sharedLookup, setSharedLookup] = useState<SharedLookup | null>(null);
  const openedFromGallery = useRef(false);

  const selectedId = searchParams.get("image");
  const validSelectedId = selectedId && IMAGE_ID_PATTERN.test(selectedId) ? selectedId : null;
  const selectedImage = useMemo(() => {
    if (!validSelectedId) return null;
    return initialResult.images.find((img) => img.id === validSelectedId) ?? (initialResult.featuredImage?.id === validSelectedId ? initialResult.featuredImage : null) ?? resolvedImages[validSelectedId] ?? null;
  }, [validSelectedId, initialResult.images, initialResult.featuredImage, resolvedImages]);

  // A shared link may point to an image that has rotated out of the latest
  // collection; resolve it by its stable id instead of failing silently.
  useEffect(() => {
    if (!validSelectedId || selectedImage) {
      if (!validSelectedId) setSharedLookup(null);
      return;
    }

    const controller = new AbortController();
    setSharedLookup({ id: validSelectedId, status: "loading" });

    fetch(`/api/gallery?id=${encodeURIComponent(validSelectedId)}`, { signal: controller.signal })
      .then(async (response) => {
        if (response.status === 404) {
          setSharedLookup({ id: validSelectedId, status: "missing" });
          return;
        }
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = (await response.json()) as { image?: GalleryImage };
        if (data.image?.id === validSelectedId) {
          setResolvedImages((current) => ({ ...current, [validSelectedId]: data.image! }));
          setSharedLookup(null);
        } else {
          setSharedLookup({ id: validSelectedId, status: "missing" });
        }
      })
      .catch((error: unknown) => {
        if ((error as { name?: string })?.name !== "AbortError") setSharedLookup({ id: validSelectedId, status: "error" });
      });

    return () => controller.abort();
  }, [validSelectedId, selectedImage]);

  const writeUrl = useCallback((mutate: (url: URL) => void, mode: "push" | "replace") => {
    const url = new URL(window.location.href);
    mutate(url);
    if (url.toString() === window.location.href) return;
    if (mode === "push") window.history.pushState(null, "", url.toString());
    else window.history.replaceState(null, "", url.toString());
  }, []);

  const handleSelectImage = useCallback(
    (image: GalleryImage | null) => {
      if (image) {
        // Opening creates one history entry; moving between images replaces it,
        // so Back closes the viewer instead of stepping through every image.
        const alreadyOpen = Boolean(new URL(window.location.href).searchParams.get("image"));
        if (!alreadyOpen) openedFromGallery.current = true;
        writeUrl((url) => url.searchParams.set("image", image.id), alreadyOpen ? "replace" : "push");
        return;
      }

      if (openedFromGallery.current) {
        openedFromGallery.current = false;
        window.history.back();
      } else {
        writeUrl((url) => url.searchParams.delete("image"), "replace");
      }
    },
    [writeUrl]
  );

  const handleCloseLightbox = useCallback(() => {
    handleSelectImage(null);
  }, [handleSelectImage]);

  const dismissSharedNotice = useCallback(() => {
    setSharedLookup(null);
    writeUrl((url) => url.searchParams.delete("image"), "replace");
  }, [writeUrl]);

  const handleCategoryChange = useCallback(
    (category: GalleryCategory) => {
      setActiveCategory(category);
      setVisibleCount(INITIAL_PAGE_SIZE);
      writeUrl((url) => {
        if (category === "All") url.searchParams.delete("category");
        else url.searchParams.set("category", category);
      }, "replace");
    },
    [writeUrl]
  );

  // Filter & Search images
  const filteredImages = useMemo(() => {
    let list = initialResult.images;

    if (activeCategory !== "All") {
      list = list.filter((img) => img.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((img) => {
        const text = `${img.title} ${img.description} ${img.objectName || ""} ${img.observatory || ""} ${img.credit} ${img.category}`.toLowerCase();
        return text.includes(q);
      });
    }

    return list;
  }, [initialResult.images, activeCategory, searchQuery]);

  const visibleImages = useMemo(() => filteredImages.slice(0, visibleCount), [filteredImages, visibleCount]);
  const hasMore = visibleCount < filteredImages.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + LOAD_MORE_STEP);
  };

  const handleResetFilters = () => {
    handleCategoryChange("All");
    setSearchQuery("");
  };

  // "Surprise Me" action: pick random image from filtered or whole set and open in lightbox
  const handleSurpriseMe = () => {
    const pool = filteredImages.length > 0 ? filteredImages : initialResult.images;
    if (pool.length === 0) return;
    handleSelectImage(pool[Math.floor(Math.random() * pool.length)]);
  };

  return (
    <div className="w-full">
      {sharedLookup?.status === "loading" ? (
        <div className="data-notice" role="status">Opening the shared image…</div>
      ) : null}

      {sharedLookup && sharedLookup.status !== "loading" ? (
        <div className="data-notice flex flex-wrap items-center justify-between gap-3" role="status">
          <span>
            {sharedLookup.status === "missing"
              ? "The shared image is no longer available in Astroboat's gallery archive."
              : "The shared image could not be loaded right now. Please try again shortly."}
          </span>
          <button type="button" onClick={dismissSharedNotice} className="cosmic-secondary rounded-lg px-3 py-1.5 text-xs">
            Dismiss
          </button>
        </div>
      ) : null}

      {initialResult.featuredImage && !searchQuery && activeCategory === "All" ? (
        <GalleryHero image={initialResult.featuredImage} onSelect={handleSelectImage} />
      ) : null}

      <GalleryFilters
        categories={initialResult.categories}
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          setVisibleCount(INITIAL_PAGE_SIZE);
        }}
        onSurpriseMe={handleSurpriseMe}
        totalCount={initialResult.images.length}
        filteredCount={filteredImages.length}
      />

      <GalleryGrid
        images={visibleImages}
        onSelectImage={handleSelectImage}
        hasMore={hasMore}
        onLoadMore={handleLoadMore}
        onResetFilters={handleResetFilters}
      />

      <GalleryLightbox
        image={selectedImage}
        images={filteredImages}
        onClose={handleCloseLightbox}
        onSelectImage={handleSelectImage}
      />
    </div>
  );
}
