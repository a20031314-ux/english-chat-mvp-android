/**
 * 첫 단계 고르기 — 첫 측정 계산(2026-11-07 사용자 "이대로 만들어줘", 설계 hub/work/drafts/placement-2026-11-06.md 3·4절).
 * 순수 모듈 — 모델 없음. 화면은 studyMap/FirstCheck.tsx.
 *
 *   ① 글자: 소리 듣고 글자 고르기 6문제, 셋 넘게 틀리면 글자부터(그 뒤 ②③은 건너뜀 — 못 읽는 글자로 낱말을 물을 수 없음).
 *   ② 낱말 범위: 예/아니오 24장(진짜 20 + 가짜 4) → 경계 b 최대가능도 → 뜻 고르기 5문제로 b를 고침(vocabLevel.noteLevel).
 *   ③ 표현·문법: 1단계부터 번갈아, 단계마다 세 문제 중 둘 맞히면 위 단계, 둘 틀리면 그 종류 멈춤(11-07 저녁 — 모아서 판정).
 *
 * 예전 placement.ts(단계 오르내리기 시험, PlacementPlayer)와는 다른 것 — 그쪽은 개편 밖 화면만 쓴다.
 * 결과는 Logbank %를 칠하지 않는다(설계 5절): 낱말 경계는 Quizbank·Languagebank 진하기, 단계는 지금 단계.
 */
import { posGroup, type BankWord } from "./vocabBank.ts";
import { knowChance, noteLevel, PROBE, type Level } from "./vocabLevel.ts";
import type { ScriptCourse } from "./scripts/types.ts";

export const LETTER_N = 6;
/** 이만큼 넘게 틀리면 글자부터. */
export const LETTER_MISS_MAX = 3;
export const YN_REAL = 20;
export const YN_FAKE = 4;
export const YN_TOTAL = YN_REAL + YN_FAKE;
export const MEANING_N = 5;
/** 오르기 최대 문제 수(두 종류 합) — 단계마다 2~3문제라 예전 10에서 늘림. */
export const CLIMB_MAX = 18;
export const STAGES = 5;
/** 거짓 앎이 이만큼이면 예/아니오를 버리고 뜻 고르기만. */
export const FAKE_TRUST_MAX = 0.5;

/* ───────── 씨앗 난수 ───────── */

