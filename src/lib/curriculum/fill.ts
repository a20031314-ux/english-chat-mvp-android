/**
 * 채우기 — 언어능력 육각형의 값(2026-11-02 사용자 "처음엔 초보·중급·고급 체크로 '67% 부근'에서 시작, 학습하며 조정해 실제 실력과 수렴,
 * 이후 약점 파악·학습 방향", 설계 hub/drafts/fill-gauge-2026-11-02.md). 순수 모듈 — 모델 호출 없음.
 *
 * 꼭짓점 여섯:
 * - 어휘 이해·어휘 활용: 분모 = 5단계 컷까지 낱말(빈도 순위) + 짧은 표현.
 * - 문장 이해·문장 활용: 분모 = 1~5단계 문장구조(f|)·문법 칸(g|)·덩어리 표현(e|, 낱말 둘 넘음) — notes/myParts stageKeyMap.
 *   활용은 이해와 같은 분모, 시켜서 만든 것 0.6 · 채팅·통화에서 스스로 맞게 쓴 것 1.
 * - 듣기: 단계 띠 다섯, 띠마다 자막 없이 들은 질문 차례의 알아들음 몫 ÷ 0.9(넘으면 1), 다섯 평균.
 * - 실전 대화: 최근 AI 통화 60차례 — 막힘없이(0.7, 튜터 말 단계 무게 0.6~1.0) + 이끌어 감(0.3).
 *
 * 은행 꼭짓점의 수렴(어휘 탭 vocabLevel.ts를 넓힘): 항목마다 자리 d(쉬운 것 0 → 어려운 것 1, 은행 안 순서),
 * 꼭짓점 실력 θ(같은 눈금), 아는 확률 P = 1 / (1 + e^((d − θ)/σ)), 맞힐 확률 = g + (1 − g)·P(고르기 g = ⅓).
 * 기록을 때 순서로 다시 돌려(재생) θ += K·w·(맞음 − 맞힐 확률) — 처음 체크가 시작점, 체크가 없으면(기존 사용자) 지금 단계.
 * 범위 = 1/√(처음 정밀도 + Σ w·정보) — ±5%p 안이면 수렴.
 *
 * 세부 칸(10절): 칸마다 Σ예상·Σ실제·분산·답 수(30일 반감) → 부족 = 답 8개+ · 예상보다 15%p+ 아래 · z ≥ 1.65.
 * 문장은 이 폰 기록에서만 만든다(학습자 문장은 서버에 안 감 — 여기엔 열쇠·숫자만).
 */
import { allFramesFor, type Frame } from "./frames.ts";
import { fnGroupOf, type FnGroup } from "./fnGroups.ts";
import { posGroup, stageCuts, type BankWord } from "./vocabBank.ts";
import { stageKeyMap } from "../notes/myParts.ts";
import { isWordish } from "../notes/stageParts.ts";
import type { LeadHow, TalkWhy } from "../roleplay/turnTally.ts";

export const AXES = ["vocabRead", "vocabUse", "sentRead", "sentUse", "listen", "talk"] as const;
export type Axis = (typeof AXES)[number];
export type BankAxis = "vocabRead" | "vocabUse" | "sentRead" | "sentUse";
export const BANK_AXES: readonly BankAxis[] = ["vocabRead", "vocabUse", "sentRead", "sentUse"];
export type Family = "vocab" | "sent";

export const STAGES = 5;
const DAY = 86_400_000;

/* ───────── 처음 체크 ───────── */

export const CHECKS = ["letters", "beginner", "mid", "advanced"] as const;
export type Check = (typeof CHECKS)[number];

/** 체크 → 시작 어림(이해 꼭짓점 몫)·범위·시작 단계. 활용은 ×0.6, 듣기·실전 대화는 ×0.5(설계 9절). */
export const CHECK_PRIOR: Record<Check, { fill: number; range: number; stage: number }> = {
  letters: { fill: 0, range: 0.05, stage: 0 },
  beginner: { fill: 0.1, range: 0.15, stage: 1 },
  mid: { fill: 0.4, range: 0.2, stage: 2 },
  advanced: { fill: 0.67, range: 0.25, stage: 4 },
};
export const PRIOR_SHARE: Record<Axis, number> = { vocabRead: 1, sentRead: 1, vocabUse: 0.6, sentUse: 0.6, listen: 0.5, talk: 0.5 };

