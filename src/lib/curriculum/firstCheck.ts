/**
 * 첫 단계 고르기 — 첫 측정 계산. 순수 모듈 — 모델 없음. 화면은 studyMap/FirstCheck.tsx.
 *
 *   ① 글자: 소리 듣고 글자 고르기 6문제, 셋 넘게 틀리면 글자부터(그 뒤 ②는 건너뜀 — 못 읽는 글자로 문단을 볼 수 없음).
 *   ② 문단 고르기: 단계 문단을 보고 [쉬워요 · 딱 맞아요 · 어려워요] — 고른 단계가 낱말·표현·문법 시작값(그 뒤는 Quizbank가 맞춰 감).
 *
 * 결과는 Logbank %를 칠하지 않는다: 낱말 경계는 Quizbank·Languagebank 진하기, 단계는 지금 단계.
 */
import { knowChance, startLevel } from "./vocabLevel.ts";
import { tilesOf } from "./quiz.ts";
import type { SpotItem } from "./spotErrors.ts";
import type { ScriptCourse } from "./scripts/types.ts";

export const LETTER_N = 6;
/** 이만큼 넘게 틀리면 글자부터. */
export const LETTER_MISS_MAX = 3;
export const STAGES = 5;

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

/* ───────── ② 문단 고르기 ───────── */

/**
 * 문단 고르기(2026-11-25 사용자 "문단을 보고 어렵다, 쉽다, 이게 내 수준이다를 바로 선택 — 어차피 수준은 점차 맞춰나가니까"):
 * 단계 문단(story-errors — 일부러 틀린 곳은 바로잡아 보여 줌)을 한 장씩, [쉬워요]면 한 단계 위, [어려워요]면 한 단계 아래,
 * [딱 맞아요]면 그 단계. 위아래로 한 번 방향이 바뀌면(쉬움 ↔ 어려움 사이) 쉬웠던 단계에서 멈춘다. 결과 = 낱말·표현·문법 모두 그 단계.
 */
export const PARA_START = 2;
export type ParaRate = "easy" | "fit" | "hard";
export type ParaWalk = { stage: number; seen: { stage: number; rate: ParaRate }[]; done: number | null };

export function startParaWalk(stages: readonly number[] = [1, 2, 3, 4, 5]): ParaWalk {
  const start = stages.includes(PARA_START) ? PARA_START : (stages[0] ?? 1);
  return { stage: start, seen: [], done: stages.length ? null : 1 };
}

/** 답 하나(새 객체). stages = 문단이 있는 단계. */
export function rateParagraph(walk: ParaWalk, rate: ParaRate, stages: readonly number[] = [1, 2, 3, 4, 5]): ParaWalk {
  if (walk.done !== null) return walk;
  const seen = [...walk.seen, { stage: walk.stage, rate }];
  const finish = (stage: number): ParaWalk => ({ stage, seen, done: stage });
  if (rate === "fit") return finish(walk.stage);
  const up = rate === "easy";
  const next = up ? stages.find((one) => one > walk.stage) : [...stages].reverse().find((one) => one < walk.stage);
  if (next === undefined) return finish(walk.stage);
  const before = seen.find((one) => one.stage === next);
  // 이미 본 단계로 되돌아가면(2 쉬움 → 3 어려움, 또는 3 어려움 → 2 쉬움) 쉬웠던 쪽에서 멈춤.
  if (before) return finish(up ? walk.stage : next);
  return { stage: next, seen, done: null };
}

/** 문단의 바른 글(틀린 곳을 right로 — 칸은 quiz.ts tilesOf, at = 그 줄의 칸 번호). */
export function fixedLines(item: Pick<SpotItem, "lines" | "errors">, language: string): string[] {
  return item.lines.map((line, index) => {
    const errs = item.errors.filter((err) => err.line === index).sort((x, y) => y.at - x.at);
    if (!errs.length) return line;
    const spans: ({ from: number; to: number } | null)[] = [];
    let cursor = 0;
    for (const tile of tilesOf(line, language)) {
      const from = line.indexOf(tile, cursor);
      spans.push(from < 0 ? null : { from, to: from + tile.length });
      if (from >= 0) cursor = from + tile.length;
    }
    let out = line;
    for (const err of errs) {
      const span = spans[err.at];
      const cell = span ? out.slice(span.from, span.to) : "";
      const at = span ? cell.indexOf(err.wrong) : -1;
      if (span && at >= 0) {
        out = out.slice(0, span.from) + cell.slice(0, at) + err.right + cell.slice(at + err.wrong.length) + out.slice(span.to);
        continue;
      }
      // 칸 자리가 어긋나면(일본어 칸 합치기 등) 그 줄에 한 번만 나오는 틀린 꼴을 바꾼다.
      if (out.split(err.wrong).length === 2) out = out.replace(err.wrong, err.right);
    }
    return out;
  });
}

