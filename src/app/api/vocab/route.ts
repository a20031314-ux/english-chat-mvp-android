import { completeChat } from "@/lib/server/llm";
import { NextRequest } from "next/server";
import { meterRequest } from "@/lib/server/meterRequest";
import { getOpenAIClient } from "@/lib/server/openai";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import { naturalTranslationPrinciples } from "@/lib/naturalTranslation";
import {
  coerceLanguageCode,
  isInterfaceLanguage,
  learningLanguageName,
} from "@/lib/learningLanguages";
import { inLearningScript } from "@/lib/vocabScript";
import { interfaceLanguageDisplayName } from "@/lib/languageLearningAnalysis";
import { assembleVocabLookup, normalizeVocabHeadword } from "@/lib/vocabulary";

type VocabLookupLike = NonNullable<ReturnType<typeof assembleVocabLookup>>;

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
  const client = getOpenAIClient();
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

  void meterRequest(request, "vocabSearch");
  const lookup = async (retry: boolean) => {
    const completion = await completeChat(client, "vocab", {
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

- Never return their search text itself as a word unless it is also an ordinary ${targetName} word.${retry ? `
- Their search is written in ${interfaceName}. Translate its meaning into ${targetName}; every word must be written in ${targetName}.` : ""}

Respond with ONLY compact JSON:
{"results":[{"word":"...","senses":[{"gloss":"...","partOfSpeech":"..."}],"example":"..."}]}`,
        },
        { role: "user", content: query },
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });
    const raw = completion.choices[0]?.message?.content;
    if (!raw) return null;
    return normalizeResults(JSON.parse(raw) as unknown).filter((item) => inLearningScript(item.word, targetLanguage));
  };
  try {
    let results = await lookup(false);
    if (results === null) {
      return jsonWithCors(request, { error: "Empty model response" }, { status: 502 });
    }
    if (results.length === 0) {
      void meterRequest(request, "vocabSearch");
      results = (await lookup(true)) ?? [];
    }
    return jsonWithCors(request, { results });
  } catch (error) {
    console.error("[vocab]", error);
    return jsonWithCors(request, { error: "VOCAB_LOOKUP_FAILED" }, { status: 500 });
  }
}
