import { test } from "node:test";
import assert from "node:assert/strict";
import { emptyCircle, noteAnswer, newPaused, wordTest, type Circle } from "./circle.ts";
import { BATCH, feelDue, feelLevel, noteLevel, noteLevelBatch, pickLevel, pickLevelWords, presumedWords, PROBE, startLevel, tooEarly, type Level } from "./vocabLevel.ts";

const cuts = [700, 1500, 2500, 3500, 5000];
const ranked = Array.from({ length: 7000 }, (_, i) => `w|r${i}`);
const rankOf = (key: string) => Number(key.slice(3));
const all = () => true;
const none = () => false;

test("처음 경계는 지금 단계 구간 시작, 가늠 단계에선 여러 구간을 섞어서(낮은 구간 먼저)", () => {
  assert.equal(startLevel(1, cuts).b, 150);
  assert.equal(startLevel(3, cuts).b, 1500);
  const picks = pickLevelWords(emptyCircle(), startLevel(1, cuts), { n: 8, ranked, cuts, usable: all, known: none });
  const bands = new Set(picks.map((key) => [0, ...cuts].filter((cut) => rankOf(key) >= cut).length));
  assert.ok(bands.size >= 4, `구간 ${[...bands]}`);
  assert.ok(rankOf(picks[0]!) < 60);
});

test("맞히면 경계가 오르고 틀리면 내려감 — 고르기 맞음은 쓰기 맞음보다 덜 오름", () => {
  const level: Level = { b: 1000, n: PROBE };
  const typed = noteLevel(level, 1200, true, { total: 7000 });
  const chose = noteLevel(level, 1200, true, { total: 7000, choose: true });
  assert.ok(typed.b > chose.b && chose.b > level.b);
  assert.ok(noteLevel(level, 800, false, { total: 7000 }).b < level.b);
});

test("모르는 사람도 아는 사람도 마흔 문제쯤이면 경계가 실제 근처로(고르기·찍기 포함 시뮬레이션)", () => {
  let seed = 7;
  const random = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  for (const truth of [80, 1200, 4000]) {
    let circle: Circle = emptyCircle();
    let level = startLevel(2, cuts);
    for (let q = 0; q < 40; q += 1) {
      const [key] = pickLevelWords(circle, level, { n: 1, ranked, cuts, usable: all, known: none });
      const rank = rankOf(key!);
      const know = 1 / (1 + Math.exp((rank - truth) / (truth * 0.2 + 30)));
      const correct = random() < know + (1 - know) / 3;
      circle = noteAnswer(circle, key!, correct, q, tooEarly(level, rank, correct));
      level = noteLevel(level, rank, correct, { choose: true, total: 7000, fresh: true });
    }
    assert.ok(level.b > truth / 3 && level.b < truth * 3, `실제 ${truth} → ${Math.round(level.b)}`);
  }
});

test("체크: 쉬워요는 연달아 누를수록 크게 오르고, 어려워요는 내리며 천천히(틀린 낱말 15개면 쉼)", () => {
  const level: Level = { b: 1000, n: 30 };
  const once = feelLevel(level, "easy", 10);
  const twice = feelLevel(once, "easy", 20);
  assert.ok(once.b > level.b && twice.b - once.b > once.b - level.b);
  const hard = feelLevel(level, "hard", 10);
  assert.ok(hard.b < level.b && hard.slow);
  assert.equal(feelLevel(level, "ok", 10).b, level.b);
  assert.equal(feelDue({ b: 0, n: 0, feltAt: 10 }, 15), false);
  assert.equal(feelDue({ b: 0, n: 0, feltAt: 10 }, 20), true);
  let circle: Circle = { ...emptyCircle(), lv: hard };
  for (let i = 0; i < 15; i += 1) circle = noteAnswer(circle, `w|r${i}`, false, i);
  assert.equal(newPaused(circle, all), true);
});

test("⚙ 단계 예시를 고르면 가늠을 건너뛰고 그 구간부터", () => {
  const level = pickLevel(startLevel(1, cuts), 2500);
  const picks = pickLevelWords(emptyCircle(), level, { n: 5, ranked, cuts, usable: all, known: none });
  for (const key of picks) assert.ok(rankOf(key) >= 2400, key);
});

test("아직 이른 낱말: 틀린 낱말 더미·단어 시험에 안 넣고, 경계가 닿으면 다시 탭에", () => {
  const level: Level = { b: 300, n: PROBE };
  assert.equal(tooEarly(level, 3000, false), true);
  assert.equal(tooEarly(level, 320, false), false);
  let circle: Circle = emptyCircle();
  for (let i = 0; i < 40; i += 1) circle = noteAnswer(circle, `w|r${3000 + i}`, false, i, true);
  assert.equal(newPaused(circle, all), false);
  assert.deepEqual(wordTest(circle, { now: 1e12, usable: all }), []);
  const later = pickLevelWords(circle, { b: 2880, n: PROBE }, { n: 40, ranked, cuts, usable: all, known: none });
  assert.ok(later.includes("w|r3000"));
});

test("아마 앎(경계보다 한참 아래 안 본 낱말)만 단어 시험 확인에", () => {
  const picks = presumedWords(emptyCircle(), { b: 1000, n: PROBE }, { ranked, usable: all, known: none, seed: 3 });
  assert.ok(picks.length >= 1);
  for (const key of picks) assert.ok(rankOf(key) < 1000 - 150);
  assert.deepEqual(presumedWords(emptyCircle(), { b: 20, n: PROBE }, { ranked, usable: all, known: none }), []);
});

test("묶음 판정: 가늠이 끝나면 열 개를 모아 한 번 — 기대보다 20%p 넘게 높으면 올림·낮으면 내림, 사이는 그대로", () => {
  const start: Level = { b: 1000, n: 30, picked: true };
  const run = (pattern: boolean[]) => pattern.reduce((level, correct) => noteLevelBatch(level, 1100, correct, { total: 7000 }), start);
  let level = start;
  for (let i = 0; i < BATCH - 1; i += 1) level = noteLevelBatch(level, 1100, true, { total: 7000 });
  assert.equal(level.b, start.b, "아홉 개까지는 그대로");
  assert.ok(run(Array(10).fill(true)).b > start.b);
  assert.ok(run(Array.from({ length: 10 }, (_, i) => i < 1)).b < start.b);
  assert.equal(run(Array.from({ length: 10 }, (_, i) => i < 6)).b, start.b);
  // 고르기는 찍어 맞힐 몫을 뺌: 열에 일곱 맞혀도(보정 55%) 그대로.
  assert.equal(Array.from({ length: 10 }, (_, i) => i < 7).reduce((l, c) => noteLevelBatch(l, 1100, c, { total: 7000, choose: true }), start).b, start.b);
  // 가늠 단계(n < PROBE, 직접 정하지 않음)는 답마다.
  assert.notEqual(noteLevelBatch({ b: 1000, n: 0 }, 1100, true, { total: 7000 }).b, 1000);
});
