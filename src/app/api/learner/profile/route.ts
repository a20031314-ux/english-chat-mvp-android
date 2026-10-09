import { NextRequest } from "next/server";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import { requestUserId } from "@/lib/server/premiumRequest";
import { isIdentified } from "@/lib/server/identity";
import { readLearnerProfile, saveLearnerPlan } from "@/lib/server/learnerProfileStore";
import { coerceLanguageCode } from "@/lib/learningLanguages";
import type { LearnerPlan } from "@/lib/learner/profile";

export const dynamic = "force-dynamic";

/**
 * The learner's construction profile for one language (learner/profile.ts):
 * GET ?lang= reads it, POST { language, plan } sets what comes next. The screen
 * works out level, bands and statuses from it with the same pure functions the
 * server uses, so there is one definition of "mastered".
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
  return jsonWithCors(request, { profile: await readLearnerProfile(userId, language) });
}

export async function POST(request: NextRequest) {
  const userId = requestUserId(request);
  if (!isIdentified(userId)) {
    return jsonWithCors(request, { error: "IDENTITY_REQUIRED" }, { status: 401 });
  }
  let body: Record<string, unknown> = {};
  try {
    body = await request.json();
  } catch {
    return jsonWithCors(request, { error: "Invalid JSON" }, { status: 400 });
  }
  const plan = (body.plan && typeof body.plan === "object" ? body.plan : {}) as Partial<LearnerPlan>;
  const profile = await saveLearnerPlan(userId, coerceLanguageCode(body.language), plan);
  return jsonWithCors(request, { profile });
}
