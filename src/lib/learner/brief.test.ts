import assert from "node:assert/strict";
import test from "node:test";
import { applyMeet, emptyLedger, type Ledger } from "./ledger.ts";
import { MIN_TURNS, buildBrief, turnStats, type TurnSample, type TurnStats } from "./brief.ts";
import { applyMistakes, emptyWeakRecord } from "../curriculum/weakPoints.ts";

const DAY = 24 * 60 * 60 * 1000;
const T0 = Date.UTC(2026, 9, 16, 12, 0, 0);
const NONE: TurnStats = { turns: 0, correctionRate: null, medianLatencyMs: null, retryRate: null };

function sample(over: Partial<TurnSample> = {}): TurnSample {
  return { surface: "call", language: "ja", at: T0 - DAY, hadCorrection: false, latencyMs: 1500, attempts: 1, ...over };
}

function learned(ledger: Ledger, text: string, at: number): Ledger {
  const met = applyMeet(ledger, text, "save", { tab: "vocab" }, at);
  const key = Object.keys(met.items).find((k) => met.items[k]!.text === text)!;
  return { ...met, items: { ...met.items, [key]: { ...met.items[key]!, state: "learned" } } };
}

test("nothing kept, nothing said", () => {
  const brief = buildBrief({ ledger: emptyLedger("ja", T0), weak: emptyWeakRecord(), stats: NONE, now: T0 });
  assert.deepEqual(brief.notes, []);
  assert.equal(brief.prompt, "");
});

test("recurring mistakes and learned phrases reach the tutor, quietly", () => {
  let weak = applyMistakes(emptyWeakRecord(), [{ key: "past", name: "past tense of verbs" }], T0 - 4 * DAY);
  weak = applyMistakes(weak, [{ key: "past", name: "past tense of verbs" }], T0 - DAY);
  weak = applyMistakes(weak, [{ key: "wo", name: "particle を" }], T0 - DAY); // once: not a pattern
  const ledger = learned(emptyLedger("ja", T0), "そういえば", T0 - 2 * DAY);
  const brief = buildBrief({ ledger, weak, stats: NONE, now: T0 });
  assert.deepEqual(brief.notes.map((n) => n.kind), ["mistakes", "recycle"]);
  assert.match(brief.prompt, /past tense of verbs/);
  assert.doesNotMatch(brief.prompt, /particle を/);
  assert.match(brief.prompt, /そういえば/);
  assert.match(brief.prompt, /never mention it, never quiz/);
});

test("stats come from the last two weeks of this language only", () => {
  const stats = turnStats(
    [
      sample({ hadCorrection: true }),
      sample({ hadCorrection: false }),
      sample({ hadCorrection: true, at: T0 - 20 * DAY }), // too old
      sample({ hadCorrection: true, language: "es" }), // other language
      sample({ hadCorrection: null, surface: "chat", latencyMs: null, attempts: null }),
    ],
    "ja",
    T0,
  );
  assert.equal(stats.turns, 3);
  assert.equal(stats.correctionRate, 0.5);
  assert.equal(stats.medianLatencyMs, null, "fewer than three measured pauses say nothing");
});

test("too few turns: how they went is not read", () => {
  const few = turnStats(Array.from({ length: MIN_TURNS - 1 }, () => sample({ hadCorrection: true, latencyMs: 9000, attempts: 3 })), "ja", T0);
  const brief = buildBrief({ ledger: emptyLedger("ja", T0), weak: emptyWeakRecord(), stats: few, now: T0 });
  assert.deepEqual(brief.notes, []);
});

test("struggling: ease off, saying why; doing well: stretch; never both", () => {
  const hard = turnStats(
    Array.from({ length: 10 }, (_, i) => sample({ hadCorrection: i < 7, latencyMs: 5200, attempts: i < 4 ? 2 : 1 })),
    "ja",
    T0,
  );
  const easier = buildBrief({ ledger: emptyLedger("ja", T0), weak: emptyWeakRecord(), stats: hard, now: T0 });
  assert.deepEqual(easier.notes, [{ kind: "easier", because: ["corrections", "pauses", "retries"] }]);
  assert.match(easier.prompt, /one thing at a time/);

  const good = turnStats(Array.from({ length: 12 }, (_, i) => sample({ hadCorrection: i === 0, latencyMs: 1200 })), "ja", T0);
  const harder = buildBrief({ ledger: emptyLedger("ja", T0), weak: emptyWeakRecord(), stats: good, now: T0 });
  assert.deepEqual(harder.notes, [{ kind: "harder" }]);
  assert.match(harder.prompt, /Stretch them a little/);

  const middle = turnStats(Array.from({ length: 10 }, (_, i) => sample({ hadCorrection: i < 4, latencyMs: 3000 })), "ja", T0);
  assert.deepEqual(buildBrief({ ledger: emptyLedger("ja", T0), weak: emptyWeakRecord(), stats: middle, now: T0 }).notes, []);
});

test("chat-only learners are read by corrections alone", () => {
  const chat = turnStats(
    Array.from({ length: 9 }, () => sample({ surface: "chat", hadCorrection: false, latencyMs: null, attempts: null })),
    "es",
    T0,
  ).turns;
  assert.equal(chat, 0, "a different language is not counted");
  const stats = turnStats(
    Array.from({ length: 9 }, () => sample({ surface: "chat", language: "es", hadCorrection: false, latencyMs: null, attempts: null })),
    "es",
    T0,
  );
  assert.deepEqual(buildBrief({ ledger: emptyLedger("es", T0), weak: emptyWeakRecord(), stats, now: T0 }).notes, [{ kind: "harder" }]);
});

test("a kind the learner switched off is left out", () => {
  const ledger = learned(emptyLedger("en", T0), "end up", T0 - 2 * DAY);
  const brief = buildBrief({ ledger, weak: emptyWeakRecord(), stats: NONE, now: T0, off: ["recycle"] });
  assert.deepEqual(brief.notes, []);
});
