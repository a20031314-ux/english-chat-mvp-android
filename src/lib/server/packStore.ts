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

/** 무료 사용자가 팩을 연 날(주 N번 한도, pack/weekly.ts). 언어와 상관없이 한 줄. */
function packDaysKey(userId: string): string {
  return `pack:days:v1:${userId}`;
}

function packKey(userId: string, language: string, day: string): string {
  return `pack:v1:${userId}:${language}:${day}`;
}

export async function readPack(userId: string, language: string, day: string): Promise<Pack | null> {
  if (!isIdentified(userId)) return null;
  const pack = await kvGetJson<Pack>(packKey(userId, language, day));
  return pack && Array.isArray(pack.items) ? pack : null;
}

export async function writePack(userId: string, pack: Pack): Promise<void> {
  await kvSetJson(packKey(userId, pack.language, pack.day), pack, PACK_TTL_SECONDS);
}

function growthElements(view: Awaited<ReturnType<typeof readGrowth>> | null): GrowthElement[] {
  return (view?.elements ?? []).map((e) => ({ id: e.id, points: e.points, stage: e.stage, measured: e.measured }));
}
