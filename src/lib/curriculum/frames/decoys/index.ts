import { JA_DECOYS } from "./ja.ts";
import { ZH_DECOYS } from "./zh.ts";

/** 학습 언어별 문장구조 헷갈리는 오답(scripts/frame-decoys.ts write가 만든 파일들). */
export const DECOYS: Partial<Record<string, Record<string, string[]>>> = { ja: JA_DECOYS, zh: ZH_DECOYS };
