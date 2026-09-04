import assert from "node:assert/strict";
import test from "node:test";
import { CALL_BLOCK_POINTS, POINT_CALL_SECONDS } from "./config.ts";
import {
  callSecondsForPoints,
  planCallBlock,
  pointsForCallSeconds,
  refundSplit,
  splitSpend,
  spentPoints,
  totalPoints,
  type PointBalance,
} from "./points.ts";

const balance = (granted: number, purchased: number): PointBalance => ({
  granted,
  purchased,
});

test("granted points are spent before purchased ones", () => {
  // Granted points expire with the month; purchased ones do not. Burning the
  // perishable pot first is the only order that does not destroy value.
  const spend = splitSpend(balance(80, 100), 10);
  assert.deepEqual(spend, { fromGranted: 10, fromPurchased: 0 });
});

test("a charge spills into purchased points once granted runs out", () => {
  const spend = splitSpend(balance(4, 100), 10);
  assert.deepEqual(spend, { fromGranted: 4, fromPurchased: 6 });
});

test("a balance that cannot cover the charge is refused outright", () => {
  // Not a partial charge: a call that cannot be paid for should not open.
  assert.equal(splitSpend(balance(3, 2), 10), null);
  assert.equal(splitSpend(balance(0, 0), 1), null);
});

test("an exact balance is spendable to the last point", () => {
  assert.deepEqual(splitSpend(balance(3, 7), 10), {
    fromGranted: 3,
    fromPurchased: 7,
  });
});

test("refunding cannot turn granted points into purchased ones", () => {
  // The exploit this guards: open a call on granted points, hang up at once,
  // and take the refund back as points that never expire. Repeat and the whole
  // monthly allowance becomes a permanent balance.
  const spend = splitSpend(balance(80, 0), 10);
  assert.ok(spend);
  const refund = refundSplit(spend, 1);
  assert.deepEqual(refund, { fromGranted: 9, fromPurchased: 0 });
});

test("a refund never returns more to a pot than that pot paid in", () => {
  const spend = { fromGranted: 4, fromPurchased: 6 };
  const refund = refundSplit(spend, 1);
  assert.equal(refund.fromGranted + refund.fromPurchased, 9);
  assert.ok(refund.fromGranted <= spend.fromGranted);
  assert.ok(refund.fromPurchased <= spend.fromPurchased);
  // Purchased comes back first, leaving the pot that expires anyway standing.
  assert.deepEqual(refund, { fromGranted: 3, fromPurchased: 6 });
});

test("a call that used the whole block refunds nothing", () => {
  const spend = { fromGranted: 6, fromPurchased: 4 };
  assert.deepEqual(refundSplit(spend, 10), {
    fromGranted: 0,
    fromPurchased: 0,
  });
});

test("a report claiming more than the block was worth refunds nothing", () => {
  // Over-reporting must not produce a negative refund, which would be a charge
  // the caller never agreed to.
  const spend = { fromGranted: 6, fromPurchased: 4 };
  assert.deepEqual(refundSplit(spend, 999), {
    fromGranted: 0,
    fromPurchased: 0,
  });
});

test("a call that connected is never free", () => {
  assert.equal(pointsForCallSeconds(1), 1);
  assert.equal(pointsForCallSeconds(59), 1);
  assert.equal(pointsForCallSeconds(60), 1);
  assert.equal(pointsForCallSeconds(61), 2);
  // Only a call with no duration at all costs nothing.
  assert.equal(pointsForCallSeconds(0), 0);
});

test("points and seconds convert back and forth at the stated rate", () => {
  assert.equal(callSecondsForPoints(10), 10 * POINT_CALL_SECONDS);
  assert.equal(pointsForCallSeconds(callSecondsForPoints(7)), 7);
});

test("a full balance buys a whole block", () => {
  const block = planCallBlock(balance(80, 0));
  assert.deepEqual(block, {
    points: CALL_BLOCK_POINTS,
    seconds: CALL_BLOCK_POINTS * POINT_CALL_SECONDS,
  });
});

test("a short balance buys a short call rather than nothing", () => {
  const block = planCallBlock(balance(0, 3));
  assert.deepEqual(block, { points: 3, seconds: 3 * POINT_CALL_SECONDS });
});

test("an empty balance opens no call at all", () => {
  assert.equal(planCallBlock(balance(0, 0)), null);
});

test("the block is what bounds a lost report", () => {
  // A call whose end is never reported keeps its whole block and no more, so
  // the most one silent call can cost is this — not an afternoon of audio.
  const block = planCallBlock(balance(1000, 1000));
  assert.ok(block);
  assert.equal(block.points, CALL_BLOCK_POINTS);
  const spend = splitSpend(balance(1000, 1000), block.points);
  assert.ok(spend);
  assert.equal(spentPoints(spend), CALL_BLOCK_POINTS);
});

test("totals ignore a pot that has gone negative", () => {
  assert.equal(totalPoints(balance(-5, 10)), 10);
});
