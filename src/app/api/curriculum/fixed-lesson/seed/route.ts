import { NextRequest, NextResponse } from "next/server";
import { meterRequest } from "@/lib/server/meterRequest";
import { seedFixedLessons } from "@/lib/server/fixedLesson";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 300;

/**
 * Stagebank 고정 수업 미리 만들기(2026-11-02 사용자 "시작해줘") — server/fixedLesson.ts seedFixedLessons.
 * 예약 작업(vercel.json crons)이 `Authorization: Bearer $CRON_SECRET`으로 부른다. 앱 언어 ko·en × 14개 학습 언어 × 1~5단계 틀 중
 * 없는 것을 한 번에 16개(여덟씩 나란히, 170초 넘으면 다음 번에), 차례표를 두 바퀴 돌면 멈춤. 멈추기: Vercel `FIXED_LESSON_SEED=off`.
 */
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }
  const result = await seedFixedLessons(16, () => void meterRequest(request, "fixedLesson"));
  return NextResponse.json(result);
}
