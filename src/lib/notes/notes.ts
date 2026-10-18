/**
 * 노트에 무엇이 어디 들어가는지 — 이미 쌓인 것으로 채운다(새 생성 없음, 1단계).
 *
 * 들어오는 것 세 가지:
 * - 표현: 내 표현(장부)의 표현과 상태 (서버, `ledgerClient`)
 * - 단어: 단어장 단어 (기기, `vocabulary.ts`) — 단어장 탭이 노트로 들어왔다
 * - 질문: 문장분석에서 묻고 받은 답 (기기, `sentenceNotes.ts`)
 *
 * 각각이 어느 주제에 들어갈지는 /api/notes/place가 정하고(모두에게 같은 답이라 서버에 공유 캐시),
 * 기기는 받은 자리를 기억한다. 자리를 아직 못 받은 것은 "아직 자리 없음"에 모인다.
 * 화면과 테스트가 같은 규칙을 쓰도록 순수 함수로 둔다.
 */

import type { LedgerState } from "../learner/ledger.ts";
import { NOTE_OUTLINE, NOTE_TOPIC_IDS, noteName } from "./outline.ts";

export type NoteExpression = { kind: "expression"; text: string; state: LedgerState };
export type NoteWord = { kind: "word"; id: string; text: string; gloss: string; reading?: string };
export type NoteQuestion = {
  kind: "question";
  /** The sentence asked about — what is placed. */
  text: string;
  selected: string;
  question: string;
  answer: string;
  at: number;
};
export type NoteEntry = NoteExpression | NoteWord | NoteQuestion;

/** Where each text goes: topic id, or "none" when no topic fits. */
export type Placements = Record<string, string>;

export const UNPLACED = "none";

/**
 * 질문은 문장이 아니라 고른 부분으로 자리를 찾는다 — 문장은 학습자가 쓴 줄일 수 있어 서버에 보내지 않는다
 * (학습자 문장 미저장). 고른 부분이 문장만큼 길면 보내지 않고 "아직 자리 없음"에 둔다.
 */
export const MAX_PLACE_QUESTION = 40;
export function placeText(entry: NoteEntry): string | null {
  if (entry.kind !== "question") return entry.text;
  const part = entry.selected.trim();
  return part && part.length <= MAX_PLACE_QUESTION ? part : null;
}

/** The key a text is placed under: the same for a word saved twice or a phrase met in two tabs. */
export function placeKey(text: string): string {
  return text.normalize("NFKC").replace(/\s+/g, " ").trim().toLowerCase().slice(0, 160);
}

export type TopicNotes = { expressions: NoteExpression[]; words: NoteWord[]; questions: NoteQuestion[] };

export type NotesBook = {
  byTopic: Record<string, TopicNotes>;
  /** Not placed yet (waiting for an answer) or placed nowhere. */
  loose: TopicNotes;
  /** Texts still to ask about, each once. */
  toPlace: string[];
};

const empty = (): TopicNotes => ({ expressions: [], words: [], questions: [] });

function push(into: TopicNotes, entry: NoteEntry) {
  if (entry.kind === "expression") into.expressions.push(entry);
  else if (entry.kind === "word") into.words.push(entry);
  else into.questions.push(entry);
}

/**
 * One word met as a phrase and saved as a word shows up once, as the word —
 * the word list entry carries its meaning, the phrase only its state.
 */
export function buildNotes(entries: NoteEntry[], placements: Placements): NotesBook {
  const byTopic: Record<string, TopicNotes> = Object.fromEntries(NOTE_TOPIC_IDS.map((id) => [id, empty()]));
  const loose = empty();
  const toPlace = new Set<string>();
  const wordKeys = new Set(entries.filter((e) => e.kind === "word").map((e) => placeKey(e.text)));
  const seen = new Set<string>();
  for (const entry of entries) {
    const key = placeKey(entry.text);
    if (!key) continue;
    if (entry.kind === "expression" && wordKeys.has(key)) continue;
    const dedupe = `${entry.kind}:${key}:${entry.kind === "question" ? `${entry.selected}:${entry.question}` : ""}`;
    if (seen.has(dedupe)) continue;
    seen.add(dedupe);
    const text = placeText(entry);
    const place = text ? placements[placeKey(text)] : UNPLACED;
    if (place && place !== UNPLACED && byTopic[place]) push(byTopic[place], entry);
    else {
      push(loose, entry);
      if (!place && text) toPlace.add(text);
    }
  }
  return { byTopic, loose, toPlace: [...toPlace] };
}

export function topicCount(notes: TopicNotes): number {
  return notes.expressions.length + notes.words.length + notes.questions.length;
}

/** Mastered / learned / met among a topic's phrases and words — the dots beside a topic. */
export function topicStates(notes: TopicNotes, stateOf: (text: string) => LedgerState | null) {
  const out = { mastered: 0, learned: 0, met: 0 };
  for (const row of notes.expressions) out[row.state] += 1;
  for (const row of notes.words) {
    const state = stateOf(row.text);
    if (state) out[state] += 1;
    else out.learned += 1; // a saved word counts as learned, as the ledger does
  }
  return out;
}

export type SearchHit =
  | { kind: "topic"; topicId: string; label: string }
  | { kind: "expression"; entry: NoteExpression; topicId: string | null }
  | { kind: "word"; entry: NoteWord; topicId: string | null }
  | { kind: "question"; entry: NoteQuestion; topicId: string | null };

const fold = (text: string) => text.normalize("NFKC").toLowerCase();

/**
 * 나무위키처럼 하나의 검색칸: 주제 이름(이 언어와 영어) · 표현 · 단어(뜻 포함) · 질문과 답.
 * 띄어쓰기 없는 언어도 글자 그대로 포함되는지로 찾는다. 기기 안에서만, 모델 없음.
 */
export function searchNotes(book: NotesBook, query: string, locale: string, limit = 40): SearchHit[] {
  const q = fold(query.trim());
  if (!q) return [];
  const hits: SearchHit[] = [];
  for (const chapter of NOTE_OUTLINE) {
    for (const topic of chapter.topics) {
      const label = noteName(topic.name, locale);
      if (fold(label).includes(q) || fold(topic.name.en).includes(q) || fold(noteName(chapter.name, locale)).includes(q)) {
        hits.push({ kind: "topic", topicId: topic.id, label });
      }
    }
  }
  const sources: Array<[string | null, TopicNotes]> = [
    ...Object.entries(book.byTopic).map(([id, notes]) => [id, notes] as [string, TopicNotes]),
    [null, book.loose],
  ];
  for (const [topicId, notes] of sources) {
    for (const entry of notes.words) {
      if (fold(entry.text).includes(q) || fold(entry.gloss).includes(q) || (entry.reading && fold(entry.reading).includes(q))) {
        hits.push({ kind: "word", entry, topicId });
      }
    }
    for (const entry of notes.expressions) {
      if (fold(entry.text).includes(q)) hits.push({ kind: "expression", entry, topicId });
    }
    for (const entry of notes.questions) {
      if ([entry.text, entry.selected, entry.question, entry.answer].some((part) => fold(part).includes(q))) {
        hits.push({ kind: "question", entry, topicId });
      }
    }
  }
  return hits.slice(0, limit);
}
