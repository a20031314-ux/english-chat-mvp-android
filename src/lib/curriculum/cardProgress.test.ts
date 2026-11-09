import { test } from "node:test";
import assert from "node:assert/strict";
import { cardProgress } from "./cardProgress.ts";
import type { LogEvent } from "./logLedger.ts";

const D = 86_400;
const T = Date.UTC(2026, 10, 1, 3) / 1000;
const dayOf = (t: number) => new Date(t * 1000).toISOString().slice(0, 10);
const ev = (k: string, r: LogEvent["r"], day: number, m: LogEvent["m"] = "write"): LogEvent => ({ k, src: "quiz", r, m, t: T + day * D });

test("점: 맞히면 모양과 상관없이 ●●●(앎), 앎에서 틀리면 ●●○, [다시] 뒤 맞히면 다시 ●●● (es·ja 열쇠)", () => {
  assert.deepEqual(cardProgress([], "w|casa", { correct: true, mode: "pick", t: T }, dayOf), { before: 0, after: 3, known: true, recoveredFrom: null });
  assert.deepEqual(cardProgress([], "w|食べる", { correct: false, mode: "pick", t: T }, dayOf), { before: 0, after: 0, known: false, recoveredFrom: null });
  const drop = cardProgress([ev("w|casa", "ok", 0)], "w|casa", { correct: false, mode: "pick", t: T + 2 * D }, dayOf);
  assert.deepEqual([drop.before, drop.after], [3, 2]);
  const back = cardProgress([ev("w|食べる", "ok", 0, "pick"), ev("w|食べる", "again", 0)], "w|食べる", { correct: true, mode: "write", t: T + D }, dayOf);
  assert.deepEqual([back.before, back.after, back.known], [2, 3, true]);
});

test("다시 맞힘: 틀린 뒤 다른 날 처음 맞히면 그 틀린 날, 같은 날·이미 맞힌 뒤는 없음", () => {
  const miss = [ev("w|perro", "miss", 0, "pick")];
  assert.equal(cardProgress(miss, "w|perro", { correct: true, mode: "pick", t: T + 3 * D }, dayOf).recoveredFrom, T);
  assert.equal(cardProgress(miss, "w|perro", { correct: true, mode: "pick", t: T + 60 }, dayOf).recoveredFrom, null);
  assert.equal(cardProgress([...miss, ev("w|perro", "ok", 1, "pick")], "w|perro", { correct: true, mode: "pick", t: T + 3 * D }, dayOf).recoveredFrom, null);
});
