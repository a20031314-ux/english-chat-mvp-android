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
import { kvIncrBy, kvSetJson } from "./kv.ts";
import { getPointPart } from "./entitlementStore.ts";
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
const HALF_MINUTE = 30_000;

/** 같은 대화를 간격 `step`으로 `until`까지 이어 가며 쓴 포인트 합. */
async function talk(user: string, plan: boolean | ReturnType<typeof termsFor>, session: string, start: number, until: number, step = HALF_MINUTE) {
  let charged = 0;
  let last: Awaited<ReturnType<typeof chargeRoleplayTurn>> | null = null;
  for (let at = 0; at <= until; at += step) {
    last = await chargeRoleplayTurn(user, plan, session, start + at);
    charged += last.charged;
    if (!last.ok) break;
  }
  return { charged, last: last! };
}

const close = (actual: number, expected: number, message?: string) =>
  assert.ok(Math.abs(actual - expected) < 0.0015, `${message ?? ""} ${actual} != ${expected}`);

test("call learning is charged by the talk, in fractions of a point", async () => {
  // 쓴 만큼(2026-10-23): 첫 턴은 15초, 그다음은 지난 턴 뒤 흐른 시간. 1포인트 = 5분.
  const free = FREE_LIFETIME_ROLEPLAY_POINTS;
  const t0 = 1_700_000_000_000;
  const first = await chargeRoleplayTurn("rp-free", false, "s1", t0);
  assert.equal(first.ok, true);
  close(first.charged, 0.05, "the first turn counts fifteen seconds");
  close(first.left, free - 0.05);

  const next = await chargeRoleplayTurn("rp-free", false, "s1", t0 + HALF_MINUTE);
  close(next.charged, 0.1, "half a minute is a tenth of a point");
  close(next.left, free - 0.15);
});

test("the free allowance runs to zero and then the call stops", async () => {
  const free = FREE_LIFETIME_ROLEPLAY_POINTS;
  const t0 = 1_700_000_000_000;
  const { charged, last } = await talk("rp-free-end", false, "long", t0, (free * 5 + 2) * 60_000);
  assert.equal(last.ok, false, "the turn after the allowance is refused");
  close(charged, free, "every bit of the allowance was used");
  assert.equal(last.left, 0);
  // A new conversation does not bring it back.
  const after = await chargeRoleplayTurn("rp-free-end", false, "again", t0 + 24 * 60 * 60 * 1000);
  assert.equal(after.ok, false, "the allowance is for the life of the account");
});

test("the last fraction is spent rather than refused", async () => {
  // 0.03 남았는데 턴이 0.1을 원하면 0.03을 쓰고 받는다 — 거절은 잔액이 0일 때만.
  const t0 = 1_700_000_000_000;
  await talk("rp-tail", false, "a", t0, (FREE_LIFETIME_ROLEPLAY_POINTS * 5 - 1) * 60_000 + 51_000, 1_000 * 51);
  const before = await roleplayPointsLeft("rp-tail", false);
  assert.ok(before > 0 && before < 1, String(before));
  const last = await chargeRoleplayTurn("rp-tail", false, "a", t0 + 24 * 60 * 60 * 1000);
  assert.equal(last.ok, true);
  assert.equal(last.left, 0);
});

test("a pause counts at most a minute against points", async () => {
  const t0 = 1_700_000_000_000;
  await chargeRoleplayTurn("rp-clock", POINTS_PREMIUM, "one", t0);
  const later = await chargeRoleplayTurn("rp-clock", POINTS_PREMIUM, "one", t0 + 60 * 60 * 1000);
  assert.equal(later.ok, true);
  close(later.charged, 0.2, "an hour away is one minute");
});

test("three-minute calls cost three minutes each", async () => {
  // 열 번의 3분 통화(15초 간격 턴). 각 통화: 첫 턴 15초 + 3분 = 3분 15초.
  const t0 = 1_700_000_000_000;
  let points = 0;
  for (let call = 0; call < 10; call += 1) {
    const { charged } = await talk("rp-short", POINTS_PREMIUM, `call-${call}`, t0 + call * 60 * 60 * 1000, 3 * 60_000, 15_000);
    points += charged;
  }
  close(points, 10 * (3.25 / 5), "ten calls of 3:15 each");
});

