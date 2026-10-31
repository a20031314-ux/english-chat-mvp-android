/**
 * 어휘 탭(2026-10-31 넓어지는 원 → 2026-11-01 두 번 고침), Quizbank 어휘 탭(hub/QUIZ.md "어휘 탭").
 * - 2026-11-01 ① 사용자 "한 번 맞히면 익힘 · 주기별로 잊었을 확률이 있을 때만 다시 · 처음 쓰는 사람에게 70%를 가늠하는 건 모순" → 정답률 목표·아는 몫 없앰.
 * - 2026-11-01 ② 사용자 "기본적으로 처음 본 단어만 계속 · 주기적으로 단어 모음 시험으로 틀린 단어·맞힌 단어를 섞어서" →
 *   **탭에는 이 사용자가 처음 보는 낱말만**(낱말 순서대로), 본 낱말(맞힘·틀림)은 **단어 시험**에서만 다시.
 *
 * - 낱말 상태: 새것(안 풀어 봄) · 틀림(마지막에 틀림) · 익힘(한 번 맞히면, 또는 서버 이미 앎).
 * - 단어 시험(wordTest): 틀린 것(오래된 것부터) + 맞힌 것 최소 TEST_RIGHT_MIN개(잊을 때가 된 것 먼저 — 연속 맞힘 1 → 1일, 2 → 3일, 3 → 7일 …, 그다음 오래전에 본 것), TEST_SIZE문제.
 *   언제(wordTestDue): 지난 시험 뒤 새 낱말을 TEST_EVERY개 풀었거나 틀린 낱말이 TEST_WRONG개 쌓였거나, 오늘 아직 안 봤고 잊을 때가 된 맞힌 낱말이 TEST_MIN개 넘을 때 — 낼 낱말이 TEST_MIN개 넘어야.
 * - 원(size)은 새것을 미리 받아 둘 범위: 지금까지 다룬 낱말 + CIRCLE_START.
 * 이 폰에만(localStorage, 낱말 열쇠·횟수·때만 — 학습자 글 없음). 순수 모듈: 화면(TodayPlan)·테스트·시뮬레이션이 같이 쓴다.
 */
export const CIRCLE_START = 20;
/** 이만큼 연속 맞히면 익힘(2026-11-01 사용자 "한 번 맞히면 익힘"). */
export const STREAK_KNOWN = 1;
/** 단어 시험 문제 수 · 새 낱말 몇 개마다 · 최소 낱말 수. */
export const TEST_SIZE = 10;
export const TEST_EVERY = 20;
export const TEST_MIN = 4;
/** 지난 시험 뒤 틀린 낱말이 이만큼 쌓이면 새 낱말 수와 상관없이 시험(처음 배우는 사람은 틀린 것이 빨리 쌓임 — 시뮬레이션). */
export const TEST_WRONG = 8;
/** 시험에 넣는 맞힌 낱말 최소 수(나머지는 틀린 것 먼저). */
export const TEST_RIGHT_MIN = 3;
/** 방금(이만큼 안에) 본 맞힌 낱말은 시험에 안 넣음(바로 다시 내면 베낌). */
export const TEST_GAP_MS = 10 * 60 * 1000;
const DAY = 24 * 60 * 60 * 1000;
/** 연속 맞힘 수 → 잊을 때가 될 때까지 날. */
export const REVIEW_DAYS = [0, 1, 3, 7, 14, 30, 60] as const;

export type CircleItem = { s: number; t: number };
export type Circle = {
  size: number;
  items: Record<string, CircleItem>;
  /** 푼 수. */
  answered?: number;
  /** 지난 단어 시험 때 새 낱말 푼 수(newSeen)·날(로컬 YYYY-MM-DD). */
  testAt?: number;
  testDay?: string;
  /** 지난 단어 시험을 마친 때(ms). */
  testStamp?: number;
  /** 탭에서 새 낱말을 푼 수. */
  newSeen?: number;
  /** 예전 저장(정답률 목표·아는 몫) — 읽어도 쓰지 않음. */
  share?: number;
  recent?: number[];
  target?: number;
};

export type ItemState = "new" | "learning" | "known";

export function emptyCircle(): Circle {
  return { size: CIRCLE_START, items: {}, answered: 0, newSeen: 0, testAt: 0 };
}

export function itemState(circle: Circle, key: string, serverKnown = false): ItemState {
  const item = circle.items[key];
  if (item && item.s >= STREAK_KNOWN) return "known";
  if (!item) return serverKnown ? "known" : "new";
  return "learning";
}

/** 맞힌 낱말이 잊을 때가 되는 때(서버 이미 앎인데 이 폰 기록이 없으면 늘 기다림). */
export function dueAt(circle: Circle, key: string): number {
  const item = circle.items[key];
  if (!item) return Number.MAX_SAFE_INTEGER;
  return item.t + REVIEW_DAYS[Math.min(item.s, REVIEW_DAYS.length - 1)]! * DAY;
}

/** 원 안 낱말(순서대로)과 상태별 수. */
export function circleView(circle: Circle, order: readonly string[], known: (key: string) => boolean) {
  const inside = order.slice(0, Math.max(0, circle.size));
  const counts = { new: 0, learning: 0, known: 0 };
  for (const key of inside) counts[itemState(circle, key, known(key))] += 1;
  return { inside, counts, knownShare: inside.length ? counts.known / inside.length : 0 };
}

