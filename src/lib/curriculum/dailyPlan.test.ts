import { test } from "node:test";
import assert from "node:assert/strict";
import { applyCheck, curriculumItems, daysToFinish, reviewKeysOf, todayPlan, DAY_MS, type ReviewMap } from "./dailyPlan.ts";
import { scriptsFor } from "./stageScripts.ts";

const NOW = Date.UTC(2026, 9, 28);

test("오늘 할 것: 커리큘럼 순서로 분량만큼, 처음 것은 넘쳐도 하나는", () => {
  const items = curriculumItems("en", 1);
  assert.equal(items[0]!.id, "en-1-1");
  assert.ok(items.some((item) => item.kind === "frame"));
  const plan = todayPlan({ language: "en", stage: 1, passed: new Set(), review: {}, pace: 10, order: "curriculum", now: NOW });
  assert.equal(plan[0]!.id, "en-1-1");
  assert.ok(plan.reduce((sum, item) => sum + item.minutes, 0) <= 10);
  const one = todayPlan({ language: "en", stage: 5, passed: new Set(), review: {}, pace: 1, order: "curriculum", now: NOW });
  assert.equal(one.length, 1);
  const skipped = todayPlan({ language: "en", stage: 1, passed: new Set(["en-1-1"]), review: {}, pace: 5, order: "curriculum", now: NOW });
  assert.notEqual(skipped[0]!.id, "en-1-1");
});

test("오늘 할 것: 내 기록에 맞춰면 오늘의 대본이 맨 앞, 날짜가 된 다시 볼 것은 그보다 앞", () => {
  const plan = todayPlan({ language: "ja", stage: 1, passed: new Set(), review: {}, pace: 10, order: "record", recommended: "ja-1-3", now: NOW });
  assert.equal(plan[0]!.id, "ja-1-3");
  const expression = scriptsFor("ja", 1)[1]!.expressions[0]!;
  const review: ReviewMap = { [`e|${expression}`]: { due: NOW - 1, step: 1, at: NOW - 2 * DAY_MS }, "f|ja-f1-02": { due: NOW + DAY_MS, step: 1, at: NOW } };
  const withReview = todayPlan({ language: "ja", stage: 1, passed: new Set(), review, pace: 10, order: "record", recommended: "ja-1-3", now: NOW });
  assert.equal(withReview[0]!.review, `e|${expression}`);
  assert.ok(!withReview.some((item) => item.review === "f|ja-f1-02"), "아직 날짜 안 된 것");
});

test("학습 끝 체크: 헷갈려요 2일 → 알아요 7일 → 알아요 끝, 처음부터 알아요면 아무것도 안 남김", () => {
  let review: ReviewMap = {};
  review = applyCheck(review, "e|x", true, NOW);
  assert.deepEqual(review, {});
  review = applyCheck(review, "e|x", false, NOW);
  assert.equal(review["e|x"]!.due, NOW + 2 * DAY_MS);
  review = applyCheck(review, "e|x", true, NOW + 2 * DAY_MS);
  assert.equal(review["e|x"]!.due, NOW + 9 * DAY_MS);
  review = applyCheck(review, "e|x", true, NOW + 9 * DAY_MS);
  assert.equal(review["e|x"], undefined);
});

test("n일 완성: 분량이 클수록 짧고, 대본·문장구조 체크 열쇠", () => {
  const slow = daysToFinish("ko", 5);
  const fast = daysToFinish("ko", 20);
  assert.ok(slow > fast && fast > 0, `${slow} ${fast}`);
  const keys = reviewKeysOf("ko", "ko-1-1");
  assert.ok(keys.some((key) => key.startsWith("e|")));
  assert.deepEqual(reviewKeysOf("ko", "ko-f1-01"), ["f|ko-f1-01"]);
  assert.deepEqual(reviewKeysOf("ko", "없음"), []);
});

test("남은 일수: 통과한 만큼 줄고, 다시 볼 것 이름", async () => {
  const { daysLeft, reviewLabel } = await import("./dailyPlan.ts");
  const all = daysLeft("es", 10, new Set());
  const some = daysLeft("es", 10, new Set(curriculumItems("es", 1).slice(0, 10).map((item) => item.id)));
  assert.ok(all > some && some > 0, `${all} ${some}`);
  assert.equal(reviewLabel("th", "e|สวัสดี"), "สวัสดี");
  assert.ok(reviewLabel("ja", "f|ja-f1-02").length > 0);
});

