import { Capacitor } from "@capacitor/core";

/**
 * 어느 앱(플랫폼)에서 돌고 있는지와, 플랫폼마다 다르게 켜고 끄는 기능.
 *
 * iOS 1차 출시(2026-10, `hub/drafts/ios-launch.md`)는 사용자끼리 주고받는 기능
 * (말하는 방·1:1 메시지)을 뺀다. 애플 심사가 사용자 생성 콘텐츠에 약관 동의·
 * 거르기·신고 처리 운영을 요구하고, 숨은 입구는 "숨긴 기능"으로 걸리기 때문이다.
 * 준비가 끝나면 Vercel에 `NEXT_PUBLIC_IOS_SOCIAL=1`을 넣고 다시 빌드하면 켜진다
 * (앱 번들에 들어가는 값이라 iOS 앱 빌드가 새로 필요하다).
 */
export type AppPlatform = "android" | "ios" | "web";

export function appPlatform(): AppPlatform {
  if (typeof window === "undefined") return "web";
  const platform = Capacitor.getPlatform();
  if (platform === "ios") return "ios";
  if (platform === "android") return "android";
  return "web";
}

export function isIosApp(): boolean {
  return appPlatform() === "ios";
}

/** 말하는 방과 그 안의 프로필·팔로우·1:1 메시지. */
export function socialFeaturesEnabled(): boolean {
  if (!isIosApp()) return true;
  return process.env.NEXT_PUBLIC_IOS_SOCIAL?.trim() === "1";
}

/**
 * AI 음성 통화. iOS 1차 심사(2026-10-25 사용자 결정): 아이폰에서 통화를 열면 마이크가 열리는 순간 폰 소리 전체가
 * 막히는 일이 기기에서만 나서(재현 못 함, hub/drafts/ios-launch.md) 고칠 때까지 통화 탭·📞·"말로"를 숨긴다.
 */
export function voiceCallAvailable(): boolean {
  // 진단 빌드(TestFlight diag)에서는 켠다 — 아이폰 통화를 고치며 확인하는 빌드.
  return !isIosApp() || turnDiagnosticsEnabled();
}

/**
 * 영상 플레이어를 잠깐 음소거해도 되는지(문장 다시 듣기의 앞부분을 소리 없이 넘길 때).
 * iOS 웹뷰는 사용자가 누르지 않은 때(타이머)에 보낸 unMute를 무시해서, 문장을 한 번 눌러 들은 뒤부터
 * 영상이 끝까지 소리 없이 재생됐다(2026-10-25 사용자: "특정 부분부터 화면은 나오는데 소리가 안 나"). iOS는 음소거하지 않는다.
 */
export function videoMuteAllowed(): boolean {
  return !isIosApp();
}

/**
 * Google 로그인. iOS에서 Google을 띄우면 애플이 "Apple로 로그인"도 같이 요구한다
 * (심사 지침 4.8). iOS 1차는 아이디·비밀번호와 이메일 코드만 둔다.
 */
export function googleLoginAvailable(): boolean {
  // 웹(2026-10-20): Google Cloud 웹 클라이언트에 www.languagebank.net·english-chat-mvp.vercel.app 원본과
  // 리디렉션(끝 "/")을 넣어 둠. 팝업으로 로그인하고 id 토큰은 서버가 같은 클라이언트 id로 확인한다.
  return appPlatform() !== "ios";
}

/**
 * 기기가 YouTube 미디어(오디오)를 직접 내려받아 받아쓰는 길. 애플 심사는 제3자
 * 미디어를 내려받는 기능을 막는다(지침 5.2.3). iOS에서는 자막이 있는 영상과
 * 서버가 준비해 둔 영상만 쓴다.
 */
export function deviceMediaDownloadAllowed(): boolean {
  return !isIosApp();
}

/**
 * 통화 한 턴의 녹음·받아쓰기 상태를 화면 구석에 보여 주는 진단 상자(맥 없이 아이폰 문제를 보려고, 2026-10-20).
 * TestFlight 빌드 작업 흐름이 `NEXT_PUBLIC_IOS_DIAG=1`로 켠다. **App Store 심사에 낼 빌드에서는 끈다.**
 */
export function turnDiagnosticsEnabled(): boolean {
  return isIosApp() && process.env.NEXT_PUBLIC_IOS_DIAG?.trim() === "1";
}

