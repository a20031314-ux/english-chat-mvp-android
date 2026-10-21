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


/**
 * 학습 언어 문장에 섞인 다른 문자의 낱말(예: 영어 문장 속 한글, 한국어 문장 속 로마자).
 * 채팅 교정에 "noticed"로 알려 고친 문장에서 학습 언어 낱말로 바꾸게 한다 — Haiku가 지시만으로는 영어 쪽을 자주 놓침(2026-10-22).
 */
export function foreignWords(message: string, targetLanguage: string): string[] {
  const runs = message.match(/[\p{L}\p{M}]+/gu) ?? [];
  const out: string[] = [];
  for (const run of runs) {
    if (/^\p{Script=Latin}$/u.test(run)) continue; // 한 글자 로마자(I, a)는 건너뜀
    if (!inLearningScript(run, targetLanguage) && !out.includes(run)) out.push(run);
    if (out.length >= 5) break;
  }
  return out;
}
