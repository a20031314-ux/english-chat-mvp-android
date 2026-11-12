import { test } from "node:test";
import assert from "node:assert/strict";
import { CHECKS, computeFill, fillCatalog, listenFill, meanKnow, missKindOf, talkFill, thetaForFill, type CallTurns, type FillEvent } from "./fill.ts";
import type { BankWord } from "./vocabBank.ts";
import { segmentWords } from "../wordSegments.ts";

const DAY = 86_400_000;
const NOW = Date.UTC(2026, 10, 2);

async function wordsOf(language: string): Promise<readonly BankWord[]> {
  const { loadBank } = await import("./vocabBank.ts");
  return loadBank(language);
}

test("어림 눈금: 채운 몫 ↔ θ가 서로 맞고, 구간 평균은 0~1", () => {
  for (const fill of [0.05, 0.1, 0.4, 0.67, 0.95]) assert.ok(Math.abs(meanKnow(thetaForFill(fill), 0, 1) - fill) < 0.002, String(fill));
  assert.ok(meanKnow(0.5, 0, 0.2) > 0.95 && meanKnow(0.5, 0.8, 1) < 0.05);
});

test("처음 체크는 글자부터만, 답이 없으면 어림을 칠하지 않음 — 시작 단계가 높아도 0 (es·ja)", async () => {
  assert.deepEqual([...CHECKS], ["letters"]);
  for (const language of ["es", "ja"]) {
    const catalog = fillCatalog(language, await wordsOf(language));
    const letters = computeFill({ catalog, check: "letters", stage: 1, events: [], calls: [], now: NOW });
    assert.equal(letters.startStage, 0);
    const four = computeFill({ catalog, check: null, stage: 4, events: [], calls: [], now: NOW });
    assert.equal(four.startStage, 4);
    for (const axis of ["vocabRead", "vocabUse", "sentRead", "sentUse"] as const) {
      assert.equal(four.axes[axis].fill, 0, `${language} ${axis}`);
      assert.deepEqual(four.axes[axis].stageN, [0, 0, 0, 0, 0]);
      assert.ok(!four.axes[axis].converged && four.axes[axis].high > 0.9, `${language} ${axis} 안 푼 단계는 위 끝에`);
    }
  }
});

test("단계 칸 = 실제로 푼 몫(2026-11-07 원인 1): 1단계 8개 다 맞혀도 96%가 아니고, 시작 단계와 상관없음 (es·ja)", async () => {
  for (const language of ["es", "ja"]) {
    const catalog = fillCatalog(language, await wordsOf(language));
    const first = [...catalog.vocab.values()].filter((item) => item.stage === 1 && item.key.startsWith("w|")).slice(0, 8);
    const events = (rightOf: (i: number) => boolean): FillEvent[] => first.map((item, i) => ({ at: NOW - 1000 + i, key: item.key, correct: rightOf(i), source: "quiz", use: false, choose: true }));
    const all = computeFill({ catalog, check: null, stage: 4, events: events(() => true), calls: [], now: NOW }).axes.vocabRead;
    const low = computeFill({ catalog, check: null, stage: 1, events: events(() => true), calls: [], now: NOW }).axes.vocabRead;
    assert.ok(all.stages[0]! > 0.7 && all.stages[0]! < 0.85, `${language} 8/8 → ${all.stages[0]}`);
    assert.equal(all.stages[0], low.stages[0], "시작 단계가 단계 칸을 바꾸지 않음");
    assert.deepEqual(all.stageN, [8, 0, 0, 0, 0]);
    assert.deepEqual(all.stages.slice(1), [0, 0, 0, 0]);
    // 반만 맞힘(고르기): 찍어 맞힐 몫을 덜어 절반보다 낮게, 그러나 0으로 무너지지 않음.
    const half = computeFill({ catalog, check: null, stage: 4, events: events((i) => i % 2 === 0), calls: [], now: NOW }).axes.vocabRead;
    assert.ok(half.stages[0]! > 0.2 && half.stages[0]! < 0.5, `${language} 4/8 → ${half.stages[0]}`);
    // 같은 열쇠를 여러 번 맞혀도 열쇠 하나.
    const again = computeFill({ catalog, check: null, stage: 1, events: [...events(() => true), ...events(() => true).map((one) => ({ ...one, at: one.at + 500 }))], calls: [], now: NOW }).axes.vocabRead;
    assert.deepEqual(again.stageN, [8, 0, 0, 0, 0]);
  }
});

/** 참 실력 trueFill인 사람이 고르기·쓰기로 n문제(경계 근처에서) — 정해진 씨앗. */
function simulate(catalogKeys: { key: string; d: number }[], trueFill: number, n: number, use: boolean, seed = 7): FillEvent[] {
  let s = seed;
  const rand = () => ((s = (s * 1103515245 + 12345) % 2147483648) / 2147483648);
  const theta = thetaForFill(trueFill);
  const out: FillEvent[] = [];
  for (let i = 0; i < n; i += 1) {
    const item = catalogKeys[Math.floor(rand() * catalogKeys.length)]!;
    const know = rand() < 1 / (1 + Math.exp((item.d - theta) / 0.08));
    const correct = use ? know : know || rand() < 1 / 3;
    out.push({ at: NOW - (n - i) * 60_000, key: item.key, correct, source: "quiz", use, choose: !use });
  }
  return out;
}

