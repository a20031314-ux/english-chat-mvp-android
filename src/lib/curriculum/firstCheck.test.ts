import { test } from "node:test";
import assert from "node:assert/strict";
import {
  climbAnswer,
  climbNext,
  climbStart,
  estimateB,
  fakeSlots,
  letterQuestions,
  lettersWeak,
  meaningRanks,
  nextYnCard,
  seeded,
  startClimb,
  wordLevel,
  wordsAbout,
  YN_FAKE,
  YN_TOTAL,
  type YnAnswer,
  type YnCard,
} from "./firstCheck.ts";
import { loadBank, stageCuts } from "./vocabBank.ts";
import { knowChance } from "./vocabLevel.ts";
import { scriptFor } from "./scripts/index.ts";
import { readFileSync } from "node:fs";

const fakesOf = (language: string) => (JSON.parse(readFileSync(new URL(`./pseudowords/${language}.json`, import.meta.url), "utf8")) as { words: string[] }).words;

/** 참 경계 trueB인 사람이 24장을 다 넘김(가짜에 [앎] 확률 lie). */
async function runYn(language: string, trueB: number, lie: number, seed: string) {
  const words = await loadBank(language);
  const cuts = stageCuts(language);
  const fakes = fakesOf(language);
  const random = seeded(`${seed}|person`);
  const shown: YnCard[] = [];
  const answers: YnAnswer[] = [];
  for (let i = 0; i < YN_TOTAL; i += 1) {
    const card = nextYnCard({ words, cuts, fakes, answers, shown, seed });
    if (!card) break;
    shown.push(card);
    const yes = card.rank === null ? random() < lie : random() < knowChance({ b: trueB, n: 0 }, card.rank);
    answers.push({ rank: card.rank, yes });
  }
  return { words, cuts, shown, answers, b: estimateB(answers, words.length) };
}

test("예/아니오: 24장, 가짜 넷(처음 셋 밖), 같은 낱말 두 번 없음, 처음 다섯은 쉬운 구간부터 (ja·es)", async () => {
  for (const language of ["ja", "es"]) {
    const { shown } = await runYn(language, 800, 0, `${language}-a`);
    assert.equal(shown.length, YN_TOTAL, language);
    assert.equal(shown.filter((one) => one.rank === null).length, YN_FAKE, language);
    assert.ok(shown.slice(0, 3).every((one) => one.rank !== null), language);
    assert.equal(new Set(shown.map((one) => one.word)).size, shown.length, language);
    const firstFive = shown.filter((one) => one.rank !== null).slice(0, 5).map((one) => one.rank!);
    assert.deepEqual([...firstFive].sort((a, b) => a - b), firstFive, `${language} ${firstFive}`);
  }
  assert.ok(fakeSlots("x").every((at) => at >= 3 && at < YN_TOTAL));
});

test("예/아니오 어림: 참 경계 150·800·2,500을 대략 맞힘(여러 씨앗 가운데값이 두 배 안) (en·ja·th·ko)", async () => {
  for (const language of ["en", "ja", "th", "ko"]) {
    for (const trueB of [150, 800, 2500]) {
      const got: number[] = [];
      for (let s = 0; s < 9; s += 1) got.push((await runYn(language, trueB, 0.05, `${language}-${trueB}-${s}`)).b ?? 0);
      got.sort((a, b) => a - b);
      const mid = got[4]!;
      assert.ok(mid > trueB / 2 && mid < trueB * 2, `${language} 참 ${trueB} → ${got.join(",")}`);
    }
  }
});

test("가짜에 다 [앎]이면 예/아니오를 믿지 않음(null), 뜻 고르기만으로 1단계 끝 아래에서 시작", async () => {
  const { b, words, cuts } = await runYn("es", 3000, 1, "liar");
  assert.equal(b, null);
  const level = wordLevel(b, [], words.length, cuts);
  assert.ok(level.b < cuts[0]!, String(level.b));
  assert.equal(level.picked, true);
});

