/**
 * 어휘 탭 수준 맞추기(2026-11-01 사용자 "단어 퀴즈가 모르는 단어만 나온다는데 사용자별 수준 파악이 안 돼 있다" → "처음엔 모든 단계를 섞어서 주고,
 * 점점 가늠해 가면서 사용자별로 맞춰 가는 것" + "너무 어렵다·쉽다·적당하다를 직접 체크" + "난이도별 단어 예시를 보고 선택" → "진행해줘").
 *
 * - 경계 b = "이 사람이 아는 빈도 순위"의 어림. 처음 PROBE개(새 낱말)는 단계 구간마다 첫 낱말들을 섞어 내고(낮은 구간을 더 자주),
 *   답마다 b를 고친다 — 순위는 로그 눈금(50위와 100위 차이 ≈ 2,500위와 5,000위 차이): 아는 확률 P(r) = 1 / (1 + e^((ln(r+50) − ln(b+50)) / σ)),
 *   맞힐 확률 = g + (1 − g)·P(고르기는 셋 중 하나라 찍어 맞힐 몫 g = ⅓, 쓰기는 0), ln(b+50) += K × (맞음 − 맞힐 확률). K는 답이 쌓일수록 작아진다.
 * - 그 뒤엔 경계 근처(b 바로 위) 새 낱말 위주, 다섯에 하나는 더 위 구간(실력이 오르면 경계도 오르게).
 * - 경계보다 한참 아래인 안 본 낱말 = "아마 앎" — 탭에는 안 내고, 단어 시험에 둘씩 섞어 확인(틀리면 b가 내려감).
 * - 경계보다 한참 위 낱말을 틀린 것 = "아직 이른 낱말"(item.e) — 틀린 낱말 더미(새 낱말 쉬기·단어 시험)에 넣지 않고, 경계가 닿으면 새것처럼 다시.
 * - 사용자 체크(새 낱말 10개마다 한 줄): 쉬워요 → b를 크게 올림(연달아면 더 크게), 어려워요 → b를 내리고 천천히(slow — 쉬는 기준 15개),
 *   적당해요 → 그대로. ⚙ "어디서부터" 단계 예시 줄을 고르면 b = 그 구간 시작(가늠 단계 건너뜀).
 * 이 폰에만(Circle.lv, 학습 언어·칸마다). 순수 모듈 — 화면(TodayPlan)·테스트·시뮬레이션이 같이 쓴다.
 */
import { type Circle } from "./circle.ts";

export type Level = {
  /** 경계(아는 빈도 순위 어림, 0부터). */
  b: number;
  /** 가늠에 쓴 답 수(새 낱말·확인 문제). */
  n: number;
  /** 어려워요를 누름 — 새 낱말을 천천히(쉬는 기준 낮춤). */
  slow?: boolean;
  /** 지난 체크 때 새 낱말 푼 수(Circle.newSeen) · 연달아 누른 쉬워요 수. */
  feltAt?: number;
  easy?: number;
  /** 새 낱말 연달아 맞힌 수(쉬워요에 살짝 강조). */
  run?: number;
  /** 경계를 사용자가 직접 정함(⚙ 단계 예시) — 가늠 단계 건너뜀. */
  picked?: boolean;
  /** 모으는 중인 묶음(가늠이 끝난 뒤): 답 수 · 맞힘 · 찍어 맞힐 몫 합(noteLevelBatch). */
  pend?: { n: number; ok: number; g: number; e?: number };
};

/** 처음 섞어서 내는 새 낱말 수. */
export const PROBE = 20;
/** 단어 시험에 섞는 "아마 앎" 확인 수. */
export const PRESUMED_IN_TEST = 2;

/** 처음 경계: 지금 단계 구간 시작(1단계는 조금 위 — 가장 흔한 낱말은 대부분 앎). cuts = 단계 끝 순위(vocabBank.stageCuts). */
export function startLevel(stage: number, cuts: readonly number[]): Level {
  const s = Math.max(1, Math.min(5, stage));
  return { b: s <= 1 ? 150 : cuts[s - 2] ?? 0, n: 0 };
}

export function levelOf(circle: Circle, stage: number, cuts: readonly number[]): Level {
  return circle.lv ?? startLevel(stage, cuts);
}

/** 경계 둘레 너비(순위). */
export function bandWidth(b: number): number {
  return Math.max(30, Math.round(b * 0.15));
}

const SIGMA = 0.35;
const OFFSET = 50;

/** 순위 r 낱말을 알 확률(어림). */
export function knowChance(level: Level, rank: number): number {
  return 1 / (1 + Math.exp((Math.log(rank + OFFSET) - Math.log(level.b + OFFSET)) / SIGMA));
}

