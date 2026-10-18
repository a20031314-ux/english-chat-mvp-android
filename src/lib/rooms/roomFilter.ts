/**
 * 방 목록을 언어 조합으로 거르기(로비의 "전체 / 내 조합 / 언어로 찾기").
 * 순서는 보지 않는다 — "영어 ↔ 한국어"를 찾으면 "한국어 ↔ 영어" 방도 나온다.
 * 하나만 고르면 그 언어가 들어간 방 전부.
 */

import { isLearningLanguageCode } from "../learningLanguages.ts";

export type RoomFilter = { kind: "all" } | { kind: "mine" } | { kind: "pick"; a: string | null; b: string | null };

export const ROOM_FILTER_STORAGE_KEY = "roomsFilter";

/** 거를 언어들(중복·모르는 코드 빼고 최대 둘). 빈 배열이면 거르지 않음. */
export function filterLanguages(filter: RoomFilter, targetLanguage: string, locale: string): string[] {
  const picked = filter.kind === "mine" ? [targetLanguage, locale] : filter.kind === "pick" ? [filter.a, filter.b] : [];
  return cleanLanguages(picked);
}

export function cleanLanguages(values: unknown): string[] {
  if (!Array.isArray(values)) return [];
  const out: string[] = [];
  for (const value of values) {
    if (typeof value === "string" && isLearningLanguageCode(value) && !out.includes(value)) out.push(value);
  }
  return out.slice(0, 2);
}

export function roomMatches(roomLanguages: readonly string[] | undefined, wanted: readonly string[]): boolean {
  return wanted.every((code) => (roomLanguages ?? []).includes(code));
}

export function parseRoomFilter(raw: string | null): RoomFilter {
  try {
    const value = raw ? (JSON.parse(raw) as RoomFilter) : null;
    if (value?.kind === "mine") return value;
    if (value?.kind === "pick") {
      const [a = null, b = null] = cleanLanguages([value.a, value.b]);
      return { kind: "pick", a, b };
    }
  } catch {
    // 깨진 값은 전체로.
  }
  return { kind: "all" };
}
