import type { StageScript } from "../../stageScripts.ts";
import { AR_BANK } from "./ar.ts";
import { EN_BANK } from "./en.ts";
import { ES_BANK } from "./es.ts";
import { FR_BANK } from "./fr.ts";
import { HI_BANK } from "./hi.ts";
import { ID_BANK } from "./id.ts";
import { IT_BANK } from "./it.ts";
import { JA_BANK } from "./ja.ts";
import { KO_BANK } from "./ko.ts";
import { PT_BANK } from "./pt.ts";
import { TH_BANK } from "./th.ts";
import { VI_BANK } from "./vi.ts";
import { ZH_BANK } from "./zh.ts";

/** 학습 언어별 대본 은행(scripts/script-bank.ts write가 만든 파일들). */
export const BANKS: Partial<Record<string, StageScript[]>> = { ar: AR_BANK, en: EN_BANK, es: ES_BANK, fr: FR_BANK, hi: HI_BANK, id: ID_BANK, it: IT_BANK, ja: JA_BANK, ko: KO_BANK, pt: PT_BANK, th: TH_BANK, vi: VI_BANK, zh: ZH_BANK };