/**
 * 답 하나로 경계를 고친다(새 객체). choose = 고르기 문제(맞음은 반만 믿음). total = 목록 길이(경계 상한).
 */
export function noteLevel(level: Level, rank: number, correct: boolean, options: { choose?: boolean; total: number; fresh?: boolean }): Level {
  const p = knowChance(level, rank);
  const guess = options.choose ? 1 / 3 : 0;
  const expected = guess + (1 - guess) * p;
  const k = Math.max(0.12, 1.1 / Math.sqrt(level.n + 1));
  const x = Math.log(level.b + OFFSET) + k * ((correct ? 1 : 0) - expected);
  const b = Math.min(Math.max(0, options.total - 1), Math.max(0, Math.exp(x) - OFFSET));
  const run = options.fresh ? (correct ? (level.run ?? 0) + 1 : 0) : level.run;
  return { ...level, b, n: level.n + 1, ...(run !== undefined ? { run } : {}) };
}

/** 묶음 판정(2026-11-07 사용자 "문제 하나를 맞출때마다 매번 변수로 반영하는게 문제 — 모아서 판정"): 이만큼 모이면 한 번. */
export const BATCH = 10;
/** 판정 기준: 묶음 낱말들을 지금 경계로 알 확률 평균(경계 둘레면 약 50%)보다 BATCH_GAP 넘게 높으면 올림, 낮으면 내림 — 경계 둘레에선 70% / 30%.
 * (처음 안 70% / 40% 고정은 가상 학습자 30일에서 경계가 참값의 0.45~0.7배로 미끄러짐 — 경계 둘레 낱말은 원래 절반쯤 맞혀서, 2026-11-07.) */
export const BATCH_GAP = 0.2;
/** 판정 한 번에 경계를 옮기는 몫(로그 눈금 — ×1.2 / ÷1.2). */
export const BATCH_STEP = 1.2;

/**
 * 가늠 단계(처음 PROBE개, 첫 측정·⚙로 정했으면 없음)는 답마다 noteLevel, 그 뒤엔 BATCH개를 모아 한 번:
 * 찍어 맞힐 몫을 뺀 맞힌 비율이 기대(알 확률 평균)보다 0.2 넘게 높으면 경계 ×1.2, 0.2 넘게 낮으면 ÷1.2, 그 사이는 그대로.
 */
export function noteLevelBatch(level: Level, rank: number, correct: boolean, options: { choose?: boolean; total: number; fresh?: boolean }): Level {
  if (level.n < PROBE && !level.picked) return noteLevel(level, rank, correct, options);
  const guess = options.choose ? 1 / 3 : 0;
  const pend = { n: (level.pend?.n ?? 0) + 1, ok: (level.pend?.ok ?? 0) + (correct ? 1 : 0), g: (level.pend?.g ?? 0) + guess, e: (level.pend?.e ?? 0) + knowChance(level, rank) };
  const run = options.fresh ? (correct ? (level.run ?? 0) + 1 : 0) : level.run;
  const base = { ...level, n: level.n + 1, ...(run !== undefined ? { run } : {}) };
  if (pend.n < BATCH) return { ...base, pend };
  const rate = (pend.ok - pend.g) / Math.max(1e-9, pend.n - pend.g);
  const x = level.b + OFFSET;
  const expected = (pend.e ?? pend.n * 0.5) / pend.n;
  const moved = rate > expected + BATCH_GAP ? x * BATCH_STEP : rate < expected - BATCH_GAP ? x / BATCH_STEP : x;
  const b = Math.min(Math.max(0, options.total - 1), Math.max(0, moved - OFFSET));
  const { pend: _drop, ...rest } = base;
  void _drop;
  return { ...rest, b };
}

/** 가늠 단계에서 n번째로 볼 구간(0 = 맨 앞 구간, 1~ = 단계 구간) — 낮은 구간을 더 자주. */
const PROBE_BANDS = [0, 1, 0, 2, 1, 3, 0, 2, 4, 1, 3, 5, 2, 4, 0, 3, 5, 1, 4, 2];

type PickOptions = {
  n: number;
  /** 빈도 순위 순 열쇠(목록 전체, 이 칸 안). */
  ranked: readonly string[];
  cuts: readonly number[];
  usable: (key: string) => boolean;
  known: (key: string) => boolean;
  skip?: ReadonlySet<string>;
};

/** 이 열쇠를 탭에 낼 수 있나: 안 본 것, 또는 "아직 이른 낱말"인데 이제 경계가 닿은 것. */
function open(circle: Circle, level: Level, key: string, rank: number): boolean {
  const item = circle.items[key];
  if (!item) return true;
  return Boolean(item.e) && rank <= level.b + bandWidth(level.b);
}

