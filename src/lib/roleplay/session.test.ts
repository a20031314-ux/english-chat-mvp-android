import assert from "node:assert/strict";
import test from "node:test";
import { findScenario, sentencesFor } from "./catalog.ts";
import { MIN_LEVEL } from "./difficulty.ts";
import type { Direction } from "./director.ts";
import {
  afterSaying,
  applyDirection,
  currentInstruction,
  directionFailed,
  isMumble,
  judge,
  phraseScore,
  startSession,
  submitSpeech,
  type SessionState,
  resumeListening,
} from "./session.ts";
import { isLearnerNode } from "./script.ts";

const scenario = findScenario("cafe-order")!;
const bank = sentencesFor("en");

/** Play tutor lines until the scenario is waiting on the learner, or ends. */
function runToListen(state: SessionState, clock = 0): SessionState {
  let current = state;
  for (let i = 0; i < 20; i += 1) {
    const instruction = currentInstruction(scenario, bank, current);
    if (instruction.do !== "say") return current;
    current = afterSaying(scenario, bank, current, clock).state;
  }
  throw new Error("scenario did not stop talking");
}

test("a phrasing counts even when the learner says more than it", () => {
  // "please" on the end is not a less correct answer.
  assert.equal(phraseScore("can I get a coffee", "Can I get a coffee, please?"), 1);
  assert.equal(phraseScore("small", "A small one please"), 1);
  assert.ok(phraseScore("can I get a coffee", "I want tea") < 0.5);
});

test("punctuation and case cannot fail a match", () => {
  assert.equal(phraseScore("for here", "For here."), 1);
  assert.equal(phraseScore("to go", "TO GO!"), 1);
});

test("the scenario opens by speaking, not by listening", () => {
  const state = startSession(scenario);
  const instruction = currentInstruction(scenario, bank, state);
  assert.equal(instruction.do, "say");
  assert.match(instruction.do === "say" ? instruction.audioPath ?? "" : "", /\.mp3$/);
});

test("a good answer walks the scenario forward", () => {
  let state = runToListen(startSession(scenario));
  assert.equal(currentInstruction(scenario, bank, state).do, "listen");

  const result = submitSpeech(scenario, bank, state, "Can I get a latte please", 1000);
  assert.equal(result.matched, true);
  assert.equal(result.instruction.do, "say");
  state = result.state;
  assert.equal(state.nodeId, "size");
});

test("a branch answers the question and comes back to it", () => {
  // The milk question rejoins the order, which is what makes branches cheap.
  const state = runToListen(startSession(scenario));
  const asked = submitSpeech(scenario, bank, state, "Do you have oat milk?", 1000);
  assert.equal(asked.matched, true);
  assert.equal(asked.state.nodeId, "milk-answer");

  const back = afterSaying(scenario, bank, asked.state, 2000);
  assert.equal(back.state.nodeId, "order", "the order should resume");
  assert.equal(back.instruction.do, "listen");
});

test("a mumble takes the scripted recovery, not the director", () => {
  // Asking a model what to say to "mmm" buys nothing a recorded "sorry?" does not.
  const state = runToListen(startSession(scenario));
  const missed = submitSpeech(scenario, bank, state, "mmm er", 1000);
  assert.equal(missed.matched, false);
  assert.equal(missed.instruction.do, "say");
  assert.equal(missed.state.nodeId, "pardon-order");
});

/** Walk the café to "for here or to go?", which has no scripted "sorry?". */
function atHereOrToGo(): SessionState {
  let state = runToListen(startSession(scenario));
  state = submitSpeech(scenario, bank, state, "Can I get a latte", 1000).state;
  state = afterSaying(scenario, bank, state, 1100).state; // size
  state = submitSpeech(scenario, bank, state, "small", 1200).state;
  state = afterSaying(scenario, bank, state, 1300).state; // here-or-to-go
  assert.equal(state.nodeId, "here-answer");
  return state;
}

function direction(partial: Partial<Direction> & Pick<Direction, "next">): Direction {
  return {
    assessment: "on_track",
    say: { text: "Sure thing.", translation: "그럼요." },
    note: "",
    ...partial,
  };
}

