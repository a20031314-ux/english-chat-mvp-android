/**
 * 대화 비교의 문장 쪽(이 폰에만, 2026-11-07 밤): 같은 종류 튜터 질문에 한 내 대답(처음·마지막) · 문법·표현을 처음 맞게 쓴 문장.
 * 통화 끝 튜터 메모 호출의 표시(talkTags.ts)가 오면 applyTalkTags가 한 번에: 숫자(callNotes talk 문형 칸) · 이 저장소 · 장부(표시로 새로 잡힌 문법 used) · 고쳐 씀 줄.
 */
import type { TranscriptLine } from "./review.ts";
import { OPENING_LINES, type QuestionKind, type TalkTags } from "./talkTags.ts";
import { shapeOf } from "./talkStats.ts";
import { recapLedgerKeys } from "./recap.ts";
import { setCallExtra } from "./callNotes.ts";
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

/** 같은 종류 질문 짝 하나: 처음·마지막이 다른 날이고 대답이 길어진 것 중 가장 많이 늘어난 것. */
export function bestAnswerPair(answers: Answers, dayOf: (ms: number) => string): { kind: QuestionKind; first: Answer; last: Answer } | null {
  let best: { kind: QuestionKind; first: Answer; last: Answer } | null = null;
  for (const [kind, pair] of Object.entries(answers) as [QuestionKind, { first: Answer; last: Answer }][]) {
    if (!pair?.first || !pair.last || dayOf(pair.first.at) === dayOf(pair.last.at) || pair.last.n <= pair.first.n) continue;
    if (!best || pair.last.n - pair.first.n > best.last.n - best.first.n) best = { kind, ...pair };
  }
  return best;
}

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
  // 1. 숫자(문형 칸)
  const shape = shapeOf(said, keysOf);
  setCallExtra(language, input.callId, { talk: { shaped: shape.shaped, kinds: shape.kinds, top: shape.top } }, store);
  // 2. 처음 쓴 것 · 장부 · 고쳐 씀(표시로 새로 잡힌 문법만 — 감지기 몫은 callHooks가 이미)
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
  // 3. 같은 종류 질문에 한 대답(그 질문 뒤 첫 내 줄)
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
