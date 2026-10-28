import assert from "node:assert/strict";
import test from "node:test";
import { lastSeenMine } from "./dm.ts";

const rows = [
  { seq: 1, from: "me", kind: "text" as const },
  { seq: 2, from: "you", kind: "text" as const },
  { seq: 3, from: "me", kind: "text" as const },
  { seq: 4, from: "me", kind: "call" as const },
  { seq: 5, from: "me", kind: "text" as const },
];

test("상대가 읽은 내 글 중 가장 마지막 줄에만 읽음", () => {
  assert.equal(lastSeenMine(rows, "me", 0), 0);
  assert.equal(lastSeenMine(rows, "me", 2), 1);
  assert.equal(lastSeenMine(rows, "me", 4), 3); // 통화 요청 줄에는 붙지 않음
  assert.equal(lastSeenMine(rows, "me", 9), 5);
  assert.equal(lastSeenMine(rows, "you", 9), 2);
});

import { groupSeen } from "./group.ts";

test("단체방: 내 마지막 글 줄까지 읽은 사람 수", () => {
  const rows = [
    { seq: 1, from: "me", kind: "text" as const },
    { seq: 2, from: "a", kind: "text" as const },
    { seq: 3, from: "me", kind: "text" as const },
    { seq: 4, from: "me", kind: "system" as const },
  ];
  assert.deepEqual(groupSeen(rows, "me", []), { seq: 3, count: 0 });
  assert.deepEqual(groupSeen(rows, "me", [2, 3, 4]), { seq: 3, count: 2 });
  assert.deepEqual(groupSeen(rows, "x", [9]), { seq: 0, count: 0 });
});
