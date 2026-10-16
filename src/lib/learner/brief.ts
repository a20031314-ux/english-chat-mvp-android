/**
 * What the tutors are told about one learner, from what has piled up.
 *
 * Every chat and call used to start from nothing but the phrases to bring back
 * (ledger.ts recyclePrompt). This reads the rest of what is kept — the kinds of
 * mistake that recur, the phrases learned and not yet produced, and how the
 * recent turns went (how often a line needed correcting, how long they paused,
 * how often they had another go) — and turns it into a few quiet lines for the
 * tutor, plus the same findings as data a screen can show and switch off
 * (hub/drafts/checklist-start-and-learner-brief.md).
 *
 * Both directions are read, so the tutor neither keeps things easy for someone
 * who has outgrown it nor pushes someone who is stuck. Only the last two weeks
 * count, and nothing is said about turns too few to mean anything.
 *
 * No model call; no words: only kinds of mistake, phrases from the tutor's side
 * of things, and numbers. Pure.
 */

import { phrasesToRecycle, type Ledger } from "./ledger.ts";
import { RECUR_COUNT, RECUR_WINDOW_MS, type WeakRecord } from "../curriculum/weakPoints.ts";
import { GAP_TUTOR_RULE, type GapId, type SelfCheck } from "./selfCheck.ts";

const DAY = 24 * 60 * 60 * 1000;
export const BRIEF_WINDOW_MS = 14 * DAY;
/** Fewer recent turns than this and how they went is not read at all. */
export const MIN_TURNS = 8;
/** Until this many recent turns, what they said about themselves still speaks. */
export const SELF_UNTIL_TURNS = 20;

/** What a recent turn measured, as learnerMetrics keeps it. */
export type TurnSample = {
  surface: string;
  language: string;
  /** ms since epoch. */
  at: number;
  hadCorrection: boolean | null;
  latencyMs: number | null;
  attempts: number | null;
};

export type TurnStats = {
  turns: number;
  /** Share of judged turns whose line needed correcting, 0–1, or null when none were judged. */
  correctionRate: number | null;
  /** Median pause before speaking in calls (ms), or null when not measured. */
  medianLatencyMs: number | null;
  /** Share of turns that took more than one go, 0–1, or null when not measured. */
  retryRate: number | null;
};

export type BriefNote =
  | { kind: "mistakes"; names: string[] }
  | { kind: "recycle"; phrases: string[] }
  | { kind: "easier"; because: Array<"corrections" | "pauses" | "retries"> }
  | { kind: "harder" }
  | { kind: "self"; gaps: GapId[] };

export type LearnerBrief = {
  notes: BriefNote[];
  /** For the tutor, in English. Empty when there is nothing worth saying. */
  prompt: string;
};

function median(values: number[]): number | null {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid]! : Math.round((sorted[mid - 1]! + sorted[mid]!) / 2);
}

export function turnStats(samples: TurnSample[], language: string, now: number): TurnStats {
  const recent = samples.filter((s) => s.language === language && now - s.at <= BRIEF_WINDOW_MS && s.at <= now);
  const judged = recent.filter((s) => s.hadCorrection !== null);
  const latencies = recent
    .filter((s) => s.surface === "call" && typeof s.latencyMs === "number" && s.latencyMs > 0 && s.latencyMs < 60_000)
    .map((s) => s.latencyMs!);
  const tries = recent.filter((s) => typeof s.attempts === "number" && s.attempts > 0);
  return {
    turns: recent.length,
    correctionRate: judged.length ? judged.filter((s) => s.hadCorrection).length / judged.length : null,
    medianLatencyMs: latencies.length >= 3 ? median(latencies) : null,
    retryRate: tries.length >= 3 ? tries.filter((s) => s.attempts! > 1).length / tries.length : null,
  };
}

/** Thresholds, named so the tests and the design note say the same thing. */
export const STRUGGLE = { correctionRate: 0.6, latencyMs: 4000, retryRate: 0.3 } as const;
export const STRETCH = { correctionRate: 0.25, latencyMs: 2500, retryRate: 0.1 } as const;

