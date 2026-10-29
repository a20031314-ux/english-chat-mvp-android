import { test } from "node:test";
import assert from "node:assert/strict";
import { allFramesFor } from "./frames.ts";
import { allScriptsFor } from "./stageScripts.ts";
import { buildQuiz, canQuiz, weakKeysOfScript, fixOf, joinWords, orderCorrect, quizPassed, quizSources, wrongWords } from "./quiz.ts";
import { segmentWords } from "../wordSegments.ts";

const fixed = () => 0.42;

test("퀴즈: 문장구조 열쇠(ja, 띄어쓰기 없음) — 말하기 없이 셋까지, 같은 날 같은 문제", () => {
  const frame = allFramesFor("ja")[0]!;
  const key = `f|${frame.id}`;
  const quiz = buildQuiz("ja", key, { seed: "2026-10-28" })!;
  assert.ok(quiz, "퀴즈가 만들어져야 함");
  assert.ok(quiz.questions.length >= 2 && quiz.questions.length <= 3);
  assert.ok(quiz.questions.every((q) => q.kind !== "say"));
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
  assert.ok(quiz.questions.every((q) => q.kind !== "say"));
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

test("순서 조각: 일본어 활용은 한 조각, 긴 줄은 8조각 안팎으로 묶음(es)", async () => {
  const { orderTiles, tilesOf } = await import("./quiz.ts");
  assert.deepEqual(tilesOf("ブラジルから来ました。", "ja"), ["ブラジル", "から", "来ました"]);
  const long = "Lo siento mucho, pero este fin de semana no puedo trabajar porque tengo una boda familiar en Sevilla.";
  const tiles = orderTiles(long, "es");
  assert.ok(tiles.length >= 3 && tiles.length <= 10, String(tiles.length));
  assert.equal(tiles.join(" "), long.split(/\s+/).join(" "));
});

test("채우기 퀴즈: 다른 대본 줄까지 재료로, 풀 때마다 다른 줄·모양(고르기 → 맞추기 → 말하기 둘), 말하기는 내 줄만(영어·일본어·스페인어)", async () => {
  const { quizSources: sourcesOf, buildQuiz: build } = await import("./quiz.ts");
  const { allScriptsFor } = await import("./stageScripts.ts");
  for (const language of ["en", "ja", "es"]) {
    const script = allScriptsFor(language).find((one) => one.stage === 1)!;
    const key = `e|${script.expressions[0]}`;
    const sources = sourcesOf(language, key);
    assert.ok(sources.length >= 1, `${language} ${key}`);
    const firsts = new Set<string>();
    for (let round = 0; round < 3; round += 1) {
      const quiz = build(language, key, { round });
      if (!quiz) continue;
      firsts.add(quiz.questions.map((q) => ("text" in q ? q.text : "")).join("|"));
      for (const q of quiz.questions) if (q.kind === "say") assert.ok(sources.find((s) => s.text === q.text)?.who !== "them", "말하기는 내 줄");
      if (round >= 2 && sources.filter((s) => s.who !== "them").length >= 2) assert.ok(quiz.questions.filter((q) => q.kind === "say").length >= 1);
    }
    if (sources.length >= 3) assert.ok(firsts.size >= 2, `${language}: 풀 때마다 달라짐`);
  }
});

test("문법 칸 퀴즈 재료: 뒤 단계 대본(earlierGrammar)·문장구조 예문까지", async () => {
  const { quizSources: sourcesOf } = await import("./quiz.ts");
  const { allScriptsFor } = await import("./stageScripts.ts");
  const later = allScriptsFor("en").find((script) => (script.earlierGrammar ?? []).length);
  if (!later) return;
  const key = `g|${later.earlierGrammar![0]}`;
  assert.ok(sourcesOf("en", key).some((source) => source.from === later.id));
});

test("학습 조합: 말하기·듣기·읽기 위주로 모양이 바뀌고, 대본 하나를 문제 묶음으로(일본어·스페인어·태국어)", async () => {
  const { buildQuiz: build, buildUnit, unitPassed } = await import("./quiz.ts");
  const { allScriptsFor } = await import("./stageScripts.ts");
  for (const language of ["ja", "es", "th"]) {
    const script = allScriptsFor(language).find((one) => one.stage === 1)!;
    const key = `e|${script.expressions[0]}`;
    const listen = build(language, key, { mix: "listen" });
    assert.ok(listen && listen.questions.some((q) => q.kind === "listen"), `${language} listen`);
    const read = build(language, key, { mix: "read" });
    assert.ok(read && read.questions.every((q) => q.kind !== "say"), `${language} read 말하기 없음`);
    for (const mix of ["listen", "read"] as const) {
      const unit = buildUnit(language, script.id, mix, "d1");
      assert.ok(unit.length >= 3 && unit.length <= 8, `${language} ${mix} ${unit.length}`);
      for (const q of unit) if (q.kind === "listen" || q.kind === "meaning") assert.equal(q.options.length, 3);
      if (mix === "read") assert.ok(unit.every((q) => q.kind !== "say"));
      assert.deepEqual(buildUnit(language, script.id, mix, "d1"), unit, "같은 날 같은 문제");
    }
  }
  assert.equal(unitPassed(7, 10), true);
  assert.equal(unitPassed(6, 10), false);
});

test("문법·문장구조 열쇠는 말하기 문제가 없다(고르기·순서만, 2026-10-29) — 일본어·스페인어·영어", async () => {
  const { buildQuiz, speakScored } = await import("./quiz.ts");
  const { buildStageTest } = await import("./stageTest.ts");
  const { buildCheckup } = await import("./checkup.ts");
  const { stageKeys } = await import("./placement.ts");
  for (const language of ["ja", "es", "en"]) {
    const grammar = [1, 2, 3].flatMap((stage) => stageKeys(language, stage)).filter((key) => !speakScored(key));
    assert.ok(grammar.length > 0, language);
    for (const key of grammar) {
      for (const options of [{}, { round: 2 }, { mix: "speak" as const }, { mix: "listen" as const }, { kinds: ["say", "say", "order"] as const }]) {
        const quiz = buildQuiz(language, key, { seed: "t", ...options, kinds: "kinds" in options ? [...options.kinds] : undefined });
        assert.ok(!quiz?.questions.some((q) => q.kind === "say"), `${language} ${key} ${JSON.stringify(options)}`);
      }
    }
    const test = buildStageTest({ language, stage: 2, now: 0 });
    assert.ok(!test.some((item) => item.question.kind === "say" && !speakScored(item.key)), language);
    const checkup = buildCheckup({ language, stage: 2, passed: new Set(), review: {}, log: {}, now: 0 });
    assert.ok(!checkup.some((item) => item.question.kind === "say" && !speakScored(item.key)), language);
  }
  assert.equal(speakScored("e|nice to meet you"), true);
});
