/**
 * AI 튜터 팔로우(사용자 2026-11-02 "튜터프로필도 아예 사람처럼 팔로우, 채팅걸기까지").
 *
 * 학습 언어마다 팔로우한 튜터(여자·남자, chatPartner.ts 표)를 이 기기에 기억한다(사람 팔로우처럼 계정 서버에 두지 않음 —
 * 기본 튜터는 모두에게 같은 사람이라 팔로워 수가 의미 없고, 서버 키를 늘리지 않으려고). 대화 탭에는 팔로우한 튜터마다
 * 대화 한 줄 + 지금 고른 튜터(늘 보임, 예전처럼 AI 대화 줄이 사라지지 않게) + 대화가 남은 튜터 — `tutorChatRows`.
 * 다음(사용자가 만든 튜터·공유)에서 팔로우가 계정으로 옮겨 갈 때 이 키를 서버로 한 번 올린다.
 */
import { useSyncExternalStore } from "react";
import { isTutorGender, type TutorGender } from "./chatPartner.ts";
import { getLearningLanguage } from "./learningLanguages.ts";

export const TUTOR_FOLLOWS_KEY = "tutorFollows.v1";

const listeners = new Set<() => void>();
let memory: Record<string, TutorGender[]> | null = null;

function readAll(): Record<string, TutorGender[]> {
  if (memory) return memory;
  try {
    const raw = globalThis.localStorage?.getItem(TUTOR_FOLLOWS_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : null;
    const out: Record<string, TutorGender[]> = {};
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      for (const [code, value] of Object.entries(parsed as Record<string, unknown>)) {
        if (Array.isArray(value)) out[code] = [...new Set(value.filter(isTutorGender))];
      }
    }
    memory = out;
  } catch {
    memory = {};
  }
  return memory;
}

const EMPTY: TutorGender[] = [];

export function followedTutors(language: string | null | undefined): TutorGender[] {
  return readAll()[getLearningLanguage(language).code] ?? EMPTY;
}

export function setTutorFollow(language: string | null | undefined, gender: TutorGender, follow: boolean): void {
  const code = getLearningLanguage(language).code;
  const all = { ...readAll() };
  const now = all[code] ?? [];
  const next = follow ? [...new Set([...now, gender])] : now.filter((value) => value !== gender);
  if (next.length) all[code] = next;
  else delete all[code];
  memory = all;
  try {
    globalThis.localStorage?.setItem(TUTOR_FOLLOWS_KEY, JSON.stringify(all));
  } catch {
    // 못 쓰면 이번 실행에만.
  }
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useFollowedTutors(language: string | null | undefined): TutorGender[] {
  return useSyncExternalStore(subscribe, () => followedTutors(language), () => EMPTY);
}

/**
 * 대화 탭의 AI 튜터 줄: 지금 고른 튜터 먼저, 그다음 팔로우한 튜터, 그다음 대화가 남아 있는 튜터(겹치면 한 번) —
 * 사람 대화처럼, 이야기한 상대는 팔로우하지 않아도 목록에서 사라지지 않는다.
 */
export function tutorChatRows(chosen: TutorGender, followed: readonly TutorGender[], talked: readonly TutorGender[] = []): TutorGender[] {
  return [...new Set([chosen, ...followed, ...talked])];
}
