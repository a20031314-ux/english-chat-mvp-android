/**
 * 처음 설치: 배울 언어 하나만 고른다(사용자 2026-10-31 "앱 언어는 고를 필요 없고 배울 언어만, 국기를 누르면 그 언어로").
 * 앱 언어는 묻지 않고 기기 언어(14개 중, 없으면 영어)로 시작한다. 바꾸기는 상단 국기 → 언어 설정에서만.
 *
 * 처음 설치인지는 화면이 그려지기 전, 이 모듈을 처음 읽을 때 한 번 본다 — 학습 언어 맥락(LearningLanguageProvider)과
 * 새로워진 점 시트가 그 뒤에 저장소에 값을 적기 때문(features.ts looksLikeFreshInstall과 같은 이유).
 */
import { APP_TARGET_LANGUAGE_STORAGE_KEY } from "./learningLanguages.ts";
import { USE_SIGNAL_KEYS, WHATS_NEW_SEEN_KEY } from "./whatsNew.ts";

const UI_LOCALE_KEY = "appUiLocale";

/** 학습 언어를 고른 적이 없고 앱을 쓴 흔적도 없을 때만 — 기존 사용자에게는 띄우지 않는다. */
export function needsLanguagePick(storage: Pick<Storage, "getItem">): boolean {
  if (storage.getItem(APP_TARGET_LANGUAGE_STORAGE_KEY) !== null) return false;
  if (storage.getItem(UI_LOCALE_KEY) !== null) return false;
  if (storage.getItem(WHATS_NEW_SEEN_KEY) !== null) return false;
  return !USE_SIGNAL_KEYS.some((key) => storage.getItem(key) !== null);
}

/** 기기 언어 목록(navigator.languages)에서 앱 언어 하나. "pt-BR" → pt, "zh-Hant-TW" → zh, 없으면 영어. */
export function deviceUiLocale<L extends string>(tags: readonly string[], isLocale: (value: string) => value is L, fallback: L): L {
  for (const tag of tags) {
    const base = tag.toLowerCase().split(/[-_]/)[0] ?? "";
    if (isLocale(base)) return base;
  }
  return fallback;
}

let pending = false;
try {
  pending = typeof window !== "undefined" && needsLanguagePick(window.localStorage);
} catch {
  pending = false;
}

const listeners = new Set<() => void>();

/** 처음 고르기 화면을 띄울지(이번 실행 동안). */
export function languagePickPending(): boolean {
  return pending;
}

export function markLanguagePicked(): void {
  if (!pending) return;
  pending = false;
  for (const listener of listeners) listener();
}

export function subscribeLanguagePick(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
