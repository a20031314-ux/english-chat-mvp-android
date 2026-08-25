import {
  SUPPORTED_LEARNING_LANGUAGES,
  learningLanguageName,
  type LearningLanguageCode,
} from "../learningLanguages.ts";
import type { AnalysisDimension, LanguageProfile } from "./types.ts";

export const ALL_ANALYSIS_DIMENSIONS: AnalysisDimension[] = [
  "syntax",
  "usageInContext",
  "phonology",
  "morphology",
  "pragmatics",
  "etymology",
];

/** Conservative fallback when a language has no row yet. Pipeline still runs. */
export const DEFAULT_LANGUAGE_PROFILE: LanguageProfile = {
  languageCode: "*",
  activeDimensions: ["syntax", "usageInContext", "morphology"],
  dimensionFocus: {
    syntax: ["core word order", "argument structure"],
    usageInContext: ["collocation", "typical vs this-sentence use"],
    morphology: ["inflection that changes meaning"],
  },
};

/**
 * Per-language analysis axes. Adding a learning language should mean:
 * 1) add it to SUPPORTED_LEARNING_LANGUAGES
 * 2) add a row here
 * The dimension orchestrator must not switch on language codes.
 */
export const LANGUAGE_PROFILES: Record<LearningLanguageCode, LanguageProfile> = {
  en: {
    languageCode: "en",
    activeDimensions: ["syntax", "usageInContext", "morphology", "etymology"],
    dimensionFocus: {
      syntax: ["SVO order", "auxiliaries", "relative clauses", "phrasal-verb syntax"],
      usageInContext: ["phrasal verbs", "collocations", "register of the chunk"],
      morphology: ["irregular verbs", "tense/aspect", "3sg -s"],
      etymology: ["idiom origin", "why this particle pairs with this verb"],
    },
  },
  es: {
    languageCode: "es",
    activeDimensions: ["syntax", "usageInContext", "phonology", "morphology"],
    dimensionFocus: {
      syntax: ["pro-drop", "ser/estar", "clitic pronouns", "mood choice"],
      usageInContext: ["set phrases", "why this mood/tense here"],
      phonology: ["sinalefa / linking", "stress shift", "vowel reduction", "seseo vs distinción if relevant"],
      morphology: ["person/number endings", "gender agreement", "irregular stems"],
    },
  },
  ko: {
    languageCode: "ko",
    activeDimensions: ["syntax", "usageInContext", "morphology", "pragmatics"],
    dimensionFocus: {
      syntax: ["SOV order", "topic vs subject", "modifier-before-head"],
      usageInContext: ["why this ending/particle here", "typical vs this-sentence use"],
      morphology: ["조사", "선어말·어말 어미", "불규칙 활용"],
      pragmatics: ["존댓말/반말", "주체·객체 높임", "격식 뉘앙스"],
    },
  },
  ja: {
    languageCode: "ja",
    activeDimensions: ["syntax", "usageInContext", "morphology", "pragmatics"],
    dimensionFocus: {
      syntax: ["SOV", "particles as case", "relative clauses before the noun"],
      usageInContext: ["set expressions", "why this form here"],
      morphology: ["活用", "助詞", "て-form chains"],
      pragmatics: ["敬語", "丁寧体 vs 普通体"],
    },
  },
  zh: {
    languageCode: "zh",
    activeDimensions: ["syntax", "usageInContext", "phonology", "morphology"],
    dimensionFocus: {
      syntax: ["topic-comment", "coverbs", "aspect vs tense"],
      usageInContext: ["fixed patterns", "why this 了/过/着 here"],
      phonology: ["tone", "tone sandhi", "erhua if present"],
      morphology: ["aspect markers", "resultative compounds"],
    },
  },
  fr: {
    languageCode: "fr",
    activeDimensions: ["syntax", "usageInContext", "phonology", "morphology"],
    dimensionFocus: {
      syntax: ["clitics", "negation", "relative pronouns"],
      usageInContext: ["set phrases", "register"],
      phonology: ["liaison", "enchaînement", "mute e", "stress group"],
      morphology: ["gender/number", "tense/mood endings"],
    },
  },
  it: {
    languageCode: "it",
    activeDimensions: ["syntax", "usageInContext", "phonology", "morphology"],
    dimensionFocus: {
      syntax: ["pro-drop", "clitics", "agreement"],
      usageInContext: ["set phrases", "why this tense here"],
      phonology: ["raddoppiamento", "stress", "vowel quality"],
      morphology: ["person endings", "gender/number", "irregular stems"],
    },
  },
  pt: {
    languageCode: "pt",
    activeDimensions: ["syntax", "usageInContext", "phonology", "morphology"],
    dimensionFocus: {
      syntax: ["pro-drop", "clitics", "personal infinitive"],
      usageInContext: ["set phrases", "ser/estar/ficar"],
      phonology: ["reduction", "nasal vowels", "liaison-like linking"],
      morphology: ["person endings", "gender/number"],
    },
  },
  ru: {
    languageCode: "ru",
    activeDimensions: ["syntax", "usageInContext", "morphology"],
    dimensionFocus: {
      syntax: ["flexible order", "aspect choice"],
      usageInContext: ["verbs of motion", "why this case here"],
      morphology: ["case endings", "aspect pairs", "verb conjugation"],
    },
  },
  ar: {
    languageCode: "ar",
    activeDimensions: ["syntax", "usageInContext", "phonology", "morphology"],
    dimensionFocus: {
      syntax: ["VSO/SVO", "idafa", "agreement"],
      usageInContext: ["root-pattern chunks", "why this form here"],
      phonology: ["emphatics", "sun/moon assimilation", "case vowels if written"],
      morphology: ["root and pattern", "verb forms I–X", "case/mood"],
    },
  },
  id: {
    languageCode: "id",
    activeDimensions: ["syntax", "usageInContext", "morphology"],
    dimensionFocus: {
      syntax: ["SVO", "voice (me-/di-)"],
      usageInContext: ["set phrases", "particles lah/pun/sih if present"],
      morphology: ["affixes me-/ber-/ter-/pe-", "reduplication"],
    },
  },
  vi: {
    languageCode: "vi",
    activeDimensions: ["syntax", "usageInContext", "phonology", "pragmatics"],
    dimensionFocus: {
      syntax: ["classifier", "topic-comment", "aspect particles"],
      usageInContext: ["fixed patterns", "why this particle here"],
      phonology: ["tones", "tone sandhi in compounds"],
      pragmatics: ["pronoun/kinship terms", "politeness particles"],
    },
  },
  th: {
    languageCode: "th",
    activeDimensions: ["syntax", "usageInContext", "phonology", "pragmatics"],
    dimensionFocus: {
      syntax: ["SVO", "serial verbs", "classifiers"],
      usageInContext: ["set expressions", "why this particle here"],
      phonology: ["tones", "vowel length"],
      pragmatics: ["polite particles", "register"],
    },
  },
  hi: {
    languageCode: "hi",
    activeDimensions: ["syntax", "usageInContext", "morphology", "pragmatics"],
    dimensionFocus: {
      syntax: ["SOV", "postpositions", "ergativity with ने"],
      usageInContext: ["light-verb constructions", "why this postposition here"],
      morphology: ["case/oblique", "gender agreement", "aspect"],
      pragmatics: ["तुम/आप", "honorific verb forms"],
    },
  },
};

export function normalizeLanguageCode(code: string): string {
  return code.trim().toLowerCase().split(/[-_]/)[0] ?? code;
}

export function getLanguageProfile(language: string): LanguageProfile {
  const code = normalizeLanguageCode(language);
  const row = LANGUAGE_PROFILES[code as LearningLanguageCode];
  if (row) return row;
  return {
    ...DEFAULT_LANGUAGE_PROFILE,
    languageCode: code || "*",
  };
}

export function languageDisplayName(language: string): string {
  return learningLanguageName(language);
}

/** True when every app learning language has a profile row (add-row-only contract). */
export function languageProfileTableIsComplete(): boolean {
  return SUPPORTED_LEARNING_LANGUAGES.every((lang) => Boolean(LANGUAGE_PROFILES[lang.code]));
}

export function profileHasDimension(
  language: string,
  dimension: AnalysisDimension,
): boolean {
  return getLanguageProfile(language).activeDimensions.includes(dimension);
}
