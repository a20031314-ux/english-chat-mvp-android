import { NextRequest } from "next/server";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import { requestUserId } from "@/lib/server/premiumRequest";
import { isIdentified } from "@/lib/server/identity";
import { readLedger, recordMeets, type MeetEvent } from "@/lib/server/ledgerStore";
import { isLedgerTab, ledgerItems, summarize } from "@/lib/learner/ledger";
import { coerceLanguageCode } from "@/lib/learningLanguages";

export const dynamic = "force-dynamic";

/**
 * The expression ledger for one learning language (learner/ledger.ts).
 *
 * GET ?lang=  — the summary (counts, this week, retention, where things were
 *               first met, a row per week) and the phrases, most recent first.
 * POST { language, meets: [{ kind: "save", text, tab }] } — phrases saved on
 *               the device before the ledger existed (the word list), sent
 *               once. Saves only; looking things up arrives through
 *               /api/learner/comprehension with the tab it came from.
 *
 * No model is called.
 */
const MAX_MEETS = 50;

export async function OPTIONS(request: NextRequest) {
  return corsPreflightResponse(request);
}

export async function GET(request: NextRequest) {
  const userId = requestUserId(request);
  if (!isIdentified(userId)) {
    return jsonWithCors(request, { error: "IDENTITY_REQUIRED" }, { status: 401 });
  }
  const language = coerceLanguageCode(request.nextUrl.searchParams.get("lang"));
  const ledger = await readLedger(userId, language);
  return jsonWithCors(request, {
    language,
    summary: summarize(ledger),
    items: ledgerItems(ledger, undefined, 300).map((item) => ({
      text: item.text,
      state: item.state,
      firstMet: item.firstMet,
      lastOutput: item.outputs[item.outputs.length - 1] ?? null,
      understood: Boolean(item.understood),
      onMap: Boolean(item.map),
      lastAt: item.lastAt,
    })),
  });
}

export async function POST(request: NextRequest) {
  const userId = requestUserId(request);
  if (!isIdentified(userId)) {
    return jsonWithCors(request, { error: "IDENTITY_REQUIRED" }, { status: 401 });
  }
  let body: Record<string, unknown> = {};
  try {
    body = await request.json();
  } catch {
    return jsonWithCors(request, { error: "Invalid JSON" }, { status: 400 });
  }
  const meets: MeetEvent[] = (Array.isArray(body.meets) ? body.meets : [])
    .slice(0, MAX_MEETS)
    .flatMap((raw): MeetEvent[] => {
      const row = (raw ?? {}) as Record<string, unknown>;
      const text = typeof row.text === "string" ? row.text.slice(0, 120) : "";
      if (row.kind !== "save" || !text.trim() || !isLedgerTab(row.tab)) return [];
      return [{ kind: "save", text, tab: row.tab }];
    });
  if (meets.length) await recordMeets(userId, coerceLanguageCode(body.language), meets);
  return jsonWithCors(request, { ok: true, recorded: meets.length });
}
