/**
 * 퀴즈 답한 순간 카드 위 점 셋(2026-11-08 사용자 "퀴즈 도중 점수 상승을 실시간으로, 구체적 수치는 아니더라도 가시적으로" →
 * "맞출 시 카드 전체 보여주기 > 체크 표시" → "만들어줘"). 순수 — 그 열쇠의 장부 사건(답하기 전)과 이번 답으로 전·후 점을 낸다.
 *
 * 점 = 체크 셋(checkState.ts)을 셋으로: ○○○ 처음 봄 · ●●○ 다시 볼 것(앎에서 틀림·[다시]) · ●●● 앎(퀴즈에서 맞힘).
 * 다시 맞힘 = 전에 틀린 뒤 다른 날 처음 맞힘(그 틀린 날).
 */
import type { LogEvent } from "./logLedger.ts";
import { dayOfSeconds, stepState, type CheckState } from "./checkState.ts";

/** 0 ○○○ · 2 ●●○ · 3 ●●● */
export type Dots = 0 | 2 | 3;
export type CardProgress = { before: Dots; after: Dots; known: boolean; recoveredFrom: number | null };

const dotsOf = (state: CheckState): Dots => (state.level === "known" ? 3 : state.level === "hard" ? 2 : 0);

export function cardProgress(events: readonly LogEvent[], key: string, answer: { correct: boolean; mode: "write" | "pick" | "sure"; t: number }, dayOf: (t: number) => string = (t) => dayOfSeconds(t)): CardProgress {
  const mine = events.filter((event) => event.k === key).sort((a, b) => a.t - b.t);
  let state: CheckState = { level: "new", last: 0 };
  let openMiss: number | null = null;
  for (const event of mine) {
    state = stepState(state, event);
    // 퀴즈 답만(대화는 말하기 쪽, 2026-11-09).
    if (event.src === "call" || event.src === "chat" || event.src === "people") continue;
    if (event.r === "ok") openMiss = null;
    else if (event.r === "miss") openMiss = openMiss ?? event.t;
  }
  const before = dotsOf(state);
  const now: LogEvent = { k: key, src: "quiz", r: answer.correct ? "ok" : "miss", m: answer.mode, t: answer.t };
  const after = dotsOf(stepState(state, now));
  const recoveredFrom = answer.correct && openMiss !== null && dayOf(openMiss) !== dayOf(answer.t) ? openMiss : null;
  return { before, after, known: before !== 3 && after === 3, recoveredFrom };
}
