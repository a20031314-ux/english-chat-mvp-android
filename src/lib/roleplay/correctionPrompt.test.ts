import assert from "node:assert/strict";
import test from "node:test";
import {
  correctionSystemPrompt,
  parseCorrection,
} from "./correctionPrompt.ts";

const base = {
  heard: "I want coffee",
  goal: "마시고 싶은 것을 주문하세요.",
  setting: "A small café at mid-morning.",
  tutorRole: "barista",
  targetLanguage: "en" as const,
  nativeLanguage: "ko" as const,
};

test("the correction is asked for in character, not as a lesson", () => {
  // A barista who starts explaining grammar has left the scene, and the scene
  // is the thing being practised.
  const prompt = correctionSystemPrompt(base);
  assert.match(prompt, /You are the barista/);
  assert.match(prompt, /Stay in character/);
  assert.match(prompt, /not as a grammar note/);
  assert.match(prompt, /Do not say you are a tutor/);
});

test("it is asked to stay one-way", () => {
  // The rung below a call exists precisely because it does not invite a reply.
  // A question here would turn it into the conversation it was avoiding.
  const prompt = correctionSystemPrompt(base);
  // Newline-tolerant: the prompt is wrapped, and the wrapping is not the point.
  assert.match(prompt, /do\s+not\s+ask\s+them\s+anything/i);
  assert.match(prompt, /One sentence, two at the most/);
});

test("it carries the scene, the goal and what was actually said", () => {
  const prompt = correctionSystemPrompt(base);
  assert.match(prompt, /A small café at mid-morning/);
  assert.match(prompt, /마시고 싶은 것을 주문하세요/);
  assert.match(prompt, /"I want coffee"/);
});

test("the line comes in the target language and the note in the learner's", () => {
  const prompt = correctionSystemPrompt(base);
  assert.match(prompt, /in English/);
  assert.match(prompt, /into Korean/);
});

test("a malformed answer is nothing rather than something", () => {
  // Showing a fragment of JSON to someone already stuck is a second thing gone
  // wrong; the caller offers a retry instead.
  assert.equal(parseCorrection("not json"), null);
  assert.equal(parseCorrection("{}"), null);
  assert.equal(parseCorrection('{"text": "  "}'), null);
  assert.equal(parseCorrection("[]"), null);
});

test("a good answer comes back trimmed", () => {
  assert.deepEqual(
    parseCorrection('{"text": "  Can I get a coffee, please.  ", "translation": " 커피 주세요. "}'),
    { text: "Can I get a coffee, please.", translation: "커피 주세요." },
  );
});

test("a missing translation is empty rather than fatal", () => {
  // The line itself is the useful half; losing the note should not lose it.
  assert.deepEqual(parseCorrection('{"text": "For here, please."}'), {
    text: "For here, please.",
    translation: "",
  });
});
