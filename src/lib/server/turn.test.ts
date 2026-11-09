import { test } from "node:test";
import assert from "node:assert/strict";
import { cleanIceServers } from "./turn.ts";
test("이상한 항목은 버린다", () => {
  assert.deepEqual(cleanIceServers(null), []);
  assert.deepEqual(cleanIceServers([{ urls: "http://x" }, { urls: [] }, 3]), []);
  assert.deepEqual(cleanIceServers([{ urls: "stun:a:3478" }]), [{ urls: ["stun:a:3478"] }]);
});
