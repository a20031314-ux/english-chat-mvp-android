import assert from "node:assert/strict";
import test from "node:test";
import { sameLine, buildRecap, framesInLine, recapReviewKeys } from "./recap.ts";
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

test("못 알아들은 튜터 줄은 뜻과 함께 정리에 — 뜻을 본 줄로 두 번 나오지 않는다(일본어)", () => {
  const lines: TranscriptLine[] = [
    { who: "tutor", text: "週末は何をしましたか？", missed: true, looked: true, translation: "주말에 뭐 했어요?" },
    { who: "tutor", text: "週末、何した？", again: true },
  ];
  const recap = buildRecap("ja", lines);
  assert.deepEqual(recap.map((item) => item.kind), ["missed"]);
  assert.equal(recap[0]!.meaning, "주말에 뭐 했어요?");
});

test("같은 문장을 두 번 말해도 정리 카드는 한 장 — 문장부호·띄어쓰기만 다르거나 같은 말을 고친 것(중국어·스페인어·태국어)", () => {
  const twice = buildRecap("zh", [
    { who: "tutor", text: "你去了长城吗？" },
    { who: "learner", text: "我没有看见长城，因为天气太冷了的", better: "我没有去长城，因为天气太冷了。" },
    { who: "tutor", text: "啊，太冷了。" },
    { who: "learner", text: "我没有看见长城，因为天气太冷了的", better: "我没有去长城，因为天气太冷了" },
  ]);
  assert.equal(twice.filter((item) => item.kind === "fix").length, 1);
  const es = buildRecap("es", [
    { who: "learner", text: "yo trabajar diez horas", better: "Trabajé diez horas." },
    { who: "learner", text: "Yo trabajar diez horas.", better: "Trabajé diez horas hoy." },
  ]);
  assert.equal(es.length, 1, "같은 말을 두 번 — 고친 문장이 조금 달라도 한 장");
  const th = buildRecap("th", [
    { who: "tutor", text: "ไปไหนมา", missed: true },
    { who: "tutor", text: "ไปไหนมา?", missed: true },
  ]);
  assert.equal(th.length, 1);
  // 다른 문장은 그대로 둘.
  assert.equal(buildRecap("es", [
    { who: "learner", text: "yo ir", better: "Fui." },
    { who: "learner", text: "yo comer", better: "Comí." },
  ]).length, 2);
  // 태국어 모음 부호는 지우지 않는다(다른 낱말은 다른 줄).
  assert.notEqual(sameLine("ใช่"), sameLine("ใช"));
});
