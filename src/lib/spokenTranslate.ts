import {
  naturalTranslationPrinciples,
  type TranslationSourceType,
} from "@/lib/naturalTranslation";

const TARGET_LANGUAGES: Record<string, string> = {
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
  return TARGET_LANGUAGES[locale] ?? TARGET_LANGUAGES.ko;
}

/** Colloquial translation of a spoken English line — meaning-faithful, not a calque. */
export function spokenTranslateSystem(
  locale: string,
  sourceType: TranslationSourceType = "conversation",
): string {
  const target = spokenTranslateTarget(locale);
  const tutorKo =
    locale === "ko"
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

  return `Translate the English into natural spoken ${target}.

${naturalTranslationPrinciples({ locale, role: "utterance", sourceType })}
${tutorKo}
Return ONLY JSON: {"translated":"..."}`;
}
