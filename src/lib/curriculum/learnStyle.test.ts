import assert from "node:assert/strict";
import test from "node:test";
import { itemStyle, recordKind, styleKinds, STYLE_KINDS, type KindLog } from "./learnStyle.ts";
import { buildQuiz } from "./quiz.ts";
import { allScriptsFor } from "./stageScripts.ts";
import { allFramesFor } from "./frames.ts";

test("항목 성격: 문장구조·문법 / 높임 / 낱말 / 덩어리 — 소리 묶음(듣고 고르기)은 뺌(영어·일본어·태국어·스페인어·중국어)", () => {
  assert.equal(itemStyle("en", "f|en-f1-01"), "structure");
  assert.equal(itemStyle("en", "g|1:0"), "structure");
  assert.equal(itemStyle("en", "e|could you help me"), "register");
  assert.equal(itemStyle("en", "e|station"), "word");
  assert.equal(itemStyle("en", "e|it doesn't matter to me at all"), "chunk");
  assert.equal(itemStyle("ja", "e|ありがとうございます"), "register");
  assert.equal(itemStyle("ja", "e|ちょっと"), "word");
  assert.notEqual(itemStyle("th", "e|ไม่เป็นไร"), "structure");
  assert.equal(itemStyle("es", "e|¿podría repetir?"), "register");
  assert.equal(itemStyle("zh", "e|谢谢"), "word");
  for (const kinds of Object.values(STYLE_KINDS)) assert.ok(!kinds.includes("listen" as never));
});

test("사람마다: 가장 약한 모양을 앞에 둘, 다 맞히면 말하기 위주, 기록 없으면 기본", () => {
  const key = "e|station";
  assert.deepEqual(styleKinds("en", key, null), STYLE_KINDS.word);
  let log: KindLog = {};
  log = recordKind(log, key, "meaning", true);
  log = recordKind(log, key, "say", false);
  assert.deepEqual(styleKinds("en", key, log), ["say", "say", "choose"]);
  // 옛 기록의 듣고 고르기는 세지 않는다(뺀 모양).
  log = recordKind({}, key, "listen" as never, false);
  assert.deepEqual(styleKinds("en", key, log), STYLE_KINDS.word);
  log = recordKind({}, key, "order", false);
  assert.deepEqual(styleKinds("en", key, log), ["order", "order", "say"]);
  let good: KindLog = {};
  for (let i = 0; i < 2; i += 1) for (const kind of ["choose", "meaning", "order"] as const) good = recordKind(good, key, kind, true);
  assert.deepEqual(styleKinds("en", key, good), ["say", "say", "choose"]);
});

test("퀴즈가 정한 모양을 따른다(만들 수 있는 만큼): 문장구조는 맞추기 먼저, 낱말은 빈칸·뜻 고르기(스페인어·일본어)", () => {
  for (const language of ["es", "ja"]) {
    const frame = allFramesFor(language)[0]!;
    const structure = buildQuiz(language, `f|${frame.id}`, { kinds: STYLE_KINDS.structure });
    assert.ok(structure, `${language} frame`);
    assert.equal(structure!.questions[0]!.kind, "order");
    const word = allScriptsFor(language).flatMap((s) => s.expressions).find((e) => itemStyle(language, `e|${e}`) === "word");
    if (!word) continue;
    const quiz = buildQuiz(language, `e|${word}`, { kinds: STYLE_KINDS.word });
    assert.ok(quiz && quiz.questions.some((q) => q.kind === "meaning" || q.kind === "choose"), `${language} ${word}`);
    assert.ok(quiz!.questions.every((q) => q.kind !== ("listen" as never)), `${language} ${word} no listen`);
  }
});