/** 구간 시작 순위들(0 = 맨 앞, 그다음 단계 끝마다 — 확장 구간까지). */
function bandStarts(cuts: readonly number[], total: number): number[] {
  return [0, ...cuts].filter((start) => start < total);
}

/**
 * 어휘 탭의 다음 새 낱말들(수준 맞춤). 가늠 단계면 구간마다 섞어서, 그 뒤엔 경계 바로 위부터.
 * want = 카드를 받아 와야 할 낱말까지(usable과 상관없이) — 화면이 그 묶음을 받게.
 */
export function pickLevelWords(circle: Circle, level: Level, options: PickOptions & { want?: boolean }): string[] {
  const out: string[] = [];
  const taken = new Set<string>();
  const ok = (key: string, rank: number) => !taken.has(key) && !options.skip?.has(key) && !options.known(key) && open(circle, level, key, rank) && (options.want || options.usable(key));
  const take = (key: string) => {
    taken.add(key);
    out.push(key);
  };
  const total = options.ranked.length;
  if (!total) return out;
  if (level.n < PROBE && !level.picked) {
    // 가늠: 구간마다 첫 낱말들(그 구간의 쉬운 쪽) — 처음 실력과 상관없이 고루 섞어서.
    const starts = bandStarts(options.cuts, total);
    for (let slot = level.n; out.length < options.n && slot < level.n + options.n * 3; slot += 1) {
      const band = PROBE_BANDS[slot % PROBE_BANDS.length]! % starts.length;
      const from = starts[band]!;
      for (let rank = from; rank < Math.min(total, from + 60); rank += 1) {
        const key = options.ranked[rank]!;
        if (ok(key, rank)) {
          take(key);
          break;
        }
      }
    }
    if (out.length >= options.n) return out;
  }
  // 경계 근처: b 조금 위를 가운데로, 가까운 순. 다섯에 하나는 더 위 구간(2~4배 너비 위)에서.
  const width = bandWidth(level.b);
  const center = level.b + width * 0.3;
  const near: { key: string; d: number }[] = [];
  const low = Math.max(0, Math.floor(level.b - width));
  const high = Math.min(total, Math.ceil(level.b + width * 4));
  for (let rank = low; rank < high; rank += 1) {
    const key = options.ranked[rank]!;
    if (ok(key, rank)) near.push({ key, d: Math.abs(rank - center) });
  }
  near.sort((a, b) => a.d - b.d);
  const above = near.filter((one) => one.d > width * 1.5);
  const close = near.filter((one) => one.d <= width * 1.5);
  let i = 0;
  while (out.length < options.n && (close.length || above.length)) {
    const fromAbove = (i + 1) % 5 === 0 && above.length;
    const next = (fromAbove ? above.shift() : close.shift() ?? above.shift())!;
    if (!taken.has(next.key)) take(next.key);
    i += 1;
  }
  // 경계 둘레가 다 떨어졌으면 그 위로 차례대로(끝없이).
  for (let rank = high; out.length < options.n && rank < total; rank += 1) {
    const key = options.ranked[rank]!;
    if (ok(key, rank)) take(key);
  }
  return out;
}

/** 경계보다 한참 아래인 안 본 낱말 중 확인할 것(단어 시험에 섞음) — 아래쪽에서 고루. */
export function presumedWords(circle: Circle, level: Level, options: { ranked: readonly string[]; usable: (key: string) => boolean; known: (key: string) => boolean; n?: number; seed?: number }): string[] {
  const n = options.n ?? PRESUMED_IN_TEST;
  const limit = Math.floor(level.b - bandWidth(level.b));
  if (limit <= 0) return [];
  const pool: string[] = [];
  for (let rank = 0; rank < Math.min(limit, options.ranked.length); rank += 1) {
    const key = options.ranked[rank]!;
    if (!circle.items[key] && !options.known(key) && options.usable(key)) pool.push(key);
  }
  if (!pool.length) return [];
  // 경계에 가까운 쪽을 더 자주(거기가 틀리기 쉬움) — 위쪽 절반에서 하나, 전체에서 하나.
  const seed = options.seed ?? 0;
  const upper = pool.slice(Math.floor(pool.length / 2));
  const picks = [upper[seed % Math.max(1, upper.length)], pool[(seed * 7 + 3) % pool.length]].filter((one): one is string => Boolean(one));
  return [...new Set(picks)].slice(0, n);
}

/** 이 답이 "아직 이른 낱말"인가(경계보다 한참 위를 틀림). */
export function tooEarly(level: Level, rank: number, correct: boolean): boolean {
  return !correct && rank > level.b + bandWidth(level.b) * 2;
}
