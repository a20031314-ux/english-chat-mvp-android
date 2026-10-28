/**
 * 오늘 할 것(2026-10-28 사용자 "매일 학습할 걸 정해 주는 흐름 — 기본은 커리큘럼 순서, 혹은 원하는 대로, 학습 후 아는 부분·모르는 부분을 체크해 반영"
 * → 분량은 학습자가 고르되 "n일 완성", 순서 = 커리큘럼 순서(기본)·내 기록에 맞춰, 헷갈리면 다시 돌리기).
 *
 * 모델을 부르지 않는다. 재료: 그 언어 대본·문장구조(stageScripts·frames), 통과한 id, 다시 볼 것(review — 학습 끝 체크).
 * - 다시 볼 것: 헷갈려요 → 2일 뒤, 다시 헷갈려요 → 또 2일 뒤, 그 뒤 알아요 → 7일 뒤 한 번 더, 또 알아요 → 끝.
 * - 오늘 목록: 날짜가 지난 다시 볼 것 먼저, 그다음 아직 안 한 것(커리큘럼 순서 = 지금 단계부터 상황 대본 → 표현·문법 대본 → 문장구조,
 *   내 기록에 맞춰 = 오늘의 대본(서버 scriptPick)을 맨 앞에) — 고른 분량(분)이 찰 때까지.
 */
import { framesOfScript, allFramesFor, type Frame } from "./frames.ts";
import { allScriptsFor, isSituationScript, scriptForExpressions, type StageScript } from "./stageScripts.ts";

export type PlanOrder = "curriculum" | "record";
export const PACES = [5, 10, 20] as const;
export type Pace = (typeof PACES)[number];

export type PlanItem = { id: string; kind: "script" | "frame"; stage: number; minutes: number; review?: string };

export type ReviewEntry = { due: number; step: number; at: number };
export type ReviewMap = Record<string, ReviewEntry>;

export const DAY_MS = 24 * 60 * 60 * 1000;
export const REVIEW_SOON_MS = 2 * DAY_MS;
export const REVIEW_LATER_MS = 7 * DAY_MS;

/** 대본 하나에 드는 어림 분(줄마다 듣고 말하기 약 18초, 적어도 2분). 문장구조는 예문 넷 2분. */
export function minutesOf(item: StageScript | Frame): number {
  return "lines" in item ? Math.max(2, Math.round((item.lines.length * 18) / 60)) : 2;
}

/** 커리큘럼 순서: 단계마다 상황 대본(상황 차례) → 표현·문법 대본 → 문장구조. */
export function curriculumItems(language: string, fromStage = 1): PlanItem[] {
  const scripts = allScriptsFor(language);
  const frames = allFramesFor(language);
  const stages = [...new Set([...scripts.map((s) => s.stage), ...frames.map((f) => f.stage)])].sort((a, b) => a - b);
  const out: PlanItem[] = [];
  for (const stage of stages) {
    if (stage < fromStage) continue;
    const here = scripts.filter((s) => s.stage === stage);
    const situations = here.filter(isSituationScript).sort((a, b) => (a.situation ?? 0) - (b.situation ?? 0));
    const extras = here.filter((s) => !isSituationScript(s));
    for (const script of [...situations, ...extras]) out.push({ id: script.id, kind: "script", stage, minutes: minutesOf(script) });
    for (const frame of frames.filter((f) => f.stage === stage)) out.push({ id: frame.id, kind: "frame", stage, minutes: minutesOf(frame) });
  }
  return out;
}

/** 전체 커리큘럼(1단계부터)을 이 분량으로 마치는 데 드는 어림 일수 — 다시 볼 것 몫 20%를 얹는다. */
export function daysToFinish(language: string, pace: number, fromStage = 1): number {
  const total = curriculumItems(language, fromStage).reduce((sum, item) => sum + item.minutes, 0);
  return total ? Math.ceil((total * 1.2) / Math.max(1, pace)) : 0;
}

