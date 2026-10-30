import { NextRequest } from "next/server";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import { coerceLanguageCode, INTERFACE_LANGUAGE_LABELS } from "@/lib/learningLanguages";
import { meterRequest } from "@/lib/server/meterRequest";
import { bankFor, bankView } from "@/lib/server/qbank";
import type { BankResult } from "@/lib/curriculum/qbankRules";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * POST { language, ui, keys: [{ key, stage }], results: [{ key, text, correct, options?, picked? }] } — 자라는 문제은행(server/qbank.ts).
 * 결과를 셈에 넣고(문장·맞음·보기·고른 보기만 — 학습자가 친 글은 받지 않음), 모자란 열쇠는 키우고, 열쇠마다 지금 묶음을 돌려준다.
 * 모델을 부를 때만 qbankGrow op로 셈. 열쇠는 한 번에 8개, 결과는 60개까지.
 */
export async function OPTIONS(request: NextRequest) {
  return corsPreflightResponse(request);
}

type Body = { language?: string; ui?: string; keys?: { key?: string; stage?: number }[]; results?: (BankResult & { key?: string })[] };

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => ({}))) as Body;
  const language = coerceLanguageCode(body.language);
  const ui = body.ui && INTERFACE_LANGUAGE_LABELS[body.ui] ? body.ui : "en";
  const str = (value: unknown, max: number) => (typeof value === "string" && value.length <= max ? value : "");
  const results = (Array.isArray(body.results) ? body.results : []).slice(0, 60).flatMap((one) => {
    const key = str(one?.key, 80);
    const text = str(one?.text, 200);
    if (!key || !text) return [];
    const options = Array.isArray(one.options) ? one.options.filter((o): o is string => typeof o === "string" && o.length <= 80).slice(0, 4) : undefined;
    const picked = str(one.picked, 80) || undefined;
    return [{ key, text, correct: one.correct === true, ...(options ? { options } : {}), ...(picked ? { picked } : {}) }];
  });
  const wanted = new Map<string, number>();
  for (const one of (Array.isArray(body.keys) ? body.keys : []).slice(0, 8)) {
    const key = str(one?.key, 80);
    if (key) wanted.set(key, Math.min(5, Math.max(1, Math.round(Number(one.stage) || 1))));
  }
  // 결과만 온 열쇠도 셈은 올린다(돌려주지는 않음).
  const resultKeys = new Set(results.map((one) => one.key));
  let metered = 0;
  const meter = () => {
    metered += 1;
    if (metered <= 8) void meterRequest(request, "qbankGrow");
  };
  const banks: Record<string, unknown> = {};
  for (const key of new Set([...wanted.keys(), ...resultKeys])) {
    const mine = results.filter((one) => one.key === key);
    const entry = await bankFor(language, key, wanted.get(key) ?? 1, mine, wanted.has(key) ? meter : undefined).catch(() => null);
    if (entry && wanted.has(key)) banks[key] = await bankView(language, key, entry, ui, meter).catch(() => null);
  }
  return jsonWithCors(request, { banks });
}
