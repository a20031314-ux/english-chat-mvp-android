import { test } from "node:test";
import assert from "node:assert/strict";
import { allFramesFor } from "./frames.ts";
import { allScriptsFor } from "./stageScripts.ts";
import { buildQuiz, canQuiz, nearOf, weakKeysOfScript, fixOf, joinWords, orderCorrect, quizPassed, quizSources, wrongWords } from "./quiz.ts";
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

test("문법 칸 퀴즈 재료: 그 문법을 쓰는 문장구조 예문 + 그 틀이 든 대본 줄만(2026-11-03 — 표시만 있는 줄은 뺌)", async () => {
  const { quizSources: sourcesOf } = await import("./quiz.ts");
  const { allFramesFor } = await import("./frames.ts");
  const sources = sourcesOf("en", "g|2:0");
  assert.ok(sources.length >= 3);
  assert.ok(sources.every((source) => Boolean(source.frame) && Boolean(source.piece)));
  const linked = new Set(allFramesFor("en").filter((frame) => frame.stage === 2 && (frame.grammar ?? []).includes(0)).map((frame) => frame.id));
  assert.ok(sources.every((source) => linked.has(source.frame!)));
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
    ["ja", [["ねこ", "ねこがすきです。", "고양이", "고양이를 좋아해요."], ["みず", "みずをください。", "물", "물 주세요."], ["ほん", "このほんはおもしろい。", "책", "이 책은 재미있어요."]]],
  ];
  // 품사가 다른 낱말(동사) — 명사 빈칸의 보기에 나오면 안 된다(사용자 2026-10-30 "선지는 다 같은 품사로").
  const verbs: Record<string, [string, string]> = { es: ["comer", "Me gusta comer."], ja: ["たべる", "ごはんをたべる。"] };
  for (const [language, words] of cases) {
    const [verb, verbText] = verbs[language]!;
    registerQuizSources(language, [
      ...words.map(([w, example, gloss, exampleGloss]) => ({ key: `w|${w}`, sources: [{ text: example, gloss: { en: "", raw: exampleGloss }, from: `w|${w}`, stage: 0, piece: w, who: "me" as const, wordGloss: gloss, pos: "noun" }] })),
      { key: `w|${verb}`, sources: [{ text: verbText, gloss: { en: "", raw: "" }, from: `w|${verb}`, stage: 0, piece: verb, who: "me" as const, wordGloss: "", pos: "verb" }] },
    ]);
    const [w, , gloss] = words[0]!;
    const quiz = wordQuiz(language, `w|${w}`, "seed");
    assert.ok(quiz, language);
    // 빈칸 쓰기 먼저, 그다음 보기 고르기(2026-10-30 사용자 "타이핑 문제를 대거").
    assert.deepEqual(quiz!.questions.map((q) => q.kind), ["type", "choose"], language);
    assert.ok(quiz!.questions[0]!.kind === "type" && quiz!.questions[0]!.answer === w, `${language} 쓰기 정답은 그 낱말`);
    const blank = quiz!.questions[1]!;
    assert.ok(blank.kind === "choose" && blank.options[blank.answer] === w, `${language} 정답은 그 낱말`);
    assert.ok(blank.kind === "choose" && !blank.options.includes(verb), `${language} 다른 품사(${verb})는 보기에 없음`);
    // 같은 품사 낱말이 모자라면 빈칸을 만들지 않고, 순서 맞추기로 넘어가지도 않는다.
    assert.deepEqual(wordQuiz(language, `w|${verb}`, "seed")?.questions.map((q) => q.kind), ["type"], `${language} 동사는 같은 품사 보기가 없어 고르기는 없고 쓰기만`);
    assert.ok(gloss);
    // 학습 조합을 정해도 단어 퀴즈 모양.
    assert.deepEqual(buildQuiz(language, `w|${w}`, { mix: "read" })!.questions.map((q) => q.kind), ["type", "choose"]);
    // 짝 맞추기 뒤 묶음: 낱말마다 예문 빈칸 한 문제씩.
    const bundle = bundleQuiz(language, words.map(([one]) => `w|${one}`), { seed: "s", style: "choose" });
    assert.equal(new Set(bundle.keys).size, bundle.keys.length, `${language} 낱말마다 한 번`);
    assert.ok(bundle.questions.length >= 2 && bundle.questions.every((q) => q.kind === "choose"), `${language} ${bundle.questions.map((q) => q.kind)}`);
  }
});

