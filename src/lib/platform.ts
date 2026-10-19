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

/** 앱 바깥(스토어)으로 보내는 업데이트 링크. */
const PLAY_LISTING = "https://play.google.com/store/apps/details?id=com.yourname.englishchat";

export function storeListingUrl(): string {
  if (isIosApp()) {
    // App Store Connect에 앱을 만들면 생기는 주소(https://apps.apple.com/app/id…).
    const fromEnv = process.env.NEXT_PUBLIC_APP_STORE_URL?.trim();
    return fromEnv || "https://apps.apple.com/search?term=languagebank";
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