test("a real sentence the script did not expect goes to the director", () => {
  // Not to a correction panel and not to a call: the character answers it.
  const state = atHereOrToGo();
  const turn = submitSpeech(scenario, bank, state, "what do you mean", 2000);
  assert.equal(turn.matched, false);
  assert.equal(turn.instruction.do, "direct");
  if (turn.instruction.do !== "direct") return;
  assert.equal(turn.instruction.request.heard, "what do you mean");
  assert.equal(turn.instruction.request.nodeId, "here-answer");
  assert.equal(turn.state.nodeId, "here-answer", "the question should still stand");
  const history = turn.instruction.request.history;
  assert.equal(history[history.length - 1]?.text, "what do you mean");
});

test("a written line the director picks is played from its recording", () => {
  const waiting = submitSpeech(scenario, bank, atHereOrToGo(), "what?", 2000).state;
  const moved = applyDirection(
    scenario,
    bank,
    waiting,
    direction({
      assessment: "stuck",
      say: { id: "cafe.fix-here" },
      note: "For here / To go",
      next: { step: "here-answer" },
    }),
    3000,
  );
  assert.equal(moved.instruction.do, "say");
  if (moved.instruction.do !== "say") return;
  assert.equal(moved.instruction.text, bank["cafe.fix-here"]!.text);
  assert.match(moved.instruction.audioPath ?? "", /\.mp3$/);
  assert.match(
    moved.instruction.translation ?? "",
    /For here \/ To go$/,
    "the tip rides under the line",
  );
  const heard = afterSaying(scenario, bank, moved.state, 4000);
  assert.equal(heard.instruction.do, "listen");
  assert.equal(heard.state.listeningSince, 4000);
  assert.equal(heard.state.attempts, 1, "a struggle on the same step still counts");
});

test("a line the director wrote is spoken in the scene's own voice", () => {
  const waiting = submitSpeech(scenario, bank, atHereOrToGo(), "is it cold outside", 2000).state;
  const moved = applyDirection(
    scenario,
    bank,
    waiting,
    direction({
      assessment: "topic_change",
      say: { text: "Freezing! Anyway — for here or to go?", translation: "추워요!" },
      next: { step: "here-answer" },
    }),
    3000,
  );
  assert.equal(moved.instruction.do, "say");
  if (moved.instruction.do !== "say") return;
  assert.equal(moved.instruction.audioPath, undefined, "nothing recorded it");
  assert.equal(moved.instruction.voice, scenario.voice);
});

test("off the script, every turn goes to the director until it brings them back", () => {
  const waiting = submitSpeech(scenario, bank, atHereOrToGo(), "do you like working here", 2000).state;
  let state = applyDirection(
    scenario,
    bank,
    waiting,
    direction({ assessment: "off_script", next: { free: true } }),
    3000,
  ).state;
  state = afterSaying(scenario, bank, state, 3500).state;
  assert.equal(state.mode, "free");
  const listen = currentInstruction(scenario, bank, state);
  assert.equal(listen.do === "listen" ? listen.goal : "x", "", "no task while off the script");

  // "to go" would match the step waiting at home, but off the script it is
  // the director's to read, not the graph's.
  const turn = submitSpeech(scenario, bank, state, "I love to go hiking", 4000);
  assert.equal(turn.instruction.do, "direct");
  if (turn.instruction.do !== "direct") return;
  assert.equal(turn.instruction.request.mode, "free");
  assert.equal(turn.instruction.request.freeTurns, 1);

  const back = applyDirection(
    scenario,
    bank,
    turn.state,
    direction({ say: { id: "cafe.here-or-to-go" }, next: { step: "here-answer" } }),
    5000,
  );
  assert.equal(back.state.mode, "script");
  assert.equal(back.state.freeTurns, 0);
});

test("the director can move the scene on when the answer was right", () => {
  // Fine English the script did not write down.
  const waiting = submitSpeech(scenario, bank, atHereOrToGo(), "I will drink it inside", 2000).state;
  const moved = applyDirection(
    scenario,
    bank,
    waiting,
    direction({ say: { id: "cafe.total" }, next: { step: "payment" } }),
    3000,
  );
  assert.equal(moved.state.nodeId, "payment");
  assert.equal(moved.state.attempts, 0);
  const after = afterSaying(scenario, bank, moved.state, 4000);
  assert.equal(after.instruction.do, "listen");
});

test("an answer the director accepts does not pull the level down", () => {
  let state = atHereOrToGo();
  const before = state.difficulty.level;
  for (let i = 0; i < 3; i += 1) {
    state = submitSpeech(scenario, bank, state, "I will drink it inside", 2000).state;
    state = afterSaying(
      scenario,
      bank,
      applyDirection(scenario, bank, state, direction({ next: { step: "here-answer" } }), 2100)
        .state,
      2200,
    ).state;
  }
  assert.ok(state.difficulty.level >= before);
});

