import assert from "node:assert/strict";
import test from "node:test";
import { CALL_BLOCK_POINTS, POINT_CALL_SECONDS } from "../billing/config.ts";
import { totalPoints } from "../billing/points.ts";
import {
  addPurchasedPoints,
  openCallHold,
  readPointBalance,
  settleCallHold,
} from "./entitlementStore.ts";

/**
 * These run against the in-memory fallback in kv.ts, which is what that module
 * uses when no KV credentials are configured. That makes the charge-and-refund
 * path runnable end to end without a database — the part worth checking here is
 * not that Redis works, but that opening a call takes the right points and that
 * settling gives back exactly what went unused, once.
 */

let seq = 0;
/** A fresh id per test, since the fallback store is shared across the file. */
const newUser = () => `test-user-${Date.now()}-${seq++}`;

const GRANT = 80;

test("opening a call takes a whole block up front", async () => {
  const userId = newUser();
  const hold = await openCallHold(userId, GRANT);
  assert.ok(hold);
  assert.equal(hold.points, CALL_BLOCK_POINTS);
  assert.equal(hold.seconds, CALL_BLOCK_POINTS * POINT_CALL_SECONDS);

  const after = await readPointBalance(userId, GRANT);
  assert.equal(totalPoints(after), GRANT - CALL_BLOCK_POINTS);
});

test("settling gives back the part of the block the call did not use", async () => {
  const userId = newUser();
  const hold = await openCallHold(userId, GRANT);
  assert.ok(hold);

  // Three minutes of a ten-minute block.
  const settled = await settleCallHold(userId, hold.holdId, 3 * 60);
  assert.deepEqual(settled, { refundedPoints: 7 });

  const after = await readPointBalance(userId, GRANT);
  assert.equal(totalPoints(after), GRANT - 3);
});

test("a part-used minute is still a whole point", async () => {
  const userId = newUser();
  const hold = await openCallHold(userId, GRANT);
  assert.ok(hold);
  await settleCallHold(userId, hold.holdId, 61);
  const after = await readPointBalance(userId, GRANT);
  assert.equal(totalPoints(after), GRANT - 2);
});

test("a settle that arrives twice refunds once", async () => {
  // Retries and resent keepalives are ordinary; a second refund would not be.
  const userId = newUser();
  const hold = await openCallHold(userId, GRANT);
  assert.ok(hold);

  const first = await settleCallHold(userId, hold.holdId, 60);
  assert.deepEqual(first, { refundedPoints: 9 });
  const second = await settleCallHold(userId, hold.holdId, 60);
  assert.equal(second, null);

  const after = await readPointBalance(userId, GRANT);
  assert.equal(totalPoints(after), GRANT - 1);
});

test("an unknown hold settles to nothing", async () => {
  const userId = newUser();
  assert.equal(await settleCallHold(userId, "no-such-hold", 60), null);
});

test("a call that is never reported keeps its whole block", async () => {
  // This is what bounds the loss: silence costs one block, not an afternoon.
  const userId = newUser();
  const hold = await openCallHold(userId, GRANT);
  assert.ok(hold);
  const after = await readPointBalance(userId, GRANT);
  assert.equal(totalPoints(after), GRANT - CALL_BLOCK_POINTS);
});

test("an empty balance opens no call", async () => {
  const userId = newUser();
  assert.equal(await openCallHold(userId, 0), null);
});

test("purchased points open a call when the grant is gone", async () => {
  const userId = newUser();
  await addPurchasedPoints(userId, 4);
  // No grant at all: the whole call is paid for out of what was bought.
  const hold = await openCallHold(userId, 0);
  assert.ok(hold);
  assert.equal(hold.points, 4);

  const after = await readPointBalance(userId, 0);
  assert.equal(after.purchased, 0);
});

test("a charge takes the grant first and spills into what was bought", async () => {
  const userId = newUser();
  await addPurchasedPoints(userId, 50);
  // A grant of 4 cannot cover a ten-point block on its own.
  const hold = await openCallHold(userId, 4);
  assert.ok(hold);
  assert.equal(hold.points, CALL_BLOCK_POINTS);

  const after = await readPointBalance(userId, 4);
  assert.equal(after.granted, 0);
  assert.equal(after.purchased, 44);
});

test("a refund cannot move points from the grant into the purchased pot", async () => {
  // The laundering path: spend granted points, hang up at once, and take the
  // refund back as points that never expire.
  const userId = newUser();
  const before = await readPointBalance(userId, GRANT);
  assert.equal(before.purchased, 0);

  const hold = await openCallHold(userId, GRANT);
  assert.ok(hold);
  await settleCallHold(userId, hold.holdId, 1);

  const after = await readPointBalance(userId, GRANT);
  assert.equal(after.purchased, 0, "nothing should have become purchased");
  assert.equal(after.granted, GRANT - 1);
});
