/**
 * 공통 기능 107개(curriculum/functions.ts)를 여덟 묶음으로 — Logbank 육각형 문장 세부 칩 "문장구사력"의 칸
 * (2026-11-02 사용자 "문장구사력으로", hub/work/drafts/fill-gauge-2026-11-02.md 10절). 14개 언어 같은 표. 순수 모듈.
 */
import { FUNCTIONS } from "./functions.ts";

export const FN_GROUPS = ["self", "ask", "request", "time", "reason", "compare", "mind", "daily"] as const;
export type FnGroup = (typeof FN_GROUPS)[number];

const TABLE: Record<FnGroup, readonly string[]> = {
  // 나·사람
  self: ["greet", "introduce", "origin", "job", "like", "dislike", "have", "possession", "live-where", "describe-person", "routine", "experience", "habit-past", "changed"],
  // 묻기·확인
  ask: ["ask-what", "ask-where", "ask-price", "ask-have", "ask-how", "not-understand", "repeat-slow", "yes-no", "clarify", "rephrase", "ask-opinion-simple", "ask-opinion", "advice-ask", "recommend-ask"],
  // 부탁·제안
  request: ["request-thing", "request-action", "want", "invite", "accept", "decline", "suggest-time", "permission", "polite-request", "formal-request", "reserve", "order", "tact-refuse", "negotiate", "persuade"],
  // 때·순서
  time: ["time-when", "past-did", "future-plan", "ongoing", "frequency", "duration", "story-past", "sequence", "while-when", "plan-intent", "look-forward", "change-plan", "deadline", "storytelling"],
  // 까닭·조건
  reason: ["reason", "condition", "must", "can", "cannot", "hypothetical", "explain-process", "best-to", "try-doing"],
  // 비교·정도
  compare: ["compare", "count", "describe-thing", "weather", "the-more", "not-necessarily", "nuance-soften"],
  // 느낌·생각
  mind: ["feel", "opinion", "agree", "disagree-soft", "advice-give", "guess", "hearsay", "wish", "regret-light", "surprise", "sympathy", "compliment", "pros-cons", "concede", "concession", "idiom-react", "feedback-give", "debate", "read-between", "pretend"],
  // 일상 처리
  daily: ["thank", "apologize", "apologize-late", "location-now", "directions", "symptom", "lost-problem", "complain", "phone-call", "exchange-return", "report", "formal-humble", "change-topic", "end-conversation"],
};

const BY_FN = new Map<string, FnGroup>();
for (const group of FN_GROUPS) for (const id of TABLE[group]) BY_FN.set(id, group);

export function fnGroupOf(fn: string | undefined): FnGroup | null {
  return fn ? (BY_FN.get(fn) ?? null) : null;
}

/** 표가 기능 목록을 빠짐없이 덮는지(테스트). */
export function ungroupedFunctions(): string[] {
  return FUNCTIONS.map((one) => one.id).filter((id) => !BY_FN.has(id));
}
