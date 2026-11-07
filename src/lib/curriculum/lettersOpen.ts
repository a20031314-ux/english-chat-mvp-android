/**
 * Languagebank의 글자·소리 칸 열기(개편, 2026-11-07 사용자 "0단계 버그부터 고쳐줘. 이것도 사전 중 하나로 편입"):
 * 오늘 카드·통화 끝 숙제가 글자 칸을 열 때 — My는 Languagebank 칸으로, Languagebank는 글자 칸으로. 같은 My 안이라 이 폰 안 신호 하나.
 */
export const LETTERS_OPEN_EVENT = "lb-letters-open";

let pending: { language: string; at: number } | null = null;

export function openLettersBank(language: string): void {
  pending = { language, at: Date.now() };
  try {
    globalThis.dispatchEvent?.(new CustomEvent(LETTERS_OPEN_EVENT, { detail: { language } }));
  } catch {
    // 신호를 못 보내도 Languagebank가 그려질 때 takeLettersOpen으로.
  }
}

/** 맡긴 열기를 한 번 가져간다(그 학습 언어 것만, 1분 안). */
export function takeLettersOpen(language: string): boolean {
  if (!pending || pending.language !== language || Date.now() - pending.at > 60_000) return false;
  pending = null;
  return true;
}
