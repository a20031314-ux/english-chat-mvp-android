import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { allFramesFor } from "../frames.ts";
import { loadBank } from "../vocabBank.ts";
import { tooEarlyWords } from "../lessonWords.ts";
import { checkFile, type FixedLessonFile } from "./check.ts";

test("고정 수업 en.ko: 1단계 틀 전부 · 오류 없음(경고는 출력)", async () => {
  const file = JSON.parse(readFileSync(new URL("./en.ko.json", import.meta.url), "utf8")) as FixedLessonFile;
  const bank = await loadBank("en");
  const issues = checkFile(file, allFramesFor("en"), 1, (text) => tooEarlyWords("en", text, 1, bank));
  for (const one of issues.filter((i) => i.level === "warn")) console.log(`경고 ${one.id}: ${one.what}`);
  assert.deepEqual(issues.filter((i) => i.level === "error"), []);
  assert.equal(file.lessons.length, 19);
});
