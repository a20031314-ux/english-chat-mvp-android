/**
 * Usage counters that survive the request that wrote them.
 *
 * These used to be maps in module scope. That reads as a store and is not one:
 * serverless instances do not share memory and are recycled constantly, so the
 * free daily chat limit, the monthly import points and the catalog trial count
 * all silently reset. They are keyed rows in KV now — see kv.ts, which also
 * explains what happens when no KV credentials are configured.
 *
 * Every key names its own window, so nothing has to be reset on a rollover: the
 * old key simply stops being read and expires on its own.
 */

import { kvGetJson, kvGetNumber, kvIncrBy, kvSetJson } from "./kv.ts";
import {
  planCallBlock,
  pointsForCallSeconds,
  refundSplit,
  splitSpend,
  spentPoints,
  type PointBalance,
  type PointSpend,
} from "../billing/points.ts";

/** Long enough that a day's counter outlives the day in every timezone. */
const DAILY_TTL_SECONDS = 3 * 24 * 60 * 60;
/** Same idea for a month, with room for a late-arriving write. */
const MONTHLY_TTL_SECONDS = 70 * 24 * 60 * 60;

function dayKey() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

function monthKey() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${now.getFullYear()}-${month}`;
}

function dailyChatKey(userId: string) {
  return `usage:chat:${userId}:${dayKey()}`;
}

function videoPrepKey(userId: string) {
  return `usage:video:${userId}:${monthKey()}`;
}

function callsKey(userId: string) {
  return `usage:calls:${userId}`;
}

function catalogTrialKey(userId: string) {
  return `usage:trial:${userId}`;
}

function callSecondsKey(userId: string) {
  return `usage:callsec:${userId}:${monthKey()}`;
}

function opKey(userId: string, op: string) {
  return `usage:op:${op}:${userId}:${dayKey()}`;
}

/** Deliberately not month-scoped and given no expiry: this was paid for. */
function purchasedPointsKey(userId: string) {
  return `points:bought:${userId}`;
}

function callHoldKey(userId: string, holdId: string) {
  return `points:hold:${userId}:${holdId}`;
}

/**
 * Long enough that no real call outlives its own hold, short enough that
 * abandoned rows do not accumulate. A hold that expires unsettled simply stays
 * spent, which is the safe direction.
 */
const HOLD_TTL_SECONDS = 6 * 60 * 60;

export async function getDailyUsed(userId: string): Promise<number> {
  return kvGetNumber(dailyChatKey(userId));
}

export async function incrementDailyUsed(
  userId: string,
  amount = 1,
): Promise<number> {
  return kvIncrBy(dailyChatKey(userId), amount, DAILY_TTL_SECONDS);
}

type VideoPrepRecord = {
  usedPoints: number;
  billedVideoIds: string[];
};

const EMPTY_VIDEO_PREP: VideoPrepRecord = {
  usedPoints: 0,
  billedVideoIds: [],
};

async function readVideoPrep(userId: string): Promise<VideoPrepRecord> {
  const stored = await kvGetJson<Partial<VideoPrepRecord>>(
    videoPrepKey(userId),
  );
  if (!stored) return EMPTY_VIDEO_PREP;
  return {
    usedPoints:
      typeof stored.usedPoints === "number" && stored.usedPoints > 0
        ? stored.usedPoints
        : 0,
    billedVideoIds: Array.isArray(stored.billedVideoIds)
      ? stored.billedVideoIds.filter(
          (id): id is string => typeof id === "string",
        )
      : [],
  };
}

export async function getMonthlyImportPointsUsed(
  userId: string,
): Promise<number> {
  return (await readVideoPrep(userId)).usedPoints;
}

export async function getBilledImportVideoIds(
  userId: string,
): Promise<string[]> {
  return (await readVideoPrep(userId)).billedVideoIds;
}

export async function addMonthlyImportPoints(
  userId: string,
  points: number,
  videoId?: string,
): Promise<number> {
  const billed = Math.max(0, Math.ceil(points));
  const current = await readVideoPrep(userId);
  const next: VideoPrepRecord = {
    usedPoints: current.usedPoints + billed,
    billedVideoIds:
      videoId && !current.billedVideoIds.includes(videoId)
        ? [...current.billedVideoIds, videoId]
        : current.billedVideoIds,
  };
  await kvSetJson(videoPrepKey(userId), next, MONTHLY_TTL_SECONDS);
  return next.usedPoints;
}

/** @deprecated Seconds view of import points, kept for the entitlement route. */
export async function getMonthlyVideoPrepUsed(
  userId: string,
): Promise<number> {
  return (await getMonthlyImportPointsUsed(userId)) * 180;
}

/** Lifetime, like the catalog trial, so this key carries no expiry either. */
export async function getCallsStarted(userId: string): Promise<number> {
  return kvGetNumber(callsKey(userId));
}

export async function incrementCallsStarted(userId: string): Promise<number> {
  return kvIncrBy(callsKey(userId), 1);
}

/**
 * How many seconds of realtime audio a subscriber has spent this month.
 *
 * Counted, not enforced. Opening a call is the only lever the server holds, so
 * this exists to answer a question the counter above cannot: a started call and
 * a forty-minute call cost very different amounts, and premium currently has no
 * limit on either. Monthly, because that is the window a subscription is sold in.
 *
 * Read it as a floor. The number arrives from the client — the server never sees
 * a call end — so a killed app loses its report, and a hostile one could inflate
 * it. Good enough to price a plan, not good enough to bill against.
 */
export async function getMonthlyCallSeconds(userId: string): Promise<number> {
  return kvGetNumber(callSecondsKey(userId));
}

export async function addMonthlyCallSeconds(
  userId: string,
  seconds: number,
): Promise<number> {
  const rounded = Math.max(0, Math.round(seconds));
  if (rounded === 0) return getMonthlyCallSeconds(userId);
  return kvIncrBy(callSecondsKey(userId), rounded, MONTHLY_TTL_SECONDS);
}

/**
 * How many times someone used one metered route today.
 *
 * The daily chat counter above answers this for chat alone. Every other route
 * that spends model time — analysis, glossing, translation, speech — went
 * uncounted, which made the chat limit look like a fence around the spending
 * when most of the spending was happening beside it.
 *
 * Daily, like chat, because the question these answer is what a normal day of
 * use costs. Nothing reads them to refuse anything.
 */
export async function getDailyOpUsed(
  userId: string,
  op: string,
): Promise<number> {
  return kvGetNumber(opKey(userId, op));
}

export async function incrementDailyOpUsed(
  userId: string,
  op: string,
  amount = 1,
): Promise<number> {
  return kvIncrBy(opKey(userId, op), amount, DAILY_TTL_SECONDS);
}

/** Lifetime, not monthly — so this key deliberately carries no expiry. */
export async function getCatalogTrialVideoIds(
  userId: string,
): Promise<string[]> {
  const stored = await kvGetJson<unknown>(catalogTrialKey(userId));
  if (!Array.isArray(stored)) return [];
  return stored.filter((id): id is string => typeof id === "string");
}

export async function addCatalogTrialVideo(
  userId: string,
  videoId: string,
): Promise<string[]> {
  const current = await getCatalogTrialVideoIds(userId);
  if (current.includes(videoId)) return current;
  const next = [...current, videoId];
  await kvSetJson(catalogTrialKey(userId), next);
  return next;
}

/**
 * Points someone bought, as opposed to points the subscription granted them.
 *
 * No month in the key and no expiry on the row: these were paid for separately,
 * and letting them lapse at a month boundary would be taking money for nothing.
 */
export async function getPurchasedPoints(userId: string): Promise<number> {
  return Math.max(0, await kvGetNumber(purchasedPointsKey(userId)));
}

/** Credit a purchase. The caller is responsible for having verified it. */
export async function addPurchasedPoints(
  userId: string,
  points: number,
): Promise<number> {
  const amount = Math.max(0, Math.ceil(points));
  if (amount === 0) return getPurchasedPoints(userId);
  return kvIncrBy(purchasedPointsKey(userId), amount);
}

/**
 * Both pots, as the arithmetic in billing/points.ts expects them.
 *
 * `grant` is what the plan gives this month; what is left of it is the grant
 * minus what has been spent. A KV read that fails reads as zero, which here
 * means "no points" and so "no call" — the safe direction to fail in once there
 * is money involved.
 */
export async function readPointBalance(
  userId: string,
  grant: number,
): Promise<PointBalance> {
  const [used, purchased] = await Promise.all([
    getMonthlyImportPointsUsed(userId),
    getPurchasedPoints(userId),
  ]);
  return { granted: Math.max(0, grant - used), purchased };
}

/** Move points between the pots. Negative deltas give them back. */
async function applySpend(userId: string, spend: PointSpend, sign: 1 | -1) {
  if (spend.fromGranted !== 0) {
    const current = await readVideoPrep(userId);
    await kvSetJson(
      videoPrepKey(userId),
      {
        usedPoints: Math.max(0, current.usedPoints + sign * spend.fromGranted),
        billedVideoIds: current.billedVideoIds,
      } satisfies VideoPrepRecord,
      MONTHLY_TTL_SECONDS,
    );
  }
  if (spend.fromPurchased !== 0) {
    await kvIncrBy(purchasedPointsKey(userId), -sign * spend.fromPurchased);
  }
}

type CallHold = {
  spend: PointSpend;
  seconds: number;
  settled: boolean;
};

/**
 * Charge for a call before opening it, and say how long that buys.
 *
 * The charge has to come first because it cannot come later: once the handshake
 * is done the audio runs between the phone and OpenAI, and the server has no
 * session left to stop. So the whole block is taken here and the unused part is
 * returned when the call reports in. A call that never reports keeps its block,
 * which bounds what one silent call can cost.
 *
 * Returns null when the balance cannot open a call at all.
 */
export async function openCallHold(
  userId: string,
  grant: number,
): Promise<{ holdId: string; points: number; seconds: number } | null> {
  const balance = await readPointBalance(userId, grant);
  const block = planCallBlock(balance);
  if (!block) return null;
  const spend = splitSpend(balance, block.points);
  if (!spend) return null;

  const holdId = crypto.randomUUID();
  // Written before the pots move, so a charge is never invisible: if a pot
  // write fails after this, the hold still says what was meant to happen and
  // reconciliation has something to find.
  await kvSetJson(
    callHoldKey(userId, holdId),
    { spend, seconds: block.seconds, settled: false } satisfies CallHold,
    HOLD_TTL_SECONDS,
  );
  await applySpend(userId, spend, 1);
  return { holdId, points: block.points, seconds: block.seconds };
}

/**
 * Give back the part of a block the call did not use.
 *
 * Settling is one-shot: the row is marked before anything is returned, so a
 * report that arrives twice — a retry, a resent keepalive — cannot be refunded
 * twice. An unknown or already-settled hold returns null and changes nothing.
 */
export async function settleCallHold(
  userId: string,
  holdId: string,
  seconds: number,
): Promise<{ refundedPoints: number } | null> {
  const key = callHoldKey(userId, holdId);
  const hold = await kvGetJson<CallHold>(key);
  if (!hold || hold.settled || !hold.spend) return null;

  await kvSetJson(key, { ...hold, settled: true }, HOLD_TTL_SECONDS);

  // Never credit more than the block: a report claiming a shorter call than it
  // was cannot conjure points, it can only decline to spend them.
  const used = Math.min(
    pointsForCallSeconds(seconds),
    spentPoints(hold.spend),
  );
  const refund = refundSplit(hold.spend, used);
  const refunded = spentPoints(refund);
  if (refunded > 0) await applySpend(userId, refund, -1);
  return { refundedPoints: refunded };
}

function creditedPurchaseKey(userId: string, transactionId: string) {
  return `points:credited:${userId}:${transactionId}`;
}

/**
 * Credit a purchase once, and say whether this call was the one that did it.
 *
 * The marker is written before the points are added, so a crash between the two
 * loses a credit rather than repeating one — the safe direction when the
 * alternative is handing out points every time an app restarts and re-syncs.
 * It carries no expiry: a purchase is credited once, forever, and a row that
 * lapsed would let the same transaction pay out twice.
 */
export async function creditPurchaseOnce(
  userId: string,
  transactionId: string,
  points: number,
): Promise<boolean> {
  const key = creditedPurchaseKey(userId, transactionId);
  const already = await kvGetJson<{ points: number }>(key);
  if (already) return false;
  await kvSetJson(key, { points, at: Date.now() });
  await addPurchasedPoints(userId, points);
  return true;
}
