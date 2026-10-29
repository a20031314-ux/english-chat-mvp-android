import { test } from "node:test";
import assert from "node:assert/strict";
import { nextStudy, recordQuiz, QUIZ_REST_MS, type QuizLog } from "./nextStudy.ts";
import { allScriptsFor } from "./stageScripts.ts";
import { reviewKeysOf } from "./dailyPlan.ts";

const NOW = Date.UTC(2026, 9, 29, 9);

for (const language of ["es", "ja"]) {
  const stageOne = allScriptsFor(language).filter((script) => script.stage === 1);
  const firstKeys = reviewKeysOf(language, stageOne[0]!.id);

  test(`${language}: 아무 기록 없어도 늘 낼 것이 있다(곧 나올 것)`, () => {
    const picks = nextStudy({ language, stage: 1, passed: new Set(), review: {}, log: {}, weakest: null, now: NOW });
    assert.ok(picks.length > 0);
    assert.ok(picks.every((pick) => pick.reason === "new"));
  });

  test(`${language}: 순서 = 다시 볼 것 → 틀렸던 것 → 가장 모자란 갈래 → 곧 나올 것 → 다지기`, () => {
    const [due, missed] = firstKeys;
    const log: QuizLog = recordQuiz({}, missed!, false, NOW - 1000);
    const picks = nextStudy({
      language,
      stage: 1,
      passed: new Set([stageOne[0]!.id]),
      review: { [due!]: { due: NOW - 1, step: 1, at: NOW - 3 * 86400000 } },
      log,
      weakest: "grammar",
      now: NOW,
    });
    const reasons = picks.map((pick) => pick.reason);
    assert.equal(picks[0]!.key, due);
    assert.equal(picks[0]!.reason, "again");
    assert.equal(picks[1]!.key, missed);
    assert.equal(picks[1]!.reason, "missed");
    const rank = { again: 0, missed: 1, weak: 2, new: 3, keep: 4 };
    assert.deepEqual([...reasons].sort((a, b) => rank[a] - rank[b]), reasons, "갈래 순서가 섞이지 않음");
    assert.ok(new Set(picks.map((pick) => pick.key)).size === picks.length, "같은 열쇠 두 번 없음");
    for (const pick of picks.filter((one) => one.reason === "weak")) assert.ok(pick.key.startsWith("g|1:"), pick.key);
  });

  test(`${language}: 사흘 안에 맞힌 것·이번에 낸 것은 빼고, 사흘 지나면 다시`, () => {
    const key = firstKeys[0]!;
    const right = recordQuiz({}, key, true, NOW - 1000);
    const base = { language, stage: 1, passed: new Set<string>(), review: {}, weakest: null, now: NOW };
    assert.ok(!nextStudy({ ...base, log: right }).some((pick) => pick.key === key));
    assert.ok(nextStudy({ ...base, log: recordQuiz({}, key, true, NOW - QUIZ_REST_MS - 1) }).some((pick) => pick.key === key));
    assert.ok(!nextStudy({ ...base, log: {}, skip: new Set([key]) }).some((pick) => pick.key === key));
  });

  test(`${language}: 표현이 모자라면 숙지 안 된 핵심 표현부터`, () => {
    const expressions = stageOne.flatMap((script) => script.expressions).slice(0, 3);
    const picks = nextStudy({
      language,
      stage: 1,
      passed: new Set(),
      review: {},
      log: {},
      weakest: "expression",
      expressions: [{ text: expressions[0]!, state: "mastered" }, { text: expressions[1]!, state: "learned" }],
      now: NOW,
    });
    const weak = picks.filter((pick) => pick.reason === "weak");
    assert.ok(weak.length > 0);
    assert.notEqual(weak[0]!.key, `e|${expressions[0]}`, "숙지한 표현은 앞에 오지 않음");
  });
}

test("기록은 400개까지, 오래된 것부터 버림", () => {
  let log: QuizLog = {};
  for (let i = 0; i < 405; i += 1) log = recordQuiz(log, `e|w${i}`, i % 2 === 0, NOW + i);
  assert.equal(Object.keys(log).length, 400);
  assert.ok(!log["e|w0"] && log["e|w404"]);
});

