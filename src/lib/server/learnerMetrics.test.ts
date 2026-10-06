import assert from "node:assert/strict";
import { test } from "node:test";
import {
  LEARNER_METRICS_TTL_SECONDS,
  LEARNER_TEXT_TTL_SECONDS,
  confidenceFromLogprobs,
  correctionDistance,
  eventsKey,
  maskPersonal,
  noteRecognition,
  optOutKey,
  recordLearnerTurn,
  textKey,
  type LearnerTurnMetric,
} from "./learnerMetrics.ts";
import { noteSentenceWritten } from "./entitlementStore.ts";
import { kvGetJson, kvListRange, kvSetJson } from "./kv.ts";
import { SHARED_ANONYMOUS_ID } from "./identity.ts";
import { contentHash } from "../roleplay/script.ts";

// No KV credentials here, so this runs against the in-memory fallback, which
// is process-wide: every test uses its own user id.

const T0 = Date.UTC(2026, 9, 7, 12, 0, 0);

function base(userId: string, overrides: Partial<Parameters<typeof recordLearnerTurn>[0]> = {}) {
  return {
    userId,
    surface: "call" as const,
    language: "es",
    uiLanguage: "en",
    sessionId: `${userId}-session`,
    turnIndex: 0,
    text: "Ayer yo voy al museo con mi hermana.",
    spoken: true,
    appVersion: "2.60.0",
    now: T0,
    ...overrides,
  };
}

async function rows(userId: string, at = T0): Promise<LearnerTurnMetric[]> {
  return (await kvListRange(eventsKey(userId, at))).map((row) => JSON.parse(row));
}

function expiresInSeconds(key: string): number | null {
  const store = (globalThis as { __kvMemory?: Map<string, { expiresAt: number | null }> }).__kvMemory;
  const row = store?.get(key);
  return row?.expiresAt ? Math.round((row.expiresAt - Date.now()) / 1000) : null;
}

test("a turn is measured and the words are not kept while the store is off", async () => {
  delete process.env.LEARNER_TEXT_STORE;
  await recordLearnerTurn(base("rc:lm-off"));
  const [row] = await rows("rc:lm-off");
  assert.equal(row.speaker, "user");
  assert.equal(row.utterance_length, [..."Ayer yo voy al museo con mi hermana."].length);
  assert.equal(row.utterance_words, 8);
  assert.equal(row.speech_act, null);
  assert.equal(row.cefr_estimate, null);
  assert.deepEqual(row.error_types, []);
  assert.equal(row.annotator_version, null);
  assert.ok(!JSON.stringify(row).includes("museo"), "a measurement row never carries the words");
  assert.deepEqual(await kvListRange(textKey("rc:lm-off", T0)), [], "no text row while the store is off");
});

test("the words are kept, masked, only when the store is switched on", async () => {
  process.env.LEARNER_TEXT_STORE = "on";
  try {
    await recordLearnerTurn(
      base("rc:lm-on", { text: "Mi número es 010-1234-5678 y mi correo es ana@example.com" }),
    );
    const [kept] = (await kvListRange(textKey("rc:lm-on", T0))).map((row) => JSON.parse(row));
    assert.ok(kept.text.includes("[number]") && kept.text.includes("[email]"));
    assert.ok(!kept.text.includes("5678") && !kept.text.includes("example.com"));
  } finally {
    delete process.env.LEARNER_TEXT_STORE;
  }
  // "true", "1", "yes" are not "on".
  process.env.LEARNER_TEXT_STORE = "true";
  try {
    await recordLearnerTurn(base("rc:lm-almost"));
    assert.deepEqual(await kvListRange(textKey("rc:lm-almost", T0)), []);
  } finally {
    delete process.env.LEARNER_TEXT_STORE;
  }
});

test("measurements live four hundred days, words a year", async () => {
  process.env.LEARNER_TEXT_STORE = "on";
  try {
    await recordLearnerTurn(base("rc:lm-ttl"));
  } finally {
    delete process.env.LEARNER_TEXT_STORE;
  }
  const events = expiresInSeconds(eventsKey("rc:lm-ttl", T0));
  const text = expiresInSeconds(textKey("rc:lm-ttl", T0));
  assert.ok(events !== null && Math.abs(events - LEARNER_METRICS_TTL_SECONDS) < 5);
  assert.ok(text !== null && Math.abs(text - LEARNER_TEXT_TTL_SECONDS) < 5);
  assert.ok(LEARNER_METRICS_TTL_SECONDS >= 366 * 24 * 60 * 60, "long enough to compare a month with last year's");
});

