import assert from "node:assert/strict";
import test from "node:test";
import { applyMeet, emptyLedger, type Ledger } from "./ledger.ts";
import { nextSteps, type NextInput } from "./next.ts";
import { parsePracticeGoal, practiceOpeningPrompt, practicePrompt, saidPhrase } from "./practice.ts";
import { applyMistakes, emptyWeakRecord } from "../curriculum/weakPoints.ts";
import type { StudyMap } from "../curriculum/map.ts";

const DAY = 24 * 60 * 60 * 1000;
const T0 = Date.UTC(2026, 9, 16, 9, 0, 0);

function learned(ledger: Ledger, text: string, at: number, used?: number): Ledger {
  const met = applyMeet(ledger, text, "save", { tab: "vocab" }, at);
  const key = Object.keys(met.items).find((k) => met.items[k]!.text === text)!;
  const item = met.items[key]!;
  return {
    ...met,
    items: {
      ...met.items,
      [key]: {
        ...item,
        state: "learned",
        outputs: used ? [{ at: used, where: "chat", unaided: false }] : [],
      },
    },
  };
}

const MAP: StudyMap = {
  v: 1,
  id: "map1",
  language: "ja",
  uiLanguage: "ko",
  goal: "카페에서 주문하기",
  title: "카페",
  summary: "",
  level: "beginner",
  sectors: [],
  topics: [
    { id: "A1", sector: "A", title: "카페에서 주문하기", summary: "", order: 1, activities: [], links: [] },
    { id: "A2", sector: "A", title: "자리 묻기", summary: "", order: 3, activities: [], links: [] },
    { id: "B1", sector: "B", title: "공손한 부탁", summary: "", order: 2, activities: [], links: [] },
  ],
  createdAt: "2026-10-01T00:00:00.000Z",
} as StudyMap;

function input(overrides: Partial<NextInput> = {}): NextInput {
  return {
    ledger: emptyLedger("ja", T0),
    weak: emptyWeakRecord(),
    map: null,
    status: {},
    missions: {},
    now: T0,
    ...overrides,
  };
}

test("with nothing to go on, the one step is a conversation about their day", () => {
  const steps = nextSteps(input());
  assert.equal(steps.length, 1);
  assert.equal(steps[0]!.kind, "free");
  assert.equal(steps[0]!.tab, "chat");
  assert.ok(steps[0]!.goal?.situation);
});

test("a mistake twice in two weeks comes first, named in the interface language when the map named it", () => {
  let weak = applyMistakes(emptyWeakRecord(), [{ key: "past-tense", name: "past tense of verbs" }], T0 - 5 * DAY);
  weak = applyMistakes(weak, [{ key: "past-tense", name: "past tense of verbs" }], T0 - DAY);
  weak.patterns["past-tense"]!.onMap = { mapId: "map1", topicId: "A1", missionId: "w1" };
  const steps = nextSteps(
    input({
      weak,
      map: MAP,
      missions: {
        A1: {
          missions: [{ id: "w1", task: "t", answer: "a", hints: ["h", "h"], weak: "past-tense", focus: "과거형" }],
          results: {},
        },
      },
      ledger: learned(emptyLedger("ja", T0), "コーヒーをください", T0 - 10 * DAY),
    }),
  );
  assert.equal(steps[0]!.kind, "mistake");
  assert.equal(steps[0]!.mistakeLabel, "과거형");
  assert.equal(steps[0]!.count, 2);
  assert.equal(steps[0]!.goal?.mistake, "past tense of verbs");
  assert.equal(steps[0]!.goal?.situation, "카페에서 주문하기");
  assert.equal(steps[1]!.kind, "phrase", "then the phrase waiting longest");
  assert.equal(steps.at(-1)!.kind, "free", "the free conversation is always last");
});

test("one slip is not a pattern, and an old pair is forgotten", () => {
  const once = applyMistakes(emptyWeakRecord(), [{ key: "particles", name: "particle を" }], T0 - DAY);
  assert.equal(nextSteps(input({ weak: once }))[0]!.kind, "free");
  let old = applyMistakes(emptyWeakRecord(), [{ key: "particles", name: "particle を" }], T0 - 40 * DAY);
  old = applyMistakes(old, [{ key: "particles", name: "particle を" }], T0 - 30 * DAY);
  assert.equal(nextSteps(input({ weak: old }))[0]!.kind, "free");
});

