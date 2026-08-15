import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";
import { corsHeaders, corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import {
  spokenFormForTts,
  speechLangPrefix,
  ttsSpeechInstructions,
} from "@/lib/speech";

export const dynamic = "force-dynamic";

const MODEL = process.env.OPENAI_TTS_MODEL ?? "gpt-4o-mini-tts";
const MAX_CHARS = 2000;

function getClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  return new OpenAI({ apiKey });
}

function streamHeaders(request: NextRequest, lang: string): Record<string, string> {
  return {
    ...corsHeaders(request),
    "Content-Type": "application/octet-stream",
    "Cache-Control": "private, max-age=3600",
    "X-Accel-Buffering": "no",
    "X-Speech-Lang": speechLangPrefix(lang),
    "X-TTS-Format": "pcm_s16le_24k",
  };
}

async function synthesize(request: NextRequest, rawText: string, rawLang: string) {
  const client = getClient();
  if (!client) {
    return jsonWithCors(request, { error: "MISSING_OPENAI_KEY" }, { status: 503 });
  }

  const text = rawText.trim();
  if (!text) {
    return jsonWithCors(request, { error: "text required" }, { status: 400 });
  }
  if (text.length > MAX_CHARS) {
    return jsonWithCors(request, { error: "text too long" }, { status: 400 });
  }

  const lang = rawLang.trim() || "en-US";
  const spoken = spokenFormForTts(text, lang);
  const useInstructions = !MODEL.startsWith("tts-1");

  try {
    const speech = await client.audio.speech.create({
      model: MODEL,
      voice: "nova",
      input: spoken,
      response_format: "pcm",
      ...(useInstructions
        ? {
            instructions: ttsSpeechInstructions(lang),
            stream_format: "audio",
          }
        : {}),
    });
    const body = speech.body;
    if (!body) {
      const bytes = Buffer.from(await speech.arrayBuffer());
      return new NextResponse(bytes, {
        status: 200,
        headers: streamHeaders(request, lang),
      });
    }
    return new NextResponse(body, {
      status: 200,
      headers: streamHeaders(request, lang),
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
  return synthesize(request, text, lang);
}

export async function POST(request: NextRequest) {
  let body: { text?: unknown; lang?: unknown };
  try {
    body = await request.json();
  } catch {
    return jsonWithCors(request, { error: "Invalid JSON" }, { status: 400 });
  }

  const text = typeof body.text === "string" ? body.text : "";
  const lang = typeof body.lang === "string" ? body.lang : "en-US";
  return synthesize(request, text, lang);
}
