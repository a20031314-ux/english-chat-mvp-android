/**
 * 문장분석 시트 "My에서 찾기" → My "단계" 보기로 넘기는 한 건(2026-10-24).
 * My 탭은 보일 때만 그려지고 노트 틀은 서버 답을 받은 뒤 그려져서, 앱 신호(appIntents, 5초)보다 길게 쥐고 있는다.
 * 노트 틀(NotebookSection)이 꺼내 그 단계·칸을 열고 "이 장면 넣기"를 보인다.
 */
import type { FixWhere } from "./notebook.ts";

export type LocateHandoff = {
  language: string;
  /** 고른 부분. */
  text: string;
  /** 그 문장(사람끼리 대화면 빈 칸). */
  sentence: string;
  node: string | null;
  stage?: number;
  /** 앱 언어 한 줄 설명. */
  note: string;
  where: FixWhere;
  /** 그 순간 화면(JPEG data URL) — AI 대화·통화·영상만. */
  shot: string | null;
  at: number;
};

const KEEP_MS = 60_000;
let pending: LocateHandoff | null = null;
const listeners = new Set<() => void>();

export function handOffLocate(next: Omit<LocateHandoff, "at">): void {
  pending = { ...next, at: Date.now() };
  try {
    // My 자라는 중이 "단계" 보기로 열리게(GrowthNetwork가 읽음).
    localStorage.setItem("myViewMode", "map");
  } catch {
    // 이번만 다른 보기로 열려도 노트 틀이 마운트되면 꺼낸다.
  }
  listeners.forEach((listener) => listener());
}

/** 그 언어의 넘긴 것(꺼내면 지움). */
export function takeLocate(language: string): LocateHandoff | null {
  if (!pending || pending.language !== language || Date.now() - pending.at > KEEP_MS) return null;
  const out = pending;
  pending = null;
  return out;
}

export function onLocate(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
