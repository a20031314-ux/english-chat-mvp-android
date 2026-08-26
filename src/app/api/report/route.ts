import { NextRequest } from "next/server";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import {
  isReportReason,
  REPORT_EXCERPT_MAX,
  REPORT_NOTE_MAX,
} from "@/lib/reportContent";

export const dynamic = "force-dynamic";

const SURFACES = ["chat", "call", "analysis", "subtitle"];

function asText(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function OPTIONS(request: NextRequest) {
  return corsPreflightResponse(request);
}

/**
 * Records a learner's report of AI-generated content. There is no moderation
 * database yet, so a report lands in the server log where it can be read and
 * acted on; the learner is told either way.
 */
export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return jsonWithCors(request, { error: "Invalid JSON" }, { status: 400 });
  }

  const reason = body.reason;
  if (!isReportReason(reason)) {
    return jsonWithCors(request, { error: "reason required" }, { status: 400 });
  }

  const surface = asText(body.surface, 20);
  const report = {
    surface: SURFACES.includes(surface) ? surface : "chat",
    reason,
    excerpt: asText(body.excerpt, REPORT_EXCERPT_MAX),
    note: asText(body.note, REPORT_NOTE_MAX),
    locale: asText(body.locale, 10),
    learningLanguage: asText(body.learningLanguage, 10),
    at: new Date().toISOString(),
  };

  console.error("[content-report]", JSON.stringify(report));
  return jsonWithCors(request, { ok: true });
}
