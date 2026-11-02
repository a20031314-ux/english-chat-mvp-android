/**
 * 정기 종합 시험(2026-11-01 사용자 "자주 확인한 소재로 토익식 정기 시험" → "주기는 모인 소재로", hub/drafts/quiz-pages-2026-11-01.md 5절).
 *
 * - **모인 소재(pool):** 걸린 소재 — 퀴즈·시험에서 틀림, 수업 대화에서 막힘, "모를 때" 들어와 설명을 열어 봄, "알아요"로 수업을 넘김.
 *   이 폰에만(`examPool.v1.<언어>`). 20개(EXAM_POOL_MIN)가 모이면 시험 — 첫 시험도 같은 조건.
 * - **사다리(ladder):** 소재마다 1 빈칸 고르기 → 2 순서 맞추기 → 3 빈칸 쓰기 → 4 틀린 곳 고치기. 맞히면 다음 시험에서 한 칸 위,
 *   틀리면 한 칸 아래. 4칸을 맞히면 익힘(퀴즈 기록에 맞음 — 지금 규칙 "한 번 맞히면 익힘, 잊을 때만 다시"). 그 칸을 못 만들면 다음 칸.
 *   이 폰에만(`examLadder.v1.<언어>`).
 * - **구성(25문제 안팎):** 어휘 5(단어 시험에서 못 익힌 낱말) · 알아보기(1·2칸) · 떠올리기(3·4칸) · 대화 응답(상대 줄 듣고 대답 고르기) ·
 *   짧은 대화(복합 빈칸). 모인 소재 70% + 맞혔던 것 중 잊을 때가 된 것 30%. 한 시험에서 한 소재는 한 문제(RULES 11 ④).
 * - **결과:** 파트별 맞힌 수(등급·점수 환산 없음). 틀린 소재 → 다시 보기(퀴즈 기록 틀림) + 다음 시험에도 남음, 맞힌 것 → 칸 올림·모인 소재에서 빠짐.
 * 순수 모듈 — 저장은 부르는 쪽(TodayPlan)이 read/write 함수로.
 */
import { DAY_MS } from "./dailyPlan.ts";
import { restUntil, streakOf, type QuizLog } from "./nextStudy.ts";
import { buildQuiz, chooseOf, hash, orderOf, quizSources, rng, shuffled, spotFromCard, spotOf, typeOf, type QuizQuestion, type QuizSource } from "./quiz.ts";
import { pieceIn, type LessonScene } from "./lessonKey.ts";
import { multiOf } from "./multiQuiz.ts";
import { allScriptsFor, type ScriptGloss } from "./stageScripts.ts";
import type { CheckResult, Tally } from "./checkup.ts";
import { PART_IDS, type PartId } from "../notes/stageParts.ts";

export const EXAM_POOL_MIN = 20;
export const EXAM_SIZE = 25;
const VOCAB_COUNT = 5;
const REPLY_COUNT = 3;
const DIALOG_COUNT = 2;
/** 모인 소재가 이만큼 지나면 빠짐(오래 안 걸린 것은 이미 괜찮다고 봄). */
const POOL_KEEP_MS = 45 * DAY_MS;

export type PoolReason = "wrong" | "stuck" | "opened" | "claimed";
/** s = 그 소재가 나온 내 장면(통화의 고친 말 등, 2026-11-01) — 시험에서 그 문장을 먼저 문제로. 셋까지, 이 폰에만. */
export type PoolEntry = { at: number; r: PoolReason[]; s?: LessonScene[] };
const SCENES_MAX = 3;
export type ExamPool = Record<string, PoolEntry>;
/** 열쇠 → 다음에 낼 칸(1~4). 없으면 1(알요로 넘긴 것은 3). */
export type ExamLadder = Record<string, number>;

export type ExamSection = "vocab" | "recognize" | "recall" | "reply" | "dialog";
export const EXAM_SECTIONS: readonly ExamSection[] = ["vocab", "recognize", "recall", "reply", "dialog"];

export type ExamItem = { key: string; keys?: string[]; section: ExamSection; rung?: number; question: QuizQuestion; claimed?: boolean };

