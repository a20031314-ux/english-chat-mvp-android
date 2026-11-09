import { test } from "node:test";
import assert from "node:assert/strict";
import { allScriptsFor } from "./stageScripts.ts";
import { blankFor, fillBlank, ruleChoice, choicesInput, WRONG_COUNT } from "./scriptChoice.ts";

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

test("오답 확인: 원어민이 받아들일 오답은 빼고, 둘 아래로 줄면 그 줄은 뺌", async () => {
  const { applyCheck, checkInput } = await import("./scriptChoice.ts");
  const script = allScriptsFor("en").find((s) => choicesInput("en", s).length >= 2)!;
  const [a, b] = choicesInput("en", script);
  const choices = {
    [a!.i]: { blank: a!.blank, wrong: [{ text: "x1", type: "grammar" as const }, { text: "x2", type: "vocab" as const }, { text: "x3", type: "vocab" as const }] },
    [b!.i]: { blank: b!.blank, wrong: [{ text: "y1", type: "grammar" as const }, { text: "y2", type: "vocab" as const }] },
  };
  const items = checkInput(script, choices);
  assert.equal(items.length, 5);
  assert.ok(items[0]!.sentence.includes("x1") && !items[0]!.sentence.includes(a!.blank) || a!.blank === "x1");
  const out = applyCheck(choices, JSON.stringify({ accepted: [`${a!.i}:1`, `${b!.i}:0`] }));
  assert.deepEqual(out[a!.i]!.wrong.map((w) => w.text), ["x1", "x3"]);
  assert.equal(out[b!.i], undefined, "둘 아래면 뺌");
  assert.deepEqual(applyCheck(choices, "nope"), choices, "확인 실패면 그대로");
});

test("채팅 빈칸(2026-11-01): 쓴 조각을 줄에 넣어 줄 전체로 대조 — 띄어쓰기 없는 언어는 붙이고", async () => {
  const { typedMatches } = await import("../roleplay/practice.ts");
  // 스페인어
  const es = "Quiero un café con leche, por favor.";
  assert.equal(typedMatches(es, fillBlank(es, "café con leche", "café con leche")).matched, true);
  assert.equal(typedMatches(es, fillBlank(es, "café con leche", "té")).matched, false);
  assert.equal(fillBlank("Hola, Sofía.", "Sofía", "Sofía"), "Hola, Sofía.");
  // 일본어(띄어쓰기 없음)
  const ja = "コーヒーをください。";
  assert.equal(fillBlank(ja, "ください", "ください"), ja);
  assert.equal(typedMatches(ja, fillBlank(ja, "ください", "ください")).matched, true);
  assert.equal(typedMatches(ja, fillBlank(ja, "ください", "くださる")).matched, false);
});

test("빈칸: 숫자·이름은 고르지 않음(en·es·ja)", async () => {
  const { isNumberWord } = await import("./scriptChoice.ts");
  assert.equal(isNumberWord("en", "seven"), true);
  assert.equal(isNumberWord("es", "Siete"), true);
  assert.equal(isNumberWord("ja", "三"), true);
  assert.equal(isNumberWord("en", "calling"), false);
  for (const language of ["en", "es", "ja"]) {
    for (const script of allScriptsFor(language)) {
      script.lines.forEach((line, i) => {
        const blank = blankFor(language, script, i);
        if (!blank || line.who !== "me") return;
        assert.ok(!/^\p{Nd}+$/u.test(blank), `${language} ${script.id}:${i} ${blank}`);
        assert.ok(!(script.name?.text ?? []).includes(blank), `${language} ${script.id}:${i} 이름 ${blank}`);
      });
    }
  }
  const en = allScriptsFor("en").flatMap((script) => script.lines.map((line, i) => ({ line, blank: blankFor("en", script, i) }))).find(({ line }) => line.text.startsWith("Sure, it's seven"));
  if (en) assert.notEqual(en.blank, "seven");
});
