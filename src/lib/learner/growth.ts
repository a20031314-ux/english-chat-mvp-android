/**
 * How each part of a learner's language has grown: the My tab's network
 * (hub/drafts/my-growth-network.md).
 *
 * Six elements, the same six as the self-check's gaps (selfCheck.ts) so the
 * first ticks, the tutor's brief and this picture read one axis. Each grows
 * by counting one kind of thing that happened:
 *
 *   words         a phrase produced unaided for the first time (mastered)
 *   listening     a phrase now understood when heard (twice, not looked up)
 *   accuracy      a line in the language being learned that needed no correction
 *   speaking      a call turn begun at the first go, within four seconds
 *   natural       a line that needed no correction, and whose "more natural" version,
 *                 if any, was only a small change of taste (nearlySame)
 *   pronunciation a line said again with every word heard right (no data yet)
 *
 * Counts only ever rise: slipping back or taking a break never shrinks an
 * element; fourteen days with nothing added and it rests. Counts become a size
 * (stage 1–6) by thresholds set per element, because phrases are mastered far
 * faster than pronunciation improves. One small element is marked "grow this
 * next", kept for the day, and that is what "try this" offers.
 *
 * No level, no score against anyone else, no words of the learner's. Pure.
 */

import type { Ledger } from "./ledger.ts";
import { GAP_IDS, type GapId, type SelfCheck } from "./selfCheck.ts";

export type ElementId = GapId;
export const ELEMENT_IDS: readonly ElementId[] = GAP_IDS;

const DAY = 24 * 60 * 60 * 1000;
export const RESTING_AFTER_MS = 14 * DAY;
const KEEP_DAYS = 30;
const MAX_LEAVES = 8;
const MAX_EVER = 3000;

/** Points needed for stages 2–6 (stage 1 is anything below the first). */
export const STAGE_THRESHOLDS: Record<ElementId, readonly [number, number, number, number, number]> = {
  words: [5, 15, 30, 60, 100],
  listening: [5, 15, 30, 60, 100],
  accuracy: [10, 30, 70, 150, 300],
  speaking: [10, 30, 70, 150, 300],
  natural: [10, 30, 70, 150, 300],
  pronunciation: [3, 10, 25, 50, 100],
};

/** Elements with something to count today. Pronunciation waits for the app to send it. */
export const MEASURED: ReadonlySet<ElementId> = new Set(["words", "listening", "accuracy", "speaking", "natural"]);

export type GrowthRecord = {
  v: 1;
  /** Counted from turns: accuracy, speaking, natural, pronunciation. */
  counts: Partial<Record<ElementId, number>>;
  /** Points added per local day (YYYY-MM-DD), the last thirty days. */
  days: Partial<Record<ElementId, Record<string, number>>>;
  /** When each element last grew (ms). */
  lastAt: Partial<Record<ElementId, number>>;
  /** Phrases ever mastered / ever understood, with when it was first seen. Never removed. */
  everMastered: Record<string, number>;
  everUnderstood: Record<string, number>;
  /** The element marked to grow next, kept for a day. */
  next?: { day: string; id: ElementId };
  /** Turn measurements already folded in from before counters existed. */
  backfilled?: boolean;
  /**
   * The learner's clock, minutes ahead of UTC, as their app last said. Days are
   * theirs, not the server's; until the app has said, days are UTC.
   */
  offset?: number;
};

export function emptyGrowth(): GrowthRecord {
  return { v: 1, counts: {}, days: {}, lastAt: {}, everMastered: {}, everUnderstood: {} };
}

export function parseGrowth(raw: unknown): GrowthRecord {
  const row = (raw ?? {}) as Partial<GrowthRecord>;
  if (row.v !== 1) return emptyGrowth();
  return {
    v: 1,
    counts: row.counts ?? {},
    days: row.days ?? {},
    lastAt: row.lastAt ?? {},
    everMastered: row.everMastered ?? {},
    everUnderstood: row.everUnderstood ?? {},
    ...(row.next ? { next: row.next } : {}),
    ...(row.backfilled ? { backfilled: true } : {}),
    ...(typeof row.offset === "number" ? { offset: row.offset } : {}),
  };
}

