/**
 * Logbank 숫자는 하루에 한 번 판정(2026-11-07 사용자 "문제 하나를 맞출때마다 매번 변수로 반영하는게 문제 — 모아서 판정하거나
 * 단일문제는 좀더 미시적으로" → "다 바꿔줘").
 *
 * - 공부한 날이 끝날 때마다 그날까지의 답으로 computeFill(그날 끝 값)을 내고, 보이는 값은 앞날 값에서 꼭짓점마다 ±DAY_STEP까지만 옮긴다.
 *   (가상 학습자 30일: 예전엔 첫 주 하루 최대 +5~7%p — 표본이 적을 때 범위가 좁아지는 몫이 한꺼번에 들어옴.)
 * - 오늘 푼 답은 미세 반영: 열쇠 하나 = 그 꼭짓점 몫(활용은 ×0.6) ÷ 꼭짓점 전체 항목 수(낱말 하나 ≈ 0.01%p), 틀림은 −½, 합은 ±MICRO_MAX,
 *   지금 어림(raw) 너머로는 안 감.
 * - 첫 측정(fill.ts placed)만으로 생긴 값은 첫날 바로 들어간다(캡 없음) — 답이 아니라 측정이라서.
 * - 띠 칸 길이(stages)·답 수(stageN)도 마지막 판정 날 것 — 칸이 답마다 출렁이지 않게. 세부 칸(부족 찾기)은 지금 것 그대로.
 * 듣기·실전 대화는 처음 어림·통화라 그대로.
 */
import { BANK_AXES, computeFill, PRIOR_SHARE, type BankAxis, type FillInput, type FillResult } from "./fill.ts";

export const DAY_STEP = 0.02;
export const MICRO_MAX = 0.02;
export const WRONG_MICRO = 0.5;

export type BankValues = Record<BankAxis, number>;
export type FillChain = {
  /** 답 없이 첫 측정만으로 낸 값(첫날 바로). */
  prior: BankValues;
  /** 끝난 공부한 날(오늘 전)마다: 그날 시작·끝(ms), 판정 값, 그날 끝 computeFill. 시간 순. */
  days: { start: number; end: number; value: BankValues; raw: FillResult }[];
};

const values = (result: FillResult): BankValues => Object.fromEntries(BANK_AXES.map((axis) => [axis, result.axes[axis].fill])) as BankValues;

/** 그 폰 날의 0시(ms). */
export function localDayStart(ms: number): number {
  const d = new Date(ms);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

/** 오늘 전 공부한 날마다 이어서 판정. input.now가 기준(그날은 안 셈 — 오늘은 미세 반영). */
export function fillChain(input: FillInput, dayStart: (ms: number) => number = localDayStart): FillChain {
  const today = dayStart(input.now);
  const prior = values(computeFill({ ...input, events: [], calls: [] }));
  const starts = [...new Set([...input.events.map((e) => e.at), ...input.calls.map((c) => c.at)].filter((at) => at < today).map(dayStart))].sort((a, b) => a - b);
  const days: FillChain["days"] = [];
  let shown = prior;
  for (const start of starts) {
    const end = Math.min(today, dayStart(start + 36 * 3600 * 1000));
    const raw = computeFill({ ...input, events: input.events.filter((e) => e.at < end), calls: input.calls.filter((c) => c.at < end), now: end });
    const next = values(raw);
    const value = Object.fromEntries(BANK_AXES.map((axis) => [axis, Math.min(1, Math.max(0, shown[axis] + Math.max(-DAY_STEP, Math.min(DAY_STEP, next[axis] - shown[axis]))))])) as BankValues;
    days.push({ start, end, value, raw });
    shown = value;
  }
  return { prior, days };
}

/** cut(ms) 때까지 끝난 판정 값(없으면 첫 측정 값). */
export function judgedAt(chain: FillChain, cut: number): BankValues {
  let out = chain.prior;
  for (const day of chain.days) if (day.end <= cut) out = day.value;
  return out;
}

/** 오늘 답의 미세 몫(꼭짓점마다): 열쇠마다 마지막 답. */
export function microOf(input: FillInput, from: number): BankValues {
  const out = Object.fromEntries(BANK_AXES.map((axis) => [axis, 0])) as BankValues;
  const latest = new Map<string, { axis: BankAxis; correct: boolean }>();
  for (const event of input.events) {
    if (event.at < from || event.at > input.now) continue;
    const item = input.catalog.vocab.get(event.key) ?? input.catalog.sent.get(event.key);
    if (!item) continue;
    const axis: BankAxis = item.family === "vocab" ? (event.use ? "vocabUse" : "vocabRead") : event.use ? "sentUse" : "sentRead";
    latest.set(`${axis}|${event.key}`, { axis, correct: event.correct });
  }
  for (const { axis, correct } of latest.values()) {
    const family = axis.startsWith("vocab") ? "vocab" : "sent";
    const total = input.catalog.stageCounts[family].reduce((a, b) => a + b, 0) || 1;
    out[axis] += ((correct ? 1 : -WRONG_MICRO) * PRIOR_SHARE[axis]) / total;
  }
  for (const axis of BANK_AXES) out[axis] = Math.max(-MICRO_MAX, Math.min(MICRO_MAX, out[axis]));
  return out;
}

/**
 * 보이는 Logbank 값: 마지막 판정 + 오늘 미세 몫. 은행 꼭짓점의 fill·low와 띠 칸(stages·stageN)을 바꾸고 나머지(세부 칸·듣기·실전 대화)는 raw 그대로.
 * chain은 같은 input으로 만든 것(fillChain).
 */
export function judgeFill(raw: FillResult, chain: FillChain, input: FillInput, dayStart: (ms: number) => number = localDayStart): FillResult {
  const today = dayStart(input.now);
  const base = judgedAt(chain, today);
  const micro = microOf(input, today);
  const last = [...chain.days].reverse().find((day) => day.end <= today)?.raw;
  const axes = { ...raw.axes };
  for (const axis of BANK_AXES) {
    // 미세 몫은 지금 어림(raw) 쪽으로만, 그 너머로는 안 감 — 판정이 raw를 따라잡았으면 답이 숫자를 넘겨 올리지 않는다.
    const gap = raw.axes[axis].fill - base[axis];
    const nudge = micro[axis] > 0 ? Math.min(micro[axis], Math.max(0, gap)) : Math.max(micro[axis], Math.min(0, gap));
    const fill = Math.min(1, Math.max(0, base[axis] + nudge));
    const from = last?.axes[axis];
    axes[axis] = {
      ...raw.axes[axis],
      fill,
      low: Math.min(fill, raw.axes[axis].low),
      high: Math.max(fill, raw.axes[axis].high),
      ...(from ? { stages: from.stages, stageN: from.stageN, presumed: from.presumed } : { stages: raw.axes[axis].stages.map((v, i) => (raw.axes[axis].presumed?.[i] ? v : 0)), stageN: raw.axes[axis].stageN.map(() => 0) }),
    };
  }
  return { ...raw, axes };
}

/** cut 때 보였을 값(2주 비교·기간 시작·곡선 점) — 같은 chain, 그때까지의 답만. cut ≤ chain을 만든 now. */
export function fillAt(chain: FillChain, input: FillInput, cut: number, dayStart: (ms: number) => number = localDayStart): FillResult {
  const at = { ...input, events: input.events.filter((e) => e.at < cut), calls: input.calls.filter((c) => c.at < cut), now: cut };
  return judgeFill(computeFill(at), chain, at, dayStart);
}
