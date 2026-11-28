import { test } from "node:test";
import assert from "node:assert/strict";
import { fixSpan, talkFills, lineId } from "./talkFill.ts";

test("fixSpan: 고친 곳만 — 영어·스페인어·일본어, 통째로 고친 줄과 지우기만 한 줄은 없음", () => {
  assert.deepEqual(fixSpan("I go to school yesterday.", "I went to school yesterday.", "en"), { start: 2, end: 6, answer: "went", wrong: "go" });
  const es = fixSpan("Ayer yo como paella con mis amigos.", "Ayer yo comí paella con mis amigos.", "es");
  assert.equal(es?.answer, "comí");
  assert.equal(es?.wrong, "como");
  const ja = fixSpan("昨日、映画を見ます。", "昨日、映画を見ました。", "ja");
  assert.equal(ja?.answer, "見ました");
  assert.equal(ja?.wrong, "見ます");
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

test("talkFills: 고침받지 않은 내 줄은 빈칸으로 안 냄, 튜터 줄은 냄 — 영어·스페인어·일본어", () => {
  const en = talkFills("en", [[
    { who: "them" as const, text: "What do you put in it?" },
    { who: "me" as const, text: "Nothing but it is just packed so I can make it easily" },
  ]], { stage: 5, memo: {}, now: 1000, n: 3 });
  assert.equal(en.length, 0);
  const tutor = talkFills("en", [[
    { who: "me" as const, text: "What will you do?" },
    { who: "them" as const, text: "I'm going to make some dinner later.", gloss: "나 이따 저녁 해 먹으려고." },
  ]], { stage: 5, memo: {}, now: 1000, n: 3 });
  assert.equal(tutor[0]?.question.answer, "going to");
  assert.equal(tutor[0]?.question.lines.at(-1)?.gloss, "나 이따 저녁 해 먹으려고.");
  const es = talkFills("es", [[{ who: "them" as const, text: "¿Y tú?" }, { who: "me" as const, text: "Quiero comer pizza esta noche." }]], { stage: 5, memo: {}, now: 1000, n: 3 });
  assert.equal(es.length, 0);
  const ja = talkFills("ja", [[{ who: "me" as const, text: "何をしますか？" }, { who: "them" as const, text: "晩ご飯を食べたいです。" }]], { stage: 5, memo: {}, now: 1000, n: 3 });
  assert.equal(ja[0]?.question.answer, "たいです");
});
