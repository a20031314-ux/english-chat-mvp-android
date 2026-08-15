/** Normalize BCP-47 / underscored voice tags: "es_MX" → "es-mx". */
export function normalizeSpeechLang(lang: string): string {
  return lang.trim().replace(/_/g, "-").toLowerCase();
}

export function speechLangPrefix(lang: string): string {
  return normalizeSpeechLang(lang).slice(0, 2);
}

/**
 * Regional tags to try so we lock onto the learning language
 * instead of the document's English default.
 */
export function speechLangCandidates(lang: string): string[] {
  const prefix = speechLangPrefix(lang);
  const extras: Record<string, string[]> = {
    en: ["en-US", "en-GB", "en-AU", "en"],
    es: ["es-ES", "es-MX", "es-US", "es-AR", "es"],
    pt: ["pt-BR", "pt-PT", "pt"],
    fr: ["fr-FR", "fr-CA", "fr"],
    it: ["it-IT", "it"],
    de: ["de-DE", "de"],
    ja: ["ja-JP", "ja"],
    ko: ["ko-KR", "ko"],
    zh: ["zh-CN", "zh-TW", "zh-HK", "cmn-Hans-CN", "zh"],
    ru: ["ru-RU", "ru"],
  };
  return [...new Set([lang, ...(extras[prefix] ?? [prefix])])];
}

export type SpeechVoiceLike = {
  lang?: string;
  name?: string;
  localService?: boolean;
  default?: boolean;
};

function voiceLang(voice: SpeechVoiceLike): string {
  return normalizeSpeechLang(voice.lang || "");
}

const VOICE_NAME_HINTS: Record<string, string[]> = {
  pt: ["portuguese", "português", "portugues", "brasil", "brazil", "portugal"],
  es: ["spanish", "español", "espanol", "mexico", "argentin"],
  fr: ["french", "français", "francais"],
  it: ["italian", "italiano"],
  de: ["german", "deutsch"],
  ja: ["japanese", "日本語"],
  ko: ["korean", "한국어", "hangul"],
  zh: ["chinese", "中文", "pinyin", "mandarin", "cantonese"],
  ru: ["russian", "русский"],
  en: ["english"],
};

function looksEnglishVoice(voice: SpeechVoiceLike): boolean {
  const tag = voiceLang(voice);
  const name = (voice.name || "").toLowerCase();
  if (tag === "en" || tag.startsWith("en-")) return true;
  return /\benglish\b|\ben-us\b|\ben-gb\b/.test(name);
}

function voiceNameMatches(voice: SpeechVoiceLike, prefix: string): boolean {
  const name = (voice.name || "").toLowerCase();
  return (VOICE_NAME_HINTS[prefix] ?? []).some((hint) => name.includes(hint));
}

function voiceMatchesPrefix(voice: SpeechVoiceLike, prefix: string): boolean {
  const tag = voiceLang(voice);
  const langHit = tag === prefix || tag.startsWith(`${prefix}-`);
  const nameHit = voiceNameMatches(voice, prefix);
  // English-tagged voices must not be used for other languages
  // unless the name clearly says Portuguese/Spanish/etc.
  if (prefix !== "en" && looksEnglishVoice(voice) && !nameHit) {
    return false;
  }
  return langHit || nameHit;
}

/**
 * Pick a voice that actually speaks `lang`. Never returns an English voice
 * when the requested language is not English.
 */
export function pickSpeechVoice<T extends SpeechVoiceLike>(
  voices: readonly T[],
  lang: string,
): T | null {
  const prefix = speechLangPrefix(lang);
  if (!prefix) return null;
  const candidates = voices.filter((voice) =>
    voiceMatchesPrefix(voice, prefix),
  );
  if (candidates.length === 0) return null;

  for (const tag of speechLangCandidates(lang).map(normalizeSpeechLang)) {
    const exact = candidates.find((voice) => voiceLang(voice) === tag);
    if (exact) return exact;
    const starts = candidates.find((voice) =>
      voiceLang(voice).startsWith(`${tag}-`),
    );
    if (starts) return starts;
  }

  return (
    candidates.find((voice) => voice.localService) ??
    candidates.find((voice) => voice.default) ??
    candidates[0]
  );
}

/** True when a local voice is safe to use for this learning language. */
export function canUseLocalSpeechVoice(
  voice: SpeechVoiceLike | null | undefined,
  lang: string,
): boolean {
  if (!voice) return false;
  const prefix = speechLangPrefix(lang);
  if (prefix === "en") return true;
  if (looksEnglishVoice(voice) && !voiceNameMatches(voice, prefix)) {
    return false;
  }
  return voiceMatchesPrefix(voice, prefix);
}

const SPEECH_LANGUAGE_NAMES: Record<string, string> = {
  en: "English",
  es: "Spanish",
  pt: "Portuguese",
  fr: "French",
  it: "Italian",
  de: "German",
  ja: "Japanese",
  ko: "Korean",
  zh: "Chinese",
  ru: "Russian",
};

