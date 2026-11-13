/**
 * 수업 통화의 수업 계획(hub/work/drafts/lesson-plan-2026-11-12.md 3·4절). 순수 — 모델 없음, 이 폰의 장부(logLedger.ts)와 틀(frames.ts)만.
 *
 *   고르기  지난 수업 숙제 리뷰(review — 틀린 틀 → 안 푼 숙제 → 다 맞힌 틀, 하나) → 멈춘 자리(carry) → 앎인데 대화에서 안 쓴 틀(apply, 끌어내기부터)
 *           → 다시 볼 것(hard) → 지금 단계의 새 틀(new), 최대 셋.
 *   숙제    통화가 다룬 틀(covered)·다음 틀(next)을 통화 기록에 남김(lessonTrace) → 숙제 퀴즈가 그 틀 문제·예습을 냄(homeworkQuiz.ts) → 틀마다 결과(replay.ts quiz.frames).
 *   흐름    보여 주기(show) → 끌어내기(draw) → 옮겨 쓰기(move) → 다음 거 할까요(ask, 다음 소재가 있을 때만).
 *           넘기는 것은 앱이: 학습자 말에 그 틀이 나왔나(frameUsed, 맞다/틀리다는 나누지 않음) · 학습자가 말했나 · 감독의 move(다른 걸 하자/좋다).
 *   틀은 판정하지 않는다 — 튜터가 그 틀로 되받아 줄 뿐(사용자 2026-11-12), 틀이 나온 것은 통화 끝 장부 used(recapLedgerKeys)로만 남는다.
 */
import { checkStates } from "../curriculum/checkState.ts";
import { frameUsed } from "../curriculum/scriptBank.ts";
import type { Frame } from "../curriculum/frames.ts";
import type { LogEvent } from "../curriculum/logLedger.ts";
import { talkCounts } from "../curriculum/wordUse.ts";
import type { LessonRequest } from "./director.ts";
import { allFramesFor } from "../curriculum/frames.ts";
import { measured } from "../curriculum/firstCheck.ts";
import { readLedger } from "../curriculum/logLedger.ts";
import { readCalls } from "./callStore.ts";
import { readReplays, type StoredReplay } from "./replay.ts";
import type { SavedConversation } from "./saved.ts";

export type LessonStep = "show" | "draw" | "move" | "ask";
export type LessonWhy = "review" | "carry" | "apply" | "hard" | "new";
/** 지난 숙제에서 그 틀이 어땠나 — 틀림 · 다 맞힘 · 안 풂. */
export type HomeworkHow = "missed" | "right" | "undone";
export type LessonItem = { key: string; start: Exclude<LessonStep, "ask">; why: LessonWhy; words: string[]; review?: HomeworkHow };
/** 통화 하나가 다룬 틀(학습자가 말한 차례가 있었던 것)과 다음 틀 — 통화 기록에 남겨 숙제·다음 수업이 읽는다. */
export type LessonTrace = { covered: string[]; next?: string };
/** 다음 수업 첫머리에 다시 볼 지난 숙제의 틀 하나. */
export type HomeworkReview = { key: string; how: HomeworkHow };
/** 멈춘 자리 — 통화를 끝내면 다음 수업이 여기서. */
export type LessonSpot = { key: string; step: Exclude<LessonStep, "ask"> };
/** 통화 하나 동안의 진행. */
export type LessonRun = { items: LessonItem[]; at: number; step: LessonStep; asked: boolean };

export const LESSON_ITEMS = 3;
const LAST_STAGE = 5;
/** 단계 오르기: 그 단계 틀 중 대화에서 쓴 몫(사용자 결정 대기 — 전부/80%, 그 전까지 전부). */
export const STAGE_UP_SHARE = 1;

const frameKey = (frame: Pick<Frame, "id">) => `f|${frame.id}`;

