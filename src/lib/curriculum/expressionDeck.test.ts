import assert from "node:assert/strict";
import { test } from "node:test";
import { deckExpressions, isFrameExpression, nextExpressions } from "./expressionDeck.ts";
import { expressionCardOk } from "../server/expressionCards.ts";

test("문장구조와 같은 표현은 빠지고 덩어리 표현만 남는다(en·ja·es)", () => {
  // 틀에서 빈칸만 뺀 말 · 틀을 채운 꼴은 문장구조 쪽.
  assert.equal(isFrameExpression("en", "are you free on"), true);
  assert.equal(isFrameExpression("en", "how was your weekend"), true);
  // 틀의 일부일 뿐인 덩어리·틀 없는 덩어리는 표현으로 남는다.
  assert.equal(isFrameExpression("en", "by the way"), false);
  assert.equal(isFrameExpression("en", "last night"), false);
  for (const language of ["en", "ja", "es", "th", "ar"]) {
    const deck = deckExpressions(language, 5);
    assert.ok(deck.length >= 40, `${language} ${deck.length}`);
    assert.ok(deck.every((one) => one.key === `e|${one.text}` && one.stage >= 1 && one.stage <= 5));
    // 단계 순.
    assert.deepEqual(deck.map((one) => one.stage), [...deck.map((one) => one.stage)].sort((a, b) => a - b));
    assert.equal(new Set(deck.map((one) => one.key)).size, deck.length);
  }
  assert.ok(deckExpressions("en", 1).every((one) => one.stage === 1));
});

test("다음 표현: 본 것·카드 없는 것·방금 낸 것은 건너뜀", () => {
  const deck = deckExpressions("en", 2);
  const [a, b, c] = deck.map((one) => one.key);
  const next = nextExpressions(deck, { seen: (key) => key === a, ready: (key) => key !== b, skip: new Set() });
  assert.deepEqual(next, [c]);
});

test("표현 카드 검사: 예문에 표현이 따로 서 있고 뜻이 있어야(ja·es)", () => {
  const ok = { w: "por favor", piece: "por favor", example: "Un café, por favor.", gloss: "please", exampleGloss: "A coffee, please." };
  assert.equal(expressionCardOk("es", ok), true);
  assert.equal(expressionCardOk("es", { ...ok, gloss: "por favor" }), false);
  assert.equal(expressionCardOk("es", { ...ok, example: "Un café, gracias." }), false);
  assert.equal(expressionCardOk("ja", { w: "よろしく", piece: "よろしく", example: "これからよろしくね。", gloss: "nice to work with you", exampleGloss: "Looking forward to working with you." }), true);
});

test("nextExpressions from: 첫 측정 표현 단계부터, 아래 단계는 위를 다 낸 뒤(2026-11-09 es 5단계에 hola)", () => {
  const deck = [
    { key: "e|hola", text: "hola", stage: 1 },
    { key: "e|gracias", text: "gracias", stage: 1 },
    { key: "e|a lo mejor", text: "a lo mejor", stage: 4 },
    { key: "e|por lo visto", text: "por lo visto", stage: 5 },
  ];
  const all = { seen: () => false, ready: () => true };
  assert.deepEqual(nextExpressions(deck, all), ["e|hola"]);
  assert.deepEqual(nextExpressions(deck, { ...all, from: 5 }), ["e|por lo visto"]);
  assert.deepEqual(nextExpressions(deck, { ...all, from: 4, n: 3 }), ["e|a lo mejor", "e|por lo visto", "e|hola"]);
  // 띄어쓰기 없는 언어도 단계만 봄
  const ja = [{ key: "e|こんにちは", text: "こんにちは", stage: 1 }, { key: "e|よろしくお願いします", text: "よろしくお願いします", stage: 3 }];
  assert.deepEqual(nextExpressions(ja, { ...all, from: 3 }), ["e|よろしくお願いします"]);
  assert.deepEqual(nextExpressions(ja, { ...all, from: 3, seen: (key) => key === "e|よろしくお願いします" }), ["e|こんにちは"]);
});
