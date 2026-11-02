import { NextRequest } from "next/server";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import { coerceLanguageCode, INTERFACE_LANGUAGE_LABELS } from "@/lib/learningLanguages";
import { fixedLessonStatus, storedFixedLesson } from "@/lib/server/fixedLesson";
import { frameById } from "@/lib/curriculum/frames";

export const dynamic = "force-dynamic";

/**
 * 고정 수업 읽기(만들지 않음): GET ?lang=en&ui=ko&frame=en-f1-03 → { fixed }, GET ?status=1 → 짝마다 만든 수.
 * 확인용 표·원고 내보내기가 쓴다(scripts/fixed-lessons-pull.mjs). 모두가 같이 쓰는 수업 내용뿐, 학습자 글 없음.
 */
export async function OPTIONS(request: NextRequest) {
  return corsPreflightResponse(request);
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  if (params.get("status")) return jsonWithCors(request, await fixedLessonStatus());
  const language = coerceLanguageCode(params.get("lang"));
  const uiParam = params.get("ui") ?? "en";
  const ui = INTERFACE_LANGUAGE_LABELS[uiParam] ? uiParam : "en";
  const frame = frameById(language, params.get("frame") ?? "");
  if (!frame) return jsonWithCors(request, { fixed: null });
  return jsonWithCors(request, { fixed: await storedFixedLesson(language, ui, frame.id) });
}
