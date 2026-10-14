import { NextRequest } from "next/server";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import { requestUserId } from "@/lib/server/premiumRequest";
import { isIdentified } from "@/lib/server/identity";
import { recordComprehensionEvents } from "@/lib/server/learnerProfileStore";
import { coerceLanguageCode } from "@/lib/learningLanguages";
import type { ComprehensionEvent } from "@/lib/learner/comprehension";
import { isLedgerTab, type LedgerTab } from "@/lib/learner/ledger";
import { recordMeets, type MeetEvent } from "@/lib/server/ledgerStore";

export const dynamic = "force-dynamic";

/**
 * What the learner did with a tutor's line, sent from the sentence sheet:
 * POST { language, events: [{ kind: "lookup" | "analyze" | "save", text }, …] }.
 * Questions are recorded where they are answered (expression-ask), so they are
 * not sent here. No model is called.
 */
const KINDS = new Set(["lookup", "analyze", "save", "translate"]);
const MAX_EVENTS = 20;

export async function OPTIONS(request: NextRequest) {
  return corsPreflightResponse(request);
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
  const events: ComprehensionEvent[] = (Array.isArray(body.events) ? body.events : [])
    .slice(0, MAX_EVENTS)
    .flatMap((raw): ComprehensionEvent[] => {
      const row = (raw ?? {}) as Record<string, unknown>;
      const kind = typeof row.kind === "string" ? row.kind : "";
      if (!KINDS.has(kind)) return [];
      if (kind === "translate") return [{ kind: "translate" }];
      const text = typeof row.text === "string" ? row.text.slice(0, 120) : "";
      return text.trim() ? [{ kind: kind as "lookup" | "analyze" | "save", text }] : [];
    });
  if (events.length === 0) return jsonWithCors(request, { ok: true, recorded: 0 });
  const language = coerceLanguageCode(body.language);
  // The same taps go into the expression ledger, with the tab they came from
  // (builds from 2.66 send it; older ones count as chat, where these began).
  const meets: MeetEvent[] = (Array.isArray(body.events) ? body.events : [])
    .slice(0, MAX_EVENTS)
    .flatMap((raw): MeetEvent[] => {
      const row = (raw ?? {}) as Record<string, unknown>;
      const kind = row.kind;
      if (kind !== "lookup" && kind !== "analyze" && kind !== "save") return [];
      const text = typeof row.text === "string" ? row.text.slice(0, 120) : "";
      const tab: LedgerTab = isLedgerTab(row.tab) ? row.tab : "chat";
      return text.trim() ? [{ kind, text, tab }] : [];
    });
  const [record] = await Promise.all([
    recordComprehensionEvents(userId, language, events),
    meets.length ? recordMeets(userId, language, meets) : Promise.resolve(),
  ]);
  return jsonWithCors(request, { ok: Boolean(record), recorded: events.length });
}
