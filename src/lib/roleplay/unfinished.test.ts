import assert from "node:assert/strict";
import test from "node:test";
import { soundsUnfinished } from "./unfinished.ts";

test("a sentence cut off on a conjunction is waiting for the rest", () => {
  assert.equal(soundsUnfinished("This cafe has variety of coffee and", "en"), true);
  assert.equal(soundsUnfinished("I went there because", "en"), true);
  assert.equal(soundsUnfinished("I want to order the", "en"), true);
});

test("a finished sentence goes as it is", () => {
  assert.equal(soundsUnfinished("I am working in the cafe.", "en"), false);
  assert.equal(soundsUnfinished("Hi, my name is Sian. How are you?", "en"), false);
  assert.equal(soundsUnfinished("I think so", "en"), false);
  assert.equal(soundsUnfinished("come on", "en"), false);
  assert.equal(soundsUnfinished("", "en"), false);
});

test("a transcriber's trailing comma or ellipsis means they trailed off", () => {
  assert.equal(soundsUnfinished("I like the coffee,", "en"), true);
  assert.equal(soundsUnfinished("Well…", "en"), true);
  assert.equal(soundsUnfinished("Bueno...", "es"), true);
});

test("other Latin-script languages use their own small words", () => {
  assert.equal(soundsUnfinished("Me gusta el café pero", "es"), true);
  assert.equal(soundsUnfinished("Me gusta el café", "es"), false);
  assert.equal(soundsUnfinished("J'aime le café et", "fr"), true);
  assert.equal(soundsUnfinished("Tôi thích cà phê và", "vi"), true);
});

test("spaceless scripts are cut into words before the last one is read", () => {
  assert.equal(soundsUnfinished("コーヒーが好きだけど", "ja"), true);
  assert.equal(soundsUnfinished("コーヒーが好きです", "ja"), false);
  assert.equal(soundsUnfinished("我喜欢咖啡但是", "zh"), true);
  assert.equal(soundsUnfinished("我喜欢咖啡", "zh"), false);
  assert.equal(soundsUnfinished("ฉันชอบกาแฟแต่", "th"), true);
  assert.equal(soundsUnfinished("ฉันชอบกาแฟ", "th"), false);
});

test("Korean connective endings and fillers keep the turn open", () => {
  assert.equal(soundsUnfinished("커피 종류도 많고", "ko"), true);
  assert.equal(soundsUnfinished("거기 갔는데", "ko"), true);
  assert.equal(soundsUnfinished("카페에서 일해요 음", "ko"), true);
  assert.equal(soundsUnfinished("카페에서 일해요", "ko"), false);
  assert.equal(soundsUnfinished("어제 커피 마셨어", "ko"), false);
});

test("Hindi and Arabic vowel signs survive the cleanup", () => {
  assert.equal(soundsUnfinished("मुझे कॉफ़ी पसंद है लेकिन", "hi"), true);
  assert.equal(soundsUnfinished("أحب القهوة لكن", "ar"), true);
});
