import assert from "node:assert/strict";
import test from "node:test";
import { formatCallDuration } from "./callSession.ts";

test("formats call duration as m:ss", () => {
  assert.equal(formatCallDuration(0), "0:00");
  assert.equal(formatCallDuration(12), "0:12");
  assert.equal(formatCallDuration(72), "1:12");
  assert.equal(formatCallDuration(-3), "0:00");
});
