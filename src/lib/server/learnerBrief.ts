/**
 * The learner brief for one learning language, ready for a tutor's prompt
 * (learner/brief.ts): read from the ledger, the recurring mistakes and the last
 * two weeks of turn measurements, and kept for ten minutes so a call does not
 * read it all again on every turn.
 *
 * Every read swallows its own failure: a brief that cannot be built is an
 * empty one, and the conversation carries on as it did before briefs existed.
 */
import { kvDelete, kvGetJson, kvListRange, kvSetJson } from "./kv.ts";
import { isIdentified } from "./identity.ts";
import { readLedger } from "./ledgerStore.ts";
import { readWeakRecord } from "./weakPointStore.ts";
import { eventsKey, type LearnerTurnMetric } from "./learnerMetrics.ts";
import { readSelfCheck } from "./selfCheckStore.ts";
import { stageById, stageProgress } from "../curriculum/stages/index.ts";
import type { Ledger } from "../learner/ledger.ts";

/** 고른 단계의 겨냥과 아직 숙지 안 한 표현(튜터 요약용). 다른 학습 언어의 단계면 없음. */
function stageBrief(stageId: string | undefined, language: string, ledger: Ledger) {
  const stage = stageById(stageId);
  if (!stage || !stage.id.startsWith(`${language}-`)) return null;
  return { aim: stage.title.en, open: stageProgress(stage, ledger).open };
}
import { readGrowthRecord } from "./growthStore.ts";
import { recentStuckPhrases } from "../learner/growth.ts";
import {
  BRIEF_WINDOW_MS,
  buildBrief,
  turnStats,
  type LearnerBrief,
  type TurnSample,
} from "../learner/brief.ts";

const BRIEF_TTL_SECONDS = 10 * 60;
/** An empty brief is kept only briefly: the next turn may be the one that fills it. */
const EMPTY_BRIEF_TTL_SECONDS = 60;
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

/** The last two weeks of turn measurements in one language, as the brief reads them. */
export async function readTurnStats(userId: string, language: string, now = Date.now()) {
  return turnStats(await recentSamples(userId, now), language, now);
}

export async function readLearnerBrief(userId: string, language: string, now = Date.now()): Promise<LearnerBrief> {
  if (!isIdentified(userId)) return EMPTY;
  try {
    const cached = await kvGetJson<LearnerBrief>(briefKey(userId, language));
    if (cached && Array.isArray(cached.notes) && typeof cached.prompt === "string") return cached;
    const [ledger, weak, samples, selfCheck, growth] = await Promise.all([
      readLedger(userId, language, now),
      readWeakRecord(userId, language),
      recentSamples(userId, now),
      readSelfCheck(userId, language),
      readGrowthRecord(userId, language),
    ]);
    const brief = buildBrief({
      ledger,
      weak,
      stats: turnStats(samples, language, now),
      selfCheck,
      stuckPhrases: recentStuckPhrases(growth, now),
      stage: stageBrief(selfCheck?.stage, language, ledger),
      now,
    });
    await kvSetJson(
      briefKey(userId, language),
      brief,
      brief.notes.length ? BRIEF_TTL_SECONDS : EMPTY_BRIEF_TTL_SECONDS,
    );
    return brief;
  } catch (error) {
    console.error("[learner-brief]", error);
    return EMPTY;
  }
}

/**
 * Drop the kept brief once a turn has been recorded, so the next chat turn is
 * told what this one added. Calls do not do this: there the cache is what keeps
 * a turn from waiting on the reads, and a brief minutes old is good enough.
 */
export async function forgetLearnerBrief(userId: string, language: string): Promise<void> {
  if (!isIdentified(userId)) return;
  try {
    await kvDelete([briefKey(userId, language)]);
  } catch {
    // Expires on its own.
  }
}
