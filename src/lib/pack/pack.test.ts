import assert from "node:assert/strict";
import test from "node:test";
import { sentencesFor } from "../roleplay/catalog.ts";
import type { Direction } from "../roleplay/director.ts";
import {
  PACK_ITEMS,
  advance,
  candidates,
  chooseFocus,
  composePack,
  packDone,
  packPrompt,
  readAsk,
  retro,
  type ComposeInput,
  type Pack,
} from "./pack.ts";
import { packBankFor } from "./questions.ts";
import { reactionOnly, shapePackDirection } from "./turn.ts";

const NOW = Date.parse("2026-10-17T09:00:00Z");
const noStats = { turns: 0, correctionRate: null, medianLatencyMs: null, retryRate: null };

function compose(partial: Partial<ComposeInput> = {}): Pack {
  const pack = composePack({
    language: "en",
    day: "2026-10-17",
    seed: "learner-a",
    centre: "speaking",
    side: "accuracy",
    phrases: [],
    avoid: [],
    now: NOW,
    ...partial,
  });
  assert.ok(pack);
  return pack;
}

test("the centre follows what the turns show, then what they said", () => {
  assert.deepEqual(
    chooseFocus({
      stats: { turns: 20, correctionRate: 0.7, medianLatencyMs: 1500, retryRate: 0 },
      selfCheck: { gaps: ["words"], focus: [], at: 0 },
      recentCentres: [],
      hasRecurringMistake: false,
    }),
    { centre: "accuracy", side: "words" },
  );
  assert.deepEqual(
    chooseFocus({ stats: noStats, selfCheck: { gaps: ["listening", "natural"], focus: [], at: 0 }, recentCentres: [], hasRecurringMistake: false }),
    { centre: "listening", side: "natural" },
  );
  // Pronunciation has no exchange of its own: it is practised by speaking.
  assert.equal(
    chooseFocus({ stats: noStats, selfCheck: { gaps: ["pronunciation"], focus: [], at: 0 }, recentCentres: [], hasRecurringMistake: false }).centre,
    "speaking",
  );
});

test("a centre is not used three days running", () => {
  const focus = chooseFocus({
    stats: noStats,
    selfCheck: { gaps: ["speaking", "words"], focus: [], at: 0 },
    recentCentres: ["speaking", "speaking"],
    hasRecurringMistake: false,
  });
  assert.equal(focus.centre, "words");
});

test("a pack is twelve questions, the same however often it is asked for", () => {
  const pack = compose();
  assert.equal(pack.items.length, PACK_ITEMS);
  assert.deepEqual(compose().items.map((i) => i.id), pack.items.map((i) => i.id));
  assert.notDeepEqual(compose({ seed: "learner-b" }).items.map((i) => i.id), pack.items.map((i) => i.id));
  // Speaking is filled by quick questions; accuracy by something that happened.
  assert.ok(pack.items.filter((i) => i.gap === "speaking").every((i) => i.frame === "quick"));
  assert.ok(pack.items.some((i) => i.gap === "accuracy" && i.frame === "past"));
  // No question twice.
  const texts = pack.items.map((i) => i.text);
  assert.equal(new Set(texts).size, texts.length);
});

test("openers from where they will use the language come first, and recent ones are skipped", () => {
  const atWork = compose({ centre: "accuracy", side: "words", use: "work" });
  assert.equal(atWork.items[0]!.id, "a.afterwork");
  const avoided = compose({ centre: "accuracy", side: "words", use: "work", avoid: ["a.afterwork"] });
  assert.notEqual(avoided.items[0]!.id, "a.afterwork");
});

test("a learned phrase gets a question of the tutor's own; a recurring mistake gets a past exchange", () => {
  const withPhrase = compose({ centre: "listening", side: "natural", phrases: [{ text: "end up", state: "learned" }] });
  const free = withPhrase.items.find((i) => i.id === "free");
  assert.equal(free?.invite, "end up");
  const withMistake = compose({ centre: "listening", side: "natural", mistake: "past tense" });
  assert.ok(withMistake.items.slice(9).some((i) => i.gap === "accuracy"));
});

test("Japanese has a pack too, in its own words; a language without questions has none", () => {
  const pack = compose({ language: "ja" });
  assert.ok(pack.items.every((i) => /[぀-ヿ一-鿿]/.test(i.text)));
  assert.equal(composePack({ ...{ language: "es", day: "2026-10-17", seed: "x", centre: "speaking", side: "words", phrases: [], avoid: [], now: NOW } }), null);
  // Every language shares opener ids, so "seen recently" means the same everywhere.
  const ids = (lang: string) => packBankFor(lang)!.openers.map((o) => o.id).sort();
  assert.deepEqual(ids("ja"), ids("en"));
});

