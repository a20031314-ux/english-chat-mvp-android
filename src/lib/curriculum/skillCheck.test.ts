import { test } from "node:test";
import assert from "node:assert/strict";
import { checkHistory, checkRows, climbFrom, recheckDue, talkUsedBefore, RECHECK_DAYS } from "./skillCheck.ts";
import { climbAnswer, climbStart, startClimb } from "./firstCheck.ts";
import type { LogEvent } from "./logLedger.ts";

const DAY = 86_400_000;
const T0 = Date.UTC(2026, 10, 1);

test("기록: 첫 측정이 첫 줄(글자부터면 뺌), 다시 측정은 뒤에 — 때가 되면 다시", () => {
  const first = { at: T0, letters: false, b: 600, expression: 2, grammar: 1 };
  const again = { at: T0 + 15 * DAY, b: 800, expression: 3, grammar: 2 };
  const history = checkHistory(first, [again]);
  assert.deepEqual(history.map((one) => one.b), [600, 800]);
  assert.equal(history[0]!.first, true);
  assert.equal(checkHistory({ ...first, letters: true }, []).length, 0);
  assert.equal(recheckDue([], T0), true, "기록이 없으면 지금");
  assert.equal(recheckDue(history, again.at + (RECHECK_DAYS - 1) * DAY), false);
  assert.equal(recheckDue(history, again.at + RECHECK_DAYS * DAY), true);
});

test("말하기 = 그 확인 전 2주 대화에서 맞게 쓴 서로 다른 열쇠(퀴즈·틀림·창 밖은 안 셈) (ja·es)", () => {
  const t = (ms: number) => Math.floor(ms / 1000);
  const at = T0 + 20 * DAY;
  const events: LogEvent[] = [
    { k: "w|食べる", src: "call", r: "used", t: t(at - DAY) },
    { k: "w|食べる", src: "chat", r: "used", t: t(at - 2 * DAY) },
    { k: "e|por favor", src: "people", r: "used", t: t(at - 3 * DAY) },
    { k: "w|comer", src: "quiz", r: "ok", m: "write", t: t(at - DAY) },
    { k: "w|beber", src: "call", r: "miss", t: t(at - DAY) },
    { k: "w|vivir", src: "call", r: "used", t: t(at - 15 * DAY) },
    { k: "w|後で", src: "call", r: "used", t: t(at + DAY) },
  ];
  assert.equal(talkUsedBefore(events, at), 2);
  const rows = checkRows([{ at: T0, b: 1, expression: 1, grammar: 1 }, { at, b: 2, expression: 1, grammar: 1 }], events);
  assert.deepEqual(rows.map((one) => one.talk), [2, 0], "새것부터");
});

test("다시 측정 오르기: 지난번 한 단계 아래부터, 거기서 막히면 한 단계만 내려감", () => {
  assert.deepEqual(climbFrom({ at: 0, b: 0, expression: 3, grammar: 1 }), { expression: 2, grammar: 1 });
  assert.deepEqual(climbFrom(undefined), { expression: 1, grammar: 1 });
  let climb = startClimb({ expression: true, grammar: true }, { expression: 2, grammar: 1 });
  assert.equal(climb.lanes.expression.stage, 2);
  assert.equal(climbStart(climb.lanes.expression), 2);
  climb = climbAnswer(climbAnswer(climb, "expression", false), "expression", false);
  assert.equal(climb.lanes.expression.stopped, true);
  assert.equal(climbStart(climb.lanes.expression), 2, "지난번 3 → 이번 2");
  assert.equal(startClimb({ expression: true, grammar: true }).lanes.grammar.stage, 1, "첫 측정은 그대로 1단계부터");
});
