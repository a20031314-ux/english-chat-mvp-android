/** 말 빠르기 값(서버·앱 같이 씀 — React 없이). 고르기·저장은 tutorSpeed.ts. */
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

