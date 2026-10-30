/**
 * 배울 수 있는 것(2026-10-31 사용자 "My 탭에서 총체적으로 학습 가능한 분량 — 문법은 어느 범위까지, 단어 n개 … 은행이 추가될 때마다 업데이트,
 * 여기서 이 정도 분량의 학습이 가능하다 — 학습 유인, 마케팅에도"). 학습 언어 하나의 1~5단계 재료를 센다 — 진척이 아니라 범위(내가 한 것은 안 셈).
 *
 * - 문법 = 단계 문법 칸(stages/*.ts grammar), 표현 = 단계 핵심 표현(겹치면 한 번), 문장구조 = 틀(frames/), 상황 = 단계 대본 + 은행 장면.
 * - 낱말 = 빈도 목록 + 사용자들이 찾아서 더한 낱말 — 단계마다 수는 부르는 쪽이 준다(useWordBank wordsByStage, 6 = 5단계 밖 확장).
 * 순수: 화면(studyMap/ContentScope)과 홍보용 표(scripts/content-scope.ts → hub/CONTENT.md)가 같이 쓴다.
 */
import { allFramesFor } from "./frames.ts";
import { ladderFor } from "./stages/index.ts";
import { bankScriptsFor, scriptsFor } from "./stageScripts.ts";

export type StageScope = { stage: number; grammar: number; expressions: number; frames: number; scenes: number; words: number };
export type ContentScope = { stages: StageScope[]; total: Omit<StageScope, "stage"> };

export const SCOPE_STAGES = 5;

export function contentScope(language: string, wordsByStage: Readonly<Record<number, number>> | null = null): ContentScope {
  const ladder = ladderFor(language)?.stages ?? [];
  const frames = allFramesFor(language);
  const seen = new Set<string>();
  const stages: StageScope[] = [];
  for (let stage = 1; stage <= SCOPE_STAGES; stage += 1) {
    const row = ladder.find((one) => Number(one.id.split("-").pop()) === stage);
    const expressions = [...new Set(row?.expressions ?? [])].filter((one) => !seen.has(one));
    for (const one of expressions) seen.add(one);
    stages.push({
      stage,
      grammar: row?.grammar.length ?? 0,
      expressions: expressions.length,
      frames: frames.filter((frame) => frame.stage === stage).length,
      scenes: scriptsFor(language, stage).length + bankScriptsFor(language, stage).length,
      words: wordsByStage?.[stage] ?? 0,
    });
  }
  const sum = (key: keyof Omit<StageScope, "stage">) => stages.reduce((total, row) => total + row[key], 0);
  return {
    stages,
    total: { grammar: sum("grammar"), expressions: sum("expressions"), frames: sum("frames"), scenes: sum("scenes"), words: sum("words") + (wordsByStage?.[6] ?? 0) },
  };
}
