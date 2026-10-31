/**
 * 넓어지는 원(2026-10-31 사용자 "원형의 총량을 키워 가면서 …"), Quizbank 어휘 탭(hub/QUIZ.md "넓어지는 원").
 * 2026-11-01 사용자 "익힘을 기준으로, 한 번 맞히면 익힘 · 주기별로 잊었을 확률이 있을 때만 다시 · 처음 쓰는 사람은 데이터가 없는데
 * 70%를 가늠하는 것 자체가 모순" → 정답률 목표·아는 몫(share)을 없앰.
 *
 * - 낱말 상태: 새것(안 풀어 봄) · 틀림(마지막에 틀림) · 익힘(한 번 맞히면, 또는 서버 이미 앎).
 * - 익힘은 잊을 때가 된 때만 다시 낸다: 연속 맞힘 1 → 1일, 2 → 3일, 3 → 7일, 4 → 14일, 5 → 30일, 6+ → 60일. 날이 안 된 익힘으로 빈자리를 채우지 않는다.
 * - 묶음 = 잊을 때가 된 익힘(오래 지난 것부터) → 틀린 것(LEARNING_GAP_MS 뒤) → 새것(낱말 순서대로). 틀린 것이 MAX_LEARNING을 넘으면 새것은 쉰다.
 * - 원(size)은 새것을 미리 받아 둘 범위: 지금까지 다룬 낱말 + CIRCLE_START.
 * 이 폰에만(localStorage, 낱말 열쇠·횟수·때만 — 학습자 글 없음). 순수 모듈: 화면(TodayPlan)·테스트·시뮬레이션이 같이 쓴다.
 */
export const CIRCLE_START = 20;
/** 이만큼 연속 맞히면 익힘(2026-11-01 사용자 "한 번 맞히면 익힘"). */
export const STREAK_KNOWN = 1;
export const MAX_LEARNING = 20;
/** 틀린 낱말은 이만큼 지나야 다시(바로 다시 내면 방금 본 답을 베낌 — 가상 사용자 2026-10-31). */
export const LEARNING_GAP_MS = 2 * 60 * 1000;
const DAY = 24 * 60 * 60 * 1000;
/** 연속 맞힘 수 → 다음에 낼 때까지 날(잊을 때가 됐을 때). */
export const REVIEW_DAYS = [0, 1, 3, 7, 14, 30, 60] as const;

export type CircleItem = { s: number; t: number };
export type Circle = {
  size: number;
  items: Record<string, CircleItem>;
  /** 푼 수. */
  answered?: number;
  /** 예전 저장(정답률 목표·아는 몫) — 읽어도 쓰지 않음. */
  share?: number;
  recent?: number[];
  target?: number;
};

export type ItemState = "new" | "learning" | "known";

export function emptyCircle(): Circle {
  return { size: CIRCLE_START, items: {}, answered: 0 };
}

export function itemState(circle: Circle, key: string, serverKnown = false): ItemState {
  const item = circle.items[key];
  if (item && item.s >= STREAK_KNOWN) return "known";
  if (!item) return serverKnown ? "known" : "new";
  return "learning";
}

/** 익힘 낱말을 다시 낼 때(서버 이미 앎인데 이 폰 기록이 없으면 늘 기다림). */
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
 * 다음 묶음의 낱말들. usable: 문제를 만들 수 있는 낱말(카드가 온 것), skip: 방금 낸 것(같은 낱말을 바로 다시 내지 않게).
 * 낼 것이 모자라면 짧은 묶음(또는 빈 묶음)을 돌려준다 — 이미 맞힌 낱말로 채우지 않는다.
 */
export function pickCircle(
  circle: Circle,
  order: readonly string[],
  options: { n: number; now: number; usable: (key: string) => boolean; known: (key: string) => boolean; skip?: ReadonlySet<string> },
): string[] {
  const ok = (key: string) => options.usable(key) && !options.skip?.has(key);
  const keys = Object.keys(circle.items).filter(ok);
  const due = keys
    .filter((key) => itemState(circle, key) === "known" && dueAt(circle, key) <= options.now)
    .sort((a, b) => dueAt(circle, a) - dueAt(circle, b));
  const allMissed = Object.keys(circle.items).filter((key) => itemState(circle, key) === "learning");
  const missed = keys
    .filter((key) => itemState(circle, key) === "learning" && options.now - circle.items[key]!.t >= LEARNING_GAP_MS)
    .sort((a, b) => circle.items[a]!.t - circle.items[b]!.t);
  const fresh: string[] = [];
  if (allMissed.length < MAX_LEARNING) {
    for (const key of order.slice(0, Math.max(circle.size, CIRCLE_START))) {
      if (fresh.length >= options.n) break;
      if (ok(key) && !circle.items[key] && !options.known(key)) fresh.push(key);
    }
  }
  const take = due.slice(0, options.n);
  // 틀린 것과 새것을 번갈아(틀린 것이 몰려 연달아 나오지 않게).
  for (let i = 0; take.length < options.n && (i < missed.length || i < fresh.length); i += 1) {
    if (missed[i] && take.length < options.n) take.push(missed[i]!);
    if (fresh[i] && take.length < options.n) take.push(fresh[i]!);
  }
  return take;
}

/** 답 하나를 넣는다(새 객체). 맞히면 연속 맞힘 +1(한 번이면 익힘), 틀리면 0. */
export function noteAnswer(circle: Circle, key: string, correct: boolean, now: number): Circle {
  const before = circle.items[key];
  const items = { ...circle.items, [key]: { s: correct ? (before?.s ?? 0) + 1 : 0, t: now } };
  return { size: circle.size, items, answered: (circle.answered ?? 0) + 1 };
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
