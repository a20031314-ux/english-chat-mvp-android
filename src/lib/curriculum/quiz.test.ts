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

test("학습 조합: 말하기·읽기 위주로 모양이 바뀌고, 대본 하나를 문제 묶음으로 — 듣고 고르기는 없음(일본어·스페인어·태국어)", async () => {
  const { buildQuiz: build, buildUnit, unitPassed } = await import("./quiz.ts");
  const { allScriptsFor } = await import("./stageScripts.ts");
  for (const language of ["ja", "es", "th"]) {
    const script = allScriptsFor(language).find((one) => one.stage === 1)!;
    const key = `e|${script.expressions[0]}`;
    const read = build(language, key, { mix: "read" });
    assert.ok(read && read.questions.every((q) => q.kind !== "say"), `${language} read 말하기 없음`);
    for (const mix of ["speak", "read"] as const) {
      const unit = buildUnit(language, script.id, mix, "d1");
      assert.ok(unit.length >= 3 && unit.length <= 8, `${language} ${mix} ${unit.length}`);
      assert.ok(unit.every((q) => q.kind !== ("listen" as never)), `${language} ${mix} 듣기 없음`);
      for (const q of unit) if (q.kind === "meaning") assert.equal(q.options.length, 3);
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
      for (const options of [{}, { round: 2 }, { mix: "speak" as const }, { mix: "read" as const }, { kinds: ["say", "say", "order"] as const }]) {
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

test("단어 퀴즈(w|): 예문 빈칸 하나 — 발음(말하기)·듣기 없음, 같은 낱말을 세 번 묻지 않음 — 스페인어·일본어", async () => {
  const { registerQuizSources, wordQuiz, buildQuiz, bundleQuiz } = await import("./quiz.ts");
  const cases: [string, [string, string, string, string][]][] = [
    ["es", [["casa", "Mi casa es pequeña.", "집", "우리 집은 작아요."], ["perro", "El perro come mucho.", "개", "개가 많이 먹어요."], ["agua", "Quiero agua fría.", "물", "찬물을 원해요."]]],
    ["ja", [["駅", "駅はどこですか。", "역", "역은 어디예요?"], ["水", "水をください。", "물", "물 주세요."], ["本", "この本はおもしろい。", "책", "이 책은 재미있어요."]]],
  ];
  for (const [language, words] of cases) {
    registerQuizSources(language, words.map(([w, example, gloss, exampleGloss]) => ({ key: `w|${w}`, sources: [{ text: example, gloss: { en: "", raw: exampleGloss }, from: `w|${w}`, stage: 0, piece: w, who: "me" as const, wordGloss: gloss }] })));
    const [w, , gloss] = words[0]!;
    const quiz = wordQuiz(language, `w|${w}`, "seed");
    assert.ok(quiz, language);
    assert.deepEqual(quiz!.questions.map((q) => q.kind), ["choose"], language);
    const blank = quiz!.questions[0]!;
    assert.ok(blank.kind === "choose" && blank.options[blank.answer] === w, `${language} 정답은 그 낱말`);
    assert.ok(gloss);
    // 학습 조합을 정해도 단어 퀴즈 모양.
    assert.deepEqual(buildQuiz(language, `w|${w}`, { mix: "read" })!.questions.map((q) => q.kind), ["choose"]);
    // 짝 맞추기 뒤 묶음: 낱말마다 예문 빈칸 한 문제씩.
    const bundle = bundleQuiz(language, words.map(([one]) => `w|${one}`), { seed: "s", style: "choose" });
    assert.equal(new Set(bundle.keys).size, bundle.keys.length, `${language} 낱말마다 한 번`);
    assert.ok(bundle.questions.length >= 2 && bundle.questions.every((q) => q.kind === "choose"), `${language} ${bundle.questions.map((q) => q.kind)}`);
  }
});

test("묶음 퀴즈: 열쇠마다 한 문제, 같은 문장 없음, 말하기는 하나까지 — 일본어·스페인어", async () => {
  const { bundleQuiz } = await import("./quiz.ts");
  const { nextStudy } = await import("./nextStudy.ts");
  for (const language of ["ja", "es"]) {
    const keys = nextStudy({ language, stage: 1, passed: new Set(), review: {}, log: {}, weakest: "grammar", lane: "learn", now: 0 }).map((pick) => pick.key);
    const made = bundleQuiz(language, keys.slice(0, 8), { seed: "s", stage: 1 });
    assert.ok(made.questions.length >= 3, language);
    assert.equal(made.questions.length, made.keys.length);
    assert.equal(new Set(made.keys).size, made.keys.length, "같은 열쇠 두 번 없음");
    assert.ok(made.questions.filter((q) => q.kind === "say").length <= 1);
    const texts = made.questions.map((q) => ("text" in q ? q.text : ""));
    assert.equal(new Set(texts).size, texts.length);
  }
});

test("표현 퀴즈 재료에 빈도 단어 예문(그 표현이 든 것)도 — 영어·일본어", async () => {
  const { registerQuizSources, quizSources } = await import("./quiz.ts");
  registerQuizSources("en", [{ key: "w|zzthanks", sources: [{ text: "Thank you for the coffee, it was great.", gloss: { en: "", raw: "커피 고마워요" }, from: "w|zzthanks", stage: 0, piece: "coffee", who: "me", wordGloss: "커피" }] }]);
  assert.ok(quizSources("en", "e|thank you").some((source) => source.text === "Thank you for the coffee, it was great." && source.stage === 0));
  registerQuizSources("ja", [{ key: "w|zzお茶", sources: [{ text: "お茶をありがとうございます。", gloss: { en: "", raw: "차 고마워요" }, from: "w|zzお茶", stage: 0, piece: "お茶", who: "me", wordGloss: "차" }] }]);
  assert.ok(quizSources("ja", "e|ありがとうございます").some((source) => source.text === "お茶をありがとうございます。"));
});

test("복습에서 고른 모양: 묶음이 그 모양만, 단어 퀴즈도 그 모양만 — 일본어·스페인어", async () => {
  const { bundleQuiz, buildQuiz, registerQuizSources } = await import("./quiz.ts");
  const { nextStudy } = await import("./nextStudy.ts");
  for (const language of ["ja", "es"]) {
    const keys = nextStudy({ language, stage: 1, passed: new Set(), review: {}, log: {}, weakest: "grammar", lane: "learn", now: 0 }).map((pick) => pick.key);
    for (const style of ["order", "choose"] as const) {
      const made = bundleQuiz(language, keys.slice(0, 8), { seed: "s", stage: 1, style });
      assert.ok(made.questions.length >= 2, `${language} ${style}`);
      assert.ok(made.questions.filter((q) => q.kind === style).length >= made.questions.length - 1, `${language} ${style}: ${made.questions.map((q) => q.kind)}`);
    }
  }
  registerQuizSources("es", [{ key: "w|zzcafé", sources: [{ text: "Quiero un café, por favor.", gloss: { en: "", raw: "커피 한 잔 주세요" }, from: "w|zzcafé", stage: 0, piece: "café", who: "me", wordGloss: "커피" }] }]);
  const word = buildQuiz("es", "w|zzcafé", { kinds: ["choose", "choose", "choose"] });
  if (word) assert.ok(word.questions.every((q) => q.kind === "choose"), String(word.questions.map((q) => q.kind)));
});
