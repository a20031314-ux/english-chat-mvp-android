import type { Metadata } from "next";
import { Providers } from "@/components/Providers";
import "./globals.css";

// 웹으로 여는 사람도 같은 앱을 쓴다(무료 + 앱에서 산 구독 이어 쓰기). 이름은 스토어와 같은 languagebank.
export const metadata: Metadata = {
  title: "languagebank",
  description: "배우는 언어로 채팅·통화·영상 — 문장마다 틀린 점을 짚고, 사람들과 말하는 방에서 같이 연습해요.",
  applicationName: "languagebank",
  icons: { icon: "/icon-192.png", apple: "/icon-192.png" },
  openGraph: {
    title: "languagebank",
    description: "Chat, talk and watch in the language you are learning — every sentence checked, and people to practise with.",
    images: [{ url: "/icon-512.png", width: 512, height: 512 }],
  },
  // AdSense 사이트 확인(웹 광고, lib/webAds.ts). 값이 없으면 넣지 않는다.
  ...(process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim() ? { other: { "google-adsense-account": process.env.NEXT_PUBLIC_ADSENSE_CLIENT.trim() } } : {}),
};

export const viewport = { themeColor: "#000000" };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased dark">
      <body className="min-h-full flex flex-col bg-black text-slate-100">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
