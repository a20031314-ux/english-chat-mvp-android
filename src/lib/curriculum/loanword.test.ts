import assert from "node:assert/strict";
import { test } from "node:test";
import { soundsAlike } from "./loanword.ts";

test("소리 그대로 옮긴 뜻 풀이를 알아본다 (es·en·ja·ar·ko·ru)", () => {
  assert.equal(soundsAlike("micrófono", "ميكروفون"), true);
  assert.equal(soundsAlike("tv", "テレビ"), true);
  assert.equal(soundsAlike("テレビ", "텔레비전"), true);
  assert.equal(soundsAlike("hospital", "hospital"), true);
  assert.equal(soundsAlike("camera", "카메라"), true);
  assert.equal(soundsAlike("television", "텔레비전"), true);
  assert.equal(soundsAlike("computer", "컴퓨터"), true);
  assert.equal(soundsAlike("ハンバーガー", "햄버거"), true);
  assert.equal(soundsAlike("internet", "интернет"), true);
  assert.equal(soundsAlike("autobús", "バス、乗り物"), false);
  assert.equal(soundsAlike("sandwich", "샌드위치, 간식"), true);
});

test("뜻이 다른 말은 그대로 문제로 (es·en·ja·ar·ko)", () => {
  for (const [word, gloss] of [
    ["mesa", "탁자"], ["neck", "목"], ["along", "함께"], ["avoid", "피하다"], ["meet", "만나다"], ["casa", "집"], ["perro", "كلب"], ["platypus", "오리너구리"], ["celda", "زنزانة"],
    ["señal", "لافتة"], ["broma", "نكتة"], ["independently", "혼자서, 독립적으로"], ["utter", "소리 내어 말하다"],
    ["時間", "시간"], ["考え", "생각, 아이디어"], ["また", "다시"], ["crimen", "جريمة"], ["director", "مدير"],
    ["stethoscope", "청진기"], ["maternal", "어머니와 관련된"], ["listo", "جاهز"], ["cuerpo", "جسم"],
  ]) assert.equal(soundsAlike(word!, gloss!), false, `${word} ↔ ${gloss}`);
});
