import assert from "node:assert/strict";
import test from "node:test";
import { SCENARIOS, findScenario, sentencesFor } from "./catalog.ts";
import {
  DIRECTED_TURN_LIMIT,
  FREE_TURN_LIMIT,
  directorSystemPrompt,
  directorUserMessage,
  parseDirection,
  questionFor,
  recordedLines,
  scriptSteps,
  type DirectorRequest,
} from "./director.ts";

const cafe = findScenario("cafe-order")!;
const open = findScenario("open-talk")!;
const bank = sentencesFor("en");

function request(partial: Partial<DirectorRequest> = {}): DirectorRequest {
  return {
    scenarioId: cafe.id,
    nodeId: "here-answer",
    mode: "script",
    heard: "is it cold outside",
    history: [
      { who: "tutor", text: "Got it. For here or to go?" },
      { who: "learner", text: "is it cold outside" },
    ],
    freeTurns: 0,
    directedTurns: 0,
    level: 3,
    targetLanguage: "en",
    nativeLanguage: "ko",
    ...partial,
  };
}

function parse(raw: object, partial: Partial<DirectorRequest> = {}, scenario = cafe) {
  const recorded = recordedLines(scenario, SCENARIOS, bank);
  return parseDirection(JSON.stringify(raw), {
    scenario,
    bank,
    recordedIds: new Set(recorded.map((line) => line.id)),
    request: request({ scenarioId: scenario.id, ...partial }),
  });
}

test("a step's question is its asking line, not its 'sorry?'", () => {
  assert.equal(questionFor(cafe, "order"), "cafe.greet");
  assert.equal(questionFor(cafe, "size-answer"), "cafe.size");
  assert.equal(questionFor(cafe, "here-answer"), "cafe.here-or-to-go");
  const steps = scriptSteps(cafe);
  assert.deepEqual(
    steps.map((step) => step.id),
    ["order", "size-answer", "here-answer", "payment"],
  );
  assert.equal(steps.find((step) => step.id === "here-answer")?.helpId, "cafe.fix-here");
});

test("only lines recorded in this scene's voice are offered as free", () => {
  // A recording is a text in one voice; the barista's lines do not exist in
  // the taxi driver's mouth.
  const ids = recordedLines(cafe, SCENARIOS, bank).map((line) => line.id);
  assert.ok(ids.includes("cafe.greet"));
  assert.ok(ids.includes("cafe.fix-here"), "written help is a recording too");
  assert.ok(!ids.includes("taxi.greet"));
});

test("the prompt keeps the character in the scene and the teaching out of its mouth", () => {
  const prompt = directorSystemPrompt({
    scenario: cafe,
    bank,
    recorded: recordedLines(cafe, SCENARIOS, bank),
    request: request(),
  });
  assert.match(prompt, /barista/);
  assert.match(prompt, /Never step out of the scene/);
  assert.match(prompt, /never put teaching in the spoken line/);
  assert.match(prompt, /cafe\.fix-here/, "the recorded lines are offered by id");
  assert.match(prompt, /step:payment/, "every step is somewhere it can go");
  assert.match(prompt, /Korean/, "notes are written in the learner's language");
});

test("the turn in question is said once, at the end", () => {
  const message = directorUserMessage(request());
  assert.equal(message.split("is it cold outside").length - 1, 1);
  assert.match(message, /The learner just said: "is it cold outside"$/);
  const silent = directorUserMessage(request({ heard: "", history: [] }));
  assert.match(silent, /said nothing usable/);
});

test("a recorded line is kept by id, and a line with no recording is spoken as text", () => {
  const recordedPick = parse({ assessment: "stuck", say: { id: "cafe.fix-here" }, next: "step:here-answer" });
  assert.deepEqual(recordedPick?.say, { id: "cafe.fix-here" });

  // Real words, wrong voice: spoken rather than thrown away.
  const elsewhere = parse({ say: { id: "taxi.greet" }, next: "free" });
  assert.ok(elsewhere && "text" in elsewhere.say);

  // Seen from the real model: the recorded help written out instead of named.
  const writtenOut = parse({
    assessment: "stuck",
    say: { text: "Are you drinking it here? Or is it to go?", translation: "..." },
    next: "step:here-answer",
  });
  assert.deepEqual(writtenOut?.say, { id: "cafe.fix-here" });

  const invented = parse({ say: { id: "cafe.nope" }, next: "free" });
  assert.equal(invented, null, "an id that is nothing cannot be played");
});

