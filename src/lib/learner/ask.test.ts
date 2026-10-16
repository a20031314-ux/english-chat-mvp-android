import assert from "node:assert/strict";
import test from "node:test";
import { askData, askSystemPrompt, parseAnswer } from "./ask.ts";
import { emptyGrowth, growthView } from "./growth.ts";
import { emptyLedger } from "./ledger.ts";

test("the answer is read with at most one element to grow, and an unknown one is dropped", () => {
  assert.deepEqual(parseAnswer('{"answer":"정확도가 이번 주 5 늘었어요.","grow":"speaking"}'), {
    answer: "정확도가 이번 주 5 늘었어요.",
    grow: "speaking",
  });
  assert.deepEqual(parseAnswer('{"answer":"Bien.","grow":"level"}'), { answer: "Bien.", grow: null });
  assert.equal(parseAnswer('{"answer":""}'), null);
  assert.equal(parseAnswer("not json"), null);
});

test("the model is told to answer from the data, in the interface language, with no level", () => {
  const prompt = askSystemPrompt({ uiName: "Korean", targetName: "Japanese" });
  assert.match(prompt, /Write in Korean/);
  assert.match(prompt, /Never invent a number/);
  assert.match(prompt, /Never give a level/);
  const data = JSON.parse(
    askData({
      growth: growthView({ record: emptyGrowth(), ledger: emptyLedger("ja", 0), now: Date.UTC(2026, 9, 16) }),
      mistakes: [{ name: "particle を", times: 2 }],
      stuckLast14: 3,
      stuckPhrases: ["おすすめは何ですか"],
      selfCheck: null,
      tutorNotes: ["mistakes"],
    }),
  );
  assert.equal(data.elements.length, 6);
  assert.equal(data.stuckInCallsLast14Days, 3);
  assert.deepEqual(data.phrasesFromStuckMoments, ["おすすめは何ですか"]);
});
