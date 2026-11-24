import { test } from "node:test";
import assert from "node:assert/strict";
import { askRung, DONE, kindCounts, kindShares, missRates, rungOf, stepLadder, recentRuns, stepReach, REACH_BATCH, gaugeWordScale, axisOf, type Reach } from "./ladder.ts";
import { grammarAsk, pickCells, preparedLessonQuiz, spotQuestion } from "./ladderQuiz.ts";
import { formChoice } from "./quiz.ts";
import { blankNeedsMeaning, meaningFirst, type PreparedItem } from "./preparedQuiz.ts";
import type { SpotItem } from "./spotErrors.ts";

test("사다리: 고르기 → 빈칸 → 틀린 곳, 맞으면 다음 칸·틀리면 그 칸, 3칸 맞히면 끝, 옛 5(끝)는 끝", () => {
  let ladder = {};
  ladder = stepLadder(ladder, "g|1:0", 1, true);
  assert.equal(rungOf(ladder, "g|1:0"), 2);
  ladder = stepLadder(ladder, "g|1:0", 2, false);
  assert.equal(rungOf(ladder, "g|1:0"), 2);
  assert.equal(askRung(3, (rung) => rung !== 3), null);
  ladder = stepLadder(ladder, "g|1:0", 3, true);
  assert.equal(rungOf(ladder, "g|1:0"), DONE);
  assert.equal(askRung(DONE, () => true), null);
  assert.equal(rungOf({ "g|1:1": 5 }, "g|1:1"), DONE);
});

