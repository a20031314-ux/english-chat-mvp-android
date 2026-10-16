/**
 * The phrase a learner was handed when they got stuck in a call.
 *
 * When the director judges a turn "stuck", its note says how they could go
 * on, in their own language, with the words to use quoted in the language
 * being learned ("잘 모르겠으면 'I like to do...'라고 말해 보세요"). Those
 * quoted words are what being stuck taught them: they go into the ledger as
 * met, become the leaves of the flow element (growth.ts), and are the first
 * phrases the tutor brings back (brief.ts). Only the quoted words are kept,
 * never the learner's sentence.
 *
 * Pure.
 */

const QUOTES: Array<[string, string]> = [
  ["“", "”"], // “ ”
  ["‘", "’"], // ‘ ’
  ["「", "」"], // 「 」
  ["『", "』"], // 『 』
  ["«", "»"], // « »
  ["„", "“"], // „ “
  ['"', '"'],
  ["'", "'"],
];

const MAX_PHRASES = 3;
const MAX_CHARS = 60;

function escape(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** The quoted stretches of a note, ends tidied ("I like to do..." → "I like to do"). */
export function quotedPhrases(note: string): string[] {
  const found: string[] = [];
  for (const [open, close] of QUOTES) {
    const pattern = new RegExp(`${escape(open)}([^${escape(open)}${escape(close)}]{2,${MAX_CHARS + 10}})${escape(close)}`, "g");
    for (const match of note.matchAll(pattern)) {
      const phrase = match[1]!
        .replace(/(\.\.\.|…|〜|~)+$/u, "")
        // Ends tidied of commas and full stops, but a question keeps its
        // marks, opening and closing ("¿Qué me recomiendas?").
        .replace(/^\s+|[\s.,;:、。，]+$/gu, "")
        .trim();
      // An apostrophe inside a word ("don't") is not a quote: skip what is
      // clearly a run of ordinary text between two of them.
      if (phrase && phrase.length <= MAX_CHARS && !found.includes(phrase)) found.push(phrase);
    }
  }
  return found.slice(0, MAX_PHRASES);
}
