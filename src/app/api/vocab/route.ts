import OpenAI from "openai";
import { NextRequest } from "next/server";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import { naturalTranslationPrinciples } from "@/lib/naturalTranslation";
import {
  coerceLanguageCode,
  learningLanguageName,
} from "@/lib/learningLanguages";
import { interfaceLanguageDisplayName } from "@/lib/languageLearningAnalysis";
import { assembleVocabLookup, normalizeVocabHeadword } from "@/lib/vocabulary";

const MODEL = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

const INTERFACE_LANGUAGES: Record<string, string> = {
  ko: "Korean",
  en: "English",
  es: "Spanish",
  ja: "Japanese",
  zh: "Simplified Chinese",
  vi: "Vietnamese",
  fr: "French",
  pt: "Portuguese",
  id: "Indonesian",
  it: "Italian",
  ru: "Russian",
};

type VocabLookupLike = NonNullable<ReturnType<typeof assembleVocabLookup>>;

function getClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new OpenAI({ apiKey });
}

function normalizeResults(raw: unknown): VocabLookupLike[] {
  if (!raw || typeof raw !== "object") return [];
  const list = (raw as { results?: unknown }).results;
  if (!Array.isArray(list)) return [];
  const out: VocabLookupLike[] = [];
  for (const item of list) {
    if (!item || typeof item !== "object") continue;
    const o = item as Record<string, unknown>;
    const word = typeof o.word === "string" ? o.word : "";
    const assembled = assembleVocabLookup(word, o);
    if (!assembled) continue;
    out.push(assembled);
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

  let body: {
    query?: string;
    locale?: string;
    interfaceLanguage?: string;
    targetLanguage?: string;
  };
  try {
    body = await request.json();
  } catch {
    return jsonWithCors(request, { error: "Invalid JSON" }, { status: 400 });
  }

  const query = normalizeVocabHeadword(body.query || "") || body.query?.trim();
  if (!query) {
    return jsonWithCors(request, { error: "query required" }, { status: 400 });
  }

  const locale =
    typeof body.locale === "string" && body.locale in INTERFACE_LANGUAGES
      ? body.locale
      : "ko";
  const interfaceLanguage =
    typeof body.interfaceLanguage === "string" &&
    body.interfaceLanguage in INTERFACE_LANGUAGES
      ? body.interfaceLanguage
      : locale;
  const targetLanguage = coerceLanguageCode(body.targetLanguage);
  const targetName = learningLanguageName(targetLanguage);
  const interfaceName =
    INTERFACE_LANGUAGES[interfaceLanguage] ??
    interfaceLanguageDisplayName(interfaceLanguage);
  const englishOnlyHeadwords = targetLanguage === "en";

  try {
    const completion = await client.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content: `You help ${targetName} learners look up vocabulary.
The user searches in ${interfaceName} (or mixed). Return ${targetName} headwords that match their meaning.

Rules:
- results: 1–6 useful ${targetName} words/phrases (prefer common, learnable items).
- word: ${englishOnlyHeadwords ? "English only" : `${targetName} only`}.
- senses: 1–5 distinct learner meanings, most useful first.
  - gloss: short natural meaning in ${interfaceName} of that sense (not a word-by-word calque).
  - partOfSpeech: optional short tag (noun, verb, adjective, phrase, …).
- If the word has only one ordinary meaning, return one sense. If polysemous, include other common meanings a learner should know. Skip rare/archaic senses.
- example: omit unless one short ${targetName} sentence for the first sense is helpful. Never write an example per sense.

${naturalTranslationPrinciples({
  locale: interfaceLanguage,
  targetLanguage,
  interfaceLanguage,
  role: "gloss",
  sourceType: "unknown",
})}

Respond with ONLY compact JSON:
{"results":[{"word":"...","senses":[{"gloss":"...","partOfSpeech":"..."}],"example":"..."}]}`,
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
