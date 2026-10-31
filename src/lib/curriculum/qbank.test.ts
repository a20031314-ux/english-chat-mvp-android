import { test } from "node:test";
import assert from "node:assert/strict";
import { acceptDecoy, acceptItem, applyResults, emptyEntry, GROW_EVERY, needGrow, publicView, RETIRE_AFTER, type BankEntry } from "./qbankRules.ts";
import { registerGrown, grownDecoys } from "./qbank.ts";
import { buildQuiz, mostAlike, quizSources, typedRight, wordQuiz, registerQuizSources } from "./quiz.ts";
import { EXPR_DECOYS } from "./expressions/decoys/index.ts";
import { ladderFor } from "./stages/index.ts";

const day = "2026-10-30";

test("문제은행 성장: 처음엔 바로, 풀린 수가 늘면 다시, 하루 세 번까지", () => {
  const empty = emptyEntry();
  assert.equal(needGrow(empty, day), true);
  const grown: BankEntry = { ...empty, items: [{ t: "Quiero agua.", p: "Quiero", g: "I want water.", s: 1, n: 0, r: 0 }], decoys: { Quiero: [{ d: "Quero", n: 0, k: 0 }, { d: "Quieres", n: 0, k: 0 }] }, served: 0, grownAt: 0, day, dayGrows: 1 };
  assert.equal(needGrow(grown, day), false);
  assert.equal(needGrow({ ...grown, served: GROW_EVERY }, day), true);
  assert.equal(needGrow({ ...grown, served: GROW_EVERY, dayGrows: 3 }, day), false);
  assert.equal(needGrow({ ...grown, served: GROW_EVERY, dayGrows: 3 }, "2026-10-31"), true, "다음 날은 다시");
});

test("문제은행 도태: 너무 쉬운 예문·아무도 안 고르는 오답은 빠짐, 빠지면 다시 키움", () => {
  let entry: BankEntry = { ...emptyEntry(), items: [{ t: "A", p: "a", g: "a", s: 1, n: 0, r: 0 }, { t: "B", p: "b", g: "b", s: 1, n: 0, r: 0 }], decoys: { a: [{ d: "x", n: 0, k: 0 }, { d: "y", n: 0, k: 0 }, { d: "z", n: 0, k: 0 }] }, day, dayGrows: 1 };
  const results = Array.from({ length: RETIRE_AFTER + 10 }, (_, i) => ({ text: "A", correct: true, options: ["a", "x", "y"], picked: i % 3 === 0 ? "y" : "a" }));
  entry = applyResults(entry, results);
  assert.equal(entry.items.find((item) => item.t === "A")?.off, "easy");
  assert.ok(!entry.decoys.a!.some((d) => d.d === "x"), "x는 한 번도 안 골림 → 빠짐");
  assert.ok(entry.decoys.a!.some((d) => d.d === "y"), "y는 남음");
  assert.equal(publicView(entry).items.map((item) => item.text).join(), "B");
  assert.equal(needGrow(entry, day), true, "오답이 둘보다 적으면 다시 키움");
});

test("받을 예문·오답: 조각을 담고 숫자 없음, 오답은 정답을 품지 않음(스페인어·일본어)", () => {
  const entry = emptyEntry();
  assert.equal(acceptItem(entry, "Quiero un café.", "Quiero", new Set()), true);
  assert.equal(acceptItem(entry, "Tengo 2 gatos.", "Tengo", new Set()), false);
  assert.equal(acceptItem(entry, "水をください。", "をください", new Set()), true);
  assert.equal(acceptItem(entry, "水がほしい。", "をください", new Set()), false);
  assert.equal(acceptDecoy("をください", "にください", []), true);
  assert.equal(acceptDecoy("Quiero", "Quieroo", []), false);
});

test("앱 쪽: 등록한 오답·예문이 퀴즈에 쓰이고, 쓰기 채점은 대소문자·문장부호·악센트 빠짐을 봐줌", () => {
  registerQuizSources("es", [{ key: "w|zzperro", sources: [{ text: "El perro come.", gloss: { en: "The dog eats." }, from: "w|zzperro", stage: 1, piece: "perro", who: "me", wordGloss: "개", pos: "noun" }] }]);
  registerGrown("es", "w|zzperro", { items: [{ text: "Mi perro es grande.", piece: "perro", stage: 1, gloss: { en: "My dog is big." } }], decoys: { perro: ["pera", "perra", "perros"] } });
  assert.equal(quizSources("es", "w|zzperro").length, 2);
  assert.deepEqual(grownDecoys("es", "w|zzperro", "Perro"), ["Pera", "Perra", "Perros"]);
  const quiz = wordQuiz("es", "w|zzperro", "s");
  const choose = quiz?.questions.find((q) => q.kind === "choose");
  assert.ok(choose && choose.kind === "choose" && choose.options.filter((o) => o !== "perro").every((o) => ["pera", "perra", "perros"].includes(o)), JSON.stringify(choose));
  assert.equal(typedRight("Me llamo", "me llamo"), "exact");
  assert.equal(typedRight("café", "cafe"), "loose");
  assert.equal(typedRight("をください", "を ください"), "exact");
  assert.equal(typedRight("ขอบคุณ", "ขอบคน"), false, "태국어 모음 부호는 지우지 않음");
  assert.equal(typedRight("perro", ""), false);
});

test("닮은 보기 고르기·표현 오답 데이터: 14개 언어 모든 단계 표현에 2~4개, 빈칸 쓰기 문제가 나옴", () => {
  assert.deepEqual(mostAlike("casa", ["perro", "cosa", "caso", "árbol"], 2).sort(), ["caso", "cosa"]);
  for (const language of ["ja", "ko", "es", "zh", "en", "id", "vi", "th", "fr", "it", "pt", "ru", "ar", "hi"]) {
    const table = EXPR_DECOYS[language];
    assert.ok(table, language);
    for (const stage of ladderFor(language)!.stages) for (const expression of stage.expressions) assert.ok((table![expression]?.length ?? 0) >= 2, `${language} ${expression}`);
  }
  const expression = ladderFor("es")!.stages[0]!.expressions.find((e) => buildQuiz("es", `e|${e}`, { kinds: ["type", "choose", "type"], stage: 1 }));
  const quiz = buildQuiz("es", `e|${expression}`, { kinds: ["type", "choose", "type"], stage: 1 });
  assert.ok(quiz?.questions.some((q) => q.kind === "type"), JSON.stringify(quiz?.questions.map((q) => q.kind)));
});

test("단어 찾기: 찾는 말 다듬기 — 문장부호·대소문자, 세 낱말 넘거나 숫자면 안 받음(스페인어·일본어·태국어)", async () => {
  const { normalizeQuery } = await import("../server/wordExtras.ts");
  assert.equal(normalizeQuery("es", "  ¡Perro! "), "perro");
  assert.equal(normalizeQuery("ja", "「猫」"), "猫");
  assert.equal(normalizeQuery("th", "แมว"), "แมว");
  assert.equal(normalizeQuery("th", "ตุ่นปากเป็ด"), "ตุ่นปากเป็ด", "태국어 합성어는 글자 수로");
  assert.equal(normalizeQuery("en", "a very long phrase here"), null);
  assert.equal(normalizeQuery("en", "abc123"), null);
  assert.equal(normalizeQuery("en", ""), null);
});
