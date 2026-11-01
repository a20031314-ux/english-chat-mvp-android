import { test } from "node:test";
import assert from "node:assert/strict";
import { multiBlankRight, multiOf, spotsFixRight, spotsOf } from "./multiQuiz.ts";

const all = () => true;

test("복합 빈칸: 맞힌 소재 둘 이상이 든 문장만, 빈칸 사이 글을 그대로 두고 답이 문장에 다시 안 보임", () => {
  for (const language of ["en", "es", "th"]) {
    const made = multiOf(language, { stage: 1, seed: "t", learned: all });
    assert.ok(made, language);
    const q = made.question;
    assert.ok(q.blanks.length >= 2 && q.blanks.length <= 3, language);
    assert.equal(q.chunks.length, q.blanks.length + 1);
    // 빈칸 자리를 정답으로 채우면 원래 문장.
    assert.equal(q.chunks.map((chunk, i) => chunk + (q.blanks[i]?.answer ?? "")).join(""), q.text);
    // 빈칸끼리 사이에 글자가 있음(붙은 빈칸 없음).
    for (let i = 1; i < q.blanks.length; i += 1) assert.match(q.chunks[i]!, /[\p{L}\p{N}]/u, `${language} ${q.text}`);
    // 보이는 글에 정답이 다시 없음.
    const visible = q.chunks.join(" ").toLocaleLowerCase();
    for (const blank of q.blanks) assert.ok(!visible.includes(blank.answer.toLocaleLowerCase()) || blank.answer.length <= 1, `${language} ${blank.answer}`);
    assert.deepEqual(made.keys, q.blanks.map((blank) => blank.key));
  }
});

test("복합 빈칸: 아직 안 맞힌 소재는 비우지 않고, 맞힌 소재가 하나뿐이면 문제를 안 만든다", () => {
  const first = multiOf("es", { stage: 1, seed: "t", learned: all })!;
  const only = new Set(first.keys);
  const again = multiOf("es", { stage: 1, seed: "t", learned: (key) => only.has(key) });
  assert.ok(again);
  for (const key of again.keys) assert.ok(only.has(key));
  const one = first.keys[0]!;
  assert.equal(multiOf("es", { stage: 1, seed: "t", learned: (key) => key === one }), null);
});

test("복합 빈칸: 한자가 든 중국어·일본어 조각은 그 빈칸만 고르기(보기에 정답 하나)", () => {
  const made = multiOf("zh", { stage: 3, seed: "t", learned: all });
  assert.ok(made);
  const chosen = made.question.blanks.filter((blank) => blank.options);
  assert.ok(chosen.length >= 1);
  for (const blank of chosen) {
    assert.equal(blank.options!.filter((one) => one === blank.answer).length, 1);
    assert.ok(blank.options!.length >= 3);
  }
});

test("복합 빈칸 채점: 악센트만 빠지면 맞음, 헷갈리는 오답 꼴은 틀림", () => {
  assert.equal(multiBlankRight({ key: "e|x", answer: "café" }, "cafe", "es"), "loose");
  assert.equal(multiBlankRight({ key: "e|x", answer: "está", near: ["estás"] }, "estás", "es"), false);
});

test("복합 틀린 곳: 틀린 곳마다 다른 낱말 자리, 바르게 고친 말을 치면 맞음·틀린 꼴 그대로면 틀림", () => {
  let found = 0;
  for (const language of ["es", "ar", "ko", "en"]) {
    const made = spotsOf(language, { stage: 3, seed: "t", learned: all });
    if (!made) continue;
    found += 1;
    const q = made.question;
    assert.ok(q.errors.length >= 2);
    assert.notEqual(q.text, q.right);
    const used = q.errors.flatMap((error) => error.bad);
    assert.equal(new Set(used).size, used.length, `${language} ${q.text}`);
    for (const error of q.errors) {
      assert.ok(spotsFixRight(error, error.want, language));
      assert.equal(spotsFixRight(error, error.near[0]!, language), false, `${language} ${error.near[0]} → ${error.want}`);
    }
  }
  assert.ok(found >= 3);
});
