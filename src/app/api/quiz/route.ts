import OpenAI from "openai";
import { NextRequest } from "next/server";
import {
  isWellFormedBlankFill,
  repairQuizBlank,
} from "@/lib/quizBlank";
import {
  isGrammarQuizSource,
  isVocabularyStyleQuestion,
} from "@/lib/quizGrammar";
import { sanitizeQuizExplanation } from "@/lib/quizExplanation";
import {
  filledChoices,
  hasUniqueLocalAnswer,
  TARGET_QUIZ_SIZE,
} from "@/lib/quizUniqueness";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import { interfaceLanguageName, isInterfaceLanguage } from "@/lib/learningLanguages";

const MODEL = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

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
  example?: string;
  choiceNotes?: string[];
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
    if (!/_{2,}/.test(prompt)) continue;

    const repaired = repairQuizBlank(prompt, choices, correctIndex);
    if (!repaired) continue;
    if (
      !isWellFormedBlankFill(
        repaired.prompt,
        repaired.choices[correctIndex] ?? "",
      )
    ) {
      continue;
    }
    if (
      isVocabularyStyleQuestion(
        repaired.prompt,
        repaired.choices,
        typeof o.type === "string" ? o.type : undefined,
      )
    ) {
      continue;
    }
    if (
      !hasUniqueLocalAnswer(repaired.prompt, repaired.choices, correctIndex)
    ) {
      continue;
    }

    const sourceType = normalizeSourceType(o.sourceType, source);

    if (sourceType === "conversation_error") {
      const orig = (source.originalSentence || "")
        .replace(/\s+/g, " ")
        .toLowerCase();
      const corr = (source.correctedSentence || "")
        .replace(/\s+/g, " ")
        .toLowerCase();
      const promptNorm = repaired.prompt.replace(/\s+/g, " ").toLowerCase();
      if (orig && (promptNorm.includes(orig) || promptNorm === corr)) continue;
    } else {
      const example = (source.example || "").replace(/\s+/g, " ").toLowerCase();
      const promptNorm = prompt.replace(/\s+/g, " ").toLowerCase();
      if (example && promptNorm === example) continue;
    }

    out.push({
      sourceId,
      learningPointId: sourceId,
      sourceType: "conversation_error",
      type: "grammar",
      concept:
        typeof o.concept === "string" && o.concept.trim()
          ? o.concept.trim()
          : source.concept || source.word || "Review",
      prompt: repaired.prompt,
      choices: repaired.choices,
      correctIndex,
      explanation: sanitizeQuizExplanation({
        explanation: typeof o.explanation === "string" ? o.explanation : "",
        prompt: repaired.prompt,
        choices: repaired.choices,
        correctIndex,
        locale,
        sourceExplanation: source.explanation,
        originalSentence: source.originalSentence,
        correctedSentence: source.correctedSentence,
      }),
      sourceHint:
        typeof o.sourceHint === "string" && o.sourceHint.trim()
          ? o.sourceHint.trim()
          : defaultHint(locale, sourceType),
      example:
        typeof o.example === "string" && o.example.trim()
          ? o.example.trim()
          : undefined,
      choiceNotes: Array.isArray(o.choiceNotes)
        ? o.choiceNotes.map((note) =>
            typeof note === "string" ? note.trim() : "",
          )
        : undefined,
    });
  }

  return out;
}

