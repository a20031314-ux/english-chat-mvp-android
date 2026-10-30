import { NextRequest } from "next/server";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import { coerceLanguageCode, INTERFACE_LANGUAGE_LABELS } from "@/lib/learningLanguages";
import { meterRequest } from "@/lib/server/meterRequest";
import { recallPrompts } from "@/lib/server/recallPrompts";
import { frameById } from "@/lib/curriculum/frames";
import type { RecallPrompt } from "@/lib/curriculum/recall";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * GET ?lang=ja&ui=ko&sets=ja-f1-01,ja-f1-01+ja-f1-03 — 꺼내 쓰기 문제(curriculum/recall.ts). 묶음(틀 하나 또는 둘)마다 한 번 만들어
 * 모두가 같이 씀(server/recallPrompts.ts) — 처음 부를 때만 모델(recallPrompts op). 학습자 글은 받지 않는다.
 */
export async function OPTIONS(request: NextRequest) {
  return corsPreflightResponse(request);
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const language = coerceLanguageCode(params.get("lang"));
  const uiParam = params.get("ui") ?? "en";
  const ui = INTERFACE_LANGUAGE_LABELS[uiParam] ? uiParam : "en";
  const sets = [...new Set((params.get("sets") ?? "").split(",").map((set) => set.trim()).filter(Boolean))].slice(0, 6);
  const out: Record<string, RecallPrompt[]> = {};
  let metered = 0;
  await Promise.all(
    sets.map(async (set) => {
      const frames = set.split("+").slice(0, 2).map((id) => frameById(language, id));
      if (!frames.length || frames.some((frame) => !frame)) return;
      out[set] = await recallPrompts(language, frames as NonNullable<(typeof frames)[number]>[], ui, INTERFACE_LANGUAGE_LABELS[ui] ?? "English", () => {
        metered += 1;
        if (metered <= 6) void meterRequest(request, "recallPrompts");
      });
    }),
  );
  return jsonWithCors(request, { prompts: out });
}
