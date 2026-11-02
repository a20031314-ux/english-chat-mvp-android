/**
 * 지금 있는 기록 → 채우기 증거(curriculum/fill.ts FillEvent·CallTurns, 2026-11-02 hub/drafts/fill-gauge-2026-11-02.md 11절 "기록 → 꼭짓점").
 * Logbank가 이미 받는 재료만 쓴다 — 서버 logItems(배움·익힘·고침)·익힘 기록 known(맞힌 날)·시험 결과 checkups·이 폰의 Quizbank 날마다(quizDays)·
 * 수업 결과(dayLog)·통화 숫자(callDays). 순수 모듈, 모델 없음.
 */
import type { CheckResult } from "./checkup.ts";
import type { DayResult } from "./dayLog.ts";
import type { CallTurns, FillEvent, FillSource } from "./fill.ts";
import type { KnownMap } from "./known.ts";
import { grammarKeyOfNode, expressionKeyOf } from "./lessonKey.ts";
import { missKindOf, MISS_KINDS, type MissKind } from "./missKind.ts";
import { dayValue, type QuizDays } from "./quizDays.ts";
import type { CallDay } from "../roleplay/callDays.ts";
import type { LogItem } from "../notes/stageParts.ts";

const DAY = 86_400_000;
const NOON = DAY / 2;

export type FillSources = {
  language: string;
  known: KnownMap;
  quiz: QuizDays;
  results: readonly DayResult[];
  items: readonly LogItem[];
  checkups: readonly CheckResult[];
  /** 낱말로 자르기(wordSegments — ja·zh·th 포함). */
  segment: (text: string) => string[];
};

const asMiss = (value: string | undefined): MissKind | undefined => (MISS_KINDS.includes(value as MissKind) ? (value as MissKind) : undefined);

export function fillEvents(input: FillSources): FillEvent[] {
  const out: FillEvent[] = [];
  const seen = new Set<string>();
  const add = (event: FillEvent) => out.push(event);

  // Quizbank 날마다: 2026-11-02부터는 고르기·쓰기로 나뉨(okc·okt·wt), 그 전 날은 틀린 열쇠만(고르기로 어림).
  for (const [day, one] of Object.entries(input.quiz)) {
    const at = dayValue(day) + NOON;
    const utcDay = Math.floor(dayValue(day) / DAY);
    for (const key of one.okc ?? []) {
      add({ at, key, correct: true, source: "quiz", use: false, choose: true });
      seen.add(`${key}@${utcDay}`);
    }
    for (const key of one.okt ?? []) {
      add({ at, key, correct: true, source: "quiz", use: true });
      seen.add(`${key}@${utcDay}`);
    }
    const typedWrong = new Set(one.wt ?? []);
    for (const key of one.wrong ?? []) {
      const miss = asMiss(one.miss?.[key]);
      add({ at, key, correct: false, source: "quiz", use: typedWrong.has(key), choose: !typedWrong.has(key), ...(miss ? { miss } : {}) });
    }
  }

  // 익힘 기록: 맞힌 날마다 한 번(같은 날 Quizbank 칸에 이미 있으면 뺌) — 고르기로 어림.
  for (const [key, entry] of Object.entries(input.known)) {
    for (const utcDay of entry.days) {
      if (seen.has(`${key}@${utcDay}`)) continue;
      add({ at: utcDay * DAY + NOON, key, correct: true, source: "quiz", use: false, choose: true });
    }
  }

  // 시험에서 틀린 열쇠.
  for (const result of input.checkups) {
    for (const key of result.wrong ?? []) add({ at: result.at, key, correct: false, source: "test", use: false, choose: true });
  }

  // 수업·꺼내 쓰기·상황 결과 = 만들어 냄(시켜서).
  for (const result of input.results) {
    const key = result.key ?? (result.kind === "lesson" ? `f|${result.item}` : undefined);
    if (!key) continue;
    const source: FillSource = result.kind === "recall" ? "recall" : "lesson";
    const correct = result.passed ?? (result.total > 0 && result.right / result.total >= 0.7);
    add({ at: result.at, key, correct, source, use: true });
  }

  // 서버 기록: 채팅·통화에서 스스로 씀(익힘 = 맞게 씀, 배움 = 처음 써 봄) · 튜터 고침(고친 줄에 새로 든 낱말·그 문법 칸이 틀림).
  for (const item of input.items) {
    if (item.kind === "fixed") {
      const given = input.segment(item.text);
      const right = item.right ? input.segment(item.right) : [];
      const miss = right.length ? missKindOf(given, right) : undefined;
      const keys = new Set<string>();
      const grammar = grammarKeyOfNode(input.language, item.node);
      if (grammar) keys.add(grammar);
      const had = new Set(given.map((word) => word.toLocaleLowerCase()));
      for (const word of right) if (/[\p{L}]/u.test(word) && !had.has(word.toLocaleLowerCase())) keys.add(`w|${word.toLocaleLowerCase()}`);
      for (const key of keys) add({ at: item.at, key, correct: false, source: "fix", use: true, ...(miss ? { miss } : {}) });
      continue;
    }
    const free = item.where === "chat" || item.where === "call";
    if (!free) continue;
    const key = item.part === "grammar" ? grammarKeyOfNode(input.language, item.node) : item.part === "vocab" ? `w|${item.text.toLocaleLowerCase()}` : expressionKeyOf(input.language, item.text);
    if (!key) continue;
    add({ at: item.at, key, correct: true, source: item.kind === "mastered" ? "free" : "lesson", use: true });
  }
  return out;
}

/** 통화 숫자 줄 → 육각형 듣기·실전 대화 재료(차례 셈이 있는 통화만 — 2026-11-02부터). */
export function callTurnsOf(rows: readonly CallDay[]): CallTurns[] {
  return rows.flatMap((row) => (row.turns ? [{ at: row.at, ...row.turns }] : []));
}
