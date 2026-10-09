import {
  BANDS,
  constructionsFor,
  findConstruction,
  type Band,
} from "./constructions.ts";

/**
 * Where a learner's sentences stand, construction by construction — kept so it
 * can get better, add up, and say what to do next.
 *
 * Three things this was asked to do, and how:
 *
 * 1. A weak construction must be able to stop being weak. So nothing here is a
 *    lifetime count of mistakes. Each construction keeps its last few uses,
 *    right or wrong; a run of correct ones pushes the misses out of the window
 *    and the status moves weak → learning → mastered by itself. A construction
 *    that was weak once and is mastered now is marked as overcome, because that
 *    is the line worth showing.
 * 2. "This is your level now", cumulatively. The constructions are banded
 *    (constructions.ts); the level is the highest band whose share of mastered
 *    constructions — and every band below it — has reached the bar. One row per
 *    week is kept, so the screen can show the level rising over time.
 * 3. What comes next is the learner's choice: shore up weak constructions,
 *    move into the next band, or follow topics; by chat, calls, video or a mix.
 *    The plan lives here, and the map generator reads it with the rest.
 *
 * Only construction ids and outcomes are kept — never the sentences they were
 * read from (see server/learnerMetrics.ts for why the words are not stored).
 *
 * Pure.
 */

export const PROFILE_VERSION = 1;
/** How many recent uses a construction is judged on. */
export const WINDOW = 5;
/** Share of a band's constructions that must be mastered to count as reached. */
export const BAND_BAR = 0.6;
/** Turns read before a level is claimed at all. */
export const MIN_TURNS_FOR_LEVEL = 10;
const HISTORY_WEEKS = 26;

export type Outcome = { id: string; ok: boolean };

export type ConstructionEntry = {
  /** Last uses, oldest first: 1 correct, 0 missed. */
  recent: number[];
  correct: number;
  missed: number;
  /** It was weak at some point. */
  wasWeak: boolean;
  lastAt: number;
};

export type PlanFocus = "weak" | "next" | "topic";
export type PlanMethod = "chat" | "roleplay" | "video" | "mixed";
export type LearnerPlan = { focus: PlanFocus; method: PlanMethod };

export const PLAN_FOCUSES: PlanFocus[] = ["weak", "next", "topic"];
export const PLAN_METHODS: PlanMethod[] = ["chat", "roleplay", "video", "mixed"];
export const DEFAULT_PLAN: LearnerPlan = { focus: "weak", method: "mixed" };

export type WeekRow = {
  /** ISO week, "2026-W41". */
  week: string;
  level: Band | null;
  mastered: number;
  weak: number;
  turns: number;
};

export type LearnerProfile = {
  v: typeof PROFILE_VERSION;
  language: string;
  turns: number;
  entries: Record<string, ConstructionEntry>;
  history: WeekRow[];
  plan: LearnerPlan;
  updatedAt: number;
};

export type ConstructionStatus = "unseen" | "weak" | "learning" | "mastered";

export function emptyProfile(language: string, now = Date.now()): LearnerProfile {
  return {
    v: PROFILE_VERSION,
    language,
    turns: 0,
    entries: {},
    history: [],
    plan: { ...DEFAULT_PLAN },
    updatedAt: now,
  };
}

export function statusOf(entry: ConstructionEntry | undefined): ConstructionStatus {
  if (!entry || entry.recent.length === 0) return "unseen";
  const window = entry.recent.slice(-WINDOW);
  const right = window.filter((value) => value === 1).length;
  const misses = window.length - right;
  const lastTwo = window.slice(-2);
  if (right >= 3 && lastTwo.length === 2 && lastTwo.every((value) => value === 1)) return "mastered";
  if (misses >= 2) return "weak";
  return "learning";
}

