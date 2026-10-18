import { test } from "node:test";
import assert from "node:assert/strict";
import { cleanLanguages, filterLanguages, parseRoomFilter, roomMatches } from "./roomFilter.ts";

test("언어 조합 거르기: 순서 상관없이, 하나만 고르면 그 언어가 든 방 전부", () => {
  assert.equal(roomMatches(["ko", "en"], ["en", "ko"]), true);
  assert.equal(roomMatches(["ja", "ko"], ["en", "ko"]), false);
  assert.equal(roomMatches(["th", "es"], ["th"]), true);
  assert.equal(roomMatches([], []), true);
  assert.equal(roomMatches(undefined, ["ar"]), false);
});

test("내 조합 = 학습 언어 + 앱 언어, 모르는 코드·중복은 뺀다", () => {
  assert.deepEqual(filterLanguages({ kind: "mine" }, "ja", "ko"), ["ja", "ko"]);
  assert.deepEqual(filterLanguages({ kind: "mine" }, "es", "es"), ["es"]);
  assert.deepEqual(filterLanguages({ kind: "all" }, "ja", "ko"), []);
  assert.deepEqual(filterLanguages({ kind: "pick", a: null, b: "zh" }, "ja", "ko"), ["zh"]);
  assert.deepEqual(cleanLanguages(["xx", "hi", "hi", "vi", "fr"]), ["hi", "vi"]);
});

test("저장한 값 읽기: 깨진 값·모르는 코드는 전체로", () => {
  assert.deepEqual(parseRoomFilter(null), { kind: "all" });
  assert.deepEqual(parseRoomFilter("{oops"), { kind: "all" });
  assert.deepEqual(parseRoomFilter(JSON.stringify({ kind: "pick", a: "en", b: "xx" })), { kind: "pick", a: "en", b: null });
  assert.deepEqual(parseRoomFilter(JSON.stringify({ kind: "mine" })), { kind: "mine" });
});

test("자유 대화방은 어떤 언어로 찾든 나온다", () => {
  assert.equal(roomMatches([], ["ja", "ko"], true), true);
  assert.equal(roomMatches([], ["th"], true), true);
  assert.equal(roomMatches([], ["ja"]), false);
});
