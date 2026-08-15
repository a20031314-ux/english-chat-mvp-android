import {
  coerceLanguageCode,
  DEFAULT_LEARNING_LANGUAGE_CODE,
  type LearningLanguageCode,
} from "@/lib/learningLanguages";

export const VOCABULARY_STORAGE_KEY = "vocabularyEntries";
export const VOCABULARY_HIDE_GLOSS_KEY = "vocabularyHideGloss";

export type VocabularyEntry = {
  id: string;
  /** Headword in the learning (target) language */
  word: string;
  /** Meaning in the UI language used when saving */
  gloss: string;
  /** Optional example sentence in the target language */
  example?: string;
  /** Optional part of speech */
  partOfSpeech?: string;
  /** Reading / pronunciation (kanji, pinyin, …) */
  reading?: string;
  /** Learning language this entry belongs to (legacy rows → "en") */
  languageCode: LearningLanguageCode;
  createdAt: number;
};

export type VocabLookupResult = {
  word: string;
  gloss: string;
  example?: string;
  partOfSpeech?: string;
  /** Reading / pronunciation for characters (e.g. kanji 音読み・訓読み, pinyin). */
  reading?: string;
};

function normalizeEntry(raw: unknown): VocabularyEntry | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  if (typeof o.id !== "string" || !o.id.trim()) return null;
  if (typeof o.word !== "string" || !o.word.trim()) return null;
  if (typeof o.gloss !== "string") return null;
  const createdAt =
    typeof o.createdAt === "number" && Number.isFinite(o.createdAt)
      ? o.createdAt
      : Date.now();
  return {
    id: o.id,
    word: o.word.trim(),
    gloss: o.gloss.trim(),
    languageCode: coerceLanguageCode(o.languageCode),
    createdAt,
    ...(typeof o.example === "string" && o.example.trim()
      ? { example: o.example.trim() }
      : {}),
    ...(typeof o.partOfSpeech === "string" && o.partOfSpeech.trim()
      ? { partOfSpeech: o.partOfSpeech.trim() }
      : {}),
    ...(typeof o.reading === "string" && o.reading.trim()
      ? { reading: o.reading.trim() }
      : {}),
  };
}

export function loadVocabulary(): VocabularyEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(VOCABULARY_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    const entries = parsed
      .map(normalizeEntry)
      .filter((e): e is VocabularyEntry => e !== null)
      .sort((a, b) => b.createdAt - a.createdAt);
    // Quietly backfill languageCode on legacy rows so data is never lost.
    const needsRewrite = parsed.some(
      (row) =>
        row &&
        typeof row === "object" &&
        !isLearningLanguageCodeField(
          (row as Record<string, unknown>).languageCode,
        ),
    );
    if (needsRewrite && entries.length > 0) {
      persistVocabulary(entries);
    }
    return entries;
  } catch {
    return [];
  }
}

function isLearningLanguageCodeField(value: unknown): boolean {
  return coerceLanguageCode(value) === value;
}

export function filterVocabularyByLanguage(
  entries: VocabularyEntry[],
  languageCode: LearningLanguageCode,
): VocabularyEntry[] {
  return entries.filter((e) => e.languageCode === languageCode);
}

export function loadHideVocabGloss(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(VOCABULARY_HIDE_GLOSS_KEY) === "1";
  } catch {
    return false;
  }
}

export function persistHideVocabGloss(hidden: boolean) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(VOCABULARY_HIDE_GLOSS_KEY, hidden ? "1" : "0");
  } catch {
    // ignore quota / private mode
  }
}

