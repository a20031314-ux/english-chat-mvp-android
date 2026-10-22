import assert from "node:assert/strict";
import test from "node:test";
import {
  addCatalogTrialVideo,
  addMonthlyCallSeconds,
  addMonthlyImportPoints,
  chargeImportPoints,
  getPurchasedPoints,
  addPurchasedPoints,
  getBilledImportVideoIds,
  getCatalogTrialVideoIds,
  getCallsStarted,
  getDailyUsed,
  getMonthlyCallSeconds,
  getMonthlyImportPointsUsed,
  incrementCallsStarted,
  incrementDailyUsed,
  chargeRoleplayTurn,
  roleplayCarryMs,
  roleplayPointsLeft,
  noteSentenceWritten,
  readWrittenLines,
} from "./entitlementStore.ts";
import { SHARED_ANONYMOUS_ID } from "./identity.ts";
import { FREE_LIFETIME_ROLEPLAY_POINTS } from "../billing/config.ts";

// 포인트로 통화하는 구독(옛 프리미엄 조건: 매달 80포인트) — 2026-10-22에 프리미엄이 하루 시간 방식으로 바뀌어
// `true`(=지금의 프리미엄)로는 포인트 차감 규칙을 볼 수 없다. 규칙 자체는 포인트를 쓰는 사람 모두에게 그대로라 옛 조건으로 고정.
const POINTS_PREMIUM = termsFor("premium", 0, null);

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

test("call learning is free for its allowance and then is not", async () => {
  // Written against the allowance rather than a number, because that number is
  // a product decision and has already moved once: fifteen minutes turned out
  // to be three conversations, the last of which ended against a wall.
  const free = FREE_LIFETIME_ROLEPLAY_POINTS;
  const t0 = 1_700_000_000_000;
  const first = await chargeRoleplayTurn("rp-free", false, "s1", t0);
  assert.equal(first.ok, true);
  assert.equal(first.charged, 1, "the first five minutes are bought, not accrued");
  assert.equal(first.left, free - 1);

  // Another turn inside the same block costs nothing.
  const same = await chargeRoleplayTurn("rp-free", false, "s1", t0 + 60_000);
  assert.equal(same.charged, 0);
  assert.equal(same.left, free - 1);

  // One block at a time until it is spent.
  for (let block = 1; block < free; block += 1) {
    const charge = await chargeRoleplayTurn("rp-free", false, "s1", t0 + block * FIVE_MINUTES);
    assert.equal(charge.charged, 1, `block ${block} should cost one`);
  }
  const spent = await chargeRoleplayTurn("rp-free", false, "s1", t0 + (free - 1) * FIVE_MINUTES);
  assert.equal(spent.left, 0);

  const refused = await chargeRoleplayTurn("rp-free", false, "s1", t0 + free * FIVE_MINUTES);
  assert.equal(refused.ok, false, "the minute after the allowance is not free");
  assert.equal(refused.charged, 0);
});

test("the free allowance does not come back with a new conversation", async () => {
  // Each conversation runs its full five minutes, so nothing carries and every
  // one buys a block. The allowance is for the life of the account.
  const free = FREE_LIFETIME_ROLEPLAY_POINTS;
  const t0 = 1_700_000_000_000;
  for (let conversation = 0; conversation < free; conversation += 1) {
    const start = t0 + conversation * FIVE_MINUTES * 2;
    const charge = await chargeRoleplayTurn("rp-lifetime", false, `s${conversation}`, start);
    assert.equal(charge.ok, true, `conversation ${conversation} should still be affordable`);
    assert.equal(charge.charged, 1, "a new conversation buys its first block");
    await chargeRoleplayTurn("rp-lifetime", false, `s${conversation}`, start + FIVE_MINUTES - 1000);
  }
  const after = await chargeRoleplayTurn("rp-lifetime", false, "one-too-many", t0 + free * FIVE_MINUTES * 2);
  assert.equal(after.ok, false, "the allowance is for the life of the account");
});

test("a conversation is charged by its own clock, not by the last one's", async () => {
  const t0 = 1_700_000_000_000;
  await chargeRoleplayTurn("rp-clock", POINTS_PREMIUM, "one", t0);
  // An hour later, a new conversation owes at most one block, not thirteen.
  // Here it owes none: the first one used half a minute of the five it
  // bought, and the rest waited for this one.
  const later = await chargeRoleplayTurn("rp-clock", POINTS_PREMIUM, "two", t0 + 60 * 60 * 1000);
  assert.equal(later.ok, true);
  assert.equal(later.charged, 0);
});

