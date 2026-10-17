import { test } from "node:test";
import assert from "node:assert/strict";
import { exampleMixesInterfaceLanguage } from "./exampleLanguage.ts";

test("예문에 앱 언어가 섞이면 걸러낸다", () => {
  // 가상 사용자 2026-10-18에서 나온 것
  assert.equal(exampleMixesInterfaceLanguage("Akhir-akhir ini saya sering đi tập thể dục.", "id", "vi"), true);
  assert.equal(exampleMixesInterfaceLanguage("ช่วงนี้ฉัน đang học tiếng Thái", "th", "vi"), true);
  // 멀쩡한 예문은 남긴다
  assert.equal(exampleMixesInterfaceLanguage("Akhir-akhir ini saya sering olahraga.", "id", "vi"), false);
  assert.equal(exampleMixesInterfaceLanguage("ช่วงนี้ฉันเรียนภาษาไทย", "th", "vi"), false);
  assert.equal(exampleMixesInterfaceLanguage("我叫Marco。", "zh", "it"), false);
  assert.equal(exampleMixesInterfaceLanguage("最近、仕事が忙しいです。", "ja", "ko"), false);
  assert.equal(exampleMixesInterfaceLanguage("最近、仕事が 바빠요.", "ja", "ko"), true);
  assert.equal(exampleMixesInterfaceLanguage("Ultimamente abbiamo visto des films interessanti.", "it", "fr"), true);
  assert.equal(exampleMixesInterfaceLanguage("Ultimamente lavoro molto.", "it", "fr"), false);
  assert.equal(exampleMixesInterfaceLanguage("anything", "en", "en"), false);
});
