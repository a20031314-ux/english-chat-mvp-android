/**
 * The My tab's growth record for one learner and language (learner/growth.ts):
 * counters raised as turns happen, the phrases ever mastered or understood
 * folded in from the ledger when it is read, and — once, the first time — the
 * turn measurements already kept from before counters existed.
 *
 * Writes after a turn swallow their own failure: a missed point is one point.
 */
import { kvGetJson, kvListRange, kvSetJson } from "./kv.ts";
import { isIdentified } from "./identity.ts";
import { readLedger } from "./ledgerStore.ts";
import { emptyLedger } from "../learner/ledger.ts";
import { readSelfCheck } from "./selfCheckStore.ts";
import { eventsKey, type LearnerTurnMetric } from "./learnerMetrics.ts";
import {
  absorbLedger,
  addPoints,
  applyPronunciation,
  applyStuck,
  applyTurn,
  emptyGrowth,
  growthView,
  parseGrowth,
  turnPoints,
  type ElementId,
  type GrowthRecord,
  type GrowthView,
  type TurnGrowth,
} from "../learner/growth.ts";

const TTL_SECONDS = 400 * 24 * 60 * 60;
/** How far back the first read looks for turns measured before counters existed. */
const BACKFILL_MONTHS = 3;
const ROWS_PER_MONTH = 3000;

function key(userId: string, language: string): string {
  return `growth:v1:${userId}:${language}`;
}

async function read(userId: string, language: string): Promise<GrowthRecord> {
  return parseGrowth(await kvGetJson(key(userId, language)));
}

async function write(userId: string, language: string, record: GrowthRecord): Promise<void> {
  await kvSetJson(key(userId, language), record, TTL_SECONDS);
}

/** A turn's points, added after the reply has gone out. */
export async function recordGrowthTurn(input: {
  userId: string;
  language: string;
  turn: TurnGrowth;
  now?: number;
}): Promise<void> {
  if (!isIdentified(input.userId)) return;
  try {
    if (Object.keys(turnPoints(input.turn)).length === 0) return;
    const record = await read(input.userId, input.language);
    const now = input.now ?? Date.now();
    await write(input.userId, input.language, applyTurn(record, input.turn, now, record.offset ?? 0));
  } catch (error) {
    console.error("[growth]", error);
  }
}

/** One go at saying a line again (roleplay/practice): an attempt, and a point when every word came out right. */
export async function recordPronunciation(input: { userId: string; language: string; clean: boolean; now?: number }): Promise<void> {
  if (!isIdentified(input.userId)) return;
  try {
    const record = await read(input.userId, input.language);
    await write(input.userId, input.language, applyPronunciation(record, input.clean, input.now ?? Date.now(), record.offset ?? 0));
  } catch (error) {
    console.error("[growth]", error);
  }
}

/** A moment they got stuck in a call, with the phrases its help handed them (learner/stuck.ts). */
export async function recordStuck(input: { userId: string; language: string; phrases: string[]; now?: number }): Promise<void> {
  if (!isIdentified(input.userId)) return;
  try {
    const record = await read(input.userId, input.language);
    await write(input.userId, input.language, applyStuck(record, input.phrases, input.now ?? Date.now(), record.offset ?? 0));
  } catch (error) {
    console.error("[growth]", error);
  }
}

/** The stored record as it is, for readers that need more than the view (the tutor's brief). */
export async function readGrowthRecord(userId: string, language: string): Promise<GrowthRecord> {
  if (!isIdentified(userId)) return emptyGrowth();
  return read(userId, language);
}

/** Turns measured before counters existed, counted once (accuracy and quick starts; naturalness was never kept). */
async function backfill(userId: string, language: string, record: GrowthRecord, now: number): Promise<GrowthRecord> {
  const keys = [...new Set(Array.from({ length: BACKFILL_MONTHS }, (_, i) => eventsKey(userId, now - i * 31 * 24 * 60 * 60 * 1000)))];
  const rows = (await Promise.all(keys.map((k) => kvListRange(k, -ROWS_PER_MONTH, -1)))).flat();
  let next: GrowthRecord = { ...record, backfilled: true };
  for (const raw of rows) {
    let row: Partial<LearnerTurnMetric>;
    try {
      row = JSON.parse(raw) as Partial<LearnerTurnMetric>;
    } catch {
      continue;
    }
    if (row.language !== language) continue;
    const at = Date.parse(row.created_at ?? "");
    if (!Number.isFinite(at)) continue;
    const points = turnPoints({
      surface: row.surface === "call" ? "call" : "chat",
      corrected: typeof row.had_correction === "boolean" ? row.had_correction : null,
      attempts: row.attempts ?? null,
      latencyMs: row.response_latency_ms ?? null,
    });
    for (const [id, n] of Object.entries(points) as Array<[ElementId, number]>) {
      if (id === "natural") continue;
      next = addPoints(next, id as ElementId, n, at, next.offset ?? 0, now);
    }
  }
  return next;
}

/** What the My tab draws: each element's size, week, last two weeks and leaves, and what to grow next. */
export async function readGrowth(
  userId: string,
  language: string,
  offsetMinutes: number | null,
  now = Date.now(),
): Promise<GrowthView> {
  if (!isIdentified(userId)) return growthView({ record: emptyGrowth(), ledger: emptyLedger(language, now), now });
  const [stored, ledger, selfCheck] = await Promise.all([
    read(userId, language),
    readLedger(userId, language, now),
    readSelfCheck(userId, language),
  ]);
  let record = stored;
  if (offsetMinutes !== null && record.offset !== offsetMinutes) record = { ...record, offset: offsetMinutes };
  if (!record.backfilled) record = await backfill(userId, language, record, now);
  record = absorbLedger(record, ledger, now, record.offset ?? 0);
  const view = growthView({ record, ledger, selfCheck, now, offset: record.offset ?? 0 });
  const today = new Date(now + (record.offset ?? 0) * 60_000).toISOString().slice(0, 10);
  if (view.next && (record.next?.day !== today || record.next.id !== view.next)) record = { ...record, next: { day: today, id: view.next } };
  if (record !== stored) await write(userId, language, record).catch(() => undefined);
  return view;
}
