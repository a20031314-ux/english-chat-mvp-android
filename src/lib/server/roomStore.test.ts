import { test } from "node:test";
import assert from "node:assert/strict";
import { MAX_SPEAKERS } from "../rooms/protocol.ts";
import { addLine, createRoom, isInviteCode, joinRoom, leaveRoom, listRooms, poll, sendSignal } from "./roomStore.ts";

// KV 접속 정보 없이 메모리로 돈다(kv.ts). 운영 저장소에 닿지 않는다.
delete process.env.KV_REST_API_URL;
delete process.env.UPSTASH_REDIS_REST_URL;

test("입장 코드: 환경 변수가 없으면 기본 코드, 대소문자 무시", () => {
  delete process.env.ROOM_INVITE_CODES;
  assert.equal(isInviteCode("lb2026"), true);
  assert.equal(isInviteCode("nope"), false);
  process.env.ROOM_INVITE_CODES = "alpha, beta";
  assert.equal(isInviteCode("BETA"), true);
  assert.equal(isInviteCode("LB2026"), false);
  delete process.env.ROOM_INVITE_CODES;
});

test("방 만들기 → 들어가기 → 신호와 자막 → 나가기", async () => {
  const room = await createRoom({ name: "日本語 ↔ 한국어", languages: ["ja", "ko"], hostPeerId: "peer_host0001" });
  const a = await joinRoom({ id: room.id, peerId: "peer_host0001", nickname: "민지", wantRole: "speaker" });
  const b = await joinRoom({ id: room.id, peerId: "peer_guest001", nickname: "Yuki", wantRole: "speaker" });
  assert.ok(a.ok && b.ok);

  await sendSignal(room.id, { from: "peer_host0001", to: "peer_guest001", kind: "offer", data: "sdp", at: 1 });
  const first = await poll({ id: room.id, peerId: "peer_guest001", since: 0 });
  assert.ok(first);
  assert.equal(first.members.length, 2);
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

  await leaveRoom(room.id, "peer_guest001");
  const left = await poll({ id: room.id, peerId: "peer_host0001", since: 0 });
  assert.deepEqual(left?.members.map((member) => member.peerId), ["peer_host0001"]);
});

test("말하기 자리가 차면 듣는 사람으로 들어간다", async () => {
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