export const RUNG_KIND: Record<number, QuizQuestion["kind"]> = { 1: "choose", 2: "order", 3: "type", 4: "spot" };

// ---------- 저장 ----------

const poolKey = (language: string) => `examPool.v1.${language}`;
const ladderKey = (language: string) => `examLadder.v1.${language}`;
/** 장면으로 이미 넣은 (소재·문장) — 통화 기록을 다시 볼 때마다 시험 뒤 빠진 소재가 다시 들어오지 않게(2026-11-01 변경 감시 리뷰). */
const notedKey = (language: string) => `examNoted.v1.${language}`;
const NOTED_MAX = 400;

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = globalThis.localStorage?.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function writeJson(key: string, value: unknown): void {
  try {
    globalThis.localStorage?.setItem(key, JSON.stringify(value));
  } catch {
    /* 저장 못 하면 이번만 */
  }
}

export function readPool(language: string, now = Date.now()): ExamPool {
  const pool = readJson<ExamPool>(poolKey(language), {});
  const out: ExamPool = {};
  for (const [key, entry] of Object.entries(pool)) if (entry && now - entry.at < POOL_KEEP_MS && Array.isArray(entry.r)) out[key] = entry;
  return out;
}

/** 걸린 소재를 모은다(문장구조·표현·문법 칸만 — 낱말은 단어 시험). */
export function notePool(language: string, key: string, reason: PoolReason, now = Date.now(), scene?: LessonScene): void {
  if (!/^[efg]\|/.test(key)) return;
  if (scene?.line) {
    const mark = `${key}\n${scene.line}`;
    const noted = readJson<string[]>(notedKey(language), []);
    if (noted.includes(mark)) return;
    writeJson(notedKey(language), [...noted, mark].slice(-NOTED_MAX));
  }
  const pool = readPool(language, now);
  const entry = pool[key] ?? { at: now, r: [] };
  const scenes = scene?.line ? [scene, ...(entry.s ?? []).filter((one) => one.line !== scene.line)].slice(0, SCENES_MAX) : entry.s;
  pool[key] = { at: now, r: entry.r.includes(reason) ? entry.r : [...entry.r, reason], ...(scenes?.length ? { s: scenes } : {}) };
  writeJson(poolKey(language), pool);
  if (reason === "claimed") {
    // 알아요로 넘긴 것은 떠올리기(3칸)부터 확인.
    const ladder = readLadder(language);
    if (!ladder[key]) writeJson(ladderKey(language), { ...ladder, [key]: 3 });
  }
}

export function readLadder(language: string): ExamLadder {
  return readJson<ExamLadder>(ladderKey(language), {});
}

export function examDue(pool: ExamPool): boolean {
  return Object.keys(pool).length >= EXAM_POOL_MIN;
}

// ---------- 문제 ----------

/** 소재 하나·칸 하나의 문제(그 칸을 못 만들면 위 칸으로, 4칸도 없으면 아래 칸으로). */
export function rungQuestion(
  language: string,
  key: string,
  rung: number,
  options: { stage: number; seed: string; avoid?: ReadonlySet<string>; own?: readonly LessonScene[] },
): { rung: number; question: QuizQuestion } | null {
  const order = [rung, ...[1, 2, 3, 4].filter((n) => n > rung), ...[1, 2, 3, 4].filter((n) => n < rung).reverse()];
  // 내 장면(통화에서 고친 문장)이 있으면 그 문장으로 먼저 — 4칸은 내가 실제로 한 틀린 말 그대로(2026-11-01 사용자 "그 문장을 문제 소재로").
  for (const scene of options.own ?? []) {
    if (options.avoid?.has(scene.line)) continue;
    for (const n of order) {
      const question = sceneQuestion(language, key, n, scene, options.seed);
      if (question) return { rung: n, question };
    }
  }
  for (const n of order) {
    const question = n === 4 ? spotFor(language, key, options) : buildQuiz(language, key, { kinds: [RUNG_KIND[n]!], stage: options.stage, seed: `${options.seed}|${n}` })?.questions.find((q) => q.kind === RUNG_KIND[n] && !(options.avoid && "text" in q && options.avoid.has(q.text)));
    if (question) return { rung: n, question };
  }
  return null;
}

