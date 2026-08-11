export const VOCABULARY_STORAGE_KEY = "vocabularyEntries";
export const VOCABULARY_HIDE_GLOSS_KEY = "vocabularyHideGloss";

export type VocabularyEntry = {
  id: string;
  /** English headword */
  word: string;
  /** Meaning in the UI language used when saving */
  gloss: string;
  /** Optional English example sentence */
  example?: string;
  /** Optional part of speech */
  partOfSpeech?: string;
  createdAt: number;
};

export type VocabLookupResult = {
  word: string;
  gloss: string;
  example?: string;
  partOfSpeech?: string;
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
    createdAt,
    ...(typeof o.example === "string" && o.example.trim()
      ? { example: o.example.trim() }
      : {}),
    ...(typeof o.partOfSpeech === "string" && o.partOfSpeech.trim()
      ? { partOfSpeech: o.partOfSpeech.trim() }
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
    return parsed
      .map(normalizeEntry)
      .filter((e): e is VocabularyEntry => e !== null)
      .sort((a, b) => b.createdAt - a.createdAt);
  } catch {
    return [];
  }
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

export function isWordSaved(entries: VocabularyEntry[], word: string) {
  const key = word.trim().toLowerCase();
  return entries.some((e) => e.word.trim().toLowerCase() === key);
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

/** Whether a token is worth offering as a vocabulary save target. */
export function isLearnableEnglishWord(token: string): boolean {
  const cleaned = token.replace(/^'+|'+$/g, "");
  if (cleaned.length < 3) return false;
  if (!/^[A-Za-z][A-Za-z']*$/.test(cleaned)) return false;
  return !ENGLISH_STOPWORDS.has(cleaned.toLowerCase());
}

/** Any English word or known multi-word phrase that can be tapped to look up. */
export function isLookupableEnglishWord(token: string): boolean {
  const cleaned = token.replace(/^'+|'+$/g, "").trim();
  if (cleaned.length < 1) return false;
  if (/^[A-Za-z][A-Za-z']*(?:-[A-Za-z][A-Za-z']*)*$/.test(cleaned)) {
    return true;
  }
  // Multi-word phrase (spaces between English tokens)
  return /^[A-Za-z][A-Za-z']*(?:-[A-Za-z][A-Za-z']*)?(?:\s+[A-Za-z][A-Za-z']*(?:-[A-Za-z][A-Za-z']*)?)+$/.test(
    cleaned,
  );
}

/** Pull learnable English word candidates from free text. */
export function extractEnglishWords(texts: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  const pattern = /[A-Za-z][A-Za-z']*/g;

  for (const text of texts) {
    if (!text) continue;
    const matches = text.match(pattern) ?? [];
    for (const raw of matches) {
      const cleaned = raw.replace(/^'+|'+$/g, "");
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
): VocabularyEntry[] {
  const next = [...existing];
  for (const item of items) {
    if (isWordSaved(next, item.word)) continue;
    next.unshift({
      id: makeVocabId(item.word),
      word: item.word.trim(),
      gloss: item.gloss.trim(),
      createdAt: Date.now(),
      ...(item.example ? { example: item.example } : {}),
      ...(item.partOfSpeech ? { partOfSpeech: item.partOfSpeech } : {}),
    });
  }
  return next;
}

