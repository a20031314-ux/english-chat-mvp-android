import { test } from "node:test";
import assert from "node:assert/strict";
import { isFiller, pausesOf } from "./pauses.ts";

const w = (text: string, start: number, end: number) => ({ text, start, end });

test("낱말 사이 0.7초 넘는 쉼만, 그 뒤 낱말에", () => {
  assert.deepEqual(pausesOf([w("I'm", 0, 0.3), w("going", 0.4, 0.7), w("to", 1.9, 2.0), w("finish", 2.1, 2.5)]), [["to", 1.2]]);
  assert.deepEqual(pausesOf([w("Hola,", 0.2, 0.5), w("me", 0.6, 0.7)]), [], "처음 말 꺼내기 전 쉼은 셈하지 않음");
});

test("군말(uh·えーと·음)은 멈칫으로, 다음 낱말에 붙임 — 스페인어·일본어", () => {
  assert.deepEqual(pausesOf([w("Me", 0, 0.2), w("llamo", 0.3, 0.6), w("eh", 0.8, 1.1), w("Ana", 1.2, 1.5)]), [["Ana", 0.6]]);
  assert.deepEqual(pausesOf([w("はじめまして", 0, 0.8), w("えーと", 1.0, 1.5), w("マリア", 1.6, 2.0)]), [["マリア", 0.8]]);
  assert.ok(isFiller("Umm") && isFiller("음") && isFiller("えっと") && !isFiller("um-hum-not") && !isFiller("Ana"));
});
