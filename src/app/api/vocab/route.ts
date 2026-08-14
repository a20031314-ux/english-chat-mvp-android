import OpenAI from "openai";
import { NextRequest } from "next/server";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import { naturalTranslationPrinciples } from "@/lib/naturalTranslation";

const MODEL = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

const SOURCE_LANGUAGES: Record<string, string> = {
  ko: "Korean",
  en: "English",
  es: "Spanish",
  ja: "Japanese",
  zh: "Simplified Chinese",
  vi: "Vietnamese",
  fr: "French",
  pt: "Portuguese",
  id: "Indonesian",
};

type VocabResult = {
  word: string;
  gloss: string;
  example?: string;
  partOfSpeech?: string;
};

function getClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new OpenAI({ apiKey });
}

function normalizeResults(raw: unknown): VocabResult[] {
  if (!raw || typeof raw !== "object") return [];
  const list = (raw as { results?: unknown }).results;
  if (!Array.isArray(list)) return [];
  const out: VocabResult[] = [];
  for (const item of list) {
    if (!item || typeof item !== "object") continue;
    const o = item as Record<string, unknown>;
    if (typeof o.word !== "string" || !o.word.trim()) continue;
    if (typeof o.gloss !== "string" || !o.gloss.trim()) continue;
    out.push({
      word: o.word.trim(),
      gloss: o.gloss.trim(),
      ...(typeof o.example === "string" && o.example.trim()
        ? { example: o.example.trim() }
        : {}),
      ...(typeof o.partOfSpeech === "string" && o.partOfSpeech.trim()
        ? { partOfSpeech: o.partOfSpeech.trim() }
        : {}),
    });
  }
  return out.slice(0, 8);
}

export async function OPTIONS(request: NextRequest) {
  return corsPreflightResponse(request);
}

export async function POST(request: NextRequest) {
  const client = getClient();
  if (!client) {
    return jsonWithCors(request, { error: "MISSING_OPENAI_KEY" }, { status: 503 });
  }

  let body: { query?: string; locale?: string };
  try {
    body = await request.json();
  } catch {
    return jsonWithCors(request, { error: "Invalid JSON" }, { status: 400 });
  }

  const query = body.query?.trim();
  if (!query) {
    return jsonWithCors(request, { error: "query required" }, { status: 400 });
  }

  const locale =
    typeof body.locale === "string" && body.locale in SOURCE_LANGUAGES
      ? body.locale
      : "ko";
  const sourceLanguage = SOURCE_LANGUAGES[locale];

  try {
    const completion = await client.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content: `You help English learners look up vocabulary.
The user searches in ${sourceLanguage}. Return English headwords that match their meaning.

Rules:
- results: 1–6 useful English words/phrases (prefer common, learnable items).
- word: English only.
- gloss: short natural meaning in ${sourceLanguage} of the whole item (not a word-by-word calque).
- partOfSpeech: optional short tag in English (noun, verb, adjective, phrase, …).
- example: optional short English example sentence using the word.

${naturalTranslationPrinciples({ locale, role: "gloss", sourceType: "unknown" })}

Respond with ONLY compact JSON:
{"results":[{"word":"...","gloss":"...","partOfSpeech":"...","example":"..."}]}`,
        },
        { role: "user", content: query },
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) {
      return jsonWithCors(request, { error: "Empty model response" }, { status: 502 });
    }

    const parsed = JSON.parse(raw) as unknown;
    return jsonWithCors(request, { results: normalizeResults(parsed) });
  } catch (error) {
    console.error("[vocab]", error);
    return jsonWithCors(request, { error: "VOCAB_LOOKUP_FAILED" }, { status: 500 });
  }
}
