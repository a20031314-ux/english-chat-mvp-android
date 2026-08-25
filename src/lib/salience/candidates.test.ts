import assert from "node:assert/strict";
import { test } from "node:test";
import { locatePhrase, tokenText } from "./candidates.ts";
import { parseUd } from "./udParse.ts";

test("Japanese phrases map onto consecutive segmented tokens without spaces", () => {
  const { tokens } = parseUd("今日はいい天気ですね", "ja");
  assert.deepEqual(
    tokens.map((token) => token.text),
    ["今日", "は", "いい", "天気", "です", "ね"],
  );
  assert.deepEqual(locatePhrase(tokens, "今日は"), [{ start: 0, end: 1 }]);
  assert.deepEqual(locatePhrase(tokens, "天気"), [{ start: 3, end: 3 }]);
  assert.equal(tokenText(tokens, 0, 1), "今日は");
});

test("Hindi and English spaced phrases still match token by token", () => {
  const hindi = parseUd("मैं स्कूल जाता हूँ", "hi").tokens;
  assert.deepEqual(locatePhrase(hindi, "जाता हूँ"), [{ start: 2, end: 3 }]);
  const english = parseUd("She ended up leaving.", "en").tokens;
  assert.deepEqual(locatePhrase(english, "ended up"), [{ start: 1, end: 2 }]);
  assert.equal(tokenText(english, 1, 2), "ended up");
});
