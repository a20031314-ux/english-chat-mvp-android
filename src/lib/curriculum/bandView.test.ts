import { test } from "node:test";
import assert from "node:assert/strict";
import { AXES, type Axis, type AxisFill, type FillResult } from "./fill.ts";
import { bandCells, bandPct, bandRows } from "./bandView.ts";

function axis(name: Axis, over: Partial<AxisFill> = {}): AxisFill {
  return { axis: name, fill: 0.4, low: 0.3, high: 0.5, converged: false, n: 0, stages: [0.9, 0.6, 0.3, 0.1, 0], stageN: [0, 0, 0, 0, 0], cells: [], ...over };
}

function result(over: Partial<Record<Axis, Partial<AxisFill>>> = {}): FillResult {
  const axes = Object.fromEntries(AXES.map((name) => [name, axis(name, over[name])])) as Record<Axis, AxisFill>;
  return { axes, weak: [], startStage: 1 };
}

test("띠: 잰 것이 없는 단계는 칠하지 않는다 — 미리 칠한 어림(priorFill)이 띠에 안 보임", () => {
  const cells = bandCells(axis("vocabRead", { stageN: [12, 3, 0, 0, 0] }));
  assert.deepEqual(
    cells.map((cell) => [cell.state, cell.value]),
    [["measured", 0.9], ["thin", 0.6], ["none", 0], ["none", 0], ["none", 0]],
  );
});

test("띠: 답 8개 미만이면 % 대신 null, 어림 폭이 넓으면 ~", () => {
  assert.equal(bandPct(axis("talk", { n: 5 })), null);
  assert.equal(bandPct(axis("talk", { n: 20, fill: 0.414 })), "~41%");
  assert.equal(bandPct(axis("talk", { n: 20, fill: 0.414, converged: true })), "41%");
});

test("띠: 여섯 줄, 오른 만큼 ▲ — 답이 적은 줄은 비교하지 않음", () => {
  const now = result({ vocabRead: { n: 30, fill: 0.5 }, sentUse: { n: 3, fill: 0.5 } });
  const then = result({ vocabRead: { n: 20, fill: 0.42 }, sentUse: { n: 1, fill: 0.2 } });
  const rows = bandRows(now, then);
  assert.deepEqual(rows.map((row) => row.axis), [...AXES]);
  assert.equal(rows.find((row) => row.axis === "vocabRead")!.gain, 8);
  assert.equal(rows.find((row) => row.axis === "sentUse")!.gain, 0);
});
