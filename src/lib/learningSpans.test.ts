import assert from "node:assert/strict";
import test from "node:test";
import {
  listClickableSpans,
  normalizeLearningSpans,
  rememberLearningSpans,
  tokensFromLearningSpans,
} from "./learningSpans.ts";
import { listWordSpans } from "./textTokens.ts";

test("English clickable spans stay Segmenter words", () => {
  const sentence = "I will look forward to the weekend.";
  assert.deepEqual(
    listClickableSpans(sentence, "en").map((span) => span.text),
    listWordSpans(sentence).map((span) => span.text),
  );
});

test("Chinese words stay words, not characters", () => {
  const sentence = "我喜欢学习中文";
  const spans = normalizeLearningSpans(
    {
      spans: [
        { text: "我", kind: "word" },
        { text: "喜欢", kind: "word" },
        {
          text: "学习",
          kind: "word",
          reading: "xuéxí",
          inner: [
            { text: "学", kind: "character", meaning: "배우다" },
            { text: "习", kind: "character", meaning: "익히다" },
          ],
        },
        { text: "中文", kind: "word" },
      ],
    },
    sentence,
  );
  assert.deepEqual(
    spans.map((span) => span.text),
    ["我", "喜欢", "学习", "中文"],
  );
  assert.deepEqual(
    spans[2]?.inner?.map((part) => part.text),
    ["学", "习"],
  );
});

test("Chinese idiom stays one primary span", () => {
  const sentence = "他总是对牛弹琴。";
  const spans = normalizeLearningSpans(
    {
      spans: [
        { text: "他", kind: "word" },
        { text: "总是", kind: "word" },
        { text: "对牛弹琴", kind: "expression" },
      ],
    },
    sentence,
  );
  assert.equal(
    spans.find((span) => span.text === "对牛弹琴")?.kind,
    "expression",
  );
  assert.ok(!spans.some((span) => span.text === "对" && span.kind === "word"));
});

test("Japanese mixed sentence uses word/expression units", () => {
  const sentence = "私は日本語を勉強しています。";
  const spans = normalizeLearningSpans(
    {
      spans: [
        { text: "私", kind: "word" },
        { text: "は", kind: "word" },
        { text: "日本語", kind: "word" },
        { text: "を", kind: "word" },
        {
          text: "勉強しています",
          kind: "grammar_unit",
          baseForm: "勉強する",
          inner: [
            { text: "勉強", kind: "word" },
            { text: "しています", kind: "morpheme" },
          ],
        },
      ],
    },
    sentence,
  );
  assert.deepEqual(
    spans.map((span) => span.text),
    ["私", "は", "日本語", "を", "勉強しています"],
  );
});

test("Japanese kanji word is not split into characters as primary spans", () => {
  const sentence = "今日はいい天気ですね。";
  const spans = normalizeLearningSpans(
    {
      spans: [
        {
          text: "今日",
          kind: "word",
          reading: "きょう",
          inner: [
            { text: "今", kind: "character" },
            { text: "日", kind: "character" },
          ],
        },
        { text: "は", kind: "word" },
        { text: "いい", kind: "word" },
        { text: "天気", kind: "word" },
        { text: "です", kind: "word" },
        { text: "ね", kind: "word" },
      ],
    },
    sentence,
  );
  assert.equal(spans[0]?.text, "今日");
  assert.ok(!spans.some((span) => span.text === "今" && !span.inner));
});

test("Spanish multi-word expression stays one tap unit", () => {
  const sentence = "Tengo que estudiar.";
  const spans = normalizeLearningSpans(
    {
      spans: [
        {
          text: "Tengo que",
          kind: "expression",
          meaning: "~해야 한다",
          inner: [
            { text: "Tengo", kind: "word" },
            { text: "que", kind: "word" },
          ],
        },
        { text: "estudiar", kind: "word" },
      ],
    },
    sentence,
  );
  assert.equal(spans[0]?.text, "Tengo que");
  assert.equal(spans[0]?.kind, "expression");
  assert.equal(spans[1]?.text, "estudiar");
});

test("missing pieces are filled from Segmenter fallback", () => {
  const sentence = "我喜欢学习中文";
  const spans = normalizeLearningSpans(
    { spans: [{ text: "喜欢", kind: "word" }] },
    sentence,
  );
  assert.ok(spans[0]?.text === "我" || spans.some((span) => span.text === "我"));
  assert.ok(spans.some((span) => span.text === "喜欢"));
});

test("whole-sentence span is ignored", () => {
  const sentence = "私は日本語を勉強しています。";
  const spans = normalizeLearningSpans(
    { spans: [{ text: sentence, kind: "expression" }] },
    sentence,
  );
  assert.ok(spans.length >= 2);
  assert.ok(!spans.some((span) => span.text === sentence));
});

test("tokensFromLearningSpans keeps punctuation gaps", () => {
  const sentence = "今日はいい天気ですね。";
  const spans = normalizeLearningSpans(
    {
      spans: [
        { text: "今日" },
        { text: "は" },
        { text: "いい" },
        { text: "天気" },
        { text: "です" },
        { text: "ね" },
      ],
    },
    sentence,
  );
  const tokens = tokensFromLearningSpans(sentence, spans);
  assert.ok(tokens.includes("。"));
  assert.ok(tokens.includes("今日"));
});

test("cached non-English spans replace Segmenter until English is requested", () => {
  const sentence = "我喜欢学习中文";
  const spans = normalizeLearningSpans(
    {
      spans: [
        { text: "我" },
        { text: "喜欢" },
        { text: "学习" },
        { text: "中文" },
      ],
    },
    sentence,
  );
  rememberLearningSpans(sentence, "zh", spans);
  assert.deepEqual(
    listClickableSpans(sentence, "zh").map((span) => span.text),
    ["我", "喜欢", "学习", "中文"],
  );
  assert.deepEqual(
    listClickableSpans("Call me when you arrive.", "en").map((span) => span.text),
    listWordSpans("Call me when you arrive.").map((span) => span.text),
  );
});
