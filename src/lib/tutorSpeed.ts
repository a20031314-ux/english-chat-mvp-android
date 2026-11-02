/**
 * 튜터 말 빠르기 — 사용자가 고름(사용자 2026-11-02 "튜터 말속도를 그대로 돌려주고, 사용자가 조절가능하게").
 * AI 대화 ⋮ "말 빠르기"에서 고르고 이 기기에 하나만 기억(언어 상관없이). 통화·채팅·듣기 모두 `ttsPlayer`가 `speed`로 보내
 * 서버가 높이는 그대로 빠르기만 바꾸고(server/timeStretch.ts), 앱에 녹음된 줄은 재생 속도로(linePlayer).
 */
import { useSyncExternalStore } from "react";

export const TUTOR_SPEED_KEY = "tutorSpeed.v1";
export const TUTOR_SPEEDS = [0.8, 0.9, 1, 1.1, 1.2] as const;
export type TutorSpeed = (typeof TUTOR_SPEEDS)[number];

export function isTutorSpeed(value: unknown): value is TutorSpeed {
  return TUTOR_SPEEDS.includes(value as TutorSpeed);
}

/** 문자열(주소·저장 값)을 고를 수 있는 빠르기로. 아니면 1. */
export function parseTutorSpeed(raw: unknown): TutorSpeed {
  const value = typeof raw === "number" ? raw : Number(raw);
  return isTutorSpeed(value) ? value : 1;
}

const listeners = new Set<() => void>();
let chosenNow: TutorSpeed | null = null;

export function readTutorSpeed(): TutorSpeed {
  if (chosenNow !== null) return chosenNow;
  try {
    return parseTutorSpeed(globalThis.localStorage?.getItem(TUTOR_SPEED_KEY));
  } catch {
    return 1;
  }
}

export function writeTutorSpeed(speed: TutorSpeed): void {
  chosenNow = speed;
  try {
    globalThis.localStorage?.setItem(TUTOR_SPEED_KEY, String(speed));
  } catch {
    // 이번 실행에만.
  }
  for (const listener of listeners) listener();
}

export function useTutorSpeed(): TutorSpeed {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    readTutorSpeed,
    () => 1,
  );
}
