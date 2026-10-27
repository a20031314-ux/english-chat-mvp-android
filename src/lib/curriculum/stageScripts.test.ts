import { test } from "node:test";
import assert from "node:assert/strict";
import { cleanBesidesName, glossFor, hintOf, isSituationScript, personalize, scriptById, swapName, usableName, modesFor, passOutcome, runPasses, scriptForExpressions, scriptsFor, variantOf, type LineRun, type StageScript } from "./stageScripts.ts";
import { ladderFor } from "./stages/index.ts";
import { withScripts, type StageParts } from "../notes/stageParts.ts";

const LINES = [8, 10, 12, 14, 16];

test("ko·ja·es: 단계 상황마다 대본 하나(줄 수는 단계마다 늘고), 핵심 표현은 모두 어느 대본엔가 — 없던 표현은 짧은 표현 대본으로", () => {
  for (const language of ["ko", "ja", "es"]) {
    const ladder = ladderFor(language)!;
    const ids = new Set<string>();
    for (const stage of ladder.stages) {
      const scripts = scriptsFor(language, stage.order);
      const situations = scripts.filter(isSituationScript);
      assert.deepEqual(
        situations.map((script) => script.situation).sort(),
        stage.situations.map((_, i) => i),
        `${language}-${stage.order} 상황마다 하나`,
      );
      const covered = new Set(scripts.flatMap((script) => script.expressions));
      assert.deepEqual(stage.expressions.filter((e) => !covered.has(e)), [], `${language}-${stage.order} 대본에 없는 표현`);
      for (const script of scripts) {
        assert.ok(!ids.has(script.id), `${script.id} 겹침`);
        ids.add(script.id);
        for (const e of script.expressions) assert.ok(stage.expressions.includes(e), `${script.id}: "${e}"는 그 단계 표현이 아님`);
        const situation = isSituationScript(script);
        if (situation) assert.equal(script.lines.length, LINES[stage.order - 1], `${script.id} 줄 수`);
        else {
          assert.ok(script.lines.length === 6 || script.lines.length === 8, `${script.id} 표현 대본 줄 수`);
          assert.ok(script.expressions.length >= 1, `${script.id} 표현 대본인데 표현 없음`);
        }
        script.lines.forEach((line, i) => {
          assert.equal(line.who, i % 2 === 0 ? "them" : "me", `${script.id} ${i}`);
          assert.ok(line.text.trim() && line.gloss.en.trim(), `${script.id} ${i} 빈 줄`);
          if (language !== "ko") assert.ok(line.gloss.ko, `${script.id} ${i} 한국어 뜻`);
          if (line.alt) {
            assert.ok(situation && (stage.order === 3 || stage.order === 4), `${script.id} alt는 3~4단계 상황 대본만`);
            assert.equal(line.who, "them", `${script.id} alt는 상대 줄만`);
          }
          assert.ok(!/\d/.test(line.text), `${script.id} ${i} 숫자는 글로`);
        });
        assert.equal(Boolean(script.goal), situation && stage.order === 5, `${script.id} goal은 5단계 상황 대본만`);
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
  expressions: [],
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
  const ids = scriptsFor("es", 1).filter(isSituationScript).map((script) => script.id);
  const some = withScripts([row], "es", new Set(ids.slice(0, 2)))[0]!;
  assert.equal(some.ready, false);
  assert.equal(some.scripts?.done, 2);
  assert.equal(withScripts([row], "es", new Set(ids))[0]!.ready, true);
  assert.equal(withScripts([{ ...row, ready: false }], "es", new Set(ids))[0]!.ready, false);
  assert.equal(withScripts([row], "th", new Set())[0]!.ready, true);
  assert.equal(withScripts([row], "th", new Set())[0]!.scripts, undefined);
  // 표현 대본은 다음 단계 조건에 안 든다(통과한 id로는 남음).
  const extra = scriptsFor("es", 1).find((script) => !isSituationScript(script));
  if (extra) {
    const both = withScripts([row], "es", new Set([...ids, extra.id]))[0]!;
    assert.equal(both.scripts?.done, ids.length);
    assert.ok(both.scripts?.passed.includes(extra.id));
  }
});

test("표현 갈래 연습 → 아직인 표현이 든 대본(표현 대본 먼저), 힌트를 봤으면 도움 받음", () => {
  for (const language of ["ko", "ja", "es"]) {
    const stage = ladderFor(language)!.stages[0]!;
    for (const expression of stage.expressions) {
      const script = scriptForExpressions(language, 1, [expression]);
      assert.ok(script?.expressions.includes(expression), `${language} ${expression}`);
    }
  }
  assert.equal(scriptForExpressions("es", 1, ["(없는 표현)"]), null);
  assert.equal(passOutcome({ 1: { clean: true, mode: "hide", revealed: false } }), "unaided");
  assert.equal(passOutcome({ 1: { clean: true, mode: "hide", revealed: false }, 3: { clean: true, mode: "hint", revealed: false } }), "helped");
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

test("학습자 이름 자리: 닉네임으로 바꾸고, 한국어는 조사를 받침에 맞춘다", () => {
  assert.equal(swapName("저는 루카스예요. 루카스 씨는요?", ["루카스"], "준", true), "저는 준이에요. 준 씨는요?");
  assert.equal(swapName("저는 루카스예요.", ["루카스"], "민지", true), "저는 민지예요.");
  assert.equal(swapName("제 이름은 다니엘 김이에요.", ["다니엘 김", "다니엘"], "Maria", true), "제 이름은 Maria예요.");
  assert.equal(swapName("Sí, me llamo Daniel Kim.", ["Daniel Kim", "Daniel"], "Jun", false), "Sí, me llamo Jun.");
  const ja = personalize(scriptById("ja", "ja-1-1")!, "ja", "민지");
  assert.ok(ja.lines.some((line) => line.text.includes("민지です")));
  assert.ok(ja.lines.every((line) => !line.text.includes("マリア") && !line.gloss.en.includes("Maria") && !(line.gloss.ko ?? "").includes("마리아")));
  // 닉네임이 없거나 쓸 수 없으면 그대로
  assert.equal(personalize(scriptById("ja", "ja-1-1")!, "ja", null), scriptById("ja", "ja-1-1"));
  assert.equal(usableName("🙂🙂"), null);
  assert.equal(usableName("  Ana   María "), "Ana María");
  // 이름 낱말은 받아쓰기가 다르게 적어도 맞음
  assert.equal(cleanBesidesName([{ kind: "changed", word: "민지です" }, { kind: "kept", word: "よろしく" }], "민지"), true);
  assert.equal(cleanBesidesName([{ kind: "changed", word: "よろしく" }], "민지"), false);
  // 이름을 표시한 대본은 그 모양이 실제로 글에 있다
  for (const language of ["ko", "ja", "es"]) {
    for (const stage of [1, 2, 3, 4, 5]) {
      for (const script of scriptsFor(language, stage)) {
        if (!script.name) continue;
        const all = script.lines.map((line) => line.text).join(" ");
        assert.ok(script.name.text.some((form) => all.includes(form)), `${script.id} 이름 모양`);
      }
    }
  }
});

test("문법 태그: 그 단계 문법 번호 안, 앞 단계는 더 낮은 단계", () => {
  for (const language of ["ko", "ja", "es"]) {
    const ladder = ladderFor(language)!;
    for (const stage of ladder.stages) {
      for (const script of scriptsFor(language, stage.order)) {
        for (const index of script.grammar ?? []) assert.ok(index >= 0 && index < stage.grammar.length, `${script.id} ${index}`);
        for (const tag of script.earlierGrammar ?? []) {
          const [s, i] = tag.split(":").map(Number);
          const earlier = ladder.stages.find((one) => one.order === s);
          assert.ok(earlier && s! < stage.order && i! >= 0 && i! < earlier.grammar.length, `${script.id} ${tag}`);
        }
      }
    }
  }
});
