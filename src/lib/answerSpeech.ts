import { languageEvidence } from "./inputLanguage.ts";
import { learningLanguageScript } from "./learningLanguages.ts";

/**
 * Where an answer about a sentence quotes the language being learned, so the
 * quoted line can carry a speaker like every other learning sentence.
 *
 * Answers in the sentence sheet (여기서 무슨 뜻이야? / 비슷한 다른 표현은?) are
 * written in the interface language and quote examples in the learning
 * language: `"たとえば、アニメを見たりするのも楽しいよ"는 친구와의 대화에서…`.
 * The examples are the part worth hearing. They arrive as plain text, and
 * notes saved before this change have no markup either, so the quotes are
 * found here rather than asked of the server.
 *
 * A quoted span is spoken when it reads as the learning language: by script
 * when the two languages differ in script (a Korean gloss in quotes, '예를
 * 들어', stays silent under Japanese), by small words and letters when they
 * share one. Same-script pairs with nothing to tell them apart lean towards
 * speaking — an answer quotes examples far more often than its own words.
 */

export type AnswerPart = { text: string; speak?: string };

// Opening quote → its closing quote. Straight quotes close themselves.
const QUOTE_PAIRS: Record<string, string> = {
  '"': '"',
  "“": "”",
  "'": "'",
  "‘": "’",
  "「": "」",
  "『": "』",
  "«": "»",
  "„": "“",
};

const MAX_SPOKEN_CHARS = 200;

function readsAsLearning(
  text: string,
  learningLanguage: string,
  interfaceLanguage: string,
): boolean {
  if (!/\p{L}/u.test(text)) return false;
  if (learningLanguage === interfaceLanguage) return true;
  const evidence = languageEvidence(text, learningLanguage, interfaceLanguage);
  const sameScript =
    learningLanguageScript(learningLanguage) === learningLanguageScript(interfaceLanguage);
  return sameScript ? evidence.learning >= evidence.ui : evidence.learning > evidence.ui;
}

/** An apostrophe inside a word (don't, l'eau) is not a quote. */
function isWordApostrophe(answer: string, index: number): boolean {
  const before = answer[index - 1] ?? "";
  const after = answer[index + 1] ?? "";
  return /\p{L}/u.test(before) && /\p{L}/u.test(after);
}

export function splitAnswerForSpeech(
  answer: string,
  learningLanguage: string,
  interfaceLanguage: string,
): AnswerPart[] {
  const parts: AnswerPart[] = [];
  let plain = "";
  let index = 0;

  while (index < answer.length) {
    const open = answer[index];
    const close = QUOTE_PAIRS[open];
    if (!close || (open === "'" && isWordApostrophe(answer, index))) {
      plain += open;
      index += 1;
      continue;
    }

    let end = answer.indexOf(close, index + 1);
    while (end !== -1 && close === "'" && isWordApostrophe(answer, end)) {
      end = answer.indexOf(close, end + 1);
    }
    const inner = end === -1 ? "" : answer.slice(index + 1, end);
    // Unclosed, empty, across a line break or too long to be one example:
    // the mark is just a character.
    if (end === -1 || !inner.trim() || inner.includes("\n") || inner.length > MAX_SPOKEN_CHARS) {
      plain += open;
      index += 1;
      continue;
    }
    // A quote in the interface language ('예를 들어'): keep it whole, so its
    // closing mark is not read as the opening of the next quote.
    if (!readsAsLearning(inner, learningLanguage, interfaceLanguage)) {
      plain += answer.slice(index, end + 1);
      index = end + 1;
      continue;
    }

    if (plain) parts.push({ text: plain });
    plain = "";
    parts.push({ text: answer.slice(index, end + 1), speak: inner.trim() });
    index = end + 1;
  }

  if (plain) parts.push({ text: plain });
  return parts;
}
