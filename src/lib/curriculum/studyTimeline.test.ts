import { test } from "node:test";
import assert from "node:assert/strict";
import { cardHistory, knowTag, sessionMinutes, sessionsOf, summarizeSession, talkHistory } from "./studyTimeline.ts";
import type { LogEvent } from "./logLedger.ts";

const DAY = 86400;
const T0 = Date.UTC(2026, 10, 9, 0, 12) / 1000; // 09:12 KST
const utcDay = (t: number) => new Date(t * 1000).toISOString().slice(0, 10);
const ev = (k: string, r: LogEvent["r"], t: number, src: LogEvent["src"] = "quiz", m: LogEvent["m"] = "write"): LogEvent => ({ k, src, r, t, ...(m ? { m } : {}) });

test("학습 시간: 10분 넘게 비면 끊고, 통화·수업은 걸린 시간으로 이어진다 (ja·es)", () => {
  const events = [ev("w|食べる", "ok", T0), ev("w|水", "miss", T0 + 300), ev("w|casa", "ok", T0 + 900), ev("w|perro", "look", T0 + 4 * 3600, "dict", undefined)];
  const calls = [{ id: "c1", at: (T0 + 7200) * 1000, secs: 600 }];
  const results = [{ at: (T0 + 7200 + 600 + 540) * 1000, secs: 300, item: "f1" }];
  const got = sessionsOf({ events, calls, results });
  assert.equal(got.length, 3);
  assert.deepEqual(got[0]!.places, ["quiz"]);
  assert.equal(got[0]!.events.length, 3);
  assert.equal(sessionMinutes(got[0]!), 15);
  // 통화 끝과 수업 시작 사이 4분 → 한 학습 시간, 통화가 더 길어 먼저.
  assert.deepEqual(got[1]!.places, ["call", "lesson"]);
  assert.deepEqual(got[1]!.callIds, ["c1"]);
  assert.equal(got[1]!.resultAts.length, 1);
  assert.deepEqual(got[2]!.places, ["dict"]);
  assert.equal(sessionMinutes(got[2]!), 1);
});

test("학습 시간 내용: 요소별 수, 처음 답한 것과 다른 날 다시 답한 것, 찾아봄·씀 (th·fr)", () => {
  const before = [ev("w|maison", "ok", T0 - 2 * DAY)];
  const inside = [
    ev("w|maison", "ok", T0, "quiz", "sure"),
    ev("w|กิน", "miss", T0 + 60, "quiz", "pick"),
    ev("w|กิน", "ok", T0 + 120),
    ev("g|1:0", "ok", T0 + 180, "judge"),
    ev("e|s'il vous plaît", "used", T0 + 240, "call", undefined),
    ev("w|น้ำ", "look", T0 + 250, "dict", undefined),
  ];
  const all = [...before, ...inside];
  const [session] = sessionsOf({ events: inside });
  const got = summarizeSession(session!, all, utcDay);
  assert.deepEqual(got.parts, { word: 2, grammar: 1, expression: 1, frame: 0 });
  assert.equal(got.ok, 3);
  assert.equal(got.miss, 1);
  assert.deepEqual(got.fresh.sort(), ["g|1:0", "w|กิน"]);
  assert.deepEqual(got.again, ["w|maison"]);
  assert.equal(got.looked, 1);
  assert.equal(got.used, 1);
  // 퀴즈 카드가 먼저, 대화에서만 쓴 표현은 뒤.
  assert.equal(got.cards[got.cards.length - 1]!.key, "e|s'il vous plaît");
  const tha = got.cards.find((one) => one.key === "w|กิน")!;
  assert.deepEqual([tha.ok, tha.miss, tha.mode], [1, 1, "write"]);
});

test("표시: 학습 → n번 학습(답한 날 수, 찾아봄·대화 안 셈), 마지막 틀림 ✗ · 대화는 쓴 곳으로만 (ko·es)", () => {
  const key = "w|먹다";
  const day = (n: number) => T0 + n * DAY;
  let events: LogEvent[] = [ev(key, "ok", day(0)), ev(key, "ok", day(0) + 60)];
  assert.deepEqual(knowTag(events, key, utcDay), { kind: "learned", n: 1, miss: false });
  events = [...events, { k: key, src: "dict", r: "look", t: day(1) }, ev(key, "miss", day(2))];
  assert.deepEqual(knowTag(events, key, utcDay), { kind: "times", n: 2, miss: true });
  events = [...events, ev(key, "used", day(3), "call", undefined), ev(key, "used", day(4), "chat", undefined), ev(key, "used", day(5), "people", undefined)];
  // 대화에서 쓴 것은 표시를 안 바꿈(2026-11-09 앎·말하기 분리).
  assert.deepEqual(knowTag(events, key, utcDay), { kind: "times", n: 2, miss: true });
  assert.equal(knowTag([ev("w|casa", "look", day(0), "dict", undefined)], "w|casa", utcDay), null);
  assert.equal(knowTag([ev("w|casa", "used", day(0), "call", undefined)], "w|casa", utcDay), null, "대화에서만 쓴 말 = 학습 아님");
  // 학습 기록은 새것부터(퀴즈·사전만), 줄마다 그때까지의 표시.
  const rows = cardHistory(events, key, utcDay);
  assert.equal(rows.length, 4);
  assert.equal(rows[0]!.tag?.kind, "times");
  assert.equal(rows[rows.length - 1]!.tag?.kind, "learned");
  // 쓴 곳 = 대화만, 새것부터, 같은 날·같은 곳·같은 결과는 한 줄.
  const more = [...events, ev(key, "used", day(5) + 30, "people", undefined), ev(key, "miss", day(5) + 90, "people", undefined)];
  assert.deepEqual(talkHistory(more, key, utcDay).map((one) => `${one.src}:${one.r}`), ["people:miss", "people:used", "chat:used", "call:used"]);
});