test("each turn offers the planned question, a second follow-up, and the next exchange", () => {
  let pack = compose({ centre: "accuracy", side: "words" });
  // The greeting is answered first; the opener is the only choice.
  assert.equal(candidates(pack).length, 1);
  pack = advance(pack, { at: NOW, latencyMs: 2000, attempts: 1, corrected: false, stuck: false, used: [] }, candidates(pack)[0]!);
  const second = candidates(pack);
  assert.equal(second[0]!.index, 1);
  assert.ok(second.length >= 2);
  const skip = second.find((c) => c.index === 3);
  assert.ok(skip, "the next exchange's opener is offered after a follow-up");
  pack = advance(pack, { at: NOW, latencyMs: null, attempts: 1, corrected: true, stuck: false, used: [] }, skip!);
  assert.equal(pack.cursor, 4);
  assert.equal(pack.turns[1]!.index, 0);
});

test("a stuck turn stays on the same question", () => {
  let pack = compose();
  pack = advance(pack, { at: NOW, latencyMs: 1000, attempts: 1, corrected: false, stuck: false, used: [] }, candidates(pack)[0]!);
  const before = pack.cursor;
  pack = advance(pack, { at: NOW, latencyMs: 9000, attempts: 2, corrected: null, stuck: true, used: [] }, null);
  assert.equal(pack.cursor, before);
});

test("the tutor's pick is read by number, and nothing else counts", () => {
  const options = candidates(compose());
  assert.equal(readAsk('{"say":"Nice!","ask":1}', options)?.slot, 1);
  assert.equal(readAsk('{"say":"Nice!","ask":"1"}', options)?.slot, 1);
  assert.equal(readAsk('{"say":"Nice!","ask":0}', options), null);
  assert.equal(readAsk("not json", options), null);
  assert.match(packPrompt(compose(), options), /"ask"/);
  assert.match(packPrompt(compose(), []), /"end"/);
});

test("the retro says what the turns show, and only what changed", () => {
  let pack = compose({ phrases: [{ text: "end up", state: "learned" }] });
  const step = (latencyMs: number, corrected: boolean, used: string[] = []) => {
    const options = candidates(pack);
    pack = advance(pack, { at: NOW + pack.turns.length * 30000, latencyMs, attempts: 1, corrected, stuck: false, used }, options[0] ?? null);
  };
  step(1000, false); // the greeting
  step(2000, false); // quick, clean
  step(6000, true); // slow, corrected
  step(1500, false, ["end up"]);
  const done = retro(pack, { "end up": "mastered" });
  assert.equal(done.answered, 3);
  assert.deepEqual(done.quick, { done: 2, of: 3 });
  assert.deepEqual(done.clean, { done: 2, of: 3 });
  assert.deepEqual(done.phrases, [{ text: "end up", used: true, mastered: true }]);
  assert.ok(done.changed.some((c) => c.kind === "mastered" && c.phrase === "end up"));
  // Nothing moved in the ledger: nothing is claimed.
  const unchanged = retro(pack, { "end up": "learned" });
  assert.ok(!unchanged.changed.some((c) => c.kind === "mastered"));
  assert.equal(packDone(pack), false);
});

const bank = sentencesFor("en");
function said(text: string, assessment: Direction["assessment"] = "on_track"): Direction {
  return { assessment, say: { text }, note: "", next: { step: "talk" } };
}

test("the reaction keeps only what comes before the tutor's own question", () => {
  assert.equal(reactionOnly("Oh, nice! What did you eat?"), "Oh, nice!");
  assert.equal(reactionOnly("いいね！何を食べたの？"), "いいね！");
  assert.equal(reactionOnly("How was it?"), "");
});

test("a pack turn speaks the reaction in fixed words and then the pack's question", () => {
  const chosen = { slot: 1, index: 1, text: "How was it?", translation: "어땠어요?" };
  const input = { complete: false, language: "en", nativeLanguage: "ko", bank, canSplit: true, nodeId: "talk" };
  const shaped = shapePackDirection(said("Oh, that sounds fun! Who went with you?"), chosen, input);
  assert.deepEqual(shaped.react, { text: "That sounds fun!", translation: "재밌었겠네요!" });
  assert.deepEqual(shaped.say, { text: "How was it?", translation: "어땠어요?" });
  // A build that cannot play a reaction on its own gets both in one line.
  const joined = shapePackDirection(said("Nice."), chosen, { ...input, canSplit: false });
  assert.deepEqual(joined.say, { text: "Nice. How was it?" });
  // Stuck: the help is the turn.
  const stuck = shapePackDirection(said("Take your time. Try 'I went…'", "stuck"), chosen, input);
  assert.deepEqual(stuck.say, { text: "Take your time. Try 'I went…'" });
  // The last answer closes the conversation.
  assert.deepEqual(shapePackDirection(said("Great talking!"), null, { ...input, complete: true }).next, { end: true });
});
