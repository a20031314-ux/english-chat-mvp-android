/**
 * Logbank 오늘 카드 → Quizbank 한 판(개편 3단계, curriculum/todayCards.ts). 같은 My 안이라 appIntents 대신 이 폰 안 신호 하나:
 * 카드를 누르면 열쇠를 맡기고(keys 없음 = 한 줄 그대로) My가 Quizbank 칸으로, Quizbank는 맡긴 열쇠부터 낸다.
 */
export const QUIZ_FOCUS_EVENT = "lb-quiz-focus";
export type QuizFocus = { language: string; keys: string[]; serial: number };

let pending: QuizFocus | null = null;
let serial = 0;

export function focusQuiz(language: string, keys: readonly string[]): void {
  serial += 1;
  pending = { language, keys: [...keys], serial };
  try {
    globalThis.dispatchEvent?.(new CustomEvent(QUIZ_FOCUS_EVENT, { detail: pending }));
  } catch {
    // 신호를 못 보내도 다음에 Quizbank가 열릴 때 takeQuizFocus로.
  }
}

/** 맡긴 열쇠를 한 번 가져간다(그 학습 언어 것만). */
export function takeQuizFocus(language: string): QuizFocus | null {
  if (!pending || pending.language !== language) return null;
  const taken = pending;
  pending = null;
  return taken;
}
