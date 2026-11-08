import { test } from "node:test";
import assert from "node:assert/strict";
import { cardProgress } from "./cardProgress.ts";
import type { LogEvent } from "./logLedger.ts";

const D = 86_400;
const T = Date.UTC(2026, 10, 1, 3) / 1000;
const dayOf = (t: number) => new Date(t * 1000).toISOString().slice(0, 10);
const ev = (k: string, r: LogEvent["r"], day: number, m: LogEvent["m"] = "write"): LogEvent => ({ k, src: "quiz", r, m, t: T + day * D });

test("점: 고르기 맞힘 ◐, 쓰기 맞힘 ●●○, 다른 날 또 ●●●(앎), 앎에서 틀리면 ●●○ (es·ja 열쇠)", () => {
  assert.deepEqual(cardProgress([], "w|casa", { correct: true, mode: "pick", t: T }, dayOf), { before: 0, after: 0.5, known: false, recoveredFrom: null });
  assert.equal(cardProgress([ev("w|casa", "ok", 0, "pick")], "w|casa", { correct: true, mode: "write", t: T + D }, dayOf).after, 2);
  const two = cardProgress([ev("w|食べる", "ok", 0)], "w|食べる", { correct: true, mode: "write", t: T + D }, dayOf);
  assert.equal(two.after, 3);
  assert.equal(two.known, true);
  const same = cardProgress([ev("w|食べる", "ok", 0)], "w|食べる", { correct: true, mode: "write", t: T + 60 }, dayOf);
  assert.equal(same.after, 2, "같은 날은 앎 아님");
  const drop = cardProgress([ev("w|casa", "ok", 0), ev("w|casa", "ok", 1)], "w|casa", { correct: false, mode: "pick", t: T + 2 * D }, dayOf);
  assert.deepEqual([drop.before, drop.after], [3, 2]);
});

test("다시 맞힘: 틀린 뒤 다른 날 처음 맞히면 그 틀린 날, 같은 날·이미 맞힌 뒤는 없음", () => {
  const miss = [ev("w|perro", "miss", 0, "pick")];
  assert.equal(cardProgress(miss, "w|perro", { correct: true, mode: "pick", t: T + 3 * D }, dayOf).recoveredFrom, T);
  assert.equal(cardProgress(miss, "w|perro", { correct: true, mode: "pick", t: T + 60 }, dayOf).recoveredFrom, null);
  assert.equal(cardProgress([...miss, ev("w|perro", "ok", 1, "pick")], "w|perro", { correct: true, mode: "pick", t: T + 3 * D }, dayOf).recoveredFrom, null);
});
