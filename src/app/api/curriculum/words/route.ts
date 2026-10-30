import { NextRequest } from "next/server";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import { coerceLanguageCode, INTERFACE_LANGUAGE_LABELS } from "@/lib/learningLanguages";
import { meterRequest } from "@/lib/server/meterRequest";
import { wordCards } from "@/lib/server/wordCards";
import { BANK_CHUNK, hasBank } from "@/lib/curriculum/vocabBank";
import { cardsInUi, extraChunk, extraCount, searchWord } from "@/lib/server/wordExtras";
import { requestUserId } from "@/lib/server/premiumRequest";

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
  // 찾아서 더해진 낱말(server/wordExtras.ts) — ?extra=1이면 개수, &chunk=n이면 그 50개 묶음(앱 언어 뜻).
  if (params.get("extra") === "1") {
    const total = await extraCount(language);
    // &list=1: 낱말 목록만(사전형·품사·주제·읽기) — 앱이 빈도 목록 뒤에 붙여 칸·순서를 계산(카드는 묶음으로 따로).
    if (params.get("list") === "1") {
      const chunks = Math.ceil(total / BANK_CHUNK);
      const all = (await Promise.all(Array.from({ length: chunks }, (_, i) => extraChunk(language, i)))).flat();
      return jsonWithCors(request, { total, words: all.map((one) => [one.w, one.pos, one.topic ?? "", one.reading ?? "", one.stage ?? 6]) });
    }
    if (!Number.isInteger(chunk) || chunk < 0 || chunk * BANK_CHUNK >= total) return jsonWithCors(request, { cards: [], total, size: BANK_CHUNK });
    const cards = await cardsInUi(language, await extraChunk(language, chunk), ui, () => void meterRequest(request, "wordCards"));
    return jsonWithCors(request, { cards, total, size: BANK_CHUNK });
  }
  if (!hasBank(language) || !Number.isInteger(chunk) || chunk < 0 || chunk > 200) return jsonWithCors(request, { cards: [], size: BANK_CHUNK });
  let metered = false;
  const cards = await wordCards(language, chunk, ui, INTERFACE_LANGUAGE_LABELS[ui] ?? "English", () => {
    if (metered) return;
    metered = true;
    void meterRequest(request, "wordCards");
  });
  return jsonWithCors(request, { cards, size: BANK_CHUNK });
}

/**
 * POST { lang, word, ui } — 단어장에서 찾은 낱말(2026-10-31 사용자 "은행에 없는 단어를 검색하면 자동 추가 → 다른 사용자에게 반영").
 * 빈도 목록에 있으면 "bank", 누가 이미 더했으면 "extra"(카드), 없으면 모델이 확인·카드를 만들어 모두의 추가 목록에 "added".
 * 실제 낱말이 아니면 "invalid", 하루 한도·언어 한도면 "limit". 만들 때만 wordAdd op로 셈.
 */
export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => ({}))) as { lang?: string; word?: string; ui?: string };
  const language = coerceLanguageCode(body.lang);
  const ui = body.ui && INTERFACE_LANGUAGE_LABELS[body.ui] ? body.ui : "en";
  const word = typeof body.word === "string" ? body.word.slice(0, 60) : "";
  const result = await searchWord(language, word, requestUserId(request), () => void meterRequest(request, "wordAdd"));
  const card = result.card ? (await cardsInUi(language, [result.card], ui))[0] : undefined;
  return jsonWithCors(request, { ...result, ...(card ? { card } : {}) });
}
