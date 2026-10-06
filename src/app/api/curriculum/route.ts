import { NextRequest } from "next/server";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import { requestUserId } from "@/lib/server/premiumRequest";
import { isIdentified } from "@/lib/server/identity";
import { hasPreviousMap, readCurriculum } from "@/lib/server/curriculumStore";
import { coerceLanguageCode } from "@/lib/learningLanguages";

export const dynamic = "force-dynamic";

/**
 * The learner's study map for one language (?lang=) and how far through it
 * they are, or null when they have not drawn one. Needs somebody in particular: a map kept under the
 * shared anonymous id would be everybody's map.
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
  const [record, previous] = await Promise.all([
    readCurriculum(userId, language),
    hasPreviousMap(userId, language),
  ]);
  return jsonWithCors(request, { ...(record ?? { map: null, status: {} }), hasPrevious: previous });
}
