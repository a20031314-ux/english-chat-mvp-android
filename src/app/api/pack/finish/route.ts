import { NextRequest } from "next/server";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import { requestUserId } from "@/lib/server/premiumRequest";
import { isIdentified } from "@/lib/server/identity";
import { phraseStates, readPack, writePack } from "@/lib/server/packStore";
import { coerceLanguageCode } from "@/lib/learningLanguages";
import { isPackDay, retro } from "@/lib/pack/pack";

export const dynamic = "force-dynamic";

/**
 * The end of a pack: what it did, and what changed in the learner's record.
 *
 * POST { lang, day } — marks the pack finished (once; asking again returns
 * the same retro, with the ledger read as it is now) and returns { retro }.
 * Every turn was already recorded as it happened (api/roleplay/turn); this
 * only reads it back. No model call.
 */
export async function OPTIONS(request: NextRequest) {
  return corsPreflightResponse(request);
}

export async function POST(request: NextRequest) {
  const userId = requestUserId(request);
  if (!isIdentified(userId)) {
    return jsonWithCors(request, { error: "IDENTITY_REQUIRED" }, { status: 401 });
  }
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return jsonWithCors(request, { error: "Invalid JSON" }, { status: 400 });
  }
  const language = coerceLanguageCode(body.lang);
  if (!isPackDay(body.day)) return jsonWithCors(request, { error: "BAD_DAY" }, { status: 400 });
  const pack = await readPack(userId, language, body.day);
  if (!pack) return jsonWithCors(request, { error: "NO_PACK" }, { status: 404 });
  const finished = pack.finishedAt ? pack : { ...pack, finishedAt: Date.now() };
  if (!pack.finishedAt) await writePack(userId, finished);
  return jsonWithCors(request, { retro: retro(finished, await phraseStates(userId, finished)) });
}
