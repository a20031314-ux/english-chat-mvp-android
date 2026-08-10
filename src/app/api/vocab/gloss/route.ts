import OpenAI from "openai";
import { NextRequest } from "next/server";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";

const MODEL = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

const TARGET_LANGUAGES: Record<string, string> = {
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

type GlossItem = {
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

function normalizeItems(raw: unknown, requested: string[]): GlossItem[] {
  if (!raw || typeof raw !== "object") return [];
  const list = (raw as { items?: unknown }).items;
  if (!Array.isArray(list)) return [];

  const byWord = new Map<string, GlossItem>();
  for (const item of list) {
    if (!item || typeof item !== "object") continue;
    const o = item as Record<string, unknown>;
    if (typeof o.word !== "string" || !o.word.trim()) continue;
    if (typeof o.gloss !== "string" || !o.gloss.trim()) continue;
    byWord.set(o.word.trim().toLowerCase(), {
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

  return requested.map((word) => {
    const found = byWord.get(word.toLowerCase());
    if (found) {
      return { ...found, word };
    }
    return { word, gloss: word };
  });
}

export async function OPTIONS(request: NextRequest) {
  return corsPreflightResponse(request);
}

export async function POST(request: NextRequest) {
  const client = getClient();
  if (!client) {
    return jsonWithCors(request, { error: "MISSING_OPENAI_KEY" }, { status: 503 });
  }

  let body: { words?: unknown; locale?: string };
  try {
    body = await request.json();
  } catch {
    return jsonWithCors(request, { error: "Invalid JSON" }, { status: 400 });
  }

  const words = Array.isArray(body.words)
    ? body.words
        .filter((w): w is string => typeof w === "string")
        .map((w) => w.trim())
        .filter(Boolean)
        .slice(0, 40)
    : [];

  if (words.length === 0) {
    return jsonWithCors(request, { error: "words required" }, { status: 400 });
  }

  const targetLanguage =
    TARGET_LANGUAGES[body.locale ?? ""] ?? TARGET_LANGUAGES.ko;

  try {
    const completion = await client.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content: `You write short learner-friendly glosses for English vocabulary.
Items may be single words OR multi-word phrases / compounds / idioms (e.g. "reading room", "look forward to").
For each item, return:
- word: the same English item (keep multi-word phrases intact; do not split them)
- gloss: short meaning in ${targetLanguage} for the whole item as a unit
- partOfSpeech: optional English tag (noun, verb, adjective, phrase, idiom, …)
- example: optional short English example sentence using the item

Respond with ONLY compact JSON:
{"items":[{"word":"...","gloss":"...","partOfSpeech":"...","example":"..."}]}`,
        },
        {
          role: "user",
          content: JSON.stringify({ words }),
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.2,
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) {
      return jsonWithCors(request, { error: "Empty model response" }, { status: 502 });
    }

    const parsed = JSON.parse(raw) as unknown;
    return jsonWithCors(request, { items: normalizeItems(parsed, words) });
  } catch (error) {
    console.error("[vocab/gloss]", error);
    return jsonWithCors(request, { error: "VOCAB_GLOSS_FAILED" }, { status: 500 });
  }
}
