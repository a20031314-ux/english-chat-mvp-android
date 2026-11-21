import { test } from "node:test";
import assert from "node:assert/strict";
import { curveOf, curveReady, learnedIn } from "./learnedView.ts";
import type { LogEvent } from "./logLedger.ts";

const DAY = 86400;
const T0 = Date.UTC(2026, 10, 2, 3) / 1000;
const utcDay = (t: number) => new Date(t * 1000).toISOString().slice(0, 10);
const ev = (k: string, r: LogEvent["r"], t: number, src: LogEvent["src"] = "quiz"): LogEvent => ({ k, src, r, t, m: "write" });

test("배운 것: 기간 안에 퀴즈로 답한 열쇠만 요소별, 마지막에 푼 것부터 — 통화·찾아봄은 뺌 (ja·es)", () => {
  const events: LogEvent[] = [
    ev("w|食べる", "miss", T0), ev("w|食べる", "ok", T0 + 60),
    ev("w|casa", "ok", T0 + 120),
    ev("g|1:0", "ok", T0 + 30),
    ev("e|por favor", "used", T0, "call"),
    { k: "w|perro", src: "dict", r: "look", t: T0 },
    ev("w|viejo", "ok", T0 - 3 * DAY),
  ];
  const got = learnedIn(events, (t) => t >= T0 - DAY);
  assert.deepEqual(got.word.map((one) => [one.key, one.ok, one.miss, one.lastOk]), [["w|casa", 1, 0, true], ["w|食べる", 1, 1, true]]);
  assert.deepEqual(got.grammar.map((one) => one.key), ["g|1:0"]);
  assert.equal(got.expression.length, 0);
});

test("학습 곡선: 날마다 답한 수·맞힌 비율(답 셋 미만인 날은 점수 없음), 답한 날 둘부터 (th)", () => {
  const days = [utcDay(T0), utcDay(T0 + DAY), utcDay(T0 + 2 * DAY)];
  const events: LogEvent[] = [
    ev("w|กิน", "miss", T0), ev("w|น้ำ", "ok", T0), ev("w|ไป", "ok", T0), ev("w|มา", "miss", T0),
    ev("w|กิน", "ok", T0 + 2 * DAY), ev("g|1:0", "ok", T0 + 2 * DAY),
  ];
  const words = curveOf(events, days, "word", utcDay);
  assert.deepEqual(words.map((p) => [p.n, p.ok, p.score]), [[4, 2, 0.5], [0, 0, null], [1, 1, null]]);
  assert.equal(curveReady(words), true);
  assert.equal(curveReady(curveOf(events, days, "grammar", utcDay)), false);
  assert.deepEqual(curveOf(events, days, null, utcDay).map((p) => p.n), [4, 0, 2]);
});

test("날마다 쌓기: 그날 서로 다른 것 요소별 · 기간 앞날에 답한 것은 again — 찾아봄은 안 셈 (ja·es)", async () => {
  const { stacksOf } = await import("./learnedView.ts");
  const day = (t: number) => new Date(t * 1000).toISOString().slice(0, 10);
  const D = 86400;
  const t0 = Date.UTC(2026, 10, 1) / 1000 + 3600;
  const events = [
    { k: "w|食べる", src: "quiz" as const, r: "ok" as const, m: "pick" as const, t: t0 + D },
    { k: "w|食べる", src: "quiz" as const, r: "miss" as const, m: "write" as const, t: t0 + D + 60 },
    { k: "g|1:2", src: "quiz" as const, r: "ok" as const, m: "pick" as const, t: t0 + D },
    { k: "g|1:2", src: "quiz" as const, r: "miss" as const, m: "pick" as const, t: t0 + D + 5 },
    { k: "w|comer", src: "dict" as const, r: "look" as const, t: t0 + D },
    { k: "w|食べる", src: "quiz" as const, r: "ok" as const, m: "pick" as const, t: t0 + 2 * D },
    { k: "e|¿de dónde eres?", src: "exam" as const, r: "ok" as const, m: "write" as const, t: t0 + 2 * D },
    { k: "w|comer", src: "quiz" as const, r: "ok" as const, m: "pick" as const, t: t0 },
  ];
  const stacks = stacksOf(events, ["2026-11-02", "2026-11-03"], day);
  assert.deepEqual(stacks[0], { day: "2026-11-02", n: 2, parts: { word: 1, grammar: 1, expression: 0, frame: 0 }, again: { word: 0, grammar: 0, expression: 0, frame: 0 } });
  assert.deepEqual(stacks[1], { day: "2026-11-03", n: 2, parts: { word: 1, grammar: 0, expression: 1, frame: 0 }, again: { word: 1, grammar: 0, expression: 0, frame: 0 } });
  // 기둥 합 − again = 기간 서로 다른 것(食べる·1:2·¿de dónde eres? = 3), 기간 앞날(11-01)의 comer는 안 셈.
  const total = stacks.reduce((sum, one) => sum + one.n - Object.values(one.again).reduce((a, b) => a + b, 0), 0);
  assert.equal(total, 3);
});

test("확인된 실력: 네 꼭짓점 아래 끝 평균 — 답이 쌓이면 오름 (es)", async () => {
  const { sureOf } = await import("./learnedView.ts");
  const { computeFill, fillCatalog } = await import("./fill.ts");
  const { loadBank } = await import("./vocabBank.ts");
  const catalog = fillCatalog("es", await loadBank("es"));
  const first = [...catalog.vocab.values()].filter((item) => item.stage === 1 && item.key.startsWith("w|"));
  const now = Date.UTC(2026, 10, 7);
  const fillAt = (n: number) =>
    computeFill({ catalog, check: null, stage: 1, events: first.slice(0, n).map((item, i) => ({ at: now - 1e6 + i, key: item.key, correct: i % 5 !== 0, source: "quiz" as const, use: false, choose: true })), calls: [], now });
  const a = sureOf(fillAt(0));
  const b = sureOf(fillAt(10));
  const c = sureOf(fillAt(60));
  assert.equal(a, 0);
  assert.ok(b > a && c > b, `${a} ${b} ${c}`);
});
