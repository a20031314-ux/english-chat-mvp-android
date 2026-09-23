import type { SpokenLine } from "./director.ts";

/**
 * Looking back at the moment they got stuck, after the conversation moved on.
 *
 * The scene never stops for this. When the tutor judges a turn a struggle the
 * conversation carries on in character, and a button is left on that turn; the
 * learner presses it when they want to know what happened, or never. So the
 * expensive reading happens here, where nothing is waiting: the whole exchange
 * is available, not one turn, and there is no second and a half to answer in.
 *
 * This is also where explicit teaching finally lands. It used to be written
 * into the director's `note` and shown as small text under a bubble while the
 * microphone was open — which is to say, while the learner was trying to speak
 * and reading nothing.
 *
 * Pure. The prompt is built and the answer read here; the route moves bytes.
 */

/** What the scene knows about the turn they got stuck on. */
/**
 * One line of the conversation as the screen holds it.
 *
 * The spoken text plus everything that was learned about it afterwards: a gloss
 * fetched when somebody tapped it, their own sentence said better, a word about
 * it, and the evidence for a turn they got stuck on. It lives here rather than
 * beside the component that draws it because a saved conversation is a list of
 * these, and a library module cannot reach into a component for its shape.
 */
export type TranscriptLine = {
  who: "tutor" | "learner";
  text: string;
  translation?: string;
  stuck?: StuckTurn;
  /** Their own sentence, said better. Shown under it, never spoken. */
  better?: string;
  /** A word about that sentence, in their own language. Also never spoken. */
  about?: string;
};

export type StuckTurn = {
  /** The tutor's line they were answering. */
  asked: string;
  /** What they said, or empty when they said nothing usable. */
  heard: string;
  /** How many goes they had at this step. */
  attempts: number;
  /** Silence before they started speaking. */
  hesitationMs: number;
  /** The conversation up to and including the turn, most recent last. */
  history: SpokenLine[];
};

/** Lines of conversation a review reads. Enough for the shape of the scene. */
export const REVIEW_LINES = 12;

/** Longest a review may be. It is read on a phone, in one sitting. */
export const MAX_REVIEW_CHARS = 600;

export type Review = {
  /** Why the turn was hard, in the learner's own language. */
  why: string;
  /** What they could have said, in the language being learned. */
  say: string;
  /** What that means, in the learner's own language. */
  meaning: string;
};

/**
 * How long a silence is worth mentioning.
 *
 * Under this, saying "you hesitated" about an ordinary pause for breath would
 * be inventing a struggle that was not there.
 */
const LONG_SILENCE_MS = 3000;

/** The turn as evidence, in the plainest terms the model can act on. */
function evidence(turn: StuckTurn): string {
  const notes = [
    turn.heard
      ? `They answered: "${turn.heard}"`
      : `They said nothing the scene could use — silence, or a sound that was not words.`,
    turn.attempts > 1 ? `It was try number ${turn.attempts} at this step.` : "",
    turn.hesitationMs >= LONG_SILENCE_MS
      ? `They waited about ${Math.round(turn.hesitationMs / 1000)} seconds before starting.`
      : "",
  ].filter(Boolean);
  return notes.join("\n");
}

export function reviewPrompt(input: {
  tutorRole: string;
  setting: string;
  targetLanguage: string;
  nativeLanguage: string;
  turn: StuckTurn;
}): string {
  const { turn } = input;
  const transcript = turn.history
    .slice(-REVIEW_LINES)
    .map((line) => `${line.who === "tutor" ? input.tutorRole : "Them"}: ${line.text}`)
    .join("\n");

  return `Someone is learning ${input.targetLanguage} by talking their way through a scene. You are looking back at one moment with them, after the conversation has already moved on.

${input.setting}

How the conversation went:
${transcript}

The moment in question — the ${input.tutorRole} had just said "${turn.asked}":
${evidence(turn)}

Work out what actually stopped them and say it plainly. Some possibilities: they did not understand the question, they understood it but could not find the words, they answered something next to it, or they knew it and were simply slow. Judge from what they said, not from whether it was perfect.

Write for them, in ${input.nativeLanguage}, speaking to them directly. Address them politely, and keep the same level of politeness throughout.
- "why": two or three sentences. What was being asked, and what went wrong for them. No praise, no scolding, no talk of scores or levels.
- "say": one thing they could have said, in ${input.targetLanguage}. Short, the way a person really answers.
- "meaning": that sentence in ${input.nativeLanguage}, and nothing else — no "it means", no quotation marks, no alternatives.

Reply as JSON only: {"why": "...", "say": "...", "meaning": "..."}`;
}

/** The review out of the model's answer, or null when there is nothing to show. */
export function parseReview(raw: string): Review | null {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }
  if (typeof parsed !== "object" || parsed === null) return null;
  const record = parsed as { why?: unknown; say?: unknown; meaning?: unknown };
  const read = (value: unknown, limit: number) =>
    typeof value === "string" ? value.trim().slice(0, limit) : "";
  const why = read(record.why, MAX_REVIEW_CHARS);
  // Without the explanation there is no review: the line on its own is the
  // "here is the right answer" card this exists instead of.
  if (!why) return null;
  return {
    why,
    say: read(record.say, 200),
    meaning: read(record.meaning, 200),
  };
}
