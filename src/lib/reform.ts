/**
 * Languagebank 개편 스위치(2026-11-06 사용자 "개편안 반영하고 내 폰에 먼저 설치" → "1단계 시작해줘").
 *
 * 개편 화면(My 칸 [Logbank · Quizbank · Languagebank], 사전 탭 …)은 이 스위치가 켜졌을 때만 보인다:
 * - 시험 앱 껍데기(운영 웹을 불러 쓰는 디버그 APK — lib/platform.ts isRemoteShell)에서는 켜짐,
 * - 그 밖(Play 앱·웹)은 꺼짐 — 2.80을 자를 때 모두에게 켠다(이 파일의 기본값을 바꿈).
 * - 브라우저 확인·되돌리기: localStorage `lbReform` = "1"(켬) / "0"(끔)이 위의 기본보다 앞선다.
 * 설계: hub/drafts/languagebank-2026-11-03.md · no-today-2026-11-05.md(B안) · 시안 https://claude.ai/artifact/Bzy6aC9rEvoonjYVTq4WtW
 */
import { isRemoteShell } from "./platform";

export const REFORM_KEY = "lbReform";

export function reformOn(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const forced = window.localStorage.getItem(REFORM_KEY);
    if (forced === "1") return true;
    if (forced === "0") return false;
  } catch {
    // 저장소를 못 읽으면 기본대로.
  }
  return isRemoteShell();
}
