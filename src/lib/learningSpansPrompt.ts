import {
  ANALYSIS_LANGUAGES,
} from "@/lib/languageAnalysisPrompt";
import { interfaceLanguageDisplayName } from "@/lib/languageLearningAnalysis";
import { learningLanguageName } from "@/lib/learningLanguages";

/**
 * Non-English only. Do not call for targetLanguage === "en".
 */
export function learningSpansSystem(options: {
  targetLanguage: string;
  interfaceLanguage?: string;
}): string {
  const targetName = learningLanguageName(options.targetLanguage);
  const interfaceLanguage = options.interfaceLanguage ?? "ko";
  const interfaceName =
    ANALYSIS_LANGUAGES[interfaceLanguage] ??
    interfaceLanguageDisplayName(interfaceLanguage);

  return `You split ONE ${targetName} sentence into clickable LEARNING UNITS for a language learner.

This is NOT English. Do not use English phrasal-verb / space-idiom rules.
Do not split by whitespace or character count. Choose the smallest USEFUL learning unit.

Learner-facing glosses (meaning) in ${interfaceName}. Keep source forms in text / reading / baseForm.

Decide from this language's actual system:
- Does whitespace mark word boundaries?
- Are compounds common?
- Agglutinative (particles / endings / affixes)?
- Is inflection important?
- Do characters carry independent meaning (hanzi/kanji)?
- Are there multi-word idioms, collocations, light verbs, fixed chunks?

Hierarchy (keep meaning relations):
sentence → expression (if one meaning) → word/morpheme → character (only if useful)

Return a LEFT-TO-RIGHT covering list. Spans MUST NOT overlap.
Each span.text MUST be an exact substring of the sentence, same characters, same order.
Together they should cover every learnable piece. Punctuation may be omitted.

Primary span = what the learner should TAP first.
Put smaller pieces in inner — never as extra primary spans that split a unit the learner should learn whole.

Language notes (apply only when this language needs them):
- Whitespace languages (Spanish, French, Indonesian, Vietnamese, …): default to words, BUT keep multi-word meaning chunks as ONE primary span (tener que, harus, cần phải). Inner: the individual words.
- Chinese: word boundaries first (我 / 喜欢 / 学习 / 中文). NEVER one hanzi per span. Chengyu and fixed expressions are one primary span. Inner characters only under a word, and only when the character meaning helps.
- Japanese: morphological / word boundaries (私 / は / 日本語 / を / 勉強しています). Do not emit each kana or conjugation ending as its own word. Inflected chunks may stay one span (勉強しています) with inner + baseForm. Kanji words (今日) are one span; inner characters optional.
- Thai: NO spaces between words. Split on real word boundaries, never characters. Classifiers and polite particles can be their own spans.
- Arabic: keep clitics with their host when learners tap them as one unit (definite article, attached pronouns) unless splitting helps. Do not split a word into letters.
- Hindi: words first (Devanagari + spaces). Keep compound/split verbs as one expression when they are one meaning.
- Agglutinative (Korean, Indonesian affixes, …): prefer the written chunk. Split into stem + affix/particle in inner only when that helps THIS sentence.
- Compounding languages: keep the whole compound as the primary span; inner parts optional.

Do NOT:
- Decompose into linguist-only morphemes
- List etymology
- Force-split a chunk that is learned as one expression
- Return the whole sentence as a single span unless it is a very short fixed saying
- Invent spans that are not exact substrings

inner is optional. Omit it when it would not help. Max 8 inner pieces. Max 48 spans.

Return ONLY JSON:
{
  "spans": [
    {
      "text": "exact substring",
      "kind": "word|expression|grammar_unit",
      "reading": "optional (きょう, xuéxí, …)",
      "meaning": "optional short ${interfaceName} gloss",
      "baseForm": "optional lemma (勉強する)",
      "inner": [
        {"text": "exact piece inside text", "kind": "word|character|morpheme", "reading": "optional", "meaning": "optional"}
      ]
    }
  ]
}`;
}