test("뜻 고르기: b 근처 다섯, 맞히면 b가 오르고 틀리면 내림", async () => {
  const words = await loadBank("en");
  const cuts = stageCuts("en");
  const ranks = meaningRanks(800, words, new Set());
  assert.equal(ranks.length, 5);
  assert.ok(ranks.every((rank) => rank > 300 && rank < 1200), ranks.join());
  const up = wordLevel(800, ranks.map((rank) => ({ rank, correct: true })), words.length, cuts);
  const down = wordLevel(800, ranks.map((rank) => ({ rank, correct: false })), words.length, cuts);
  assert.ok(up.b > 800 && down.b < 800, `${up.b} ${down.b}`);
  assert.equal(wordsAbout(37), 50);
  assert.equal(wordsAbout(812), 800);
  assert.equal(wordsAbout(2468), 2500);
});

test("표현·문법 오르기: 단계마다 셋 중 둘 맞혀야 넘음, 둘 틀리면 멈춤, 최대 18문제", () => {
  let climb = startClimb({ expression: true, grammar: true });
  const answer = (kind: "expression" | "grammar", ok: boolean) => {
    const next = climbNext(climb)!;
    assert.equal(next.kind, kind);
    climb = climbAnswer(climb, kind, ok);
  };
  answer("expression", true);
  answer("grammar", true);
  assert.equal(climb.lanes.expression.stage, 1, "한 문제 맞혀선 안 넘음");
  answer("expression", true); // 표현 1 넘음(둘)
  answer("grammar", false);
  assert.equal(climb.lanes.expression.stage, 2);
  answer("expression", false);
  answer("grammar", true); // 문법 1 넘음(셋 중 둘)
  answer("expression", true);
  answer("grammar", false);
  answer("expression", false); // 표현 2: 맞1 틀2 → 멈춤
  answer("grammar", false); // 문법 2: 틀2 → 멈춤
  assert.equal(climbNext(climb), null);
  assert.equal(climbStart(climb.lanes.expression), 2);
  assert.equal(climbStart(climb.lanes.grammar), 2);
  let all = startClimb({ expression: true, grammar: true });
  for (let i = 0; i < 40 && climbNext(all); i += 1) all = climbAnswer(all, climbNext(all)!.kind, true);
  assert.equal(climbStart(all.lanes.expression), 5);
  assert.equal(climbStart(all.lanes.grammar), 5);
  assert.ok(all.asked <= 18);
  const none = startClimb({ expression: false, grammar: true });
  assert.equal(climbNext(none)?.kind, "grammar");
  assert.equal(climbStart(none.lanes.expression), 1);
});

test("찍기만 하는 사람(넷 중 하나): 예전보다 단계가 덜 올라감 — 2단계 이상 시작 15% 아래", () => {
  const random = seeded("guess");
  let over = 0;
  const runs = 4000;
  for (let r = 0; r < runs; r += 1) {
    let climb = startClimb({ expression: false, grammar: true });
    for (let i = 0; i < 40 && climbNext(climb); i += 1) climb = climbAnswer(climb, "grammar", random() < 0.25);
    if (climbStart(climb.lanes.grammar) >= 2) over += 1;
  }
  assert.ok(over / runs < 0.2, String(over / runs));
});

test("글자: 여섯 문제, 정답이 보기에 있고 보기 넷이 다름, 넷 틀리면 글자부터 (ja·th·ar)", () => {
  for (const language of ["ja", "th", "ar"]) {
    const questions = letterQuestions(scriptFor(language)!, "s");
    assert.equal(questions.length, 6, language);
    for (const q of questions) {
      assert.ok(q.options.includes(q.answer), language);
      assert.equal(new Set(q.options).size, 4, language);
      const course = scriptFor(language)!;
      const sound = (char: string) => course.groups.flatMap((group) => group.items).find((item) => item.char === char)?.reading;
      assert.equal(new Set(q.options.map(sound)).size, 4, `${language} 같은 소리 보기 ${q.options}`);
    }
  }
  assert.equal(lettersWeak([true, true, false, false, false, true]), false);
  assert.equal(lettersWeak([false, false, false, false, true, true]), true);
});
