import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import {
  RELEASE_NOTES,
  latestNotedVersion,
  notesBetween,
  pendingNotes,
  shotPath,
  versionForCode,
  type ReleaseNote,
} from "./whatsNew.ts";

const item = (id: string) =>
  ({ id, title: "send", body: "send", shot: id, tab: "chat" }) as ReleaseNote["items"][number];

const NOTES: ReleaseNote[] = [
  { version: "2.66", code: 80, items: [item("c")] },
  { version: "2.65", code: 79, items: [item("b")] },
  { version: "2.64", code: 78, items: [item("a")] },
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

test("업데이트 배너: 가진 버전 다음부터 받을 버전까지, 새것부터", () => {
  assert.deepEqual(notesBetween("2.64", "2.66", NOTES).map((n) => n.version), ["2.66", "2.65"]);
  assert.deepEqual(notesBetween("2.65.1", "2.66", NOTES).map((n) => n.version), ["2.66"]);
  assert.deepEqual(notesBetween("2.66", "2.66", NOTES), []);
  // 받을 버전이 노트가 없는 새 버전이면 그 사이 노트가 다 나온다(배너는 그래도 뜸).
  assert.deepEqual(notesBetween("2.65", "2.70", NOTES).map((n) => n.version), ["2.66"]);
  assert.deepEqual(notesBetween("2.65", "", NOTES), []);
});

test("Play가 알려 주는 versionCode로 버전을 찾는다", () => {
  assert.equal(versionForCode(79, NOTES), "2.65");
  assert.equal(versionForCode(99, NOTES), null);
  assert.equal(latestNotedVersion(NOTES), "2.66");
});

test("출시 노트의 versionCode가 겹치지 않고 build.gradle보다 크지 않다", () => {
  const codes = RELEASE_NOTES.map((note) => note.code);
  assert.equal(new Set(codes).size, codes.length);
  const gradle = readFileSync(new URL("../../android/app/build.gradle", import.meta.url), "utf8");
  const current = Number(/versionCode\s+(\d+)/.exec(gradle)?.[1]);
  for (const note of RELEASE_NOTES) assert.ok(note.code <= current, `${note.version}: ${note.code} > ${current}`);
  // 버전이 높을수록 code도 높다
  const sorted = [...RELEASE_NOTES].sort((a, b) => a.code - b.code).map((n) => n.version);
  assert.deepEqual(sorted, [...RELEASE_NOTES].map((n) => n.version).reverse());
});
