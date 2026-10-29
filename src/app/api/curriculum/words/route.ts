import { NextRequest } from "next/server";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import { coerceLanguageCode, INTERFACE_LANGUAGE_LABELS } from "@/lib/learningLanguages";
import { meterRequest } from "@/lib/server/meterRequest";
import { wordCards } from "@/lib/server/wordCards";
import { BANK_CHUNK, hasBank } from "@/lib/curriculum/vocabBank";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * GET ?lang=en&ui=ko&chunk=0 — 빈도 단어 묶음(curriculum/vocabBank.ts)의 50개 묶음 하나의 카드(예문·쓴 꼴·뜻·예문 뜻).
 * 묶음마다 한 번 만들어 모두가 같이 씀(server/wordCards.ts) — 처음 부를 때만 모델(wordCards op). 학습자 글은 받지 않는다.
 */
export async function OPTIONS(request: NextRequest) {
  return corsPreflightResponse(request);
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const language = coerceLanguageCode(params.get("lang"));
  const chunk = Number(params.get("chunk"));
  const uiParam = params.get("ui") ?? "en";
  const ui = INTERFACE_LANGUAGE_LABELS[uiParam] ? uiParam : "en";
  if (!hasBank(language) || !Number.isInteger(chunk) || chunk < 0 || chunk > 200) return jsonWithCors(request, { cards: [], size: BANK_CHUNK });
  let metered = false;
  const cards = await wordCards(language, chunk, ui, INTERFACE_LANGUAGE_LABELS[ui] ?? "English", () => {
    if (metered) return;
    metered = true;
    void meterRequest(request, "wordCards");
  });
  return jsonWithCors(request, { cards, size: BANK_CHUNK });
}
