import assert from "node:assert/strict";
import test from "node:test";
import { createCallLineReader } from "./callLines.ts";

/** A datachannel frame, as the realtime API sends it: a JSON string. */
function frame(payload: Record<string, unknown>): string {
  return JSON.stringify(payload);
}

const tutorDone = (transcript: string, itemId?: string) =>
  frame({ type: "response.output_audio_transcript.done", transcript, item_id: itemId });

const learnerDone = (transcript: string, itemId?: string) =>
  frame({
    type: "conversation.item.input_audio_transcription.completed",
    transcript,
    item_id: itemId,
  });

test("a finished tutor turn becomes the first line", () => {
  const reader = createCallLineReader(() => 1000);
  const line = reader.read(tutorDone("Hi there!", "item_1"));
  assert.deepEqual(line, {
    id: "tutor:item_1",
    index: 1,
    role: "tutor",
    text: "Hi there!",
    at: 1000,
  });
});

test("the learner's own turn is a line too, and is marked as theirs", () => {
  const reader = createCallLineReader(() => 0);
  const line = reader.read(learnerDone("I went to the gym today.", "item_2"));
  assert.equal(line?.role, "learner");
  assert.equal(line?.text, "I went to the gym today.");
});

test("both spellings of the tutor's transcript event are read", () => {
  // The event has been named two ways across realtime versions, and a third
  // rename in the same family should keep working rather than going quiet.
  for (const type of [
    "response.audio_transcript.done",
    "response.output_audio_transcript.done",
    "response.some_future_name.audio_transcript.done",
  ]) {
    const reader = createCallLineReader(() => 0);
    const line = reader.read(frame({ type, transcript: "Spoken.", item_id: "i" }));
    assert.equal(line?.role, "tutor", `${type} should produce a tutor line`);
  }
});

test("numbers are handed out in the order turns finish, across both speakers", () => {
  const reader = createCallLineReader(() => 0);
  const indexes = [
    reader.read(tutorDone("One.", "a")),
    reader.read(learnerDone("Two.", "b")),
    reader.read(tutorDone("Three.", "c")),
  ].map((line) => `${line?.index}:${line?.role}`);
  assert.deepEqual(indexes, ["1:tutor", "2:learner", "3:tutor"]);
});

test("a repeated completion does not take a second number", () => {
  const reader = createCallLineReader(() => 0);
  assert.equal(reader.read(tutorDone("Hello.", "item_1"))?.index, 1);
  assert.equal(reader.read(tutorDone("Hello.", "item_1")), null);
  // The next real turn still gets 2, not 3 — the repeat consumed nothing.
  assert.equal(reader.read(learnerDone("Hi.", "item_2"))?.index, 2);
});

test("the same words from each speaker are two lines, not a repeat", () => {
  const reader = createCallLineReader(() => 0);
  assert.equal(reader.read(tutorDone("How are you?"))?.index, 1);
  assert.equal(reader.read(learnerDone("How are you?"))?.index, 2);
});

test("streaming deltas are dropped, which is what keeps the numbering still", () => {
  const reader = createCallLineReader(() => 0);
  assert.equal(reader.read(frame({ type: "response.audio_transcript.delta", delta: "Hi" })), null);
  assert.equal(
    reader.read(frame({ type: "response.output_audio_transcript.delta", transcript: "Hi" })),
    null,
  );
  // The finished turn is still line 1.
  assert.equal(reader.read(tutorDone("Hi there."))?.index, 1);
});

test("events that carry no transcript are ignored", () => {
  const reader = createCallLineReader(() => 0);
  for (const raw of [
    frame({ type: "session.created" }),
    frame({ type: "response.output_audio_transcript.done" }),
    frame({ type: "response.output_audio_transcript.done", transcript: "" }),
    frame({ type: "response.output_audio_transcript.done", transcript: "   " }),
    frame({ type: "", transcript: "orphaned" }),
    frame({ type: 7, transcript: "wrong type" }),
  ]) {
    assert.equal(reader.read(raw), null, `should ignore ${raw}`);
  }
});

test("a frame that is not JSON, or not a string, is ignored rather than thrown", () => {
  const reader = createCallLineReader(() => 0);
  assert.equal(reader.read("not json at all"), null);
  assert.equal(reader.read(new ArrayBuffer(8)), null);
  assert.equal(reader.read(undefined), null);
  assert.equal(reader.read(frame({ type: "x" } as never).replace("{", "[")), null);
});

test("surrounding whitespace is trimmed off a line", () => {
  const reader = createCallLineReader(() => 0);
  assert.equal(reader.read(tutorDone("  Hi there.\n"))?.text, "Hi there.");
});

test("a new call starts its numbering at one", () => {
  const first = createCallLineReader(() => 0);
  first.read(tutorDone("One.", "a"));
  first.read(tutorDone("Two.", "b"));
  const second = createCallLineReader(() => 0);
  assert.equal(second.read(tutorDone("One.", "a"))?.index, 1);
});