function hash(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function seeded(seed: string): () => number {
  let a = hash(seed) || 1;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(list: readonly T[], random: () => number): T[] {
  const out = [...list];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}

/* ───────── ① 글자 ───────── */

export type LetterQuestion = { say: string; answer: string; options: string[] };

/** 묶음 여섯에서 하나씩(앞쪽 묶음부터 고루) — 듣고 고르기. 보기는 같은 글자 체계의 다른 글자 셋. */
export function letterQuestions(course: ScriptCourse, seed: string): LetterQuestion[] {
  const random = seeded(`${course.language}|letters|${seed}`);
  const groups = course.groups.filter((group) => group.items.length);
  if (!groups.length) return [];
  // 같은 소리 다른 글자(ひらがな か ↔ カタカナ カ)는 듣고는 못 가르므로 보기에서 뺀다 — 읽는 법이 같으면 같은 소리.
  const soundOf = new Map<string, string>();
  for (const group of groups) for (const item of group.items) if (!soundOf.has(item.char)) soundOf.set(item.char, (item.reading || item.say).toLocaleLowerCase());
  const all = [...soundOf.keys()].filter((char) => char.length <= 3);
  const out: LetterQuestion[] = [];
  const used = new Set<string>();
  for (let i = 0; i < LETTER_N; i += 1) {
    const group = groups[Math.floor((i * groups.length) / LETTER_N)]!;
    const items = shuffle(group.items.filter((item) => item.char.length <= 3 && !used.has(item.char)), random);
    const item = items[0];
    if (!item) continue;
    used.add(item.char);
    const sound = soundOf.get(item.char);
    const wrong: string[] = [];
    for (const char of shuffle(all, random)) {
      if (wrong.length >= 3) break;
      const other = soundOf.get(char);
      if (char === item.char || other === sound || wrong.some((one) => soundOf.get(one) === other)) continue;
      wrong.push(char);
    }
    if (wrong.length < 3) continue;
    out.push({ say: item.say, answer: item.char, options: shuffle([item.char, ...wrong], random) });
  }
  return out;
}

export function lettersWeak(answers: readonly boolean[]): boolean {
  return answers.filter((ok) => !ok).length > LETTER_MISS_MAX;
}

/* ───────── ② 예/아니오 ───────── */

export type YnCard = { word: string; reading?: string; rank: number | null };
export type YnAnswer = { rank: number | null; yes: boolean };

/** 예/아니오에 쓸 낱말: 명사·동사·형용사·부사(기능어·고유명사 뺌). */
function fitsYn(word: BankWord): boolean {
  return posGroup(word.pos) !== "function" && !/prop/i.test(word.pos) && word.w.length > 1;
}

/** 가짜 낱말 자리(24장 중 넷 — 처음 셋 안에는 없음, 이웃하지 않게). */
export function fakeSlots(seed: string): number[] {
  const random = seeded(`fake|${seed}`);
  const slots: number[] = [];
  let guard = 0;
  while (slots.length < YN_FAKE && guard < 500) {
    guard += 1;
    const at = 3 + Math.floor(random() * (YN_TOTAL - 3));
    if (slots.some((one) => Math.abs(one - at) < 2)) continue;
    slots.push(at);
  }
  return slots.sort((a, b) => a - b);
}

const OFFSET = 50;
const SIGMA = 0.35;
const B_MIN = 50;
const B_MAX = 7000;
const GRID = 60;

/** b 후보(로그 눈금 60칸, 목록 길이로 자름). */
function bGrid(total: number): number[] {
  const top = Math.max(B_MIN + 1, Math.min(B_MAX, total - 1));
  return Array.from({ length: GRID }, (_, i) => Math.exp(Math.log(B_MIN) + ((Math.log(top) - Math.log(B_MIN)) * i) / (GRID - 1)));
}

/** 거짓 앎 비율 f(가짜에 [앎]) — 하나도 없으면 0.02(드문 실수 몫). */
export function falseYes(answers: readonly YnAnswer[]): number {
  const fakes = answers.filter((one) => one.rank === null);
  if (!fakes.length) return 0.02;
  return Math.max(0.02, fakes.filter((one) => one.yes).length / fakes.length);
}

/**
 * 경계 b 최대가능도: [앎] 확률 = p + (1 − p)·f (모르면서 아는 척 f), [모름] = (1 − p)(1 − f). p는 vocabLevel.knowChance.
 * f ≥ 0.5면 null(예/아니오를 믿지 않음 — 뜻 고르기만).
 */
export function estimateB(answers: readonly YnAnswer[], total: number): number | null {
  const f = falseYes(answers);
  if (f >= FAKE_TRUST_MAX) return null;
  const real = answers.filter((one): one is { rank: number; yes: boolean } => one.rank !== null);
  if (!real.length) return null;
  let best = B_MIN;
  let bestLog = -Infinity;
  for (const b of bGrid(total)) {
    let log = 0;
    for (const one of real) {
      const p = knowChance({ b, n: 0 }, one.rank);
      const yes = p + (1 - p) * f;
      log += Math.log(Math.max(1e-9, one.yes ? yes : 1 - yes));
    }
    if (log > bestLog) {
      bestLog = log;
      best = b;
    }
  }
  return Math.round(best);
}

/** 순위 → 아는 확률이 p가 되는 순위(경계 b 기준). */
function rankAt(b: number, p: number): number {
  return Math.exp(Math.log(b + OFFSET) - SIGMA * Math.log(p / (1 - p))) - OFFSET;
}

/** 순위 target에 가장 가까운 쓸 만한 낱말(쓴 것·바로 앞과 같은 주제 뺌). */
function nearest(words: readonly BankWord[], target: number, used: ReadonlySet<number>, lastTopic?: string): number | null {
  const at = Math.max(0, Math.min(words.length - 1, Math.round(target)));
  for (let step = 0; step < words.length; step += 1) {
    for (const index of step ? [at + step, at - step] : [at]) {
      const word = words[index];
      if (!word || used.has(index) || !fitsYn(word)) continue;
      if (lastTopic && word.topic && word.topic === lastTopic && step < 40) continue;
      return index;
    }
  }
  return null;
}

/**
 * 다음 예/아니오 카드. 가짜 자리면 가짜, 아니면 진짜:
 * 처음 다섯은 단계 구간마다 하나(쉬운 구간부터, 구간 안 25% 자리), 그 뒤는 지금 어림 b의 위·아래 번갈아(아는 확률 0.3 ↔ 0.7).
 */
export function nextYnCard(input: {
  words: readonly BankWord[];
  cuts: readonly number[];
  fakes: readonly string[];
  answers: readonly YnAnswer[];
  shown: readonly YnCard[];
  seed: string;
}): YnCard | null {
  const { words, cuts, answers, shown } = input;
  const at = shown.length;
  if (at >= YN_TOTAL) return null;
  const slots = fakeSlots(input.seed);
  if (slots.includes(at)) {
    const random = seeded(`${input.seed}|fake|${at}`);
    const pool = input.fakes.filter((word) => !shown.some((one) => one.word === word));
    const word = pool[Math.floor(random() * pool.length)];
    if (word) return { word, rank: null };
  }
  const used = new Set(shown.flatMap((one) => (one.rank === null ? [] : [one.rank])));
  const realSoFar = shown.filter((one) => one.rank !== null).length;
  const lastRank = [...shown].reverse().find((one) => one.rank !== null)?.rank;
  const lastTopic = lastRank !== undefined && lastRank !== null ? words[lastRank]?.topic : undefined;
  let target: number;
  if (realSoFar < 5) {
    const starts = [0, ...cuts.slice(0, 4)];
    const ends = cuts.slice(0, 5);
    const lo = starts[realSoFar] ?? 0;
    const hi = ends[realSoFar] ?? lo + 500;
    target = lo + (hi - lo) * 0.25;
  } else {
    const b = estimateB(answers, words.length) ?? (cuts[0] ?? 700);
    target = rankAt(b, realSoFar % 2 ? 0.3 : 0.7);
  }
  const index = nearest(words, Math.min(target, words.length - 1), used, lastTopic);
  if (index === null) return null;
  const word = words[index]!;
  return { word: word.w, ...(word.reading && word.reading !== word.w ? { reading: word.reading } : {}), rank: index };
}

/* ───────── ② 뜻 고르기 ───────── */

/** 뜻 고르기 낱말 순위: b 근처(아는 확률 0.75 · 0.6 · 0.5 · 0.65 · 0.55). */
export function meaningRanks(b: number, words: readonly BankWord[], skip: ReadonlySet<number>): number[] {
  const used = new Set(skip);
  const out: number[] = [];
  for (const p of [0.75, 0.6, 0.5, 0.65, 0.55]) {
    const index = nearest(words, rankAt(b, p), used);
    if (index === null) continue;
    used.add(index);
    out.push(index);
  }
  return out;
}

/** 예/아니오 결과(또는 믿지 못할 때 1단계 끝 어림)에서 뜻 고르기로 b를 고친 Level. */
export function wordLevel(b0: number | null, meaning: readonly { rank: number; correct: boolean }[], total: number, cuts: readonly number[]): Level {
  let level: Level = { b: b0 ?? Math.round((cuts[0] ?? 700) * 0.5), n: b0 === null ? 0 : 10 };
  for (const one of meaning) level = noteLevel(level, one.rank, one.correct, { choose: true, total });
  return { ...level, b: Math.round(level.b), n: Math.max(level.n, PROBE), picked: true };
}

/** 화면에 보일 낱말 수(어림) — 50 아래는 50, 1,000 아래는 50 단위, 그 위는 100 단위. */
export function wordsAbout(b: number): number {
  if (b < 50) return 50;
  return b < 1000 ? Math.round(b / 50) * 50 : Math.round(b / 100) * 100;
}

/* ───────── ③ 표현·문법 오르기 ───────── */

export type ClimbKind = "expression" | "grammar";
/**
 * 오르기는 단계마다 모아서 판정(2026-11-07 사용자 "모아서 판정하거나 단일문제는 좀더 미시적으로" → "다 바꿔줘"):
 * 한 단계에 세 문제까지, 둘 맞히면 넘음(셋째는 안 냄), 둘 틀리면 그 종류는 거기서 멈춤.
 * 예전(한 문제 맞히면 위, 틀리면 한 번 더)은 넷 중 하나 찍기로 단계가 올라가 5단계 과대(체감 점검 오후 민지·Layla).
 * 찍기만으로 한 단계를 넘을 확률: 셋 중 둘 이상 = 3·¼²·¾ + ¼³ ≈ 16%(예전 ¼ + ¾·¼ ≈ 44%).
 */
export const STAGE_ASK = 3;
export const STAGE_PASS = 2;
export type ClimbLane = { stage: number; passed: number; right: number; wrong: number; stopped: boolean };
export type Climb = { lanes: Record<ClimbKind, ClimbLane>; asked: number; turn: ClimbKind };

export function startClimb(has: Record<ClimbKind, boolean>): Climb {
  const lane = (on: boolean): ClimbLane => ({ stage: 1, passed: 0, right: 0, wrong: 0, stopped: !on });
  return { lanes: { expression: lane(has.expression), grammar: lane(has.grammar) }, asked: 0, turn: has.grammar && !has.expression ? "grammar" : "expression" };
}

/** 다음에 물을 종류·단계(끝이면 null). */
export function climbNext(climb: Climb): { kind: ClimbKind; stage: number } | null {
  if (climb.asked >= CLIMB_MAX) return null;
  const order: ClimbKind[] = climb.turn === "expression" ? ["expression", "grammar"] : ["grammar", "expression"];
  for (const kind of order) {
    const lane = climb.lanes[kind];
    if (!lane.stopped) return { kind, stage: lane.stage };
  }
  return null;
}

/** 답 하나(새 객체). 그 단계에서 둘 맞히면 위 단계(5 넘으면 멈춤), 둘 틀리면 멈춤. */
export function climbAnswer(climb: Climb, kind: ClimbKind, correct: boolean): Climb {
  const lane = { ...climb.lanes[kind] };
  if (correct) lane.right += 1;
  else lane.wrong += 1;
  if (lane.right >= STAGE_PASS) {
    lane.passed = lane.stage;
    lane.stage += 1;
    lane.right = 0;
    lane.wrong = 0;
    if (lane.stage > STAGES) lane.stopped = true;
  } else if (lane.wrong > STAGE_ASK - STAGE_PASS) {
    lane.stopped = true;
  }
  const other: ClimbKind = kind === "expression" ? "grammar" : "expression";
  return { lanes: { ...climb.lanes, [kind]: lane }, asked: climb.asked + 1, turn: other };
}

/** 문제가 떨어진 종류·단계: 그 종류를 거기서 멈춤(넘은 단계는 그대로). */
export function climbOut(climb: Climb, kind: ClimbKind): Climb {
  return { ...climb, lanes: { ...climb.lanes, [kind]: { ...climb.lanes[kind], stopped: true } } };
}

/** 시작 단계 = 마지막으로 넘은 단계 + 1(1~5). */
export function climbStart(lane: ClimbLane): number {
  return Math.max(1, Math.min(STAGES, lane.passed + 1));
}

/* ───────── 결과 ───────── */

export type FirstCheckResult = {
  at: number;
  /** 글자부터(①에서 걸림) — 그러면 아래 값은 처음 어림. */
  letters: boolean;
  /** 낱말 경계(빈도 순위). */
  b: number;
  expression: number;
  grammar: number;
  /** 가짜에 [앎] 비율 — 기록용. */
  f?: number;
};

const KEY = "firstCheck.v1";

export function readFirstCheck(language: string): FirstCheckResult | null {
  try {
    const all = JSON.parse(globalThis.localStorage?.getItem(KEY) ?? "{}") as Record<string, FirstCheckResult>;
    const one = all[language];
    return one && typeof one.b === "number" ? one : null;
  } catch {
    return null;
  }
}

export function saveFirstCheck(language: string, result: FirstCheckResult): void {
  try {
    const all = JSON.parse(globalThis.localStorage?.getItem(KEY) ?? "{}") as Record<string, FirstCheckResult>;
    globalThis.localStorage?.setItem(KEY, JSON.stringify({ ...all, [language]: result }));
  } catch {
    // 이번에만.
  }
}

/** 서버에 남길 지금 단계 — 문법 시작 단계(Quizbank 넣어 둔 문제·표현 카드가 이 단계까지). 글자부터면 1. */
export function startStageOf(result: FirstCheckResult): number {
  return result.letters ? 1 : Math.max(1, Math.min(STAGES, result.grammar));
}
