import { NextRequest } from "next/server";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import { meterRequest } from "@/lib/server/meterRequest";
import { getOpenAIClient } from "@/lib/server/openai";
import { toFile } from "openai";

export const dynamic = "force-dynamic";

/**
 * What the learner just said, as fast as it can be had.
 *
 * A spoken turn used to go through the video subtitle pipeline, which is built
 * for a different job and charges for it: whisper-1, verbose JSON, segment and
 * word timestamps, and a second transcription of the whole clip if the first
 * one is refused. It also carries a prompt about background music and song
 * lyrics, written for film, which tells a model listening to a person in a
 * quiet room to consider outputting nothing.
 *
 * A turn needs one short string and needs it now. Everything the learner says
 * is followed by silence until this returns, then the character thinking, then
 * the line being synthesised — three waits in a row with a person sitting
 * there, so the one that was paying for subtitle machinery is the one to cut.
 */
function turnTranscribeModel(): string {
  return process.env.OPENAI_TURN_TRANSCRIBE_MODEL?.trim() || "gpt-4o-mini-transcribe";
}

/** A turn is seconds of speech. Anything larger is not one. */
const MAX_TURN_BYTES = 8 * 1024 * 1024;

export async function OPTIONS(request: NextRequest) {
  return corsPreflightResponse(request);
}

export async function POST(request: NextRequest) {
  const client = getOpenAIClient();
  if (!client) {
    return jsonWithCors(request, { error: "MISSING_OPENAI_KEY" }, { status: 503 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return jsonWithCors(request, { error: "Invalid JSON" }, { status: 400 });
  }

  const audioBase64 = typeof body.audioBase64 === "string" ? body.audioBase64 : "";
  if (!audioBase64) {
    return jsonWithCors(request, { error: "NO_AUDIO" }, { status: 400 });
  }
  const bytes = Buffer.from(audioBase64, "base64");
  if (bytes.byteLength === 0 || bytes.byteLength > MAX_TURN_BYTES) {
    return jsonWithCors(request, { error: "NO_AUDIO" }, { status: 413 });
  }

  void meterRequest(request, "roleplayListen");

  const mimeType = typeof body.mimeType === "string" ? body.mimeType : "audio/webm";
  const filename = typeof body.filename === "string" ? body.filename : "turn.webm";
  // Only the base tag: the API takes "en", not "en-US".
  const language =
    typeof body.language === "string"
      ? body.language.trim().toLowerCase().split(/[-_]/)[0]
      : "";

  try {
    const text = await client.audio.transcriptions.create({
      file: await toFile(bytes, filename, { type: mimeType }),
      model: turnTranscribeModel(),
      // Plain text, because that is all a turn is. Timestamps are what made
      // the subtitle path slow and a turn has no use for them.
      response_format: "text",
      temperature: 0,
      ...(language.length === 2 ? { language } : {}),
    });
    return jsonWithCors(request, { text: String(text).trim() });
  } catch (error) {
    console.error("[roleplay/listen]", error);
    return jsonWithCors(request, { error: "STT_FAILED" }, { status: 502 });
  }
}