function sceneQuestion(language: string, key: string, rung: number, scene: LessonScene, seed: string): QuizQuestion | null {
  const random = rng(`${key}|${seed}|scene|${rung}`);
  if (rung === 4 && scene.said && scene.said.trim() !== scene.line.trim()) return spotFromCard(language, { wrong: scene.said, right: scene.line });
  const piece = pieceIn(language, key, scene.line);
  if (!piece) return null;
  const source: QuizSource = { text: scene.line, gloss: { en: "", raw: scene.meaning ?? "" }, from: "call", stage: 1, piece, who: "me", own: true, ...(key.startsWith("f|") ? { frame: key.slice(2) } : {}) };
  if (rung === 1) return chooseOf(language, key, source, random);
  if (rung === 2) return orderOf(language, source, random);
  if (rung === 3) return typeOf(language, source, key);
  return spotOf(language, key, source, random);
}

function spotFor(language: string, key: string, options: { stage: number; seed: string; avoid?: ReadonlySet<string> }): QuizQuestion | null {
  const random = rng(`${key}|${options.seed}|spot`);
  const sources = shuffled(quizSources(language, key).filter((source) => source.who !== "them" && (source.stage === 0 || source.stage <= options.stage + 1)), random);
  for (const source of sources) {
    if (options.avoid?.has(source.text)) continue;
    const spot = spotOf(language, key, source, random);
    if (spot) return spot;
  }
  return null;
}

/**
 * 대화 응답 한 문제: 대본의 상대 줄 → 바로 다음 내 줄(그 소재가 든)을 고른다. 오답은 같은 내 줄에서 그 소재 자리만 흔한 실수 꼴로 바꾼 것
 * (고르기 문제와 같은 오답 — 다른 대본의 아무 줄은 질문과 상관없어 한눈에 지워졌다, 2026-11-01 변경 감시 리뷰, RULES 11②).
 * 상대 줄은 듣고(🔊) 고르며 글은 답한 뒤에(QuizPlayer ReplyView).
 */
export function replyQuestion(language: string, key: string, options: { stage: number; seed: string; avoid?: ReadonlySet<string> }): QuizQuestion | null {
  const random = rng(`${key}|${options.seed}|reply`);
  const mine = new Map(quizSources(language, key).filter((source) => source.who !== "them" && source.piece).map((source) => [source.text, source] as const));
  const scripts = allScriptsFor(language).filter((script) => script.stage <= options.stage + 1);
  for (const script of shuffled(scripts, random)) {
    for (let i = 1; i < script.lines.length; i += 1) {
      const me = script.lines[i]!;
      const them = script.lines[i - 1]!;
      const source = mine.get(me.text);
      if (me.who !== "me" || them.who === "me" || !source || options.avoid?.has(me.text)) continue;
      const choose = chooseOf(language, key, source, random);
      if (choose?.kind !== "choose") continue;
      const lines = choose.options.map((option) => `${choose.before}${option}${choose.after}`);
      if (new Set(lines).size < 3) continue;
      return { kind: "reply", them: them.text, themGloss: them.gloss as ScriptGloss, text: me.text, options: lines, answer: choose.answer, gloss: me.gloss as ScriptGloss, from: script.id };
    }
  }
  return null;
}

/** 맞혔던 소재 중 잊을 때가 된 것(연속 맞힘 1 이상, 쉬는 때가 지남) — 오래된 것부터. */
export function dueKnown(log: QuizLog, now = Date.now()): string[] {
  return Object.entries(log)
    .filter(([key, entry]) => /^[efg]\|/.test(key) && streakOf(entry) > 0 && restUntil(entry) <= now)
    .sort((a, b) => restUntil(a[1]) - restUntil(b[1]))
    .map(([key]) => key);
}

/**
 * 시험 한 판. pool = 모인 소재, ladder = 칸, log = 퀴즈 기록, words = 어휘 파트에 낼 낱말 열쇠(단어 시험에서 못 익힌 것 — 부르는 쪽이 고름),
 * wordQuestion = 낱말 한 문제 만드는 법(어휘 탭과 같게).
 */
