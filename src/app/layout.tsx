import type { Metadata } from "next";
import { Providers } from "@/components/Providers";
import { resolveUiCopy } from "@/lib/resolveUiCopy";
import "./globals.css";

export const metadata: Metadata = {
  title: resolveUiCopy("ko").appTitle,
  description: "간단한 AI 영어 교정 채팅 MVP 앱",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased dark">
      <body className="min-h-full flex flex-col bg-[#000000] text-slate-100">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
