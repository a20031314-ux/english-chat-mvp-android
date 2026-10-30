import type { StageScript } from "../../stageScripts.ts";
import { EN_BANK } from "./en.ts";
import { ES_BANK } from "./es.ts";
import { VI_BANK } from "./vi.ts";
import { ZH_BANK } from "./zh.ts";

/** 학습 언어별 대본 은행(scripts/script-bank.ts write가 만든 파일들). */
export const BANKS: Partial<Record<string, StageScript[]>> = { en: EN_BANK, es: ES_BANK, vi: VI_BANK, zh: ZH_BANK };