test("a learned phrase is due a week after it was last used, or a day after it was learned if never used", () => {
  let ledger = emptyLedger("es", T0);
  ledger = learned(ledger, "me da igual", T0 - 20 * DAY, T0 - 2 * DAY); // used two days ago: not yet
  ledger = learned(ledger, "a lo mejor", T0 - 30 * DAY, T0 - 9 * DAY); // used nine days ago
  ledger = learned(ledger, "echar de menos", T0 - 3 * DAY); // never used, learned three days ago
  ledger = learned(ledger, "darse cuenta", T0 - 2 * 60 * 60 * 1000); // learned two hours ago: not yet
  const step = nextSteps(input({ ledger }))[0]!;
  assert.equal(step.kind, "phrase");
  assert.equal(step.tab, "roleplay");
  assert.equal(step.phrase, "a lo mejor");
  assert.equal(step.days, 9);
  assert.deepEqual(step.goal?.phrases, ["a lo mejor", "echar de menos"]);
});

test("situations come from the goal's situation sector, the one in progress first, finished ones left out", () => {
  const steps = nextSteps(
    input({
      map: MAP,
      status: { A1: "done", A2: "doing" },
      missions: {
        A2: {
          missions: [
            { id: "m1", task: "t", answer: "a", hints: ["h", "h"], expression: "席は空いていますか" },
            { id: "m2", task: "t", answer: "a", hints: ["h", "h"], expression: "ここでいいですか" },
          ],
          results: { m1: { outcome: "corrected", hints: 1, at: T0 - DAY } as never },
        },
      },
    }),
  );
  const situations = steps.filter((s) => s.kind === "situation");
  assert.deepEqual(situations.map((s) => s.topicId), ["A2"]);
  assert.deepEqual(situations[0]!.goal?.phrases, ["席は空いていますか", "ここでいいですか"]);
  const mission = steps.find((s) => s.kind === "mission");
  assert.equal(mission?.topicId, "A2");
  assert.equal(mission?.done, 1);
  assert.equal(mission?.total, 2);
  assert.equal(mission?.goal, null);
});

test("a practice goal is cut to size and dropped when empty", () => {
  assert.equal(parsePracticeGoal(null), null);
  assert.equal(parsePracticeGoal({ situation: "  ", phrases: ["", 3] }), null);
  const goal = parsePracticeGoal({
    situation: "카페에서   주문하기",
    phrases: ["end up", "End up", "wait it out", "by the way", "one more"],
    mistake: "x".repeat(200),
  })!;
  assert.equal(goal.situation, "카페에서 주문하기");
  assert.deepEqual(goal.phrases, ["end up", "wait it out", "by the way"]);
  assert.equal(goal.mistake!.length, 80);
});

test("the tutor is told the situation, the phrases and the mistake, and to open when it speaks first", () => {
  const goal = { situation: "카페에서 주문하기", phrases: ["コーヒーをください"], mistake: "particle を" };
  const prompt = practicePrompt(goal, "Japanese");
  assert.match(prompt, /카페에서 주문하기/);
  assert.match(prompt, /コーヒーをください/);
  assert.match(prompt, /particle を/);
  assert.match(practiceOpeningPrompt(goal, "Japanese"), /You speak first/);
  assert.doesNotMatch(practicePrompt({ phrases: ["x y"] }, "English"), /Situation/);
});

test("a phrase is ticked off in spaced, spaceless and Korean-particle text", () => {
  assert.ok(saidPhrase("I ended up staying home.", "end up", "en"));
  assert.ok(saidPhrase("Al final, a lo mejor voy.", "a lo mejor", "es"));
  assert.ok(saidPhrase("すみません、コーヒーをください。", "コーヒーをください", "ja"));
  assert.ok(saidPhrase("我想要一杯咖啡", "一杯咖啡", "zh"));
  assert.ok(saidPhrase("아메리카노를 주세요", "아메리카노", "ko"));
  assert.ok(!saidPhrase("I stayed home.", "end up", "en"));
});
