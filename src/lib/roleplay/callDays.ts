/**
 * 통화마다 숫자 한 줄(2026-11-02 사용자 "월별·주별로 얼마나, 뭘 학습했는지" — Logbank 주·월 정리).
 * 통화 기록(callStore)은 최근 20개만 남아 한 달·일 년 합계를 낼 수 없어, 통화가 저장될 때마다 그 통화의 날·길이·고친 수·다시 말해 맞힌 수만
 * 이 폰에 따로 남긴다(언어마다, 최근 1년). 문장은 없다 — 숫자만. 같은 통화를 다시 저장하면(이어서 하기) 그 줄을 덮어쓴다.
 */
import { tallyCall } from "./transcriptMarks.ts";
import type { SavedConversation } from "./saved.ts";

const KEY = "callDays.v1";
const KEEP_DAYS = 366;
export const CALL_DAYS_EVENT = "lb-calldays";

export type CallDay = { day: string; at: number; seconds: number; fixed: number; redone: number };
export type CallDays = Record<string, CallDay>;

function localDay(at: number): string {
  const d = new Date(at);
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

export function readCallDays(language: string): CallDays {
  try {
    const raw = JSON.parse(globalThis.localStorage?.getItem(`${KEY}.${language}`) ?? "null") as CallDays | null;
    return raw && typeof raw === "object" ? raw : {};
  } catch {
    return {};
  }
}

/** 통화 하나의 숫자 줄(순수). 내가 한 말이 없는 통화는 없음. */
export function callDayOf(call: Pick<SavedConversation, "said" | "startedAt" | "updatedAt" | "finishedAt">): CallDay | null {
  if (!call.said.some((line) => line.who === "learner")) return null;
  const tally = tallyCall(call.said);
  const end = call.finishedAt ?? call.updatedAt;
  return { day: localDay(call.startedAt), at: call.startedAt, seconds: Math.max(0, Math.round((end - call.startedAt) / 1000)), fixed: tally.fixed, redone: tally.redone };
}

/** 넣고 1년 넘은 것을 뺀다(순수). */
export function withCallDay(days: CallDays, id: string, row: CallDay, now = Date.now()): CallDays {
  const since = now - KEEP_DAYS * 24 * 60 * 60 * 1000;
  const next: CallDays = {};
  for (const [key, one] of Object.entries({ ...days, [id]: row })) if (one.at >= since) next[key] = one;
  return next;
}

export function noteCallDay(call: SavedConversation): void {
  const row = callDayOf(call);
  if (!row) return;
  try {
    const next = withCallDay(readCallDays(call.language), call.id, row);
    globalThis.localStorage?.setItem(`${KEY}.${call.language}`, JSON.stringify(next));
    globalThis.dispatchEvent?.(new CustomEvent(CALL_DAYS_EVENT, { detail: { language: call.language } }));
  } catch {
    // 이번에만.
  }
}

/** 통화 기록에서 지우면(Logbank ✕ 등) 합계에서도 뺀다. */
export function forgetCallDay(language: string, id: string): void {
  try {
    const days = readCallDays(language);
    if (!days[id]) return;
    delete days[id];
    globalThis.localStorage?.setItem(`${KEY}.${language}`, JSON.stringify(days));
    globalThis.dispatchEvent?.(new CustomEvent(CALL_DAYS_EVENT, { detail: { language } }));
  } catch {
    // 이번에만.
  }
}
