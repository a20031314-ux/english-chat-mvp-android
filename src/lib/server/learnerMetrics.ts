/**
 * What a learner's turns measured, kept for later — without what they said.
 *
 * The rule this follows is narrow on purpose: keep now only what could not be
 * recovered later. How long someone took to answer, how sure the recogniser
 * was, how long the sentence ran, whether it needed correcting — each exists
 * for the length of a request and is gone after it. A personalised curriculum
 * is the eventual reader, and it does not exist yet; this is the record it will
 * need to have started a year before it did.
 *
 * The words themselves are not kept. The fields that would judge them — speech
 * act, CEFR estimate, error types — are here as empty columns with an
 * annotator_version beside them, so a later pass can fill a row and say which
 * judge did. That pass needs text to read, and text is kept only with
 * LEARNER_TEXT_STORE=on, which is off: rows written while it is off will keep
 * those columns empty for good. had_correction and correction_distance are the
 * exception, because they come free from a correction the app already makes
 * and would otherwise be thrown away.
 *
 * Covered by the privacy policy as "information about the conversation that
 * does not contain your words", kept fourteen months; the words, if ever kept,
 * twelve (src/app/privacy/page.tsx). Rows are keyed by the anonymous app id and
 * nothing else, which is also what a deletion request is answered by
 * (scripts/learner-metrics.mjs).
 *
 * Every write here swallows its own failure. A lost row costs one data point;
 * a thrown one would cost the learner their turn.
 */
import { kvGetJson, kvListPush, kvSetJson } from "./kv.ts";
import { isIdentified } from "./identity.ts";
// Relative, not "@/": scripts/ imports this through Node, which cannot resolve
// the alias (the same reason entitlementStore.ts gives).
import { contentHash } from "../roleplay/script.ts";

export const LEARNER_METRICS_SCHEMA_VERSION = 1;

/** Four hundred days: a month next year can be read beside the same month this year. */
export const LEARNER_METRICS_TTL_SECONDS = 400 * 24 * 60 * 60;

/** The words, if they are ever kept: the policy's twelve months. */
export const LEARNER_TEXT_TTL_SECONDS = 365 * 24 * 60 * 60;

/**
 * How long a transcription waits to be matched to the turn it became.
 *
 * Recognition and the turn are two requests: the app records, sends the audio,
 * gets text back, and only then sends the turn. Nothing ties them together but
 * the person and the words, so the recogniser's verdict is held under a hash of
 * the text for as long as that round trip could take, and no longer.
 */
const ASR_JOIN_TTL_SECONDS = 5 * 60;

/** Within a call, the request before this one — what `server_turn_gap_ms` is measured from. */
const LAST_TURN_TTL_SECONDS = 60 * 60;

/**
 * Where a turn came from. The call tab only, on purpose: what this is for is
 * spoken turns, and the chat is not measured (2026-10-07). "chat" and
 * "how_to_say" rows exist from the few hours before that was decided and are
 * kept readable rather than rewritten.
 */
export type Surface = "call" | "review" | "chat" | "how_to_say";

export type LearnerTurnMetric = {
  v: number;
  session_id: string | null;
  /** Turns of this conversation that reached the server before this one. */
  turn_index: number | null;
  speaker: "user";
  surface: Surface;
  language: string;
  ui_language: string | null;
  /**
   * Silence before they began to answer, as the app measured it. Only sent
   * today for a turn the learner asked to review; the app has the number for
   * every turn and sending it is a client change (2.61).
   */
  response_latency_ms: number | null;
  /**
   * Time since the previous request of the same conversation reached the
   * server. Not response latency — it includes the character speaking and the
   * recognition round trip — and named apart so it is never mistaken for it.
   */
  server_turn_gap_ms: number | null;
  /** Geometric mean of the recogniser's token probabilities, 0–1. Spoken turns only. */
  asr_confidence: number | null;
  /** Characters, Unicode code points. */
  utterance_length: number | null;
  utterance_words: number | null;
  speech_act: string | null;
  cefr_estimate: string | null;
  error_types: string[];
  /** Which judge filled the three fields above. Null until one has. */
  annotator_version: string | null;
  /** Whether the app's own correction changed their sentence. */
  had_correction: boolean | null;
  /** Characters changed between what they said and the correction. */
  correction_distance: number | null;
  attempts: number | null;
  app_version: string | null;
  created_at: string;
};

