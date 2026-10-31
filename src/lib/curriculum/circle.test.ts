import { test } from "node:test";
import assert from "node:assert/strict";
import { CIRCLE_START, emptyCircle, growCircle, itemState, LEARNING_GAP_MS, MAX_LEARNING, noteAnswer, pickCircle, type Circle } from "./circle.ts";

const order = Array.from({ length: 200 }, (_, i) => `w|w${i}`);
const none = () => false;
const all = () => true;
const NOW = Date.UTC(2026, 10, 1);
const DAY = 24 * 60 * 60 * 1000;

test("처음 쓰는 사람: 데이터가 없으니 낱말 순서대로 새것만(정답률 목표·아는 몫 없음)", () => {
  const first = pickCircle(emptyCircle(), order, { n: 5, now: NOW, usable: all, known: none });
  assert.deepEqual(first, order.slice(0, 5));
});

test("한 번 맞히면 익힘, 잊을 때(1·3·7일…)가 되기 전에는 다시 안 냄 — 빈자리를 맞힌 낱말로 채우지 않음", () => {
  let circle: Circle = emptyCircle();
  for (const key of order.slice(0, 5)) circle = noteAnswer(circle, key, true, NOW);
  for (const key of order.slice(0, 5)) assert.equal(itemState(circle, key), "known");
  // 30분 뒤: 맞힌 다섯은 안 나오고 새것만.
  const soon = pickCircle(circle, order, { n: 5, now: NOW + 30 * 60 * 1000, usable: all, known: none });
  assert.deepEqual(soon, order.slice(5, 10));
  // 새것이 없으면(쓸 수 있는 낱말이 그 다섯뿐) 빈 묶음 — 맞힌 것으로 채우지 않는다.
  const onlyFive = (key: string) => order.indexOf(key) < 5;
  assert.deepEqual(pickCircle(circle, order, { n: 5, now: NOW + 60 * 60 * 1000, usable: onlyFive, known: none }), []);
  // 하루 뒤엔 잊을 때가 됐으니 맨 앞에.
  assert.deepEqual(pickCircle(circle, order, { n: 5, now: NOW + DAY, usable: onlyFive, known: none }), order.slice(0, 5));
  // 하루 뒤 또 맞히면 다음은 3일 뒤.
  const again = noteAnswer(circle, order[0]!, true, NOW + DAY);
  assert.ok(!pickCircle(again, order, { n: 5, now: NOW + 3 * DAY, usable: onlyFive, known: none }).includes(order[0]!));
  assert.ok(pickCircle(again, order, { n: 5, now: NOW + 4 * DAY, usable: onlyFive, known: none }).includes(order[0]!));
});

test("틀린 낱말은 잠깐 뒤 새것과 번갈아, 틀린 것이 많으면 새것을 쉼", () => {
  let circle = noteAnswer(emptyCircle(), order[0]!, false, NOW);
  assert.equal(itemState(circle, order[0]!), "learning");
  assert.ok(!pickCircle(circle, order, { n: 3, now: NOW + 1000, usable: all, known: none }).includes(order[0]!));
  const later = pickCircle(circle, order, { n: 3, now: NOW + LEARNING_GAP_MS, usable: all, known: none });
  assert.deepEqual(later, [order[0], order[1], order[2]]);
  for (const key of order.slice(1, MAX_LEARNING + 1)) circle = noteAnswer(circle, key, false, NOW);
  const busy = pickCircle(circle, order, { n: 5, now: NOW + LEARNING_GAP_MS, usable: all, known: none });
  assert.ok(busy.every((key) => itemState(circle, key) === "learning"));
});

test("서버 이미 앎은 내지 않고, 원은 다룬 낱말 + 시작 크기만큼 앞서 받아 둠", () => {
  const known = (key: string) => order.indexOf(key) < 3;
  assert.deepEqual(pickCircle(emptyCircle(), order, { n: 2, now: NOW, usable: all, known }), order.slice(3, 5));
  let circle: Circle = emptyCircle();
  for (const key of order.slice(0, 30)) circle = noteAnswer(circle, key, true, NOW);
  assert.equal(growCircle(circle, order, none).size, 30 + CIRCLE_START);
  assert.equal(growCircle(emptyCircle(), order, none).size, CIRCLE_START);
});
