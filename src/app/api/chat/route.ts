import OpenAI from "openai";
import { NextRequest } from "next/server";
import { FREE_DAILY_CHAT_LIMIT } from "@/lib/billing/config";
import {
  getDailyUsed,
  incrementDailyUsed,
} from "@/lib/server/entitlementStore";
import { isPremiumClientRequest } from "@/lib/server/premiumRequest";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
const MODEL = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

function requestUserId(request: NextRequest) {
  return request.cookies.get("ec_uid")?.value ?? "local-anonymous";
}

function getClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new OpenAI({ apiKey });
}

type ChatCorrection = {
  corrected: string;
  natural: string;
  explanation: string;
};

type ChatPayload = {
  assistantMessage: string;
  correction: ChatCorrection;
};

type ExpressionPayload = {
  expression: string;
  example: string;
};

const EXPLANATION_LANGUAGES: Record<string, string> = {
  ko: "Korean (한국어)",
  en: "English",
  es: "Spanish",
  ja: "Japanese",
  zh: "Simplified Chinese",
  vi: "Vietnamese",
  fr: "French",
  pt: "Portuguese",
  id: "Indonesian",
};

function asText(value: unknown): string {
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  if (Array.isArray(value)) {
    return value.map(asText).filter(Boolean).join(" ").trim();
  }
  if (value && typeof value === "object") {
    const o = value as Record<string, unknown>;
    for (const key of ["text", "content", "message", "ko", "en", "explanation"]) {
      const nested = asText(o[key]);
      if (nested) return nested;
    }
  }
  return "";
}

function normCompare(text: string) {
  return text.replace(/\s+/g, " ").trim().toLowerCase();
}

function buildChatSystem(locale: string) {
  const explanationLanguage =
    EXPLANATION_LANGUAGES[locale] ?? EXPLANATION_LANGUAGES.ko;
  const mustBeKorean =
    locale === "ko"
      ? `

CRITICAL for explanation:
- Write explanation ONLY in Korean Hangul (한국어).
- Never write the explanation in English.
- Example style: "if 조건절에서는 미래의 일도 현재형을 써요."`
      : "";

  return `You are a friendly English conversation tutor. The user sends one English message they composed.

1) Reply with SHORT natural English (1–2 sentences) as assistantMessage to continue the conversation.
2) Fill correction for their message:
- corrected: fully corrected English (fix grammar/wording mistakes; keep meaning).
- natural: a more natural/colloquial native alternative that is DIFFERENT from corrected whenever a more fluent option exists. If corrected is already the most natural, repeat corrected.
- explanation: 1–2 short sentences in ${explanationLanguage} explaining WHAT was wrong and why (point to the mistaken word/pattern). Do not include a label like "설명" / "Explanation".
- If corrected differs from the user's message (even slightly), explanation MUST be non-empty.
- Only if the user's message needs no change at all, set explanation to "".
- Do NOT treat contractions vs full forms as errors (I'm = I am, don't = do not, it's = it is, etc.). Prefer keeping the user's contraction style in corrected unless there is a real grammar mistake.
- Do NOT "correct" informal-but-acceptable spoken English into more formal wording; put style upgrades only in natural.
- If the user embeds a Hangul/CJK word inside an otherwise English sentence (proper noun or a word they don't know yet), that is NOT a grammar error — keep it in corrected, and you may gloss the meaning in assistantMessage.
${mustBeKorean}

Return ONLY valid JSON (no markdown) with this exact shape:
{"assistantMessage":"...","correction":{"corrected":"...","natural":"...","explanation":"..."}}`;
}

const HOW_TO_SAY_SYSTEM = `The user wants a natural English wording (they may write in Korean, English, or mixed).

If they ask a meta question like "how can I say X in English?" / "X 영어로?", extract X and return the natural English for X — do NOT echo or "correct" the meta question itself.
If they describe a situation, return a natural English line for that situation.

Return ONLY valid JSON (no explanation field):
{"expression":"natural English expression or sentence","example":"English example sentence related to the expression"}`;

