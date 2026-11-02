/**
 * Logbank 주·월 정리(2026-11-02 사용자 "정기적으로 학습데이터를 정리해서 보여줬으면 — 월별, 혹은 주별로 얼마나, 뭘 학습했는지",
 * "Logbank에만", 보관 1년). 모델 없이 이미 있는 기록만 센다(순수):
 * - 서버 logItems(배움·숙지·고친 줄, /api/notebook logDays=366) — 무엇을 + 고친 수
 * - 이 폰 dayLog(수업·꺼내 쓰기·상황 결과)·quizDays(Quizbank 수)·callDays(통화 길이·다시 말해 맞힘, roleplay/callDays.ts)
 * 날은 "2026-11-2" 같은 그 폰의 날(localDay). 주는 월요일부터, 달은 1일부터.
 */
import { dayValue, weekOf, type QuizDays } from "./quizDays.ts";
import type { DayResult } from "./dayLog.ts";
import type { CallDay } from "../roleplay/callDays.ts";
import type { LogItem } from "../notes/stageParts.ts";

export type PeriodKind = "week" | "month";
export type Period = { kind: PeriodKind; start: string };

const DAY_MS = 24 * 60 * 60 * 1000;

function dayOfValue(value: number): string {
  const d = new Date(value);
  return `${d.getUTCFullYear()}-${d.getUTCMonth() + 1}-${d.getUTCDate()}`;
}

/** 그 날이 든 주·달. */
export function periodOf(kind: PeriodKind, day: string): Period {
  if (kind === "week") return { kind, start: weekOf(day) };
  const [y, m] = day.split("-").map(Number);
  return { kind, start: `${y}-${m}-1` };
}

/** n칸 앞·뒤 기간. */
export function shiftPeriod(period: Period, n: number): Period {
  if (period.kind === "week") return { kind: "week", start: dayOfValue(dayValue(period.start) + n * 7 * DAY_MS) };
  const [y, m] = period.start.split("-").map(Number);
  const total = (y ?? 1970) * 12 + ((m ?? 1) - 1) + n;
  return { kind: "month", start: `${Math.floor(total / 12)}-${(total % 12) + 1}-1` };
}

/** 기간 안에 든 날인가(끝은 다음 기간 시작 전). */
export function inPeriod(period: Period, day: string): boolean {
  const value = dayValue(day);
  return value >= dayValue(period.start) && value < dayValue(shiftPeriod(period, 1).start);
}

/** 화면에 보일 마지막 날(시작 · 끝 날짜 표시용). */
export function periodLastDay(period: Period): string {
  return dayOfValue(dayValue(shiftPeriod(period, 1).start) - DAY_MS);
}

export type PeriodSummary = {
  /** 무언가 공부한 날 수. */
  activeDays: number;
  calls: number;
  callMinutes: number;
  lessons: number;
  recalls: number;
  scripts: number;
  quizN: number;
  quizRight: number;
  /** 튜터가 고친 줄(채팅·통화, 서버 노트 카드). */
  fixed: number;
  /** 튜터 수업에서 다시 말해 맞힌 줄. */
  redone: number;
  /** 배우거나 익힌 소재 — 같은 소재는 하나(익힘이 앞섬), 익힘 먼저. */
  learned: LogItem[];
};

export function summarize(input: {
  period: Period;
  items: readonly LogItem[];
  results: readonly DayResult[];
  quiz: QuizDays;
  calls: readonly CallDay[];
  /** logItems의 at → 그 폰의 날. */
  dayOf: (at: number) => string;
}): PeriodSummary {
  const { period } = input;
  const active = new Set<string>();
  const items = input.items.filter((item) => inPeriod(period, input.dayOf(item.at)));
  const results = input.results.filter((one) => inPeriod(period, one.day));
  const calls = input.calls.filter((one) => inPeriod(period, one.day));
  let quizN = 0;
  let quizRight = 0;
  for (const [day, one] of Object.entries(input.quiz)) {
    if (!one?.n || !inPeriod(period, day)) continue;
    quizN += one.n;
    quizRight += one.right;
    active.add(day);
  }
  for (const item of items) active.add(input.dayOf(item.at));
  for (const one of results) active.add(one.day);
  for (const one of calls) active.add(one.day);
  const learned = new Map<string, LogItem>();
  for (const item of items) {
    if (item.kind === "fixed") continue;
    const id = `${item.part}|${item.node ?? item.text}`;
    const had = learned.get(id);
    if (!had || (item.kind === "mastered" && had.kind !== "mastered")) learned.set(id, item);
  }
  return {
    activeDays: active.size,
    calls: calls.length,
    callMinutes: Math.round(calls.reduce((sum, one) => sum + one.seconds, 0) / 60),
    lessons: results.filter((one) => one.kind === "lesson").length,
    recalls: results.filter((one) => one.kind === "recall").length,
    scripts: results.filter((one) => one.kind === "script").length,
    quizN,
    quizRight,
    fixed: items.filter((item) => item.kind === "fixed").length,
    redone: calls.reduce((sum, one) => sum + one.redone, 0),
    learned: [...learned.values()].sort((a, b) => (a.kind === b.kind ? b.at - a.at : a.kind === "mastered" ? -1 : 1)),
  };
}