test("유형 먼저: 축 = 안 끝난 칸의 가장 낮은 사다리 칸, 다 끝나면 없음", () => {
  assert.equal(axisOf(["g|1:0", "g|2:0"], { "g|1:0": 2 }), 1);
  assert.equal(axisOf(["g|1:0", "g|2:0"], { "g|1:0": 2, "g|2:0": 3 }), 2);
  assert.equal(axisOf(["g|1:0"], { "g|1:0": DONE }), null);
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

test("사다리 문제: 문법 1 고르기 · 2 빈칸(뜻 먼저) · 3 틀린 곳(앞 줄, 없으면 끝) — ko·ja", () => {
  const item: PreparedItem = { key: "g|1:1", kind: "grammar", stage: 1, gloss: "나는 학생이에요.", before: "私は学生", after: "。", answer: "です", options: ["です", "ます", "だ"], line: "私は学生です。", why: "명사 뒤" };
  const spot: SpotItem = { id: "ja-s-1", stage: 1, shape: "l", src: "new", lead: "自己紹介をします。", lines: ["私は学生ます。"], errors: [{ line: 0, at: 2, wrong: "ます", right: "です", type: "form", kind: "form", g: "g|1:1", why: { en: "x", ko: "x" } }], gloss: { en: "I am a student.", ko: "나는 학생이에요." } };
  assert.equal(grammarAsk(item, 1, null, "ja")?.question.kind, "choose");
  const two = grammarAsk(item, 2, null, "ja")?.question;
  assert.ok(two?.kind === "type" && two.glossFirst && two.near?.includes("ます"));
  assert.equal(grammarAsk(item, 3, null, "ja"), null, "틀린 곳 문항이 없으면 낼 칸 없음");
  const three = grammarAsk(item, 3, spot, "ja");
  assert.equal(three?.rung, 3);
  if (three?.question.kind === "spot") {
    assert.equal(three.question.lead, "自己紹介をします。");
    assert.equal(three.question.right, "私は学生です。");
  }
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

test("게이지: 내리면 글자 수 도움·선지(밑줄), 올리면 도움 없음·표시 없음", async () => {
  const { gaugeCue, gaugeNumbered } = await import("./ladder.ts");
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
  assert.equal(meaningFirst(2), true);
  assert.equal(meaningFirst(3, { needsMeaning: true }), true);
  assert.equal(meaningFirst(3, {}), false);
  const es: PreparedItem = { key: "g|3:2", kind: "grammar", stage: 3, gloss: "x", before: "¿", after: " ayudarme?", answer: "Podrías", options: ["Podrías", "Podríais", "Puedo"], line: "¿Podrías ayudarme?", why: "x", needsMeaning: true };
  const esQ = grammarAsk(es, 1, null, "es", { stage: 5 })?.question;
  assert.ok(esQ?.kind === "choose" && !esQ.prepared?.meaningLater);
});

test("빈칸이 내용 낱말까지 덮으면 단계와 상관없이 해석 먼저 — en·es(라틴)·ja(띄어쓰기 없음)·ko", () => {
  const need = (answer: string, options: string[], language: string) => blankNeedsMeaning({ answer, options }, language);
  assert.equal(need("so loud that", ["such loud that", "so loud that", "so loudly that", "such a loud that"], "en"), true);
  assert.equal(need("If it rains", ["If it will rain", "If it rained", "If it rains", "If it rain"], "en"), true);
  assert.equal(need("which", ["who", "where", "which", "whose"], "en"), false, "보기마다 다른 낱말이면 빈칸만으로 떠올림");
  assert.equal(need("because", ["so", "because", "but"], "en"), false);
  assert.equal(need("Llovía", ["Llueve", "Llovía", "Ha llovido", "Llovió"], "es"), true);
  assert.equal(need("Lo", ["Le", "Los", "La", "Lo"], "es"), false);
  assert.equal(need("です", ["です", "ます", "だ"], "ja"), false);
  assert.equal(need("食べたい", ["食べたい", "食べます", "食べた"], "ja"), true);
  assert.equal(need("가", ["가", "가요", "가세요"], "ko"), true);
  const item: PreparedItem = { key: "g|3:7", kind: "grammar", stage: 3, gloss: "음악이 너무 시끄러워서 나는 귀를 막아야 했다.", before: "The music was ", after: " I had to cover my ears.", answer: "so loud that", options: ["such loud that", "so loud that", "so loudly that", "such a loud that"], line: "The music was so loud that I had to cover my ears.", why: "x" };
  const blank = grammarAsk(item, 2, null, "en", { stage: 4 })?.question;
  assert.ok(blank?.kind === "type" && blank.glossFirst);
  const choose = grammarAsk(item, 1, null, "en", { stage: 4 })?.question;
  assert.ok(choose?.kind === "choose" && choose.prepared?.meaningLater, "고르기는 보기가 알려 주니 그대로 답한 뒤에");
});

test("종류 비율: 요즘 연달아 다 맞힌 문법은 잠깐 줄고, 틀리거나 이틀 지나면 원래대로", () => {
  const now = 1_800_000_000;
  const g = (i: number, r: "ok" | "miss", ago = 60) => ({ k: `g|1:${i}`, src: "quiz", r, t: now - ago - i });
  const runs = recentRuns([...Array.from({ length: 6 }, (_, i) => g(i, "ok"))], now);
  assert.equal(runs.g, 6);
  const plain = kindShares(1, { w: null, g: null, e: null });
  const cut = kindShares(1, { w: null, g: null, e: null }, runs);
  assert.ok(cut.g < plain.g, `${cut.g} < ${plain.g}`);
  // 마지막 답이 틀림이면 연달아 맞음 0.
  assert.equal(recentRuns([g(0, "ok", 120), g(1, "miss", 30)].sort((a, b) => a.t - b.t), now).g, 0);
  // 이틀 넘은 답은 안 셈.
  assert.equal(recentRuns(Array.from({ length: 6 }, (_, i) => g(i, "ok", 3 * 86400)), now).g, 0);
});

test("닿은 단계: 여덟 답 중 80% 이상 맞으면 한 단계 위, 40% 이하면 아래(첫 측정 단계 밑으론 안 감)", () => {
  let reach: Reach = { s: 1, n: 0, ok: 0 };
  for (let i = 0; i < REACH_BATCH; i += 1) reach = stepReach(reach, 1, 1, i !== 0);
  assert.equal(reach.s, 2);
  for (let i = 0; i < REACH_BATCH; i += 1) reach = stepReach(reach, 1, 2, i < 2);
  assert.equal(reach.s, 1);
  // 첫 측정이 2단계면 1로 안 내려감, 아래 단계 칸 답은 안 셈.
  let two: Reach = { s: 2, n: 0, ok: 0 };
  for (let i = 0; i < REACH_BATCH; i += 1) two = stepReach(two, 2, 2, false);
  assert.equal(two.s, 2);
  assert.deepEqual(stepReach({ s: 3, n: 0, ok: 0 }, 1, 1, true), { s: 3, n: 0, ok: 0 });
});

test("게이지 낱말 배수", () => {
  assert.equal(gaugeWordScale(2) > 1 && gaugeWordScale(-2) < 1 && gaugeWordScale(0) === 1, true);
});

test("climbCleared: 지금 단계 칸이 다 끝나면 위로, 남은 칸이 있으면 그대로", async () => {
  const { climbCleared, REACH_TOP } = await import("./ladder.ts");
  const openAt = new Set([2, 5]);
  assert.deepEqual(climbCleared({ s: 1, n: 3, ok: 3 }, 1, (s) => openAt.has(s)), { s: 2, n: 0, ok: 0 });
  assert.deepEqual(climbCleared({ s: 2, n: 3, ok: 3 }, 1, (s) => openAt.has(s)), { s: 2, n: 3, ok: 3 });
  assert.deepEqual(climbCleared({ s: 3, n: 0, ok: 0 }, 1, (s) => openAt.has(s)), { s: 5, n: 0, ok: 0 });
  assert.equal(climbCleared({ s: 4, n: 0, ok: 0 }, 1, () => false).s, REACH_TOP);
});

test("nextRound: 다 끝났고 새 문장이 있는 칸만 다시, 하나라도 남았으면 그대로", async () => {
  const { nextRound, noteRoundUsed, DONE } = await import("./ladder.ts");
  const round = noteRoundUsed({ r: 1, used: {} }, "g|1:0", ["He is my brother."]);
  assert.deepEqual(round.used["g|1:0"], ["He is my brother."]);
  assert.equal(nextRound(["g|1:0", "g|1:1"], { "g|1:0": DONE, "g|1:1": 3 }, round, () => true), null);
  const next = nextRound(["g|1:0", "g|1:1"], { "g|1:0": DONE, "g|1:1": DONE }, round, (key) => key === "g|1:1");
  assert.ok(next);
  assert.deepEqual(next.reopened, ["g|1:1"]);
  assert.equal(next.round.r, 2);
  assert.equal(next.ladder["g|1:1"], undefined);
  assert.equal(next.ladder["g|1:0"], DONE);
  assert.equal(nextRound(["g|1:0"], { "g|1:0": DONE }, round, () => false), null);
});

test("소재 수업 퀴즈도 Quizbank 재료로: 고르기(까닭) · 틀린 곳(까닭) · 다른 문장 빈칸만 — ja·es", () => {
  const item: PreparedItem = { key: "g|1:1", kind: "grammar", stage: 1, gloss: "나는 학생이에요.", before: "私は学生", after: "。", answer: "です", options: ["です", "ます", "だ"], line: "私は学生です。", why: "명사 뒤" };
  const other: PreparedItem = { ...item, before: "これは本", line: "これは本です。", gloss: "이것은 책이에요." };
  const spot: SpotItem = { id: "ja-s-1", stage: 1, shape: "s", src: "new", lines: ["私は学生ます。"], errors: [{ line: 0, at: 2, wrong: "ます", right: "です", type: "form", kind: "form", g: "g|1:1", why: { en: "after a noun", ko: "명사 뒤" } }], gloss: { en: "I am a student.", ko: "나는 학생이에요." } };
  const all = preparedLessonQuiz(item, spot, "ja", 1, other);
  assert.deepEqual(all.map((q) => q.kind), ["choose", "spot", "type"]);
  assert.ok(all[0]!.kind === "choose" && all[0]!.prepared?.why === "명사 뒤");
  assert.ok(all[1]!.kind === "spot" && all[1]!.why?.ko === "명사 뒤");
  assert.ok(all[2]!.kind === "type" && all[2]!.text === "これは本です。" && all[2]!.glossFirst, "빈칸은 고르기와 다른 문장, 1단계는 해석 먼저");
  // 다른 문장이 없으면 빈칸을 내지 않음(방금 고른 보기 베끼기).
  assert.deepEqual(preparedLessonQuiz(item, null, "ja", 1, item).map((q) => q.kind), ["choose"]);
  const es: PreparedItem = { key: "g|3:2", kind: "grammar", stage: 3, gloss: "어제 비가 왔어요.", before: "Ayer ", after: " mucho.", answer: "llovió", options: ["llovió", "llovía", "llueve"], line: "Ayer llovió mucho.", why: "끝난 일" };
  const choose = preparedLessonQuiz(es, null, "es", 3)[0];
  assert.ok(choose?.kind === "choose" && choose.prepared?.meaningLater, "3단계는 해석을 답한 뒤에(Quizbank와 같은 규칙)");
});

test("고르기의 다른 모양: 문맥(앞 줄)·대답 고르기·틀린 문장을 차례로 — es·ja", async () => {
  const { choiceQuestion } = await import("./ladderQuiz.ts");
  const item: PreparedItem = { key: "g|3:1", kind: "grammar", stage: 3, gloss: "x", before: "Ayer ", after: " paella.", answer: "comí", options: ["comí", "como", "comía"], line: "Ayer comí paella.", why: "w" };
  const choices = [
    { v: "c" as const, lead: "¿Qué hiciste anoche?", line: "Anoche cené en casa.", before: "Anoche ", after: " en casa.", answer: "cené", options: ["cené", "ceno", "cenaré"], gloss: "어젯밤 집에서 저녁을 먹었어.", why: "anoche → 끝난 과거" },
    { v: "m" as const, them: "昨日、映画を見ましたか。", themGloss: "어제 영화 봤어요?", right: "いいえ、見ませんでした。", wrong: "いいえ、見ません。", why: "昨日 → 過去" },
    { v: "x" as const, wrong: "Ayer yo como paella.", rights: ["Ayer comí paella.", "Hoy como paella.", "Mañana comeré paella."], why: "ayer → comí" },
  ];
  assert.equal(grammarAsk(item, 1, null, "es", { choices, turn: 0 })?.question.kind, "choose");
  const lead = grammarAsk(item, 1, null, "es", { choices, turn: 1 })?.question;
  assert.ok(lead?.kind === "choose" && lead.lead === "¿Qué hiciste anoche?" && lead.options.includes("cené"));
  const pair = grammarAsk(item, 1, null, "es", { choices, turn: 2 })?.question;
  assert.ok(pair?.kind === "reply" && pair.shown && pair.them === "昨日、映画を見ましたか。" && pair.options.length === 2 && pair.options[pair.answer] === "いいえ、見ませんでした。" && pair.why === "昨日 → 過去");
  const odd = choiceQuestion(choices[2]!, "g|3:1", "s");
  assert.ok(odd?.kind === "pick" && odd.lines.length === 4 && odd.lines[odd.answer] === "Ayer yo como paella.");
});
