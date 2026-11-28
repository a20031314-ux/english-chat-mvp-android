/**
 * 대화 비교의 문장 쪽(이 폰에만, 2026-11-07 밤): 같은 종류 튜터 질문에 한 내 대답(처음·마지막) · 문법·표현을 처음 맞게 쓴 문장.
 * 통화 끝 튜터 메모 호출의 표시(talkTags.ts)가 오면 applyTalkTags가 한 번에: 이 저장소 · 장부(표시로 새로 잡힌 문법 used) · 고쳐 씀 줄.
 */
import type { TranscriptLine } from "./review.ts";
import { OPENING_LINES, type QuestionKind, type TalkTags } from "./talkTags.ts";
import { recapLedgerKeys } from "./recap.ts";
import { noteLedger } from "../curriculum/logLedger.ts";
import { noteGrowthLines } from "../curriculum/growthLines.ts";
import { segmentWords } from "../wordSegments.ts";

type Store = { getItem(key: string): string | null; setItem(key: string, value: string): void };
function browserStore(): Store | null {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}

const ANSWERS_KEY = "talkAnswers.v1";
const FIRST_USE_KEY = "talkFirstUse.v1";
export const TALK_MEMORY_EVENT = "talk-memory";

export type Answer = { at: number; q: string; a: string; n: number };
export type Answers = Partial<Record<QuestionKind, { first: Answer; last: Answer }>>;
export type FirstUse = { at: number; line: string };

function read<T>(key: string, store: Store | null): T | null {
  if (!store) return null;
  try {
    return JSON.parse(store.getItem(key) ?? "null") as T | null;
  } catch {
    return null;
  }
}
function write(key: string, value: unknown, store: Store | null): void {
  if (!store) return;
  try {
    store.setItem(key, JSON.stringify(value));
    globalThis.dispatchEvent?.(new Event(TALK_MEMORY_EVENT));
  } catch {
    // 이번만.
  }
}

export const readAnswers = (language: string, store: Store | null = browserStore()): Answers => read<Answers>(`${ANSWERS_KEY}.${language}`, store) ?? {};
export const readFirstUses = (language: string, store: Store | null = browserStore()): Record<string, FirstUse> => read<Record<string, FirstUse>>(`${FIRST_USE_KEY}.${language}`, store) ?? {};

const LETTER = /\p{L}/u;
const spoken = (line: TranscriptLine) => line.who === "learner" && Boolean(line.text.trim()) && line.text.trim() !== "…";
const fixedLine = (line: TranscriptLine) => {
  const right = (line.meant || line.better || "").trim();
  return Boolean(right && right !== line.text.trim());
};

/**
 * 통화 끝 표시를 받아서. said = 그 통화 전체 줄(처음 OPENING_LINES줄이 표시의 번호와 같은 자리), at = 통화 시각(ms).
 * 순수 아님(저장) — 저장소를 넘기면 그것에.
 */
export function applyTalkTags(input: { language: string; callId: string; said: readonly TranscriptLine[]; tags: TalkTags; at: number }, store: Store | null = browserStore()): void {
  const { language, said, tags } = input;
  const opening = said.slice(0, OPENING_LINES);
  const keysOf = (line: TranscriptLine) => {
    const i = opening.indexOf(line);
    const detected = recapLedgerKeys(language, [line]).used;
    return [...new Set([...(i >= 0 ? (tags.uses[i] ?? []) : []), ...detected])];
  };
  // 1. 처음 쓴 것 · 장부 · 고쳐 씀(표시로 새로 잡힌 문법만 — 감지기 몫은 callHooks가 이미)
  const firstUses = readFirstUses(language, store);
  const ledger: { k: string; src: "call"; r: "used" }[] = [];
  const used: { k: string[]; x: string; t: number; s: "call" }[] = [];
  const t = Math.round(input.at / 1000);
  const callKeys = recapLedgerKeys(language, [...said]);
  const callDetected = new Set([...callKeys.used, ...callKeys.miss]);
  opening.forEach((line, i) => {
    if (!spoken(line) || fixedLine(line)) return;
    for (const key of keysOf(line)) if (!firstUses[key]) firstUses[key] = { at: input.at, line: line.text.trim() };
    // 감지기가 이미 잡은 열쇠는 callHooks가 장부에 남겼으니 빼서, 한 통화에 두 번 used로 처음 봄 → 앎이 되지 않게(변경 감시 2026-11-07 major).
    // 그 통화 어느 줄에서든 감지된 열쇠(쓴 것·틀린 것)는 빼기 — callHooks가 통화 단위로 이미 남김(변경 감시 2026-11-07 두 번째).
    const detected = callDetected;
    const extra = (tags.uses[i] ?? []).filter((key) => !detected.has(key));
    if (extra.length) {
      for (const k of extra) ledger.push({ k, src: "call", r: "used" });
      used.push({ k: extra, x: line.text.trim(), t, s: "call" });
    }
  });
  write(`${FIRST_USE_KEY}.${language}`, firstUses, store);
  // 표시 몫(모델이 고른 문법)은 한 통화에 열쇠마다 한 번만.
  if (ledger.length) noteLedger(language, [...new Map(ledger.map((one) => [one.k, one])).values()]);
  if (used.length) noteGrowthLines(language, { used }, store);
  // 2. 같은 종류 질문에 한 대답(그 질문 뒤 첫 내 줄)
  const answers = readAnswers(language, store);
  for (const [at, kind] of Object.entries(tags.asks)) {
    const i = Number(at);
    const reply = opening.slice(i + 1).find((line) => line.who === "learner");
    if (!reply || !spoken(reply) || fixedLine(reply) || opening.slice(i + 1, opening.indexOf(reply)).some((line) => line.who === "tutor")) continue;
    const answer: Answer = { at: input.at, q: opening[i]!.text.trim(), a: reply.text.trim(), n: segmentWords(reply.text, language).filter((token) => LETTER.test(token)).length };
    const was = answers[kind];
    answers[kind] = was ? { first: was.first, last: answer } : { first: answer, last: answer };
  }
  write(`${ANSWERS_KEY}.${language}`, answers, store);
}

