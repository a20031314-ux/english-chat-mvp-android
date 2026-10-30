/**
 * 문장구조 헷갈리는 오답 중 **확실히 틀린 꼴**만(2026-10-30, 틀린 곳 찾아 고치기 — 사용자 "문장 내에서 틀린 부분을 맞추고 수정하는 식").
 * frames/decoys/의 오답에는 뜻만 다른 맞는 말(어디 → 언제)·맞는 변형(I'm ↔ I am)이 섞여 있어, 그 문장에 넣었을 때 선생님이 틀렸다고 고칠 것만 남겼다.
 * Claude가 오답마다 판단(원어민 확인 전), 맞춤법만 틀린 꼴은 뺌 — 고칠 땐 <언어>.json을 고치고 node scripts/plain-decoys.mjs.
 */
import { AR_PLAIN } from "./ar.ts";
import { EN_PLAIN } from "./en.ts";
import { ES_PLAIN } from "./es.ts";
import { FR_PLAIN } from "./fr.ts";
import { HI_PLAIN } from "./hi.ts";
import { ID_PLAIN } from "./id.ts";
import { IT_PLAIN } from "./it.ts";
import { JA_PLAIN } from "./ja.ts";
import { KO_PLAIN } from "./ko.ts";
import { PT_PLAIN } from "./pt.ts";
import { RU_PLAIN } from "./ru.ts";
import { TH_PLAIN } from "./th.ts";
import { VI_PLAIN } from "./vi.ts";
import { ZH_PLAIN } from "./zh.ts";

export const PLAIN_DECOYS: Partial<Record<string, Record<string, string[]>>> = { ar: AR_PLAIN, en: EN_PLAIN, es: ES_PLAIN, fr: FR_PLAIN, hi: HI_PLAIN, id: ID_PLAIN, it: IT_PLAIN, ja: JA_PLAIN, ko: KO_PLAIN, pt: PT_PLAIN, ru: RU_PLAIN, th: TH_PLAIN, vi: VI_PLAIN, zh: ZH_PLAIN };
