/**
 * 학습자의 언어(2026-11-08 사용자 "프로필에 국가가 뜨는 거 아냐?" → "연결해줘"): 언어 조합 비중(languagePairs.ts)에 쓸 모국어·아는 언어.
 * 순서: 프로필 모국어 → 국적(한 말로 정해지는 나라만) → 앱 언어. 아는 언어 = 모국어 + 프로필 "할 수 있는 언어"(배우는 언어는 뺌).
 * 순수 — 화면은 이 폰에 남은 계정(readCachedAccount)의 facts를 넘긴다. 로그인 안 했거나 프로필이 비면 앱 언어.
 */
import type { ProfileFacts } from "../account/profileFacts.ts";
import { PROFILES } from "./languagePairs.ts";

/** 국적 → 말(그 나라 사람 대부분이 모국어로 쓰는 앱 언어가 하나일 때만). 여러 말을 쓰는 나라(CA·CH·BE·IN·MA 등)는 넣지 않는다. */
const COUNTRY_LANGUAGE: Record<string, string> = {
  KR: "ko", JP: "ja", CN: "zh", TW: "zh", TH: "th", VN: "vi", ID: "id",
  SA: "ar", EG: "ar", AE: "ar", JO: "ar", IQ: "ar", KW: "ar", QA: "ar", OM: "ar", BH: "ar", YE: "ar", SY: "ar", LB: "ar", LY: "ar", SD: "ar",
  RU: "ru", BY: "ru",
  ES: "es", MX: "es", AR: "es", CO: "es", PE: "es", CL: "es", VE: "es", EC: "es", GT: "es", CU: "es", BO: "es", DO: "es", HN: "es", PY: "es", SV: "es", NI: "es", CR: "es", UY: "es", PA: "es",
  FR: "fr", IT: "it", PT: "pt", BR: "pt", AO: "pt", MZ: "pt",
  US: "en", GB: "en", AU: "en", NZ: "en", IE: "en",
};

export type LearnerLanguages = { native: string; known: string[]; from: "native" | "country" | "app" };

export function learnerLanguages(facts: Pick<ProfileFacts, "native" | "country" | "speaks"> | null | undefined, uiLocale: string): LearnerLanguages {
  const usable = (code: string | null | undefined): code is string => Boolean(code && PROFILES[code]);
  const ui = uiLocale.split("-")[0]!.toLowerCase();
  const country = facts?.country ? COUNTRY_LANGUAGE[facts.country.toUpperCase()] : undefined;
  const [native, from] = usable(facts?.native) ? [facts!.native!, "native" as const] : usable(country) ? [country, "country" as const] : [ui, "app" as const];
  const known = [...new Set([native, ...(facts?.speaks ?? []).filter(usable)])];
  return { native, known, from };
}