export type LearnerSession = {
  v: number;
  session_id: string;
  user_id: string;
  surface: Surface;
  scenario_id: string | null;
  /** No missions exist yet. The column is here so the first one has somewhere to go. */
  mission_id: string | null;
  language: string;
  ui_language: string | null;
  started_at: string;
  app_version: string | null;
};

function monthOf(at: number): string {
  const date = new Date(at);
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}

export function eventsKey(userId: string, at: number): string {
  return `lm:events:${userId}:${monthOf(at)}`;
}

export function textKey(userId: string, at: number): string {
  return `lm:text:${userId}:${monthOf(at)}`;
}

function sessionKey(sessionId: string): string {
  return `lm:session:${sessionId}`;
}

function lastTurnKey(sessionId: string): string {
  return `lm:lastturn:${sessionId}`;
}

/**
 * Someone who asked us to stop. Kept without expiry, because a request to stop
 * keeping records does not lapse; written by scripts/learner-metrics.mjs.
 */
export function optOutKey(userId: string): string {
  return `lm:optout:${userId}`;
}

async function optedOut(userId: string): Promise<boolean> {
  return Boolean(await kvGetJson<{ at: string }>(optOutKey(userId)));
}

function asrKey(userId: string, text: string): string {
  return `lm:asr:${userId}:${contentHash(normalizeForJoin(text))}`;
}

function normalizeForJoin(text: string): string {
  return text.replace(/\s+/g, " ").trim().toLowerCase();
}

/** Off unless set to exactly "on". Read per call, so turning it on needs no code. */
export function learnerTextStoreEnabled(): boolean {
  return process.env.LEARNER_TEXT_STORE?.trim() === "on";
}

export function utteranceLength(text: string): { chars: number; words: number } {
  const trimmed = text.trim();
  if (!trimmed) return { chars: 0, words: 0 };
  // Words by whitespace, which undercounts languages written without spaces;
  // chars is the comparable figure across languages.
  return { chars: [...trimmed].length, words: trimmed.split(/\s+/).length };
}

/**
 * Edit distance in characters, capped so a long line cannot cost a long time.
 * Case and surrounding space are ignored; a correction that only changed
 * those is not a correction.
 */