export function persistVocabulary(entries: VocabularyEntry[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(VOCABULARY_STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // ignore quota / private mode
  }
}

export function isWordSaved(
  entries: VocabularyEntry[],
  word: string,
  languageCode?: LearningLanguageCode,
) {
  const key = word.trim().toLowerCase();
  return entries.some(
    (e) =>
      e.word.trim().toLowerCase() === key &&
      (languageCode == null || e.languageCode === languageCode),
  );
}

export function makeVocabId(word: string) {
  return `vocab-${word.trim().toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`;
}

const ENGLISH_STOPWORDS = new Set(
  [
    "a",
    "an",
    "the",
    "and",
    "or",
    "but",
    "if",
    "then",
    "else",
    "when",
    "where",
    "what",
    "which",
    "who",
    "whom",
    "how",
    "why",
    "is",
    "am",
    "are",
    "was",
    "were",
    "be",
    "been",
    "being",
    "have",
    "has",
    "had",
    "do",
    "does",
    "did",
    "will",
    "would",
    "can",
    "could",
    "should",
    "may",
    "might",
    "must",
    "shall",
    "to",
    "of",
    "in",
    "on",
    "at",
    "for",
    "from",
    "by",
    "with",
    "as",
    "into",
    "about",
    "over",
    "after",
    "before",
    "between",
    "under",
    "again",
    "further",
    "once",
    "here",
    "there",
    "all",
    "any",
    "both",
    "each",
    "few",
    "more",
    "most",
    "other",
    "some",
    "such",
    "no",
    "nor",
    "not",
    "only",
    "own",
    "same",
    "so",
    "than",
    "too",
    "very",
    "just",
    "also",
    "i",
    "me",
    "my",
    "myself",
    "we",
    "our",
    "ours",
    "you",
    "your",
    "yours",
    "he",
    "him",
    "his",
    "she",
    "her",
    "hers",
    "it",
    "its",
    "they",
    "them",
    "their",
    "theirs",
    "this",
    "that",
    "these",
    "those",
    "im",
    "ive",
    "id",
    "ill",
    "youre",
    "youve",
    "dont",
    "doesnt",
    "didnt",
    "isnt",
    "arent",
    "wasnt",
    "werent",
    "havent",
    "hasnt",
    "hadnt",
    "wont",
    "wouldnt",
    "cant",
    "couldnt",
    "shouldnt",
    "lets",
    "thats",
    "theres",
    "heres",
    "whats",
    "whos",
    "hows",
    "wheres",
    "whens",
    "whys",
    "ok",
    "okay",
    "oh",
    "ah",
    "uh",
    "um",
    "yeah",
    "yes",
    "no",
    "hi",
    "hello",
    "hey",
    "please",
    "thanks",
    "thank",
    "got",
    "get",
    "getting",
    "go",
    "going",
    "gone",
    "went",
  ].map((w) => w.toLowerCase()),
);

/** Strip leading/trailing punctuation so "imbatível." → "imbatível". */
export function normalizeVocabHeadword(raw: string): string {
  let s = raw.replace(/\s+/g, " ").trim();
  if (!s) return "";
  // Keep letters/marks/numbers/internal apostrophes & hyphens; peel edge punct.
  s = s.replace(/^[^\p{L}\p{M}\p{N}]+/u, "").replace(/[^\p{L}\p{M}\p{N}]+$/u, "");
  // Common dangling quotes/apostrophes after peel
  s = s.replace(/^['’]+|['’]+$/g, "").trim();
  return s;
}

function foldEnglishStopKey(token: string): string {
  return token.toLowerCase().replace(/['’]/g, "");
}

function isEnglishStopwordToken(token: string): boolean {
  if (!/^[A-Za-z'’]+$/.test(token)) return false;
  const lower = token.toLowerCase();
  const folded = foldEnglishStopKey(token);
  return ENGLISH_STOPWORDS.has(lower) || ENGLISH_STOPWORDS.has(folded);
}

/** Whether a token is worth offering as a vocabulary save target. */
export function isLearnableEnglishWord(token: string): boolean {
  const cleaned = normalizeVocabHeadword(token);
  if (!cleaned) return false;
  // CJK / Hangul runs are valid learning units (incl. 2-char words like 今日).
  if (/^[\u3040-\u30ff\u3400-\u9fff\uac00-\ud7af]+$/u.test(cleaned)) {
    return true;
  }
  if (cleaned.length < 3) return false;
  if (!/^[\p{L}\p{M}][\p{L}\p{M}'’]*(?:-[\p{L}\p{M}'’]*)*$/u.test(cleaned)) {
    return false;
  }
  // English stopwords / bare contractions only apply to ASCII Latin tokens.
  if (isEnglishStopwordToken(cleaned)) {
    return false;
  }
  return true;
}

/** Any word or known multi-word phrase that can be tapped to look up. */
export function isLookupableEnglishWord(token: string): boolean {
  const cleaned = normalizeVocabHeadword(token);
  if (cleaned.length < 1) return false;
  if (/^[\p{L}\p{M}][\p{L}\p{M}'’]*(?:-[\p{L}\p{M}'’]*)*$/u.test(cleaned)) {
    return true;
  }
  // Multi-word phrase (spaces between letter tokens)
  return /^[\p{L}\p{M}][\p{L}\p{M}'’]*(?:-[\p{L}\p{M}'’]*)?(?:\s+[\p{L}\p{M}][\p{L}\p{M}'’]*(?:-[\p{L}\p{M}'’]*)?)+$/u.test(
    cleaned,
  );
}

/**
 * Vocab preview should open only for content words or multi-word idioms/phrases —
 * not bare function words / contractions like "how's".
 */
export function isVocabLookupEligible(token: string): boolean {
  const cleaned = normalizeVocabHeadword(token);
  if (!cleaned) return false;
  if (/\s/.test(cleaned)) {
    return isLookupableEnglishWord(cleaned);
  }
  return isLearnableEnglishWord(cleaned);
}

/** Pull learnable English word candidates from free text. */
export function extractEnglishWords(texts: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  const pattern = /[\p{L}\p{M}][\p{L}\p{M}'’]*(?:-[\p{L}\p{M}'’]*)*/gu;

  for (const text of texts) {
    if (!text) continue;
    const matches = text.match(pattern) ?? [];
    for (const raw of matches) {
      const cleaned = normalizeVocabHeadword(raw);
      if (!isLearnableEnglishWord(cleaned)) continue;
      const key = cleaned.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(cleaned);
    }
  }

  return out;
}

export function saveVocabularyWords(
  existing: VocabularyEntry[],
  items: VocabLookupResult[],
  languageCode: LearningLanguageCode = DEFAULT_LEARNING_LANGUAGE_CODE,
): VocabularyEntry[] {
  const next = [...existing];
  for (const item of items) {
    const word = normalizeVocabHeadword(item.word) || item.word.trim();
    const gloss = item.gloss.trim();
    if (!word || !gloss) continue;
    if (isWordSaved(next, word, languageCode)) continue;
    next.unshift({
      id: makeVocabId(word),
      word,
      gloss,
      languageCode,
      createdAt: Date.now(),
      ...(item.example ? { example: item.example } : {}),
      ...(item.partOfSpeech ? { partOfSpeech: item.partOfSpeech } : {}),
      ...(item.reading ? { reading: item.reading } : {}),
    });
  }
  return next;
}

