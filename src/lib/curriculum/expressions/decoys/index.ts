import { AR_EXPR_DECOYS } from "./ar.ts";
import { EN_EXPR_DECOYS } from "./en.ts";
import { ES_EXPR_DECOYS } from "./es.ts";
import { FR_EXPR_DECOYS } from "./fr.ts";
import { HI_EXPR_DECOYS } from "./hi.ts";
import { ID_EXPR_DECOYS } from "./id.ts";
import { IT_EXPR_DECOYS } from "./it.ts";
import { JA_EXPR_DECOYS } from "./ja.ts";
import { KO_EXPR_DECOYS } from "./ko.ts";
import { PT_EXPR_DECOYS } from "./pt.ts";
import { RU_EXPR_DECOYS } from "./ru.ts";
import { TH_EXPR_DECOYS } from "./th.ts";
import { VI_EXPR_DECOYS } from "./vi.ts";
import { ZH_EXPR_DECOYS } from "./zh.ts";

/** 학습 언어별 단계 핵심 표현 헷갈리는 오답(scripts/expr-decoys.ts write가 만든 파일들). */
export const EXPR_DECOYS: Partial<Record<string, Record<string, string[]>>> = { ar: AR_EXPR_DECOYS, en: EN_EXPR_DECOYS, es: ES_EXPR_DECOYS, fr: FR_EXPR_DECOYS, hi: HI_EXPR_DECOYS, id: ID_EXPR_DECOYS, it: IT_EXPR_DECOYS, ja: JA_EXPR_DECOYS, ko: KO_EXPR_DECOYS, pt: PT_EXPR_DECOYS, ru: RU_EXPR_DECOYS, th: TH_EXPR_DECOYS, vi: VI_EXPR_DECOYS, zh: ZH_EXPR_DECOYS };
