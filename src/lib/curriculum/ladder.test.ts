import { test } from "node:test";
import assert from "node:assert/strict";
import { askRung, DONE, kindCounts, kindShares, missRates, rungOf, stepLadder } from "./ladder.ts";
import { grammarAsk, pickCells, spotQuestion } from "./ladderQuiz.ts";
import { formChoice } from "./quiz.ts";
import { meaningFirst, type PreparedItem } from "./preparedQuiz.ts";
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

test("게이지: 내리면 낮은 칸·글자 수 도움·선지(밑줄), 올리면 위 칸·도움 없음·표시 없음", async () => {
  const { gaugeRung, gaugeCue, gaugeNumbered } = await import("./ladder.ts");
  assert.deepEqual([gaugeRung(4, -2), gaugeRung(4, -1), gaugeRung(1, 0), gaugeRung(1, 1), gaugeRung(1, 2), gaugeRung(DONE, 2)], [2, 3, 1, 2, 3, DONE]);
  assert.deepEqual([gaugeCue(-2), gaugeCue(0), gaugeCue(2)], ["len", undefined, "none"]);
  assert.deepEqual([gaugeNumbered(0), gaugeNumbered(1)], [true, false]);
  const { firstCue } = await import("./quiz.ts");
  assert.equal(firstCue("hablo", "len"), "h＿＿＿＿");
  assert.equal(firstCue("ทะเล", "none"), "");
});

test("문단: 단계별 빈도·하루 둘, 다 맞히면 위·둘 놓치면 아래 · 문단 문제(번호 P1, 틀린 곳 수 숨김 P4) (es·ja)", async () => {
  const { paraDue, stepPara, startParaLevel } = await import("./ladder.ts");
  const { paragraphQuestion } = await import("./ladderQuiz.ts");
  assert.deepEqual([startParaLevel(1), startParaLevel(3), startParaLevel(5)], [1, 2, 3]);
  const s = { lv: 2, day: "d", n: 0 };
  assert.equal(paraDue(1, 4, s, "d"), true);
  assert.equal(paraDue(1, 5, s, "d"), false);
  assert.equal(paraDue(5, 5, { ...s, n: 2 }, "d"), false);
  assert.equal(stepPara(s, "d", 2, 0).lv, 3);
  assert.equal(stepPara(s, "d", 2, 2).lv, 1);
  const es: SpotItem = { id: "es-p-1", stage: 1, shape: "P1", src: "new", lines: ["Hoy es lunes.", "Yo estoy profesor.", "Me gusta mi trabajo."], errors: [{ line: 1, at: 1, wrong: "estoy", right: "soy", type: "form", kind: "form", g: "g|1:0", why: { en: "x", ko: "x" } }], gloss: { en: "x", ko: "x" } };
  const q = paragraphQuestion(es, "es");
  assert.ok(q?.kind === "spots");
  if (q?.kind === "spots") {
    assert.equal(q.words[q.errors[0]!.bad[0]!], "estoy");
    assert.equal(q.right, "Hoy es lunes. Yo soy profesor. Me gusta mi trabajo.");
    assert.ok(q.picks?.includes(q.errors[0]!.bad[0]!) && q.picks.length === 5);
  }
  const ja: SpotItem = { id: "ja-p-1", stage: 4, shape: "P4", src: "new", lines: ["今日は雨です。", "傘を持って行きました。", "でも、駅で傘を忘れた。", "家に帰ると、母が笑いました。", "私も笑いました。", "楽しい一日でした。"], errors: [{ line: 0, at: 0, wrong: "今日", right: "昨日", type: "meaning", kind: "word", why: { en: "x", ko: "x" } }], gloss: { en: "x", ko: "x" } };
  const p4 = paragraphQuestion(ja, "ja");
  assert.ok(p4?.kind === "spots" && p4.hideCount && !p4.picks);
});

test("선지(밑줄): 틀린 곳이 선지 가운데 늘 같은 자리에 오지 않는다", () => {
  const cells = Array.from({ length: 40 }, (_, i) => `word${i}`);
  const seen = new Set<number>();
  for (let k = 0; k < 60; k += 1) {
    const picks = pickCells(cells, [20], [], `seed-${k}`);
    assert.equal(picks.length, 5);
    assert.ok(picks.includes(20));
    seen.add(picks.indexOf(20));
  }
  assert.equal(seen.size, 5);
});

test("formChoice: 한 말의 꼴이면 뜻 줄 먼저, 서로 다른 말이면 답한 뒤에(es·ja·en)", () => {
  assert.equal(formChoice(["Qué", "Cuándo", "Dónde", "Donde"], 2, "es"), false);
  assert.equal(formChoice(["Dónde", "Donde"], 0, "es"), true);
  assert.equal(formChoice(["could have", "can't have", "must have", "might have"], 2, "en"), true);
  assert.equal(formChoice(["For example,", "Therefore,", "By the way,", "In contrast,"], 2, "en"), false);
  assert.equal(formChoice(["飲みます", "飲みました", "飲むます"], 0, "ja"), true);
});

test("해석 먼저: 1~2단계는 늘, 3단계부터는 해석 없이 갈리는 문장만 (ja·es)", () => {
  const item: PreparedItem = { key: "g|3:1", kind: "grammar", stage: 3, gloss: "나는 학생이에요.", before: "私は学生", after: "。", answer: "です", options: ["です", "ます", "だ"], line: "私は学生です。", why: "명사 뒤" };
  const spot: SpotItem = { id: "ja-s-9", stage: 3, shape: "s", src: "new", lines: ["私は学生ます。"], errors: [{ line: 0, at: 2, wrong: "ます", right: "です", type: "form", kind: "form", g: "g|3:1", why: { en: "x", ko: "x" } }], gloss: { en: "I am a student.", ko: "나는 학생이에요." } };
  const low = grammarAsk(item, 1, null, "ja", { stage: 2 })?.question;
  assert.ok(low?.kind === "choose" && !low.prepared?.meaningLater);
  const high = grammarAsk(item, 1, null, "ja", { stage: 3 })?.question;
  assert.ok(high?.kind === "choose" && high.prepared?.meaningLater);
  const needs = grammarAsk({ ...item, needsMeaning: true }, 1, null, "ja", { stage: 4 })?.question;
  assert.ok(needs?.kind === "choose" && !needs.prepared?.meaningLater);
  const blank = grammarAsk(item, 2, null, "ja", { stage: 3 })?.question;
  assert.ok(blank?.kind === "type" && !blank.glossFirst);
  const spotHigh = grammarAsk(item, 3, spot, "ja", { stage: 3 })?.question;
  assert.ok(spotHigh?.kind === "spot" && spotHigh.glossAfter);
  const whole = grammarAsk(item, 4, null, "ja", { stage: 5 })?.question;
  assert.ok(whole?.kind === "type" && whole.glossFirst, "문장 만들기는 해석이 곧 문제");
  assert.equal(meaningFirst(2), true);
  assert.equal(meaningFirst(3, { needsMeaning: true }), true);
  assert.equal(meaningFirst(3, {}), false);
  const es: PreparedItem = { key: "g|3:2", kind: "grammar", stage: 3, gloss: "x", before: "¿", after: " ayudarme?", answer: "Podrías", options: ["Podrías", "Podríais", "Puedo"], line: "¿Podrías ayudarme?", why: "x", needsMeaning: true };
  const esQ = grammarAsk(es, 1, null, "es", { stage: 5 })?.question;
  assert.ok(esQ?.kind === "choose" && !esQ.prepared?.meaningLater);
});
