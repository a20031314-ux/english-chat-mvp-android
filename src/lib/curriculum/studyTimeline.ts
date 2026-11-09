/**
 * 학습 타임라인(2026-11-09 사용자 "일일학습을 학습 타임라인(전체 > 학습 시간 > 내용 > 카드·결과)으로" → 시안
 * https://claude.ai/artifact/5ryqv3cTwk1FKLBraUKYkL → "10분 기준 그대로, 날 세부 시트 자리에").
 *
 * 그날의 기록(사건 장부 · 수업 결과 dayLog · 통화 카드 callNotes)을 시각순으로 놓고, 사이가 SESSION_GAP_MS(10분)보다 길면 끊어
 * "학습 시간"으로 묶는다. 모델·서버 없음, 이 폰 기록만.
 *
 * 아는 정도 표시(같은 날 사용자 결정 — 체크 셋 이름은 화면에 안 씀, 복습도 이름 없이 알고리즘만):
 *   학습        퀴즈에서 답한 날이 하루
 *   n번 학습    답한 날이 n일(같은 날 여러 번은 1, 사전 찾기·넘겨 보기는 안 셈)
 *   마지막 답이 틀렸으면 miss(✗).
 *
 * 앎(어휘)과 말하기(실제 출력)는 따로(2026-11-09 사용자 "학습자가 알고있는 어휘, 말하기 능력(실제 출력)을 분리 —
 * 퀴즈에서 적용점수를 측정하려고 하니까 애매해짐"): 위 표시는 퀴즈 답만, 통화·채팅·사람 대화는 카드의 "쓴 곳"(talkHistory)으로만.
 * 그 전에는 대화에서 쓴 날이 사흘 이상이면 "자주 씀"이 학습보다 앞섰다.
 */
import type { LogEvent, LogMode } from "./logLedger.ts";
import { partOf, type CardPart } from "./todayCards.ts";

export const SESSION_GAP_MS = 10 * 60 * 1000;

export type Place = "quiz" | "call" | "lesson" | "dict" | "chat" | "people";
export type TimelineCall = { id: string; at: number; secs: number };
export type TimelineResult = { at: number; secs?: number; item: string };

export type Session = {
  start: number;
  end: number;
  /** 여러 곳이면 많은 순. */
  places: Place[];
  events: LogEvent[];
  callIds: string[];
  /** 수업 결과(dayLog)의 at(ms) — 찾는 열쇠. */
  resultAts: number[];
};

const quizLike = (event: LogEvent) => (event.src === "quiz" || event.src === "exam" || event.src === "judge") && (event.r === "ok" || event.r === "miss");
const talkLike = (event: LogEvent) => event.src === "call" || event.src === "people" || event.src === "chat";

function placeOf(event: LogEvent): Place {
  if (event.src === "dict") return "dict";
  if (event.src === "call") return "call";
  if (event.src === "chat") return "chat";
  if (event.src === "people") return "people";
  return "quiz";
}

type Span = { start: number; end: number; place: Place; event?: LogEvent; call?: string; result?: number };

/** 순수: 그날 것만 넣는다(부르는 쪽이 날로 거름). 시각은 ms. */
export function sessionsOf(input: { events: readonly LogEvent[]; calls?: readonly TimelineCall[]; results?: readonly TimelineResult[] }, gap = SESSION_GAP_MS): Session[] {
  const spans: Span[] = [];
  for (const event of input.events) spans.push({ start: event.t * 1000, end: event.t * 1000, place: placeOf(event), event });
  for (const call of input.calls ?? []) spans.push({ start: call.at, end: call.at + Math.max(0, call.secs) * 1000, place: "call", call: call.id });
  for (const result of input.results ?? []) spans.push({ start: result.at - Math.max(0, result.secs ?? 0) * 1000, end: result.at, place: "lesson", result: result.at });
  spans.sort((a, b) => a.start - b.start || a.end - b.end);
  const out: { session: Session; weight: Map<Place, number> }[] = [];
  for (const span of spans) {
    const last = out[out.length - 1];
    const fresh = !last || span.start - last.session.end > gap;
    const into = fresh ? { session: { start: span.start, end: span.end, places: [], events: [], callIds: [], resultAts: [] } as Session, weight: new Map<Place, number>() } : last!;
    if (fresh) out.push(into);
    into.session.end = Math.max(into.session.end, span.end);
    // 통화·수업은 걸린 시간만큼, 낱개 사건은 1.
    const w = span.event ? 1 : Math.max(1, (span.end - span.start) / 30_000);
    into.weight.set(span.place, (into.weight.get(span.place) ?? 0) + w);
    if (span.event) into.session.events.push(span.event);
    if (span.call) into.session.callIds.push(span.call);
    if (span.result !== undefined) into.session.resultAts.push(span.result);
  }
  return out.map(({ session, weight }) => ({ ...session, places: [...weight].sort((a, b) => b[1] - a[1]).map(([place]) => place) }));
}

/** 표시할 분(1분 아래는 1). */
export function sessionMinutes(session: Pick<Session, "start" | "end">): number {
  return Math.max(1, Math.round((session.end - session.start) / 60_000));
}

export type SessionCard = { key: string; part: CardPart; ok: number; miss: number; last: LogEvent; mode?: LogMode };
export type SessionSummary = {
  parts: Record<CardPart, number>;
  ok: number;
  miss: number;
  /** 이 학습 시간에 처음 답한 열쇠. */
  fresh: string[];
  /** 전에(다른 날) 답한 적이 있는데 이 학습 시간에 또 답한 열쇠. */
  again: string[];
  looked: number;
  used: number;
  /** 퀴즈에서 답한 카드(마지막에 푼 것부터) — 통화에서만 쓴 것은 뒤에. */
  cards: SessionCard[];
};

