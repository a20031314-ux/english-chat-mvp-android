import { test } from "node:test";
import assert from "node:assert/strict";
import { MAX_SPEAKERS } from "../rooms/protocol.ts";
import { addLine, closeRoom, createRoom, grantRole, isInviteCode, joinRoom, leaveRoom, listRooms, poll, sendSignal } from "./roomStore.ts";

// KV 접속 정보 없이 메모리로 돈다(kv.ts). 운영 저장소에 닿지 않는다.
delete process.env.KV_REST_API_URL;
delete process.env.UPSTASH_REDIS_REST_URL;

test("입장 코드: 환경 변수가 없으면 기본 코드, 대소문자 무시", () => {
  delete process.env.ROOM_INVITE_CODES;
  assert.equal(isInviteCode("lb2026"), true);
  assert.equal(isInviteCode("nope"), false);
  // 코드 없이 오는 2.68 탭은 통과(환경 변수가 없을 때).
  assert.equal(isInviteCode(undefined), true);
  assert.equal(isInviteCode(""), true);
  process.env.ROOM_INVITE_CODES = "alpha, beta";
  assert.equal(isInviteCode("BETA"), true);
  assert.equal(isInviteCode("LB2026"), false);
  assert.equal(isInviteCode(undefined), false);
  delete process.env.ROOM_INVITE_CODES;
});

test("방 만들기 → 들어가기 → 신호와 자막 → 나가기", async () => {
  const room = await createRoom({ name: "日本語 ↔ 한국어", languages: ["ja", "ko"], hostPeerId: "peer_host0001" });
  const a = await joinRoom({ id: room.id, peerId: "peer_host0001", nickname: "민지", wantRole: "speaker" });
  const b = await joinRoom({ id: room.id, peerId: "peer_guest001", nickname: "Yuki", wantRole: "speaker" });
  assert.ok(a.ok && b.ok);
  // 방장이 있으면 손님은 듣는 사람으로 들어가 손을 든다.
  assert.equal(a.member.role, "speaker");
  assert.equal(b.member.role, "listener");
  assert.equal(b.member.hand, true);
  // 손님이 스스로 자리에 오르려 해도 안 된다.
  const self = await poll({ id: room.id, peerId: "peer_guest001", since: 0, role: "speaker", hand: true });
  assert.ok(self && self !== "KICKED");
  assert.equal(self.members.find((m) => m.peerId === "peer_guest001")?.role, "listener");
  // 방장만 올릴 수 있다.
  assert.equal(await grantRole({ id: room.id, hostPeerId: "peer_guest001", target: "peer_guest001", role: "speaker" }), "NOT_HOST");
  assert.equal(await grantRole({ id: room.id, hostPeerId: "peer_host0001", target: "peer_guest001", role: "speaker" }), "ok");

  await sendSignal(room.id, { from: "peer_host0001", to: "peer_guest001", kind: "offer", data: "sdp", at: 1 });
  const first = await poll({ id: room.id, peerId: "peer_guest001", since: 0 });
  assert.ok(first);
  assert.equal(first.members.length, 2);
  // 방장의 결정은 손님의 다음 물음에서 반영되고, 손은 내려간다.
  const guest = first.members.find((m) => m.peerId === "peer_guest001");
  assert.equal(guest?.role, "speaker");
  assert.equal(guest?.hand, false);
  assert.deepEqual(first.signals.map((signal) => signal.kind), ["offer"]);
  // 신호함은 읽으면 비워진다.
  const again = await poll({ id: room.id, peerId: "peer_guest001", since: 0 });
  assert.equal(again?.signals.length, 0);

  const said = await addLine(room.id, {
    peerId: "peer_guest001",
    nickname: "Yuki",
    text: "週末は何をしましたか？",
    startedAt: Date.now(),
    endedAt: Date.now(),
  });
  const after = await poll({ id: room.id, peerId: "peer_host0001", since: said.seq - 1 });
  assert.deepEqual(after?.lines.map((row) => row.text), ["週末は何をしましたか？"]);
  const none = await poll({ id: room.id, peerId: "peer_host0001", since: said.seq });
  assert.equal(none?.lines.length, 0);

  assert.ok((await listRooms()).some((row) => row.id === room.id && row.speakers === 2));

  // 손으로 쓴 댓글도 같은 흐름에(듣는 사람도 쓸 수 있는 건 route가 정한다).
  const typed = await addLine(room.id, { kind: "text", peerId: "peer_host0001", nickname: "민지", text: "좋아요!", startedAt: Date.now(), endedAt: Date.now() });
  assert.equal(typed.kind, "text");

  // 방장이 내리면, 앱이 계속 speaker를 바라도 내려간다.
  assert.equal(await grantRole({ id: room.id, hostPeerId: "peer_host0001", target: "peer_guest001", role: "listener" }), "ok");
  const down = await poll({ id: room.id, peerId: "peer_guest001", since: 0, role: "speaker" });
  assert.equal(down?.members.find((m) => m.peerId === "peer_guest001")?.role, "listener");

  await leaveRoom(room.id, "peer_guest001");
  const left = await poll({ id: room.id, peerId: "peer_host0001", since: 0 });
  assert.deepEqual(left?.members.map((member) => member.peerId), ["peer_host0001"]);
});

