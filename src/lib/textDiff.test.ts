import assert from "node:assert/strict";
import test from "node:test";
import { correctionReplacementSnippet, diffWords, originalHighlightParts, tokenDiffMarks } from "./textDiff.ts";
import { tokenize } from "./textTokens.ts";

/** 표시된 낱말과 빠진 말을 읽기 쉬운 한 줄로: [틀린]{+빠진}. */
function render(sentence: string, original: string, corrected: string, side: "original" | "corrected") {
  const tokens = tokenize(sentence);
  const { marks, gapsAfter } = tokenDiffMarks(tokens, original, corrected, side);
  let out = gapsAfter.has(-1) ? `{+${gapsAfter.get(-1)}}` : "";
  tokens.forEach((token, i) => {
    out += marks.has(i) ? `[${token}]` : token;
    if (gapsAfter.has(i)) out += `{+${gapsAfter.get(i)}}`;
  });
  return out;
}

test("한국어: 조사·어미가 바뀐 낱말에 표시가 붙는다(바뀌지 않은 '같이'에는 안 붙음)", () => {
  const original = "어제 저는 친구가 만나서 같이 영화를 봐요.";
  const corrected = "어제 저는 친구를 만나서 같이 영화를 봤어요.";
  const o = render(original, original, corrected, "original");
  assert.match(o, /\[친구가\]\{\+를\}/);
  assert.match(o, /\[봐요\]/);
  assert.doesNotMatch(o, /\[같이\]/);
  const c = render(corrected, original, corrected, "corrected");
  assert.match(c, /\[친구를\]/);
  assert.match(c, /\[봤어요\]/);
  assert.doesNotMatch(c, /\[같이\]|\[영화를\]/);
});

test("일본어(띄어쓰기 없음): 시제가 바뀐 낱말에 표시", () => {
  const original = "昨日、友達と映画を見ます。とても面白いです。";
  const corrected = "昨日、友達と映画を見ました。とても面白かったです。";
  const o = render(original, original, corrected, "original");
  assert.doesNotMatch(o, /\[昨日\]|\[友達\]|\[映画\]/);
  // 「見ます」쪽에 표시나 빠진 말이 붙는다(세그먼터가 見/ます를 나눠도).
  assert.match(o, /見[^。]*(\[|\{\+)/);
  const c = render(corrected, original, corrected, "corrected");
  assert.doesNotMatch(c, /\[昨日\]|\[友達\]|\[映画\]/);
  assert.match(c, /\[/);
});

test("영어·스페인어(띄어쓰기 언어): 바뀐 낱말만", () => {
  const original = "Yesterday I go to the beach and we swim a lot.";
  const corrected = "Yesterday I went to the beach and we swam a lot.";
  assert.equal(render(original, original, corrected, "original"), "Yesterday I [go]{+went} to the beach and we [swim]{+swam} a lot.");
  assert.equal(render(corrected, original, corrected, "corrected"), "Yesterday I [went] to the beach and we [swam] a lot.");
  const es = "Ayer yo voy a la playa.";
  const esFixed = "Ayer fui a la playa.";
  const o = render(es, es, esFixed, "original");
  assert.match(o, /\[yo\]/);
  assert.match(o, /\[voy\]/);
  assert.doesNotMatch(o, /\[Ayer\]|\[playa\]/);
});

test("빠진 말만 있는 줄: 그 자리 앞 낱말 뒤에", () => {
  const original = "I went to the beach yesterday.";
  const corrected = "I went to the beach with friends yesterday.";
  assert.equal(render(original, original, corrected, "original"), "I went to the beach{+with friends} yesterday.");
});

test("낱말을 이어 붙인 글이 문장과 다르면 표시하지 않는다", () => {
  const { marks, gapsAfter } = tokenDiffMarks(["다른", " ", "글"], "a b", "a c", "original");
  assert.equal(marks.size, 0);
  assert.equal(gapsAfter.size, 0);
});

test("태국어는 낱말로 나눠 바뀐 낱말만 — 문장 전체가 한 덩어리가 아님(es는 그대로)", () => {
  const parts = diffWords("ฉันไปตลาดเมื่อวาน", "ฉันไปโรงเรียนเมื่อวาน");
  assert.ok(parts.some((part) => part.type === "equal" && part.text.includes("ฉัน")));
  assert.equal(parts.map((part) => (part.type === "add" ? "" : part.text)).join(""), "ฉันไปตลาดเมื่อวาน");
  const snippet = correctionReplacementSnippet("ฉันไปตลาดเมื่อวาน", "ฉันไปโรงเรียนเมื่อวาน");
  assert.ok(!snippet.includes("เมื่อวาน"), snippet);
  assert.equal(correctionReplacementSnippet("Yo fui al mercado", "Yo fui a la escuela").includes("Yo"), false);
});

test("고친 문장이 줄의 한 문장만이면 그 문장만 맞댐 — 맞게 한 다른 문장은 안 지움(en·es·ja, 사용자 2026-11-28)", () => {
  const strike = (o: string, c: string) => originalHighlightParts(o, c).filter((p) => p.error && p.text).map((p) => p.text.trim()).join("|");
  assert.equal(strike("Hi, I was reading a book. What was you doing?", "What were you doing?"), "was");
  assert.equal(strike("Yeah, I buy often. Mm-hmm. Do you have favorite food?", "Yeah, I buy it often."), "");
  assert.equal(strike("Ayer fui al cine. Mañana voy a la playa con mis amigo.", "Mañana voy a la playa con mis amigos."), "amigo.");
  assert.ok(!strike("昨日は学校に行きました。今日はいそがしいです。", "今日は忙しかったです。").includes("昨"), "앞 문장 그대로");
  assert.equal(originalHighlightParts("Hi, I was reading a book. What was you doing?", "What were you doing?").map((p) => p.text).join(""), "Hi, I was reading a book. What was you doing?", "글은 그대로 다 보임");
  // 한 문장 줄은 예전대로.
  assert.equal(strike("I go to park yesterday.", "I went to the park yesterday."), "go");
});
