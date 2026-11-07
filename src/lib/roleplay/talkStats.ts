/**
 * 대화 비교(2026-11-07 사용자 "구사 문장의 길이, 구사 단어의 수준, 대화 소재의 다양화를 실제 대화 캡처로 — 예전엔 한 대화에서
 * 같은 시간의 문장 길이와 구사 단어가 이 정도였는데 지금은 향상됐다"). 순수 모듈, 모델 없음.
 *
 * - 자유대화만, 한 통의 처음 TALK_TURNS줄(내 줄 — 처음 3분쯤)에서: 줄당 낱말 수 · 2단계 이상 낱말 몫(빈도 목록, 기능어 빼고) ·
 *   고쳐진 줄 몫 · 내가 먼저 물은 줄 수. 소재는 통화 끝 튜터 메모와 같은 호출이 고른 id(TALK_TOPICS — Quizbank 주제 이름을 씀).
 * - 비교 = 처음 COMPARE_CALLS통 평균 vs 최근 COMPARE_CALLS통 평균, 통화 READY_CALLS통부터. 나아진 칸만 보이고, 둘 이상 나아졌을 때만 카드.
 * - 보기 문장 = 그 통화 처음 TALK_TURNS줄 중 가장 긴 두 줄(처음·지금 같은 규칙). 처음 통화의 두 줄은 따로 남긴다(통화 원문은 20통만 남아서).
 */
import { segmentWords } from "../wordSegments.ts";
import { posGroup, type BankWord } from "../curriculum/vocabBank.ts";
import type { TranscriptLine } from "./review.ts";

export const TALK_TURNS = 8;
export const COMPARE_CALLS = 3;
export const READY_CALLS = 5;
/** 소재 id — Quizbank 주제(vocabBank TOPICS) 가운데 대화 소재가 되는 것. 이름은 copy topic*. */
export const TALK_TOPICS = ["people", "food", "home", "work", "health", "travel", "shopping", "time", "feelings", "nature", "society"] as const;
export type TalkTopic = (typeof TALK_TOPICS)[number];

export type TalkStats = {
  /** 센 내 줄 수. */
  n: number;
  /** 줄당 낱말 수 평균. */
  words: number;
  /** 2단계 이상 낱말 몫(0~1, 아는 낱말 중). */
  level: number;
  /** 고쳐진 줄 몫(0~1). */
  fixed: number;
  /** 내가 물은 줄 수. */
  asked: number;
};

const QUESTION = /[?？؟]\s*$/u;
const LETTER = /\p{L}/u;

/** 그 통화 처음 TALK_TURNS줄(내 줄)만. 받아쓰기가 비거나 "…"인 줄은 뺌. */
export function firstLines(lines: readonly TranscriptLine[]): TranscriptLine[] {
  return lines.filter((line) => line.who === "learner" && line.text.trim() && line.text.trim() !== "…").slice(0, TALK_TURNS);
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
  const fixed = mine.filter((line) => {
    const right = (line.meant || line.better || "").trim();
    return right && right !== line.text.trim();
  }).length;
  return {
    n: mine.length,
    words: words / mine.length,
    level: known ? high / known : 0,
    fixed: fixed / mine.length,
    asked: mine.filter((line) => QUESTION.test(line.text.trim())).length,
  };
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

export type TalkCall = { at: number; talk: TalkStats; topics?: readonly string[] };
export type CompareRow = { id: "words" | "level" | "fixed" | "asked" | "topics"; then: number; now: number };

const mean = (values: number[]) => values.reduce((a, b) => a + b, 0) / Math.max(1, values.length);

/**
 * 처음 COMPARE_CALLS통 vs 최근 COMPARE_CALLS통(시각 순으로 정렬해서). 통화가 READY_CALLS통 아래면 null.
 * 나아진 칸만: 낱말 +1 또는 +15% · 2단계 이상 +5%p · 고쳐진 줄 −10%p · 물음 +0.5 · 소재(누적 다른 소재 수) +2.
 */
export function compareTalk(calls: readonly TalkCall[]): { rows: CompareRow[]; firstAt: number } | null {
  const sorted = [...calls].sort((a, b) => a.at - b.at);
  if (sorted.length < READY_CALLS) return null;
  const head = sorted.slice(0, COMPARE_CALLS);
  const tail = sorted.slice(-COMPARE_CALLS);
  const rows: CompareRow[] = [];
  const pick = (f: (one: TalkCall) => number) => [mean(head.map(f)), mean(tail.map(f))] as const;
  const [w0, w1] = pick((one) => one.talk.words);
  if (w1 - w0 >= 1 || (w0 > 0 && w1 / w0 >= 1.15 && w1 - w0 >= 0.5)) rows.push({ id: "words", then: w0, now: w1 });
  const [l0, l1] = pick((one) => one.talk.level);
  if (l1 - l0 >= 0.05) rows.push({ id: "level", then: l0, now: l1 });
  const [f0, f1] = pick((one) => one.talk.fixed);
  if (f0 - f1 >= 0.1) rows.push({ id: "fixed", then: f0, now: f1 });
  const [a0, a1] = pick((one) => one.talk.asked);
  if (a1 - a0 >= 0.5) rows.push({ id: "asked", then: a0, now: a1 });
  const topics = (list: readonly TalkCall[]) => new Set(list.flatMap((one) => one.topics ?? [])).size;
  const t0 = topics(head);
  const t1 = topics(sorted);
  if (t1 - t0 >= 2) rows.push({ id: "topics", then: t0, now: t1 });
  return rows.length >= 2 ? { rows, firstAt: sorted[0]!.at } : null;
}

/** 서버 답의 소재를 목록 안 것만, 둘까지. */
export function readTopics(value: unknown): TalkTopic[] {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.filter((one): one is TalkTopic => typeof one === "string" && (TALK_TOPICS as readonly string[]).includes(one)))].slice(0, 2);
}
