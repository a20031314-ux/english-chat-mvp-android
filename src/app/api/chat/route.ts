import OpenAI from "openai";
import { NextRequest } from "next/server";
import { FREE_DAILY_CHAT_LIMIT } from "@/lib/billing/config";
import {
  getDailyUsed,
  incrementDailyUsed,
} from "@/lib/server/entitlementStore";
import { isPremiumClientRequest } from "@/lib/server/premiumRequest";
import { normalizeHowToSayExpression } from "@/lib/howToSay";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import {
  conversationKoreanParallel,
  conversationVoicePrinciples,
} from "@/lib/conversationVoice";

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
  simpler?: string;
  moreNative?: string;
  analysis?: string;
  assistantMessage: string;
  spokenReply: string;
  correction: ChatCorrection;
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

  return `You chat in English with the user. Correction is a separate job from talking.

The user JSON has "message" (the current turn — reply to THIS) and optional "recent" lines (background only).

${conversationVoicePrinciples()}
${conversationKoreanParallel(locale)}

1) First fix their English into corrected (what they meant to say in THIS turn). This is for the learner, not for the chat voice.
- Do not change the topic to match recent. Pronouns like "that"/"they" may refer back; a new question or new subject does not.
2) Then write assistantMessage as a reply to the CORRECTED current turn only — never to the broken original, and never to an older recent line instead.
- If corrected is a question, answer that question.
- If corrected is a statement, respond to that statement.
- Do not treat a broken question like "You are you good at running?" as a compliment ("You are good at running").
- Do not lecture, quiz grammar, or correct them inside assistantMessage.
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
{"assistantMessage":"...","spokenReply":"...","correction":{"corrected":"...","natural":"...","explanation":"..."}}`;
}

const HOW_TO_SAY_SYSTEM = `The user wants a natural English line THEY can say (or write) to another person. They may write in Korean, English, or mixed.

You are a phrase helper, NOT a tutor. Do not answer their question, explain the topic, or ask them what they meant.

Give ONE spoken English line that keeps their speech act.
Match the situation (friend, work, interview, joke, online). Casual intent → casual English, including contractions, fragments, slang, or mild profanity if that is what they would actually say. Formal intent → that register. Do not turn casual talk into textbook English.
RECENT is only for resolving "that/they/this" or whose previous question they are confirming. Do not rewrite their line into the previous topic.

If they asked for information (뭐/몇/어떻게/왜, a factual or opinion question), translate THAT question into English they would ask someone else:
Bad: "체지방 12%를 만들려면 남자 골격근량은 체중의 몇 퍼센트여야해?" → "Are you asking what the muscle mass percentage should be...?"
Good: "For men, what's a typical skeletal muscle percentage at 12% body fat?"

Only use "Are you asking...?" / "Do you mean...?" when THEY are checking the other person's previous question — their text itself is a confirmation ("묻는 거야?", "물어본 거야?", "그 말이야?") AND RECENT has the other person's line.
Bad: "하루를 기준으로 무슨 운동을 하는지 묻는거야?" → "What kind of exercise do you do in a day?"
Good: "Are you asking what I do for a workout each day?"

Other acts to keep: confirming, refusing, suggesting, answering, joking.
If they ask "how can I say X in English?" / "X 영어로?", extract X and give English for X — do not echo the meta question.

No quotes, no Korean, no extra commentary.

Return ONLY JSON:
{"expression":"the English they would say"}`;

function buildHowToSaySystem(locale: string, premium: boolean) {
  if (!premium) return HOW_TO_SAY_SYSTEM;
  const analysisLanguage =
    EXPLANATION_LANGUAGES[locale] ?? EXPLANATION_LANGUAGES.ko;
  return `${HOW_TO_SAY_SYSTEM}

Also include (same meaning, not an answer to their question):
- simpler: a shorter, easier English line. Empty string if expression is already simple.
- moreNative: a more colloquial native line, not a synonym swap. Empty if nothing different.
- analysis: 1-2 sentences in ${analysisLanguage} on nuance / when to use which line.

{"expression":"...","simpler":"...","moreNative":"...","analysis":"..."}`;
}

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
  recent: string[] = [],
  locale = "ko",
): Promise<{ assistantMessage: string; spokenReply: string }> {
  const completion = await openai.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: "system",
        content: `The person meant the English line in "corrected" (this turn). Reply to THAT line.

${conversationVoicePrinciples()}
${conversationKoreanParallel(locale)}

recent is background only. If this turn is a new question or a new subject, answer it. Do not keep the previous topic going unless this line clearly refers back.
Do not lecture, correct their English, or thank them unless they complimented you.

Return ONLY JSON: {"assistantMessage":"...","spokenReply":"..."}`,
      },
      {
        role: "user",
        content: JSON.stringify({
          corrected,
          recent,
          instruction:
            "Reply to corrected. Use recent only if this turn still refers to it.",
        }),
      },
    ],
    response_format: { type: "json_object" },
    temperature: 0.9,
  });
  const raw = completion.choices[0]?.message?.content;
  if (!raw) return { assistantMessage: "", spokenReply: "" };
  const parsed = JSON.parse(raw) as {
    assistantMessage?: unknown;
    spokenReply?: unknown;
  };
  return {
    assistantMessage: asText(parsed.assistantMessage).trim(),
    spokenReply: locale === "en" ? "" : asText(parsed.spokenReply).trim(),
  };
}

