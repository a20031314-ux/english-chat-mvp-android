import assert from "node:assert/strict";
import test from "node:test";
import { POINT_BUNDLES, pointsForProduct } from "../billing/cost.ts";
import {
  creditPurchaseOnce,
  getPurchasedPoints,
  openCallHold,
  readPointBalance,
} from "./entitlementStore.ts";

/**
 * Runs against the in-memory fallback in kv.ts, like the call-hold tests. What
 * is worth checking here is not that a purchase can be credited but that it
 * cannot be credited twice, since the app syncs on every launch and a purchase
 * stays on RevenueCat's record forever.
 */

let seq = 0;
const newUser = () => `credit-user-${Date.now()}-${seq++}`;

test("every bundle maps to the points it sells", () => {
  for (const bundle of POINT_BUNDLES) {
    assert.equal(pointsForProduct(bundle.productId), bundle.points);
  }
});

test("a product the build does not know about maps to nothing, not to zero", () => {
  // Zero would be credited silently. Null is a configuration mistake someone
  // has to see — a console and a build disagreeing about an id.
  assert.equal(pointsForProduct("points_999"), null);
  assert.equal(pointsForProduct(""), null);
});

test("a purchase is credited once and stays credited", () => {
  return (async () => {
    const userId = newUser();
    assert.equal(await creditPurchaseOnce(userId, "txn-1", 60), true);
    assert.equal(await getPurchasedPoints(userId), 60);

    // The app syncs again on the next launch; RevenueCat still reports it.
    assert.equal(await creditPurchaseOnce(userId, "txn-1", 60), false);
    assert.equal(await getPurchasedPoints(userId), 60);
  })();
});

test("two different purchases both land", () => {
  return (async () => {
    const userId = newUser();
    await creditPurchaseOnce(userId, "txn-a", 60);
    await creditPurchaseOnce(userId, "txn-b", 200);
    assert.equal(await getPurchasedPoints(userId), 260);
  })();
});

test("crediting the same transaction id for two people is not a clash", () => {
  return (async () => {
    // Ids are scoped per subscriber, so one person's sync must not mark
    // another's purchase as already handled.
    const first = newUser();
    const second = newUser();
    assert.equal(await creditPurchaseOnce(first, "shared-txn", 60), true);
    assert.equal(await creditPurchaseOnce(second, "shared-txn", 60), true);
    assert.equal(await getPurchasedPoints(second), 60);
  })();
});

test("bought points are spendable on a call", () => {
  return (async () => {
    // The end of the line this exists for: a purchase becomes a balance, and
    // the balance opens a call for someone whose monthly grant is gone.
    const userId = newUser();
    await creditPurchaseOnce(userId, "txn-spend", 60);

    const hold = await openCallHold(userId, 0);
    assert.ok(hold, "a purchased balance should open a call with no grant left");
    assert.equal(hold.points, 10);

    const after = await readPointBalance(userId, 0);
    assert.equal(after.purchased, 50);
  })();
});
