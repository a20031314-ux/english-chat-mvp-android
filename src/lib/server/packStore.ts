/**
 * Daily packs, one per learner, language and local day (pack/pack.ts).
 *
 * Made the first time a day's pack is asked for and kept as it was made, so
 * opening it twice gives the same conversation and the call can find it on
 * every turn. Kept four days: long enough for the next packs to avoid its
 * questions and see its centre, short enough to need no cleaning.
 *
 * Holds numbers and the pack's own fixed questions; no learner sentence.
 */
import { kvGetJson, kvSetJson } from "./kv.ts";
import { isIdentified } from "./identity.ts";
import { readLedger } from "./ledgerStore.ts";
import { readWeakRecord } from "./weakPointStore.ts";
import { readSelfCheck } from "./selfCheckStore.ts";
import { readTurnStats } from "./learnerBrief.ts";
import { readGrowth } from "./growthStore.ts";
import { ledgerKey, phrasesToRecycle } from "../learner/ledger.ts";
import { RECUR_COUNT, RECUR_WINDOW_MS } from "../curriculum/weakPoints.ts";
import type { GapId } from "../learner/selfCheck.ts";
import { AVOID_DAYS, chooseFocus, composePack, packDayOf, packIdFor, type GrowthElement, type Pack } from "../pack/pack.ts";

const PACK_TTL_SECONDS = 4 * 24 * 60 * 60;

function packKey(userId: string, language: string, day: string): string {
  return `pack:v1:${userId}:${language}:${day}`;
}

/** The days before `day`, newest first. */
export function daysBefore(day: string, count: number): string[] {
  const base = Date.parse(`${day.slice(0, 10)}T00:00:00Z`);
  return Array.from({ length: count }, (_, i) =>
    new Date(base - (i + 1) * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
  );
}

export async function readPack(userId: string, language: string, day: string): Promise<Pack | null> {
  if (!isIdentified(userId)) return null;
  const pack = await kvGetJson<Pack>(packKey(userId, language, day));
  return pack && Array.isArray(pack.items) ? pack : null;
}

export async function writePack(userId: string, pack: Pack): Promise<void> {
  await kvSetJson(packKey(userId, pack.language, pack.day), pack, PACK_TTL_SECONDS);
}

/** Today's pack, made now if it does not exist yet. Null where packs are not offered. */
export async function ensurePack(userId: string, language: string, day: string, now = Date.now()): Promise<Pack | null> {
  if (!isIdentified(userId)) return null;
  const existing = await readPack(userId, language, day);
  if (existing) return existing;

  const [ledger, weak, selfCheck, stats, growth, ...recent] = await Promise.all([
    readLedger(userId, language, now),
    readWeakRecord(userId, language),
    readSelfCheck(userId, language),
    readTurnStats(userId, language, now),
    readGrowth(userId, language, null, now).catch(() => null),
    // An extra pack also steers clear of the ones already played today.
    ...(() => {
      const { day: date, n } = packDayOf(day);
      const today = Array.from({ length: n - 1 }, (_, i) => packIdFor(date, i + 1));
      return [...today, ...daysBefore(date, AVOID_DAYS)];
    })().map((d) => readPack(userId, language, d)),
  ]);
  const earlier = (recent as Array<Pack | null>).filter((p): p is Pack => p !== null);
  const recurring = Object.values(weak.patterns)
    .map((pattern) => ({ name: pattern.name.trim(), recent: pattern.misses.filter((at) => now - at <= RECUR_WINDOW_MS).length }))
    .filter((row) => row.name && row.recent >= RECUR_COUNT)
    .sort((a, b) => b.recent - a.recent);
  const elements = growthElements(growth);
  const { centre, side } = chooseFocus({
    growth: growth ? { next: growth.next, elements } : null,
    stats,
    selfCheck,
    recentCentres: earlier.map((p) => p.centre as GapId),
    hasRecurringMistake: recurring.length > 0,
  });
  const phrases = phrasesToRecycle(ledger, 3, now).map((text) => ({
    text,
    state: ledger.items[ledgerKey(text)]?.state ?? "learned",
  }));
  const pack = composePack({
    language,
    day,
    seed: userId,
    centre,
    side,
    ...(selfCheck?.use ? { use: selfCheck.use } : {}),
    phrases,
    ...(recurring[0] ? { mistake: recurring[0].name } : {}),
    growth: elements,
    avoid: earlier.flatMap((p) => p.items.filter((item, i) => item.block === i).map((item) => item.id)),
    now,
  });
  if (!pack) return null;
  await writePack(userId, pack);
  return pack;
}

function growthElements(view: Awaited<ReturnType<typeof readGrowth>> | null): GrowthElement[] {
  return (view?.elements ?? []).map((e) => ({ id: e.id, points: e.points, stage: e.stage, measured: e.measured }));
}

/** The My network's elements now, as the pack's retro compares them. */
export async function growthNow(userId: string, language: string): Promise<GrowthElement[]> {
  return growthElements(await readGrowth(userId, language, null).catch(() => null));
}

/** Ledger states of the pack's phrases now, keyed by the phrase in lower case. */
export async function phraseStates(userId: string, pack: Pack): Promise<Record<string, string>> {
  const ledger = await readLedger(userId, pack.language);
  return Object.fromEntries(
    pack.phrases.map((p) => [p.text.toLowerCase(), ledger.items[ledgerKey(p.text)]?.state ?? p.before]),
  );
}
