"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  NATIVE_SLOT_HEIGHT,
  attachNativeSlot,
  nativeAdsEnabled,
  nativeSlotFailed,
  setNativeFeedActive,
  watchNativeFailures,
} from "@/lib/ads";
import { adsAvailable } from "@/lib/platform";
import { webAdsAvailable } from "@/lib/webAds";
import { WebAdSlot } from "@/components/WebAdSlot";

/**
 * 목록 사이 네이티브 광고 자리(무료·안드로이드만, `lib/ads.ts`). 광고는 앱 카드 모양으로 Google SDK가 그리고
 * ("광고" 표시·AdChoices 포함), 이 div는 그 자리만 잡는다. 구독자·웹·iOS·광고 꺼짐이면 아무것도 그리지 않는다.
 * `active`: 이 화면이 지금 보이는지. 안 보이면 자리를 떼어(마지막 자리면 그 화면 광고를 치움) 숨은 탭의 광고가
 * 다른 화면 위에 뜨지 않고, 플러그인의 동시 화면 한도(2개)도 넘지 않는다. 다시 보이면 새 광고를 받는다.
 */
const noSubscribe = () => () => undefined;

export function NativeAdSlot(props: { feedId: string; slotKey: string; active?: boolean }) {
  // 웹은 같은 자리에 AdSense(WebAdSlot). 판정은 처음 한 번 — 웹/앱은 실행 중에 바뀌지 않는다.
  const web = useSyncExternalStore(noSubscribe, webAdsAvailable, () => false);
  if (web) return <WebAdSlot active={props.active} />;
  return <AppAdSlot {...props} />;
}

function AppAdSlot({ feedId, slotKey, active = true }: { feedId: string; slotKey: string; active?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const failed = useSyncExternalStore(
    watchNativeFailures,
    () => nativeSlotFailed(feedId, slotKey),
    () => false,
  );

  useEffect(() => {
    if (!adsAvailable()) return;
    let cancelled = false;
    void nativeAdsEnabled().then((on) => {
      if (!cancelled) setEnabled(on);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const element = ref.current;
    if (!enabled || failed || !active || !element) return;
    return attachNativeSlot(feedId, slotKey, element);
  }, [enabled, failed, active, feedId, slotKey]);

  useEffect(() => {
    setNativeFeedActive(feedId, active);
  }, [feedId, active, enabled]);

  if (!enabled || failed) return null;
  return <div ref={ref} aria-hidden className="w-full" style={{ height: NATIVE_SLOT_HEIGHT }} />;
}
