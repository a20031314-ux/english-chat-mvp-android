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

import { kvGetJson, kvGetNumber, kvGetNumbers, kvIncrBy, kvSetJson } from "./kv.ts";
import {
  FREE_LIFETIME_ROLEPLAY_POINTS,
  ROLEPLAY_POINT_SECONDS,
} from "../billing/config.ts";
import {
  planCallBlock,
  pointsForCallSeconds,
  refundSplit,
  splitSpend,
  spentPoints,
  totalPoints,
  type PointBalance,
  type PointSpend,
} from "../billing/points.ts";
import { monthlyImportPoints } from "../billing/videoPrep.ts";
import { isIdentified } from "./identity.ts";

/** Long enough that a day's counter outlives the day in every timezone. */
const DAILY_TTL_SECONDS = 3 * 24 * 60 * 60;
/** Same idea for a month, with room for a late-arriving write. */
const MONTHLY_TTL_SECONDS = 70 * 24 * 60 * 60;

/**
 * How long the per-op ledger is kept, which is a different question from how
 * long a limit needs its counter.
 *
 * Three days is right for a daily allowance: tomorrow reads tomorrow's key and
 * yesterday's is dead weight. But these rows are read by a person weeks later,
 * asking what a fortnight of closed testing looked like — and a counter that
 * expires eleven days before the window closes cannot answer that. It could
 * only ever have described the last three days, which is the shape of an
 * anecdote rather than of evidence.
 *
 * Kept separate from DAILY_TTL_SECONDS rather than lengthening it, because the
 * chat limit has no reason to hold rows for a month and every key here already
 * names its own day — nothing reads a stale one either way.
 */
const OP_LEDGER_TTL_SECONDS = 45 * 24 * 60 * 60;

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

/** Lifetime, like the catalog trial: the free fifteen minutes do not come back. */
function roleplayTrialKey(userId: string) {
  return `usage:rptrial:${userId}`;
}

/** One conversation's clock, so a charge knows how long it has been running. */
function roleplaySessionKey(userId: string, sessionId: string) {
  return `points:rpsession:${userId}:${sessionId}`;
}

/**
 * Long enough to outlive any conversation — the scene closes itself after forty
 * turns — and short enough that abandoned rows do not pile up. A row that
 * expires mid-conversation restarts the clock, which charges the learner for
 * one more block than they owed; a lost row cannot overcharge by more than that.
 */
const ROLEPLAY_SESSION_TTL_SECONDS = 6 * 60 * 60;

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
  return kvIncrBy(opKey(userId, op), amount, OP_LEDGER_TTL_SECONDS);
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

/**
 * A line said, counted against the sentence that said it.
 *
 * Lifetime, not monthly: the question this answers is whether a sentence ever
 * earns its place, and a month is too short a window to retire one on. A tally
 * and the day it was last said, which together say both "is it used" and "is it
 * still used".
 */
function sentenceSaidKey(language: string, id: string) {
  return `bank:said:${language}:${id}`;
}

function sentenceLastKey(language: string, id: string) {
  return `bank:last:${language}:${id}`;
}

/**
 * Note that the character said a line out of the bank.
 *
 * Never throws and never blocks the turn: a lost tally costs one data point,
 * and the conversation is worth more than the count of it.
 */
export async function noteSentenceSaid(language: string, id: string): Promise<void> {
  try {
    await kvIncrBy(sentenceSaidKey(language, id), 1);
    await kvSetJson(sentenceLastKey(language, id), { at: Date.now() }, MONTHLY_TTL_SECONDS);
  } catch {
    // Counting is not the product.
  }
}

