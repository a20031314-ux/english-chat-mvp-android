import { NextRequest } from "next/server";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import { requestUserId } from "@/lib/server/premiumRequest";
import { isIdentified } from "@/lib/server/identity";
import { ensurePack, growthNow, phraseStates } from "@/lib/server/packStore";
import { coerceLanguageCode } from "@/lib/learningLanguages";
import { isPackDay, packSummary, retro } from "@/lib/pack/pack";
import { packBankFor } from "@/lib/pack/questions";

export const dynamic = "force-dynamic";

/**
 * Today's pack for one learning language (pack/pack.ts), made on first ask.
 *
 * GET ?lang=&day=YYYY-MM-DD — day is the learner's own date, so a pack turns
 * over at their midnight; it may differ from the server's by a day either way.
 *
 * { available: false } where packs are not made in that language yet.
 * Otherwise what the card shows and the practice goal the call is opened with
 * ({ pack: day, phrases }), and the retro once the pack has been finished.
 * No model call; the tutor's words come later, one turn at a time.
 */
export async function OPTIONS(request: NextRequest) {
  return corsPreflightResponse(request);
}

function plausibleDay(day: string, now: number): boolean {
  const at = Date.parse(`${day}T12:00:00Z`);
  return Number.isFinite(at) && Math.abs(at - now) <= 2 * 24 * 60 * 60 * 1000;
}

export async function GET(request: NextRequest) {
  const userId = requestUserId(request);
  if (!isIdentified(userId)) {
    return jsonWithCors(request, { error: "IDENTITY_REQUIRED" }, { status: 401 });
  }
  const language = coerceLanguageCode(request.nextUrl.searchParams.get("lang"));
  const day = request.nextUrl.searchParams.get("day") ?? "";
  const now = Date.now();
  if (!isPackDay(day) || !plausibleDay(day, now)) {
    return jsonWithCors(request, { error: "BAD_DAY" }, { status: 400 });
  }
  if (!packBankFor(language)) return jsonWithCors(request, { language, available: false });
  const pack = await ensurePack(userId, language, day, now);
  if (!pack) return jsonWithCors(request, { language, available: false });
  const summary = packSummary(pack);
  return jsonWithCors(request, {
    language,
    available: true,
    // Bumped when what a pack turn does changes, so a check can tell the deploy is live.
    rules: 2,
    ...summary,
    ...(pack.finishedAt ? { retro: retro(pack, await phraseStates(userId, pack), await growthNow(userId, language)) } : {}),
  });
}
