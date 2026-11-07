/**
 * Logbank "배운 것"·학습 곡선(개편, 2026-11-07 사용자 "학습한 게 확실하게 보이게 — 푼 퀴즈는 목록(단어 n개, 문법 n개), 각 카드를 보여주고,
 * 통화학습은 이미 있는 통화 결과창, 일일학습이 모이면 학습곡선(요소별 학습량·점수 변화)"). 재료는 사건 장부(logLedger.ts)뿐, 순수 모듈.
 *
 * - 푼 것 = 고른 기간 안에 퀴즈·시험·대본에서 답한 열쇠(찾아봄·통화는 빼고 — 통화는 통화 결과창으로 따로).
 * - 곡선 = 날마다 그 요소의 답한 수(학습량)와 맞힌 비율(점수, 답 MIN_SCORE개 이상인 날만). 답한 날이 CURVE_MIN_DAYS 이상일 때만 그린다.
 */
import type { LogEvent } from "./logLedger.ts";
import { partOf, type CardPart } from "./todayCards.ts";

export const LEARN_PARTS: readonly CardPart[] = ["word", "grammar", "expression", "frame"];
export const CURVE_MIN_DAYS = 2;
export const MIN_SCORE = 3;

export type LearnedItem = { key: string; ok: number; miss: number; last: number; lastOk: boolean };
export type CurvePoint = { day: string; n: number; ok: number; score: number | null };

const answered = (event: LogEvent) => (event.src === "quiz" || event.src === "exam" || event.src === "script") && (event.r === "ok" || event.r === "miss");

/** 기간(그 폰 날짜 inDay가 참인 날) 안에 답한 열쇠를 요소별로 — 마지막에 푼 것부터. */
export function learnedIn(events: readonly LogEvent[], inDay: (t: number) => boolean): Record<CardPart, LearnedItem[]> {
  const by = new Map<string, LearnedItem>();
  for (const event of events) {
    if (!answered(event) || !partOf(event.k) || !inDay(event.t)) continue;
    const one = by.get(event.k) ?? { key: event.k, ok: 0, miss: 0, last: 0, lastOk: false };
    if (event.r === "ok") one.ok += 1;
    else one.miss += 1;
    if (event.t >= one.last) {
      one.last = event.t;
      one.lastOk = event.r === "ok";
    }
    by.set(event.k, one);
  }
  const out = { word: [], grammar: [], expression: [], frame: [] } as Record<CardPart, LearnedItem[]>;
  for (const one of [...by.values()].sort((a, b) => b.last - a.last)) out[partOf(one.key)!].push(one);
  return out;
}

/** 날마다 그 요소(null = 모두)의 답한 수·맞힌 수·맞힌 비율. days는 그릴 날짜(오래된 것부터), dayOf는 시각(초) → 그 폰 날짜. */
export function curveOf(events: readonly LogEvent[], days: readonly string[], part: CardPart | null, dayOf: (t: number) => string): CurvePoint[] {
  const at = new Map(days.map((day, i) => [day, i]));
  const n = days.map(() => 0);
  const ok = days.map(() => 0);
  for (const event of events) {
    if (!answered(event)) continue;
    const p = partOf(event.k);
    if (!p || (part && p !== part)) continue;
    const i = at.get(dayOf(event.t));
    if (i === undefined) continue;
    n[i]! += 1;
    if (event.r === "ok") ok[i]! += 1;
  }
  return days.map((day, i) => ({ day, n: n[i]!, ok: ok[i]!, score: n[i]! >= MIN_SCORE ? ok[i]! / n[i]! : null }));
}

/** 곡선을 그릴 만큼 모였나(답한 날이 둘 이상). */
export function curveReady(points: readonly CurvePoint[]): boolean {
  return points.filter((point) => point.n > 0).length >= CURVE_MIN_DAYS;
}
