import { NextRequest } from "next/server";
import { chatModel, getOpenAIClient } from "@/lib/server/openai";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import { naturalTranslationPrinciples } from "@/lib/naturalTranslation";
import {
  coerceLanguageCode,
  isInterfaceLanguage,
  learningLanguageName,
} from "@/lib/learningLanguages";
import { interfaceLanguageDisplayName } from "@/lib/languageLearningAnalysis";
import { assembleVocabLookup, normalizeVocabHeadword } from "@/lib/vocabulary";

type GlossItem = {
  word: string;
  gloss: string;
  senses?: Array<{ gloss: string; partOfSpeech?: string }>;
  example?: string;
  partOfSpeech?: string;
  reading?: string;
};

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
  const client = getOpenAIClient();
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
    typeof body.locale === "string" && isInterfaceLanguage(body.locale)
      ? body.locale
      : "ko";
  const interfaceLanguage =
    typeof body.interfaceLanguage === "string" &&
    isInterfaceLanguage(body.interfaceLanguage)
      ? body.interfaceLanguage
      : locale;
  const targetLanguage = coerceLanguageCode(body.targetLanguage);
  const targetName = learningLanguageName(targetLanguage);
  const interfaceName = interfaceLanguageDisplayName(interfaceLanguage);
  const englishOnlyHeadwords = targetLanguage === "en";
  const characterAware =
    targetLanguage === "ja" ||
    targetLanguage === "zh" ||
    targetLanguage === "ko" ||
    targetLanguage === "ar" ||
    targetLanguage === "th" ||
    targetLanguage === "hi";

  try {
    const completion = await client.chat.completions.create({
      model: chatModel(),
      messages: [
        {
          role: "system",
          content: `You write a compact LEARNER DICTIONARY entry for ${targetName} vocabulary.
This is NOT sentence analysis. Do not explain how the word is used in a nearby chat sentence or idiom.

Items may be single words, multi-word phrases / compounds / idioms.
For each item, return:
- word: the same ${englishOnlyHeadwords ? "English" : targetName} item (keep multi-word phrases intact; do not split them)
- senses: 2–5 distinct ordinary dictionary meanings, most common first
  - gloss: short dictionary meaning in ${interfaceName} of THAT sense
  - partOfSpeech: short tag (noun, verb, adjective, pronoun, phrase, idiom, particle, …)
  - example: one short ${targetName} sentence that illustrates THIS sense. Required.
- reading: ${
            characterAware
              ? targetLanguage === "ja"
                ? "optional reading for kanji/kana items (hiragana; for kanji prefer common 音読み/訓読み the learner needs). Empty for items that need no reading."
                : targetLanguage === "zh"
                  ? "optional pinyin for Chinese characters/words. Empty if not useful."
                  : targetLanguage === "ar"
                    ? "optional simple learner romanization for Arabic. Empty if not useful."
                    : targetLanguage === "th"
                      ? "optional RTGS romanization for Thai. Empty if not useful."
                      : targetLanguage === "hi"
                        ? "optional simple romanization for Hindi. Empty if not useful."
                        : "optional romanization/reading when helpful for Hangul syllables or hanja. Empty if not useful."
              : "omit (leave empty)"
          }

Sense rules:
- Return ONE sense only if the word truly has a single ordinary meaning.
- Common function words and polysemous verbs (it, that, this, get, have, go, make, …) MUST have 3–5 ordinary dictionary senses. Never collapse them into a paraphrase of a greeting or idiom ("How's it going?" is not a definition of it).
- First sense = the most common dictionary meaning, not a sentence-specific reading.
- Each sense needs its own example sentence in ${targetName}.
- Do not list rare, archaic, slang-only, or overly technical senses.
- Do not repeat the same meaning in different wording.
- Do not gloss the surrounding sentence. Gloss THIS headword only.

${
  characterAware
    ? `Reading:
- Japanese: include a kana reading in "reading" when the headword has kanji.
- Chinese: include pinyin in "reading" when useful.
- Korean: optional romanization only for multi-syllable words, not isolated Hangul taps.
- Arabic: optional simple romanization (not Arabic script repeated).
- Thai: optional RTGS romanization.
- Hindi: optional simple romanization.
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
{"items":[{"word":"...","senses":[{"gloss":"...","partOfSpeech":"...","example":"..."}],"reading":"..."}]}`,
        },
        {
          role: "user",
          content: JSON.stringify({
            words,
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
