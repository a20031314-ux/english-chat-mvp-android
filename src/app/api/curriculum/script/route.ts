import { NextRequest } from "next/server";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import { requestUserId } from "@/lib/server/premiumRequest";
import { isIdentified } from "@/lib/server/identity";
import { meterRequest, simDetail } from "@/lib/server/meterRequest";
import { lastCopyFailure, scriptView } from "@/lib/server/stageCopy";
import { markScriptPassed, readScriptPassed } from "@/lib/server/scriptProgressStore";
import { scriptFor, scriptProgress } from "@/lib/curriculum/scripts";
import { INTERFACE_LANGUAGE_LABELS, coerceLanguageCode } from "@/lib/learningLanguages";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * 글자·소리 기초(curriculum/scripts) — 대화 단계 앞의 "글자부터".
 *
 * GET ?lang=<학습 언어>&ui=<앱 언어>  → { course: ScriptView | null, passed: string[], progress }
 * POST { lang, groupId }              → 그 묶음 연습을 통과했다고 남김(통과 판단은 화면이 함: 문제의 80%)
 * AI 호출 없음(다른 앱 언어 글을 처음 한 번 옮길 때만).
 */
export async function OPTIONS(request: NextRequest) {
  return corsPreflightResponse(request);
}

export async function GET(request: NextRequest) {
  const language = coerceLanguageCode(request.nextUrl.searchParams.get("lang"));
  const uiParam = request.nextUrl.searchParams.get("ui") ?? "ko";
  const ui = INTERFACE_LANGUAGE_LABELS[uiParam] ? uiParam : "ko";
  const course = scriptFor(language);
  if (!course) return jsonWithCors(request, { language, course: null, passed: [], progress: null });
  const view = await scriptView(language, ui, INTERFACE_LANGUAGE_LABELS[ui] ?? "Korean", () => {
    void meterRequest(request, "stageCopy");
  });
  const userId = requestUserId(request);
  const passed = isIdentified(userId) ? await readScriptPassed(userId, language) : {};
  const failure = lastCopyFailure();
  return jsonWithCors(request, { language, course: view, passed: Object.keys(passed), progress: scriptProgress(course, passed), ...(failure ? simDetail(request, failure) : {}) });
}

export async function POST(request: NextRequest) {
  const userId = requestUserId(request);
  if (!isIdentified(userId)) return jsonWithCors(request, { error: "IDENTITY_REQUIRED" }, { status: 401 });
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return jsonWithCors(request, { error: "Invalid JSON" }, { status: 400 });
  }
  const language = coerceLanguageCode(body.lang);
  const course = scriptFor(language);
  const groupId = typeof body.groupId === "string" ? body.groupId : "";
  if (!course || !course.groups.some((group) => group.id === groupId)) {
    return jsonWithCors(request, { error: "UNKNOWN_GROUP" }, { status: 400 });
  }
  const passed = await markScriptPassed(userId, language, groupId);
  return jsonWithCors(request, { passed: Object.keys(passed), progress: scriptProgress(course, passed) });
}
