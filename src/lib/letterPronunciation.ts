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

/** Hiragana → Korean approximate sound. */
const HIRAGANA_KO: Record<string, string> = {
  あ: "아",
  い: "이",
  う: "우",
  え: "에",
  お: "오",
  か: "카",
  き: "키",
  く: "쿠",
  け: "케",
  こ: "코",
  が: "가",
  ぎ: "기",
  ぐ: "구",
  げ: "게",
  ご: "고",
  さ: "사",
  し: "시",
  す: "스",
  せ: "세",
  そ: "소",
  ざ: "자",
  じ: "지",
  ず: "즈",
  ぜ: "제",
  ぞ: "조",
  た: "타",
  ち: "치",
  つ: "츠",
  て: "테",
  と: "토",
  だ: "다",
  ぢ: "지",
  づ: "즈",
  で: "데",
  ど: "도",
  な: "나",
  に: "니",
  ぬ: "누",
  ね: "네",
  の: "노",
  は: "하",
  ひ: "히",
  ふ: "후",
  へ: "헤",
  ほ: "호",
  ば: "바",
  び: "비",
  ぶ: "부",
  べ: "베",
  ぼ: "보",
  ぱ: "파",
  ぴ: "피",
  ぷ: "푸",
  ぺ: "페",
  ぽ: "포",
  ま: "마",
  み: "미",
  む: "무",
  め: "메",
  も: "모",
  や: "야",
  ゆ: "유",
  よ: "요",
  ら: "라",
  り: "리",
  る: "루",
  れ: "레",
  ろ: "로",
  わ: "와",
  を: "오",
  ん: "응",
  ぁ: "아",
  ぃ: "이",
  ぅ: "우",
  ぇ: "에",
  ぉ: "오",
  ゃ: "야",
  ゅ: "유",
  ょ: "요",
  っ: "촉음",
  ー: "장음",
};

/** Hiragana → romaji. */
const HIRAGANA_ROMAJI: Record<string, string> = {
  あ: "a",
  い: "i",
  う: "u",
  え: "e",
  お: "o",
  か: "ka",
  き: "ki",
  く: "ku",
  け: "ke",
  こ: "ko",
  が: "ga",
  ぎ: "gi",
  ぐ: "gu",
  げ: "ge",
  ご: "go",
  さ: "sa",
  し: "shi",
  す: "su",
  せ: "se",
  そ: "so",
  ざ: "za",
  じ: "ji",
  ず: "zu",
  ぜ: "ze",
  ぞ: "zo",
  た: "ta",
  ち: "chi",
  つ: "tsu",
  て: "te",
  と: "to",
  だ: "da",
  ぢ: "ji",
  づ: "zu",
  で: "de",
  ど: "do",
  な: "na",
  に: "ni",
  ぬ: "nu",
  ね: "ne",
  の: "no",
  は: "ha",
  ひ: "hi",
  ふ: "fu",
  へ: "he",
  ほ: "ho",
  ば: "ba",
  び: "bi",
  ぶ: "bu",
  べ: "be",
  ぼ: "bo",
  ぱ: "pa",
  ぴ: "pi",
  ぷ: "pu",
  ぺ: "pe",
  ぽ: "po",
  ま: "ma",
  み: "mi",
  む: "mu",
  め: "me",
  も: "mo",
  や: "ya",
  ゆ: "yu",
  よ: "yo",
  ら: "ra",
  り: "ri",
  る: "ru",
  れ: "re",
  ろ: "ro",
  わ: "wa",
  を: "o",
  ん: "n",
  ぁ: "a",
  ぃ: "i",
  ぅ: "u",
  ぇ: "e",
  ぉ: "o",
  ゃ: "ya",
  ゅ: "yu",
  ょ: "yo",
  っ: "っ",
  ー: "—",
};

const HIRA_TO_KATA_OFFSET = 0x60;

function katakanaToHiragana(char: string): string {
  const code = char.codePointAt(0);
  if (code == null) return char;
  // Katakana block → hiragana
  if (code >= 0x30a1 && code <= 0x30f6) {
    return String.fromCodePoint(code - HIRA_TO_KATA_OFFSET);
  }
  return char;
}

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

/** Single letter/syllabary unit that should show instant pronunciation (not vocab sheet). */
export function isPronounceableAlphabetLetter(text: string): boolean {
  if (!text || Array.from(text).length !== 1) return false;
  // Cyrillic
  if (/^[\u0400-\u04FF]$/u.test(text)) return true;
  // Hiragana / Katakana (Japanese syllabary)
  if (/^[\u3040-\u309F\u30A0-\u30FF]$/u.test(text)) return true;
  return false;
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

  if (/^[\u3040-\u309F\u30A0-\u30FF]$/u.test(ch)) {
    const hira = katakanaToHiragana(ch);
    if (locale === "ko") return HIRAGANA_KO[hira] ?? HIRAGANA_KO[ch] ?? null;
    return HIRAGANA_ROMAJI[hira] ?? HIRAGANA_ROMAJI[ch] ?? null;
  }

  return null;
}
