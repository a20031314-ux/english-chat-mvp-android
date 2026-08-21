/**
 * Supported languages the user can learn (target language).
 * UI / interface language is separate (`appUiLocale` in copy.ts).
 *
 * Add new learning languages here only — do not scatter lists across the app.
 */

export const APP_TARGET_LANGUAGE_STORAGE_KEY = "appTargetLanguage";

export const DEFAULT_LEARNING_LANGUAGE_CODE = "en" as const;

export type LearningLanguageCode =
  | "en"
  | "ko"
  | "ja"
  | "zh"
  | "es"
  | "fr"
  | "it"
  | "pt"
  | "ru"
  | "ar"
  | "id"
  | "vi"
  | "th"
  | "hi";

export type LearningLanguage = {
  code: LearningLanguageCode;
  /** English display name for prompts / internal use */
  name: string;
  /** Native / common UI label */
  nativeLabel: string;
  /** Flag emoji (fallback; Windows often does not render these) */
  flag: string;
  /** ISO 3166-1 alpha-2 country code for flag image */
  flagCountry: string;
};

export const SUPPORTED_LEARNING_LANGUAGES: readonly LearningLanguage[] = [
  {
    code: "en",
    name: "English",
    nativeLabel: "English",
    flag: "🇺🇸",
    flagCountry: "us",
  },
  {
    code: "ko",
    name: "Korean",
    nativeLabel: "한국어",
    flag: "🇰🇷",
    flagCountry: "kr",
  },
  {
    code: "ja",
    name: "Japanese",
    nativeLabel: "日本語",
    flag: "🇯🇵",
    flagCountry: "jp",
  },
  {
    code: "zh",
    name: "Chinese",
    nativeLabel: "中文",
    flag: "🇨🇳",
    flagCountry: "cn",
  },
  {
    code: "es",
    name: "Spanish",
    nativeLabel: "Español",
    flag: "🇪🇸",
    flagCountry: "es",
  },
  {
    code: "fr",
    name: "French",
    nativeLabel: "Français",
    flag: "🇫🇷",
    flagCountry: "fr",
  },
  {
    code: "it",
    name: "Italian",
    nativeLabel: "Italiano",
    flag: "🇮🇹",
    flagCountry: "it",
  },
  {
    code: "pt",
    name: "Portuguese",
    nativeLabel: "Português",
    flag: "🇵🇹",
    flagCountry: "pt",
  },
  {
    code: "ru",
    name: "Russian",
    nativeLabel: "Русский",
    flag: "🇷🇺",
    flagCountry: "ru",
  },
  {
    code: "ar",
    name: "Arabic",
    nativeLabel: "العربية",
    flag: "🇸🇦",
    flagCountry: "sa",
  },
  {
    code: "id",
    name: "Indonesian",
    nativeLabel: "Bahasa Indonesia",
    flag: "🇮🇩",
    flagCountry: "id",
  },
  {
    code: "vi",
    name: "Vietnamese",
    nativeLabel: "Tiếng Việt",
    flag: "🇻🇳",
    flagCountry: "vn",
  },
  {
    code: "th",
    name: "Thai",
    nativeLabel: "ไทย",
    flag: "🇹🇭",
    flagCountry: "th",
  },
  {
    code: "hi",
    name: "Hindi",
    nativeLabel: "हिन्दी",
    flag: "🇮🇳",
    flagCountry: "in",
  },
] as const;

const BY_CODE = Object.fromEntries(
  SUPPORTED_LEARNING_LANGUAGES.map((lang) => [lang.code, lang]),
) as Record<LearningLanguageCode, LearningLanguage>;

export function isLearningLanguageCode(
  value: unknown,
): value is LearningLanguageCode {
  return (
    typeof value === "string" &&
    Object.prototype.hasOwnProperty.call(BY_CODE, value)
  );
}

export function getLearningLanguage(
  code: LearningLanguageCode | string | null | undefined,
): LearningLanguage {
  if (isLearningLanguageCode(code)) {
    return BY_CODE[code];
  }
  return BY_CODE[DEFAULT_LEARNING_LANGUAGE_CODE];
}

