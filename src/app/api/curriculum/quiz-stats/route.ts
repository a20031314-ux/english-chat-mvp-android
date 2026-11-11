import { NextRequest } from "next/server";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import { coerceLanguageCode } from "@/lib/learningLanguages";
import { isSimRequest } from "@/lib/server/simData";
import { kvHashIncrMany } from "@/lib/server/kv";

export const dynamic = "force-dynamic";

export async function OPTIONS(request: NextRequest) {
  return corsPreflightResponse(request);
}

const FIELD = /^(?:[wge]\|[0-4]\|[0-9]\|-?[0-2]\|[01]\|(?:ok|miss)|gauge\|-?[0-2]>-?[0-2]\|[0-9])$/;

/**
 * POST { language, fields: ["g|2|3|0|0|ok", "gauge|0>1|3", …] } — 퀴즈 측정(curriculum/quizStats.ts, 설계안 §9).
 * 언어 × 달마다 칸별 수만 더한다(`qstat:v1:<언어>:<YYYY-MM>`). 학습자 글·누가 보냈는지 없음, 모델 호출 없음. 점검 사용자는 안 셈.
 */
export async function POST(request: NextRequest) {
  if (isSimRequest(request)) return jsonWithCors(request, { ok: true });
  const body = (await request.json().catch(() => ({}))) as { language?: string; fields?: unknown };
  const language = coerceLanguageCode(body.language);
  const fields = (Array.isArray(body.fields) ? body.fields : []).slice(0, 200).filter((one): one is string => typeof one === "string" && FIELD.test(one));
  if (!fields.length) return jsonWithCors(request, { ok: true });
  const amounts: Record<string, number> = {};
  for (const field of fields) amounts[field] = (amounts[field] ?? 0) + 1;
  await kvHashIncrMany(`qstat:v1:${language}:${new Date().toISOString().slice(0, 7)}`, amounts, 400 * 24 * 60 * 60).catch(() => undefined);
  return jsonWithCors(request, { ok: true, n: fields.length });
}
