"use client";

/**
 * 단계대로 | 자유롭게(2026-10-29 사용자 "단계 없이 학습, 혹은 단계도 사용자가 임의로 정하게" → "둘 다 넣어줘").
 * 자유롭게 = 일일 학습이 1~5단계 전체에서 아직 안 한 것을 쉬운 것부터(가장 낮은 열린 단계), 단계 시험·단계 미리 확인·"다음 단계까지" 없음.
 * 통과·이미 앎은 단계와 상관없이 저장돼 모드를 바꿔도 이어진다. 학습 언어마다 이 폰에만.
 */
import { useEffect, useState } from "react";

export type StudyMode = "staged" | "free";
const KEY = "studyMode.v1";
const EVENT = "study-mode-changed";

export function readStudyMode(language: string): StudyMode {
  try {
    return localStorage.getItem(`${KEY}.${language}`) === "free" ? "free" : "staged";
  } catch {
    return "staged";
  }
}

export function saveStudyMode(language: string, mode: StudyMode): void {
  try {
    localStorage.setItem(`${KEY}.${language}`, mode);
  } catch {
    // 이번에만.
  }
  window.dispatchEvent(new CustomEvent(EVENT, { detail: { language, mode } }));
}

export function useStudyMode(language: string): [StudyMode, (mode: StudyMode) => void] {
  const [mode, setMode] = useState<StudyMode>("staged");
  useEffect(() => {
    const load = () => setMode(readStudyMode(language));
    load();
    window.addEventListener(EVENT, load);
    return () => window.removeEventListener(EVENT, load);
  }, [language]);
  return [mode, (next) => saveStudyMode(language, next)];
}

/** 자유롭게일 때 학습 기준 단계: 아직 다 안 한 가장 낮은 단계(없으면 지금 단계). */
export function frontierStage(rows: readonly { order: number; scripts?: { done: number; total: number } }[], current: number): number {
  const open = rows
    .filter((row) => row.scripts && row.scripts.done < row.scripts.total)
    .map((row) => row.order)
    .sort((a, b) => a - b)[0];
  return open ?? current;
}
