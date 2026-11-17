/**
 * 수업 통화가 튜터에게 넘기는 요즘 배운 것(사용자 2026-11-18 "배운 것을 반영하되 그냥 자유대화처럼"):
 * 이 폰 장부(logbank.v1)에서 최근 7일 퀴즈로 답한 낱말·표현 — 틀린 것 먼저, 그다음 최근 것. 학습 언어 그대로, 최대 여덟.
 * 튜터는 어울리는 화제로 몰고 자기가 써 보이기만 한다(director.ts recent). 순수.
 */
import type { LogEvent } from "../curriculum/logLedger.ts";
import { RECENT_MAX } from "./director.ts";

const WEEK_SECONDS = 7 * 24 * 60 * 60;

export function recentLearned(events: readonly LogEvent[], nowSeconds: number, max = RECENT_MAX): string[] {
  const missed = new Map<string, number>();
  const seen = new Map<string, number>();
  for (const event of events) {
    if (event.src !== "quiz" || nowSeconds - event.t > WEEK_SECONDS) continue;
    if (!event.k.startsWith("w|") && !event.k.startsWith("e|")) continue;
    seen.set(event.k, Math.max(seen.get(event.k) ?? 0, event.t));
    if (event.r === "miss") missed.set(event.k, Math.max(missed.get(event.k) ?? 0, event.t));
  }
  const byTime = (map: Map<string, number>) => [...map].sort((a, b) => b[1] - a[1]).map(([key]) => key);
  const keys = [...new Set([...byTime(missed), ...byTime(seen)])];
  return keys.slice(0, max).map((key) => key.slice(2));
}
