import assert from "node:assert/strict";
import test from "node:test";
import { applyMeet, emptyLedger, type Ledger } from "./ledger.ts";
import {
  RESTING_AFTER_MS,
  absorbLedger,
  applyTurn,
  emptyGrowth,
  growthView,
  pickNext,
  stageOf,
  turnPoints,
} from "./growth.ts";

const DAY = 24 * 60 * 60 * 1000;
const T0 = Date.UTC(2026, 9, 16, 3, 0, 0); // 12:00 in Seoul

function withState(ledger: Ledger, text: string, state: "mastered" | "learned", at: number, understood = false): Ledger {
  const met = applyMeet(ledger, text, "save", { tab: "vocab" }, at);
  const key = Object.keys(met.items).find((k) => met.items[k]!.text === text)!;
  return {
    ...met,
    items: {
      ...met.items,
      [key]: { ...met.items[key]!, state, ...(state === "mastered" ? { masteredAt: at } : {}), understood },
    },
  };
}

test("a turn grows accuracy when uncorrected, naturalness when already natural, speaking on a quick first go in a call", () => {
  assert.deepEqual(turnPoints({ surface: "chat", corrected: true, alreadyNatural: true }), {});
  assert.deepEqual(turnPoints({ surface: "chat", corrected: false, alreadyNatural: false }), { accuracy: 1 });
  assert.deepEqual(turnPoints({ surface: "chat", corrected: false, alreadyNatural: true }), { accuracy: 1, natural: 1 });
  assert.deepEqual(turnPoints({ surface: "chat", corrected: null }), {});
  assert.deepEqual(turnPoints({ surface: "call", corrected: true, attempts: 1, latencyMs: 2500 }), { speaking: 1 });
  assert.deepEqual(turnPoints({ surface: "call", corrected: true, attempts: 2, latencyMs: 2500 }), {}, "a second go is not a quick start");
  assert.deepEqual(turnPoints({ surface: "call", corrected: true, attempts: 1, latencyMs: 6000 }), {}, "too long a pause");
  assert.deepEqual(turnPoints({ surface: "chat", corrected: true, attempts: 1, latencyMs: 1000 }), {}, "chat has no pause to measure");
});

test("stages follow each element's own thresholds", () => {
  assert.equal(stageOf("words", 0), 1);
  assert.equal(stageOf("words", 5), 2);
  assert.equal(stageOf("words", 100), 6);
  assert.equal(stageOf("accuracy", 9), 1);
  assert.equal(stageOf("accuracy", 10), 2);
  assert.equal(stageOf("pronunciation", 3), 2);
});

test("a phrase mastered once keeps counting after it slips back; understood phrases grow listening", () => {
  let ledger = withState(emptyLedger("ja", T0), "コーヒーをください", "mastered", T0 - 2 * DAY);
  ledger = withState(ledger, "すみません", "learned", T0 - DAY, true);
  let record = absorbLedger(emptyGrowth(), ledger, T0, 540);
  let view = growthView({ record, ledger, now: T0, offset: 540 });
  assert.equal(view.elements.find((e) => e.id === "words")!.points, 1);
  assert.equal(view.elements.find((e) => e.id === "listening")!.points, 1);
  assert.deepEqual(view.elements.find((e) => e.id === "words")!.leaves, ["コーヒーをください"]);

  // It slips back to learned: the ledger forgets it was mastered, growth does not.
  const key = Object.keys(ledger.items).find((k) => ledger.items[k]!.text === "コーヒーをください")!;
  ledger = { ...ledger, items: { ...ledger.items, [key]: { ...ledger.items[key]!, state: "learned", masteredAt: undefined } } };
  const again = absorbLedger(record, ledger, T0 + DAY, 540);
  assert.equal(again, record, "nothing new: the same record comes back, so nothing is written");
  view = growthView({ record: again, ledger, now: T0 + DAY, offset: 540 });
  assert.equal(view.elements.find((e) => e.id === "words")!.points, 1);
  record = again;
});

test("days are the learner's, the week and the last fortnight add up, and an element rests after fourteen quiet days", () => {
  let record = emptyGrowth();
  // 23:30 UTC is the next morning in Seoul.
  const lateUtc = Date.UTC(2026, 9, 15, 23, 30, 0);
  record = applyTurn(record, { surface: "chat", corrected: false, alreadyNatural: true }, lateUtc, 540);
  record = applyTurn(record, { surface: "chat", corrected: false }, T0 - 3 * DAY, 540);
  assert.equal(record.days.accuracy?.["2026-10-16"], 1);
  const view = growthView({ record, ledger: emptyLedger("en", T0), now: T0, offset: 540 });
  const accuracy = view.elements.find((e) => e.id === "accuracy")!;
  assert.equal(accuracy.points, 2);
  assert.equal(accuracy.week, 2);
  assert.equal(accuracy.daily.length, 14);
  assert.equal(accuracy.daily[13], 1);
  assert.equal(accuracy.resting, false);
  const later = growthView({ record, ledger: emptyLedger("en", T0), now: T0 + RESTING_AFTER_MS + DAY, offset: 540 });
  assert.equal(later.elements.find((e) => e.id === "accuracy")!.resting, true);
  assert.equal(later.elements.find((e) => e.id === "accuracy")!.points, 2, "resting never shrinks it");
});

test("grow next: the lowest stage among measured elements, ticked gaps first, kept for the day", () => {
  let record = emptyGrowth();
  for (let i = 0; i < 12; i++) record = applyTurn(record, { surface: "chat", corrected: false, alreadyNatural: true }, T0 - DAY, 0);
  const view = growthView({
    record,
    ledger: emptyLedger("en", T0),
    selfCheck: { gaps: ["listening", "speaking"], focus: [], at: T0 },
    now: T0,
  });
  assert.equal(view.next, "listening", "stage 1 elements tie; the first ticked gap wins");
  const pron = view.elements.find((e) => e.id === "pronunciation")!;
  assert.equal(pron.measured, false, "nothing to count yet: never picked");
  assert.equal(pickNext(view.elements, null, { day: "2026-10-16", id: "natural" }, "2026-10-16"), "natural", "kept for the day");
  assert.equal(pickNext(view.elements, null, { day: "2026-10-15", id: "natural" }, "2026-10-16"), "speaking", "a new day, a new pick");
});
