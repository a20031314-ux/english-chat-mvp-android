/**
 * 오늘 할 것(2026-10-28 사용자 "매일 학습할 걸 정해 주는 흐름 — 기본은 커리큘럼 순서, 혹은 원하는 대로, 학습 후 아는 부분·모르는 부분을 체크해 반영"
 * → 분량은 학습자가 고르되 "n일 완성", 순서 = 커리큘럼 순서(기본)·내 기록에 맞춰, 헷갈리면 다시 돌리기).
 *
 * 모델을 부르지 않는다. 재료: 그 언어 대본·문장구조(stageScripts·frames), 통과한 id, 다시 볼 것(review — 학습 끝 체크).
 * - 다시 볼 것: 헷갈려요 → 2일 뒤, 다시 헷갈려요 → 또 2일 뒤, 그 뒤 알아요 → 7일 뒤 한 번 더, 또 알아요 → 끝.
 * - 오늘 목록: 날짜가 지난 다시 볼 것 먼저, 그다음 아직 안 한 것(커리큘럼 순서 = 지금 단계부터 상황 대본 → 표현·문법 대본 → 문장구조,
 *   내 기록에 맞춰 = 오늘의 대본(서버 scriptPick)을 맨 앞에) — 고른 분량(분)이 찰 때까지.
 * - 문장구조 중심(2026-10-30 사용자 "단계별 학습은 문장틀을 숙지시키는 게 목표", `hub/drafts/frames-first-2026-10-30.md`): 틀이 있는 단계는
 *   새 것 = 문장구조만(대본은 단계 칸에서 고르는 연습), 그 뒤 꺼내 쓰기 한 칸(kind "recall", curriculum/recall.ts — 익힌 틀로 뜻 보고 말하기).
 * - 약한 곳은 퀴즈로(2026-10-28 사용자 "틀린 부분을 퀴즈로", curriculum/quiz.ts): 날짜 된 다시 볼 것·틀린 틀 다시 연습(노트 카드)은
 *   원래 대본 대신 짧은 퀴즈(문제를 못 만들면 원래 대본). 약한 곳은 분량의 절반까지 — 새 것도 매일 조금은.
 */
import { framesOfScript, allFramesFor, type Frame } from "./frames.ts";
import { allScriptsFor, isSituationScript, scriptForExpressions, type StageScript } from "./stageScripts.ts";
import { canQuiz, QUIZ_MINUTES, type QuizCard } from "./quiz.ts";

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

/** 오늘 할 것 안의 채우기 퀴즈 수(분량 5·10·20분 → 1·2·4). */
export function fillCount(pace: number): number {
  return pace >= 20 ? 4 : pace >= 10 ? 2 : 1;
}

export type ReviewEntry = { due: number; step: number; at: number };
export type ReviewMap = Record<string, ReviewEntry>;

export const DAY_MS = 24 * 60 * 60 * 1000;
export const REVIEW_SOON_MS = 2 * DAY_MS;
export const REVIEW_LATER_MS = 7 * DAY_MS;

/** 대본 하나에 드는 어림 분(줄마다 듣고 말하기 약 18초, 적어도 2분). 문장구조는 예문 넷 2분. */
export function minutesOf(item: StageScript | Frame): number {
  return "lines" in item ? Math.max(2, Math.round((item.lines.length * 18) / 60)) : 2;
}

/** 꺼내 쓰기 칸 id(오늘 목록, 하루 한 칸). */
export const RECALL_ITEM = "recall";

/** 커리큘럼 순서: 틀이 있는 단계는 문장구조만(2026-10-30), 틀이 없는 단계는 상황 대본(상황 차례) → 표현·문법 대본. */
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
    const stageFrames = frames.filter((f) => f.stage === stage);
    if (!stageFrames.length) for (const script of [...situations, ...extras]) out.push({ id: script.id, kind: "script", stage, minutes: minutesOf(script) });
    for (const frame of stageFrames) out.push({ id: frame.id, kind: "frame", stage, minutes: minutesOf(frame) });
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
  if (key.startsWith("g|")) return "";
  return key.slice(2);
}

/** 문법 칸 열쇠(g|단계:번호) — 대본의 grammar 태그. */
export function grammarKey(stage: number, index: number): string {
  return `g|${stage}:${index}`;
}

export type Learned = { frames: string[]; grammar: string[]; words: string[] };

/**
 * 오늘 한 것으로 배운 것 정리(2026-10-28 사용자 "학습한 걸 문장구조, 문법, 단어로 정리"): 대본·문장구조 id → 세 갈래 열쇠.
 * 문장구조 = 문장구조 자체 + 대본 줄의 문장구조 태그, 문법 = 대본 grammar 태그, 단어 = 대본 핵심 표현.
 */