test("계속 공부 갈래 고르기: 그 갈래 열쇠만, 지금 단계 것이 떨어져도 뒤 단계까지(태국어·이탈리아어)", async () => {
  const { nextStudy, keyPart } = await import("./nextStudy.ts");
  for (const language of ["th", "it"]) {
    for (const focus of ["vocab", "grammar", "expression"] as const) {
      const picks = nextStudy({ language, stage: 1, passed: new Set(), review: {}, log: {}, weakest: null, focus, now: 0 });
      assert.ok(picks.length > 0, `${language} ${focus}`);
      assert.ok(picks.every((pick) => keyPart(language, pick.key) === focus), `${language} ${focus}`);
    }
    const sound = nextStudy({ language, stage: 1, passed: new Set(), review: {}, log: {}, weakest: null, focus: "pronunciation", now: 0 });
    assert.ok(sound.every((pick) => keyPart(language, pick.key) !== "grammar"), `${language} 발음`);
  }
});

for (const language of ["es", "ja"]) {
  const stageOne = allScriptsFor(language).filter((script) => script.stage === 1);
  const firstKeys = reviewKeysOf(language, stageOne[0]!.id);
  test(`${language}: 복습 줄과 새로 배우기 줄은 섞이지 않는다`, () => {
    const [due, missed] = firstKeys;
    const base = {
      language,
      stage: 1,
      passed: new Set([stageOne[0]!.id]),
      review: { [due!]: { due: NOW - 1, step: 1, at: NOW - 3 * 86400000 } },
      log: recordQuiz({}, missed!, false, NOW - 1000),
      weakest: "grammar" as const,
      now: NOW,
    };
    const review = nextStudy({ ...base, lane: "review", focus: "vocab" });
    assert.ok(review.length > 0);
    assert.ok(review.every((pick) => ["again", "confirm", "missed", "gap", "keep"].includes(pick.reason)), review.map((p) => p.reason).join());
    assert.equal(review[0]!.key, due);
    const learn = nextStudy({ ...base, lane: "learn" });
    assert.ok(learn.length > 0);
    assert.ok(learn.every((pick) => ["weak", "word", "new"].includes(pick.reason)), learn.map((p) => p.reason).join());
    // 아무것도 없으면 복습 줄은 비고, 새로 배우기는 늘 있다.
    assert.equal(nextStudy({ language, stage: 1, passed: new Set(), review: {}, log: {}, weakest: null, lane: "review", now: NOW }).length, 0);
    assert.ok(nextStudy({ language, stage: 1, passed: new Set(), review: {}, log: {}, weakest: null, lane: "learn", now: NOW }).length > 0);
  });
}

for (const language of ["es", "ja"]) {
  test(`${language}: 방금(30분 안) 푼 열쇠는 새로 배우기에서 뒤로 — 틀렸어도 다른 것 먼저`, () => {
    const first = nextStudy({ language, stage: 1, passed: new Set(), review: {}, log: {}, weakest: "expression", lane: "learn", now: NOW });
    assert.ok(first.length > 1);
    const key = first[0]!.key;
    // 맞힌 것(쉬는 중)이 아니라 방금 틀린 것도 — 새로 배우기 줄에서는 뒤로.
    const log: QuizLog = { [key]: { n: 1, right: 1, at: NOW - 60 * 1000, last: false } };
    const next = nextStudy({ language, stage: 1, passed: new Set(), review: {}, log, weakest: "expression", lane: "learn", now: NOW });
    assert.notEqual(next[0]!.key, key);
    // 30분이 지나면 다시 앞에 올 수 있음.
    const later = nextStudy({ language, stage: 1, passed: new Set(), review: {}, log, weakest: "expression", lane: "learn", now: NOW + 31 * 60 * 1000 });
    assert.equal(later[0]!.key, key);
  });
}

test("ja: 단계 근처 예문만 — 1단계 퀴즈에 4·5단계 문장이 없다", async () => {
  const { buildQuiz, quizSources } = await import("./quiz.ts");
  const key = "e|ありがとうございます";
  const stages = new Set(quizSources("ja", key).map((source) => source.stage));
  assert.ok([...stages].some((stage) => stage >= 3), "재료가 여러 단계에 걸침");
  const quiz = buildQuiz("ja", key, { stage: 1, seed: "s" });
  assert.ok(quiz);
  const texts = new Set(quizSources("ja", key).filter((source) => source.stage > 2).map((source) => source.text));
  for (const q of quiz!.questions) if ("text" in q) assert.ok(!texts.has(q.text), q.text);
});
