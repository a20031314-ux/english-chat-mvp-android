import { test } from "node:test";
import assert from "node:assert/strict";
import { cardFaces, checkStates, dueKeys, stateOf } from "./checkState.ts";
import { answeredToday, reviewKeys, stuckKeys, TODAY_GOAL } from "./todayCards.ts";
import { ledgerFillEvents } from "./fillInputs.ts";
import type { LogEvent } from "./logLedger.ts";

const DAY = 86400;
const T0 = Date.UTC(2026, 10, 2, 3) / 1000; // 11-02 정오(한국)
const utcDay = (t: number) => new Date(t * 1000).toISOString().slice(0, 10);
const ev = (k: string, r: LogEvent["r"], t: number, extra: Partial<LogEvent> = {}): LogEvent => ({ k, src: "quiz", r, t, ...extra });

test("체크 셋: 고르기 맞음은 처음 봄, 쓰기 맞음은 적용이 힘듦, 다른 날 쓰기 맞음이면 앎 (ja)", () => {
  const key = "w|食べる";
  assert.equal(stateOf([ev(key, "ok", T0, { m: "pick" })], utcDay).level, "new");
  assert.equal(stateOf([ev(key, "ok", T0, { m: "write" })], utcDay).level, "hard");
  // 같은 날 두 번은 앎으로 안 감.
  assert.equal(stateOf([ev(key, "ok", T0, { m: "write" }), ev(key, "ok", T0 + 600, { m: "write" })], utcDay).level, "hard");
  const known = stateOf([ev(key, "ok", T0, { m: "write" }), ev(key, "ok", T0 + DAY, { m: "write" })], utcDay);
  assert.equal(known.level, "known");
  assert.equal(known.due, T0 + DAY + DAY);
});

test("체크 셋: 대화(통화·사람)는 안 움직임 — 앎은 퀴즈로만, 앎에서 퀴즈 틀리면 적용이 힘듦 (th)", () => {
  const key = "e|ขอบคุณครับ";
  const hard = stateOf([ev(key, "ok", T0, { m: "write" }), { k: key, src: "call", r: "used", t: T0 + DAY }], utcDay);
  assert.equal(hard.level, "hard", "대화에서 써도 앎으로 안 올림");
  const known = [ev(key, "ok", T0, { m: "write" }), ev(key, "ok", T0 + DAY, { m: "write" })];
  assert.equal(stateOf([...known, { k: key, src: "people", r: "miss", t: T0 + 2 * DAY }], utcDay).level, "known", "대화 틀림은 안 내림");
  assert.equal(stateOf([...known, ev(key, "miss", T0 + 2 * DAY)], utcDay).level, "hard");
});

test("체크 셋: 확인 때가 지나 맞히면 다음 확인(1→3일) (es)", () => {
  const key = "w|casa";
  const events = [ev(key, "ok", T0, { m: "write" }), ev(key, "ok", T0 + DAY, { m: "write" }), ev(key, "ok", T0 + 2 * DAY + 10, { m: "pick" })];
  const state = stateOf(events, utcDay);
  assert.equal(state.step, 1);
  assert.equal(state.due, T0 + 2 * DAY + 10 + 3 * DAY);
  assert.deepEqual(dueKeys(checkStates(events, utcDay), T0 + 4 * DAY), []);
  assert.deepEqual(dueKeys(checkStates(events, utcDay), T0 + 6 * DAY), [key]);
});

test("오늘 끝: 오늘 퀴즈로 답한 서로 다른 열쇠가 TODAY_GOAL 이상 — 대화·찾아봄·어제 답은 안 셈 (ja·es)", () => {
  const today = utcDay(T0);
  const answers = Array.from({ length: TODAY_GOAL - 1 }, (_, i) => ev(`w|n${i}`, i % 2 ? "ok" : "miss", T0 + i, { m: "pick" }));
  const noise: LogEvent[] = [
    ev("w|n0", "ok", T0 + 50, { m: "write" }),
    { k: "w|食べる", src: "call", r: "used", t: T0 + 60 },
    { k: "w|casa", src: "dict", r: "look", t: T0 + 70 },
    ev("w|ayer", "ok", T0 - DAY),
  ];
  assert.equal(answeredToday([...answers, ...noise], today, utcDay), TODAY_GOAL - 1);
  assert.equal(answeredToday([...answers, ...noise, ev("w|último", "ok", T0 + 80, { m: "pick" })], today, utcDay), TODAY_GOAL);
});