export function correctionDistance(said: string, corrected: string, cap = 300): number {
  const a = [...said.trim().toLowerCase()].slice(0, cap);
  const b = [...corrected.trim().toLowerCase()].slice(0, cap);
  let previous = Array.from({ length: b.length + 1 }, (_, index) => index);
  for (let i = 1; i <= a.length; i += 1) {
    const current = [i];
    for (let j = 1; j <= b.length; j += 1) {
      current[j] = Math.min(
        previous[j] + 1,
        current[j - 1] + 1,
        previous[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
    }
    previous = current;
  }
  return previous[b.length];
}

/** Turn token log-probabilities into one 0–1 figure, or null when there are none. */
export function confidenceFromLogprobs(logprobs: unknown): number | null {
  if (!Array.isArray(logprobs) || logprobs.length === 0) return null;
  const values = logprobs
    .map((entry) => (entry && typeof entry === "object" ? (entry as { logprob?: unknown }).logprob : null))
    .filter((value): value is number => typeof value === "number" && Number.isFinite(value));
  if (values.length === 0) return null;
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  return Math.round(Math.exp(mean) * 1000) / 1000;
}

/**
 * Hide what a learner should not have said into a microphone.
 *
 * Only used if the words are ever kept. Addresses, phone numbers and long
 * runs of digits (card, account, ID numbers) are the things people say aloud
 * without thinking; this catches their shapes, not every case.
 */
export function maskPersonal(text: string): string {
  return text
    .replace(/[\w.+-]+@[\w-]+(\.[\w-]+)+/g, "[email]")
    .replace(/\+?\d[\d\s().-]{7,}\d/g, "[number]")
    .replace(/\d{6,}/g, "[number]");
}

/**
 * Hold what the recogniser thought of a transcript until its turn arrives.
 * Keyed by a hash of the words; the words are not stored.
 */
export async function noteRecognition(
  userId: string,
  text: string,
  confidence: number | null,
): Promise<void> {
  try {
    if (!isIdentified(userId) || !text.trim() || (await optedOut(userId))) return;
    await kvSetJson(asrKey(userId, text), { confidence }, ASR_JOIN_TTL_SECONDS);
  } catch {
    // A missed join is a null confidence, nothing more.
  }
}

async function recognitionFor(userId: string, text: string): Promise<number | null> {
  if (!text.trim()) return null;
  const row = await kvGetJson<{ confidence: number | null }>(asrKey(userId, text));
  return row?.confidence ?? null;
}

type TurnInput = {
  userId: string;
  surface: Surface;
  language: string;
  uiLanguage: string | null;
  sessionId: string | null;
  turnIndex: number | null;
  /** What they said or typed. Measured here; kept only if the store is on. */
  text: string;
  spoken: boolean;
  corrected?: string | null;
  responseLatencyMs?: number | null;
  attempts?: number | null;
  scenarioId?: string | null;
  appVersion: string | null;
  now: number;
};

/**
 * Write one learner turn's measurements, and its session the first time.
 * Never throws.
 */
export async function recordLearnerTurn(input: TurnInput): Promise<void> {
  try {
    if (!isIdentified(input.userId) || (await optedOut(input.userId))) return;
    const { chars, words } = utteranceLength(input.text);

    let gap: number | null = null;
    if (input.sessionId) {
      const last = await kvGetJson<{ at: number }>(lastTurnKey(input.sessionId));
      if (last?.at) gap = Math.max(0, input.now - last.at);
      await kvSetJson(lastTurnKey(input.sessionId), { at: input.now }, LAST_TURN_TTL_SECONDS);
      const existing = await kvGetJson<LearnerSession>(sessionKey(input.sessionId));
      if (!existing) {
        const session: LearnerSession = {
          v: LEARNER_METRICS_SCHEMA_VERSION,
          session_id: input.sessionId,
          user_id: input.userId,
          surface: input.surface,
          scenario_id: input.scenarioId ?? null,
          mission_id: null,
          language: input.language,
          ui_language: input.uiLanguage,
          started_at: new Date(input.now).toISOString(),
          app_version: input.appVersion,
        };
        await kvSetJson(sessionKey(input.sessionId), session, LEARNER_METRICS_TTL_SECONDS);
      }
    }

    const corrected = input.corrected?.trim() ?? "";
    const hadCorrection =
      input.corrected === undefined
        ? null
        : Boolean(corrected) && corrected.toLowerCase() !== input.text.trim().toLowerCase();

    const metric: LearnerTurnMetric = {
      v: LEARNER_METRICS_SCHEMA_VERSION,
      session_id: input.sessionId,
      turn_index: input.turnIndex,
      speaker: "user",
      surface: input.surface,
      language: input.language,
      ui_language: input.uiLanguage,
      response_latency_ms: input.responseLatencyMs ?? null,
      server_turn_gap_ms: gap,
      asr_confidence: input.spoken ? await recognitionFor(input.userId, input.text) : null,
      utterance_length: chars,
      utterance_words: words,
      speech_act: null,
      cefr_estimate: null,
      error_types: [],
      annotator_version: null,
      had_correction: hadCorrection,
      correction_distance: hadCorrection ? correctionDistance(input.text, corrected) : hadCorrection === false ? 0 : null,
      attempts: input.attempts ?? null,
      app_version: input.appVersion,
      created_at: new Date(input.now).toISOString(),
    };
    await kvListPush(eventsKey(input.userId, input.now), [JSON.stringify(metric)], LEARNER_METRICS_TTL_SECONDS);

    // The words, only if someone has decided they may be kept. Off by default
    // and off now; turning it on is an environment change, not a code change.
    if (learnerTextStoreEnabled() && input.text.trim()) {
      await kvListPush(
        textKey(input.userId, input.now),
        [
          JSON.stringify({
            v: LEARNER_METRICS_SCHEMA_VERSION,
            session_id: input.sessionId,
            turn_index: input.turnIndex,
            surface: input.surface,
            language: input.language,
            text: maskPersonal(input.text.trim()).slice(0, 500),
            created_at: metric.created_at,
          }),
        ],
        LEARNER_TEXT_TTL_SECONDS,
      );
    }
  } catch {
    // Measuring is not the product.
  }
}
