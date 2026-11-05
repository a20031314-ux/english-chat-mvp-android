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
