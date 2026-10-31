/**
 * 빈도 낱말(w|) 빈칸의 헷갈리는 오답 — 그 낱말의 흔한 실수 꼴(활용·성수·격·닮은 철자, 2026-11-01).
 * 처음엔 비어 있고, 가상 사용자 점검의 "오답이 한눈에 지워짐"(/mark easy-decoy) 표시를 고치는 쪽이 채운다(scripts/ux-check/FIX.md).
 * 키: 학습 언어 → 문장 속 조각(소문자) → 오답. 맞는 대안(축약·동의어)은 넣지 않는다(RULES 11 ②).
 * 퀴즈는 이 표를 문장구조·표현의 오답처럼 먼저 쓰고, 없으면 같은 품사 낱말(quiz.ts decoys).
 */
export const WORD_DECOYS: Record<string, Record<string, string[]>> = {};

export function wordNearMisses(language: string, piece: string): string[] {
  return WORD_DECOYS[language]?.[piece.toLocaleLowerCase()] ?? [];
}
