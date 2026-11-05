import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { chooseFromPrepared, pickPrepared, typeFromPrepared, type PreparedItem } from "./preparedQuiz.ts";

const grammar: PreparedItem = {
  key: "g|1:0",
  kind: "grammar",
  stage: 1,
  gloss: "책이 탁자 위에 있다.",
  before: "The book ",
  after: " on the table.",
  answer: "is",
  options: ["am", "is", "are"],
  line: "The book is on the table.",
  why: "book은 하나라서 is입니다.",
};

const expression: PreparedItem = {
  key: "e|have a nice day",
  kind: "expression",
  stage: 1,
  gloss: "좋은 하루 보내세요.",
  before: "Thank you. ",
  after: ".",
  answer: "Have a nice day",
  options: ["have nice day", "Have a nice day", "has a nice day", "have the nice day"],
  line: "Thank you. Have a nice day.",
  why: "헤어지며 좋은 하루를 빌 때입니다.",
};

const later: PreparedItem = { ...grammar, key: "g|3:0", stage: 3, answer: "Have you ever", options: ["Did you ever", "Have you ever"] };

describe("prepared quiz", () => {
  it("keeps the written answer and shows the gloss first", () => {
    const question = chooseFromPrepared(grammar);
    assert.ok(question && question.kind === "choose");
    if (question?.kind !== "choose") return;
    assert.equal(question.options[question.answer], "is");
    assert.equal(question.gloss.raw, grammar.gloss);
    assert.equal(question.prepared?.why, grammar.why);
    assert.equal(question.before, "The book ");
    assert.deepEqual([...question.options].sort(), ["am", "are", "is"]);
  });

  it("writes the word from the gloss and keeps the sentence for after", () => {
    const word: PreparedItem = {
      key: "w|学校",
      kind: "word",
      stage: 1,
      gloss: "학교",
      before: "",
      after: "",
      answer: "school",
      options: [],
      line: "He walks to school every day.",
      why: "",
      hint: "s",
      mark: "한 단어",
    };
    const question = typeFromPrepared(word);
    assert.ok(question && question.kind === "type");
    if (question?.kind !== "type") return;
    assert.equal(question.gloss.raw, "학교");
    assert.equal(question.answer, "school");
    assert.equal(question.text, word.line);
    assert.equal(question.before, "");
    assert.equal(question.prepared?.hint, "s");
    assert.equal(question.prepared?.mark, "한 단어");
    assert.equal(typeFromPrepared({ ...word, hint: "school" }), null);
  });

  it("drops a problem whose answer is not one of the options", () => {
    assert.equal(chooseFromPrepared({ ...grammar, answer: "be" }), null);
  });

  it("puts this stage's grammar before the expression and leaves later stages", () => {
    const thai: PreparedItem = { ...expression, key: "e|สวัสดี", stage: 1, gloss: "안녕하세요.", answer: "สวัสดี", options: ["สวัสดี", "ลาก่อน"], line: "สวัสดีครับ", why: "만날 때입니다." };
    const picked = pickPrepared([later, expression, grammar, thai], { stage: 1, skip: new Set(["e|have a nice day"]) });
    assert.deepEqual(picked.map((item) => item.key), ["g|1:0", "e|สวัสดี"]);
  });
});