test("the director closing the scene finishes it after the line", () => {
  const waiting = submitSpeech(scenario, bank, atHereOrToGo(), "sorry I have to leave", 2000).state;
  const moved = applyDirection(
    scenario,
    bank,
    waiting,
    direction({ assessment: "closing", say: { id: "cafe.closing" }, next: { end: true } }),
    3000,
  );
  assert.equal(moved.instruction.do, "say");
  const done = afterSaying(scenario, bank, moved.state, 4000);
  assert.equal(done.instruction.do, "finish");
});

test("an unreachable director is heard as the scene's recorded help", () => {
  const waiting = submitSpeech(scenario, bank, atHereOrToGo(), "what do you mean", 2000).state;
  const fallen = directionFailed(scenario, bank, waiting, 3000);
  assert.equal(fallen.instruction.do, "say");
  if (fallen.instruction.do !== "say") return;
  assert.equal(fallen.instruction.text, bank["cafe.fix-here"]!.text);
  assert.equal(fallen.state.pending, null);
});

test("hesitation alone is a mumble, words are not", () => {
  assert.equal(isMumble("mmm er"), true);
  assert.equal(isMumble("Um... uh"), true);
  assert.equal(isMumble(""), true);
  assert.equal(isMumble("um to go"), false);
});

test("a hint is held back until they have missed once", () => {
  // Offering it up front answers the question before it has been asked.
  const state = runToListen(startSession(scenario));
  const first = currentInstruction(scenario, bank, state);
  assert.equal(first.do === "listen" ? first.hint : "x", undefined);

  const missed = submitSpeech(scenario, bank, state, "mmm er", 1000);
  const retry = afterSaying(scenario, bank, missed.state, 1500);
  assert.equal(retry.instruction.do, "listen");
  if (retry.instruction.do !== "listen") return;
  assert.ok(retry.instruction.hint, "the second try should offer the hint");
});

test("a retry is the same question, so attempts keep counting", () => {
  const state = runToListen(startSession(scenario));
  const first = submitSpeech(scenario, bank, state, "mmm", 1000);
  const back = afterSaying(scenario, bank, first.state, 1500);
  assert.equal(back.state.attempts, 1, "the first miss should still count");

  const second = submitSpeech(scenario, bank, back.state, "uhh", 2000);
  // Patience has run out, so the director helps rather than "sorry?" again.
  assert.equal(second.instruction.do, "direct");
});

test("struggling pulls the level down over the course of a scenario", () => {
  let state = runToListen(startSession(scenario, 3));
  const before = state.difficulty.level;
  const first = submitSpeech(scenario, bank, state, "mmm", 1000);
  state = afterSaying(scenario, bank, first.state, 1500).state;
  const second = submitSpeech(scenario, bank, state, "uhh", 9000);
  const helped = applyDirection(
    scenario,
    bank,
    second.state,
    direction({ assessment: "stuck", next: { step: "order" } }),
    9500,
  );
  assert.ok(
    helped.state.difficulty.level < before,
    "two struggles in a row should have moved the dial",
  );
});

test("a long answer that started promptly is not a struggle", () => {
  // The bug: once the turn began ending itself, hesitation was measured to the
  // moment it was sent — the whole sentence plus the pause after it. Every
  // answer over a couple of seconds read as a struggle, the level sank, and at
  // the bottom the matcher took "I walked here" for "for here".
  const answers = ["Can I get a latte please", "small please", "for here please"];
  // Not zero: a listen stamped at 0 reads as no listen at all.
  let state = runToListen(startSession(scenario, 3), 1000);
  const before = state.difficulty.level;
  let clock = 1000;
  for (const said of answers) {
    const listening = state.listeningSince ?? clock;
    // Started talking within a second, and took seven more to finish.
    const result = submitSpeech(scenario, bank, state, said, listening + 8000, listening + 800);
    assert.equal(result.matched, true, `"${said}" should have been accepted`);
    clock = listening + 9000;
    state = runToListen(result.state, clock);
  }
  assert.ok(
    state.difficulty.level >= before,
    `prompt answers moved the level from ${before} to ${state.difficulty.level}`,
  );
});