test("방장이 없는 방은 바로 앉고, 자리가 차면 듣는 사람으로", async () => {
  const room = await createRoom({ name: "full", languages: [], hostPeerId: "peer_full0000" });
  for (let i = 0; i < MAX_SPEAKERS; i += 1) {
    const joined = await joinRoom({ id: room.id, peerId: `peer_full000${i}x`, nickname: `s${i}`, wantRole: "speaker" });
    assert.ok(joined.ok && joined.member.role === "speaker");
  }
  const late = await joinRoom({ id: room.id, peerId: "peer_lateone1", nickname: "late", wantRole: "speaker" });
  assert.ok(late.ok);
  assert.equal(late.member.role, "listener");
});

test("없는 방", async () => {
  const result = await joinRoom({ id: "zzzzzz", peerId: "peer_nobody01", nickname: "x", wantRole: "speaker" });
  assert.deepEqual(result, { ok: false, error: "NO_ROOM" });
});

test("방장 계정으로 다시 들어오면 방장, 내보낸 계정은 못 들어온다", async () => {
  const host = "lb_" + "1".repeat(24);
  const guest = "lb_" + "2".repeat(24);
  const room = await createRoom({ name: "계정 방", languages: ["ja"], hostPeerId: "peer_oldhost1", hostAccountId: host, hostNickname: "민지" });
  const back = await joinRoom({ id: room.id, peerId: "peer_newhost1", nickname: "민지", wantRole: "speaker", accountId: host, langs: ["ja", "ko"] });
  assert.ok(back.ok && back.member.role === "speaker" && back.meta.hostPeerId === "peer_newhost1");
  assert.deepEqual(back.ok && back.member.langs, ["ja", "ko"]);
  const g = await joinRoom({ id: room.id, peerId: "peer_guest002", nickname: "Omar", wantRole: "speaker", accountId: guest });
  assert.ok(g.ok && g.member.role === "listener");
  assert.equal(await grantRole({ id: room.id, hostPeerId: "peer_newhost1", target: "peer_guest002", role: "out" }), "ok");
  assert.equal(await poll({ id: room.id, peerId: "peer_guest002", since: 0 }), "KICKED");
  const again = await joinRoom({ id: room.id, peerId: "peer_guest003", nickname: "Omar", wantRole: "listener", accountId: guest });
  assert.deepEqual(again, { ok: false, error: "BANNED" });
  const list = await listRooms();
  const row = list.find((r) => r.id === room.id);
  assert.equal(row?.faces[0]?.accountId, host);
});

test("아무도 없는 방은 방장에게도 목록에서 빠지지만, 방장이 다시 들어오면 방장 자리", async () => {
  const room = await createRoom({ name: "English ↔ 한국어", languages: ["en", "ko"], hostPeerId: "peer_alone001", hostAccountId: "acct_host_alone" });
  await joinRoom({ id: room.id, peerId: "peer_alone001", nickname: "민지", wantRole: "speaker", accountId: "acct_host_alone" });
  await leaveRoom(room.id, "peer_alone001");
  // 만든 지 1분이 지난 것처럼.
  const realNow = Date.now;
  Date.now = () => realNow() + 120_000;
  try {
    const forHost = await listRooms("acct_host_alone");
    const forOther = await listRooms("acct_someone_else");
    assert.equal(forHost.some((r) => r.id === room.id), false);
    assert.equal(forOther.some((r) => r.id === room.id), false);
    assert.equal((await listRooms()).some((r) => r.id === room.id), false);
  } finally {
    Date.now = realNow;
  }
  // 방장 계정으로 다시 들어오면 새 이름표로 방장, 바로 말하기 자리.
  const back = await joinRoom({ id: room.id, peerId: "peer_alone002", nickname: "민지", wantRole: "speaker", accountId: "acct_host_alone" });
  assert.ok(back.ok);
  assert.equal(back.member.role, "speaker");
  assert.equal(back.meta.hostPeerId, "peer_alone002");
});

