/**
 * "오늘의 대본" — 정해진 순서 대신 사용자 데이터로 지금 필요한 대본을 고른다(2026-10-28 사용자 "필요한 부분을 찾아서 스크립트를 추천" → A: 있는 대본 중에서).
 *
 * 모델을 부르지 않는다. 신호:
 * - 최근 2주에 튜터가 짚은 문법 칸(노트 카드의 node·also = 그 단계 문법) — 그 문법을 내 줄에서 쓰는 대본(`grammar` 태그)이 가장 먼저.
 * - 아직 배우지 않은 핵심 표현(장부) — 그 표현을 쓰는 대본(`expressions`). 표현 갈래가 가장 모자라면 무게를 더.
 * - 아직 통과하지 않은 대본(상황 대본은 다음 단계 조건이라 조금 더).
 * - 익힌 틀(통과한 틀 id)이 내 줄에 든 대본(줄의 `frames` 태그) — 익힌 틀을 장면에서 바로 써 보게, 대본마다 2까지(2026-10-28 1단계).
 * 이유(why)를 같이 돌려줘서 화면이 "왜 이 대본인지" 한 줄을 보인다.
 */
import { framesOfScript } from "./frames.ts";
import { isSituationScript, scriptsFor, type StageScript } from "./stageScripts.ts";

export type ScriptWhy =
  | { kind: "grammar"; items: number[] }
  | { kind: "expression"; items: string[] }
  | { kind: "next" };

export type ScriptPick = { id: string; why: ScriptWhy };

export type PickInput = {
  language: string;
  stage: number;
  passed: ReadonlySet<string>;
  /** 그 단계 핵심 표현의 장부 상태(없으면 아직 못 만남). */
  expressionStates: Readonly<Record<string, "met" | "learned" | "mastered" | null>>;
  /** 그 단계 문법(번호)마다 최근 짚인 수. */
  grammarMistakes: ReadonlyMap<number, number>;
  /** 다음 단계까지 가장 모자란 갈래(stageParts weakest). */
  weakest?: "vocab" | "grammar" | "expression" | "pronunciation" | null;
};

const open = (state: PickInput["expressionStates"][string] | undefined) => state !== "learned" && state !== "mastered";

function scoreOf(script: StageScript, input: PickInput): { score: number; grammar: number[]; expressions: string[] } {
  const grammar = (script.grammar ?? []).filter((index) => (input.grammarMistakes.get(index) ?? 0) > 0)
    .sort((a, b) => (input.grammarMistakes.get(b) ?? 0) - (input.grammarMistakes.get(a) ?? 0));
  const expressions = script.expressions.filter((expression) => open(input.expressionStates[expression]));
  const passed = input.passed.has(script.id);
  let score = 0;
  score += grammar.reduce((sum, index) => sum + 3 * (input.grammarMistakes.get(index) ?? 0), 0);
  score += expressions.length * (input.weakest === "expression" ? 2 : 1);
  if (!passed) score += isSituationScript(script) ? 3 : 2;
  else score -= 4;
  score += Math.min(2, framesOfScript(script).filter((id) => input.passed.has(id)).length);
  return { score, grammar, expressions };
}

/** 이 단계에서 지금 할 대본 하나와 그 이유. 대본이 없으면 null. */
export function pickScript(input: PickInput): ScriptPick | null {
  const scripts = scriptsFor(input.language, input.stage);
  if (!scripts.length) return null;
  let best: { script: StageScript; score: number; grammar: number[]; expressions: string[] } | null = null;
  for (const script of scripts) {
    const scored = { script, ...scoreOf(script, input) };
    if (!best || scored.score > best.score) best = scored;
  }
  if (!best) return null;
  const why: ScriptWhy = best.grammar.length
    ? { kind: "grammar", items: best.grammar.slice(0, 2) }
    : best.expressions.length >= 2 || (best.expressions.length && input.weakest === "expression")
      ? { kind: "expression", items: best.expressions.slice(0, 3) }
      : { kind: "next" };
  return { id: best.script.id, why };
}
