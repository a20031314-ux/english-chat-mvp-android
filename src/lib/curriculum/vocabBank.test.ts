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
  for (const [language, word, sentence] of [["es", "casa", "Mi casa es pequeña."], ["ja", "雨", "今日は雨が降っています。"]] as const) {
    const key = wordKey(word);
    registerQuizSources(language, [{ key, sources: [{ text: sentence, gloss: { en: "", raw: "…" }, from: key, stage: 0, piece: word, who: "me" }] }]);
    const vocab = nextStudy({ language, stage: 1, passed: new Set(), review: {}, log: {}, weakest: null, focus: "vocab", words: [key, wordKey("없음")], now: 0 });
    assert.equal(vocab.find((pick) => pick.reason === "word")?.key, key, language);
    assert.ok(!vocab.some((pick) => pick.key === wordKey("없음")), "재료 없는 낱말은 안 냄");
    const auto = nextStudy({ language, stage: 1, passed: new Set(), review: {}, log: {}, weakest: "grammar", words: [key], now: 0 });
    const at = auto.findIndex((pick) => pick.reason === "word");
    assert.ok(at < 0 || auto.slice(0, at).every((pick) => pick.reason !== "new"), `${language}: 곧 나옴보다 앞`);
  }
});