test("빈칸 자리: 다른 낱말 속은 비우지 않음, 한자가 든 답은 쓰기 대신 고르기(2026-10-31 가상 사용자)", async () => {
  const { pieceAt, registerQuizSources, wordQuiz } = await import("./quiz.ts");
  assert.equal(pieceAt("She answers the phone.", "he", "en"), -1);
  assert.equal(pieceAt("Hello, he said.", "he", "en"), 7);
  assert.equal(pieceAt("Él come en el café.", "el", "es"), 11);
  assert.equal(pieceAt("今日はとても暑い日です。", "日", "ja"), 8);
  registerQuizSources("ja", [
    ...["駅", "水", "本"].map((w, i) => ({ key: `w|${w}`, sources: [{ text: ["駅はどこですか。", "水をください。", "この本はおもしろい。"][i]!, gloss: { en: "", raw: "뜻" }, from: `w|${w}`, stage: 0, piece: w, who: "me" as const, wordGloss: "뜻", pos: "noun" }] })),
  ]);
  const kinds = wordQuiz("ja", "w|駅", "seed")!.questions.map((q) => q.kind);
  assert.ok(!kinds.includes("type") && kinds.includes("choose"), kinds.join());
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

test("퀴즈 칸 = 빈칸 고르기만(strict) — 문법·표현 열쇠도 빈칸이 아니면 건너뜀(일본어·스페인어)", async () => {
  const { bundleQuiz } = await import("./quiz.ts");
  const { nextStudy } = await import("./nextStudy.ts");
  for (const language of ["ja", "es"]) {
    const keys = nextStudy({ language, stage: 1, passed: new Set(), review: {}, log: {}, weakest: "expression", lane: "learn", now: 0 }).map((pick) => pick.key);
    const made = bundleQuiz(language, keys.slice(0, 8), { seed: "s", stage: 1, style: "choose", strict: true });
    assert.ok(made.questions.length >= 1, language);
    assert.ok(made.questions.every((q) => q.kind === "choose"), `${language} ${made.questions.map((q) => q.kind)}`);
  }
});

test("빈칸 보기에 대소문자만 다른 같은 말이 둘 나오지 않는다(스페인어·일본어 문법)", async () => {
  const { bundleQuiz } = await import("./quiz.ts");
  const { nextStudy } = await import("./nextStudy.ts");
  for (const language of ["es", "ja"]) {
    const keys = nextStudy({ language, stage: 1, passed: new Set(), review: {}, log: {}, weakest: "grammar", focus: "grammar", lane: "learn", now: 0 }).map((pick) => pick.key);
    for (let seed = 0; seed < 20; seed += 1) {
      const made = bundleQuiz(language, keys.slice(0, 8), { seed: `s${seed}`, stage: 1, style: "choose", strict: true });
      for (const q of made.questions) if (q.kind === "choose") assert.equal(new Set(q.options.map((o) => o.toLocaleLowerCase())).size, q.options.length, `${language} ${q.options}`);
    }
  }
});

test("답한 뒤 예문: 지금 문장 빼고 둘, 보여 준 문장은 다음 빈칸에서 뒤로 — 태국어·스페인어", async () => {
  const { moreExamples, registerQuizSources, wordQuiz } = await import("./quiz.ts");
  const g = (raw: string) => ({ en: "", raw });
  registerQuizSources("es", [
    {
      key: "w|zzlibro",
      sources: [
        { text: "Leo un libro nuevo.", gloss: g("새 책을 읽어요"), from: "w|zzlibro", stage: 0, piece: "libro", who: "me" },
        { text: "Ese libro es de mi hermana.", gloss: g("그 책은 언니 거예요"), from: "w|zzlibro", stage: 0, piece: "libro", who: "me" },
        { text: "Busco un libro de cocina.", gloss: g("요리책을 찾아요"), from: "w|zzlibro", stage: 0, piece: "libro", who: "me" },
      ],
    },
  ]);
  const shown = moreExamples("es", "w|zzlibro", "Leo un libro nuevo.");
  assert.equal(shown.length, 2);
  assert.ok(shown.every((one) => one.text !== "Leo un libro nuevo." && one.text.includes("libro")));
  // 첫 문장은 보여 주지 않았으니 다음 빈칸도 그 문장.
  assert.equal((wordQuiz("es", "w|zzlibro")?.questions[0] as { text?: string }).text, "Leo un libro nuevo.");
  registerQuizSources("th", [
    {
      key: "w|zzน้ำ",
      sources: [
        { text: "ขอน้ำหนึ่งแก้ว", gloss: g("물 한 잔 주세요"), from: "w|zzน้ำ", stage: 0, piece: "น้ำ", who: "me" },
        { text: "น้ำเย็นมาก", gloss: g("물이 아주 차요"), from: "w|zzน้ำ", stage: 0, piece: "น้ำ", who: "me" },
      ],
    },
  ]);
  const th = moreExamples("th", "w|zzน้ำ", "น้ำเย็นมาก");
  assert.deepEqual(th.map((one) => one.text), ["ขอน้ำหนึ่งแก้ว"]);
  // 보여 준 첫 문장은 뒤로 — 다음 빈칸은 다른 문장.
  const next = wordQuiz("th", "w|zzน้ำ")?.questions[0] as { text?: string } | undefined;
  if (next) assert.equal(next.text, "น้ำเย็นมาก");
  // 예문이 하나뿐이면 보여 줄 것 없음.
  assert.equal(moreExamples("es", "w|zznada", "x").length, 0);
});

test("가상 사용자 표시 고침(2026-11-01): 같은 문장에 답이 또 있으면 안 냄 · 부호로 뜻이 갈리면 틀림 · 수업 예문은 뒤로 — 스페인어·일본어", async () => {
  const { pieceTwice, typedRight, registerQuizSources, wordQuiz, buildQuiz } = await import("./quiz.ts");
  assert.equal(pieceTwice("No lo sé, lo siento.", "lo", "es"), true);
  assert.equal(pieceTwice("No lo sé.", "lo", "es"), false);
  assert.equal(pieceTwice("Lo siento, no lo sé.", "lo", "es"), true);
  assert.equal(pieceTwice("わたしはわたしです。", "わたし", "ja"), true);
  assert.equal(pieceTwice("わたしは学生です。", "わたし", "ja"), false);
  registerQuizSources("es", [{ key: "w|zzlo", sources: [{ text: "No lo sé, lo siento.", gloss: { en: "", raw: "모르겠어요, 미안해요" }, from: "w|zzlo", stage: 0, piece: "lo", who: "me", pos: "function" }] }]);
  assert.equal(wordQuiz("es", "w|zzlo"), null);
  // ñ·뜻을 가르는 부호는 틀림, 그 밖의 빠진 부호는 거의 맞음.
  assert.equal(typedRight("años", "anos", { language: "es" }), false);
  assert.equal(typedRight("Él", "El", { language: "es" }), false);
  assert.equal(typedRight("café", "cafe", { language: "es" }), "loose");
  assert.equal(typedRight("años", "años", { language: "es" }), "exact");
  // 수업이 설명에 보여 준 예문(later)은 다른 문장이 있으면 퀴즈 첫 문제에 안 나온다.
  const quiz = buildQuiz("es", "f|es-f1-01", { seed: "x", stage: 1, later: new Set(["Me llamo Ji-woo."]) });
  if (quiz?.questions.length) assert.notEqual((quiz.questions[0] as { text?: string }).text, "Me llamo Ji-woo.");
});

test("낱말 오답에서 철자 실수 꼴·운 맞춤만 빼기 — 영어·스페인어", async () => {
  const { spellingOnly } = await import("./quiz.ts");
  assert.equal(spellingOnly("totaly", "totally"), true);
  assert.equal(spellingOnly("aera", "area"), true);
  assert.equal(spellingOnly("tank", "bank"), true);
  assert.equal(spellingOnly("perra", "perro"), false);
  assert.equal(spellingOnly("perros", "perro"), false);
  assert.equal(spellingOnly("totals", "totally"), false);
});

test("뜻 줄: 앱 언어 = 학습 언어면 없음(문장 그대로라 답이 됨), 영어 학습에 영어 뜻 그대로도 없음 — ja·es·en (2026-11-01 퀴즈 전수 점검)", async () => {
  const { quizGloss, rememberGlosses } = await import("./stageScripts.ts");
  const gloss = { en: "Nice to meet you.", ko: "만나서 반가워요." };
  assert.equal(quizGloss(gloss, "ja", "ja"), null);
  assert.equal(quizGloss(gloss, "es", "es"), null);
  assert.equal(quizGloss(gloss, "en", "en"), null);
  assert.equal(quizGloss(gloss, "ko", "es"), "만나서 반가워요.");
  assert.equal(quizGloss(gloss, "en", "es"), "Nice to meet you.");
  // 영어 학습·베트남어 앱인데 옮긴 표에 영어가 그대로 저장됨 → 숨김.
  rememberGlosses("vi", { "Nice to meet you.": "Nice to meet you." });
  assert.equal(quizGloss(gloss, "vi", "en"), null);
  assert.equal(quizGloss({ en: "Hello." }, "ko", "en"), null);
});

test("고르기: 문장구조·표현 오답은 그 정답의 실수 꼴만 — 다른 문제 조각으로 채우지 않음 (ko·es·ja)", () => {
  for (const language of ["ko", "es", "ja"]) {
    for (const frame of allFramesFor(language).slice(0, 40)) {
      const quiz = buildQuiz(language, `f|${frame.id}`, { stage: frame.stage, seed: "decoy" });
      for (const q of quiz?.questions ?? []) {
        if (q.kind !== "choose") continue;
        const piece = q.options[q.answer]!;
        const near = new Set(nearOf(language, `f|${frame.id}`, piece).map((one) => one.toLocaleLowerCase()));
        for (const option of q.options) if (option !== piece) assert.ok(near.has(option.toLocaleLowerCase()), `${language} ${frame.id}: ${option}`);
      }
    }
  }
});

test("여러 소재가 같이 쓰던 문장: 새 예문이 있으면 그 열쇠는 원래 문장 대신 새 예문(es·ja)", async () => {
  const { EXTRA_EXAMPLES } = await import("./examples/index.ts");
  for (const language of ["es", "ja"]) {
    const table = EXTRA_EXAMPLES[language];
    if (!table) continue;
    for (const [key, list] of Object.entries(table).slice(0, 30)) {
      const texts = quizSources(language, key).map((source) => source.text);
      for (const one of list) {
        assert.ok(!texts.includes(one.replaces), `${language} ${key}: 원래 문장이 남음`);
        assert.ok(texts.includes(one.text), `${language} ${key}: 새 예문 없음 ${one.text}`);
      }
    }
  }
});

test("표현 찾기는 낱말 속을 맞추지 않음 — ar يلا⊂قليلا · hi हाँ⊂यहाँ · es a ver⊂gustaría ver · th ใช่⊂ไม่ใช่, 한자·가나는 그대로", async () => {
  const { pieceOf } = await import("./quiz.ts");
  assert.equal(pieceOf("أريد قليلا من الماء", "يلا"), null);
  assert.equal(pieceOf("يلا، نروح", "يلا"), "يلا");
  assert.equal(pieceOf("मैं यहाँ हूँ", "हाँ"), null);
  assert.equal(pieceOf("Me gustaría ver eso", "a ver"), null);
  assert.equal(pieceOf("A ver, dime", "a ver"), "A ver");
  assert.equal(pieceOf("ไม่ใช่ครับ", "ใช่"), null);
  assert.equal(pieceOf("ใช่ครับ", "ใช่"), "ใช่");
  assert.equal(pieceOf("よろしくお願いします", "お願いします"), "お願いします");
});

test("한자가 든 답을 읽기로: 중국어 병음(성조 부호·숫자·없음) · 일본어 히라가나·로마자, 틀린 읽기는 틀림", async () => {
  const { typedRight } = await import("./quiz.ts");
  const { readingOf } = await import("./readings/index.ts");
  assert.ok(readingOf("zh", "我是"));
  assert.equal(typedRight("我是", "wo shi", { language: "zh" }), "loose");
  assert.equal(typedRight("我是", "wǒ shì", { language: "zh" }), "loose");
  assert.equal(typedRight("我是", "wo3shi4", { language: "zh" }), "loose");
  assert.equal(typedRight("我是", "ni shi", { language: "zh" }), false);
  // 성조 부호를 썼으면 성조까지(변경 감시 리뷰 2026-11-01), 不·一 변조는 봐줌.
  assert.equal(typedRight("我是", "wó shī", { language: "zh" }), false);
  const { tonedPinyinMatch } = await import("./readings/index.ts");
  assert.equal(tonedPinyinMatch("bù shì", "búshì"), true);
  assert.equal(tonedPinyinMatch("yī gè", "yí gè"), true);
  assert.equal(tonedPinyinMatch("hǎo", "hao"), null);
  const ja = readingOf("ja", "に行きます");
  assert.equal(ja, "にいきます");
  assert.equal(typedRight("に行きます", "にいきます", { language: "ja" }), "loose");
  assert.equal(typedRight("に行きます", "ni ikimasu", { language: "ja" }), "loose");
  assert.equal(typedRight("に行きます", "にきます", { language: "ja" }), false);
});

test("문장 → 소재 열쇠: 표현은 따로 선 낱말로만, 표현 그 자체는 e| (en·es·th)", async () => {
  const { expressionKeysIn, expressionKeyOf, pieceIn } = await import("./lessonKey.ts");
  assert.ok(expressionKeysIn("en", "Nice to meet you, I'm Sam.").includes("e|nice to meet you"));
  assert.equal(expressionKeyOf("es", "¡Hola!"), "e|hola");
  assert.ok(!expressionKeysIn("th", "ไม่ใช่ครับ").includes("e|ใช่"));
  assert.equal(pieceIn("en", "e|nice to meet you", "Hi, nice to meet you."), "nice to meet you");
});

test("수업 퀴즈(lessonQuiz): 세 문제가 다른 모양·다른 문장, 같은 조각 고르기로 답을 세 번 묻지 않음 — en·es·ja·th(체감 점검 2026-11-01 U25)", async () => {
  const { lessonQuiz } = await import("./quiz.ts");
  for (const [language, id, stage] of [["en", "en-f1-01", 1], ["en", "en-f1-02", 1], ["es", "es-f3-01", 3], ["es", "es-f3-02", 3], ["ja", "ja-f1-05", 1], ["th", "th-f1-01", 1]] as const) {
    const list = lessonQuiz(language, `f|${id}`, { seed: "t", stage });
    assert.ok(list.length >= 2, `${id} ${list.length}`);
    const kinds = list.map((q) => q.kind);
    assert.equal(new Set(kinds).size, kinds.length, `${id} 모양이 겹침 ${kinds}`);
    assert.ok(kinds.filter((kind) => kind === "choose").length <= 1, `${id} ${kinds}`);
    const texts = list.map((q) => ("right" in q && q.kind === "spot" ? q.right : "text" in q ? q.text : ""));
    assert.equal(new Set(texts).size, texts.length, `${id} 같은 문장 ${texts}`);
    for (const q of list) if (q.kind === "order") assert.ok(q.words.length >= 4 && q.words.every((word) => !/\s/.test(word.trim())), `${id} 순서 조각 ${q.words}`);
  }
});

test("순서 문제는 낱말 하나가 조각 하나, 일본어 ください·ございます는 가르지 않음(wordSegments) — en·ja·es", async () => {
  const { orderOf, tilesOf } = await import("./quiz.ts");
  const source = (text: string) => ({ text, gloss: { en: "" }, from: "t", stage: 1 });
  const en = orderOf("en", source("Good morning. My name is Rosa. I have a sore arm."), fixed);
  assert.ok(en?.kind === "order" && en.words.every((word) => !word.includes(" ")), JSON.stringify(en));
  assert.deepEqual(tilesOf("このパンをください。", "ja"), ["この", "パン", "を", "ください"]);
  assert.deepEqual(segmentWords("おはようございます。", "ja"), ["おはよう", "ございます"]);
  assert.deepEqual(segmentWords("ちょっと待ってください。", "ja").slice(-1), ["ください"]);
  const es = orderOf("es", source("Creo que dejé las llaves en el coche."), fixed);
  assert.ok(es?.kind === "order" && es.words.length === 8);
  // 태국어 모음 부호(\p{M})는 그대로.
  assert.ok(segmentWords("ผมชื่อแดนครับ", "th").join("").includes("ื"));
});

test("낱말 오답: 손으로 정한 실수 꼴(you → your, crimen → crímenes)이 먼저, 문장에 맞는 대안·다른 주제 낱말은 안 섞임 — en·es·ja", async () => {
  const { chooseOf, registerQuizSources, rng: seeded } = await import("./quiz.ts");
  const add = (language: string, piece: string, text: string, pos: string, topic: string) =>
    registerQuizSources(language, [{ key: `w|${piece}`, sources: [{ text, gloss: { en: "", raw: "x" }, from: `w|${piece}`, stage: 0, piece, who: "me", pos, topic }] }]);
  add("en", "you", "Do you want some coffee now?", "pron", "function");
  add("en", "I", "I am tired after work today.", "pron", "function");
  add("en", "he", "He is here.", "pron", "function");
  const you = chooseOf("en", "w|you", { text: "Do you want some coffee now?", gloss: { en: "" }, from: "", stage: 0, piece: "you", pos: "pron" }, seeded("a"));
  assert.ok(you?.kind === "choose");
  assert.deepEqual(new Set(you.options), new Set(["you", "your", "yours"]));
  const i = chooseOf("en", "w|I", { text: "I am tired after work today.", gloss: { en: "" }, from: "", stage: 0, piece: "I", pos: "pron" }, seeded("a"));
  assert.ok(i?.kind === "choose" && !i.options.some((one) => /^(your|he)$/i.test(one)), JSON.stringify(i));
  add("es", "crimen", "El crimen ocurrió en la noche del viernes.", "noun", "society");
  add("es", "cisne", "El cisne nada.", "noun", "nature");
  add("es", "consejo", "Un buen consejo.", "noun", "feelings");
  const crimen = chooseOf("es", "w|crimen", { text: "El crimen ocurrió en la noche del viernes.", gloss: { en: "" }, from: "", stage: 0, piece: "crimen", pos: "noun" }, seeded("a"));
  assert.ok(crimen?.kind === "choose" && !crimen.options.includes("cisne") && !crimen.options.includes("consejo"), JSON.stringify(crimen));
  // 주제가 같은 낱말이 둘 넘으면 그 안에서(실수 꼴이 없는 낱말).
  add("es", "zzmesa", "La zzmesa es grande.", "noun", "home");
  add("es", "zzsilla", "La zzsilla es nueva.", "noun", "home");
  add("es", "zzcama", "La zzcama es blanda.", "noun", "home");
  add("es", "zzmeta", "La zzmeta es lejos.", "noun", "sport");
  const mesa = chooseOf("es", "w|zzmesa", { text: "La zzmesa es grande.", gloss: { en: "" }, from: "", stage: 0, piece: "zzmesa", pos: "noun" }, seeded("a"));
  assert.ok(mesa?.kind === "choose" && !mesa.options.includes("zzmeta"), JSON.stringify(mesa));
  // 띄어쓰기 없는 말(일본어 ない)은 예전처럼 조각을 품은 꼴만 거름.
  add("ja", "ない", "時間がない。", "adj", "function");
  const nai = chooseOf("ja", "w|ない", { text: "時間がない。", gloss: { en: "" }, from: "", stage: 0, piece: "ない", pos: "adj" }, seeded("a"));
  assert.ok(!nai || nai.kind !== "choose" || nai.options.includes("ない"));
});

test("최근에 낸 문장은 같은 열쇠의 다음 문제에서 뒤로(noteAsked) — es·zh", async () => {
  const { noteAsked, quizSources, wordQuiz, registerQuizSources, buildQuiz } = await import("./quiz.ts");
  registerQuizSources("es", [{ key: "w|zzperro2", sources: [
    { text: "El zzperro2 come.", gloss: { en: "", raw: "x" }, from: "w|zzperro2", stage: 0, piece: "zzperro2", who: "me", pos: "noun" },
    { text: "Mi zzperro2 duerme mucho.", gloss: { en: "", raw: "y" }, from: "w|zzperro2", stage: 0, piece: "zzperro2", who: "me", pos: "noun" },
  ] }]);
  const first = wordQuiz("es", "w|zzperro2")!.questions[0] as { text: string };
  noteAsked("es", "w|zzperro2", first.text);
  const second = wordQuiz("es", "w|zzperro2")!.questions[0] as { text: string };
  assert.notEqual(second.text, first.text);
  const key = "f|zh-f1-01";
  const all = quizSources("zh", key);
  if (all.length >= 2) {
    const q1 = buildQuiz("zh", key, { seed: "z", stage: 1 })!.questions[0] as { text?: string };
    if (q1.text) {
      noteAsked("zh", key, q1.text);
      const q2 = buildQuiz("zh", key, { seed: "z", stage: 1 })!.questions[0] as { text?: string };
      assert.notEqual(q2.text, q1.text);
    }
  }
});
