import { test } from "node:test";
import assert from "node:assert/strict";
import { acceptDecoy, acceptItem, applyResults, emptyEntry, GROW_EVERY, needGrow, publicView, RETIRE_AFTER, type BankEntry } from "./qbankRules.ts";
import { registerGrown, grownDecoys, grownItems, growBank } from "./qbank.ts";
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
    // 줄은 모두 있고, 그럴듯한 실수 꼴이 없는 표현(한 낱말 인사 등)은 비움 — 2026-11-01 오답 표 정리. 대부분은 2개 넘게.
    const all = ladderFor(language)!.stages.flatMap((stage) => stage.expressions);
    for (const expression of all) assert.ok(Array.isArray(table![expression]) && table![expression]!.length <= 4, `${language} ${expression}`);
    const enough = all.filter((expression) => table![expression]!.length >= 2).length;
    assert.ok(enough / all.length >= 0.75, `${language} ${enough}/${all.length}`);
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

test("받은 문제은행은 이 폰에 남아 다음에 첫 문제부터 쓰인다(qbank.v1.<언어>)", async () => {
  const store = new Map<string, string>();
  const fake = { getItem: (k: string) => store.get(k) ?? null, setItem: (k: string, v: string) => void store.set(k, v) };
  (globalThis as { localStorage?: unknown }).localStorage = fake;
  // 앞서 저장해 둔 것: 메모리에 없어도 읽힌다.
  store.set("qbank.v1.it", JSON.stringify({ "w|zzcasa": { items: [{ text: "La casa è grande.", piece: "casa", stage: 1, gloss: { en: "The house is big." } }], decoys: { casa: ["case"] }, at: 1 } }));
  assert.equal(grownItems("it", "w|zzcasa")[0]?.text, "La casa è grande.");
  assert.deepEqual(grownDecoys("it", "w|zzcasa", "casa"), ["case"]);
  // 서버에서 새로 받은 것도 저장된다.
  const realFetch = globalThis.fetch;
  globalThis.fetch = (async () =>
    new Response(JSON.stringify({ banks: { "w|zzgato": { items: [{ text: "El gato duerme.", piece: "gato", gloss: "The cat sleeps.", uiGloss: "猫が寝ている。", stage: 1 }], decoys: { gato: ["gata"] } } } }), { status: 200 })) as typeof fetch;
  try {
    await growBank("es", "ja", [{ key: "w|zzgato", stage: 1 }]);
  } finally {
    globalThis.fetch = realFetch;
  }
  const saved = JSON.parse(store.get("qbank.v1.es") ?? "{}");
  assert.equal(saved["w|zzgato"].items[0].text, "El gato duerme.");
  assert.equal(saved["w|zzgato"].gl.ja["The cat sleeps."], "猫が寝ている。");
  delete (globalThis as { localStorage?: unknown }).localStorage;
});

test("고정(frozen)이면 너무 쉬운 예문·안 골리는 오답을 빼지 않고, 이상한 예문만 뺀다", () => {
  const entry: BankEntry = {
    ...emptyEntry(),
    items: [
      { t: "easy one", p: "one", g: "", s: 1, n: 0, r: 0 },
      { t: "odd one", p: "one", g: "", s: 1, n: 0, r: 0 },
    ],
    decoys: { one: [{ d: "won", n: 40, k: 0 }, { d: "ones", n: 0, k: 0 }, { d: "oned", n: 0, k: 0 }] },
  };
  const results = Array.from({ length: RETIRE_AFTER }, () => [
    { text: "easy one", correct: true, options: ["one", "won"], picked: "one" },
    { text: "odd one", correct: false },
  ]).flat();
  const frozen = applyResults(entry, results, { frozen: true });
  assert.equal(frozen.items.find((item) => item.t === "easy one")?.off, undefined);
  assert.equal(frozen.items.find((item) => item.t === "odd one")?.off, "odd");
  assert.equal(frozen.decoys.one?.length, 3);
  const live = applyResults(entry, results);
  assert.equal(live.items.find((item) => item.t === "easy one")?.off, "easy");
  assert.equal(live.decoys.one?.length, 2);
});
