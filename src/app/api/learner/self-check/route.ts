import { NextRequest } from "next/server";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import { requestUserId } from "@/lib/server/premiumRequest";
import { isIdentified } from "@/lib/server/identity";
import { readSelfCheck } from "@/lib/server/selfCheckStore";
import { coerceLanguageCode } from "@/lib/learningLanguages";

export const dynamic = "force-dynamic";

/**
 * The self-check last filled in for one learning language (learner/selfCheck.ts),
 * so the screen can show it ticked when a new map is started. It is saved by
 * /api/curriculum/generate, with the map it drew.
 *
 * GET ?lang=  — { selfCheck: {...} | null }
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
  return jsonWithCors(request, { language, selfCheck: await readSelfCheck(userId, language) });
}
