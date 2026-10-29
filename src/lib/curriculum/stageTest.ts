/**
 * 단계 시험(2026-10-29 사용자 "시험 + 퀴즈·지속 학습, 시험을 중심으로" → "2번 해줘"): "다음 단계로" 앞에서, 그리고 큰 시험 뒤 6주가 지나면 권하는 시험.
 *
 * 연습(대본 통과·네 갈래 70%)으로 다음 단계 조건이 차도, 외워서 넘은 것과 실제로 되는 것은 다르다 — 그 단계를 힌트 없이 한 번에 푼다.
 *   문제 24 = 그 단계 16 · 앞 단계 5(잊지 않았는지) · 다음 단계 3(미리 되는지). 열쇠마다 퀴즈 모양 한 문제(고르기·순서 번갈아, 5번째마다 말하기 — 넷까지).
 *   넘음 = 그 단계 문제 70% 이상(말하기 건너뛴 것은 뺌). 넘으면 다음 단계로, 못 넘으면 그 단계에서 틀린 것이 다시 볼 것으로 가고 같은 날엔 다시 못 본다.
 * 결과는 이번 주 확인·처음 시험과 같은 모양(curriculum/checkup.ts CheckResult, kind "stage", passed). 레벨·등급은 없다. 순수 모듈(화면 studyMap/CheckupPlayer·테스트).
 */
import { DAY_MS } from "./dailyPlan.ts";
import { isBigTest, partOf, type CheckResult, type StageKey, type Tally } from "./checkup.ts";
import { stageKeys } from "./placement.ts";
import { buildQuiz, type QuizQuestion } from "./quiz.ts";
import type { PartId } from "../notes/stageParts.ts";

export type StageTestItem = { key: string; stage: number; part: PartId; question: QuizQuestion };

export const STAGE_TEST_SIZE = 24;
export const STAGE_TEST_SAY = 4;
export const STAGE_TEST_PASS = 0.7;
/** 큰 시험 뒤 이만큼 지나면 오늘 할 것에서 단계 시험을 권한다. */
export const BIG_TEST_EVERY_MS = 42 * DAY_MS;
/** 큰 시험을 한 번도 안 본 사람(대화 예시로 고른 사람)에겐 처음 보고 이만큼 뒤에 권한다. */
export const BIG_TEST_FIRST_MS = 3 * DAY_MS;

