"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { GalleryHero } from "@/components/gallery/GalleryHero";
import { GalleryFilters } from "@/components/gallery/GalleryFilters";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { GalleryLightbox } from "@/components/gallery/GalleryLightbox";
import type { GalleryCategory, GalleryImage, GalleryResult } from "@/lib/types";

const INITIAL_PAGE_SIZE = 24;
const LOAD_MORE_STEP = 18;

type GalleryClientProps = {
  initialResult: GalleryResult;
};

export function GalleryClient({ initialResult }: GalleryClientProps) {
  const searchParams = useSearchParams();
  const [activeCategory, setActiveCategory] = useState<GalleryCategory>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(INITIAL_PAGE_SIZE);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  // Read initial image query param on mount or URL change
  useEffect(() => {
    const imageIdFromUrl = searchParams.get("image");
    if (imageIdFromUrl) {
      const match = initialResult.images.find((img) => img.id === imageIdFromUrl);
      if (match) {
        setSelectedImage(match);
      }
    }
  }, [searchParams, initialResult.images]);

  // Synchronize URL when selectedImage changes
  const handleSelectImage = useCallback((image: GalleryImage | null) => {
    setSelectedImage(image);

    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      if (image) {
        url.searchParams.set("image", image.id);
      } else {
        url.searchParams.delete("image");
      }
      window.history.pushState({}, "", url.toString());
    }
  }, []);

  const handleCloseLightbox = useCallback(() => {
    handleSelectImage(null);
  }, [handleSelectImage]);

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

  // Paginated visible slice
  const visibleImages = useMemo(() => {
    return filteredImages.slice(0, visibleCount);
  }, [filteredImages, visibleCount]);

  const hasMore = visibleCount < filteredImages.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + LOAD_MORE_STEP);
  };

  const handleResetFilters = () => {
    setActiveCategory("All");
    setSearchQuery("");
    setVisibleCount(INITIAL_PAGE_SIZE);
  };

  // "Surprise Me" action: pick random image from filtered or whole set and open in lightbox
  const handleSurpriseMe = () => {
    const pool = filteredImages.length > 0 ? filteredImages : initialResult.images;
    if (pool.length === 0) return;
    const randomIndex = Math.floor(Math.random() * pool.length);
    handleSelectImage(pool[randomIndex]);
  };

  return (
    <div className="w-full">
      {/* Featured Hero Capture */}
      {initialResult.featuredImage && !searchQuery && activeCategory === "All" ? (
        <GalleryHero
          image={initialResult.featuredImage}
          onSelect={handleSelectImage}
        />
      ) : null}

      {/* Filter and Search controls */}
      <GalleryFilters
        categories={initialResult.categories}
        activeCategory={activeCategory}
        onCategoryChange={(cat) => {
          setActiveCategory(cat);
          setVisibleCount(INITIAL_PAGE_SIZE);
        }}
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          setVisibleCount(INITIAL_PAGE_SIZE);
        }}
        onSurpriseMe={handleSurpriseMe}
        totalCount={initialResult.images.length}
        filteredCount={filteredImages.length}
      />

      {/* Main Image Grid */}
      <GalleryGrid
        images={visibleImages}
        onSelectImage={handleSelectImage}
        hasMore={hasMore}
        onLoadMore={handleLoadMore}
        onResetFilters={handleResetFilters}
      />

      {/* Immersive Lightbox Modal */}
      <GalleryLightbox
        image={selectedImage}
        images={filteredImages}
        onClose={handleCloseLightbox}
        onSelectImage={handleSelectImage}
      />
    </div>
  );
}