/** 지금 단계부터 아직 안 한 것을 이 분량으로 마치는 어림 일수(n일 완성 — 고른 분량마다). */
export function daysLeft(language: string, pace: number, passed: ReadonlySet<string>, fromStage = 1): number {
  const total = curriculumItems(language, fromStage)
    .filter((item) => !passed.has(item.id))
    .reduce((sum, item) => sum + item.minutes, 0);
  return total ? Math.ceil((total * 1.2) / Math.max(1, pace)) : 0;
}

/** 다시 볼 열쇠가 가리키는 것(표현 글자 또는 문장구조 틀). */
export function reviewLabel(language: string, key: string): string {
  if (key.startsWith("f|")) return allFramesFor(language).find((f) => f.id === key.slice(2))?.pattern ?? "";
  return key.slice(2);
}

/** 다시 볼 것 열쇠: 표현은 e|표현, 문장구조는 f|id. */
export function reviewKeysOf(language: string, id: string): string[] {
  const script = allScriptsFor(language).find((s) => s.id === id);
  if (script) return [...script.expressions.map((e) => `e|${e}`), ...framesOfScript(script).map((f) => `f|${f}`)].slice(0, 8);
  return allFramesFor(language).some((f) => f.id === id) ? [`f|${id}`] : [];
}

/** 학습 끝 체크 하나를 다시 볼 것에 반영(헷갈려요 → 2일, 그 뒤 알아요 → 7일 → 끝). */
export function applyCheck(review: ReviewMap, key: string, known: boolean, now = Date.now()): ReviewMap {
  const before = review[key];
  const next = { ...review };
  if (!known) next[key] = { due: now + REVIEW_SOON_MS, step: 1, at: now };
  else if (!before) return review;
  else if (before.step >= 2) delete next[key];
  else next[key] = { due: now + REVIEW_LATER_MS, step: 2, at: now };
  return next;
}

/** 다시 볼 열쇠를 무엇으로 연습할지: 문장구조는 그대로, 표현은 그 표현이 든 대본. */
function itemForKey(language: string, key: string): PlanItem | null {
  if (key.startsWith("f|")) {
    const frame = allFramesFor(language).find((f) => f.id === key.slice(2));
    return frame ? { id: frame.id, kind: "frame", stage: frame.stage, minutes: minutesOf(frame), review: key } : null;
  }
  const expression = key.slice(2);
  for (const stage of [1, 2, 3, 4, 5]) {
    const script = scriptForExpressions(language, stage, [expression]);
    if (script) return { id: script.id, kind: "script", stage: script.stage, minutes: minutesOf(script), review: key };
  }
  return null;
}

export function todayPlan(input: {
  language: string;
  stage: number;
  passed: ReadonlySet<string>;
  review: ReviewMap;
  pace: number;
  order: PlanOrder;
  /** 내 기록에 맞춰: 서버가 고른 오늘의 대본 id(scriptPick). */
  recommended?: string | null;
  now?: number;
}): PlanItem[] {
  const now = input.now ?? Date.now();
  const out: PlanItem[] = [];
  let used = 0;
  const take = (item: PlanItem) => {
    if (out.some((one) => one.id === item.id)) return false;
    if (out.length && used + item.minutes > input.pace) return false;
    out.push(item);
    used += item.minutes;
    return true;
  };
  const due = Object.entries(input.review)
    .filter(([, entry]) => entry.due <= now)
    .sort((a, b) => a[1].due - b[1].due);
  for (const [key] of due) {
    const item = itemForKey(input.language, key);
    if (item) take(item);
    if (used >= input.pace) return out;
  }
  const fresh = curriculumItems(input.language, input.stage).filter((item) => !input.passed.has(item.id));
  if (input.order === "record" && input.recommended) {
    const first = fresh.find((item) => item.id === input.recommended);
    if (first) take(first);
  }
  for (const item of fresh) {
    if (used >= input.pace) break;
    take(item);
  }
  return out;
}
