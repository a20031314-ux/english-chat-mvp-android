import assert from "node:assert/strict";
import test from "node:test";
import {
  PREMIUM_MONTHLY_IMPORT_POINTS,
  PREMIUM_MONTHLY_PRICE_KRW,
} from "./config.ts";
import {
  KRW_PER_USD,
  videoPointCostUsd,
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
  // price is set against; video can only come in under it.
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

test("the monthly grant currently costs more than it earns", () => {
  // Recorded, not approved. This was written as "never sold at a loss" and
  // passed until PREMIUM_MONTHLY_PRICE_KRW was corrected from 9,900 to the
  // 4,900 the console actually charges — the invariant was fine, the input was
  // fiction. It is left pointing the other way so the state is visible rather
  // than absent, and so that whoever fixes it is told to turn it back into the
  // invariant it wants to be.
  const margin = grantMargin(
    PREMIUM_MONTHLY_PRICE_KRW,
    PREMIUM_MONTHLY_IMPORT_POINTS,
  );
  assert.ok(
    margin.costUsd > margin.netUsd,
    "the grant now pays for itself — restore this as `netUsd > costUsd` and delete this comment",
  );

  // What the grant would have to be to break even at the current price.
  const breakEven = Math.floor(margin.netUsd / pointCostUsd());
  assert.ok(
    breakEven < PREMIUM_MONTHLY_IMPORT_POINTS,
    "break-even has caught up with the grant",
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

test("the bundles sit just above the floor rather than comfortably above it", () => {
  // What the bundles can actually be held to. The step up out of the
  // subscription is the number worth caring about, but it is mostly decided by
  // the subscription's own price — at 4,900원 the grant works out so cheap per
  // point that no bundle price can be close to it. What is in the bundles' gift
  // is not drifting upward, so that is what is guarded: each one within a tenth
  // of the lowest price MIN_BUNDLE_MARGIN allows.
  const floorKrw =
    (pointCostUsd() / (1 - MIN_BUNDLE_MARGIN) / (1 - STORE_FEE_SHARE)) *
    KRW_PER_USD.rate;
  for (const bundle of POINT_BUNDLES) {
    const perPoint = bundle.priceKrw / bundle.points;
    assert.ok(
      perPoint < floorKrw * 1.1,
      `${bundle.productId} is ${(perPoint / floorKrw).toFixed(2)}x the floor`,
    );
  }
});

test("the floor is what stops the step getting smaller, not a lack of trying", () => {
  // Worth stating because it is the answer to "why not price them lower": at
  // MIN_BUNDLE_MARGIN exactly a point still costs well over the grant rate, so
  // the remaining gap can only be closed by moving the subscription.
  const grantRate = PREMIUM_MONTHLY_PRICE_KRW / PREMIUM_MONTHLY_IMPORT_POINTS;
  const floorKrw =
    (pointCostUsd() / (1 - MIN_BUNDLE_MARGIN) / (1 - STORE_FEE_SHARE)) *
    KRW_PER_USD.rate;
  assert.ok(
    floorKrw > grantRate * 1.5,
    "if the floor has dropped below 1.5x the grant, the bundles can come down with it",
  );
});

test("a call minute is the expensive way to spend a point", () => {
  // Everything above rests on this ordering: the price is set against the call
  // because the call costs more, so the video side can only come in cheaper
  // than assumed. If a pipeline change ever flips it, every margin in this file
  // is overstated and nothing else here would notice.
  assert.ok(
    videoPointCostUsd({ transcribed: true }) < callMinuteUsd(),
    "video has become the expensive side; the price is no longer conservative",
  );
});

test("a video with captions costs less than one that has to be transcribed", () => {
  // The library is curated to captioned clips, so the cheap path is the common
  // one and the transcribed figure is a ceiling rather than a typical case.
  assert.ok(
    videoPointCostUsd({ transcribed: false }) <
      videoPointCostUsd({ transcribed: true }),
  );
});
