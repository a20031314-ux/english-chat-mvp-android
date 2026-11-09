import { test } from "node:test";
import assert from "node:assert/strict";
import { answeredKeys, cardMode, expressionChance, tierOf } from "./quizTier.ts";
import { stateOf } from "./checkState.ts";
import { reviewKeys } from "./todayCards.ts";
import { checkStates } from "./checkState.ts";
import type { LogEvent } from "./logLedger.ts";

test("어림 → 모양: 높으면 예문 없이 쓰기, 중간은 쓰기, 낮으면 고르기", () => {
  assert.equal(tierOf(0.9), "hard");
  assert.equal(tierOf(0.5), "mid");
  assert.equal(tierOf(0.1), "easy");
  assert.deepEqual(cardMode("hide", false, 0.9), { mode: "show", bare: true, judge: false, tier: "hard" });
  assert.deepEqual(cardMode("hide", false, 0.5), { mode: "show", bare: false, judge: false, tier: "mid" });
  assert.deepEqual(cardMode("hide", false, 0.1), { mode: "hide", bare: false, judge: false, tier: "easy" });
  // 사전에서 찾아본 말은 어림이 낮아도 쓰기.
  assert.equal(cardMode("show", false, 0.1).mode, "show");
});

test("기록이 있으면 기록이 먼저(맞나 틀리나는 맞힌 적 있을 때만)", () => {
  assert.deepEqual(cardMode("hide", true, 0.95), { mode: "hide", bare: false, judge: false, tier: null });
  assert.deepEqual(cardMode("show", true, 0.95), { mode: "show", bare: false, judge: true, tier: null });
  assert.ok(answeredKeys([{ k: "w|a", src: "quiz", r: "ok" }, { k: "w|b", src: "dict", r: "look" }]).has("w|a"));
  assert.ok(!answeredKeys([{ k: "w|b", src: "dict", r: "look" }]).has("w|b"));
});

test("표현 어림: 아래 단계 높음, 같은 단계 중간, 위 단계 낮음", () => {
  assert.equal(tierOf(expressionChance(1, 4)), "hard");
  assert.equal(tierOf(expressionChance(4, 4)), "mid");
  assert.equal(tierOf(expressionChance(5, 4)), "easy");
});

const day = (t: number) => new Date(t * 1000).toISOString().slice(0, 10);

test("체크 셋: 예문 없이 써서 맞히면 앎, 그 뒤 틀리면 다시 볼 것 · 고르기로 맞힌 것은 다시 볼 것에 안 감", () => {
  const t = 1_800_000_000;
  assert.equal(stateOf([{ k: "w|x", src: "quiz", r: "ok", m: "sure", t }]).level, "known");
  assert.equal(stateOf([{ k: "w|x", src: "quiz", r: "ok", m: "sure", t }, { k: "w|x", src: "quiz", r: "miss", m: "write", t: t + 3 * 86400 }]).level, "hard");
  const events: LogEvent[] = [{ k: "w|p", src: "quiz", r: "ok", m: "pick", t }];
  const states = checkStates(events);
  assert.ok(!reviewKeys({ events, states, now: t + 86400, today: day }).includes("w|p"));
  assert.ok(!reviewKeys({ events, states, now: t + 30 * 86400, today: day }).includes("w|p"));
});
