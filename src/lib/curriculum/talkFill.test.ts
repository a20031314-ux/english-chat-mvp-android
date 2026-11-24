import { test } from "node:test";
import assert from "node:assert/strict";
import { fixSpan, talkFills, lineId } from "./talkFill.ts";

test("fixSpan: 고친 곳만 — 영어·스페인어·일본어, 통째로 고친 줄과 지우기만 한 줄은 없음", () => {
  assert.deepEqual(fixSpan("I go to school yesterday.", "I went to school yesterday.", "en"), { start: 2, end: 6, answer: "went", wrong: "go" });
  const es = fixSpan("Ayer yo como paella con mis amigos.", "Ayer yo comí paella con mis amigos.", "es");
  assert.equal(es?.answer, "comí");
  assert.equal(es?.wrong, "como");
  const ja = fixSpan("昨日、映画を見ます。", "昨日、映画を見ました。", "ja");
  assert.equal(ja?.answer, "ました");
  assert.equal(ja?.wrong, "ます");
  assert.equal(fixSpan("Me gusta.", "Me gustan los perros grandes y negros.", "es"), null);
  assert.equal(fixSpan("I very like it.", "I like it.", "en"), null);
});

test("talkFills: 고침받은 줄 먼저(내가 한 말 was·처음 꼴은 틀림), 맞힌 줄은 다시 안 냄", () => {
  const conv = [
    { who: "them" as const, text: "What did you do yesterday?" },
    { who: "me" as const, text: "I went to school yesterday.", fixed: true, was: "I go to school yesterday." },
    { who: "them" as const, text: "Nice! Did you like it?" },
  ];
  const got = talkFills("en", [conv], { stage: 5, memo: {}, now: 1000, n: 3 });
  assert.equal(got[0]!.question.answer, "went");
  assert.equal(got[0]!.question.was, "I go to school yesterday.");
  assert.deepEqual(got[0]!.question.near, ["go"]);
  assert.equal(got[0]!.question.lines.length, 2);
  const memo = { [got[0]!.id]: { ok: true, t: 900 } };
  assert.ok(!talkFills("en", [conv], { stage: 5, memo, now: 1000, n: 3 }).some((one) => one.id === got[0]!.id));
  assert.match(lineId("x"), /^t\|/);
});
