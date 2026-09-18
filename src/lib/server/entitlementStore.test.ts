import assert from "node:assert/strict";
import test from "node:test";
import {
  addCatalogTrialVideo,
  addMonthlyCallSeconds,
  addMonthlyImportPoints,
  getBilledImportVideoIds,
  getCatalogTrialVideoIds,
  getCallsStarted,
  getDailyUsed,
  getMonthlyCallSeconds,
  getMonthlyImportPointsUsed,
  incrementCallsStarted,
  incrementDailyUsed,
  chargeRoleplayTurn,
  roleplayPointsLeft,
} from "./entitlementStore.ts";
import { SHARED_ANONYMOUS_ID } from "./identity.ts";

// No KV credentials are set here, so these exercise the in-memory fallback.
// Each test uses its own user id because that fallback is process-wide.

test("a user with no history starts at zero on every counter", async () => {
  assert.equal(await getDailyUsed("fresh"), 0);
  assert.equal(await getMonthlyImportPointsUsed("fresh"), 0);
  assert.deepEqual(await getBilledImportVideoIds("fresh"), []);
  assert.deepEqual(await getCatalogTrialVideoIds("fresh"), []);
});

test("daily chat use accumulates and is kept per user", async () => {
  await incrementDailyUsed("chat-a");
  await incrementDailyUsed("chat-a");
  await incrementDailyUsed("chat-b");

  assert.equal(await getDailyUsed("chat-a"), 2);
  assert.equal(await getDailyUsed("chat-b"), 1);
});

test("import points add up across separate videos", async () => {
  await addMonthlyImportPoints("import-a", 3, "video-1");
  await addMonthlyImportPoints("import-a", 2, "video-2");

  assert.equal(await getMonthlyImportPointsUsed("import-a"), 5);
  assert.deepEqual(await getBilledImportVideoIds("import-a"), [
    "video-1",
    "video-2",
  ]);
});

test("a video already billed is not listed twice", async () => {
  await addMonthlyImportPoints("import-b", 4, "video-1");
  await addMonthlyImportPoints("import-b", 0, "video-1");

  assert.deepEqual(await getBilledImportVideoIds("import-b"), ["video-1"]);
});

test("fractional points are rounded up, never below zero", async () => {
  await addMonthlyImportPoints("import-c", 0.2);
  await addMonthlyImportPoints("import-c", -5);

  assert.equal(await getMonthlyImportPointsUsed("import-c"), 1);
});

test("the catalog trial records each video once", async () => {
  await addCatalogTrialVideo("trial-a", "clip-1");
  await addCatalogTrialVideo("trial-a", "clip-1");
  await addCatalogTrialVideo("trial-a", "clip-2");

  assert.deepEqual(await getCatalogTrialVideoIds("trial-a"), [
    "clip-1",
    "clip-2",
  ]);
});

test("counters written for one user are invisible to another", async () => {
  await addMonthlyImportPoints("isolated-a", 7, "video-9");
  await addCatalogTrialVideo("isolated-a", "clip-9");

  assert.equal(await getMonthlyImportPointsUsed("isolated-b"), 0);
  assert.deepEqual(await getCatalogTrialVideoIds("isolated-b"), []);
});

test("trial calls are counted per user and never expire", async () => {
  assert.equal(await getCallsStarted("caller-a"), 0);

  await incrementCallsStarted("caller-a");
  await incrementCallsStarted("caller-a");

  assert.equal(await getCallsStarted("caller-a"), 2);
  assert.equal(await getCallsStarted("caller-b"), 0);
});

test("call seconds accumulate for the month and ignore junk", async () => {
  assert.equal(await getMonthlyCallSeconds("talker"), 0);

  await addMonthlyCallSeconds("talker", 90);
  await addMonthlyCallSeconds("talker", 30.4);
  await addMonthlyCallSeconds("talker", 0);
  await addMonthlyCallSeconds("talker", -100);

  assert.equal(await getMonthlyCallSeconds("talker"), 120);
});

