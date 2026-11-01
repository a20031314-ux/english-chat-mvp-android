/**
 * 문장 → Stagebank 소재 열쇠(2026-11-01 사용자 "통화 결과창에서 단계 학습으로 이어지는 창구를 구체화 — 그 문장을 문제 소재로, 그 문장을 두고 설명").
 * 통화 정리·Logbank·🔎 My에서 찾기가 같이 쓴다. 그 문장(scene)은 수업 맨 위 "통화에서" 카드와 정기 시험의 첫 재료가 된다 — 이 폰에만.
 */
import { allFramesFor } from "./frames.ts";
import { pieceOf } from "./quiz.ts";
import { ladderFor } from "./stages/index.ts";
import { grammarNodeId } from "../notes/notebook.ts";

/** 통화에서 나온 한 장면: 고친 문장(학습 언어) · 내가 처음 한 말 · 바로 앞 튜터 줄 · 앱 언어 뜻(있으면). */
export type LessonScene = { line: string; said?: string; before?: string; meaning?: string };

/** 노트 문법 칸 id → g|단계:번호. */
export function grammarKeyOfNode(language: string, node: string | null | undefined): string | null {
  if (!node) return null;
  for (const stage of ladderFor(language)?.stages ?? []) {
    const index = stage.grammar.findIndex((grammar) => grammarNodeId(stage.order, grammar) === node);
    if (index >= 0) return `g|${stage.order}:${index}`;
  }
  return null;
}

/** 글이 단계 핵심 표현 그 자체면 e|표현. */
export function expressionKeyOf(language: string, text: string): string | null {
  const plain = text.toLocaleLowerCase().replace(/[\p{P}]+/gu, " ").trim();
  for (const stage of ladderFor(language)?.stages ?? []) for (const expression of stage.expressions) if (expression.toLocaleLowerCase() === plain) return `e|${expression}`;
  return null;
}

/** 문장에 든 단계 핵심 표현(따로 선 낱말로만) — n개까지. */
export function expressionKeysIn(language: string, line: string, n = 3): string[] {
  const out: string[] = [];
  for (const stage of ladderFor(language)?.stages ?? []) for (const expression of stage.expressions) if (out.length < n && pieceOf(line, expression)) out.push(`e|${expression}`);
  return out;
}

/** 열쇠가 그 문장에서 칠할 조각(문장구조 조각·표현) — 없으면 null. */
export function pieceIn(language: string, key: string, line: string): string | null {
  if (key.startsWith("e|")) return pieceOf(line, key.slice(2));
  if (key.startsWith("f|")) return allFramesFor(language).find((frame) => frame.id === key.slice(2))?.core.find((core) => core && line.includes(core)) ?? null;
  return null;
}