/**
 * 광고(AdMob, `lib/ads.ts`). 안드로이드 앱에서만 — iOS는 추적 동의(ATT)·App Store 신고가 따로라 1차에서 뺐고
 * 플러그인도 iOS 빌드에 넣지 않는다(capacitor.config.ts). 웹에는 AdMob이 없다.
 */
export function adsAvailable(): boolean {
  return appPlatform() === "android";
}

/**
 * 다른 스토어에서 이미 구독 중인지(사용자 결정 2026-10-20: 안드로이드 구독자는 아이폰에서 결제를 막는다,
 * 거꾸로도 같게). RevenueCat 권한의 `store`("PLAY_STORE"·"APP_STORE"…)를 보고, 이 기기와 다른 스토어면
 * 그 스토어 이름을 돌려준다. 같은 계정으로 로그인해야 RevenueCat이 다른 스토어 구독을 알려 준다.
 * 프로모션·서버가 준 기간(초대 보상 등)은 스토어가 아니라 막지 않는다.
 */
export function otherStoreName(store: string | null | undefined, platform: AppPlatform = appPlatform()): string | null {
  if (!store) return null;
  const apple = store === "APP_STORE" || store === "MAC_APP_STORE";
  if (platform === "ios" && store === "PLAY_STORE") return "Google Play";
  if (platform === "android" && apple) return "App Store";
  return null;
}

/** 개인정보처리방침(웹 도메인). */
export const PRIVACY_POLICY_URL = "https://www.languagebank.net/privacy";

/** 구독 약관 링크. iOS는 애플 표준 이용약관(EULA), 그 밖은 없음(Play는 요구하지 않음). */
export function subscriptionTermsUrl(platform: AppPlatform = appPlatform()): string | null {
  return platform === "ios" ? "https://www.apple.com/legal/internet-services/itunes/dev/stdeula/" : null;
}

/** 구독을 해지·관리하는 스토어 이름(자동 갱신 안내 문구에 들어감). */
export function subscriptionStoreName(platform: AppPlatform = appPlatform()): string {
  return platform === "ios" ? "App Store" : "Google Play";
}

/**
 * AI 데이터 동의(애플 심사 5.1.2(i), 2025-11): 채팅·통화·사진을 OpenAI로 보내기 전에 앱 안에서 밝히고 동의를 받는다.
 * iOS만(안드로이드·웹은 처리방침과 통화 안내로 이미 안내). 동의는 이 기기에 저장(`AiConsentGate.tsx`).
 */
export function aiConsentRequired(platform: AppPlatform = appPlatform()): boolean {
  return platform === "ios";
}

/** 사용자가 붙여 넣은 YouTube 링크로 영상 학습을 가져오는 입구. iOS 1차는 이달의 영상만(심사 5.2.2·5.2.3). */
export function videoImportAvailable(platform: AppPlatform = appPlatform()): boolean {
  return platform !== "ios";
}

/** 앱 바깥(스토어)으로 보내는 업데이트 링크. */
const PLAY_LISTING = "https://play.google.com/store/apps/details?id=com.yourname.englishchat";

export function storeListingUrl(): string {
  if (isIosApp()) {
    // App Store Connect 앱 ID 6824542951(2026-10-23 첫 제출). 바꿀 일이 있으면 NEXT_PUBLIC_APP_STORE_URL.
    const fromEnv = process.env.NEXT_PUBLIC_APP_STORE_URL?.trim();
    return fromEnv || "https://apps.apple.com/app/id6824542951";
  }
  return PLAY_LISTING;
}

/**
 * 결제·구독 문구는 Play 스토어를 가리키며 14개 언어로 쓰여 있다. iOS에서는 그
 * 이름만 App Store로 바꿔 보여 준다(언어마다 쓰는 표기를 그대로 찾아 바꿈).
 */
const STORE_NAME_PATTERNS: [RegExp, string][] = [
  [/Play Console/g, "App Store Connect"],
  [/Google Play(?: Store)?/g, "App Store"],
  [/Play ?(?:Store|스토어|ストア|商店|Маркете|Маркет)/g, "App Store"],
  [/متجر Play/g, "App Store"],
];

export function iosStoreWording(text: string): string {
  let out = text;
  for (const [pattern, replacement] of STORE_NAME_PATTERNS) out = out.replace(pattern, replacement);
  return out;
}

/** 스토어 이름이 들어 있는 문구 키. 새로 생기면 여기에 더한다. */
export const STORE_WORDING_KEYS = [
  "accountDeleteConfirm",
  "paywallPurchaseTimeout",
  "paywallNoProduct",
] as const;
