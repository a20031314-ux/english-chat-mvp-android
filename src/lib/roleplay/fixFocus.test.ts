import test from "node:test";
import assert from "node:assert/strict";
import { focusFix, mixedScript } from "./fixFocus.ts";

test("바뀐 문장만: 맞는 앞 문장은 빠짐 — 스페인어·일본어·영어", () => {
  assert.deepEqual(focusFix("Sí. Yo soy enfermera. Yo soy cansada.", "Sí. Soy enfermera. Estoy cansada."), {
    said: "Yo soy enfermera. Yo soy cansada.",
    right: "Soy enfermera. Estoy cansada.",
  });
  assert.deepEqual(focusFix("とんこつラーメンです。駅をどこですか。", "とんこつラーメンです。駅はどこですか。"), { said: "駅をどこですか。", right: "駅はどこですか。" });
  assert.deepEqual(focusFix("My day is busy. Yesterday I go to meeting.", "My day is busy! Yesterday I went to a meeting."), {
    said: "Yesterday I go to meeting.",
    right: "Yesterday I went to a meeting.",
  });
});

test("한 문장이거나 다 바뀌면 그대로", () => {
  assert.deepEqual(focusFix("I go home", "I went home"), { said: "I go home", right: "I went home" });
  assert.deepEqual(focusFix("A. B.", "C."), { said: "A. B.", right: "C." });
});

test("섞인 글자: 앱 언어로 말한 낱말이 들어간 줄", () => {
  assert.equal(mixedScript("Quiero caminar كيف أقول parque", "Quiero pasear por el parque"), true);
  assert.equal(mixedScript("漫画を読みました、재밌어서", "漫画を読みました。面白かったです。"), true);
  assert.equal(mixedScript("駅をどこですか", "駅はどこですか"), false);
  assert.equal(mixedScript("Yo soy cansada", "Estoy cansada"), false);
});
