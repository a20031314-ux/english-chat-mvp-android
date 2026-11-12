/**
 * 처음 체크 — Logbank 육각형의 시작 어림(curriculum/fill.ts CHECK_PRIOR, 2026-11-02).
 * 학습 언어마다 하나, 이 폰에만. 화면 버튼은 글자부터만 남음(2026-11-03). 없으면 육각형은 지금 단계에서 시작한다.
 * 예전에 고른 초급·중급·고급 값은 읽지 않는다(2026-11-07 없앰 — 지금 단계 어림으로).
 */
import { CHECKS, type Check } from "./fill.ts";

const KEY = "fillCheck.v1";
export const FILL_CHECK_EVENT = "lb-fillcheck";

export function saveFillCheck(language: string, check: Check): void {
  try {
    const all = JSON.parse(globalThis.localStorage?.getItem(KEY) ?? "{}") as Record<string, unknown>;
    globalThis.localStorage?.setItem(KEY, JSON.stringify({ ...all, [language]: check }));
    globalThis.dispatchEvent?.(new CustomEvent(FILL_CHECK_EVENT, { detail: { language } }));
  } catch {
    // 이번에만.
  }
}
