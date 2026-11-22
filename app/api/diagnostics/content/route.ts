import { NextResponse } from "next/server";
import { getBriefDiagnostics } from "@/services/briefs-service";
import { getGalleryDiagnostics } from "@/services/gallery-service";

export const dynamic = "force-dynamic";

function constantTimeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let difference = 0;
  for (let index = 0; index < a.length; index += 1) difference |= a.charCodeAt(index) ^ b.charCodeAt(index);
  return difference === 0;
}

/**
 * Content-pipeline diagnostics: per-source fetch status, item counts, editorial
 * rejections and duplicates from the most recent run. Public feed titles only;
 * no secrets or internal hostnames.
 *
 * Available without auth in local development. In production it requires
 * `Authorization: Bearer <CONTENT_DIAGNOSTICS_TOKEN>`, and is disabled entirely
 * when that variable is not set.
 */
export async function GET(request: Request) {
  const isProduction = process.env.NODE_ENV === "production";
  const token = process.env.CONTENT_DIAGNOSTICS_TOKEN?.trim() ?? "";
  const provided = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "").trim() ?? "";

  if (isProduction && (!token || token.length < 24 || !constantTimeEqual(provided, token))) {
    return NextResponse.json({ error: "Not found" }, { status: 404, headers: { "Cache-Control": "no-store" } });
  }

  const [briefs, gallery] = await Promise.all([getBriefDiagnostics(), getGalleryDiagnostics()]);

  return NextResponse.json(
    { generatedAt: new Date().toISOString(), briefs, gallery },
    { headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" } }
  );
}
