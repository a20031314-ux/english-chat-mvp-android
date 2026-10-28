import { test } from "node:test";
import assert from "node:assert/strict";
import { clearResume, readResume, resumeKey, saveResume } from "./resume.ts";

function memory() {
  const map = new Map<string, string>();
  return { getItem: (k: string) => map.get(k) ?? null, setItem: (k: string, v: string) => void map.set(k, v), removeItem: (k: string) => void map.delete(k) };
}

test("이어서 하기: 오늘 남긴 것만, 첫 줄이면 남기지 않음, 지우면 없음", () => {
  const store = memory();
  const day = new Date(2026, 9, 28, 14);
  const key = resumeKey("script", "th", "th-1-1");
  saveResume(key, { index: 0, results: {}, revealed: {} }, day, store);
  assert.equal(readResume(key, day, store), null);
  saveResume(key, { index: 3, results: { 1: { clean: true } }, revealed: { 1: false }, picks: { 0: 1 } }, day, store);
  assert.equal(readResume<{ clean: boolean }>(key, day, store)?.results[1]?.clean, true);
  assert.equal(readResume(key, new Date(2026, 9, 29, 9), store), null, "다음 날");
  assert.notEqual(resumeKey("frame", "es", "es-f1-01"), resumeKey("redo", "es", "es-f1-01"));
  clearResume(key, store);
  assert.equal(readResume(key, day, store), null);
});