/** The day a moment falls on, in the learner's time zone (offset in minutes, as getTimezoneOffset gives it, negated). */
export function dayOf(at: number, offsetMinutes = 0): string {
  return new Date(at + offsetMinutes * 60_000).toISOString().slice(0, 10);
}

function trimDays(days: Record<string, number>, now: number, offset: number): Record<string, number> {
  const oldest = dayOf(now - KEEP_DAYS * DAY, offset);
  return Object.fromEntries(Object.entries(days).filter(([day]) => day >= oldest));
}

export function addPoints(
  record: GrowthRecord,
  id: ElementId,
  points: number,
  at: number,
  offset = 0,
  now = at,
): GrowthRecord {
  if (points <= 0) return record;
  const day = dayOf(at, offset);
  const days = { ...(record.days[id] ?? {}) };
  days[day] = (days[day] ?? 0) + points;
  return {
    ...record,
    counts: { ...record.counts, [id]: (record.counts[id] ?? 0) + points },
    days: { ...record.days, [id]: trimDays(days, now, offset) },
    lastAt: { ...record.lastAt, [id]: Math.max(record.lastAt[id] ?? 0, at) },
  };
}

/** What one turn measured, and the elements it grows. */
export type TurnGrowth = {
  surface: "chat" | "call";
  /** Whether a correction changed their line. Null when it was not judged. */
  corrected: boolean | null;
  /** Chat: the more natural version was their own line. Call: no rewrite offered. */
  alreadyNatural?: boolean;
  attempts?: number | null;
  latencyMs?: number | null;
};

export const QUICK_START_MS = 4000;
/** A suggested "more natural" line this close to theirs is a matter of taste, not a fix. */
export const NEARLY_NATURAL = 0.2;

function bare(text: string): string[] {
  return [...text.toLocaleLowerCase().replace(/[\s\p{P}\p{S}]+/gu, "")];
}

/**
 * Whether two lines differ by no more than a small share of their length,
 * after case, spaces and punctuation are set aside: "今日はいい天気ですね" and
 * "今日はいい天気だね" are one register apart, not a better and a worse line.
 * Character edits, so scripts without spaces are measured the same way.
 */
export function nearlySame(a: string, b: string, share = NEARLY_NATURAL): boolean {
  const x = bare(a).slice(0, 200);
  const y = bare(b).slice(0, 200);
  if (x.join("") === y.join("")) return true;
  const longest = Math.max(x.length, y.length);
  if (longest === 0) return true;
  let previous = Array.from({ length: y.length + 1 }, (_, i) => i);
  for (let i = 1; i <= x.length; i += 1) {
    const current = [i];
    for (let j = 1; j <= y.length; j += 1) {
      current[j] = Math.min(previous[j]! + 1, current[j - 1]! + 1, previous[j - 1]! + (x[i - 1] === y[j - 1] ? 0 : 1));
    }
    previous = current;
  }
  return previous[y.length]! / longest <= share;
}

export function turnPoints(turn: TurnGrowth): Partial<Record<ElementId, number>> {
  const out: Partial<Record<ElementId, number>> = {};
  if (turn.corrected === false) {
    out.accuracy = 1;
    if (turn.alreadyNatural) out.natural = 1;
  }
  if (
    turn.surface === "call" &&
    turn.attempts === 1 &&
    typeof turn.latencyMs === "number" &&
    turn.latencyMs > 0 &&
    turn.latencyMs <= QUICK_START_MS
  ) {
    out.speaking = 1;
  }
  return out;
}

export function applyTurn(record: GrowthRecord, turn: TurnGrowth, at: number, offset = 0): GrowthRecord {
  let next = record;
  for (const [id, points] of Object.entries(turnPoints(turn)) as Array<[ElementId, number]>) {
    next = addPoints(next, id, points, at, offset);
  }
  return next;
}

function capEver(ever: Record<string, number>): Record<string, number> {
  const entries = Object.entries(ever);
  if (entries.length <= MAX_EVER) return ever;
  return Object.fromEntries(entries.sort((a, b) => b[1] - a[1]).slice(0, MAX_EVER));
}

/**
 * Fold what the ledger shows now into what has ever been seen: a phrase
 * mastered (or understood) once keeps counting after it slips back. Returns
 * the record unchanged when there is nothing new, so the caller can skip the
 * write.
 */
