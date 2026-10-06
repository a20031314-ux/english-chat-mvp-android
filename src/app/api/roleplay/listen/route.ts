import { NextRequest, after } from "next/server";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import { meterRequest } from "@/lib/server/meterRequest";
import { getOpenAIClient } from "@/lib/server/openai";
import { heardOrNothing } from "@/lib/roleplay/transcript";
import { requestUserId } from "@/lib/server/premiumRequest";
import { confidenceFromLogprobs, noteRecognition } from "@/lib/server/learnerMetrics";
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

  const asked = {
    model: turnTranscribeModel(),
    temperature: 0,
    ...(language.length === 2 ? { language } : {}),
    // Says what kind of audio this is, which is most of what stops a model
    // handed half a second of sound from filling the gap with something it
    // has heard often. The language hint alone did not.
    prompt: "One person speaking a single short turn in a casual spoken conversation.",
  };

  try {
    // The words are the same either way. Asked as JSON with token
    // probabilities so the recogniser's confidence can be kept beside the turn
    // (learnerMetrics.ts) — the one figure about a spoken turn nothing else
    // can recover. A model that refuses the option is asked the old way, plain
    // text, so a turn never fails for the sake of a measurement. No timestamps:
    // they are what made the subtitle path slow and a turn has no use for them.
    let raw: string;
    let confidence: number | null = null;
    try {
      const result = await client.audio.transcriptions.create({
        ...asked,
        file: await toFile(bytes, filename, { type: mimeType }),
        response_format: "json",
        include: ["logprobs"],
      });
      raw = result.text;
      confidence = confidenceFromLogprobs((result as { logprobs?: unknown }).logprobs);
    } catch (error) {
      if ((error as { status?: number })?.status !== 400) throw error;
      raw = String(
        await client.audio.transcriptions.create({
          ...asked,
          file: await toFile(bytes, filename, { type: mimeType }),
          response_format: "text",
        }),
      );
    }
    // Checked on the way back as well, because neither the hint nor the prompt
    // is a guarantee: a reply in a script this language does not use was not a
    // transcription of it (roleplay/transcript.ts).
    const text = heardOrNothing(raw, language);
    const userId = requestUserId(request);
    after(() => noteRecognition(userId, text, confidence));
    return jsonWithCors(request, { text });
  } catch (error) {
    console.error("[roleplay/listen]", error);
    return jsonWithCors(request, { error: "STT_FAILED" }, { status: 502 });
  }
}