/** 순수: 학습 시간 하나의 내용. all = 이 언어 장부 전체(처음·다시를 가르려고). */
export function summarizeSession(session: Session, all: readonly LogEvent[], dayOf: (t: number) => string): SessionSummary {
  const firstQuiz = new Map<string, number>();
  for (const event of all) if (quizLike(event) && (firstQuiz.get(event.k) ?? Infinity) > event.t) firstQuiz.set(event.k, event.t);
  const from = Math.floor(session.start / 1000);
  const to = Math.ceil(session.end / 1000);
  const sessionDay = dayOf(from);
  const byKey = new Map<string, SessionCard>();
  let ok = 0;
  let miss = 0;
  let looked = 0;
  let used = 0;
  for (const event of [...session.events].sort((a, b) => a.t - b.t)) {
    if (event.r === "look") looked += 1;
    if (event.r === "used" && talkLike(event)) used += 1;
    const part = partOf(event.k);
    if (!part) continue;
    const counts = quizLike(event);
    if (!counts && event.r !== "used" && !(talkLike(event) && event.r === "miss")) continue;
    if (counts) {
      if (event.r === "ok") ok += 1;
      else miss += 1;
    }
    const have = byKey.get(event.k) ?? { key: event.k, part, ok: 0, miss: 0, last: event };
    if (event.r === "ok") have.ok += 1;
    if (event.r === "miss") have.miss += 1;
    // 퀴즈 답이 대화보다 카드의 얼굴(마지막 결과·방식).
    if (counts || !quizLike(have.last)) {
      have.last = event;
      if (event.m) have.mode = event.m;
    }
    byKey.set(event.k, have);
  }
  const parts: Record<CardPart, number> = { word: 0, grammar: 0, expression: 0, frame: 0 };
  const fresh: string[] = [];
  const again: string[] = [];
  for (const card of byKey.values()) {
    parts[card.part] += 1;
    const first = firstQuiz.get(card.key);
    if (first === undefined || !quizLike(card.last)) continue;
    if (first >= from && first <= to) fresh.push(card.key);
    else if (first < from && dayOf(first) !== sessionDay) again.push(card.key);
  }
  const cards = [...byKey.values()].sort((a, b) => Number(quizLike(b.last)) - Number(quizLike(a.last)) || b.last.t - a.last.t);
  return { parts, ok, miss, fresh, again, looked, used, cards };
}

export type KnowTag = { kind: "learned" | "times"; n: number; miss: boolean };

/** 순수: 열쇠 하나의 표시(그 열쇠의 사건 전부, until(초)까지) — 퀴즈 답만. 답한 적 없으면(대화에서만 썼어도) null. */
export function knowTag(events: readonly LogEvent[], key: string, dayOf: (t: number) => string, until = Infinity): KnowTag | null {
  const quizDays = new Set<string>();
  let last: LogEvent | null = null;
  for (const event of events) {
    if (event.k !== key || event.t > until) continue;
    if (quizLike(event)) {
      quizDays.add(dayOf(event.t));
      if (!last || last.t <= event.t) last = event;
    }
  }
  const missLast = last?.r === "miss";
  if (quizDays.size >= 2) return { kind: "times", n: quizDays.size, miss: missLast };
  if (quizDays.size === 1) return { kind: "learned", n: 1, miss: missLast };
  return null;
}

/** 화면 글(학습 · n번 학습, 마지막 틀림이면 ✗ 붙이는 것은 부르는 쪽). */
export function knowTagLabel(ui: { tlLearnedN: string; lbFresh: string }, tag: KnowTag | null): string {
  if (!tag) return "";
  return tag.kind === "times" ? ui.tlLearnedN.replace("{n}", String(tag.n)) : ui.lbFresh;
}

export type CardHistoryRow = { t: number; src: LogEvent["src"]; r: LogEvent["r"]; mode?: LogMode; tag: KnowTag | null };

/** 순수: 카드 한 장의 학습 기록(새것부터, 퀴즈·사전 — 대화는 talkHistory) — 줄마다 그때까지의 표시. 같은 1분 안의 같은 결과는 한 줄. */
export function cardHistory(events: readonly LogEvent[], key: string, dayOf: (t: number) => string, max = 30): CardHistoryRow[] {
  const mine = events.filter((event) => event.k === key && !talkLike(event)).sort((a, b) => a.t - b.t);
  const rows: CardHistoryRow[] = [];
  for (const event of mine) {
    const prev = rows[rows.length - 1];
    if (prev && prev.src === event.src && prev.r === event.r && event.t - prev.t < 60) continue;
    rows.push({ t: event.t, src: event.src, r: event.r, ...(event.m ? { mode: event.m } : {}), tag: knowTag(mine, key, dayOf, event.t) });
  }
  return rows.reverse().slice(0, max);
}

export type TalkRow = { t: number; src: "call" | "chat" | "people"; r: "used" | "miss" };

/** 순수: 카드 한 장의 쓴 곳(새것부터) — 통화·채팅·사람 대화에서 쓴 것·막힌 것. 같은 날 같은 곳·같은 결과는 한 줄. */
export function talkHistory(events: readonly LogEvent[], key: string, dayOf: (t: number) => string, max = 30): TalkRow[] {
  const seen = new Set<string>();
  const rows: TalkRow[] = [];
  for (const event of [...events].filter((one) => one.k === key && talkLike(one) && (one.r === "used" || one.r === "miss")).sort((a, b) => b.t - a.t)) {
    const id = `${dayOf(event.t)}|${event.src}|${event.r}`;
    if (seen.has(id)) continue;
    seen.add(id);
    rows.push({ t: event.t, src: event.src as TalkRow["src"], r: event.r as TalkRow["r"] });
  }
  return rows.slice(0, max);
}
