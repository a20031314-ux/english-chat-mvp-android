/**
 * 대화 비교(2026-11-07 사용자 "구사 문장의 길이·단어 수준·대화 소재를 실제 대화로" → 밤 "같거나 비슷한 튜터 질문에 대한 대답,
 * 같은 시간 내 총 대화량" · "사용한 표현이나 문법 요소가 많아지는가(단순 단어 조합에서 뭘 활용할지 아는가)" → "진행해줘"). 순수 모듈.
 *
 * 자유대화 한 통에서(문장 없이 숫자만 callNotes에):
 *   처음 3분(첫 줄 시각부터 VOLUME_MS) — 내가 말한 낱말 수 · 내 말의 몫(내 낱말 ÷ 둘의 낱말). 줄 시각(at)이 없는 옛 기록은 없음.
 *   처음 TALK_TURNS줄(내 줄) — 줄당 낱말 · 2단계 이상 낱말 몫 · 고쳐진 줄 몫 · 내가 물은 줄 수 ·
 *   문형이 든 줄 몫(고쳐지지 않은 줄 중 문법·문장구조·표현이 하나라도 든 것) · 쓴 문법·표현 가짓수 · 가장 높은 단계.
 *   문법은 통화 끝 튜터 메모 호출의 표시(talkTags.ts uses) + 지금 감지기(recap.ts — 문장구조 틀·표현).
 * 비교 = 처음 COMPARE_CALLS통 vs 최근 COMPARE_CALLS통(READY_CALLS통부터). 칸마다 기준만큼 나아졌는지 보고, 많이 나아진(기준의 몇 배) 셋까지.
 * 같은 질문 짝(answers)·처음 쓴 것(firstUses)은 문장이라 이 폰에만 따로(talkMemory.ts).
 */
import { segmentWords } from "../wordSegments.ts";
import { posGroup, type BankWord } from "../curriculum/vocabBank.ts";
import type { TranscriptLine } from "./review.ts";

export const TALK_TURNS = 8;
export const VOLUME_MS = 3 * 60_000;
export const COMPARE_CALLS = 3;
export const READY_CALLS = 5;
export const SHOWN_ROWS = 3;
/** 소재 id — Quizbank 주제(vocabBank TOPICS) 가운데 대화 소재가 되는 것. 이름은 copy topic*. */
export const TALK_TOPICS = ["people", "food", "home", "work", "health", "travel", "shopping", "time", "feelings", "nature", "society"] as const;
export type TalkTopic = (typeof TALK_TOPICS)[number];

export type TalkStats = {
  /** 센 내 줄 수. */
  n: number;
  /** 줄당 낱말 수 평균. */
  words: number;
  /** 2단계 이상 낱말 몫(0~1, 빈도 목록에 있는 내용어 중). */
  level: number;
  /** 고쳐진 줄 몫(0~1). */
  fixed: number;
  /** 내가 물은 줄 수. */
  asked: number;
  /** 처음 3분 내 낱말 수 · 내 말의 몫(0~1). 줄 시각이 없으면 없음. */
  mine3?: number;
  share?: number;
  /** 문형이 든 줄 몫(0~1) · 쓴 문법·표현 가짓수 · 가장 높은 단계(0 = 없음) — 표시가 온 통화만. */
  shaped?: number;
  kinds?: number;
  top?: number;
};

const QUESTION = /[?？؟]\s*$/u;
const LETTER = /\p{L}/u;

const countWords = (language: string, text: string) => segmentWords(text, language).filter((token) => LETTER.test(token)).length;
const isFixed = (line: TranscriptLine) => {
  const right = (line.meant || line.better || "").trim();
  return Boolean(right && right !== line.text.trim());
};
const spoken = (line: TranscriptLine) => Boolean(line.text.trim()) && line.text.trim() !== "…";

/** 그 통화 처음 TALK_TURNS줄(내 줄)만. 받아쓰기가 비거나 "…"인 줄은 뺌. */
export function firstLines(lines: readonly TranscriptLine[]): TranscriptLine[] {
  return lines.filter((line) => line.who === "learner" && spoken(line)).slice(0, TALK_TURNS);
}

