import { test } from "node:test";
import assert from "node:assert/strict";
import { learnerLanguages } from "./learnerLanguages.ts";
import { grammarIndex, knownSlotWeight } from "./languagePairs.ts";
import { pickPrepared, type PreparedItem } from "./preparedQuiz.ts";
import { grammarList } from "../roleplay/talkTags.ts";

test("학습자의 언어: 프로필 모국어 → 국적 → 앱 언어, 아는 언어 = 모국어 + 할 수 있는 언어", () => {
  assert.deepEqual(learnerLanguages({ native: "es", country: "KR", speaks: ["en"] }, "ko"), { native: "es", known: ["es", "en"], from: "native" });
  assert.deepEqual(learnerLanguages({ native: null, country: "MX", speaks: [] }, "en"), { native: "es", known: ["es"], from: "country" });
  assert.deepEqual(learnerLanguages({ native: null, country: "CH", speaks: [] }, "fr"), { native: "fr", known: ["fr"], from: "app" }, "여러 말을 쓰는 나라는 앱 언어로");
  assert.deepEqual(learnerLanguages(null, "ja"), { native: "ja", known: ["ja"], from: "app" }, "로그인 안 함");
  assert.equal(learnerLanguages({ native: "xx", country: null, speaks: ["yy"] }, "pt-BR").native, "pt", "모르는 말은 건너뜀");
});

test("아는 언어 여럿: 그 개념을 아는 언어가 있으면 가볍게 (한국어 + 스페인어 → 영어 관사 0.8, 한국어만 1.5, 성까지 든 칸은 그대로)", () => {
  const article = "g|" + grammarList("en")[2]!.id;
  assert.match(grammarList("en")[2]!.name, /a \/ an \/ the/);
  assert.equal(grammarIndex("en", article), 2);
  assert.equal(knownSlotWeight(["ko"], "en", article), 1.5);
  assert.equal(knownSlotWeight(["ko", "es"], "en", article), 0.8);
  const gendered = "g|" + grammarList("es")[4]!.id; // el/la — 관사 + 성
  assert.equal(knownSlotWeight(["ko", "en"], "es", gendered), 1.5, "영어로 관사는 알지만 성은 처음");
  assert.equal(knownSlotWeight(["ko", "fr"], "es", gendered), 0.8);
  assert.equal(knownSlotWeight([], "es", gendered), 1);
  assert.equal(knownSlotWeight(["ko"], "es", "w|casa"), 1, "문법 열쇠가 아니면 1");
});

test("넣어 둔 문법 고르기: 같은 단계 안에서 무거운 칸부터 (es → ja: の가 か보다 먼저)", () => {
  const item = (key: string): PreparedItem => ({ key, kind: "grammar", stage: 1, gloss: "x", before: "", after: "", answer: "a", options: ["a", "b"], line: "a", why: "x" });
  const ja = grammarList("ja");
  const question = "g|" + ja[1]!.id; // か로 묻기 — 특징 없음
  const possession = "g|" + ja[3]!.id; // の — 조사
  const items = [item(question), item(possession)];
  assert.deepEqual(pickPrepared(items, { stage: 1 }).map((one) => one.key), [question], "비중 없으면 원래 차례");
  assert.deepEqual(pickPrepared(items, { stage: 1, weight: (key) => knownSlotWeight(["es"], "ja", key) }).map((one) => one.key), [possession]);
  assert.deepEqual(pickPrepared(items, { stage: 1, weight: (key) => knownSlotWeight(["ko"], "ja", key) }).map((one) => one.key), [question], "한국어권은 조사가 가벼워서 원래 차례");
});
