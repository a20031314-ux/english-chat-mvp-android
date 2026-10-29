/**
 * My 안에서만 재는 네 갈래(2026-10-29 사용자 "정해진 학습(My)으로 뼈대 → 지속 학습(퀴즈·단어)으로 채우고 → AI·사용자 간 학습으로 적용",
 * "숙지 기준·그래프는 My 탭 한정으로"). 채팅·통화·영상(적용)의 장부는 여기 쓰지 않는다 — 그쪽은 커리큘럼 순서·다시 볼 것에만.
 *
 * 그 단계 열쇠(대본 핵심 표현 e|·문장구조 f|·문법 칸 g|단계:번호)마다:
 *   이미 앎(curriculum/known.ts — 시험에서 맞히고 다른 날 퀴즈·이번 주 확인으로 두 번 더) = 1
 *   확인 중(시험에서 맞힘) 또는 그 열쇠가 든 대본·틀을 통과 = ½
 * 갈래: 문장구조·문법 = 문법, 두 낱말까지 = 어휘, 그보다 긴 표현 = 표현(checkup.partOf와 같은 나눔).
 * 발음 = 그 단계 상황 대본 중 통과한 몫(내 줄을 말해서 넘김).
 * 결과 모양은 stageParts와 같아 화면(망·그래프·단계 막대·다음 단계 조건)은 그대로 쓴다. 순수.
 */
import { DAY_MS, reviewKeysOf } from "../curriculum/dailyPlan.ts";
import { frameById, framesFor } from "../curriculum/frames.ts";
import type { Stage } from "../curriculum/stages/types.ts";
import { grammarNodeId } from "./notebook.ts";
import { knownState, type KnownMap } from "../curriculum/known.ts";
import { STAGE_DONE_SHARE } from "../curriculum/stages/index.ts";
import { isSituationScript, scriptsFor } from "../curriculum/stageScripts.ts";
import type { LedgerState } from "../learner/ledger.ts";
import { HISTORY_DAYS, isWordish, MISTAKE_FOCUS, shareOf, type PartId, type PartLogItem, type PartView, type StageParts } from "./stageParts.ts";

type Passed = ReadonlyMap<string, number>;

/** 그 단계의 열쇠와 갈래, 그 열쇠를 가진 대본·틀 id. */
export function stageKeyMap(language: string, order: number): Map<string, { part: PartId; from: string[] }> {
  const out = new Map<string, { part: PartId; from: string[] }>();
  const add = (key: string, id: string) => {
    const part: PartId = key.startsWith("f|") || key.startsWith("g|") ? "grammar" : isWordish(key.slice(2), language) ? "vocab" : "expression";
    const row = out.get(key) ?? { part, from: [] };
    if (!row.from.includes(id)) row.from.push(id);
    out.set(key, row);
  };
  for (const script of scriptsFor(language, order)) {
    for (const key of reviewKeysOf(language, script.id)) add(key, script.id);
    for (const index of script.grammar ?? []) add(`g|${order}:${index}`, script.id);
  }
  for (const frame of framesFor(language, order)) {
    add(`f|${frame.id}`, frame.id);
    for (const index of frame.grammar ?? []) add(`g|${order}:${index}`, frame.id);
  }
  return out;
}

/** 열쇠 하나의 몫과 그때(배움·이미 앎이 된 때). */
function creditOf(key: string, from: readonly string[], passed: Passed, known: KnownMap): { value: number; learnedAt?: number; masteredAt?: number } {
  const state = knownState(known, key);
  const passedAt = from.map((id) => passed.get(id)).filter((at): at is number => typeof at === "number").sort((a, b) => a - b)[0];
  const entry = known[key];
  const firstDayAt = entry ? entry.days[0]! * DAY_MS : undefined;
  const learnedAt = [passedAt, firstDayAt].filter((at): at is number => typeof at === "number").sort((a, b) => a - b)[0];
  if (state === "known") return { value: 1, learnedAt, masteredAt: entry!.days[entry!.days.length - 1]! * DAY_MS };
  if (state === "checking" || passedAt) return { value: 0.5, learnedAt };
  return { value: 0 };
}

