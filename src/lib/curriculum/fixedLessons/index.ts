/**
 * 저장소에 넣어 둔 고정 수업 원고(사람이 보고 고친 것) — 서버 저장보다 앞선다(server/fixedLesson.ts).
 * 새 원고 파일(<학습>.<앱>.json)을 넣으면 여기 FILES에 한 줄. 모양·검사는 check.ts.
 */
import enKo from "./en.ko.json";
import type { FixedLesson, FixedLessonFile } from "./check.ts";

const FILES: Record<string, FixedLessonFile> = {
  "en.ko": enKo as FixedLessonFile,
};

const index = new Map<string, FixedLesson>();
for (const [pair, file] of Object.entries(FILES)) for (const lesson of file.lessons) index.set(`${pair}:${lesson.id}`, lesson);

export function staticFixedLesson(language: string, ui: string, id: string): FixedLesson | null {
  return index.get(`${language}.${ui}:${id}`) ?? null;
}

/** 모델에게 보여 주는 완성 예시 하나(깊이·모양을 맞추게) — 영어 1단계 "I'm a ___."(관사·직업, 실수 이유가 분명한 것). */
export const FIXED_EXAMPLE: FixedLesson | null = index.get("en.ko:en-f1-03") ?? null;
