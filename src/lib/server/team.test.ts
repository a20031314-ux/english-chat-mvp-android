import { test } from "node:test";
import assert from "node:assert/strict";

// KV 접속 정보 없이 메모리로(kv.ts).
delete process.env.KV_REST_API_URL;
delete process.env.KV_REST_API_TOKEN;
delete process.env.UPSTASH_REDIS_REST_URL;
delete process.env.UPSTASH_REDIS_REST_TOKEN;
console.warn = () => {};

const { cleanSchedule, daysThisWeek, teamStreak, withoutMember, groupTtl, TEAM_TTL_SECONDS, GROUP_TTL_SECONDS } = await import("../rooms/group.ts");
const store = await import("./groupStore.ts");

const id = (c: string) => "lb_" + c.repeat(24);
const MINJI = id("a");
const YUKI = id("b");
const LUCIA = id("c");
const OMAR = id("d");
const DAY = 24 * 60 * 60 * 1000;

test("같이 한 날: 오늘·어제까지 이어진 수, 최근 7일 수", () => {
  const now = Date.parse("2026-10-19T12:00:00Z");
  assert.equal(teamStreak(["2026-10-17", "2026-10-18", "2026-10-19"], now), 3);
  assert.equal(teamStreak(["2026-10-17", "2026-10-18"], now), 2, "오늘 아직이면 어제까지");
  assert.equal(teamStreak(["2026-10-16"], now), 0);
  assert.equal(daysThisWeek(["2026-10-12", "2026-10-13", "2026-10-19"], now), 2);
  assert.equal(groupTtl({ team: { kind: "team", since: 0 } }), TEAM_TTL_SECONDS);
  assert.equal(groupTtl({}), GROUP_TTL_SECONDS);
});

test("정기 모임: 요일·시각·시간대 검사", () => {
  assert.deepEqual(cleanSchedule({ days: [2, 4, 2, 9], time: "21:00", tz: "Asia/Seoul" }), { days: [2, 4], time: "21:00", tz: "Asia/Seoul" });
  assert.deepEqual(cleanSchedule({ days: [1], time: "07:30", tz: "Not/AZone" }), { days: [1], time: "07:30", tz: "UTC" });
  assert.equal(cleanSchedule({ days: [], time: "21:00" }), null);
  assert.equal(cleanSchedule({ days: [1], time: "25:00" }), null);
});

test("나간 사람의 것 빼기: 공유·물은 것·그 사람이 한 말, 통화 기록에선 그 사람 줄만", () => {
  const items = [
    { id: "1", kind: "share" as const, at: 1, by: YUKI, text: "お疲れさま" },
    { id: "2", kind: "phrase" as const, at: 2, by: MINJI, text: "よろしくね", from: YUKI },
    { id: "3", kind: "phrase" as const, at: 3, by: LUCIA, text: "¿qué tal?", from: MINJI },
    { id: "4", kind: "session" as const, at: 4, by: YUKI, text: "2", lines: [{ from: YUKI, nickname: "Yuki", text: "はい" }, { from: MINJI, nickname: "민지", text: "네" }] },
    { id: "5", kind: "session" as const, at: 5, by: MINJI, text: "1", lines: [{ from: YUKI, nickname: "Yuki", text: "じゃあね" }] },
  ];
  const kept = withoutMember(items, YUKI);
  assert.deepEqual(kept.map((item) => item.id), ["3", "4"]);
  assert.deepEqual(kept[1].lines?.map((line) => line.text), ["네"]);
  assert.equal(kept[1].by, "");
});

