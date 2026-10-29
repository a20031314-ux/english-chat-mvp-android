import { test } from "node:test";
import assert from "node:assert/strict";
import { allScriptsFor } from "./stageScripts.ts";
import { blankFor, choiceForLine, parseChoices, ruleChoice, choicesInput, WRONG_COUNT } from "./scriptChoice.ts";

const LANGS = ["ko", "ja", "es", "zh", "en", "id", "vi", "th", "fr", "it", "pt", "ru", "ar", "hi"];

test("고르기: 빈칸은 내 줄에 그대로 든 조각, 오답은 정답·줄과 다름(14개 언어)", () => {
  for (const language of LANGS) {
    let lines = 0;
    let made = 0;
    let grammar = 0;
    for (const script of allScriptsFor(language)) {
      script.lines.forEach((line, i) => {
        if (line.who !== "me") return;
        lines += 1;
        const blank = blankFor(language, script, i);
        if (blank) assert.ok(line.text.includes(blank), `${language} ${script.id}:${i}`);
        const choice = ruleChoice(language, script, i);
        if (!choice) return;
        made += 1;
        assert.ok(choice.wrong.length >= 2 && choice.wrong.length <= WRONG_COUNT);
        const texts = choice.wrong.map((option) => option.text.toLocaleLowerCase());
        assert.equal(new Set(texts).size, texts.length, "오답끼리 다름");
        assert.ok(!texts.includes(choice.blank.toLocaleLowerCase()), "정답이 오답에 없음");
        if (choice.wrong.some((option) => option.type === "grammar")) grammar += 1;
      });
    }
    assert.ok(made / lines > 0.6, `${language}: 내 줄 ${lines} 중 ${made}만 문제`);
    assert.ok(grammar > 0, `${language}: 문법 오답이 하나도 없음`);
  }
});

test("고르기: 한국어 조사·어미, 일본어 조사(띄어쓰기 없음)·스페인어 관사가 문법 오답", () => {
  const ko = allScriptsFor("ko").flatMap((script) => script.lines.map((_, i) => ruleChoice("ko", script, i))).filter(Boolean);
  assert.ok(ko.some((choice) => choice!.wrong.some((option) => option.type === "grammar" && /[은는이가을를요]$|요[.?!]?$/.test(option.text))));
  const ja = allScriptsFor("ja").flatMap((script) => script.lines.map((_, i) => ruleChoice("ja", script, i))).filter(Boolean);
  const jaGrammar = ja.flatMap((choice) => choice!.wrong.filter((option) => option.type === "grammar"));
  assert.ok(jaGrammar.length > 0);
  // 바꾼 것은 한 조각뿐 — 나머지 글자(문장부호 포함)는 그대로.
  for (const choice of ja.slice(0, 40)) {
    for (const option of choice!.wrong.filter((o) => o.type === "grammar")) {
      assert.ok(Math.abs([...option.text].length - [...choice!.blank].length) <= 3, `${choice!.blank} → ${option.text}`);
    }
  }
  const es = allScriptsFor("es").flatMap((script) => script.lines.map((_, i) => ruleChoice("es", script, i))).filter(Boolean);
  assert.ok(es.some((choice) => choice!.wrong.some((option) => option.type === "grammar")));
});

test("모델 오답 검사: 빈칸이 줄에 없거나, 정답과 같거나, 너무 길면 버리고 모자란 쪽은 규칙으로 채움", () => {
  const script = allScriptsFor("es").find((s) => choicesInput("es", s).length >= 2)!;
  const [first, second] = choicesInput("es", script);
  const raw = JSON.stringify({
    lines: [
      { i: first!.i, blank: first!.blank, wrong: [{ text: "x".repeat(200), type: "vocab" }, { text: first!.blank.toUpperCase(), type: "grammar" }, { text: "zzz", type: "grammar" }, { text: "qqq", type: "grammar" }] },
      { i: second!.i, blank: "no está en la línea", wrong: [{ text: "a", type: "vocab" }, { text: "b", type: "grammar" }] },
      { i: 0, blank: "x", wrong: [] },
    ],
  });
  const parsed = parseChoices(raw, "es", script);
  assert.ok(parsed[first!.i], "첫 줄은 남음");
  const texts = parsed[first!.i]!.wrong.map((option) => option.text);
  assert.ok(!texts.some((text) => text.length > 100), "너무 긴 것 뺌");
  assert.ok(!texts.includes(first!.blank.toUpperCase()), "정답과 같은 것 뺌");
  assert.equal(parsed[second!.i], undefined, "빈칸이 줄에 없으면 버림");
  assert.deepEqual(parseChoices("not json", "es", script), {});
  // 서버 것이 없으면 기기 규칙.
  assert.deepEqual(choiceForLine("es", script, first!.i, null), ruleChoice("es", script, first!.i));
  assert.deepEqual(choiceForLine("es", script, first!.i, parsed), parsed[first!.i]);
});
