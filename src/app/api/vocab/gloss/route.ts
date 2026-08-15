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
};

type GlossItem = {
  word: string;
  gloss: string;
  senses?: Array<{ gloss: string; partOfSpeech?: string }>;
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
    const assembled = assembleVocabLookup(
      typeof (item as { word?: unknown }).word === "string"
        ? (item as { word: string }).word
        : "",
      item as Record<string, unknown>,
    );
    if (!assembled) continue;
    byWord.set(glossLookupKey(assembled.word), assembled);
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
    contextSentence?: unknown;
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
  const contextSentence =
    typeof body.contextSentence === "string"
      ? body.contextSentence.replace(/\s+/g, " ").trim().slice(0, 280)
      : "";

  try {
    const completion = await client.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content: `You write short dictionary-style glosses for ${targetName} vocabulary.
Items may be single words, multi-word phrases / compounds / idioms.
For each item, return:
- word: the same ${englishOnlyHeadwords ? "English" : targetName} item (keep multi-word phrases intact; do not split them)
- senses: 1–5 distinct learner meanings, most useful first
  - gloss: short meaning in ${interfaceName} of that sense
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
- example: omit unless one short ${targetName} sentence for the FIRST sense is truly helpful. Never write an example per sense.

Sense rules:
- If the word/phrase has only one ordinary meaning, return ONE sense.
- If it is polysemous, first sense = ${
            contextSentence
              ? "the meaning used in the given context sentence"
              : "the most common learner meaning"
          }. Then other common meanings a beginner/intermediate should know.
- Do not list rare, archaic, slang-only, or overly technical senses.
- Do not repeat the same meaning in different wording.

${
  characterAware
    ? `Reading:
- Japanese: include a kana reading in "reading" when the headword has kanji.
- Chinese: include pinyin in "reading" when useful.
- Korean: optional romanization only for multi-syllable words, not isolated Hangul taps.
- Do not invent rare readings; prefer the most common learner-facing reading.
- Do not treat a single character or syllable as a lookup item; gloss the word/phrase as given.
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
{"items":[{"word":"...","senses":[{"gloss":"...","partOfSpeech":"..."}],"reading":"...","example":"..."}]}`,
        },
        {
          role: "user",
          content: JSON.stringify({
            words,
            ...(contextSentence ? { contextSentence } : {}),
          }),
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
