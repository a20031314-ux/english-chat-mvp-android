import assert from "node:assert/strict";
import test from "node:test";
import { splitSpend, totalPoints, type PointBalance } from "./points.ts";

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

test("totals ignore a pot that has gone negative", () => {
  assert.equal(totalPoints(balance(-5, 10)), 10);
});

import { formatPoints } from "./points.ts";

test("points are shown to one decimal, down for balances and up for costs", () => {
  assert.equal(formatPoints(27.46).replace(",", "."), "27.4");
  assert.equal(formatPoints(2.334, "up").replace(",", "."), "2.4");
  assert.equal(formatPoints(80), "80");
  assert.equal(formatPoints(2.3).replace(",", "."), "2.3");
  assert.equal(formatPoints(-1), "0");
  assert.equal(formatPoints(Number.NaN), "0");
});
