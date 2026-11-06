import assert from "node:assert/strict";
import test from "node:test";
import { CALL_NOTES_MAX, readCallNotes, removeCallNote, saveCallNote, setCallSummary } from "./callNotes.ts";

function memory() {
  const data = new Map<string, string>();
  return { getItem: (key: string) => data.get(key) ?? null, setItem: (key: string, value: string) => void data.set(key, value) };
}
const note = (id: string, at: number) => ({ id, at, secs: 300, title: "Haruto", fixed: 2, hints: 1, redone: 1 });

test("a card is kept per learning language, and the tutor's note joins it later", () => {
  const store = memory();
  saveCallNote("ja", note("a", 1), store);
  saveCallNote("es", note("b", 2), store);
  setCallSummary("ja", "a", " 오늘은 카페 얘기를 했어요. ", store);
  assert.equal(readCallNotes("ja", store)[0]?.summary, "오늘은 카페 얘기를 했어요.");
  assert.equal(readCallNotes("es", store)[0]?.summary, undefined);
  setCallSummary("ja", "missing", "x", store);
  assert.equal(readCallNotes("ja", store).length, 1, "no card is made from a note alone");
});

test("saving the card again keeps a note already received; removing drops it", () => {
  const store = memory();
  saveCallNote("ja", note("a", 1), store);
  setCallSummary("ja", "a", "メモ", store);
  saveCallNote("ja", { ...note("a", 1), fixed: 3 }, store);
  assert.deepEqual([readCallNotes("ja", store)[0]?.fixed, readCallNotes("ja", store)[0]?.summary], [3, "メモ"]);
  removeCallNote("ja", "a", store);
  assert.deepEqual(readCallNotes("ja", store), []);
});

test("only the newest cards are kept, oldest first out; a broken value reads as none", () => {
  const store = memory();
  for (let i = 0; i <= CALL_NOTES_MAX; i += 1) saveCallNote("th", note(`n${i}`, i), store);
  const kept = readCallNotes("th", store);
  assert.equal(kept.length, CALL_NOTES_MAX);
  assert.equal(kept[0]?.id, "n1");
  store.setItem("callNotes.v1.ar", "{not json");
  assert.deepEqual(readCallNotes("ar", store), []);
});
