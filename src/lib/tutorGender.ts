/**
 * 튜터 목소리 고르기 — 언어마다 여자·남자 한 사람(이름·목소리, `chatPartner.ts` 표).
 *
 * 사용자 2026-11-01 "음성을 언어별로 남, 녀 나눌 수 있을까" → A(사용자가 고름). AI 대화 ⋮ "튜터 목소리"에서 고르고
 * 이 기기에 학습 언어별로 기억한다. 채팅(이름·답의 말투·듣기), 통화(얼굴 옆 이름·목소리·말투), 목소리를 따로 정하지 않은
 * 모든 듣기(문장분석·단어 등 — `ttsPlayer`가 `tutor`로 보냄)가 같은 값을 읽는다. 고르지 않으면 그 언어의 예전 튜터.
 */
import { useSyncExternalStore } from "react";
import { defaultTutorGender, isTutorGender, type TutorGender } from "./chatPartner";
import { getLearningLanguage } from "./learningLanguages";

export const TUTOR_GENDER_KEY = "tutorGender.v1";

const listeners = new Set<() => void>();

function readAll(): Record<string, TutorGender> {
  try {
    const raw = globalThis.localStorage?.getItem(TUTOR_GENDER_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : null;
    if (!parsed || typeof parsed !== "object") return {};
    return Object.fromEntries(Object.entries(parsed as Record<string, unknown>).filter(([, value]) => isTutorGender(value))) as Record<string, TutorGender>;
  } catch {
    return {};
  }
}

/** 이번 실행에서 고른 것(저장이 안 되는 기기에서도 이번에는 따라가게). */
const chosenNow: Record<string, TutorGender> = {};

export function readTutorGender(language: string | null | undefined): TutorGender {
  const code = getLearningLanguage(language).code;
  return chosenNow[code] ?? readAll()[code] ?? defaultTutorGender(code);
}

export function writeTutorGender(language: string | null | undefined, gender: TutorGender): void {
  const code = getLearningLanguage(language).code;
  chosenNow[code] = gender;
  try {
    globalThis.localStorage?.setItem(TUTOR_GENDER_KEY, JSON.stringify({ ...readAll(), [code]: gender }));
  } catch {
    // 못 쓰면 이번 실행에만.
  }
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** 화면용: 고르면 이름·목소리가 바로 바뀐다. 서버 그림(SSR)에서는 그 언어의 예전 튜터. */
export function useTutorGender(language: string | null | undefined): TutorGender {
  return useSyncExternalStore(
    subscribe,
    () => readTutorGender(language),
    () => defaultTutorGender(language),
  );
}
