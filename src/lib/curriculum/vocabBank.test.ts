import { test } from "node:test";
import assert from "node:assert/strict";
import { BANK_LANGS, hasBank, loadBank, wordKey } from "./vocabBank.ts";
import { nextStudy } from "./nextStudy.ts";
import { registerQuizSources } from "./quiz.ts";

test("빈도 단어 묶음: 영어·스페인어·일본어 약 3,000개, 겹침 없음, 일본어는 히라가나 읽기", async () => {
  for (const language of BANK_LANGS) {
    const list = await loadBank(language);
    assert.ok(list.length >= 2900 && list.length <= 3000, `${language} ${list.length}`);
    assert.equal(new Set(list.map((word) => word.w)).size, list.length, language);
    if (language === "ja") assert.ok(list.every((word) => word.reading && /^[ぁ-ゖー]+$/u.test(word.reading)), "ja reading");
  }
  assert.equal(hasBank("th"), false);
  assert.deepEqual(await loadBank("th"), []);
});

test("계속 공부: 새 낱말(w|)은 어휘 갈래면 막힌 것 다음, 알아서면 부족한 갈래 다음 — 재료가 있을 때만(스페인어·일본어)", () => {
  // 단어 빈칸 보기는 같은 품사의 다른 낱말이라(quiz.ts decoys, 2026-10-30) 같은 품사 낱말을 둘 더 받아 둔다.
  const others: Record<string, [string, string][]> = { es: [["perro", "El perro come."], ["agua", "Quiero agua."]], ja: [["本", "本を読みます。"], ["駅", "駅に行きます。"]] };
  for (const [language, word, sentence] of [["es", "casa", "Mi casa es pequeña."], ["ja", "雨", "今日は雨が降っています。"]] as const) {
    const key = wordKey(word);
    registerQuizSources(language, [
      { key, sources: [{ text: sentence, gloss: { en: "", raw: "…" }, from: key, stage: 0, piece: word, who: "me", pos: "noun" }] },
      ...others[language]!.map(([w, text]) => ({ key: wordKey(w), sources: [{ text, gloss: { en: "", raw: "…" }, from: wordKey(w), stage: 0, piece: w, who: "me" as const, pos: "noun" }] })),
    ]);
    const vocab = nextStudy({ language, stage: 1, passed: new Set(), review: {}, log: {}, weakest: null, focus: "vocab", words: [key, wordKey("없음")], now: 0 });
    assert.equal(vocab.find((pick) => pick.reason === "word")?.key, key, language);
    assert.ok(!vocab.some((pick) => pick.key === wordKey("없음")), "재료 없는 낱말은 안 냄");
    const auto = nextStudy({ language, stage: 1, passed: new Set(), review: {}, log: {}, weakest: "grammar", words: [key], now: 0 });
    const at = auto.findIndex((pick) => pick.reason === "word");
    assert.ok(at < 0 || auto.slice(0, at).every((pick) => pick.reason !== "new"), `${language}: 곧 나옴보다 앞`);
  }
});

test("낱말 나누기: 단계 · 품사 묶음 · 주제 — 고른 칸만", async () => {
  const { inPick, groupsOf, posGroup } = await import("./vocabBank.ts");
  const list = [
    { w: "casa", pos: "noun", topic: "home", stage: 1 },
    { w: "comer", pos: "verb", topic: "food", stage: 1 },
    { w: "de", pos: "prep", topic: "function", stage: 2 },
  ];
  assert.equal(posGroup("prep"), "function");
  assert.deepEqual(groupsOf(list, "pos"), ["noun", "verb", "function"]);
  assert.deepEqual(groupsOf(list, "topic"), ["food", "home", "function"]);
  assert.equal(inPick(list[1]!, 1, { by: "topic", value: "food" }), true);
  assert.equal(inPick(list[0]!, 0, { by: "pos", value: "verb" }), false);
  assert.equal(inPick(list[2]!, 700, { by: "stage", value: "2" }), true);
  assert.equal(inPick(list[2]!, 700, { by: "stage", value: "" }), true, "단계 칸을 안 고르면 전체");
  assert.equal(inPick(list[2]!, 700, { by: "all", value: "" }), true);
  assert.deepEqual(groupsOf(list, "stage"), ["1", "2"]);
  assert.deepEqual(groupsOf(list, "stage", 1), ["1"], "내 단계까지만");
});

test("낱말 단계: 언어별 필수 범위로 순위 → 단계, 대본에서 배우면 당김, 뒤는 확장(영어·일본어·중국어·한국어)", async () => {
  const { stageOfRank, wordStage, stageCuts } = await import("./vocabBank.ts");
  assert.deepEqual(stageCuts("en"), [700, 1500, 2500, 3500, 5000]);
  assert.deepEqual(stageCuts("ja"), [800, 1500, 2500, 3750, 6000]);
  assert.deepEqual(stageCuts("zh"), [500, 1000, 2000, 3600, 5400]);
  assert.deepEqual(stageCuts("ko"), [500, 1000, 2000, 3100, 6000]);
  assert.equal(stageOfRank("en", 0), 1);
  assert.equal(stageOfRank("en", 699), 1);
  assert.equal(stageOfRank("en", 700), 2);
  assert.equal(stageOfRank("ja", 799), 1);
  assert.equal(stageOfRank("zh", 500), 2);
  assert.equal(stageOfRank("en", 5000), 6);
  const taught = new Map([["coffee", 1]]);
  assert.equal(wordStage("en", { w: "coffee", pos: "noun" }, 2000, taught), 1, "대본 1단계에 나오면 당김");
  assert.equal(wordStage("en", { w: "ornitorrinco", pos: "noun", stage: 5 }, 10, taught), 5, "더한 낱말은 판정 그대로");
  const ja = await loadBank("ja");
  assert.equal(ja.length > 0 && stageOfRank("ja", ja.length - 1) >= 4, true);
});
