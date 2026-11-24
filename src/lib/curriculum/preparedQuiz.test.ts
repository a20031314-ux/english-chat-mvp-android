import assert from "node:assert/strict";
import { describe, it, test } from "node:test";
import fs from "node:fs";
import { chooseFromPrepared, pickPrepared, turnPrepared, type PreparedItem } from "./preparedQuiz.ts";

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

test("pickPrepared: 오래 안 낸 칸부터 돌림 — 어제 낸 be동사보다 안 낸 칸 먼저 (en·ja)", () => {
  const item = (key: string, stage = 1): PreparedItem => ({ key, kind: "grammar", stage, gloss: "", before: "", after: "", answer: "a", options: ["a", "b"], line: "a", why: "" });
  const items = [item("g|1:0"), item("g|1:1"), item("g|1:2"), item("g|1:3")];
  const asked: Record<string, number> = { "g|1:0": 200, "g|1:1": 100 };
  const picked = pickPrepared(items, { stage: 1, grammar: 2, expression: 0, lastAt: (key) => asked[key] ?? 0, weight: (key) => (key === "g|1:0" ? 1.5 : 1) });
  assert.deepEqual(picked.map((one) => one.key), ["g|1:2", "g|1:3"]);
  // 다 냈으면 가장 오래전 것부터.
  const all: Record<string, number> = { "g|1:0": 400, "g|1:1": 100, "g|1:2": 300, "g|1:3": 200 };
  assert.deepEqual(pickPrepared(items, { stage: 1, grammar: 2, expression: 0, lastAt: (key) => all[key] ?? 0 }).map((one) => one.key), ["g|1:1", "g|1:3"]);
  // 같은 규칙이 일본어 칸에도(언어와 상관없음).
  const ja = [item("g|1:0"), item("g|1:1")];
  assert.deepEqual(pickPrepared(ja, { stage: 1, grammar: 1, expression: 0, lastAt: (key) => (key === "g|1:0" ? 50 : 0) }).map((one) => one.key), ["g|1:1"]);
});

test("grownVariants·withGrown: 문제은행 문법 문장을 같은 칸의 다른 문장으로(앱 언어 뜻·까닭이 있을 때만)", async () => {
  const { grownVariants, withGrown } = await import("./preparedQuiz.ts");
  const grown = [
    { text: "Ayer comimos paella.", piece: "comimos", wrong: ["comemos", "comíamos", "comeremos"], why: "Ayer marks a finished past action.", gloss: { en: "Yesterday we ate paella.", ko: "어제 우리는 파에야를 먹었다." }, ui: { code: "ko", gloss: "어제 우리는 파에야를 먹었다.", why: "ayer(어제) → 끝난 과거." } },
    { text: "昨日、本を読みました。", piece: "読みました", wrong: ["読みます", "読んでいます"], why: "昨日 asks for the past.", gloss: { en: "I read a book yesterday." }, ui: { code: "ja", gloss: "昨日本を読んだ。", why: "昨日 → 過去" } },
    { text: "Ella es alta.", piece: "es", wrong: ["eres"], why: "x", gloss: { en: "She is tall." } },
  ];
  const ko = grownVariants(grown, "ko");
  assert.equal(ko.length, 1);
  assert.equal(ko[0]!.before, "Ayer ");
  assert.equal(ko[0]!.answer, "comimos");
  assert.deepEqual(ko[0]!.options, ["comimos", "comemos", "comíamos", "comeremos"]);
  assert.equal(grownVariants(grown, "en").length, 2);
  assert.equal(grownVariants(grown, "ar").length, 0);
  const item: PreparedItem = { key: "g|2:3", kind: "grammar", stage: 2, gloss: "g", before: "", after: "", answer: "a", options: ["a", "b"], line: "Ayer comimos paella.", why: "w" };
  assert.equal(withGrown(item, ko), item);
  assert.equal(withGrown(item, grownVariants(grown, "en")).variants?.length, 1);
});

test("grownChoices: 틀린 문장의 맞는 문장이 그 문장을 고친 것이면 뺌 — es·ja", async () => {
  const { grownChoices, nearLine } = await import("./preparedQuiz.ts");
  assert.equal(nearLine("Yo he escribido una carta.", "Yo he escrito una carta."), true);
  assert.equal(nearLine("昨日映画を見ます。", "昨日映画を見ました。"), true);
  assert.equal(nearLine("Yo he escribido una carta.", "Nunca hemos ido a Cuba."), false);
  const x = { text: "Yo he escribido una carta.", piece: "", v: "x" as const, wrong: ["Yo he escrito una carta.", "¿Has llegado ya?", "Nunca hemos ido a Cuba.", "Ya he comido."], why: "w", gloss: { en: "I have written a letter." }, ui: { code: "ko", gloss: "편지를 썼다", why: "escribir → escrito" } };
  const got = grownChoices([x], "ko");
  assert.equal(got.length, 1);
  assert.ok(got[0]!.v === "x" && !got[0]!.rights.includes("Yo he escrito una carta."));
  assert.equal(grownChoices([{ ...x, wrong: x.wrong.slice(0, 3) }], "ko").length, 0);
  const fixed = grownChoices([{ ...x, piece: "Yo he escrito una carta." }], "ko")[0];
  assert.ok(fixed?.v === "x" && fixed.fixed === "Yo he escrito una carta.");
});
