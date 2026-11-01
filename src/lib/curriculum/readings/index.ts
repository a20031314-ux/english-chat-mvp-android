/**
 * 한자가 든 빈칸 답의 읽기(2026-11-01 사용자 "중국어·일본어 쓰기 칸은 입력으로"): 중국어는 병음, 일본어는 히라가나.
 * 조각·표현은 만든 표(ja.ts·zh.ts — pinyin-pro·kuromoji), 낱말은 빈도 목록의 읽기(registerReadings로 앱이 넣음).
 */
import { JA_READINGS } from "./ja.ts";
import { ZH_READINGS } from "./zh.ts";

const TABLES: Record<string, Map<string, string>> = { ja: new Map(Object.entries(JA_READINGS)), zh: new Map(Object.entries(ZH_READINGS)) };

export function readingOf(language: string, piece: string): string | null {
  return TABLES[language]?.get(piece) ?? null;
}

/** 낱말 카드·빈도 목록의 읽기를 더한다(쓴 꼴 → 읽기). */
export function registerReadings(language: string, entries: Iterable<readonly [string, string]>): void {
  const table = (TABLES[language] ??= new Map());
  for (const [piece, reading] of entries) if (piece && reading && !table.has(piece)) table.set(piece, reading);
}

/** 병음 비교용: 성조 부호·숫자·띄어쓰기·대소문자 없이, ü = v = u. */
export function plainPinyin(text: string): string {
  return text
    .normalize("NFD")
    .replace(/̈/g, "v")
    .replace(/\p{M}+/gu, "")
    .toLocaleLowerCase()
    .replace(/ü/g, "v")
    .replace(/[\d\s'’·\p{P}]+/gu, "")
    .replace(/v/g, "u");
}
