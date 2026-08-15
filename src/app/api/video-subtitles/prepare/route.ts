import { NextRequest } from "next/server";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import { VideoPipelineError } from "@/lib/videoSubtitle/errors";
import { prepareVideoTranscript } from "@/lib/videoSubtitle/pipeline";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function OPTIONS(request: NextRequest) {
  return corsPreflightResponse(request);
}

export async function POST(request: NextRequest) {
  let body: {
    videoUrl?: unknown;
    locale?: unknown;
    interfaceLanguage?: unknown;
    targetLanguage?: unknown;
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
  try {
    const prepared = await prepareVideoTranscript(
      videoUrl,
      locale,
      targetLanguage,
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
    console.error("[video-subtitles/prepare]", error);
    return jsonWithCors(request, { error: "STT_FAILED" }, { status: 500 });
  }
}
