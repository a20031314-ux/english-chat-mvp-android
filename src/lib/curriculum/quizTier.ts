/**
 * 어림으로 정하는 문제 모양(2026-11-08 사용자 "알고리즘도 추정치로 짜서, 4단계 학습자면 하위 단계 퀴즈는 고난이도나 중난이도부터" → "만들어줘").
 * 이 폰에 그 열쇠를 푼 기록이 없을 때만 — 기록이 있으면 기록이 먼저(checkState.ts cardFaces).
 *
 * 아는 확률(어림) p:
 *   단어 w| = 단어 수준 어림(vocabLevel knowChance — 첫 측정·답으로 고쳐지는 경계)과 그 단어의 빈도 순위
 *   표현 e| = 그 표현의 단계와 지금 단계(아래 0.85 · 같음 0.4 · 위 0.15 — Logbank 첫 측정 어림 fill.ts placed와 같은 값)
 * 모양 셋:
 *   쉬움 easy (p < 0.4)  뜻 가림 — 뜻 넷 중 고르기
 *   중간 mid  (0.4~0.7)  단어 가림 — 예문 속 꼴 쓰기(예문·예문 뜻은 보임)
 *   어려움 hard (p ≥ 0.7) 예문 없이 뜻만 보고 쓰기(bare) — 맞히면 장부 쓰기 "sure" → 체크 셋 바로 알아요(3일 뒤 복습으로 확인)
 */
export type Tier = "easy" | "mid" | "hard";
export const TIER_HIGH = 0.7;
export const TIER_MID = 0.4;
/** 표현 어림: 지금 단계 아래 · 같음 · 위. */
export const EXPR_BELOW = 0.85;
export const EXPR_SAME = 0.4;
export const EXPR_ABOVE = 0.15;

export function tierOf(p: number): Tier {
  return p >= TIER_HIGH ? "hard" : p >= TIER_MID ? "mid" : "easy";
}

export function expressionChance(itemStage: number, stage: number): number {
  return itemStage < stage ? EXPR_BELOW : itemStage === stage ? EXPR_SAME : EXPR_ABOVE;
}

/** 그 열쇠를 퀴즈·첫 측정·맞나 틀리나에서 답한 적이 있나(찾아봄·대화에서 씀은 기록 아님 — 2026-11-09 앎·말하기 분리). */
export function answeredKeys(events: readonly { k: string; src: string; r: string }[]): Set<string> {
  const out = new Set<string>();
  for (const event of events) {
    if (((event.src === "quiz" || event.src === "exam" || event.src === "judge") && (event.r === "ok" || event.r === "miss"))) out.add(event.k);
  }
  return out;
}

/**
 * 카드 문제의 모양: 기록이 있으면 face 그대로(맞나 틀리나 섞음), 없으면 어림 p로.
 * face = cardFaces 결과("show"는 맞힌 적 있음 또는 사전에서 찾아본 뒤) — 찾아본 말은 적어도 중간.
 */
export function cardMode(face: "hide" | "show", answered: boolean, p: number | null): { mode: "hide" | "show"; bare: boolean; judge: boolean; tier: Tier | null } {
  if (answered || p === null) return { mode: face, bare: false, judge: answered && face === "show", tier: null };
  const tier = tierOf(p);
  if (tier === "hard") return { mode: "show", bare: true, judge: false, tier };
  if (tier === "mid" || face === "show") return { mode: "show", bare: false, judge: false, tier: tier === "easy" ? "mid" : tier };
  return { mode: "hide", bare: false, judge: false, tier };
}
