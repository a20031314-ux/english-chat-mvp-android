import type { NextRequest } from "next/server";
import { termsFor, type PlanTerms } from "../billing/plans.ts";
import { addDailyHelp, type HelpBucket } from "./entitlementStore.ts";
import { isIdentified } from "./identity.ts";
import { requestUserId, resolveRequestEntitlement } from "./premiumRequest.ts";

/**
 * 누를 때만 도는 AI(번역·표현 카드·문장분석 …)와 방 자막의 하루 한도(billing/plans.ts, hub/drafts/ai-help-limits.md).
 * 사람끼리 주고받는 것은 세지 않는다 — 이건 그 위에 AI가 끼는 부분만.
 *
 * 모델을 부르기 직전(저장된 번역·캐시된 음성을 돌려줄 때는 지나서)에 부른다. 무료 한도까지는 요금 확인 없이 세고,
 * 넘을 때만 RevenueCat에 요금을 물어 그 요금의 한도와 비교한다 — 구독자 요청마다 요금 조회를 하나 더 하지 않게.
 * 누군지 모르는 요청(공용 익명)은 세지 않는다: 그 이름 하나에 모두가 묶여 한 사람이 다 쓰면 모두가 막힌다.
 */

const FIELD: Record<HelpBucket, keyof Pick<PlanTerms, "dailyAiHelp" | "dailyCaptionLines">> = {
  help: "dailyAiHelp",
  caption: "dailyCaptionLines",
};

export const LIMIT_ERRORS: Record<HelpBucket, string> = {
  help: "AI_HELP_LIMIT",
  caption: "CAPTION_LIMIT",
};

export type HelpResult = { ok: true } | { ok: false; error: string; limit: number };

export async function takeAiHelp(request: NextRequest, bucket: HelpBucket): Promise<HelpResult> {
  try {
    const userId = requestUserId(request);
    if (!isIdentified(userId)) return { ok: true };
    const used = await addDailyHelp(userId, bucket);
    const freeLimit = termsFor("free")[FIELD[bucket]];
    if (used <= freeLimit) return { ok: true };
    const { terms } = await resolveRequestEntitlement(request);
    const limit = terms[FIELD[bucket]];
    return used <= limit ? { ok: true } : { ok: false, error: LIMIT_ERRORS[bucket], limit };
  } catch {
    // 세지 못하면 막지 않는다(사용량 기록과 같은 원칙).
    return { ok: true };
  }
}
