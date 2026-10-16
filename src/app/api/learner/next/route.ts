import { NextRequest } from "next/server";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import { requestUserId } from "@/lib/server/premiumRequest";
import { isIdentified } from "@/lib/server/identity";
import { readLedger } from "@/lib/server/ledgerStore";
import { readWeakRecord } from "@/lib/server/weakPointStore";
import { readCurriculum, readMissions } from "@/lib/server/curriculumStore";
import { readSelfCheck } from "@/lib/server/selfCheckStore";
import { nextSteps } from "@/lib/learner/next";
import { coerceLanguageCode } from "@/lib/learningLanguages";

export const dynamic = "force-dynamic";

/**
 * "Try this" for one learning language (learner/next.ts): what to do next,
 * best first, each with the practice goal the conversation will start from.
 *
 * GET ?lang=  — { steps, labelLanguage }. labelLanguage is the interface
 *               language the map's own words (topic titles, mistake labels)
 *               were written in, so a screen in another language can leave
 *               them out rather than show them in the wrong one.
 *
 * No model is called. Nothing is written.
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
  const [ledger, weak, curriculum, selfCheck] = await Promise.all([
    readLedger(userId, language),
    readWeakRecord(userId, language),
    readCurriculum(userId, language),
    readSelfCheck(userId, language),
  ]);
  const map = curriculum?.map ?? null;
  const missions = map ? await readMissions(userId, language, map.id) : {};
  const steps = nextSteps({
    ledger,
    weak,
    map,
    status: curriculum?.status ?? {},
    missions,
    selfCheck,
    now: Date.now(),
  });
  return jsonWithCors(request, {
    language,
    labelLanguage: map?.uiLanguage ?? null,
    steps,
  });
}
