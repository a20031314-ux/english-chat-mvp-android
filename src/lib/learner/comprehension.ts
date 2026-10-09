import { findExpression } from "../videoIndex/match.ts";
import { segmentWords } from "../wordSegments.ts";

/**
 * What a learner did not understand in what they were told, and how far they
 * have come with it since — the listening half of the profile, beside the
 * sentences they write (profile.ts).
 *
 * Every item is something in a tutor's line they stopped at: a word they tapped
 * for its meaning, a span they had analysed, a part they asked about. It then
 * moves on its own:
 *
 *   stuck      they looked it up
 *   studied    they had it explained — analysed, asked about, or saved it
 *   understood it came back in the tutor's lines and they let it pass, twice,
 *              since they last looked it up
 *   used       they wrote it in a sentence of their own, and the correction
 *              kept it
 *
 * Looking it up again sends an understood item back to stuck: the evidence is
 * that they needed it. A used item stays used — writing it correctly is the
 * strongest thing anyone can show about a phrase.
 *
 * "Let it pass" is read loosely on purpose: an appearance counts as quiet, and
 * a later look-up resets the count. That needs no timing between the tutor's
 * line and the learner's taps, which the server never sees together.
 *
 * Items are expressions from the tutor's text, never the learner's words. A
 * question's own wording stays on the device (sentenceNotes.ts); only what
 * it was about — meaning, grammar, usage, nuance, pronunciation — comes here.
 *
 * Pure.
 */

export const COMPREHENSION_VERSION = 1;
export const QUIET_TO_UNDERSTAND = 2;
const MAX_ITEMS = 400;
const MAX_TEXT = 60;

export type ItemState = "stuck" | "studied" | "understood" | "used";
export type AskAbout = "meaning" | "grammar" | "usage" | "nuance" | "pronunciation" | "other";
export const ASK_ABOUTS: AskAbout[] = ["meaning", "grammar", "usage", "nuance", "pronunciation", "other"];

export type ComprehensionItem = {
  text: string;
  state: ItemState;
  lookups: number;
  studied: number;
  /** Times it appeared in the tutor's lines since the last look-up. */
  quiet: number;
  about: Partial<Record<AskAbout, number>>;
  firstAt: number;
  lastAt: number;
};

export type ComprehensionRecord = {
  v: typeof COMPREHENSION_VERSION;
  language: string;
  items: Record<string, ComprehensionItem>;
  /** Whole tutor lines they asked to have translated. */
  translations: number;
  updatedAt: number;
};

export type ComprehensionEvent =
  | { kind: "lookup"; text: string }
  | { kind: "analyze"; text: string }
  | { kind: "ask"; text: string; about?: AskAbout }
  | { kind: "save"; text: string }
  | { kind: "translate" };

export function emptyComprehension(language: string, now = Date.now()): ComprehensionRecord {
  return { v: COMPREHENSION_VERSION, language, items: {}, translations: 0, updatedAt: now };
}

