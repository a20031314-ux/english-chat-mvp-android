import assert from "node:assert/strict";
import test from "node:test";
import { isLangMatch, langMatches, type MyLangs } from "./langMatch.ts";

// 일본어를 배우는 한국인(앱은 한국어).
const koLearningJa: MyLangs = { current: "ja", native: "ko", learns: ["ja"], speaks: ["ko", "en"] };

test("같은 언어를 배우는 사람: 나라·모국어 상관없이 내가 지금 배우는 언어를 배우면", () => {
  assert.equal(langMatches("learn", { learns: ["ja", "zh"], speaks: ["pt"] }, koLearningJa), true);
  assert.equal(langMatches("learn", { learns: ["th"], speaks: ["ko"] }, koLearningJa), false);
  // 아랍어 커뮤니티: 스페인어 사용자도 영어 사용자도 아랍어를 배우면 같이.
  const esLearningAr: MyLangs = { current: "ar", native: "es", learns: ["ar"], speaks: ["es"] };
  assert.equal(langMatches("learn", { learns: ["ar"], speaks: ["en"] }, esLearningAr), true);
});

test("배우는 언어·쓰는 말이 같은 사람: 일본어를 배우면서 내 모국어(한국어)를 쓰는 사람만", () => {
  assert.equal(langMatches("both", { learns: ["ja"], speaks: ["ko"] }, koLearningJa), true);
  assert.equal(langMatches("both", { learns: ["ja"], speaks: ["en"] }, koLearningJa), false, "영어는 내가 할 수 있지만 모국어가 아니다");
  assert.equal(langMatches("both", { learns: ["zh"], speaks: ["ko"] }, koLearningJa), false);
  // 모국어를 안 정했으면 내가 쓰는 말 중 하나라도.
  const noNative: MyLangs = { current: "th", native: null, learns: ["th"], speaks: ["vi"] };
  assert.equal(langMatches("both", { learns: ["th"], speaks: ["vi", "en"] }, noNative), true);
  assert.equal(langMatches("both", { learns: ["th"], speaks: [] }, noNative), false);
});

test("내 언어를 배우는 사람: 상대가 배우는 언어에 내가 쓰는 말이 있으면(언어 교환 짝)", () => {
  assert.equal(langMatches("partners", { learns: ["ko"], speaks: ["ja"] }, koLearningJa), true);
  assert.equal(langMatches("partners", { learns: ["fr", "en"], speaks: ["es"] }, koLearningJa), true);
  assert.equal(langMatches("partners", { learns: ["ja"], speaks: ["zh"] }, koLearningJa), false);
});

test("칩 이름 확인", () => {
  assert.equal(isLangMatch("both"), true);
  assert.equal(isLangMatch("same"), false);
  assert.equal(isLangMatch(undefined), false);
});
