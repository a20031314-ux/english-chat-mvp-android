import { NextRequest } from "next/server";
import type OpenAI from "openai";
import { chatModel, getOpenAIClient } from "@/lib/server/openai";
import { FREE_DAILY_CHAT_LIMIT } from "@/lib/billing/config";
import {
  getDailyUsed,
  incrementDailyUsed,
} from "@/lib/server/entitlementStore";
import { resolveRequestEntitlement } from "@/lib/server/premiumRequest";
import { normalizeHowToSayExpression } from "@/lib/howToSay";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import {
  conversationKoreanParallel,
  conversationVoicePrinciples,
} from "@/lib/conversationVoice";
import { conversationPartnerIdentity } from "@/lib/chatPartner";
import {
  isConversationMode,
  type ConversationMode,
} from "@/lib/conversationMode";
import { isChatImageDataUrl } from "@/lib/chatImage";
import {
  coerceLanguageCode,
  INTERFACE_LANGUAGE_LABELS,
  isInterfaceLanguage,
  learningLanguageName,
  type LearningLanguageCode,
} from "@/lib/learningLanguages";
import { commonLanguageInstructions, explanationLanguageGuard } from "@/lib/languageLearningAnalysis";

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

const EXPLANATION_LANGUAGES: Record<string, string> = INTERFACE_LANGUAGE_LABELS;

type ChatLanguages = {
  locale: string;
  interfaceLanguage: string;
  targetLanguage: LearningLanguageCode;
};

type ChatTurnOptions = {
  conversationMode?: ConversationMode;
  imageDataUrl?: string;
};

function resolveChatLanguages(body: {
  locale?: unknown;
  interfaceLanguage?: unknown;
  targetLanguage?: unknown;
}): ChatLanguages {
  const locale =
    typeof body.locale === "string" && isInterfaceLanguage(body.locale)
      ? body.locale
      : "ko";
  const interfaceLanguage =
    typeof body.interfaceLanguage === "string" &&
    isInterfaceLanguage(body.interfaceLanguage)
      ? body.interfaceLanguage
      : locale;
  return {
    locale,
    interfaceLanguage,
    targetLanguage: coerceLanguageCode(body.targetLanguage),
  };
}

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

function englishCorrectionPolicy(
  explanationLanguage: string,
  explanationGuard: string,
): string {
  return `1) First fix their English into corrected (what they meant to say in THIS turn). This is for the learner, not for the chat voice.
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
- If the user embeds a word from their UI language inside an otherwise English sentence (proper noun or a word they don't know yet), that is NOT a grammar error — keep it in corrected, and you may gloss the meaning in assistantMessage.
${explanationGuard}`;
}

/** Language-specific mistake families — still analyze in THAT language's own terms. */
function targetLanguageFocusHints(targetLanguage: LearningLanguageCode): string {
  switch (targetLanguage) {
    case "ja":
      return `Japanese focus (use Japanese terms, not English labels):
- Particles (は/が/を/に/で/と/も…), verb/adjective conjugation, polite vs plain (です/ます vs 辞書形), word order, counters, transitive/intransitive pairs when wrong, unnatural calques from Korean/English.`;
    case "ko":
      return `Korean focus (use Korean terms):
- Particles (은/는/이/가/을/를/에/에서…), endings/politeness (해요체/반말/합쇼체), conjugation, honorifics when required by context, spacing, unnatural calques.`;
    case "zh":
      return `Chinese focus (use Chinese terms):
- Word order, 了/过/着, measure words, 的/地/得, aspect/result complements, coverbs (在/把/被), missing or wrong function words, unnatural calques.`;
    case "es":
    case "fr":
    case "it":
    case "pt":
      return `Romance focus (use ${learningLanguageName(targetLanguage)} terms, not English labels):
- Gender/number agreement, articles, verb conjugation/tense/mood (incl. subjunctive when required), clitics/pronouns, prepositions, ser/estar or language-specific copula pairs when relevant, false friends, unnatural calques.`;
    case "ru":
      return `Russian focus (use Russian terms):
- Case endings, verb aspect (perfective/imperfective), agreement, prepositions + case, word order only when it breaks meaning, unnatural calques.`;
    case "ar":
      return `Arabic focus (use Arabic terms):
- Root-and-pattern morphology, definite article, gender/number agreement, idafa, attached pronouns/clitics, verb form, case only when it is clearly wrong, MSA vs dialect mismatch when it breaks the intended register.`;
    case "id":
      return `Indonesian focus (use Indonesian terms):
- Affixes (me-/ber-/ter-/di-/ke-an), reduplication, particles (lah/kah/pun), word order, unnatural calques. Do not invent tense endings.`;
    case "vi":
      return `Vietnamese focus (use Vietnamese terms):
- Classifiers, aspect particles (đã/đang/sẽ), word order, pronouns/register, missing function words, unnatural calques. Do not split tones as spelling errors.`;
    case "th":
      return `Thai focus (use Thai terms):
- Word boundaries, classifiers, polite particles (ครับ/ค่ะ), serial verbs, missing function words, unnatural calques. Do not split words into letters.`;
    case "hi":
      return `Hindi focus (use Hindi terms):
- Postpositions, gender/number agreement, split verbs, honorifics, SOV word order, unnatural calques from English.`;
    default:
      return `Focus on real morphosyntax, agreement, function words, and patterns that natives would mark as wrong in ${learningLanguageName(targetLanguage)}.`;
  }
}