const FIVE_MINUTES = 5 * 60 * 1000;

test("call learning is free for fifteen minutes and then is not", async () => {
  // The lifetime allowance: three points, five minutes each. Charged as the
  // conversation runs, so the fourth block is where it stops.
  const t0 = 1_700_000_000_000;
  const first = await chargeRoleplayTurn("rp-free", false, "s1", t0);
  assert.equal(first.ok, true);
  assert.equal(first.charged, 1, "the first five minutes are bought, not accrued");
  assert.equal(first.left, 2);

  // Another turn inside the same block costs nothing.
  const same = await chargeRoleplayTurn("rp-free", false, "s1", t0 + 60_000);
  assert.equal(same.charged, 0);
  assert.equal(same.left, 2);

  const second = await chargeRoleplayTurn("rp-free", false, "s1", t0 + FIVE_MINUTES);
  assert.equal(second.charged, 1);
  const third = await chargeRoleplayTurn("rp-free", false, "s1", t0 + 2 * FIVE_MINUTES);
  assert.equal(third.charged, 1);
  assert.equal(third.left, 0);

  const refused = await chargeRoleplayTurn("rp-free", false, "s1", t0 + 3 * FIVE_MINUTES);
  assert.equal(refused.ok, false, "the sixteenth minute is not free");
  assert.equal(refused.charged, 0);
});

test("the free allowance does not come back with a new conversation", async () => {
  const t0 = 1_700_000_000_000;
  for (const session of ["a", "b", "c"]) {
    const charge = await chargeRoleplayTurn("rp-lifetime", false, session, t0);
    assert.equal(charge.ok, true, `${session} should still be affordable`);
    assert.equal(charge.charged, 1);
  }
  const fourth = await chargeRoleplayTurn("rp-lifetime", false, "d", t0);
  assert.equal(fourth.ok, false, "three conversations is the whole of it");
});

test("a conversation is charged by its own clock, not by the last one's", async () => {
  const t0 = 1_700_000_000_000;
  await chargeRoleplayTurn("rp-clock", true, "one", t0);
  // An hour later, a new conversation owes one block — not thirteen.
  const later = await chargeRoleplayTurn("rp-clock", true, "two", t0 + 60 * 60 * 1000);
  assert.equal(later.charged, 1);
});

test("a subscriber spends the monthly grant rather than the free allowance", async () => {
  const t0 = 1_700_000_000_000;
  const charge = await chargeRoleplayTurn("rp-premium", true, "s1", t0);
  assert.equal(charge.ok, true);
  assert.equal(charge.charged, 1);
  // Taken out of the same pool video imports draw on, which is the point of
  // there being one currency.
  assert.equal(await getMonthlyImportPointsUsed("rp-premium"), 1);
  assert.equal(await roleplayPointsLeft("rp-premium", true), 79);
  // And the free lifetime allowance is untouched, so cancelling does not hand
  // anyone a fresh fifteen minutes they already had.
  assert.equal(await roleplayPointsLeft("rp-premium", false), 3);
});

test("nobody in particular is never charged", async () => {
  // Every caller without a RevenueCat id shares one name, so an allowance keyed
  // to it is one allowance for every install at once. A debug build spent it in
  // three sessions and then refused a fourth — for a different phone, a
  // different person, and no reason they could see.
  const t0 = 1_700_000_000_000;
  for (let session = 0; session < 6; session += 1) {
    const charge = await chargeRoleplayTurn(
      SHARED_ANONYMOUS_ID,
      false,
      `anon-${session}`,
      t0 + session * 20 * 60 * 1000,
    );
    assert.equal(charge.ok, true, `session ${session} should be served`);
    assert.equal(charge.charged, 0, "and nothing taken from anyone");
  }
  // Someone with a name is still charged normally.
  const named = await chargeRoleplayTurn("rc:someone", false, "s1", t0);
  assert.equal(named.charged, 1);
});
