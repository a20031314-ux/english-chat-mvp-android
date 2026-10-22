/**
 * 글자·소리 기초 고르기·진행(순수 함수). 데이터는 언어별 파일, 모양은 types.ts.
 */
import { AR_SCRIPT } from "./ar.ts";
import { EN_SCRIPT } from "./en.ts";
import { ES_SCRIPT } from "./es.ts";
import { FR_SCRIPT } from "./fr.ts";
import { HI_SCRIPT } from "./hi.ts";
import { ID_SCRIPT } from "./id.ts";
import { IT_SCRIPT } from "./it.ts";
import { JA_SCRIPT } from "./ja.ts";
import { KO_SCRIPT } from "./ko.ts";
import { PT_SCRIPT } from "./pt.ts";
import { RU_SCRIPT } from "./ru.ts";
import { TH_SCRIPT } from "./th.ts";
import { VI_SCRIPT } from "./vi.ts";
import { ZH_SCRIPT } from "./zh.ts";
import type { ScriptCourse } from "./types.ts";

export type { ScriptCourse, ScriptGroup, ScriptItem } from "./types.ts";

const COURSES: Record<string, ScriptCourse> = {
  ar: AR_SCRIPT, en: EN_SCRIPT, es: ES_SCRIPT, fr: FR_SCRIPT, hi: HI_SCRIPT, id: ID_SCRIPT, it: IT_SCRIPT,
  ja: JA_SCRIPT, ko: KO_SCRIPT, pt: PT_SCRIPT, ru: RU_SCRIPT, th: TH_SCRIPT, vi: VI_SCRIPT, zh: ZH_SCRIPT,
};

export function scriptFor(language: string): ScriptCourse | null {
  return COURSES[language] ?? null;
}

export type ScriptProgress = { done: number; total: number; next: string | null; finished: boolean };

/** 통과한 묶음으로 잰 진행. 다음 묶음은 데이터 순서에서 아직 안 한 첫 것. */
export function scriptProgress(course: ScriptCourse, passed: Record<string, number>): ScriptProgress {
  const done = course.groups.filter((group) => passed[group.id]).length;
  const next = course.groups.find((group) => !passed[group.id])?.id ?? null;
  return { done, total: course.groups.length, next, finished: done === course.groups.length };
}

/** 연습 통과 기준: 문제의 80% 이상. */
export const SCRIPT_PASS_SHARE = 0.8;
