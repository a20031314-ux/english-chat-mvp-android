/**
 * 채팅에서 고친 문장을 어떻게 보일지 — 사용자가 고르고 기기에 기억(hub/DESIGN.md "보는 방식 고르기").
 *
 * - "tap"(기본): 고칠 곳이 있는 줄에 작은 칩만, 눌러야 원문 표시·고친 문장이 열린다. 위험한 줄은 열 때 확인 모델이 한 번 더 본다.
 * - "auto": 예전처럼 바로 보인다. 위험한 줄은 뒤에서 확인하고, 바뀌면 그 자리에서 고친다.
 * 결정: 사용자 2026-10-21(안 C, `hub/drafts/model-cascade-2026-10-21.md`).
 */

export type CorrectionView = "tap" | "auto";

export const CORRECTION_VIEW_KEY = "chatCorrectionViewMode";
export const DEFAULT_CORRECTION_VIEW: CorrectionView = "tap";

export function readCorrectionView(): CorrectionView {
  try {
    const value = globalThis.localStorage?.getItem(CORRECTION_VIEW_KEY);
    return value === "auto" || value === "tap" ? value : DEFAULT_CORRECTION_VIEW;
  } catch {
    return DEFAULT_CORRECTION_VIEW;
  }
}

export function writeCorrectionView(view: CorrectionView): void {
  try {
    globalThis.localStorage?.setItem(CORRECTION_VIEW_KEY, view);
  } catch {
    // 못 쓰면 이번만 그 보기로.
  }
}
