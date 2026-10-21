import { NextRequest } from "next/server";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import { requestUserId } from "@/lib/server/premiumRequest";
import { forgetSimData, isSimCaller } from "@/lib/server/simData";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * 가상 사용자 점검이 남긴 데이터 지우기(src/lib/server/simData.ts). 모델을 부르지 않는다.
 *
 * POST { prefix: "<실행 이름>-" } | { all: true }, dryRun?: true
 *   → { ok, pattern, found, deleted, dryRun, sample }
 * 부르는 쪽은 점검 사용자(x-rc-user: simcheck-…)여야 하고, 지우는 것은 키 이름에 simcheck-가 든 것뿐.
 */
export async function OPTIONS(request: NextRequest) {
  return corsPreflightResponse(request);
}

export async function POST(request: NextRequest) {
  if (!isSimCaller(requestUserId(request))) {
    return jsonWithCors(request, { error: "NOT_SIM" }, { status: 403 });
  }
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return jsonWithCors(request, { error: "Invalid JSON" }, { status: 400 });
  }
  const result = await forgetSimData(body);
  if (!result.ok) return jsonWithCors(request, { error: result.error }, { status: result.error === "LIMIT" ? 429 : 400 });
  return jsonWithCors(request, result);
}
