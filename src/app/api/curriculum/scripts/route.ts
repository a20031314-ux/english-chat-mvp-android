import { NextRequest, after } from "next/server";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import { requestUserId } from "@/lib/server/premiumRequest";
import { isIdentified } from "@/lib/server/identity";
import { coerceLanguageCode } from "@/lib/learningLanguages";
import { allScriptsFor, scriptById } from "@/lib/curriculum/stageScripts";
import { allFramesFor, frameById } from "@/lib/curriculum/frames";
import { markRedoDone, markScriptPassed, readCheckups, readKnown, readPassedScripts, saveCheckup, saveChecks } from "@/lib/server/stageScriptStore";
import { checkupDue, cleanResult } from "@/lib/curriculum/checkup";
import { cleanAsked } from "@/lib/curriculum/itemStats";
import { addItemStats, readItemStats } from "@/lib/server/itemStatsStore";
import { scriptGlosses } from "@/lib/server/stageCopy";
import { meterRequest } from "@/lib/server/meterRequest";
import { INTERFACE_LANGUAGE_LABELS } from "@/lib/learningLanguages";
import { updateLedger } from "@/lib/server/ledgerStore";
import { applyMissionResult } from "@/lib/learner/ledger";
import { studyTick } from "@/lib/server/profileContext";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * 단계 대본 통과(My 단계 보기 "대본으로 연습", 2026-10-27).
 * GET ?lang= → { passed: [id] }
 * GET ?lang=&pack=1 → { scripts, frames } — 그 언어 대본·틀 전부(앱에 없는 언어를 2.76 앱이 받아 씀, curriculum/useScriptPack.ts). 로그인 없이.
 * GET ?lang=&stage=&ui=&glosses=1 → { glosses: {영어 원문: 앱 언어} } — 대본·틀 뜻풀이(영어·한국어 앱은 빈 표, 다른 앱 언어는 처음 한 번 옮겨 저장, server/stageCopy.ts). 로그인 없이.
 * GET ?lang=&itemStats=1 → { stats: {열쇠: [맞힘, 낸 수]} } — 모든 사용자의 시험 문제 통계(curriculum/itemStats.ts, 시험을 짤 때). 로그인 없이.
 * GET ?lang=&checkups=1 → { checkups, known } — known: 시험에서 맞힌 열쇠(확인 중·이미 앎, curriculum/known.ts). — 이번 주 확인 결과(최근 12번, curriculum/checkup.ts).
 * POST { language, checkup: { stage, parts, origins, wrong, kind?, stages?, asked?: [[열쇠, 맞음]] } } → { checkups, review } — 이번 주 확인(7일에 한 번, 그 안이면 409) 또는 처음 시험(kind "placement", 언제든)을 끝냄.
 *   틀린 열쇠는 다시 볼 것(2일 뒤). 문장·들린 말은 받지 않는다.
 * POST { language, check: { 열쇠(e|표현 또는 f|문장구조 id): true(알아요) | false(헷갈려요) } } — 학습 끝 체크(오늘 할 것, curriculum/dailyPlan.ts) → { review }.
 * POST { language, id, redo: true } — 틀린 틀 "다시 연습"을 끝냄(/api/notebook redo에서 3일 빠짐).
 * POST { language, id, outcome? } → { passed: [id] } — id는 대본 또는 틀(frames.ts) — 앱이 내 줄을 모두 통과 방식으로 맞혔을 때만 보낸다(curriculum/stageScripts.ts runPasses).
 *   대본의 핵심 표현(expressions)을 장부에 "도움 받은 써 봄"으로 올린다(만남 → 배움, 2026-10-28 "표현연결"). outcome(앱이 보냄)은 지금 안 씀.
 * 모델을 부르지 않는다. 다음 단계 조건은 /api/notebook?scripts=1 parts[].ready에.
 */
