import { test } from "node:test";
import assert from "node:assert/strict";
import { glossFor, hintOf, scriptsFor } from "./stageScripts.ts";
import { ladderFor } from "./stages/index.ts";

test("시범 언어·단계마다 두 편, 줄은 상대·나가 번갈아, 내 줄이 있다", () => {
  for (const language of ["ko", "ja", "es"]) {
    for (const stage of [1, 2]) {
      const scripts = scriptsFor(language, stage);
      assert.equal(scripts.length, 2, `${language}-${stage}`);
      for (const script of scripts) {
        assert.ok(script.lines.length >= 6);
        assert.ok(script.lines.some((line) => line.who === "me"));
        script.lines.forEach((line, i) => assert.equal(line.who, i % 2 === 0 ? "them" : "me", `${script.id} ${i}`));
        if (language !== "ko") assert.ok(script.lines.every((line) => line.gloss.ko), `${script.id} 한국어 뜻`);
      }
    }
  }
  assert.deepEqual(scriptsFor("th", 1), []);
});

test("대본은 그 단계 핵심 표현을 적어도 하나 쓴다", () => {
  for (const language of ["ko", "ja", "es"]) {
    const ladder = ladderFor(language)!;
    for (const stage of [1, 2]) {
      const expressions = ladder.stages.find((s) => s.order === stage)!.expressions.map((e) => e.toLowerCase());
      for (const script of scriptsFor(language, stage)) {
        const all = script.lines.map((line) => line.text.toLowerCase()).join(" ");
        assert.ok(expressions.some((e) => all.includes(e)), `${script.id}: 단계 표현 없음`);
      }
    }
  }
});

test("첫 글자만: 스페인어는 낱말마다, 일본어는 낱말 덩어리마다 첫 글자", () => {
  assert.equal(hintOf("Soy de Corea. ¿Y tú?", "es"), "S__ d_ C____. ¿Y t_?");
  const ja = hintOf("昨日から頭が痛いです。", "ja");
  assert.ok(ja.startsWith("昨"));
  assert.ok(ja.includes("_"));
  assert.ok(ja.endsWith("。"));
  assert.equal(glossFor({ en: "Hi", ko: "안녕" }, "ko"), "안녕");
  assert.equal(glossFor({ en: "Hi", ko: "안녕" }, "ar"), "Hi");
});
