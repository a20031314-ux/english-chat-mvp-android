import { NextRequest, NextResponse } from "next/server";
import { meterRequest } from "@/lib/server/meterRequest";
import { seedBanks } from "@/lib/server/qbank";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 300;

/**
 * 출시 초반 문제은행 미리 채우기(2026-11-01 사용자 "출시 초반에만 문장 생성, 잘 돌아가면 고정") — server/qbank.ts seedBanks.
 * 예약 작업(vercel.json crons)이 `Authorization: Bearer $CRON_SECRET`으로 부른다. 문장구조·핵심 표현 열쇠 중 예문이 없는 것만 한 번에 30개까지,
 * 다 돌면 아무것도 안 함. 멈추기: Vercel `QBANK_SEED=off`(미리 채우기만) · `QBANK_FROZEN=1`(문제은행 전체 고정).
 */
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }
  const result = await seedBanks(() => void meterRequest(request, "qbankSeed"));
  return NextResponse.json(result);
}