/** 순수: 수업 단계 — 시작 단계에서, 그 단계 틀을 기준만큼 대화에서 썼으면 다음 단계로. */
export function lessonStage(frames: readonly Frame[], talked: ReadonlyMap<string, number>, start: number): number {
  let stage = Math.max(1, Math.min(LAST_STAGE, Math.round(start) || 1));
  while (stage < LAST_STAGE) {
    const here = frames.filter((frame) => frame.stage === stage);
    if (!here.length) break;
    const used = here.filter((frame) => talked.has(frameKey(frame))).length;
    if (used / here.length < STAGE_UP_SHARE) break;
    stage += 1;
  }
  return stage;
}

/** 순수: 틀에 넣을 낱말 — 예문 빈칸에서, 퀴즈로 앎인 낱말 먼저, 최대 셋. */
export function lessonWords(frame: Frame, known: (word: string) => boolean, max = 3): string[] {
  const slots: string[] = [];
  for (const example of frame.examples) {
    const slot = example.slot?.trim();
    if (slot && !slots.includes(slot)) slots.push(slot);
  }
  return [...slots.filter(known), ...slots.filter((slot) => !known(slot))].slice(0, max);
}

export type PickInput = {
  frames: readonly Frame[];
  events: readonly LogEvent[];
  /** 첫 측정 시작 단계(없으면 1). */
  start: number;
  spot: LessonSpot | null;
  /** 지난 수업 숙제 리뷰(lastHomework) — 맨 앞에 하나. */
  review?: HomeworkReview | null;
  max?: number;
};

/** 순수: 이번 수업의 소재 줄. 같은 기록이면 같은 계획. */
export function pickLesson(input: PickInput): { stage: number; items: LessonItem[] } {
  const { frames, events, spot } = input;
  const max = input.max ?? LESSON_ITEMS;
  const talked = talkCounts(events);
  const states = checkStates(events);
  const stage = lessonStage(frames, talked, input.start);
  const known = (word: string) => states.get(`w|${word.toLocaleLowerCase()}`)?.level === "known";
  const items: LessonItem[] = [];
  const take = (frame: Frame | undefined, start: LessonItem["start"], why: LessonWhy, review?: HomeworkHow) => {
    if (!frame || items.length >= max || items.some((item) => item.key === frameKey(frame))) return;
    items.push({ key: frameKey(frame), start, why, words: lessonWords(frame, known), ...(review ? { review } : {}) });
  };
  // 지금 단계부터, 아래 단계는 그 뒤(틀 파일 순서).
  const ordered = [...frames.filter((frame) => frame.stage === stage), ...frames.filter((frame) => frame.stage < stage).sort((a, b) => b.stage - a.stage)];

  // 숙제 리뷰: 틀렸거나 안 풀었으면 끌어내기부터, 다 맞혔으면 바로 다른 장면(옮겨 쓰기)으로.
  const review = input.review;
  if (review) take(frames.find((frame) => frameKey(frame) === review.key), review.how === "right" ? "move" : "draw", "review", review.how);
  if (spot) take(frames.find((frame) => frameKey(frame) === spot.key), spot.step, "carry");
  for (const frame of ordered) if (states.get(frameKey(frame))?.level === "known" && !talked.has(frameKey(frame))) take(frame, "draw", "apply");
  for (const frame of ordered) if (states.get(frameKey(frame))?.level === "hard") take(frame, "show", "hard");
  for (const frame of frames) if (frame.stage === stage && !states.has(frameKey(frame)) && !talked.has(frameKey(frame))) take(frame, "show", "new");
  return { stage, items };
}

/** 순수: 수업 시작 — 소재가 없으면 null(보통 수업 통화). */
export function startRun(items: readonly LessonItem[]): LessonRun | null {
  return items.length ? { items: [...items], at: 0, step: items[0].start, asked: false } : null;
}

/** 지금 소재. */
export function currentItem(run: LessonRun | null): LessonItem | null {
  return run ? (run.items[run.at] ?? null) : null;
}

