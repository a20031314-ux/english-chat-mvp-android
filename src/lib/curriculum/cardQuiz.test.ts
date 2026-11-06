import { test } from "node:test";
import assert from "node:assert/strict";
import { cardQuiz, registerQuizSources, typedRight, type QuizSource } from "./quiz.ts";
import { registerReadings } from "./readings/index.ts";

const card = (key: string, text: string, piece: string, wordGloss: string, pos = "noun"): { key: string; sources: QuizSource[] } => ({
  key,
  sources: [{ text, gloss: { en: "", raw: `${text} (뜻)` }, from: key, stage: 1, piece, who: "me", wordGloss, pos }],
});

test("카드 변형: 뜻 가리기 = 밑줄 낱말 + 뜻 넷 중 하나, 뜻만 보여 주기 = 뜻 보고 쓰기 (ja)", () => {
  registerQuizSources("ja", [
    card("w|水", "水を飲みたい。", "水", "물"),
    card("w|山", "山に登った。", "山", "산"),
    card("w|川", "川で泳ぐ。", "川", "강"),
    card("w|空", "空が青い。", "空", "하늘"),
    card("w|食べる", "パンを食べた。", "食べ", "먹다", "verb"),
  ]);
  const hide = cardQuiz("ja", "w|水", "hide", "s");
  assert.equal(hide?.kind, "meaning");
  if (hide?.kind !== "meaning") return;
  assert.equal(hide.mark, "水");
  assert.equal(hide.options.length, 4);
  assert.equal(hide.options[hide.answer]!.raw, "물");
  // 같은 품사(명사) 뜻으로 오답, 정답이 문장에 그대로 보이지 않음(보기는 앱 언어).
  assert.ok(!hide.options.some((option) => option.raw === "먹다"));
  const show = cardQuiz("ja", "w|食べる", "show", "s");
  assert.equal(show?.kind, "type");
  if (show?.kind !== "type") return;
  // 카드 그대로: 뜻은 보이고 예문 속 그 말만 빈칸(답 = 예문 속 꼴).
  assert.equal(show.answer, "食べ");
  assert.equal(show.before + "＿" + show.after, "パンを＿た。");
  assert.deepEqual(show.card, { word: "食べる", meaning: "먹다" });
  assert.deepEqual(hide.card, { word: "水", meaning: "물" });
  // 일본어는 읽기(가나)로 쳐도 맞음 — 채점은 예전 typedRight 그대로(읽기는 빈도 목록이 넣음).
  registerReadings("ja", [["食べる", "たべる"]]);
  assert.ok(typedRight("食べる", "たべる", { language: "ja" }));
});

test("카드 변형: 낱말 가림은 예문 빈칸, 오답이 모자라면 뜻 가림은 null (es)", () => {
  registerQuizSources("es", [card("w|grande", "Es una casa grande.", "grande", "큰", "adj"), card("w|enorme", "Un perro enorme.", "enorme", "큰", "adj")]);
  const show = cardQuiz("es", "w|grande", "show", "s");
  assert.equal(show?.kind === "type" && show.before, "Es una casa ");
  assert.equal(cardQuiz("es", "w|grande", "hide", "s"), null);
  assert.equal(cardQuiz("es", "g|1:2", "show", "s"), null);
});
