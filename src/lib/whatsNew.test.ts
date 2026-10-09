import assert from "node:assert/strict";
import test from "node:test";
import { pendingNotes, shotPath, type ReleaseNote } from "./whatsNew.ts";

const item = (id: string) =>
  ({ id, title: "send", body: "send", shot: id, tab: "chat" }) as ReleaseNote["items"][number];

const NOTES: ReleaseNote[] = [
  { version: "2.66", items: [item("c")] },
  { version: "2.65", items: [item("b")] },
  { version: "2.64", items: [item("a")] },
];

const ids = (list: { id: string }[]) => list.map((entry) => entry.id);

test("a fresh install has nothing to catch up on", () => {
  assert.deepEqual(pendingNotes(null, "2.64", false, NOTES), []);
});

test("someone who used a build without the sheet hears about this one", () => {
  assert.deepEqual(ids(pendingNotes(null, "2.64", true, NOTES)), ["a"]);
});

test("nothing new once this version has been seen", () => {
  assert.deepEqual(pendingNotes("2.64", "2.64", true, NOTES), []);
});

test("skipped versions arrive together, newest first", () => {
  assert.deepEqual(ids(pendingNotes("2.64", "2.66", true, NOTES)), ["c", "b"]);
});

test("notes for builds newer than this one stay hidden", () => {
  assert.deepEqual(ids(pendingNotes(null, "2.65", true, NOTES)), ["b", "a"]);
});

test("patch versions count as their release", () => {
  assert.deepEqual(ids(pendingNotes("2.63", "2.64.0", true, NOTES)), ["a"]);
});

test("a build that does not know its version shows nothing", () => {
  assert.deepEqual(pendingNotes(null, "", true, NOTES), []);
});

test("pictures are found per release and interface language", () => {
  assert.equal(shotPath("2.64", "ar", "map"), "/whats-new/2.64/ar/map.webp");
});
