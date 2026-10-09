import { constructionsFor, findConstruction, BANDS } from "./constructions.ts";
import { itemsIn, type ComprehensionRecord } from "./comprehension.ts";
import { WINDOW, statusOf, type LearnerProfile } from "./profile.ts";

/**
 * What to study next, from what the learner's own data shows — each with the
 * evidence for it, so the screen can say why.
 *
 * No level is claimed. A level needs a standard behind it, and a handful of
 * grammar points read from chat is not one. What the data does show plainly
 * is where things go wrong and what has stopped going wrong, so that is what
 * is said:
 *
 * - a construction that went wrong in its recent uses ("3 of the last 5");
 * - a phrase from the tutor they keep stopping at;
 * - a phrase they understand now but have never said;
 * - a phrase they studied that has not come back yet;
 * - when they chose to widen rather than repair, constructions they have not
 *   used at all, in the order courses usually bring them in.
 *
 * The plan's focus decides which comes first. Pure.
 */

export type SuggestionReason =
  | { type: "missed"; misses: number; uses: number }
  | { type: "stuck"; lookups: number }
  | { type: "unused" }
  | { type: "studied" }
  | { type: "new" };

export type Suggestion =
  | { kind: "construction"; id: string; reason: SuggestionReason }
  | { kind: "phrase"; text: string; reason: SuggestionReason };

export function suggestNext(
  profile: LearnerProfile,
  comprehension: ComprehensionRecord | null,
  limit = 6,
): Suggestion[] {
  const weak: Suggestion[] = [];
  for (const construction of constructionsFor(profile.language)) {
    const entry = profile.entries[construction.id];
    if (statusOf(entry) !== "weak" || !entry) continue;
    const window = entry.recent.slice(-WINDOW);
    weak.push({
      kind: "construction",
      id: construction.id,
      reason: { type: "missed", misses: window.filter((v) => v === 0).length, uses: window.length },
    });
  }
  weak.sort(
    (a, b) =>
      (b.reason.type === "missed" ? b.reason.misses : 0) -
      (a.reason.type === "missed" ? a.reason.misses : 0),
  );

  const stuck: Suggestion[] = comprehension
    ? itemsIn(comprehension, "stuck", 20)
        .sort((a, b) => b.lookups - a.lookups || b.lastAt - a.lastAt)
        .map((item) => ({ kind: "phrase" as const, text: item.text, reason: { type: "stuck" as const, lookups: item.lookups } }))
    : [];
  const unused: Suggestion[] = comprehension
    ? itemsIn(comprehension, "understood", 20).map((item) => ({
        kind: "phrase" as const,
        text: item.text,
        reason: { type: "unused" as const },
      }))
    : [];
  const studied: Suggestion[] = comprehension
    ? itemsIn(comprehension, "studied", 20).map((item) => ({
        kind: "phrase" as const,
        text: item.text,
        reason: { type: "studied" as const },
      }))
    : [];
  // Never used yet, in the order courses usually bring them in.
  const fresh: Suggestion[] = constructionsFor(profile.language)
    .filter((c) => statusOf(profile.entries[c.id]) === "unseen")
    .sort((a, b) => BANDS.indexOf(a.band) - BANDS.indexOf(b.band))
    .map((c) => ({ kind: "construction" as const, id: c.id, reason: { type: "new" as const } }));

  const order: Suggestion[][] =
    profile.plan.focus === "next"
      ? [fresh.slice(0, 3), weak, unused, stuck, studied]
      : profile.plan.focus === "topic"
        ? [stuck, unused, weak, studied]
        : [weak, stuck, unused, studied];

  const out: Suggestion[] = [];
  const seen = new Set<string>();
  for (const group of order) {
    for (const suggestion of group) {
      const key = suggestion.kind === "construction" ? `c:${suggestion.id}` : `p:${suggestion.text.toLowerCase()}`;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(suggestion);
      if (out.length >= limit) return out;
    }
  }
  return out;
}

/** What has stopped going wrong: constructions overcome, phrases now understood or used. */
export function improvements(
  profile: LearnerProfile,
  comprehension: ComprehensionRecord | null,
): { constructions: string[]; phrases: string[] } {
  const constructions = Object.entries(profile.entries)
    .filter(([id, entry]) => findConstruction(id) && entry.wasWeak && statusOf(entry) === "mastered")
    .map(([id]) => id);
  const phrases = comprehension
    ? [...itemsIn(comprehension, "used", 20), ...itemsIn(comprehension, "understood", 20)]
        .filter((item) => item.lookups > 0 || item.studied > 0)
        .map((item) => item.text)
    : [];
  return { constructions, phrases };
}
