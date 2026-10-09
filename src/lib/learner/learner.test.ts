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

test("a tutor phrase goes from stuck to understood to used", async () => {
  const c = await import("./comprehension.ts");
  let r = c.emptyComprehension("en", T0);
  r = c.applyEvent(r, { kind: "lookup", text: "end up," }, T0);
  assert.equal(r.items["end up"]?.state, "stuck");
  r = c.applyEvent(r, { kind: "ask", text: "End up", about: "grammar" }, T0 + 1);
  assert.equal(r.items["end up"]?.state, "studied");
  assert.equal(r.items["end up"]?.about.grammar, 1);
  r = c.applyTutorLine(r, "We ended up staying late.", T0 + 2);
  assert.equal(r.items["end up"]?.state, "studied");
  r = c.applyTutorLine(r, "Where did you end up going?", T0 + 3);
  assert.equal(r.items["end up"]?.state, "understood");
  // Writing it, and the correction keeping it, is use.
  r = c.applyLearnerLine(r, "I end up go home", "I ended up going home.", T0 + 4);
  assert.equal(r.items["end up"]?.state, "used");
});

test("looking an understood phrase up again sends it back, and resets the quiet count", async () => {
  const c = await import("./comprehension.ts");
  let r = c.applyEvent(c.emptyComprehension("en", T0), { kind: "lookup", text: "wait it out" }, T0);
  r = c.applyTutorLine(r, "Just wait it out.", T0 + 1);
  r = c.applyTutorLine(r, "I'd wait it out.", T0 + 2);
  assert.equal(r.items["wait it out"]?.state, "understood");
  r = c.applyEvent(r, { kind: "lookup", text: "wait it out" }, T0 + 3);
  assert.equal(r.items["wait it out"]?.state, "stuck");
  assert.equal(r.items["wait it out"]?.quiet, 0);
});

test("a phrase the correction removed is not counted as used; long spans are not items", async () => {
  const c = await import("./comprehension.ts");
  let r = c.applyEvent(c.emptyComprehension("en", T0), { kind: "save", text: "figure out" }, T0);
  r = c.applyLearnerLine(r, "I figure out it", "I worked it out.", T0 + 1);
  assert.equal(r.items["figure out"]?.state, "studied");
  r = c.applyEvent(r, { kind: "analyze", text: "Did you end up going somewhere else or just waiting" }, T0 + 2);
  assert.equal(Object.keys(r.items).length, 1);
  r = c.applyEvent(r, { kind: "translate" }, T0 + 3);
  assert.equal(r.translations, 1);
});

test("counts, topics and a stored record read back", async () => {
  const c = await import("./comprehension.ts");
  let r = c.emptyComprehension("en", T0);
  r = c.applyEvent(r, { kind: "ask", text: "end up", about: "grammar" }, T0);
  r = c.applyEvent(r, { kind: "ask", text: "wait it out", about: "nuance" }, T0 + 1);
  r = c.applyEvent(r, { kind: "ask", text: "wait it out", about: "nuance" }, T0 + 2);
  r = c.applyEvent(r, { kind: "lookup", text: "packed" }, T0 + 3);
  assert.deepEqual(c.countByState(r), { stuck: 1, studied: 2, understood: 0, used: 0 });
  assert.deepEqual(c.askTopics(r)[0], ["nuance", 2]);
  assert.deepEqual(c.itemsIn(r, "studied").map((i) => i.text), ["wait it out", "end up"]);
  assert.deepEqual(c.parseComprehension(JSON.parse(JSON.stringify(r)), "en"), r);
  assert.equal(Object.keys(c.parseComprehension(r, "es").items).length, 0);
});

