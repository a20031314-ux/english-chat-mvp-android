import { NextRequest } from "next/server";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import { VideoPipelineError } from "@/lib/videoSubtitle/errors";
import { transcribeAudio } from "@/lib/videoSubtitle/transcribeAudio";

export const runtime = "nodejs";
export const maxDuration = 120;

const MAX_CHUNK_BYTES = 4 * 1024 * 1024;

export async function OPTIONS(request: NextRequest) {
  return corsPreflightResponse(request);
}

export async function POST(request: NextRequest) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return jsonWithCors(request, { error: "Invalid form" }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof Blob) || file.size < 1000) {
    return jsonWithCors(request, { error: "NO_AUDIO" }, { status: 400 });
  }
  if (file.size > MAX_CHUNK_BYTES) {
    return jsonWithCors(request, { error: "NO_AUDIO" }, { status: 413 });
  }

  const startTime = Number(form.get("startTime") ?? 0);
  const language =
    typeof form.get("language") === "string"
      ? String(form.get("language"))
      : undefined;
  const filename =
    file instanceof File && file.name.trim()
      ? file.name
      : "chunk.wav";
  const mimeType = file.type || "audio/wav";

  try {
    const bytes = Buffer.from(await file.arrayBuffer());
    const segments = await transcribeAudio(
      {
        bytes,
        filename,
        mimeType,
      },
      {
        language,
        offsetSeconds: Number.isFinite(startTime) ? Math.max(0, startTime) : 0,
      },
    );
    return jsonWithCors(request, { segments });
  } catch (error) {
    if (error instanceof VideoPipelineError) {
      const status = error.code === "MISSING_OPENAI_KEY" ? 503 : 422;
      return jsonWithCors(request, { error: error.code }, { status });
    }
    console.error("[video-subtitles/transcribe-chunk]", error);
    return jsonWithCors(request, { error: "STT_FAILED" }, { status: 500 });
  }
}
