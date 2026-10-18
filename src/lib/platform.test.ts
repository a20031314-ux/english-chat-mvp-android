import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { appPlatform, iosStoreWording, socialFeaturesEnabled, STORE_WORDING_KEYS } from "./platform.ts";

const overlays = JSON.parse(readFileSync(new URL("./locales/overlays.json", import.meta.url), "utf8"));
const generated = JSON.parse(readFileSync(new URL("./locales/generated.json", import.meta.url), "utf8"));
const copySource = readFileSync(new URL("./copy.ts", import.meta.url), "utf8");

test("iOS 문구: 모든 언어의 결제·구독 문구에서 Play가 사라지고 App Store가 들어감", () => {
  const values: string[] = [];
  for (const table of [overlays, generated]) {
    for (const locale of Object.keys(table)) {
      for (const key of STORE_WORDING_KEYS) {
        const value = table[locale]?.[key];
        if (typeof value === "string") values.push(value);
      }
    }
  }
  // ko·en·es는 copy.ts에 직접 있다.
  for (const key of STORE_WORDING_KEYS) {
    for (const match of copySource.matchAll(new RegExp(`${key}:\\s*\\n?\\s*"([^"]+)"`, "g"))) values.push(match[1]!);
  }
  assert.ok(values.length >= 30, `문구 ${values.length}개`);
  for (const value of values) {
    if (!/Play/.test(value)) continue;
    const out = iosStoreWording(value);
    assert.doesNotMatch(out, /Play/, out);
    assert.match(out, /App Store/, out);
  }
});

test("iOS 문구: 한국어·일본어·러시아어·아랍어 표기", () => {
  assert.equal(iosStoreWording("구독은 Play 스토어에서 따로 해지해야 해요."), "구독은 App Store에서 따로 해지해야 해요.");
  assert.equal(iosStoreWording("Playストアで解約"), "App Storeで解約");
  assert.equal(iosStoreWording("в Play Маркете."), "в App Store.");
  assert.equal(iosStoreWording("من متجر Play."), "من App Store.");
  assert.equal(iosStoreWording("Play ConsoleとRevenueCat"), "App Store ConnectとRevenueCat");
});

test("플랫폼: 앱 밖(노드·웹)에서는 웹, 방·메시지는 켜짐", () => {
  assert.equal(appPlatform(), "web");
  assert.equal(socialFeaturesEnabled(), true);
});
