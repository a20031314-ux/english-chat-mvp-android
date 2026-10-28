import { test } from "node:test";
import assert from "node:assert/strict";
import { allFramesFor } from "./frames.ts";
import { allScriptsFor } from "./stageScripts.ts";
import { buildQuiz, canQuiz, weakKeysOfScript, fixOf, joinWords, orderCorrect, quizPassed, quizSources, wrongWords } from "./quiz.ts";
import { segmentWords } from "../wordSegments.ts";

const fixed = () => 0.42;

test("퀴즈: 문장구조 열쇠(ja, 띄어쓰기 없음) — 말하기로 끝나고 셋까지, 같은 날 같은 문제", () => {
  const frame = allFramesFor("ja")[0]!;
  const key = `f|${frame.id}`;
  const quiz = buildQuiz("ja", key, { seed: "2026-10-28" })!;
  assert.ok(quiz, "퀴즈가 만들어져야 함");
  assert.ok(quiz.questions.length >= 2 && quiz.questions.length <= 3);
  assert.equal(quiz.questions.at(-1)!.kind, "say");
  assert.deepEqual(buildQuiz("ja", key, { seed: "2026-10-28" }), quiz);
  const order = quiz.questions.find((q) => q.kind === "order");
  if (order && order.kind === "order") {
    assert.ok(order.words.length >= 3, "일본어도 낱말로 잘림");
    assert.equal(order.spaced, false);
    assert.ok(!orderCorrect(order.words, order.tiles), "섞인 차례는 처음과 달라야 함");
    assert.ok(orderCorrect(order.words, order.words.map((_, i) => i)));
  }
});

test("퀴즈: 고르기 — 답 조각은 문장에 있고 오답은 문장에 없음(es)", () => {
  let checked = 0;
  for (const frame of allFramesFor("es").slice(0, 20)) {
    const quiz = buildQuiz("es", `f|${frame.id}`, { seed: "d" });
    for (const q of quiz?.questions ?? []) {
      if (q.kind !== "choose") continue;
      checked += 1;
      assert.equal(q.options.length, 3);
      assert.equal(`${q.before}${q.options[q.answer]}${q.after}`, q.text);
      for (const [i, option] of q.options.entries()) if (i !== q.answer) assert.ok(!q.text.includes(option), option);
    }
  }
  assert.ok(checked > 0, "고르기 문제가 적어도 하나");
});

test("퀴즈: 표현 열쇠(e|)는 그 표현이 든 내 줄로", () => {
  const script = allScriptsFor("es").find((s) => s.expressions.some((e) => s.lines.some((l) => l.who === "me" && l.text.includes(e))))!;
  const expression = script.expressions.find((e) => script.lines.some((l) => l.who === "me" && l.text.includes(e)))!;
  const sources = quizSources("es", `e|${expression}`);
  assert.ok(sources.length > 0);
  assert.ok(sources.every((source) => source.text.toLocaleLowerCase().includes(expression.toLocaleLowerCase()) && source.piece));
});

test("퀴즈: 모르는 열쇠는 없음", () => {
  assert.equal(buildQuiz("ja", "f|nope"), null);
  assert.equal(canQuiz("ja", "e|"), false);
});

test("퀴즈: 고친 줄 — 틀린 낱말만 표시(es, ja)", () => {
  const es = fixOf("es", { wrong: "Ayer yo va al parque.", right: "Ayer yo fui al parque." }, fixed)!;
  assert.equal(es.kind, "fix");
  if (es.kind === "fix") assert.deepEqual(es.bad.map((i) => es.words[i]), ["va"]);
  const words = segmentWords("昨日、友達と映画を見ます。", "ja");
  const bad = wrongWords(words, segmentWords("昨日、友達と映画を見ました。", "ja"));
  assert.ok(bad.length >= 1 && bad.length < words.length, "일본어도 바뀐 낱말만");
  // 빠진 말만 더한 고침이면 두 문장 고르기.
  const add = fixOf("es", { wrong: "Voy parque.", right: "Voy al parque." }, fixed)!;
  if (add.kind === "fix") {
    assert.deepEqual(add.bad, []);
    assert.equal(add.options![add.answer!], "Voy al parque.");
  }
});

test("퀴즈: 고친 줄이 있으면 맨 앞, 셋을 넘지 않음", () => {
  const frame = allFramesFor("ja")[0]!;
  const quiz = buildQuiz("ja", `f|${frame.id}`, { card: { wrong: "わたしはキムだ。", right: "わたしはキムです。" }, seed: "x" })!;
  assert.equal(quiz.questions[0]!.kind, "fix");
  assert.ok(quiz.questions.length <= 3);
  assert.equal(quiz.questions.at(-1)!.kind, "say");
});

test("퀴즈: 맞음 기준과 조각 잇기", () => {
  assert.equal(quizPassed(2, 3), true);
  assert.equal(quizPassed(1, 3), false);
  assert.equal(quizPassed(1, 2), false);
  assert.equal(quizPassed(2, 2), true);
  assert.equal(joinWords(["私", "は"], false), "私は");
  assert.equal(joinWords(["Voy", "al"], true), "Voy al");
});

test("대본에서 같은 줄을 두 번 틀리면 그 줄의 문장구조·표현이 약한 곳(ja·es)", () => {
  for (const language of ["ja", "es"]) {
    const script = allScriptsFor(language).find((s) => s.lines.some((l) => l.who === "me" && l.frames?.length))!;
    const at = script.lines.findIndex((l) => l.who === "me" && l.frames?.length);
    assert.deepEqual(weakKeysOfScript(script, { [at]: 1 }), [], "한 번은 실수");
    const keys = weakKeysOfScript(script, { [at]: 2 });
    for (const frame of script.lines[at]!.frames!) assert.ok(keys.includes(`f|${frame}`));
  }
});
