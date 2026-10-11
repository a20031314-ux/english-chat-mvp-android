import assert from "node:assert/strict";
import test from "node:test";
import {
  MAX_OPEN_WEAK,
  RECUR_WINDOW_MS,
  addWeakMission,
  applyMistakes,
  emptyWeakRecord,
  normalizeWeakMission,
  openWeakCount,
  patternPrompt,
  readPatterns,
  recurringPatterns,
} from "./weakPoints.ts";
import {
  hasTopicMissions,
  nextMission,
  topicCounts,
  withTopicMissions,
  type Mission,
} from "./missions.ts";
import { recommendedNext, recommendedOrder } from "./recommend.ts";
import type { StudyMap } from "./map.ts";

const DAY = 24 * 60 * 60 * 1000;

test("a kind of mistake is a pattern on the second time within two weeks, not the first", () => {
  const t0 = 1_800_000_000_000;
  let record = applyMistakes(emptyWeakRecord(), [{ key: "past-tense-irregular", name: "Past tense of irregular verbs" }], t0);
  assert.deepEqual(recurringPatterns(record, "map1", t0), []);
  record = applyMistakes(record, [{ key: "past-tense-irregular", name: "past tense" }], t0 + 3 * DAY);
  const due = recurringPatterns(record, "map1", t0 + 3 * DAY);
  assert.equal(due.length, 1);
  assert.equal(due[0]!.name, "Past tense of irregular verbs", "the first name is kept");
  // Too far apart is two slips, not a pattern.
  const apart = applyMistakes(
    applyMistakes(emptyWeakRecord(), [{ key: "articles", name: "Articles" }], t0),
    [{ key: "articles", name: "Articles" }],
    t0 + RECUR_WINDOW_MS + DAY,
  );
  assert.deepEqual(recurringPatterns(apart, "map1", t0 + RECUR_WINDOW_MS + DAY), []);
});

test("a pattern placed on this map is not placed again; a new map takes it again", () => {
  const now = 1_800_000_000_000;
  let record = applyMistakes(emptyWeakRecord(), [{ key: "particle-wo", name: "Particle を" }], now);
  record = applyMistakes(record, [{ key: "particle-wo", name: "Particle を" }], now + 1);
  record.patterns["particle-wo"]!.onMap = { mapId: "map1", topicId: "B1", missionId: "w1" };
  assert.deepEqual(recurringPatterns(record, "map1", now + 2), []);
  assert.equal(recurringPatterns(record, "map2", now + 2).length, 1);
});

test("the reader's answer: keys kept to their shape, names that quote the learner dropped, spaceless and Latin scripts alike", () => {
  const ja = readPatterns(
    JSON.stringify({ mistakes: [{ key: "particle-wo-for-object", name: "Particle を for the object" }, { key: "Bad Key!", name: "x" }] }),
    "コーヒーが飲みました",
  );
  assert.deepEqual(ja, [{ key: "particle-wo-for-object", name: "Particle を for the object" }]);
  const es = readPatterns(
    JSON.stringify({ mistakes: [{ key: "ser-estar", name: "yo soy cansado hoy" }, { key: "ser-vs-estar", name: "ser vs estar" }] }),
    "Yo soy cansado hoy",
  );
  assert.deepEqual(es, [{ key: "ser-vs-estar", name: "ser vs estar" }]);
  assert.deepEqual(readPatterns("not json", "x"), []);
  assert.match(patternPrompt({ target: "Thai", known: [{ key: "classifier", name: "Classifiers" }] }), /classifier — Classifiers/);
});

test("a mission for a mistake: on a topic the map has, without giving its answer away", () => {
  const ok = normalizeWeakMission(
    {
      topicId: "b2",
      focus: "과거형",
      task: "어제 한 일을 말해 보세요",
      hints: ["과거형 동사를 쓰세요", "Yesterday I…"],
      answer: "Yesterday I went to a cafe.",
      expression: "I went to",
    },
    ["A1", "B2"],
    "past-tense",
  );
  assert.equal(ok?.topicId, "B2");
  assert.equal(ok?.mission.weak, "past-tense");
  assert.equal(ok?.mission.expression, "I went to");
  assert.equal(normalizeWeakMission({ ...ok?.mission, topicId: "Z9" }, ["A1"], "k"), null);
  assert.equal(
    normalizeWeakMission(
      { topicId: "A1", focus: "f", task: "Say: Yesterday I went to a cafe.", hints: ["a", "b"], answer: "Yesterday I went to a cafe." },
      ["A1"],
      "k",
    ),
    null,
  );
});

