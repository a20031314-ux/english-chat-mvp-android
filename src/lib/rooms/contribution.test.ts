import assert from "node:assert/strict";
import test from "node:test";
import {
  addMade,
  addStudyDay,
  addThankGiven,
  addThankReceived,
  badgesFor,
  boardBoostMs,
  BOARD_BOOST_MAX_MS,
  contribOf,
  contribScore,
  CONTRIB_WINDOW_MS,
  peopleBoostMs,
  PEOPLE_BOOST_MAX_MS,
  streakOf,
  thankWeight,
  THANK_MIN_ACCOUNT_AGE_MS,
} from "./contribution.ts";

const DAY = 24 * 60 * 60 * 1000;
const NOW = Date.UTC(2026, 9, 23, 3);

test("새 계정이 누른 도움됐어요는 0, 서로 주고받는 사이는 반, 아니면 1", () => {
  const receiver = contribOf(null);
  assert.equal(thankWeight({ giverCreatedAt: NOW - DAY, giverId: "a", receiver, now: NOW }), 0);
  const old = NOW - THANK_MIN_ACCOUNT_AGE_MS - DAY;
  assert.equal(thankWeight({ giverCreatedAt: old, giverId: "a", receiver, now: NOW }), 1);
  const gaveBack = addThankGiven(receiver, "a", NOW - 3 * DAY);
  assert.equal(thankWeight({ giverCreatedAt: old, giverId: "a", receiver: gaveBack, now: NOW }), 0.5);
  // 30일이 지난 주고받음은 다시 1.
  const longAgo = addThankGiven(receiver, "a", NOW - CONTRIB_WINDOW_MS - DAY);
  assert.equal(thankWeight({ giverCreatedAt: old, giverId: "a", receiver: longAgo, now: NOW }), 1);
});

test("받은 수는 언어별로 쌓이고, 무게 0은 숫자에도 넣지 않는다", () => {
  let summary = contribOf(null);
  summary = addThankReceived(summary, { weight: 1, lang: "ko", now: NOW });
  summary = addThankReceived(summary, { weight: 0.5, lang: "ja", now: NOW });
  summary = addThankReceived(summary, { weight: 1, lang: "ko", now: NOW });
  summary = addThankReceived(summary, { weight: 0, lang: "th", now: NOW });
  assert.equal(summary.help, 3);
  assert.deepEqual(summary.helpByLang, { ko: 2, ja: 1 });
  assert.equal(contribScore(summary, NOW), 2.5);
});

test("점수는 최근 30일만 — 오래된 기여는 빠져 노출 가산도 줄어든다", () => {
  let summary = contribOf(null);
  for (let i = 0; i < 12; i += 1) summary = addThankReceived(summary, { weight: 1, lang: "es", now: NOW - 40 * DAY });
  summary = addMade(summary, NOW - DAY);
  assert.equal(summary.help, 12);
  assert.equal(summary.made, 1);
  assert.equal(contribScore(summary, NOW), 2);
  assert.ok(peopleBoostMs(contribScore(summary, NOW)) > 0);
  assert.equal(peopleBoostMs(0), 0);
});

test("가산은 구간마다 늘고 상한을 넘지 않는다", () => {
  assert.equal(peopleBoostMs(1000), PEOPLE_BOOST_MAX_MS);
  assert.equal(boardBoostMs(1000), BOARD_BOOST_MAX_MS);
  assert.ok(peopleBoostMs(3) > peopleBoostMs(1));
  assert.ok(peopleBoostMs(10) > peopleBoostMs(3));
  assert.ok(boardBoostMs(30) <= BOARD_BOOST_MAX_MS);
});

test("꾸준함: 7일 안 공부한 날, 오늘 안 했으면 어제까지 이어진 연속일", () => {
  let summary = contribOf(null);
  for (const day of ["2026-10-19", "2026-10-20", "2026-10-21", "2026-10-22", "2026-10-10"]) summary = addStudyDay(summary, day);
  summary = addStudyDay(summary, "2026-10-22");
  assert.equal(summary.days.length, 5);
  assert.deepEqual(streakOf(summary.days, "2026-10-23"), { week: 4, run: 4 });
  assert.deepEqual(streakOf(summary.days, "2026-10-22"), { week: 4, run: 4 });
  assert.deepEqual(streakOf(summary.days, "2026-10-25"), { week: 4, run: 0 });
  assert.deepEqual(streakOf(summary.days, "2026-10-27"), { week: 2, run: 0 });
  // 달이 바뀌어도 이어진다.
  assert.deepEqual(streakOf(["2026-09-30", "2026-10-01"], "2026-10-01"), { week: 2, run: 2 });
});

test("배지는 켠 칸만, 숫자가 없으면 칸도 없다", () => {
  let summary = contribOf(null);
  summary = addThankReceived(summary, { weight: 1, lang: "ko", now: NOW });
  summary = addThankReceived(summary, { weight: 1, lang: "ja", now: NOW });
  summary = addThankReceived(summary, { weight: 1, lang: "ja", now: NOW });
  summary = addStudyDay(summary, "2026-10-23");
  const all = badgesFor(summary, { help: true, streak: true, maker: true }, "2026-10-23");
  assert.deepEqual(all.help, { count: 3, lang: "ja" });
  assert.deepEqual(all.streak, { week: 1, run: 1 });
  assert.equal(all.maker, undefined);
  const hidden = badgesFor(summary, { help: false, streak: false, maker: true }, "2026-10-23");
  assert.deepEqual(hidden, {});
});

test("예전 모양·깨진 값도 읽힌다", () => {
  const summary = contribOf({ help: 2, recent: [[NOW, 1], ["x"] as unknown as [number, number]] } as never);
  assert.equal(summary.help, 2);
  assert.equal(summary.recent.length, 1);
  assert.deepEqual(summary.days, []);
});