export function myStageParts(input: {
  language: string;
  order: number;
  passed: Passed;
  known: KnownMap;
  /** 갈래마다 최근 2주 튜터가 짚은 수 — 숫자는 안 바꾸고 "다음 단계까지" 고를 때만(적용 → 커리큘럼 순서). */
  mistakes?: Partial<Record<PartId, number>>;
}): StageParts {
  const keys = stageKeyMap(input.language, input.order);
  const tally: Record<PartId, { done: number; total: number }> = {
    vocab: { done: 0, total: 0 },
    grammar: { done: 0, total: 0 },
    expression: { done: 0, total: 0 },
    pronunciation: { done: 0, total: 0 },
  };
  const expressions: { text: string; state: LedgerState | null }[] = [];
  for (const [key, row] of keys) {
    const credit = creditOf(key, row.from, input.passed, input.known);
    tally[row.part].total += 1;
    tally[row.part].done += credit.value;
    if (key.startsWith("e|")) expressions.push({ text: key.slice(2), state: credit.value >= 1 ? "mastered" : credit.value > 0 ? "learned" : null });
  }
  const situations = scriptsFor(input.language, input.order).filter(isSituationScript);
  tally.pronunciation = { done: situations.filter((script) => input.passed.has(script.id)).length, total: situations.length };
  const parts: PartView[] = (["vocab", "grammar", "expression", "pronunciation"] as const).map((id) => ({ id, ...tally[id], measured: tally[id].total > 0 }));
  const measured = parts.filter((part) => part.measured);
  const ready = measured.length > 0 && measured.every((part) => shareOf(part) >= STAGE_DONE_SHARE);
  const below = measured.filter((part) => shareOf(part) < STAGE_DONE_SHARE);
  const focus = below
    .filter((part) => (input.mistakes?.[part.id] ?? 0) >= MISTAKE_FOCUS)
    .sort((a, b) => (input.mistakes?.[b.id] ?? 0) - (input.mistakes?.[a.id] ?? 0) || shareOf(a) - shareOf(b))[0];
  const weakest = ready ? null : (focus?.id ?? measured.slice().sort((a, b) => shareOf(a) - shareOf(b))[0]?.id ?? null);
  return { order: input.order, parts, ready, weakest, expressions };
}

/** 그래프 보기: 그 단계 갈래마다 최근 14일 하루하루 늘어난 몫(배운 날 ½, 이미 앎이 된 날 ½, 발음은 상황 대본을 통과한 날 1). */
export function myPartHistory(input: { language: string; order: number; passed: Passed; known: KnownMap; now: number; dayOf: (at: number) => string }): Record<PartId, number[]> {
  const days = Array.from({ length: HISTORY_DAYS }, (_, i) => input.dayOf(input.now - (HISTORY_DAYS - 1 - i) * DAY_MS));
  const index = new Map(days.map((day, i) => [day, i]));
  const out: Record<PartId, number[]> = { vocab: days.map(() => 0), grammar: days.map(() => 0), expression: days.map(() => 0), pronunciation: days.map(() => 0) };
  const bump = (part: PartId, at: number | undefined, amount: number) => {
    if (!at) return;
    const i = index.get(input.dayOf(at));
    if (i !== undefined) out[part][i]! += amount;
  };
  for (const [key, row] of stageKeyMap(input.language, input.order)) {
    const credit = creditOf(key, row.from, input.passed, input.known);
    if (credit.value > 0) bump(row.part, credit.learnedAt, 0.5);
    if (credit.value >= 1) bump(row.part, credit.masteredAt, 0.5);
  }
  for (const script of scriptsFor(input.language, input.order).filter(isSituationScript)) bump("pronunciation", input.passed.get(script.id), 1);
  return out;
}

/** 망·그래프를 누르면 보이는 낱낱(My 안: 배움 = 대본 통과·시험에서 맞힘, 숙지 = 이미 앎) — 고친 줄(fixed)은 부르는 쪽이 붙인다. */
export function myPartLog(input: { language: string; stage: Stage; passed: Passed; known: KnownMap; now: number }): Record<PartId, PartLogItem[]> {
  const order = input.stage.order;
  const since = input.now - HISTORY_DAYS * DAY_MS;
  const out: Record<PartId, PartLogItem[]> = { vocab: [], grammar: [], expression: [], pronunciation: [] };
  for (const [key, row] of stageKeyMap(input.language, order)) {
    const credit = creditOf(key, row.from, input.passed, input.known);
    // 화면 이름: 표현은 그대로, 문장구조는 틀 모양, 문법 칸은 칸 id(앱이 칸 이름으로).
    const grammar = key.startsWith("g|") ? input.stage.grammar[Number(key.split(":")[1])] : undefined;
    const node = grammar ? grammarNodeId(order, grammar) : undefined;
    const text = key.startsWith("e|") ? key.slice(2) : key.startsWith("f|") ? (frameById(input.language, key.slice(2))?.pattern ?? key.slice(2)) : (grammar?.name.en ?? key);
    if (credit.value > 0 && credit.learnedAt && credit.learnedAt >= since) out[row.part].push({ at: credit.learnedAt, kind: "learned", text, where: "mission", ...(node ? { node } : {}) });
    if (credit.value >= 1 && credit.masteredAt && credit.masteredAt >= since) out[row.part].push({ at: credit.masteredAt, kind: "mastered", text, where: "mission", ...(node ? { node } : {}) });
  }
  return out;
}
