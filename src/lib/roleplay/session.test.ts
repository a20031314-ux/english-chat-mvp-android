import assert from "node:assert/strict";
import test from "node:test";
import { findScenario, sentencesFor } from "./catalog.ts";
import { MIN_LEVEL } from "./difficulty.ts";
import {
  afterSaying,
  afterTutor,
  currentInstruction,
  judge,
  phraseScore,
  startSession,
  askTutor,
  submitSpeech,
  tutorHandover,
  type SessionState,
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
  assert.match(instruction.do === "say" ? instruction.audioPath : "", /\.mp3$/);
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

test("an unrecognised answer takes the scripted recovery, not a tutor", () => {
  // Waking a live tutor for a mumble is paying call rates for "sorry?".
  const state = runToListen(startSession(scenario));
  const missed = submitSpeech(scenario, bank, state, "mmm er", 1000);
  assert.equal(missed.matched, false);
  assert.equal(missed.instruction.do, "say");
  assert.equal(missed.state.nodeId, "pardon-order");
});

test("a node with no recovery plays its written correction, not a call", () => {
  let state = runToListen(startSession(scenario));
  state = submitSpeech(scenario, bank, state, "Can I get a latte", 1000).state;
  state = afterSaying(scenario, bank, state, 1100).state; // size
  state = submitSpeech(scenario, bank, state, "small", 1200).state;
  state = afterSaying(scenario, bank, state, 1300).state; // here-or-to-go

  const stuck = submitSpeech(scenario, bank, state, "what do you mean", 2000);
  assert.equal(stuck.instruction.do, "correct");
  if (stuck.instruction.do !== "correct") return;
  // Written in advance, so playing it costs nothing where a live session would
  // cost about fifty times a judgement.
  assert.ok(stuck.instruction.spoken, "this turn's trouble was predictable");
  assert.match(stuck.instruction.spoken.text, /for here/i);
  assert.match(stuck.instruction.spoken.audioPath, /\.mp3$/);
  // The context rides along for the tutor, if the learner asks back.
  assert.match(stuck.instruction.context.setting, /caf/i);
  assert.equal(stuck.instruction.context.heard, "what do you mean");
});

test("a correction leaves the learner at the same question, not past it", () => {
  let state = runToListen(startSession(scenario));
  state = submitSpeech(scenario, bank, state, "Can I get a latte", 1000).state;
  state = afterSaying(scenario, bank, state, 1100).state;
  state = submitSpeech(scenario, bank, state, "small", 1200).state;
  state = afterSaying(scenario, bank, state, 1300).state;
  const before = state.nodeId;

  const stuck = submitSpeech(scenario, bank, state, "no idea", 2000);
  assert.equal(stuck.instruction.do, "correct");
  assert.equal(stuck.state.nodeId, before, "the question should still stand");

  const resumed = afterTutor(scenario, bank, stuck.state, 3000);
  assert.equal(resumed.instruction.do, "listen");
  assert.equal(resumed.state.listeningSince, 3000);
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
  // Patience has run out, so this one is corrected rather than asked again.
  assert.equal(second.instruction.do, "correct");
});

test("struggling pulls the level down over the course of a scenario", () => {
  let state = runToListen(startSession(scenario, 3));
  const before = state.difficulty.level;
  const first = submitSpeech(scenario, bank, state, "mmm", 1000);
  state = afterSaying(scenario, bank, first.state, 1500).state;
  const second = submitSpeech(scenario, bank, state, "uhh", 9000);
  assert.ok(
    second.state.difficulty.level < before,
    "two struggles in a row should have moved the dial",
  );
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

test("the handover tells the tutor everything, because it has heard nothing", () => {
  // The scripted half happened as audio files; the realtime session opens for
  // the first time at this moment, and only because the learner asked back.
  let state = runToListen(startSession(scenario));
  state = submitSpeech(scenario, bank, state, "Can I get a latte", 1000).state;
  state = afterSaying(scenario, bank, state, 1100).state;
  state = submitSpeech(scenario, bank, state, "small", 1200).state;
  state = afterSaying(scenario, bank, state, 1300).state;

  const asked = askTutor(scenario, state, "why is 'here' wrong?");
  assert.equal(asked.do, "wakeTutor");
  if (asked.do !== "wakeTutor") return;

  const { scene } = tutorHandover(asked.context, "English");
  assert.match(scene, /barista/, "it should know who it is");
  assert.match(scene, /caf/i, "it should know where it is");
  assert.match(scene, /why is 'here' wrong\?/, "and what was asked");
  assert.ok(scene.includes(asked.context.goal), "and what was wanted");
});

test("the tutor is asked for one turn, not for the conversation", () => {
  // A tutor that starts something here leaves the learner somewhere the script
  // cannot pick up again.
  const { ask } = tutorHandover(
    { setting: "A café.", tutorRole: "barista", goal: "주문하세요.", heard: "uh" },
    "English",
  );
  assert.match(ask, /one turn/i);
  assert.match(ask, /hand the turn/i);
  assert.match(ask, /do not start a new conversation/i);
  // It stays in character: being told it is a tutor breaks the scene.
  assert.match(ask, /Stay the barista/);
  assert.match(ask, /English/);
});

test("the handover never asks the tutor to read its own markup", () => {
  const { scene, ask } = tutorHandover(
    { setting: "A café.", tutorRole: "barista", goal: "주문하세요.", heard: "uh" },
    "English",
  );
  assert.match(scene, /<scene>/, "the scene is tagged so it reads as context");
  assert.match(ask, /Do not read the tags aloud/);
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

test("only asking back opens a live session", () => {
  // The one door to a call. Nobody is charged for one by missing a turn.
  const state = runToListen(startSession(scenario));
  const asked = askTutor(scenario, state, "why not 'I want a coffee'?");
  assert.equal(asked.do, "wakeTutor");
  if (asked.do !== "wakeTutor") return;
  assert.equal(asked.context.heard, "why not 'I want a coffee'?");
  assert.match(asked.context.setting, /caf/i);
});
