/**
 * The learner brief for one learning language, ready for a tutor's prompt
 * (learner/brief.ts): read from the ledger, the recurring mistakes and the last
 * two weeks of turn measurements, and kept for ten minutes so a call does not
 * read it all again on every turn.
 *
 * Every read swallows its own failure: a brief that cannot be built is an
 * empty one, and the conversation carries on as it did before briefs existed.
 */
import { kvGetJson, kvListRange, kvSetJson } from "./kv.ts";
import { isIdentified } from "./identity.ts";
import { readLedger } from "./ledgerStore.ts";
import { readWeakRecord } from "./weakPointStore.ts";
import { eventsKey, type LearnerTurnMetric } from "./learnerMetrics.ts";
import {
  BRIEF_WINDOW_MS,
  buildBrief,
  turnStats,
  type LearnerBrief,
  type TurnSample,
} from "../learner/brief.ts";

const BRIEF_TTL_SECONDS = 10 * 60;
/** The newest rows of a month are the ones that can fall inside the window. */
const ROWS_PER_MONTH = 1500;
const EMPTY: LearnerBrief = { notes: [], prompt: "" };

function briefKey(userId: string, language: string): string {
  return `brief:v1:${userId}:${language}`;
}

function toSample(raw: string): TurnSample | null {
  try {
    const row = JSON.parse(raw) as Partial<LearnerTurnMetric>;
    const at = Date.parse(row.created_at ?? "");
    if (!Number.isFinite(at) || typeof row.language !== "string") return null;
    return {
      surface: String(row.surface ?? ""),
      language: row.language,
      at,
      hadCorrection: typeof row.had_correction === "boolean" ? row.had_correction : null,
      latencyMs: typeof row.response_latency_ms === "number" ? row.response_latency_ms : null,
      attempts: typeof row.attempts === "number" ? row.attempts : null,
    };
  } catch {
    return null;
  }
}

async function recentSamples(userId: string, now: number): Promise<TurnSample[]> {
  const keys = [...new Set([eventsKey(userId, now - BRIEF_WINDOW_MS), eventsKey(userId, now)])];
  const rows = (await Promise.all(keys.map((key) => kvListRange(key, -ROWS_PER_MONTH, -1)))).flat();
  return rows.map(toSample).filter((sample): sample is TurnSample => sample !== null);
}

export async function readLearnerBrief(userId: string, language: string, now = Date.now()): Promise<LearnerBrief> {
  if (!isIdentified(userId)) return EMPTY;
  try {
    const cached = await kvGetJson<LearnerBrief>(briefKey(userId, language));
    if (cached && Array.isArray(cached.notes) && typeof cached.prompt === "string") return cached;
    const [ledger, weak, samples] = await Promise.all([
      readLedger(userId, language, now),
      readWeakRecord(userId, language),
      recentSamples(userId, now),
    ]);
    const brief = buildBrief({ ledger, weak, stats: turnStats(samples, language, now), now });
    await kvSetJson(briefKey(userId, language), brief, BRIEF_TTL_SECONDS);
    return brief;
  } catch (error) {
    console.error("[learner-brief]", error);
    return EMPTY;
  }
}