export function buildBrief(input: {
  ledger: Ledger;
  weak: WeakRecord;
  stats: TurnStats;
  /** What they said about themselves when they started (learner/selfCheck.ts). */
  selfCheck?: SelfCheck | null;
  now: number;
  /** Kinds of note the learner switched off (the screen comes later). */
  off?: ReadonlyArray<BriefNote["kind"]>;
}): LearnerBrief {
  const { stats, now } = input;
  const off = new Set(input.off ?? []);
  const notes: BriefNote[] = [];

  const mistakes = Object.values(input.weak.patterns)
    .map((pattern) => ({ name: pattern.name, recent: pattern.misses.filter((at) => now - at <= RECUR_WINDOW_MS) }))
    .filter((row) => row.recent.length >= RECUR_COUNT && row.name.trim())
    .sort((a, b) => b.recent.length - a.recent.length || b.recent[b.recent.length - 1]! - a.recent[a.recent.length - 1]!)
    .slice(0, 2)
    .map((row) => row.name.trim());
  if (mistakes.length && !off.has("mistakes")) notes.push({ kind: "mistakes", names: mistakes });

  const recycle = phrasesToRecycle(input.ledger, 3, now);
  if (recycle.length && !off.has("recycle")) notes.push({ kind: "recycle", phrases: recycle });

  if (stats.turns >= MIN_TURNS) {
    const because: Array<"corrections" | "pauses" | "retries"> = [];
    if (stats.correctionRate !== null && stats.correctionRate >= STRUGGLE.correctionRate) because.push("corrections");
    if (stats.medianLatencyMs !== null && stats.medianLatencyMs >= STRUGGLE.latencyMs) because.push("pauses");
    if (stats.retryRate !== null && stats.retryRate >= STRUGGLE.retryRate) because.push("retries");
    const easy =
      stats.correctionRate !== null &&
      stats.correctionRate < STRETCH.correctionRate &&
      (stats.medianLatencyMs === null || stats.medianLatencyMs < STRETCH.latencyMs) &&
      (stats.retryRate === null || stats.retryRate < STRETCH.retryRate);
    if (because.length && !off.has("easier")) notes.push({ kind: "easier", because });
    else if (!because.length && easy && !off.has("harder")) notes.push({ kind: "harder" });
  }

  // Early on, what they said is all there is; once the turns speak, they do.
  const gaps = input.selfCheck?.gaps.slice(0, 2) ?? [];
  if (gaps.length && stats.turns < SELF_UNTIL_TURNS && !off.has("self")) notes.push({ kind: "self", gaps });

  return { notes, prompt: briefPrompt(notes) };
}

export function briefPrompt(notes: BriefNote[]): string {
  if (notes.length === 0) return "";
  const lines = [
    "What their own recent practice shows. Use it quietly: never mention it, never quiz or teach, stay a conversation partner.",
  ];
  for (const note of notes) {
    switch (note.kind) {
      case "mistakes":
        lines.push(
          `- Mistakes they keep making: ${note.names.join("; ")}. Now and then, where it fits, ask something whose natural answer needs getting this right. Correction stays where it always is.`,
        );
        break;
      case "recycle":
        lines.push(
          `- Phrases they have been learning but cannot yet produce on their own: ${note.phrases.map((p) => `"${p}"`).join(", ")}. When the conversation gives a natural opening, use one in your own line — at most one per turn, never forced, never pointed out.`,
        );
        break;
      case "easier":
        lines.push(
          "- Lately they have been struggling. Keep your lines short and your words common, ask one thing at a time, and make questions easy to answer (offer a choice when it helps).",
        );
        break;
      case "harder":
        lines.push(
          "- Lately they have been doing well. Stretch them a little: a less common word now and then, and open questions that take more than a few words to answer.",
        );
        break;
      case "self":
        lines.push(`- In their own words when they started, ${note.gaps.map((gap) => GAP_TUTOR_RULE[gap]).join("; and ")}.`);
        break;
    }
  }
  return lines.join("\n");
}
