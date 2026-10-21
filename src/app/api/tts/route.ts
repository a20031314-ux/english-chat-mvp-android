import { NextRequest, NextResponse } from "next/server";
import { corsHeaders, corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import { meterRequest } from "@/lib/server/meterRequest";
import { getOpenAIClient } from "@/lib/server/openai";
import { coerceLanguageCode } from "@/lib/learningLanguages";
import { realtimeCallVoice } from "@/lib/realtimeCallSession";
import { isTtsVoice } from "@/lib/roleplay/voices";
import { realtimeSpeech } from "@/lib/server/realtimeSpeech";
import { realtimeTtsModel, speechTtsModel, ttsEngine, wantsTrialReport } from "@/lib/server/speechModels";
import {
  spokenFormForTts,
  speechLangPrefix,
  sceneSpeechInstructions,
  ttsSpeechInstructions,
} from "@/lib/speech";

export const dynamic = "force-dynamic";

// 모델은 server/speechModels.ts에서 고른다(gpt-4o-mini-tts 2027-01-06 종료 → Realtime으로 옮기는 중).
const MAX_CHARS = 2000;

/**
 * How long a cached line is worth keeping.
 *
 * A year, because the answer cannot go stale: the same words in the same voice
 * are the same audio, and the URL carries both. A line that changes is a
 * different URL.
 */
const CACHE_SECONDS = 365 * 24 * 60 * 60;

/**
 * Whether this response may be kept and handed to somebody else.
 *
 * Only a line said in a scene's own voice. That is the character speaking —
 * words this app wrote, in a voice it chose — and two learners who reach the
 * same line deserve the same recording rather than two syntheses of it.
 *
 * Everything else stays private. The chat speaks whatever is in front of it,
 * which can be a sentence the learner wrote, and a shared cache is the wrong
 * place for that however small the risk of anyone finding it.
 */
function mayBeShared(request: NextRequest, rawVoice: unknown): boolean {
  return request.method === "GET" && isTtsVoice(rawVoice);
}

function streamHeaders(
  request: NextRequest,
  lang: string,
  shared = false,
): Record<string, string> {
  return {
    ...corsHeaders(request),
    // A shared response is stored once and handed to whoever asks next, and the
    // allowed origin is normally the asking origin echoed back — so the copy
    // that gets stored carries whichever origin happened to warm it. Measured:
    // a request from one origin was served a header naming another. The audio
    // is not credentialed and belongs to nobody, so it is opened to everyone
    // rather than split into one cache entry per origin, which would undo the
    // caching it is in aid of.
    ...(shared ? { "Access-Control-Allow-Origin": "*" } : {}),
    "Content-Type": "application/octet-stream",
    // The bank of recorded lines names its files after a hash of the voice and
    // the text (roleplay/script.ts) for the same reason this works: identical
    // words in one voice are one recording. Here the URL is the hash.
    "Cache-Control": shared
      ? `public, max-age=${CACHE_SECONDS}, s-maxage=${CACHE_SECONDS}, immutable`
      : "private, max-age=3600",
    "X-Accel-Buffering": "no",
    "X-Speech-Lang": speechLangPrefix(lang),
    "X-TTS-Format": "pcm_s16le_24k",
  };
}

async function synthesize(
  request: NextRequest,
  rawText: string,
  rawLang: string,
  rawVoice?: unknown,
) {
  const client = getOpenAIClient();
  if (!client) {
    return jsonWithCors(request, { error: "MISSING_OPENAI_KEY" }, { status: 503 });
  }

  // Counted here, which is inside the function — so once a line is cached at
  // the edge, the repeats do not reach this and are not counted. That is the
  // right meaning for a cost meter: this counts syntheses performed, and the
  // gap between it and how often lines are spoken is what the cache is saving.
  await meterRequest(request, "tts");

  const text = rawText.trim();
  if (!text) {
    return jsonWithCors(request, { error: "text required" }, { status: 400 });
  }
  if (text.length > MAX_CHARS) {
    return jsonWithCors(request, { error: "text too long" }, { status: 400 });
  }

  const lang = rawLang.trim() || "en-US";
  const spoken = spokenFormForTts(text, lang);
  const MODEL = speechTtsModel();
  const useInstructions = !MODEL.startsWith("tts-1");
  const voice = isTtsVoice(rawVoice) ? rawVoice : realtimeCallVoice(coerceLanguageCode(speechLangPrefix(lang)));
  const delivery = isTtsVoice(rawVoice) ? sceneSpeechInstructions(lang) : ttsSpeechInstructions(lang);
  const shared = mayBeShared(request, rawVoice);

  if (ttsEngine(request) === "realtime") {
    const started = Date.now();
    const made = realtimeSpeech({ apiKey: process.env.OPENAI_API_KEY ?? "", model: realtimeTtsModel(), voice, text: spoken, delivery });
    if (wantsTrialReport(request)) {
      // 점검: 소리를 다 모아 읽은 말·토큰·시간과 함께(점검 사용자만 이 머리글이 먹는다).
      const chunks: Uint8Array[] = [];
      try {
        for await (const chunk of made.audio as unknown as AsyncIterable<Uint8Array>) chunks.push(chunk);
      } catch {}
      const report = await made.done;
      const pcm = Buffer.concat(chunks);
      return jsonWithCors(request, {
        engine: "realtime",
        model: realtimeTtsModel(),
        voice,
        spoken,
        ...report,
        audioSeconds: pcm.byteLength / 48000,
        pcmBase64: pcm.toString("base64"),
        ms: Date.now() - started,
      });
    }
    // 첫 소리가 오기 전에 실패하면 예전 방식으로(사람에게는 소리가 안 나는 것보다 낫다).
    const reader = made.audio.getReader();
    try {
      const first = await reader.read();
      const body = new ReadableStream<Uint8Array>({
        start(controller) {
          if (first.value) controller.enqueue(first.value);
          if (first.done) controller.close();
        },
        async pull(controller) {
          const next = await reader.read().catch(() => ({ done: true as const, value: undefined }));
          if (next.done) controller.close();
          else controller.enqueue(next.value);
        },
        cancel() {
          void reader.cancel();
        },
      });
      return new NextResponse(body, { status: 200, headers: streamHeaders(request, lang, shared) });
    } catch (error) {
      console.error("[tts] realtime failed, falling back:", error);
    }
  }

  try {
    const speech = await client.audio.speech.create({
      model: MODEL,
      // The same voice the call uses for this language. They were different —
      // "nova" here, "ash" or "cedar" on the call — which is fine while the two
      // never meet, and wrong the moment a spoken line and a live tutor belong
      // to the same conversation: the tutor changes person mid-sentence.
      //
      // A roleplay scene passes its own voice, so a line the director wrote on
      // the spot comes out of the same mouth as the recorded ones around it.
      // Anything else — including every build that predates the parameter —
      // gets the call's voice exactly as before.
      voice,
      input: spoken,
      response_format: "pcm",
      ...(useInstructions
        ? {
            // A scene's own voice is a character speaking, and it has to
            // match the lines recorded into the app beside it. Those were made
            // with a character brief (scripts/build-roleplay-audio.mjs); this
            // route's usual one is about pronunciation and language leakage,
            // written for chat and video, and says nothing about who is
            // talking. Same voice name, two different performances — reported
            // from a phone as the tutor not sounding like one person.
            //
            // The role itself is not carried here. It would have to ride in the
            // URL, and the URL is the cache key: every warmed line would miss
            // and every build that does not send it would be inconsistent
            // again. Role-neutral gets the delivery back without any of that.
            instructions: delivery,
            stream_format: "audio",
          }
        : {}),
    });
    if (wantsTrialReport(request)) {
      const pcm = Buffer.from(await speech.arrayBuffer());
      return jsonWithCors(request, { engine: "speech", model: MODEL, voice, spoken, audioSeconds: pcm.byteLength / 48000, pcmBase64: pcm.toString("base64") });
    }
    const body = speech.body;
    if (!body) {
      const bytes = Buffer.from(await speech.arrayBuffer());
      return new NextResponse(bytes, {
        status: 200,
        headers: streamHeaders(request, lang, shared),
      });
    }
    return new NextResponse(body, {
      status: 200,
      headers: streamHeaders(request, lang, shared),
    });
  } catch (error) {
    console.error("TTS failed:", error);
    return jsonWithCors(request, { error: "TTS_FAILED" }, { status: 502 });
  }
}

export async function OPTIONS(request: NextRequest) {
  return corsPreflightResponse(request);
}

export async function GET(request: NextRequest) {
  const text = request.nextUrl.searchParams.get("text") ?? "";
  const lang = request.nextUrl.searchParams.get("lang") ?? "en-US";
  return synthesize(request, text, lang, request.nextUrl.searchParams.get("voice"));
}

export async function POST(request: NextRequest) {
  let body: { text?: unknown; lang?: unknown; voice?: unknown };
  try {
    body = await request.json();
  } catch {
    return jsonWithCors(request, { error: "Invalid JSON" }, { status: 400 });
  }

  const text = typeof body.text === "string" ? body.text : "";
  const lang = typeof body.lang === "string" ? body.lang : "en-US";
  return synthesize(request, text, lang, body.voice);
}