function hash(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function shuffled<T>(list: readonly T[], seed: string): T[] {
  let a = hash(seed) || 1;
  const random = () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const out = [...list];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}

/** 같은 날엔 같은 문제. */
export function stageTestSeed(language: string, stage: number, now = Date.now()): string {
  return `${language}|stage${stage}|d${Math.floor(now / DAY_MS)}`;
}

/** 단계 시험 문제(그 단계 16 · 앞 단계 5 · 다음 단계 3, 모자라면 그 단계에서 채움). */
export function buildStageTest(input: { language: string; stage: number; now?: number; seed?: string }): StageTestItem[] {
  const { language, stage } = input;
  const seed = input.seed ?? stageTestSeed(language, stage, input.now);
  const here = shuffled(stageKeys(language, stage), `${seed}|here`);
  const before = shuffled(Array.from({ length: stage - 1 }, (_, i) => stageKeys(language, i + 1)).flat(), `${seed}|before`);
  const after = stage < 5 ? shuffled(stageKeys(language, stage + 1), `${seed}|after`) : [];
  const quota: [string[], number, number][] = [
    [here, 16, stage],
    [before, 5, 0],
    [after, 3, stage + 1],
  ];
  const items: StageTestItem[] = [];
  const used = new Set<string>();
  let says = 0;
  let turn = 0;
  const stageOfKey = (key: string, fallback: number) => {
    if (fallback) return fallback;
    for (let s = 1; s < stage; s += 1) if (stageKeys(language, s).includes(key)) return s;
    return stage;
  };
  const add = (key: string, at: number): boolean => {
    if (used.has(key)) return false;
    used.add(key);
    const quiz = buildQuiz(language, key, { seed });
    if (!quiz) return false;
    const pick = (kind: QuizQuestion["kind"]) => quiz.questions.find((q) => q.kind === kind);
    const s = stageOfKey(key, at);
    // 말하기는 다음 단계 것엔 내지 않는다.
    const wantSay = says < STAGE_TEST_SAY && s <= stage && items.length % 5 === 4;
    const question = (wantSay ? pick("say") : undefined) ?? (turn % 2 === 0 ? (pick("choose") ?? pick("order")) : (pick("order") ?? pick("choose")));
    if (!question) return false;
    if (question.kind === "say") says += 1;
    else turn += 1;
    items.push({ key, stage: s, part: partOf(language, key, question.kind), question });
    return true;
  };
  for (const [keys, count, at] of quota) {
    let n = 0;
    for (const key of keys) {
      if (n >= count || items.length >= STAGE_TEST_SIZE) break;
      if (add(key, at)) n += 1;
    }
  }
  for (const key of here) {
    if (items.length >= STAGE_TEST_SIZE) break;
    add(key, stage);
  }
  // 섞되 말하기 자리는 5번째마다.
  const sayItems = items.filter((item) => item.question.kind === "say");
  const rest = shuffled(items.filter((item) => item.question.kind !== "say"), `${seed}|order`);
  const out: StageTestItem[] = [];
  while (rest.length || sayItems.length) {
    if (out.length % 5 === 4 && sayItems.length) out.push(sayItems.shift()!);
    else if (rest.length) out.push(rest.shift()!);
    else out.push(sayItems.shift()!);
  }
  return out;
}

/** 결과(kind "stage"): 단계별·갈래별 맞힌 수, 넘었는지, 그 단계와 앞 단계에서 틀린 것(다시 볼 것으로). */
export function stageTestResult(items: readonly StageTestItem[], answers: readonly (boolean | null)[], stage: number, now = Date.now()): CheckResult {
  const stages: Partial<Record<StageKey, Tally>> = {};
  const parts: CheckResult["parts"] = {};
  const wrong: string[] = [];
  items.forEach((item, i) => {
    const answer = answers[i];
    if (answer === null || answer === undefined) return;
    const s = (stages[String(item.stage) as StageKey] ??= [0, 0]);
    const p = (parts[item.part] ??= [0, 0]);
    s[1] += 1;
    p[1] += 1;
    if (answer) {
      s[0] += 1;
      p[0] += 1;
    } else if (item.stage <= stage && !wrong.includes(item.key)) wrong.push(item.key);
  });
  const here = stages[String(stage) as StageKey];
  const passed = Boolean(here && here[1] > 0 && here[0] / here[1] >= STAGE_TEST_PASS);
  return { at: now, stage, parts, origins: {}, wrong, kind: "stage", stages, passed };
}

/** 오늘 그 단계 시험에서 못 넘었는지(같은 날엔 다시 안 보고 결과만 보인다). */
export function failedToday(results: readonly CheckResult[], stage: number, now = Date.now()): CheckResult | null {
  const today = Math.floor(now / DAY_MS);
  return [...results].reverse().find((r) => r.kind === "stage" && r.stage === stage && !r.passed && Math.floor(r.at / DAY_MS) === today) ?? null;
}

/**
 * 오늘 할 것에서 단계 시험을 권할지: 마지막 큰 시험에서 6주, 큰 시험이 없으면 이 폰에서 처음 본 지 3일(대화 예시로 고른 사람).
 */
export function bigTestDue(results: readonly CheckResult[], firstSeen: number, now = Date.now()): boolean {
  const last = results.filter(isBigTest).reduce((max, r) => Math.max(max, r.at), 0);
  if (last) return now - last >= BIG_TEST_EVERY_MS;
  return firstSeen > 0 && now - firstSeen >= BIG_TEST_FIRST_MS;
}
