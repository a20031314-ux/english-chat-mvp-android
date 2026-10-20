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

/**
 * 목록 사이 네이티브 광고 자리(무료·안드로이드만, `lib/ads.ts`). 광고는 앱 카드 모양으로 Google SDK가 그리고
 * ("광고" 표시·AdChoices 포함), 이 div는 그 자리만 잡는다. 구독자·웹·iOS·광고 꺼짐이면 아무것도 그리지 않는다.
 * `active`: 이 화면이 지금 보이는지(숨은 탭에서 광고가 다른 화면 위에 뜨지 않게).
 */
export function NativeAdSlot({ feedId, slotKey, active = true }: { feedId: string; slotKey: string; active?: boolean }) {
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
    if (!enabled || failed || !element) return;
    return attachNativeSlot(feedId, slotKey, element);
  }, [enabled, failed, feedId, slotKey]);

  useEffect(() => {
    setNativeFeedActive(feedId, active);
  }, [feedId, active, enabled]);

  if (!enabled || failed) return null;
  return <div ref={ref} aria-hidden className="w-full" style={{ height: NATIVE_SLOT_HEIGHT }} />;
}
