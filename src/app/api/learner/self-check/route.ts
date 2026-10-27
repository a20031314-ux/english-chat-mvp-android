import { NextRequest } from "next/server";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import { requestUserId } from "@/lib/server/premiumRequest";
import { isIdentified } from "@/lib/server/identity";
import { readSelfCheck, saveSelfCheck } from "@/lib/server/selfCheckStore";
import { stageById } from "@/lib/curriculum/stages";
import { coerceLanguageCode } from "@/lib/learningLanguages";

export const dynamic = "force-dynamic";

/**
 * The self-check last filled in for one learning language (learner/selfCheck.ts),
 * so the screen can show it ticked when a new map is started. It is saved by
 * /api/curriculum/generate, with the map it drew.
 *
 * GET ?lang=  — { selfCheck: {...} | null }
 * POST { language, stage } — 시작 단계만 고름(2026-10-28 "커리큘럼과 떨어진 예전 기능 숨기기": 체크 질문·지도 그리기 없이 단계 고르기만).
 *   예전 체크(gaps·focus·use)는 그대로 두고 stage만 바꾼다. 모델 없음.
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
  const language = coerceLanguageCode(body.language);
  const stage = stageById(typeof body.stage === "string" ? body.stage : null);
  if (!stage || !stage.id.startsWith(`${language}-`)) return jsonWithCors(request, { error: "UNKNOWN_STAGE" }, { status: 400 });
  const before = await readSelfCheck(userId, language);
  const selfCheck = { gaps: before?.gaps ?? [], focus: before?.focus ?? [], ...(before?.use ? { use: before.use } : {}), stage: stage.id, at: Date.now() };
  await saveSelfCheck(userId, language, selfCheck);
  return jsonWithCors(request, { language, selfCheck });
}