/** 처음 3분: 내 낱말 수 · 몫. 줄 시각이 없으면 null. */
export function volumeOf(language: string, lines: readonly TranscriptLine[]): { mine3: number; share: number } | null {
  const timed = lines.filter((line) => typeof line.at === "number" && spoken(line));
  if (!timed.length) return null;
  const start = timed[0]!.at!;
  let mine = 0;
  let all = 0;
  for (const line of timed) {
    if (line.at! - start > VOLUME_MS) break;
    const n = countWords(language, line.text);
    all += n;
    if (line.who === "learner") mine += n;
  }
  return { mine3: mine, share: all ? mine / all : 0 };
}

/** bank = 빈도 목록 차례(앞이 흔함), cut1 = 1단계 끝 순위(vocabBank stageCuts[0]). 내 줄이 셋 아래면 null. */
export function talkStatsOf(language: string, lines: readonly TranscriptLine[], bank: readonly BankWord[], cut1: number): TalkStats | null {
  const mine = firstLines(lines);
  if (mine.length < 3) return null;
  const rank = new Map<string, number>();
  bank.forEach((word, i) => {
    const w = word.w.toLocaleLowerCase();
    if (!rank.has(w) && posGroup(word.pos) !== "function") rank.set(w, i);
  });
  let words = 0;
  let known = 0;
  let high = 0;
  for (const line of mine) {
    const tokens = segmentWords(line.text, language).filter((token) => LETTER.test(token));
    words += tokens.length;
    for (const token of tokens) {
      const r = rank.get(token.toLocaleLowerCase().replace(/[^\p{L}\p{M}\p{N}'-]/gu, ""));
      if (r === undefined) continue;
      known += 1;
      if (r >= cut1) high += 1;
    }
  }
  const volume = volumeOf(language, lines);
  return {
    n: mine.length,
    words: words / mine.length,
    level: known ? high / known : 0,
    fixed: mine.filter(isFixed).length / mine.length,
    asked: mine.filter((line) => QUESTION.test(line.text.trim())).length,
    ...(volume ?? {}),
  };
}

/**
 * 문형 숫자: 처음 줄(내 줄)마다 열쇠(표시 g| + 감지 f|·g|·e|). keysOf(i) = 처음 TALK_TURNS줄 중 i번째 내 줄의 열쇠(고쳐진 줄은 안 셈).
 * 단계는 열쇠에서(g|단계:번호, f|<언어>-f<단계>-…), 표현 e|는 단계를 모르면 1.
 */
export function shapeOf(lines: readonly TranscriptLine[], keysOf: (line: TranscriptLine, i: number) => readonly string[]): Pick<TalkStats, "shaped" | "kinds" | "top"> & { keys: string[] } {
  const mine = firstLines(lines);
  const all = new Set<string>();
  let shaped = 0;
  mine.forEach((line, i) => {
    if (isFixed(line)) return;
    const keys = keysOf(line, i).filter((key) => /^[fge]\|/.test(key));
    if (keys.length) shaped += 1;
    for (const key of keys) all.add(key);
  });
  const top = Math.max(0, ...[...all].map(stageOfKey));
  return { shaped: mine.length ? shaped / mine.length : 0, kinds: all.size, top, keys: [...all] };
}

export function stageOfKey(key: string): number {
  const g = /^g\|(\d+):/.exec(key);
  if (g) return Number(g[1]);
  const f = /^f\|[a-z-]+?-f(\d+)-/.exec(key);
  if (f) return Number(f[1]);
  return key.startsWith("e|") ? 1 : 0;
}

/** 보기 문장: 처음 줄 중 가장 긴 두 줄(낱말 수), 원래 차례대로. */
export function sampleLines(language: string, lines: readonly TranscriptLine[]): string[] {
  const mine = firstLines(lines).map((line, i) => ({ text: line.text.trim(), i, n: segmentWords(line.text, language).length }));
  return mine
    .sort((a, b) => b.n - a.n || a.i - b.i)
    .slice(0, 2)
    .sort((a, b) => a.i - b.i)
    .map((one) => one.text);
}

export type TalkCall = { at: number; talk: Partial<TalkStats>; topics?: readonly string[] };
export type RowId = "mine3" | "share" | "shaped" | "kinds" | "top" | "words" | "level" | "fixed" | "asked" | "topics";
export type CompareRow = { id: RowId; then: number; now: number };

/** 칸마다 "나아짐" 기준(이만큼 늘면 1배) — 내려가야 좋은 칸은 음수. 순서 = 같은 배수일 때 앞선 것. */
const RULES: { id: RowId; step: number; of: (call: TalkCall) => number | undefined }[] = [
  { id: "shaped", step: 0.1, of: (call) => call.talk.shaped },
  { id: "kinds", step: 1, of: (call) => call.talk.kinds },
  { id: "mine3", step: 5, of: (call) => call.talk.mine3 },
  { id: "share", step: 0.05, of: (call) => call.talk.share },
  { id: "top", step: 1, of: (call) => call.talk.top },
  { id: "words", step: 1, of: (call) => call.talk.words },
  { id: "level", step: 0.05, of: (call) => call.talk.level },
  { id: "fixed", step: -0.1, of: (call) => call.talk.fixed },
  { id: "asked", step: 0.5, of: (call) => call.talk.asked },
];

const mean = (values: number[]) => values.reduce((a, b) => a + b, 0) / Math.max(1, values.length);

/**
 * 처음 COMPARE_CALLS통 vs 최근 COMPARE_CALLS통(시각 순). 통화가 READY_CALLS통 아래면 null.
 * 칸마다 그 값이 있는 통화끼리(처음·최근 각각 하나 이상) 평균, 기준의 1배 이상 나아진 칸만 — 배수가 큰 것부터 SHOWN_ROWS개.
 * 문형·대화량 칸은 이 표시가 생긴 뒤의 통화에만 있어, "처음"은 값이 있는 첫 통화들이다.
 * 소재(누적 다른 소재 수)는 처음 3통보다 2개 넘게 늘면.
 */
export function compareTalk(calls: readonly TalkCall[]): { rows: CompareRow[] } | null {
  const sorted = [...calls].sort((a, b) => a.at - b.at);
  if (sorted.length < READY_CALLS) return null;
  const scored: (CompareRow & { score: number; order: number })[] = [];
  RULES.forEach((rule, order) => {
    const have = sorted.filter((call) => rule.of(call) !== undefined);
    if (have.length < COMPARE_CALLS + 1) return;
    // 처음·최근이 겹치지 않게: 값이 있는 통화가 적으면 반씩(넷이면 둘·둘).
    const k = Math.min(COMPARE_CALLS, Math.floor(have.length / 2));
    const head = have.slice(0, k);
    const tail = have.slice(-k);
    const then = mean(head.map((call) => rule.of(call)!));
    const now = mean(tail.map((call) => rule.of(call)!));
    const score = (now - then) / rule.step;
    if (score >= 1) scored.push({ id: rule.id, then, now, score, order });
  });
  const topics = (list: readonly TalkCall[]) => new Set(list.flatMap((one) => one.topics ?? [])).size;
  const t0 = topics(sorted.slice(0, COMPARE_CALLS));
  const t1 = topics(sorted);
  if (t1 - t0 >= 2) scored.push({ id: "topics", then: t0, now: t1, score: (t1 - t0) / 2, order: RULES.length });
  const rows = scored.sort((a, b) => b.score - a.score || a.order - b.order).slice(0, SHOWN_ROWS).map(({ id, then, now }) => ({ id, then, now }));
  return rows.length >= 2 ? { rows } : null;
}

/** 서버 답의 소재를 목록 안 것만, 둘까지. */
export function readTopics(value: unknown): TalkTopic[] {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.filter((one): one is TalkTopic => typeof one === "string" && (TALK_TOPICS as readonly string[]).includes(one)))].slice(0, 2);
}
