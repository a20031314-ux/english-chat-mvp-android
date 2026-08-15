import { APP_LOCALE_STORAGE_KEY, type Locale } from "@/lib/copy";

/** Cyrillic letter → Korean approximate sound (learner-facing). */
const CYRILLIC_KO: Record<string, string> = {
  а: "아",
  б: "브",
  в: "브",
  г: "그",
  д: "드",
  е: "예",
  ё: "요",
  ж: "주",
  з: "즈",
  и: "이",
  й: "이",
  к: "크",
  л: "엘",
  м: "므",
  н: "느",
  о: "오",
  п: "프",
  р: "르",
  с: "스",
  т: "트",
  у: "우",
  ф: "프",
  х: "흐",
  ц: "츠",
  ч: "치",
  ш: "슈",
  щ: "시",
  ъ: "경음부호",
  ы: "이",
  ь: "연음부호",
  э: "에",
  ю: "유",
  я: "야",
};

/** Cyrillic letter → simple Latin cue. */
const CYRILLIC_LATIN: Record<string, string> = {
  а: "a",
  б: "b",
  в: "v",
  г: "g",
  д: "d",
  е: "ye",
  ё: "yo",
  ж: "zh",
  з: "z",
  и: "i",
  й: "y",
  к: "k",
  л: "l",
  м: "m",
  н: "n",
  о: "o",
  п: "p",
  р: "r",
  с: "s",
  т: "t",
  у: "u",
  ф: "f",
  х: "kh",
  ц: "ts",
  ч: "ch",
  ш: "sh",
  щ: "shch",
  ъ: "hard sign",
  ы: "y",
  ь: "soft sign",
  э: "e",
  ю: "yu",
  я: "ya",
};

function readUiLocale(): Locale {
  if (typeof window === "undefined") return "ko";
  try {
    const raw = window.localStorage.getItem(APP_LOCALE_STORAGE_KEY);
    if (
      raw === "ko" ||
      raw === "en" ||
      raw === "es" ||
      raw === "ja" ||
      raw === "zh" ||
      raw === "vi" ||
      raw === "fr" ||
      raw === "pt" ||
      raw === "id"
    ) {
      return raw;
    }
  } catch {
    // ignore
  }
  return "ko";
}

/** Single letter that should show instant pronunciation (not vocab sheet). */
export function isPronounceableAlphabetLetter(text: string): boolean {
  if (!text || Array.from(text).length !== 1) return false;
  return /^[\u0400-\u04FF]$/u.test(text);
}

/**
 * Instant pronunciation cue for an unfamiliar alphabet letter.
 * Returns null when we have no static cue (caller may fall back).
 */
export function letterPronunciation(
  letter: string,
  locale: Locale = readUiLocale(),
): string | null {
  const chars = Array.from(letter);
  if (chars.length !== 1) return null;
  const ch = chars[0];

  if (/^[\u0400-\u04FF]$/u.test(ch)) {
    const key = ch.toLowerCase();
    if (locale === "ko") return CYRILLIC_KO[key] ?? null;
    return CYRILLIC_LATIN[key] ?? null;
  }

  return null;
}