export function learnedFrom(language: string, ids: readonly string[]): Learned {
  const scripts = allScriptsFor(language);
  const frames = allFramesFor(language);
  const out = { frames: new Set<string>(), grammar: new Set<string>(), words: new Set<string>() };
  for (const id of ids) {
    const frame = frames.find((f) => f.id === id);
    if (frame) {
      out.frames.add(`f|${frame.id}`);
      for (const index of frame.grammar ?? []) out.grammar.add(grammarKey(frame.stage, index));
      continue;
    }
    const script = scripts.find((s) => s.id === id);
    if (!script) continue;
    for (const f of framesOfScript(script)) out.frames.add(`f|${f}`);
    for (const index of script.grammar ?? []) out.grammar.add(grammarKey(script.stage, index));
    for (const e of script.expressions) out.words.add(`e|${e}`);
  }
  return { frames: [...out.frames].slice(0, 12), grammar: [...out.grammar].slice(0, 12), words: [...out.words].slice(0, 16) };
}

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

export function todayPlan(input: {
  language: string;
  stage: number;
  passed: ReadonlySet<string>;
  review: ReviewMap;
  pace: number;
  order: PlanOrder;
  /** 내 기록에 맞춰: 서버가 고른 오늘의 대본 id(scriptPick). */
  recommended?: string | null;
  /** 튜터가 같은 틀을 두 번 고친 것(/api/notebook redo) — 고친 줄로 퀴즈. */
  redo?: readonly { frame: string; card: QuizCard }[];
  /** 채우기(지속 학습, 2026-10-29 사용자 "지속학습에서 계속 던져주는 식"): 계속 공부가 고른 열쇠(아는지 확인·부족한 갈래·다지기) — FILL만큼 퀴즈로. */
  fill?: readonly string[];
  /** 대본 은행에서 고른 오늘의 장면(curriculum/scriptBank.ts) — 하루의 끝(설명·문제 다음 대화)에 한 칸, 2026-10-30. */
  scene?: { id: string; stage: number } | null;
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
  // 약한 곳(날짜 된 다시 볼 것 → 틀린 틀 다시 연습)은 분량의 절반까지, 하나는 늘.
  const weakBudget = Math.max(QUIZ_MINUTES, Math.floor(input.pace / 2));
  const weak = (key: string, card?: QuizCard) => {
    const practice = itemForKey(input.language, key);
    if (!practice) return;
    const item: PlanItem = canQuiz(input.language, key)
      ? {
          id: key,
          kind: "quiz",
          stage: practice.stage,
          minutes: QUIZ_MINUTES,
          ...(card ? { card } : { review: key }),
          then: { id: practice.id, stage: practice.stage },
        }
      : card
        ? { ...practice, review: undefined }
        : practice;
    if (out.length && used + item.minutes > weakBudget) return;
    take(item);
  };
  const due = Object.entries(input.review)
    .filter(([, entry]) => entry.due <= now)
    .sort((a, b) => a[1].due - b[1].due);
  for (const [key] of due) weak(key);
  for (const redo of input.redo ?? []) {
    const key = `f|${redo.frame}`;
    if (!out.some((item) => item.id === key)) weak(key, redo.card);
  }
  // 채우기 자리는 미리 비워 둔다(새 대본이 분량을 다 채우지 않게).
  const fillKeys = (input.fill ?? []).filter((key) => !out.some((item) => item.id === key) && canQuiz(input.language, key)).slice(0, fillCount(input.pace));
  // 꺼내 쓰기 자리도 미리(틀이 있는 단계면 하루 한 칸) — 문장구조 다음에 둔다.
  const recallItem: PlanItem | null = allFramesFor(input.language).some((f) => f.stage === input.stage) ? { id: RECALL_ITEM, kind: "recall", stage: input.stage, minutes: QUIZ_MINUTES } : null;
  const freshPace = input.pace - fillKeys.length * QUIZ_MINUTES - (recallItem ? recallItem.minutes : 0);
  if (used < freshPace) {
    const fresh = curriculumItems(input.language, input.stage).filter((item) => !input.passed.has(item.id));
    const takeFresh = (item: PlanItem) => {
      if (out.some((one) => one.id === item.id)) return;
      if (out.length && used + item.minutes > freshPace) return;
      out.push(item);
      used += item.minutes;
    };
    if (input.order === "record" && input.recommended) {
      const first = fresh.find((item) => item.id === input.recommended);
      if (first) takeFresh(first);
    }
    for (const item of fresh) {
      if (used >= freshPace) break;
      takeFresh(item);
    }
  }
  if (recallItem) {
    out.push(recallItem);
    used += recallItem.minutes;
  }
  for (const key of fillKeys) {
    const practice = itemForKey(input.language, key);
    out.push({ id: key, kind: "quiz", stage: practice?.stage ?? input.stage, minutes: QUIZ_MINUTES, ...(practice ? { then: { id: practice.id, stage: practice.stage } } : {}) });
    used += QUIZ_MINUTES;
  }
  if (input.scene && !out.some((item) => item.id === input.scene!.id)) {
    out.push({ id: input.scene.id, kind: "script", stage: input.scene.stage, minutes: SCENE_MINUTES });
    used += SCENE_MINUTES;
  }
  return out;
}

/** 은행 장면 한 칸(줄 8개, 내 줄 4개). */
export const SCENE_MINUTES = 3;