/**
 * Detailed correction for non-English learning languages.
 * Same thoroughness as English, but in the target language's own grammar terms.
 */
function detailedTargetCorrectionPolicy(
  targetLanguage: LearningLanguageCode,
  explanationLanguage: string,
  explanationGuard: string,
): string {
  const targetName = learningLanguageName(targetLanguage);
  return `1) First fix their ${targetName} into corrected (what they meant to say in THIS turn). This is for the learner, not for the chat voice.
- Do not change the topic to match recent. Pronouns/deixis may refer back; a new question or new subject does not.
2) Then write assistantMessage as a reply to the CORRECTED current turn only — never to the broken original, and never to an older recent line instead.
- If corrected is a question, answer that question.
- If corrected is a statement, respond to that statement.
- Do not reinterpret a broken question/statement into a different speech-act.
- Do not lecture, quiz grammar, or correct them inside assistantMessage.
3) Fill the rest of correction carefully and thoroughly:
- corrected: fully corrected ${targetName}. Fix REAL mistakes — agreement, conjugation/inflection, particles/case markers, function words, word order that breaks the language, wrong tense/aspect/mood, wrong politeness form when the form is ungrammatical for the intended move, wrong collocation that sounds broken.
- natural: a more natural/colloquial native alternative that is DIFFERENT from corrected whenever a more fluent option exists. If corrected is already the most natural, repeat corrected.
- explanation: 1–2 short sentences in ${explanationLanguage} explaining WHAT was wrong and why (point to the mistaken word/pattern). Do not include a label like "설명" / "Explanation".
- If corrected differs from the user's message (even slightly), explanation MUST be non-empty.
- Only if the user's message needs no change at all, set explanation to "".

${targetLanguageFocusHints(targetLanguage)}

Hard rules:
- Analyze ${targetName} in ITS own terms. Never force English grammar labels onto ${targetName} (no "article/preposition" lectures unless that category actually exists and matters here).
- Do NOT "correct" informal-but-acceptable spoken ${targetName} into textbook wording; put style upgrades only in natural.
- Do NOT change meaning in corrected. Meaning/style rewrites belong in natural only.
- Do NOT invent mistakes. If the line is already grammatical for the intended register, corrected MUST equal the user's message.
- Prefer keeping the learner's register (casual vs polite) in corrected unless that register is itself ungrammatical for what they are trying to say.
- If the user embeds UI-language words inside an otherwise ${targetName} sentence as a placeholder, that is NOT a grammar error — keep it in corrected; you may gloss it in assistantMessage.
${explanationGuard}`;
}

