import assert from "node:assert/strict";
import test from "node:test";
import { sentenceFitsLanguage } from "./sentenceFits.ts";

test("일본어 노트에 가나 없는 중국어 문장은 안 넣는다", () => {
  assert.equal(sentenceFitsLanguage("思路還是就是上了一次反正最後進下一進下一確實這個不管是提的深度啊", "ja"), false);
  assert.equal(sentenceFitsLanguage("例えば、アニメとかマンガを見たり聴いたりするのも楽しいよ！", "ja"), true);
  assert.equal(sentenceFitsLanguage("最近", "ja"), true);
});

test("중국어 노트에 일본어 문장은 안 넣는다", () => {
  assert.equal(sentenceFitsLanguage("今日は駅の近くでラーメンを食べました。", "zh"), false);
  assert.equal(sentenceFitsLanguage("我昨天去了图书馆。", "zh"), true);
});

test("다른 언어는 글자 검사 그대로", () => {
  assert.equal(sentenceFitsLanguage("Ayer fui a la playa.", "es"), true);
  assert.equal(sentenceFitsLanguage("เมื่อวานฉันไปตลาด", "th"), true);
  assert.equal(sentenceFitsLanguage("어제 시장에 갔어요", "es"), false);
});
