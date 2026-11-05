import assert from "node:assert/strict";
import test from "node:test";
import { SCENARIOS, findScenario, sentencesFor } from "./catalog.ts";
import { recordedLines, tutorSystemPrompt, type SpokenLine } from "./director.ts";
import {
  EMPTY_MEMORY,
  FOLD_AT,
  MAX_RAW_LINES,
  RAW_LINES,
  contextPrompt,
  foldDue,
  parseContext,
  parseMemory,
  rawLines,
  type ConversationMemory,
} from "./memory.ts";

function conversation(length: number): SpokenLine[] {
  return Array.from({ length }, (_, i) => ({
    who: i % 2 === 0 ? ("tutor" as const) : ("learner" as const),
    text: `line ${i}`,
  }));
}

test("nothing is folded before the thirtieth unfolded line", () => {
  assert.equal(foldDue(conversation(FOLD_AT - 1), EMPTY_MEMORY), null);
  const due = foldDue(conversation(FOLD_AT), EMPTY_MEMORY);
  assert.ok(due);
  assert.equal(due.upTo, FOLD_AT - RAW_LINES);
  assert.equal(due.lines.length, FOLD_AT - RAW_LINES);
  assert.equal(due.lines[0]?.text, "line 0");
});

test("every line is always either read verbatim or in the notes", () => {
  // The whole point of letting the raw line grow to thirty before folding: a
  // fixed twenty-line window with folding from thirty would leave ten lines in
  // neither place for a while.
  let memory: ConversationMemory = EMPTY_MEMORY;
  for (let length = 1; length <= 80; length += 1) {
    const history = conversation(length);
    const due = foldDue(history, memory);
    if (due) memory = { text: `notes to ${due.upTo}`, upTo: due.upTo };
    const raw = rawLines(history, memory);
    assert.equal(memory.upTo + raw.length, length, `a line went missing at ${length}`);
    assert.ok(raw.length >= Math.min(length, RAW_LINES), `too few verbatim at ${length}`);
    assert.ok(raw.length < FOLD_AT, `raw line grew past the fold at ${length}`);
  }
});

test("a fold that keeps failing does not grow the request without end", () => {
  const raw = rawLines(conversation(100), EMPTY_MEMORY);
  assert.equal(raw.length, MAX_RAW_LINES);
  assert.equal(raw[raw.length - 1]?.text, "line 99", "the newest lines are the ones kept");
});

test("the fold is asked to rewrite the notes, not to start over", () => {
  const prompt = contextPrompt({
    tutorRole: "friend",
    setting: "A catch-up over coffee.",
    previous: "They work at a design company.",
    lines: [
      { who: "learner", text: "I might watch a movie tonight" },
      { who: "tutor", text: "Which one?" },
    ],
    today: "2026-11-04",
  });
  assert.match(prompt, /They work at a design company\./);
  assert.match(prompt, /Them: I might watch a movie tonight/);
  assert.match(prompt, /You: Which one\?/);
  assert.match(prompt, /Rewrite your notes to cover all of it/);
  assert.match(prompt, /Today is 2026-11-04/);
  assert.match(prompt, /"facts"/);
});

test("notes are read out of the answer, or not at all", () => {
  assert.equal(parseContext('{"notes": " Works in design. "}'), "Works in design.");
  assert.equal(parseContext('{"notes": ""}'), null);
  assert.equal(parseContext("not json"), null);
  const folded = parseMemory('{"notes": "Works in design.", "facts": ["Works in design.", "", 3, " Went to the gym the day before. "]}');
  assert.deepEqual(folded, { notes: "Works in design.", facts: ["Works in design.", "Went to the gym the day before."] });
  assert.equal(parseMemory('{"facts": ["Lives in Busan."]}')?.notes, "");
});

test("the notes reach the tutor at the tail of its brief, leaving the fixed part alone", () => {
  const scenario = findScenario("open-talk-en")!;
  const bank = sentencesFor("en");
  const brief = (context: string, prior = "") =>
    tutorSystemPrompt({
      scenario,
      bank,
      recorded: recordedLines(scenario, SCENARIOS, bank),
      request: {
        scenarioId: scenario.id,
        nodeId: "talk",
        mode: "script",
        heard: "hi",
        history: [],
        context,
        prior,
        freeTurns: 0,
        directedTurns: 0,
        level: 3,
        targetLanguage: "en",
        nativeLanguage: "ko",
      },
    });
  const without = brief("");
  const withNotes = brief("They work at a design company and are tired.");
  assert.doesNotMatch(without, /What you remember/);
  assert.match(withNotes, /What you remember from earlier in this conversation:\nThey work at a design company/);
  const fixed = without.slice(0, without.indexOf("Level:"));
  assert.ok(withNotes.startsWith(fixed), "the cached part must not move");
  const withPrior = brief("", "Today is 2026-11-04.\n2026-10-28: They went to the gym.");
  assert.match(withPrior, /from earlier conversations/);
  assert.match(withPrior, /2026-10-28: They went to the gym/);
  assert.ok(withPrior.startsWith(fixed), "earlier conversations stay out of the cached part");
});
