import { NextRequest } from "next/server";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";

/**
 * 지금 운영에 올라간 배포(git 커밋) — 시험 앱 껍데기가 자기 화면의 배포와 견줘 "새 버전이 나왔어요"를 띄운다
 * (components/ShellUpdate.tsx, 2026-11-02). 모델·저장 없음.
 */
export const dynamic = "force-dynamic";

export async function OPTIONS(request: NextRequest) {
  return corsPreflightResponse(request);
}

export async function GET(request: NextRequest) {
  const response = jsonWithCors(request, { sha: process.env.VERCEL_GIT_COMMIT_SHA ?? "" });
  response.headers.set("Cache-Control", "no-store");
  return response;
}
