/**
 * A conversation started with something to practise in it.
 *
 * The map and the "try this" card used to send a learner to a tab and stop
 * there: the call tab opened on its own door, the chat got a first line pasted
 * into its box, and neither tutor knew what the learner had come to do
 * (hub/drafts/coaching-loop.md). A practice goal travels with the request
 * instead — the situation, the phrases worth using, the mistake worth getting
 * right — and every tutor that receives one is told it in the same words.
 *
 * Untrusted on the way in (it comes from the app), so everything is cut to
 * size; the words a learner is told are interface text and live in copy.ts,
 * not here.
 *
 * Pure: the server, the screens and the tests read the same rules.
 */

import { findExpression } from "../videoIndex/match.ts";

export type PracticeGoal = {
  /**
   * The situation to have the conversation in, in the learner's language as
   * the map wrote it ("Ordering at a café: asking for changes"). Optional:
   * a phrase or a mistake is enough to steer a conversation by itself.
   */
  situation?: string;
  /** Phrases worth using, in the language being learned. Up to three. */
  phrases?: string[];
  /** A kind of mistake worth getting right, in English ("past tense of irregular verbs"). */
  mistake?: string;
  /**
   * The day of the daily pack this conversation plays (pack/pack.ts), as
   * YYYY-MM-DD. The server holds the pack; this only names it.
   */
  pack?: string;
};

export const MAX_PRACTICE_PHRASES = 3;

function clean(value: unknown, max: number): string {
  return typeof value === "string" ? value.replace(/\s+/g, " ").trim().slice(0, max) : "";
}

/** What survives of a goal from a request; null when nothing does. */
export function parsePracticeGoal(value: unknown): PracticeGoal | null {
  if (!value || typeof value !== "object") return null;
  const raw = value as Record<string, unknown>;
  const situation = clean(raw.situation, 160);
  const mistake = clean(raw.mistake, 80);
  const pack = typeof raw.pack === "string" && /^\d{4}-\d{2}-\d{2}(?:\.[2-9])?$/.test(raw.pack) ? raw.pack : "";
  const seen = new Set<string>();
  const phrases = (Array.isArray(raw.phrases) ? raw.phrases : [])
    .map((phrase) => clean(phrase, 60))
    .filter((phrase) => {
      const key = phrase.toLowerCase();
      if (!phrase || seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, MAX_PRACTICE_PHRASES);
  if (!situation && !mistake && phrases.length === 0 && !pack) return null;
  return {
    ...(situation ? { situation } : {}),
    ...(phrases.length ? { phrases } : {}),
    ...(mistake ? { mistake } : {}),
    ...(pack ? { pack } : {}),
  };
}

/**
 * What a tutor is told about a conversation that has something to practise.
 *
 * The same rules as bringing learned phrases back (ledger.ts recyclePrompt):
 * the learner is the one meant to say the phrases, so the tutor makes room for
 * them rather than saying them first, and never turns the conversation into a
 * drill or names what it is doing.
 */
export function practicePrompt(goal: PracticeGoal, targetName: string): string {
  const lines: string[] = [
    `This conversation has something for the learner to practise. Keep talking naturally — never announce it, quiz, or drill.`,
  ];
  if (goal.situation) {
    lines.push(
      `Situation (described in the learner's own language): ${goal.situation}. Have the conversation inside it, as the person the learner would really be talking to there: for ordering, asking or buying, the member of staff serving them; for small talk, someone they would meet there; for catching up, a friend. Speak as that person, in ${targetName}; never describe the scene from outside.`,
    );
  }
  if (goal.phrases?.length) {
    lines.push(
      `Phrases the learner is trying to use themselves: ${goal.phrases.map((p) => `"${p}"`).join(", ")}. Make openings where saying them would be natural — ask the question one of them answers. Do not say them, or anything that contains them, yourself, and do not hint at them.`,
    );
  }
  if (goal.mistake) {
    lines.push(
      `A mistake they keep making: ${goal.mistake}. Steer towards moments that call for getting this right (for a tense, ask about the time it belongs to).`,
    );
  }
  lines.push(
    `None of this changes the correction: correct only what they actually wrote, keep its meaning, and never add the phrases or words from the situation that they did not use.`,
  );
  return lines.join("\n");
}

/** The opening line's brief, when the tutor speaks first in a practice conversation. */
export function practiceOpeningPrompt(goal: PracticeGoal, targetName: string): string {
  return `${practicePrompt(goal, targetName)}
You speak first. Open the conversation in 1–2 short spoken ${targetName} lines that put the learner straight into it and give them something to answer — in the situation if there is one. No greeting speech, no explanation of what you are doing.`;
}

/**
 * Whether a phrase was said in a line, for ticking it off on the screen.
 * The same matcher the ledger and the video index use (findExpression: words
 * cut for scripts without spaces, Korean particles, English inflections),
 * with a plain substring test behind it — being generous here costs a tick;
 * the ledger decides mastery on its own.
 */
export function saidPhrase(line: string, phrase: string, language: string): boolean {
  if (!line.trim() || !phrase.trim()) return false;
  if (findExpression([{ start: 0, end: 0, text: line }], phrase, language).length > 0) return true;
  const norm = (text: string) => text.toLocaleLowerCase().replace(/\s+/g, "");
  return norm(line).includes(norm(phrase));
}
