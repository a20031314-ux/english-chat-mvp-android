import { NextRequest } from "next/server";
import { getOpenAIClient } from "@/lib/server/openai";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import { meterRequest } from "@/lib/server/meterRequest";
import { resolveRequestEntitlement } from "@/lib/server/premiumRequest";
import { getDailyOpUsed } from "@/lib/server/entitlementStore";
import { FREE_DAILY_ASK_LIMIT, PREMIUM_DAILY_ASK_LIMIT } from "@/lib/billing/config";
import { selectionFitsSentence } from "@/lib/expressionInsight";
import {
  explanationInLearningLanguage,
  explanationLanguageGuard,
} from "@/lib/languageLearningAnalysis";
import {
  INTERFACE_LANGUAGE_LABELS,
  coerceLanguageCode,
  learningLanguageName,
} from "@/lib/learningLanguages";
import { targetLanguageFocusHints } from "@/lib/languageFocus";

export const dynamic = "force-dynamic";

/**
 * Answer a question the learner typed about a part of a sentence.
 *
 * The explanation sheet already says what a selected span is — structure,
 * examples, a tip — in a fixed shape. What it could not do is answer the
 * question somebody actually has: why this ending and not that one, whether
 * it can be said to a friend, how it differs from the phrase they know. So
 * the sheet takes a question, with the last few asked about the same span, and
 * this answers it.
 *
 * Kept to the sentence on purpose. It answers about the selected words, the
 * sentence around them and the language they are in; anything else gets a
 * short line saying what it can help with. A daily limit (billing/config.ts)
 * keeps it a way to ask about the sentence in front of you, not a free
 * chatbot. The question is not stored.
 */
const MODEL = () => process.env.OPENAI_ASK_MODEL?.trim() || "gpt-4.1-mini";
const MAX_QUESTION_CHARS = 300;
const MAX_SENTENCE_CHARS = 600;
const MAX_HISTORY = 4;

export async function OPTIONS(request: NextRequest) {
  return corsPreflightResponse(request);
}

type Turn = { question: string; answer: string };

function readText(value: unknown, max: number): string {
  return typeof value === "string" ? value.replace(/\s+/g, " ").trim().slice(0, max) : "";
}

function readHistory(value: unknown): Turn[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((row) => ({
      question: readText((row as Turn)?.question, MAX_QUESTION_CHARS),
      answer: readText((row as Turn)?.answer, 1200),
    }))
    .filter((row) => row.question && row.answer)
    .slice(-MAX_HISTORY);
}

function systemPrompt(target: string, uiName: string, uiCode: string, targetCode: string): string {
  return `You are a language tutor answering one learner's question about a sentence in ${target}. They selected part of the sentence and typed a question about it.

Answer that question, about those words in that sentence. Be concrete: point at the words, say what they do here, and when it helps give one or two short ${target} examples or the more natural or more casual way to say it. Two to five sentences. No headings, no lists unless the question asks for a comparison.

Write the answer in ${uiName}. Quote ${target} words and examples as they are, inside quotes.

If the question is not about this sentence or about ${target}, do not answer it; say in one short sentence, in ${uiName}, that you can help with this sentence and the language in it.

${targetLanguageFocusHints(coerceLanguageCode(targetCode))}

${explanationLanguageGuard({ interfaceLanguage: uiCode, fieldsDescription: "answer", learningLanguage: targetCode })}

Return only a json object: {"answer":"..."}`;
}

export async function POST(request: NextRequest) {
  const openai = getOpenAIClient();
  if (!openai) {
    return jsonWithCors(request, { error: "MISSING_OPENAI_KEY" }, { status: 503 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return jsonWithCors(request, { error: "Invalid JSON" }, { status: 400 });
  }

  const sentence = readText(body.sentence, MAX_SENTENCE_CHARS);
  const selected = readText(body.selected, MAX_SENTENCE_CHARS);
  const question = readText(body.question, MAX_QUESTION_CHARS);
  if (!sentence || !selected || !question || !selectionFitsSentence(sentence, selected)) {
    return jsonWithCors(request, { error: "question required" }, { status: 400 });
  }
  const context = Array.isArray(body.context)
    ? body.context.map((line) => readText(line, MAX_SENTENCE_CHARS)).filter(Boolean).slice(-4)
    : [];
  const history = readHistory(body.history);
  const targetCode = coerceLanguageCode(body.targetLanguage);
  const uiCode = typeof body.interfaceLanguage === "string" && INTERFACE_LANGUAGE_LABELS[body.interfaceLanguage]
    ? body.interfaceLanguage
    : "ko";

  const { userId, isPremium } = await resolveRequestEntitlement(request);
  const limit = isPremium ? PREMIUM_DAILY_ASK_LIMIT : FREE_DAILY_ASK_LIMIT;
  if ((await getDailyOpUsed(userId, "expressionAsk")) >= limit) {
    return jsonWithCors(request, { error: "ASK_LIMIT_REACHED", limit }, { status: 429 });
  }
  await meterRequest(request, "expressionAsk");

  const target = learningLanguageName(targetCode);
  const uiName = INTERFACE_LANGUAGE_LABELS[uiCode] ?? "Korean";
  const messages = [
    { role: "system" as const, content: systemPrompt(target, uiName, uiCode, targetCode) },
    {
      role: "user" as const,
      content: JSON.stringify({
        sentence,
        selected,
        ...(context.length ? { around: context } : {}),
        ...(history.length ? { askedBefore: history } : {}),
        question,
      }),
    },
  ];

  const ask = async (extra?: string) => {
    const completion = await openai.chat.completions.create({
      model: MODEL(),
      temperature: 0.3,
      max_tokens: 500,
      response_format: { type: "json_object" },
      messages: extra ? [...messages, { role: "system" as const, content: extra }] : messages,
    });
    const raw = completion.choices[0]?.message?.content ?? "";
    const parsed = JSON.parse(raw) as { answer?: unknown };
    return typeof parsed.answer === "string" ? parsed.answer.trim() : "";
  };

  try {
    let answer = await ask();
    // The guard in the prompt holds for most languages and not all of them
    // (see restateExplanation in the chat route): an answer that came back in
    // the language being learned is asked for once more, plainly.
    if (answer && explanationInLearningLanguage(answer, uiCode, targetCode)) {
      void meterRequest(request, "expressionAskRetry");
      const again = await ask(`Your answer was written in ${target}. Write it again in ${uiName}, quoting ${target} words only inside quotes.`);
      if (again) answer = again;
    }
    if (!answer) {
      return jsonWithCors(request, { error: "NO_ANSWER" }, { status: 502 });
    }
    return jsonWithCors(request, { answer });
  } catch (error) {
    console.error("[expression-ask]", error);
    return jsonWithCors(request, { error: "ASK_FAILED" }, { status: 502 });
  }
}
