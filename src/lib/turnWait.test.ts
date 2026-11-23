import assert from "node:assert/strict";
import test from "node:test";
import { DEFAULT_TURN_WAIT, parseTurnWait, TURN_WAITS } from "./turnWait.ts";

test("내 말 기다리기: 0.9~2초 다섯 칸, 모르는 값은 1.8초", () => {
  assert.deepEqual([...TURN_WAITS], [0.9, 1.2, 1.5, 1.8, 2]);
  assert.equal(parseTurnWait("1.2"), 1.2);
  assert.equal(parseTurnWait(2), 2);
  assert.equal(parseTurnWait("3"), DEFAULT_TURN_WAIT);
  assert.equal(parseTurnWait(null), DEFAULT_TURN_WAIT);
  assert.equal(DEFAULT_TURN_WAIT, 1.8);
});