/** BCP-47 tag for TTS / Speech Synthesis for a learning language. */
export function learningLanguageSpeechTag(
  code: LearningLanguageCode | string | null | undefined,
): string {
  const resolved = isLearningLanguageCode(code)
    ? code
    : DEFAULT_LEARNING_LANGUAGE_CODE;
  switch (resolved) {
    case "en":
      return "en-US";
    case "ko":
      return "ko-KR";
    case "ja":
      return "ja-JP";
    case "zh":
      return "zh-CN";
    case "es":
      return "es-ES";
    case "fr":
      return "fr-FR";
    case "it":
      return "it-IT";
    case "pt":
      return "pt-PT";
    case "ru":
      return "ru-RU";
    case "ar":
      return "ar-SA";
    case "id":
      return "id-ID";
    case "vi":
      return "vi-VN";
    case "th":
      return "th-TH";
    case "hi":
      return "hi-IN";
    default:
      return "en-US";
  }
}

export function learningLanguageTextDir(
  code: LearningLanguageCode | string | null | undefined,
): "rtl" | "ltr" {
  return getLearningLanguage(code).code === "ar" ? "rtl" : "ltr";
}

export type LearningScript =
  | "latin"
  | "hangul"
  | "japanese"
  | "hanzi"
  | "cyrillic"
  | "arabic"
  | "thai"
  | "devanagari";

/** Writing system of a learning / UI language. Used to hide redundant alphabet guides. */
export function learningLanguageScript(
  code: LearningLanguageCode | string | null | undefined,
): LearningScript {
  switch (getLearningLanguage(code).code) {
    case "ko":
      return "hangul";
    case "ja":
      return "japanese";
    case "zh":
      return "hanzi";
    case "ru":
      return "cyrillic";
    case "ar":
      return "arabic";
    case "th":
      return "thai";
    case "hi":
      return "devanagari";
    default:
      return "latin";
  }
}

export function learningLanguageName(
  code: LearningLanguageCode | string | null | undefined,
): string {
  return getLearningLanguage(code).name;
}

/** Prompt-facing English name for the app UI / explanation language. */
export function interfaceLanguageName(
  code: LearningLanguageCode | string | null | undefined,
): string {
  const lang = isLearningLanguageCode(code)
    ? getLearningLanguage(code)
    : getLearningLanguage("ko");
  return lang.code === "zh" ? "Simplified Chinese" : lang.name;
}

/** Prompt label, e.g. "Korean (한국어)". */
export function interfaceLanguagePromptLabel(
  code: LearningLanguageCode | string | null | undefined,
): string {
  const lang = isLearningLanguageCode(code)
    ? getLearningLanguage(code)
    : getLearningLanguage("ko");
  if (lang.code === "en") return "English";
  if (lang.code === "zh") return "Simplified Chinese";
  return `${lang.name} (${lang.nativeLabel})`;
}

/**
 * UI locales are the learning languages. Adding a learning language
 * automatically adds it as an interface language.
 */
export const INTERFACE_LANGUAGE_LABELS: Record<string, string> =
  Object.fromEntries(
    SUPPORTED_LEARNING_LANGUAGES.map((lang) => [
      lang.code,
      interfaceLanguagePromptLabel(lang.code),
    ]),
  );

export function isInterfaceLanguage(
  value: unknown,
): value is LearningLanguageCode {
  return isLearningLanguageCode(value);
}

export function uiLocaleOptions(): Array<{
  key: LearningLanguageCode;
  label: string;
  flag: string;
  flagCountry: string;
}> {
  const preferred: LearningLanguageCode[] = ["ko", "en"];
  const seen = new Set<string>();
  const ordered: LearningLanguage[] = [];
  for (const code of [
    ...preferred,
    ...SUPPORTED_LEARNING_LANGUAGES.map((lang) => lang.code),
  ]) {
    if (seen.has(code)) continue;
    seen.add(code);
    ordered.push(getLearningLanguage(code));
  }
  return ordered.map((lang) => ({
    key: lang.code,
    label: lang.nativeLabel,
    flag: lang.flag,
    flagCountry: lang.flagCountry,
  }));
}

