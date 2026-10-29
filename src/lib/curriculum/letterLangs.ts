/** 0단계(글자·소리)·읽는 법이 있는 학습 언어 — 글자가 라틴 문자가 아닌 것(2026-10-29). 순수(서버·화면 둘 다). */
export const LETTER_LANGS = ["ja", "ko", "zh", "th", "ar", "ru", "hi"] as const;

export function needsLetters(language: string): boolean {
  return (LETTER_LANGS as readonly string[]).includes(language);
}
