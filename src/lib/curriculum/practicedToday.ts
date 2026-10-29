/**
 * 오늘 끝까지 해 본 대본·틀(통과 못 해도) — 이 폰에 날짜로(2026-10-29 가상 사용자 "15분 한 게 흔적 없이 사라졌다").
 * 오늘 할 것은 이걸로도 ✓(통과는 따로 서버). 다음 날이면 비움.
 */
import { localDay } from "./resume.ts";

const KEY = "dailyPlan.practiced.v1";
export const PRACTICED_EVENT = "lb-practiced";

export function readPracticed(language: string, now = new Date()): Set<string> {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) ?? "null") as { day?: string; ids?: Record<string, string[]> } | null;
    return new Set(raw?.day === localDay(now) ? (raw.ids?.[language] ?? []) : []);
  } catch {
    return new Set();
  }
}

export function markPracticed(language: string, id: string, now = new Date()): void {
  try {
    const day = localDay(now);
    const raw = JSON.parse(localStorage.getItem(KEY) ?? "null") as { day?: string; ids?: Record<string, string[]> } | null;
    const ids = raw?.day === day ? (raw.ids ?? {}) : {};
    if ((ids[language] ?? []).includes(id)) return;
    ids[language] = [...(ids[language] ?? []), id];
    localStorage.setItem(KEY, JSON.stringify({ day, ids }));
    window.dispatchEvent(new CustomEvent(PRACTICED_EVENT, { detail: { language } }));
  } catch {
    // 이 화면에서만.
  }
}