export function absorbLedger(record: GrowthRecord, ledger: Ledger, now: number, offset = 0): GrowthRecord {
  let next = record;
  let mastered = record.everMastered;
  let understood = record.everUnderstood;
  for (const [key, item] of Object.entries(ledger.items)) {
    if (item.state === "mastered" && mastered[key] === undefined) {
      const at = item.masteredAt ?? now;
      mastered = { ...mastered, [key]: at };
      next = addPoints({ ...next, everMastered: mastered }, "words", 1, at, offset, now);
    }
    if (item.understood && understood[key] === undefined) {
      understood = { ...understood, [key]: now };
      next = addPoints({ ...next, everUnderstood: understood }, "listening", 1, now, offset, now);
    }
  }
  if (next === record) return record;
  return { ...next, everMastered: capEver(mastered), everUnderstood: capEver(understood) };
}

export function stageOf(id: ElementId, points: number): number {
  return 1 + STAGE_THRESHOLDS[id].filter((threshold) => points >= threshold).length;
}

export type ElementView = {
  id: ElementId;
  points: number;
  stage: number;
  /** Whether there is anything to count for it yet. */
  measured: boolean;
  /** Nothing added in fourteen days (and something was, once). */
  resting: boolean;
  /** Points added in the last seven days. */
  week: number;
  /** Points added each of the last fourteen days, oldest first. */
  daily: number[];
  /** Phrases that grew it, most recent first. */
  leaves: string[];
};

export type GrowthView = { elements: ElementView[]; next: ElementId | null };

function sumDays(days: Record<string, number> | undefined, from: string): number {
  return Object.entries(days ?? {}).reduce((sum, [day, n]) => (day >= from ? sum + n : sum), 0);
}

function recentLeaves(ever: Record<string, number>, ledger: Ledger): string[] {
  return Object.entries(ever)
    .sort((a, b) => b[1] - a[1])
    .slice(0, MAX_LEAVES)
    .map(([key]) => ledger.items[key]?.text ?? "")
    .filter(Boolean);
}

/**
 * The element to grow next: the lowest stage among those with something to
 * count, then the order the learner ticked their gaps in, then the table
 * order. Kept for the day it was picked so the screen does not change under
 * them every time it opens.
 */
export function pickNext(
  elements: ElementView[],
  selfCheck: SelfCheck | null | undefined,
  previous: GrowthRecord["next"],
  today: string,
): ElementId | null {
  if (previous && previous.day === today && elements.some((e) => e.id === previous.id && e.measured)) {
    return previous.id;
  }
  const ticked = selfCheck?.gaps ?? [];
  const rank = (id: ElementId) => {
    const at = ticked.indexOf(id);
    return at === -1 ? ticked.length + ELEMENT_IDS.indexOf(id) : at;
  };
  const candidates = elements.filter((e) => e.measured);
  if (candidates.length === 0) return null;
  return [...candidates].sort((a, b) => a.stage - b.stage || rank(a.id) - rank(b.id))[0]!.id;
}

export function growthView(input: {
  record: GrowthRecord;
  ledger: Ledger;
  selfCheck?: SelfCheck | null;
  now: number;
  offset?: number;
}): GrowthView {
  const { record, ledger, now } = input;
  const offset = input.offset ?? 0;
  const weekFrom = dayOf(now - 6 * DAY, offset);
  const elements: ElementView[] = ELEMENT_IDS.map((id) => {
    const points =
      id === "words"
        ? Object.keys(record.everMastered).length
        : id === "listening"
          ? Object.keys(record.everUnderstood).length
          : (record.counts[id] ?? 0);
    const last = record.lastAt[id] ?? 0;
    const daily = Array.from({ length: 14 }, (_, i) => record.days[id]?.[dayOf(now - (13 - i) * DAY, offset)] ?? 0);
    return {
      id,
      points,
      stage: stageOf(id, points),
      measured: MEASURED.has(id),
      resting: points > 0 && last > 0 && now - last >= RESTING_AFTER_MS,
      week: sumDays(record.days[id], weekFrom),
      daily,
      leaves:
        id === "words"
          ? recentLeaves(record.everMastered, ledger)
          : id === "listening"
            ? recentLeaves(record.everUnderstood, ledger)
            : [],
    };
  });
  return { elements, next: pickNext(elements, input.selfCheck, record.next, dayOf(now, offset)) };
}
