/**
 * 대본으로 익힌 양(2026-10-28 사용자 "대본을 다 학습했을 때의 학습량을 정량적으로든 시각적으로든" → 숫자 한 줄 + 할 수 있는 일).
 *
 * 통과한 대본·틀 id(/api/notebook parts[].scripts.passed)만으로 센다 — 모델을 부르지 않는다.
 * - 표현: 통과한 대본·틀의 핵심 표현 / 1~5단계 핵심 표현 전부
 * - 문법: 통과한 대본의 grammar·earlierGrammar, 통과한 틀의 grammar / 1~5단계 문법 전부
 * - 틀: 통과한 틀 / 그 언어 틀 전부
 * - 말한 문장: 통과한 대본의 내 줄 수
 * - 할 수 있는 일: 그 언어 틀이 있는 공통 기능(functions.ts)마다, 그 기능의 틀을 하나라도 통과했으면 켜짐.
 */
import { allFramesFor } from "./frames.ts";
import { FUNCTIONS, type LanguageFunction } from "./functions.ts";
import { allScriptsFor } from "./stageScripts.ts";
import { ladderFor } from "./stages/index.ts";

export type Count = { done: number; total: number };
export type CanDo = { fn: LanguageFunction; done: boolean; frames: string[] };
export type ScriptAmount = {
  expressions: Count;
  grammar: Count;
  frames: Count;
  lines: number;
  canDo: CanDo[];
};

/** skipped = 시험으로 걸러진(이미 아는) 대본·틀(curriculum/known.ts) — 표현·문법·틀에는 넣고 말한 문장에는 안 넣음. */
export function scriptAmount(language: string, passed: ReadonlySet<string>, skipped: ReadonlySet<string> = new Set()): ScriptAmount | null {
  const ladder = ladderFor(language);
  const scripts = allScriptsFor(language);
  if (!ladder || !scripts.length) return null;
  const frames = allFramesFor(language);

  const allExpressions = new Set(ladder.stages.flatMap((stage) => stage.expressions));
  const allGrammar = new Set(ladder.stages.flatMap((stage) => stage.grammar.map((_, index) => `${stage.order}:${index}`)));
  const expressions = new Set<string>();
  const grammar = new Set<string>();
  let lines = 0;
  for (const script of scripts) {
    if (!passed.has(script.id) && !skipped.has(script.id)) continue;
    for (const expression of script.expressions) expressions.add(expression);
    for (const index of script.grammar ?? []) grammar.add(`${script.stage}:${index}`);
    for (const key of script.earlierGrammar ?? []) grammar.add(key);
    if (passed.has(script.id)) lines += script.lines.filter((line) => line.who === "me").length;
  }
  const passedFrames = frames.filter((frame) => passed.has(frame.id) || skipped.has(frame.id));
  for (const frame of passedFrames) {
    for (const expression of frame.expressions ?? []) expressions.add(expression);
    for (const index of frame.grammar ?? []) grammar.add(`${frame.stage}:${index}`);
  }

  const framesByFn = new Map<string, string[]>();
  for (const frame of frames) if (frame.fn) framesByFn.set(frame.fn, [...(framesByFn.get(frame.fn) ?? []), frame.id]);
  const canDo = FUNCTIONS.filter((fn) => framesByFn.has(fn.id)).map((fn) => {
    const ids = framesByFn.get(fn.id)!;
    return { fn, done: ids.some((id) => passed.has(id)), frames: ids };
  });

  const inside = (set: Set<string>, all: Set<string>) => [...set].filter((key) => all.has(key)).length;
  return {
    expressions: { done: inside(expressions, allExpressions), total: allExpressions.size },
    grammar: { done: inside(grammar, allGrammar), total: allGrammar.size },
    frames: { done: passedFrames.length, total: frames.length },
    lines,
    canDo,
  };
}
