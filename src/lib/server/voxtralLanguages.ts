/**
 * 튜터 목소리를 Voxtral로 읽는 학습 언어(사용자 2026-11-02 "인니어, 태국어 빼고 다 바꾸고").
 * id·th는 Voxtral이 공식으로 다루지 않는 언어라 지금 목소리(OpenAI Realtime) 그대로.
 */
export const VOXTRAL_LANGUAGES = ["en", "ko", "ja", "zh", "es", "fr", "it", "pt", "ru", "ar", "vi", "hi"] as const;

export function speaksWithVoxtral(language: string): boolean {
  return (VOXTRAL_LANGUAGES as readonly string[]).includes(language);
}