export function itemKey(text: string): string {
  return text
    .toLowerCase()
    .replace(/[‘’]/g, "'")
    .replace(/[^\p{L}\p{M}\p{N}' ]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, MAX_TEXT);
}

function cleanText(text: string): string {
  return text.replace(/\s+/g, " ").trim().replace(/^[^\p{L}\p{M}\p{N}']+|[^\p{L}\p{M}\p{N}']+$/gu, "").slice(0, MAX_TEXT);
}

function prune(items: Record<string, ComprehensionItem>): Record<string, ComprehensionItem> {
  const entries = Object.entries(items);
  if (entries.length <= MAX_ITEMS) return items;
  entries.sort((a, b) => b[1].lastAt - a[1].lastAt);
  return Object.fromEntries(entries.slice(0, MAX_ITEMS));
}

/** Apply something the learner did with a tutor's line. */
export function applyEvent(
  record: ComprehensionRecord,
  event: ComprehensionEvent,
  now = Date.now(),
): ComprehensionRecord {
  if (event.kind === "translate") {
    return { ...record, translations: record.translations + 1, updatedAt: now };
  }
  const text = cleanText(event.text);
  const key = itemKey(text);
  // A whole long sentence is not an item to follow; a span of a few words is.
  // Counted in words, not spaces: a Japanese sentence has none.
  if (!key || segmentWords(key, record.language).length > 6) return record;
  const before: ComprehensionItem = record.items[key] ?? {
    text,
    state: "stuck",
    lookups: 0,
    studied: 0,
    quiet: 0,
    about: {},
    firstAt: now,
    lastAt: now,
  };
  const item: ComprehensionItem = { ...before, about: { ...before.about }, lastAt: now };
  if (event.kind === "lookup") {
    item.lookups += 1;
    item.quiet = 0;
    if (item.state === "understood") item.state = "stuck";
  } else {
    item.studied += 1;
    item.quiet = 0;
    if (item.state !== "used") item.state = "studied";
    if (event.kind === "ask") {
      const about = event.about && ASK_ABOUTS.includes(event.about) ? event.about : "other";
      item.about[about] = (item.about[about] ?? 0) + 1;
    }
  }
  return {
    ...record,
    items: prune({ ...record.items, [key]: item }),
    updatedAt: now,
  };
}

/**
 * A tutor's line went by. Items that appear in it count one more quiet
 * appearance; enough of them since the last look-up and the item is
 * understood.
 */
export function applyTutorLine(
  record: ComprehensionRecord,
  line: string,
  now = Date.now(),
): ComprehensionRecord {
  let changed = false;
  const items = { ...record.items };
  const lines = [{ start: 0, end: 0, text: line }];
  for (const [key, item] of Object.entries(items)) {
    if (item.state === "used" || item.state === "understood") continue;
    if (findExpression(lines, item.text, record.language).length === 0) continue;
    const quiet = item.quiet + 1;
    items[key] = {
      ...item,
      quiet,
      state: quiet >= QUIET_TO_UNDERSTAND ? "understood" : item.state,
      lastAt: now,
    };
    changed = true;
  }
  return changed ? { ...record, items, updatedAt: now } : record;
}

/**
 * The learner wrote a sentence. Items it contains — and the correction kept —
 * are used.
 */
export function applyLearnerLine(
  record: ComprehensionRecord,
  sentence: string,
  corrected: string,
  now = Date.now(),
): ComprehensionRecord {
  let changed = false;
  const items = { ...record.items };
  const said = [{ start: 0, end: 0, text: sentence }];
  const kept = [{ start: 0, end: 0, text: corrected || sentence }];
  for (const [key, item] of Object.entries(items)) {
    if (item.state === "used") continue;
    if (findExpression(said, item.text, record.language).length === 0) continue;
    if (findExpression(kept, item.text, record.language).length === 0) continue;
    items[key] = { ...item, state: "used", lastAt: now };
    changed = true;
  }
  return changed ? { ...record, items, updatedAt: now } : record;
}

export function countByState(record: ComprehensionRecord): Record<ItemState, number> {
  const out: Record<ItemState, number> = { stuck: 0, studied: 0, understood: 0, used: 0 };
  for (const item of Object.values(record.items)) out[item.state] += 1;
  return out;
}

/** Items in a state, most recent first. */
export function itemsIn(record: ComprehensionRecord, state: ItemState, limit = 20): ComprehensionItem[] {
  return Object.values(record.items)
    .filter((item) => item.state === state)
    .sort((a, b) => b.lastAt - a.lastAt)
    .slice(0, limit);
}

/** What their questions have been about, most first. */
export function askTopics(record: ComprehensionRecord): Array<[AskAbout, number]> {
  const totals: Partial<Record<AskAbout, number>> = {};
  for (const item of Object.values(record.items)) {
    for (const [about, n] of Object.entries(item.about) as Array<[AskAbout, number]>) {
      totals[about] = (totals[about] ?? 0) + n;
    }
  }
  return (Object.entries(totals) as Array<[AskAbout, number]>).sort((a, b) => b[1] - a[1]);
}

export function parseComprehension(value: unknown, language: string): ComprehensionRecord {
  if (!value || typeof value !== "object") return emptyComprehension(language, 0);
  const row = value as Record<string, unknown>;
  if (row.v !== COMPREHENSION_VERSION || row.language !== language) return emptyComprehension(language, 0);
  const items: Record<string, ComprehensionItem> = {};
  const raw = (row.items && typeof row.items === "object" ? row.items : {}) as Record<string, unknown>;
  const states: ItemState[] = ["stuck", "studied", "understood", "used"];
  for (const [key, value] of Object.entries(raw)) {
    if (!value || typeof value !== "object") continue;
    const i = value as Record<string, unknown>;
    const text = typeof i.text === "string" ? cleanText(i.text) : "";
    if (!text || itemKey(text) !== key || !states.includes(i.state as ItemState)) continue;
    const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? v : 0);
    const about: Partial<Record<AskAbout, number>> = {};
    if (i.about && typeof i.about === "object") {
      for (const [k, n] of Object.entries(i.about as Record<string, unknown>)) {
        if (ASK_ABOUTS.includes(k as AskAbout)) about[k as AskAbout] = num(n);
      }
    }
    items[key] = {
      text,
      state: i.state as ItemState,
      lookups: num(i.lookups),
      studied: num(i.studied),
      quiet: num(i.quiet),
      about,
      firstAt: num(i.firstAt),
      lastAt: num(i.lastAt),
    };
  }
  return {
    v: COMPREHENSION_VERSION,
    language,
    items: prune(items),
    translations: typeof row.translations === "number" ? row.translations : 0,
    updatedAt: typeof row.updatedAt === "number" ? row.updatedAt : 0,
  };
}
