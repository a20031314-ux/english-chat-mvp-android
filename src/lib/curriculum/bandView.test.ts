import { test } from "node:test";
import assert from "node:assert/strict";
import { AXES, type Axis, type AxisFill, type FillResult } from "./fill.ts";
import { axisGain, axisShown, axisWeak, bandPct } from "./bandView.ts";

function axis(name: Axis, over: Partial<AxisFill> = {}): AxisFill {
  return { axis: name, fill: 0.4, low: 0.3, high: 0.5, converged: false, n: 0, stages: [0.9, 0.6, 0.3, 0.1, 0], stageN: [0, 0, 0, 0, 0], cells: [], ...over };
}

function result(over: Partial<Record<Axis, Partial<AxisFill>>> = {}): FillResult {
  const axes = Object.fromEntries(AXES.map((name) => [name, axis(name, over[name])])) as Record<Axis, AxisFill>;
  return { axes, weak: [], startStage: 1 };
}

test("띠: 답 8개 미만이면 % 대신 null, 어림 폭이 넓으면 ~", () => {
  assert.equal(bandPct(axis("talk", { n: 5 })), null);
  assert.equal(bandPct(axis("talk", { n: 20, fill: 0.414 })), "~41%");
  assert.equal(bandPct(axis("talk", { n: 20, fill: 0.414, converged: true })), "41%");
});

test("띠·육각형 같은 규칙: 답이 적은 꼭짓점은 약함 점도, 다른 꼭짓점 평균에도 안 들어감", () => {
  // 듣기·실전 대화는 어림만(n 3) — 낮아도 약함 아님, 평균에도 안 섞임.
  const now = result({
    vocabRead: { n: 30, fill: 0.5, converged: true },
    vocabUse: { n: 30, fill: 0.3, converged: true },
    sentRead: { n: 30, fill: 0.5, converged: true },
    sentUse: { n: 30, fill: 0.5, converged: true },
    listen: { n: 3, fill: 0.05, converged: true },
    talk: { n: 3, fill: 0.16, converged: true },
  });
  assert.equal(axisWeak(now, "listen"), false);
  assert.equal(axisWeak(now, "talk"), false);
  assert.equal(axisWeak(now, "vocabUse"), true);
  assert.equal(axisWeak(now, "vocabRead"), false);
});

test("오름은 두 때 모두 숫자가 보일 때만 — 어림 6% → 잰 17%는 나아진 점이 아님", () => {
  assert.equal(axisGain(axis("vocabUse", { n: 12, fill: 0.17 }), axis("vocabUse", { n: 2, fill: 0.06 })), 0);
  assert.equal(axisGain(axis("vocabUse", { n: 12, fill: 0.17 }), axis("vocabUse", { n: 9, fill: 0.06 })), 11);
  assert.equal(axisShown(axis("talk", { n: 7 })), false);
  assert.equal(axisShown(axis("talk", { n: 8 })), true);
});
