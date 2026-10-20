import { apiUrl } from "@/lib/apiBase";
import { entitlementHeaders, readCachedTier } from "@/lib/billing/billingService";
import { appPlatform } from "@/lib/platform";

/**
 * 웹 광고(Google AdSense) — 앱의 목록 사이 카드 광고(NativeAdSlot)와 같은 자리에, 무료 사용자에게만.
 * 앱(AdMob)과 다른 점: 웹에는 전면·앱 오프닝·보상형("광고 보고 채팅 더")이 없다 — AdSense는 원하는 순간에
 * 띄우는 광고와 끝까지 봤는지 알려 주는 콜백을 주지 않는다. 그래서 웹 무료 한도는 늘어나지 않는다.
 *
 * 켜는 법: Vercel에 NEXT_PUBLIC_ADSENSE_CLIENT(ca-pub-…)·NEXT_PUBLIC_ADSENSE_SLOT_FEED(광고 단위 번호)를 넣고 다시 배포.
 * 둘 중 하나라도 없으면 아무것도 불러오지 않는다. 구독자·광고 꺼짐(ADS_ENABLED·ADS_NATIVE)은 앱과 같은
 * /api/ads/config의 native.enabled로 끈다. 앱 빌드(안드로이드·iOS) 안에서는 절대 켜지지 않는다.
 */
export const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim() ?? "";
export const ADSENSE_SLOT_FEED = process.env.NEXT_PUBLIC_ADSENSE_SLOT_FEED?.trim() ?? "";
const CLIENT_OK = /^ca-pub-\d{10,20}$/.test(ADSENSE_CLIENT);

export function webAdsAvailable(): boolean {
  return CLIENT_OK && /^\d{6,16}$/.test(ADSENSE_SLOT_FEED) && appPlatform() === "web" && typeof window !== "undefined";
}

let enabledPromise: Promise<boolean> | null = null;
let enabledAt = 0;
const TTL_MS = 10 * 60 * 1000;

/** 서버가 이 사람에게 목록 광고를 보여도 된다고 하는지(구독자면 false). 실패하면 띄우지 않는다. */
export function webAdsEnabled(): Promise<boolean> {
  if (!webAdsAvailable()) return Promise.resolve(false);
  if (readCachedTier() !== "free") return Promise.resolve(false);
  if (!enabledPromise || Date.now() - enabledAt > TTL_MS) {
    enabledAt = Date.now();
    enabledPromise = fetch(apiUrl("/api/ads/config"), { headers: entitlementHeaders(false) })
      .then((response) => (response.ok ? response.json() : null))
      .then((body: { enabled?: boolean; native?: { enabled?: boolean } } | null) => Boolean(body?.enabled && body.native?.enabled))
      .catch(() => false);
  }
  return enabledPromise;
}

let scriptAdded = false;
/** AdSense 스크립트를 한 번만(광고 자리가 처음 보일 때). */
export function loadAdSense(): void {
  if (scriptAdded || !webAdsAvailable()) return;
  scriptAdded = true;
  const script = document.createElement("script");
  script.async = true;
  script.crossOrigin = "anonymous";
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(ADSENSE_CLIENT)}`;
  document.head.appendChild(script);
}

/** 붙인 <ins> 하나를 채워 달라고. 스크립트가 아직 안 왔어도 큐에 쌓였다가 처리된다. */
export function fillAdSlot(): void {
  try {
    const queue = ((window as unknown as { adsbygoogle?: unknown[] }).adsbygoogle ??= []);
    queue.push({});
  } catch {
    // 광고 차단기 등 — 그냥 지나간다.
  }
}

/** ads.txt 한 줄(AdSense 판매자 확인). 클라이언트 id가 없으면 빈 글. */
export function adsTxt(client = ADSENSE_CLIENT): string {
  const id = client.replace(/^ca-/, "");
  return /^pub-\d{10,20}$/.test(id) ? `google.com, ${id}, DIRECT, f08c47fec0942fa0\n` : "";
}
