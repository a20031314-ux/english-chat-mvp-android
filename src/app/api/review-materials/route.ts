import OpenAI from "openai";
import { NextRequest } from "next/server";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import { interfaceLanguageName, isInterfaceLanguage } from "@/lib/learningLanguages";
import { explanationLanguageGuard } from "@/lib/languageLearningAnalysis";
import { naturalTranslationPrinciples } from "@/lib/naturalTranslation";

const MODEL = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

type GrammarSeed = {
  id: string;
  title?: string;
  original?: string;
  corrected?: string;
  explanation?: string;
  examples?: string[];
};

type VocabSeed = {
  id: string;
  word: string;
  gloss?: string;
  context?: string;
};

type GrammarCard = {
  kind: "grammar";
  id: string;
  title: string;
  explanation: string;
  original: string;
  corrected: string;
  examples: string[];
};

type VocabCard = {
  kind: "vocabulary";
  id: string;
  word: string;
  senses: Array<{ gloss: string; examples: string[] }>;
  similar: Array<{ word: string; gloss: string }>;
};

function getClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  return new OpenAI({ apiKey });
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is string => typeof item === "string" && item.trim() !== "")
    .map((item) => item.trim())
    .slice(0, 4);
}

/** True when a non-English locale explanation is mostly English filler. */
function explanationWrongLanguage(text: string, locale: string): boolean {
  const trimmed = text.trim();
  if (!trimmed || locale === "en") return false;
  const latin = (trimmed.match(/[A-Za-z]/g) || []).length;
  if (locale === "ko") {
    const hangul = (trimmed.match(/[\uac00-\ud7af]/g) || []).length;
    return latin >= 12 && hangul < Math.max(4, latin * 0.25);
  }
  if (locale === "ja") {
    const kanaKanji =
      (trimmed.match(/[\u3040-\u30ff\u3400-\u9fff]/g) || []).length;
    return latin >= 12 && kanaKanji < Math.max(4, latin * 0.25);
  }
  if (locale === "zh") {
    const han = (trimmed.match(/[\u3400-\u9fff]/g) || []).length;
    return latin >= 12 && han < Math.max(4, latin * 0.25);
  }
  if (locale === "ar") {
    const arabic = (trimmed.match(/[\u0600-\u06ff]/g) || []).length;
    return latin >= 12 && arabic < Math.max(4, latin * 0.25);
  }
  if (locale === "th") {
    const thai = (trimmed.match(/[\u0e00-\u0e7f]/g) || []).length;
    return latin >= 12 && thai < Math.max(4, latin * 0.25);
  }
  if (locale === "hi") {
    const hindi = (trimmed.match(/[\u0900-\u097f]/g) || []).length;
    return latin >= 12 && hindi < Math.max(4, latin * 0.25);
  }
  return false;
}

function isGenericGrammarFiller(text: string): boolean {
  const lower = text.trim().toLowerCase();
  if (!lower) return true;
  return (
    /this (phrase|expression|sentence|structure) is useful/.test(lower) ||
    /softens the request/.test(lower) ||
    /making it more courteous/.test(lower) ||
    /politely expressing a desire/.test(lower) ||
    /this is a (common|polite|natural) (way|phrase)/.test(lower) ||
    /useful for politely/.test(lower)
  );
}

