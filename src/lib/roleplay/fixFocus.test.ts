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

test("고친 쪽에 틀린 문장만 오면 그 문장과 짝짓고 맞는 문장은 띠에 안 나옴 — 스페인어·영어·일본어(점검 11-19)", () => {
  assert.deepEqual(focusFix("Hola Mateo. Hoy es un día con mucho trabajo. Yo soy muy cansada porque trabajo en el hospital.", "Estoy muy cansada porque trabajo en el hospital."), {
    said: "Yo soy muy cansada porque trabajo en el hospital.",
    right: "Estoy muy cansada porque trabajo en el hospital.",
  });
  assert.deepEqual(focusFix("It is my first time in Singapore. I stay there for three day.", "I'm staying there for three days."), {
    said: "I stay there for three day.",
    right: "I'm staying there for three days.",
  });
  assert.deepEqual(focusFix("ラーメンが好きです。昨日テレビ見ました。", "昨日テレビを見ました。"), { said: "昨日テレビ見ました。", right: "昨日テレビを見ました。" });
  assert.deepEqual(focusFix("Sí. Me gusta.", "Fui al mercado con mi madre ayer."), { said: "Sí. Me gusta.", right: "Fui al mercado con mi madre ayer." }, "닮은 문장이 없으면 그대로");
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
