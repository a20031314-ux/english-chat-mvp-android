import { NextRequest } from "next/server";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import { requestUserId } from "@/lib/server/premiumRequest";
import { isIdentified } from "@/lib/server/identity";
import { coerceLanguageCode } from "@/lib/learningLanguages";
import { scriptById } from "@/lib/curriculum/stageScripts";
import { markScriptPassed, readPassedScripts } from "@/lib/server/stageScriptStore";
import { updateLedger } from "@/lib/server/ledgerStore";
import { applyMissionResult } from "@/lib/learner/ledger";

export const dynamic = "force-dynamic";

/**
 * 단계 대본 통과(My 단계 보기 "대본으로 연습", 2026-10-27).
 * GET ?lang= → { passed: [id] }
 * POST { language, id, outcome? } → { passed: [id] } — 앱이 내 줄을 모두 통과 방식으로 맞혔을 때만 보낸다(curriculum/stageScripts.ts runPasses).
 *   대본의 핵심 표현(expressions)을 장부에 "도움 받은 써 봄"으로 올린다(만남 → 배움, 2026-10-28 "표현연결"). outcome(앱이 보냄)은 지금 안 씀.
 * 모델을 부르지 않는다. 다음 단계 조건은 /api/notebook?scripts=1 parts[].ready에.
 */
export async function OPTIONS(request: NextRequest) {
  return corsPreflightResponse(request);
}

export async function GET(request: NextRequest) {
  const userId = requestUserId(request);
  if (!isIdentified(userId)) return jsonWithCors(request, { error: "IDENTITY_REQUIRED" }, { status: 401 });
  const language = coerceLanguageCode(request.nextUrl.searchParams.get("lang"));
  return jsonWithCors(request, { passed: [...(await readPassedScripts(userId, language))] });
}

export async function POST(request: NextRequest) {
  const userId = requestUserId(request);
  if (!isIdentified(userId)) return jsonWithCors(request, { error: "IDENTITY_REQUIRED" }, { status: 401 });
  let body: Record<string, unknown> = {};
  try {
    body = await request.json();
  } catch {
    return jsonWithCors(request, { error: "Invalid JSON" }, { status: 400 });
  }
  const language = coerceLanguageCode(body.language);
  const id = typeof body.id === "string" ? body.id : "";
  const script = scriptById(language, id);
  if (!script) return jsonWithCors(request, { error: "UNKNOWN_SCRIPT" }, { status: 400 });
  // 대본은 짜인 연습이라 "배움"까지(도움 받은 써 봄). 숙지는 채팅·통화에서 혼자 쓸 때(장부 규칙) — 2026-10-28: 혼자로 올렸더니 한 번에 숙지가 됨.
  const outcome = "helped";
  const [passed] = await Promise.all([
    markScriptPassed(userId, language, id),
    script.expressions.length
      ? updateLedger(userId, language, (ledger) =>
          script.expressions.reduce((next, expression) => applyMissionResult(next, expression, outcome, "mission", undefined), ledger),
        )
      : Promise.resolve(),
  ]);
  return jsonWithCors(request, { passed });
}
