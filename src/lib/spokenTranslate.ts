import {
  naturalTranslationPrinciples,
  type TranslationSourceType,
} from "@/lib/naturalTranslation";
import { learningLanguageName } from "@/lib/learningLanguages";
import { interfaceLanguageDisplayName } from "@/lib/languageLearningAnalysis";

const INTERFACE_LANGUAGES: Record<string, string> = {
  ko: "Korean",
  en: "English",
  es: "Spanish",
  ja: "Japanese",
  zh: "Simplified Chinese",
  vi: "Vietnamese",
  fr: "French",
  pt: "Portuguese",
  id: "Indonesian",
};

export function spokenTranslateTarget(locale: string): string {
  return INTERFACE_LANGUAGES[locale] ?? INTERFACE_LANGUAGES.ko;
}

export type SpokenTranslateOptions = {
  /** @deprecated Prefer interfaceLanguage. */
  locale?: string;
  targetLanguage?: string;
  interfaceLanguage?: string;
  sourceType?: TranslationSourceType;
};

function resolveOptions(
  localeOrOptions: string | SpokenTranslateOptions,
  sourceType: TranslationSourceType = "conversation",
): Required<
  Pick<SpokenTranslateOptions, "interfaceLanguage" | "targetLanguage" | "sourceType">
> & { locale: string } {
  const options: SpokenTranslateOptions =
    typeof localeOrOptions === "string"
      ? { locale: localeOrOptions, sourceType }
      : { sourceType, ...localeOrOptions };

  const interfaceLanguage =
    options.interfaceLanguage ?? options.locale ?? "ko";
  return {
    locale: interfaceLanguage,
    interfaceLanguage,
    targetLanguage: options.targetLanguage ?? "en",
    sourceType: options.sourceType ?? sourceType,
  };
}

/**
 * Shared meaning-faithful translation craft used by chat translate and
 * video learning gloss / captions. Callers supply their own output schema.
 */
export function spokenTranslatePrinciples(
  localeOrOptions: string | SpokenTranslateOptions,
  sourceType: TranslationSourceType = "conversation",
): string {
  const options = resolveOptions(localeOrOptions, sourceType);
  const { interfaceLanguage, targetLanguage, sourceType: resolvedSourceType } =
    options;
  const interfaceName =
    INTERFACE_LANGUAGES[interfaceLanguage] ??
    interfaceLanguageDisplayName(interfaceLanguage);
  const targetName = learningLanguageName(targetLanguage);
  const keepEnKoCraft =
    targetLanguage === "en" && interfaceLanguage === "ko";

  const tutorKo = keepEnKoCraft
    ? `

Conversation Korean:
- Casual chat → 반말. Formal English → 해요체.
- Do not follow English word order.
- "That sucks." → "아, 그건 좀 별로네." / "아, 그거 진짜 안됐다."
- "Dude, that's insane." → "야, 그거 미쳤는데?"
- "I'm screwed." → "나 망했다."
- "No freaking way." → "말도 안 돼." / "와, 진짜?"
- "You've gotta be kidding me." → "장난이지?" / "설마, 진짜야?"
- "Damn, I totally screwed that up." → "아, 나 그거 완전 망쳤네."
- Keep the joke. Keep the force. Do not textbook-sanitize.
`
    : "";

  const lead = keepEnKoCraft
    ? `Translate the English into natural spoken ${interfaceName}.`
    : `Interpret the ${targetName} content naturally in ${interfaceName}.`;

  return `${lead}

${naturalTranslationPrinciples({
  locale: interfaceLanguage,
  targetLanguage,
  interfaceLanguage,
  role: "utterance",
  sourceType: resolvedSourceType,
})}
${tutorKo}`.trim();
}

/** Colloquial translation of a spoken target-language line — meaning-faithful, not a calque. */
export function spokenTranslateSystem(
  localeOrOptions: string | SpokenTranslateOptions,
  sourceType: TranslationSourceType = "conversation",
): string {
  return `${spokenTranslatePrinciples(localeOrOptions, sourceType)}

Return ONLY JSON: {"translated":"..."}`;
}
