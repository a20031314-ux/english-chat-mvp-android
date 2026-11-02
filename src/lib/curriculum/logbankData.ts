/**
 * Logbank 그림 자료(2026-11-02 사용자 "층위가 모호해서 난잡 — 기준을 하나로 정해. 문법·어휘·표현·학습시간 등으로.
 * 각 탭에서 학습한 걸 하나로 모은 걸 자료로 보여 주고, 누르면 세부(스크린샷·학습 내용)"):
 * 기준 하나(⏱ 학습 시간 · 📐 문법 · 🔤 어휘 · 💬 표현)를 고르면 그 기간 날마다 막대 + 그 기준으로 모은 소재 목록.
 * 재료는 Logbank가 이미 받는 것 그대로 — 서버 logItems(배움·익힘·고침, 어디서 했는지 where) · 이 폰의 수업 결과(dayLog) ·
 * Quizbank 날마다 수(quizDays, 갈래별 수는 2026-11-02부터) · 통화(callDays). 순수 함수만(화면은 studyMap/Logbank).
 */
import type { LogItem } from "../notes/stageParts.ts";
import { isWordish } from "../notes/stageParts.ts";
import type { DayResult } from "./dayLog.ts";
import { inPeriod, periodLastDay, type Period } from "./periodSummary.ts";
import { dayValue, type QuizDays } from "./quizDays.ts";
import type { CallDay } from "../roleplay/callDays.ts";

export type Basis = "time" | "grammar" | "vocab" | "expression";
export type PartBasis = Exclude<Basis, "time">;
export const BASES: Basis[] = ["time", "grammar", "vocab", "expression"];

/** 시간을 따로 재지 않던 기록의 어림(분): 수업 하나·꺼내 쓰기·대본 내 줄 하나·퀴즈 한 문제. */
export const ESTIMATE = { lesson: 4, recall: 3, scriptLine: 0.5, quizQuestion: 1 / 3 } as const;

/** 퀴즈·수업 열쇠 → 갈래(f|·g| 문법, w| 어휘, e| 짧으면 어휘 아니면 표현 — notes/myParts stageKeyMap과 같은 셈). */
export function partOfKey(language: string, key: string): PartBasis | null {
  if (key.startsWith("f|") || key.startsWith("g|")) return "grammar";
  if (key.startsWith("w|")) return "vocab";
  if (key.startsWith("e|")) return isWordish(key.slice(2), language) ? "vocab" : "expression";
  return null;
}

/** 수업 결과의 갈래: 열쇠가 남아 있으면 그것으로, 예전 결과(열쇠 없음)는 문장구조 수업·꺼내 쓰기 = 문법, 대본 = 표현. */
export function partOfResult(language: string, result: DayResult): PartBasis {
  if (result.key) return partOfKey(language, result.key) ?? "grammar";
  return result.kind === "script" ? "expression" : "grammar";
}

/** 수업 결과 하나에 든 시간(분) — 잰 것이 있으면 그것, 없으면 어림. */
export function resultMinutes(result: DayResult): number {
  if (result.secs && result.secs > 0) return result.secs / 60;
  if (result.kind === "lesson") return ESTIMATE.lesson;
  if (result.kind === "recall") return ESTIMATE.recall;
  return Math.max(1, result.total * ESTIMATE.scriptLine);
}

export function periodDays(period: Period): string[] {
  const out: string[] = [];
  const last = dayValue(periodLastDay(period));
  for (let value = dayValue(period.start); value <= last; value += 86_400_000) {
    const d = new Date(value);
    out.push(`${d.getUTCFullYear()}-${d.getUTCMonth() + 1}-${d.getUTCDate()}`);
  }
  return out;
}

export type LogInputs = {
  language: string;
  items: readonly LogItem[];
  results: readonly DayResult[];
  quiz: QuizDays;
  calls: readonly CallDay[];
  dayOf: (at: number) => string;
};

/** 막대 하나의 칸 — 시간이면 [통화, 수업, 퀴즈](분), 갈래면 [익힘, 배움, 틀림·고침](수). */
export type Bar = { day: string; parts: [number, number, number] };

export function bars(period: Period, basis: Basis, input: LogInputs): Bar[] {
  const days = periodDays(period);
  const at = new Map(days.map((day, i) => [day, i]));
  const out: Bar[] = days.map((day) => ({ day, parts: [0, 0, 0] }));
  const add = (day: string, slot: 0 | 1 | 2, n: number) => {
    const i = at.get(day);
    if (i !== undefined) out[i]!.parts[slot] += n;
  };
  if (basis === "time") {
    for (const call of input.calls) add(call.day, 0, call.seconds / 60);
    for (const result of input.results) add(result.day, 1, resultMinutes(result));
    for (const [day, one] of Object.entries(input.quiz)) if (one?.n) add(day, 2, one.n * ESTIMATE.quizQuestion);
    for (const bar of out) bar.parts = bar.parts.map((n) => Math.round(n * 10) / 10) as Bar["parts"];
    return out;
  }
  const rows = partRows(period, basis, input);
  for (const row of rows) {
    for (const event of row.events) {
      if (event.kind === "mastered") add(event.day, 0, 1);
      else if (event.kind === "learned") add(event.day, 1, 1);
      else if (event.kind === "result") add(event.day, event.result?.passed ? 0 : 2, 1);
      else add(event.day, 2, 1);
    }
  }
  return out;
}

