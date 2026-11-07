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
import type { LogEvent } from "./logLedger.ts";

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
    // 같은 날 틀렸다가 맞힌 것은 맞힘이 나중(그날 끝 상태 = 맞힘, 2026-11-02 변경 감시) — 틀림을 먼저, 맞힘은 1밀리초 뒤.
    const typedWrong = new Set(one.wt ?? []);
    for (const key of one.wrong ?? []) {
      const miss = asMiss(one.miss?.[key]);
      add({ at, key, correct: false, source: "quiz", use: typedWrong.has(key), choose: !typedWrong.has(key), ...(miss ? { miss } : {}) });
    }
    for (const key of one.okc ?? []) {
      add({ at: at + 1, key, correct: true, source: "quiz", use: false, choose: true });
      seen.add(`${key}@${utcDay}`);
    }
    for (const key of one.okt ?? []) {
      add({ at: at + 1, key, correct: true, source: "quiz", use: true });
      seen.add(`${key}@${utcDay}`);
    }
  }

  // 익힘 기록: 맞힌 날마다 한 번(같은 날 Quizbank 칸에 이미 있으면 뺌) — 고르기로 어림.
  // r|틀은 꺼내 쓰기(만들어 냄). 은행 열쇠는 f|라서 그대로 두면 문장 활용이 빠진다.
  for (const [key, entry] of Object.entries(input.known)) {
    const produced = key.startsWith("r|");
    const bankKey = produced ? `f|${key.slice(2)}` : key;
    for (const utcDay of entry.days) {
      if (!produced && seen.has(`${bankKey}@${utcDay}`)) continue;
      add({ at: utcDay * DAY + NOON, key: bankKey, correct: true, source: produced ? "recall" : "quiz", use: produced, ...(produced ? {} : { choose: true }) });
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

/**
 * 개편(lib/reform.ts) Logbank 띠·육각형 재료 = 사건 장부(logbank.v1) — 오늘 카드·체크 셋·Quizbank와 같은 기록(2026-11-07 사용자 "데이터상 맞지 않는 것들도 빼줘").
 * 예전 재료(quizDays·익힘 기록 known·시험 checkups)는 같은 답이 장부에도 들어가 있어(퀴즈를 옮기고 같이 씀) 섞으면 두 번 센다 — 쓰지 않는다.
 * 장부에 없는 것만 더한다: 수업 결과(dayLog)·AI 채팅의 서버 기록(통화 몫은 장부 통화 정리가 이미 담음).
 */
export function ledgerFillEvents(input: { ledger: readonly LogEvent[]; results: readonly DayResult[]; items: readonly LogItem[]; language: string; segment: (text: string) => string[] }): FillEvent[] {
  const out: FillEvent[] = [];
  for (const event of input.ledger) {
    if (event.r === "look") continue;
    const at = event.t * 1000;
    const talk = event.src === "call" || event.src === "people";
    if (event.r === "used") {
      out.push({ at, key: event.k, correct: true, source: "free", use: true });
      continue;
    }
    const correct = event.r === "ok";
    if (talk) {
      out.push({ at, key: event.k, correct, source: correct ? "free" : "fix", use: true });
      continue;
    }
    const source: FillSource = event.src === "exam" ? "test" : event.src === "script" ? "lesson" : "quiz";
    const write = event.m === "write";
    out.push({ at, key: event.k, correct, source, use: write, ...(write ? {} : { choose: true }) });
  }
  const rest = fillEvents({
    language: input.language,
    known: {},
    quiz: {},
    results: input.results,
    items: input.items.filter((item) => item.where !== "call"),
    checkups: [],
    segment: input.segment,
  });
  return [...out, ...rest];
}