/** How often each of these has been said, and when it last was. */
export async function readSentenceTally(
  language: string,
  ids: string[],
): Promise<Record<string, { said: number; lastAt: number | null }>> {
  const counts = await kvGetNumbers(ids.map((id) => sentenceSaidKey(language, id)));
  const lasts = await Promise.all(
    ids.map((id) => kvGetJson<{ at: number }>(sentenceLastKey(language, id))),
  );
  const out: Record<string, { said: number; lastAt: number | null }> = {};
  ids.forEach((id, index) => {
    out[id] = { said: counts[index] ?? 0, lastAt: lasts[index]?.at ?? null };
  });
  return out;
}

type RoleplaySession = { startedAt: number; charged: number };

/** Points left for call learning: the free lifetime allowance, or the balance. */
export async function roleplayPointsLeft(
  userId: string,
  isPremium: boolean,
): Promise<number> {
  if (!isPremium) {
    const used = await kvGetNumber(roleplayTrialKey(userId));
    return Math.max(0, FREE_LIFETIME_ROLEPLAY_POINTS - used);
  }
  const balance = await readPointBalance(userId, monthlyImportPoints(true));
  return totalPoints(balance);
}

/**
 * Charge for the conversation so far, and say whether it may go on.
 *
 * Charged as it runs rather than held up front, which the realtime call had to
 * do because it could not see its own call: here every turn comes through the
 * server, so the clock can be read from the server's own first sighting of the
 * conversation and there is nothing to refund and nothing to take on trust.
 *
 * The first block is owed the moment the conversation starts — five minutes are
 * bought, not accrued — and each later block falls due as its five minutes
 * begin. A turn that cannot be paid for is refused, and the caller ends the
 * scene rather than leaving someone talking to a character that has stopped
 * answering.
 */
export async function chargeRoleplayTurn(
  userId: string,
  isPremium: boolean,
  sessionId: string,
  now: number,
): Promise<{ ok: boolean; charged: number; left: number }> {
  // Nobody in particular is asking, so there is nobody to charge. Every caller
  // without a RevenueCat id shares one name, and an allowance keyed to it is a
  // single allowance for every such install at once — the first conversation
  // anywhere would spend it and every other would be refused, which is what a
  // debug build did within three sessions. Served rather than refused: the
  // failure to identify someone is ours, not theirs.
  if (!isIdentified(userId)) {
    return { ok: true, charged: 0, left: FREE_LIFETIME_ROLEPLAY_POINTS };
  }

  const key = roleplaySessionKey(userId, sessionId);
  const session = (await kvGetJson<RoleplaySession>(key)) ?? {
    startedAt: now,
    charged: 0,
  };
  const elapsed = Math.max(0, now - session.startedAt);
  const due =
    Math.floor(elapsed / (ROLEPLAY_POINT_SECONDS * 1000)) + 1;
  const owed = due - session.charged;

  if (owed <= 0) {
    // Nothing has fallen due since the last turn, which is most turns.
    if (session.charged === 0) {
      await kvSetJson(key, session, ROLEPLAY_SESSION_TTL_SECONDS);
    }
    return { ok: true, charged: 0, left: await roleplayPointsLeft(userId, isPremium) };
  }

  if (!isPremium) {
    const used = await kvGetNumber(roleplayTrialKey(userId));
    if (used + owed > FREE_LIFETIME_ROLEPLAY_POINTS) {
      return { ok: false, charged: 0, left: Math.max(0, FREE_LIFETIME_ROLEPLAY_POINTS - used) };
    }
    await kvIncrBy(roleplayTrialKey(userId), owed);
  } else {
    const balance = await readPointBalance(userId, monthlyImportPoints(true));
    const spend = splitSpend(balance, owed);
    if (!spend) return { ok: false, charged: 0, left: totalPoints(balance) };
    await applySpend(userId, spend, 1);
  }

  await kvSetJson(
    key,
    { startedAt: session.startedAt, charged: due } satisfies RoleplaySession,
    ROLEPLAY_SESSION_TTL_SECONDS,
  );
  return { ok: true, charged: owed, left: await roleplayPointsLeft(userId, isPremium) };
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
