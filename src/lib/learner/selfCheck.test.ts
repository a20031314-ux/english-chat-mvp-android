import assert from "node:assert/strict";
import test from "node:test";
import { parseSelfCheck, pitchFor, selfCheckMapRules } from "./selfCheck.ts";
import { buildBrief, SELF_UNTIL_TURNS } from "./brief.ts";
import { nextSteps } from "./next.ts";
import { emptyLedger } from "./ledger.ts";
import { emptyWeakRecord } from "../curriculum/weakPoints.ts";
import { mapSystemPrompt, PLAN_RULES } from "../curriculum/prompt.ts";

const T0 = Date.UTC(2026, 9, 16, 12, 0, 0);

test("a self-check keeps known ids, at most two focuses, and is null when empty", () => {
  assert.equal(parseSelfCheck({ gaps: [], focus: [] }, T0), null);
  assert.equal(parseSelfCheck("speaking", T0), null);
  const check = parseSelfCheck(
    { gaps: ["speaking", "nonsense", "speaking", "listening"], focus: ["speaking", "words", "writing"], use: "moon" },
    T0,
  )!;
  assert.deepEqual(check.gaps, ["speaking", "listening"]);
  assert.deepEqual(check.focus, ["speaking", "words"]);
  assert.equal(check.use, undefined);
  assert.equal(check.at, T0);
  assert.deepEqual(parseSelfCheck({ use: "travel" }, T0), { gaps: [], focus: [], use: "travel", at: T0 });
});

test("the hidden pitch: many gaps, or speaking and accuracy together, start lower", () => {
  assert.equal(pitchFor({ gaps: ["speaking", "accuracy"], focus: [], at: T0 }), "beginner");
  assert.equal(pitchFor({ gaps: ["words", "listening", "natural"], focus: [], at: T0 }), "beginner");
  assert.equal(pitchFor({ gaps: ["natural"], focus: ["speaking"], at: T0 }), "intermediate");
});

test("the map is drawn by the self-check instead of the chosen plan", () => {
  const rules = selfCheckMapRules({ gaps: ["listening"], focus: ["speaking"], use: "travel", at: T0 });
  assert.match(rules, /fast speech/);
  assert.match(rules, /roleplay call the first activity/);
  assert.match(rules, /travelling/);
  const prompt = mapSystemPrompt({
    goal: "여행 · 말이 빠르면 못 알아들어요",
    level: "beginner",
    target: "Japanese",
    uiName: "Korean",
    library: [],
    selfCheck: rules,
    learner: {
      level: null,
      weak: [],
      learning: [],
      nextBandConstructions: [],
      plan: { focus: "weak", method: "chat" },
    },
  });
  assert.ok(prompt.includes(rules));
  assert.ok(!prompt.includes(PLAN_RULES.FOCUS_RULE.weak), "the old plan is not read when the self-check speaks");
  assert.ok(!prompt.includes(PLAN_RULES.METHOD_RULE.chat));
});

test("try this: the ticked gaps come after measured steps and before the map's situations", () => {
  const steps = nextSteps({
    ledger: emptyLedger("ja", T0),
    weak: emptyWeakRecord(),
    map: null,
    status: {},
    missions: {},
    selfCheck: { gaps: ["speaking", "accuracy", "words"], focus: [], at: T0 },
    now: T0,
  });
  assert.deepEqual(steps.map((s) => s.kind), ["gap", "gap", "free"]);
  assert.equal(steps[0]!.gap, "speaking");
  assert.equal(steps[0]!.tab, "roleplay");
  assert.equal(steps[1]!.tab, "chat");
  assert.ok(steps[0]!.goal?.situation);
});

test("the tutor hears the self-check only until the turns can speak", () => {
  const selfCheck = { gaps: ["listening" as const], focus: [], at: T0 };
  const early = buildBrief({
    ledger: emptyLedger("ja", T0),
    weak: emptyWeakRecord(),
    stats: { turns: 3, correctionRate: 0.3, medianLatencyMs: null, retryRate: null },
    selfCheck,
    now: T0,
  });
  assert.deepEqual(early.notes, [{ kind: "self", gaps: ["listening"] }]);
  assert.match(early.prompt, /fast speech/);
  const later = buildBrief({
    ledger: emptyLedger("ja", T0),
    weak: emptyWeakRecord(),
    stats: { turns: SELF_UNTIL_TURNS, correctionRate: 0.4, medianLatencyMs: 3000, retryRate: 0.2 },
    selfCheck,
    now: T0,
  });
  assert.deepEqual(later.notes, []);
});
