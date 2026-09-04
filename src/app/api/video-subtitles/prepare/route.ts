import { NextRequest } from "next/server";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import { meterRequest } from "@/lib/server/meterRequest";
import {
  assertVideoPrepAllowed,
  recordVideoPrepForRequest,
} from "@/lib/server/videoPrepGate";
import { VideoPipelineError } from "@/lib/videoSubtitle/errors";
import { prepareVideoTranscript } from "@/lib/videoSubtitle/pipeline";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function OPTIONS(request: NextRequest) {
  return corsPreflightResponse(request);
}

export async function POST(request: NextRequest) {
  void meterRequest(request, "videoPrepare");
  let body: {
    videoUrl?: unknown;
    locale?: unknown;
    interfaceLanguage?: unknown;
    targetLanguage?: unknown;
    skipServerAudio?: unknown;
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
  const skipServerAudio = body.skipServerAudio === true;
  try {
    const limits = await assertVideoPrepAllowed(request, { videoUrl });
    const prepared = await prepareVideoTranscript(
      videoUrl,
      locale,
      targetLanguage,
      {
        skipServerAudio: skipServerAudio,
        maxDurationSeconds: limits.maxDurationSeconds,
        remainingPrepSeconds:
          limits.decision.kind === "import"
            ? limits.remainingPrepSeconds
            : undefined,
      },
    );
    await recordVideoPrepForRequest(request, prepared.durationSeconds, videoUrl);
    return jsonWithCors(request, prepared);
  } catch (error) {
    if (error instanceof VideoPipelineError) {
      const status =
        error.code === "MISSING_OPENAI_KEY"
          ? 503
          : error.code === "INVALID_URL"
            ? 400
            : error.code === "CLIENT_AUDIO_REQUIRED"
              ? 409
              : error.code === "VIDEO_QUOTA" ||
                  error.code === "VIDEO_TOO_LONG" ||
                  error.code === "CATALOG_LOCKED" ||
                  error.code === "IMPORT_LOCKED"
                ? 403
                : 422;
      return jsonWithCors(request, { error: error.code }, { status });
    }
    console.error("[video-subtitles/prepare]", error);
    return jsonWithCors(request, { error: "STT_FAILED" }, { status: 500 });
  }
}
