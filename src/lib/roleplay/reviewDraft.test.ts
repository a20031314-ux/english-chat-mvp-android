import assert from "node:assert/strict";
import test from "node:test";
import {
  draftReviewPrompt,
  needsEyes,
  parseDraftReview,
  type DraftLine,
} from "./reviewDraft.ts";

const LINES: DraftLine[] = [
  { id: "cafe.greet", text: "Hi there! What can I get you?", translation: "안녕하세요! 뭐 드릴까요?", role: "barista" },
  { id: "cafe.size", text: "Sure. What size — small or large?", role: "barista" },
];

function prompt() {
  return draftReviewPrompt({
    lines: LINES,
    setting: "A café counter at lunchtime.",
    targetLanguage: "English",
    nativeLanguage: "Korean",
  });
}

test("the reviewer is given the line, who says it, and its gloss", () => {
  const written = prompt();
  assert.match(written, /id: cafe\.greet/);
  assert.match(written, /said by: barista/);
  assert.match(written, /gloss: "안녕하세요! 뭐 드릴까요\?"/);
  // A line without one is not made to look like it has an empty gloss.
  assert.doesNotMatch(written, /gloss: ""/);
});

test("the list is the mistakes this catalog actually made", () => {
  // A general theory of good writing produces a verdict on every line, which
  // is the same as no verdict at all.
  const written = prompt();
  assert.match(written, /narrator lines and customer-service scripts/);
  assert.match(written, /one breath long/);
  assert.match(written, /to go" at a café is takeaway/);
  assert.match(written, /Most lines in a decent draft are "ok"/);
});

test("a line nobody mentioned is not a line that vanished", () => {
  // A pass that silently drops half of what it was given is worse than one
  // that says nothing: the gap does not show up in the output.
  const verdicts = parseDraftReview('{"verdicts": []}', LINES);
  assert.equal(verdicts.length, 2);
  assert.deepEqual(verdicts.map((v) => v.verdict), ["ok", "ok"]);
});

test("a rewrite comes back with the verdict that asked for it", () => {
  const verdicts = parseDraftReview(
    JSON.stringify({
      verdicts: [
        { id: "cafe.greet", verdict: "ok", why: "" },
        {
          id: "cafe.size",
          verdict: "fix",
          why: "카운터에서는 이렇게 길게 말하지 않아요.",
          suggestion: "Small or large?",
        },
      ],
    }),
    LINES,
  );
  assert.equal(verdicts[1]?.suggestion, "Small or large?");
  assert.deepEqual(needsEyes(verdicts).map((v) => v.id), ["cafe.size"]);
});

test("an ok verdict carries no reasoning and no rewrite", () => {
  const verdicts = parseDraftReview(
    JSON.stringify({
      verdicts: [{ id: "cafe.greet", verdict: "ok", why: "괜찮아요", suggestion: "Hello!" }],
    }),
    LINES,
  );
  assert.equal(verdicts[0]?.why, "");
  assert.equal(verdicts[0]?.suggestion, undefined);
});

test("a verdict for a line nobody asked about is ignored", () => {
  const verdicts = parseDraftReview(
    JSON.stringify({ verdicts: [{ id: "taxi.greet", verdict: "cut", why: "..." }] }),
    LINES,
  );
  assert.deepEqual(verdicts.map((v) => v.id), ["cafe.greet", "cafe.size"]);
  assert.deepEqual(needsEyes(verdicts), []);
});

test("an unreadable answer reviews nothing rather than approving everything", () => {
  assert.deepEqual(parseDraftReview("not json", LINES), []);
});
