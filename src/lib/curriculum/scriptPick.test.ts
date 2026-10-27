import { test } from "node:test";
import assert from "node:assert/strict";
import { framesOfScript } from "./frames.ts";
import { pickScript } from "./scriptPick.ts";
import { scriptsFor } from "./stageScripts.ts";

test("오늘의 대본: 최근 짚인 문법을 쓰는 대본이 먼저, 그다음 아직인 표현, 아니면 안 한 대본", () => {
  const scripts = scriptsFor("ja", 2);
  const withGrammar = scripts.find((script) => (script.grammar ?? []).length > 0)!;
  const index = withGrammar.grammar![0]!;
  const byGrammar = pickScript({ language: "ja", stage: 2, passed: new Set(), expressionStates: {}, grammarMistakes: new Map([[index, 3]]) });
  assert.ok(byGrammar);
  assert.equal(byGrammar!.why.kind, "grammar");
  assert.ok(scriptsFor("ja", 2).find((s) => s.id === byGrammar!.id)!.grammar!.includes(index));

  const none = pickScript({ language: "ja", stage: 2, passed: new Set(), expressionStates: {}, grammarMistakes: new Map(), weakest: "expression" });
  assert.equal(none!.why.kind, "expression");

  // 모든 표현을 익혔고 짚인 것도 없으면 안 한 대본
  const learned = Object.fromEntries(scripts.flatMap((s) => s.expressions).map((e) => [e, "mastered" as const]));
  const passedAllButOne = new Set(scripts.slice(1).map((s) => s.id));
  const next = pickScript({ language: "ja", stage: 2, passed: passedAllButOne, expressionStates: learned, grammarMistakes: new Map() });
  assert.deepEqual(next, { id: scripts[0]!.id, why: { kind: "next" } });

  assert.equal(pickScript({ language: "th", stage: 1, passed: new Set(), expressionStates: {}, grammarMistakes: new Map() }), null);
});

test("오늘의 대본: 다른 신호가 같으면 익힌 틀이 든 대본을 먼저", () => {
  const scripts = scriptsFor("ko", 1);
  const target = scripts.find((script) => framesOfScript(script).length)!;
  const passed = new Set<string>([...scripts.filter((script) => script.id !== target.id).map((script) => script.id), ...framesOfScript(target)]);
  passed.add(target.id);
  const base = { language: "ko", stage: 1, expressionStates: {}, grammarMistakes: new Map<number, number>() };
  const all = Object.fromEntries(scripts.flatMap((script) => script.expressions).map((expression) => [expression, "learned" as const]));
  const pick = pickScript({ ...base, expressionStates: all, passed });
  assert.ok(pick);
  assert.ok(framesOfScript(scripts.find((script) => script.id === pick.id)!).some((id) => passed.has(id)));
});