const own = (id: string): Mission => ({ id, task: `t${id}`, answer: `a${id}`, hints: ["h", "s…"] });
const weak = { task: "tw", answer: "aw", hints: ["h", "s…"] as [string, string], weak: "past-tense", focus: "과거형" };

test("added before the topic was opened, the topic's own missions still get written, and go first", () => {
  const { topic: added, missionId } = addWeakMission(undefined, weak);
  assert.equal(missionId, "w1");
  assert.equal(hasTopicMissions(added), false);
  const merged = withTopicMissions(
    { ...added, results: { w1: { outcome: "pass", hints: 1, tries: 1, learnedAt: 1 } } },
    [own("m1"), own("m2"), own("m3")],
  );
  assert.deepEqual(merged.missions.map((m) => m.id), ["m1", "m2", "m3", "w1"]);
  assert.ok(merged.results.w1, "what was done on it is kept");
  assert.equal(hasTopicMissions(merged), true);
  assert.equal(addWeakMission(merged, weak).missionId, "w2");
});

test("the one added for a mistake is practised first and counted until mastered", () => {
  const { topic } = addWeakMission({ missions: [own("m1"), own("m2")], results: {} }, weak);
  assert.equal(nextMission(topic)?.id, "w1");
  assert.equal(topicCounts(topic).weak, 1);
  const mastered = { ...topic, results: { w1: { outcome: "pass" as const, hints: 0, tries: 1, mastered: true } } };
  assert.equal(topicCounts(mastered).weak, 0);
  assert.equal(nextMission(mastered)?.id, "m1");
  assert.equal(openWeakCount({ B1: topic, B2: mastered }), 1);
  assert.ok(MAX_OPEN_WEAK > 1);
});

function mapOf(ids: string[]): StudyMap {
  return {
    v: 1,
    id: "map1",
    language: "ja",
    uiLanguage: "ko",
    goal: "g",
    title: "t",
    summary: "",
    level: "beginner",
    sectors: [],
    topics: ids.map((id, index) => ({ id, sector: id[0] as "A", title: id, summary: "", order: index + 1, activities: [], links: [] })),
    createdAt: "",
  };
}

test("recommended order: mistakes first, then what was started, then the drawn order, finished last", () => {
  const map = mapOf(["A1", "A2", "B1", "B2", "C1"]);
  const order = recommendedOrder(
    map,
    { A1: "done", A2: "doing" },
    {
      A1: { mastered: 3, learned: 0, toLearn: 0 },
      A2: { mastered: 1, learned: 1, toLearn: 1 },
      B2: { mastered: 0, learned: 0, toLearn: 1, weak: 1 },
    },
  );
  assert.deepEqual(order.map((r) => r.topic.id), ["B2", "A2", "B1", "C1", "A1"]);
  assert.deepEqual(order.map((r) => r.reason), ["weak", "continue", "next", "next", "done"]);
  assert.equal(order[0]!.place, 1);
  assert.equal(recommendedNext(order)?.topic.id, "B2");
  // A finished topic that got a mistake added comes back to the front.
  const back = recommendedOrder(map, { A1: "done" }, { A1: { mastered: 3, learned: 0, toLearn: 1, weak: 1 } });
  assert.equal(back[0]!.topic.id, "A1");
  // With nothing recorded, the drawn order stands.
  assert.deepEqual(recommendedOrder(map, {}, {}).map((r) => r.topic.id), ["A1", "A2", "B1", "B2", "C1"]);
  assert.equal(recommendedNext(recommendedOrder(map, Object.fromEntries(map.topics.map((t) => [t.id, "done" as const])), {})), null);
});
