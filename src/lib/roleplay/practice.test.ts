import assert from "node:assert/strict";
import test from "node:test";
import {
  compareToTarget,
  parsePractice,
  practicePrompt,
  troubleWords,
} from "./practice.ts";

test("a sentence said as given comes back clean", () => {
  const comparison = compareToTarget("Large, please.", "large please");
  assert.equal(comparison.clean, true);
  assert.deepEqual(troubleWords(comparison), []);
});

test("punctuation and case are not something to get wrong", () => {
  assert.equal(compareToTarget("Card, please.", "Card please!").clean, true);
});

test("a word that came out as another word is located, not just noticed", () => {
  // The whole reason the target is given first: this is evidence about a sound,
  // where the same transcript in free conversation would be ambiguous.
  const comparison = compareToTarget("Large, please.", "large peace");
  assert.deepEqual(comparison.outcomes, [
    { kind: "kept", word: "large" },
    { kind: "changed", word: "please", heardAs: "peace" },
  ]);
  assert.deepEqual(troubleWords(comparison), ['"please" came out as "peace"']);
});

test("a word that did not arrive at all is said to be missing, not changed", () => {
  const comparison = compareToTarget("Can I get a latte please", "can I get latte");
  const kinds = comparison.outcomes.map((outcome) => outcome.kind);
  assert.ok(kinds.includes("dropped"));
  assert.ok(troubleWords(comparison).some((line) => line.includes("did not come out")));
});

test("words nobody asked for are kept apart from words that changed", () => {
  const comparison = compareToTarget("Card, please.", "um card please thanks");
  assert.deepEqual(
    comparison.outcomes.map((outcome) => outcome.kind),
    ["kept", "kept"],
  );
  assert.deepEqual(comparison.added.sort(), ["thanks", "um"]);
  assert.equal(comparison.clean, false);
});

test("saying nothing is every word missing, not a crash", () => {
  const comparison = compareToTarget("Large, please.", "");
  assert.deepEqual(
    comparison.outcomes.map((outcome) => outcome.kind),
    ["dropped", "dropped"],
  );
});

test("the prompt refuses the claims a transcript cannot support", () => {
  // Text arrives with the sound already gone. Saying anything about stress or
  // vowel length would be inventing it, and a learner who catches that once
  // stops believing the rest.
  const written = practicePrompt({
    target: "Large, please.",
    heard: "large peace",
    comparison: compareToTarget("Large, please.", "large peace"),
    targetLanguage: "English",
    nativeLanguage: "Korean",
  });
  assert.match(written, /"please" came out as "peace"/);
  assert.match(written, /reading text, not listening/);
  assert.match(written, /do not mention them/);
  assert.match(written, /Never guess at an accent/);
  assert.match(written, /in Korean/);
});

test("a word that sounds the same is not a sound to fix", () => {
  // Seen from the real model: "for here" heard as "for hear" was answered with
  // "pronounce the r more clearly" — advice about a sound that had landed
  // perfectly. The recogniser had simply picked the other spelling.
  const written = practicePrompt({
    target: "For here, please.",
    heard: "for hear please",
    comparison: compareToTarget("For here, please.", "for hear please"),
    targetLanguage: "English",
    nativeLanguage: "Korean",
  });
  assert.match(written, /sounds the same as the word they were given/);
  assert.match(written, /Say that it was said correctly/);
});

test("a clean attempt is described as one", () => {
  const written = practicePrompt({
    target: "Large, please.",
    heard: "large please",
    comparison: compareToTarget("Large, please.", "large please"),
    targetLanguage: "English",
    nativeLanguage: "Korean",
  });
  assert.match(written, /Every word came through/);
});

test("an answer without a note is nothing to show", () => {
  assert.equal(parsePractice('{"good": true}'), null);
  assert.equal(parsePractice("not json"), null);
  const good = parsePractice('{"good": true, "note": "그대로 들렸어요."}');
  assert.deepEqual(good, { good: true, note: "그대로 들렸어요." });
  const bad = parsePractice('{"good": "yes", "note": "please의 l이 빠졌어요."}');
  assert.equal(bad?.good, false, "only a real true is good");
});
