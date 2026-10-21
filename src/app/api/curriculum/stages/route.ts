import { NextRequest } from "next/server";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import { requestUserId } from "@/lib/server/premiumRequest";
import { isIdentified } from "@/lib/server/identity";
import { meterRequest } from "@/lib/server/meterRequest";
import { readSelfCheck } from "@/lib/server/selfCheckStore";
import { readLedger } from "@/lib/server/ledgerStore";
import { stageViews } from "@/lib/server/stageCopy";
import { STAGE_DONE_SHARE, stageById, stageProgress } from "@/lib/curriculum/stages";
import { INTERFACE_LANGUAGE_LABELS, coerceLanguageCode } from "@/lib/learningLanguages";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * 단계 범위(curriculum/stages) — 대화 예시로 시작 단계를 고르는 화면과 지도 위 "목표 대화".
 *
 * GET ?lang=<학습 언어>&ui=<앱 언어>
 *   { stages: StageView[] | null,                     — 범위가 없는 학습 언어는 null(예전 체크 그대로)
 *     current: { stageId, mastered, learned, total, share, done } | null }
 *                                                     — 고른 단계와 표현 장부로 잰 진행(본인 것만)
 * 화면 글은 영어·한국어는 손으로 쓴 것, 다른 앱 언어는 처음 한 번 옮겨 저장(server/stageCopy.ts).
 */
export async function OPTIONS(request: NextRequest) {
  return corsPreflightResponse(request);
}

export async function GET(request: NextRequest) {
  const language = coerceLanguageCode(request.nextUrl.searchParams.get("lang"));
  const uiParam = request.nextUrl.searchParams.get("ui") ?? "ko";
  const ui = INTERFACE_LANGUAGE_LABELS[uiParam] ? uiParam : "ko";
  const stages = await stageViews(language, ui, INTERFACE_LANGUAGE_LABELS[ui] ?? "Korean", () => {
    void meterRequest(request, "stageCopy");
  });
  if (!stages) return jsonWithCors(request, { language, stages: null, current: null });

  const userId = requestUserId(request);
  let current = null;
  if (isIdentified(userId)) {
    const check = await readSelfCheck(userId, language);
    const stage = stageById(check?.stage);
    if (stage && stage.id.startsWith(`${language}-`)) {
      const progress = stageProgress(stage, await readLedger(userId, language));
      current = {
        stageId: stage.id,
        mastered: progress.mastered,
        learned: progress.learned,
        total: progress.total,
        share: Math.round(progress.share * 100) / 100,
        done: progress.share >= STAGE_DONE_SHARE,
      };
    }
  }
  return jsonWithCors(request, { language, stages, current });
}
