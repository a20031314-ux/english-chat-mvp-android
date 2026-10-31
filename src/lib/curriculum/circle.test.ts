import { test } from "node:test";
import assert from "node:assert/strict";
import { CIRCLE_START, emptyCircle, growCircle, itemState, noteAnswer, noteTest, pickCircle, TEST_EVERY, TEST_SIZE, wordTest, wordTestDue, type Circle } from "./circle.ts";

const order = Array.from({ length: 200 }, (_, i) => `w|w${i}`);
const none = () => false;
const all = () => true;
const NOW = Date.UTC(2026, 10, 1);
const DAY = 24 * 60 * 60 * 1000;

test("어휘 탭: 처음 보는 낱말만 순서대로 — 맞힌 것도 틀린 것도 탭에는 다시 안 나옴", () => {
  assert.deepEqual(pickCircle(emptyCircle(), order, { n: 5, now: NOW, usable: all, known: none }), order.slice(0, 5));
  let circle: Circle = emptyCircle();
  circle = noteAnswer(circle, order[0]!, true, NOW);
  circle = noteAnswer(circle, order[1]!, false, NOW);
  assert.equal(itemState(circle, order[0]!), "known", "한 번 맞히면 익힘");
  assert.equal(itemState(circle, order[1]!), "learning");
  for (const later of [NOW + 60 * 1000, NOW + 2 * DAY, NOW + 60 * DAY]) {
    const picked = pickCircle(circle, order, { n: 5, now: later, usable: all, known: none });
    assert.deepEqual(picked, order.slice(2, 7));
  }
  // 서버 이미 앎도 안 냄.
  const known = (key: string) => order.indexOf(key) < 3;
  assert.deepEqual(pickCircle(emptyCircle(), order, { n: 2, now: NOW, usable: all, known }), order.slice(3, 5));
});

test("단어 시험: 새 낱말 20개마다 — 틀린 것 절반까지 + 맞힌 것(잊을 때 된 것 먼저), 방금 본 맞힌 것은 뺌", () => {
  let circle: Circle = emptyCircle();
  for (let i = 0; i < TEST_EVERY; i += 1) circle = noteAnswer(circle, order[i]!, i % 4 !== 0, NOW + i * 1000);
  const today = "2026-11-01";
  assert.equal(wordTestDue(circle, { now: NOW + 5 * 60 * 1000, today, usable: all }), true);
  const soon = wordTest(circle, { now: NOW + 5 * 60 * 1000, usable: all });
  assert.ok(soon.every((key) => itemState(circle, key) === "learning"), "10분 안에 맞힌 것은 아직");
  const later = wordTest(circle, { now: NOW + 30 * 60 * 1000, usable: all });
  assert.equal(later.length, TEST_SIZE);
  const wrong = later.filter((key) => itemState(circle, key) === "learning");
  assert.equal(wrong.length, 5, "틀린 것 다섯(전부) + 맞힌 것 다섯");
  // 틀린 것이 많으면 틀린 것 먼저, 맞힌 것은 셋.
  let many: Circle = emptyCircle();
  for (let i = 0; i < 20; i += 1) many = noteAnswer(many, order[i]!, i < 5, NOW);
  assert.equal(wordTest(many, { now: NOW + DAY, usable: all }).filter((key) => itemState(many, key) === "known").length, 3);
  // 시험을 보면 다음은 새 낱말 20개 뒤(그날은 잊을 때 된 것만으로는 안 냄).
  circle = noteTest(circle, today, NOW + 30 * 60 * 1000);
  assert.equal(wordTestDue(circle, { now: NOW + 40 * 60 * 1000, today, usable: all }), false);
  // 다음 날 잊을 때 된 맞힌 낱말이 넷 넘으면 냄.
  assert.equal(wordTestDue(circle, { now: NOW + DAY + 60_000, today: "2026-11-02", usable: all }), true);
  const due = wordTest(circle, { now: NOW + DAY + 60_000, usable: all });
  assert.ok(due.some((key) => itemState(circle, key) === "known"));
});

test("단어 시험: 틀린 낱말이 여덟 쌓이면 새 낱말 20개 전이라도", () => {
  let circle: Circle = emptyCircle();
  for (let i = 0; i < 8; i += 1) circle = noteAnswer(circle, order[i]!, false, NOW);
  assert.equal(wordTestDue(circle, { now: NOW, today: "2026-11-01", usable: all }), true);
  circle = noteTest(circle, "2026-11-01", NOW + 1);
  assert.equal(wordTestDue(circle, { now: NOW + 2, today: "2026-11-01", usable: all }), false);
});

test("단어 시험: 시험에서 맞히면 연속 맞힘이 늘어 다음 시험엔 뒤로, 원은 다룬 낱말 + 시작 크기", () => {
  let circle: Circle = emptyCircle();
  for (let i = 0; i < 6; i += 1) circle = noteAnswer(circle, order[i]!, true, NOW);
  circle = noteAnswer(circle, order[0]!, true, NOW + DAY);
  const next = wordTest(circle, { now: NOW + 2 * DAY, usable: all });
  assert.equal(next[next.length - 1], order[0], "3일 기다리는 것은 맨 뒤");
  assert.equal(circle.newSeen, 6, "다시 본 것은 새 낱말로 안 셈");
  let wide: Circle = emptyCircle();
  for (const key of order.slice(0, 30)) wide = noteAnswer(wide, key, true, NOW);
  assert.equal(growCircle(wide, order, none).size, 30 + CIRCLE_START);
});
