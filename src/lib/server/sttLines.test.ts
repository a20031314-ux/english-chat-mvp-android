import { test } from "node:test";
import assert from "node:assert/strict";
import { tokensToLines, type ScribeToken } from "./sttProviders.ts";

const w = (text: string, start: number, end: number): ScribeToken => ({ text, start, end, kind: "word", confidence: 0.9 });
const sp = (start: number): ScribeToken => ({ text: " ", start, end: start, kind: "spacing", confidence: null });

test("영상 받아쓰기 줄 나누기: 스페인어는 띄어쓰기 그대로, 문장 끝에서 끊고 오프셋을 더함", () => {
  const lines = tokensToLines([w("Hola,", 0, 0.4), sp(0.4), w("¿qué", 0.5, 0.7), sp(0.7), w("tal?", 0.7, 1), sp(1), w("Bien.", 1.2, 1.5)], 10);
  assert.deepEqual(lines.map((l) => l.text), ["Hola, ¿qué tal?", "Bien."]);
  assert.equal(lines[0].start, 10);
  assert.equal(lines[1].end, 11.5);
  assert.equal(lines[0].words.length, 3);
});

test("일본어는 낱말 사이에 띄어쓰기를 넣지 않고, 긴 쉼에서 끊는다", () => {
  const lines = tokensToLines([w("今日", 0, 0.3), w("は", 0.3, 0.4), w("いい", 0.4, 0.6), w("天気", 0.6, 0.9), w("ですね", 2.0, 2.4)]);
  assert.deepEqual(lines.map((l) => l.text), ["今日はいい天気", "ですね"]);
});

test("12초 넘는 줄은 앞에서 끊는다(태국어처럼 문장부호가 없어도)", () => {
  const tokens: ScribeToken[] = [];
  for (let i = 0; i < 30; i++) tokens.push(w("ครับ", i * 0.6, i * 0.6 + 0.5));
  const lines = tokensToLines(tokens);
  assert.ok(lines.length >= 2);
  assert.ok(lines.every((l) => l.end - l.start <= 12.5));
});
