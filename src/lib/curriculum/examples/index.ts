/**
 * 여러 소재(문장구조·표현)가 같이 쓰던 예문을 소재마다 따로(2026-11-01 사용자 "요소가 3개라면 추가 문장은 2개") — 열쇠 → 새 예문(replaces = 이 열쇠에서 빼는 원래 문장).
 * quiz.ts baseSources가 그 열쇠의 원래 문장을 빼고 새 예문을 붙인다. 뜻풀이는 en·ko, 다른 앱 언어는 server/stageCopy.ts가 옮김.
 * 고칠 땐 <언어>.json → node scripts/extra-examples.mjs, 검사 node --experimental-strip-types scripts/shared-examples.ts check.
 */
export type { ExtraExample } from "./types.ts";
import type { ExtraExample } from "./types.ts";


export const EXTRA_EXAMPLES: Partial<Record<string, Record<string, ExtraExample[]>>> = {  };

/** 점검 스크립트가 새 예문을 넣기 전 상태를 셀 때만 언어를 넣는다. */
export const SHARED_EXAMPLES_OFF = new Set<string>();
