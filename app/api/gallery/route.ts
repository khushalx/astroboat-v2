import { NextResponse } from "next/server";
import { getGalleryData, getGalleryImageById } from "@/services/gallery-service";
import { galleryCategories } from "@/lib/constants";
import type { GalleryCategory } from "@/lib/types";

function positiveInteger(value: string | null, fallback: number): number {
  const parsed = Number.parseInt(value || "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
      const image = await getGalleryImageById(id);
      if (!image) {
        return NextResponse.json({ error: "Image not found" }, { status: 404 });
      }
      return NextResponse.json({ image });
    }

    const requestedCategory = searchParams.get("category") || "All";
    const category = (galleryCategories.includes(requestedCategory) ? requestedCategory : "All") as GalleryCategory;
    const query = searchParams.get("q")?.toLowerCase().trim() || "";
    const page = positiveInteger(searchParams.get("page"), 1);
    const limit = Math.min(60, positiveInteger(searchParams.get("limit"), 24));

    const result = await getGalleryData();
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
    });
  } catch (error) {
    console.error("Gallery API error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve astronomy gallery data" },
      { status: 500 }
    );
  }
}