test("phrases are followed in Japanese, Chinese, Thai, Hindi and Korean too", async () => {
  const c = await import("./comprehension.ts");
  const cases: Array<[string, string, string, string]> = [
    ["ja", "結局", "結局ほかの店に行ったの？", "結局家に帰ったよ。"],
    ["zh", "别的地方", "你最后去了别的地方吗？", "我们去了别的地方。"],
    ["th", "ที่อื่น", "สุดท้ายคุณไปที่อื่นไหม", "เราไปที่อื่นกันเถอะ"],
    ["hi", "कहीं और", "क्या तुम कहीं और गए?", "चलो कहीं और चलते हैं।"],
    ["ko", "다른 데", "결국 다른 데를 갔어?", "우리 다른 데 가자."],
  ];
  for (const [language, phrase, line1, line2] of cases) {
    let r = c.applyEvent(c.emptyComprehension(language, T0), { kind: "lookup", text: phrase }, T0);
    assert.equal(r.items[c.itemKey(phrase)]?.text, phrase, `${language} kept whole`);
    r = c.applyTutorLine(r, line1, T0 + 1);
    r = c.applyTutorLine(r, line2, T0 + 2);
    assert.equal(r.items[c.itemKey(phrase)]?.state, "understood", language);
  }
  // A whole Japanese sentence is not one "word" and is not an item.
  const r = c.applyEvent(c.emptyComprehension("ja", T0), {
    kind: "analyze",
    text: "昨日はとても混んでいたので結局ほかの店に行きました",
  }, T0);
  assert.equal(Object.keys(r.items).length, 0);
});

test("every construction has a name in every interface language", async () => {
  const { CONSTRUCTION_LABELS, LABEL_LANGUAGES } = await import("./constructionLabels.ts");
  const { constructionLabel } = await import("./constructions.ts");
  for (const c of ENGLISH_CONSTRUCTIONS) {
    const row = CONSTRUCTION_LABELS[c.id];
    assert.ok(row, c.id);
    assert.equal(row.length, LABEL_LANGUAGES.length, c.id);
    for (const label of row) assert.ok(label.trim(), c.id);
  }
  assert.deepEqual(Object.keys(CONSTRUCTION_LABELS).sort(), ENGLISH_CONSTRUCTIONS.map((c) => c.id).sort());
  const wordForm = ENGLISH_CONSTRUCTIONS.find((c) => c.id === "word-form")!;
  assert.equal(constructionLabel(wordForm, "ja"), "品詞の形（名詞・形容詞・副詞）");
  assert.equal(constructionLabel(wordForm, "ko"), wordForm.ko);
  assert.equal(constructionLabel(wordForm, "xx"), wordForm.en);
});

test("suggestions follow the data and the chosen focus, each with its evidence", async () => {
  const { suggestNext, improvements } = await import("./suggest.ts");
  const c = await import("./comprehension.ts");
  let p = turns(emptyProfile("en", T0), [
    ["present-perfect", false], ["present-perfect", false], ["present-perfect", true],
    ["word-form", false], ["word-form", false], ["word-form", true], ["word-form", true], ["word-form", true],
  ]);
  let r = c.emptyComprehension("en", T0);
  r = c.applyEvent(r, { kind: "lookup", text: "wait it out" }, T0);
  r = c.applyEvent(r, { kind: "lookup", text: "wait it out" }, T0 + 1);
  r = c.applyEvent(r, { kind: "lookup", text: "grab a bite" }, T0 + 2);
  r = c.applyTutorLine(r, "Let's grab a bite.", T0 + 3);
  r = c.applyTutorLine(r, "Wanna grab a bite?", T0 + 4);

  const weakFirst = suggestNext(p, r);
  assert.deepEqual(weakFirst[0], { kind: "construction", id: "present-perfect", reason: { type: "missed", misses: 2, uses: 3 } });
  assert.deepEqual(weakFirst[1], { kind: "phrase", text: "wait it out", reason: { type: "stuck", lookups: 2 } });
  assert.deepEqual(weakFirst[2], { kind: "phrase", text: "grab a bite", reason: { type: "unused" } });

  p = withPlan(p, { focus: "topic" });
  assert.equal(suggestNext(p, r)[0]?.kind, "phrase");
  p = withPlan(p, { focus: "next" });
  const widen = suggestNext(p, r);
  assert.equal(widen[0]?.reason.type, "new");
  assert.equal((widen[0] as { id: string }).id, "be-verb");

  const better = improvements(p, r);
  assert.deepEqual(better.constructions, ["word-form"]);
  assert.deepEqual(better.phrases, ["grab a bite"]);
});