/* ───────── 은행 목록(분모) ───────── */

export type FillItem = { key: string; family: Family; stage: number; d: number; cells: string[] };
export type FillCatalog = {
  language: string;
  vocab: Map<string, FillItem>;
  sent: Map<string, FillItem>;
  /** 꼭짓점 묶음마다 단계별 항목 수(게이지 칸). */
  stageCounts: Record<Family, number[]>;
  /** 묶음마다 있는 세부 칸 id 전부(답이 없는 칸도 "아직 모름"으로 보이게). */
  cellIds: Record<Family, string[]>;
};

/** e| 짧은 표현은 어휘, 긴 것은 문장(logbankData partOfKey와 같은 셈). */
export function familyOfKey(language: string, key: string): Family | null {
  if (key.startsWith("w|")) return "vocab";
  if (key.startsWith("f|") || key.startsWith("g|")) return "sent";
  if (key.startsWith("e|")) return isWordish(key.slice(2), language) ? "vocab" : "sent";
  return null;
}

/**
 * 그 학습 언어의 은행 목록. words = 빈도 낱말 묶음(vocabBank peekBank — 아직 안 받았으면 null, 그땐 표현만으로 어휘 분모를 작게 잡지 않게
 * 컷 크기만큼 자리만 둠).
 */
export function fillCatalog(language: string, words: readonly BankWord[] | null): FillCatalog {
  const cuts = stageCuts(language);
  const vocabTotal = cuts[STAGES - 1] ?? 5000;
  const vocab = new Map<string, FillItem>();
  const sent = new Map<string, FillItem>();
  const vocabCounts = Array.from({ length: STAGES }, (_, i) => (cuts[i] ?? 0) - (i === 0 ? 0 : (cuts[i - 1] ?? 0)));
  const stageOfIndex = (index: number) => {
    const at = cuts.findIndex((cut) => index < cut);
    return at < 0 ? STAGES : at + 1;
  };
  if (words) {
    const top = Math.min(words.length, vocabTotal);
    for (let i = 0; i < top; i += 1) {
      const word = words[i]!;
      const key = `w|${word.w}`;
      if (vocab.has(key)) continue;
      const stage = stageOfIndex(i);
      vocab.set(key, { key, family: "vocab", stage, d: (i + 0.5) / vocabTotal, cells: [`stage:${stage}`, `pos:${posGroup(word.pos)}`, ...(word.topic ? [`topic:${word.topic}`] : [])] });
    }
  }
  const frames = new Map<string, Frame>(allFramesFor(language).map((frame) => [`f|${frame.id}`, frame]));
  const sentKeys: { key: string; stage: number; cells: string[] }[] = [];
  const shortExpressions: { key: string; stage: number }[] = [];
  for (let stage = 1; stage <= STAGES; stage += 1) {
    for (const key of stageKeyMap(language, stage).keys()) {
      const family = familyOfKey(language, key);
      if (family === "vocab") {
        if (!vocab.has(key)) shortExpressions.push({ key, stage });
        continue;
      }
      if (family !== "sent" || sentKeys.some((one) => one.key === key)) continue;
      const cells = [`stage:${stage}`];
      if (key.startsWith("g|")) cells.push(`gram:${key.slice(2)}`);
      const frame = frames.get(key);
      if (frame) {
        const first = frame.grammar?.[0];
        if (first !== undefined) cells.push(`gram:${stage}:${first}`);
        const group: FnGroup | null = fnGroupOf(frame.fn);
        if (group) cells.push(`fn:${group}`);
      }
      sentKeys.push({ key, stage, cells });
    }
  }
  sentKeys.forEach((one, i) => sent.set(one.key, { key: one.key, family: "sent", stage: one.stage, d: (i + 0.5) / Math.max(1, sentKeys.length), cells: one.cells }));
  // 은행에 없는 짧은 표현: 그 단계 낱말 구간의 가운데 자리(분모는 낱말 컷 그대로).
  for (const one of shortExpressions) {
    const lo = one.stage === 1 ? 0 : (cuts[one.stage - 2] ?? 0);
    const hi = cuts[one.stage - 1] ?? vocabTotal;
    vocab.set(one.key, { key: one.key, family: "vocab", stage: one.stage, d: (lo + hi) / 2 / vocabTotal, cells: [`stage:${one.stage}`] });
  }
  const sentCounts = Array.from({ length: STAGES }, (_, i) => sentKeys.filter((one) => one.stage === i + 1).length);
  const idsOf = (items: Map<string, FillItem>) => [...new Set([...items.values()].flatMap((item) => item.cells))].filter((id) => !id.startsWith("stage:")).sort();
  return { language, vocab, sent, stageCounts: { vocab: vocabCounts, sent: sentCounts }, cellIds: { vocab: idsOf(vocab), sent: idsOf(sent) } };
}

