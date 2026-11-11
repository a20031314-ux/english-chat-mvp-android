/**
 * 체크 셋 — 표제어마다 [처음 봄 | 다시 볼 것 | 앎] 하나, Logbank 사건 장부(logLedger.ts)에서 계산. 모델 없음, 이 폰의 사건만.
 *
 *   퀴즈에서 맞힘(고르기·쓰기·예문 없이 쓰기·맞나 틀리나·첫 측정)  → 앎. 확인 날짜는 없다 — 맞힌 것은 저절로 다시 내지 않는다.
 *   처음 봄에서 틀림                                               → 처음 봄 그대로(마지막 답이 틀림이라 다시 볼 것에)
 *   앎·다시 볼 것에서 틀림, 또는 답 뒤 [다시](r again)               → 다시 볼 것("hard")
 *
 * 통화·채팅·사람 대화(씀·틀림)는 체크 셋을 움직이지 않는다 — 앎은 퀴즈 답으로만, 대화는 말하기 쪽 기록.
 * 대화에서 막힌 것은 Quizbank 다시 볼 것(todayCards.ts stuckKeys)이 낸다.
 */
import type { LogEvent } from "./logLedger.ts";

export type CheckLevel = "new" | "hard" | "known";
export type CheckState = {
  level: CheckLevel;
  /** 마지막 사건 시각(초). */
  last: number;
};

/** 시각(초) → 그 폰 날짜(YYYY-MM-DD). 테스트는 UTC로 바꿔 넣을 수 있게 인자로. */
export function dayOfSeconds(t: number, offsetMinutes = new Date(t * 1000).getTimezoneOffset()): string {
  return new Date((t - offsetMinutes * 60) * 1000).toISOString().slice(0, 10);
}

const quizLike = (event: LogEvent) => event.src === "quiz" || event.src === "exam" || event.src === "judge";

/** 순수: 사건 하나를 받은 다음 체크 셋(stateOf·growthView가 같이 씀). */
export function stepState(prev: CheckState, event: LogEvent): CheckState {
  if (!quizLike(event) && event.r !== "look") return prev;
  const state: CheckState = { ...prev, last: event.t };
  if (event.r === "ok") return { ...state, level: "known" };
  if (event.r === "again") return { ...state, level: "hard" };
  if (event.r === "miss" && state.level !== "new") return { ...state, level: "hard" };
  return state;
}

/** 순수: 한 열쇠의 사건(시각 순)을 체크 셋 하나로. */
export function stateOf(events: readonly LogEvent[]): CheckState {
  let state: CheckState = { level: "new", last: 0 };
  for (const event of [...events].sort((a, b) => a.t - b.t)) state = stepState(state, event);
  return state;
}

/** 순수: 장부 전체 → 열쇠마다 체크 셋. */
export function checkStates(events: readonly LogEvent[]): Map<string, CheckState> {
  const byKey = new Map<string, LogEvent[]>();
  for (const event of events) {
    const list = byKey.get(event.k);
    if (list) list.push(event);
    else byKey.set(event.k, [event]);
  }
  const out = new Map<string, CheckState>();
  for (const [key, list] of byKey) out.set(key, stateOf(list));
  return out;
}

