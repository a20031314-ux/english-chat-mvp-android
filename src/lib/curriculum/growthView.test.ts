import { test } from "node:test";
import assert from "node:assert/strict";
import { growthPairs, progressIn, type MissLine, type UsedLine } from "./growthView.ts";
import { growthLinesOf } from "../roleplay/talkGrowth.ts";
import type { LogEvent } from "./logLedger.ts";

const D = 86_400;
const T = Date.UTC(2026, 10, 1, 1) / 1000;
const dayOf = (t: number) => new Date(t * 1000).toISOString().slice(0, 10);

test("개수: 새로·익힘·다시 맞힘·써 봄·앎 — 기간 안만, 열쇠마다 한 번 (es·ja 열쇠)", () => {
  const ev = (k: string, r: LogEvent["r"], day: number, src: LogEvent["src"] = "quiz", m?: LogEvent["m"]): LogEvent => ({ k, src, r, t: T + day * D + 60, ...(m ? { m } : {}) });
  const events: LogEvent[] = [
    ev("w|casa", "ok", 0, "quiz", "write"), // 처음 봄 → 힘듦
    ev("w|casa", "ok", 2, "quiz", "write"), // 다른 날 → 앎 (2일째)
    ev("w|食べる", "miss", 0, "quiz", "pick"),
    ev("w|食べる", "ok", 3, "quiz", "pick"), // 다시 맞힘(3일째)
    ev("w|perro", "miss", 3, "quiz", "pick"),
    ev("w|perro", "ok", 3, "quiz", "pick"), // 같은 날 → 다시 맞힘 아님
    ev("e|por cierto", "used", 3, "chat"), // 써 봄(3일째) · 처음 봄 → 힘듦
  ];
  const all = progressIn(events, () => true, dayOf);
  assert.deepEqual(new Set(all.fresh), new Set(["w|casa", "w|食べる", "w|perro"]));
  assert.deepEqual(all.learned, ["w|casa"]);
  assert.deepEqual(all.recovered, ["w|食べる"]);
  assert.deepEqual(all.used, ["e|por cierto"]);
  assert.deepEqual(all.known, ["w|casa"]);
  const day3 = progressIn(events, (t) => dayOf(t) === dayOf(T + 3 * D), dayOf);
  assert.deepEqual(day3.learned, []);
  assert.deepEqual(day3.recovered, ["w|食べる"]);
  assert.deepEqual(new Set(day3.fresh), new Set(["w|perro"]));
  assert.deepEqual(day3.known, ["w|casa"], "앎은 누적");
});

test("고쳐 씀: 틀린 줄 뒤 다른 날 같은 열쇠를 쓴 줄과 짝, 같은 날·따라 한 문장은 안 셈, 문장구조 먼저", () => {
  const miss: MissLine[] = [{ k: ["w|más", "f|es-comp"], w: "Es lenta que la primera", r: "Es más lenta que la primera", t: T, s: "call" }];
  const used: UsedLine[] = [
    { k: ["f|es-comp"], x: "Mi casa es más grande que la tuya", t: T + 3600, s: "call" }, // 같은 날
    { k: ["f|es-comp"], x: "Es más lenta que la primera", t: T + D, s: "chat" }, // 따라 한 문장
    { k: ["w|más"], x: "Quiero más café", t: T + D + 10, s: "chat" },
    { k: ["f|es-comp"], x: "Madrid es más caro que Sevilla", t: T + 2 * D, s: "call" },
  ];
  const pairs = growthPairs(miss, used, dayOf);
  assert.equal(pairs.length, 1);
  assert.equal(pairs[0]!.key, "f|es-comp");
  assert.equal(pairs[0]!.used.x, "Madrid es más caro que Sevilla");
});

test("대화 줄 → 고친 줄·쓴 줄 열쇠(빈도 목록 있을 때 낱말도) (ja·es)", () => {
  const es = growthLinesOf("es", [{ who: "learner", text: "Yo como pan", }, { who: "learner", text: "Yo comer pan", better: "Yo como pan" }, { who: "tutor", text: "¿Y tú?" }], "chat", T, new Map([["pan", "noun"], ["como", "verb"]]));
  assert.equal(es.used.length, 1);
  assert.ok(es.used[0]!.k.includes("w|pan"));
  assert.equal(es.miss.length, 1);
  assert.ok(es.miss[0]!.k.includes("w|como"), es.miss[0]!.k.join());
  const ja = growthLinesOf("ja", [{ who: "learner", text: "パンを食べる" }], "call", T, new Map([["パン", "noun"]]));
  assert.ok(ja.used[0]?.k.includes("w|パン"), JSON.stringify(ja));
});

test("학습 곡선 선(누적 앎): 날마다 늘고, 다시 틀린 것만 빠짐", async () => {
  const { knownAt } = await import("./growthView.ts");
  const ev = (k: string, r: LogEvent["r"], day: number, m: LogEvent["m"] = "write"): LogEvent => ({ k, src: "quiz", r, t: T + day * D + 60, m });
  const events = [ev("w|casa", "ok", 0), ev("w|casa", "ok", 1), ev("w|perro", "ok", 1), ev("w|perro", "ok", 2), ev("w|casa", "miss", 3, "pick")];
  assert.deepEqual([0, 1, 2, 3].map((day) => knownAt(events, T + day * D + 3600, dayOf)), [0, 1, 2, 1]);
});
