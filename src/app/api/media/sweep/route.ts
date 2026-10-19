import { NextRequest, NextResponse } from "next/server";
import { sweepMedia } from "@/lib/server/mediaStore";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * 매일: 기간이 끝난 사진(1:1·단체방 30일, 보내지 않은 사진 하루)을 저장소에서 지운다(server/mediaStore.ts).
 * Vercel이 `Authorization: Bearer $CRON_SECRET`을 붙여 보낸다(vercel.json crons).
 */
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }
  return NextResponse.json(await sweepMedia());
}