function quizSystemPrompt(language: string) {
  return `You create personalized English GRAMMAR review quiz questions for a language learner.

Hard rules:
- Create ONLY grammar / structure questions (tense, word order, articles, clause patterns, locked collocations like wait for, suggest that).
- Do NOT create vocabulary meaning quizzes.
- Exactly ONE choice must be correct in THIS context. If two choices both make natural English with only a nuance difference, DO NOT use that item.
  Forbidden: "What can I do ___ my future?" + for/with/about
  Those are all possible; different meanings. Discard or rewrite with a context sentence that makes only one natural.
- After writing the item, mentally insert EVERY choice into the blank. Keep the item only if exactly one completed sentence is grammatical AND natural.
- Reject doubled words (that that, to to), subject-verb clashes (The teacher suggest), and mismatched blank/choice spans.
- For prepositions, synonyms, collocations, and tense: add a short context sentence BEFORE the blank sentence so only one answer fits.
  Good:
  "You were 20 minutes late.\\nI've been waiting ___ you."
  choices: ["for","about","to"]
- Distractors must be actually ungrammatical or clearly wrong in this context (wrong form, wrong structure), not just "another possible meaning".
- Prompt may be two lines (context + blank sentence). Use exactly one ___ blank.
- New situation, not a copy of originalSentence.
- explanation, choiceNotes, sourceHint entirely in ${language}.
- explanation: why THIS choice is right in THIS sentence (meaning + structure). Include a short extra example. Do not mention the learner's old chat sentence. Do not say only "this structure is correct".
- choiceNotes: one note per choice, same order as choices. Correct choice: the meaning. Wrong choices: why that completed sentence fails HERE, or how its meaning would differ if it exists in English.
- example: one short English example sentence using the correct pattern.
- prompt and choices in English.
- type: grammar. sourceType: conversation_error.

Return ONLY JSON:
{"questions":[{"sourceId":"...","learningPointId":"...","sourceType":"conversation_error","type":"grammar","concept":"wait for","prompt":"You were late.\\nI've been waiting ___ you for an hour.","choices":["for","about","to"],"correctIndex":0,"explanation":"...","choiceNotes":["...","...","..."],"example":"I'm waiting for my friend.","sourceHint":"..."}]}

Create exactly one question per input item. Never skip an item.
If a draft would be ambiguous, rewrite it with a context line and ungrammatical distractors until only one answer fits.`;
}

