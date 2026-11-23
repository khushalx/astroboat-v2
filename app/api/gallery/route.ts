import { NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
import { findGalleryImage, getGalleryData, isGalleryImageId } from "@/services/gallery-service";
import { GALLERY_REVALIDATE_SECONDS, galleryCategories } from "@/lib/constants";
import type { GalleryCategory } from "@/lib/types";

// Building the collection fetches every feed, archive detail page and HD check
// (~25 s on a cold instance). The Next.js data cache shares the last build
// across serverless instances, so a cold function answers from it instead.
const getCachedGalleryData = unstable_cache(getGalleryData, ["gallery-collection-v1"], {
  revalidate: GALLERY_REVALIDATE_SECONDS,
  tags: ["gallery"]
});

const LIST_CACHE_CONTROL = "public, s-maxage=600, stale-while-revalidate=3600";

function positiveInteger(value: string | null, fallback: number): number {
  const parsed = Number.parseInt(value || "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id !== null) {
      // Stable ids resolve from the cached collection or durable history, so shared
      // links keep working after an image rotates out of the latest set.
      const imageId = id.trim();
      const image = isGalleryImageId(imageId) ? await findGalleryImage(imageId, await getCachedGalleryData()) : null;
      if (!image) {
        return NextResponse.json({ error: "Image not found" }, { status: 404, headers: { "Cache-Control": "public, s-maxage=300" } });
      }
      return NextResponse.json({ image }, { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" } });
    }

    const requestedCategory = searchParams.get("category") || "All";
    const category = (galleryCategories.includes(requestedCategory) ? requestedCategory : "All") as GalleryCategory;
    const query = searchParams.get("q")?.toLowerCase().trim().slice(0, 120) || "";
    const page = positiveInteger(searchParams.get("page"), 1);
    const limit = Math.min(60, positiveInteger(searchParams.get("limit"), 24));

    const result = await getCachedGalleryData();
    let filtered = result.images;

    if (category && category !== "All") {
      filtered = filtered.filter((img) => img.category === category);
    }

    if (query) {
      filtered = filtered.filter((img) => {
        const text = `${img.title} ${img.description} ${img.objectName || ""} ${img.observatory || ""} ${img.credit} ${img.category}`.toLowerCase();
        return text.includes(query);
      });
    }

    const total = filtered.length;
    const startIndex = (page - 1) * limit;
    const paginated = filtered.slice(startIndex, startIndex + limit);
    const hasMore = startIndex + limit < total;

    return NextResponse.json({
      images: paginated,
      total,
      page,
      limit,
      hasMore,
      categories: result.categories,
      featuredImage: result.featuredImage,
      lastUpdated: result.lastUpdated,
      isFallback: result.isFallback,
      warnings: result.warnings
    }, { headers: { "Cache-Control": LIST_CACHE_CONTROL } });
  } catch (error) {
    console.error("[gallery] API error:", error instanceof Error ? error.message : "unknown error");
    return NextResponse.json(
      { error: "Failed to retrieve astronomy gallery data" },
      { status: 500 }
    );
  }
}
