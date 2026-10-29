/**
 * 정해진 데이터 중 얼마나(2026-10-29 사용자 "이미 학습 데이터가 정해져 있으니 그걸로 확실하게 정해진 데이터 중 얼마나 학습했다를 보여 주면" → "진행해줘").
 *
 * 분모는 그 학습 언어의 뼈대 전체(1~5단계 대본 핵심 표현 e|·문장구조 f|·문법 칸 g| — myParts.stageKeyMap과 같은 열쇠·같은 갈래, 겹치면 한 번),
 * 발음은 모든 상황 대본. 분자는 이미 앎만(curriculum/known.ts — 다른 날 세 번 맞힘), 발음은 통과한 상황 대본.
 * 배우는 중 = 확인 중이거나 그 열쇠가 든 대본·틀을 통과(아직 이미 앎은 아님) — 숫자에 섞지 않고 옆에 옅게.
 * 뼈대 밖(u|, 대화·찾아본 낱말에서 온 것)은 분모에 넣지 않고 따로 센다. 빈도 단어 묶음이 들어오면 분모가 커진다. 순수.
 */
import { knownState, type KnownMap } from "../curriculum/known.ts";
import { isSituationScript, scriptsFor } from "../curriculum/stageScripts.ts";
import { stageKeyMap } from "./myParts.ts";
import type { PartId } from "./stageParts.ts";

export type PartTotal = { id: PartId; known: number; learning: number; total: number };
export type SkeletonTotals = { parts: PartTotal[]; outside: { known: number; learning: number } };

export const TOTAL_STAGES = 5;

export function skeletonTotals(language: string, input: { known: KnownMap; passed: ReadonlySet<string> }): SkeletonTotals {
  const keys = new Map<string, { part: PartId; from: Set<string> }>();
  for (let order = 1; order <= TOTAL_STAGES; order += 1) {
    for (const [key, row] of stageKeyMap(language, order)) {
      const have = keys.get(key) ?? { part: row.part, from: new Set<string>() };
      for (const id of row.from) have.from.add(id);
      keys.set(key, have);
    }
  }
  const tally: Record<PartId, PartTotal> = {
    vocab: { id: "vocab", known: 0, learning: 0, total: 0 },
    grammar: { id: "grammar", known: 0, learning: 0, total: 0 },
    expression: { id: "expression", known: 0, learning: 0, total: 0 },
    pronunciation: { id: "pronunciation", known: 0, learning: 0, total: 0 },
  };
  for (const [key, row] of keys) {
    const one = tally[row.part];
    one.total += 1;
    const state = knownState(input.known, key);
    if (state === "known") one.known += 1;
    else if (state === "checking" || [...row.from].some((id) => input.passed.has(id))) one.learning += 1;
  }
  for (let order = 1; order <= TOTAL_STAGES; order += 1) {
    for (const script of scriptsFor(language, order).filter(isSituationScript)) {
      tally.pronunciation.total += 1;
      if (input.passed.has(script.id)) tally.pronunciation.known += 1;
    }
  }
  const outside = { known: 0, learning: 0 };
  for (const key of Object.keys(input.known)) {
    if (!key.startsWith("u|")) continue;
    if (knownState(input.known, key) === "known") outside.known += 1;
    else outside.learning += 1;
  }
  return { parts: (["vocab", "grammar", "expression", "pronunciation"] as const).map((id) => tally[id]).filter((part) => part.total > 0), outside };
}

/** 지금 단계에서 다음 단계 조건(갈래마다 STAGE_DONE_SHARE)까지 남은 열쇠 수(반 몫은 올림). */
export function toNextStage(parts: readonly { done: number; total: number; measured?: boolean }[], share: number): number {
  return parts.filter((part) => part.measured !== false && part.total > 0).reduce((sum, part) => sum + Math.max(0, Math.ceil(share * part.total - part.done)), 0);
}

/** My(뼈대) 화면용: 어휘(대본의 짧은 핵심 표현)는 표현에 합친다 — 어휘 수는 지속 학습이 따로 잰다(2026-10-29 사용자 "지속 학습은 My와 분리해서 어휘 n천 개는 따로"). */
export function skeletonView(totals: SkeletonTotals): PartTotal[] {
  const vocab = totals.parts.find((part) => part.id === "vocab");
  return totals.parts
    .filter((part) => part.id !== "vocab")
    .map((part) => (part.id === "expression" && vocab ? { ...part, known: part.known + vocab.known, learning: part.learning + vocab.learning, total: part.total + vocab.total } : part));
}
