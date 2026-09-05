import assert from "node:assert/strict";
import test from "node:test";
import {
  MAX_LEVEL,
  MIN_LEVEL,
  applyTurn,
  isFloored,
  readTurn,
  settingsForLevel,
  startingDifficulty,
  type DifficultyState,
  type TurnOutcome,
} from "./difficulty.ts";

const good = (over: Partial<TurnOutcome> = {}): TurnOutcome => ({
  matched: true,
  attempts: 1,
  usedHint: false,
  wokeTutor: false,
  hesitationMs: 800,
  ...over,
});
const bad = (over: Partial<TurnOutcome> = {}): TurnOutcome =>
  good({ matched: false, ...over });

const run = (state: DifficultyState, outcome: TurnOutcome, times: number) => {
  let current = state;
  let moves = 0;
  for (let i = 0; i < times; i += 1) {
    const result = applyTurn(current, outcome);
    current = result.state;
    if (result.changed) moves += 1;
  }
  return { state: current, moves };
};

test("a wrong answer, a retry, a hint or a woken tutor all read as struggling", () => {
  assert.equal(readTurn(bad()), "struggled");
  assert.equal(readTurn(good({ attempts: 2 })), "struggled");
  assert.equal(readTurn(good({ usedHint: true })), "struggled");
  assert.equal(readTurn(good({ wokeTutor: true })), "struggled");
  // Going quiet is the earliest signal of the lot: people stop before they miss.
  assert.equal(readTurn(good({ hesitationMs: 5000 })), "struggled");
});

test("a prompt first-try answer reads as breezing, a slow one only as steady", () => {
  assert.equal(readTurn(good({ hesitationMs: 900 })), "breezed");
  assert.equal(readTurn(good({ hesitationMs: 2500 })), "steady");
});

test("one bad turn moves nothing", () => {
  // Everyone fumbles a sentence. A dial that moved on it would never settle.
  const start = startingDifficulty(3);
  const { state, changed } = applyTurn(start, bad());
  assert.equal(changed, false);
  assert.equal(state.level, 3);
});

test("two struggles in a row bring the level down", () => {
  const { state, moves } = run(startingDifficulty(3), bad(), 2);
  assert.equal(state.level, 2);
  assert.equal(moves, 1);
});

test("coming down is faster than going up", () => {
  // Being lost is worse than being bored, so the asymmetry is deliberate.
  const down = run(startingDifficulty(3), bad(), 2);
  const up = run(startingDifficulty(3), good(), 2);
  assert.equal(down.state.level, 2, "two struggles should be enough");
  assert.equal(up.state.level, 3, "two good turns should not be");
  assert.equal(run(startingDifficulty(3), good(), 3).state.level, 4);
});

test("a good turn interrupts a run of bad ones", () => {
  // Otherwise a stumble early in a scenario would still be counting later.
  let state = startingDifficulty(3);
  state = applyTurn(state, bad()).state;
  state = applyTurn(state, good({ hesitationMs: 2500 })).state;
  const { changed } = applyTurn(state, bad());
  assert.equal(changed, false, "the earlier struggle should no longer count");
});

test("the level stops at both ends", () => {
  assert.equal(run(startingDifficulty(MIN_LEVEL), bad(), 20).state.level, MIN_LEVEL);
  assert.equal(run(startingDifficulty(MAX_LEVEL), good(), 20).state.level, MAX_LEVEL);
});

test("a long run of good turns does not overshoot the top", () => {
  const { state } = run(startingDifficulty(3), good(), 30);
  assert.equal(state.level, MAX_LEVEL);
});

test("struggling at the gentlest setting is reported rather than absorbed", () => {
  // The dial has run out and the turns have not improved. That is the case for
  // a person, not a setting.
  const floored = run(startingDifficulty(MIN_LEVEL), bad(), 3).state;
  assert.equal(isFloored(floored), true);
  assert.equal(isFloored(startingDifficulty(MIN_LEVEL)), false);
  assert.equal(isFloored(run(startingDifficulty(3), bad(), 2).state), false);
});

test("the gentlest setting is forgiving and the strictest is still not exact", () => {
  const easiest = settingsForLevel(MIN_LEVEL);
  const hardest = settingsForLevel(MAX_LEVEL);
  assert.ok(easiest.matchStrictness < hardest.matchStrictness);
  assert.ok(easiest.showHints, "a struggling learner should be offered a hint");
  assert.ok(!hardest.showHints);
  // Even at the top, someone saying it their own way has to pass.
  assert.ok(hardest.matchStrictness < 1);
  // Patience narrows as the level rises: the tutor steps in sooner.
  assert.ok(hardest.tutorPatienceAttempts < easiest.tutorPatienceAttempts);
});

test("settings are clamped rather than trusted", () => {
  assert.equal(settingsForLevel(-4).level, MIN_LEVEL);
  assert.equal(settingsForLevel(99).level, MAX_LEVEL);
  assert.equal(startingDifficulty(99).level, MAX_LEVEL);
});
