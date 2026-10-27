import { test } from "node:test";
import assert from "node:assert/strict";
import { learnerLineView } from "./lineView.ts";
import type { TranscriptLine } from "./review.ts";

const call: TranscriptLine[] = [
  { who: "tutor", text: "How was your weekend?" },
  { who: "learner", text: "It was great, I went hiking." },
  { who: "tutor", text: "Nice! Where did you go?" },
  { who: "learner", text: "Yesterday I go to mountain.", better: "Yesterday I went to the mountains." },
  { who: "tutor", text: "Oh, which one?" },
  { who: "learner", text: "昨日、友達を会いました。" },
];
const during = { showAll: false, over: false };

test("통화 중 기본: 고칠 곳 없는 내 줄은 숨기고, 고친 줄은 보이고, 판단 전 마지막 줄은 …", () => {
  assert.equal(learnerLineView(call, 0, during), "show");
  assert.equal(learnerLineView(call, 1, during), "hidden");
  assert.equal(learnerLineView(call, 3, during), "show");
  assert.equal(learnerLineView(call, 5, during), "waiting");
});

test("되살린 뜻·한마디·막힘도 보인다(스페인어)", () => {
  const lines: TranscriptLine[] = [
    { who: "learner", text: "Ayer yo soy cansado", meant: "Ayer estaba cansado" },
    { who: "learner", text: "Hola", about: "짧게 인사만 했어요" },
    { who: "learner", text: "", stuck: { asked: "¿Qué tal?", heard: "", attempts: 2, hesitationMs: 4000, history: [] } },
    { who: "tutor", text: "¡Vale!" },
  ];
  for (const i of [0, 1, 2]) assert.equal(learnerLineView(lines, i, during), "show");
});

test("'내 말'을 켜거나 통화가 끝나면 전부", () => {
  assert.equal(learnerLineView(call, 1, { showAll: true, over: false }), "show");
  assert.equal(learnerLineView(call, 5, { showAll: false, over: true }), "show");
});
