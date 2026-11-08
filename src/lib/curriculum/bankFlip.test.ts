import { test } from "node:test";
import assert from "node:assert/strict";
import { FLIP_MAX, flipNext, startFlip } from "./bankFlip.ts";

test("시작: New·적용이 힘듦 먼저, 알아요는 뒤, 한 판 최대", () => {
  const round = startFlip(["a", "b", "c"], (word) => (word === "a" ? "known" : word === "b" ? "hard" : "new"));
  assert.deepEqual(round.queue, ["b", "c", "a"]);
  assert.equal(startFlip(Array.from({ length: 50 }, (_, i) => `w${i}`), () => "new").queue.length, FLIP_MAX);
});

test("헷갈려요는 3~5장 뒤 다시, 두 번까지 — 세 번째면 빠지고 남은 것으로", () => {
  let round = startFlip(["x", "a", "b", "c", "d", "e", "f"], () => "new");
  round = flipNext(round, false, "s1");
  const at = round.queue.indexOf("x");
  assert.ok(at >= 3 && at <= 5, String(at));
  assert.deepEqual(round.unsure, ["x"]);
  // 두 번째 헷갈려요까지 다시 들어가고, 세 번째면 빠진다.
  round = { ...round, queue: ["x", ...round.queue.filter((one) => one !== "x")] };
  round = flipNext(round, false, "s2");
  assert.ok(round.queue.includes("x"));
  round = { ...round, queue: ["x", ...round.queue.filter((one) => one !== "x")] };
  round = flipNext(round, false, "s3");
  assert.ok(!round.queue.includes("x"));
  assert.equal(round.seen, 1);
});

test("알아요는 빠지고 셈", () => {
  let round = startFlip(["a", "b"], () => "new");
  round = flipNext(round, true, "s");
  assert.deepEqual(round.queue, ["b"]);
  assert.deepEqual(round.known, ["a"]);
  assert.equal(round.seen, 1);
});
