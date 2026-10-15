import { findExpression } from "../videoIndex/match.ts";
import { segmentWords } from "../wordSegments.ts";
import { isoWeek } from "./profile.ts";

/**
 * Every expression a learner has met in a language, wherever they met it, and
 * how far they have come with it — one ledger per person and learning
 * language (hub/drafts/expression-ledger.md).
 *
 * Until this, what was learned lived in pieces: the study map's items, the
 * expressions looked up in a tutor's line (comprehension.ts), the word list and
 * the saved subtitles on the device. The same phrase met in a video, saved to
 * the word list and used in a chat was three unrelated facts. Here it is one
 * row: where it was first met, where else, and where it was produced.
 *
 * States follow the study map's rule (curriculum/missions.ts), so a phrase is
 * called the same thing on both screens:
 *
 *   met       looked up, analysed, asked about, or handed as a task
 *   learned   saved to study, or produced with help: a hint, a correction,
 *             or soon after looking it up
 *   mastered  produced without help — kept by the correction, some hours
 *             after the last time help was at hand
 *
 * A mastered phrase that comes out wrong goes back to learned. Hearing a
 * phrase go by in a tutor's line without looking it up again is a mark, not a
 * state: mastery is only ever about producing.
 *
 * Expressions only, from what the learner was shown (a tutor's line, a
 * subtitle, a word they saved, a map task), never a sentence they wrote; the
 * same rule the rest of the learner record keeps (server/learnerMetrics.ts).
 *
 * Pure.
 */

export const LEDGER_VERSION = 1;
/** Help this recent makes a correct use practice, not proof (missions.ts REVIEW_GAP_MS). */
export const FROM_MEMORY_MS = 8 * 60 * 60 * 1000;
export const RETENTION_WINDOW_MS = 30 * 24 * 60 * 60 * 1000;
const HEARD_TO_MARK = 2;
const MAX_ITEMS = 1500;
const MAX_TEXT = 60;
const MAX_PLACES = 5;
const MAX_WORDS = 6;
const HISTORY_WEEKS = 26;

export type LedgerTab = "chat" | "call" | "video" | "vocab" | "map";
export const LEDGER_TABS: LedgerTab[] = ["chat", "call", "video", "vocab", "map"];
export type LedgerState = "met" | "learned" | "mastered";
export type OutputPlace = "chat" | "call" | "mission" | "review";

export type Place = {
  tab: LedgerTab;
  at: number;
  /** A video it was met in, and where in it (seconds). */
  videoId?: string;
  t?: number;
};

export type LedgerItem = {
  text: string;
  state: LedgerState;
  firstMet: Place;
  /** Most recent last. */
  met: Place[];
  /** Produced unaided or with help, most recent last. */
  outputs: Array<{ at: number; where: OutputPlace; unaided: boolean }>;
  /** The last time help with it was at hand: a look-up, a hint, a correction. */
  helpAt: number;
  masteredAt?: number;
  slips: number;
  /** Times it went by in a tutor's line since it was last looked up. */
  heard: number;
  /** Heard often enough without being looked up again. */
  understood?: boolean;
  map?: { mapId: string; topicId: string; missionId: string };
  firstAt: number;
  lastAt: number;
};

export type WeekRow = { week: string; met: number; learned: number; mastered: number };

export type Ledger = {
  v: typeof LEDGER_VERSION;
  language: string;
  items: Record<string, LedgerItem>;
  weeks: WeekRow[];
  updatedAt: number;
};

export function emptyLedger(language: string, now = 0): Ledger {
  return { v: LEDGER_VERSION, language, items: {}, weeks: [], updatedAt: now };
}