export function buildExam(input: {
  language: string;
  stage: number;
  pool: ExamPool;
  ladder: ExamLadder;
  log: QuizLog;
  now?: number;
  seed?: string;
  words?: readonly string[];
  wordQuestion?: (key: string) => QuizQuestion | null;
}): ExamItem[] {
  const now = input.now ?? Date.now();
  const seed = input.seed ?? `${input.language}|exam|${Math.floor(now / DAY_MS)}`;
  const random = rng(seed);
  const used = new Set<string>();
  const texts = new Set<string>();
  const items: ExamItem[] = [];
  const textOf = (q: QuizQuestion) => ("text" in q ? q.text : "") || ("right" in q ? q.right : "");
  const push = (item: ExamItem) => {
    items.push(item);
    for (const key of item.keys ?? [item.key]) used.add(key);
    const text = textOf(item.question);
    if (text) texts.add(text);
  };

  // 1. 어휘.
  for (const key of input.words ?? []) {
    if (items.length >= VOCAB_COUNT) break;
    const question = input.wordQuestion?.(key);
    if (question && !texts.has(textOf(question))) push({ key, section: "vocab", question });
  }

  // 모인 소재(알아요 → 틀림 → 막힘 → 열어 봄 순, 같으면 오래된 것) + 잊을 때 된 것.
  // 내 장면(통화에서 고친 문장)이 붙은 소재가 맨 앞 — 그 문장을 문제로 내는 게 이 시험에서 가장 값지다(2026-11-01).
  const weight = (entry: PoolEntry) => (entry.s?.length ? 0 : entry.r.includes("claimed") ? 1 : entry.r.includes("wrong") ? 2 : entry.r.includes("stuck") ? 3 : 4);
  const pooled = Object.entries(input.pool)
    .sort((a, b) => weight(a[1]) - weight(b[1]) || a[1].at - b[1].at)
    .map(([key]) => key);
  const known = dueKnown(input.log, now).filter((key) => !input.pool[key]);
  const left = EXAM_SIZE - items.length - REPLY_COUNT - DIALOG_COUNT;
  const fromPool = Math.min(pooled.length, Math.round(left * 0.7) + Math.max(0, Math.round(left * 0.3) - known.length));
  const chosen = [...pooled.slice(0, fromPool), ...known.slice(0, Math.max(0, left - Math.min(fromPool, pooled.length)))];

  // 4·5. 대화 응답·짧은 대화를 먼저 고른다(소재를 차지하므로) — 모인 소재에서.
  const replies: ExamItem[] = [];
  for (const key of shuffled(pooled, random)) {
    if (replies.length >= REPLY_COUNT) break;
    if (used.has(key) || key.startsWith("g|")) continue;
    const question = replyQuestion(input.language, key, { stage: input.stage, seed, avoid: texts });
    if (question) {
      replies.push({ key, section: "reply", question });
      used.add(key);
      texts.add(textOf(question));
    }
  }
  const dialogs: ExamItem[] = [];
  const poolSet = new Set(pooled);
  for (let n = 0; n < DIALOG_COUNT; n += 1) {
    const made = multiOf(input.language, { stage: input.stage, seed: `${seed}|dialog|${n}`, learned: (key) => poolSet.has(key) && !used.has(key), avoid: texts });
    if (!made) break;
    dialogs.push({ key: made.keys[0]!, keys: made.keys, section: "dialog", question: made.question });
    for (const key of made.keys) used.add(key);
    texts.add(textOf(made.question));
  }

  // 2·3. 알아보기(1·2칸)·떠올리기(3·4칸).
  const ladderItems: ExamItem[] = [];
  for (const key of chosen) {
    if (used.has(key)) continue;
    const want = Math.min(4, Math.max(1, input.ladder[key] ?? 1));
    const made = rungQuestion(input.language, key, want, { stage: input.stage, seed, avoid: texts, ...(input.pool[key]?.s?.length ? { own: input.pool[key]!.s } : {}) });
    if (!made) continue;
    used.add(key);
    texts.add(textOf(made.question));
    ladderItems.push({ key, section: made.rung <= 2 ? "recognize" : "recall", rung: made.rung, question: made.question, ...(input.pool[key]?.r.includes("claimed") ? { claimed: true } : {}) });
  }
  const recognize = shuffled(ladderItems.filter((item) => item.section === "recognize"), random);
  const recall = shuffled(ladderItems.filter((item) => item.section === "recall"), random);
  return [...items, ...recognize, ...recall, ...replies, ...dialogs];
}

