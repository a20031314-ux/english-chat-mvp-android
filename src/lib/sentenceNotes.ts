/**
 * What a learner has worked out about one sentence, kept on the device.
 *
 * The analysis sheet used to start from nothing every time it opened: the
 * translation and the expression units were asked for again (and came back
 * worded differently), and there was nowhere for a question about the sentence
 * to live. A note is that place — one per sentence, holding the translation,
 * the units, and every question asked about a part of it with its answers, in
 * the order they were asked. The sheet reads the note first and only calls the
 * server for what the note does not have yet.
 *
 * A question is filed under the words it was asked about (`selected`). A
 * follow-up on the same words joins the same thread, so the thread is what the
 * sheet shows as a note on those words.
 *
 * Pure functions over a plain store object, plus thin localStorage wrappers at
 * the bottom; tests use the pure half.
 */

export type AskTurn = { question: string; answer: string; at: number };

export type AskThread = {
  id: string;
  /** The words the questions are about, as they appear in the sentence. */
  selected: string;
  turns: AskTurn[];
};

export type SentenceNote = {
  sentence: string;
  /** Language the sentence is in. */
  language: string;
  /** Language the translation and answers are written in. */
  uiLanguage: string;
  translation?: string;
  units?: string[];
  threads: AskThread[];
  updatedAt: number;
};

export type SentenceNoteStore = Record<string, SentenceNote>;

export const SENTENCE_NOTES_STORAGE_KEY = "sentenceNotes.v1";
export const MAX_NOTES = 400;
export const MAX_THREADS_PER_NOTE = 12;
export const MAX_TURNS_PER_THREAD = 8;

const MAX_TEXT = 1200;

export function normalizeSentence(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

function sameWords(a: string, b: string): boolean {
  return normalizeSentence(a).toLowerCase() === normalizeSentence(b).toLowerCase();
}

export function sentenceNoteKey(
  sentence: string,
  language: string,
  uiLanguage: string,
): string {
  return `${language}>${uiLanguage}:${normalizeSentence(sentence)}`;
}

function readString(value: unknown, max = MAX_TEXT): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function readTurn(value: unknown): AskTurn | null {
  if (!value || typeof value !== "object") return null;
  const row = value as Record<string, unknown>;
  const question = readString(row.question, 300);
  const answer = readString(row.answer);
  if (!question || !answer) return null;
  const at = typeof row.at === "number" && Number.isFinite(row.at) ? row.at : 0;
  return { question, answer, at };
}

function readThread(value: unknown): AskThread | null {
  if (!value || typeof value !== "object") return null;
  const row = value as Record<string, unknown>;
  const id = readString(row.id, 64);
  const selected = normalizeSentence(readString(row.selected, 600));
  const turns = Array.isArray(row.turns)
    ? row.turns
        .map(readTurn)
        .filter((turn): turn is AskTurn => turn !== null)
        .slice(-MAX_TURNS_PER_THREAD)
    : [];
  if (!id || !selected || turns.length === 0) return null;
  return { id, selected, turns };
}

function readNote(value: unknown): SentenceNote | null {
  if (!value || typeof value !== "object") return null;
  const row = value as Record<string, unknown>;
  const sentence = normalizeSentence(readString(row.sentence, 600));
  const language = readString(row.language, 16);
  const uiLanguage = readString(row.uiLanguage, 16);
  if (!sentence || !language || !uiLanguage) return null;
  const translation = readString(row.translation) || undefined;
  const units = Array.isArray(row.units)
    ? row.units.map((unit) => readString(unit, 120)).filter(Boolean).slice(0, 40)
    : undefined;
  const threads = Array.isArray(row.threads)
    ? row.threads
        .map(readThread)
        .filter((thread): thread is AskThread => thread !== null)
        .slice(-MAX_THREADS_PER_NOTE)
    : [];
  const updatedAt =
    typeof row.updatedAt === "number" && Number.isFinite(row.updatedAt)
      ? row.updatedAt
      : 0;
  return {
    sentence,
    language,
    uiLanguage,
    ...(translation ? { translation } : {}),
    ...(units ? { units } : {}),
    threads,
    updatedAt,
  };
}

/** Parse what localStorage held; anything malformed is dropped, not thrown. */
export function parseNoteStore(raw: string | null): SentenceNoteStore {
  if (!raw) return {};
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return {};
  }
  if (!data || typeof data !== "object" || Array.isArray(data)) return {};
  const store: SentenceNoteStore = {};
  for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
    const note = readNote(value);
    if (note && key === sentenceNoteKey(note.sentence, note.language, note.uiLanguage)) {
      store[key] = note;
    }
  }
  return store;
}

/** Keep the most recently touched notes; the rest are forgotten. */
export function pruneNoteStore(
  store: SentenceNoteStore,
  max = MAX_NOTES,
): SentenceNoteStore {
  const entries = Object.entries(store);
  if (entries.length <= max) return store;
  entries.sort((a, b) => b[1].updatedAt - a[1].updatedAt);
  return Object.fromEntries(entries.slice(0, max));
}

type NoteIdentity = { sentence: string; language: string; uiLanguage: string };

