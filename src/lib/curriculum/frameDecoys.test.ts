import { test } from "node:test";
import assert from "node:assert/strict";
import { allFramesFor } from "./frames.ts";
import { DECOYS } from "./frames/decoys/index.ts";
import { buildQuiz, nearMisses } from "./quiz.ts";

const LANGS = ["ja", "ko", "es", "zh", "en", "id", "vi", "th", "fr", "it", "pt", "ru", "ar", "hi"];

test("문장구조 헷갈리는 오답: 14개 언어 모든 틀 조각에 2~4개", () => {
  for (const language of LANGS) {
    const table = DECOYS[language];
    assert.ok(table, `${language} 없음`);
    for (const frame of allFramesFor(language)) {
      for (const core of frame.core.filter(Boolean)) {
        const list = table![`${frame.id}|${core}`];
        assert.ok(list && list.length >= 2 && list.length <= 4, `${frame.id}|${core}`);
      }
    }
  }
});

test("문장구조 퀴즈 고르기는 다른 틀 조각이 아니라 그 조각의 살짝 틀린 꼴(영어·일본어·스페인어)", () => {
  for (const [language, id] of [["en", "en-f1-01"], ["ja", "ja-f1-05"], ["es", "es-f1-01"]] as const) {
    let seen = 0;
    for (let seed = 1; seed <= 6; seed += 1) {
      const quiz = buildQuiz(language, `f|${id}`, { seed, stage: 1 });
      for (const question of quiz?.questions ?? []) {
        if (question.kind !== "choose") continue;
        const right = question.options[question.answer]!;
        const near = new Set(nearMisses(language, id, right));
        for (const option of question.options) if (option !== right) assert.ok(near.has(option), `${id}: "${option}"는 ${right}의 오답 목록 밖`);
        seen += 1;
      }
    }
    assert.ok(seen > 0, `${id} 고르기 문제 없음`);
  }
  // 문장 첫머리 대문자에 맞춘다.
  assert.ok(nearMisses("en", "en-f1-01", "My name is").every((one) => /^[A-Z]/.test(one)));
});
