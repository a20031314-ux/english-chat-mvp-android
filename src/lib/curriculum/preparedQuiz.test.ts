import assert from "node:assert/strict";
import { describe, it, test } from "node:test";
import fs from "node:fs";
import { chooseFromPrepared, pickPrepared, turnPrepared, typeFromPrepared, type PreparedItem } from "./preparedQuiz.ts";

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

describe("pickPrepared 아래 단계 순서(2026-11-09)", () => {
  it("지금 단계를 다 풀면 바로 아래 단계부터 — es·ja", () => {
    const es = [1, 2, 4, 5].map((stage) => ({ ...grammar, key: `g|${stage}:0`, stage }));
    assert.deepEqual(pickPrepared(es, { stage: 5, skip: new Set(["g|5:0"]) }).map((item) => item.key), ["g|4:0"]);
    const ja = [1, 3].map((stage) => ({ ...grammar, key: `g|${stage}:1`, stage, answer: "は", options: ["は", "が"] }));
    assert.deepEqual(pickPrepared(ja, { stage: 4 }).map((item) => item.key), ["g|3:1"]);
  });
});

describe("turnPrepared — 같은 칸을 다른 문장으로", () => {
  const es: PreparedItem = { key: "g|3:1", kind: "grammar", stage: 3, gloss: "몰레 먹어 본 적 있어?", before: "¿Alguna vez ", after: " el mole?", answer: "has probado", options: ["has probó", "has probar", "has probado"], line: "¿Alguna vez has probado el mole?", why: "현재완료",
    variants: [{ before: "", after: " la radio.", answer: "Ha encendido", options: ["Ha encendido", "Ha encendado", "Ha encendió", "Ha encender"], line: "Ha encendido la radio.", gloss: "라디오를 켰어.", why: "haber + 과거분사" }] };
  const ja: PreparedItem = { key: "g|2:0", kind: "grammar", stage: 2, gloss: "어제 책을 읽었어.", before: "昨日本を", after: "。", answer: "読みました", options: ["読みました", "読みます"], line: "昨日本を読みました。", why: "과거",
    variants: [{ before: "友だちに", after: "。", answer: "会いました", options: ["会いました", "会います"], line: "友だちに会いました。", gloss: "친구를 만났어.", why: "과거" }] };
  it("0번째는 원래 문장, 그다음은 바꾼 문장, 한 바퀴 돌면 다시 원래", () => {
    assert.equal(turnPrepared(es, 0).line, es.line);
    assert.equal(turnPrepared(es, 1).line, "Ha encendido la radio.");
    assert.equal(turnPrepared(es, 1).key, "g|3:1");
    assert.equal(turnPrepared(es, 2).line, es.line);
    assert.equal(turnPrepared(ja, 1).line, "友だちに会いました。");
  });
  it("바꾼 문장도 고르기 문제가 된다", () => {
    const made = chooseFromPrepared(turnPrepared(es, 1));
    assert.ok(made);
    assert.equal(made.options[made.answer as number], "Ha encendido");
    assert.equal(made.gloss?.raw, "라디오를 켰어.");
  });
  it("es-gv.json: 문장 = 앞 + 답 + 뒤, 보기 넷이 다르고 답이 하나, 뜻 줄에 답이 안 보임", () => {
    const book = JSON.parse(fs.readFileSync(new URL("./problems/es-gv.json", import.meta.url), "utf8")) as Record<string, { before: string; after: string; answer: string; options: string[]; line: string; ko: string; en: string }[]>;
    assert.ok(book["g|3:1"]!.length >= 100);
    for (const list of Object.values(book)) {
      for (const one of list) {
        assert.equal(one.before + one.answer + one.after, one.line);
        assert.equal(new Set(one.options.map((o) => o.toLowerCase())).size, 4, one.line);
        assert.equal(one.options.filter((o) => o === one.answer).length, 1, one.line);
        assert.ok(one.ko && one.en && !one.en.toLowerCase().includes(one.answer.toLowerCase()), one.line);
      }
    }
  });
});

test("turnFresh: 최근에 낸 문장은 건너뛰고 다음 차례, 다 냈으면 그대로 (es·ja)", async () => {
  const { turnFresh } = await import("./preparedQuiz.ts");
  for (const [line, v1, v2] of [["Cabe destacar que…", "Cabe destacar el…", "Cabe destacar la…"], ["駅は近いです。", "店は近いです。", "家は近いです。"]]) {
    const item = { key: "e|x", kind: "expression" as const, stage: 1, gloss: "g", before: "", after: "", answer: "a", options: ["a", "b"], line, why: "w", variants: [v1, v2].map((one) => ({ before: "", after: "", answer: "a", options: ["a", "b"], line: one, gloss: "g", why: "w" })) };
    assert.equal(turnFresh(item, 0, []).line, line);
    assert.equal(turnFresh(item, 0, [line]).line, v1);
    assert.equal(turnFresh(item, 0, [line, v1]).line, v2);
    assert.equal(turnFresh(item, 1, [line, v1, v2]).line, v1);
  }
});
