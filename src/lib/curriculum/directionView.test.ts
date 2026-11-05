import { test } from "node:test";
import assert from "node:assert/strict";
import { AXES, type Axis, type AxisFill, type FillCatalog, type FillCell, type FillEvent, type FillResult } from "./fill.ts";
import { directionView, studyMix } from "./directionView.ts";

function axis(id: Axis, fill: number): AxisFill {
  return { axis: id, fill, low: fill, high: fill, converged: true, n: 20, stages: [0, 0, 0, 0, 0], cells: [] };
}

function result(fills: Partial<Record<Axis, number>>, weak: FillCell[] = []): FillResult {
  const axes = Object.fromEntries(AXES.map((id) => [id, axis(id, fills[id] ?? 0.4)])) as FillResult["axes"];
  for (const cell of weak) axes[cell.axis].cells.push(cell);
  return { axes, weak, startStage: 1 };
}

function cell(partial: Partial<FillCell> & Pick<FillCell, "id" | "axis">): FillCell {
  return { value: 0.3, n: 11, gap: 0.3, state: "weak", ...partial };
}

test("오른 눈금만, 3%p 미만은 빠지고, 큰 오름이 앞", () => {
  const earlier = result({ listen: 0.41, sentUse: 0.33, vocabRead: 0.5 });
  const now = result({ listen: 0.58, sentUse: 0.35, vocabRead: 0.5 });
  const view = directionView(now, earlier);
  assert.deepEqual(view.gains.map((row) => row.axis), ["listen"]);
  assert.equal(view.lacks.length, 0);
});

test("예상보다 아래인 칸만. 틀린 꼴 셈은 빠진다", () => {
  const weak = [
    cell({ axis: "sentUse", id: "fn:request", value: 0.31, gap: 0.31, n: 11 }),
    cell({ axis: "sentUse", id: "miss:form", value: 0.4, gap: 0.4, n: 9 }),
    cell({ axis: "sentUse", id: "fn:time", value: 0.38, gap: 0.17, n: 9 }),
  ];
  const view = directionView(result({}, weak), result({}));
  assert.deepEqual(view.lacks.map((row) => row.cell.id), ["fn:request", "fn:time"]);
  assert.equal(Math.round(view.lacks[0]!.expected * 100), 62);
  assert.equal(Math.round(view.lacks[0]!.actual * 100), 31);
});

test("틀린 낱말 대부분이 그 칸이면 개수를 센다. 듣기 칸은 낱말이 없다", () => {
  const item = (key: string, cells: string[]) => ({ key, family: "vocab" as const, stage: 1, d: 0.1, cells });
  const vocab = new Map([item("w|go", ["pos:verb"]), item("w|see", ["pos:verb"]), item("w|time", ["pos:noun"])].map((one) => [one.key, one]));
  const catalog = { language: "en", vocab, sent: new Map(), stageCounts: { vocab: [], sent: [] }, cellIds: { vocab: [], sent: [] } } as FillCatalog;
  const events: FillEvent[] = [
    { at: 10, key: "w|go", correct: false, source: "quiz", use: true },
    { at: 11, key: "w|see", correct: false, source: "quiz", use: true },
    { at: 12, key: "w|time", correct: true, source: "quiz", use: true },
    { at: 1, key: "w|go", correct: false, source: "quiz", use: false },
  ];
  const verb = cell({ axis: "vocabUse", id: "pos:verb" });
  assert.deepEqual(studyMix(events, catalog, verb, 0), { missed: 2, total: 2 });
  assert.equal(studyMix(events, catalog, { ...verb, axis: "listen", id: "band:1" }, 0), null);
});
