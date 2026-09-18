/**
 * Whether what came back is plausibly what was said.
 *
 * Speech models in this family invent text when they are given almost nothing —
 * a short word, a breath, a half second of room noise — and they do not invent
 * quietly. The best known case is a Japanese stock phrase appearing over
 * silence, which is exactly what a learner saying "hi" to an English scene got
 * back. It is confident, it is well formed, and it is not what they said.
 *
 * A language hint on the request is supposed to prevent this and does not
 * always, so the answer is checked on the way back. Not for correctness —
 * nothing here can know whether "large" was really said — but for the one thing
 * that can be known from text alone: a reply written in a script the language
 * being learned does not use was not a transcription of it.
 *
 * Deliberately blunt. It rejects a whole answer or none of it, and it says
 * nothing about answers inside the right script, because a wrong word in the
 * right alphabet is indistinguishable from a real mishearing and mishearings
 * are the scene's business to handle.
 */

/** The writing system a language is spoken down into, for the few that differ. */
type Script = "latin" | "hangul" | "kana" | "han" | "cyrillic" | "arabic" | "thai" | "devanagari";

const SCRIPT_OF: Record<string, Script> = {
  en: "latin",
  es: "latin",
  fr: "latin",
  it: "latin",
  pt: "latin",
  id: "latin",
  vi: "latin",
  ko: "hangul",
  ja: "kana",
  zh: "han",
  ru: "cyrillic",
  ar: "arabic",
  th: "thai",
  hi: "devanagari",
};

const RANGES: Record<Script, RegExp> = {
  latin: /[\p{Script=Latin}]/u,
  hangul: /[\p{Script=Hangul}]/u,
  kana: /[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}]/u,
  han: /[\p{Script=Han}]/u,
  cyrillic: /[\p{Script=Cyrillic}]/u,
  arabic: /[\p{Script=Arabic}]/u,
  thai: /[\p{Script=Thai}]/u,
  devanagari: /[\p{Script=Devanagari}]/u,
};

/**
 * Whether a transcript is written in the script the language uses.
 *
 * Counts letters rather than looking for a single stray character: a name, a
 * borrowed word or a piece of punctuation should not throw away a turn, and a
 * learner of English who says a word in their own language has still said
 * something. What it catches is an answer that is mostly not the language at
 * all, which is what an invented one looks like.
 */
export function looksLikeLanguage(text: string, language: string): boolean {
  const script = SCRIPT_OF[language];
  if (!script) return true;
  const letters = [...text].filter((character) => /\p{L}/u.test(character));
  if (letters.length === 0) return true;
  const matching = letters.filter((character) => RANGES[script].test(character)).length;
  return matching / letters.length >= 0.5;
}

/**
 * What the learner said, or nothing.
 *
 * Nothing is the safe answer: the scene already knows what to do with a turn it
 * could not hear — the character asks again, in character — and that is a far
 * better outcome than answering a sentence they never spoke.
 */
export function heardOrNothing(text: string, language: string): string {
  const said = text.trim();
  return said && looksLikeLanguage(said, language) ? said : "";
}
