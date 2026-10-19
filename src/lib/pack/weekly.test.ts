import assert from "node:assert/strict";
import test from "node:test";
import { notePackDay, packWeekGate } from "./weekly.ts";

test("주 2번: 7일 안에 두 날 썼으면 막고, 가장 오래된 날 + 7일에 열림", () => {
  assert.deepEqual(packWeekGate([], "2026-10-20", 2), { open: true });
  assert.deepEqual(packWeekGate(["2026-10-15"], "2026-10-20", 2), { open: true });
  assert.deepEqual(packWeekGate(["2026-10-15", "2026-10-18"], "2026-10-20", 2), { open: false, nextDay: "2026-10-22" });
  // 8일 전은 창 밖
  assert.deepEqual(packWeekGate(["2026-10-12", "2026-10-18"], "2026-10-20", 2), { open: true });
  // 오늘 이미 연 팩은 다시 열 수 있음(같은 날 이어 하기)
  assert.deepEqual(packWeekGate(["2026-10-15", "2026-10-18", "2026-10-20"], "2026-10-20", 2), { open: true });
});

test("기록: 같은 날 하나로, 2주 넘은 날은 버림", () => {
  assert.deepEqual(notePackDay(["2026-10-01", "2026-10-18"], "2026-10-20"), ["2026-10-18", "2026-10-20"]);
  assert.deepEqual(notePackDay(["2026-10-20"], "2026-10-20"), ["2026-10-20"]);
});
