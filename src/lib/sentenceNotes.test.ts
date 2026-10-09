import assert from "node:assert/strict";
import test from "node:test";
import {
  MAX_THREADS_PER_NOTE,
  MAX_TURNS_PER_THREAD,
  findNote,
  parseNoteStore,
  pruneNoteStore,
  sentenceNoteKey,
  threadForWords,
  withAskTurn,
  withTranslation,
  withUnits,
  withoutThread,
  type SentenceNoteStore,
} from "./sentenceNotes.ts";

const ID = {
  sentence: "Did you end up going somewhere else, or just waiting it out?",
  language: "en",
  uiLanguage: "ko",
};

test("a translation is kept and read back for the same sentence", () => {
  const store = withTranslation({}, ID, "다른 데 갔어, 아니면 그냥 기다렸어?", 10);
  const note = findNote(store, { ...ID, sentence: `  ${ID.sentence}  ` });
  assert.equal(note?.translation, "다른 데 갔어, 아니면 그냥 기다렸어?");
  assert.equal(note?.updatedAt, 10);
});

test("the answer language is part of the key", () => {
  const store = withTranslation({}, ID, "한국어", 1);
  assert.equal(findNote(store, { ...ID, uiLanguage: "ja" }), null);
});

test("units are stored without touching the translation", () => {
  let store = withTranslation({}, ID, "번역", 1);
  store = withUnits(store, ID, ["end up", "wait it out", ""], 2);
  const note = findNote(store, ID);
  assert.deepEqual(note?.units, ["end up", "wait it out"]);
  assert.equal(note?.translation, "번역");
});

test("a follow-up on the same words joins the same thread", () => {
  let ids = 0;
  const makeId = () => `t${++ids}`;
  let { store, threadId } = withAskTurn({}, ID, "end up", { question: "왜 going이야?", answer: "end up 뒤에는 -ing가 와요." }, 1, makeId);
  assert.equal(threadId, "t1");
  ({ store, threadId } = withAskTurn(store, ID, "End  up", { question: "to go는 안 돼?", answer: "안 돼요." }, 2, makeId));
  assert.equal(threadId, "t1");
  const note = findNote(store, ID);
  assert.equal(note?.threads.length, 1);
  assert.deepEqual(note?.threads[0]?.turns.map((turn) => turn.question), ["왜 going이야?", "to go는 안 돼?"]);
});

test("different words start their own thread, and the touched one moves last", () => {
  let ids = 0;
  const makeId = () => `t${++ids}`;
  let { store } = withAskTurn({}, ID, "end up", { question: "q1", answer: "a1" }, 1, makeId);
  ({ store } = withAskTurn(store, ID, "waiting it out", { question: "q2", answer: "a2" }, 2, makeId));
  ({ store } = withAskTurn(store, ID, "end up", { question: "q3", answer: "a3" }, 3, makeId));
  const note = findNote(store, ID);
  assert.deepEqual(note?.threads.map((thread) => thread.selected), ["waiting it out", "end up"]);
  assert.equal(threadForWords(note, "WAITING it out")?.id, "t2");
});

test("empty questions or answers are not filed", () => {
  const { store, threadId } = withAskTurn({}, ID, "end up", { question: " ", answer: "a" }, 1);
  assert.equal(threadId, "");
  assert.deepEqual(store, {});
});

test("threads and turns are capped", () => {
  let store: SentenceNoteStore = {};
  for (let i = 0; i < MAX_THREADS_PER_NOTE + 3; i += 1) {
    ({ store } = withAskTurn(store, ID, `word${i}`, { question: "q", answer: "a" }, i, () => `t${i}`));
  }
  for (let i = 0; i < MAX_TURNS_PER_THREAD + 3; i += 1) {
    ({ store } = withAskTurn(store, ID, "word14", { question: `q${i}`, answer: "a" }, 100 + i));
  }
  const note = findNote(store, ID);
  assert.equal(note?.threads.length, MAX_THREADS_PER_NOTE);
  assert.equal(threadForWords(note, "word14")?.turns.length, MAX_TURNS_PER_THREAD);
  assert.equal(threadForWords(note, "word0"), null);
});

test("a thread can be removed", () => {
  const { store, threadId } = withAskTurn({}, ID, "end up", { question: "q", answer: "a" }, 1, () => "t1");
  const after = withoutThread(store, ID, threadId, 2);
  assert.equal(findNote(after, ID)?.threads.length, 0);
});

test("round-trips through JSON and drops malformed rows", () => {
  const { store } = withAskTurn(withTranslation({}, ID, "번역", 1), ID, "end up", { question: "q", answer: "a" }, 2, () => "t1");
  const raw = JSON.stringify({
    ...store,
    junk: { sentence: "", language: "en" },
    [sentenceNoteKey("x", "en", "ko")]: { sentence: "y", language: "en", uiLanguage: "ko", threads: [] },
  });
  const parsed = parseNoteStore(raw);
  assert.deepEqual(Object.keys(parsed), Object.keys(store));
  assert.equal(findNote(parsed, ID)?.threads[0]?.turns[0]?.answer, "a");
  assert.deepEqual(parseNoteStore("{not json"), {});
  assert.deepEqual(parseNoteStore("[]"), {});
});

test("pruning keeps the most recently touched notes", () => {
  let store: SentenceNoteStore = {};
  for (let i = 0; i < 5; i += 1) {
    store = withTranslation(store, { ...ID, sentence: `s${i}` }, "t", i);
  }
  const kept = pruneNoteStore(store, 2);
  assert.deepEqual(
    Object.values(kept).map((note) => note.sentence).sort(),
    ["s3", "s4"],
  );
});
