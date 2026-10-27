import { test } from "node:test";
import assert from "node:assert/strict";
import { glossFor, hintOf, modesFor, runPasses, scriptsFor, variantOf, type LineRun, type StageScript } from "./stageScripts.ts";
import { ladderFor } from "./stages/index.ts";
import { withScripts, type StageParts } from "../notes/stageParts.ts";

const LINES = [8, 10, 12, 14, 16];

test("ko·ja·es: 단계마다 상황 다섯에 대본 하나, 줄 수는 단계마다 늘고 상대·나가 번갈아", () => {
  for (const language of ["ko", "ja", "es"]) {
    const ladder = ladderFor(language)!;
    const ids = new Set<string>();
    for (const stage of ladder.stages) {
      const scripts = scriptsFor(language, stage.order);
      assert.equal(scripts.length, stage.situations.length, `${language}-${stage.order} 대본 수`);
      assert.deepEqual(
        scripts.map((script) => script.situation).sort(),
        stage.situations.map((_, i) => i),
        `${language}-${stage.order} 상황마다 하나`,
      );
      for (const script of scripts) {
        assert.ok(!ids.has(script.id), `${script.id} 겹침`);
        ids.add(script.id);
        assert.equal(script.lines.length, LINES[stage.order - 1], `${script.id} 줄 수`);
        script.lines.forEach((line, i) => {
          assert.equal(line.who, i % 2 === 0 ? "them" : "me", `${script.id} ${i}`);
          assert.ok(line.text.trim() && line.gloss.en.trim(), `${script.id} ${i} 빈 줄`);
          if (language !== "ko") assert.ok(line.gloss.ko, `${script.id} ${i} 한국어 뜻`);
          if (line.alt) {
            assert.ok(stage.order === 3 || stage.order === 4, `${script.id} alt는 3~4단계만`);
            assert.equal(line.who, "them", `${script.id} alt는 상대 줄만`);
          }
          assert.ok(!/\d/.test(line.text), `${script.id} ${i} 숫자는 글로`);
        });
        assert.equal(Boolean(script.goal), stage.order === 5, `${script.id} goal은 5단계만`);
        assert.ok(script.setting.en && script.setting.ko, `${script.id} 장면 이름`);
      }
    }
  }
  assert.deepEqual(scriptsFor("th", 1), []);
});

const two: StageScript = {
  id: "x-1-1",
  stage: 1,
  situation: 0,
  setting: { en: "x", ko: "x" },
  lines: [
    { who: "them", text: "Hola", gloss: { en: "Hi" } },
    { who: "me", text: "Hola", gloss: { en: "Hi" } },
    { who: "them", text: "¿Qué tal?", gloss: { en: "How are you?" }, alt: [{ text: "¿Cómo estás?", gloss: { en: "How are you?" } }] },
    { who: "me", text: "Bien", gloss: { en: "Fine" } },
  ],
};

test("통과: 내 줄이 모두, 통과 방식(1~2단계 첫 글자만·가리기)으로, 원문을 열지 않고 맞아야", () => {
  const ok = (mode: LineRun["mode"], revealed = false): LineRun => ({ clean: true, mode, revealed });
  assert.equal(runPasses(two, { 1: ok("hide"), 3: ok("hint") }), true);
  assert.equal(runPasses(two, { 1: ok("hide"), 3: ok("shadow") }), false, "따라 말하기는 연습");
  assert.equal(runPasses(two, { 1: ok("hide"), 3: ok("hide", true) }), false, "원문을 열었으면");
  assert.equal(runPasses(two, { 1: ok("hide") }), false, "안 한 줄");
  assert.equal(runPasses({ ...two, stage: 3 }, { 1: ok("own"), 3: ok("hide") }), true);
  assert.equal(runPasses({ ...two, stage: 3 }, { 1: ok("hint"), 3: ok("hide") }), false);
  assert.deepEqual(modesFor(1), ["shadow", "hint", "hide"]);
  assert.deepEqual(modesFor(4), ["shadow", "hide", "own"]);
  assert.equal(variantOf(two.lines[2]!, 0).text, "¿Qué tal?");
  assert.equal(variantOf(two.lines[2]!, 1).text, "¿Cómo estás?");
  assert.equal(variantOf(two.lines[0]!, 3).text, "Hola");
});

test("다음 단계 = 네 갈래 + 그 단계 대본 모두 통과(대본 없는 언어는 그대로)", () => {
  const row: StageParts = { order: 1, parts: [], ready: true, weakest: null, expressions: [] };
  const ids = scriptsFor("es", 1).map((script) => script.id);
  const some = withScripts([row], "es", new Set(ids.slice(0, 2)))[0]!;
  assert.equal(some.ready, false);
  assert.equal(some.scripts?.done, 2);
  assert.equal(withScripts([row], "es", new Set(ids))[0]!.ready, true);
  assert.equal(withScripts([{ ...row, ready: false }], "es", new Set(ids))[0]!.ready, false);
  assert.equal(withScripts([row], "th", new Set())[0]!.ready, true);
  assert.equal(withScripts([row], "th", new Set())[0]!.scripts, undefined);
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
