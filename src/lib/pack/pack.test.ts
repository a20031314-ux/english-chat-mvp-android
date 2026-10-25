import assert from "node:assert/strict";
import test from "node:test";
import { sentencesFor } from "../roleplay/catalog.ts";
import type { Direction } from "../roleplay/director.ts";
import {
  PACK_ITEMS,
  advance,
  asksBack,
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

test("with a My network, its 'grow this next' is the centre and the next least grown is beside it", () => {
  const focus = chooseFocus({
    growth: {
      next: "listening",
      elements: [
        { id: "speaking", points: 40, stage: 3, measured: true },
        { id: "accuracy", points: 12, stage: 2, measured: true },
        { id: "words", points: 20, stage: 3, measured: true },
        { id: "listening", points: 2, stage: 1, measured: true },
        { id: "natural", points: 30, stage: 3, measured: true },
        { id: "pronunciation", points: 0, stage: 1, measured: false },
      ],
    },
    stats: { turns: 20, correctionRate: 0.9, medianLatencyMs: 9000, retryRate: 0.5 },
    selfCheck: null,
    recentCentres: ["listening", "listening"],
    hasRecurringMistake: true,
  });
  assert.deepEqual(focus, { centre: "listening", side: "accuracy" });
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
  let pack = compose({
    phrases: [{ text: "end up", state: "learned" }],
    growth: [
      { id: "speaking", points: 10, stage: 2, measured: true },
      { id: "accuracy", points: 10, stage: 2, measured: true },
    ],
  });
  const step = (latencyMs: number, corrected: boolean, used: string[] = []) => {
    const options = candidates(pack);
    pack = advance(pack, { at: NOW + pack.turns.length * 30000, latencyMs, attempts: 1, corrected, stuck: false, used }, options[0] ?? null);
  };
  step(1000, false); // the greeting
  step(2000, false); // quick, clean
  step(6000, true); // slow, corrected
  step(1500, false, ["end up"]);
  const done = retro(pack, { "end up": "mastered" }, [
    { id: "speaking", points: 14, stage: 3, measured: true },
    { id: "accuracy", points: 10, stage: 2, measured: true },
  ]);
  assert.equal(done.answered, 3);
  assert.deepEqual(done.quick, { done: 2, of: 3 });
  assert.deepEqual(done.clean, { done: 2, of: 3 });
  assert.deepEqual(done.phrases, [{ text: "end up", used: true, mastered: true }]);
  assert.ok(done.changed.some((c) => c.kind === "mastered" && c.phrase === "end up"));
  assert.deepEqual(done.changed[0], { kind: "grew", element: "speaking", points: 4, stageUp: true });
  assert.ok(!done.changed.some((c) => c.kind === "grew" && c.element === "accuracy"), "no points, no line");
  // Nothing moved in the record: nothing is claimed.
  const unchanged = retro(pack, { "end up": "learned" });
  assert.deepEqual(unchanged.changed, []);
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
  const { direction: shaped, asked } = shapePackDirection(said("Oh, that sounds fun! Who went with you?"), chosen, input);
  assert.equal(asked, chosen);
  assert.deepEqual(shaped.react, { text: "That sounds fun!", translation: "재밌었겠네요!" });
  assert.deepEqual(shaped.say, { text: "How was it?", translation: "어땠어요?" });
  // A build that cannot play a reaction on its own gets both in one line.
  const { direction: joined } = shapePackDirection(said("Nice."), chosen, { ...input, canSplit: false });
  assert.deepEqual(joined.say, { text: "Nice. How was it?" });
  // Stuck: the help is the turn.
  const { direction: stuck, asked: none } = shapePackDirection(said("Take your time. Try 'I went…'", "stuck"), chosen, input);
  assert.equal(none, null, "a stuck turn does not move the pack");
  assert.deepEqual(stuck.say, { text: "Take your time. Try 'I went…'" });
  // The last answer closes the conversation.
  const last = shapePackDirection(said("Wow, Japan! What will you see there?"), null, { ...input, complete: true }).direction;
  assert.deepEqual(last.next, { end: true });
  assert.deepEqual(last.react, { text: "Wow, Japan!" });
  assert.equal("text" in last.say && last.say.text, bank["open.bye"]!.text, "the recorded goodbye, not a new question");
  // No pick and nothing asked: the planned question follows, and counts as asked.
  const fallback = shapePackDirection(said("Cold water can be refreshing!"), null, { ...input, planned: chosen });
  assert.deepEqual(fallback.direction.say, { text: "How was it?", translation: "어땠어요?" });
  assert.equal(fallback.asked, chosen);
  // No pick because the tutor answered a question of theirs with one of its own: left alone.
  const answered = shapePackDirection(said("Me? I love tea. And you?"), null, { ...input, planned: chosen });
  assert.deepEqual(answered.direction.say, { text: "Me? I love tea. And you?" });
  assert.equal(answered.asked, null);
});

test("an extra pack is named by its day and number, and only by those", async () => {
  const { isPackDay, packIdFor, packDayOf } = await import("./pack.ts");
  assert.equal(packIdFor("2026-10-16", 1), "2026-10-16");
  assert.equal(packIdFor("2026-10-16", 3), "2026-10-16.3");
  assert.deepEqual(packDayOf("2026-10-16.2"), { day: "2026-10-16", n: 2 });
  assert.deepEqual(packDayOf("2026-10-16"), { day: "2026-10-16", n: 1 });
  assert.equal(isPackDay("2026-10-16.2"), true);
  assert.equal(isPackDay("2026-10-16.1"), false);
  assert.equal(isPackDay("2026-10-16.10"), false);
  const { parsePracticeGoal } = await import("../learner/practice.ts");
  assert.equal(parsePracticeGoal({ pack: "2026-10-16.2" })?.pack, "2026-10-16.2");
});

test("a run of quick questions starts with a line that says so, in its language, and only the first", async () => {
  for (const language of ["en", "ja"]) {
    const pack = compose({ language, centre: "speaking" });
    assert.equal(pack.items[0]!.frame, "quick");
    const first = candidates(pack);
    assert.equal(first[0]!.lead?.text, packBankFor(language)!.quickLead.text);
    const second = candidates({ ...pack, cursor: 1 });
    assert.equal(second[0]!.lead, undefined);
  }
  // A pack that does not open on quick questions has no lead-in.
  const past = compose({ centre: "accuracy", side: "words" });
  assert.equal(candidates(past)[0]!.lead, undefined);
  // Spoken before the question it leads into.
  const pack = compose({ language: "en", centre: "speaking" });
  const [pick] = candidates(pack);
  const { direction } = shapePackDirection(
    { assessment: "on_track", say: { text: "I'm doing well, thanks!" }, note: "", next: { free: true } } as never,
    pick!,
    { complete: false, language: "en", nativeLanguage: "ko", bank: {}, canSplit: true, nodeId: "talk" },
  );
  assert.ok("text" in direction.say && direction.say.text.startsWith("Okay, a few quick ones"));
  assert.ok("text" in direction.say && direction.say.text.endsWith(pick!.text));
});

test("the tutor may follow up on what they said: the planned question waits, never twice in a row, at most a few", () => {
  const turn = { at: NOW, latencyMs: 1500, attempts: 1, corrected: false, stuck: false, used: [] };
  let pack = compose({ language: "en", centre: "speaking" });
  pack = advance(pack, turn, candidates(pack)[0]!);
  const options = candidates(pack);
  const follow = options.find((c) => c.follow);
  assert.ok(follow, "a follow-up is offered once a question has been asked");
  assert.match(packPrompt(pack, options), /follow-up question of your own/);
  const cursor = pack.cursor;
  pack = advance(pack, turn, follow!);
  assert.equal(pack.cursor, cursor, "the planned question is still next");
  assert.equal(candidates(pack).some((c) => c.follow), false, "not two in a row");
  // Spoken as the tutor wrote it, and the talk goes on.
  const { direction, asked } = shapePackDirection(
    { assessment: "on_track", say: { text: "An app? What kind of app are you building?" }, note: "", next: { end: true } } as never,
    follow!,
    { complete: false, language: "en", nativeLanguage: "ko", bank: {}, canSplit: true, nodeId: "talk", planned: options[0]! },
  );
  assert.equal("text" in direction.say && direction.say.text, "An app? What kind of app are you building?");
  assert.deepEqual(direction.next, { step: "talk" });
  assert.equal(asked?.follow, true);
  // Picked with no question written: the planned question follows the reaction.
  const { direction: plain } = shapePackDirection(
    { assessment: "on_track", say: { text: "Building an app, nice." }, note: "", next: { free: true } } as never,
    follow!,
    { complete: false, language: "en", nativeLanguage: "ko", bank: {}, canSplit: false, nodeId: "talk", planned: options[0]! },
  );
  assert.ok("text" in plain.say && plain.say.text.endsWith(options[0]!.text));
  // At most PACK_FOLLOWS in a pack.
  for (let i = 0; i < 6; i++) {
    const next = candidates(pack);
    const pick = next.find((c) => c.follow) ?? next[0]!;
    pack = advance(pack, turn, pick);
  }
  assert.ok(pack.turns.filter((t) => t.followed).length <= 3);
});

test("they asked the tutor something: no follow-up of the tutor's own is offered (it asked about its own story as theirs, 2026-10-26)", () => {
  let pack = compose({ centre: "accuracy", side: "words" });
  pack = advance(pack, { at: NOW, latencyMs: 2000, attempts: 1, corrected: false, stuck: false, used: [] }, candidates(pack)[0]!);
  assert.ok(candidates(pack, "I watched it with my sister.").some((c) => c.follow));
  for (const heard of ["What did you watch?", "¿Y tú qué viste?", "何を見ましたか？", "ماذا شاهدت؟"]) {
    assert.ok(!candidates(pack, heard).some((c) => c.follow), heard);
    assert.ok(asksBack(heard), heard);
  }
  assert.equal(asksBack("I don't know."), false);
});
