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

type IncomingItem = {
  id: string;
  sourceType?: string;
  type?: string;
  concept?: string;
  originalSentence?: string;
  correctedSentence?: string;
  explanation?: string;
  word?: string;
  gloss?: string;
  example?: string;
  sourceReportId?: string | null;
  sourceMessageId?: string | null;
};

type GeneratedQuestion = {
  sourceId: string;
  learningPointId: string;
  sourceType: "conversation_error" | "saved_vocabulary" | "saved_expression";
  type: "grammar" | "vocabulary" | "expression";
  concept: string;
  prompt: string;
  choices: string[];
  correctIndex: number;
  explanation: string;
  sourceHint: string;
};

function getClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  return new OpenAI({ apiKey });
}

function normalizeSourceType(
  value: unknown,
  item: IncomingItem,
): GeneratedQuestion["sourceType"] {
  if (
    value === "conversation_error" ||
    value === "saved_vocabulary" ||
    value === "saved_expression"
  ) {
    return value;
  }
  if (
    item.sourceType === "conversation_error" ||
    item.sourceType === "saved_vocabulary" ||
    item.sourceType === "saved_expression"
  ) {
    return item.sourceType;
  }
  if (item.word) {
    return /\s/.test(item.word) ? "saved_expression" : "saved_vocabulary";
  }
  return "conversation_error";
}

function normalizeType(
  value: unknown,
  fallback?: string,
): GeneratedQuestion["type"] {
  if (value === "grammar" || value === "vocabulary" || value === "expression") {
    return value;
  }
  if (
    fallback === "grammar" ||
    fallback === "vocabulary" ||
    fallback === "expression"
  ) {
    return fallback;
  }
  return "vocabulary";
}

function defaultHint(locale: string, sourceType: GeneratedQuestion["sourceType"]) {
  if (sourceType === "saved_vocabulary" || sourceType === "saved_expression") {
    if (locale === "ko") return "단어장에 저장한 표현이에요.";
    if (locale === "es") return "Lo guardaste en tu vocabulario.";
    return "This came from your saved vocabulary.";
  }
  if (locale === "ko") return "최근 대화에서 헷갈렸던 내용이에요.";
  if (locale === "es") return "Esto salió de una conversación reciente.";
  return "This came from a recent conversation.";
}

function sanitizeQuestions(
  raw: unknown,
  items: IncomingItem[],
  locale: string,
): GeneratedQuestion[] {
  if (!raw || typeof raw !== "object") return [];
  const list = (raw as { questions?: unknown }).questions;
  if (!Array.isArray(list)) return [];

  const byId = new Map(items.map((p) => [p.id, p]));
  const out: GeneratedQuestion[] = [];

  for (const item of list) {
    if (!item || typeof item !== "object") continue;
    const o = item as Record<string, unknown>;
    const sourceId =
      typeof o.sourceId === "string"
        ? o.sourceId
        : typeof o.learningPointId === "string"
          ? o.learningPointId
          : "";
    const source = byId.get(sourceId);
    if (!source) continue;
    if (typeof o.prompt !== "string" || !o.prompt.trim()) continue;
    if (!Array.isArray(o.choices)) continue;
    const choices = o.choices
      .filter((c): c is string => typeof c === "string" && c.trim() !== "")
      .map((c) => c.trim())
      .slice(0, 4);
    if (choices.length < 2) continue;
    const correctIndex =
      typeof o.correctIndex === "number" &&
      Number.isInteger(o.correctIndex) &&
      o.correctIndex >= 0 &&
      o.correctIndex < choices.length
        ? o.correctIndex
        : -1;
    if (correctIndex < 0) continue;

    const prompt = o.prompt.trim();
    const sourceType = normalizeSourceType(o.sourceType, source);

    if (sourceType === "conversation_error") {
      const orig = (source.originalSentence || "")
        .replace(/\s+/g, " ")
        .toLowerCase();
      const corr = (source.correctedSentence || "")
        .replace(/\s+/g, " ")
        .toLowerCase();
      const promptNorm = prompt.replace(/\s+/g, " ").toLowerCase();
      if (orig && (promptNorm.includes(orig) || promptNorm === corr)) continue;
    } else {
      const example = (source.example || "").replace(/\s+/g, " ").toLowerCase();
      const promptNorm = prompt.replace(/\s+/g, " ").toLowerCase();
      if (example && promptNorm === example) continue;
    }

    out.push({
      sourceId,
      learningPointId: sourceId,
      sourceType,
      type: normalizeType(o.type, source.type),
      concept:
        typeof o.concept === "string" && o.concept.trim()
          ? o.concept.trim()
          : source.concept || source.word || "Review",
      prompt,
      choices,
      correctIndex,
      explanation:
        typeof o.explanation === "string" && o.explanation.trim()
          ? o.explanation.trim()
          : (source.explanation || source.gloss || "").trim() ||
            "Remember how this is used in context.",
      sourceHint:
        typeof o.sourceHint === "string" && o.sourceHint.trim()
          ? o.sourceHint.trim()
          : defaultHint(locale, sourceType),
    });
  }

  return out;
}

