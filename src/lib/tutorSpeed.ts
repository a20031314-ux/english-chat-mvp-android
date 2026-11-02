/**
 * 튜터 말 빠르기 — 사용자가 고름(사용자 2026-11-02 "튜터 말속도를 그대로 돌려주고, 사용자가 조절가능하게").
 * AI 대화 ⋮ "말 빠르기"에서 고르고 이 기기에 하나만 기억(언어 상관없이). 통화·채팅·듣기 모두 `ttsPlayer`가 `speed`로 보내
 * 서버가 높이는 그대로 빠르기만 바꾸고(server/timeStretch.ts), 앱에 녹음된 줄은 재생 속도로(linePlayer).
 */
import { useSyncExternalStore } from "react";
import { parseTutorSpeed, type TutorSpeed } from "./tutorSpeedValue";
export { TUTOR_SPEEDS, isTutorSpeed, parseTutorSpeed, type TutorSpeed } from "./tutorSpeedValue";

export const TUTOR_SPEED_KEY = "tutorSpeed.v1";

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