// ---------- 결과 ----------

export type ExamOutcome = {
  result: CheckResult;
  /** 열쇠마다 맞음(퀴즈 기록·다시 보기에 남길 것). */
  answers: { key: string; correct: boolean }[];
  ladder: ExamLadder;
  pool: ExamPool;
  /** 알아요로 넘긴 문장구조를 시험에서 맞힘 → 익힘으로 보낼 것. */
  confirmed: string[];
};

function partOfKey(key: string): PartId {
  return key.startsWith("w|") ? "vocab" : key.startsWith("e|") ? "expression" : "grammar";
}

/** answers = 문제마다 첫 답(맞음/틀림, 못 푼 것 null). 복합 문제(dialog)는 소재마다 맞음을 parts로. */
export function finishExam(input: {
  items: readonly ExamItem[];
  answers: readonly (boolean | null)[];
  parts?: readonly ({ key: string; correct: boolean }[] | undefined)[];
  stage: number;
  pool: ExamPool;
  ladder: ExamLadder;
  now?: number;
}): ExamOutcome {
  const now = input.now ?? Date.now();
  const sections: Partial<Record<ExamSection, Tally>> = {};
  const parts: Partial<Record<PartId, Tally>> = {};
  const wrong: string[] = [];
  const answers: { key: string; correct: boolean }[] = [];
  const ladder = { ...input.ladder };
  const pool = { ...input.pool };
  const confirmed: string[] = [];
  input.items.forEach((item, i) => {
    const answer = input.answers[i];
    if (answer === null || answer === undefined) return;
    const section = (sections[item.section] ??= [0, 0]);
    section[1] += 1;
    if (answer) section[0] += 1;
    const perKey = input.parts?.[i] ?? (item.keys ?? [item.key]).map((key) => ({ key, correct: answer }));
    for (const one of perKey) {
      const part = (parts[partOfKey(one.key)] ??= [0, 0]);
      part[1] += 1;
      if (one.correct) part[0] += 1;
      answers.push(one);
      if (one.key.startsWith("w|")) continue;
      if (one.correct) {
        const rung = item.rung ?? ladder[one.key] ?? 1;
        ladder[one.key] = Math.min(4, rung + 1);
        delete pool[one.key];
        if (item.claimed && one.key.startsWith("f|")) confirmed.push(one.key.slice(2));
      } else {
        ladder[one.key] = Math.max(1, (item.rung ?? ladder[one.key] ?? 1) - 1);
        const kept = pool[one.key]?.s;
        pool[one.key] = { at: now, r: [...new Set([...(pool[one.key]?.r ?? []).filter((r) => r !== "claimed"), "wrong" as const])], ...(kept?.length ? { s: kept } : {}) };
        if (!wrong.includes(one.key)) wrong.push(one.key);
      }
    }
  });
  const cleanParts: Partial<Record<PartId, Tally>> = {};
  for (const part of PART_IDS) if (parts[part]) cleanParts[part] = parts[part];
  return { result: { at: now, stage: input.stage, parts: cleanParts, origins: {}, wrong: wrong.slice(0, 30), kind: "exam", sections }, answers, ladder, pool, confirmed };
}

export function saveExamState(language: string, outcome: Pick<ExamOutcome, "ladder" | "pool">): void {
  writeJson(ladderKey(language), outcome.ladder);
  writeJson(poolKey(language), outcome.pool);
}

/** 테스트용: 열쇠 하나가 시험 씨앗마다 같은 문제를 받는지. */
export function examSeedOf(language: string, now: number): string {
  return `${language}|exam|${Math.floor(now / DAY_MS)}|${hash(language)}`;
}

export type { QuizSource };