async function runChat(
  openai: OpenAI,
  message: string,
  locale: string,
  recent: string[] = [],
): Promise<ChatPayload> {
  const completion = await openai.chat.completions.create({
    model: MODEL,
    messages: [
      { role: "system", content: buildChatSystem(locale) },
      {
        role: "user",
        content: JSON.stringify({
          message,
          recent: recent.slice(-8),
          instruction:
            "Reply to message. Use recent only if this turn still refers to it.",
        }),
      },
    ],
    response_format: { type: "json_object" },
    temperature: 0.9,
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
  let spoken = spokenReply;
  if (needsExplanation && corrected.trim()) {
    try {
      const reread = await replyToCorrected(openai, corrected, recent, locale);
      if (reread.assistantMessage) reply = reread.assistantMessage;
      if (reread.spokenReply) spoken = reread.spokenReply;
    } catch (error) {
      console.error("[chat-reply-corrected]", error);
    }
  }

  return {
    assistantMessage: reply,
    spokenReply: spoken,
    correction: { corrected, natural, explanation },
  };
}

const FALLBACK_STARTERS = [
  {
    en: "Hey — you been up to anything, or just surviving the week?",
    ko: "야, 요즘 뭐 했어? 아니면 그냥 주간 생존 중?",
  },
  {
    en: "Okay be honest. How tired are you right now?",
    ko: "솔직히 말해봐. 지금 얼마나 피곤해?",
  },
  {
    en: "I just wasted like twenty minutes staring at my phone. You ever do that?",
    ko: "방금 폰만 보다가 이십 분은 날렸어. 너도 그런 적 있지?",
  },
  {
    en: "Random one: would you rather cook tonight or just order something?",
    ko: "갑자기 궁금한데, 오늘 저녁 해 먹을 거야, 아니면 그냥 시킬 거야?",
  },
  {
    en: "Ugh, I cannot decide what to watch. What's the last thing you actually liked?",
    ko: "아 뭐 볼지 못 정하겠어. 최근에 진짜 괜찮았던 거 뭐야?",
  },
  {
    en: "Morning person or night person? No in-between, pick a side.",
    ko: "아침형이야, 저녁형이야? 중간은 없고 하나만 골라.",
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
  const spokenRule = conversationKoreanParallel(locale);

  const completion = await openai.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: "system",
        content: `Start a casual English conversation. You are not a tutor opening a lesson.

${conversationVoicePrinciples()}
${spokenRule}

Write 1–2 spoken English lines as assistantMessage. Sound like texting a friend, not greeting a class.
A question is fine if it feels natural — not required, and not a study prompt.
Vary the topic. Do not reuse questions from RECENT.

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
  locale: string,
  isPremium: boolean,
): Promise<ExpressionPayload> {
  const completion = await openai.chat.completions.create({
    model: MODEL,
    messages: [
      { role: "system", content: buildHowToSaySystem(locale, isPremium) },
      {
        role: "user",
        content: JSON.stringify({ wantToSay: message, recent }),
      },
    ],
    response_format: { type: "json_object" },
      temperature: 0.75,
  });

  const raw = completion.choices[0]?.message?.content;
  if (!raw) {
    throw new Error("empty completion");
  }

  const parsed = JSON.parse(raw) as Partial<ExpressionPayload>;
  const expression = normalizeHowToSayExpression(message, parsed);
  const chat = await runChat(openai, expression.expression, locale, recent);

  return {
    expression: expression.expression,
    example: expression.example || "Please try again later.",
    ...(isPremium && expression.simpler ? { simpler: expression.simpler } : {}),
    ...(isPremium && expression.moreNative
      ? { moreNative: expression.moreNative }
      : {}),
    ...(isPremium && expression.analysis ? { analysis: expression.analysis } : {}),
    assistantMessage: chat.assistantMessage,
    spokenReply: chat.spokenReply,
    correction: chat.correction,
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
    (mode === "chat" || mode === "how_to_say") &&
    !isPremium &&
    getDailyUsed(userId) >= FREE_DAILY_CHAT_LIMIT
  ) {
    return jsonWithCors(request, { error: "DAILY_LIMIT_REACHED" }, { status: 403 });
  }

  try {
    if (mode === "how_to_say") {
      const data = await runHowToSay(
        openai,
        message,
        parseRecent(body.recent),
        locale,
        isPremium,
      );
      if (!isPremium) {
        incrementDailyUsed(userId);
      }
      return jsonWithCors(request, data);
    }

    const data = await runChat(
      openai,
      message,
      locale,
      parseRecent(body.recent),
    );
    if (!isPremium) {
      incrementDailyUsed(userId);
    }
    return jsonWithCors(request, data);
  } catch (error) {
    console.error("[chat]", error);
    return jsonWithCors(request, { error: "CHAT_FAILED" }, { status: 500 });
  }
}
