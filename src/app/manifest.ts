import type { MetadataRoute } from "next";

/**
 * 웹으로 열었을 때 "홈 화면에 추가"하면 앱처럼 뜨게(주소창 없이). 웹은 무료 + 앱에서 산 구독 이어 쓰기
 * (server/premiumRequest.ts 계정 id 확인). 아이콘은 안드로이드 런처 아이콘을 줄인 것.
 */
export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "languagebank",
    short_name: "languagebank",
    description: "Chat, talk and watch in the language you are learning — every sentence checked, and people to practise with.",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#000000",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
