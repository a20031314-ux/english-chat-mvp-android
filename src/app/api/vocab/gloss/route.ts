import OpenAI from "openai";
import { NextRequest } from "next/server";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import { naturalTranslationPrinciples } from "@/lib/naturalTranslation";
import {
  coerceLanguageCode,
  learningLanguageName,
} from "@/lib/learningLanguages";
import { interfaceLanguageDisplayName } from "@/lib/languageLearningAnalysis";
import { normalizeVocabHeadword } from "@/lib/vocabulary";

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
};

type GlossItem = {
  word: string;
  gloss: string;
  example?: string;
  partOfSpeech?: string;
  reading?: string;
};

function getClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new OpenAI({ apiKey });
}

function glossLookupKey(word: string): string {
  return normalizeVocabHeadword(word).toLowerCase();
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
    const word = normalizeVocabHeadword(o.word);
    const gloss = o.gloss.trim();
    if (!word || !gloss) continue;
    byWord.set(glossLookupKey(word), {
      word,
      gloss,
      ...(typeof o.example === "string" && o.example.trim()
        ? { example: o.example.trim() }
        : {}),
      ...(typeof o.partOfSpeech === "string" && o.partOfSpeech.trim()
        ? { partOfSpeech: o.partOfSpeech.trim() }
        : {}),
      ...(typeof o.reading === "string" && o.reading.trim()
        ? { reading: o.reading.trim() }
        : {}),
    });
  }

  return requested.map((word) => {
    const normalized = normalizeVocabHeadword(word) || word.trim();
    const found = byWord.get(glossLookupKey(normalized));
    if (found) {
      return { ...found, word: normalized };
    }
    return { word: normalized, gloss: "" };
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

  let body: {
    words?: unknown;
    locale?: string;
    interfaceLanguage?: string;
    targetLanguage?: string;
  };
  try {
    body = await request.json();
  } catch {
    return jsonWithCors(request, { error: "Invalid JSON" }, { status: 400 });
  }

  const words = Array.isArray(body.words)
    ? body.words
        .filter((w): w is string => typeof w === "string")
        .map((w) => normalizeVocabHeadword(w))
        .filter(Boolean)
        .slice(0, 40)
    : [];

  if (words.length === 0) {
    return jsonWithCors(request, { error: "words required" }, { status: 400 });
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
  const characterAware =
    targetLanguage === "ja" ||
    targetLanguage === "zh" ||
    targetLanguage === "ko";

  try {
    const completion = await client.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content: `You write short learner-friendly glosses for ${targetName} vocabulary.
Items may be single words, multi-word phrases / compounds / idioms${
            characterAware
              ? ", OR single characters / syllables that learners tap for meaning"
              : ""
          }.
For each item, return:
- word: the same ${englishOnlyHeadwords ? "English" : targetName} item (keep multi-word phrases intact; do not split them)
- gloss: short meaning in ${interfaceName} for the whole item as a unit
- partOfSpeech: optional short tag (noun, verb, adjective, phrase, idiom, particle, kanji, character, …)
- reading: ${
            characterAware
              ? targetLanguage === "ja"
                ? "optional reading for kanji/kana items (hiragana; for kanji prefer common 音読み/訓読み the learner needs). Empty for items that need no reading."
                : targetLanguage === "zh"
                  ? "optional pinyin for Chinese characters/words. Empty if not useful."
                  : "optional romanization/reading when helpful for Hangul syllables or hanja. Empty if not useful."
              : "omit (leave empty)"
          }
- example: optional short ${targetName} example sentence using the item

${
  characterAware
    ? `Character rules:
- If the item is a single character, explain THAT character (meaning + how it is used), not a random longer word.
- Japanese kanji: include reading in "reading". Particles/okurigana: say the grammatical role briefly in gloss.
- Chinese characters: include pinyin in "reading" when useful.
- Do not invent rare readings; prefer the most common learner-facing reading.
`
    : ""
}

${naturalTranslationPrinciples({
  locale: interfaceLanguage,
  targetLanguage,
  interfaceLanguage,
  role: "gloss",
  sourceType: "unknown",
})}

Respond with ONLY compact JSON:
{"items":[{"word":"...","gloss":"...","partOfSpeech":"...","reading":"...","example":"..."}]}`,
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