test("방장은 듣는 자리로 내려가지 않는다", async () => {
  const room = await createRoom({ name: "Español ↔ 日本語", languages: ["es", "ja"], hostPeerId: "peer_hostdown1" });
  await joinRoom({ id: room.id, peerId: "peer_hostdown1", nickname: "Lucía", wantRole: "speaker" });
  await joinRoom({ id: room.id, peerId: "peer_guestdn01", nickname: "Yuki", wantRole: "listener" });
  const host = await poll({ id: room.id, peerId: "peer_hostdown1", since: 0, role: "listener" });
  assert.ok(host && host !== "KICKED");
  assert.equal(host.members.find((m) => m.peerId === "peer_hostdown1")?.role, "speaker");
  // 손님은 그대로 내려갈 수 있다.
  await grantRole({ id: room.id, hostPeerId: "peer_hostdown1", target: "peer_guestdn01", role: "speaker" });
  await poll({ id: room.id, peerId: "peer_guestdn01", since: 0 });
  const guest = await poll({ id: room.id, peerId: "peer_guestdn01", since: 0, role: "listener" });
  assert.ok(guest && guest !== "KICKED");
  assert.equal(guest.members.find((m) => m.peerId === "peer_guestdn01")?.role, "listener");
});

test("방 닫기: 남은 사람의 물음은 없음(앱은 '방이 닫혔어요'), 목록·들어가기에서도 사라진다", async () => {
  const room = await createRoom({ name: "日本語 ↔ Español", languages: ["ja", "es"], hostPeerId: "peer_close001", hostAccountId: "acct_host_close" });
  await joinRoom({ id: room.id, peerId: "peer_close001", nickname: "Yuki", wantRole: "speaker", accountId: "acct_host_close" });
  await joinRoom({ id: room.id, peerId: "peer_close002", nickname: "Lucía", wantRole: "listener", accountId: "acct_guest_close" });
  assert.ok((await listRooms()).some((r) => r.id === room.id));
  await leaveRoom(room.id, "peer_close001");
  await closeRoom(room.id);
  assert.equal(await poll({ id: room.id, peerId: "peer_close002", since: 0 }), null);
  assert.equal((await listRooms()).some((r) => r.id === room.id), false);
  const late = await joinRoom({ id: room.id, peerId: "peer_close003", nickname: "Omar", wantRole: "listener" });
  assert.deepEqual(late, { ok: false, error: "NO_ROOM" });
});

test("목록을 언어 조합으로: 순서 상관없이, 하나만 주면 그 언어가 든 방", async () => {
  const enKo = await createRoom({ name: "English ↔ 한국어 filter", languages: ["ko", "en"], hostPeerId: "peer_filter01" });
  const jaKo = await createRoom({ name: "日本語 ↔ 한국어 filter", languages: ["ja", "ko"], hostPeerId: "peer_filter02" });
  await joinRoom({ id: enKo.id, peerId: "peer_filter01", nickname: "Ann", wantRole: "speaker" });
  await joinRoom({ id: jaKo.id, peerId: "peer_filter02", nickname: "Yuki", wantRole: "speaker" });
  const ids = async (langs: string[]) => (await listRooms(null, langs)).map((room) => room.id);
  assert.ok((await ids(["en", "ko"])).includes(enKo.id));
  assert.ok(!(await ids(["en", "ko"])).includes(jaKo.id));
  const ko = await ids(["ko"]);
  assert.ok(ko.includes(enKo.id) && ko.includes(jaKo.id));
  assert.equal((await ids(["th"])).includes(enKo.id), false);
});