async function reviewQuestionUniqueness(
  client: OpenAI,
  questions: GeneratedQuestion[],
  language: string,
  locale: string,
): Promise<GeneratedQuestion[]> {
  if (questions.length === 0) return [];

  const payload = questions.map((question) => ({
    sourceId: question.sourceId,
    prompt: question.prompt,
    choices: question.choices,
    claimedCorrectIndex: question.correctIndex,
    filled: filledChoices(question.prompt, question.choices).map((item) => ({
      choice: item.choice,
      sentence: item.filled,
    })),
  }));

  const completion = await client.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: "system",
        content: `You review English multiple-choice fill-in-the-blank items.

For each item, judge EVERY completed sentence:
- grammatical?
- natural in THIS context?
- same meaning as the intended answer, or a different valid meaning?

valid=true ONLY if exactly one choice is both grammatical and natural here.
If two choices are natural English (even with different nuance), valid=false.
If the claimed correct answer is not the unique natural one, valid=false.

When valid=true, write explanation, example, and choiceNotes in ${language}.
choiceNotes: one string per choice, same order.
- correct: the meaning/use in this sentence + tiny example
- wrong: why it fails HERE. If that phrase exists in English, say the other meaning and why it does not fit this context. Never say only "this is wrong".

Return ONLY JSON:
{"reviews":[{"sourceId":"...","valid":true,"correctIndex":0,"explanation":"...","example":"...","choiceNotes":["..."]}]}`,
      },
      { role: "user", content: JSON.stringify({ language, items: payload }) },
    ],
    response_format: { type: "json_object" },
    temperature: 0.2,
  });

  const raw = completion.choices[0]?.message?.content;
  if (!raw) return questions;

  let parsed: { reviews?: unknown };
  try {
    parsed = JSON.parse(raw) as { reviews?: unknown };
  } catch {
    return questions;
  }
  if (!Array.isArray(parsed.reviews)) return questions;

  const rejected = new Set<string>();
  const updates = new Map<string, Partial<GeneratedQuestion>>();

  for (const review of parsed.reviews) {
    if (!review || typeof review !== "object") continue;
    const row = review as Record<string, unknown>;
    const sourceId = typeof row.sourceId === "string" ? row.sourceId : "";
    if (!sourceId) continue;
    if (row.valid === false) {
      rejected.add(sourceId);
      continue;
    }
    if (row.valid !== true) continue;
    const correctIndex =
      typeof row.correctIndex === "number" && Number.isInteger(row.correctIndex)
        ? row.correctIndex
        : undefined;
    updates.set(sourceId, {
      ...(typeof correctIndex === "number" ? { correctIndex } : {}),
      explanation:
        typeof row.explanation === "string" && row.explanation.trim()
          ? row.explanation.trim()
          : undefined,
      example:
        typeof row.example === "string" && row.example.trim()
          ? row.example.trim()
          : undefined,
      choiceNotes: Array.isArray(row.choiceNotes)
        ? row.choiceNotes.map((note) =>
            typeof note === "string" ? note.trim() : "",
          )
        : undefined,
    });
  }

  return questions
    .filter((question) => !rejected.has(question.sourceId))
    .map((question) => {
      const update = updates.get(question.sourceId);
      if (!update) return question;
      const correctIndex =
        typeof update.correctIndex === "number" &&
        update.correctIndex >= 0 &&
        update.correctIndex < question.choices.length
          ? update.correctIndex
          : question.correctIndex;
      if (!hasUniqueLocalAnswer(question.prompt, question.choices, correctIndex)) {
        return question;
      }
      return {
        ...question,
        correctIndex,
        explanation: sanitizeQuizExplanation({
          explanation: update.explanation || question.explanation,
          prompt: question.prompt,
          choices: question.choices,
          correctIndex,
          locale,
        }),
        example: update.example || question.example,
        choiceNotes: update.choiceNotes || question.choiceNotes,
      };
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

  let body: { locale?: string; items?: IncomingItem[]; points?: IncomingItem[] };
  try {
    body = await request.json();
  } catch {
    return jsonWithCors(request, { error: "Invalid JSON" }, { status: 400 });
  }

  const locale =
    typeof body.locale === "string" && isInterfaceLanguage(body.locale)
      ? body.locale
      : "en";
  const language = interfaceLanguageName(locale);

  const rawItems = Array.isArray(body.items)
    ? body.items
    : Array.isArray(body.points)
      ? body.points
      : [];

  const items = rawItems
    .filter((p) => p && typeof p.id === "string")
    .filter((p) => p.sourceType !== "saved_vocabulary" && p.sourceType !== "saved_expression")
    .filter(
      (p) =>
        typeof p.originalSentence === "string" &&
        typeof p.correctedSentence === "string",
    )
    .filter((p) =>
      isGrammarQuizSource({
        category: p.type,
        originalSentence: p.originalSentence,
        correctedSentence: p.correctedSentence,
        explanation: p.explanation,
      }),
    )
    .slice(0, Math.max(TARGET_QUIZ_SIZE, 8));

  if (items.length === 0) {
    return jsonWithCors(request, { error: "items required" }, { status: 400 });
  }

  const system = quizSystemPrompt(language);

  const userPayload = {
    locale,
    items: items.map((p) => ({
      id: p.id,
      sourceType: "conversation_error",
      type: "grammar",
      concept: p.concept ?? null,
      originalSentence: p.originalSentence ?? null,
      correctedSentence: p.correctedSentence ?? null,
      pastCorrectionNote: p.explanation ?? "",
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
    let questions = await reviewQuestionUniqueness(
      client,
      sanitizeQuestions(parsed, items, locale),
      language,
      locale,
    );

    const missing = items.filter(
      (item) => !questions.some((question) => question.sourceId === item.id),
    );
    if (missing.length > 0) {
      const retry = await client.chat.completions.create({
        model: MODEL,
        messages: [
          { role: "system", content: system },
          {
            role: "user",
            content: JSON.stringify({
              locale,
              instruction:
                "Previous items were rejected as ambiguous or invalid. Add a context sentence so only ONE choice is natural. Use ungrammatical forms as distractors, not alternative valid prepositions/synonyms.",
              items: missing.map((p) => ({
                id: p.id,
                concept: p.concept ?? null,
                originalSentence: p.originalSentence ?? null,
                correctedSentence: p.correctedSentence ?? null,
                pastCorrectionNote: p.explanation ?? "",
              })),
            }),
          },
        ],
        response_format: { type: "json_object" },
        temperature: 0.4,
      });
      const retryRaw = retry.choices[0]?.message?.content;
      if (retryRaw) {
        const extra = await reviewQuestionUniqueness(
          client,
          sanitizeQuestions(JSON.parse(retryRaw) as unknown, missing, locale),
          language,
          locale,
        );
        const seen = new Set(questions.map((question) => question.sourceId));
        for (const question of extra) {
          if (!seen.has(question.sourceId)) {
            questions.push(question);
            seen.add(question.sourceId);
          }
        }
      }
    }

    if (questions.length === 0) {
      return jsonWithCors(request, { error: "QUIZ_INVALID" }, { status: 500 });
    }

    return jsonWithCors(request, {
      questions: questions.slice(0, TARGET_QUIZ_SIZE),
    });
  } catch (error) {
    console.error("[quiz]", error);
    return jsonWithCors(request, { error: "QUIZ_FAILED" }, { status: 500 });
  }
}
