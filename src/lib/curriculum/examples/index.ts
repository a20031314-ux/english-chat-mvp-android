/**
 * 여러 소재(문장구조·표현)가 같이 쓰던 예문을 소재마다 따로(2026-11-01 사용자 "요소가 3개라면 추가 문장은 2개") — 열쇠 → 새 예문(replaces = 이 열쇠에서 빼는 원래 문장).
 * quiz.ts baseSources가 그 열쇠의 원래 문장을 빼고 새 예문을 붙인다. 뜻풀이는 en·ko, 다른 앱 언어는 server/stageCopy.ts가 옮김.
 * 고칠 땐 <언어>.json → node scripts/extra-examples.mjs, 검사 node --experimental-strip-types scripts/shared-examples.ts check.
 */
export type { ExtraExample } from "./types.ts";
import type { ExtraExample } from "./types.ts";
import { AR_EXTRA } from "./ar.ts";
import { EN_EXTRA } from "./en.ts";
import { ES_EXTRA } from "./es.ts";
import { FR_EXTRA } from "./fr.ts";
import { HI_EXTRA } from "./hi.ts";
import { ID_EXTRA } from "./id.ts";
import { IT_EXTRA } from "./it.ts";
import { JA_EXTRA } from "./ja.ts";
import { KO_EXTRA } from "./ko.ts";
import { PT_EXTRA } from "./pt.ts";
import { RU_EXTRA } from "./ru.ts";
import { TH_EXTRA } from "./th.ts";
import { VI_EXTRA } from "./vi.ts";
import { ZH_EXTRA } from "./zh.ts";

export const EXTRA_EXAMPLES: Partial<Record<string, Record<string, ExtraExample[]>>> = { ar: AR_EXTRA, en: EN_EXTRA, es: ES_EXTRA, fr: FR_EXTRA, hi: HI_EXTRA, id: ID_EXTRA, it: IT_EXTRA, ja: JA_EXTRA, ko: KO_EXTRA, pt: PT_EXTRA, ru: RU_EXTRA, th: TH_EXTRA, vi: VI_EXTRA, zh: ZH_EXTRA };

/** 점검 스크립트가 새 예문을 넣기 전 상태를 셀 때만 언어를 넣는다. */
export const SHARED_EXAMPLES_OFF = new Set<string>();
