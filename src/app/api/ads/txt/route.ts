import { adsTxt } from "@/lib/webAds";

/** /ads.txt(next.config.ts rewrites) — AdSense가 이 도메인의 판매자를 확인하는 파일. 클라이언트 id가 없으면 빈 글. */
export function GET() {
  return new Response(adsTxt(), { headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=3600" } });
}