function pickGrammarExplanation(
  generated: string,
  source: GrammarSeed,
  locale: string,
): string {
  const candidate = generated.trim();
  const fallback = (source.explanation || "").trim();
  if (
    candidate &&
    !explanationWrongLanguage(candidate, locale) &&
    !isGenericGrammarFiller(candidate)
  ) {
    return candidate;
  }
  if (
    fallback &&
    !explanationWrongLanguage(fallback, locale) &&
    !isGenericGrammarFiller(fallback)
  ) {
    return fallback;
  }
  return fallback || candidate;
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
    locale?: string;
    grammar?: GrammarSeed[];
    vocabulary?: VocabSeed[];
  };
  try {
    body = await request.json();
  } catch {
    return jsonWithCors(request, { error: "Invalid JSON" }, { status: 400 });
  }

  const locale =
    typeof body.locale === "string" && isInterfaceLanguage(body.locale)
      ? body.locale
      : "ko";
  const language = interfaceLanguageName(locale);
  const grammar = (Array.isArray(body.grammar) ? body.grammar : [])
    .filter(
      (item) =>
        item &&
        typeof item.id === "string" &&
        item.original?.trim() &&
        item.corrected?.trim() &&
        item.original.trim().toLowerCase() !== item.corrected.trim().toLowerCase(),
    )
    .slice(0, 16);
  const vocabulary = (Array.isArray(body.vocabulary) ? body.vocabulary : [])
    .filter((item) => item && typeof item.id === "string" && item.word?.trim())
    .slice(0, 16);

  if (grammar.length === 0 && vocabulary.length === 0) {
    return jsonWithCors(request, { error: "items required" }, { status: 400 });
  }

  const system = `You create English review study cards from ONE session report. This is NOT a quiz.
Use only the items given. Do not invent extra grammar or words from other lessons.

${explanationLanguageGuard({
  interfaceLanguage: locale,
  fieldsDescription: "explanation and glosses",
})}
Keep example sentences in English.

Grammar cards (each item is a real learner mistake: original → corrected):
- Do NOT write a title.
- explanation: 1-2 short ${language} sentences naming WHAT was wrong and WHY the corrected form is right, tied to THIS pair. Be concrete (tense, article, preposition, word order, agreement, etc.).
- Forbidden filler (any language): "this phrase is useful", "softens the request", "more courteous", "politely expressing a desire", vague praise with no grammar point.
- Do not repeat the original or corrected sentence as the whole explanation.
- examples: 2-3 NEW English sentences using the same grammar point. Never reuse original, corrected, or the same sentence twice.

Vocabulary cards:
- If the word has multiple common meanings, give 2-3 senses. Each sense: gloss in ${language} + 1-2 English examples.
- If mainly one meaning, still give 2-3 varied example sentences in one sense.
- similar: 2-4 related or easily confused words, each with a short gloss in ${language}.
- Gloss the item as a unit. Idioms/phrasals are one meaning, not each word.

${naturalTranslationPrinciples({
  locale,
  interfaceLanguage: locale,
  targetLanguage: "en",
  role: "gloss",
  sourceType: "report",
})}

Return ONLY JSON:
{"cards":[
  {"kind":"grammar","id":"...","explanation":"...","original":"...","corrected":"...","examples":["..."]},
  {"kind":"vocabulary","id":"...","word":"light","senses":[{"gloss":"...","examples":["..."]}],"similar":[{"word":"bright","gloss":"..."}]}
]}`;

  try {
    const completion = await client.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: system },
        {
          role: "user",
          content: JSON.stringify({ locale, language, grammar, vocabulary }),
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.4,
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) {
      return jsonWithCors(request, { error: "REVIEW_EMPTY" }, { status: 500 });
    }

    const parsed = JSON.parse(raw) as { cards?: unknown };
    const grammarById = new Map(grammar.map((item) => [item.id, item]));
    const vocabById = new Map(vocabulary.map((item) => [item.id, item]));
    const cards: Array<GrammarCard | VocabCard> = [];

    for (const item of Array.isArray(parsed.cards) ? parsed.cards : []) {
      if (!item || typeof item !== "object") continue;
      const o = item as Record<string, unknown>;
      const id = typeof o.id === "string" ? o.id : "";
      if (o.kind === "grammar") {
        const source = grammarById.get(id);
        if (!source) continue;
        const original = source.original || "";
        const corrected = source.corrected || "";
        const blocked = new Set(
          [original, corrected].map((text) =>
            text.replace(/\s+/g, " ").trim().toLowerCase(),
          ),
        );
        const examples = asStringArray(o.examples).filter((example) => {
          const key = example.replace(/\s+/g, " ").trim().toLowerCase();
          if (!key || blocked.has(key)) return false;
          blocked.add(key);
          return true;
        });
        const explanation = pickGrammarExplanation(
          typeof o.explanation === "string" ? o.explanation : "",
          source,
          locale,
        );
        if (!explanation.trim()) continue;
        if (examples.length === 0 && !(source.examples && source.examples.length)) {
          continue;
        }
        cards.push({
          kind: "grammar",
          id,
          title: "",
          explanation,
          original,
          corrected,
          examples:
            examples.length > 0
              ? examples
              : asStringArray(source.examples).filter((example) => {
                  const key = example.replace(/\s+/g, " ").trim().toLowerCase();
                  return key && !blocked.has(key);
                }),
        });
        continue;
      }
      if (o.kind === "vocabulary") {
        const source = vocabById.get(id);
        if (!source) continue;
        const sensesRaw = Array.isArray(o.senses) ? o.senses : [];
        const senses = sensesRaw
          .map((sense) => {
            if (!sense || typeof sense !== "object") return null;
            const s = sense as Record<string, unknown>;
            const gloss = typeof s.gloss === "string" ? s.gloss.trim() : "";
            const examples = asStringArray(s.examples);
            if (!gloss || examples.length === 0) return null;
            if (explanationWrongLanguage(gloss, locale)) return null;
            return { gloss, examples };
          })
          .filter((sense): sense is { gloss: string; examples: string[] } => sense !== null)
          .slice(0, 3);
        if (senses.length === 0) {
          const gloss = (source.gloss || "").trim();
          if (gloss && source.context?.trim()) {
            senses.push({ gloss, examples: [source.context.trim()] });
          } else {
            continue;
          }
        }
        const similar = (Array.isArray(o.similar) ? o.similar : [])
          .map((row) => {
            if (!row || typeof row !== "object") return null;
            const s = row as Record<string, unknown>;
            const word = typeof s.word === "string" ? s.word.trim() : "";
            const gloss = typeof s.gloss === "string" ? s.gloss.trim() : "";
            if (!word || !gloss) return null;
            if (explanationWrongLanguage(gloss, locale)) return null;
            return { word, gloss };
          })
          .filter((row): row is { word: string; gloss: string } => row !== null)
          .slice(0, 4);
        cards.push({
          kind: "vocabulary",
          id,
          word:
            typeof o.word === "string" && o.word.trim()
              ? o.word.trim()
              : source.word,
          senses,
          similar,
        });
      }
    }

    if (cards.length === 0) {
      return jsonWithCors(request, { error: "REVIEW_INVALID" }, { status: 500 });
    }

    return jsonWithCors(request, { cards });
  } catch (error) {
    console.error("[review-materials]", error);
    return jsonWithCors(request, { error: "REVIEW_FAILED" }, { status: 500 });
  }
}
