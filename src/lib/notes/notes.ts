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
  /** 지우기용(문장분석의 그 질문 묶음). 기기 저장분에만 있다. */
  threadId?: string;
  language?: string;
  uiLanguage?: string;
};

export type NoteEntry = NoteExpression | NoteWord | NoteQuestion;

/** Where each text goes: topic id, or "none" when no topic fits. */
export type Placements = Record<string, string>;

export const UNPLACED = "none";
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

export type SearchHit =
  | { kind: "topic"; topicId: string; label: string }
  | { kind: "expression"; entry: NoteExpression; topicId: string | null }
  | { kind: "word"; entry: NoteWord; topicId: string | null }
  | { kind: "question"; entry: NoteQuestion; topicId: string | null };
