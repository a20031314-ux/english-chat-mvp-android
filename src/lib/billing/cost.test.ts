import assert from "node:assert/strict";
import test from "node:test";
import {
  PREMIUM_MONTHLY_IMPORT_POINTS,
  PREMIUM_MONTHLY_PRICE_KRW,
} from "./config.ts";
import {
  KRW_PER_USD,
  MIN_BUNDLE_MARGIN,
  POINT_BUNDLES,
  STORE_FEE_SHARE,
  bundleMargin,
  callMinuteUsd,
  grantMargin,
  pointCostUsd,
} from "./cost.ts";

test("a point costs what a minute of call costs", () => {
  // The call is the expensive thing a point can be spent on, so it is what the
  // price is set against; video preparation can only come in under it.
  assert.equal(pointCostUsd(), callMinuteUsd());
  // A sanity bracket, not a precise claim: if this ever moves by an order of
  // magnitude the derivation changed and every number below needs revisiting.
  assert.ok(pointCostUsd() > 0.02, "a call minute is not nearly free");
  assert.ok(pointCostUsd() < 0.2, "a call minute is not that expensive either");
});

test("every bundle clears the margin floor", () => {
  // The guard this file exists for: a bundle edited to a rounder-looking price
  // should fail here rather than ship at a loss.
  for (const bundle of POINT_BUNDLES) {
    const margin = bundleMargin(bundle);
    assert.ok(
      margin.marginShare >= MIN_BUNDLE_MARGIN,
      `${bundle.productId} margin ${(margin.marginShare * 100).toFixed(0)}% is below the ${(MIN_BUNDLE_MARGIN * 100).toFixed(0)}% floor`,
    );
  }
});

test("a bigger bundle is cheaper per point", () => {
  const perPoint = POINT_BUNDLES.map((b) => b.priceKrw / b.points);
  for (let i = 1; i < perPoint.length; i += 1) {
    assert.ok(
      perPoint[i]! < perPoint[i - 1]!,
      "buying more should not cost more per point",
    );
  }
});

test("the bundles survive the won weakening by a fifth", () => {
  // KRW_PER_USD is an assumption with a date on it. Prices are set in won and
  // costs are paid in dollars, so a move in the rate eats the margin directly.
  // The floor may be missed under that stress; being underwater may not.
  const stressed = KRW_PER_USD.rate * 1.2;
  for (const bundle of POINT_BUNDLES) {
    const revenueUsd = bundle.priceKrw / stressed;
    const netUsd = revenueUsd * (1 - STORE_FEE_SHARE);
    const costUsd = bundle.points * pointCostUsd();
    assert.ok(
      netUsd > costUsd,
      `${bundle.productId} goes underwater at ${stressed.toFixed(0)} KRW/USD`,
    );
  }
});

test("the monthly grant is never sold at a loss", () => {
  // Deliberately a weaker assertion than the bundles get. The grant is the
  // thinnest number in the scheme and is known not to clear the bundle floor;
  // what must not happen is it going negative.
  const margin = grantMargin(
    PREMIUM_MONTHLY_PRICE_KRW,
    PREMIUM_MONTHLY_IMPORT_POINTS,
  );
  assert.ok(
    margin.netUsd > margin.costUsd,
    `a fully spent grant costs $${margin.costUsd.toFixed(2)} against $${margin.netUsd.toFixed(2)} of revenue`,
  );
});

test("the grant is the thin part of the plan, and by how much", () => {
  // Recorded rather than asserted away: a subscriber who spends the whole grant
  // on calls leaves about a fifth of their payment behind, and everything else
  // they do that month — chat, analysis, glossing, speech — comes out of that.
  // Bundle buyers leave half or better. This is the number to revisit first
  // when real usage exists.
  const margin = grantMargin(
    PREMIUM_MONTHLY_PRICE_KRW,
    PREMIUM_MONTHLY_IMPORT_POINTS,
  );
  assert.ok(
    margin.marginShare < MIN_BUNDLE_MARGIN,
    "if the grant now clears the bundle floor, this test has served its purpose and should say so",
  );

  // What the grant would have to be to clear the same floor the bundles do.
  const affordable = Math.floor(
    (margin.netUsd * (1 - MIN_BUNDLE_MARGIN)) / pointCostUsd(),
  );
  assert.ok(
    affordable < PREMIUM_MONTHLY_IMPORT_POINTS,
    "the grant is only thin while it is larger than what the price supports",
  );
});
