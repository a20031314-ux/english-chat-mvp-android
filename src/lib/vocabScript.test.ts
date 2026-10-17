import { test } from "node:test";
import assert from "node:assert/strict";
import { inLearningScript } from "./vocabScript.ts";

test("단어장 표제어는 학습 언어 문자로", () => {
  // id 학습·zh 앱에서 검색어 '累'가 그대로 돌아오던 것(가상 사용자 2026-10-18)
  assert.equal(inLearningScript("累", "id"), false);
  assert.equal(inLearningScript("lelah", "id"), true);
  assert.equal(inLearningScript("mệt", "vi"), true);
  // 중국어 학습은 한자만으로 통과해야 한다(고친 첫 판에서 전부 버려졌던 것)
  assert.equal(inLearningScript("累", "zh"), true);
  assert.equal(inLearningScript("疲惫", "zh"), true);
  assert.equal(inLearningScript("疲れる", "zh"), false);
  // 일본어 학습은 한자·가나 둘 다
  assert.equal(inLearningScript("累", "ja"), true);
  assert.equal(inLearningScript("疲れる", "ja"), true);
  assert.equal(inLearningScript("เหนื่อย", "th"), true);
  assert.equal(inLearningScript("피곤tired", "ko"), false);
  assert.equal(inLearningScript("tired", "en"), true);
});
