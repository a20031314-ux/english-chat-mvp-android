import assert from "node:assert/strict";
import test from "node:test";
import {
  addCatalogTrialVideo,
  addMonthlyImportPoints,
  getBilledImportVideoIds,
  getCatalogTrialVideoIds,
  getCallsStarted,
  getDailyUsed,
  getMonthlyImportPointsUsed,
  incrementCallsStarted,
  incrementDailyUsed,
} from "./entitlementStore.ts";

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