test("three-minute calls cost three minutes each, not five", async () => {
  // The case this exists for. Ten calls of three minutes, hung up each time:
  // under whole blocks that was ten points for thirty minutes. With the unused
  // part of each block carried to the next call it is the time actually used,
  // half a minute of grace per call included, rounded up once at the end.
  const t0 = 1_700_000_000_000;
  const THREE_MINUTES = 3 * 60 * 1000;
  let points = 0;
  for (let call = 0; call < 10; call += 1) {
    const start = t0 + call * 60 * 60 * 1000;
    for (let at = 0; at <= THREE_MINUTES; at += 15_000) {
      const charge = await chargeRoleplayTurn("rp-short", POINTS_PREMIUM, `call-${call}`, start + at);
      assert.equal(charge.ok, true);
      points += charge.charged;
    }
  }
  // Used: 10 x (3:00 + 0:30) = 35 minutes = 7 blocks.
  assert.ok(points <= 8, `ten three-minute calls took ${points} points`);
  assert.ok(points >= 7, `ten three-minute calls took only ${points} points; time went unpaid`);
});

test("every minute served was paid for before it was used", async () => {
  // Carry only ever holds time some earlier block bought, so however the
  // calls are cut, what was charged covers what was used.
  const t0 = 1_700_000_000_000;
  const lengths = [40_000, 7 * 60_000, 90_000, 4 * 60_000, 11 * 60_000, 20_000];
  let points = 0;
  let usedMs = 0;
  for (const [call, length] of lengths.entries()) {
    const start = t0 + call * 60 * 60 * 1000;
    for (let at = 0; at <= length; at += 10_000) {
      const charge = await chargeRoleplayTurn("rp-paid", POINTS_PREMIUM, `c${call}`, start + at);
      assert.equal(charge.ok, true);
      points += charge.charged;
    }
    usedMs += Math.floor(length / 10_000) * 10_000;
  }
  assert.ok(points * FIVE_MINUTES >= usedMs, `${points} points for ${usedMs / 60_000} minutes`);
});

test("a settled conversation that keeps going pays again rather than twice-refunded", async () => {
  // Two conversations overlapping, on a phone and a tablet. Starting the
  // second settles the first; if the first then goes on, it has nothing left
  // in hand and its next minutes are paid for again.
  const t0 = 1_700_000_000_000;
  await chargeRoleplayTurn("rp-overlap", POINTS_PREMIUM, "phone", t0);
  await chargeRoleplayTurn("rp-overlap", POINTS_PREMIUM, "phone", t0 + 60_000);
  await chargeRoleplayTurn("rp-overlap", POINTS_PREMIUM, "tablet", t0 + 90_000);
  // The tablet drew the phone's unused time. The phone, talking on, is now
  // past what it kept and must buy more.
  const phone = await chargeRoleplayTurn("rp-overlap", POINTS_PREMIUM, "phone", t0 + 120_000);
  assert.equal(phone.charged, 1);
});

test("minutes carried from the last block are still usable once the points run out", async () => {
  const free = FREE_LIFETIME_ROLEPLAY_POINTS;
  const t0 = 1_700_000_000_000;
  // Spend all but nothing: one long conversation that uses every block.
  for (let block = 0; block < free; block += 1) {
    await chargeRoleplayTurn("rp-broke", false, "long", t0 + block * FIVE_MINUTES);
  }
  // Leave it a minute into its last block, so four minutes go to the carry.
  await chargeRoleplayTurn("rp-broke", false, "long", t0 + (free - 1) * FIVE_MINUTES + 30_000);
  const next = t0 + free * FIVE_MINUTES + 60 * 60 * 1000;
  const carried = await chargeRoleplayTurn("rp-broke", false, "after", next);
  assert.equal(carried.ok, true, "the carried minutes are still there to use");
  assert.equal(carried.charged, 0);
  // Past them there is nothing left to pay with, and the conversation stops.
  const refused = await chargeRoleplayTurn("rp-broke", false, "after", next + 10 * 60_000);
  assert.equal(refused.ok, false);
  assert.equal(await roleplayCarryMs("rp-broke", next), 0, "the carry was spent, not lost");
});

