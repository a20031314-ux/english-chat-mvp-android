import { NextRequest, NextResponse } from "next/server";
import { ADMOB_UNITS, adUnitNumber, adsSettings } from "@/lib/billing/ads";
import { admobVerifierKeys, readAdRewardToken, ssvKeyId, verifySsv } from "@/lib/server/adReward";
import { grantAdReward } from "@/lib/server/entitlementStore";

/**
 * AdMob 보상형 광고의 서버 측 확인 콜백(AdMob 콘솔 → 광고 단위 rewarded_more_chats → 서버 측 확인 URL).
 * AdMob이 GET으로 부른다. 200이 아니면 AdMob이 다시 보내므로, 서명이 맞는 콜백에는 결과와 상관없이 200.
 * 서명이 틀리면 400 — 위조 요청이 보상을 받지 못한다.
 */
export async function GET(request: NextRequest) {
  const rawQuery = request.nextUrl.search;
  let keys = await admobVerifierKeys().catch(() => []);
  const keyId = ssvKeyId(rawQuery);
  if (keyId && !keys.some((k) => String(k.keyId) === keyId)) {
    keys = await admobVerifierKeys(true).catch(() => keys);
  }
  const callback = verifySsv(rawQuery, keys);
  if (!callback) return NextResponse.json({ ok: false, error: "BAD_SIGNATURE" }, { status: 400 });

  // 콘솔의 "URL 확인"은 사용자·거래 없이 서명만 맞춰 보낸다.
  if (!callback.transactionId || !callback.customData) return NextResponse.json({ ok: true, result: "verify" });
  if (callback.adUnit && callback.adUnit !== adUnitNumber(ADMOB_UNITS.rewarded)) {
    return NextResponse.json({ ok: true, result: "other_unit" });
  }
  const userId = readAdRewardToken(callback.customData);
  if (!userId) return NextResponse.json({ ok: true, result: "bad_token" });

  const settings = adsSettings();
  if (!settings.enabled) return NextResponse.json({ ok: true, result: "disabled" });
  const result = await grantAdReward(userId, callback.transactionId, settings.rewardedDailyMax);
  return NextResponse.json({ ok: true, result });
}
