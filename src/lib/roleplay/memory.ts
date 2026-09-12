import type { SpokenLine } from "./director.ts";

/**
 * What the tutor remembers of a conversation longer than it can read.
 *
 * Two lines of sight, kept apart. The raw line is the conversation itself,
 * verbatim, as the tutor's own turns — never fewer than RAW_LINES of the most
 * recent. The context line is everything older, folded into a few sentences of
 * notes: who the learner is, what has been settled, what has been talked about,
 * what they keep getting wrong. Without it, "I work at a design company" said
 * early in a long chat is simply gone by the time it would matter.
 *
 * Folding runs beside the conversation, never in front of it. A turn is sent
 * with whatever notes exist at that moment; the fold happens after, on its own
 * request, and the next turn has it. So the notes can cost a request every ten
 * lines, but they never cost the learner a second of waiting.
 *
 * The raw line is every line not yet folded, which is why nothing falls between
 * the two: it grows from RAW_LINES towards FOLD_AT, and when it reaches FOLD_AT
 * the oldest lines are folded until RAW_LINES are left. A line is always either
 * read verbatim or in the notes.
 *
 * Pure. The prompt is built and the answer read here; the route moves bytes.
 */

/** The fewest recent lines the tutor always reads verbatim — ten exchanges. */
export const RAW_LINES = 20;

/** Unfolded lines at which the oldest are folded into the notes. */
export const FOLD_AT = 30;

/**
 * A ceiling on the raw line as sent, for when folding keeps failing: better to
 * lose the oldest verbatim lines than to send an ever-growing conversation.
 */
export const MAX_RAW_LINES = 40;

/** The notes, and how many lines of history (from the start) they cover. */
export type ConversationMemory = { text: string; upTo: number };

export const EMPTY_MEMORY: ConversationMemory = { text: "", upTo: 0 };

/** What the tutor reads verbatim: every line the notes do not cover. */
export function rawLines(history: SpokenLine[], memory: ConversationMemory): SpokenLine[] {
  return history.slice(memory.upTo).slice(-MAX_RAW_LINES);
}

/** The lines to fold now, and where the notes will reach once folded — or null. */
export function foldDue(
  history: SpokenLine[],
  memory: ConversationMemory,
): { lines: SpokenLine[]; upTo: number } | null {
  if (history.length - memory.upTo < FOLD_AT) return null;
  const upTo = history.length - RAW_LINES;
  return { lines: history.slice(memory.upTo, upTo), upTo };
}

/** Longest the notes may grow. They are read on every turn; they must stay short. */
export const MAX_CONTEXT_CHARS = 1200;

export function contextPrompt(input: {
  tutorRole: string;
  setting: string;
  previous: string;
  lines: SpokenLine[];
}): string {
  const transcript = input.lines
    .map((line) => `${line.who === "tutor" ? "You" : "Them"}: ${line.text}`)
    .join("\n");
  return `You are the ${input.tutorRole} in this scene, keeping private notes on a spoken conversation with someone learning the language, so you can remember it later.

${input.setting}

Your notes so far:
${input.previous.trim() || "(none yet)"}

What was said since:
${transcript}

Rewrite your notes to cover all of it. Keep only what you would need to carry on the conversation naturally:
- facts about them (name, work, plans, likes)
- what has been settled or done
- what you have talked about
- mistakes they keep making, if any

Plain sentences, in English, at most 80 words. Nothing about this being practice.

Reply as JSON only: {"notes": "<your notes>"}`;
}

/** The notes out of the model's answer, or null if there are none to use. */
export function parseContext(raw: string): string | null {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }
  if (typeof parsed !== "object" || parsed === null) return null;
  const notes = (parsed as { notes?: unknown }).notes;
  if (typeof notes !== "string" || !notes.trim()) return null;
  return notes.trim().slice(0, MAX_CONTEXT_CHARS);
}