function buildChatSystem(
  langs: ChatLanguages,
  options: ChatTurnOptions = {},
) {
  const { interfaceLanguage, targetLanguage } = langs;
  const explanationLanguage =
    EXPLANATION_LANGUAGES[interfaceLanguage] ?? EXPLANATION_LANGUAGES.ko;
  const explanationGuard =
    explanationLanguageGuard({
      interfaceLanguage,
      fieldsDescription: "correction.explanation",
    }) +
    (interfaceLanguage === "ko"
      ? `
- Example style: "if 조건절에서는 미래의 일도 현재형을 써요."`
      : "");

  const targetName = learningLanguageName(targetLanguage);
  const voice = conversationVoicePrinciples(targetLanguage);
  const spoken = conversationKoreanParallel(interfaceLanguage, targetLanguage);
  const identity = conversationPartnerIdentity(targetLanguage);
  const mode = options.conversationMode === "tutor" ? "tutor" : "native";
  const tutorBlock =
    mode === "tutor"
      ? `
This turn is temporary tutor mode: they are stuck. You may briefly explain in ${explanationLanguage}, then go back to speaking ${targetName} as yourself. Do not stay in teacher voice after this turn. Correction still belongs in the correction JSON field, not as a lecture inside assistantMessage.`
      : `
conversationMode is native. Talk like a person on a messenger. Do not teach, quiz, or explain grammar unless they asked for help.`;
  const imageBlock = options.imageDataUrl
    ? `
They attached a photo. Look at it and react the way a friend would in chat. Do not caption it like a vision demo unless they asked what is in the picture. If they also sent text, reply to the text and the photo together. Correction applies to their text only, not the image.`
    : "";

  if (targetLanguage === "en") {
    return `${identity}

You chat in English with the user. Correction is a separate job from talking.
${tutorBlock}
${imageBlock}

The user JSON has "message" (the current turn — reply to THIS) and optional "recent" lines (background only).

${voice}
${spoken}

${englishCorrectionPolicy(explanationLanguage, explanationGuard)}

Return ONLY valid JSON (no markdown) with this exact shape:
{"assistantMessage":"...","spokenReply":"...","correction":{"corrected":"...","natural":"...","explanation":"..."}}`;
  }

  return `${commonLanguageInstructions({
    targetLanguage,
    interfaceLanguage,
  })}

${identity}

You chat in ${targetName} with the user. Correction is a separate, DETAILED job from talking — catch real ${targetName} mistakes carefully, the same way an English tutor would for English, but using ${targetName}'s own grammar.
${tutorBlock}
${imageBlock}

The user JSON has "message" (the current turn — reply to THIS) and optional "recent" lines (background only).

${voice}
${spoken}

${detailedTargetCorrectionPolicy(targetLanguage, explanationLanguage, explanationGuard)}

Return ONLY valid JSON (no markdown) with this exact shape:
{"assistantMessage":"...","spokenReply":"...","correction":{"corrected":"...","natural":"...","explanation":"..."}}`;
}

function buildHowToSaySystemBase(
  targetLanguage: LearningLanguageCode,
  interfaceLanguage: string,
): string {
  const targetName = learningLanguageName(targetLanguage);
  const interfaceName =
    EXPLANATION_LANGUAGES[interfaceLanguage] ?? EXPLANATION_LANGUAGES.ko;
  const keepKoExamples = interfaceLanguage === "ko";

  if (targetLanguage === "en") {
    const infoHint = keepKoExamples
      ? `If they asked for information (뭐/몇/어떻게/왜, a factual or opinion question), translate THAT question into English they would ask someone else:
Bad: "체지방 12%를 만들려면 남자 골격근량은 체중의 몇 퍼센트여야해?" → "Are you asking what the muscle mass percentage should be...?"
Good: "For men, what's a typical skeletal muscle percentage at 12% body fat?"

Only use "Are you asking...?" / "Do you mean...?" when THEY are checking the other person's previous question — their text itself is a confirmation ("묻는 거야?", "물어본 거야?", "그 말이야?") AND RECENT has the other person's line.
Bad: "하루를 기준으로 무슨 운동을 하는지 묻는거야?" → "What kind of exercise do you do in a day?"
Good: "Are you asking what I do for a workout each day?"

If they ask "how can I say X in English?" / "X 영어로?", extract X and give English for X — do not echo the meta question.

No quotes, no Korean, no extra commentary.`
      : `If they asked for information (a factual or opinion question), translate THAT question into English they would ask someone else — do not turn it into a meta "Are you asking...?" unless they themselves are confirming the other person's previous question AND RECENT has that line.

If they ask "how can I say X in English?", extract X and give English for X — do not echo the meta question.

No quotes, no leftover ${interfaceName}, no extra commentary.`;

    return `The user wants a natural English line THEY can say (or write) to another person. They may write in ${interfaceName}, English, or mixed.

You are a phrase helper, NOT a tutor. Do not answer their question, explain the topic, or ask them what they meant.

Give ONE spoken English line that keeps their speech act.
Match the situation (friend, work, interview, joke, online). Casual intent → casual English, including contractions, fragments, slang, or mild profanity if that is what they would actually say. Formal intent → that register. Do not turn casual talk into textbook English.
RECENT is only for resolving "that/they/this" or whose previous question they are confirming. Do not rewrite their line into the previous topic.

${infoHint}

Other acts to keep: confirming, refusing, suggesting, answering, joking.

Return ONLY JSON:
{"expression":"the English they would say"}`;
  }

  return `The user wants a natural ${targetName} line THEY can say (or write) to another person. They may write in ${interfaceName}, ${targetName}, or mixed.

You are a phrase helper, NOT a tutor. Do not answer their question, explain the topic, or ask them what they meant.

Give ONE spoken ${targetName} line that keeps their speech act.
Match the situation (friend, work, interview, joke, online). Casual intent → casual ${targetName}. Formal intent → that register. Do not turn casual talk into textbook ${targetName}.
RECENT is only for resolving references or whose previous question they are confirming. Do not rewrite their line into the previous topic.

If they asked for information, translate THAT question into ${targetName} they would ask someone else — do not turn it into a meta "Are you asking...?" unless they themselves are confirming the other person's previous question AND RECENT has that line.

Other acts to keep: confirming, refusing, suggesting, answering, joking.
If they ask "how can I say X in ${targetName}?", extract X and give ${targetName} for X — do not echo the meta question.

No quotes, no extra commentary. Output the expression in ${targetName}.

Return ONLY JSON:
{"expression":"the ${targetName} they would say"}`;
}

