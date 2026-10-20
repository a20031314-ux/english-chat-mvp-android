"use client";

import { useEffect, useRef, useState } from "react";
import { ADSENSE_CLIENT, ADSENSE_SLOT_FEED, fillAdSlot, loadAdSense, webAdsEnabled } from "@/lib/webAds";

/**
 * 웹의 목록 사이 광고(AdSense, `lib/webAds.ts`). 앱의 NativeAdSlot과 같은 자리에서 불린다.
 * 안 보이는 화면(active=false)에서는 그리지 않고, 다시 보이면 새로 붙인다. 못 채운 자리는 CSS가 숨긴다(globals.css).
 */
export function WebAdSlot({ active = true }: { active?: boolean }) {
  const [enabled, setEnabled] = useState(false);
  const ref = useRef<HTMLModElement>(null);

  useEffect(() => {
    let cancelled = false;
    void webAdsEnabled().then((on) => {
      if (!cancelled) setEnabled(on);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!enabled || !active || !ref.current || ref.current.dataset.adsbygoogleStatus) return;
    loadAdSense();
    fillAdSlot();
  }, [enabled, active]);

  if (!enabled || !active) return null;
  // AdSense 반응형 디스플레이 광고 단위 하나를 모든 목록 자리에 쓴다.
  return (
    <div className="w-full overflow-hidden">
      <ins
        ref={ref}
        className="adsbygoogle block w-full"
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={ADSENSE_SLOT_FEED}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
