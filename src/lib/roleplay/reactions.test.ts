import assert from "node:assert/strict";
import test from "node:test";
import { sentencesFor } from "./catalog.ts";
import type { Direction } from "./director.ts";
import { findReaction, reactionIdsFor, reactionKey, sentencesOf, withBankReaction } from "./reactions.ts";

const en = sentencesFor("en");
const ja = sentencesFor("ja");
const es = sentencesFor("es");

function written(text: string): Direction {
  return {
    assessment: "on_track",
    say: { text },
    note: "",
    next: { step: "talk" },
  };
}

const openTalk = (language: string, bank: typeof en, canSplit = true, nativeLanguage = "ko") => ({
  language,
  nativeLanguage,
  bank,
  openEnded: true,
  canSplit,
});

test("sentences keep their punctuation, and full-width marks need no space", () => {
  assert.deepEqual(sentencesOf("Oh, nice! What did you order?"), ["Oh, nice! ", "What did you order?"]);
  assert.deepEqual(sentencesOf("なるほどね。じゃあ、次はどこに行くの？"), ["なるほどね。", "じゃあ、次はどこに行くの？"]);
  // A price is not the end of a sentence.
  assert.deepEqual(sentencesOf("That's 4.50, card or cash?"), ["That's 4.50, card or cash?"]);
  // Thai closes nothing with punctuation, so it is one sentence.
  assert.equal(sentencesOf("ดีจังเลย ไปที่ไหนมา").length, 1);
});

test("case, spaces and punctuation do not matter, letters and marks do", () => {
  assert.equal(reactionKey("That sounds great!"), reactionKey("that sounds great."));
  assert.equal(reactionKey("それ、いいね！"), reactionKey("それいいね。"));
  assert.notEqual(reactionKey("กิน"), reactionKey("กน"));
});

test("a reaction the bank holds is found in the character's own words", () => {
  const found = findReaction("Oh, that sounds great! What did you order?", "en", en);
  assert.equal(found?.id, "talk.nice");
  assert.equal(found?.text, "That sounds great.");
  assert.equal(found?.rest, "What did you order?");
});

test("a reaction across two sentences is taken whole", () => {
  const found = findReaction("Oh really? Tell me more. What happened next?", "en", en);
  assert.equal(found?.id, "talk.go-on");
  assert.equal(found?.rest, "What happened next?");
});

test("Japanese, written without spaces, finds its reaction too", () => {
  const found = findReaction("あー、なるほど。じゃあ、次はどこに行くの？", "ja", ja);
  assert.equal(found?.id, "talk.makes-sense");
  assert.equal(found?.text, "あー、なるほどね。");
  assert.equal(found?.rest, "じゃあ、次はどこに行くの？");
});

test("questions and lines that only start alike are left as written", () => {
  // A question in the bank is not a reaction, however close the words.
  assert.equal(findReaction("What did you do there?", "en", en), null);
  // More than a reaction in the first sentence: not the same line.
  assert.equal(findReaction("That sounds great, especially the beach part. Did you swim?", "en", en), null);
  // Polite register is not swapped for the bank's plain one.
  assert.equal(findReaction("いいですね。何を食べたんですか？", "ja", ja), null);
});

test("a language with no reactions passes through, French included", () => {
  const fr = sentencesFor("fr");
  assert.equal(findReaction("Super ! Qu'est-ce que tu as mangé ?", "fr", fr), null);
  const { direction, swapped } = withBankReaction(written("Super ! Qu'est-ce que tu as mangé ?"), openTalk("fr", fr));
  assert.equal(swapped, false);
  assert.deepEqual(direction.say, { text: "Super ! Qu'est-ce que tu as mangé ?" });
});

test("a reaction of the table's own works where there is no bank at all", () => {
  const found = findReaction("¡Qué bien! ¿Qué lugares visitaron en Sevilla?", "es", es);
  assert.equal(found?.text, "¡Qué bien!");
  assert.equal(found?.rest, "¿Qué lugares visitaron en Sevilla?");
  const english = findReaction("Wow, that’s awesome! How did it feel when you passed?", "en", en);
  assert.equal(english?.text, "That's awesome!");
  assert.equal(english?.rest, "How did it feel when you passed?");
});

test("a build that plays reactions gets the reaction split off", () => {
  const { direction, swapped } = withBankReaction(
    written("Oh, that sounds great! What did you order?"),
    openTalk("en", en),
  );
  assert.equal(swapped, true);
  assert.deepEqual(direction.react, { text: "That sounds great.", translation: "좋네요." });
  assert.deepEqual(direction.say, { text: "What did you order?" });
});

test("an older build gets the line whole unless the reaction is all of it", () => {
  const split = withBankReaction(written("Oh, that sounds great! What did you order?"), openTalk("en", en, false));
  assert.equal(split.swapped, false);
  assert.deepEqual(split.direction.say, { text: "Oh, that sounds great! What did you order?" });
  assert.equal(split.direction.react, undefined);

  const whole = withBankReaction(written("Oh, that sounds great!"), openTalk("en", en, false));
  assert.equal(whole.swapped, true);
  assert.deepEqual(whole.direction.say, { text: "That sounds great.", translation: "좋네요." });
});

test("the Korean gloss is only given to Korean speakers", () => {
  const { direction } = withBankReaction(
    written("なるほど。で、そっちは？"),
    openTalk("ja", ja, true, "fr"),
  );
  assert.deepEqual(direction.react, { text: "あー、なるほどね。" });
});

test("recorded lines, scripted scenes and tips are left alone", () => {
  const recorded: Direction = { ...written(""), say: { id: "open.hi" } };
  assert.equal(withBankReaction(recorded, openTalk("en", en)).swapped, false);
  const scripted = withBankReaction(written("That sounds great. Small or large?"), {
    ...openTalk("en", en),
    openEnded: false,
  });
  assert.equal(scripted.swapped, false);
  const stuck: Direction = { ...written("Take your time. Try 'I went to…'"), assessment: "stuck", note: "tip" };
  const helped = withBankReaction(stuck, openTalk("en", en));
  assert.equal(helped.direction.note, "tip");
  assert.deepEqual(helped.direction.react, { text: "Take your time.", translation: "천천히 하세요." });
});

test("every form names one reaction, and every reaction is in the bank", () => {
  for (const [language, bank] of [["en", en], ["ja", ja]] as const) {
    for (const id of reactionIdsFor(language)) {
      const line = bank[id];
      assert.ok(line, `${language} ${id} is in the bank`);
      // A reaction does not ask — except surprise, which is said as a question.
      if (id !== "talk.surprised") assert.ok(!/[?？]$/.test(line.text.trim()), `${language} ${id} asks`);
    }
    for (const [id, line] of Object.entries(bank)) {
      if (!id.startsWith("talk.")) continue;
      const found = findReaction(line.text, language, bank);
      if (found) assert.equal(found.id, id, `${language} ${line.text}`);
    }
  }
});
