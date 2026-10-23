/**
 * 언어로 사람 거르기(사용자 결정 2026-10-23) — 사람 목록·게시판·Room 로비가 같은 칩을 쓴다.
 *
 * - `learn`  같은 언어를 배우는 사람: 상대가 배우는 언어에 *내가 지금 배우는 언어*가 있다(아랍어 커뮤니티식).
 * - `both`   배우는 언어·쓰는 말이 같은 사람: 위에 더해 상대가 쓰는 말(모국어 + 할 수 있는 언어)에
 *            *내 모국어*가 있다. 모국어를 안 정했으면 내가 쓰는 말 중 하나라도(일본어 배우는 한국인 커뮤니티식).
 * - `partners` 내 언어를 배우는 사람: 상대가 배우는 언어에 내가 쓰는 말이 있다(언어 교환 짝).
 *
 * 배우는 언어·쓰는 말은 프로필에 고른 것, 비어 있으면 그 사람이 마지막으로 앱에 둔 학습 언어·앱 언어
 * (account/profileFacts.ts `learnsOf`·`speaksOf`). 순수 — 서버와 앱이 같이 쓴다.
 */

export type LangMatch = "learn" | "both" | "partners";
export const LANG_MATCHES: LangMatch[] = ["learn", "both", "partners"];

export function isLangMatch(value: unknown): value is LangMatch {
  return typeof value === "string" && (LANG_MATCHES as string[]).includes(value);
}

export type LangSide = {
  /** 배우는 언어(프로필, 없으면 접속 기록). */
  learns: readonly string[];
  /** 쓰는 말(모국어 + 할 수 있는 언어, 없으면 앱 언어). */
  speaks: readonly string[];
};

export type MyLangs = LangSide & {
  /** 지금 앱에서 배우는 언어(상단바). */
  current: string;
  /** 내 모국어(정했으면). */
  native: string | null;
};

export function langMatches(match: LangMatch, them: LangSide, me: MyLangs): boolean {
  if (match === "partners") return them.learns.some((code) => me.speaks.includes(code));
  if (!them.learns.includes(me.current)) return false;
  if (match === "learn") return true;
  const mine = me.native ? [me.native] : me.speaks;
  return them.speaks.some((code) => mine.includes(code));
}
