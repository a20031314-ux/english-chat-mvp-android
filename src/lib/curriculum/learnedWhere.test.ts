import { test } from "node:test";
import assert from "node:assert/strict";
import { hasPhrase, phraseRange, whereLearned } from "./learnedWhere.ts";
import { learnedFrom } from "./dailyPlan.ts";
import { allScriptsFor } from "./stageScripts.ts";

test("표현 찾기: 띄어 쓰지 않는 언어·조사 붙은 한국어·스페인어 대소문자, 태국어 모음 부호", () => {
  assert.ok(hasPhrase("はじめまして、ユキです。", "はじめまして", "ja"));
  assert.ok(hasPhrase("친구랑 영화 봤어요", "친구", "ko"));
  assert.ok(hasPhrase("¡Mucho gusto, Sofía!", "mucho gusto", "es"));
  assert.ok(!hasPhrase("Muchas gracias", "mucho gusto", "es"));
  assert.ok(hasPhrase("ขอบคุณครับ", "ขอบคุณ", "th"));
  assert.deepEqual(phraseRange("¡Mucho gusto, Sofía!", "mucho gusto"), [1, 12]);
  assert.equal(phraseRange("abc", "xyz"), null);
});

test("오늘 배운 것 → 어디에: 세 갈래 모두 오늘 한 대본·문장구조 안에서", () => {
  for (const language of ["ja", "es", "th"]) {
    const ids = allScriptsFor(language).filter((s) => s.stage === 1).slice(0, 4).map((s) => s.id);
    const learned = learnedFrom(language, ids);
    for (const key of [learned.words[0], learned.frames[0], learned.grammar[0]].filter(Boolean) as string[]) {
      const where = whereLearned(language, key, ids);
      assert.ok(where.length > 0, `${language} ${key}`);
      assert.ok(where.every((item) => ids.includes(item.id) && item.lines.length <= 3));
    }
  }
});
