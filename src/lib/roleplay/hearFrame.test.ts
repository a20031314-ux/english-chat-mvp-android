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

// 아이폰 원음 마이크(2026-10-20): 방 소리가 들쭉날쭉 깔려 있어도 말이 끝나면 턴이 곧 끝나야 한다.
test("iOS raw microphone: a noisy room still ends the turn soon after the last word", async () => {
  const { makeLevelScaler, hearFrame: frame, TURN_NOT_STARTED: start } = await import("./hearFrame.ts");
  const scaler = makeLevelScaler(true);
  let turn = start;
  let endedAt: number | null = null;
  const noise = (i: number) => 0.002 + ((i * 7919) % 13) / 13 * 0.01; // 0.002~0.012, 가장 조용한 순간만 보면 기준이 너무 낮음
  for (let t = 0; t <= 8000; t += 60) {
    const speaking = t >= 1000 && t < 3000;
    const raw = speaking ? 0.03 + ((t / 60) % 3) * 0.01 : noise(t / 60);
    const heard = frame(turn, scaler.scale(raw, t), t);
    turn = heard.turn;
    if (heard.finished) {
      endedAt = t;
      break;
    }
  }
  assert.ok(turn.spoke, "speech was heard");
  assert.ok(endedAt !== null && endedAt < 3000 + 2000, `ended at ${endedAt}`);
});

test("Android levels are untouched by the scaler", async () => {
  const { makeLevelScaler } = await import("./hearFrame.ts");
  const scaler = makeLevelScaler(false);
  assert.equal(scaler.scale(0.013, 100), 0.013);
});

test("iOS: 조금 시끄러운 방에서 보통 크기로 말한 목소리(0.017)도 말로 듣는다 (85.9 진단 2026-10-25)", async () => {
  const { makeLevelScaler, hearFrame: frame, TURN_NOT_STARTED: start } = await import("./hearFrame.ts");
  const scaler = makeLevelScaler(true);
  let turn = start;
  let endedAt: number | null = null;
  for (let t = 0; t <= 9000; t += 60) {
    const speaking = t >= 1200 && t < 3200;
    const raw = speaking ? 0.017 : 0.007 + ((t / 60) % 3) * 0.0004; // 방 소리 중간값 약 0.0074 → 예전 기준 0.02
    const heard = frame(turn, scaler.scale(raw, t), t);
    turn = heard.turn;
    if (heard.finished) {
      endedAt = t;
      break;
    }
  }
  assert.ok(turn.spoke, `speech was heard (threshold ${scaler.threshold()})`);
  assert.ok(endedAt !== null && endedAt < 3200 + 2500, `ended at ${endedAt}`);
});

test("작게 말한 턴은 받아쓰기에 보내고, 방 소리만 있던 턴은 보내지 않는다", async () => {
  const { quietVoiceWorthSending } = await import("./hearFrame.ts");
  assert.equal(quietVoiceWorthSending(0.017, 0.02), true);
  assert.equal(quietVoiceWorthSending(0.006, 0.014), false);
  assert.equal(quietVoiceWorthSending(0.009, 0.02), false);
});
