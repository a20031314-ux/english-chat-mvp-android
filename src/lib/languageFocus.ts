import {
  learningLanguageName,
  type LearningLanguageCode,
} from "./learningLanguages.ts";

/**
 * What goes wrong in each language, in that language's own terms.
 *
 * Written by hand, one row per language the app teaches, and the only place in
 * the repository that says what "wrong" looks like outside English. It names
 * the things a rubric written in English would miss entirely: which particles
 * exist to be got wrong, which agreements have to hold, and — for the five
 * languages where it is a decision on every sentence — politeness and register.
 *
 * It lived inside the chat route, which is where it was needed first and where
 * it stayed private long enough to be forgotten about. It is not chat's: any
 * part of the app that has to judge a sentence in a language nobody here reads
 * wants exactly this, and the roleplay bank is the next thing that does. A
 * sentence bank for Japanese has to be written in one register throughout, and
 * "polite vs plain (です/ます vs 辞書形)" is already written down here.
 *
 * A caveat worth carrying with it: this describes the mistakes a learner makes,
 * not whether a line a native would say sounds natural. The two overlap almost
 * everywhere and are not the same question. Used as a checklist for drafted
 * lines it catches register drift and calques, which are most of what goes
 * wrong; it will not tell anyone that a grammatical sentence is one no one says.
 */
export function targetLanguageFocusHints(targetLanguage: LearningLanguageCode): string {
  switch (targetLanguage) {
    case "ja":
      return `Japanese focus (use Japanese terms, not English labels):
- Particles (は/が/を/に/で/と/も…), verb/adjective conjugation, polite vs plain (です/ます vs 辞書形), word order, counters, transitive/intransitive pairs when wrong, unnatural calques from Korean/English.`;
    case "ko":
      return `Korean focus (use Korean terms):
- Particles (은/는/이/가/을/를/에/에서…), endings/politeness (해요체/반말/합쇼체), conjugation, honorifics when required by context, spacing, unnatural calques.`;
    case "zh":
      return `Chinese focus (use Chinese terms):
- Word order, 了/过/着, measure words, 的/地/得, aspect/result complements, coverbs (在/把/被), missing or wrong function words, unnatural calques.`;
    case "es":
    case "fr":
    case "it":
    case "pt":
      return `Romance focus (use ${learningLanguageName(targetLanguage)} terms, not English labels):
- Gender/number agreement, articles, verb conjugation/tense/mood (incl. subjunctive when required), clitics/pronouns, prepositions, ser/estar or language-specific copula pairs when relevant, false friends, unnatural calques.`;
    case "ru":
      return `Russian focus (use Russian terms):
- Case endings, verb aspect (perfective/imperfective), agreement, prepositions + case, word order only when it breaks meaning, unnatural calques.`;
    case "ar":
      return `Arabic focus (use Arabic terms):
- Root-and-pattern morphology, definite article, gender/number agreement, idafa, attached pronouns/clitics, verb form, case only when it is clearly wrong, MSA vs dialect mismatch when it breaks the intended register.`;
    case "id":
      return `Indonesian focus (use Indonesian terms):
- Affixes (me-/ber-/ter-/di-/ke-an), reduplication, particles (lah/kah/pun), word order, unnatural calques. Do not invent tense endings.`;
    case "vi":
      return `Vietnamese focus (use Vietnamese terms):
- Classifiers, aspect particles (đã/đang/sẽ), word order, pronouns/register, missing function words, unnatural calques. Do not split tones as spelling errors.`;
    case "th":
      return `Thai focus (use Thai terms):
- Word boundaries, classifiers, polite particles (ครับ/ค่ะ), serial verbs, missing function words, unnatural calques. Do not split words into letters.`;
    case "hi":
      return `Hindi focus (use Hindi terms):
- Postpositions, gender/number agreement, split verbs, honorifics, SOV word order, unnatural calques from English.`;
    default:
      return `Focus on real morphosyntax, agreement, function words, and patterns that natives would mark as wrong in ${learningLanguageName(targetLanguage)}.`;
  }
}
