import assert from "node:assert/strict";
import test from "node:test";
import { SCENARIOS, findScenario, sentencesFor } from "./catalog.ts";
import { REPERTOIRE_SINCE } from "./justTalk.ts";
import {
  DIRECTED_TURN_LIMIT,
  FREE_TURN_LIMIT,
  flattenForOldClients,
  leadFromPartial,
  playableBy,
  parseDirection,
  questionFor,
  recordedLines,
  REPERTOIRE_COOLDOWN_LINES,
  scriptSteps,
  tutorMessages,
  tutorSystemPrompt,
  type DirectorRequest,
} from "./director.ts";

const cafe = findScenario("cafe-order")!;
const open = findScenario("open-talk-en")!;
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

test("every line this voice has ever said is offered, whatever scene wrote it", () => {
  // This used to be the opposite test: a recording was a text in one voice, and
  // the barista's lines did not exist in the taxi driver's mouth. The English
  // scenes are one person now, so the pool is that person's whole repertoire —
  // which is the point of giving them one voice, and what lets a line written
  // for one situation be said in another without synthesising it again.
  const ids = recordedLines(cafe, SCENARIOS, bank).map((line) => line.id);
  assert.ok(ids.includes("cafe.greet"));
  assert.ok(ids.includes("cafe.fix-here"), "written help is a recording too");
  assert.ok(ids.includes("taxi.greet"), "another scene's line, in the same voice");
});

