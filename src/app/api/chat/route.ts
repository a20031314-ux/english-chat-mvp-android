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
  highlighted: string;
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
  explanation: string;
  example: string;
};

const CHAT_SYSTEM = `You are a friendly English conversation tutor for Korean learners. The user sends one English message they composed.

1) Reply with SHORT natural English (1–2 sentences) as assistantMessage to continue the conversation.
2) Fill correction for their message:
- highlighted: their sentence; if something is wrong, wrap the wrong span as [wrong → right]. If it is fine, repeat the sentence unchanged.
- corrected: fully corrected English.
- natural: a more natural/colloquial way a native might say the same idea.
- explanation: 1–2 sentences in Korean.

Return ONLY valid JSON (no markdown) with this exact shape:
{"assistantMessage":"...","correction":{"highlighted":"...","corrected":"...","natural":"...","explanation":"..."}}`;

const HOW_TO_SAY_SYSTEM = `The user wants a natural English line for a situation (they may write in Korean, English, or mixed).

Return ONLY valid JSON:
{"expression":"...","explanation":"Korean explanation, 1–2 sentences","example":"English example sentence related to the expression"}`;

async function runChat(openai: OpenAI, message: string): Promise<ChatPayload> {
  const completion = await openai.chat.completions.create({
    model: MODEL,
    messages: [
      { role: "system", content: CHAT_SYSTEM },
      { role: "user", content: message },
    ],
    response_format: { type: "json_object" },
    temperature: 0.6,
  });

  const raw = completion.choices[0]?.message?.content;
  if (!raw) {
    throw new Error("empty completion");
  }

  const parsed = JSON.parse(raw) as Partial<ChatPayload>;
  const assistantMessage =
    typeof parsed.assistantMessage === "string" ? parsed.assistantMessage : "";
  const c = parsed.correction;
  const correction: ChatCorrection = {
    highlighted:
      typeof c?.highlighted === "string" ? c.highlighted : message,
    corrected: typeof c?.corrected === "string" ? c.corrected : message,
    natural: typeof c?.natural === "string" ? c.natural : message,
    explanation:
      typeof c?.explanation === "string"
        ? c.explanation
        : "일시적인 오류입니다. 다시 시도해주세요.",
  };

  return { assistantMessage, correction };
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
    explanation:
      typeof parsed.explanation === "string"
        ? parsed.explanation
        : "일시적인 오류입니다. 다시 시도해주세요.",
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

  let body: { message?: string; mode?: string };
  try {
    body = await request.json();
  } catch {
    return jsonWithCors(request, { error: "Invalid JSON" }, { status: 400 });
  }

  const message = body.message?.trim();
  if (!message) {
    return jsonWithCors(request, { error: "message required" }, { status: 400 });
  }

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

    const data = await runChat(openai, message);
    if (!isPremium) {
      incrementDailyUsed(userId);
    }
    return jsonWithCors(request, data);
  } catch (error) {
    console.error("[chat]", error);
    return jsonWithCors(request, { error: "CHAT_FAILED" }, { status: 500 });
  }
}