test("오늘 배운 것: 문장구조·문법·단어 열쇠, 문법 다시 볼 것은 그 문법 대본으로", async () => {
  const { learnedFrom, isCurriculumKey, grammarKey } = await import("./dailyPlan.ts");
  const { allScriptsFor } = await import("./stageScripts.ts");
  const script = allScriptsFor("ja").find((s) => s.stage === 1 && (s.grammar ?? []).length)!;
  const learned = learnedFrom("ja", [script.id, "ja-f1-02"]);
  assert.ok(learned.frames.includes("f|ja-f1-02"));
  assert.ok(learned.grammar.includes(grammarKey(1, script.grammar![0]!)));
  assert.ok(learned.words.length > 0 && learned.words.every((key) => isCurriculumKey("ja", key)));
  assert.equal(isCurriculumKey("ja", "e|없는 표현"), false);
  assert.equal(isCurriculumKey("es", "g|9:9"), false);
  const review: ReviewMap = { [grammarKey(1, script.grammar![0]!)]: { due: NOW - 1, step: 1, at: NOW - DAY_MS } };
  const plan = todayPlan({ language: "ja", stage: 1, passed: new Set(), review, pace: 5, order: "curriculum", now: NOW });
  // 퀴즈를 만들 수 있으면 퀴즈, 틀리면 이어서 그 문법 대본.
  const first = plan[0]!;
  const practice = first.kind === "quiz" ? first.then!.id : first.id;
  assert.ok(allScriptsFor("ja").find((s) => s.id === practice)!.grammar!.includes(script.grammar![0]!));
});

test("직접 묻기: 답과 오늘 열쇠만 남김", async () => {
  const { parseAskAnswer, parseTopics } = await import("./ask.ts");
  const allowed = new Set(["f|th-f1-01", "e|ขอบคุณ"]);
  const parsed = parseAskAnswer('{"answer":"ใช้ ครับ/ค่ะ ท้ายประโยค","about":["e|ขอบคุณ","x|bad","e|ขอบคุณ"]}', allowed);
  assert.deepEqual(parsed?.about, ["e|ขอบคุณ"]);
  assert.equal(parseAskAnswer('{"answer":""}', allowed), null);
  const topics = parseTopics([{ key: "f|th-f1-01", label: " a  b " }, { key: "zz", label: "x" }, "no"], (key) => key.startsWith("f|"));
  assert.deepEqual(topics, [{ key: "f|th-f1-01", label: "a b" }]);
});

test("오늘 할 것: 약한 곳은 퀴즈로, 분량 절반까지, 틀린 틀 다시 연습도 고친 줄과 함께", () => {
  const review: ReviewMap = {
    "f|ja-f1-01": { due: NOW - 3, step: 1, at: NOW - 2 * DAY_MS },
    "f|ja-f1-02": { due: NOW - 2, step: 1, at: NOW - 2 * DAY_MS },
    "f|ja-f1-03": { due: NOW - 1, step: 1, at: NOW - 2 * DAY_MS },
    "f|ja-f1-04": { due: NOW - 1, step: 1, at: NOW - 2 * DAY_MS },
  };
  const plan = todayPlan({ language: "ja", stage: 1, passed: new Set(), review, pace: 10, order: "curriculum", now: NOW });
  const quizzes = plan.filter((item) => item.kind === "quiz");
  assert.equal(quizzes[0]!.id, "f|ja-f1-01");
  assert.equal(quizzes[0]!.review, "f|ja-f1-01");
  assert.equal(quizzes[0]!.then!.id, "ja-f1-01");
  assert.ok(quizzes.reduce((sum, item) => sum + item.minutes, 0) <= 5, "약한 곳은 절반까지");
  assert.ok(plan.some((item) => item.kind !== "quiz"), "새 것도 들어감");
  const card = { wrong: "わたしはキムだ。", right: "わたしはキムです。" };
  const redo = todayPlan({ language: "ja", stage: 1, passed: new Set(), review: {}, pace: 5, order: "curriculum", redo: [{ frame: "ja-f1-01", card }], now: NOW });
  assert.equal(redo[0]!.kind, "quiz");
  assert.deepEqual(redo[0]!.card, card);
  assert.equal(redo[0]!.review, undefined);
});

test("오늘 할 것 안의 채우기: 분량 5·10·20분에 1·2·4개 퀴즈 자리를 비워 두고 새 대본은 나머지로(스페인어·태국어)", async () => {
  const { todayPlan: plan, fillCount: count } = await import("./dailyPlan.ts");
  const { allScriptsFor } = await import("./stageScripts.ts");
  for (const language of ["es", "th"]) {
    const keys = allScriptsFor(language).filter((s) => s.stage === 1).flatMap((s) => s.expressions.map((e) => `e|${e}`)).slice(0, 6);
    for (const pace of [5, 10, 20]) {
      const items = plan({ language, stage: 1, passed: new Set(), review: {}, pace, order: "curriculum", fill: keys, now: Date.UTC(2026, 9, 29) });
      const quizzes = items.filter((item) => item.kind === "quiz");
      assert.equal(quizzes.length, Math.min(count(pace), keys.length), `${language} ${pace}`);
      assert.ok(items.some((item) => item.kind !== "quiz"), "새 대본도");
    }
    const none = plan({ language, stage: 1, passed: new Set(), review: {}, pace: 10, order: "curriculum", now: Date.UTC(2026, 9, 29) });
    assert.equal(none.filter((item) => item.kind === "quiz").length, 0);
  }
});