test("the same turns measured to the send would have sunk the level", () => {
  // What the fix is against, kept so the measure cannot quietly drift back.
  let state = runToListen(startSession(scenario, 3), 1000);
  const before = state.difficulty.level;
  for (const said of ["Can I get a latte please", "small please"]) {
    const listening = state.listeningSince ?? 1000;
    const result = submitSpeech(scenario, bank, state, said, listening + 8000);
    state = runToListen(result.state, listening + 9000);
  }
  assert.ok(state.difficulty.level < before);
});

test("a scenario that reaches its last line finishes", () => {
  let state = runToListen(startSession(scenario));
  for (const said of ["Can I get a latte", "small", "for here", "card"]) {
    const result = submitSpeech(scenario, bank, state, said, 1000);
    assert.equal(result.matched, true, `"${said}" should have been accepted`);
    state = runToListen(result.state);
  }
  assert.equal(state.finished, true);
  assert.equal(currentInstruction(scenario, bank, state).do, "finish");
});

test("strictness actually decides, rather than being carried around", () => {
  const node = scenario.nodes["size-answer"];
  assert.ok(node && isLearnerNode(node));
  // "a small one" contains "small", so it clears anything up to full marks.
  assert.ok(judge(node, "a small one", 0.9));
  // A near miss passes when the dial is forgiving and fails when it is not.
  assert.ok(judge(node, "the small please", 0.4));
  assert.equal(judge(node, "hmm maybe", 0.4), null);
});

test("the gentlest level is more forgiving than the strictest", () => {
  const node = scenario.nodes["payment"];
  assert.ok(node && isLearnerNode(node));
  const easy = startSession(scenario, MIN_LEVEL);
  const hard = startSession(scenario, 5);
  const heard = "by card";
  assert.ok(
    judge(node, heard, 0.4) && judge(node, heard, 0.8),
    "an exact phrase should pass at either end",
  );
  assert.ok(easy.difficulty.level < hard.difficulty.level);
});

test("a side question can be asked once, not forever", () => {
  // The milk branch rejoins the order, and the graph has no memory of it — so
  // without this it can be asked round and round. A simulation walked into
  // exactly that loop.
  let state = runToListen(startSession(scenario));
  const first = submitSpeech(scenario, bank, state, "Do you have oat milk?", 1000);
  assert.equal(first.state.nodeId, "milk-answer");
  state = runToListen(first.state, 2000);
  assert.equal(state.nodeId, "order", "back at the order");

  const again = submitSpeech(scenario, bank, state, "Do you have oat milk?", 3000);
  assert.notEqual(
    again.state.nodeId,
    "milk-answer",
    "the same side question should not be answered twice",
  );
});

test("the main path still works after a side question was used up", () => {
  // Exhausting one branch must not take the others with it.
  let state = runToListen(startSession(scenario));
  state = runToListen(
    submitSpeech(scenario, bank, state, "Do you have oat milk?", 1000).state,
    2000,
  );
  const ordered = submitSpeech(scenario, bank, state, "Can I get a latte", 3000);
  assert.equal(ordered.matched, true);
  assert.equal(ordered.state.nodeId, "size");
});

test("reading a review does not count as hesitating", () => {
  // The button exists so someone can stop and understand. Charging them for
  // the time they spent reading would take the level down for it.
  let state = runToListen(startSession(scenario, 3), 1000);
  const before = state.difficulty.level;
  const listening = state.listeningSince ?? 1000;

  // Thirty seconds with the review open, then an ordinary answer.
  const resumed = resumeListening(scenario, bank, state, listening + 30000);
  assert.equal(resumed.instruction.do, "listen");
  const result = submitSpeech(
    scenario,
    bank,
    resumed.state,
    "Can I get a latte please",
    listening + 32000,
    listening + 30800,
  );
  assert.equal(result.matched, true);
  state = runToListen(result.state, listening + 33000);
  assert.ok(
    state.difficulty.level >= before,
    `reading pulled the level from ${before} to ${state.difficulty.level}`,
  );
});

test("a review does not forgive the attempts already spent", () => {
  // Someone on their second go is still on their second go: the same question
  // is being asked, and the scene has not moved.
  const state = runToListen(startSession(scenario, 3), 1000);
  const missed = submitSpeech(scenario, bank, state, "mmm", 2000, 1500);
  const resumed = resumeListening(scenario, bank, missed.state, 40000);
  assert.equal(resumed.state.attempts, missed.state.attempts);
  assert.equal(resumed.state.nodeId, missed.state.nodeId);
});