/** 순수: 그 틀이 학습자 말에 나왔나(맞다/틀리다는 보지 않음). */
export function patternIn(pattern: string, heard: string): boolean {
  return Boolean(heard.trim()) && frameUsed(pattern, heard);
}

/**
 * 순수: 학습자 차례 하나 뒤의 진행. null = 소재가 끝남(그 뒤는 보통 수업 통화).
 *   spoke  학습자가 이번에 말했나(🙉·빈 말이 아님)
 *   used   그 말에 지금 틀이 나왔나
 *   move   감독이 본 학습자 뜻 — 다른 걸 하자(어느 단계에서나), 물은 뒤엔 좋다
 */
export function advanceRun(run: LessonRun, turn: { spoke: boolean; used: boolean; move: boolean }): LessonRun | null {
  const next = (): LessonRun | null => {
    const at = run.at + 1;
    const item = run.items[at];
    return item ? { items: run.items, at, step: item.start, asked: false } : null;
  };
  if (turn.move) return next();
  if (!turn.spoke) return run;
  const hasNext = run.at + 1 < run.items.length;
  switch (run.step) {
    case "show":
      return { ...run, step: turn.used ? "move" : "draw" };
    case "draw":
      return turn.used ? { ...run, step: "move" } : run;
    case "move":
      if (!turn.used) return run;
      return hasNext ? { ...run, step: "ask", asked: false } : null;
    case "ask":
      return { ...run, asked: true };
  }
}

/** 순수: 통화를 끝낼 때 남길 멈춘 자리 — 다음 거 할까요까지 왔으면 그 소재는 끝, 다음 소재가 멈춘 자리. */
export function lessonSpotOf(run: LessonRun | null): LessonSpot | null {
  if (!run) return null;
  if (run.step === "ask") {
    const after = run.items[run.at + 1];
    return after ? { key: after.key, step: after.start } : null;
  }
  const item = currentItem(run);
  return item ? { key: item.key, step: run.step } : null;
}

/** 순수: 감독에게 보낼 지금 소재(뜻은 영어 한 줄 — 모델에게만 가고 화면엔 안 보임, 예문은 싣지 않음). */
export function lessonRequestOf(frames: readonly Frame[], run: LessonRun | null, how?: "open" | "skip"): LessonRequest | undefined {
  const item = currentItem(run);
  if (!run || !item) return undefined;
  const frameOf = (key: string) => frames.find((frame) => frameKey(frame) === key);
  const frame = frameOf(item.key);
  if (!frame) return undefined;
  const after = run.items[run.at + 1];
  const nextFrame = after ? frameOf(after.key) : undefined;
  return {
    pattern: frame.pattern,
    meaning: frame.meaning.en,
    words: item.words,
    step: run.step,
    ...(run.asked ? { asked: true } : {}),
    ...(how === "open" ? { open: true } : how === "skip" ? { skip: true } : {}),
    // 숙제 리뷰는 그 소재의 첫 차례에만(첫 마디·⏭ — 그 뒤는 보통 소재처럼).
    ...(item.review && how ? { review: item.review } : {}),
    ...(after && nextFrame ? { next: { pattern: nextFrame.pattern, meaning: nextFrame.meaning.en, words: after.words } } : {}),
  };
}

/** 순수: 칠판 카드·⏭ — 보여 주기 단계에서만 틀 한 줄(그 뒤엔 답이 되므로 숨김), ⏭는 다음 소재가 있을 때만. */
export function lessonBoardOf(frames: readonly Frame[], run: LessonRun | null): { pattern: string; canSkip: boolean } | null {
  const item = currentItem(run);
  if (!run || !item) return null;
  const frame = frames.find((one) => frameKey(one) === item.key);
  return {
    pattern: run.step === "show" && frame ? frame.pattern : "",
    canSkip: run.at + 1 < run.items.length,
  };
}

