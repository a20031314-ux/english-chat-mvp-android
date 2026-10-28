/**
 * 대본·문장구조 이어서 하기(2026-10-28 사용자 "학습하다 중단할 시 기록은 남는 거야?" → "이어서 하기 넣어줘").
 * 줄마다 맞힌 결과와 지금 줄을 이 폰에만, 오늘 날짜로 남긴다 — 다음 날이면 처음부터(어제 반쯤 한 것은 잊었을 테니).
 * 끝까지 하면(통과든 아니든) 지운다. 서버 기록은 그대로: 통과는 끝까지 했을 때만.
 */

const PREFIX = "scriptResume.v1";

export type ResumeState<R> = {
  day: string;
  index: number;
  results: Record<number, R>;
  revealed: Record<number, boolean>;
  /** 대본: 상대 줄마다 고른 말. */
  picks?: Record<number, number>;
  /** 문장구조: 고른 방식. */
  mode?: string;
};

export function resumeKey(kind: "script" | "frame" | "redo", language: string, id: string): string {
  return `${PREFIX}.${kind}.${language}.${id}`;
}

export function localDay(now = new Date()): string {
  return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
}

type Store = Pick<Storage, "getItem" | "setItem" | "removeItem">;

function storage(): Store | null {
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    return null;
  }
}

/** 오늘 남긴 것만(첫 줄도 못 넘겼으면 없음). */
export function readResume<R>(key: string, now = new Date(), store: Store | null = storage()): ResumeState<R> | null {
  try {
    const saved = JSON.parse(store?.getItem(key) ?? "null") as ResumeState<R> | null;
    if (!saved || saved.day !== localDay(now) || !(saved.index > 0)) return null;
    return saved;
  } catch {
    return null;
  }
}

export function saveResume<R>(key: string, state: Omit<ResumeState<R>, "day">, now = new Date(), store: Store | null = storage()): void {
  try {
    if (state.index > 0) store?.setItem(key, JSON.stringify({ ...state, day: localDay(now) }));
    else store?.removeItem(key);
  } catch {
    // 이 화면에서만.
  }
}

export function clearResume(key: string, store: Store | null = storage()): void {
  try {
    store?.removeItem(key);
  } catch {
    // 없으면 그만.
  }
}
