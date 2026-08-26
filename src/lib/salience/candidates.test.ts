import assert from "node:assert/strict";
import { test } from "node:test";
import { locatePhrase, tokenText } from "./candidates.ts";
import type { UdToken } from "./types.ts";

/** Build the token list a segmenter would hand us, with real char offsets. */
function tokensOf(sentence: string, words: string[]): UdToken[] {
  let cursor = 0;
  return words.map((text, index) => {
    const charStart = sentence.indexOf(text, cursor);
    cursor = charStart + text.length;
    return {
      index,
      text,
      lemma: text,
      upos: "X",
      morphFeatures: {},
      depRelation: "dep",
      headIndex: -1,
      charStart,
      charEnd: cursor,
    };
  });
}

test("Japanese phrases map onto consecutive segmented tokens without spaces", () => {
  const tokens = tokensOf("今日はいい天気ですね", [
    "今日",
    "は",
    "いい",
    "天気",
    "です",
    "ね",
  ]);
  assert.deepEqual(locatePhrase(tokens, "今日は"), [{ start: 0, end: 1 }]);
  assert.deepEqual(locatePhrase(tokens, "天気"), [{ start: 3, end: 3 }]);
  assert.equal(tokenText(tokens, 0, 1), "今日は");
});

test("Hindi and English spaced phrases still match token by token", () => {
  const hindi = tokensOf("मैं स्कूल जाता हूँ", ["मैं", "स्कूल", "जाता", "हूँ"]);
  assert.deepEqual(locatePhrase(hindi, "जाता हूँ"), [{ start: 2, end: 3 }]);
  const english = tokensOf("She ended up leaving.", [
    "She",
    "ended",
    "up",
    "leaving",
    ".",
  ]);
  assert.deepEqual(locatePhrase(english, "ended up"), [{ start: 1, end: 2 }]);
  assert.equal(tokenText(english, 1, 2), "ended up");
});