/** 단계마다 문단 하나(씨앗으로 고름 — 짧은 꼴 P1·P2 먼저). */
export function paragraphsByStage(items: readonly SpotItem[], seed: string): Map<number, SpotItem> {
  const out = new Map<number, SpotItem>();
  for (let stage = 1; stage <= STAGES; stage += 1) {
    const here = items.filter((item) => item.stage === stage);
    if (!here.length) continue;
    const shortest = Math.min(...here.map((item) => item.lines.length));
    const pool = here.filter((item) => item.lines.length === shortest);
    const random = seeded(`${seed}|para|${stage}`);
    out.set(stage, pool[Math.floor(random() * pool.length)]!);
  }
  return out;
}

/** 고른 단계 → 낱말 경계(그 단계 어림, vocabLevel.startLevel)·표현·문법 시작 단계. */
export function paraResult(stage: number, cuts: readonly number[], at: number = Date.now()): FirstCheckResult {
  const s = Math.max(1, Math.min(STAGES, stage));
  return { at, letters: false, b: Math.round(startLevel(s, cuts).b), expression: s, grammar: s };
}

/** 화면에 보일 낱말 수(어림) — 50 아래는 50, 1,000 아래는 50 단위, 그 위는 100 단위. */
export function wordsAbout(b: number): number {
  if (b < 50) return 50;
  return b < 1000 ? Math.round(b / 50) * 50 : Math.round(b / 100) * 100;
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

/** 잰 값(첫 측정) — Quizbank 표현 시작 단계·Languagebank 칠하기가 읽는다. 글자부터라 낱말을 잰 적이 없으면 null. */
export type Measured = Pick<FirstCheckResult, "b" | "expression" | "grammar">;
export function measured(language: string): Measured | null {
  const first = readFirstCheck(language);
  return first && !first.letters ? { b: first.b, expression: first.expression, grammar: first.grammar } : null;
}

/**
 * 지금 어림(사용자 2026-11-22 "첫 측정 → 점차 실제 실력"): 첫 측정에서 시작해, 낱말 경계는 Quizbank가 퀴즈 묶음마다 고쳐 가는 값
 * (quizCircle.v1.<언어>의 lv — 첫 측정이 처음 값을 넣음). 다시 재는 시험은 없다.
 */
export function measuredNow(language: string, store: Pick<Storage, "getItem"> | null = typeof localStorage === "undefined" ? null : localStorage): Measured | null {
  const first = measured(language);
  let b: number | null = null;
  try {
    const circle = JSON.parse(store?.getItem(`quizCircle.v1.${language}`) ?? "null") as { lv?: { b?: unknown } } | null;
    const raw = circle?.lv?.b;
    b = typeof raw === "number" && Number.isFinite(raw) && raw >= 0 ? raw : null;
  } catch {
    b = null;
  }
  // 첫 측정을 건너뛰었거나 이 폰에 없어도 Quizbank가 고쳐 온 낱말 경계가 있으면 그걸로(표현·문법은 1단계 — 건너뛰기 = 1단계, 사용자 2026-11-28 "UI가 텅 비어 보여").
  if (!first) return b === null ? null : { b, expression: 1, grammar: 1 };
  return b === null ? first : { ...first, b };
}

/**
 * Languagebank 추정: 지금 어림(measuredNow)으로 칸마다 "아는 정도" 0~1. 퀴즈로 직접 답한 칸은 부르는 쪽이 마지막 답으로 덮는다(quizShade).
 *   낱말 = 빈도 순위가 경계 b 근처면 반쯤(vocabLevel.knowChance — 측정과 같은 곡선)
 *   표현·문법 = 잰 단계 아래는 1, 그 단계는 0.5, 위는 0
 */
export function estimateChance(check: Measured, item: { kind: "word" | "expr" | "gram"; rank: number; lv: number }): number {
  if (item.kind === "word") return knowChance({ b: check.b, n: 0 }, item.rank);
  const stage = item.kind === "expr" ? check.expression : check.grammar;
  return item.lv < stage ? 1 : item.lv === stage ? 0.5 : 0;
}

/** 퀴즈로 직접 답한 칸의 칠하기: 마지막 답이 맞음이면 다 칠함, 틀림이면 비움, 답한 적 없으면 추정 그대로(null). 첫 측정 답(exam)도 센다. */
export function quizShade(events: readonly { k: string; src: string; r: string; t: number }[]): Map<string, number> {
  const last = new Map<string, { r: string; t: number }>();
  for (const one of events) {
    if ((one.src !== "quiz" && one.src !== "exam") || (one.r !== "ok" && one.r !== "miss")) continue;
    const before = last.get(one.k);
    if (!before || one.t >= before.t) last.set(one.k, { r: one.r, t: one.t });
  }
  return new Map([...last].map(([key, one]) => [key, one.r === "ok" ? 1 : 0]));
}