/** ISO-8601 week of a timestamp, "YYYY-Www". */
export function isoWeek(now: number): string {
  const date = new Date(now);
  const day = (date.getUTCDay() + 6) % 7; // Monday 0
  const thursday = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() - day + 3));
  const yearStart = Date.UTC(thursday.getUTCFullYear(), 0, 1);
  const week = Math.floor((thursday.getTime() - yearStart) / (7 * 86400000)) + 1;
  return `${thursday.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

/** Mastered share per band, over the constructions that band has. */
export function bandProgress(profile: LearnerProfile): Array<{
  band: Band;
  total: number;
  mastered: number;
  share: number;
}> {
  const list = constructionsFor(profile.language);
  return BANDS.map((band) => {
    const inBand = list.filter((c) => c.band === band);
    const mastered = inBand.filter((c) => statusOf(profile.entries[c.id]) === "mastered").length;
    return {
      band,
      total: inBand.length,
      mastered,
      share: inBand.length ? mastered / inBand.length : 0,
    };
  });
}

/** Highest band reached with every band below it reached too; null until there is enough to say. */
export function currentLevel(profile: LearnerProfile): Band | null {
  if (profile.turns < MIN_TURNS_FOR_LEVEL) return null;
  let level: Band | null = null;
  for (const row of bandProgress(profile)) {
    if (row.total === 0 || row.share < BAND_BAR) break;
    level = row.band;
  }
  return level;
}

/** The band being worked towards: the first one not yet reached. */
export function nextBand(profile: LearnerProfile): Band | null {
  const level = currentLevel(profile);
  const index = level ? BANDS.indexOf(level) + 1 : 0;
  return BANDS[index] ?? null;
}

export function constructionsByStatus(profile: LearnerProfile): Record<ConstructionStatus, string[]> {
  const out: Record<ConstructionStatus, string[]> = { unseen: [], weak: [], learning: [], mastered: [] };
  for (const construction of constructionsFor(profile.language)) {
    out[statusOf(profile.entries[construction.id])].push(construction.id);
  }
  return out;
}

/** Weak once, mastered now. */
export function overcome(profile: LearnerProfile): string[] {
  return Object.entries(profile.entries)
    .filter(([, entry]) => entry.wasWeak && statusOf(entry) === "mastered")
    .map(([id]) => id);
}

function weekRow(profile: LearnerProfile, now: number): WeekRow {
  const byStatus = constructionsByStatus(profile);
  return {
    week: isoWeek(now),
    level: currentLevel(profile),
    mastered: byStatus.mastered.length,
    weak: byStatus.weak.length,
    turns: profile.turns,
  };
}

/**
 * Read one turn's outcomes into the profile. Ids not on the list are ignored;
 * a construction both used well and missed in the same turn counts as missed.
 */
export function applyTurn(
  profile: LearnerProfile,
  outcomes: Outcome[],
  now = Date.now(),
): LearnerProfile {
  const known = constructionsFor(profile.language);
  const allowed = new Set(known.map((c) => c.id));
  const merged = new Map<string, boolean>();
  for (const outcome of outcomes) {
    if (!allowed.has(outcome.id)) continue;
    merged.set(outcome.id, (merged.get(outcome.id) ?? true) && outcome.ok);
  }
  const entries = { ...profile.entries };
  for (const [id, ok] of merged) {
    const before = entries[id] ?? { recent: [], correct: 0, missed: 0, wasWeak: false, lastAt: 0 };
    const recent = [...before.recent, ok ? 1 : 0].slice(-WINDOW * 2);
    const next: ConstructionEntry = {
      recent,
      correct: before.correct + (ok ? 1 : 0),
      missed: before.missed + (ok ? 0 : 1),
      wasWeak: before.wasWeak,
      lastAt: now,
    };
    next.wasWeak = before.wasWeak || statusOf(next) === "weak";
    entries[id] = next;
  }
  const updated: LearnerProfile = {
    ...profile,
    turns: profile.turns + 1,
    entries,
    updatedAt: now,
  };
  const row = weekRow(updated, now);
  const history = [...updated.history.filter((r) => r.week !== row.week), row]
    .sort((a, b) => a.week.localeCompare(b.week))
    .slice(-HISTORY_WEEKS);
  return { ...updated, history };
}

export function withPlan(profile: LearnerProfile, plan: Partial<LearnerPlan>, now = Date.now()): LearnerProfile {
  const focus = PLAN_FOCUSES.includes(plan.focus as PlanFocus) ? (plan.focus as PlanFocus) : profile.plan.focus;
  const method = PLAN_METHODS.includes(plan.method as PlanMethod) ? (plan.method as PlanMethod) : profile.plan.method;
  return { ...profile, plan: { focus, method }, updatedAt: now };
}

/** Read a stored profile; anything malformed gives a fresh one for that language. */
export function parseProfile(value: unknown, language: string): LearnerProfile {
  if (!value || typeof value !== "object") return emptyProfile(language, 0);
  const row = value as Record<string, unknown>;
  if (row.v !== PROFILE_VERSION || row.language !== language) return emptyProfile(language, 0);
  const entries: Record<string, ConstructionEntry> = {};
  const rawEntries = (row.entries && typeof row.entries === "object" ? row.entries : {}) as Record<string, unknown>;
  for (const [id, raw] of Object.entries(rawEntries)) {
    if (!findConstruction(id) || !raw || typeof raw !== "object") continue;
    const e = raw as Record<string, unknown>;
    const recent = Array.isArray(e.recent)
      ? e.recent.filter((v) => v === 0 || v === 1).slice(-WINDOW * 2)
      : [];
    entries[id] = {
      recent: recent as number[],
      correct: typeof e.correct === "number" ? e.correct : 0,
      missed: typeof e.missed === "number" ? e.missed : 0,
      wasWeak: e.wasWeak === true,
      lastAt: typeof e.lastAt === "number" ? e.lastAt : 0,
    };
  }
  const history = Array.isArray(row.history)
    ? (row.history as WeekRow[]).filter(
        (r) => r && typeof r.week === "string" && /^\d{4}-W\d{2}$/.test(r.week),
      ).slice(-HISTORY_WEEKS)
    : [];
  const plan = withPlan(
    emptyProfile(language, 0),
    (row.plan && typeof row.plan === "object" ? row.plan : {}) as Partial<LearnerPlan>,
    0,
  ).plan;
  return {
    v: PROFILE_VERSION,
    language,
    turns: typeof row.turns === "number" ? row.turns : 0,
    entries,
    history,
    plan,
    updatedAt: typeof row.updatedAt === "number" ? row.updatedAt : 0,
  };
}

/**
 * What the map generator is told about this learner, in plain words it can act
 * on: where they are, what is weak, what comes next, and how they want to work.
 */
export function profileBrief(profile: LearnerProfile): {
  level: Band | null;
  weak: string[];
  learning: string[];
  nextBandConstructions: string[];
  plan: LearnerPlan;
} {
  const byStatus = constructionsByStatus(profile);
  const next = nextBand(profile);
  const name = (id: string) => {
    const c = findConstruction(id);
    return c ? `${c.en} (${c.hint})` : id;
  };
  return {
    level: currentLevel(profile),
    weak: byStatus.weak.map(name),
    learning: byStatus.learning.map(name),
    nextBandConstructions: next
      ? constructionsFor(profile.language)
          .filter((c) => c.band === next && statusOf(profile.entries[c.id]) !== "mastered")
          .map((c) => name(c.id))
      : [],
    plan: profile.plan,
  };
}