test("a voice does not borrow from a language it does not speak", () => {
  // The other filter, and the one that still has to hold: every language has
  // its own recordings, and a Korean line has no English audio to play.
  const ids = recordedLines(cafe, SCENARIOS, bank).map((line) => line.id);
  const korean = recordedLines(
    findScenario("open-talk-ko")!,
    SCENARIOS,
    sentencesFor("ko"),
  ).map((line) => line.id);
  assert.ok(korean.length > 0);
  assert.ok(
    korean.every((id) => !ids.includes(id) || bank[id]),
    "a line offered in English must exist in the English bank",
  );
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

  // Another scene's line, in the same voice: played, not spoken, because the
  // recording exists and is the same person.
  const elsewhere = parse({ say: { id: "taxi.greet" }, next: "free" });
  assert.deepEqual(elsewhere?.say, { id: "taxi.greet" });

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
  // Said rather than asked, so the step is the only thing under test here: a
  // line that asks about something else has a rule of its own, further down.
  const direction = parse({ say: { text: "Right.", translation: "" }, next: "step:dessert" });
  assert.deepEqual(direction?.next, { step: "here-answer" });
  const tutorNode = parse({ say: { text: "Right.", translation: "" }, next: "step:total" });
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

test("a question about something else leaves the scene off its list, not waiting", () => {
  // Seen from the real model: asked about oat milk with the scene on the size
  // step, it said "Yes, we have oat milk. Would you like it in your latte?" and
  // called the scene still on size — so "yes please" was matched against
  // "small" and "large", and missed. The character asked something; the answer
  // belongs to the character until the size is asked again.
  const elsewhere = parse(
    {
      assessment: "on_track",
      say: { text: "Yes, we have oat milk. Would you like it in your latte?", translation: "" },
      next: "step:size-answer",
    },
    { nodeId: "size-answer", heard: "Do you have oat milk here" },
  );
  assert.deepEqual(elsewhere?.next, { free: true });
  assert.equal(elsewhere?.follow, undefined, "no second question stacked on the first");

  // The same turn asked properly: the scene's own question in the model's
  // words, which is the point of letting it speak at all.
  const asked = parse(
    {
      assessment: "on_track",
      say: {
        text: "Yes, we have oat milk for your latte. What size would you like, small or large?",
        translation: "",
      },
      next: "step:size-answer",
    },
    { nodeId: "size-answer", heard: "Do you have oat milk here" },
  );
  assert.deepEqual(asked?.next, { step: "size-answer" });
  assert.equal(asked?.follow, undefined);

  // Moving on is the same rule: a question about something else does not walk
  // the scene into a step.
  const moving = parse(
    {
      assessment: "on_track",
      say: { text: "Would you like your latte with oat milk?", translation: "" },
      next: "step:size-answer",
    },
    { nodeId: "order", heard: "Do you have oat milk here" },
  );
  assert.deepEqual(moving?.next, { free: true });
});

test("a line that asks nothing still brings the step's question", () => {
  // The other half of the rule, kept beside it: silence on the scene's own
  // question is filled by the recording, not by drifting off the list.
  const quiet = parse(
    {
      assessment: "off_script",
      say: { text: "No problem! Just to confirm, that's a small latte to go.", translation: "" },
      next: "step:payment",
    },
    { heard: "Just the latte to go" },
  );
  assert.deepEqual(quiet?.next, { step: "payment" });
  assert.equal(quiet?.follow, "cafe.total");
});

test("asking again in its own words is not asked twice", () => {
  // Staying put and asking this step's question, however worded, stands alone:
  // the recording underneath would ask the same thing a second time.
  const again = parse(
    {
      assessment: "stuck",
      say: { text: "Sorry - did you want that small, or large?", translation: "" },
      note: "스몰 또는 라지라고 답하면 돼요.",
      next: "step:size-answer",
    },
    { nodeId: "size-answer", heard: "um" },
  );
  assert.deepEqual(again?.next, { step: "size-answer" });
  assert.equal(again?.follow, undefined);
});

test("a struggling learner is not led off the list", () => {
  // Stuck, the question worth asking is this step's own — so even a line that
  // asks something else keeps the scene where it is, with the written help.
  const stuck = parse(
    {
      assessment: "stuck",
      say: { text: "Are you alright there?", translation: "" },
      next: "step:size-answer",
    },
    { nodeId: "size-answer", heard: "" },
  );
  assert.deepEqual(stuck?.next, { step: "size-answer" });
});

test("their own sentence, said better, rides under their own line", () => {
  const direction = parse(
    {
      assessment: "on_track",
      say: { text: "Nice! Was it busy?", translation: "" },
      better: "I went to the gym yesterday.",
      next: "step:here-answer",
    },
    { heard: "I go to gym yesterday" },
  );
  assert.equal(direction?.better, "I went to the gym yesterday.");
});

test("a word about their sentence does not also ride with the answer", () => {
  // Both fields are read and both are shown under the words they are about, so
  // a note that went with the character's line as well would say it twice —
  // once where they are looking and once where they are not.
  const direction = parse(
    {
      assessment: "on_track",
      say: { text: "Nice one.", translation: "좋네요." },
      note: "과거에는 went를 써요.",
      next: "free",
    },
    { heard: "I go to the gym yesterday" },
  );
  assert.equal(direction?.note, "과거에는 went를 써요.");

  const stuck = parse(
    {
      assessment: "stuck",
      say: { id: "cafe.fix-here" },
      note: "여기서 드시면 for here라고 해요.",
      next: "step:here-answer",
    },
    { heard: "" },
  );
  assert.equal(stuck?.note, "여기서 드시면 for here라고 해요.", "help to get through still comes back");
});

test("a rewrite that rewrote nothing is not shown", () => {
  // Word for word what they said is not a correction; under their line it is
  // just noise, and noise there teaches them to stop looking.
  const same = parse(
    {
      say: { text: "Right.", translation: "" },
      better: "  I went to the gym yesterday!  ",
      next: "free",
    },
    { heard: "I went to the gym yesterday" },
  );
  assert.equal(same?.better, undefined);
});

test("nothing said is nothing to rewrite", () => {
  const silent = parse(
    {
      assessment: "stuck",
      say: { text: "Take your time.", translation: "" },
      better: "I would like a latte, please.",
      next: "step:here-answer",
    },
    { heard: "" },
  );
  assert.equal(silent?.better, undefined);
});

test("the brief says when to leave the rewrite alone", () => {
  // The failure to guard against is confident correction of something they got
  // right — a fragment, an informal turn, or an ending the recogniser invented.
  const prompt = tutorSystemPrompt({
    scenario: cafe,
    bank,
    recorded: recordedLines(cafe, SCENARIOS, bank),
    request: request(),
  });
  assert.match(prompt, /as likely to be the speech recogniser's doing as theirs/);
  assert.match(prompt, /Correcting something they said correctly costs more than saying nothing/);
  assert.match(prompt, /never said aloud/);
});

test("a written line is not made to carry a translation", () => {
  // Half of what this answer used to contain was never spoken, and output
  // arrives a character at a time — so the learner waited in silence for words
  // that only ever appear on screen. The gloss is fetched when asked for.
  const prompt = tutorSystemPrompt({
    scenario: cafe,
    bank,
    recorded: recordedLines(cafe, SCENARIOS, bank),
    request: request(),
  });
  assert.doesNotMatch(prompt, /"translation" is always required/);
  assert.doesNotMatch(prompt, /"translation":/, "not asked for in the shape either");

  const written = parse(
    { say: { text: "Oh, nice — how long were you there?" }, next: "free" },
    { heard: "I went to the gym" },
  );
  assert.deepEqual(written?.say, {
    text: "Oh, nice — how long were you there?",
    translation: "",
  });
});

test("a recorded line keeps the gloss that was written with it", () => {
  // That one cost nothing: it was written once, by hand, and ships in the bank.
  const recorded = parse(
    { assessment: "stuck", say: { id: "cafe.fix-here" }, next: "step:here-answer" },
    { heard: "" },
  );
  assert.deepEqual(recorded?.say, { id: "cafe.fix-here" });
  assert.ok(bank["cafe.fix-here"]?.translation, "and the bank still has it");
});

test("no scene is handed a list of lines to choose from", () => {
  // Measured: shown twenty ready-made lines, the character used the bank nought
  // times in twenty-three turns — it used one and then added a question to it,
  // every time, because that is what a turn is for this model. The lines stay
  // in the bank; sending them cost two hundred tokens a turn and bought
  // nothing, on the one path where the wait is what is being fought.
  const brief = (id: string, nodeId: string) => {
    const scenario = findScenario(id)!;
    const theirBank = sentencesFor(scenario.language);
    return tutorSystemPrompt({
      scenario,
      bank: theirBank,
      recorded: recordedLines(scenario, SCENARIOS, theirBank),
      request: request({ scenarioId: id, nodeId }),
    });
  };
  assert.doesNotMatch(brief("open-talk-en", "talk"), /Things you say often/);
  assert.doesNotMatch(brief("open-talk-en", "talk"), /Lines you have ready/);
  // A step still gets the line for where it is, which is a different thing: one
  // line for one moment, not a list to pick from.
  assert.match(brief("cafe-order", "order"), /What you usually say around here/);
});

test("a build released before a language's lines is offered none of them", () => {
  // The failure this exists for, and it was real: 2.53 went to production, the
  // Japanese lines were written after it was cut, and 2.53 says yes to the bank
  // header. Simulated against the bank 2.53 actually ships, a turn answered by
  // id queued nothing at all and opened the microphone on a character that had
  // said nothing.
  const japanese = (version: string) =>
    playableBy(SCENARIOS, version).find((one) => one.id === "open-talk-ja")!;
  assert.deepEqual(japanese("2.53").repertoire, [], "the build in production today");
  assert.equal(japanese("2.54").repertoire?.length, 53, "the build that will carry them");
});

test("a build that has a language's lines keeps them", () => {
  const english = (version: string) =>
    playableBy(SCENARIOS, version).find((one) => one.id === "open-talk-en")!;
  assert.equal(english("2.52").repertoire?.length, 53, "the release that shipped them");
  assert.equal(english("2.53").repertoire?.length, 53, "and everything after it");
  assert.deepEqual(english("2.51").repertoire, [], "but not the one before");
});

test("a build that will not say which one it is gets nothing", () => {
  // "unknown" is every install older than the header that reports a version,
  // and those are the oldest builds there are. Guessing generously about them
  // is guessing about the ones least able to cope.
  const open = playableBy(SCENARIOS, "unknown").find((one) => one.id === "open-talk-en")!;
  assert.deepEqual(open.repertoire, []);
});

test("a language nobody has written a release down for is treated as unshipped", () => {
  // Adding a bank and forgetting the row is the likely mistake, and it has to
  // fail towards silence-free rather than towards silence.
  const invented = {
    ...findScenario("open-talk-en")!,
    id: "open-talk-xx",
    language: "ru" as const,
    repertoire: ["talk.nice"],
  };
  const [only] = playableBy([invented], "9.99");
  assert.deepEqual(only!.repertoire, [], "no row in REPERTOIRE_SINCE");
});

test("stripping the repertoire leaves the scene otherwise untouched", () => {
  // It is the saving that is withheld, never the conversation: the scene still
  // has its nodes, its voice and its way out, and the character writes its own
  // lines exactly as it does in the twelve languages with no bank at all.
  const before = findScenario("open-talk-ja")!;
  const after = playableBy(SCENARIOS, "2.53").find((one) => one.id === "open-talk-ja")!;
  assert.deepEqual(after.nodes, before.nodes);
  assert.equal(after.voice, before.voice);
  assert.equal(after.start, before.start);
  assert.equal(after.openEnded, before.openEnded);
});

test("the pool a scene draws from is filtered too, not only the scene", () => {
  // recordedLines gathers every scene sharing a voice, so a scene filtered on
  // its own would have its own ids handed back to it by its neighbour — and an
  // id that reaches recordedIds is an id parseDirection will accept.
  const scenarios = playableBy(SCENARIOS, "2.53");
  const japanese = scenarios.find((one) => one.id === "open-talk-ja")!;
  const pool = recordedLines(japanese, scenarios, sentencesFor("ja")).map((line) => line.id);
  assert.ok(!pool.some((id) => id.startsWith("talk.")), `leaked: ${pool.filter((id) => id.startsWith("talk."))}`);
  assert.ok(pool.includes("open.hi"), "the two recorded lines are still there");
});

test("every language with a bank has written down the release that carries it", () => {
  // The one mistake playableBy cannot catch is a row naming a release that has
  // already shipped without the lines. This catches the other one: a bank with
  // no row at all, which would quietly never be offered to anybody.
  for (const scenario of SCENARIOS) {
    if (!scenario.repertoire || scenario.repertoire.length === 0) continue;
    assert.ok(
      REPERTOIRE_SINCE[scenario.language],
      `${scenario.language} has a bank and no release named for it`,
    );
  }
});

test("a repertoire line is playable, not just writable", () => {
  // Offering the character a line it cannot actually play would have it say
  // the words while the recording sits unused — the pool and the offer have to
  // come from the same place.
  const open = findScenario("open-talk-en")!;
  const playable = new Set(
    recordedLines(open, SCENARIOS, sentencesFor("en")).map((line) => line.id),
  );
  for (const id of open.repertoire ?? []) {
    assert.ok(playable.has(id), `${id} is offered but not in the pool`);
  }
});

function openBrief(history: DirectorRequest["history"]): string {
  return tutorSystemPrompt({
    scenario: open,
    bank,
    recorded: recordedLines(open, SCENARIOS, bank),
    request: request({ scenarioId: open.id, nodeId: "talk", history }),
  });
}

test("a line it just said is not offered again", () => {
  // Measured over a hundred and twenty-seven plays: "That sounds great." was
  // 39% of them and the top five were 64%, out of fifty-three lines. What a
  // learner notices there is not a small bank, it is the same sentence twice.
  const fresh = openBrief([{ who: "learner", text: "i went to busan last weekend" }]);
  assert.match(fresh, /talk\.nice: "That sounds great\."/);

  const again = openBrief([
    { who: "tutor", text: "That sounds great." },
    { who: "learner", text: "yeah it was really fun" },
  ]);
  assert.doesNotMatch(again, /talk\.nice/);
  assert.match(again, /talk\.there-what/, "the rest of the bank is untouched");
});

test("both halves of a turn an old build joined into one line count as said", () => {
  // A build that cannot play a turn in two pieces is sent them joined
  // (flattenForOldClients), so the line comes back inside a longer one — and a
  // match on the whole line would miss it and offer both halves straight back.
  const joined = openBrief([
    { who: "tutor", text: "That sounds great. What did you do there?" },
    { who: "learner", text: "we went to the beach" },
  ]);
  assert.doesNotMatch(joined, /talk\.nice/);
  assert.doesNotMatch(joined, /talk\.there-what/);
});

test("a line comes back once the conversation has moved past it", () => {
  // Suppressed for good, the bank would drain over a long conversation and end
  // it writing every line itself, which is the cost this was avoiding.
  const since: DirectorRequest["history"] = Array.from(
    { length: REPERTOIRE_COOLDOWN_LINES },
    (_, turn) => ({ who: "tutor" as const, text: `Mm, I see, number ${turn}.` }),
  );
  const later = openBrief([{ who: "tutor", text: "That sounds great." }, ...since]);
  assert.match(later, /talk\.nice: "That sounds great\."/);
});

test("the opening line is read out of an answer still being written", () => {
  // "open" is the first key and the note and the rewrite are the last, so the
  // id is in hand about a third of a second before the object closes —
  // measured against the real model, eight runs a side: 692ms against 1020ms.
  const head = '{"open": "talk.nice", "follow": "talk.there-what", "say": ""';
  assert.equal(leadFromPartial(head), "talk.nice");
  assert.equal(
    leadFromPartial('{"say": "", "open": "talk.nice"'),
    "talk.nice",
    "whatever order the keys come in",
  );
});

test("nothing is claimed while the answer could still say otherwise", () => {
  // A value with no closing quote yet is not an empty one, and an answer that
  // writes its own line does not open with a named one — parseDirection puts
  // the written line first, so promising the id here would promise a line the
  // finished answer never plays.
  assert.equal(leadFromPartial('{"open": "talk.nice", "follow": "talk'), null);
  assert.equal(leadFromPartial('{"open": "talk.nice", "say": "Oh, nice!"'), null);
  assert.equal(leadFromPartial('{"open": "", "say": ""'), null);
  assert.equal(leadFromPartial('{"open": "talk.nice", "say": "He said \\"hi\\""'), null);
});

test("a lead that was claimed is the line that gets played", () => {
  // The whole design rests on this: the app is told to fetch a line before the
  // answer exists, so the finished answer has to open with it. Nothing in an
  // open conversation can outrank a named reaction once "say" is empty —
  // there is no step whose question could replace it.
  const raw = {
    open: "talk.nice",
    follow: "talk.there-what",
    say: "",
    assessment: "on_track",
    next: "free",
  };
  const lead = leadFromPartial(JSON.stringify(raw));
  assert.equal(lead, "talk.nice");
  const direction = parse(raw, { nodeId: "talk" }, open);
  assert.deepEqual(direction?.say, { id: lead });
});

test("a turn can be two ready lines: a reaction, then a question", () => {
  // What the bank is for in an open conversation. Neither half is the whole
  // turn on its own, and together they cost no synthesis at all.
  const both = parse(
    { open: "talk.nice", follow: "talk.there-what", say: "", assessment: "on_track", next: "free" },
    { nodeId: "talk" },
    open,
  );
  assert.deepEqual(both?.say, { id: "talk.nice" });
  assert.equal(both?.follow, "talk.there-what");
});

test("a ready question with no reaction in front of it is still a turn", () => {
  // It would otherwise be thrown away for having nothing to lead with, and a
  // turn that is only a question is an ordinary thing to say.
  const alone = parse(
    { open: "", follow: "talk.there-what", say: "", assessment: "on_track", next: "free" },
    { nodeId: "talk" },
    open,
  );
  assert.deepEqual(alone?.say, { id: "talk.there-what" });
  assert.equal(alone?.follow, undefined);
});

test("a turn never says the same thing twice", () => {
  // All three seen from the real model. Naming one line for both halves plays
  // "What did you do there? What did you do there?"; writing a line out and
  // then naming it is the same repeat in a shape the id check cannot see.
  const twice = parse(
    {
      open: "talk.there-what",
      follow: "talk.there-what",
      say: "",
      assessment: "on_track",
      next: "free",
    },
    { nodeId: "talk" },
    open,
  );
  assert.deepEqual(twice?.say, { id: "talk.there-what" });
  assert.equal(twice?.follow, undefined);

  const written = parse(
    {
      open: "",
      follow: "talk.know-feeling",
      say: "Yeah, I know that feeling. It must be hard to find the time.",
      assessment: "on_track",
      next: "free",
    },
    { nodeId: "talk" },
    open,
  );
  assert.equal(written?.follow, undefined);

  const asked = parse(
    {
      open: "",
      follow: "talk.pardon",
      say: "Sorry, can you say that again?",
      assessment: "on_track",
      next: "free",
    },
    { nodeId: "talk" },
    open,
  );
  assert.equal(asked?.follow, undefined);
});

test("a build that cannot play the bank is told the whole turn in words", () => {
  // Every build on a phone today was released before these lines existed, and
  // would look up an id it does not have, queue nothing, and open the
  // microphone on a character that said nothing. Written out, the same turn is
  // one line, which every build has always been able to say.
  const both = flattenForOldClients(
    {
      assessment: "on_track",
      say: { id: "talk.nice" },
      follow: "talk.there-what",
      note: "",
      next: { step: "talk" },
    },
    bank,
  );
  assert.deepEqual(both.say, {
    text: "That sounds great. What did you do there?",
    translation: "좋네요. 거기서 뭐 했어요?",
  });
  assert.equal(both.follow, undefined);

  // What the director wrote itself was always sayable; only the follow moves.
  const written = flattenForOldClients(
    {
      assessment: "on_track",
      say: { text: "That sounds lovely." },
      follow: "talk.there-what",
      note: "",
      next: { step: "talk" },
    },
    bank,
  );
  assert.deepEqual(written.say, {
    text: "That sounds lovely. What did you do there?",
    translation: "거기서 뭐 했어요?",
  });

  // And the rest of the decision is carried through untouched.
  assert.equal(written.assessment, "on_track");
  assert.deepEqual(written.next, { step: "talk" });
});

test("an id nothing can resolve is left alone rather than blanked", () => {
  // Writing out a line the bank does not hold would replace the turn with an
  // empty string, which is the silence this exists to prevent.
  const unknown = flattenForOldClients(
    {
      assessment: "on_track",
      say: { id: "talk.does-not-exist" },
      note: "",
      next: { step: "talk" },
    },
    bank,
  );
  assert.deepEqual(unknown.say, { id: "talk.does-not-exist" });
});

test("the character corrects against what this language in particular gets wrong", () => {
  // The call tab was correcting against nothing while the chat tab corrected
  // against a hand-written row per language — the same learner held to two
  // standards depending which tab they were in. "better" is written on every
  // turn, so this is the correction a learner actually gets most of.
  const japanese = tutorSystemPrompt({
    scenario: open,
    bank,
    recorded: recordedLines(open, SCENARIOS, bank),
    request: request({ targetLanguage: "ja" }),
  });
  assert.match(japanese, /What goes wrong in Japanese in particular/);
  assert.match(japanese, /polite vs plain/);
  assert.match(japanese, /は\/が\/を/, "in its own terms, not English labels");
});

test("English is given no row, because there is none and it needs none", () => {
  // The list of failures was drawn up from English. A generic paragraph would
  // be a rule applied to every turn that can never be satisfied.
  const english = tutorSystemPrompt({
    scenario: open,
    bank,
    recorded: recordedLines(open, SCENARIOS, bank),
    request: request({ targetLanguage: "en" }),
  });
  assert.doesNotMatch(english, /What goes wrong in/);
  assert.doesNotMatch(english, /Focus on real morphosyntax/, "not the fallback either");
});

test("the row sits in the half of the brief that does not move", () => {
  // The brief is built fixed-part-first so the prompt cache can serve the start
  // of it. A language's row is the same on every turn of a conversation, so it
  // belongs before "Level:" — putting it after would cost a cache miss a turn
  // for the whole of a language's use.
  const brief = (partial: Partial<DirectorRequest>) =>
    tutorSystemPrompt({
      scenario: open,
      bank,
      recorded: recordedLines(open, SCENARIOS, bank),
      request: request({ targetLanguage: "ja", ...partial }),
    });
  const a = brief({ level: 2 });
  const b = brief({ level: 4, freeTurns: 3 });
  const fixed = a.slice(0, a.indexOf("Level:"));
  assert.match(fixed, /What goes wrong in Japanese in particular/);
  assert.ok(b.startsWith(fixed), "and the fixed half really is the same");
});

test("a question is not a reaction, whatever the model calls it", () => {
  // "open" is what the character says back and "follow" is the question after
  // it. Seen on a phone: "what did you do today?" answered with "What did you
  // do there?" — a question that points back at nothing, standing where an
  // answer belonged. Asked for in the brief first, and the wording measurably
  // made it worse, so it is a rule here instead.
  const wrongWayRound = parse(
    { open: "talk.there-what", follow: "talk.what-next", say: "", assessment: "on_track", next: "free" },
    { nodeId: "talk" },
    open,
  );
  assert.deepEqual(wrongWayRound?.say, { id: "talk.what-next" }, "the follow leads instead");
  assert.equal(wrongWayRound?.follow, undefined, "and nothing is said twice");
});

test("a reaction that merely contains a question mark is still a reaction", () => {
  // The test is what it ends with. "Oh really? Tell me more." reads as somebody
  // reacting; a rule about containing a question mark would have thrown away
  // the most-used line in the bank.
  const kept = parse(
    { open: "talk.go-on", follow: "talk.there-what", say: "", assessment: "on_track", next: "free" },
    { nodeId: "talk" },
    open,
  );
  assert.deepEqual(kept?.say, { id: "talk.go-on" });
  assert.equal(kept?.follow, "talk.there-what");
});

test("a question that points back is not asked when they asked one", () => {
  // Reported from a phone: "i'm good, how about you?" answered with "Same
  // here, actually." and then "What are they like?" — a "they" with nothing
  // behind it. The reaction was right; only the follow was wrong, so only the
  // follow goes. Their question is also still unanswered, which is its own
  // reason not to put another one on top of it.
  const asked = parse(
    { open: "talk.same", follow: "talk.what-like", say: "", assessment: "on_track", next: "free" },
    { nodeId: "talk", heard: "i'm good, how about you?" },
    open,
  );
  assert.deepEqual(asked?.say, { id: "talk.same" }, "the character still answers");
  assert.equal(asked?.follow, undefined);

  const told = parse(
    { open: "talk.same", follow: "talk.what-like", say: "", assessment: "on_track", next: "free" },
    { nodeId: "talk", heard: "i love baseball and soccer." },
    open,
  );
  assert.equal(told?.follow, "talk.what-like", "something to point at, so it points");
});

test("a reaction is not the question half of a turn", () => {
  // Reported from a phone: the character asked "what do you study in English?"
  // and then, before anything had been answered, added "Oh really? Tell me
  // more." Two sentences in a row with nothing between them. The brief asks
  // for the follow to move the conversation on; this is the rule for it.
  const asked = parse(
    {
      say: "Good! What do you study in English?",
      follow: "talk.go-on",
      assessment: "on_track",
      next: "free",
    },
    { nodeId: "talk", heard: "i study english" },
    open,
  );
  assert.deepEqual(asked?.say, { text: "Good! What do you study in English?", translation: "" });
  assert.equal(asked?.follow, undefined, "nothing rides behind a question");
});

test("the two halves of a turn each hold their own kind of line", () => {
  // The bank divides cleanly — thirty-five lines end by asking, eighteen do
  // not — and the slots divide the same way. This is the shape that is meant
  // to survive both rules.
  const proper = parse(
    { open: "talk.nice", follow: "talk.there-what", say: "", assessment: "on_track", next: "free" },
    { nodeId: "talk", heard: "i went to busan" },
    open,
  );
  assert.deepEqual(proper?.say, { id: "talk.nice" });
  assert.equal(proper?.follow, "talk.there-what");
});

test("a question mark is not always a question mark", () => {
  // The rule that sorts the two halves reads the end of a line, and reading
  // only the ASCII "?" sorted all thirty-five Japanese questions as reactions
  // — which refuses every follow, and would have killed the two-line turn in
  // Japanese on the day it shipped, without a word anywhere.
  const marks = ["?", "？", "؟"];
  for (const language of ["en", "ja"]) {
    const scenario = findScenario(`open-talk-${language}`)!;
    const theirBank = sentencesFor(language);
    const questions = (scenario.repertoire ?? []).filter((id) =>
      marks.some((mark) => theirBank[id]!.text.trim().endsWith(mark)),
    );
    assert.equal(questions.length, 35, `${language} does not split into the two halves`);
  }
  // And the split is what the rules act on, so a Japanese follow survives.
  const twoPart = parse(
    { open: "talk.same", follow: "talk.there-what", say: "", assessment: "on_track", next: "free" },
    { scenarioId: "open-talk-ja", nodeId: "talk", heard: "先週釜山に行ったよ", targetLanguage: "ja" },
    findScenario("open-talk-ja")!,
  );
  assert.equal(twoPart?.follow, "talk.there-what");
});
