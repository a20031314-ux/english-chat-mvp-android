import { NextRequest } from "next/server";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import { VideoPipelineError } from "@/lib/videoSubtitle/errors";
import { prepareVideoTranscript } from "@/lib/videoSubtitle/pipeline";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function OPTIONS(request: NextRequest) {
  return corsPreflightResponse(request);
}

export async function POST(request: NextRequest) {
  let body: { videoUrl?: unknown };
  try {
    body = await request.json();
  } catch {
    return jsonWithCors(request, { error: "Invalid JSON" }, { status: 400 });
  }

  const videoUrl = typeof body.videoUrl === "string" ? body.videoUrl : "";
  try {
    const prepared = await prepareVideoTranscript(videoUrl);
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
