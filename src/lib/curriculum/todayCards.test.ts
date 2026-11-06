import { test } from "node:test";
import assert from "node:assert/strict";
import { cardFaces, checkStates, dueKeys, stateOf } from "./checkState.ts";
import { doneOf, pickCards, NEW_DONE } from "./todayCards.ts";
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

test("체크 셋: 통화에서 쓰면 앎, 앎에서 틀리면 적용이 힘듦(처음 봄으로 안 내림) (th)", () => {
  const key = "e|ขอบคุณครับ";
  const known = stateOf([ev(key, "ok", T0, { m: "write" }), { k: key, src: "call", r: "used", t: T0 + 60 }], utcDay);
  assert.equal(known.level, "known");
  const down = stateOf([ev(key, "ok", T0, { m: "write" }), { k: key, src: "call", r: "used", t: T0 + 60 }, { k: key, src: "people", r: "miss", t: T0 + 2 * DAY }], utcDay);
  assert.equal(down.level, "hard");
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

const learnedTwoDays = (keys: string[]) => keys.flatMap((k) => [ev(k, "ok", T0, { m: "write" }), ev(k, "ok", T0 + DAY, { m: "write" })]);

test("오늘 카드: 확인할 것 넷 이상이면 ①, 기록이 없으면 ⑤ 하나", () => {
  const empty = pickCards({ events: [], states: new Map(), now: T0, canCall: true });
  assert.deepEqual(empty.map((card) => card.kind), ["new"]);
  const keys = ["w|水", "w|山", "w|川", "w|空"];
  const events = learnedTwoDays(keys);
  const cards = pickCards({ events, states: checkStates(events, utcDay), now: T0 + 3 * DAY, canCall: false });
  assert.equal(cards[0]!.kind, "check");
  assert.equal(cards[0]!.n, 4);
  assert.equal(cards.at(-1)!.kind, "new");
});

test("오늘 카드: 통화에서 틀린 것은 ②, 이번 주 앎이 된 표현을 안 썼으면 ④가 자리를 받음", () => {
  const exprs = ["e|por favor", "e|de nada", "e|hasta luego"];
  const events: LogEvent[] = [
    ...learnedTwoDays(exprs),
    ...learnedTwoDays(["w|uno", "w|dos", "w|tres", "w|cuatro"]),
    { k: "g|ser-estar", src: "call", r: "miss", t: T0 + DAY },
    ...["w|rojo", "w|azul", "w|verde"].map((k) => ev(k, "ok", T0 + DAY, { m: "write" })),
  ];
  const now = T0 + 3 * DAY;
  const cards = pickCards({ events, states: checkStates(events, utcDay), now, canCall: true });
  assert.deepEqual(cards.map((card) => card.kind), ["check", "stuck", "try"]);
  assert.deepEqual(cards[2]!.keys.sort(), [...exprs].sort());
  const noCall = pickCards({ events, states: checkStates(events, utcDay), now, canCall: false });
  assert.deepEqual(noCall.map((card) => card.kind), ["check", "stuck", "hard"]);
  assert.equal(noCall[2]!.part, "word");
});

test("오늘 카드 끝: 사건으로 — 확인은 다 풀면, 써 보기는 하나라도 쓰면, 새로 배울 것은 한 판", () => {
  const at = T0;
  assert.equal(doneOf({ kind: "check", keys: ["w|a", "w|b"], n: 2 }, [ev("w|a", "miss", at + 1)], at), false);
  assert.equal(doneOf({ kind: "check", keys: ["w|a", "w|b"], n: 2 }, [ev("w|a", "miss", at + 1), ev("w|b", "ok", at + 2)], at), true);
  assert.equal(doneOf({ kind: "try", keys: ["e|ありがとう"], n: 1 }, [{ k: "e|ありがとう", src: "call", r: "used", t: at + 5 }], at), true);
  const fresh = Array.from({ length: NEW_DONE }, (_, i) => ev(`w|n${i}`, "ok", at + i, { m: "pick" }));
  assert.equal(doneOf({ kind: "new", keys: [], n: NEW_DONE }, fresh.slice(1), at), false);
  assert.equal(doneOf({ kind: "new", keys: [], n: NEW_DONE }, fresh, at), true);
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
