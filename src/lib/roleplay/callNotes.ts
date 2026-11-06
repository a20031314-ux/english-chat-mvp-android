/**
 * 통화 카드 한 장씩 오래 남기는 기록(2026-11-06 사용자 "카드마다 튜터가 요약을 적어서 기록").
 *
 * 통화 원문(`roleplayConversations`, saved.ts)은 최근 20통만 남아서 Logbank 날짜 칸에서도 빠졌다. 여기에는 문장 없이
 * 날짜·분·고친 수·💡·🔁·제목과, 통화가 끝날 때 튜터가 앱 언어로 적어 준 두세 문장(summary)만 남는다 —
 * 원문이 밀려나도 카드와 튜터 메모는 그날 칸에 계속 보인다. 학습 언어마다 따로, 이 폰에만.
 * 앱 언어를 바꿔도 이미 적힌 메모는 그때 언어로 남는다(다시 쓰지 않음).
 */
import type { TutorGender } from "../chatPartner.ts";

const KEY = "callNotes.v1";
/** 학습 언어마다 남기는 카드 수 상한(오래된 것부터 빠짐). */
export const CALL_NOTES_MAX = 500;
export const CALL_NOTES_EVENT = "call-notes";

export type CallNote = {
  id: string;
  /** 통화 시작 시각(ms). Logbank 날짜 칸. */
  at: number;
  secs: number;
  title: string;
  fixed: number;
  hints: number;
  redone: number;
  gender?: TutorGender;
  /** 튜터가 남긴 두세 문장(앱 언어). 받기 전이거나 못 받았으면 없음. */
  summary?: string;
};

type Store = { getItem(key: string): string | null; setItem(key: string, value: string): void };

function browserStore(): Store | null {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}

const keyOf = (language: string) => `${KEY}.${language}`;

function isNote(value: unknown): value is CallNote {
  if (typeof value !== "object" || value === null) return false;
  const note = value as Record<string, unknown>;
  return typeof note.id === "string" && typeof note.at === "number" && typeof note.secs === "number" && typeof note.title === "string";
}

export function readCallNotes(language: string, store: Store | null = browserStore()): CallNote[] {
  if (!store) return [];
  try {
    const parsed: unknown = JSON.parse(store.getItem(keyOf(language)) ?? "[]");
    return Array.isArray(parsed) ? parsed.filter(isNote) : [];
  } catch {
    return [];
  }
}

function write(language: string, notes: CallNote[], store: Store | null) {
  if (!store) return;
  const kept = [...notes].sort((a, b) => a.at - b.at).slice(-CALL_NOTES_MAX);
  try {
    store.setItem(keyOf(language), JSON.stringify(kept));
  } catch {
    // 가득 차면 이번 카드만 못 남긴다.
  }
  try {
    globalThis.dispatchEvent?.(new Event(CALL_NOTES_EVENT));
  } catch {
    // 테스트 등 창이 없을 때.
  }
}

/** 카드를 넣거나 고친다 — 이미 받은 튜터 메모는 새 값이 없으면 그대로 둔다. */
export function saveCallNote(language: string, note: CallNote, store: Store | null = browserStore()): void {
  const notes = readCallNotes(language, store);
  const old = notes.find((one) => one.id === note.id);
  const merged: CallNote = { ...old, ...note, ...(note.summary ? {} : old?.summary ? { summary: old.summary } : {}) };
  write(language, [...notes.filter((one) => one.id !== note.id), merged], store);
}

/** 통화가 끝난 뒤 받은 튜터 메모를 그 카드에. 카드가 없으면 아무것도 안 함. */
export function setCallSummary(language: string, id: string, summary: string, store: Store | null = browserStore()): void {
  const text = summary.trim();
  if (!text) return;
  const notes = readCallNotes(language, store);
  if (!notes.some((one) => one.id === id)) return;
  write(language, notes.map((one) => (one.id === id ? { ...one, summary: text } : one)), store);
}

/** Logbank에서 통화를 지울 때 카드도. */
export function removeCallNote(language: string, id: string, store: Store | null = browserStore()): void {
  const notes = readCallNotes(language, store);
  if (!notes.some((one) => one.id === id)) return;
  write(language, notes.filter((one) => one.id !== id), store);
}
