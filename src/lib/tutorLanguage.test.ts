import assert from "node:assert/strict";
import test from "node:test";
import { bilingualPossible, readTutorLanguage, tutorIsBilingual, writeTutorLanguage } from "./tutorLanguage.ts";

function withStorage(run: () => void) {
  const store = new Map<string, string>();
  const g = globalThis as { localStorage?: unknown };
  const before = g.localStorage;
  g.localStorage = { getItem: (k: string) => store.get(k) ?? null, setItem: (k: string, v: string) => void store.set(k, v) };
  try {
    run();
  } finally {
    g.localStorage = before;
  }
}

test("기본은 학습 언어만, 고르면 기억", () => {
  withStorage(() => {
    assert.equal(readTutorLanguage(), "target");
    assert.equal(tutorIsBilingual("en", "ko"), false);
    writeTutorLanguage("both");
    assert.equal(readTutorLanguage(), "both");
    assert.equal(tutorIsBilingual("ja", "ko"), true);
    assert.equal(tutorIsBilingual("es", "ar"), true);
  });
});

test("학습 언어와 앱 언어가 같으면 섞을 말이 없다", () => {
  withStorage(() => {
    writeTutorLanguage("both");
    assert.equal(bilingualPossible("ko", "ko"), false);
    assert.equal(tutorIsBilingual("ko", "ko"), false);
  });
});

test("저장소가 없어도 기본값", () => {
  const g = globalThis as { localStorage?: unknown };
  const before = g.localStorage;
  g.localStorage = undefined;
  assert.equal(readTutorLanguage(), "target");
  g.localStorage = before;
});
