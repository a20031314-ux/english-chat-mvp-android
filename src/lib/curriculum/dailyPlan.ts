/**
 * 오늘 할 것(2026-10-28 사용자 "매일 학습할 걸 정해 주는 흐름 — 기본은 커리큘럼 순서, 혹은 원하는 대로, 학습 후 아는 부분·모르는 부분을 체크해 반영"
 * → 분량은 학습자가 고르되 "n일 완성", 순서 = 커리큘럼 순서(기본)·내 기록에 맞춰, 헷갈리면 다시 돌리기).
 *
 * 모델을 부르지 않는다. 재료: 그 언어 대본·문장구조(stageScripts·frames), 통과한 id, 다시 볼 것(review — 학습 끝 체크).
 * - 다시 볼 것: 헷갈려요 → 2일 뒤, 다시 헷갈려요 → 또 2일 뒤, 그 뒤 알아요 → 7일 뒤 한 번 더, 또 알아요 → 끝.
 * - 오늘 목록: 날짜가 지난 다시 볼 것 먼저, 그다음 아직 안 한 것(커리큘럼 순서 = 지금 단계부터 상황 대본 → 표현·문법 대본 → 문장구조,
 *   내 기록에 맞춰 = 오늘의 대본(서버 scriptPick)을 맨 앞에) — 고른 분량(분)이 찰 때까지.
 * - 문장구조 중심(2026-10-30 사용자 "단계별 학습은 문장틀을 숙지시키는 게 목표", `hub/work/drafts/frames-first-2026-10-30.md`): 틀이 있는 단계는
 *   새 것 = 문장구조만(대본은 단계 칸에서 고르는 연습), 그 뒤 꺼내 쓰기 한 칸(kind "recall", curriculum/recall.ts — 익힌 틀로 뜻 보고 말하기).
 * - 약한 곳은 퀴즈로(2026-10-28 사용자 "틀린 부분을 퀴즈로", curriculum/quiz.ts): 날짜 된 다시 볼 것·틀린 틀 다시 연습(노트 카드)은
 *   원래 대본 대신 짧은 퀴즈(문제를 못 만들면 원래 대본). 약한 곳은 분량의 절반까지 — 새 것도 매일 조금은.
 */
import { framesOfScript, allFramesFor, type Frame } from "./frames.ts";
import { allScriptsFor, scriptForExpressions, type StageScript } from "./stageScripts.ts";
import { type QuizCard } from "./quiz.ts";

export type PlanOrder = "curriculum" | "record";
export const PACES = [5, 10, 20] as const;
export type Pace = (typeof PACES)[number];

/**
 * 오늘 목록 한 칸. quiz는 id = 열쇠(e|·f|·g|), review = 다시 볼 것 열쇠(틀린 틀 다시 연습에서 온 것은 없음 — 그땐 card),
 * then = 퀴즈를 틀렸을 때 이어서 할 원래 대본·문장구조.
 */
export type PlanItem = {
  id: string;
  kind: "script" | "frame" | "quiz" | "recall";
  stage: number;
  minutes: number;
  review?: string;
  card?: QuizCard;
  then?: { id: string; stage: number };
};

export type ReviewEntry = { due: number; step: number; at: number };
export type ReviewMap = Record<string, ReviewEntry>;

export const DAY_MS = 24 * 60 * 60 * 1000;
export const REVIEW_SOON_MS = 2 * DAY_MS;
export const REVIEW_LATER_MS = 7 * DAY_MS;

/** 대본 하나에 드는 어림 분(줄마다 듣고 말하기 약 18초, 적어도 2분). 문장구조는 예문 넷 2분. */
export function minutesOf(item: StageScript | Frame): number {
  return "lines" in item ? Math.max(2, Math.round((item.lines.length * 18) / 60)) : 2;
}

/** 다시 볼 열쇠가 가리키는 것(표현 글자 또는 문장구조 틀). */
export function reviewLabel(language: string, key: string): string {
  if (key.startsWith("f|")) return allFramesFor(language).find((f) => f.id === key.slice(2))?.pattern ?? "";
  if (key.startsWith("g|")) return "";
  return key.slice(2);
}

/** 문법 칸 열쇠(g|단계:번호) — 대본의 grammar 태그. */
export function grammarKey(stage: number, index: number): string {
  return `g|${stage}:${index}`;
}

export type Learned = { frames: string[]; grammar: string[]; words: string[] };
/** 열쇠가 이 언어 커리큘럼에 있는 것인지(서버가 받은 열쇠를 거른다). */
export function isCurriculumKey(language: string, key: string): boolean {
  if (key.length > 80) return false;
  if (key.startsWith("f|")) return allFramesFor(language).some((f) => f.id === key.slice(2));
  if (key.startsWith("g|")) return itemForKey(language, key) !== null;
  if (key.startsWith("e|")) return allScriptsFor(language).some((s) => s.expressions.includes(key.slice(2)));
  // 뼈대 밖에서 막힌 것(curriculum/gaps.ts) — 재료는 화면이 넘김.
  if (key.startsWith("u|")) return key.length > 2;
  // 빈도 단어(curriculum/vocabBank.ts) — 재료는 화면이 카드를 받아 넘김.
  if (key.startsWith("w|")) return key.length > 2;
  return false;
}

/** 다시 볼 것 열쇠: 표현은 e|표현, 문장구조는 f|id, 문법은 g|단계:번호. */
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

/** 다시 볼 열쇠를 무엇으로 연습할지: 문장구조는 그대로, 문법(g|단계:번호)은 그 문법을 쓰는 대본, 표현은 그 표현이 든 대본. */
export function itemForKey(language: string, key: string): PlanItem | null {
  if (key.startsWith("g|")) {
    const [stage, index] = key.slice(2).split(":").map(Number);
    const script = allScriptsFor(language).find((s) => s.stage === stage && (s.grammar ?? []).includes(index!));
    return script ? { id: script.id, kind: "script", stage: script.stage, minutes: minutesOf(script), review: key } : null;
  }
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
