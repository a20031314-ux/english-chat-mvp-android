import { NextRequest } from "next/server";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import { meterRequest } from "@/lib/server/meterRequest";
import { VideoPipelineError } from "@/lib/videoSubtitle/errors";
import { transcribeAudio } from "@/lib/videoSubtitle/transcribeAudio";

export const runtime = "nodejs";
export const maxDuration = 120;

const MAX_CHUNK_BYTES = 4 * 1024 * 1024;

export async function OPTIONS(request: NextRequest) {
  return corsPreflightResponse(request);
}

function decodeAudioBase64(raw: unknown): Buffer | null {
  if (typeof raw !== "string" || !raw.trim()) return null;
  const payload = raw.includes(",") && /^\s*data:/i.test(raw)
    ? raw.slice(raw.indexOf(",") + 1)
    : raw;
  try {
    const bytes = Buffer.from(payload.replace(/\s+/g, ""), "base64");
    return bytes.byteLength >= 1000 ? bytes : null;
  } catch {
    return null;
  }
}

async function transcribeBytes(
  request: NextRequest,
  input: {
    bytes: Buffer;
    filename: string;
    mimeType: string;
    startTime: number;
    language?: string;
  },
) {
  if (input.bytes.byteLength > MAX_CHUNK_BYTES) {
    return jsonWithCors(request, { error: "NO_AUDIO" }, { status: 413 });
  }
  try {
    const segments = await transcribeAudio(
      {
        bytes: input.bytes,
        filename: input.filename,
        mimeType: input.mimeType,
      },
      {
        language: input.language,
        offsetSeconds: Number.isFinite(input.startTime)
          ? Math.max(0, input.startTime)
          : 0,
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

export async function POST(request: NextRequest) {
  // Counted as the roleplay's, because that is what sends most of these: the
  // video path submits whole chunks, this submits one spoken turn.
  void meterRequest(request, "roleplayListen");
  const contentType = request.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    let body: {
      audioBase64?: unknown;
      filename?: unknown;
      mimeType?: unknown;
      startTime?: unknown;
      language?: unknown;
    };
    try {
      body = await request.json();
    } catch {
      return jsonWithCors(request, { error: "Invalid JSON" }, { status: 400 });
    }
    const bytes = decodeAudioBase64(body.audioBase64);
    if (!bytes) {
      return jsonWithCors(request, { error: "NO_AUDIO" }, { status: 400 });
    }
    return transcribeBytes(request, {
      bytes,
      filename:
        typeof body.filename === "string" && body.filename.trim()
          ? body.filename
          : "chunk.wav",
      mimeType:
        typeof body.mimeType === "string" && body.mimeType.trim()
          ? body.mimeType
          : "audio/wav",
      startTime: Number(body.startTime ?? 0),
      language:
        typeof body.language === "string" ? body.language : undefined,
    });
  }

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

  return transcribeBytes(request, {
    bytes: Buffer.from(await file.arrayBuffer()),
    filename:
      file instanceof File && file.name.trim() ? file.name : "chunk.wav",
    mimeType: file.type || "audio/wav",
    startTime: Number(form.get("startTime") ?? 0),
    language:
      typeof form.get("language") === "string"
        ? String(form.get("language"))
        : undefined,
  });
}
