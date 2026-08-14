import { NextRequest } from "next/server";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import { VideoPipelineError } from "@/lib/videoSubtitle/errors";
import { asNumber, asRecord, asString } from "@/lib/videoSubtitle/parseModelJson";
import { translateSubtitleWindow } from "@/lib/videoSubtitle/pipeline";
import type {
  NormalizedSegment,
  VideoContext,
  VideoContextTerm,
} from "@/lib/videoSubtitle/types";

export const runtime = "nodejs";
export const maxDuration = 60;

function asSegment(value: unknown): NormalizedSegment | null {
  const row = asRecord(value);
  if (!row) return null;
  const id = asString(row.id);
  const normalizedText = asString(row.normalizedText);
  const startTime = asNumber(row.startTime);
  const endTime = asNumber(row.endTime);
  if (!id || !normalizedText || startTime == null || endTime == null) return null;
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

function asSegments(value: unknown): NormalizedSegment[] {
  if (!Array.isArray(value)) return [];
  return value
    .map(asSegment)
    .filter((row): row is NormalizedSegment => row !== null)
    .slice(0, 40);
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
    topic: asString(row.topic) || "English video",
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
  let body: {
    locale?: unknown;
    context?: unknown;
    currentSegments?: unknown;
    previousSegments?: unknown;
    nextSegments?: unknown;
  };
  try {
    body = await request.json();
  } catch {
    return jsonWithCors(request, { error: "Invalid JSON" }, { status: 400 });
  }

  const context = asContext(body.context);
  const currentSegments = asSegments(body.currentSegments);
  if (!context || currentSegments.length === 0) {
    return jsonWithCors(request, { error: "INVALID_WINDOW" }, { status: 400 });
  }

  const locale = asString(body.locale) || "ko";

  try {
    const cues = await translateSubtitleWindow({
      locale,
      context,
      currentSegments,
      previousSegments: asSegments(body.previousSegments),
      nextSegments: asSegments(body.nextSegments),
    });
    return jsonWithCors(request, { cues });
  } catch (error) {
    if (error instanceof VideoPipelineError) {
      const status = error.code === "MISSING_OPENAI_KEY" ? 503 : 500;
      return jsonWithCors(request, { error: error.code }, { status });
    }
    console.error("[video-subtitles/window]", error);
    return jsonWithCors(
      request,
      { error: "TRANSLATION_FAILED" },
      { status: 500 },
    );
  }
}
