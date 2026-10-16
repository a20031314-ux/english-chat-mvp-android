import { NextRequest } from "next/server";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import { requestUserId } from "@/lib/server/premiumRequest";
import { isIdentified } from "@/lib/server/identity";
import { readGrowth } from "@/lib/server/growthStore";
import { coerceLanguageCode } from "@/lib/learningLanguages";

export const dynamic = "force-dynamic";

/**
 * The My tab's growing elements for one learning language (learner/growth.ts).
 *
 * GET ?lang=&tz=  — { elements, next }. tz is the learner's clock in minutes
 *                    ahead of UTC, so "today" and the daily bars are theirs.
 *
 * No model is called.
 */
export async function OPTIONS(request: NextRequest) {
  return corsPreflightResponse(request);
}

export async function GET(request: NextRequest) {
  const userId = requestUserId(request);
  if (!isIdentified(userId)) {
    return jsonWithCors(request, { error: "IDENTITY_REQUIRED" }, { status: 401 });
  }
  const language = coerceLanguageCode(request.nextUrl.searchParams.get("lang"));
  const tz = Number(request.nextUrl.searchParams.get("tz"));
  const offset = Number.isFinite(tz) && Math.abs(tz) <= 14 * 60 ? Math.round(tz) : null;
  return jsonWithCors(request, { language, ...(await readGrowth(userId, language, offset)) });
}
