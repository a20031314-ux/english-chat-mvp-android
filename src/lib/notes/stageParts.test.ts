import { test } from "node:test";
import assert from "node:assert/strict";
import { ladderFor } from "../curriculum/stages/index.ts";
import { emptyLedger, ledgerKey, type LedgerItem, type LedgerState } from "../learner/ledger.ts";
import { grammarNodeId, type FixCard } from "./notebook.ts";
import { isWordish, partsOfCard, recentMistakes, stageParts, vocabWords, VOCAB_TARGETS, PRON_TARGETS } from "./stageParts.ts";

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

test("요소 태그: 한 표현이 함께 보여 준 문법 칸도 채움(일본어·스페인어)", () => {
  for (const language of ["ja", "es"]) {
    const stage = ladderFor(language)!.stages[0]!;
    const [a, b] = [grammarNodeId(1, stage.grammar[0]!), grammarNodeId(1, stage.grammar[1]!)];
    const text = language === "ja" ? "昨日は友達と映画を見ました" : "Ayer fui al cine con mis amigos";
    const ledger = ledgerWith(language, [[text, "mastered"], [`${text} 2`, "learned"]]);
    const only = stageParts({ stage, language, ledger, phrases: { [ledgerKey(text)]: { node: a, at: T0 } }, pronunciation: { points: 0, tries: 0 } });
    const both = stageParts({
      stage,
      language,
      ledger,
      phrases: { [ledgerKey(text)]: { node: a, at: T0, also: [b] }, [ledgerKey(`${text} 2`)]: { node: b, at: T0 } },
      pronunciation: { points: 0, tries: 0 },
    });
    const grammar = (p: ReturnType<typeof stageParts>) => p.parts.find((row) => row.id === "grammar")!.done;
    assert.equal(grammar(only), 0.5, language);
    // a: 표현 하나(½) + b: 주 칸 하나 + 함께 걸친 것 하나(1)
    assert.equal(grammar(both), 1.5, language);
  }
});

test("요소 태그: 최근 자주 짚인 갈래를 '다음 단계까지'로, 옛 카드는 칸으로 짐작, 오타·2주 지난 것은 빼고", () => {
  const now = T0;
  const card = (over: Partial<FixCard>): FixCard => ({ id: `fx${Math.random().toString(36).slice(2, 12)}`, wrong: "a", right: "b", note: "", node: null, where: "chat", at: now, ...over });
  const cards = [
    card({ wrong: "x1", parts: ["vocab", "grammar"] }),
    card({ wrong: "x2", node: "d-word" }),
    card({ wrong: "x3", parts: ["vocab"] }),
    card({ wrong: "x3", parts: ["vocab"] }), // 같은 줄은 한 번
    card({ wrong: "x4", parts: ["vocab"], kind: "typo" }),
    card({ wrong: "x5", parts: ["vocab"], at: now - 15 * 24 * 60 * 60 * 1000 }),
    card({ wrong: "x6", node: "i-set" }),
  ];
  const counts = recentMistakes(cards, now);
  assert.deepEqual(counts, { vocab: 3, grammar: 1, expression: 1, pronunciation: 0 });
  assert.deepEqual(partsOfCard({ node: "g1-past" }), ["grammar"]);

  const stage = ladderFor("es")!.stages[0]!;
  const ledger = ledgerWith("es", Array.from({ length: 20 }, (_, i): [string, LedgerState] => [`palabra${i}`, "mastered"]));
  const plain = stageParts({ stage, language: "es", ledger, phrases: {}, pronunciation: { points: 0, tries: 0 } });
  assert.equal(plain.weakest, "grammar"); // 0%가 가장 모자람
  const steered = stageParts({ stage, language: "es", ledger, phrases: {}, pronunciation: { points: 0, tries: 0 }, mistakes: counts });
  assert.equal(steered.weakest, "vocab"); // 70% 아래이고 3번 짚임
  const few = stageParts({ stage, language: "es", ledger, phrases: {}, pronunciation: { points: 0, tries: 0 }, mistakes: { vocab: 2 } });
  assert.equal(few.weakest, "grammar");
});
