import { test } from "node:test";
import assert from "node:assert/strict";
import { CIRCLE_START, emptyCircle, growCircle, itemState, noteAnswer, pickCircle, SHARE_MIN, STREAK_KNOWN, type Circle } from "./circle.ts";

const order = Array.from({ length: 200 }, (_, i) => `w|w${i}`);
const none = () => false;
const all = () => true;
const NOW = Date.UTC(2026, 10, 1);

test("넓어지는 원: 처음엔 원 안(앞 20개)에서만, 모르는 것과 익힘을 섞음", () => {
  let circle: Circle = emptyCircle();
  const first = pickCircle(circle, order, { n: 4, now: NOW, usable: all, known: none });
  assert.equal(first.length, 4);
  assert.ok(first.every((key) => order.indexOf(key) < CIRCLE_START));
  // 앞 10개를 익힘으로 → 모르는 몫(30%)만 모르는 것, 나머지는 익힘(복습 날 안 됐어도 채움).
  for (const key of order.slice(0, 10)) for (let i = 0; i < STREAK_KNOWN; i += 1) circle = noteAnswer(circle, key, true, NOW);
  circle = { ...circle, share: 0.3 };
  const later = NOW + 11 * 60 * 1000;
  const mixed = pickCircle(circle, order, { n: 4, now: later, usable: all, known: none });
  const unknown = mixed.filter((key) => itemState(circle, key) !== "known");
  assert.equal(unknown.length, 1);
  assert.equal(mixed.length, 4);
  // 방금 낸 것은 빼고.
  const again = pickCircle(circle, order, { n: 4, now: later, usable: all, known: none, skip: new Set(mixed) });
  // 방금(10분 안) 푼 익힘은 채우기로 안 씀 — 그때는 모르는 것으로 채운다.
  const soon = pickCircle(circle, order, { n: 4, now: NOW, usable: all, known: none });
  assert.ok(soon.every((key) => itemState(circle, key) !== "known"));
  assert.ok(again.every((key) => !mixed.includes(key)));
});

test("넓어지는 원: 원 안 익힘이 70%를 넘으면 키우고, 배우는 중이 많으면 안 키움", () => {
  let circle: Circle = emptyCircle();
  for (const key of order.slice(0, 13)) for (let i = 0; i < STREAK_KNOWN; i += 1) circle = noteAnswer(circle, key, true, NOW);
  assert.equal(growCircle(circle, order, none).size, CIRCLE_START);
  circle = noteAnswer(noteAnswer(circle, order[13]!, true, NOW), order[13]!, true, NOW);
  assert.ok(growCircle(circle, order, none).size > CIRCLE_START);
  // 서버 이미 앎도 익힘으로 센다.
  assert.ok(growCircle(emptyCircle(), order, all).size > CIRCLE_START);
});

test("넓어지는 원: 정답률이 낮으면 모르는 몫을 줄이고 높으면 늘림, 틀리면 배우는 중으로", () => {
  let circle: Circle = emptyCircle();
  for (let i = 0; i < 30; i += 1) circle = noteAnswer(circle, order[i % 20]!, false, NOW + i);
  assert.equal(circle.share, SHARE_MIN);
  for (let i = 0; i < 60; i += 1) circle = noteAnswer(circle, order[i % 20]!, true, NOW + 100 + i);
  assert.ok(circle.share > SHARE_MIN);
  circle = noteAnswer(circle, order[0]!, false, NOW + 1000);
  assert.equal(itemState(circle, order[0]!), "learning");
});

test("넓어지는 원: 목표 정답률(30~70%)에 맞춰 몫이 움직이고, 새것이 떨어지면 원을 키움", () => {
  // 목표 30%인데 정답률 50%면 모르는 몫을 늘린다(목표 70%면 그대로 줄인다).
  let low: Circle = { ...emptyCircle(), target: 0.3 };
  let high: Circle = { ...emptyCircle(), target: 0.7 };
  for (let i = 0; i < 30; i += 1) {
    low = noteAnswer(low, order[i % 20]!, i % 2 === 0, NOW + i);
    high = noteAnswer(high, order[i % 20]!, i % 2 === 0, NOW + i);
  }
  assert.ok(low.share > emptyCircle().share, `low ${low.share}`);
  assert.ok(high.share < emptyCircle().share, `high ${high.share}`);
  // 원 안 20개가 모두 배우는 중(새것 0)이면 익힘이 적어도 키운다.
  let busy: Circle = emptyCircle();
  for (const key of order.slice(0, CIRCLE_START)) busy = noteAnswer(busy, key, false, NOW);
  assert.ok(growCircle(busy, order, none).size > CIRCLE_START);
});
