import { after, NextRequest } from "next/server";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import { coerceLanguageCode, INTERFACE_LANGUAGE_LABELS } from "@/lib/learningLanguages";
import { meterRequest } from "@/lib/server/meterRequest";
import { frameLesson } from "@/lib/server/frameLesson";
import { asFrameLesson, fixedLessonFor } from "@/lib/server/fixedLesson";
import { frameById } from "@/lib/curriculum/frames";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

/**
 * GET ?lang=ja&ui=ko&frame=ja-f1-04 — 문장구조 수업(설명·주고받기, curriculum/frameLesson.ts). 틀마다 한 번 만들어
 * 모두가 같이 씀(server/frameLesson.ts) — 처음 부를 때만 모델(frameLesson op). 학습자 글은 받지 않는다.
 */
export async function OPTIONS(request: NextRequest) {
  return corsPreflightResponse(request);
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const language = coerceLanguageCode(params.get("lang"));
  const uiParam = params.get("ui") ?? "en";
  const ui = INTERFACE_LANGUAGE_LABELS[uiParam] ? uiParam : "en";
  const frame = frameById(language, params.get("frame") ?? "");
  if (!frame) return jsonWithCors(request, { lesson: null });
  let metered = 0;
  // 고정 수업(server/fixedLesson.ts, 2026-11-02)이 있으면 그것 — 옛 앱·지금 화면은 예전 모양(lesson)으로, 새 화면은 fixed 전체를 쓴다.
  // 없고 미리 만드는 앱 언어(ko·en)가 아니면 응답 뒤에 만들기 시작(이번엔 예전 수업).
  const fixed = await fixedLessonFor(language, ui, frame, (job) => after(job), () => void meterRequest(request, "fixedLesson")).catch(() => null);
  if (fixed) return jsonWithCors(request, { lesson: asFrameLesson(fixed, frame), fixed });
  const lesson = await frameLesson(language, frame, ui, INTERFACE_LANGUAGE_LABELS[ui] ?? "English", () => {
    metered += 1;
    if (metered <= 2) void meterRequest(request, "frameLesson");
  });
  return jsonWithCors(request, { lesson });
}
