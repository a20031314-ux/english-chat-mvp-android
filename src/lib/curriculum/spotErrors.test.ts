import { test } from "node:test";
import assert from "node:assert/strict";
import { spotCells, spotProblems, type SpotItem } from "./spotErrors.ts";

const ko: SpotItem = {
  id: "ko-s-001", stage: 2, shape: "s", src: "new",
  lines: ["그는 회사에 늦어서 빨리 도착하려고 천천히 걸었다."],
  errors: [{ line: 0, at: 5, wrong: "천천히", right: "빨리", type: "meaning", kind: "word", why: { en: "late → fast", ko: "늦음 → 빨리" } }],
  clue: [2, 4], gloss: { en: "He was late, so he walked fast.", ko: "늦어서 빨리 걸었다." },
};

test("틀린 곳 문항 검사: 칸·바른 말·뜻 틀림 단서·문단 줄 수 (ko·ja·es)", () => {
  assert.deepEqual(spotProblems(ko, "ko"), []);
  assert.ok(spotProblems({ ...ko, clue: undefined }, "ko").includes("clue"), "단서 없는 뜻 틀림 한 문장");
  assert.ok(spotProblems({ ...ko, errors: [{ ...ko.errors[0]!, at: 1 }] }, "ko").some((one) => one.startsWith("e0.wrong")));
  // 일본어: 낱말로 잘린 칸.
  const ja: SpotItem = { id: "ja-s-1", stage: 1, shape: "s", src: "new", lines: ["私は学生がです。"], errors: [{ line: 0, at: 3, wrong: "が", right: "", type: "form", kind: "particle", why: { en: "x", ko: "x" } }], gloss: { en: "I am a student.", ko: "나는 학생이다." } };
  assert.ok(spotCells(ja.lines[0]!, "ja").includes("が"));
  assert.ok(spotProblems(ja, "ja").includes("e0.right"), "빈 바른 말");
  const es: SpotItem = { id: "es-p-1", stage: 1, shape: "P1", src: "new", lines: ["Hola.", "Yo soy Ana."], errors: [{ line: 1, at: 1, wrong: "soy", right: "estoy", type: "form", kind: "form", g: "g|1:0", why: { en: "x", ko: "x" } }], gloss: { en: "x", ko: "x" } };
  assert.ok(spotProblems(es, "es").includes("lines"), "P1은 세 줄");
});