/**
 * 탭의 다음 묶음 — 이 사용자가 처음 보는 낱말만(낱말 순서대로). 본 낱말은 단어 시험에서만.
 * usable: 문제를 만들 수 있는 낱말(카드가 온 것), skip: 방금 낸 것.
 */
export function pickCircle(
  circle: Circle,
  order: readonly string[],
  options: { n: number; now: number; usable: (key: string) => boolean; known: (key: string) => boolean; skip?: ReadonlySet<string> },
): string[] {
  const out: string[] = [];
  for (const key of order.slice(0, Math.max(circle.size, CIRCLE_START))) {
    if (out.length >= options.n) break;
    if (options.usable(key) && !options.skip?.has(key) && !circle.items[key] && !options.known(key)) out.push(key);
  }
  return out;
}

/** 단어 시험 낱말: 틀린 것 절반까지 + 맞힌 것(잊을 때 된 것 먼저), 섞어서. */
export function wordTest(circle: Circle, options: { now: number; usable: (key: string) => boolean; n?: number }): string[] {
  const n = options.n ?? TEST_SIZE;
  const keys = Object.keys(circle.items).filter(options.usable);
  const wrong = keys.filter((key) => circle.items[key]!.s === 0).sort((a, b) => circle.items[a]!.t - circle.items[b]!.t);
  const right = keys
    .filter((key) => circle.items[key]!.s > 0 && options.now - circle.items[key]!.t >= TEST_GAP_MS)
    .sort((a, b) => {
      const dueA = dueAt(circle, a) <= options.now;
      const dueB = dueAt(circle, b) <= options.now;
      if (dueA !== dueB) return dueA ? -1 : 1;
      return dueA ? dueAt(circle, a) - dueAt(circle, b) : circle.items[a]!.t - circle.items[b]!.t;
    });
  const takeWrong = wrong.slice(0, Math.max(n - TEST_RIGHT_MIN, n - right.length));
  const takeRight = right.slice(0, n - takeWrong.length);
  // 틀린 것과 맞힌 것을 번갈아.
  const out: string[] = [];
  for (let i = 0; i < Math.max(takeWrong.length, takeRight.length); i += 1) {
    if (takeRight[i]) out.push(takeRight[i]!);
    if (takeWrong[i]) out.push(takeWrong[i]!);
  }
  return out;
}

/** 단어 시험을 낼 때인가(today = 로컬 YYYY-MM-DD). */
export function wordTestDue(circle: Circle, options: { now: number; today: string; usable: (key: string) => boolean }): boolean {
  const candidates = wordTest(circle, options);
  if (candidates.length < TEST_MIN) return false;
  if ((circle.newSeen ?? 0) - (circle.testAt ?? 0) >= TEST_EVERY) return true;
  const since = circle.testStamp ?? 0;
  const freshWrong = Object.keys(circle.items).filter((key) => options.usable(key) && circle.items[key]!.s === 0 && circle.items[key]!.t > since).length;
  if (freshWrong >= TEST_WRONG) return true;
  if (circle.testDay === options.today) return false;
  const dueRight = Object.keys(circle.items).filter((key) => options.usable(key) && circle.items[key]!.s > 0 && dueAt(circle, key) <= options.now).length;
  return dueRight >= TEST_MIN;
}

/** 단어 시험을 마쳤다(새 객체). */
export function noteTest(circle: Circle, today: string, now = Date.now()): Circle {
  return { ...circle, testAt: circle.newSeen ?? 0, testDay: today, testStamp: now };
}

/** 답 하나를 넣는다(새 객체). 맞히면 연속 맞힘 +1(한 번이면 익힘), 틀리면 0. 처음 보는 낱말이었으면 newSeen +1. */
export function noteAnswer(circle: Circle, key: string, correct: boolean, now: number): Circle {
  const before = circle.items[key];
  const items = { ...circle.items, [key]: { s: correct ? (before?.s ?? 0) + 1 : 0, t: now } };
  const rest: Circle = { ...circle };
  delete rest.share;
  delete rest.recent;
  delete rest.target;
  return { ...rest, items, answered: (circle.answered ?? 0) + 1, newSeen: (circle.newSeen ?? 0) + (before ? 0 : 1) };
}

/** 원(새것을 미리 받아 둘 범위)을 다룬 낱말 + CIRCLE_START로 맞춘다(새 객체 또는 그대로). */
export function growCircle(circle: Circle, order: readonly string[], known: (key: string) => boolean): Circle {
  let reached = 0;
  order.forEach((key, index) => {
    if (circle.items[key] || known(key)) reached = index + 1;
  });
  const size = Math.min(order.length, Math.max(circle.size, reached + CIRCLE_START));
  return size === circle.size ? circle : { ...circle, size };
}

/** 오래 안 본 기록 정리(이 폰 저장 한도) — 원 밖이고 익힘 아닌 오래된 것부터 2,000개까지. */
export function trimCircle(circle: Circle, max = 2000): Circle {
  const keys = Object.keys(circle.items);
  if (keys.length <= max) return circle;
  const drop = new Set(keys.sort((a, b) => circle.items[a]!.t - circle.items[b]!.t).slice(0, keys.length - max));
  return { ...circle, items: Object.fromEntries(Object.entries(circle.items).filter(([key]) => !drop.has(key))) };
}