/** Prompt for OpenAI TTS. Local device TTS has no prompt. */
export function ttsSpeechInstructions(lang: string): string {
  const prefix = speechLangPrefix(lang);
  const name = SPEECH_LANGUAGE_NAMES[prefix] ?? "the target language";
  const extra: Record<string, string> = {
    pt: 'Read "né", "ne", and "ne?" as the Portuguese tag question "né". Never spell N-E in English.',
    es: 'Never use English letter names. Spanish "j" is jota, not English "jay".',
  };
  return [
    `Speak only in ${name}.`,
    `Do not use English pronunciation.`,
    `Do not switch languages mid-utterance.`,
    `Read the text as natural native ${name} speech.`,
    `Do not spell letters unless the input is a single alphabet letter.`,
    extra[prefix] ?? "",
  ]
    .filter(Boolean)
    .join(" ");
}

const LATIN_LETTER_NAMES: Record<string, Record<string, string>> = {
  es: {
    a: "a",
    b: "be",
    c: "ce",
    d: "de",
    e: "e",
    f: "efe",
    g: "ge",
    h: "hache",
    i: "i",
    j: "jota",
    k: "ka",
    l: "ele",
    m: "eme",
    n: "ene",
    ñ: "eñe",
    o: "o",
    p: "pe",
    q: "cu",
    r: "erre",
    s: "ese",
    t: "te",
    u: "u",
    v: "uve",
    w: "uve doble",
    x: "equis",
    y: "ye",
    z: "zeta",
  },
  pt: {
    a: "a",
    b: "bê",
    c: "cê",
    d: "dê",
    e: "e",
    f: "efe",
    g: "gê",
    h: "agá",
    i: "i",
    j: "jota",
    k: "cá",
    l: "ele",
    m: "eme",
    n: "ene",
    o: "o",
    p: "pê",
    q: "quê",
    r: "erre",
    s: "esse",
    t: "tê",
    u: "u",
    v: "vê",
    w: "dáblio",
    x: "xis",
    y: "ípsilon",
    z: "zê",
    ç: "cê cedilha",
  },
  fr: {
    a: "a",
    b: "bé",
    c: "cé",
    d: "dé",
    e: "e",
    f: "effe",
    g: "gé",
    h: "ache",
    i: "i",
    j: "ji",
    k: "ka",
    l: "elle",
    m: "emme",
    n: "enne",
    o: "o",
    p: "pé",
    q: "ku",
    r: "erre",
    s: "esse",
    t: "té",
    u: "u",
    v: "vé",
    w: "double vé",
    x: "ixe",
    y: "i grec",
    z: "zède",
    ç: "cé cédille",
  },
  it: {
    a: "a",
    b: "bi",
    c: "ci",
    d: "di",
    e: "e",
    f: "effe",
    g: "gi",
    h: "acca",
    i: "i",
    j: "i lunga",
    k: "cappa",
    l: "elle",
    m: "emme",
    n: "enne",
    o: "o",
    p: "pi",
    q: "cu",
    r: "erre",
    s: "esse",
    t: "ti",
    u: "u",
    v: "vu",
    w: "vu doppia",
    x: "ics",
    y: "ipsilon",
    z: "zeta",
  },
};

/**
 * Isolated Latin letters are otherwise read with English names ("jay").
 * Short particles like Portuguese "ne?" must stay a word ("né"), not N-E.
 */
export function spokenFormForTts(text: string, lang: string): string {
  const trimmed = text.replace(/\s+/g, " ").trim();
  if (!trimmed) return "";
  const prefix = speechLangPrefix(lang);
  const core = trimmed.replace(/^[^\p{L}\p{M}]+|[^\p{L}\p{M}]+$/gu, "");
  const letters = Array.from(core);

  if (letters.length === 1) {
    const names = LATIN_LETTER_NAMES[prefix];
    const named = names?.[letters[0].toLowerCase()];
    if (named) return named;
  }

  if (prefix === "pt") {
    const folded = core
      .normalize("NFD")
      .replace(/\p{M}/gu, "")
      .toLowerCase();
    if (folded === "ne") return "né";
  }

  return core || trimmed;
}

export function waitForSpeechVoices(): Promise<SpeechSynthesisVoice[]> {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return Promise.resolve([]);
  }
  const current = window.speechSynthesis.getVoices();
  if (current.length > 0) return Promise.resolve(current);
  return new Promise((resolve) => {
    const finish = () => {
      window.speechSynthesis.removeEventListener("voiceschanged", finish);
      resolve(window.speechSynthesis.getVoices());
    };
    window.speechSynthesis.addEventListener("voiceschanged", finish);
    window.setTimeout(finish, 700);
  });
}
