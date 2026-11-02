/**
 * 처음 체크(초급·중급·고급·글자부터) — Logbank 육각형의 시작 어림(curriculum/fill.ts CHECK_PRIOR, 2026-11-02).
 * 학습 언어마다 하나, 이 폰에만. 없으면 육각형은 지금 단계에서 시작한다.
 */
import { CHECKS, type Check } from "./fill.ts";

const KEY = "fillCheck.v1";
export const FILL_CHECK_EVENT = "lb-fillcheck";

export function readFillCheck(language: string): Check | null {
  try {
    const all = JSON.parse(globalThis.localStorage?.getItem(KEY) ?? "{}") as Record<string, unknown>;
    const one = all[language];
    return CHECKS.includes(one as Check) ? (one as Check) : null;
  } catch {
    return null;
  }
}

export function saveFillCheck(language: string, check: Check): void {
  try {
    const all = JSON.parse(globalThis.localStorage?.getItem(KEY) ?? "{}") as Record<string, unknown>;
    globalThis.localStorage?.setItem(KEY, JSON.stringify({ ...all, [language]: check }));
    globalThis.dispatchEvent?.(new CustomEvent(FILL_CHECK_EVENT, { detail: { language } }));
  } catch {
    // 이번에만.
  }
}
