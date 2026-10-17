import { test } from "node:test";
import assert from "node:assert/strict";
import {
  byPerson,
  contextBefore,
  isPeerId,
  isRoomId,
  liveMembers,
  mergeLines,
  newRoomId,
  overlapsPrevious,
  shouldInitiate,
  timeline,
  canSeatFreely,
  raisedHands,
  type RoomLine,
  type RoomMember,
} from "./protocol.ts";

const line = (seq: number, peerId: string, startedAt: number, endedAt: number, text: string): RoomLine => ({
  seq,
  peerId,
  nickname: peerId.toUpperCase(),
  text,
  startedAt,
  endedAt,
});

test("방 id는 6자, 헷갈리는 글자 없음", () => {
  for (let i = 0; i < 50; i += 1) {
    const id = newRoomId();
    assert.ok(isRoomId(id), id);
    assert.doesNotMatch(id, /[01ilo]/);
  }
  assert.equal(isRoomId("ABCDEF"), false);
  assert.equal(isPeerId("short"), false);
  assert.equal(isPeerId("peer_abc12345"), true);
});

test("연결은 id가 작은 쪽만 청한다(양쪽이 같은 답)", () => {
  assert.equal(shouldInitiate("aaa", "bbb"), true);
  assert.equal(shouldInitiate("bbb", "aaa"), false);
});

test("대화 보기: 받은 순서가 아니라 말을 시작한 순서", () => {
  // 일본어(띄어쓰기 없음)와 스페인어 줄이 늦게 도착해도 시작 시각대로.
  const lines = [
    line(1, "b", 2_000, 3_000, "¿Qué tal el fin de semana?"),
    line(2, "a", 1_000, 2_500, "週末は京都に行きました。"),
    line(3, "c", 2_000, 2_200, "Sí"),
  ];
  const ordered = timeline(lines);
  assert.deepEqual(ordered.map((row) => row.seq), [2, 1, 3]);
  assert.equal(overlapsPrevious(ordered, 0), false);
  assert.equal(overlapsPrevious(ordered, 1), true); // b가 a 말 끝나기 전에 시작
  assert.equal(overlapsPrevious(ordered, 2), true);
});

test("같은 사람이 이어 말한 건 겹침이 아니다", () => {
  const ordered = timeline([line(1, "a", 0, 2_000, "Hola"), line(2, "a", 1_500, 3_000, "otra vez")]);
  assert.equal(overlapsPrevious(ordered, 1), false);
});

test("사람별 보기: 처음 말한 순서로 사람, 각자 시간 순서", () => {
  const groups = byPerson([
    line(1, "b", 5_000, 6_000, "two"),
    line(2, "a", 1_000, 2_000, "one"),
    line(3, "b", 3_000, 4_000, "zero"),
  ]);
  assert.deepEqual(groups.map((group) => group.peerId), ["a", "b"]);
  assert.deepEqual(groups[1].lines.map((row) => row.text), ["zero", "two"]);
});

test("같은 줄은 한 번만 더한다", () => {
  const have = [line(1, "a", 0, 1, "x")];
  const merged = mergeLines(have, [line(1, "a", 0, 1, "x"), line(2, "b", 2, 3, "y")]);
  assert.deepEqual(merged.map((row) => row.seq), [1, 2]);
  assert.equal(mergeLines(merged, []), merged);
});

test("번역 맥락은 어느 보기에서든 시간 순서 앞 줄, 이름 포함", () => {
  const lines = [
    line(3, "a", 3_000, 3_500, "c"),
    line(1, "a", 1_000, 1_500, "a"),
    line(2, "b", 2_000, 2_500, "b"),
  ];
  assert.deepEqual(contextBefore(lines, 3), ["A: a", "B: b"]);
  assert.deepEqual(contextBefore(lines, 1), []);
});

test("소식이 끊긴 사람은 뺀다", () => {
  const member = (peerId: string, lastSeen: number): RoomMember => ({
    peerId,
    nickname: peerId,
    role: "speaker",
    muted: false,
    hand: false,
    joinedAt: 0,
    lastSeen,
  });
  const live = liveMembers([member("a", 100_000), member("b", 80_000)], 100_500);
  assert.deepEqual(live.map((row) => row.peerId), ["a"]);
});

test("바로 앉기: 방장이거나 방장이 없을 때만, 손든 순서", () => {
  const m = (peerId: string, role: "speaker" | "listener", hand: boolean, joinedAt: number): RoomMember => ({
    peerId, nickname: peerId, role, muted: false, hand, joinedAt, lastSeen: 1,
  });
  const live = [m("host", "speaker", false, 1), m("b", "listener", true, 3), m("c", "listener", true, 2), m("d", "listener", false, 4)];
  assert.equal(canSeatFreely("host", "host", live), true);
  assert.equal(canSeatFreely("b", "host", live), false);
  assert.equal(canSeatFreely("b", "host", live.slice(1)), true);
  assert.deepEqual(raisedHands(live).map((row) => row.peerId), ["c", "b"]);
});