export async function OPTIONS(request: NextRequest) {
  return corsPreflightResponse(request);
}

export async function POST(request: NextRequest) {
  const client = getClient();
  if (!client) {
    return jsonWithCors(request, { error: "MISSING_OPENAI_KEY" }, { status: 503 });
  }

  let body: { locale?: string; items?: IncomingItem[]; points?: IncomingItem[] };
  try {
    body = await request.json();
  } catch {
    return jsonWithCors(request, { error: "Invalid JSON" }, { status: 400 });
  }

  const locale =
    typeof body.locale === "string" && body.locale in TARGET_LANGUAGES
      ? body.locale
      : "en";
  const language = TARGET_LANGUAGES[locale] ?? "English";

  const rawItems = Array.isArray(body.items)
    ? body.items
    : Array.isArray(body.points)
      ? body.points
      : [];

  const items = rawItems
    .filter((p) => p && typeof p.id === "string")
    .filter((p) => {
      if (p.sourceType === "saved_vocabulary" || p.sourceType === "saved_expression") {
        return typeof p.word === "string" && p.word.trim() !== "";
      }
      if (typeof p.word === "string" && p.word.trim()) return true;
      return (
        typeof p.originalSentence === "string" &&
        typeof p.correctedSentence === "string"
      );
    })
    .slice(0, 8);

  if (items.length === 0) {
    return jsonWithCors(request, { error: "items required" }, { status: 400 });
  }

  const system = `You create personalized English review quiz questions for a language learner.

Sources may be:
1) conversation_error — past grammar/word/expression mistakes
2) saved_vocabulary / saved_expression — words or phrases the learner saved

Goals:
- Test whether they can USE the knowledge in a NEW context.
- Do NOT ask bare translation quizzes like "hesitate = ?" with L1 gloss options as the default style.
- Prefer contextual English: fill-in-the-blank, choose natural sentence, choose correct word/phrase in a sentence.
- For saved words/phrases: create a NEW sentence (not a copy of the saved example) that uses the target naturally, with 3–4 options.
- For conversation errors: identify the concept, then write a DIFFERENT situation testing the same concept. Do not reuse originalSentence.
- Exactly one clear correct answer. Avoid ambiguity.
- Keep other vocabulary easy so the learner is tested on the target concept/word.
- explanation and sourceHint in ${language}, 1–2 short sentences.
- prompt and choices in English.
- type: grammar | vocabulary | expression
- sourceType must match the input item.

Return ONLY valid JSON:
{"questions":[{"sourceId":"...","learningPointId":"...","sourceType":"saved_vocabulary","type":"vocabulary","concept":"hesitate","prompt":"She didn't ___ to ask for help.","choices":["hesitate","refuse","prevent"],"correctIndex":0,"explanation":"...","sourceHint":"..."}]}

Create exactly one question per input item (same sourceId).`;

  const userPayload = {
    locale,
    items: items.map((p) => ({
      id: p.id,
      sourceType: p.sourceType ?? (p.word ? "saved_vocabulary" : "conversation_error"),
      type: p.type ?? null,
      concept: p.concept ?? null,
      originalSentence: p.originalSentence ?? null,
      correctedSentence: p.correctedSentence ?? null,
      explanation: p.explanation ?? "",
      word: p.word ?? null,
      gloss: p.gloss ?? null,
      example: p.example ?? null,
    })),
  };

  try {
    const completion = await client.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: system },
        { role: "user", content: JSON.stringify(userPayload) },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) {
      return jsonWithCors(request, { error: "QUIZ_EMPTY" }, { status: 500 });
    }

    const parsed = JSON.parse(raw) as unknown;
    const questions = sanitizeQuestions(parsed, items, locale);
    if (questions.length === 0) {
      return jsonWithCors(request, { error: "QUIZ_INVALID" }, { status: 500 });
    }

    return jsonWithCors(request, { questions });
  } catch (error) {
    console.error("[quiz]", error);
    return jsonWithCors(request, { error: "QUIZ_FAILED" }, { status: 500 });
  }
}
