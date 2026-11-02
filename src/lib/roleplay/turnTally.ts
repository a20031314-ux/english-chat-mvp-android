/**
 * AI 통화 차례 재기(2026-11-02, hub/drafts/fill-gauge-2026-11-02.md 9절) — Logbank 육각형 듣기·실전 대화의 재료.
 * 감독이 같은 호출에서 낸 칸(heard·lead·how·fn·native, director.ts turnMeasure)과 화면이 아는 것(머뭇거림·💡 힌트·💬 자막·🙉)을
 * 학습자 줄에 숫자·낱말 몇 개로 붙이고(`TurnMark`), 통화가 끝나면 줄들을 세어 callDays 한 줄에 싣는다. 문장은 남기지 않는다. 순수 모듈.
 */
import type { FnGroup } from "../curriculum/fnGroups.ts";

export type Heard = "yes" | "off" | "vague";
export type Lead = "lead" | "follow" | "min";
export const LEAD_HOW = ["ask", "topic", "extend"] as const;
export type LeadHow = (typeof LEAD_HOW)[number];
export const TALK_WHY = ["slow", "hint", "native", "fix", "minimal"] as const;
export type TalkWhy = (typeof TALK_WHY)[number];
export type Flow = "smooth" | "snag" | "stuck";

/** 머뭇거림: 이 안이면 매끄러움, 넘으면 걸림, STUCK_MS 넘으면 막힘. */
export const SLOW_MS = 4000;
export const STUCK_MS = 10_000;

/** 학습자 줄에 붙는 재기 표시(저장되는 통화 기록 안, 이 폰에만). */
export type TurnMark = {
  flow: Flow;
  why?: TalkWhy[];
  /** 자막 없이 들은 질문에 답했을 때만: yes · off · vague · after(🙉로 다시 들은 뒤 맞게). */
  heard?: Heard | "after";
  /** 자막을 켜고 답한 차례(듣기 근거에서 뺌). */
  captioned?: boolean;
  lead?: Lead;
  how?: LeadHow;
  fn?: FnGroup;
  /** 그 차례 튜터 말 단계(감독 level 1~5). */
  level: number;
};

export type TurnSignals = {
  assessment: string;
  heard?: Heard;
  lead?: Lead;
  leadHow?: LeadHow;
  fnGroup?: FnGroup;
  native?: boolean;
  /** 고친 말이 다시 만든 문장(meant)이거나 튜터 수업이 다시 말해 보라고 함(큰 고침). */
  bigFix: boolean;
  hesitationMs: number;
  usedHint: boolean;
  captions: boolean;
  /** 바로 앞 튜터 줄이 🙉로 다시 말한 줄. */
  afterMissed: boolean;
  level: number;
};

/** 차례 하나 → 매끄러움(어긋남 없음)·걸림(하나)·막힘(감독 stuck·10초 넘게·둘 넘게). */
export function markTurn(signals: TurnSignals): TurnMark {
  const why: TalkWhy[] = [];
  if (signals.hesitationMs > SLOW_MS) why.push("slow");
  if (signals.usedHint) why.push("hint");
  if (signals.native) why.push("native");
  if (signals.bigFix) why.push("fix");
  if (signals.lead === "min") why.push("minimal");
  const stuck = signals.assessment === "stuck" || signals.hesitationMs > STUCK_MS || why.length >= 2;
  const flow: Flow = stuck ? "stuck" : why.length === 1 ? "snag" : "smooth";
  const heard = signals.heard === "yes" && signals.afterMissed ? "after" : signals.heard;
  return {
    flow,
    ...(why.length ? { why } : {}),
    ...(heard && !signals.captions ? { heard } : {}),
    ...(heard && signals.captions ? { captioned: true } : {}),
    ...(signals.lead ? { lead: signals.lead } : {}),
    ...(signals.leadHow ? { how: signals.leadHow } : {}),
    ...(signals.fnGroup ? { fn: signals.fnGroup } : {}),
    level: Math.min(5, Math.max(1, Math.round(signals.level || 1))),
  };
}

/** 통화 하나의 차례 셈 — curriculum/fill.ts CallTurns 모양(at 빼고). 표시가 없는 예전 통화는 null. */
export type TurnTally = {
  stage: number;
  turns: number;
  smooth: number;
  snag: number;
  stuck: number;
  lead: number;
  follow: number;
  min: number;
  asked: number;
  heardYes: number;
  heardAfter: number;
  why: Partial<Record<TalkWhy, number>>;
  leadHow: Partial<Record<LeadHow, number>>;
  fn: Partial<Record<FnGroup, number>>;
};

export function tallyTurns(marks: readonly (TurnMark | undefined)[]): TurnTally | null {
  const list = marks.filter((one): one is TurnMark => Boolean(one));
  if (!list.length) return null;
  const out: TurnTally = { stage: 1, turns: 0, smooth: 0, snag: 0, stuck: 0, lead: 0, follow: 0, min: 0, asked: 0, heardYes: 0, heardAfter: 0, why: {}, leadHow: {}, fn: {} };
  let levels = 0;
  for (const mark of list) {
    out.turns += 1;
    out[mark.flow] += 1;
    levels += mark.level;
    if (mark.lead) out[mark.lead] += 1;
    if (mark.heard) {
      out.asked += 1;
      if (mark.heard === "yes") out.heardYes += 1;
      if (mark.heard === "after") out.heardAfter += 1;
    }
    for (const why of mark.why ?? []) out.why[why] = (out.why[why] ?? 0) + 1;
    if (mark.how) out.leadHow[mark.how] = (out.leadHow[mark.how] ?? 0) + 1;
    if (mark.fn) out.fn[mark.fn] = (out.fn[mark.fn] ?? 0) + 1;
  }
  out.stage = Math.round(levels / list.length);
  return out;
}