test("a subscriber spends the monthly grant rather than the free allowance", async () => {
  const t0 = 1_700_000_000_000;
  const charge = await chargeRoleplayTurn("rp-premium", POINTS_PREMIUM, "s1", t0);
  assert.equal(charge.ok, true);
  assert.equal(charge.charged, 1);
  // Taken out of the same pool video imports draw on, which is the point of
  // there being one currency.
  assert.equal(await getMonthlyImportPointsUsed("rp-premium"), 1);
  assert.equal(await roleplayPointsLeft("rp-premium", POINTS_PREMIUM), 79);
  // And the free lifetime allowance is untouched, so cancelling does not hand
  // anyone a fresh fifteen minutes they already had.
  assert.equal(
    await roleplayPointsLeft("rp-premium", false),
    FREE_LIFETIME_ROLEPLAY_POINTS,
  );
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

test("a line the character wrote is kept, not only counted", async () => {
  // The bank has only ever grown by somebody drafting a line; what the app
  // actually says has been tallied and thrown away since the beginning. This
  // is the cheap half of learning from it — reading the pile is a later job,
  // and a line not written down now is simply gone.
  await noteSentenceWritten("ja", "そのお祭りは東京のどのあたりであったの？");
  await noteSentenceWritten("ja", "そのお祭りは東京のどのあたりであったの？");
  await noteSentenceWritten("ja", "どんな人と行ったの？");

  const kept = await readWrittenLines("ja");
  assert.equal(kept.length, 2, "the same words twice are one line, said twice");
  assert.equal(kept[0]!.said, 2, "and the repeated one sorts first");
  assert.match(kept[0]!.text, /お祭り/);
  assert.equal(kept[1]!.said, 1);
});

test("languages do not pool their lines", async () => {
  await noteSentenceWritten("vi", "Bạn đã đi với ai?");
  const vietnamese = await readWrittenLines("vi");
  assert.equal(vietnamese.length, 1);
  assert.ok(!vietnamese.some((line) => /お祭り/.test(line.text)));
});

test("an empty line is not a line", async () => {
  await noteSentenceWritten("th", "   ");
  assert.deepEqual(await readWrittenLines("th"), []);
});

test("video imports spend the monthly grant first, then purchased points", async () => {
  await addMonthlyImportPoints("import-buy-a", 78);
  await addPurchasedPoints("import-buy-a", 10);
  const spend = await chargeImportPoints("import-buy-a", 5, "video-buy");
  assert.deepEqual(spend, { fromGranted: 2, fromPurchased: 3 });
  assert.equal(await getMonthlyImportPointsUsed("import-buy-a"), 80);
  assert.equal(await getPurchasedPoints("import-buy-a"), 7);
  assert.deepEqual(await getBilledImportVideoIds("import-buy-a"), ["video-buy"]);
});

test("a video import both pots cannot cover charges nothing", async () => {
  await addMonthlyImportPoints("import-buy-b", 80);
  await addPurchasedPoints("import-buy-b", 2);
  assert.equal(await chargeImportPoints("import-buy-b", 3, "video-x"), null);
  assert.equal(await getPurchasedPoints("import-buy-b"), 2);
  assert.deepEqual(await getBilledImportVideoIds("import-buy-b"), []);
});

// ── Daily free talk (billing/plans.ts) ──────────────────────────────────────

import { termsFor } from "../billing/plans.ts";
import { addPurchasedPoints as buyPoints } from "./entitlementStore.ts";
import { dailyCallLeftMs } from "./entitlementStore.ts";

const LITE = termsFor("lite", Date.parse("2026-10-16T00:00:00Z"), null);
const MIN = 60_000;

test("a lite subscriber talks seven minutes a day free, then pays with bought points", async () => {
  const user = "rc:daily-lite";
  const t0 = Date.parse("2026-10-16T01:00:00Z");
  // Seven minutes of turns half a minute apart.
  let at = t0;
  let charge = await chargeRoleplayTurn(user, LITE, "d1", at, 540);
  assert.equal(charge.ok, true);
  assert.equal(charge.charged, 0);
  while ((charge.todayLeftMs ?? 0) > 0) {
    at += 30_000;
    charge = await chargeRoleplayTurn(user, LITE, "d1", at, 540);
    assert.equal(charge.ok, true);
    assert.equal(charge.charged, 0);
  }
  // Seven minutes of talk, give or take the first turn's share.
  assert.ok(at - t0 >= 6.5 * MIN && at - t0 <= 7 * MIN, String(at - t0));

  // Out of minutes and no points: the next turn is refused.
  const refused = await chargeRoleplayTurn(user, LITE, "d1", at + 30_000, 540);
  assert.equal(refused.ok, false);
  assert.equal(refused.todayLeftMs, 0);

  // With points bought, it goes on and costs a block.
  await buyPoints(user, 3);
  const paid = await chargeRoleplayTurn(user, LITE, "d1", at + 40_000, 540);
  assert.equal(paid.ok, true);
  assert.equal(paid.charged, 1);
  assert.equal(paid.left, 2);
});

test("a pause counts at most a minute, and tomorrow starts full", async () => {
  const user = "rc:daily-pause";
  const t0 = Date.parse("2026-10-16T01:00:00Z");
  await chargeRoleplayTurn(user, LITE, "p1", t0, 540);
  const afterPause = await chargeRoleplayTurn(user, LITE, "p1", t0 + 20 * MIN, 540);
  assert.equal(afterPause.ok, true);
  assert.equal(afterPause.todayLeftMs, 7 * MIN - 15_000 - MIN);

  const tomorrow = Date.parse("2026-10-17T01:00:00Z");
  assert.equal(await dailyCallLeftMs(user, LITE, "2026-10-17"), 7 * MIN);
  const fresh = await chargeRoleplayTurn(user, LITE, "p2", tomorrow, 540);
  assert.equal(fresh.todayLeftMs, 7 * MIN - 15_000);
});

test("lite has no monthly points; premium before its switch keeps 80", async () => {
  assert.equal(await roleplayPointsLeft("rc:lite-none", LITE), 0);
  assert.equal(await roleplayPointsLeft("rc:prem-80", termsFor("premium", Date.now(), null)), 80);
  assert.equal(await dailyCallLeftMs("rc:prem-80", termsFor("premium", Date.now(), null), "2026-10-16"), null);
});
