/**
 * Logbank "오늘" 카드(개편 3단계 2026-11-06, 설계 hub/work/drafts/no-today-2026-11-05.md 8절 B안 · logbank-2026-11-06.md 4절 ①).
 * 쌓인 사건(logLedger.ts)과 체크 셋(checkState.ts)으로 최대 셋을 고른다. 모델 없음, 이 폰에서.
 *
 *   ① check  확인할 것   — 1·3·7·30일 된 앎이 넷 이상            → 그 열쇠 퀴즈 한 판
 *   ② stuck  막힌 것     — 지난 7일 통화·사람 대화에서 틀리고 퀴즈로 아직 못 맞힌 것 → 그 열쇠 퀴즈
 *   ③ hard   적용이 힘듦 — 그 상태가 가장 많은 종류(낱말·표현·문법·문장구조) 셋 이상 → 그 열쇠 퀴즈
 *   ④ try    써 보기     — 이번 주 앎이 됐는데 통화·대화에서 쓴 적 없는 표현 셋 이상 → 📞 공부 통화(그 표현을 practice로)
 *   ⑤ new    새로 배울 것 — 위가 셋이 안 될 때 → Quizbank 한 줄 그대로
 *
 * 셋 중 한 자리는 ④가 들어갈 수 있게 남긴다(퀴즈만 셋이 되지 않게). 카드는 그날 처음 정하고 하루 동안 그대로,
 * 끝은 체크박스가 아니라 사건으로(doneOf). 화면 글은 근거 숫자와 문(버튼 이름)만 — 권유 문장 없음.
 * 화면 이름(2026-11-09 사용자 "옛 상태 이름 다 삭제"): check·hard = "다시 학습 n"(hard는 앞에 종류) + 소재 이름 셋, stuck = 막힌 것, try = 써 보기, new = "새로 학습 n" — 위 표의 상태 이름은 고르는 규칙 설명일 뿐 화면에 안 씀.
 */
import type { LogEvent } from "./logLedger.ts";
import type { CheckState } from "./checkState.ts";
import { dueKeys } from "./checkState.ts";

export type CardKind = "check" | "stuck" | "hard" | "try" | "new";
export type CardPart = "word" | "expression" | "grammar" | "frame";
export type TodayCard = { kind: CardKind; keys: string[]; n: number; part?: CardPart };
export type TodayCards = { day: string; at: number; cards: TodayCard[] };

const DAY = 24 * 60 * 60;
export const MAX_CARDS = 3;
const QUIZ_KEYS = 10;
const CHECK_MIN = 4;
const HARD_MIN = 3;
const TRY_MIN = 3;
const TRY_KEYS = 3;
/** ⑤를 끝낸 것으로 보는 새 열쇠 답 수(퀴즈 한 판). */
export const NEW_DONE = 10;

export function partOf(key: string): CardPart | null {
  if (key.startsWith("w|")) return "word";
  if (key.startsWith("e|")) return "expression";
  if (key.startsWith("g|")) return "grammar";
  if (key.startsWith("f|")) return "frame";
  return null;
}

const quizLike = (event: LogEvent) => event.src === "quiz" || event.src === "exam" || event.src === "judge";

/** 순수: 그날의 카드 셋을 고른다. canCall = 통화 시간이 있는 사람(없으면 ④를 안 냄). */
export function pickCards(input: { events: readonly LogEvent[]; states: ReadonlyMap<string, CheckState>; now: number; canCall: boolean }): TodayCard[] {
  const { events, states, now, canCall } = input;
  const cards: TodayCard[] = [];
  const due = dueKeys(states, now);
  if (due.length >= CHECK_MIN) cards.push({ kind: "check", keys: due.slice(0, QUIZ_KEYS), n: due.length });

  // ② 지난 7일 통화·사람 대화에서 틀렸는데 그 뒤 퀴즈로 맞힌 적 없는 것.
  const weekAgo = now - 7 * DAY;
  const lastTalkMiss = new Map<string, number>();
  for (const event of events) {
    if (event.t < weekAgo || event.r !== "miss" || (event.src !== "call" && event.src !== "people" && event.src !== "chat")) continue;
    if (!partOf(event.k)) continue;
    lastTalkMiss.set(event.k, Math.max(lastTalkMiss.get(event.k) ?? 0, event.t));
  }
  const stuck = [...lastTalkMiss]
    .filter(([key, at]) => !events.some((event) => event.k === key && quizLike(event) && event.r === "ok" && event.t > at))
    .sort((a, b) => b[1] - a[1])
    .map(([key]) => key);
  if (stuck.length) cards.push({ kind: "stuck", keys: stuck.slice(0, QUIZ_KEYS), n: stuck.length });

  // ③ 적용이 힘듦이 가장 많은 종류(①②에 이미 든 열쇠는 빼고).
  const taken = new Set(cards.flatMap((card) => card.keys));
  const hardBy = new Map<CardPart, string[]>();
  for (const [key, state] of [...states].sort((a, b) => a[1].last - b[1].last)) {
    const part = partOf(key);
    if (state.level !== "hard" || !part || taken.has(key)) continue;
    hardBy.set(part, [...(hardBy.get(part) ?? []), key]);
  }
  const most = [...hardBy].sort((a, b) => b[1].length - a[1].length)[0];
  if (most && most[1].length >= HARD_MIN) cards.push({ kind: "hard", keys: most[1].slice(0, QUIZ_KEYS), n: most[1].length, part: most[0] });

  // ④ 이번 주 앎이 된 표현 중 통화·대화에서 쓴 적 없는 것.
  if (canCall) {
    const used = new Set(events.filter((event) => event.r === "used").map((event) => event.k));
    const fresh = [...states]
      .filter(([key, state]) => key.startsWith("e|") && state.level === "known" && (state.knownAt ?? 0) >= weekAgo && !used.has(key))
      .sort((a, b) => (b[1].knownAt ?? 0) - (a[1].knownAt ?? 0))
      .map(([key]) => key);
    if (fresh.length >= TRY_MIN) {
      const tryCard: TodayCard = { kind: "try", keys: fresh.slice(0, TRY_KEYS), n: fresh.length };
      if (cards.length >= MAX_CARDS) cards[MAX_CARDS - 1] = tryCard;
      else cards.push(tryCard);
    }
  }
  if (cards.length < MAX_CARDS) cards.push({ kind: "new", keys: [], n: NEW_DONE });
  return cards.slice(0, MAX_CARDS);
}

