import { test } from "node:test";
import assert from "node:assert/strict";
import { wordbook } from "./wordbook.ts";

const DAY = 86400000;

test("단어장: 만난 낱말(앎·배우는 중)과 저장한 단어를 한 목록으로, 문법·긴 표현은 뺌", () => {
  const known = {
    "w|casa": { days: [1, 2, 3], at: 3 * DAY },
    "u|perro": { days: [5], at: 5 * DAY },
    "g|1:0": { days: [1], at: 9 * DAY },
    "e|¿Dónde está la estación de tren?": { days: [1], at: 9 * DAY },
  };
  const rows = wordbook("es", known, [
    { word: "gato", gloss: "고양이", languageCode: "es", createdAt: 4 * DAY },
    { word: "Casa", gloss: "집", languageCode: "es", createdAt: 1 },
    { word: "dog", gloss: "개", languageCode: "en", createdAt: 1 },
  ]);
  assert.deepEqual(rows.map((row) => [row.word, row.state]), [["perro", "learning"], ["gato", "saved"], ["casa", "known"]]);
  assert.equal(rows.find((row) => row.word === "casa")!.gloss, "집");
});

test("단어장: 띄어쓰기 없는 언어 낱말도", () => {
  const rows = wordbook("ja", { "w|水": { days: [1], at: 2 }, "u|駅": { days: [1, 2, 3], at: 1 } }, [], (word) => (word === "水" ? "물" : ""));
  assert.deepEqual(rows.map((row) => [row.word, row.state, row.gloss]), [["水", "learning", "물"], ["駅", "known", ""]]);
});
