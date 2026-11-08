import { test } from "node:test";
import assert from "node:assert/strict";
import { pairSummary, PROFILES, slotTags, slotTagSize, slotWeight } from "./languagePairs.ts";
import { grammarList } from "../roleplay/talkTags.ts";

const at = (language: string, id: string) => grammarList(language).findIndex((one) => one.id === id);

test("언어 조합: 모국어에 없는 개념은 무겁게, 같은 건 가볍게 (es→ja 조사 · ko→ja 조사 · ja→en 관사 · es→en 관사 · zh→th 양사 아님)", () => {
  assert.equal(slotWeight("es", "ja", at("ja", "1:3")), 1.5, "の");
  assert.equal(slotWeight("ko", "ja", at("ja", "1:3")), 0.8);
  assert.equal(slotWeight("ja", "en", at("en", "1:2")), 1.5, "a / an / the");
  assert.equal(slotWeight("es", "en", at("en", "1:2")), 0.8);
  assert.equal(slotWeight("en", "zh", at("zh", "1:4")), 1.5, "양사 个");
  assert.equal(slotWeight("ja", "zh", at("zh", "1:4")), 0.8);
  assert.equal(slotWeight("ko", "es", at("es", "1:4")), 1.5, "el/la");
  assert.equal(slotWeight("ja", "ja", at("ja", "1:3")), 1, "같은 언어");
  assert.equal(slotWeight("es", "zh", at("zh", "2:2")), 1, "같은 어순(SVO)");
  assert.equal(slotWeight("ko", "zh", at("zh", "2:2")), 1.3, "어순이 다름(SOV → SVO)");
  assert.match(grammarList("es")[23]!.name, /subjunctive/i);
  assert.equal(slotWeight("en", "es", 23), 1.25, "접속법: 영어엔 약하게만");
});

test("언어 조합: 요약 (es→ja 처음 보는 것 · zh→ja 한자 글자는 아는 셈)", () => {
  const esJa = pairSummary("es", "ja")!;
  assert.ok(esJa.fresh.includes("particle") && esJa.fresh.includes("classifier"));
  assert.equal(esJa.sameOrder, false);
  assert.equal(pairSummary("zh", "ja")!.sameScript, true);
});

test("언어 조합: 14개 언어 특징표 · 칸 붙임이 사다리 칸 수와 맞고, 붙인 번호가 사다리 안", () => {
  for (const language of ["ko", "ja", "zh", "th", "vi", "id", "hi", "ar", "ru", "es", "fr", "it", "pt", "en"]) {
    assert.ok(PROFILES[language], language);
    const size = grammarList(language).length;
    assert.equal(slotTagSize(language), size, `${language}: 사다리 칸 수가 바뀜 — SLOT_TAGS를 다시 보기`);
    for (let i = 0; i < size; i += 1) slotTags(language, i);
  }
});
