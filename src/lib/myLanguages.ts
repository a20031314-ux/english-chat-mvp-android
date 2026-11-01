/**
 * 내가 배우는 언어 목록(여러 개, 사용자 2026-11-02 "학습언어가 복수선택이 안돼").
 * 처음 설치에서 여러 개 고르고, 상단 국기 → 언어 설정에서 더하고 빼고, 그중 하나를 지금 배우는 언어로 누른다.
 * 지금 배우는 언어는 예전처럼 `appTargetLanguage` 하나 — 학습 기록은 원래 언어마다 따로라 목록은 고르기 화면에만 쓴다.
 * 이 폰에만(localStorage), 서버에는 없음.
 */
import { isLearningLanguageCode, type LearningLanguageCode } from "./learningLanguages.ts";

export const MY_LANGUAGES_KEY = "appLearningLanguages";

/** 저장된 목록 + 지금 언어(빠져 있으면 맨 앞에). 깨진 값·중복은 버린다. */
export function parseMyLanguages(raw: string | null, current: LearningLanguageCode): LearningLanguageCode[] {
  let list: unknown = [];
  try {
    list = raw ? JSON.parse(raw) : [];
  } catch {
    list = [];
  }
  const codes = (Array.isArray(list) ? list : []).filter(isLearningLanguageCode);
  const unique = [...new Set(codes)];
  return unique.includes(current) ? unique : [current, ...unique];
}

/** 목록에서 하나를 더하거나 뺀다. 지금 언어는 빼지 않는다(마지막 하나도). */
export function toggleMyLanguage(
  list: readonly LearningLanguageCode[],
  code: LearningLanguageCode,
  current: LearningLanguageCode,
): LearningLanguageCode[] {
  if (!list.includes(code)) return [...list, code];
  if (code === current || list.length <= 1) return [...list];
  return list.filter((item) => item !== code);
}

export function readMyLanguages(current: LearningLanguageCode): LearningLanguageCode[] {
  try {
    return parseMyLanguages(window.localStorage.getItem(MY_LANGUAGES_KEY), current);
  } catch {
    return [current];
  }
}

export function saveMyLanguages(list: readonly LearningLanguageCode[]): void {
  try {
    window.localStorage.setItem(MY_LANGUAGES_KEY, JSON.stringify(list));
  } catch {
    // 저장 못 해도 이번 실행 동안은 화면 상태로
  }
}
