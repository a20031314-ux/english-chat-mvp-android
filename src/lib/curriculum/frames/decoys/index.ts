import { AR_DECOYS } from "./ar.ts";
import { EN_DECOYS } from "./en.ts";
import { ES_DECOYS } from "./es.ts";
import { FR_DECOYS } from "./fr.ts";
import { HI_DECOYS } from "./hi.ts";
import { IT_DECOYS } from "./it.ts";
import { JA_DECOYS } from "./ja.ts";
import { KO_DECOYS } from "./ko.ts";
import { PT_DECOYS } from "./pt.ts";
import { RU_DECOYS } from "./ru.ts";
import { TH_DECOYS } from "./th.ts";
import { VI_DECOYS } from "./vi.ts";
import { ZH_DECOYS } from "./zh.ts";

/** 학습 언어별 문장구조 헷갈리는 오답(scripts/frame-decoys.ts write가 만든 파일들). */
export const DECOYS: Partial<Record<string, Record<string, string[]>>> = { ar: AR_DECOYS, en: EN_DECOYS, es: ES_DECOYS, fr: FR_DECOYS, hi: HI_DECOYS, it: IT_DECOYS, ja: JA_DECOYS, ko: KO_DECOYS, pt: PT_DECOYS, ru: RU_DECOYS, th: TH_DECOYS, vi: VI_DECOYS, zh: ZH_DECOYS };