/** Logbank "그날 지우기": 그날(dayOf — 그 폰 날짜, ms) 남긴 대답·처음 쓴 것을 지운다. 질문 짝은 처음·마지막 중 그날 것이 있으면 그 종류째. */
export function forgetTalkDay(language: string, day: string, dayOf: (ms: number) => string, store: Store | null = browserStore()): void {
  const answers = readAnswers(language, store);
  for (const [kind, pair] of Object.entries(answers) as [QuestionKind, { first: Answer; last: Answer }][]) {
    if (pair && (dayOf(pair.first.at) === day || dayOf(pair.last.at) === day)) delete answers[kind];
  }
  write(`${ANSWERS_KEY}.${language}`, answers, store);
  const uses = readFirstUses(language, store);
  for (const [key, use] of Object.entries(uses)) if (dayOf(use.at) === day) delete uses[key];
  write(`${FIRST_USE_KEY}.${language}`, uses, store);
}

/**
 * 대화 비교 장면(사용자 2026-11-28 "캡처샷에 표시를 넣어 더 나아졌음을 명시적으로, 나아진 게 없으면 억지로 띄우지 말고"):
 * 같은 종류 질문에 한 처음·최근 대답(둘 다 고침받지 않은 줄 — applyTalkTags가 고친 줄은 안 남김)에서
 * 되묻는 문장(?로 끝남)은 빼고, 질문에 있던 낱말도 빼고 센 "내 말" 낱말 수가 3개 넘게 늘었거나, 최근 대답에 처음 맞게 쓴 문법·표현이 있으면 장면.
 * marks = 최근 대답에서 밑줄 칠 글자 범위([시작, 끝)) — 처음 대답·질문에 없던 내 말 낱말과 그 대답에서 처음 쓴 표현.
 */
export type AnswerGain = { first: Answer; last: Answer; before: number; after: number; keys: string[]; marks: [number, number][] };

const QUESTION_END = /[?？]\s*$/u;

function ownWords(text: string, question: string, language: string): string[] {
  const asked = new Set(segmentWords(question, language).map((token) => token.toLowerCase()));
  const said = (text.match(/[^.!?。！？]+[.!?。！？]*/gu) ?? [text]).filter((sentence) => !QUESTION_END.test(sentence.trim())).join(" ");
  return segmentWords(said, language).filter((token) => LETTER.test(token) && !asked.has(token.toLowerCase()));
}

export function answerGain(language: string, answers: Answers, firstUses: Record<string, FirstUse>, dayOf: (ms: number) => string): AnswerGain | null {
  let best: AnswerGain | null = null;
  for (const pair of Object.values(answers)) {
    if (!pair?.first || !pair.last || dayOf(pair.first.at) === dayOf(pair.last.at)) continue;
    const { first, last } = pair;
    const before = ownWords(first.a, first.q, language).length;
    const mine = ownWords(last.a, last.q, language);
    const after = mine.length;
    const keys = Object.entries(firstUses)
      .filter(([, use]) => use.at === last.at && use.line === last.a)
      .map(([key]) => key);
    if (!keys.length && after - before < 3) continue;
    // 밑줄: 처음 대답에 없던 내 말 낱말(차례대로 글자 위치를 찾음) + 처음 쓴 표현 조각.
    const old = new Set(segmentWords(first.a, language).map((token) => token.toLowerCase()));
    const marks: [number, number][] = [];
    let from = 0;
    const lower = last.a.toLowerCase();
    for (const token of segmentWords(last.a, language)) {
      const at = lower.indexOf(token.toLowerCase(), from);
      if (at < 0) continue;
      from = at + token.length;
      if (mine.includes(token) && !old.has(token.toLowerCase())) marks.push([at, at + token.length]);
    }
    for (const key of keys) {
      if (!key.startsWith("e|")) continue;
      const at = lower.indexOf(key.slice(2).toLowerCase());
      if (at >= 0) marks.push([at, at + key.length - 2]);
    }
    const gain: AnswerGain = { first, last, before, after, keys, marks: mergeMarks(marks) };
    const score = (one: AnswerGain) => one.keys.length * 3 + (one.after - one.before);
    if (!best || score(gain) > score(best)) best = gain;
  }
  return best;
}

/** 겹치거나 공백 하나로 붙은 범위는 하나로(낱말마다 끊긴 밑줄 대신 이어진 조각). */
function mergeMarks(marks: [number, number][]): [number, number][] {
  const out: [number, number][] = [];
  for (const [a, b] of [...marks].sort((x, y) => x[0] - y[0])) {
    const lastOne = out[out.length - 1];
    if (lastOne && a <= lastOne[1] + 1) lastOne[1] = Math.max(lastOne[1], b);
    else out.push([a, b]);
  }
  return out;
}
