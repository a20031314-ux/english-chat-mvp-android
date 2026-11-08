import assert from "node:assert/strict";
import test from "node:test";
import { REVIEW_LINES, parseReview, reviewPrompt, type StuckTurn } from "./review.ts";

function turn(partial: Partial<StuckTurn> = {}): StuckTurn {
  return {
    asked: "Sure. What size — small or large?",
    heard: "um... the, the big one?",
    attempts: 2,
    hesitationMs: 5200,
    history: [
      { who: "tutor", text: "Hi there! What can I get you?" },
      { who: "learner", text: "Can I get a latte please" },
      { who: "tutor", text: "Sure. What size — small or large?" },
      { who: "learner", text: "um... the, the big one?" },
    ],
    ...partial,
  };
}

function prompt(partial: Partial<StuckTurn> = {}): string {
  return reviewPrompt({
    tutorRole: "barista",
    setting: "A café counter at lunchtime.",
    targetLanguage: "English",
    nativeLanguage: "Korean",
    turn: turn(partial),
  });
}

test("the review is given the turn as evidence, not just the words", () => {
  const written = prompt();
  assert.match(written, /They answered: "um\.\.\. the, the big one\?"/);
  assert.match(written, /try number 2/);
  assert.match(written, /about 5 seconds/);
  assert.match(written, /Sure\. What size — small or large\?/);
  assert.match(written, /in Korean/, "it is written in the language they think in");
  assert.match(written, /same level of politeness/, "not half formal and half not");
});

test("an ordinary pause is not reported as hesitation", () => {
  // Otherwise every review opens by telling someone they were slow when they
  // took a breath, which is inventing a struggle that was not there.
  const quick = prompt({ hesitationMs: 900, attempts: 1 });
  assert.doesNotMatch(quick, /seconds before starting/);
  assert.doesNotMatch(quick, /try number/);
});

test("silence is described as silence rather than as an empty answer", () => {
  const said = prompt({ heard: "" });
  assert.match(said, /said nothing the scene could use/);
  assert.doesNotMatch(said, /They answered: ""/);
});

test("only the last lines of a long conversation are read", () => {
  const long = Array.from({ length: 40 }, (_, index) => ({
    who: index % 2 === 0 ? ("tutor" as const) : ("learner" as const),
    text: `line ${index}`,
  }));
  const written = prompt({ history: long });
  assert.ok(written.includes("line 39"), "the turn in question is there");
  assert.ok(!written.includes("line 0:"), "the start of a long scene is not");
  assert.equal(
    written.split("\n").filter((line) => /^(barista|Them): line /.test(line)).length,
    REVIEW_LINES,
  );
});

test("a review without an explanation is no review", () => {
  // The line on its own is the "here is the right answer" card this was built
  // instead of, so it is not shown at all.
  assert.equal(parseReview('{"say": "Large, please.", "meaning": "라지로 주세요."}'), null);
  assert.equal(parseReview('{"why": "   "}'), null);
  assert.equal(parseReview("not json"), null);
  assert.equal(parseReview('"a string"'), null);
});

test("an explanation with no example still stands", () => {
  // Someone who understood the question and was merely slow needs telling that,
  // and there is no sentence to hand them.
  const review = parseReview('{"why": "질문은 알아들으셨어요. 답이 늦었을 뿐이에요.", "say": "", "meaning": ""}');
  assert.equal(review?.why, "질문은 알아들으셨어요. 답이 늦었을 뿐이에요.");
  assert.equal(review?.say, "");
});

test("a review is cut to what fits on a phone", () => {
  const long = parseReview(JSON.stringify({ why: "가".repeat(900), say: "나".repeat(400) }));
  assert.equal(long?.why.length, 600);
  assert.equal(long?.say.length, 200);
});

test("통화 중 힌트는 문장 대신 쓸 수 있는 표현 조각을 묻는다 — 끊긴 앞부분부터", () => {
  const live = prompt({ live: true, heard: "I want to 예약 a" });
  assert.match(live, /paused, waiting for their answer/);
  assert.match(live, /"I want to 예약 a"/);
  assert.match(live, /carry on from what they started/);
  assert.match(live, /Never a complete sentence/);
  assert.doesNotMatch(live, /"say"/);
  assert.match(live, /mixed in words from Korean/);
  assert.doesNotMatch(live, /already moved on/, "돌아보기 문구가 아니다");
  const silent = prompt({ live: true, heard: "" });
  assert.match(silent, /not managed to say anything yet/);
  assert.doesNotMatch(silent, /carry on from what they started/);
});

test("힌트 조각 읽기: 셋까지, 글자 없는 것은 버림 — 스페인어·일본어", () => {
  const es = parseReview(JSON.stringify({ why: "어제 뭐 했는지 물어요.", pieces: [{ text: "ayer trabajé", meaning: "어제 일했어요" }, { text: "en el hospital", meaning: "병원에서" }, { text: "", meaning: "x" }, { text: "después", meaning: "그 뒤에" }, { text: "y luego", meaning: "그리고 나서" }] }));
  assert.deepEqual(es?.pieces?.map((piece) => piece.text), ["ayer trabajé", "en el hospital", "después"]);
  assert.equal(es?.say, "");
  const ja = parseReview(JSON.stringify({ why: "週末について", pieces: [{ text: "友達に会って", meaning: "친구를 만나서" }] }));
  assert.equal(ja?.pieces?.[0]?.meaning, "친구를 만나서");
  assert.equal(parseReview(JSON.stringify({ why: "x" }))?.pieces, undefined);
});

test("돌아보기는 그대로", () => {
  assert.match(prompt(), /already moved on/);
});
