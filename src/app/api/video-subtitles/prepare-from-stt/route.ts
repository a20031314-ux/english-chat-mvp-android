import { NextRequest } from "next/server";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import { asNumber, asRecord, asString } from "@/lib/videoSubtitle/parseModelJson";
import { VideoPipelineError } from "@/lib/videoSubtitle/errors";
import { prepareVideoTranscript } from "@/lib/videoSubtitle/pipeline";
import type { SttSegment } from "@/lib/videoSubtitle/types";

export const runtime = "nodejs";
export const maxDuration = 180;

function asSegment(value: unknown): SttSegment | null {
  const row = asRecord(value);
  if (!row) return null;
  const id = asString(row.id);
  const text = asString(row.text);
  const startTime = asNumber(row.startTime);
  const endTime = asNumber(row.endTime);
  if (!id || !text || startTime == null || endTime == null) return null;
  return {
    id,
    text,
    startTime,
    endTime,
    confidence: asNumber(row.confidence) ?? undefined,
    uncertain: row.uncertain === true,
  };
}

export async function OPTIONS(request: NextRequest) {
  return corsPreflightResponse(request);
}

export async function POST(request: NextRequest) {
  let body: {
    videoUrl?: unknown;
    locale?: unknown;
    interfaceLanguage?: unknown;
    targetLanguage?: unknown;
    segments?: unknown;
  };
  try {
    body = await request.json();
  } catch {
    return jsonWithCors(request, { error: "Invalid JSON" }, { status: 400 });
  }

  const videoUrl = typeof body.videoUrl === "string" ? body.videoUrl : "";
  const locale =
    (typeof body.interfaceLanguage === "string" && body.interfaceLanguage) ||
    (typeof body.locale === "string" && body.locale) ||
    "ko";
  const targetLanguage =
    typeof body.targetLanguage === "string" && body.targetLanguage
      ? body.targetLanguage
      : "en";
  const segments = Array.isArray(body.segments)
    ? body.segments
        .map(asSegment)
        .filter((row): row is SttSegment => row !== null)
        .slice(0, 800)
    : [];

  if (segments.length === 0) {
    return jsonWithCors(request, { error: "NO_SPEECH" }, { status: 422 });
  }

  try {
    const prepared = await prepareVideoTranscript(
      videoUrl,
      locale,
      targetLanguage,
      { sttOverride: segments },
    );
    return jsonWithCors(request, prepared);
  } catch (error) {
    if (error instanceof VideoPipelineError) {
      const status =
        error.code === "MISSING_OPENAI_KEY"
          ? 503
          : error.code === "INVALID_URL"
            ? 400
            : 422;
      return jsonWithCors(request, { error: error.code }, { status });
    }
    console.error("[video-subtitles/prepare-from-stt]", error);
    return jsonWithCors(request, { error: "STT_FAILED" }, { status: 500 });
  }
}