export function readStoredTargetLanguage(): LearningLanguageCode {
  if (typeof window === "undefined") {
    return DEFAULT_LEARNING_LANGUAGE_CODE;
  }
  try {
    const raw = window.localStorage.getItem(APP_TARGET_LANGUAGE_STORAGE_KEY);
    if (isLearningLanguageCode(raw)) return raw;
  } catch {
    // ignore
  }
  return DEFAULT_LEARNING_LANGUAGE_CODE;
}

export function persistTargetLanguage(code: LearningLanguageCode) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(APP_TARGET_LANGUAGE_STORAGE_KEY, code);
  } catch {
    // ignore
  }
}

/** Normalize legacy rows that lack languageCode → English (prior app default). */
export function coerceLanguageCode(
  value: unknown,
): LearningLanguageCode {
  return isLearningLanguageCode(value)
    ? value
    : DEFAULT_LEARNING_LANGUAGE_CODE;
}

/**
 * How to say the learning-language name inside UI copy for a given interface locale.
 * Used to replace `{targetLanguage}` placeholders (e.g. "Chat in {targetLanguage}").
 */
const LEARNING_LANGUAGE_UI_LABELS: Record<
  string,
  Record<LearningLanguageCode, string>
> = {
  ko: {
    en: "영어",
    ko: "한국어",
    ja: "일본어",
    zh: "중국어",
    es: "스페인어",
    fr: "프랑스어",
    it: "이탈리아어",
    pt: "포르투갈어",
    ru: "러시아어",
    ar: "아랍어",
    id: "인도네시아어",
    vi: "베트남어",
    th: "태국어",
    hi: "힌디어",
  },
  en: {
    en: "English",
    ko: "Korean",
    ja: "Japanese",
    zh: "Chinese",
    es: "Spanish",
    fr: "French",
    it: "Italian",
    pt: "Portuguese",
    ru: "Russian",
    ar: "Arabic",
    id: "Indonesian",
    vi: "Vietnamese",
    th: "Thai",
    hi: "Hindi",
  },
  es: {
    en: "inglés",
    ko: "coreano",
    ja: "japonés",
    zh: "chino",
    es: "español",
    fr: "francés",
    it: "italiano",
    pt: "portugués",
    ru: "ruso",
    ar: "árabe",
    id: "indonesio",
    vi: "vietnamita",
    th: "tailandés",
    hi: "hindi",
  },
  ja: {
    en: "英語",
    ko: "韓国語",
    ja: "日本語",
    zh: "中国語",
    es: "スペイン語",
    fr: "フランス語",
    it: "イタリア語",
    pt: "ポルトガル語",
    ru: "ロシア語",
    ar: "アラビア語",
    id: "インドネシア語",
    vi: "ベトナム語",
    th: "タイ語",
    hi: "ヒンディー語",
  },
  zh: {
    en: "英语",
    ko: "韩语",
    ja: "日语",
    zh: "中文",
    es: "西班牙语",
    fr: "法语",
    it: "意大利语",
    pt: "葡萄牙语",
    ru: "俄语",
    ar: "阿拉伯语",
    id: "印尼语",
    vi: "越南语",
    th: "泰语",
    hi: "印地语",
  },
  vi: {
    en: "tiếng Anh",
    ko: "tiếng Hàn",
    ja: "tiếng Nhật",
    zh: "tiếng Trung",
    es: "tiếng Tây Ban Nha",
    fr: "tiếng Pháp",
    it: "tiếng Ý",
    pt: "tiếng Bồ Đào Nha",
    ru: "tiếng Nga",
    ar: "tiếng Ả Rập",
    id: "tiếng Indonesia",
    vi: "tiếng Việt",
    th: "tiếng Thái",
    hi: "tiếng Hindi",
  },
  fr: {
    en: "anglais",
    ko: "coréen",
    ja: "japonais",
    zh: "chinois",
    es: "espagnol",
    fr: "français",
    it: "italien",
    pt: "portugais",
    ru: "russe",
    ar: "arabe",
    id: "indonésien",
    vi: "vietnamien",
    th: "thaï",
    hi: "hindi",
  },
  pt: {
    en: "inglês",
    ko: "coreano",
    ja: "japonês",
    zh: "chinês",
    es: "espanhol",
    fr: "francês",
    it: "italiano",
    pt: "português",
    ru: "russo",
    ar: "árabe",
    id: "indonésio",
    vi: "vietnamita",
    th: "tailandês",
    hi: "hindi",
  },
  id: {
    en: "bahasa Inggris",
    ko: "bahasa Korea",
    ja: "bahasa Jepang",
    zh: "bahasa Mandarin",
    es: "bahasa Spanyol",
    fr: "bahasa Prancis",
    it: "bahasa Italia",
    pt: "bahasa Portugis",
    ru: "bahasa Rusia",
    ar: "bahasa Arab",
    id: "bahasa Indonesia",
    vi: "bahasa Vietnam",
    th: "bahasa Thai",
    hi: "bahasa Hindi",
  },
  it: {
    en: "inglese",
    ko: "coreano",
    ja: "giapponese",
    zh: "cinese",
    es: "spagnolo",
    fr: "francese",
    it: "italiano",
    pt: "portoghese",
    ru: "russo",
    ar: "arabo",
    id: "indonesiano",
    vi: "vietnamita",
    th: "thai",
    hi: "hindi",
  },
  ru: {
    en: "английский",
    ko: "корейский",
    ja: "японский",
    zh: "китайский",
    es: "испанский",
    fr: "французский",
    it: "итальянский",
    pt: "португальский",
    ru: "русский",
    ar: "арабский",
    id: "индонезийский",
    vi: "вьетнамский",
    th: "тайский",
    hi: "хинди",
  },
  ar: {
    en: "الإنجليزية",
    ko: "الكورية",
    ja: "اليابانية",
    zh: "الصينية",
    es: "الإسبانية",
    fr: "الفرنسية",
    it: "الإيطالية",
    pt: "البرتغالية",
    ru: "الروسية",
    ar: "العربية",
    id: "الإندونيسية",
    vi: "الفيتنامية",
    th: "التايلاندية",
    hi: "الهندية",
  },
  th: {
    en: "ภาษาอังกฤษ",
    ko: "ภาษาเกาหลี",
    ja: "ภาษาญี่ปุ่น",
    zh: "ภาษาจีน",
    es: "ภาษาสเปน",
    fr: "ภาษาฝรั่งเศส",
    it: "ภาษาอิตาลี",
    pt: "ภาษาโปรตุเกส",
    ru: "ภาษารัสเซีย",
    ar: "ภาษาอาหรับ",
    id: "ภาษาอินโดนีเซีย",
    vi: "ภาษาเวียดนาม",
    th: "ภาษาไทย",
    hi: "ภาษาฮินดี",
  },
  hi: {
    en: "अंग्रेज़ी",
    ko: "कोरियाई",
    ja: "जापानी",
    zh: "चीनी",
    es: "स्पेनिश",
    fr: "फ़्रेंच",
    it: "इतालवी",
    pt: "पुर्तगाली",
    ru: "रूसी",
    ar: "अरबी",
    id: "इंडोनेशियाई",
    vi: "वियतनामी",
    th: "थाई",
    hi: "हिन्दी",
  },
};

export function learningLanguageUiLabel(
  code: LearningLanguageCode | string | null | undefined,
  interfaceLocale: string,
): string {
  const resolved = getLearningLanguage(code).code;
  const pack =
    LEARNING_LANGUAGE_UI_LABELS[interfaceLocale] ??
    LEARNING_LANGUAGE_UI_LABELS.en;
  return pack[resolved] ?? getLearningLanguage(resolved).name;
}
