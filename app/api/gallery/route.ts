import { NextResponse } from "next/server";
import { getGalleryData, getGalleryImageById } from "@/services/gallery-service";
import type { GalleryCategory } from "@/lib/types";

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

    const category = (searchParams.get("category") || "All") as GalleryCategory;
    const query = searchParams.get("q")?.toLowerCase().trim() || "";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.max(1, Math.min(60, parseInt(searchParams.get("limit") || "24", 10)));

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
