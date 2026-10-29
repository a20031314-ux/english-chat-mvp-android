import assert from "node:assert/strict";
import test from "node:test";
import { myPartHistory, myPartLog, myStageParts, stageKeyMap } from "./myParts.ts";
import { applyKnown, type KnownMap } from "../curriculum/known.ts";
import { DAY_MS } from "../curriculum/dailyPlan.ts";
import { isSituationScript, scriptsFor } from "../curriculum/stageScripts.ts";
import { ladderFor } from "../curriculum/stages/index.ts";
import { shareOf } from "./stageParts.ts";

const NOW = Date.UTC(2026, 9, 29, 3);
const day = (at: number) => new Date(at).toISOString().slice(0, 10);

test("My 안에서만: 아무것도 안 했으면 0, 대본 통과 = ½, 이미 앎 = 1, 발음 = 상황 대본 통과 몫(스페인어·일본어)", () => {
  for (const language of ["es", "ja"]) {
    const empty = myStageParts({ language, order: 1, passed: new Map(), known: {} });
    assert.ok(empty.parts.every((part) => part.done === 0), language);
    assert.equal(empty.ready, false);
    const script = scriptsFor(language, 1).find(isSituationScript)!;
    const passed = new Map([[script.id, NOW]]);
    const half = myStageParts({ language, order: 1, passed, known: {} });
    const keys = stageKeyMap(language, 1);
    const fromScript = [...keys].filter(([, row]) => row.from.includes(script.id));
    const sum = (rows: typeof half) => rows.parts.filter((part) => part.id !== "pronunciation").reduce((total, part) => total + part.done, 0);
    assert.equal(sum(half), fromScript.length / 2);
    assert.equal(half.parts.find((part) => part.id === "pronunciation")!.done, 1);
    let known: KnownMap = {};
    for (const [key] of fromScript) for (let d = 0; d < 3; d += 1) known = applyKnown(known, key, true, NOW + d * DAY_MS, true);
    const full = myStageParts({ language, order: 1, passed, known });
    assert.equal(sum(full), fromScript.length);
    assert.ok(full.expressions.some((row) => row.state === "mastered"));
  }
});

test("모든 열쇠 이미 앎 + 상황 대본 모두 통과면 준비됨, 그래프·낱낱도 같은 재료(태국어)", () => {
  const language = "th";
  const keys = stageKeyMap(language, 1);
  let known: KnownMap = {};
  for (const [key] of keys) for (let d = 0; d < 3; d += 1) known = applyKnown(known, key, true, NOW - (2 - d) * DAY_MS, true);
  const passed = new Map(scriptsFor(language, 1).filter(isSituationScript).map((script) => [script.id, NOW] as const));
  const row = myStageParts({ language, order: 1, passed, known });
  assert.ok(row.parts.filter((part) => part.measured).every((part) => shareOf(part) === 1));
  assert.equal(row.ready, true);
  const history = myPartHistory({ language, order: 1, passed, known, now: NOW, dayOf: day });
  const total = Object.values(history).flat().reduce((a, b) => a + b, 0);
  assert.ok(total > 0);
  const stage = ladderFor(language)!.stages[0]!;
  const log = myPartLog({ language, stage, passed, known, now: NOW });
  assert.ok(log.grammar.length > 0 && log.grammar.every((item) => !item.text.startsWith("f|")), "문장구조는 틀 모양으로");
});