/** 한 소재가 그 기간에 나온 일 하나(세부 화면의 한 줄). */
export type LogEvent = {
  day: string;
  at: number;
  kind: "learned" | "mastered" | "fixed" | "result" | "quizWrong";
  /** 어디서(채팅·통화·대본 등 — LogItem where, 수업 결과면 lesson·recall·script, 퀴즈면 quiz). */
  where: string;
  /** 고침: 내가 쓴 줄 → 고친 줄. */
  text?: string;
  right?: string;
  result?: DayResult;
};

/** 기준(갈래)으로 모은 소재 하나 — 화면의 목록 한 줄. */
export type PartRow = {
  id: string;
  /** 문법 칸 id(앱이 이름으로) · 열쇠 · 글. */
  node?: string;
  key?: string;
  text: string;
  status: "mastered" | "learned" | "missed";
  events: LogEvent[];
  lastAt: number;
};

export function partRows(period: Period, part: PartBasis, input: LogInputs): PartRow[] {
  const rows = new Map<string, PartRow>();
  const rowOf = (id: string, seed: Omit<PartRow, "id" | "events" | "status" | "lastAt">): PartRow => {
    const have = rows.get(id);
    if (have) return have;
    const fresh: PartRow = { id, ...seed, status: "learned", events: [], lastAt: 0 };
    rows.set(id, fresh);
    return fresh;
  };
  const push = (row: PartRow, event: LogEvent) => {
    row.events.push(event);
    row.lastAt = Math.max(row.lastAt, event.at);
  };
  for (const item of input.items) {
    if (item.part !== part) continue;
    const day = input.dayOf(item.at);
    if (!inPeriod(period, day)) continue;
    if (item.kind === "fixed") {
      // 고친 줄은 줄마다 한 줄(같은 줄이 여러 갈래에 두 번 오던 것은 하나로).
      const row = rowOf(`x|${item.text}\u0000${item.right ?? ""}`, { text: item.right || item.text });
      if (!row.events.some((one) => one.kind === "fixed")) push(row, { day, at: item.at, kind: "fixed", where: String(item.where ?? ""), text: item.text, right: item.right });
      continue;
    }
    const row = rowOf(`${part}|${item.node ?? item.text}`, { text: item.text, ...(item.node ? { node: item.node } : {}) });
    push(row, { day, at: item.at, kind: item.kind, where: String(item.where ?? "") });
  }
  for (const result of input.results) {
    if (!inPeriod(period, result.day) || partOfResult(input.language, result) !== part) continue;
    const key = result.key ?? (result.kind === "lesson" ? `f|${result.item}` : undefined);
    const row = rowOf(key ? `k|${key}` : `r|${result.kind}|${result.item}`, { text: result.title, ...(key ? { key } : {}) });
    push(row, { day: result.day, at: result.at, kind: "result", where: result.kind, result });
  }
  for (const [day, one] of Object.entries(input.quiz)) {
    if (!inPeriod(period, day)) continue;
    for (const key of one?.wrong ?? []) {
      if (partOfKey(input.language, key) !== part) continue;
      const row = rowOf(`k|${key}`, { text: key.slice(2), key });
      push(row, { day, at: dayValue(day), kind: "quizWrong", where: "quiz" });
    }
  }
  for (const row of rows.values()) {
    row.events.sort((a, b) => b.at - a.at);
    const latest = row.events[0];
    row.status = row.events.some((one) => one.kind === "mastered") || row.events.some((one) => one.kind === "result" && one.result?.passed)
      ? "mastered"
      : latest && (latest.kind === "fixed" || latest.kind === "quizWrong" || (latest.kind === "result" && !latest.result?.passed))
        ? "missed"
        : "learned";
  }
  const rank = { missed: 0, learned: 1, mastered: 2 } as const;
  // 틀린 것 먼저(다시 볼 것), 그다음 배운 것, 익힌 것 — 같으면 최근 것 먼저.
  return [...rows.values()].sort((a, b) => rank[a.status] - rank[b.status] || b.lastAt - a.lastAt);
}

/** 기준 머리의 합: 시간이면 분, 갈래면 소재 수와 익힘 수. */
export function totals(period: Period, basis: Basis, input: LogInputs): { minutes?: number; rows?: number; mastered?: number; missed?: number } {
  if (basis === "time") {
    const sum = bars(period, "time", input).reduce((n, bar) => n + bar.parts[0] + bar.parts[1] + bar.parts[2], 0);
    return { minutes: Math.round(sum) };
  }
  const rows = partRows(period, basis, input);
  return { rows: rows.length, mastered: rows.filter((row) => row.status === "mastered").length, missed: rows.filter((row) => row.status === "missed").length };
}
