import { AppHome } from "@/components/AppHome";

/**
 * 첫 화면. 앱 빌드(APK·iOS)와 웹(www.languagebank.net, 2026-10-20 사용자 결정 "무료와 이어 쓰기")이 같은 앱을 연다.
 * 그 전에는 웹이 소개 화면(`LandingPage`)만 보였다 — 2026-10-20에 지움(되살리려면 git `d99e765^`). 소개·입구 페이지는 앞으로 따로 경로를 둔다.
 * 웹은 무료, 유료는 앱에서 사고 같은 계정으로 이어 쓴다(server/premiumRequest.ts가 계정으로 확인).
 */
export default function Home() {
  return (
    <main className="min-h-screen w-full bg-transparent">
      <AppHome />
    </main>
  );
}
