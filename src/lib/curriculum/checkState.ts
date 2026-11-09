/**
 * 체크 셋 — 표제어마다 [처음 봄 | 적용이 힘듦 | 앎] 하나, Logbank 사건 장부(logLedger.ts)에서 계산(개편 3단계 2026-11-06,
 * 설계 hub/work/drafts/logbank-2026-11-06.md 3절 · languagebank-2026-11-03.md). 모델 없음, 이 폰의 사건만.
 *
 *   처음 봄       고르기 맞음·찾아봄은 그대로 · 쓰기 맞음 → 적용이 힘듦
 *   적용이 힘듦   다른 날 쓰기 맞음 → 앎
 *   앎            확인(1·3·7·30일)에서 틀림, 맞나 틀리나 틀림 → 적용이 힘듦(처음 봄으로는 안 내림)
 *   맞나 틀리나(src judge)에서 틀린 곳을 짚음 = 쓰기 맞음과 같게(m write).
 *
 * 통화·채팅·사람 대화(씀·틀림)는 체크 셋을 움직이지 않는다(2026-11-09 사용자 "알고있는 어휘와 말하기(실제 출력)를 분리" —
 * 앎은 퀴즈 답으로만, 대화는 말하기 쪽 기록). 대화에서 막힌 것은 오늘 카드 ②(todayCards.ts)가 다시 낸다.
 * 그 전에는 대화 "씀"이 한 단계 올리고(USED_LIFTS) 대화 틀림이 앎을 내렸다.
 */
import type { LogEvent } from "./logLedger.ts";

export type CheckLevel = "new" | "hard" | "known";
export type CheckState = {
  level: CheckLevel;
  /** 앎이 된 시각(초) — 확인 단계 기준. */
  knownAt?: number;
  /** 앎 뒤 확인을 몇 번 통과했나(0 = 첫 확인 전). */
  step: number;
  /** 다음 확인 시각(초) — 앎일 때만. */
  due?: number;
  /** 마지막 사건 시각(초). */
  last: number;
  /** 적용이 힘듦이 된 날(그날 다시 쓰기 맞음은 앎으로 안 셈). */
  hardDay?: string;
};

export const CHECK_DAYS = [1, 3, 7, 30] as const;
const DAY = 24 * 60 * 60;

/** 시각(초) → 그 폰 날짜(YYYY-MM-DD). 테스트는 UTC로 바꿔 넣을 수 있게 인자로. */
export function dayOfSeconds(t: number, offsetMinutes = new Date(t * 1000).getTimezoneOffset()): string {
  return new Date((t - offsetMinutes * 60) * 1000).toISOString().slice(0, 10);
}

function knownNow(t: number, step = 0): Pick<CheckState, "level" | "knownAt" | "step" | "due"> {
  return { level: "known", knownAt: t, step, due: t + CHECK_DAYS[Math.min(step, CHECK_DAYS.length - 1)]! * DAY };
}

/** 순수: 사건 하나를 받은 다음 체크 셋(stateOf·learnedAt이 같이 씀). */
export function stepState(prev: CheckState, event: LogEvent, dayOf: (t: number) => string = (t) => dayOfSeconds(t)): CheckState {
  const talk = event.src === "call" || event.src === "people" || event.src === "chat";
  if (talk) return prev;
  let state: CheckState = { ...prev, last: event.t };
  if (event.r === "look") return state;
  const write = event.m === "write" || event.m === "sure";
  if (state.level === "new") {
    // 어림이 높은 처음 본 말을 예문 없이 써서 맞힘 = 바로 알아요, 첫 확인은 3일 뒤(2026-11-08 사용자 "첫 답이 단계를 정하게").
    if (event.r === "ok" && event.m === "sure") return { ...state, ...knownNow(event.t, 1) };
    if (event.r === "ok" && write) state = { ...state, level: "hard", hardDay: dayOf(event.t) };
    return state;
  }
  if (state.level === "hard") {
    const otherDay = dayOf(event.t) !== state.hardDay;
    if (event.r === "ok" && write && (otherDay || event.m === "sure")) state = { ...state, ...knownNow(event.t) };
    return state;
  }
  // 앎
  if (event.r === "miss" && (event.src === "quiz" || event.src === "exam" || event.src === "judge")) return { level: "hard", step: 0, last: event.t, hardDay: dayOf(event.t) };
  if (event.r === "ok" && state.due !== undefined && event.t >= state.due) {
    // 확인 때가 지나 다시 맞힘 = 다음 확인으로.
    const step = state.step + 1;
    state = { ...state, step, due: step >= CHECK_DAYS.length ? undefined : event.t + CHECK_DAYS[step]! * DAY };
  }
  return state;
}

/** 순수: 한 열쇠의 사건(시각 순)을 체크 셋 하나로. */
export function stateOf(events: readonly LogEvent[], dayOf: (t: number) => string = (t) => dayOfSeconds(t)): CheckState {
  let state: CheckState = { level: "new", step: 0, last: 0 };
  for (const event of [...events].sort((a, b) => a.t - b.t)) state = stepState(state, event, dayOf);
  return state;
}

/** 순수: 장부 전체 → 열쇠마다 체크 셋. */
export function checkStates(events: readonly LogEvent[], dayOf?: (t: number) => string): Map<string, CheckState> {
  const byKey = new Map<string, LogEvent[]>();
  for (const event of events) {
    const list = byKey.get(event.k);
    if (list) list.push(event);
    else byKey.set(event.k, [event]);
  }
  const out = new Map<string, CheckState>();
  for (const [key, list] of byKey) out.set(key, stateOf(list, dayOf));
  return out;
}

/** 확인할 때가 된 앎 열쇠(오래 기다린 것부터). */
export function dueKeys(states: ReadonlyMap<string, CheckState>, now: number): string[] {
  return [...states]
    .filter(([, state]) => state.level === "known" && state.due !== undefined && state.due <= now)
    .sort((a, b) => (a[1].due ?? 0) - (b[1].due ?? 0))
    .map(([key]) => key);
}

/**
 * 개편 퀴즈 카드에서 가릴 칸(quiz.ts cardQuiz, 2026-11-06): 맞힌 적 있으면 낱말 가림(쓰기),
 * 사전에서 찾아본 뒤 아직 안 풀었어도 낱말 가림 — 막 본 뜻을 고르게 하면 너무 쉬워서(사용자 "만들어줘", 찾아본 뒤 첫 퀴즈는 쓰기).
 * 그 밖(처음 봄)은 뜻 가림(고르기).
 */
export function cardFaces(events: readonly LogEvent[]): (key: string) => "hide" | "show" {
  const ok = new Set<string>();
  const lastLook = new Map<string, number>();
  const lastQuiz = new Map<string, number>();
  for (const event of events) {
    // 퀴즈 답만 — 대화에서 쓴 것(used)은 말하기 쪽이라 문제 모양을 안 바꿈(2026-11-09 앎·말하기 분리, 그 전엔 used도 쓰기로).
    if (event.r === "ok") ok.add(event.k);
    if (event.r === "look") lastLook.set(event.k, Math.max(lastLook.get(event.k) ?? 0, event.t));
    if (event.src === "quiz" || event.src === "exam") lastQuiz.set(event.k, Math.max(lastQuiz.get(event.k) ?? 0, event.t));
  }
  return (key) => (ok.has(key) || (lastLook.get(key) ?? -1) > (lastQuiz.get(key) ?? -1) ? "show" : "hide");
}