/** 순수: 카드가 끝났나 — 카드를 정한 뒤(at 초)의 사건으로. */
export function doneOf(card: TodayCard, events: readonly LogEvent[], at: number): boolean {
  const after = events.filter((event) => event.t >= at);
  const answered = (key: string, okOnly: boolean) => after.some((event) => event.k === key && quizLike(event) && (!okOnly || event.r === "ok"));
  if (card.kind === "check") return card.keys.every((key) => answered(key, false));
  if (card.kind === "stuck") return card.keys.every((key) => answered(key, true));
  if (card.kind === "hard") return card.keys.every((key) => answered(key, false));
  if (card.kind === "try") return card.keys.some((key) => after.some((event) => event.k === key && event.r === "used"));
  // new: 카드를 정하기 전에 사건이 없던 열쇠의 퀴즈 답이 한 판.
  const before = new Set(events.filter((event) => event.t < at).map((event) => event.k));
  return after.filter((event) => quizLike(event) && !before.has(event.k)).length >= NEW_DONE;
}

/** 순수: 저장된 그날 카드면 그대로, 날이 바뀌었으면 새로. */
export function cardsForDay(saved: TodayCards | null, day: string, make: () => TodayCard[], nowSeconds: number): TodayCards {
  if (saved && saved.day === day && Array.isArray(saved.cards) && saved.cards.length) return saved;
  return { day, at: nowSeconds, cards: make() };
}

export function parseCards(raw: string | null): TodayCards | null {
  try {
    const value = JSON.parse(raw ?? "null") as TodayCards | null;
    if (!value || typeof value.day !== "string" || typeof value.at !== "number" || !Array.isArray(value.cards)) return null;
    const cards = value.cards.filter((card) => card && ["check", "stuck", "hard", "try", "new"].includes(card.kind) && Array.isArray(card.keys));
    return { day: value.day, at: value.at, cards };
  } catch {
    return null;
  }
}

/**
 * 개편 Quizbank의 다시 볼 것(2026-11-07 사용자 "데이터상 맞지 않는 것들도"): 오늘 카드와 같은 장부·체크 셋에서 —
 * 확인할 때 된 앎 → 대화에서 막힌 것 → 적용이 힘듦(오늘 아직 안 푼 것) → 마지막 답이 틀린 처음 봄. 예전 복습 기록(reviewMap·known)은 쓰지 않는다.
 */
export function reviewKeys(input: { events: readonly LogEvent[]; states: ReadonlyMap<string, CheckState>; now: number; today: (t: number) => string }): string[] {
  const { events, states, now } = input;
  const out: string[] = [];
  const add = (key: string) => {
    if (partOf(key) && !out.includes(key)) out.push(key);
  };
  for (const key of dueKeys(states, now)) add(key);
  const card = pickCards({ events, states, now, canCall: false }).find((one) => one.kind === "stuck");
  for (const key of card?.keys ?? []) add(key);
  const lastQuiz = new Map<string, LogEvent>();
  for (const event of events) if (quizLike(event) && (lastQuiz.get(event.k)?.t ?? -1) <= event.t) lastQuiz.set(event.k, event);
  const today = input.today(now);
  const byLast = [...states].sort((a, b) => a[1].last - b[1].last);
  for (const [key, state] of byLast) {
    if (state.level !== "hard") continue;
    const last = lastQuiz.get(key);
    if (!last || input.today(last.t) !== today) add(key);
  }
  for (const [key, state] of byLast) if (state.level === "new" && lastQuiz.get(key)?.r === "miss") add(key);
  // 고르기로만 맞힌 New(그날 쓰기까지 못 감)는 다음 날부터 — 쓰기로 나온다(카드 face show, 2026-11-08).
  for (const [key, state] of byLast) {
    const last = lastQuiz.get(key);
    if (state.level === "new" && last?.r === "ok" && last.m === "pick" && input.today(last.t) !== today) add(key);
  }
  return out;
}
