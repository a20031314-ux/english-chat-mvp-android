import { copy, type Locale, type UICopy } from "@/lib/copy";
import {
  DEFAULT_LEARNING_LANGUAGE_CODE,
  learningLanguageUiLabel,
  type LearningLanguageCode,
} from "@/lib/learningLanguages";
import { iosStoreWording, isIosApp, STORE_WORDING_KEYS } from "@/lib/platform";

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

/** iOS 앱에서는 결제·구독 문구의 Play 스토어를 App Store로. */
export function applyStoreWording(ui: UICopy, ios: boolean): UICopy {
  if (!ios) return ui;
  const out = { ...ui } as Record<string, unknown>;
  for (const key of STORE_WORDING_KEYS) {
    const value = out[key];
    if (typeof value === "string") out[key] = iosStoreWording(value);
  }
  return out as UICopy;
}

export function resolveUiCopy(
  locale: Locale,
  targetLanguage: LearningLanguageCode = DEFAULT_LEARNING_LANGUAGE_CODE,
): UICopy {
  return applyStoreWording(
    applyTargetLanguageCopy(copy[locale], targetLanguage, locale),
    isIosApp(),
  );
}
