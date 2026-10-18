import assert from "node:assert/strict";
import test from "node:test";
import { buildNotes, placeKey, searchNotes, topicStates, UNPLACED, type NoteEntry } from "./notes.ts";
import { NOTE_OUTLINE, NOTE_TOPIC_IDS, noteName } from "./outline.ts";

test("the outline is the same eight chapters of three topics, named in every interface language", () => {
  assert.equal(NOTE_OUTLINE.length, 8);
  assert.equal(NOTE_TOPIC_IDS.length, 24);
  assert.equal(new Set(NOTE_TOPIC_IDS).size, 24);
  for (const chapter of NOTE_OUTLINE) {
    assert.equal(Object.keys(chapter.name).length, 14);
    for (const topic of chapter.topics) assert.ok(Object.values(topic.name).every((name) => name.trim()), topic.id);
  }
  assert.equal(noteName(NOTE_OUTLINE[6]!.topics[0]!.name, "ja"), "お店・レストラン");
  assert.equal(noteName(NOTE_OUTLINE[6]!.topics[0]!.name, "xx"), "Shops and restaurants");
});

const entries: NoteEntry[] = [
  { kind: "expression", text: "Could I get the bill?", state: "learned" },
  { kind: "expression", text: "お会計お願いします", state: "mastered" },
  { kind: "expression", text: "pedir", state: "met" },
  { kind: "word", id: "w1", text: "pedir", gloss: "부탁하다" },
  { kind: "question", text: "ร้านนี้อร่อยมาก", selected: "อร่อย", question: "무슨 뜻이야?", answer: "맛있다", at: 1 },
];

test("notes sort what has piled up into topics, and keep what has no place yet apart", () => {
  const book = buildNotes(entries, {
    [placeKey("Could I get the bill?")]: "out.shops",
    [placeKey("お会計お願いします")]: "out.shops",
    [placeKey("pedir")]: "help.asking",
    [placeKey("อร่อย")]: UNPLACED,
  });
  assert.equal(book.byTopic["out.shops"]!.expressions.length, 2);
  // A word met as a phrase and saved as a word is shown once, as the word.
  assert.equal(book.byTopic["help.asking"]!.words.length, 1);
  assert.equal(book.byTopic["help.asking"]!.expressions.length, 0);
  assert.equal(book.loose.questions.length, 1);
  assert.deepEqual(book.toPlace, []);
  const fresh = buildNotes(entries, {});
  assert.equal(fresh.toPlace.length, 4);
  // A question is placed by the part chosen, never by the sentence (it may be the learner's own line).
  assert.ok(fresh.toPlace.includes("อร่อย"));
  assert.ok(!fresh.toPlace.includes("ร้านนี้อร่อยมาก"));
  const longPick = buildNotes(
    [{ kind: "question", text: "x", selected: "a".repeat(41), question: "q", answer: "a", at: 1 }],
    {},
  );
  assert.deepEqual(longPick.toPlace, []);
  assert.equal(longPick.loose.questions.length, 1);
  assert.equal(fresh.loose.expressions.length + fresh.loose.words.length + fresh.loose.questions.length, 4);
  assert.deepEqual(topicStates(book.byTopic["out.shops"]!, () => null), { mastered: 1, learned: 1, met: 0 });
});

test("one search box finds topics, words by meaning, and questions, in spaceless scripts too", () => {
  const book = buildNotes(entries, { [placeKey("pedir")]: "help.asking", [placeKey("お会計お願いします")]: "out.shops" });
  assert.ok(searchNotes(book, "식당", "ko").some((hit) => hit.kind === "topic" && hit.topicId === "out.shops"));
  assert.ok(searchNotes(book, "부탁", "ko").some((hit) => hit.kind === "word"));
  assert.ok(searchNotes(book, "会計", "ja").some((hit) => hit.kind === "expression" && hit.topicId === "out.shops"));
  assert.ok(searchNotes(book, "อร่อย", "th").some((hit) => hit.kind === "question"));
  assert.equal(searchNotes(book, "   ", "ko").length, 0);
});