test("a step is only walked into with its own question", () => {
  // Seen from the real model: "I'll sit by the window" accepted, the scene moved
  // on to payment, and the line picked was "for here or to go?" all over again.
  const direction = parse(
    { assessment: "on_track", say: { id: "cafe.here-or-to-go" }, next: "step:payment" },
    { heard: "I'll sit by the window" },
  );
  assert.deepEqual(direction?.next, { step: "payment" });
  assert.deepEqual(direction?.say, { id: "cafe.total" });

  // Its own step's question, or a line that is nobody's question, is left alone.
  const same = parse({ say: { id: "cafe.here-or-to-go" }, next: "step:here-answer" });
  assert.deepEqual(same?.say, { id: "cafe.here-or-to-go" });
  const help = parse({ say: { id: "cafe.fix-here" }, next: "step:here-answer" });
  assert.deepEqual(help?.say, { id: "cafe.fix-here" });
});

test("a step that does not exist leaves the scene where it was", () => {
  const direction = parse({ say: { text: "Hm?", translation: "" }, next: "step:dessert" });
  assert.deepEqual(direction?.next, { step: "here-answer" });
  const tutorNode = parse({ say: { text: "Hm?", translation: "" }, next: "step:total" });
  assert.deepEqual(tutorNode?.next, { step: "here-answer" }, "only learner steps can be returned to");
});

test("the leash: past the free-turn cap the conversation is brought home", () => {
  const direction = parse(
    { assessment: "topic_change", say: { text: "Oh, I love that film!", translation: "" }, next: "free" },
    { mode: "free", freeTurns: FREE_TURN_LIMIT - 1 },
  );
  assert.deepEqual(direction?.next, { step: "here-answer" });
  // Its own line did not ask the question, so the recording does.
  assert.equal(direction?.follow, "cafe.here-or-to-go");
});

test("under the cap, a free turn stays free", () => {
  const direction = parse(
    { say: { text: "Oh, nice!", translation: "" }, next: "free" },
    { mode: "free", freeTurns: 1 },
  );
  assert.deepEqual(direction?.next, { free: true });
  assert.equal(direction?.follow, undefined);
});

test("the session ceiling closes the conversation", () => {
  const direction = parse(
    { say: { text: "Oh, nice!", translation: "" }, next: "free" },
    { directedTurns: DIRECTED_TURN_LIMIT - 1 },
  );
  assert.deepEqual(direction?.next, { end: true });
});

test("an open conversation has nowhere to be sent home to", () => {
  const direction = parse(
    { say: { text: "Oh, nice!", translation: "" }, next: "free" },
    { nodeId: "talk", mode: "free", freeTurns: 20 },
    open,
  );
  assert.deepEqual(direction?.next, { step: "talk" });
  assert.equal(direction?.follow, undefined, "the opening line is not asked again");
  const prompt = directorSystemPrompt({
    scenario: open,
    bank,
    recorded: recordedLines(open, SCENARIOS, bank),
    request: request({ scenarioId: open.id, nodeId: "talk" }),
  });
  assert.match(prompt, /open conversation with no script/);
});

test("malformed answers are refused rather than half-read", () => {
  const recorded = recordedLines(cafe, SCENARIOS, bank);
  const context = {
    scenario: cafe,
    bank,
    recordedIds: new Set(recorded.map((line) => line.id)),
    request: request(),
  };
  assert.equal(parseDirection("not json", context), null);
  assert.equal(parseDirection(JSON.stringify({ next: "free" }), context), null);
  const unknownAssessment = parseDirection(
    JSON.stringify({ assessment: "bored", say: { text: "Right.", translation: "" }, next: "free" }),
    context,
  );
  assert.equal(unknownAssessment?.assessment, "off_script");
});
