import { NextRequest } from "next/server";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import { coerceLanguageCode, INTERFACE_LANGUAGE_LABELS } from "@/lib/learningLanguages";
import { meterRequest } from "@/lib/server/meterRequest";
import { frameLesson } from "@/lib/server/frameLesson";
import { frameById } from "@/lib/curriculum/frames";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

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
  const lesson = await frameLesson(language, frame, ui, INTERFACE_LANGUAGE_LABELS[ui] ?? "English", () => {
    metered += 1;
    if (metered <= 2) void meterRequest(request, "frameLesson");
  });
  return jsonWithCors(request, { lesson });
}
