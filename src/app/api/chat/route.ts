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
  spokenReply: string;
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

1) First fix their English into corrected (what they meant to say).
2) Then write assistantMessage as a reply to the CORRECTED sentence only — never to the broken original.
- If corrected is a question, answer that question.
- If corrected is a statement, respond to that statement.
- Do not treat a broken question like "You are you good at running?" as a compliment ("You are good at running").
3) Fill the rest of correction:
- corrected: fully corrected English (fix grammar/wording mistakes; keep meaning).
- natural: a more natural/colloquial native alternative that is DIFFERENT from corrected whenever a more fluent option exists. If corrected is already the most natural, repeat corrected.
- explanation: 1–2 short sentences in ${explanationLanguage} explaining WHAT was wrong and why (point to the mistaken word/pattern). Do not include a label like "설명" / "Explanation".
- If corrected differs from the user's message (even slightly), explanation MUST be non-empty.
- Only if the user's message needs no change at all, set explanation to "".
- Do NOT treat contractions vs full forms as errors (I'm = I am, don't = do not, it's = it is, etc.). Prefer keeping the user's contraction style in corrected unless there is a real grammar mistake.
- Do NOT treat negative polarity variants as errors. Keep the user's form in corrected:
  "nothing" = "not anything", "nobody/no one" = "not anybody/anyone",
  "nowhere" = "not anywhere", "no + noun" = "not any + noun"
  (e.g. "I'm studying nothing" is already correct — do not change it to "I'm not studying anything").
- Do NOT "correct" informal-but-acceptable spoken English into more formal wording; put style upgrades only in natural.
- Optional spoken words are NOT grammar: "right" in "right now", "just", "really", "actually". If the sentence is already grammatical, set corrected to the user's exact message and put those upgrades only in natural.
- Never mention a missing optional word (especially "right" before "now") as a grammar mistake. Suggest it only in natural. If you also fix a real grammar error, do not add those optional words into corrected.
- Never change the meaning in corrected (do not rewrite "I'm studying nothing" into "I'm just chilling"). Meaning/style rewrites belong in natural only.
- If there is no real grammar/agreement/article/preposition/tense error, corrected MUST equal the user's message.
- If the user embeds a Hangul/CJK word inside an otherwise English sentence (proper noun or a word they don't know yet), that is NOT a grammar error — keep it in corrected, and you may gloss the meaning in assistantMessage.
${mustBeKorean}

Return ONLY valid JSON (no markdown) with this exact shape:
{"assistantMessage":"...","correction":{"corrected":"...","natural":"...","explanation":"..."}}`;
}

const HOW_TO_SAY_SYSTEM = `The user wants a natural English line THEY can say next. They may write in Korean, English, or mixed.

Give the English for what they intend to communicate — keep the speech act.

Checking / asking back what the other person meant:
- "묻는 거야?" / "물어본 거야?" / "그 말이야?" → "Are you asking ...?" / "Do you mean ...?"
- NEVER turn that into a new question they would ask someone else.

Bad: "하루를 기준으로 무슨 운동을 하는지 묻는거야?" → "What kind of exercise do you do in a day?"
Good: "Are you asking what I do for a workout each day?"

Other acts to keep: confirming, refusing, suggesting, answering, joking.
If RECENT has the other person's last line, use it to resolve what they are checking.

If they ask "how can I say X in English?" / "X 영어로?", extract X and give English for X — do not echo the meta question.

Return ONLY JSON:
{"expression":"the English they would say"}`;

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

async function replyToCorrected(
  openai: OpenAI,
  corrected: string,
): Promise<string> {
  const completion = await openai.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: "system",
        content: `The learner meant the English line below (already corrected). Reply in 1-2 short spoken English sentences.
Match the speech act: answer a question, react to a statement. Do not thank them unless they complimented you.
Return ONLY JSON: {"assistantMessage":"..."}`,
      },
      { role: "user", content: corrected },
    ],
    response_format: { type: "json_object" },
    temperature: 0.6,
  });
  const raw = completion.choices[0]?.message?.content;
  if (!raw) return "";
  const parsed = JSON.parse(raw) as { assistantMessage?: unknown };
  return asText(parsed.assistantMessage).trim();
}

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
    assistantSpoken?: unknown;
    assistantNative?: unknown;
  };
  const assistantMessage = asText(parsed.assistantMessage);
  const spokenReply =
    locale === "en"
      ? ""
      : asText(parsed.spokenReply) ||
        asText(parsed.assistantSpoken) ||
        asText(parsed.assistantNative);
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

  let reply = assistantMessage;
  if (needsExplanation && corrected.trim()) {
    try {
      const reread = await replyToCorrected(openai, corrected);
      if (reread) reply = reread;
    } catch (error) {
      console.error("[chat-reply-corrected]", error);
    }
  }

  return {
    assistantMessage: reply,
    spokenReply,
    correction: { corrected, natural, explanation },
  };
}

const FALLBACK_STARTERS = [
  {
    en: "Hey! What did you do today?",
    ko: "안녕! 오늘 뭐 했어?",
  },
  {
    en: "Hi there. Have you eaten yet? What did you have?",
    ko: "안녕. 밥은 먹었어? 뭐 먹었어?",
  },
  {
    en: "Good to see you. What's something fun you did this week?",
    ko: "반가워. 이번 주에 뭐 재미있는 거 했어?",
  },
  {
    en: "Hey. Are you more of a morning person or a night person?",
    ko: "너는 아침형이야, 저녁형이야?",
  },
  {
    en: "Hi! If you could travel anywhere next month, where would you go?",
    ko: "다음 달에 어디든 갈 수 있으면 어디 가고 싶어?",
  },
  {
    en: "Hey. What kind of music have you been listening to lately?",
    ko: "요즘 어떤 음악 듣고 있어?",
  },
];

function pickStarter(recent: string[]): (typeof FALLBACK_STARTERS)[number] {
  const blob = recent.join(" ").toLowerCase();
  const unused = FALLBACK_STARTERS.filter(
    (line) => !blob.includes(line.en.toLowerCase()),
  );
  const pool = unused.length > 0 ? unused : FALLBACK_STARTERS;
  return pool[Math.floor(Math.random() * pool.length)] ?? FALLBACK_STARTERS[0];
}

function starterPayload(
  starter: (typeof FALLBACK_STARTERS)[number],
  locale: string,
) {
  return {
    assistantMessage: starter.en,
    spokenReply: locale === "ko" ? starter.ko : "",
  };
}

async function runStart(
  openai: OpenAI,
  recent: string[],
  locale: string,
): Promise<{ assistantMessage: string; spokenReply: string }> {
  const spokenLanguage =
    locale === "en"
      ? ""
      : EXPLANATION_LANGUAGES[locale] ?? EXPLANATION_LANGUAGES.ko;
  const spokenRule =
    locale === "en"
      ? ""
      : `
Also write spokenReply: the SAME opener a native ${spokenLanguage} speaker would actually say.
Same meaning. Not a word-for-word translation.`;

  const completion = await openai.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: "system",
        content: `You start a casual English conversation for a language learner.

Decide ONE short opener, then write it in English and (if asked) in the learner's language.
Write 1-2 short spoken English sentences as assistantMessage.
Ask one easy, concrete question they can answer in a sentence or two.
Be warm and natural. Do not lecture or correct anyone.
Vary the topic. Do not reuse questions from RECENT.
${spokenRule}

Return ONLY JSON:
{"assistantMessage":"...","spokenReply":"..."}`,
      },
      {
        role: "user",
        content: JSON.stringify({ recent }),
      },
    ],
    response_format: { type: "json_object" },
    temperature: 0.95,
  });

  const raw = completion.choices[0]?.message?.content;
  if (!raw) {
    return starterPayload(pickStarter(recent), locale);
  }
  const parsed = JSON.parse(raw) as {
    assistantMessage?: unknown;
    spokenReply?: unknown;
  };
  const assistantMessage = asText(parsed.assistantMessage).trim();
  const spokenReply = locale === "en" ? "" : asText(parsed.spokenReply).trim();
  if (!assistantMessage) {
    return starterPayload(pickStarter(recent), locale);
  }
  return { assistantMessage, spokenReply };
}

function parseRecent(raw: unknown, limit = 8): string[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(-limit);
}

async function runHowToSay(
  openai: OpenAI,
  message: string,
  recent: string[],
): Promise<ExpressionPayload> {
  const completion = await openai.chat.completions.create({
    model: MODEL,
    messages: [
      { role: "system", content: HOW_TO_SAY_SYSTEM },
      {
        role: "user",
        content: JSON.stringify({ wantToSay: message, recent }),
      },
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

  const userId = requestUserId(request);
  const isPremium = isPremiumClientRequest(request);

  let body: {
    message?: string;
    mode?: string;
    locale?: string;
    recent?: unknown;
  };
  try {
    body = await request.json();
  } catch {
    return jsonWithCors(request, { error: "Invalid JSON" }, { status: 400 });
  }

  const locale =
    typeof body.locale === "string" && body.locale in EXPLANATION_LANGUAGES
      ? body.locale
      : "ko";
  const mode =
    body.mode === "how_to_say"
      ? "how_to_say"
      : body.mode === "start"
        ? "start"
        : "chat";

  if (mode === "start") {
    const recent = parseRecent(body.recent);
    if (!openai) {
      return jsonWithCors(request, starterPayload(pickStarter(recent), locale));
    }
    try {
      const data = await runStart(openai, recent, locale);
      return jsonWithCors(request, data);
    } catch (error) {
      console.error("[chat-start]", error);
      return jsonWithCors(
        request,
        starterPayload(pickStarter(recent), locale),
      );
    }
  }

  if (!openai) {
    return jsonWithCors(request, { error: "MISSING_OPENAI_KEY" }, { status: 503 });
  }

  const message = body.message?.trim();
  if (!message) {
    return jsonWithCors(request, { error: "message required" }, { status: 400 });
  }

  if (
    mode === "chat" &&
    !isPremium &&
    getDailyUsed(userId) >= FREE_DAILY_CHAT_LIMIT
  ) {
    return jsonWithCors(request, { error: "DAILY_LIMIT_REACHED" }, { status: 403 });
  }

  try {
    if (mode === "how_to_say") {
      const data = await runHowToSay(openai, message, parseRecent(body.recent));
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
