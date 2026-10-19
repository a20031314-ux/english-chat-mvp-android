import assert from "node:assert/strict";
import test from "node:test";
import { compare, groupOf, loadNotes, scan } from "./data-map.mjs";
import { classify, groupFor, isTestKey } from "./data-sweep.mjs";

test("키 묶음 이름", () => {
  assert.equal(groupOf("learnerLedger:v1:${userId}:${language}"), "learnerLedger:v1");
  assert.equal(groupOf("curriculum:${userId}:${language}"), "curriculum:");
  assert.equal(groupOf("room:meta:${id}"), "room:meta");
});

test("지금 코드의 모든 키 묶음에 설명이 있고, 사라진 설명이 없다", () => {
  const { missing, stale } = compare(scan(), loadNotes());
  assert.deepEqual(missing, []);
  assert.deepEqual(stale, []);
});

test("정리: 점검·지도·코드에 없음으로 나누고, 실제 사용자 키를 점검으로 보지 않는다", () => {
  const groups = ["curriculum:", "learnerLedger:v1", "room:meta", "selfcheck:v1"];
  assert.equal(groupFor("curriculum:rc:abc:en:missions:1", groups), "curriculum:");
  assert.equal(groupFor("room:metadata:1", groups), null);
  assert.ok(isTestKey("learnerLedger:v1:rc:simcheck-run-p001:ja"));
  assert.ok(isTestKey("usage:chat:rc:claude-x:2026-10-20"));
  assert.ok(!isTestKey("selfcheck:v1:rc:$RCAnonymousID:abc:en"));
  const { known, test: t, orphan } = classify(
    ["learnerLedger:v1:rc:simcheck-run-p001:ja", "learnerLedger:v1:rc:$RCAnonymousID:a:ja", "oldThing:v2:x", "selfcheck:v1:rc:u:en"],
    groups,
  );
  assert.equal(t["learnerLedger:v1"].length, 1);
  assert.equal(known["learnerLedger:v1"].length, 1);
  assert.equal(known["selfcheck:v1"].length, 1);
  assert.deepEqual(Object.keys(orphan), ["oldThing:v2"]);
});
