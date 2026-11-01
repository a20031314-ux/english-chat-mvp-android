import { NextRequest } from "next/server";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import { coerceLanguageCode, INTERFACE_LANGUAGE_LABELS } from "@/lib/learningLanguages";
import { meterRequest } from "@/lib/server/meterRequest";
import { bankFor, bankView, offerToBank } from "@/lib/server/qbank";
import { isSimRequest } from "@/lib/server/simData";
import type { BankResult } from "@/lib/curriculum/qbankRules";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * POST { language, ui, keys: [{ key, stage }], results: [{ key, text, correct, options?, picked? }] } — 자라는 문제은행(server/qbank.ts).
 * 결과를 셈에 넣고(문장·맞음·보기·고른 보기만 — 학습자가 친 글은 받지 않음), 모자란 열쇠는 키우고, 열쇠마다 지금 묶음을 돌려준다.
 * 모델을 부를 때만 qbankGrow op로 셈. 열쇠는 한 번에 8개, 결과는 60개까지.
 * 점검 사용자(로그인 없이 x-rc-user가 simcheck-…)는 있는 묶음만 받는다 — 풀이 결과를 셈에 넣지 않고(도태에 점검 답이 섞이지 않게)
 * 키우지도 않는다(모두가 같이 쓰는 하루 성장 예산을 쓰지 않게, 2026-11-01 퀴즈 전수 점검).
 */
export async function OPTIONS(request: NextRequest) {
  return corsPreflightResponse(request);
}

type Body = { language?: string; ui?: string; keys?: { key?: string; stage?: number }[]; results?: (BankResult & { key?: string })[]; offers?: { key?: string; text?: string; stage?: number }[] };

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => ({}))) as Body;
  const simUser = isSimRequest(request);
  const language = coerceLanguageCode(body.language);
  const ui = body.ui && INTERFACE_LANGUAGE_LABELS[body.ui] ? body.ui : "en";
  const str = (value: unknown, max: number) => (typeof value === "string" && value.length <= max ? value : "");
  const results = (simUser ? [] : Array.isArray(body.results) ? body.results : []).slice(0, 60).flatMap((one) => {
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
  const debug: Record<string, string> = {};
  for (const key of new Set([...wanted.keys(), ...resultKeys])) {
    const mine = results.filter((one) => one.key === key);
    const entry = await bankFor(language, key, wanted.get(key) ?? 1, mine, wanted.has(key) && !simUser ? meter : undefined).catch(() => null);
    if (entry && wanted.has(key)) banks[key] = await bankView(language, key, entry, ui, meter).catch(() => null);
    if (entry) debug[key] = (entry as { last?: string }).last ?? "";
  }
  // 대화에서 온 튜터 줄(앱이 거른 것, 사용자가 끄지 않았을 때만 옴) — 모델이 한 번 더 판정해 통과한 것만 더함. 점검 사용자는 안 받음.
  const offers = (simUser ? [] : Array.isArray(body.offers) ? body.offers : []).slice(0, 5).flatMap((one) => {
    const key = str(one?.key, 80);
    const text = str(one?.text, 140);
    return key && text ? [{ key, text, stage: Math.min(5, Math.max(1, Math.round(Number(one.stage) || 1))) }] : [];
  });
  const offered = offers.length ? await offerToBank(language, offers, () => void meterRequest(request, "qbankOffer")).catch(() => 0) : 0;
  return jsonWithCors(request, { banks, ...(offers.length ? { offered } : {}), ...(request.headers.get("x-qbank-debug") === "1" ? { debug } : {}) });
}

