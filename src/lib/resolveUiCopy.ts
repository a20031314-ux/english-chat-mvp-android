import { copy, type Locale, type UICopy } from "@/lib/copy";
import {
  DEFAULT_LEARNING_LANGUAGE_CODE,
  learningLanguageUiLabel,
  type LearningLanguageCode,
} from "@/lib/learningLanguages";

const SKIP_TARGET_LANGUAGE_KEYS = new Set([
  // UI locale option label for English — not the learning target.
  "languageEnglish",
]);

/**
 * Replace `{targetLanguage}` in UI copy with the localized learning-language name.
 */
export function applyTargetLanguageCopy(
  ui: UICopy,
  targetLanguage: LearningLanguageCode,
  interfaceLocale: Locale | string,
): UICopy {
  const label = learningLanguageUiLabel(targetLanguage, interfaceLocale);
  const out = { ...ui } as UICopy;
  for (const key of Object.keys(out) as (keyof UICopy)[]) {
    if (SKIP_TARGET_LANGUAGE_KEYS.has(String(key))) continue;
    const value = out[key];
    if (typeof value !== "string" || !value.includes("{targetLanguage}")) {
      continue;
    }
    (out as Record<string, string>)[key as string] = value
      .split("{targetLanguage}")
      .join(label);
  }
  return out;
}

export function resolveUiCopy(
  locale: Locale,
  targetLanguage: LearningLanguageCode = DEFAULT_LEARNING_LANGUAGE_CODE,
): UICopy {
  return applyTargetLanguageCopy(copy[locale], targetLanguage, locale);
}