/* ───────── 아는 확률 ───────── */

/** 항목 자리 눈금의 흐림(작을수록 경계가 또렷). 시뮬레이션(scripts/fill-sim.ts)으로 정함. */
export const SIGMA = 0.1;
/** 정보 셈에 쓰는 흐림 — 실제 답에는 실수·찍기·받아쓰기 탓이 섞여 SIGMA보다 넉넉히(수렴이 너무 빠르지 않게). */
export const INFO_SIGMA = 0.28;

const softplus = (x: number) => (x > 30 ? x : Math.log1p(Math.exp(x)));

export function knowChance(theta: number, d: number, sigma = SIGMA): number {
  return 1 / (1 + Math.exp((d - theta) / sigma));
}

/** 자리 [a, b] 구간 항목들의 평균 아는 확률(고르게 놓였다고 보고 적분). */
export function meanKnow(theta: number, a: number, b: number, sigma = SIGMA): number {
  if (b <= a) return knowChance(theta, a, sigma);
  return (sigma * (softplus((theta - a) / sigma) - softplus((theta - b) / sigma))) / (b - a);
}

/** 채운 몫이 fill이 되는 θ(어림 → 실력 눈금, 이분법). */
export function thetaForFill(fill: number, sigma = SIGMA): number {
  let lo = -0.5;
  let hi = 1.5;
  for (let i = 0; i < 50; i += 1) {
    const mid = (lo + hi) / 2;
    if (meanKnow(mid, 0, 1, sigma) < fill) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

/* ───────── 기록 → 증거 ───────── */

/** 기록 하나가 어디서 왔나 — 무게(설계 3절)·찍어 맞힐 몫이 갈린다. */
export type FillSource = "test" | "quiz" | "lesson" | "recall" | "fix" | "skip" | "free";
export const SOURCE_WEIGHT: Record<FillSource, number> = { test: 1, quiz: 1, lesson: 0.7, recall: 0.8, fix: 0.5, skip: 0.3, free: 1 };

export { MISS_KINDS, type MissKind } from "./missKind.ts";
import type { MissKind } from "./missKind.ts";

export type FillEvent = {
  at: number;
  key: string;
  correct: boolean;
  source: FillSource;
  /** 만들어 냄(쓰기·말하기·꺼내 쓰기·대화) — 아니면 알아봄(고르기·순서·뜻). */
  use: boolean;
  /** 고르기였나(찍어 맞힐 몫 ⅓). 쓰기·말하기는 false. */
  choose?: boolean;
  miss?: MissKind;
};

export function axisOf(family: Family, use: boolean): BankAxis {
  return family === "vocab" ? (use ? "vocabUse" : "vocabRead") : use ? "sentUse" : "sentRead";
}

/* ───────── 통화(듣기·실전 대화) ───────── */

/** 통화 하나의 차례 숫자(roleplay/callDays — 문장 없음). 모두 선택: 예전 통화엔 없다. */
export type CallTurns = {
  at: number;
  /** 그 통화 튜터 말 단계(1~5). */
  stage: number;
  turns: number;
  smooth: number;
  snag: number;
  stuck: number;
  /** 그냥 대화에서 판단된 차례 — 이끎·따라감·급급함. */
  lead?: number;
  follow?: number;
  min?: number;
  /** 질문 차례(자막 없이) 중 알아들음·🙉 뒤 알아들음·딴소리·얼버무림. */
  asked?: number;
  heardYes?: number;
  heardAfter?: number;
  /** 막힌 까닭(세부 칸). */
  why?: Partial<Record<TalkWhy, number>>;
  /** 이끈 모양. */
  leadHow?: Partial<Record<LeadHow, number>>;
  /** 해낸 일 묶음(감독 fn → fnGroups). */
  fn?: Partial<Record<FnGroup, number>>;
};
export { TALK_WHY, LEAD_HOW } from "../roleplay/turnTally.ts";

/** 튜터 말 단계 무게(사용자 2026-11-02 "난이도도 봐줘") — 쉬운 대화만이면 60%가 상한. */
export const TALK_STAGE_WEIGHT = [0.6, 0.7, 0.8, 0.9, 1] as const;
export const TALK_WINDOW = 60;
export const TALK_FLOW_SHARE = 0.7;
export const LISTEN_FULL = 0.9;

/* ───────── 결과 ───────── */

export type CellState = "weak" | "strong" | "ok" | "unknown";
export type FillCell = {
  axis: Axis;
  /** "stage:2" · "pos:verb" · "topic:food" · "gram:2:3" · "fn:time" · "miss:form" · "why:slow" · "lead:ask" · "band:3" … */
  id: string;
  /** 칸 안 몫(0~1): 은행 칸은 실제 맞힌 몫, 단계 칸은 채운 몫, 셈 칸(miss·why·lead)은 그 꼭짓점 안 비율. */
  value: number;
  /** 답 수(반감 전). */
  n: number;
  /** 예상 − 실제(몫, 은행 칸만). */
  gap: number;
  state: CellState;
};
export type AxisFill = {
  axis: Axis;
  fill: number;
  low: number;
  high: number;
  converged: boolean;
  /** 이 꼭짓점에 들어간 답(또는 차례) 수. */
  n: number;
  /** 단계 칸마다 채운 몫(0~1, 게이지). */
  stages: number[];
  cells: FillCell[];
};
export type FillResult = { axes: Record<Axis, AxisFill>; weak: FillCell[]; startStage: number };

export const WEAK_MIN_N = 8;
export const WEAK_GAP = 0.15;
export const WEAK_Z = 1.65;
export const CELL_HALF_LIFE_DAYS = 30;
export const CONVERGED_RANGE = 0.05;

/* ───────── 계산 ───────── */

type Cell = { e: number; o: number; v: number; w: number; n: number };
const emptyCell = (): Cell => ({ e: 0, o: 0, v: 0, w: 0, n: 0 });

function stageEdges(counts: readonly number[]): [number, number][] {
  const total = counts.reduce((a, b) => a + b, 0) || 1;
  let run = 0;
  return counts.map((count) => {
    const a = run / total;
    run += count;
    return [a, run / total];
  });
}

/**
 * 체크가 없을 때(처음 체크를 건너뛰고 1단계로 바로 시작한 사용자·기존 사용자): 0에서 시작하지 않고 지금 단계로 어림한다
 * (2026-11-03 사용자 "처음에 위치를 추정하고 그래프가 차 있는 상태로 점점 조정 — 0부터 시작하는 것 같아").
 * 어림 = 지금 단계 아래 문장 은행 몫 + 지금 단계의 절반, 그리고 초급 체크 어림보다 낮지 않게. 0단계(글자부터)만 0.
 */
export function priorFill(check: Check | null, stage: number, catalog: FillCatalog): { fill: number; range: number } {
  if (check) return CHECK_PRIOR[check];
  if (stage <= 0) return CHECK_PRIOR.letters;
  const counts = catalog.stageCounts.sent;
  const total = counts.reduce((a, b) => a + b, 0) || 1;
  const at = Math.min(STAGES, stage);
  const below = counts.slice(0, at - 1).reduce((a, b) => a + b, 0);
  const here = (counts[at - 1] ?? 0) / 2;
  return { fill: Math.max(CHECK_PRIOR.beginner.fill, (below + here) / total), range: Math.max(CHECK_PRIOR.beginner.range, 0.2) };
}

function cellState(cell: Cell): CellState {
  if (cell.n < WEAK_MIN_N || cell.w <= 0) return "unknown";
  const gap = (cell.e - cell.o) / cell.w;
  const z = cell.v > 0 ? (cell.e - cell.o) / Math.sqrt(cell.v) : 0;
  if (gap >= WEAK_GAP && z >= WEAK_Z) return "weak";
  if (-gap >= WEAK_GAP && -z >= WEAK_Z) return "strong";
  return "ok";
}

export type FillInput = {
  catalog: FillCatalog;
  check: Check | null;
  /** 지금 My 단계(체크가 없을 때 시작 어림). */
  stage: number;
  events: readonly FillEvent[];
  calls: readonly CallTurns[];
  now: number;
};

export function computeFill(input: FillInput): FillResult {
  const { catalog, now } = input;
  const prior = priorFill(input.check, input.stage, catalog);
  const axes = {} as Record<Axis, AxisFill>;
  const events = [...input.events].sort((a, b) => a.at - b.at);

  for (const axis of BANK_AXES) {
    const family: Family = axis.startsWith("vocab") ? "vocab" : "sent";
    const use = axis.endsWith("Use");
    const items = family === "vocab" ? catalog.vocab : catalog.sent;
    const share = PRIOR_SHARE[axis];
    let theta = thetaForFill(prior.fill * share);
    const range0 = Math.max(CONVERGED_RANGE / 2, prior.range);
    let precision = 1 / (range0 * range0);
    let weightSum = 0;
    let n = 0;
    const cells = new Map<string, Cell>();
    const latest = new Map<string, { correct: boolean; free: boolean; d: number }>();
    for (const event of events) {
      if (event.use !== use) continue;
      const item = items.get(event.key);
      if (!item) continue;
      const w = SOURCE_WEIGHT[event.source];
      const g = event.choose && !use ? 1 / 3 : 0;
      const p = knowChance(theta, item.d);
      const expect = g + (1 - g) * p;
      const y = event.correct ? 1 : 0;
      const k = Math.max(0.01, 0.25 / (1 + weightSum / 8));
      theta = Math.min(1.3, Math.max(-0.3, theta + k * w * (y - expect)));
      const pi = knowChance(theta, item.d, INFO_SIGMA);
      precision += w * (1 - g) * (1 - g) * pi * (1 - pi) / (INFO_SIGMA * INFO_SIGMA);
      weightSum += w;
      n += 1;
      const decay = Math.pow(0.5, Math.max(0, now - event.at) / (CELL_HALF_LIFE_DAYS * DAY));
      const add = (id: string, value?: { e: number; o: number }) => {
        const cell = cells.get(id) ?? emptyCell();
        const e = value?.e ?? expect;
        const o = value?.o ?? y;
        cell.e += w * decay * e;
        cell.o += w * decay * o;
        cell.v += w * decay * e * (1 - e);
        cell.w += w * decay;
        cell.n += 1;
        cells.set(id, cell);
      };
      for (const id of item.cells) add(id);
      if (!event.correct && event.miss) add(`miss:${event.miss}`, { e: 0, o: 1 });
      const prev = latest.get(item.key);
      latest.set(item.key, { correct: event.correct, free: (prev?.free ?? false) || (event.correct && event.source === "free"), d: item.d });
    }
    // 채운 몫: 어림(θ) + 직접 증거로 고침, 활용은 시켜서 0.6 · 스스로 1.
    const edges = stageEdges(catalog.stageCounts[family]);
    const counts = catalog.stageCounts[family];
    const total = counts.reduce((a, b) => a + b, 0) || 1;
    const stageSums = edges.map(([a, b], i) => meanKnow(theta, a, b) * (counts[i] ?? 0));
    const stageOfD = (d: number) => Math.max(0, edges.findIndex(([, b]) => d < b));
    let freeShare = 0;
    for (const one of latest.values()) {
      const s = stageOfD(one.d);
      const p = knowChance(theta, one.d);
      const evidence = one.correct ? Math.max(p, 0.95) : Math.min(p, 0.15);
      stageSums[s] = (stageSums[s] ?? 0) + evidence - p;
      if (one.free) freeShare += evidence;
    }
    const known = stageSums.reduce((a, b) => a + b, 0);
    const credit = use ? 0.6 : 1;
    const fill = clamp01((known * credit + (use ? 0.4 * freeShare : 0)) / total);
    const half = 1 / Math.sqrt(precision);
    // 범위는 θ 눈금 → 채움 눈금으로(가운데 기울기 근사).
    const lowFill = clamp01(meanKnow(theta - half, 0, 1) * credit);
    // 활용의 위 끝은 모두 스스로 쓴 경우(1배).
    const highFill = clamp01(meanKnow(theta + half, 0, 1));
    const stages = stageSums.map((sum, i) => clamp01(((sum ?? 0) * credit) / Math.max(1, counts[i] ?? 0)));
    const out: FillCell[] = [];
    for (const [id, cell] of cells) {
      const isMiss = id.startsWith("miss:");
      out.push({
        axis,
        id,
        value: isMiss ? 0 : cell.w > 0 ? cell.o / cell.w : 0,
        n: cell.n,
        gap: isMiss ? 0 : cell.w > 0 ? (cell.e - cell.o) / cell.w : 0,
        state: isMiss ? "ok" : cellState(cell),
      });
    }
    // 틀린 꼴 칸: 그 꼭짓점 틀림 중 몫.
    const missTotal = out.filter((one) => one.id.startsWith("miss:")).reduce((a, one) => a + one.n, 0);
    for (const one of out) if (one.id.startsWith("miss:")) one.value = missTotal ? one.n / missTotal : 0;
    // 답이 없는 세부 칸 = 아직 모름(계속 재기 — 섞어 낼 칸).
    for (const id of catalog.cellIds[family]) if (!cells.has(id)) out.push({ axis, id, value: 0, n: 0, gap: 0, state: "unknown" });
    // 단계 칸은 답이 없어도 늘 다섯(게이지와 같은 줄).
    for (let s = 1; s <= STAGES; s += 1) {
      const have = out.find((one) => one.id === `stage:${s}`);
      if (have) have.value = stages[s - 1] ?? 0;
      else out.push({ axis, id: `stage:${s}`, value: stages[s - 1] ?? 0, n: 0, gap: 0, state: "unknown" });
    }
    axes[axis] = { axis, fill, low: Math.min(fill, lowFill), high: Math.max(fill, highFill), converged: (Math.max(fill, highFill) - Math.min(fill, lowFill)) / 2 <= CONVERGED_RANGE, n, stages, cells: sortCells(out) };
  }

  axes.talk = talkFill(input.calls, prior.fill * PRIOR_SHARE.talk, prior.range);
  axes.listen = listenFill(input.calls, prior.fill * PRIOR_SHARE.listen, prior.range);

  const weak = AXES.flatMap((axis) => axes[axis].cells.filter((cell) => cell.state === "weak"))
    .sort((a, b) => weakRank(b) - weakRank(a));
  return { axes, weak, startStage: input.check ? CHECK_PRIOR[input.check].stage : input.stage };
}

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

/** 낮은 단계 구멍이 더 급하다 — 차이 × 근거 × 단계 무게. */
function weakRank(cell: FillCell): number {
  const stage = Number(/(?:stage|gram|band):(\d)/.exec(cell.id)?.[1] ?? 3);
  return cell.gap * Math.sqrt(cell.n) * (1 + (STAGES - stage) / STAGES);
}

const STATE_ORDER: Record<CellState, number> = { weak: 0, unknown: 1, ok: 2, strong: 3 };
function sortCells(cells: FillCell[]): FillCell[] {
  return cells.sort((a, b) => STATE_ORDER[a.state] - STATE_ORDER[b.state] || b.gap - a.gap || a.id.localeCompare(b.id));
}

/** 최근 통화부터 차례가 TALK_WINDOW에 찰 때까지. */
function recentCalls(calls: readonly CallTurns[]): CallTurns[] {
  const out: CallTurns[] = [];
  let turns = 0;
  for (const call of [...calls].sort((a, b) => b.at - a.at)) {
    if (turns >= TALK_WINDOW) break;
    if (!call.turns) continue;
    out.push(call);
    turns += call.turns;
  }
  return out;
}

const stageWeight = (stage: number) => TALK_STAGE_WEIGHT[Math.min(STAGES, Math.max(1, Math.round(stage))) - 1]!;

export function talkFill(calls: readonly CallTurns[], prior: number, range0: number): AxisFill {
  const recent = recentCalls(calls);
  const turns = recent.reduce((a, call) => a + call.turns, 0);
  let flow = 0;
  let leadScore = 0;
  let leadN = 0;
  const why: Partial<Record<string, number>> = {};
  const fn: Partial<Record<string, number>> = {};
  const leadHow: Partial<Record<string, number>> = {};
  const stageTurns = Array(STAGES).fill(0) as number[];
  const stageFlow = Array(STAGES).fill(0) as number[];
  for (const call of recent) {
    const weight = stageWeight(call.stage);
    const got = call.smooth + 0.5 * call.snag;
    flow += weight * got;
    const s = Math.min(STAGES, Math.max(1, Math.round(call.stage))) - 1;
    stageTurns[s] += call.turns;
    stageFlow[s] += got;
    const judged = (call.lead ?? 0) + (call.follow ?? 0) + (call.min ?? 0);
    leadScore += (call.lead ?? 0) + 0.5 * (call.follow ?? 0);
    leadN += judged;
    for (const [k, v] of Object.entries(call.why ?? {})) why[k] = (why[k] ?? 0) + (v ?? 0);
    for (const [k, v] of Object.entries(call.fn ?? {})) fn[k] = (fn[k] ?? 0) + (v ?? 0);
    for (const [k, v] of Object.entries(call.leadHow ?? {})) leadHow[k] = (leadHow[k] ?? 0) + (v ?? 0);
  }
  const flowShare = turns ? flow / turns : 0;
  const leadShare = leadN ? leadScore / leadN : flowShare;
  const measured = TALK_FLOW_SHARE * flowShare + (1 - TALK_FLOW_SHARE) * leadShare;
  // 차례가 적을 땐 처음 어림 쪽으로 당김(차례 10개 = 반쯤).
  const trust = turns / (turns + 10);
  const fill = clamp01(trust * measured + (1 - trust) * prior);
  const half = range0 / Math.sqrt(1 + turns / 10);
  const cells: FillCell[] = [];
  const whyTotal = Object.values(why).reduce((a: number, b) => a + (b ?? 0), 0);
  for (const [k, v] of Object.entries(why)) cells.push({ axis: "talk", id: `why:${k}`, value: whyTotal ? (v ?? 0) / whyTotal : 0, n: v ?? 0, gap: 0, state: "ok" });
  const leadTotal = Object.values(leadHow).reduce((a: number, b) => a + (b ?? 0), 0);
  for (const [k, v] of Object.entries(leadHow)) cells.push({ axis: "talk", id: `lead:${k}`, value: leadTotal ? (v ?? 0) / leadTotal : 0, n: v ?? 0, gap: 0, state: "ok" });
  for (const [k, v] of Object.entries(fn)) cells.push({ axis: "talk", id: `fn:${k}`, value: 0, n: v ?? 0, gap: 0, state: "ok" });
  cells.push({ axis: "talk", id: "part:flow", value: flowShare, n: turns, gap: 0, state: turns < WEAK_MIN_N ? "unknown" : "ok" });
  cells.push({ axis: "talk", id: "part:lead", value: leadShare, n: leadN, gap: 0, state: leadN < WEAK_MIN_N ? "unknown" : "ok" });
  // 막힌 까닭 하나가 막힘·걸림의 절반을 넘고 8번 넘으면 부족.
  for (const cell of cells) if (cell.id.startsWith("why:") && cell.n >= WEAK_MIN_N && cell.value >= 0.5) { cell.state = "weak"; cell.gap = cell.value; }
  if (leadN >= WEAK_MIN_N && leadShare < flowShare - WEAK_GAP) {
    const lead = cells.find((one) => one.id === "part:lead")!;
    lead.state = "weak";
    lead.gap = flowShare - leadShare;
  }
  const stages = stageTurns.map((t, i) => (t ? stageFlow[i]! / t : 0));
  return { axis: "talk", fill, low: clamp01(fill - half), high: clamp01(fill + half), converged: half <= CONVERGED_RANGE, n: turns, stages, cells: sortCells(cells) };
}

export function listenFill(calls: readonly CallTurns[], prior: number, range0: number): AxisFill {
  const asked = Array(STAGES).fill(0) as number[];
  const got = Array(STAGES).fill(0) as number[];
  for (const call of calls) {
    if (!call.asked) continue;
    const s = Math.min(STAGES, Math.max(1, Math.round(call.stage))) - 1;
    asked[s] += call.asked;
    got[s] += (call.heardYes ?? 0) + 0.5 * (call.heardAfter ?? 0);
  }
  const bands = asked.map((n, i) => (n ? Math.min(1, got[i]! / n / LISTEN_FULL) : 0));
  const total = asked.reduce((a, b) => a + b, 0);
  const measured = bands.reduce((a, b) => a + b, 0) / STAGES;
  const trust = total / (total + 10);
  const fill = clamp01(trust * measured + (1 - trust) * prior);
  const half = range0 / Math.sqrt(1 + total / 10);
  const cells: FillCell[] = bands.map((value, i) => ({ axis: "listen" as const, id: `band:${i + 1}`, value, n: asked[i]!, gap: 0, state: (asked[i]! < WEAK_MIN_N ? "unknown" : value < 0.6 ? "weak" : "ok") as CellState }));
  for (const cell of cells) if (cell.state === "weak") cell.gap = 0.6 - cell.value;
  return { axis: "listen", fill, low: clamp01(fill - half), high: clamp01(fill + half), converged: half <= CONVERGED_RANGE, n: total, stages: bands, cells: sortCells(cells) };
}

/* ───────── 계속 재기 ───────── */

/** 답이 모자란 칸(아직 모름) — Quizbank·정기 시험이 다섯에 하나 섞어 낼 칸. */
export function unmeasuredCells(result: FillResult, axes: readonly BankAxis[] = BANK_AXES): FillCell[] {
  return axes.flatMap((axis) => result.axes[axis].cells.filter((cell) => cell.state === "unknown" && !cell.id.startsWith("stage:") && !cell.id.startsWith("miss:")));
}

/** 그 칸에 드는 열쇠(세부 칸 → 문제 고르기·3층 "공부할 것"). */
export function keysInCell(catalog: FillCatalog, axis: BankAxis, cellId: string): string[] {
  const items = axis.startsWith("vocab") ? catalog.vocab : catalog.sent;
  const out: string[] = [];
  for (const item of items.values()) if (item.cells.includes(cellId)) out.push(item.key);
  return out;
}

export { missKindOf } from "./missKind.ts";