test("the recogniser's confidence finds its turn by the words, not by request", async () => {
  await noteRecognition("rc:lm-asr", "Ayer yo voy al  museo con mi hermana.", 0.82);
  await recordLearnerTurn(base("rc:lm-asr", { text: "ayer yo voy al museo con mi hermana." }));
  const [row] = await rows("rc:lm-asr");
  assert.equal(row.asr_confidence, 0.82);
  // A typed line never takes a spoken one's confidence.
  await recordLearnerTurn(base("rc:lm-asr", { spoken: false, sessionId: null }));
  const typed = (await rows("rc:lm-asr"))[1];
  assert.equal(typed.asr_confidence, null);
});

test("a conversation's second turn knows how long since its first, and the session is written once", async () => {
  await recordLearnerTurn(base("rc:lm-gap", { turnIndex: 0 }));
  await recordLearnerTurn(base("rc:lm-gap", { turnIndex: 1, now: T0 + 14_000 }));
  const [first, second] = await rows("rc:lm-gap");
  assert.equal(first.server_turn_gap_ms, null);
  assert.equal(second.server_turn_gap_ms, 14_000);
  assert.equal(second.response_latency_ms, null, "the gap is not passed off as latency");
  const session = await kvGetJson<{ mission_id: unknown; started_at: string }>("lm:session:rc:lm-gap-session");
  assert.equal(session?.mission_id, null);
  assert.equal(session?.started_at, new Date(T0).toISOString());
});

test("a correction is recorded as whether and how much, never as what", async () => {
  await recordLearnerTurn(base("rc:lm-fix", { corrected: "Ayer fui al museo con mi hermana." }));
  await recordLearnerTurn(base("rc:lm-fix", { text: "Fui al museo.", corrected: "" }));
  await recordLearnerTurn(base("rc:lm-fix", { text: "Fui al museo." }));
  const [changed, fine, unknown] = await rows("rc:lm-fix");
  assert.equal(changed.had_correction, true);
  assert.ok((changed.correction_distance ?? 0) > 0);
  assert.equal(fine.had_correction, false);
  assert.equal(fine.correction_distance, 0);
  assert.equal(unknown.had_correction, null, "no verdict when nothing was decided");
  assert.ok(!JSON.stringify(changed).includes("fui"));
});

test("nobody in particular is not recorded", async () => {
  await recordLearnerTurn(base(SHARED_ANONYMOUS_ID));
  assert.deepEqual(await rows(SHARED_ANONYMOUS_ID), []);
});

test("a write that goes wrong does not reach the turn", async () => {
  // An impossible date fails inside the writer; the promise still resolves.
  await assert.doesNotReject(recordLearnerTurn(base("rc:lm-bad", { now: Number.NaN })));
  await assert.doesNotReject(noteRecognition("rc:lm-bad", "hola", null));
});

test("the arithmetic", () => {
  assert.equal(confidenceFromLogprobs([{ logprob: 0 }, { logprob: 0 }]), 1);
  assert.equal(confidenceFromLogprobs([]), null);
  assert.equal(confidenceFromLogprobs("nope"), null);
  assert.ok((confidenceFromLogprobs([{ logprob: -0.1 }, { logprob: -2.3 }]) ?? 1) < 0.5);
  assert.equal(correctionDistance("Fui al museo.", "fui al museo."), 0);
  assert.equal(correctionDistance("voy", "fui"), 3);
  assert.equal(maskPersonal("call me at +82 10 1234 5678"), "call me at [number]");
});

test("a written line keeps where it was said, beside what it already kept", async () => {
  const line = "¡Qué bien! ¿Qué museo visitaste?";
  const hash = contentHash(line);
  for (let index = 0; index < 55; index += 1) {
    await noteSentenceWritten("es", line, {
      scenario_id: "open-talk-es",
      node_id: "talk",
      mode: "free",
      level: 3,
      prev_tutor_hash: null,
      prev_turn_ref: { session_id: "s1", turn_index: index },
    });
  }
  const contexts = (await kvListRange(`bank:written:ctx:es:${hash}`)).map((row) => JSON.parse(row));
  assert.equal(contexts.length, 50, "the latest fifty sightings");
  assert.equal(contexts.at(-1).prev_turn_ref.turn_index, 54);
  // What was kept before is kept as before.
  const kept = await kvGetJson<{ text: string }>(`bank:written:text:es:${hash}`);
  assert.equal(kept?.text, line);
  // And without a context, nothing new is written.
  await noteSentenceWritten("es", "Otra línea.");
  assert.deepEqual(await kvListRange(`bank:written:ctx:es:${contentHash("Otra línea.")}`), []);
});

test("someone who asked us to stop is not recorded again", async () => {
  await kvSetJson(optOutKey("rc:lm-stop"), { at: new Date(T0).toISOString() });
  await noteRecognition("rc:lm-stop", "hola", 0.9);
  await recordLearnerTurn(base("rc:lm-stop"));
  assert.deepEqual(await rows("rc:lm-stop"), []);
});
