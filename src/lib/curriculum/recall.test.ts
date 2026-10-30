import { test } from "node:test";
import assert from "node:assert/strict";
import { framesFor } from "./frames.ts";
import { applyKnown, confirmDue, type KnownMap } from "./known.ts";
import { recallBundle, recallFits, recallFromScripts, recallKey, recallSets, stageFrameTally, RECALL_SIZE } from "./recall.ts";

const NOW = Date.UTC(2026, 9, 30, 3);

for (const language of ["ja", "es", "th"]) {
  const frames = framesFor(language, 1);
  test(`${language}: 틀 예문은 그 틀에 맞고, 다른 말은 안 맞는다`, () => {
    assert.ok(frames.length >= 5);
    for (const frame of frames.slice(0, 5)) assert.ok(recallFits(language, frame.examples[0]!.text, [frame]), `${frame.id} ${frame.examples[0]!.text}`);
    assert.equal(recallFits(language, "zzzz", [frames[0]!]), false);
  });

  test(`${language}: 꺼내 쓰지 않은 틀 먼저, 셋부터 두 틀 섞기`, () => {
    const ids = frames.slice(0, 4).map((frame) => frame.id);
    assert.deepEqual(recallSets([], null), []);
    const one = recallSets(ids.slice(0, 1), null);
    assert.deepEqual(one, [ids[0]]);
    let known: KnownMap = {};
    known = applyKnown(known, recallKey(ids[0]!), true, NOW, true);
    const sets = recallSets(ids, known);
    assert.ok(sets.length <= RECALL_SIZE && sets.length >= 3, sets.join());
    assert.equal(sets[0], ids[3], "가장 최근 익힌 새 틀부터");
    assert.ok(sets.some((set) => set.includes("+")), "섞은 짝");
    assert.ok(sets.indexOf(ids[0]!) === -1 || sets.indexOf(ids[0]!) > sets.indexOf(ids[1]!), "꺼내 쓴 것은 뒤로");
  });

  test(`${language}: 단계 조건은 익힘·꺼내 씀 둘 다 70%`, () => {
    const all = frames.map((frame) => frame.id);
    const need = Math.ceil(all.length * 0.7);
    const passed = new Set(all.slice(0, need));
    let known: KnownMap = {};
    assert.equal(stageFrameTally(language, 1, passed, known).ready, false);
    for (const id of all.slice(0, need - 1)) known = applyKnown(known, recallKey(id), true, NOW, true);
    assert.equal(stageFrameTally(language, 1, passed, known).ready, false);
    known = applyKnown(known, recallKey(all[need - 1]!), true, NOW, true);
    const tally = stageFrameTally(language, 1, passed, known);
    assert.equal(tally.ready, true);
    assert.equal(tally.learned, need);
    // 꺼내 쓰기 열쇠는 퀴즈 확인 중에 안 들어간다.
    assert.equal(confirmDue(known, NOW + 86400000).some((key) => key.startsWith("r|")), false);
    // 틀리면 지워짐.
    known = applyKnown(known, recallKey(all[0]!), false, NOW);
    assert.equal(stageFrameTally(language, 1, passed, known).ready, false);
  });

  test(`${language}: 대본 줄 재료는 앱 언어 뜻이 있고 틀에 맞는다`, () => {
    const prompts = frames.flatMap((frame) => recallFromScripts(language, frame, "ko"));
    assert.ok(prompts.length > 0);
    for (const prompt of prompts.slice(0, 10)) {
      assert.ok(prompt.gloss && prompt.gloss !== prompt.text);
      assert.ok(!frames.find((frame) => frame.id === prompt.frames[0])!.examples.some((example) => example.text === prompt.text));
    }
    const bundle = recallBundle(["a", "b"], { a: prompts.slice(0, 3), b: prompts.slice(3, 6) });
    assert.ok(bundle.length <= RECALL_SIZE);
    assert.equal(new Set(bundle.map((prompt) => prompt.text)).size, bundle.length);
  });
}
