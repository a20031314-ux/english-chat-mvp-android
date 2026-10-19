import { test } from "node:test";
import assert from "node:assert/strict";

// 운영 저장소에 닿지 않게 메모리 저장소로.
delete process.env.KV_REST_API_URL;
delete process.env.KV_REST_API_TOKEN;
delete process.env.UPSTASH_REDIS_REST_URL;
delete process.env.UPSTASH_REDIS_REST_TOKEN;
process.env.INVITE_EARLY_LIMIT = "2";
console.warn = () => {};

const rules = await import("../invite/rewards.ts");
const links = await import("./inviteLinkStore.ts");
const rewards = await import("./inviteRewardStore.ts");
const accounts = await import("./accountStore.ts");
const points = await import("./entitlementStore.ts");

const DAY = 24 * 60 * 60 * 1000;
const T0 = Date.parse("2026-10-20T03:00:00Z"); // 한국 12시

test("규칙: 7일 안 서로 다른 2일, 같은 날 두 번은 한 번, 7일 넘으면 끝, 오래된 계정은 대상 아님", () => {
  const fresh = rules.newJoinRecord("inviter", new Date(T0 - DAY).toISOString(), T0);
  assert.equal(fresh.eligible, true);
  assert.equal(rules.newJoinRecord("inviter", new Date(T0 - 3 * DAY).toISOString(), T0).eligible, false);
  let step = rules.noteDay(fresh, "2026-10-20", T0);
  assert.equal(step.reward, false);
  const same = rules.noteDay(step.record, "2026-10-20", T0 + 1000);
  assert.equal(same.record, step.record);
  step = rules.noteDay(step.record, "2026-10-22", T0 + 2 * DAY);
  assert.equal(step.reward, true);
  assert.equal(step.record.done, "rewarded");
  const late = rules.noteDay(fresh, "2026-10-28", T0 + 8 * DAY);
  assert.equal(late.record.done, "expired");
  assert.equal(late.reward, false);
});

test("규칙: 초기 혜택은 횟수로 끝, 단계 3명·10명", () => {
  assert.deepEqual(rules.rewardFor(1000, 1000), { inviter: 20, invitee: 10, early: true });
  assert.deepEqual(rules.rewardFor(1001, 1000), { inviter: 10, invitee: 5, early: false });
  assert.equal(rules.milestoneReached(2, 3)?.tier, "plus");
  assert.equal(rules.milestoneReached(9, 10)?.tier, "premium");
  assert.equal(rules.milestoneReached(3, 4), null);
  assert.equal(rules.nextMilestone(4)?.friends, 10);
  assert.equal(rules.nextMilestone(10), null);
});

async function makeAccount(name: string): Promise<{ id: string; data: string }> {
  const result = await accounts.createPasswordAccount(name, "test-pass-1234", `rc:${name}`);
  assert.ok(result && "account" in result, name);
  const account = (result as { account: { id: string; dataUserId: string } }).account;
  return { id: account.id, data: account.dataUserId };
}

test("저장소: 이틀 쓰면 둘 다 포인트·소식, 초기 2번 뒤 작은 숫자, 3명이면 플러스 7일", async () => {
  const minji = await makeAccount("minjiinvite");
  const friends = await Promise.all(["yukiinv", "luciainv", "omarinv"].map(makeAccount));
  for (const [index, friend] of friends.entries()) {
    const start = T0 + index * 1000;
    assert.equal(await links.noteJoined(minji.id, friend.id, start - 60_000, start), true);
    assert.equal(await rewards.noteInviteeActive(friend.id, start), null, "첫날은 아직");
    const paid = await rewards.noteInviteeActive(friend.id, start + DAY);
    assert.ok(paid, `둘째 날 보상 ${index}`);
    assert.equal(await rewards.noteInviteeActive(friend.id, start + 2 * DAY), null, "두 번 주지 않음");
  }
  // 초기 혜택 2번(20+20), 그 뒤 10.
  assert.equal(await points.getPurchasedPoints(minji.data), 50);
  assert.equal(await points.getPurchasedPoints(friends[0].data), 10);
  assert.equal(await points.getPurchasedPoints(friends[2].data), 5);
  const status = await rewards.readInviteStatus(minji.id, true);
  assert.equal(status.friends, 3);
  assert.equal(status.points, 50);
  assert.equal(status.earlyLeft, 0);
  assert.deepEqual(status.reward, { inviter: 10, invitee: 5, early: false });
  assert.equal(status.pass?.tier, "plus");
  assert.ok(status.news.some((row) => row.kind === "pass" && row.tier === "plus" && row.days === 7));
  assert.equal(status.news.filter((row) => row.kind === "inviter").length, 3);
  assert.deepEqual((await rewards.readInviteStatus(minji.id, true)).news, [], "소식은 한 번만");
  const friendNews = await rewards.readInviteStatus(friends[1].id, true);
  assert.deepEqual(friendNews.news, [{ kind: "invitee", points: 10 }]);
});

test("저장소: 가입한 지 오래된 계정은 보상 없음, 자기 자신 초대 안 됨", async () => {
  const a = await makeAccount("oldinviter");
  const b = await makeAccount("oldfriend");
  await links.noteJoined(a.id, b.id, T0 - 5 * DAY, T0);
  assert.equal(await rewards.noteInviteeActive(b.id, T0), null);
  assert.equal(await rewards.noteInviteeActive(b.id, T0 + DAY), null);
  assert.equal(await links.noteJoined(a.id, a.id, T0, T0), false);
});
