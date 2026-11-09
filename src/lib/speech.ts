/** Normalize BCP-47 / underscored voice tags: "es_MX" → "es-mx". */
export function normalizeSpeechLang(lang: string): string {
  return lang.trim().replace(/_/g, "-").toLowerCase();
}

export function speechLangPrefix(lang: string): string {
  return normalizeSpeechLang(lang).slice(0, 2);
}

export type SpeechVoiceLike = {
  lang?: string;
  name?: string;
  localService?: boolean;
  default?: boolean;
};

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
  ar: "Arabic",
  id: "Indonesian",
  vi: "Vietnamese",
  th: "Thai",
  hi: "Hindi",
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

/**
 * How a scene's own voice is asked to speak.
 *
 * The lines recorded into the app were made with a character brief — someone
 * doing their job, talking to a person, not announcing — and a line the scene
 * has to synthesise now sits directly beside them in the same conversation. If
 * the two are briefed differently they come out as two people, which is what a
 * learner hears: the same voice name performing twice.
 *
 * So this is the recorder's brief (scripts/build-roleplay-audio.mjs) with the
 * language guards kept, because those are what stop a Portuguese line being
 * read with English vowels and they are wanted either way. The role is left out
 * rather than carried in the URL: the URL is the cache key, so a role would
 * miss every warmed line and split by build.
 */
export function sceneSpeechInstructions(lang: string): string {
  return [
    "You are talking to someone in person, in a real conversation.",
    "Natural, unhurried, friendly. Do not perform or announce; just talk.",
    ttsSpeechInstructions(lang),
  ].join(" ");
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
const KANA_SMALL = new Set(Array.from("ゃゅょぁぃぅぇぉゎっャュョァィゥェォヮッ"));

/** 한 박자 가나(あ, きゃ, ティ, っ, ー). 낱말이 아니라 그 소리만 읽을 때. */
export function isKanaMora(text: string): boolean {
  const chars = Array.from(text.trim());
  if (chars.length < 1 || chars.length > 2) return false;
  const kana = (ch: string) => {
    const code = ch.codePointAt(0) ?? 0;
    return (code >= 0x3041 && code <= 0x3096) || (code >= 0x30a1 && code <= 0x30fa) || ch === "ー";
  };
  if (!chars.every(kana)) return false;
  return chars.length === 1 || KANA_SMALL.has(chars[1] ?? "");
}

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