export async function OPTIONS(request: NextRequest) {
  return corsPreflightResponse(request);
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  if (params.get("pack") === "1") {
    const language = coerceLanguageCode(params.get("lang"));
    return jsonWithCors(request, { scripts: allScriptsFor(language), frames: allFramesFor(language) });
  }
  if (params.get("glosses") === "1") {
    const language = coerceLanguageCode(params.get("lang"));
    const stage = Number(params.get("stage"));
    const uiParam = params.get("ui") ?? "en";
    const ui = INTERFACE_LANGUAGE_LABELS[uiParam] ? uiParam : "en";
    if (!Number.isInteger(stage) || stage < 1 || stage > 5) return jsonWithCors(request, { glosses: {} });
    const glosses = await scriptGlosses(language, stage, ui, INTERFACE_LANGUAGE_LABELS[ui] ?? "English", () => {
      void meterRequest(request, "stageCopy");
    });
    return jsonWithCors(request, { glosses });
  }
  if (params.get("itemStats") === "1") {
    return jsonWithCors(request, { stats: await readItemStats(coerceLanguageCode(params.get("lang"))) });
  }
  const userId = requestUserId(request);
  if (!isIdentified(userId)) return jsonWithCors(request, { error: "IDENTITY_REQUIRED" }, { status: 401 });
  const language = coerceLanguageCode(request.nextUrl.searchParams.get("lang"));
  if (params.get("checkups") === "1") {
    const [checkups, known] = await Promise.all([readCheckups(userId, language), readKnown(userId, language)]);
    return jsonWithCors(request, { checkups, known });
  }
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
  if (body.checkup) {
    const result = cleanResult(body.checkup, language);
    if (!result) return jsonWithCors(request, { error: "BAD_CHECKUP" }, { status: 400 });
    const before = await readCheckups(userId, language);
    // 처음 시험(placement)·단계 시험(stage)은 언제든(화면이 같은 날 다시 보지 않게 막음), 이번 주 확인은 7일에 한 번.
    if (!result.kind && !checkupDue(before)) return jsonWithCors(request, { error: "CHECKUP_NOT_DUE", checkups: before }, { status: 409 });
    // 낸 문제마다 맞았는지(말하기 빼고) — 모두의 난이도 통계로(누구 것인지는 안 남김, curriculum/itemStats.ts).
    const asked = cleanAsked((body.checkup as { asked?: unknown }).asked);
    await addItemStats(userId, language, asked);
    // 맞힌 문제 → 확인 중(커리큘럼에서 빠짐), 틀린 것 → 돌아옴(curriculum/known.ts).
    return jsonWithCors(request, await saveCheckup(userId, language, result, Date.now(), asked));
  }
  if (body.check && typeof body.check === "object" && !Array.isArray(body.check)) {
    const checks = Object.fromEntries(Object.entries(body.check as Record<string, unknown>).filter(([, value]) => typeof value === "boolean")) as Record<string, boolean>;
    // quiz: true = 퀴즈 답(확인 중 열쇠를 다른 날 맞히면 이미 앎으로, curriculum/known.ts).
    return jsonWithCors(request, await saveChecks(userId, language, checks, Date.now(), body.quiz === true));
  }
  const id = typeof body.id === "string" ? body.id : "";
  // 대본 또는 틀 바꿔 말하기의 틀(curriculum/frames.ts, id "ja-f1-01") — 통과 기록은 같은 곳.
  const script = scriptById(language, id) ?? (() => {
    const frame = frameById(language, id);
    return frame ? { expressions: frame.expressions ?? [] } : null;
  })();
  if (!script) return jsonWithCors(request, { error: "UNKNOWN_SCRIPT" }, { status: 400 });
  if (body.redo === true && frameById(language, id)) {
    await markRedoDone(userId, language, id);
  }
  // 대본은 짜인 연습이라 "배움"까지(도움 받은 써 봄). 숙지는 채팅·통화에서 혼자 쓸 때(장부 규칙) — 2026-10-28: 혼자로 올렸더니 한 번에 숙지가 됨.
  const outcome = "helped";
  const before = await readPassedScripts(userId, language);
  const [passed] = await Promise.all([
    markScriptPassed(userId, language, id),
    script.expressions.length
      ? updateLedger(userId, language, (ledger) =>
          script.expressions.reduce((next, expression) => applyMissionResult(next, expression, outcome, "mission", undefined), ledger),
        )
      : Promise.resolve(),
  ]);
  // 처음 통과한 것만 공부 기록 숫자로(다시 통과는 세지 않음) — 공부한 날은 다시 해도 남긴다.
  const isFrame = Boolean(frameById(language, id));
  after(() => (before.has(id) ? studyTick(request, isFrame ? "frames" : "scripts", 0) : studyTick(request, isFrame ? "frames" : "scripts")));
  return jsonWithCors(request, { passed });
}
