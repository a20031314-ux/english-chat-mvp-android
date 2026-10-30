import { test } from "node:test";
import assert from "node:assert/strict";
import { allFramesFor } from "./frames.ts";
import { bankScriptsUpTo, scriptById, scriptsFor } from "./stageScripts.ts";
import { frameUsed, pickBankScript } from "./scriptBank.ts";
import { todayPlan } from "./dailyPlan.ts";

test("대본 은행: 줄 8개 번갈아, 내 줄 틀 태그는 그 단계 이하의 틀, 한국어 뜻, 숫자는 글로, 단계 목록에는 안 들어감", () => {
  const bank = bankScriptsUpTo("en", 5);
  assert.ok(bank.length >= 20);
  const frames = new Map(allFramesFor("en").map((frame) => [frame.id, frame]));
  const ids = new Set<string>();
  for (const script of bank) {
    assert.ok(script.bank, script.id);
    assert.ok(!ids.has(script.id), `${script.id} 겹침`);
    ids.add(script.id);
    assert.equal(script.lines.length, 8, script.id);
    assert.equal(scriptById("en", script.id)?.id, script.id);
    assert.ok(!scriptsFor("en", script.stage).some((one) => one.id === script.id), `${script.id} 단계 목록 밖`);
    assert.ok(script.setting.en && script.setting.ko, script.id);
    script.lines.forEach((line, i) => {
      assert.equal(line.who, i % 2 === 0 ? "them" : "me", `${script.id} ${i}`);
      assert.ok(line.gloss.ko, `${script.id} ${i} 한국어 뜻`);
      assert.ok(!/\d/.test(line.text), `${script.id} ${i} 숫자는 글로`);
      for (const id of line.frames ?? []) {
        const frame = frames.get(id);
        assert.ok(frame && frame.stage <= script.stage, `${script.id} ${i} 틀 ${id}`);
        assert.ok(frameUsed(frame.pattern, line.text), `${script.id} ${i} 줄에 틀 ${frame.pattern}이 없음`);
      }
    });
  }
});

test("고르기: 지금 단계 이하에서, 안 한 장면 먼저, 같은 날 같은 장면 — 은행 없는 언어는 null(일본어·스페인어)", () => {
  const first = pickBankScript({ language: "en", stage: 3, passed: new Set(), seed: "2026-10-30" });
  assert.ok(first && first.stage <= 3);
  assert.equal(pickBankScript({ language: "en", stage: 3, passed: new Set(), seed: "2026-10-30" })?.id, first!.id);
  const next = pickBankScript({ language: "en", stage: 3, passed: new Set([first!.id]), seed: "2026-10-30" });
  assert.ok(next && next.id !== first!.id);
  assert.equal(pickBankScript({ language: "ja", stage: 2, passed: new Set() }), null);
  assert.equal(pickBankScript({ language: "es", stage: 1, passed: new Set() }), null);
  // 다 했으면 다시(null 아님).
  const all = new Set(bankScriptsUpTo("en", 1).map((script) => script.id));
  assert.ok(pickBankScript({ language: "en", stage: 1, passed: all }));
});

test("틀을 실제로 썼나: 빈칸 앞뒤 고정 부분이 들어야(영어·스페인어·일본어)", () => {
  assert.equal(frameUsed("Can I have ___, please?", "can I have a coffee please"), true);
  assert.equal(frameUsed("Can I have ___, please?", "Coffee please"), false);
  assert.equal(frameUsed("I'm from ___.", "I’m from Korea."), true);
  assert.equal(frameUsed("Me llamo ___.", "Hola, me llamo Ana"), true);
  assert.equal(frameUsed("___をください。", "みずをください"), true);
  assert.equal(frameUsed("___をください。", "みずがほしい"), false);
});

test("오늘 할 것: 은행 장면은 하루 끝에 대화 한 칸", () => {
  const plan = todayPlan({ language: "en", stage: 1, passed: new Set(), review: {}, pace: 10, order: "curriculum", scene: { id: "en-1-b01", stage: 1 }, now: 0 });
  const last = plan[plan.length - 1]!;
  assert.equal(last.id, "en-1-b01");
  assert.equal(last.kind, "script");
});
