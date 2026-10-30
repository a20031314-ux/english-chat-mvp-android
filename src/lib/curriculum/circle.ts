/**
 * 넓어지는 원(2026-10-31 사용자 "퍼센트를 기준으로, 원형의 총량을 키워 가면서 사용자가 일정 비율을 모르는 묶음으로 퀴즈를 계속 풀 수 있게" →
 * 제안 "원 + 정답률에 맞춰지는 비율" → "일단 만들고 가상 사용자로 확인"). Quizbank 어휘 탭에서 쓴다(hub/QUIZ.md "넓어지는 원").
 *
 * - 원 = 지금 다루는 범위: 낱말 순서(내 단계까지, curriculum/useWordBank) 앞에서 size개. 원 밖은 내지 않는다.
 * - 원 안 낱말: 새것(안 풀어 봄) · 배우는 중(맞힌 줄이 STREAK_KNOWN 미만) · 익힘(연속 STREAK_KNOWN번 맞힘, 또는 서버 이미 앎).
 * - 묶음 = 모르는 것(배우는 중 먼저, 그다음 새것) share 몫 + 아는 것(복습 날이 된 익힘, 오래 기다린 것 먼저). 한쪽이 모자라면 다른 쪽으로 채운다.
 * - share는 최근 RECENT문제 정답률로 움직인다: 목표 약 85%(Wilson 외 2019 "85% 규칙") — 90% 넘으면 +STEP, 75% 밑이면 −STEP, MIN~MAX.
 * - 원 키우기: 원 안 익힘이 GROW_AT 넘고 배우는 중이 MAX_LEARNING 이하면 원의 GROW_SHARE(최소 GROW_MIN)만큼 더한다.
 * - 익힘 복습 간격: 연속 맞힘 2 → 1일, 3 → 3일, 4 → 7일, 5 → 14일, 6+ → 30일. 틀리면 연속 0(배우는 중으로).
 * 이 폰에만(localStorage, 낱말 열쇠·횟수·때만 — 학습자 글 없음). 순수 모듈: 화면(TodayPlan)·테스트·가상 학습자 시뮬레이션이 같이 쓴다.
 */
export const CIRCLE_START = 20;
export const STREAK_KNOWN = 2;
export const GROW_AT = 0.7;
export const GROW_SHARE = 0.1;
export const GROW_MIN = 5;
export const MAX_LEARNING = 20;
export const RECENT = 30;
export const SHARE_START = 0.3;
export const SHARE_MIN = 0.1;
export const SHARE_MAX = 0.75;
export const SHARE_STEP = 0.05;
export const HIGH = 0.9;
export const LOW = 0.75;
/** 배우는 중 낱말은 이만큼 지나야 다시(바로 다시 내면 방금 본 답을 베낌 — 가상 사용자 2026-10-31). */
export const LEARNING_GAP_MS = 2 * 60 * 1000;
/** 날이 안 된 익힘으로 채울 때 이만큼 안에 푼 것은 빼기(같은 문장이 계속 돎 — 가상 사용자). */
export const FILLER_GAP_MS = 10 * 60 * 1000;
const DAY = 24 * 60 * 60 * 1000;
const INTERVALS = [0, 0, 1, 3, 7, 14, 30];

export type CircleItem = { s: number; t: number };
export type Circle = { size: number; share: number; recent: number[]; items: Record<string, CircleItem>; /** 푼 수(몫을 다섯 답마다 움직이는 데). */ answered?: number };
export type ItemState = "new" | "learning" | "known";

export function emptyCircle(): Circle {
  return { size: CIRCLE_START, share: SHARE_START, recent: [], items: {}, answered: 0 };
}

export function itemState(circle: Circle, key: string, serverKnown = false): ItemState {
  const item = circle.items[key];
  if (item && item.s >= STREAK_KNOWN) return "known";
  if (!item) return serverKnown ? "known" : "new";
  return "learning";
}

