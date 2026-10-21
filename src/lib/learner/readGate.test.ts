import { test } from "node:test";
import assert from "node:assert/strict";
import { shouldReadChatTurn, wordCount } from "./readGate.ts";

test("짧고 맞은 문장은 건너뜀, 틀린 문장은 짧아도 읽음", () => {
  assert.equal(shouldReadChatTurn("I love you", "I love you"), false);
  assert.equal(shouldReadChatTurn("I love you!", "I love you."), false);
  assert.equal(shouldReadChatTurn("I goes to school", "I go to school"), true);
  assert.equal(shouldReadChatTurn("Yesterday I went to the park with my sister", "Yesterday I went to the park with my sister"), true);
  assert.equal(shouldReadChatTurn("Hi", "Hi"), false);
  assert.equal(shouldReadChatTurn("ok ok", "Okay, okay."), false);
});

test("영어 아닌 라틴 언어: 같은 규칙", () => {
  assert.equal(shouldReadChatTurn("Te quiero mucho", "Te quiero mucho"), false);
  assert.equal(shouldReadChatTurn("Ayer yo va al mercado", "Ayer yo fui al mercado"), true);
});

test("띄어쓰기 없는 언어도 단어로 세어 읽힌다(전에는 늘 1단어라 한 번도 안 읽힘)", () => {
  assert.ok(wordCount("昨日は友達と映画を見に行きました", "ja") >= 5);
  assert.equal(shouldReadChatTurn("昨日は友達と映画を見に行きました", "昨日は友達と映画を見に行きました", "ja"), true);
  assert.equal(shouldReadChatTurn("昨日友達と映画を見るに行きました", "昨日友達と映画を見に行きました", "ja"), true);
  assert.equal(shouldReadChatTurn("我爱你", "我爱你", "zh"), false);
  assert.ok(wordCount("เมื่อวานฉันไปตลาดกับแม่", "th") >= 4);
});

test("태국어 모음 기호(\\p{M})만 다른 고침은 바뀐 것으로 본다", () => {
  // ไป(가다)와 ไปป: 기호를 지우지 않으므로 다르게 비교.
  assert.equal(shouldReadChatTurn("ฉัน ชอบ กิน ข้าว", "ฉัน ชอบ กิน ข้าว"), false);
  assert.equal(shouldReadChatTurn("ฉัน ชอบ กิน ขาว", "ฉัน ชอบ กิน ข้าว"), true);
});
