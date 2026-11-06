import assert from "node:assert/strict";
import test from "node:test";
import { AIM_TRIES, afterTurn, aimResults, beforeTurn, planAims, startAims, type TalkAimState } from "./talkAims.ts";

const fixes = [{ right: "Ayer fui al parque." }, { right: "昨日公園に行きました。", point: "목적어 뒤 を를 빠뜨림" }];

test("the plan takes the newest correction, the lead gap and one rare kind of talk", () => {
  const aims = planAims({ fixes, wantsLead: true, fnCounts: { self: 20, ask: 10, time: 1, reason: 4, compare: 3, mind: 3 } });
  assert.deepEqual(aims.map((a) => a.key), ["fix:昨日公園に行きました。", "lead", "fn:time"]);
  assert.equal(aims[0]!.ref, "2", "the number in the list the director reads");
});

test("too little talk to tell, no rare kind; what kept missing goes last", () => {
  assert.deepEqual(planAims({ fixes: [], wantsLead: false, fnCounts: { self: 5, time: 0 } }), []);
  const aims = planAims({ fixes, wantsLead: true, fnCounts: {}, misses: { "fix:昨日公園に行きました。": 3 } });
  assert.deepEqual(aims.map((a) => a.key), ["lead", "fix:昨日公園に行きました。"]);
});

function turns(state: TalkAimState, n: number, seen = {}): { state: TalkAimState; aims: (string | null)[] } {
  const aims: (string | null)[] = [];
  for (let i = 0; i < n; i += 1) {
    const step = beforeTurn(state);
    aims.push(step.aim);
    state = afterTurn(step.state, seen);
  }
  return { state, aims };
}

test("no aim while saying hello, then one aim with room between them", () => {
  const start = startAims(planAims({ fixes, wantsLead: false, fnCounts: {} }));
  const { aims } = turns(start, 9);
  assert.equal(aims[0], null);
  assert.equal(aims[1], null);
  assert.ok(aims[2]?.includes("correction 2"));
  assert.equal(aims[3], null);
  assert.equal(aims[4], null);
  assert.equal(aims.filter(Boolean).length, AIM_TRIES, "three tries a call at most");
});

test("their own topic, a missed line or being stuck rests the next turn", () => {
  let state = startAims(planAims({ fixes, wantsLead: false, fnCounts: {} }));
  state = turns(state, 2).state;
  for (const seen of [{ lead: "lead" as const }, { heard: "off" as const }, { flow: "stuck" as const }, { missed: true }]) {
    const rested = beforeTurn(afterTurn(state, seen));
    assert.equal(rested.aim, null, JSON.stringify(seen));
  }
});

test("two short answers in a row bring a two-choice question, not checked afterwards", () => {
  let state = turns(startAims([]), 2).state;
  state = afterTurn(afterTurn(state, { lead: "min" }), { lead: "min" });
  const step = beforeTurn(state);
  assert.match(step.aim ?? "", /two options/);
  assert.equal(beforeTurn(afterTurn(step.state, {})).aimCheck, null);
});

test("the aim is checked on the next turn; used twice ends it", () => {
  let state = turns(startAims(planAims({ fixes, wantsLead: false, fnCounts: {} })), 2).state;
  let step = beforeTurn(state);
  const sent = step.aim;
  state = afterTurn(step.state, { aim: "used" });
  step = beforeTurn(state);
  assert.equal(step.aimCheck, sent);
  state = turns(step.state, 1).state;
  step = beforeTurn(state);
  assert.equal(step.aim, sent);
  state = afterTurn(step.state, { aim: "used" });
  const rest = turns(state, 6).aims;
  assert.ok(rest.every((a) => a === null), "done after two uses");
  assert.deepEqual(aimResults(turns(state, 1).state), [{ key: "fix:昨日公園に行きました。", kind: "fix", result: "used" }]);
});

test("an aim never landed is reported as none; one never sent is left out", () => {
  const state = turns(startAims(planAims({ fixes, wantsLead: true, fnCounts: {} })), 5).state;
  assert.deepEqual(aimResults(state), [{ key: "fix:昨日公園に行きました。", kind: "fix", result: "none" }, { key: "lead", kind: "lead", result: "none" }]);
});

test("an aim is always followed by a turn without one", () => {
  const start = startAims(planAims({ fixes, wantsLead: true, fnCounts: { self: 30, time: 0, reason: 5, compare: 5, mind: 5 } }));
  const { aims } = turns(start, 10);
  for (let i = 1; i < aims.length; i += 1) assert.ok(!(aims[i] && aims[i - 1]), `turns ${i} and ${i + 1}`);
});

test("the correction aim names what was wrong, not only its number", () => {
  const step = beforeTurn(turns(startAims(planAims({ fixes, wantsLead: false, fnCounts: {} })), 2).state);
  assert.match(step.aim ?? "", /correction 2/);
  assert.match(step.aim ?? "", /목적어 뒤 を를 빠뜨림/);
});

test("after a bare answer the tutor does not go quiet on them", () => {
  let state = turns(startAims([{ key: "lead", kind: "lead", ref: "lead" }]), 2).state;
  state = afterTurn(state, { lead: "min" });
  assert.equal(beforeTurn(state).aim, null);
  state = afterTurn(state, { lead: "follow" });
  assert.match(beforeTurn(state).aim ?? "", /without a question/);
});
