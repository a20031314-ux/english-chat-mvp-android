import { test } from "node:test";
import assert from "node:assert/strict";
import { checkStates, stateOf } from "./checkState.ts";
import { answeredToday, reviewKeys, stuckKeys, TODAY_GOAL } from "./todayCards.ts";
import { ledgerFillEvents } from "./fillInputs.ts";
import type { LogEvent } from "./logLedger.ts";

const DAY = 86400;
const T0 = Date.UTC(2026, 10, 2, 3) / 1000; // 11-02 정오(한국)
const utcDay = (t: number) => new Date(t * 1000).toISOString().slice(0, 10);
const ev = (k: string, r: LogEvent["r"], t: number, extra: Partial<LogEvent> = {}): LogEvent => ({ k, src: "quiz", r, t, ...extra });

test("체크 셋: 퀴즈에서 맞히면 모양과 상관없이 앎, 처음 봄에서 틀리면 그대로 (ja·es)", () => {
  assert.equal(stateOf([ev("w|食べる", "ok", T0, { m: "pick" })]).level, "known");
  assert.equal(stateOf([ev("w|食べる", "ok", T0, { m: "write" })]).level, "known");
  assert.equal(stateOf([{ k: "g|1:4", src: "judge", r: "ok", m: "write", t: T0 }]).level, "known", "맞나 틀리나에서 짚음");
  assert.equal(stateOf([{ k: "w|casa", src: "exam", r: "ok", m: "pick", t: T0 }]).level, "known", "첫 측정 뜻 고르기");
  assert.equal(stateOf([ev("w|casa", "miss", T0, { m: "pick" })]).level, "new");
  assert.equal(stateOf([ev("w|casa", "miss", T0, { m: "pick" }), ev("w|casa", "ok", T0 + 60, { m: "write" })]).level, "known");
});

test("체크 셋: 앎에서 퀴즈 틀림·[다시] → 다시 볼 것, 대화는 안 움직임 (th)", () => {
  const key = "e|ขอบคุณครับ";
  const known = [ev(key, "ok", T0, { m: "write" })];
  assert.equal(stateOf([...known, { k: key, src: "call", r: "used", t: T0 + DAY }]).level, "known", "대화에서 써도 그대로");
  assert.equal(stateOf([...known, { k: key, src: "people", r: "miss", t: T0 + 2 * DAY }]).level, "known", "대화 틀림은 안 내림");
  assert.equal(stateOf([...known, ev(key, "miss", T0 + 2 * DAY)]).level, "hard");
  assert.equal(stateOf([...known, ev(key, "again", T0 + 30)]).level, "hard", "맞힌 뒤 [다시]");
  assert.equal(stateOf([...known, ev(key, "again", T0 + 30), ev(key, "ok", T0 + DAY)]).level, "known", "다시 맞히면 앎");
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

test("다시 볼 것: 대화에서 막힌 것 → 다시 볼 것(오늘 안 푼 것) → 틀린 처음 봄 — 맞힌 것은 저절로 안 나옴 (ja·es)", () => {
  const again = "w|食べる";
  const hardOld = "e|por favor";
  const againToday = "g|1:0";
  const missed = "w|tamaño";
  const fine = "w|casa";
  const fineWrite = "w|perro";
  const now = T0 + 5 * DAY;
  const events = [
    ev(again, "ok", T0, { m: "pick" }), ev(again, "again", T0 + 10),
    ev(hardOld, "ok", T0 + DAY, { m: "write" }), ev(hardOld, "miss", T0 + 3 * DAY, { m: "write" }),
    ev(againToday, "ok", now - 60, { m: "write" }), ev(againToday, "again", now - 50),
    ev(missed, "miss", now - 2 * 3600, { m: "pick" }),
    ev("w|ejército", "miss", now - 120, { m: "pick" }),
    ev(fine, "ok", now - 100, { m: "pick" }),
    ev(fineWrite, "ok", T0, { m: "write" }),
    { k: "w|帰る", src: "call", r: "miss", t: now - DAY },
  ];
  const keys = reviewKeys({ events, states: checkStates(events), now, today: utcDay });
  assert.deepEqual(keys, ["w|帰る", again, hardOld, missed]);
  // 방금(한 시간 안) 틀린 처음 봄은 아직 — 몇 분 뒤 같은 문제를 기억으로 풀지 않게.
  assert.ok(reviewKeys({ events, states: checkStates(events), now: now + 3600, today: utcDay }).includes("w|ejército"));
  // 오늘 [다시]를 누른 것은 다음 날부터.
  assert.ok(reviewKeys({ events, states: checkStates(events), now: now + DAY, today: utcDay }).includes(againToday));
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
