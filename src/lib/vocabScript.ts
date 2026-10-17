import { learningLanguageScript } from "./learningLanguages.ts";

const SCRIPT_LETTERS: Record<string, RegExp> = {
  latin: /\p{Script=Latin}/u,
  hangul: /\p{Script=Hangul}/u,
  japanese: /[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}]/u,
  hanzi: /\p{Script=Han}/u,
  cyrillic: /\p{Script=Cyrillic}/u,
  arabic: /\p{Script=Arabic}/u,
  thai: /\p{Script=Thai}/u,
  devanagari: /\p{Script=Devanagari}/u,
};

/**
 * A headword has to be written in the learning language's script. Searching
 * "累" while learning Indonesian with the app in Chinese came back as "累"
 * itself every time (sim-users 2026-10-18): the model read the query as the
 * word to explain. Such results are dropped, and if nothing is left the
 * lookup is asked once more with the query's language spelled out.
 */
// Japanese and Chinese share Han characters: only kana tells Japanese apart.
const KANA = /[\p{Script=Hiragana}\p{Script=Katakana}]/u;

export function inLearningScript(word: string, targetLanguage: string): boolean {
  const script = learningLanguageScript(targetLanguage);
  const letters = SCRIPT_LETTERS[script];
  if (!letters) return true;
  if (!letters.test(word)) return false;
  // Another script anywhere in the headword means it is not the learning language's.
  return !Object.entries(SCRIPT_LETTERS).some(([name, re]) => {
    if (name === script) return false;
    if (script === "japanese" && name === "hanzi") return false;
    if (script === "hanzi" && name === "japanese") return KANA.test(word);
    return re.test(word);
  });
}

