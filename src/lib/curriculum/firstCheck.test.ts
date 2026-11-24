import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  estimateChance,
  fixedLines,
  letterQuestions,
  lettersWeak,
  paragraphsByStage,
  paraResult,
  rateParagraph,
  startParaWalk,
  type ParaRate,
} from "./firstCheck.ts";
import { stageCuts } from "./vocabBank.ts";
import { startLevel } from "./vocabLevel.ts";
import { tilesOf } from "./quiz.ts";
import { scriptFor } from "./scripts/index.ts";
import type { SpotItem } from "./spotErrors.ts";

const LANGS = ["ar", "en", "es", "fr", "hi", "id", "it", "ja", "ko", "pt", "ru", "th", "vi", "zh"];
const parasOf = (language: string) => JSON.parse(readFileSync(new URL(`./story-errors/${language}.json`, import.meta.url), "utf8")) as SpotItem[];

const walk = (rates: ParaRate[], stages?: number[]) => {
  let state = startParaWalk(stages);
  for (const rate of rates) state = rateParagraph(state, rate, stages);
  return state;
};

test("문단 고르기: 2단계에서 시작, 쉬우면 위·어려우면 아래, 딱 맞으면 그 단계", () => {
  assert.equal(startParaWalk().stage, 2);
  assert.equal(walk(["fit"]).done, 2);
  assert.equal(walk(["easy", "fit"]).done, 3);
  assert.equal(walk(["easy", "easy", "easy", "easy"]).done, 5);
  assert.equal(walk(["hard", "hard"]).done, 1);
  assert.equal(walk(["hard", "fit"]).done, 1);
  assert.equal(walk(["easy"]).done, null);
});

test("문단 고르기: 방향이 바뀌면 쉬웠던 단계에서 멈춤, 문단 없는 단계는 건너뜀", () => {
  assert.equal(walk(["easy", "hard"]).done, 2);
  assert.equal(walk(["hard", "easy"]).done, 1);
  assert.equal(walk(["easy", "easy", "hard"]).done, 3);
  // 5단계 문단이 없는 언어: 4에서 쉬워요 → 4에서 끝.
  assert.equal(walk(["easy", "easy", "easy"], [1, 2, 3, 4]).done, 4);
  // 2단계가 없으면 가장 낮은 단계부터.
  assert.equal(startParaWalk([1, 3, 4]).stage, 1);
  assert.equal(walk(["easy"], [1, 3, 4]).stage, 3);
});

test("문단 바로잡기: 14개 언어 모든 문단에서 틀린 칸이 바른 꼴로 (공백 없는 ja·zh·th 포함)", () => {
  for (const language of LANGS) {
    for (const item of parasOf(language)) {
      const fixed = fixedLines(item, language);
      assert.equal(fixed.length, item.lines.length, item.id);
      for (const err of item.errors) {
        const cell = tilesOf(fixed[err.line]!, language).join(" ");
        assert.ok(fixed[err.line]!.includes(err.right), `${item.id} ${err.wrong}→${err.right}: ${fixed[err.line]}`);
        assert.notEqual(fixed[err.line], item.lines[err.line], `${item.id} 안 바뀜 ${cell}`);
      }
    }
  }
});

test("단계마다 문단 하나(있는 단계만), 고른 단계 → 낱말 경계·표현·문법 (en·th·es)", () => {
  for (const language of ["en", "th", "es"]) {
    const map = paragraphsByStage(parasOf(language), "s");
    for (const [stage, item] of map) assert.equal(item.stage, stage, language);
    assert.ok(map.has(1) && map.has(2), language);
    const cuts = stageCuts(language);
    const three = paraResult(3, cuts, 0);
    assert.equal(three.expression, 3);
    assert.equal(three.grammar, 3);
    assert.equal(three.b, Math.round(startLevel(3, cuts).b));
    assert.ok(paraResult(1, cuts, 0).b < paraResult(4, cuts, 0).b, language);
  }
});

test("글자: 여섯 문제, 정답이 보기에 있고 보기 넷이 다름, 넷 틀리면 글자부터 (ja·th·ar)", () => {
  for (const language of ["ja", "th", "ar"]) {
    const questions = letterQuestions(scriptFor(language)!, "s");
    assert.equal(questions.length, 6, language);
    for (const q of questions) {
      assert.ok(q.options.includes(q.answer), language);
      assert.equal(new Set(q.options).size, 4, language);
      const course = scriptFor(language)!;
      const sound = (char: string) => course.groups.flatMap((group) => group.items).find((item) => item.char === char)?.reading;
      assert.equal(new Set(q.options.map(sound)).size, 4, `${language} 같은 소리 보기 ${q.options}`);
    }
  }
  assert.equal(lettersWeak([true, true, false, false, false, true]), false);
  assert.equal(lettersWeak([false, false, false, false, true, true]), true);
});

test("estimateChance: 낱말은 경계 b 곡선, 표현·문법은 잰 단계 아래 1 · 그 단계 0.5 · 위 0", () => {
  const check = { b: 600, expression: 2, grammar: 3 };
  assert.ok(estimateChance(check, { kind: "word", rank: 50, lv: 1 }) > 0.8);
  assert.ok(Math.abs(estimateChance(check, { kind: "word", rank: 600, lv: 1 }) - 0.5) < 0.01);
  assert.ok(estimateChance(check, { kind: "word", rank: 5000, lv: 5 }) < 0.2);
  assert.equal(estimateChance(check, { kind: "expr", rank: 0, lv: 1 }), 1);
  assert.equal(estimateChance(check, { kind: "expr", rank: 0, lv: 2 }), 0.5);
  assert.equal(estimateChance(check, { kind: "gram", rank: 0, lv: 4 }), 0);
});
