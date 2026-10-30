/**
 * 튜터가 쓰는 말 — 학습 언어만(기본) / 학습 언어 + 내 말(앱 언어)도 하는 원어민.
 *
 * 사용자 2026-10-30 "두 개 언어 가능한 튜터 컨셉 — 한국어 가능한 외국어 화자로", "통화와 채팅 둘 다, 옵션으로".
 * "both"면 튜터는 학습 언어로 이어 가되, 학습자가 앱 언어로 말하거나 막혔을 때 앱 언어로 한 문장까지 받아 주고
 * 필요한 학습 언어 표현을 건넨 뒤 바로 학습 언어로 돌아간다(서버 지시: chat route `bilingualBlock`, roleplay `director.ts`).
 * AI 대화 ⋮에서 고르고 이 기기에 기억 — 채팅과 통화가 같이 쓴다.
 */

export type TutorLanguage = "target" | "both";

export const TUTOR_LANGUAGE_KEY = "tutorLanguageMode";
export const DEFAULT_TUTOR_LANGUAGE: TutorLanguage = "target";

export function readTutorLanguage(): TutorLanguage {
  try {
    const value = globalThis.localStorage?.getItem(TUTOR_LANGUAGE_KEY);
    return value === "both" || value === "target" ? value : DEFAULT_TUTOR_LANGUAGE;
  } catch {
    return DEFAULT_TUTOR_LANGUAGE;
  }
}

export function writeTutorLanguage(mode: TutorLanguage): void {
  try {
    globalThis.localStorage?.setItem(TUTOR_LANGUAGE_KEY, mode);
  } catch {
    // 못 쓰면 이번만 그 방식으로.
  }
}

/** 이 조합에서 두 언어 튜터가 뜻이 있는가 — 학습 언어와 앱 언어가 같으면 섞을 말이 없다. */
export function bilingualPossible(targetLanguage: string, uiLanguage: string): boolean {
  return Boolean(targetLanguage) && Boolean(uiLanguage) && targetLanguage !== uiLanguage;
}

/** 요청에 실을 값: 켰고 뜻이 있을 때만 true. */
export function tutorIsBilingual(targetLanguage: string, uiLanguage: string): boolean {
  return bilingualPossible(targetLanguage, uiLanguage) && readTutorLanguage() === "both";
}
