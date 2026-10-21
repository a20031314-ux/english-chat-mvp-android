import assert from "node:assert/strict";
import test from "node:test";
import { foreignWords } from "./vocabScript.ts";

test("학습 언어 문장에 섞인 다른 문자의 낱말", () => {
  assert.deepEqual(foreignWords("Do you want to get some 커피 later?", "en"), ["커피"]);
  assert.deepEqual(foreignWords("이따가 coffee 한잔할래요?", "ko"), ["coffee"]);
  assert.deepEqual(foreignWords("昨日、映画を見ました。", "ja"), []);
  assert.deepEqual(foreignWords("Ayer fui al mercado con mi amiga.", "es"), []);
  assert.deepEqual(foreignWords("เมื่อวานฉันไป market", "th"), ["market"]);
  assert.deepEqual(foreignWords("I went to the 市場 yesterday", "en"), ["市場"]);
});
