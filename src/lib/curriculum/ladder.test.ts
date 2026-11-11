import { test } from "node:test";
import assert from "node:assert/strict";
import { askRung, DONE, kindCounts, kindShares, missRates, rungOf, stepLadder } from "./ladder.ts";
import { grammarAsk, spotQuestion } from "./ladderQuiz.ts";
import type { PreparedItem } from "./preparedQuiz.ts";
import type { SpotItem } from "./spotErrors.ts";

test("사다리: 맞으면 다음 칸, 틀리면 그 칸, 3칸은 틀린 곳 문항이 있을 때만, 4칸 맞히면 끝", () => {
  let ladder = {};
  ladder = stepLadder(ladder, "g|1:0", 1, true);
  assert.equal(rungOf(ladder, "g|1:0"), 2);
  ladder = stepLadder(ladder, "g|1:0", 2, false);
  assert.equal(rungOf(ladder, "g|1:0"), 2);
  assert.equal(askRung(3, (rung) => rung !== 3), 4);
  ladder = stepLadder(ladder, "g|1:0", 4, true);
  assert.equal(rungOf(ladder, "g|1:0"), DONE);
  assert.equal(askRung(DONE, () => true), null);
});

test("종류 비율: 출발값(1~2단계 단어 많이), 틀린 비율이 높은 종류로 옮김, 15~60, 묶음 일곱에 종류마다 하나 이상", () => {
  const none = { w: null, g: null, e: null };
  const low = kindShares(1, none);
  const mid = kindShares(3, none);
  assert.ok(low.w > mid.w && Math.round(mid.w) === 40);
  const weakGrammar = kindShares(3, { w: 0.1, g: 0.5, e: 0.2 });
  assert.ok(weakGrammar.g > mid.g && weakGrammar.w < mid.w);
  const counts = kindCounts(7, weakGrammar);
  assert.equal(counts.w + counts.g + counts.e, 7);
  assert.ok(counts.g >= counts.e && counts.e >= 1);
  const now = 100 * 86400;
  const events = [
    ...Array.from({ length: 6 }, (_, i) => ({ k: `g|1:${i}`, src: "quiz", r: i < 3 ? "miss" : "ok", t: now - 3600 })),
    ...Array.from({ length: 4 }, (_, i) => ({ k: `w|a${i}`, src: "quiz", r: "ok", t: now - 3600 })),
    { k: "g|1:9", src: "quiz", r: "miss", t: now - 20 * 86400 },
  ];
  const rates = missRates(events, now);
  assert.equal(rates.g, 0.5);
  assert.equal(rates.w, null);
});

test("사다리 문제: 문법 1 고르기 · 2 빈칸(뜻 먼저) · 3 틀린 곳(앞 줄) · 4 문장 전체 — ko·ja", () => {
  const item: PreparedItem = { key: "g|1:1", kind: "grammar", stage: 1, gloss: "나는 학생이에요.", before: "私は学生", after: "。", answer: "です", options: ["です", "ます", "だ"], line: "私は学生です。", why: "명사 뒤" };
  const spot: SpotItem = { id: "ja-s-1", stage: 1, shape: "l", src: "new", lead: "自己紹介をします。", lines: ["私は学生ます。"], errors: [{ line: 0, at: 2, wrong: "ます", right: "です", type: "form", kind: "form", g: "g|1:1", why: { en: "x", ko: "x" } }], gloss: { en: "I am a student.", ko: "나는 학생이에요." } };
  assert.equal(grammarAsk(item, 1, null, "ja")?.question.kind, "choose");
  const two = grammarAsk(item, 2, null, "ja")?.question;
  assert.ok(two?.kind === "type" && two.glossFirst && two.near?.includes("ます"));
  assert.equal(grammarAsk(item, 3, null, "ja")?.rung, 4, "틀린 곳 문항이 없으면 4칸");
  const three = grammarAsk(item, 3, spot, "ja");
  assert.equal(three?.rung, 3);
  if (three?.question.kind === "spot") {
    assert.equal(three.question.lead, "自己紹介をします。");
    assert.equal(three.question.right, "私は学生です。");
  }
  const four = grammarAsk(item, 4, spot, "ja")?.question;
  assert.ok(four?.kind === "type" && four.whole && four.answer === "私は学生です。");
  const ko: SpotItem = { id: "ko-s-1", stage: 1, shape: "s", src: "new", lines: ["사과을 먹어요."], errors: [{ line: 0, at: 0, wrong: "사과을", right: "사과를", type: "form", kind: "particle", g: "g|1:4", why: { en: "x", ko: "x" } }], gloss: { en: "x", ko: "x" } };
  const q = spotQuestion(ko, "ko", "g|1:4");
  assert.ok(q?.kind === "spot" && q.right === "사과를 먹어요." && q.bad[0] === 0);
});

test("부족한 것: 최근 두 번 넘게 틀리고 마지막도 틀린 것만, 틀린 수 많은 차례로 셋 (es·th)", async () => {
  const { weakKeys } = await import("./ladder.ts");
  const now = 100 * 86400;
  const ev = (k: string, r: string, ago: number) => ({ k, src: "quiz", r, t: now - ago });
  const events = [
    ev("g|1:2", "miss", 50), ev("g|1:2", "miss", 40), ev("g|1:2", "miss", 30),
    ev("e|por favor", "miss", 50), ev("e|por favor", "miss", 40),
    ev("w|ใหญ่", "miss", 50), ev("w|ใหญ่", "miss", 40), ev("w|ใหญ่", "ok", 10),
    ev("g|2:0", "miss", 20 * 86400), ev("g|2:0", "miss", 20 * 86400 - 5),
  ];
  assert.deepEqual(weakKeys(events, now), ["g|1:2", "e|por favor"]);
});
