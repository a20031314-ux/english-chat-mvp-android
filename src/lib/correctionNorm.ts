/** Optional spoken fillers — suggestions, not grammar. */
const STYLE_WORDS = new Set([
  "right",
  "just",
  "really",
  "actually",
  "currently",
  "simply",
  "basically",
  "literally",
  "probably",
  "maybe",
  "perhaps",
  "kinda",
  "pretty",
  "quite",
  "already",
  "still",
  "even",
  "also",
  "too",
  "only",
  "well",
]);

const CONTENT_STOP = new Set([
  "i",
  "am",
  "is",
  "are",
  "was",
  "were",
  "be",
  "been",
  "the",
  "a",
  "an",
  "to",
  "of",
  "in",
  "on",
  "at",
  "for",
  "and",
  "or",
  "my",
  "your",
  "me",
  "you",
  "it",
  "this",
  "that",
  "now",
]);

export function expandContractions(text: string) {
  return text
    .replace(/\bI'm\b/gi, "I am")
    .replace(/\byou're\b/gi, "you are")
    .replace(/\bhe's\b/gi, "he is")
    .replace(/\bshe's\b/gi, "she is")
    .replace(/\bit's\b/gi, "it is")
    .replace(/\bwe're\b/gi, "we are")
    .replace(/\bthey're\b/gi, "they are")
    .replace(/\bI've\b/gi, "I have")
    .replace(/\byou've\b/gi, "you have")
    .replace(/\bwe've\b/gi, "we have")
    .replace(/\bthey've\b/gi, "they have")
    .replace(/\bI'll\b/gi, "I will")
    .replace(/\byou'll\b/gi, "you will")
    .replace(/\bhe'll\b/gi, "he will")
    .replace(/\bshe'll\b/gi, "she will")
    .replace(/\bwe'll\b/gi, "we will")
    .replace(/\bthey'll\b/gi, "they will")
    .replace(/\bI'd\b/gi, "I would")
    .replace(/\byou'd\b/gi, "you would")
    .replace(/\bhe'd\b/gi, "he would")
    .replace(/\bshe'd\b/gi, "she would")
    .replace(/\bwe'd\b/gi, "we would")
    .replace(/\bthey'd\b/gi, "they would")
    .replace(/\bisn't\b/gi, "is not")
    .replace(/\baren't\b/gi, "are not")
    .replace(/\bwasn't\b/gi, "was not")
    .replace(/\bweren't\b/gi, "were not")
    .replace(/\bdon't\b/gi, "do not")
    .replace(/\bdoesn't\b/gi, "does not")
    .replace(/\bdidn't\b/gi, "did not")
    .replace(/\bcan't\b/gi, "cannot")
    .replace(/\bcannot\b/gi, "cannot")
    .replace(/\bwon't\b/gi, "will not")
    .replace(/\bwouldn't\b/gi, "would not")
    .replace(/\bcouldn't\b/gi, "could not")
    .replace(/\bshouldn't\b/gi, "should not")
    .replace(/\bhaven't\b/gi, "have not")
    .replace(/\bhasn't\b/gi, "has not")
    .replace(/\bhadn't\b/gi, "had not")
    .replace(/\blet's\b/gi, "let us")
    .replace(/\bthat's\b/gi, "that is")
    .replace(/\bwhat's\b/gi, "what is")
    .replace(/\bthere's\b/gi, "there is")
    .replace(/\bhere's\b/gi, "here is");
}

function normalizePolarity(text: string) {
  return text
    .replace(/\bno one\b/g, "nobody")
    .replace(/\b(am|is|are|was|were|be)\s+not\s+(\w+ing)\s+anything\b/g, "$1 $2 nothing")
    .replace(/\bdo not\s+(\w+)\s+anything\b/g, "$1 nothing")
    .replace(/\bdoes not\s+(\w+)\s+anything\b/g, "$1 nothing")
    .replace(/\bdid not\s+(\w+)\s+anything\b/g, "$1 nothing")
    .replace(/\bdo not have any\b/g, "have no")
    .replace(/\bdoes not have any\b/g, "has no")
    .replace(/\bdid not have any\b/g, "had no")
    .replace(/\bnot\s+anybody\b/g, "nobody")
    .replace(/\bnot\s+anyone\b/g, "nobody")
    .replace(/\bnot\s+anything\b/g, "nothing")
    .replace(/\bnot\s+anywhere\b/g, "nowhere")
    .replace(/\bnot\s+ever\b/g, "never")
    .replace(/\bnot\s+any\s+/g, "no ");
}

function stripStyleWords(text: string) {
  return text
    .split(/\s+/)
    .filter((word) => word && !STYLE_WORDS.has(word))
    .join(" ");
}

export function substantiveNorm(text: string) {
  return normalizePolarity(
    expandContractions(text)
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s]/gu, "")
      .replace(/\s+/g, " ")
      .trim(),
  )
    .replace(/\s+/g, " ")
    .trim();
}

/** Grammar-only comparison: ignore fillers like "right" / "just". */
export function grammarNorm(text: string) {
  return stripStyleWords(substantiveNorm(text)).replace(/\s+/g, " ").trim();
}

function isMostlyUnspacedScript(text: string): boolean {
  if (/\s/.test(text)) return false;
  return /[\u3040-\u30ff\u3400-\u9fff\uac00-\ud7af]/.test(text);
}

function contentWords(text: string): string[] {
  const norm = grammarNorm(text);
  if (!norm) return [];
  // Japanese/Chinese/Korean often have no spaces. Splitting on whitespace
  // makes the whole sentence one "word", so a particle fix (を→が) looks like
  // a total meaning rewrite and gets discarded.
  if (isMostlyUnspacedScript(norm)) {
    return Array.from(norm);
  }
  return norm.split(/\s+/).filter((word) => word && !CONTENT_STOP.has(word));
}

/** True when the rewrite changes the message's content words, not just grammar. */
export function isMeaningRewrite(original: string, rewritten: string): boolean {
  const from = contentWords(original);
  if (from.length === 0) return false;
  const to = new Set(contentWords(rewritten));
  const kept = from.filter((word) => to.has(word)).length;
  return kept / from.length < 0.5;
}

export function isGrammarError(original: string, corrected: string): boolean {
  if (!corrected.trim()) return false;
  if (isMeaningRewrite(original, corrected)) return false;
  return grammarNorm(original) !== grammarNorm(corrected);
}

/** Remove optional fillers the model added on top of a real grammar fix. */
/** Capitalize the first letter of an English sentence (Are, not are). */
export function sentenceCaseEnglish(text: string): string {
  // Only title-case Latin sentence starts; leave CJK / other scripts alone.
  if (!/^\s*\p{Ll}/u.test(text) || /^\s*[^A-Za-z]/.test(text)) {
    return text;
  }
  return text.replace(/^(\s*)(\p{Ll})/u, (_, space: string, letter: string) => {
    return `${space}${letter.toUpperCase()}`;
  });
}

export function dropAddedStyleWords(original: string, corrected: string): string {
  const originalWords = new Set(
    (original.toLowerCase().match(/[a-z']+/g) || []).map((w) => w),
  );
  return corrected
    .split(/(\s+)/)
    .filter((token) => {
      const word = token.toLowerCase().replace(/[^a-z']/g, "");
      if (!word) return true;
      if (STYLE_WORDS.has(word) && !originalWords.has(word)) return false;
      return true;
    })
    .join("")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Keep real grammar in `corrected`. Move optional wording / meaning
 * rewrites into `natural` so they are never shown as errors.
 */
export function alignCorrectionToGrammar(
  original: string,
  correctedInput: string,
  naturalInput: string,
): { corrected: string; natural: string; hasError: boolean } {
  let corrected = correctedInput.trim() || original;
  let natural = naturalInput.trim() || corrected;

  const styleOrRewrite =
    !isGrammarError(original, corrected) &&
    (grammarNorm(corrected) === grammarNorm(original) ||
      isMeaningRewrite(original, corrected));

  if (styleOrRewrite) {
    if (
      substantiveNorm(natural) === substantiveNorm(original) ||
      substantiveNorm(natural) === substantiveNorm(corrected)
    ) {
      natural = corrected;
    }
    corrected = original.trim();
  }

  const hasError = isGrammarError(original, corrected);
  const nextCorrected = hasError
    ? dropAddedStyleWords(original, corrected)
    : original.trim();
  return {
    corrected: sentenceCaseEnglish(nextCorrected),
    natural: sentenceCaseEnglish(natural),
    hasError,
  };
}
