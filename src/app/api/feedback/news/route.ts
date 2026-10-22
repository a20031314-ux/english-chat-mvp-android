import { NextRequest } from "next/server";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import { requestAuth, requestUserId, revenueCatUserId } from "@/lib/server/premiumRequest";
import { creditFixedFeedback } from "@/lib/server/contribStore";
import { takeFeedbackNews } from "@/lib/server/feedbackFixStore";

export const dynamic = "force-dynamic";

export async function OPTIONS(request: NextRequest) {
  return corsPreflightResponse(request);
}

/**
 * GET ?ui=<앱 언어>&native=1 — 앱을 열 때 한 번: 내가 보낸 의견이 반영됐다는 소식.
 * 보여 준 소식은 서버에서 지워진다(src/lib/server/feedbackFixStore.ts).
 *
 * 로그인 전에 보낸 의견도 찾게, 이 요청으로 알 수 있는 id(계정에 묶인 id, 이 기기의
 * RevenueCat id) 모두로 찾는다. 모델 호출 없음.
 *
 * 로그인했으면 소식이 온 카드마다 그 계정의 "함께 만든 사람" 수를 한 번 올린다(프로필 🛠 칸·노출 가산,
 * server/contribStore.ts). 포인트는 주지 않는다(사용자 결정 2026-10-23, hub/drafts/profile-2026-10-23.md).
 * 업데이트를 기다리는 소식("업데이트하면 보여요")도 반영은 된 것이라 센다.
 */
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const appUser = revenueCatUserId(request);
  const news = await takeFeedbackNews({
    userIds: [requestUserId(request), appUser ? `rc:${appUser}` : ""],
    uiLocale: (params.get("ui") ?? "").slice(0, 10),
    appVersion: request.headers.get("x-app-version")?.slice(0, 20) ?? "",
    native: params.get("native") === "1",
  });
  const accountId = requestAuth(request)?.accountId;
  if (accountId && news.length) {
    try {
      await creditFixedFeedback(accountId, news.map((item) => item.card));
    } catch (error) {
      console.error("[feedback-news] credit", error);
    }
  }
  return jsonWithCors(request, { news });
}