function buildHowToSaySystem(langs: ChatLanguages, premium: boolean) {
  const base = buildHowToSaySystemBase(
    langs.targetLanguage,
    langs.interfaceLanguage,
  );
  if (!premium) return base;
  const analysisLanguage =
    EXPLANATION_LANGUAGES[langs.interfaceLanguage] ?? EXPLANATION_LANGUAGES.ko;
  const targetName = learningLanguageName(langs.targetLanguage);
  return `${base}

Also include (same meaning, not an answer to their question):
- simpler: a shorter, easier ${targetName} line. Empty string if expression is already simple.
- moreNative: a more colloquial native line, not a synonym swap. Empty if nothing different.
- analysis: 1-2 sentences in ${analysisLanguage} on nuance / when to use which line.
${explanationLanguageGuard({
  interfaceLanguage: langs.interfaceLanguage,
  fieldsDescription: "analysis",
})}

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
  it: "Così suona più chiaro e naturale.",
  ru: "Так звучит понятнее и естественнее.",
  ar: "هذه الصياغة أوضح وأكثر طبيعية.",
  th: "แบบนี้ชัดเจนและเป็นธรรมชาติกว่า",
  hi: "यह वाक्य ज़्यादा साफ़ और स्वाभाविक है।",
};

async function replyToCorrected(
  openai: OpenAI,
  corrected: string,
  recent: string[] = [],
  langs: ChatLanguages,
): Promise<{ assistantMessage: string; spokenReply: string }> {
  const completion = await openai.chat.completions.create({
    model: chatModel(),
    messages: [
      {
        role: "system",
        content: `The person meant the ${learningLanguageName(langs.targetLanguage)} line in "corrected" (this turn). Reply to THAT line.

${conversationVoicePrinciples(langs.targetLanguage)}
${conversationKoreanParallel(langs.interfaceLanguage, langs.targetLanguage)}

recent is background only. If this turn is a new question or a new subject, answer it. Do not keep the previous topic going unless this line clearly refers back.
Do not lecture, correct their language, or thank them unless they complimented you.

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
    spokenReply:
      langs.interfaceLanguage === "en" ? "" : asText(parsed.spokenReply).trim(),
  };
}

