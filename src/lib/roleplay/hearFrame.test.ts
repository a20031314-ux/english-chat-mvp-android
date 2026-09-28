import assert from "node:assert/strict";
import test from "node:test";
import { TURN_NOT_STARTED, hearFrame } from "./hearFrame.ts";

/** Play a turn through the detector: [level, milliseconds] one after another. */
function play(shape: [number, number][]) {
  let turn = TURN_NOT_STARTED;
  let now = 0;
  let finished = false;
  for (const [level, ms] of shape) {
    for (let elapsed = 0; elapsed < ms; elapsed += 60) {
      now += 60;
      const heard = hearFrame(turn, level, now);
      turn = heard.turn;
      if (heard.finished) {
        finished = true;
        return { turn, finished, at: now };
      }
    }
  }
  return { turn, finished, at: now };
}

const LOUD = 0.08;
const QUIET = 0.001;

test("a short turn is heard, gaps inside its words and all", () => {
  // "what's up" — loud, the stop in "what's", loud again, the s, loud — then
  // they stop. Reported from a phone: it was not recognised, and the learner
  // had to keep talking. Requiring three hundred unbroken milliseconds meant
  // the tally restarted at every consonant, so the turn never counted as
  // speech, and only a pause after speech ends a turn — so nothing ended it.
  const said = play([
    [LOUD, 180],
    [QUIET, 120],
    [LOUD, 180],
    [QUIET, 120],
    [LOUD, 180],
    [QUIET, 1200],
  ]);
  assert.ok(said.turn.spoke, "that was somebody talking");
  assert.ok(said.finished, "and the turn ended when they stopped");
});

test("one short noise on its own is still not a turn", () => {
  // What the threshold is for: a cough, a chair, a door. The tally survives a
  // gap inside a word and starts again after a longer one, so a burst with
  // nothing behind it is forgotten rather than added to the next burst.
  const noise = play([
    [LOUD, 120],
    [QUIET, 2000],
  ]);
  assert.ok(!noise.turn.spoke, "a burst too short to be a word");
  assert.ok(!noise.finished, "and nothing to end");
});

test("two coughs a second apart do not add up to a turn", () => {
  const coughs = play([
    [LOUD, 120],
    [QUIET, 1000],
    [LOUD, 120],
    [QUIET, 1000],
  ]);
  assert.ok(!coughs.turn.spoke);
});

test("a turn does not end while somebody is still talking", () => {
  // The pause has to outlast thinking mid-sentence, which is longer in a
  // language someone is learning.
  const thinking = play([
    [LOUD, 400],
    [QUIET, 700],
    [LOUD, 400],
    [QUIET, 300],
  ]);
  assert.ok(thinking.turn.spoke);
  assert.ok(!thinking.finished, "seven hundred milliseconds is thinking, not finishing");
});

test("when they started talking is remembered, not when it was confirmed", () => {
  // Hesitation is measured from the first sound they made. Counting from the
  // moment the detector made up its mind would report every turn as three
  // hundred milliseconds quicker than it was.
  const said = play([
    [QUIET, 600],
    [LOUD, 400],
    [QUIET, 1200],
  ]);
  assert.ok(said.turn.spoke);
  assert.equal(said.turn.firstSpeechAt, 660, "the first loud frame, not the confirming one");
});