test("수렴: 시작 단계를 높게(4) 잘못 골라도 답이 쌓이면 참 실력(20%) 쪽으로, 범위가 좁아짐 — 활용은 답이 없으면 0", async () => {
  const catalog = fillCatalog("es", await wordsOf("es"));
  const near = [...catalog.vocab.values()].filter((item) => item.d < 0.5).map(({ key, d }) => ({ key, d }));
  const few = computeFill({ catalog, check: null, stage: 4, events: simulate(near, 0.2, 10, false), calls: [], now: NOW });
  const many = computeFill({ catalog, check: null, stage: 4, events: simulate(near, 0.2, 120, false), calls: [], now: NOW });
  // 시작 단계 어림을 칠하지 않으니 10문제 뒤에도 4단계(높은 어림)로 부풀지 않는다.
  assert.ok(few.axes.vocabRead.fill < 0.35, `10문제 뒤 ${few.axes.vocabRead.fill}`);
  assert.ok(Math.abs(many.axes.vocabRead.fill - 0.2) < 0.08, `120문제 뒤 ${many.axes.vocabRead.fill}`);
  assert.ok(many.axes.vocabRead.high - many.axes.vocabRead.low < few.axes.vocabRead.high - few.axes.vocabRead.low);
  // 활용 답이 없으니 활용은 0(어림을 칠하지 않음).
  assert.equal(many.axes.vocabUse.fill, 0);
});

test("실전 대화: 막힘없이 0.7 + 이끌어 감 0.3, 쉬운 단계만이면 60%가 상한", () => {
  const easy: CallTurns[] = [{ at: NOW, stage: 1, turns: 200, smooth: 200, snag: 0, stuck: 0, lead: 100, follow: 0, min: 0 }];
  const hard: CallTurns[] = [{ at: NOW, stage: 5, turns: 200, smooth: 200, snag: 0, stuck: 0, lead: 100, follow: 0, min: 0 }];
  const easyFill = talkFill(easy, 0, 0.2).fill;
  assert.ok(easyFill < 0.75 && easyFill > 0.6, String(easyFill));
  assert.ok(talkFill(hard, 0, 0.2).fill > 0.9);
  const shy = talkFill([{ at: NOW, stage: 3, turns: 60, smooth: 60, snag: 0, stuck: 0, lead: 0, follow: 0, min: 30, why: { slow: 2 } }], 0, 0.2);
  assert.equal(shy.cells.find((cell) => cell.id === "part:lead")?.state, "weak");
});

test("듣기: 단계 띠 평균 — 1단계만 다 알아들으면 20%", () => {
  const result = listenFill([{ at: NOW, stage: 1, turns: 40, smooth: 0, snag: 0, stuck: 0, asked: 40, heardYes: 40 }], 0, 0.2);
  assert.ok(Math.abs(result.stages[0]! - 1) < 1e-9);
  assert.ok(result.fill > 0.15 && result.fill < 0.21, String(result.fill));
  assert.ok(result.stages.slice(1).every((band) => band === 0), "어림이 0이면 빈 띠도 0");
  const estimated = listenFill([], 0.2, 0.2);
  assert.ok(estimated.stages.every((band) => Math.abs(band - 0.2) < 1e-9), estimated.stages.join());
});

test("틀린 꼴: 어순·빠짐·기능어·꼴·철자·다른 낱말(es·ja·th)", () => {
  const cut = (text: string, language: string) => segmentWords(text, language);
  assert.equal(missKindOf(cut("yo llamo Ana", "es"), cut("me llamo Ana", "es"), new Set(["yo", "me"])), "particle");
  assert.equal(missKindOf(cut("Ana llamo me", "es"), cut("me llamo Ana", "es")), "order");
  assert.equal(missKindOf(cut("me llama Ana", "es"), cut("me llamo Ana", "es")), "form");
  assert.equal(missKindOf(["recieve"], ["receive"]), "spell");
  assert.equal(missKindOf(["perro"], ["gato"]), "word");
  assert.equal(missKindOf(cut("水を飲みます", "ja").filter((one) => one !== "を"), cut("水を飲みます", "ja")), "missing");
  assert.equal(missKindOf(cut("ฉันกินข้าว", "th").reverse(), cut("ฉันกินข้าว", "th")), "order");
});

