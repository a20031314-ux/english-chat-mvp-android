import { NextRequest, NextResponse } from "next/server";
import { corsHeaders, corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import { meterRequest } from "@/lib/server/meterRequest";
import { getOpenAIClient } from "@/lib/server/openai";
import { coerceLanguageCode } from "@/lib/learningLanguages";
import { serverTutorGender, tutorGenderOfVoice, tutorVoice } from "@/lib/chatPartner";
import { personaVoice } from "@/lib/tutorPersona";
import { isTtsVoice } from "@/lib/roleplay/voices";
import { realtimeSpeech } from "@/lib/server/realtimeSpeech";
import { voxtralConfigured, voxtralEnabled, voxtralRawStream, voxtralReference, voxtralSpeech, voxtralSpeed, voxtralStream, voxtralVoices } from "@/lib/server/voxtralSpeech";
import { stretchStream } from "@/lib/server/timeStretch";
import { parseTutorSpeed } from "@/lib/tutorSpeedValue";
import { realtimeTtsModel, trialValue, wantsTrialReport } from "@/lib/server/speechModels";
import {
  isKanaMora,
  spokenFormForTts,
  speechLangPrefix,
  sceneSpeechInstructions,
  ttsSpeechInstructions,
} from "@/lib/speech";

export const dynamic = "force-dynamic";

// 엔진: Voxtral(id·th 빼고) → 첫 소리 전에 실패하면 Realtime(gpt-realtime-2.1-mini). 모델 이름은 server/speechModels.ts.
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
  rawTutor?: unknown,
  trialRef?: unknown,
  rawSpeed?: unknown,
) {
  // 사람마다 고른 말 빠르기(lib/tutorSpeed.ts, 0.8~1.2 — 1이면 안 보냄). 주소에 들어가 캐시도 빠르기별로 따로.
  const speed = parseTutorSpeed(rawSpeed);
  if (!getOpenAIClient()) {
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
  // 장면 목소리가 없으면 그 언어 튜터의 목소리 — 고른 여자·남자(`tutor` f|m, lib/tutorGender.ts), 안 보낸 예전 앱은 그 언어의 예전 튜터(2026-11-01).
  const voice = isTtsVoice(rawVoice)
    ? rawVoice
    : tutorVoice(coerceLanguageCode(speechLangPrefix(lang)), serverTutorGender(coerceLanguageCode(speechLangPrefix(lang)), rawTutor));
  // 튜터 목소리면 그 사람의 목소리·어조 지시를 덧붙인다(lib/tutorPersona.ts, 2026-11-02) — Realtime(id·th, Voxtral 실패 때)과
  // Voxtral 참고 소리 만들기(scripts/voice-refs.mjs)가 같은 사람으로 읽게.
  const speechLanguage = coerceLanguageCode(speechLangPrefix(lang));
  const tutorWho = tutorGenderOfVoice(speechLanguage, voice);
  const character = tutorWho ? personaVoice(speechLanguage, tutorWho) : "";
  const baseDelivery = isTtsVoice(rawVoice) ? sceneSpeechInstructions(lang) : ttsSpeechInstructions(lang);
  const delivery = character ? `${baseDelivery}\n\nThe speaker: ${character}` : baseDelivery;
  const shared = mayBeShared(request, rawVoice);

  // 목소리 후보 Voxtral(점검 사용자만, 2026-11-01 — 통화 원가 낮추기 비교): x-tts-engine: voxtral, 목소리는 x-tts-voxtral-voice(slug·id),
  // x-tts-voxtral-voices: 1이면 목록만. 결과는 점검 보고 모양(JSON, wav base64)으로만 — 앱 재생 경로에는 붙이지 않았다.
  if (trialValue(request, "x-tts-engine") === "voxtral") {
    if (!voxtralConfigured()) return jsonWithCors(request, { error: "MISSING_MISTRAL_KEY" }, { status: 503 });
    if (trialValue(request, "x-tts-voxtral-voices") === "1") return jsonWithCors(request, await voxtralVoices(Number(trialValue(request, "x-tts-voxtral-offset")) || 0));
    const refAudio = typeof trialRef === "string" && trialRef ? trialRef : undefined;
    if (trialValue(request, "x-tts-voxtral-stream")) {
      return jsonWithCors(request, await voxtralRawStream({ text: spoken, voice: trialValue(request, "x-tts-voxtral-voice"), refAudio, format: trialValue(request, "x-tts-voxtral-stream") }));
    }
    const made = await voxtralSpeech({ text: spoken, voice: trialValue(request, "x-tts-voxtral-voice"), model: trialValue(request, "x-tts-voxtral-model"), refAudio });
    if (!made.ok) return jsonWithCors(request, { engine: "voxtral", status: made.status, error: made.error }, { status: 502 });
    return jsonWithCors(request, { engine: "voxtral", spoken, ms: made.ms, wavBase64: made.wav.toString("base64") });
  }

  // 기본 엔진 Voxtral(2026-11-02, id·th 빼고 — 튜터의 지금 목소리를 흉내, server/voxtralSpeech.ts). 점검 머리글 x-tts-engine: realtime이면 Realtime.
  // 첫 소리 전에 실패하면 아래 Realtime으로 — 소리가 안 나는 것보다 낫다.
  const languageCode = coerceLanguageCode(speechLangPrefix(lang));
  const reference = voxtralReference(languageCode, voice);
  const forcedEngine = trialValue(request, "x-tts-engine");
  // 가나 한 박자(あ, きゃ)를 튜터 목소리에 맡기면 다른 문장을 지어 낸다. 그 소리만 읽는 엔진으로 보낸다.
  const kanaMora = isKanaMora(spoken);
  if (reference && voxtralEnabled() && !kanaMora && forcedEngine !== "realtime") {
    const started = Date.now();
    try {
      // 점검 사용자는 x-tts-voxtral-speed로 빠르기를 견줘 볼 수 있다.
      const audio = await voxtralStream({ text: spoken, refAudio: reference, speed: voxtralSpeed(trialValue(request, "x-tts-voxtral-speed") || (speed !== 1 ? String(speed) : undefined)) });
      if (wantsTrialReport(request)) {
        const chunks: Uint8Array[] = [];
        const reader = audio.getReader();
        for (;;) {
          const next = await reader.read();
          if (next.done) break;
          chunks.push(next.value);
        }
        const pcm = Buffer.concat(chunks);
        return jsonWithCors(request, { engine: "voxtral", voice, spoken, audioSeconds: pcm.byteLength / 48000, pcmBase64: pcm.toString("base64"), ms: Date.now() - started });
      }
      return new NextResponse(audio, { status: 200, headers: streamHeaders(request, lang, shared) });
    } catch (error) {
      console.error("[tts] voxtral failed, falling back:", error);
    }
  }

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
  // 첫 소리가 오기 전에 실패하면 오류 — Realtime 뒤 대비는 없다.
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
    return new NextResponse(stretchStream(body, speed), { status: 200, headers: streamHeaders(request, lang, shared) });
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
  return synthesize(request, text, lang, request.nextUrl.searchParams.get("voice"), request.nextUrl.searchParams.get("tutor"), undefined, request.nextUrl.searchParams.get("speed"));
}

export async function POST(request: NextRequest) {
  let body: { text?: unknown; lang?: unknown; voice?: unknown; tutor?: unknown; refAudio?: unknown; speed?: unknown };
  try {
    body = await request.json();
  } catch {
    return jsonWithCors(request, { error: "Invalid JSON" }, { status: 400 });
  }

  const text = typeof body.text === "string" ? body.text : "";
  const lang = typeof body.lang === "string" ? body.lang : "en-US";
  // refAudio: 점검 사용자만(x-tts-engine: voxtral일 때만 읽음) — 목소리 흉내 비교.
  return synthesize(request, text, lang, body.voice, body.tutor, body.refAudio, body.speed);
}
