import assert from "node:assert/strict";
import test from "node:test";
import { buildRecap, framesInLine, recapReviewKeys } from "./recap.ts";
import type { TranscriptLine } from "./review.ts";

test("고친 줄·도움말·뜻 본 튜터 줄이 정리에 들어가고, 문장구조를 찾는다", () => {
  const lines: TranscriptLine[] = [
    { who: "tutor", text: "Have you ever been to Busan?", looked: true, translation: "부산에 가 본 적 있어요?" },
    { who: "learner", text: "I am go Busan last week", meant: "I went to Busan last week." },
    { who: "tutor", text: "Nice! What did you do there?", tip: "“I'd like a table for two, please.”라고 하면 돼요." },
    { who: "learner", text: "I like seafood." },
  ];
  const recap = buildRecap("en", lines);
  assert.deepEqual(recap.map((item) => item.kind), ["looked", "fix", "hint"]);
  assert.equal(recap[0]!.meaning, "부산에 가 본 적 있어요?");
  assert.ok(recap[0]!.frames.some((frame) => frame.id === "en-f3-01"), "Have you ever ___?");
  assert.equal(recap[1]!.said, "I am go Busan last week");
  assert.ok(recap[2]!.frames.some((frame) => frame.id === "en-f1-17"), "앱 언어 설명이 섞인 도움말에서도 I'd like ___, please.");
});

test("띄어쓰기 없는 일본어·스페인어도 틀을 찾는다", () => {
  assert.ok(framesInLine("ja", "写真を撮ってもいいですか。").some((frame) => frame.id === "ja-f2-01"));
  assert.ok(framesInLine("es", "Me encanta nadar en el mar.").some((frame) => frame.id === "es-f2-08"));
});

test("같은 줄은 한 번, 다시 볼 열쇠는 f|틀 id", () => {
  const lines: TranscriptLine[] = [
    { who: "tutor", text: "Have you ever tried it?", looked: true },
    { who: "tutor", text: "Have you ever tried it?", looked: true },
    { who: "learner", text: "ok" },
  ];
  const recap = buildRecap("en", lines);
  assert.equal(recap.length, 1);
  assert.deepEqual(recapReviewKeys(recap), ["f|en-f3-01"]);
});

test("고칠 게 없는 줄과 빈 통화는 정리할 것이 없다", () => {
  assert.deepEqual(buildRecap("en", [{ who: "learner", text: "Hi", better: "Hi" }]), []);
  assert.deepEqual(buildRecap("en", []), []);
});
