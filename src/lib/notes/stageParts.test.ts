import { test } from "node:test";
import assert from "node:assert/strict";
import { ladderFor } from "../curriculum/stages/index.ts";
import { emptyLedger, ledgerKey, type LedgerItem, type LedgerState } from "../learner/ledger.ts";
import { grammarNodeId } from "./notebook.ts";
import { isWordish, stageParts, vocabWords, VOCAB_TARGETS, PRON_TARGETS } from "./stageParts.ts";

const T0 = Date.UTC(2026, 9, 25);
function ledgerWith(language: string, rows: Array<[string, LedgerState]>) {
  const ledger = emptyLedger(language, T0);
  for (const [text, state] of rows) {
    const item = { text, state, firstMet: { tab: "chat", at: T0 }, met: [], outputs: [], helpAt: T0, slips: 0, heard: 0 } as unknown as LedgerItem;
    ledger.items[ledgerKey(text)] = item;
  }
  return ledger;
}

test("낱말 고르기: 두 낱말까지, 띄어쓰기 없는 말과 라틴 말", () => {
  assert.equal(isWordish("coffee", "en"), true);
  assert.equal(isWordish("look forward to", "en"), false);
  assert.equal(isWordish("la cuenta", "es"), true);
  assert.equal(isWordish("¿Me trae la cuenta?", "es"), false);
  assert.equal(isWordish("コーヒー", "ja"), true);
  assert.equal(isWordish("コーヒーを飲みたいです", "ja"), false);
});

test("네 갈래: 문법은 칸의 표현·구문 숙지, 표현은 단계 핵심 표현, 발음은 해 본 적 없으면 조건에서 빠짐", () => {
  const stage = ladderFor("en")!.stages[0]!;
  const words: Array<[string, LedgerState]> = Array.from({ length: 30 }, (_, i) => [`word${String.fromCharCode(97 + (i % 26))}${i}`, "mastered"]);
  const expressions: Array<[string, LedgerState]> = stage.expressions.map((text) => [text, "mastered"]);
  const ledger = ledgerWith("en", [...words, ...expressions, ["I live in Busan", "learned"], ["I work at a bank", "mastered"]]);
  const node = grammarNodeId(1, stage.grammar[0]!);
  const phrases = { [ledgerKey("I live in Busan")]: { node, at: T0 }, [ledgerKey("I work at a bank")]: { node, at: T0 } };
  const allGrammar = new Set(stage.grammar.map((g) => g.constructionId).filter((id): id is string => Boolean(id)));

  const none = stageParts({ stage, language: "en", ledger, phrases, pronunciation: { points: 0, tries: 0 } });
  const part = (id: string) => none.parts.find((p) => p.id === id)!;
  assert.equal(part("vocab").total, VOCAB_TARGETS[0]);
  assert.ok(part("vocab").done >= 30);
  assert.equal(part("expression").done, stage.expressions.length);
  assert.equal(part("pronunciation").measured, false);
  // 문법 첫 칸만 표현 둘로 참 → 아직 70% 아래 → 가장 모자란 갈래 = 문법.
  assert.equal(part("grammar").done, 1);
  assert.equal(none.ready, false);
  assert.equal(none.weakest, "grammar");

  // 구문을 모두 숙지하면 준비됨(발음은 재료 없음이라 빠짐).
  const ready = stageParts({ stage, language: "en", ledger, phrases, constructionsMastered: allGrammar, pronunciation: { points: 0, tries: 0 } });
  if (stage.grammar.every((g) => g.constructionId)) {
    assert.equal(ready.ready, true);
    assert.equal(ready.weakest, null);
  }
  // 발음을 해 봤는데 모자라면 발음이 가장 모자란 갈래.
  const pron = stageParts({ stage, language: "en", ledger, phrases, constructionsMastered: allGrammar, pronunciation: { points: 1, tries: 4 } });
  assert.equal(pron.parts.find((p) => p.id === "pronunciation")!.total, PRON_TARGETS[0]);
  if (stage.grammar.every((g) => g.constructionId)) assert.equal(pron.weakest, "pronunciation");
  assert.equal(pron.expressions.length, stage.expressions.length);
  assert.equal(pron.expressions[0]!.state, "mastered");
});

test("어휘 목록: 낱말만, 만남 빼고", () => {
  const ledger = ledgerWith("ja", [["コーヒー", "learned"], ["駅", "mastered"], ["駅はどこですか", "mastered"], ["水", "met"]]);
  assert.deepEqual(vocabWords(ledger, "ja").map((w) => w.text).sort(), ["コーヒー", "駅"].sort());
});

test("갈래 2주 기록: 숙지된 날·칸에 들어온 날·발음 날마다(띄어쓰기 없는 말 포함)", async () => {
  const { partHistory, HISTORY_DAYS } = await import("./stageParts.ts");
  const stage = ladderFor("ja")!.stages[0]!;
  const now = Date.UTC(2026, 9, 25, 12);
  const day = (at: number) => new Date(at).toISOString().slice(0, 10);
  const ledger = ledgerWith("ja", [["駅", "mastered"], [stage.expressions[0]!, "learned"]]);
  ledger.items[ledgerKey("駅")]!.masteredAt = now;
  const node = grammarNodeId(1, stage.grammar[0]!);
  const out = partHistory({ stage, language: "ja", ledger, phrases: { k: { node, at: now - 86_400_000 } }, pronunciationDays: { [day(now)]: 2 }, now, dayOf: day });
  assert.equal(out.vocab.length, HISTORY_DAYS);
  assert.equal(out.vocab.at(-1), 1); // 처음 쓴 날(첫 만남 = 같은 날) ½ + 숙지된 날 ½
  assert.equal(out.pronunciation.at(-1), 2);
  assert.equal(out.grammar.at(-2), 0); // 열쇠 k는 장부에 없음 → 세지 않음
});