test("팀으로 만들기(방장만) → 물은 줄·통화 기록이 워크스페이스에, 같이 한 날 기록", async () => {
  const group = await store.createGroup({ owner: MINJI, name: "스터디 ภาษาไทย", languages: ["th", "ko"], invite: [YUKI, LUCIA] });
  await store.answerInvite(YUKI, group.id, true);
  await store.answerInvite(LUCIA, group.id, true);
  assert.equal(await store.makeTeam(YUKI, group.id), "NOT_OWNER");
  const team = await store.makeTeam(MINJI, group.id);
  assert.ok(typeof team === "object" && team.team?.kind === "team");
  assert.equal(await store.makeTeam(MINJI, group.id), "ALREADY");

  const sent = await store.sendToGroup({ from: YUKI, id: group.id, text: "สวัสดีครับ ยินดีที่ได้รู้จัก" });
  assert.ok(sent.ok);
  if (!sent.ok) return;
  await store.sendToGroup({ from: LUCIA, id: group.id, text: "¿Qué significa?", quoteSeq: sent.message.seq, ask: true });
  await store.sendToGroup({ from: MINJI, id: group.id, text: "답장", quoteSeq: sent.message.seq, ask: false });
  const fresh = (await store.readGroup(group.id))!;
  await store.logGroupCall(fresh, MINJI, "abcdef", [
    { from: YUKI, nickname: "Yuki", text: "ขอบคุณครับ" },
    { from: LUCIA, nickname: "Lucía", text: "gracias" },
  ]);
  const space = await store.readSpace(group.id);
  assert.deepEqual(space.items.map((item) => item.kind), ["session", "phrase"], "답하기는 남지 않고 묻기만");
  assert.equal(space.items[1].text, "สวัสดีครับ ยินดีที่ได้รู้จัก");
  assert.equal(space.items[1].from, YUKI);
  assert.equal(space.days.length, 1);

  const shared = await store.addSpaceItem(fresh, { kind: "share", by: LUCIA, text: "echar de menos", note: "그리워하다" });
  assert.equal(await store.removeSpaceItem(fresh, MINJI, shared.id), false, "남의 공유는 못 지움");
  assert.equal(await store.removeSpaceItem(fresh, LUCIA, shared.id), true);

  // Yuki가 나가면 Yuki가 한 말·줄이 빠진다.
  await store.leaveGroup(YUKI, group.id);
  const after = await store.readSpace(group.id);
  assert.deepEqual(after.items.map((item) => item.kind), ["session"]);
  assert.deepEqual(after.items[0].lines?.map((line) => line.text), ["gracias"]);

  const updated = await store.updateTeam(LUCIA, group.id, { goal: "매일 한 문장", schedule: { days: [2], time: "21:00", tz: "Asia/Seoul" } });
  assert.equal(updated?.team?.goal, "매일 한 문장");
  assert.equal(await store.updateTeam(OMAR, group.id, { goal: "x" }), null, "팀 밖 사람은 못 고침");
});

test("러닝메이트: 신청 → 상대도 신청하면 수락으로 합쳐지고, 두 사람 사이 메이트는 하나", async () => {
  const first = await store.requestMate(OMAR, LUCIA, ["ar", "es"]);
  assert.equal(first.state, "pending");
  assert.equal(first.group.team?.kind, "mate");
  assert.deepEqual(first.group.invited, [LUCIA]);
  const again = await store.requestMate(OMAR, LUCIA, ["ar", "es"]);
  assert.equal(again.group.id, first.group.id);
  assert.equal(again.state, "pending");
  const back = await store.requestMate(LUCIA, OMAR, ["es", "ar"]);
  assert.equal(back.group.id, first.group.id);
  assert.equal(back.state, "joined");
  assert.equal((await store.requestMate(OMAR, LUCIA, [])).state, "mates");
  const lucia = await store.myGroups(LUCIA);
  assert.ok(lucia.some((row) => row.group.id === first.group.id && !row.invite));
});

test("계정 삭제: 모든 팀에서 나가고 받은 신청은 거절", async () => {
  const mate = await store.requestMate(MINJI, OMAR, ["ko", "ar"]);
  await store.leaveAllGroups(OMAR);
  const group = await store.readGroup(mate.group.id);
  assert.ok(group && !group.invited.includes(OMAR) && !group.members.includes(OMAR));
  assert.ok((await store.myGroups(OMAR)).every((row) => !row.group.members.includes(OMAR)));
});