/** 익힘 낱말의 다음 복습 때(서버 이미 앎인데 이 폰 기록이 없으면 늘 기다림 — 새것보다 먼저 나오지 않게 아주 뒤). */
export function dueAt(circle: Circle, key: string): number {
  const item = circle.items[key];
  if (!item) return Number.MAX_SAFE_INTEGER;
  return item.t + INTERVALS[Math.min(item.s, INTERVALS.length - 1)]! * DAY;
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
 */
export function pickCircle(
  circle: Circle,
  order: readonly string[],
  options: { n: number; now: number; usable: (key: string) => boolean; known: (key: string) => boolean; skip?: ReadonlySet<string> },
): string[] {
  const { inside } = circleView(circle, order, options.known);
  const ok = (key: string) => options.usable(key) && !options.skip?.has(key);
  const learning = inside
    .filter((key) => ok(key) && itemState(circle, key, options.known(key)) === "learning" && options.now - circle.items[key]!.t >= LEARNING_GAP_MS)
    .sort((a, b) => circle.items[a]!.t - circle.items[b]!.t);
  const fresh = inside.filter((key) => ok(key) && itemState(circle, key, options.known(key)) === "new");
  const due = inside
    .filter((key) => ok(key) && itemState(circle, key, options.known(key)) === "known" && dueAt(circle, key) <= options.now)
    .sort((a, b) => dueAt(circle, a) - dueAt(circle, b));
  const unknown = [...learning, ...fresh];
  const wantUnknown = Math.max(1, Math.round(options.n * circle.share));
  const take: string[] = [...unknown.slice(0, wantUnknown)];
  take.push(...due.slice(0, options.n - take.length));
  // 아는 쪽이 모자라면 복습 날이 안 된 익힘으로(오래된 것부터) — 모르는 몫을 지킨다(2026-10-31 시뮬레이션: 처음 배우는 사람 정답률이 35~55%로 떨어짐).
  if (take.length < options.n) {
    const waiting = inside
      .filter((key) => ok(key) && !take.includes(key) && itemState(circle, key, options.known(key)) === "known" && options.now - (circle.items[key]?.t ?? 0) >= FILLER_GAP_MS)
      .sort((a, b) => dueAt(circle, a) - dueAt(circle, b));
    take.push(...waiting.slice(0, options.n - take.length));
  }
  // 그래도 모자라면(원 안에 익힘이 거의 없을 때) 모르는 것으로.
  for (const key of unknown.slice(wantUnknown)) if (take.length < options.n && !take.includes(key)) take.push(key);
  // 모르는 것과 아는 것을 번갈아(앞에 몰리지 않게).
  const u = take.filter((key) => unknown.includes(key));
  const k = take.filter((key) => !unknown.includes(key));
  const out: string[] = [];
  for (let i = 0; i < Math.max(u.length, k.length); i += 1) {
    if (u[i]) out.push(u[i]!);
    if (k[i]) out.push(k[i]!);
  }
  return out;
}

/** 답 하나를 넣는다(새 객체). */
export function noteAnswer(circle: Circle, key: string, correct: boolean, now: number): Circle {
  const before = circle.items[key];
  const items = { ...circle.items, [key]: { s: correct ? (before?.s ?? 0) + 1 : 0, t: now } };
  const recent = [...circle.recent, correct ? 1 : 0].slice(-RECENT);
  const answered = (circle.answered ?? 0) + 1;
  let share = circle.share;
  // 몫은 다섯 답마다 한 번만 움직인다(답마다 움직이면 하루 사이 50% ↔ 10%로 출렁임, 시뮬레이션).
  if (recent.length >= 10 && answered % 5 === 0) {
    const rate = recent.reduce((sum, one) => sum + one, 0) / recent.length;
    if (rate > HIGH) share = Math.min(SHARE_MAX, share + SHARE_STEP);
    else if (rate < LOW) share = Math.max(SHARE_MIN, share - SHARE_STEP);
  }
  return { ...circle, items, recent, answered, share: Math.round(share * 100) / 100 };
}

/** 원을 키울 때가 됐으면 키운다(새 객체 또는 그대로). total: 낼 수 있는 낱말 수(내 단계까지). */
export function growCircle(circle: Circle, order: readonly string[], known: (key: string) => boolean): Circle {
  const view = circleView(circle, order, known);
  if (circle.size >= order.length) return circle;
  if (view.knownShare < GROW_AT || view.counts.learning > MAX_LEARNING) return circle;
  // 최근 정답률이 높으면 두 배로(이미 아는 사람이 원을 빨리 넘어가게).
  const rate = circle.recent.length >= 10 ? circle.recent.reduce((sum, one) => sum + one, 0) / circle.recent.length : 0;
  const add = Math.max(GROW_MIN, Math.ceil(circle.size * GROW_SHARE)) * (rate > HIGH ? 2 : 1);
  return { ...circle, size: Math.min(order.length, circle.size + add) };
}

/** 오래 안 본 기록 정리(이 폰 저장 한도) — 원 밖이고 익힘 아닌 오래된 것부터 2,000개까지. */
export function trimCircle(circle: Circle, max = 2000): Circle {
  const keys = Object.keys(circle.items);
  if (keys.length <= max) return circle;
  const drop = new Set(keys.sort((a, b) => circle.items[a]!.t - circle.items[b]!.t).slice(0, keys.length - max));
  return { ...circle, items: Object.fromEntries(Object.entries(circle.items).filter(([key]) => !drop.has(key))) };
}
