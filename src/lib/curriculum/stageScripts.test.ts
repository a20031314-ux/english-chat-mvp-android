import { test } from "node:test";
import assert from "node:assert/strict";
import { isSituationScript, scriptsFor } from "./stageScripts.ts";
import { ladderFor } from "./stages/index.ts";
import { withScripts, type StageParts } from "../notes/stageParts.ts";

const LINES = [8, 10, 12, 14, 16];
/** 대본이 있는 학습 언어 전부(2026-10-28: ko·ja·es에서 나머지 언어로 늘어남). */
const SCRIPTED = ["ko", "ja", "es", "en", "zh", "vi", "id", "th", "fr", "it", "pt", "ru", "ar", "hi"].filter((language) => scriptsFor(language, 1).length);

test("대본 있는 언어: 단계 상황마다 대본 하나(줄 수는 단계마다 늘고), 핵심 표현은 모두 어느 대본엔가 — 없던 표현은 짧은 표현 대본으로", () => {
  for (const language of SCRIPTED) {
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
          assert.ok(script.expressions.length >= 1 || (script.grammar ?? []).length >= 1, `${script.id} 표현·문법 대본인데 둘 다 없음`);
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
  assert.deepEqual(scriptsFor("xx", 1), []);
});

test("다음 단계 = 네 갈래 + 그 단계 대본 모두 통과(대본 없는 언어는 그대로)", () => {
  const row: StageParts = { order: 1, parts: [], ready: true, weakest: null, expressions: [] };
  const ids = scriptsFor("es", 1).filter(isSituationScript).map((script) => script.id);
  const some = withScripts([row], "es", new Set(ids.slice(0, 2)))[0]!;
  assert.equal(some.ready, false);
  assert.equal(some.scripts?.done, 2);
  assert.equal(withScripts([row], "es", new Set(ids))[0]!.ready, true);
  assert.equal(withScripts([{ ...row, ready: false }], "es", new Set(ids))[0]!.ready, false);
  assert.equal(withScripts([row], "xx", new Set())[0]!.ready, true);
  assert.equal(withScripts([row], "xx", new Set())[0]!.scripts, undefined);
  // 표현 대본은 다음 단계 조건에 안 든다(통과한 id로는 남음).
  const extra = scriptsFor("es", 1).find((script) => !isSituationScript(script));
  if (extra) {
    const both = withScripts([row], "es", new Set([...ids, extra.id]))[0]!;
    assert.equal(both.scripts?.done, ids.length);
    assert.ok(both.scripts?.passed.includes(extra.id));
  }
});

test("문법 태그: 그 단계 문법 번호 안, 앞 단계는 더 낮은 단계", () => {
  for (const language of SCRIPTED) {
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

test("단계 문법은 모두 어느 대본엔가(내 줄에서) — 오늘의 대본이 짚인 문법으로 고를 수 있게", () => {
  for (const language of SCRIPTED) {
    for (const stage of ladderFor(language)!.stages) {
      const covered = new Set(scriptsFor(language, stage.order).flatMap((script) => script.grammar ?? []));
      const missing = stage.grammar.map((_, i) => i).filter((i) => !covered.has(i));
      assert.deepEqual(missing, [], `${language}-${stage.order} 대본 없는 문법`);
    }
  }
});
