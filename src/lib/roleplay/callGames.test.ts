import test from "node:test";
import assert from "node:assert/strict";
import { gameRules, learnerTurns, pickSecret, roundOverOf, TWENTY_THINGS } from "./callGames.ts";

test("스무고개 답: 이번 통화에서 낸 것은 다시 안 고름, 다 쓰면 처음부터", () => {
  const first = pickSecret([], () => 0);
  assert.equal(first, TWENTY_THINGS[0]);
  assert.notEqual(pickSecret([first], () => 0), first);
  assert.ok(TWENTY_THINGS.includes(pickSecret([...TWENTY_THINGS], () => 0.5)));
});

test("퀴즈 규칙: 첫 마디는 규칙 설명, 다섯 문제가 차면 점수, 고친 말이 있으면 그것부터", () => {
  const opening = gameRules({ game: "quiz", target: "Japanese", native: "Korean", count: 0, start: true, hasFixes: true });
  assert.match(opening, /first line/);
  assert.match(opening, /corrections from earlier calls first/);
  const mid = gameRules({ game: "quiz", target: "Spanish", native: "Arabic", count: 2 });
  assert.match(mid, /ask question 3/);
  assert.match(mid, /in Arabic/);
  assert.match(gameRules({ game: "quiz", target: "English", native: "Korean", count: 5 }), /round is over/);
});

test("스무고개 규칙: 답을 알려 주되 말하지 말라고, 판이 끝나면 round over", () => {
  const rules = gameRules({ game: "twenty", target: "Spanish", native: "Arabic", count: 3, secret: "a bicycle" });
  assert.match(rules, /a bicycle/);
  assert.match(rules, /never before/);
  assert.match(rules, /"round" to "over"/);
  assert.match(rules, /asked 3 questions/);
  assert.match(rules, /17 are left/);
  // 베낄 수 있는 예문(따옴표 안 학습 언어 문장)을 넣지 않는다.
  assert.doesNotMatch(rules, /"Is it/);
});

test("판 끝 읽기·학습자 차례 세기", () => {
  assert.equal(roundOverOf({ round: "over" }, "twenty"), true);
  assert.equal(roundOverOf({ round: "over" }, "quiz"), false);
  assert.equal(roundOverOf({ round: "" }, "twenty"), false);
  assert.equal(learnerTurns([{ who: "tutor", text: "¿Es un animal?" }, { who: "learner", text: "…" }, { who: "learner", text: "¿Es grande?" }, { who: "learner", text: "大きいですか" }]), 2);
});