function baseNote(identity: NoteIdentity, now: number): SentenceNote {
  return {
    sentence: normalizeSentence(identity.sentence),
    language: identity.language,
    uiLanguage: identity.uiLanguage,
    threads: [],
    updatedAt: now,
  };
}

export function findNote(
  store: SentenceNoteStore,
  identity: NoteIdentity,
): SentenceNote | null {
  return (
    store[sentenceNoteKey(identity.sentence, identity.language, identity.uiLanguage)] ??
    null
  );
}

function withNote(
  store: SentenceNoteStore,
  identity: NoteIdentity,
  now: number,
  change: (note: SentenceNote) => SentenceNote,
): SentenceNoteStore {
  const key = sentenceNoteKey(identity.sentence, identity.language, identity.uiLanguage);
  const current = store[key] ?? baseNote(identity, now);
  return pruneNoteStore({ ...store, [key]: { ...change(current), updatedAt: now } });
}

export function withTranslation(
  store: SentenceNoteStore,
  identity: NoteIdentity,
  translation: string,
  now = Date.now(),
): SentenceNoteStore {
  const cleaned = readString(translation);
  if (!cleaned) return store;
  return withNote(store, identity, now, (note) => ({ ...note, translation: cleaned }));
}

export function withUnits(
  store: SentenceNoteStore,
  identity: NoteIdentity,
  units: string[],
  now = Date.now(),
): SentenceNoteStore {
  const cleaned = units.map((unit) => readString(unit, 120)).filter(Boolean).slice(0, 40);
  return withNote(store, identity, now, (note) => ({ ...note, units: cleaned }));
}

export function newThreadId(now = Date.now()): string {
  return `${now.toString(36)}${Math.random().toString(36).slice(2, 7)}`;
}

/**
 * File a question and its answer under the words it was about. A thread on the
 * same words already there gets the turn; otherwise a new thread starts. The
 * thread the turn landed in moves to the end, so the list reads oldest first
 * and the one just touched is last.
 */
export function withAskTurn(
  store: SentenceNoteStore,
  identity: NoteIdentity,
  selected: string,
  turn: { question: string; answer: string },
  now = Date.now(),
  makeId: () => string = () => newThreadId(now),
): { store: SentenceNoteStore; threadId: string } {
  const words = normalizeSentence(selected);
  const question = readString(turn.question, 300);
  const answer = readString(turn.answer);
  if (!words || !question || !answer) {
    return { store, threadId: "" };
  }
  let threadId = "";
  const next = withNote(store, identity, now, (note) => {
    const existing = note.threads.find((thread) => sameWords(thread.selected, words));
    const nextTurn: AskTurn = { question, answer, at: now };
    if (existing) {
      threadId = existing.id;
      const updated: AskThread = {
        ...existing,
        turns: [...existing.turns, nextTurn].slice(-MAX_TURNS_PER_THREAD),
      };
      return {
        ...note,
        threads: [...note.threads.filter((thread) => thread.id !== existing.id), updated],
      };
    }
    threadId = makeId();
    return {
      ...note,
      threads: [
        ...note.threads,
        { id: threadId, selected: words, turns: [nextTurn] },
      ].slice(-MAX_THREADS_PER_NOTE),
    };
  });
  return { store: next, threadId };
}

export function withoutThread(
  store: SentenceNoteStore,
  identity: NoteIdentity,
  threadId: string,
  now = Date.now(),
): SentenceNoteStore {
  if (!findNote(store, identity)) return store;
  return withNote(store, identity, now, (note) => ({
    ...note,
    threads: note.threads.filter((thread) => thread.id !== threadId),
  }));
}

export function threadForWords(
  note: SentenceNote | null,
  selected: string,
): AskThread | null {
  if (!note) return null;
  return note.threads.find((thread) => sameWords(thread.selected, selected)) ?? null;
}

// ---- device storage -------------------------------------------------------

function readDeviceStore(): SentenceNoteStore {
  try {
    if (typeof window === "undefined") return {};
    return parseNoteStore(window.localStorage.getItem(SENTENCE_NOTES_STORAGE_KEY));
  } catch {
    return {};
  }
}

function writeDeviceStore(store: SentenceNoteStore) {
  try {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(SENTENCE_NOTES_STORAGE_KEY, JSON.stringify(store));
  } catch {
    // Storage full or blocked: the sheet still works, it just will not remember.
  }
}

export function loadSentenceNote(identity: NoteIdentity): SentenceNote | null {
  return findNote(readDeviceStore(), identity);
}

export function saveSentenceTranslation(identity: NoteIdentity, translation: string) {
  writeDeviceStore(withTranslation(readDeviceStore(), identity, translation));
}

export function saveSentenceUnits(identity: NoteIdentity, units: string[]) {
  writeDeviceStore(withUnits(readDeviceStore(), identity, units));
}

export function saveAskTurn(
  identity: NoteIdentity,
  selected: string,
  turn: { question: string; answer: string },
): SentenceNote | null {
  const { store } = withAskTurn(readDeviceStore(), identity, selected, turn);
  writeDeviceStore(store);
  return findNote(store, identity);
}

export function deleteAskThread(
  identity: NoteIdentity,
  threadId: string,
): SentenceNote | null {
  const store = withoutThread(readDeviceStore(), identity, threadId);
  writeDeviceStore(store);
  return findNote(store, identity);
}
