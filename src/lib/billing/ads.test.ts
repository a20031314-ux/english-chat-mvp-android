import assert from "node:assert/strict";
import test from "node:test";
import { ADMOB_UNITS, DEFAULT_ADS_SETTINGS, adChatBonus, adUnitNumber, adsApply, adsSettings } from "./ads.ts";
import { termsFor } from "./plans.ts";

test("광고는 무료에게만, 구독자는 광고 없음", () => {
  const s = DEFAULT_ADS_SETTINGS;
  assert.equal(adsApply("free", s), true);
  for (const tier of ["lite", "plus", "premium"] as const) assert.equal(adsApply(tier, s), false);
  assert.equal(adsApply("free", { ...s, enabled: false }), false);
});

test("보상형 보너스: 하루 상한까지만, 구독자는 0", () => {
  const s = DEFAULT_ADS_SETTINGS;
  assert.equal(adChatBonus("free", 0, s), 0);
  assert.equal(adChatBonus("free", 2, s), 2 * s.rewardChats);
  assert.equal(adChatBonus("free", 99, s), s.rewardedDailyMax * s.rewardChats);
  assert.equal(adChatBonus("plus", 3, s), 0);
});

test("무료 + 광고 최대치는 라이트 채팅 한도보다 작다(구독할 이유가 남음)", () => {
  const s = DEFAULT_ADS_SETTINGS;
  const freeMax = termsFor("free").dailyChat! + s.rewardedDailyMax * s.rewardChats;
  assert.ok(freeMax < termsFor("lite").dailyChat!, `${freeMax} < ${termsFor("lite").dailyChat}`);
});

test("환경 변수로 조정, 이상한 값은 기본값·범위 안으로", () => {
  assert.deepEqual(adsSettings({}), DEFAULT_ADS_SETTINGS);
  assert.equal(adsSettings({ ADS_ENABLED: "0" }).enabled, false);
  assert.equal(adsSettings({ ADS_ENABLED: "off" }).enabled, false);
  assert.equal(adsSettings({ ADS_ENABLED: "1" }).enabled, true);
  assert.equal(adsSettings({ ADS_REWARD_CHATS: "3" }).rewardChats, 3);
  assert.equal(adsSettings({ ADS_REWARD_CHATS: "abc" }).rewardChats, DEFAULT_ADS_SETTINGS.rewardChats);
  assert.equal(adsSettings({ ADS_REWARDED_DAILY_MAX: "500" }).rewardedDailyMax, 10);
  assert.equal(adsSettings({ ADS_INTERSTITIAL_GAP_SECONDS: "5" }).interstitialMinGapSeconds, 60);
  assert.equal(adsSettings({ ADS_APP_OPEN: "0" }).appOpenEnabled, false);
  assert.equal(adsSettings({ ADS_BANNER: "off" }).bannerEnabled, false);
  assert.equal(adsSettings({ ADS_APP_OPEN_AFTER_DAYS: "7" }).appOpenAfterDays, 7);
  assert.equal(adsSettings({ ADS_APP_OPEN_GAP_HOURS: "0" }).appOpenGapHours, 1);
});

test("SSV 콜백의 ad_unit 숫자", () => {
  assert.equal(adUnitNumber(ADMOB_UNITS.rewarded), "3513667692");
});
