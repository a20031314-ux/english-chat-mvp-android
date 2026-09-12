import assert from "node:assert/strict";
import test from "node:test";
import { SCENARIOS, findScenario, sentencesFor } from "./catalog.ts";
import {
  DIRECTED_TURN_LIMIT,
  FREE_TURN_LIMIT,
  parseDirection,
  questionFor,
  recordedLines,
  scriptSteps,
  tutorMessages,
  tutorSystemPrompt,
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

test("the prompt is the character's own brief, not an observer's", () => {
  const prompt = tutorSystemPrompt({
    scenario: cafe,
    bank,
    recorded: recordedLines(cafe, SCENARIOS, bank),
    request: request(),
  });
  assert.match(prompt, /^You are the barista\./);
  assert.match(prompt, /Everything said on your side of this conversation so far was you/);
  assert.match(prompt, /Never mention a tutor/);
  assert.match(prompt, /Teaching never goes in what you say out loud/);
  assert.match(prompt, /"Are you drinking it here\? Or is it to go\?"/, "its usual lines, as words");
  assert.doesNotMatch(prompt, /cafe\.fix-here/, "no ids to pick from");
  assert.match(prompt, /step:payment/, "every step is somewhere it can go");
  assert.match(prompt, /Right now you are on step:here-answer/);
  assert.match(prompt, /Korean/, "notes are written in the learner's language");
});

test("the fixed part of the brief does not move from turn to turn", () => {
  // So the prompt cache can serve it: only the tail may change.
  const brief = (partial: Partial<DirectorRequest>) =>
    tutorSystemPrompt({
      scenario: cafe,
      bank,
      recorded: recordedLines(cafe, SCENARIOS, bank),
      request: request(partial),
    });
  const a = brief({ level: 2, nodeId: "order" });
  const b = brief({ level: 4, nodeId: "payment", mode: "free", freeTurns: 2 });
  const fixed = a.slice(0, a.indexOf("Level:"));
  assert.ok(fixed.length > 500);
  assert.ok(b.startsWith(fixed));
});

test("the conversation is the tutor's own turns, with the hard one said once at the end", () => {
  const messages = tutorMessages(request());
  assert.deepEqual(messages, [
    { role: "assistant", content: "Got it. For here or to go?" },
    { role: "user", content: "is it cold outside" },
  ]);
  const silent = tutorMessages(request({ heard: "", history: [] }));
  assert.deepEqual(silent, [{ role: "user", content: "(silence — they have not said anything)" }]);
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

test("moving to a step with a line that asks nothing brings its question", () => {
  // Seen in the browser: the scene moved to payment on "that's a small latte to
  // go." and handed the turn over without ever asking card or cash.
  const direction = parse(
    {
      assessment: "off_script",
      say: { text: "No problem! Just to confirm, that's a small latte to go.", translation: "" },
      next: "step:payment",
    },
    { heard: "Just the latte to go" },
  );
  assert.deepEqual(direction?.next, { step: "payment" });
  assert.equal(direction?.follow, "cafe.total");

  // A line that asks something is left to stand on its own.
  const asks = parse({
    say: { text: "Great. Card or cash today?", translation: "" },
    next: "step:payment",
  });
  assert.equal(asks?.follow, undefined);
});

test("staying on a step with a line that asks nothing brings its help, not a second greeting", () => {
  const direction = parse(
    { say: { text: "Take your time.", translation: "" }, next: "step:order" },
    { nodeId: "order" },
  );
  assert.equal(direction?.follow, "cafe.fix-order");
});

test("a scene never goes back to a step that is done", () => {
  // Seen in the browser: a silent turn at payment re-asked "for here or to go?".
  const direction = parse(
    {
      assessment: "stuck",
      say: { text: "Sorry — are you drinking it here? Or is it to go?", translation: "" },
      note: "For here / To go",
      next: "step:here-answer",
    },
    { nodeId: "payment", heard: "" },
  );
  assert.deepEqual(direction?.next, { step: "payment" });
});

test("stuck with no tip gets the step's written help", () => {
  // The help is in character and carries the phrase under it; a bare line
  // from the director, with nothing to learn from, is replaced by it.
  const bare = parse(
    { assessment: "stuck", say: { text: "Hmm?", translation: "" }, note: "", next: "step:payment" },
    { nodeId: "payment", heard: "" },
  );
  assert.deepEqual(bare?.say, { id: "cafe.fix-payment" });
  assert.equal(bare?.follow, undefined, "the help already asks");

  // With a tip of its own, the director's line stands.
  const tipped = parse(
    {
      assessment: "stuck",
      say: { text: "Card, or cash?", translation: "" },
      note: '"Card, please."',
      next: "step:payment",
    },
    { nodeId: "payment", heard: "" },
  );
  assert.deepEqual(tipped?.say, { text: "Card, or cash?", translation: "" });
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
  const prompt = tutorSystemPrompt({
    scenario: open,
    bank,
    recorded: recordedLines(open, SCENARIOS, bank),
    request: request({ scenarioId: open.id, nodeId: "talk" }),
  });
  assert.match(prompt, /There is nothing to get done: this is just a conversation/);
});

test("the tutor's plain line is read, and matched to a recording when it is one", () => {
  const plain = parse({
    say: "Freezing, isn't it? For here or to go?",
    translation: "춥죠? 드시고 가세요, 가져가세요?",
    note: "",
    assessment: "topic_change",
    next: "step:here-answer",
  });
  assert.deepEqual(plain?.say, {
    text: "Freezing, isn't it? For here or to go?",
    translation: "춥죠? 드시고 가세요, 가져가세요?",
  });
  const recorded = parse({ say: "Got it. For here or to go?", translation: "", next: "step:here-answer" });
  assert.deepEqual(recorded?.say, { id: "cafe.here-or-to-go" });
});

test("a line that asks the current question again keeps the scene there, when they were stuck", () => {
  // Seen from every model tried: "yes please, thank you" to "for here or to go?"
  // was met with the question again — and a jump to payment.
  const stuck = parse(
    { say: "Are you drinking it here? Or is it to go?", assessment: "stuck", note: "For here / To go", next: "step:payment" },
    { heard: "yes please, thank you" },
  );
  assert.deepEqual(stuck?.next, { step: "here-answer" });
  assert.deepEqual(stuck?.say, { id: "cafe.fix-here" });

  // Not stuck: the step is right and the line is the one that was wrong.
  const accepted = parse(
    { say: "Got it. For here or to go?", assessment: "on_track", next: "step:payment" },
    { heard: "I'll sit by the window" },
  );
  assert.deepEqual(accepted?.next, { step: "payment" });
  assert.deepEqual(accepted?.say, { id: "cafe.total" });
});

test("a tip that repeats its own field name is read without it", () => {
  const direction = parse({ say: "Card, or cash?", note: 'note: "Card" 또는 "Cash"', next: "step:payment" }, { nodeId: "payment" });
  assert.equal(direction?.note, '"Card" 또는 "Cash"');
});

test("the scene only closes when its last step is done or they are leaving", () => {
  // Seen from the real model: "just the latte to go", said at for-here-or-to-go
  // time, got "have a good one!" and nobody ever paid.
  const early = parse(
    { say: "Perfect. It'll be right up — have a good one!", assessment: "on_track", next: "end" },
    { nodeId: "here-answer" },
  );
  assert.deepEqual(early?.next, { step: "here-answer" });
  const leaving = parse(
    { say: "No problem, see you!", assessment: "closing", next: "end" },
    { nodeId: "here-answer" },
  );
  assert.deepEqual(leaving?.next, { end: true });
  const done = parse(
    { say: "Perfect. It'll be right up — have a good one!", assessment: "on_track", next: "end" },
    { nodeId: "payment", heard: "card" },
  );
  assert.deepEqual(done?.next, { end: true });
});

test("a recorded line for another step is not used to help this one", () => {
  // Seen from the real model: stuck at for-here-or-to-go, helped with the size
  // step's "small, or large?".
  const direction = parse(
    { say: "Sorry — small, or large?", assessment: "stuck", note: "for here / to go", next: "step:here-answer" },
    { heard: "yes please, thank you" },
  );
  assert.deepEqual(direction?.say, { id: "cafe.fix-here" });
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
