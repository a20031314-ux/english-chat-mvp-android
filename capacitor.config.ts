import type { CapacitorConfig } from "@capacitor/cli";
import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * iOS에 넣지 않을 플러그인. 광고(AdMob)는 안드로이드만 — iOS는 추적 동의(ATT)·App Store 신고가 따로라
 * 1차에서 뺐다(hub/drafts/ads-rewarded.md). 넣어 두면 Info.plist에 AdMob 앱 ID가 없어 SDK가 앱을 멈출 수 있다.
 * includePlugins는 허용 목록이라, 의존성 전체에서 이것만 빼서 만든다(새 플러그인은 저절로 iOS에도 들어감).
 */
const ANDROID_ONLY_PLUGINS = ["@capacitor-community/admob"];
const iosPlugins = (() => {
  try {
    const pkg = JSON.parse(readFileSync(join(process.cwd(), "package.json"), "utf8")) as { dependencies?: Record<string, string> };
    return Object.keys(pkg.dependencies ?? {}).filter((name) => !ANDROID_ONLY_PLUGINS.includes(name));
  } catch {
    return undefined;
  }
})();

/**
 * Production Play Store builds should load bundled assets from `www/` inside the
 * Capacitor WebView (no remote server.url).
 *
 * For local live reload only, set CAPACITOR_DEV_SERVER_URL, e.g.:
 *   CAPACITOR_DEV_SERVER_URL=http://192.168.0.10:3000
 */
const devServerUrl = process.env.CAPACITOR_DEV_SERVER_URL?.trim();

/**
 * appId reads like a leftover placeholder, and it is — but it is now permanent.
 * Play locks a package name to its app entry the moment a bundle is uploaded,
 * and 2.38 through 2.40 already went to the closed testing track under this one.
 * Changing it would mean a new Play listing, new testers, and a fresh RevenueCat
 * setup, while this name stays burned for the account either way. It is invisible
 * to users, so it stays. Everything a user reads says "languagebank".
 *
 * Keep in sync if it ever does change: android/app/build.gradle (namespace and
 * applicationId), the java/ package directories, and the RevenueCat Play app.
 */
const config: CapacitorConfig = {
  appId: "com.yourname.englishchat",
  appName: "languagebank",
  webDir: "www",
  android: {
    allowMixedContent: false,
  },
  // iOS(1차, `hub/drafts/ios-launch.md`): 웹뷰는 안전 영역 안에만(AppDelegate.swift
  // SafeAreaHostViewController), 불러오는 동안 비치는 바탕은 앱과 같은 검정.
  ios: {
    backgroundColor: "#000000",
    ...(iosPlugins ? { includePlugins: iosPlugins } : {}),
  },
  plugins: {
    CapacitorHttp: {
      enabled: true,
    },
    // Google 로그인만 쓴다. facebook을 켜 두면 Facebook SDK와 광고 ID 권한이
    // 번들에 들어가 Play의 "광고 ID 안 씀" 신고와 어긋난다(플러그인 README).
    SocialLogin: {
      providers: {
        google: true,
        facebook: false,
        apple: false,
        twitter: false,
      },
    },
  },
  ...(devServerUrl
    ? {
        server: {
          url: devServerUrl,
          cleartext: devServerUrl.startsWith("http://"),
          androidScheme: "https",
        },
      }
    : {}),
};

export default config;