test("a subscriber opens whole points from the grant and keeps the rest as a fraction", async () => {
  const t0 = 1_700_000_000_000;
  const charge = await chargeRoleplayTurn("rp-premium", POINTS_PREMIUM, "s1", t0);
  assert.equal(charge.ok, true);
  close(charge.charged, 0.05);
  // 정수 1포인트를 월 지급분에서 꺼냈고 0.95가 남아 있다.
  assert.equal(await getMonthlyImportPointsUsed("rp-premium"), 1);
  close(await roleplayPointsLeft("rp-premium", POINTS_PREMIUM), 79.95);
  // 무료 평생 체험은 건드리지 않았다(꺼내 둔 0.95는 어느 요금에서든 쓸 수 있는 몫).
  close(await roleplayPointsLeft("rp-premium", false), FREE_LIFETIME_ROLEPLAY_POINTS + 0.95);
});

test("time an old five-minute block already bought is given back as a fraction", async () => {
  // 배포 때 진행 중이던 예전 대화: 블록 하나(5분)를 사 두고 1분 썼다 → 남은 시간(유예 30초 뺀 3분 30초)이 0.7포인트로.
  const t0 = 1_700_000_000_000;
  const user = "rc:legacy-block";
  await buyPoints(user, 2);
  const lite = termsFor("lite", t0, null);
  await kvSetJson(`points:rpsession:${user}:old`, { startedAt: t0, charged: 1, paidMs: FIVE_MINUTES, lastTurnAt: t0 + 60_000 }, 3600);
  await kvSetJson(`points:rplast:${user}`, { sessionId: "old" }, 3600);
  // 다음 날(오늘 무료 분 없음을 보려고 무료 분을 다 쓴 뒤가 아니라, 새 대화의 첫 턴만 본다).
  const charge = await chargeRoleplayTurn(user, { ...lite, dailyCallMinutes: null }, "new", t0 + 10 * 60_000);
  assert.equal(charge.ok, true);
  close(charge.left, 2 + 0.7 - 0.05);
});

test("old carried minutes become part of the balance", async () => {
  const t0 = Date.parse("2026-10-16T01:00:00Z");
  const user = "rc:legacy-carry";
  const month = "2026-10";
  await kvIncrBy(`points:rpcarry:${user}:${month}`, 4 * 60_000, 3600);
  const charge = await chargeRoleplayTurn(user, false, "x", t0);
  close(charge.left, FREE_LIFETIME_ROLEPLAY_POINTS + 0.8 - 0.05);
  assert.equal(await roleplayCarryMs(user, t0), 0, "the carry was moved, not lost");
});

test("nobody in particular is never charged", async () => {
  const t0 = 1_700_000_000_000;
  for (let session = 0; session < 6; session += 1) {
    const charge = await chargeRoleplayTurn(SHARED_ANONYMOUS_ID, false, `anon-${session}`, t0 + session * 20 * 60 * 1000);
    assert.equal(charge.ok, true, `session ${session} should be served`);
    assert.equal(charge.charged, 0, "and nothing taken from anyone");
  }
  const named = await chargeRoleplayTurn("rc:someone", false, "s1", t0);
  close(named.charged, 0.05);
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
  // 4.334포인트(13분 영상): 정수 5를 꺼내고 0.666이 남는다.
  const spend = await chargeImportPoints("import-buy-a", 4.334, "video-buy");
  assert.deepEqual(spend, { fromGranted: 2, fromPurchased: 3 });
  assert.equal(await getMonthlyImportPointsUsed("import-buy-a"), 80);
  assert.equal(await getPurchasedPoints("import-buy-a"), 7);
  assert.equal(await getPointPart("import-buy-a"), 666);
  assert.deepEqual(await getBilledImportVideoIds("import-buy-a"), ["video-buy"]);
  // 다음 영상(0.5포인트)은 남은 부분에서 — 정수 포인트는 그대로.
  const second = await chargeImportPoints("import-buy-a", 0.5, "video-two");
  assert.deepEqual(second, { fromGranted: 0, fromPurchased: 0 });
  assert.equal(await getPurchasedPoints("import-buy-a"), 7);
  assert.equal(await getPointPart("import-buy-a"), 166);
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

  // With points bought, it goes on and costs what was talked (10초 = 0.034).
  await buyPoints(user, 3);
  const paid = await chargeRoleplayTurn(user, LITE, "d1", at + 40_000, 540);
  assert.equal(paid.ok, true);
  close(paid.charged, 0.034);
  close(paid.left, 3 - 0.034);
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
