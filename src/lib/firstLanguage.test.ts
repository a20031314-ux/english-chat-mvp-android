import { test } from "node:test";
import assert from "node:assert/strict";
import { deviceUiLocale, needsLanguagePick } from "./firstLanguage.ts";

function store(values: Record<string, string>): Pick<Storage, "getItem"> {
  return { getItem: (key: string) => (key in values ? values[key] : null) };
}

test("처음 설치에만 배울 언어를 묻는다", () => {
  assert.equal(needsLanguagePick(store({})), true);
  // 이미 고른 사람, 앱 언어를 고른 사람, 새로워진 점을 본 사람, 앱을 쓴 흔적이 있는 사람은 묻지 않는다.
  assert.equal(needsLanguagePick(store({ appTargetLanguage: "ja" })), false);
  assert.equal(needsLanguagePick(store({ appUiLocale: "ar" })), false);
  assert.equal(needsLanguagePick(store({ whatsNewSeenVersion: "2.75" })), false);
  assert.equal(needsLanguagePick(store({ conversationSessions: "[]" })), false);
  // 쓸 기능 고르기는 처음 실행에 저절로 적히므로 기존 사용자 표시가 아니다.
  assert.equal(needsLanguagePick(store({ appFeatures: '{"off":[],"chosen":true}' })), true);
});

const LOCALES = ["ko", "en", "es", "ja", "zh", "th", "ar", "pt", "hi"] as const;
type L = (typeof LOCALES)[number];
const isL = (value: string): value is L => (LOCALES as readonly string[]).includes(value);

test("앱 언어는 기기 언어에서, 없으면 영어", () => {
  assert.equal(deviceUiLocale(["pt-BR", "en-US"], isL, "en"), "pt");
  assert.equal(deviceUiLocale(["zh-Hant-TW"], isL, "en"), "zh");
  assert.equal(deviceUiLocale(["th_TH"], isL, "en"), "th");
  assert.equal(deviceUiLocale(["ar-SA"], isL, "en"), "ar");
  // 앱에 없는 언어(독일어)는 건너뛰고 다음 것, 그것도 없으면 영어.
  assert.equal(deviceUiLocale(["de-DE", "es-ES"], isL, "en"), "es");
  assert.equal(deviceUiLocale(["de-DE"], isL, "en"), "en");
  assert.equal(deviceUiLocale([], isL, "en"), "en");
});