test("막힌 것: 지난 7일 대화에서 틀리고 그 뒤 퀴즈로 못 맞힌 것만, 최근 것부터 (es·th)", () => {
  const now = T0 + 3 * DAY;
  const events: LogEvent[] = [
    { k: "g|ser-estar", src: "call", r: "miss", t: T0 },
    { k: "w|กิน", src: "people", r: "miss", t: T0 + DAY },
    { k: "w|rojo", src: "chat", r: "miss", t: T0 },
    ev("w|rojo", "ok", T0 + 2 * DAY, { m: "write" }),
    { k: "w|viejo", src: "call", r: "miss", t: now - 8 * DAY },
  ];
  assert.deepEqual(stuckKeys(events, now), ["w|กิน", "g|ser-estar"]);
});

test("카드 가릴 칸: 맞힌 적 있거나 사전에서 찾아본 뒤 안 풀었으면 낱말 가림 (th·ja)", () => {
  const face = cardFaces([
    { k: "w|ข้าว", src: "dict", r: "look", t: T0 },
    { k: "w|水", src: "quiz", r: "ok", m: "pick", t: T0 },
    { k: "w|山", src: "dict", r: "look", t: T0 },
    { k: "w|山", src: "quiz", r: "miss", m: "write", t: T0 + 5 },
  ]);
  assert.equal(face("w|ข้าว"), "show");
  assert.equal(face("w|水"), "show");
  assert.equal(face("w|山"), "hide");
  assert.equal(face("w|空"), "hide");
});

test("다시 볼 것: 대화에서 막힌 것 → 확인할 때 된 앎 → 적용이 힘듦(오늘 안 푼 것) → 틀린 처음 봄, 장부만 (ja·es)", () => {
  const due = "w|食べる";
  const hardOld = "e|por favor";
  const hardToday = "g|1:0";
  const missed = "w|tamaño";
  const fine = "w|casa";
  const now = T0 + 5 * DAY;
  const events = [
    ev(due, "ok", T0, { m: "write" }), ev(due, "ok", T0 + DAY, { m: "write" }), // 앎, 확인 날 = T0+2일
    ev(hardOld, "ok", T0 + 3 * DAY, { m: "write" }),
    ev(hardToday, "ok", now - 60, { m: "write" }),
    ev(missed, "miss", now - 120, { m: "pick" }),
    ev(fine, "ok", now - 100, { m: "pick" }),
    { k: "w|帰る", src: "call", r: "miss", t: now - DAY },
  ];
  const keys = reviewKeys({ events, states: checkStates(events, utcDay), now, today: utcDay });
  assert.deepEqual(keys, ["w|帰る", due, hardOld, missed]);
});

test("개편 띠 재료 = 장부: 쓰기는 활용·고르기는 이해·통화에서 씀은 스스로, 찾아봄은 뺌 (th·it)", () => {
  const events: LogEvent[] = [
    ev("w|กิน", "ok", T0, { m: "write" }),
    ev("w|casa", "miss", T0, { m: "pick" }),
    { k: "e|grazie mille", src: "call", r: "used", t: T0 },
    { k: "w|กิน", src: "dict", r: "look", t: T0 },
  ];
  const out = ledgerFillEvents({ ledger: events, results: [], items: [], language: "th", segment: (text) => [text] });
  assert.deepEqual(
    out.map((one) => [one.key, one.correct, one.use, one.source, one.choose ?? false]),
    [["w|กิน", true, true, "quiz", false], ["w|casa", false, false, "quiz", true], ["e|grazie mille", true, true, "free", false]],
  );
  assert.equal(out[0]!.at, T0 * 1000);
});