export function ledgerKey(text: string): string {
  return text
    .toLowerCase()
    .replace(/[‘’]/g, "'")
    .replace(/[^\p{L}\p{M}\p{N}' ]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, MAX_TEXT);
}

function cleanText(text: string): string {
  return text
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^[^\p{L}\p{M}\p{N}']+|[^\p{L}\p{M}\p{N}']+$/gu, "")
    .slice(0, MAX_TEXT);
}

/** A span of a few words is a phrase to follow; a whole sentence is not. Counted in words, so Japanese and Thai count too. */
export function isLedgerText(text: string, language: string): boolean {
  const key = ledgerKey(cleanText(text));
  return Boolean(key) && segmentWords(key, language).length <= MAX_WORDS;
}

const RANK: Record<LedgerState, number> = { met: 0, learned: 1, mastered: 2 };

function prune(items: Record<string, LedgerItem>): Record<string, LedgerItem> {
  const entries = Object.entries(items);
  if (entries.length <= MAX_ITEMS) return items;
  // What goes first: met and never taken further, least recent first.
  entries.sort((a, b) => RANK[b[1].state] - RANK[a[1].state] || b[1].lastAt - a[1].lastAt);
  return Object.fromEntries(entries.slice(0, MAX_ITEMS));
}

function withWeek(ledger: Ledger, now: number): Ledger {
  const counts = countLedger(ledger);
  const row: WeekRow = { week: isoWeek(now), met: counts.met, learned: counts.learned, mastered: counts.mastered };
  const weeks = ledger.weeks.filter((w) => w.week !== row.week);
  return { ...ledger, weeks: [...weeks, row].slice(-HISTORY_WEEKS), updatedAt: now };
}

function place(where: Omit<Place, "at">, now: number): Place {
  return {
    tab: where.tab,
    at: now,
    ...(where.videoId ? { videoId: where.videoId.slice(0, 20) } : {}),
    ...(typeof where.t === "number" && Number.isFinite(where.t) ? { t: Math.max(0, Math.round(where.t)) } : {}),
  };
}

export type MeetKind = "lookup" | "analyze" | "ask" | "save" | "task";

/**
 * They met a phrase: looked it up, had it explained, saved it, or were given
 * it as a task. Saving is choosing to study it — learned. The rest is met, and
 * help at hand: a correct use right after is practice.
 */
export function applyMeet(
  ledger: Ledger,
  text: string,
  kind: MeetKind,
  where: Omit<Place, "at">,
  now = Date.now(),
  map?: LedgerItem["map"],
): Ledger {
  const clean = cleanText(text);
  if (!isLedgerText(clean, ledger.language)) return ledger;
  const key = ledgerKey(clean);
  const at = place(where, now);
  const before = ledger.items[key];
  const item: LedgerItem = before
    ? { ...before, met: [...before.met, at].slice(-MAX_PLACES), lastAt: now }
    : {
        text: clean,
        state: "met",
        firstMet: at,
        met: [at],
        outputs: [],
        helpAt: now,
        slips: 0,
        heard: 0,
        firstAt: now,
        lastAt: now,
      };
  if (kind !== "task") {
    item.helpAt = now;
    item.heard = 0;
    item.understood = false;
  }
  if (kind === "save" && item.state === "met") item.state = "learned";
  if (map) item.map = map;
  return withWeek({ ...ledger, items: prune({ ...ledger.items, [key]: item }) }, now);
}

/** A tutor's line went by; phrases in it that they did not look up again count as heard. */
export function applyHeard(ledger: Ledger, line: string, now = Date.now()): Ledger {
  const lines = [{ start: 0, end: 0, text: line }];
  let changed = false;
  const items = { ...ledger.items };
  for (const [key, item] of Object.entries(items)) {
    if (item.understood) continue;
    if (findExpression(lines, item.text, ledger.language).length === 0) continue;
    const heard = item.heard + 1;
    items[key] = { ...item, heard, understood: heard >= HEARD_TO_MARK };
    changed = true;
  }
  return changed ? { ...ledger, items, updatedAt: now } : ledger;
}

function produced(item: LedgerItem, where: OutputPlace, unaided: boolean, now: number): LedgerItem {
  const outputs = [...item.outputs, { at: now, where, unaided }].slice(-MAX_PLACES);
  if (!unaided) return { ...item, outputs, state: item.state === "met" ? "learned" : item.state, lastAt: now };
  return {
    ...item,
    outputs,
    state: "mastered",
    masteredAt: item.state === "mastered" ? item.masteredAt : now,
    lastAt: now,
  };
}

function slipped(item: LedgerItem, now: number): LedgerItem {
  if (item.state !== "mastered") return { ...item, helpAt: now, lastAt: now };
  return { ...item, state: "learned", masteredAt: undefined, slips: item.slips + 1, helpAt: now, lastAt: now };
}

/**
 * A sentence they said in chat or a call, and what the correction kept.
 * Phrases they said and kept are output — unaided once enough time has passed
 * since help with it was at hand. Phrases said and corrected away slip.
 */
export function applyLearnerLine(
  ledger: Ledger,
  sentence: string,
  corrected: string,
  where: "chat" | "call",
  now = Date.now(),
): Ledger {
  const said = [{ start: 0, end: 0, text: sentence }];
  const kept = [{ start: 0, end: 0, text: corrected.trim() || sentence }];
  let changed = false;
  const items = { ...ledger.items };
  for (const [key, item] of Object.entries(items)) {
    if (findExpression(said, item.text, ledger.language).length === 0) continue;
    const correct = findExpression(kept, item.text, ledger.language).length > 0;
    items[key] = correct ? produced(item, where, now - item.helpAt >= FROM_MEMORY_MS, now) : slipped(item, now);
    changed = true;
  }
  return changed ? withWeek({ ...ledger, items }, now) : ledger;
}

/**
 * A map task was checked. Its result already follows the same rule, so it is
 * taken as it is: done with no hints and passed is unaided; otherwise help.
 */
export function applyMissionResult(
  ledger: Ledger,
  expression: string,
  outcome: "unaided" | "helped" | "slip",
  where: "mission" | "review",
  map: LedgerItem["map"],
  now = Date.now(),
): Ledger {
  const met = applyMeet(ledger, expression, "task", { tab: "map" }, now, map);
  const key = ledgerKey(cleanText(expression));
  const item = met.items[key];
  if (!item) return met;
  const next =
    outcome === "slip"
      ? slipped(item, now)
      : outcome === "unaided"
        ? produced(item, where, true, now)
        : { ...produced(item, where, false, now), helpAt: now };
  return withWeek({ ...met, items: { ...met.items, [key]: next } }, now);
}

export function countLedger(ledger: Ledger): Record<LedgerState, number> {
  const out: Record<LedgerState, number> = { met: 0, learned: 0, mastered: 0 };
  for (const item of Object.values(ledger.items)) out[item.state] += 1;
  return out;
}

export type LedgerSummary = {
  counts: Record<LedgerState, number>;
  /** Mastered this ISO week. */
  masteredThisWeek: number;
  /** Of what is mastered, the share produced unaided again in the last 30 days; null with nothing mastered. */
  retention: number | null;
  /** Where what they learned or mastered was first met. */
  bySource: Record<LedgerTab, number>;
  understood: number;
  weeks: WeekRow[];
};

export function summarize(ledger: Ledger, now = Date.now()): LedgerSummary {
  const thisWeek = isoWeek(now);
  const bySource = Object.fromEntries(LEDGER_TABS.map((t) => [t, 0])) as Record<LedgerTab, number>;
  let masteredThisWeek = 0;
  let mastered = 0;
  let kept = 0;
  let understood = 0;
  for (const item of Object.values(ledger.items)) {
    if (item.understood) understood += 1;
    if (item.state !== "met") bySource[item.firstMet.tab] += 1;
    if (item.state !== "mastered") continue;
    mastered += 1;
    if (item.masteredAt && isoWeek(item.masteredAt) === thisWeek) masteredThisWeek += 1;
    if (item.outputs.some((o) => o.unaided && now - o.at <= RETENTION_WINDOW_MS)) kept += 1;
  }
  return {
    counts: countLedger(ledger),
    masteredThisWeek,
    retention: mastered ? kept / mastered : null,
    bySource,
    understood,
    weeks: ledger.weeks,
  };
}

/** Items to list, most recent first, optionally in one state. */
export function ledgerItems(ledger: Ledger, state?: LedgerState, limit = 200): LedgerItem[] {
  return Object.values(ledger.items)
    .filter((item) => !state || item.state === state)
    .sort((a, b) => b.lastAt - a.lastAt)
    .slice(0, limit);
}

/** Phrases already in the ledger found in a line — for "you met this in…" (the next step). */
export function ledgerMatches(ledger: Ledger, line: string): LedgerItem[] {
  const lines = [{ start: 0, end: 0, text: line }];
  return Object.values(ledger.items).filter((item) => findExpression(lines, item.text, ledger.language).length > 0);
}

export function parseLedger(value: unknown, language: string): Ledger | null {
  if (!value || typeof value !== "object") return null;
  const row = value as Partial<Ledger>;
  if (row.v !== LEDGER_VERSION || row.language !== language || !row.items || typeof row.items !== "object") return null;
  return {
    v: LEDGER_VERSION,
    language,
    items: row.items as Record<string, LedgerItem>,
    weeks: Array.isArray(row.weeks) ? (row.weeks as WeekRow[]).slice(-HISTORY_WEEKS) : [],
    updatedAt: typeof row.updatedAt === "number" ? row.updatedAt : 0,
  };
}

export function isLedgerTab(value: unknown): value is LedgerTab {
  return typeof value === "string" && (LEDGER_TABS as string[]).includes(value);
}

/**
 * Learned, not yet mastered, met some time ago: what a tutor can bring back
 * into a conversation so the learner hears it again and has a reason to use
 * it (tab connections, the other direction). Most recently touched first.
 */
export function phrasesToRecycle(ledger: Ledger, limit = 3, now = Date.now()): string[] {
  return Object.values(ledger.items)
    .filter((item) => item.state === "learned" && now - item.helpAt >= 60 * 60 * 1000)
    .sort((a, b) => b.lastAt - a.lastAt)
    .slice(0, limit)
    .map((item) => item.text);
}

/** The few lines a tutor is given about them. Empty when there is nothing to bring back. */
export function recyclePrompt(phrases: string[]): string {
  if (phrases.length === 0) return "";
  return `Phrases this learner has been learning but cannot yet produce on their own: ${phrases
    .map((p) => `"${p}"`)
    .join(", ")}.
When the conversation gives a natural opening, use one of them in your own line — at most one per turn, only where a speaker would really say it, never forced, never pointed out. If none fits, do not use any.`;
}
