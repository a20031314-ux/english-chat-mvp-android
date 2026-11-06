import assert from "node:assert/strict";
import { test } from "node:test";
import { parseSenses } from "./wordSenses.ts";

test("여러 뜻: 빈 뜻·같은 뜻은 버리고, 예문은 그 낱말을 담고 숫자가 없을 때만, 넷까지 (일본어·스페인어)", () => {
  const ja = parseSenses({ senses: [
    { gloss: "올라가다", pos: "verb", example: "二階に上がって。", exampleGloss: "2층으로 올라가." },
    { gloss: "오르다(값)", pos: "Verb", example: "値段が3倍に上がった。", exampleGloss: "" },
    { gloss: "", pos: "noun" },
    { gloss: "올라가다", pos: "verb" },
  ] }, "上がる");
  assert.equal(ja.length, 2);
  assert.equal(ja[0]!.example, "二階に上がって。");
  assert.equal(ja[1]!.example, undefined);
  assert.equal(ja[1]!.pos, "verb");
  const es = parseSenses({ senses: [{ gloss: "banco (돈)", pos: "noun", example: "Voy al banco.", exampleGloss: "은행에 가." }, { gloss: "벤치", pos: "adjective", example: "Me senté en un sillón." }, { gloss: "a" }, { gloss: "b" }, { gloss: "c" }] }, "banco");
  assert.equal(es.length, 4);
  assert.equal(es[1]!.pos, "adj");
  assert.equal(es[1]!.example, undefined);
  assert.deepEqual(parseSenses(null, "x"), []);
});