const FALLBACK_EXPLANATION: Record<string, string> = {
  ko: "이 부분을 이렇게 고치면 더 자연스러워요.",
  en: "This wording is clearer and more natural.",
  es: "Esta forma suena más clara y natural.",
  ja: "こう直すとより自然です。",
  zh: "这样改会更自然。",
  vi: "Cách diễn đạt này tự nhiên hơn.",
  fr: "Cette formulation est plus naturelle.",
  pt: "Essa formulação fica mais natural.",
  id: "Susunan ini terdengar lebih natural.",
};

async function runChat(
  openai: OpenAI,
  message: string,
  locale: string,
): Promise<ChatPayload> {
  const completion = await openai.chat.completions.create({
    model: MODEL,
    messages: [
      { role: "system", content: buildChatSystem(locale) },
      { role: "user", content: message },
    ],
    response_format: { type: "json_object" },
    temperature: 0.6,
  });

  const raw = completion.choices[0]?.message?.content;
  if (!raw) {
    throw new Error("empty completion");
  }

  const parsed = JSON.parse(raw) as Partial<ChatPayload> & {
    explanation?: unknown;
  };
  const assistantMessage = asText(parsed.assistantMessage);
  const c = parsed.correction;
  const corrected = asText(c?.corrected) || message;
  const natural = asText(c?.natural) || corrected;
  let explanation =
    asText(c?.explanation) || asText(parsed.explanation);

  const needsExplanation = normCompare(corrected) !== normCompare(message);
  if (needsExplanation && !explanation.trim()) {
    explanation =
      FALLBACK_EXPLANATION[locale] ?? FALLBACK_EXPLANATION.ko;
  }

  return {
    assistantMessage,
    correction: { corrected, natural, explanation },
  };
}

async function runHowToSay(
  openai: OpenAI,
  message: string,
): Promise<ExpressionPayload> {
  const completion = await openai.chat.completions.create({
    model: MODEL,
    messages: [
      { role: "system", content: HOW_TO_SAY_SYSTEM },
      { role: "user", content: message },
    ],
    response_format: { type: "json_object" },
    temperature: 0.6,
  });

  const raw = completion.choices[0]?.message?.content;
  if (!raw) {
    throw new Error("empty completion");
  }

  const parsed = JSON.parse(raw) as Partial<ExpressionPayload>;
  return {
    expression:
      typeof parsed.expression === "string" ? parsed.expression : message,
    example:
      typeof parsed.example === "string"
        ? parsed.example
        : "Please try again later.",
  };
}

export async function OPTIONS(request: NextRequest) {
  return corsPreflightResponse(request);
}

export async function POST(request: NextRequest) {
  const openai = getClient();
  if (!openai) {
    return jsonWithCors(request, { error: "MISSING_OPENAI_KEY" }, { status: 503 });
  }

  const userId = requestUserId(request);
  const isPremium = isPremiumClientRequest(request);

  let body: { message?: string; mode?: string; locale?: string };
  try {
    body = await request.json();
  } catch {
    return jsonWithCors(request, { error: "Invalid JSON" }, { status: 400 });
  }

  const message = body.message?.trim();
  if (!message) {
    return jsonWithCors(request, { error: "message required" }, { status: 400 });
  }

  const locale =
    typeof body.locale === "string" && body.locale in EXPLANATION_LANGUAGES
      ? body.locale
      : "ko";
  const mode = body.mode === "how_to_say" ? "how_to_say" : "chat";

  if (
    mode === "chat" &&
    !isPremium &&
    getDailyUsed(userId) >= FREE_DAILY_CHAT_LIMIT
  ) {
    return jsonWithCors(request, { error: "DAILY_LIMIT_REACHED" }, { status: 403 });
  }

  try {
    if (mode === "how_to_say") {
      const data = await runHowToSay(openai, message);
      return jsonWithCors(request, data);
    }

    const data = await runChat(openai, message, locale);
    if (!isPremium) {
      incrementDailyUsed(userId);
    }
    return jsonWithCors(request, data);
  } catch (error) {
    console.error("[chat]", error);
    return jsonWithCors(request, { error: "CHAT_FAILED" }, { status: 500 });
  }
}
