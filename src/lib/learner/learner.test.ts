import assert from "node:assert/strict";
import test from "node:test";
import { ENGLISH_CONSTRUCTIONS } from "./constructions.ts";
import {
  MIN_TURNS_FOR_LEVEL,
  applyTurn,
  bandProgress,
  currentLevel,
  emptyProfile,
  isoWeek,
  nextBand,
  overcome,
  parseProfile,
  profileBrief,
  statusOf,
  withPlan,
  type LearnerProfile,
} from "./profile.ts";

const DAY = 86400000;
const T0 = Date.UTC(2026, 9, 5); // Monday of 2026-W41

function turns(profile: LearnerProfile, outcomes: Array<[string, boolean]>, at = T0): LearnerProfile {
  return outcomes.reduce((p, [id, ok], i) => applyTurn(p, [{ id, ok }], at + i), profile);
}

test("construction ids are unique and every band has some", () => {
  const ids = ENGLISH_CONSTRUCTIONS.map((c) => c.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const band of ["A1", "A2", "B1", "B2", "C1"]) {
    assert.ok(ENGLISH_CONSTRUCTIONS.some((c) => c.band === band), band);
  }
});

test("a weak construction gets better as it is used correctly", () => {
  let p = turns(emptyProfile("en", T0), [
    ["word-form", false],
    ["word-form", false],
  ]);
  assert.equal(statusOf(p.entries["word-form"]), "weak");
  p = turns(p, [["word-form", true]]);
  assert.equal(statusOf(p.entries["word-form"]), "weak");
  p = turns(p, [
    ["word-form", true],
    ["word-form", true],
  ]);
  // Window now 0 0 1 1 1: three right, last two right.
  assert.equal(statusOf(p.entries["word-form"]), "mastered");
  assert.deepEqual(overcome(p), ["word-form"]);
  // Lifetime counts are kept but do not hold it down.
  assert.equal(p.entries["word-form"]?.missed, 2);
});

test("one miss in a good run is learning, not weak", () => {
  const p = turns(emptyProfile("en", T0), [
    ["past-simple", true],
    ["past-simple", false],
    ["past-simple", true],
  ]);
  assert.equal(statusOf(p.entries["past-simple"]), "learning");
});

test("used well and missed in the same turn counts as missed; unknown ids are ignored", () => {
  const p = applyTurn(emptyProfile("en", T0), [
    { id: "articles", ok: true },
    { id: "articles", ok: false },
    { id: "made-up", ok: true },
  ], T0);
  assert.deepEqual(p.entries.articles?.recent, [0]);
  assert.equal(p.entries["made-up"], undefined);
  assert.equal(p.turns, 1);
});

test("no level is claimed before enough turns", () => {
  const p = turns(emptyProfile("en", T0), [["be-verb", true]]);
  assert.ok(p.turns < MIN_TURNS_FOR_LEVEL);
  assert.equal(currentLevel(p), null);
  assert.equal(nextBand(p), "A1");
});

function master(profile: LearnerProfile, ids: string[], at: number): LearnerProfile {
  let p = profile;
  for (const id of ids) p = turns(p, [[id, true], [id, true], [id, true]], at);
  return p;
}

test("the level is the highest band reached with every band below it", () => {
  const a1 = ENGLISH_CONSTRUCTIONS.filter((c) => c.band === "A1").map((c) => c.id);
  const b1 = ENGLISH_CONSTRUCTIONS.filter((c) => c.band === "B1").map((c) => c.id);
  let p = master(emptyProfile("en", T0), a1, T0);
  assert.equal(currentLevel(p), "A1");
  // B1 mastered but A2 not: still A1.
  p = master(p, b1, T0);
  assert.equal(currentLevel(p), "A1");
  assert.equal(nextBand(p), "A2");
  const a2 = ENGLISH_CONSTRUCTIONS.filter((c) => c.band === "A2").map((c) => c.id);
  p = master(p, a2.slice(0, Math.ceil(a2.length * 0.6)), T0);
  assert.equal(currentLevel(p), "B1");
  const rows = bandProgress(p);
  assert.equal(rows.find((r) => r.band === "B1")?.share, 1);
});

test("one history row per week, keeping the latest numbers of that week", () => {
  let p = turns(emptyProfile("en", T0), [["be-verb", true]], T0);
  p = turns(p, [["be-verb", true]], T0 + 2 * DAY);
  p = turns(p, [["be-verb", true]], T0 + 8 * DAY);
  assert.deepEqual(p.history.map((r) => [r.week, r.turns]), [
    ["2026-W41", 2],
    ["2026-W42", 3],
  ]);
  assert.equal(p.history[1]?.mastered, 1);
});

test("iso weeks cross the year correctly", () => {
  assert.equal(isoWeek(Date.UTC(2026, 0, 1)), "2026-W01");
  assert.equal(isoWeek(Date.UTC(2027, 0, 1)), "2026-W53");
  assert.equal(isoWeek(T0), "2026-W41");
});

test("the plan can be set, and nonsense keeps the old value", () => {
  let p = withPlan(emptyProfile("en", T0), { focus: "next", method: "video" });
  assert.deepEqual(p.plan, { focus: "next", method: "video" });
  p = withPlan(p, { focus: "nonsense" as never });
  assert.deepEqual(p.plan, { focus: "next", method: "video" });
});

test("a stored profile reads back; another language or version starts fresh", () => {
  const p = withPlan(turns(emptyProfile("en", T0), [["word-form", false]]), { method: "chat" });
  const back = parseProfile(JSON.parse(JSON.stringify(p)), "en");
  assert.deepEqual(back, p);
  assert.equal(parseProfile(p, "es").turns, 0);
  assert.equal(parseProfile({ ...p, v: 9 }, "en").turns, 0);
});

test("the brief names weak constructions and the next band's, with the plan", () => {
  const p = turns(emptyProfile("en", T0), [
    ["word-form", false],
    ["word-form", false],
  ]);
  const brief = profileBrief(p);
  assert.equal(brief.weak.length, 1);
  assert.match(brief.weak[0]!, /Word form/);
  assert.ok(brief.nextBandConstructions.some((line) => line.startsWith("be verb")));
  assert.deepEqual(brief.plan, { focus: "weak", method: "mixed" });
});

test("the classifier's answer is read into outcomes, missed winning over used", async () => {
  const { readClassification, classifyPrompt } = await import("./classify.ts");
  const outcomes = readClassification(
    JSON.stringify({ used: ["past-simple", "word-form", "invented"], missed: ["word-form", "articles"] }),
    ENGLISH_CONSTRUCTIONS,
  );
  assert.deepEqual(outcomes, [
    { id: "past-simple", ok: true },
    { id: "word-form", ok: false },
    { id: "articles", ok: false },
  ]);
  assert.deepEqual(readClassification("not json", ENGLISH_CONSTRUCTIONS), []);
  assert.match(classifyPrompt(ENGLISH_CONSTRUCTIONS), /so-such-that/);
});
