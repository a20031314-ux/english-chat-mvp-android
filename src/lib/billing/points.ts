import {
  CALL_BLOCK_POINTS,
  POINT_CALL_SECONDS,
} from "./config.ts";

/**
 * What a point is worth, and how spending one is split.
 *
 * Kept free of storage and of the network so the arithmetic that decides what
 * someone is charged can be run on its own. Everything here is pure; the KV
 * rows and the call routes live elsewhere.
 */

/**
 * Two pots, not one.
 *
 * Granted points come with the subscription and expire with the month.
 * Purchased points were paid for separately and do not expire — turning them
 * into something that quietly vanishes at a month boundary would be taking
 * money for nothing.
 */
export type PointBalance = {
  granted: number;
  purchased: number;
};

/** Where a charge came from, kept so a refund can go back the same way. */
export type PointSpend = {
  fromGranted: number;
  fromPurchased: number;
};

export function totalPoints(balance: PointBalance): number {
  return Math.max(0, balance.granted) + Math.max(0, balance.purchased);
}

export function spentPoints(spend: PointSpend): number {
  return spend.fromGranted + spend.fromPurchased;
}

/**
 * Take points, granted first.
 *
 * Granted points are the ones with an expiry date, so they are the ones to burn
 * while they are still worth something. Spending what was paid for first would
 * quietly destroy the balance that had no deadline.
 *
 * Returns null when there is not enough, rather than a partial charge — a call
 * that cannot be paid for should not be opened at all.
 */
export function splitSpend(
  balance: PointBalance,
  points: number,
): PointSpend | null {
  const wanted = Math.max(0, Math.ceil(points));
  if (wanted === 0) return { fromGranted: 0, fromPurchased: 0 };
  if (totalPoints(balance) < wanted) return null;
  const fromGranted = Math.min(Math.max(0, balance.granted), wanted);
  return { fromGranted, fromPurchased: wanted - fromGranted };
}

/**
 * Give back what a charge did not use.
 *
 * Each pot gets back at most what that pot put in, which is what keeps this
 * from being a laundry: without that cap, opening a call on granted points and
 * hanging up immediately would return them as purchased points, and the whole
 * monthly allowance could be converted into a balance that never expires.
 *
 * Purchased points are returned first, so what is left standing is the pot that
 * expires anyway.
 */
export function refundSplit(spend: PointSpend, usedPoints: number): PointSpend {
  const used = Math.min(Math.max(0, Math.ceil(usedPoints)), spentPoints(spend));
  let refund = spentPoints(spend) - used;
  const fromPurchased = Math.min(spend.fromPurchased, refund);
  refund -= fromPurchased;
  return { fromGranted: Math.min(spend.fromGranted, refund), fromPurchased };
}

/** Seconds of call a number of points buys. */
export function callSecondsForPoints(points: number): number {
  return Math.max(0, Math.floor(points)) * POINT_CALL_SECONDS;
}

/**
 * Points a call of this length costs, rounded up.
 *
 * Up, because a part-used minute has already been paid for upstream, and a call
 * that connected at all is never free.
 */
export function pointsForCallSeconds(seconds: number): number {
  const value = Math.max(0, seconds);
  if (value <= 0) return 0;
  return Math.ceil(value / POINT_CALL_SECONDS);
}

/**
 * What to charge up front for a call, and how long that buys.
 *
 * Charging in advance is not a preference, it is the only option: once the
 * handshake is done the audio runs between the phone and OpenAI, and the server
 * has no session left to cut short. Whether to open one is the only lever it
 * holds, so the whole block is taken at that moment and the unused part handed
 * back when the call reports in. A call that never reports keeps the block,
 * which is what bounds the loss to one block rather than to a whole afternoon.
 *
 * A short balance buys a short call rather than nothing.
 */
export function planCallBlock(balance: PointBalance): {
  points: number;
  seconds: number;
} | null {
  const affordable = Math.min(CALL_BLOCK_POINTS, totalPoints(balance));
  if (affordable <= 0) return null;
  return { points: affordable, seconds: callSecondsForPoints(affordable) };
}
