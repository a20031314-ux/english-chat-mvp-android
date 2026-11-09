import assert from "node:assert/strict";
import test from "node:test";
import { SCENARIOS } from "../roleplay/catalog.ts";
import { KRW_PER_USD, videoPointCostUsd, MIN_BUNDLE_MARGIN, POINT_BUNDLES, STORE_FEE_SHARE, bundleMargin, pointCostUsd, ROLEPLAY_TURN, TTS_USD_PER_MINUTE, roleplayMinuteUsd, roleplayPointCostUsd } from "./cost.ts";

test("a point costs what the dearest thing it buys costs", () => {
  // A point buys call learning or video preparation, and the price is set
  // against whichever costs more, so the other can only come in under it.
  assert.equal(
    pointCostUsd(),
    Math.max(roleplayPointCostUsd(), videoPointCostUsd({ transcribed: true })),
  );
  // A sanity bracket, not a precise claim: if this ever moves by an order of
  // magnitude the derivation changed and every number below needs revisiting.
  assert.ok(pointCostUsd() > 0.01, "a point is not nearly free");
  assert.ok(pointCostUsd() < 0.2, "a point is not that expensive either");
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

test("call learning is the expensive way to spend a point", () => {
  // Not load-bearing the way it used to be — pointCostUsd takes the dearer of
  // the two, so a flip cannot overstate a margin any more. Kept because which
  // side is dearer is what tells you where to cut cost first.
  assert.ok(
    videoPointCostUsd({ transcribed: true }) < roleplayPointCostUsd(),
    "video has become the dearer side; the cost to cut first has moved",
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

test("call learning never costs more than a point is assumed to", () => {
  // True by construction now that the point is priced against it, and kept as
  // the line that fails if someone puts a fixed number back into pointCostUsd.
  assert.ok(
    roleplayPointCostUsd() <= pointCostUsd(),
    `five minutes of call learning costs ${roleplayPointCostUsd().toFixed(4)}, a point is assumed to cost ${pointCostUsd().toFixed(4)}`,
  );
});

test("what one point of call learning buys is written down, not guessed", () => {
  // Speech is most of a minute again — 63% against 21% for deciding — because
  // every line is made on the spot now. It was briefly close to even, while
  // the bank carried a third of the lines and its list sat in the prompt.
  //
  // Which is why this checks the shape rather than a number: whichever of the
  // three is largest is the one to check against a real bill first, and it has
  // changed twice in a week.
  const perMinute = roleplayMinuteUsd();
  const turns = 60 / ROLEPLAY_TURN.turnSeconds;
  const speak =
    turns *
    (ROLEPLAY_TURN.tutorSpeakingSeconds / 60) *
    TTS_USD_PER_MINUTE *
    ROLEPLAY_TURN.linesSynthesised;
  assert.ok(
    speak / perMinute > 0.5,
    `speech is ${Math.round((speak / perMinute) * 100)}% of a minute; the largest share has moved`,
  );
});

test("what is assumed about synthesis matches what the scenes actually do", () => {
  // The drift this file has twice been caught by, made into a rule. A line out
  // of the bank is the same words every time and comes back from the edge for
  // nothing; a written one is paid for every time it is said. So the share here
  // is one when no scene offers a repertoire, and below one when any does.
  //
  // Both halves have been wrong in the last week: 0.63 was left standing after
  // the offer was withdrawn, and 1 was implied long after the bank started
  // carrying turns.
  const offered = SCENARIOS.some((scenario) => (scenario.repertoire ?? []).length > 0);
  if (offered) {
    assert.ok(
      ROLEPLAY_TURN.linesSynthesised < 1,
      "a scene offers ready lines, so not every line is synthesised",
    );
  } else {
    assert.equal(
      ROLEPLAY_TURN.linesSynthesised,
      1,
      "no scene offers a ready line, so every line the character says is made now",
    );
  }
});
