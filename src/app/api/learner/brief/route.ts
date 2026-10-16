import { NextRequest } from "next/server";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import { requestUserId } from "@/lib/server/premiumRequest";
import { isIdentified } from "@/lib/server/identity";
import { readLearnerBrief } from "@/lib/server/learnerBrief";
import { coerceLanguageCode } from "@/lib/learningLanguages";

export const dynamic = "force-dynamic";

/**
 * What the tutors are told about this learner in one learning language
 * (learner/brief.ts): the findings as data, for the "what your tutor knows"
 * screen to come, and the lines themselves. Only ever the learner's own.
 *
 * GET ?lang=  — { notes, prompt }. No model is called.
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
  const brief = await readLearnerBrief(userId, language);
  return jsonWithCors(request, { language, ...brief });
}