/** 순수: 지금까지 다룬 틀·다음 틀(통화 기록에 남김). touched = 학습자가 말한 차례가 있었던 소재(차례대로). */
export function lessonTraceOf(run: LessonRun | null, touched: readonly string[], planned: readonly LessonItem[]): LessonTrace | null {
  if (!touched.length) return null;
  const current = currentItem(run);
  const next = current && !touched.includes(current.key) ? current.key : planned.find((item) => !touched.includes(item.key))?.key;
  return { covered: [...touched], ...(next ? { next } : {}) };
}

/**
 * 순수: 지난 수업 숙제에서 다시 볼 틀 하나. 가장 최근의 끝난 수업 통화(다룬 틀이 있는 것) 하나만 보고,
 * 숙제가 생긴 통화(장면 있음)만 — 틀린 틀 → 숙제를 안 풀었으면 다룬 첫 틀 → 다 맞혔으면 다룬 첫 틀. 이미 리뷰한 통화 뒤엔 없음.
 */
export function lastHomework(calls: readonly Pick<SavedConversation, "id" | "language" | "mode" | "finishedAt" | "startedAt" | "lesson">[], replays: readonly Pick<StoredReplay, "callId" | "quiz">[], language: string): HomeworkReview | null {
  const last = calls
    .filter((call) => call.language === language && call.mode === "lesson" && call.finishedAt)
    .sort((a, b) => b.startedAt - a.startedAt)[0];
  const covered = last?.lesson?.covered ?? [];
  if (!last || !covered.length) return null;
  const replay = replays.find((row) => row.callId === last.id);
  if (!replay) return null;
  const frames = replay.quiz?.frames ?? {};
  const missed = covered.find((key) => frames[key] === "miss");
  if (missed) return { key: missed, how: "missed" };
  if (!replay.quiz) return { key: covered[0]!, how: "undone" };
  return { key: covered.find((key) => frames[key] === "ok") ?? covered[0]!, how: "right" };
}

/** 이 폰 저장소(사생활 모드·막힌 저장소에서 읽기만으로도 던질 수 있음). */
function phoneStore(): Storage | null {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}

const SPOT = "lessonSpot.v1";

export function readSpot(store: Storage | undefined | null, language: string): LessonSpot | null {
  try {
    const row = JSON.parse(store?.getItem(`${SPOT}.${language}`) ?? "null") as LessonSpot | null;
    return row && typeof row.key === "string" && ["show", "draw", "move"].includes(row.step) ? row : null;
  } catch {
    return null;
  }
}

export function keepSpot(store: Storage | undefined | null, language: string, spot: LessonSpot | null): void {
  try {
    if (spot) store?.setItem(`${SPOT}.${language}`, JSON.stringify(spot));
    else store?.removeItem(`${SPOT}.${language}`);
  } catch {
    // 이번 통화만.
  }
}

/** 이 폰의 기록으로 수업 시작(첫 측정 표현·문법 중 낮은 단계, 멈춘 자리). 소재가 없으면 null. */
export function planRunFor(language: string): LessonRun | null {
  const first = measured(language);
  const plan = pickLesson({
    frames: allFramesFor(language),
    events: readLedger(language),
    start: first ? Math.min(first.expression, first.grammar) : 1,
    spot: readSpot(phoneStore(), language),
    review: lastHomework(readCalls(), readReplays(phoneStore(), language), language),
  });
  return startRun(plan.items);
}

/** 학습자 차례 하나를 반영하고 멈춘 자리를 남긴다. */
export function stepRunFor(language: string, run: LessonRun, turn: { heard: string; missed: boolean; move?: boolean }): LessonRun | null {
  const frame = allFramesFor(language).find((one) => frameKey(one) === currentItem(run)?.key);
  const next = advanceRun(run, {
    spoke: !turn.missed && Boolean(turn.heard.trim()),
    used: !turn.missed && Boolean(frame && patternIn(frame.pattern, turn.heard)),
    move: Boolean(turn.move),
  });
  keepSpot(phoneStore(), language, lessonSpotOf(next));
  return next;
}
