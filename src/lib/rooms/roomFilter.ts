/**
 * 방 목록을 언어 조합으로 거르기(로비의 "전체 / 배우는 언어 / 내 조합 / 언어로 찾기").
 * 순서는 보지 않는다 — "영어 ↔ 한국어"를 찾으면 "한국어 ↔ 영어" 방도 나온다.
 * 하나만 고르면 그 언어가 들어간 방 전부.
 *
 * 사람 목록의 언어 칩과 같은 뜻(2026-10-23, lib/rooms/langMatch.ts): `learn` = 내가 배우는 언어가 들어간 방,
 * `mine` = 배우는 언어 + 내 말(프로필 모국어, 없으면 앱 언어)이 둘 다 들어간 방.
 */

import { isLearningLanguageCode } from "../learningLanguages.ts";

export type RoomFilter = { kind: "all" } | { kind: "learn" } | { kind: "mine" } | { kind: "pick"; a: string | null; b: string | null };

export const ROOM_FILTER_STORAGE_KEY = "roomsFilter";

/** 거를 언어들(중복·모르는 코드 빼고 최대 둘). 빈 배열이면 거르지 않음. */
export function filterLanguages(filter: RoomFilter, targetLanguage: string, locale: string, native?: string | null): string[] {
  const picked =
    filter.kind === "learn"
      ? [targetLanguage]
      : filter.kind === "mine"
        ? [targetLanguage, myLanguage(locale, native)]
        : filter.kind === "pick"
          ? [filter.a, filter.b]
          : [];
  return cleanLanguages(picked);
}

/** "내 말": 프로필 모국어(앱 언어 목록에 있는 것), 없으면 앱 언어. 새 방의 언어 조합도 이걸 쓴다. */
export function myLanguage(locale: string, native?: string | null): string {
  return native && isLearningLanguageCode(native) ? native : locale;
}

export function cleanLanguages(values: unknown): string[] {
  if (!Array.isArray(values)) return [];
  const out: string[] = [];
  for (const value of values) {
    if (typeof value === "string" && isLearningLanguageCode(value) && !out.includes(value)) out.push(value);
  }
  return out.slice(0, 2);
}

/** 자유 대화방에서 한 사람이 말할 수 있는 언어 수(배우는 언어·앱 언어 + 프로필의 모국어·할 수 있는 언어). */
export const MAX_SPOKEN_LANGUAGES = 5;

/**
 * 받아쓰기에 알려 줄 "이 사람이 말하는 언어"(2026-10-23, 사용자 "프로필의 사용 언어를 참고"): 순서대로, 겹치지 않게, 최대 5.
 * 첫 언어가 방의 중심 언어(다시 받아쓸 때 쓰는 언어)라 배우는 언어를 맨 앞에 둔다.
 */
export function cleanSpokenLanguages(values: unknown, max = MAX_SPOKEN_LANGUAGES): string[] {
  if (!Array.isArray(values)) return [];
  const out: string[] = [];
  for (const value of values) {
    if (typeof value === "string" && isLearningLanguageCode(value) && !out.includes(value)) out.push(value);
  }
  return out.slice(0, max);
}

/** 자유 대화방(`free`)은 언어를 정하지 않아 어떤 언어로 찾든 함께 나온다. */
export function roomMatches(roomLanguages: readonly string[] | undefined, wanted: readonly string[], free = false): boolean {
  if (free) return true;
  return wanted.every((code) => (roomLanguages ?? []).includes(code));
}

export function parseRoomFilter(raw: string | null): RoomFilter {
  try {
    const value = raw ? (JSON.parse(raw) as RoomFilter) : null;
    if (value?.kind === "mine" || value?.kind === "learn") return { kind: value.kind };
    if (value?.kind === "pick") {
      const [a = null, b = null] = cleanLanguages([value.a, value.b]);
      return { kind: "pick", a, b };
    }
  } catch {
    // 깨진 값은 전체로.
  }
  return { kind: "all" };
}
