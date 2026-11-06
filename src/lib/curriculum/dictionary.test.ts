import assert from "node:assert/strict";
import { test } from "node:test";
import { searchDictionary, type DictEntry } from "./dictionary.ts";

const entries: DictEntry[] = [
  { word: "time", pos: "noun", stage: 1, gloss: "시간" },
  { word: "sometimes", pos: "adv", stage: 2, gloss: "가끔" },
  { word: "学校", pos: "noun", reading: "がっこう", stage: 1, gloss: "학교" },
  { word: "perro", pos: "noun", stage: 1, gloss: "개" },
  { word: "ดี", pos: "adj", stage: 1 },
  { word: "ดู", pos: "verb", stage: 1 },
];

test("앞부분이 맞는 낱말이 먼저고, 뜻과 읽기로도 찾는다", () => {
  assert.deepEqual(searchDictionary(entries, "time").map((one) => one.word), ["time", "sometimes"]);
  assert.deepEqual(searchDictionary(entries, "학교").map((one) => one.word), ["学校"]);
  assert.deepEqual(searchDictionary(entries, "がっ").map((one) => one.word), ["学校"]);
  assert.deepEqual(searchDictionary(entries, "perr").map((one) => one.word), ["perro"]);
});

test("태국어 성조를 떼지 않아 ดี와 ดู는 다른 말이다", () => {
  assert.deepEqual(searchDictionary(entries, "ดี").map((one) => one.word), ["ดี"]);
  assert.deepEqual(searchDictionary(entries, "ดู").map((one) => one.word), ["ดู"]);
  assert.deepEqual(searchDictionary(entries, ""), []);
});

test("사전 예문 → 퀴즈 재료: 빈칸 조각이 문장에 그대로 든 것만, 셋까지 (띄어쓰기 없는 말·라틴 언어)", async () => {
  const { dictLinesOf } = await import("./wordSentencesLoad.ts");
  const book = {
    "w|猫": [
      { text: "猫が窓のそばで寝ている。", en: "The cat is sleeping by the window.", ko: "고양이가 창가에서 자고 있어요.", blank: "猫" },
      { text: "犬が好きです。", en: "I like dogs.", ko: "개를 좋아해요.", blank: "猫" },
    ],
    "w|comprar": [
      { text: "Ayer compré pan.", en: "I bought bread yesterday.", ko: "어제 빵을 샀어요.", blank: "compré" },
      { text: "Quiero comprar flores.", en: "I want to buy flowers.", ko: "꽃을 사고 싶어요." },
      { text: "Vamos a comprar.", en: "Let's buy.", ko: "사러 가자.", blank: "comprar" },
      { text: "Compramos todo.", en: "We bought everything.", ko: "다 샀어요.", blank: "Compramos" },
    ],
  };
  assert.deepEqual(dictLinesOf(book, "猫").map((line) => line.text), ["猫が窓のそばで寝ている。"]);
  const es = dictLinesOf(book, "comprar");
  assert.equal(es.length, 3);
  assert.deepEqual(es.map((line) => line.piece), ["compré", "comprar", "comprar"]);
  assert.deepEqual(dictLinesOf(null, "comprar"), []);
});
