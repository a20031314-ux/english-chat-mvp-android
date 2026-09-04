import { NextRequest } from "next/server";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import { meterRequest } from "@/lib/server/meterRequest";
import { VideoPipelineError } from "@/lib/videoSubtitle/errors";
import { glossEnglishLines } from "@/lib/videoSubtitle/glossEnglishLines";
import { asNumber, asRecord, asString } from "@/lib/videoSubtitle/parseModelJson";
import type {
  NormalizedSegment,
  VideoContext,
  VideoContextTerm,
} from "@/lib/videoSubtitle/types";

export const runtime = "nodejs";
export const maxDuration = 180;

function asSegment(value: unknown): NormalizedSegment | null {
  const row = asRecord(value);
  if (!row) return null;
  const id = asString(row.id);
  const normalizedText = asString(row.normalizedText);
  const startTime = asNumber(row.startTime);
  const endTime = asNumber(row.endTime);
  if (!id || !normalizedText || startTime == null || endTime == null) {
    return null;
  }
  return {
    id,
    startTime,
    endTime,
    rawText: asString(row.rawText) || normalizedText,
    normalizedText,
    confidence: asNumber(row.confidence) ?? undefined,
    uncertain: row.uncertain === true,
  };
}

function asTerms(value: unknown): VideoContextTerm[] {
  if (!Array.isArray(value)) return [];
  const terms: VideoContextTerm[] = [];
  for (const item of value) {
    const row = asRecord(item);
    const term = asString(row?.term);
    if (!term) continue;
    terms.push({
      term,
      meaning: asString(row?.meaning) ?? undefined,
      preferredTranslation: asString(row?.preferredTranslation) ?? undefined,
    });
  }
  return terms.slice(0, 40);
}

function asContext(value: unknown): VideoContext | null {
  const row = asRecord(value);
  if (!row) return null;
  return {
    topic: asString(row.topic) || "video",
    domain: asString(row.domain) || "general",
    summary: asString(row.summary) || "",
    speakerStyle: asString(row.speakerStyle) || "spoken",
    terminology: asTerms(row.terminology),
  };
}

export async function OPTIONS(request: NextRequest) {
  return corsPreflightResponse(request);
}

export async function POST(request: NextRequest) {
  void meterRequest(request, "videoGloss");
  let body: {
    locale?: unknown;
    interfaceLanguage?: unknown;
    targetLanguage?: unknown;
    context?: unknown;
    segments?: unknown;
  };
  try {
    body = await request.json();
  } catch {
    return jsonWithCors(request, { error: "Invalid JSON" }, { status: 400 });
  }

  const context = asContext(body.context);
  const segments = Array.isArray(body.segments)
    ? body.segments
        .map(asSegment)
        .filter((row): row is NormalizedSegment => row !== null)
        .slice(0, 800)
    : [];
  if (!context || segments.length === 0) {
    return jsonWithCors(request, { error: "INVALID_GLOSS" }, { status: 400 });
  }

  try {
    const items = await glossEnglishLines({
      locale: asString(body.locale) || "ko",
      interfaceLanguage:
        asString(body.interfaceLanguage) || asString(body.locale) || "ko",
      targetLanguage: asString(body.targetLanguage) || "en",
      context,
      segments,
    });
    return jsonWithCors(request, { items });
  } catch (error) {
    if (error instanceof VideoPipelineError) {
      const status = error.code === "MISSING_OPENAI_KEY" ? 503 : 500;
      return jsonWithCors(request, { error: error.code }, { status });
    }
    console.error("[video-subtitles/gloss]", error);
    return jsonWithCors(
      request,
      { error: "GLOSS_FAILED" },
      { status: 500 },
    );
  }
}
