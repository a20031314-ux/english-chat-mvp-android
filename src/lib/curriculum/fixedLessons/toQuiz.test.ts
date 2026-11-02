import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fixedQuizQuestions } from "./toQuiz.ts";
import type { FixedLessonFile } from "./check.ts";

test("고정 퀴즈 → 문제: 19개 수업 모두 세 문제(쓰기·고르기·고치기), 고치기는 바른 문장·낱말 자리", () => {
  const file = JSON.parse(readFileSync(new URL("./en.ko.json", import.meta.url), "utf8")) as FixedLessonFile;
  for (const lesson of file.lessons) {
    const qs = fixedQuizQuestions("en", lesson.quiz, `f|${lesson.id}`);
    assert.deepEqual(qs.map((q) => q.kind).slice(0, 2), ["type", "choose"], lesson.id);
    assert.ok(["spot", "fix"].includes(qs[2]?.kind ?? ""), lesson.id);
  }
  const drive = fixedQuizQuestions("en", [{ kind: "fix", wrong: "I can to drive.", bad: "to", right: "(빼기)", cue: "" }], "f|x");
  // to를 빼기만 하는 고치기는 칠 말이 없어 두 문장 중 맞는 것 고르기.
  assert.equal(drive[0]?.kind, "fix");
  if (drive[0]?.kind === "fix") { assert.equal(drive[0].right, "I can drive."); assert.equal(drive[0].options?.[drive[0].answer ?? -1], "I can drive."); }
  const add = fixedQuizQuestions("en", [{ kind: "fix", wrong: "I'm teacher.", bad: "teacher", right: "a teacher", cue: "" }], "f|x")[0];
  assert.equal(add?.kind, "spot");
  if (add?.kind === "spot") assert.equal(add.want, "a teacher");
  const spot = fixedQuizQuestions("en", [{ kind: "fix", wrong: "She work at a cafe.", bad: "work", right: "works", cue: "그녀는 카페에서 일해요." }], "f|x")[0];
  assert.equal(spot?.kind, "spot");
  if (spot?.kind === "spot") {
    assert.equal(spot.right, "She works at a cafe.");
    assert.equal(spot.want, "works");
  }
});

test("고르기 보기는 섞이고(정답이 늘 첫 보기가 아님) 같은 문제는 늘 같은 자리", async () => {
  const { shuffleOptions } = await import("./toQuiz.ts");
  const seen = new Set<number>();
  for (const seed of ["a", "b", "c", "d", "e", "f", "g", "h", "私は", "ฉัน", "él"]) {
    const one = shuffleOptions(["right", "w1", "w2", "w3"], 0, seed);
    assert.equal(one.options[one.answer], "right");
    assert.deepEqual(shuffleOptions(["right", "w1", "w2", "w3"], 0, seed), one);
    assert.equal([...one.options].sort().join(), "right,w1,w2,w3");
    seen.add(one.answer);
  }
  assert.ok(seen.size >= 3);
});