async function runChat(
  openai: OpenAI,
  message: string,
  langs: ChatLanguages,
  recent: string[] = [],
  options: ChatTurnOptions = {},
): Promise<ChatPayload> {
  const payload = JSON.stringify({
    message,
    recent: recent.slice(-8),
    instruction:
      "Reply to message. Use recent only if this turn still refers to it.",
    hasImage: Boolean(options.imageDataUrl),
  });
  const userContent = options.imageDataUrl
    ? [
        { type: "text" as const, text: payload },
        {
          type: "image_url" as const,
          image_url: { url: options.imageDataUrl },
        },
      ]
    : payload;
  const completion = await openai.chat.completions.create({
    model: chatModel(),
    messages: [
      { role: "system", content: buildChatSystem(langs, options) },
      {
        role: "user",
        content: userContent,
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
    langs.interfaceLanguage === "en"
      ? ""
      : asText(parsed.spokenReply) ||
        asText(parsed.assistantSpoken) ||
        asText(parsed.assistantNative);
  const c = parsed.correction;
  const corrected = asText(c?.corrected) || message;
  const natural = asText(c?.natural) || corrected;
  let explanation =
    asText(c?.explanation) || asText(parsed.explanation);

  const needsExplanation =
    Boolean(message.trim()) &&
    normCompare(corrected) !== normCompare(message);
  if (needsExplanation && !explanation.trim()) {
    explanation =
      FALLBACK_EXPLANATION[langs.interfaceLanguage] ?? FALLBACK_EXPLANATION.ko;
  }

  let reply = assistantMessage;
  let spoken = spokenReply;
  if (needsExplanation && corrected.trim()) {
    try {
      const reread = await replyToCorrected(openai, corrected, recent, langs);
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
  langs: ChatLanguages,
) {
  return {
    assistantMessage: starter.en,
    spokenReply: langs.interfaceLanguage === "ko" ? starter.ko : "",
  };
}

async function runStart(
  openai: OpenAI,
  recent: string[],
  langs: ChatLanguages,
): Promise<{ assistantMessage: string; spokenReply: string }> {
  const targetName = learningLanguageName(langs.targetLanguage);
  const spokenRule = conversationKoreanParallel(
    langs.interfaceLanguage,
    langs.targetLanguage,
  );

  const completion = await openai.chat.completions.create({
    model: chatModel(),
    messages: [
      {
        role: "system",
        content: `Start a casual ${targetName} conversation. You are not a tutor opening a lesson.

${conversationPartnerIdentity(langs.targetLanguage)}
${conversationVoicePrinciples(langs.targetLanguage)}
${spokenRule}

Write 1–2 spoken ${targetName} lines as assistantMessage. Sound like texting a friend, not greeting a class.
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
    return starterPayload(pickStarter(recent), langs);
  }
  const parsed = JSON.parse(raw) as {
    assistantMessage?: unknown;
    spokenReply?: unknown;
  };
  const assistantMessage = asText(parsed.assistantMessage).trim();
  const spokenReply =
    langs.interfaceLanguage === "en" ? "" : asText(parsed.spokenReply).trim();
  if (!assistantMessage) {
    return starterPayload(pickStarter(recent), langs);
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
  langs: ChatLanguages,
  isPremium: boolean,
): Promise<ExpressionPayload> {
  const completion = await openai.chat.completions.create({
    model: chatModel(),
    messages: [
      { role: "system", content: buildHowToSaySystem(langs, isPremium) },
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
  const chat = await runChat(openai, expression.expression, langs, recent);

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
  const openai = getOpenAIClient();

  const { userId, isPremium } = await resolveRequestEntitlement(request);

  let body: {
    message?: string;
    mode?: string;
    locale?: string;
    interfaceLanguage?: string;
    targetLanguage?: string;
    recent?: unknown;
    imageDataUrl?: unknown;
    conversationMode?: unknown;
  };
  try {
    body = await request.json();
  } catch {
    return jsonWithCors(request, { error: "Invalid JSON" }, { status: 400 });
  }

  const langs = resolveChatLanguages(body);
  const mode =
    body.mode === "how_to_say"
      ? "how_to_say"
      : body.mode === "start"
        ? "start"
        : "chat";

  if (mode === "start") {
    const recent = parseRecent(body.recent);
    if (!openai) {
      return jsonWithCors(request, starterPayload(pickStarter(recent), langs));
    }
    try {
      const data = await runStart(openai, recent, langs);
      return jsonWithCors(request, data);
    } catch (error) {
      console.error("[chat-start]", error);
      return jsonWithCors(
        request,
        starterPayload(pickStarter(recent), langs),
      );
    }
  }

  if (!openai) {
    return jsonWithCors(request, { error: "MISSING_OPENAI_KEY" }, { status: 503 });
  }

  const imageDataUrl = isChatImageDataUrl(body.imageDataUrl)
    ? body.imageDataUrl
    : undefined;
  const conversationMode = isConversationMode(body.conversationMode)
    ? body.conversationMode
    : undefined;
  const message = body.message?.trim() ?? "";
  if (!message && !(mode === "chat" && imageDataUrl)) {
    return jsonWithCors(request, { error: "message required" }, { status: 400 });
  }

  if (
    (mode === "chat" || mode === "how_to_say") &&
    !isPremium &&
    (await getDailyUsed(userId)) >= FREE_DAILY_CHAT_LIMIT
  ) {
    return jsonWithCors(request, { error: "DAILY_LIMIT_REACHED" }, { status: 403 });
  }

  try {
    if (mode === "how_to_say") {
      const data = await runHowToSay(
        openai,
        message,
        parseRecent(body.recent),
        langs,
        isPremium,
      );
      if (!isPremium) {
        await incrementDailyUsed(userId);
      }
      return jsonWithCors(request, data);
    }

    const data = await runChat(
      openai,
      message,
      langs,
      parseRecent(body.recent),
      { conversationMode, imageDataUrl },
    );
    if (!isPremium) {
      await incrementDailyUsed(userId);
    }
    return jsonWithCors(request, data);
  } catch (error) {
    console.error("[chat]", error);
    return jsonWithCors(request, { error: "CHAT_FAILED" }, { status: 500 });
  }
}