test("지금 기록 → 증거: Quizbank 고르기/쓰기·익힘 날(겹치면 하나)·수업·튜터 고침·채팅에서 스스로 씀(es·ja)", async () => {
  const { fillEvents } = await import("./fillInputs.ts");
  const day = "2026-11-2";
  const utc = Math.floor(Date.UTC(2026, 10, 2) / DAY);
  const events = fillEvents({
    language: "es",
    known: { "w|agua": { days: [utc, utc - 3], at: NOW }, "r|es-f1-03": { days: [utc], at: NOW } },
    quiz: { [day]: { n: 3, right: 2, okc: ["w|agua"], okt: ["w|casa"], wrong: ["f|es-f1-01"], wt: ["f|es-f1-01"], miss: { "f|es-f1-01": "form" } } },
    results: [{ kind: "recall", item: "recall", title: "t", right: 4, total: 5, said: [], at: NOW, day, key: "f|es-f1-02" }],
    items: [
      { at: NOW, kind: "fixed", text: "yo es estudiante", right: "yo soy estudiante", part: "grammar", stage: 1, where: "chat" },
      { at: NOW, kind: "mastered", text: "Gracias", part: "vocab", stage: 1, where: "call" },
      { at: NOW, kind: "learned", text: "perro", part: "vocab", stage: 1, where: "review" },
    ],
    checkups: [],
    segment: (text) => segmentWords(text, "es"),
  });
  const agua = events.filter((one) => one.key === "w|agua");
  assert.equal(agua.length, 2, "같은 날 익힘·고르기는 하나");
  assert.ok(events.some((one) => one.key === "w|casa" && one.use && one.correct));
  assert.ok(events.some((one) => one.key === "f|es-f1-01" && one.use && !one.correct && one.miss === "form"));
  assert.ok(events.some((one) => one.key === "f|es-f1-02" && one.source === "recall" && one.correct));
  assert.ok(events.some((one) => one.key === "f|es-f1-03" && one.use && one.source === "recall"), "꺼내 쓰기 r|는 문장 활용");
  assert.ok(events.some((one) => one.key === "w|soy" && one.source === "fix" && one.miss === "word"));
  assert.ok(events.some((one) => one.key === "w|gracias" && one.source === "free"));
  assert.ok(!events.some((one) => one.key === "w|perro"), "복습에서 배운 것은 스스로 씀이 아님");
});

test("같은 날 틀렸다가 맞힌 열쇠는 맞힘이 나중(ja)", async () => {
  const { fillEvents } = await import("./fillInputs.ts");
  const events = fillEvents({
    language: "ja",
    known: {},
    quiz: { "2026-11-2": { n: 2, right: 1, wrong: ["w|水"], okt: ["w|水"] } },
    results: [],
    items: [],
    checkups: [],
    segment: (text) => segmentWords(text, "ja"),
  }).filter((one) => one.key === "w|水").sort((a, b) => a.at - b.at);
  assert.equal(events.at(-1)?.correct, true);
});

test("첫 측정 근거(2026-11-07): 경계 b 아래 단계는 안 풀어도 채워지고(옅게), 측정 전 시각·글자부터면 안 씀 (es·ja)", async () => {
  for (const language of ["es", "ja"]) {
    const catalog = fillCatalog(language, await wordsOf(language));
    const now = NOW;
    const placed = { at: now - 1000, letters: false, b: 3000, grammar: 3, expression: 3 };
    const result = computeFill({ catalog, check: null, stage: 3, placed, events: [], calls: [], now });
    const read = result.axes.vocabRead;
    assert.ok(read.stages[0]! > 0.8 && read.stages[1]! > 0.7, `${language} ${read.stages}`);
    assert.ok(read.presumed?.[0] && read.presumed?.[1], language);
    assert.ok(read.fill > 0.4, `${language} 낱말 이해 ${read.fill}`);
    assert.ok(result.axes.sentRead.stages[0]! > 0.8 && result.axes.sentRead.stages[4] === 0, `${language} ${result.axes.sentRead.stages}`);
    const before = computeFill({ catalog, check: null, stage: 3, placed: { ...placed, at: now + 1000 }, events: [], calls: [], now });
    assert.equal(before.axes.vocabRead.fill, 0, "측정 전 시각에는 안 씀");
    const letters = computeFill({ catalog, check: null, stage: 1, placed: { ...placed, letters: true }, events: [], calls: [], now });
    assert.equal(letters.axes.vocabRead.fill, 0);
    // 푼 단계는 측정 몫 쪽으로 당김: 1단계 8개 중 4개만 맞혀도 측정 근거 없는 것보다 높음.
    const first = [...catalog.vocab.values()].filter((item) => item.stage === 1 && item.key.startsWith("w|")).slice(0, 8);
    const events: FillEvent[] = first.map((item, i) => ({ at: now - 500 + i, key: item.key, correct: i % 2 === 0, source: "quiz", use: false, choose: true }));
    const withPlaced = computeFill({ catalog, check: null, stage: 3, placed, events, calls: [], now }).axes.vocabRead.stages[0]!;
    const without = computeFill({ catalog, check: null, stage: 3, events, calls: [], now }).axes.vocabRead.stages[0]!;
    assert.ok(withPlaced > without, `${withPlaced} > ${without}`);
  }
});
