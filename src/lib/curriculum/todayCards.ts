/**
 * Logbank "오늘" 한 칸(2026-11-09 사용자 "막힌 것·다시 학습·새로 학습을 꼭 알려 줘야 하나" → "합쳐줘, 써 보기는 없애줘").
 * 갈래 이름 없이 ▶ Quizbank 하나 — 무엇을 낼지는 Quizbank가 reviewKeys(아래) 순서로 다시 볼 것과 새 묶음을 번갈아 낸다.
 * 오늘 끝(✓) = 오늘 퀴즈로 답한 서로 다른 열쇠가 TODAY_GOAL 이상. 모델 없음, 이 폰의 장부(logLedger.ts)·체크 셋(checkState.ts)만.
 */
import type { LogEvent } from "./logLedger.ts";
import type { CheckState } from "./checkState.ts";

export type CardPart = "word" | "expression" | "grammar" | "frame";

const DAY = 24 * 60 * 60;
/** 오늘 끝으로 보는 답한 열쇠 수(퀴즈 한 판). */
export const TODAY_GOAL = 10;

export function partOf(key: string): CardPart | null {
  if (key.startsWith("w|")) return "word";
  if (key.startsWith("e|")) return "expression";
  if (key.startsWith("g|")) return "grammar";
  if (key.startsWith("f|")) return "frame";
  return null;
}

const quizLike = (event: LogEvent) => event.src === "quiz" || event.src === "exam" || event.src === "judge";

/** 순수: 오늘(dayOf가 today인 날) 퀴즈로 답한 서로 다른 열쇠 수. */
export function answeredToday(events: readonly LogEvent[], today: string, dayOf: (t: number) => string): number {
  const keys = new Set<string>();
  for (const event of events) if (quizLike(event) && (event.r === "ok" || event.r === "miss") && dayOf(event.t) === today) keys.add(event.k);
  return keys.size;
}

/** 순수: 지난 7일 통화·채팅·사람 대화에서 틀렸는데 그 뒤 퀴즈로 맞힌 적 없는 열쇠(최근 것부터). */
export function stuckKeys(events: readonly LogEvent[], now: number): string[] {
  const weekAgo = now - 7 * DAY;
  const lastTalkMiss = new Map<string, number>();
  for (const event of events) {
    if (event.t < weekAgo || event.r !== "miss" || (event.src !== "call" && event.src !== "people" && event.src !== "chat")) continue;
    if (!partOf(event.k)) continue;
    lastTalkMiss.set(event.k, Math.max(lastTalkMiss.get(event.k) ?? 0, event.t));
  }
  return [...lastTalkMiss]
    .filter(([key, at]) => !events.some((event) => event.k === key && quizLike(event) && event.r === "ok" && event.t > at))
    .sort((a, b) => b[1] - a[1])
    .map(([key]) => key);
}

/**
 * Quizbank의 다시 볼 것(장부·체크 셋에서): 대화에서 막힌 것 → 다시 볼 것(앎에서 틀림·[다시] — 오늘 아직 안 푼 것, 그래서 다음 날부터)
 * → 마지막 답이 틀린 처음 봄. 맞힌 것은 저절로 다시 내지 않는다(확인 날짜 없음).
 */
/** 처음 본 것을 틀린 뒤 다시 낼 때까지(초). */
export const MISS_GAP_SECONDS = 60 * 60;

export function reviewKeys(input: { events: readonly LogEvent[]; states: ReadonlyMap<string, CheckState>; now: number; today: (t: number) => string }): string[] {
  const { events, states, now } = input;
  const out: string[] = [];
  const add = (key: string) => {
    if (partOf(key) && !out.includes(key)) out.push(key);
  };
  for (const key of stuckKeys(events, now)) add(key);
  const lastQuiz = new Map<string, LogEvent>();
  for (const event of events) if (quizLike(event) && (lastQuiz.get(event.k)?.t ?? -1) <= event.t) lastQuiz.set(event.k, event);
  const today = input.today(now);
  const byLast = [...states].sort((a, b) => a[1].last - b[1].last);
  for (const [key, state] of byLast) {
    if (state.level !== "hard") continue;
    const last = lastQuiz.get(key);
    if (!last || input.today(last.t) !== today) add(key);
  }
  // 처음 본 것을 틀림: 한 시간은 지나서(2026-11-10 구성 고치기 — 첫 측정에서 틀린 것이 몇 분 뒤 같은 문제로, 기억으로 고름).
  for (const [key, state] of byLast) {
    const last = lastQuiz.get(key);
    if (state.level === "new" && last?.r === "miss" && now - last.t >= MISS_GAP_SECONDS) add(key);
  }
  return out;
}
