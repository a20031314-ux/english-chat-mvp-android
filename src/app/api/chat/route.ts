import { completeChat, routeFor, simErrorDetail } from "@/lib/server/llm";
import { chatBonusToday } from "@/lib/server/adChat";
import { takeAiHelp } from "@/lib/server/aiHelp";
import { meterRequest, recordTokens } from "@/lib/server/meterRequest";
import { takeRoomHint } from "@/lib/server/roomHint";
import { NextRequest, after } from "next/server";
import { observeChatLines, observeChatTurn } from "@/lib/server/learnerProfileStore";
import { observeMapUse } from "@/lib/server/curriculumStore";
import { observeWeakPoints } from "@/lib/server/weakPointStore";
import { recordTurn } from "@/lib/server/ledgerStore";
import { forgetLearnerBrief, readLearnerBrief } from "@/lib/server/learnerBrief";
import { recordGrowthTurn } from "@/lib/server/growthStore";
import { nearlySame } from "@/lib/learner/growth";
import { recordLearnerTurn } from "@/lib/server/learnerMetrics";
import { requestAppVersion } from "@/lib/appVersion";
import {
  parsePracticeGoal,
  practiceOpeningPrompt,
  practicePrompt,
  type PracticeGoal,
} from "@/lib/learner/practice";
import { writtenInLearningLanguage } from "@/lib/inputLanguage";
import type OpenAI from "openai";
import { getOpenAIClient } from "@/lib/server/openai";
import { targetLanguageFocusHints } from "@/lib/languageFocus";
import { shouldKeepLearnerLine } from "@/lib/correctionGuard";
import { explainFeelingSlips, promoteFeelingSlip } from "@/lib/feelingAdjectives";
import { findIrregularSlips, koreanSlipHint, repairIrregularSlips } from "@/lib/koreanSlips";
import {
  getDailyUsed,
  incrementDailyUsed,
} from "@/lib/server/entitlementStore";
import { resolveRequestEntitlement } from "@/lib/server/premiumRequest";
import { normalizeHowToSayExpression } from "@/lib/howToSay";
import { foreignWords, inLearningScript } from "@/lib/vocabScript";
import { corsPreflightResponse, jsonWithCors, streamWithCors } from "@/lib/server/cors";
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
import {
  commonLanguageInstructions,
  explanationInLearningLanguage,
  explanationLanguageGuard,
} from "@/lib/languageLearningAnalysis";

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
  /**
   * 답만 쓰는 호출(새 앱 스트림): 교정은 나란히 도는 다른 호출이 맡는다.
   * 학습자 문장이 틀렸어도 뜻한 것에 답하게 해서 다시 답하기(reread)가 필요 없다.
   */
  replyOnly?: boolean;
  conversationMode?: ConversationMode;
  imageDataUrl?: string;
  /**
   * They wrote this turn in their own language, not the one they are learning
   * — they did not know how to say it. The conversation carries on; how to say
   * it is a card they open themselves (how_to_say with expressionOnly).
   */
  ownLanguage?: boolean;
  /**
   * What their own recent practice shows, for the tutor (learner/brief.ts):
   * mistakes that recur, phrases to bring back, whether to ease off or stretch.
   */
  brief?: string;
  /** What this conversation was started to practise (learner/practice.ts). */
  practice?: PracticeGoal | null;
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
- A wrong word choice is a real error, not style: a feeling adjective used for the wrong side (the -ing form that describes what causes a feeling, used for the person who feels it, or the reverse), a verb used without the preposition or object pattern it needs, a singular or uncountable noun used where the meaning is many. Fix these in corrected and explain them.
- If natural fixes something that was wrong (not just smoother), corrected must fix it too. natural is never the only place a mistake is fixed.
- If there is no real grammar/agreement/article/preposition/tense/word-choice error, corrected MUST equal the user's message.
- Keep tenses consistent across the whole corrected line: when one clause is about the past, related verbs are past too.
- Very short replies (one or two words: yes, ok, idk, maybe, hmm) are complete answers. Keep corrected equal to the message unless the word itself is misspelled; never expand it into a sentence they did not say.
- The explanation must describe exactly what changed between the message and corrected — never a change you did not make.
- If the user embeds a word from another language inside an otherwise English sentence, they did not know the English word: put the English word in corrected (that is the point of the correction) and say in the explanation which word it replaces. Names of people, places, brands and dishes with no English equivalent stay as they are.
${explanationGuard}`;
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
- If natural fixes something that was wrong (not just smoother), corrected must fix it too. natural is never the only place a mistake is fixed.
- Do NOT invent mistakes. If the line is already grammatical for the intended register, corrected MUST equal the user's message.
- Prefer keeping the learner's register (casual vs polite) in corrected unless that register is itself ungrammatical for what they are trying to say — or wrong for who they are talking to (a teacher, elder, boss or customer addressed casually where ${targetName} requires respect: fix that in corrected and keep natural respectful too). Never lower the politeness they already used.
- Very short replies (one or two words: yes/no, I don't know, maybe, a filler, a polite short answer) are complete answers. Keep corrected equal to the message unless the word itself is misspelled or ungrammatical; never expand it into a sentence they did not say.
- The explanation must describe exactly what changed between the message and corrected — never a change you did not make, never a different part than the one you fixed, and never call their wrong form acceptable.
- If the user embeds a word from another language inside an otherwise ${targetName} sentence, they did not know the ${targetName} word: put the ${targetName} word in corrected (that is the point of the correction) and say in the explanation which word it replaces. Names of people, places, brands and dishes with no ${targetName} equivalent stay as they are.
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
      learningLanguage: targetLanguage,
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
  const ownLanguageBlock = options.ownLanguage
    ? `
This turn they wrote in ${explanationLanguage}, their own language, because they did not know how to say it in ${targetName}. Understand it and reply in ${targetName} as yourself, carrying the conversation on — as a friend who speaks both would. Do not translate their message back to them and do not teach. Correction does not apply to this turn: set corrected and natural to their message unchanged and explanation to "".
If it is a question to you — most often what a word or phrase YOU just used means (look at your last "other:" line in recent) — answer that question: name the word from your last line and explain it simply in ${targetName}, adding its meaning in ${explanationLanguage} in parentheses right after the word. Never answer by translating their question itself ("that word means 'what does that word mean'"), and never switch to English or any third language. If you cannot tell which word, ask which one, in ${targetName}.
If they ask about their own learning — what they have improved at, what to practise next — it is about THEM, not you and not the world: answer as someone who has been chatting with them, from what recent (and any brief about their practice) shows, honestly saying when there is little to go on, and name one concrete thing to practise.`
    : "";
  const imageBlock = options.imageDataUrl
    ? `
They attached a photo. Look at it and react the way a friend would in chat. Do not caption it like a vision demo unless they asked what is in the picture. If they also sent text, reply to the text and the photo together. Correction applies to their text only, not the image.`
    : "";

  if (options.replyOnly) {
    return `${targetLanguage === "en" ? "" : commonLanguageInstructions({ targetLanguage, interfaceLanguage }) + "\n\n"}${identity}

You chat in ${targetName} with the user. This call only writes your reply — another step corrects their language, so do not correct, quote back or comment on their wording.
${tutorBlock}
${ownLanguageBlock}
${imageBlock}

The user JSON has "message" (the current turn — reply to THIS) and optional "recent" lines (background only).
Their message may have mistakes (wrong word, wrong ending, a word from another language mixed in). Reply to what they clearly meant, the way a friend would who understood them.

${voice}
${spoken}

Return ONLY valid JSON (no markdown) with this exact shape:
{"assistantMessage":"...","spokenReply":"..."}`;
  }

  if (targetLanguage === "en") {
    return `${identity}

You chat in English with the user. Correction is a separate job from talking.
${tutorBlock}
${ownLanguageBlock}
${imageBlock}

The user JSON has "message" (the current turn — reply to THIS) and optional "recent" lines (background only). It may also have "noticed": something a rule checker already found in message — trust it, fix it in corrected and explain it.

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
${ownLanguageBlock}
${imageBlock}

The user JSON has "message" (the current turn — reply to THIS) and optional "recent" lines (background only). It may also have "noticed": mistakes a rule checker already found in message — trust it, fix them in corrected and explain them.

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
Keep who the line is about: their "I/my" stays I/my and "you" stays you. A learner asking what they themselves got better at or should practise is asking about their OWN progress — keep it about them, and read a verb like "increase" in that sense (improve) when that is what a learner means.

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
Keep who the line is about: their "I/my" stays I/my and "you" stays you. A learner asking what they themselves got better at or should practise is asking about their OWN progress — keep it about them, and read a verb like "increase" in that sense (improve) when that is what a learner means.
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
  learningLanguage: langs.targetLanguage,
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

/**
 * Put a correction note back into the app's language when the model wrote it
 * in the language being learned.
 *
 * The guard in the prompt says not to, and with the app in Korean or English
 * that holds. With the app in Spanish, Japanese or Hindi and a learning
 * language in another script, it did not: measured on 2026-10-05 across those
 * pairs (scripts/check-language-pairs.mjs), eight of them answered the
 * explanation in the learning language on every try — a Spanish reader
 * learning Korean was told what they got wrong in Korean. So the note is
 * checked after it comes back, and only a note that failed costs this call.
 * If the restatement fails too, the note is dropped and the caller's generic
 * fallback, which is in the right language, takes its place.
 */
async function restateExplanation(
  openai: OpenAI,
  explanation: string,
  langs: ChatLanguages,
): Promise<string> {
  const uiName =
    EXPLANATION_LANGUAGES[langs.interfaceLanguage] ?? EXPLANATION_LANGUAGES.ko;
  const targetName = learningLanguageName(langs.targetLanguage);
  try {
    const completion = await completeChat(openai, "chat", {
      messages: [
        {
          role: "system",
          content: `Restate this note about a ${targetName} mistake for a learner who reads ${uiName}. Same point, 1–2 short sentences, written entirely in ${uiName}. Keep ${targetName} words and forms as they are, inside quotes. Return only json: {"explanation":"..."}`,
        },
        { role: "user", content: explanation },
      ],
      response_format: { type: "json_object" },
      temperature: 0.2,
    });
    const raw = completion.choices[0]?.message?.content;
    const restated = raw
      ? asText((JSON.parse(raw) as { explanation?: unknown }).explanation).trim()
      : "";
    if (
      restated &&
      !explanationInLearningLanguage(
        restated,
        langs.interfaceLanguage,
        langs.targetLanguage,
      )
    ) {
      return restated;
    }
  } catch (error) {
    console.error("[chat-restate-explanation]", error);
  }
  return "";
}

async function replyToCorrected(
  openai: OpenAI,
  corrected: string,
  recent: string[] = [],
  langs: ChatLanguages,
): Promise<{ assistantMessage: string; spokenReply: string }> {
  const completion = await completeChat(openai, "chat", {
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
      langs.interfaceLanguage === langs.targetLanguage
        ? ""
        : asText(parsed.spokenReply).trim(),
  };
}

async function runChat(
  openai: OpenAI,
  message: string,
  langs: ChatLanguages,
  recent: string[] = [],
  options: ChatTurnOptions & { onReread?: () => void; skipReread?: boolean } = {},
): Promise<ChatPayload> {
  // 한국어 학습: 모델이 자주 놓치는 불규칙 활용·윗사람께 반말을 규칙으로 먼저 찾아 알려 준다(koreanSlips.ts).
  const koSlips =
    langs.targetLanguage === "ko" && !options.ownLanguage ? findIrregularSlips(message) : [];
  const koHint =
    langs.targetLanguage === "ko" && !options.ownLanguage ? koreanSlipHint(message) : "";
  // 다른 문자로 쓴 낱말이 섞였으면(영어 문장 속 한글 등) 규칙으로 찾아 알려 준다(vocabScript.foreignWords).
  const mixed = options.ownLanguage ? [] : foreignWords(message, langs.targetLanguage);
  const mixedHint = mixed.length
    ? `Words from another language in message: ${mixed.map((w) => `"${w}"`).join(", ")}. Unless one is a name of a person, place or brand, put the ${learningLanguageName(langs.targetLanguage)} word in corrected and name it in the explanation.`
    : "";
  const noticed = [koHint, mixedHint].filter(Boolean).join(" ");
  const payload = JSON.stringify({
    message,
    recent: recent.slice(-8),
    instruction:
      "Reply to message. Use recent only if this turn still refers to it.",
    ...(noticed ? { noticed } : {}),
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
  const completion = await completeChat(openai, "chat", {
    messages: [
      { role: "system", content: buildChatSystem(langs, options) },
      ...(options.brief ? [{ role: "system" as const, content: options.brief }] : []),
      ...(options.practice
        ? [
            {
              role: "system" as const,
              content: practicePrompt(options.practice, learningLanguageName(langs.targetLanguage)),
            },
          ]
        : []),
      {
        role: "user",
        content: userContent,
      },
    ],
    response_format: { type: "json_object" },
    temperature: 0.9,
  });
  void recordTokens("chat", completion.usage);

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
    langs.interfaceLanguage === langs.targetLanguage
      ? ""
      : asText(parsed.spokenReply) ||
        asText(parsed.assistantSpoken) ||
        asText(parsed.assistantNative);
  const c = parsed.correction;
  let corrected = asText(c?.corrected) || message;
  let natural = asText(c?.natural) || corrected;
  let explanation =
    asText(c?.explanation) || asText(parsed.explanation);
  // 모델이 불규칙 활용 실수를 고친 문장에 그대로 두면 바로잡는다.
  if (langs.targetLanguage === "ko" && !options.ownLanguage) {
    // 학습자 문장에서 찾은 것 + 모델이 고친 문장에 새로 만든 틀린 꼴(예: 부루어요 → 부르어요)까지.
    corrected = repairIrregularSlips(corrected, [...koSlips, ...findIrregularSlips(corrected)]);
    natural = repairIrregularSlips(natural, [...koSlips, ...findIrregularSlips(natural)]);
  }
  // 고칠 게 없는 줄(문장부호만 다름, ?·이모지, 짧은 답을 문장으로 늘림)은 고침·설명을 비운다.
  if (!koSlips.length && shouldKeepLearnerLine(message, corrected, langs.targetLanguage)) {
    corrected = message;
    natural = shouldKeepLearnerLine(message, natural, langs.targetLanguage) ? message : natural;
    explanation = "";
  }
  // 감정 형용사 -ing/-ed를 natural에서만 고친 줄 → corrected에도, 설명은 앱 언어로(2026-10-22, Haiku 운영 확인).
  if (langs.targetLanguage === "en" && !options.ownLanguage) {
    const feeling = promoteFeelingSlip(corrected, natural);
    if (feeling) {
      const wasUnchanged = normCompare(corrected) === normCompare(message);
      corrected = feeling.corrected;
      const note = explainFeelingSlips(feeling.slips, langs.interfaceLanguage);
      explanation = wasUnchanged || !explanation.trim() ? note : `${explanation} ${note}`;
    }
  }

  const needsExplanation =
    Boolean(message.trim()) &&
    normCompare(corrected) !== normCompare(message);
  if (
    explanation.trim() &&
    explanationInLearningLanguage(
      explanation,
      langs.interfaceLanguage,
      langs.targetLanguage,
    )
  ) {
    explanation = await restateExplanation(openai, explanation, langs);
  }
  if (needsExplanation && !explanation.trim()) {
    explanation =
      FALLBACK_EXPLANATION[langs.interfaceLanguage] ?? FALLBACK_EXPLANATION.ko;
  }

  let reply = assistantMessage;
  let spoken = spokenReply;
  if (needsExplanation && corrected.trim() && !options.skipReread) {
    try {
      options.onReread?.();
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

/** 새 앱 스트림의 답 호출: 교정 없이 답만(짧게 → 빨리). */
async function runChatReply(
  openai: OpenAI,
  message: string,
  langs: ChatLanguages,
  recent: string[] = [],
  options: ChatTurnOptions = {},
): Promise<{ assistantMessage: string; spokenReply: string }> {
  const payload = JSON.stringify({
    message,
    recent: recent.slice(-8),
    instruction: "Reply to message. Use recent only if this turn still refers to it.",
    hasImage: Boolean(options.imageDataUrl),
  });
  const userContent = options.imageDataUrl
    ? [
        { type: "text" as const, text: payload },
        { type: "image_url" as const, image_url: { url: options.imageDataUrl } },
      ]
    : payload;
  const completion = await completeChat(openai, "chat", {
    messages: [
      { role: "system", content: buildChatSystem(langs, { ...options, replyOnly: true }) },
      ...(options.brief ? [{ role: "system" as const, content: options.brief }] : []),
      ...(options.practice
        ? [
            {
              role: "system" as const,
              content: practicePrompt(options.practice, learningLanguageName(langs.targetLanguage)),
            },
          ]
        : []),
      { role: "user", content: userContent },
    ],
    response_format: { type: "json_object" },
    temperature: 0.9,
    max_tokens: 800,
  });
  void recordTokens("chatReply", completion.usage);
  const raw = completion.choices[0]?.message?.content;
  if (!raw) throw new Error("empty reply");
  const parsed = JSON.parse(raw) as { assistantMessage?: unknown; spokenReply?: unknown };
  const assistantMessage = asText(parsed.assistantMessage).trim();
  if (!assistantMessage) throw new Error(`empty reply: ${raw.slice(0, 200)}`);
  return {
    assistantMessage,
    spokenReply:
      langs.interfaceLanguage === langs.targetLanguage ? "" : asText(parsed.spokenReply).trim(),
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
  practice: PracticeGoal | null = null,
): Promise<{ assistantMessage: string; spokenReply: string }> {
  const targetName = learningLanguageName(langs.targetLanguage);
  const spokenRule = conversationKoreanParallel(
    langs.interfaceLanguage,
    langs.targetLanguage,
  );

  const completion = await completeChat(openai, "chat", {
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
${practice ? `\n${practiceOpeningPrompt(practice, targetName)}\nThis comes before "vary the topic": the situation decides what you open with.\n` : ""}
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
    langs.interfaceLanguage === langs.targetLanguage
      ? ""
      : asText(parsed.spokenReply).trim();
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

/** The expression alone — how to say what they wrote — with no chat turn after it. */
async function runHowToSayCard(
  openai: OpenAI,
  message: string,
  recent: string[],
  langs: ChatLanguages,
  isPremium: boolean,
): Promise<Omit<ExpressionPayload, "assistantMessage" | "spokenReply" | "correction">> {
  const ask = async (insist: boolean) => {
    const completion = await completeChat(openai, "howToSay", {
      messages: [
        {
          role: "system",
          content:
            buildHowToSaySystem(langs, isPremium) +
            (insist
              ? `\n\nThe expression and example must be written in ${learningLanguageName(langs.targetLanguage)} — not in the language they wrote in, and not in any other language.`
              : ""),
        },
        { role: "user", content: JSON.stringify({ wantToSay: message, recent }) },
      ],
      response_format: { type: "json_object" },
      temperature: 0.75,
    });
    const raw = completion.choices[0]?.message?.content;
    if (!raw) throw new Error("empty completion");
    return normalizeHowToSayExpression(message, JSON.parse(raw) as Partial<ExpressionPayload>);
  };
  // A card for Thai came back in Chinese once in a run of 196 learners (sim-users
  // 2026-10-18): asked once more, saying which language, before it is shown.
  let expression = await ask(false);
  if (expression.expression && !inLearningScript(expression.expression, langs.targetLanguage)) {
    expression = await ask(true);
  }
  return {
    expression: expression.expression,
    example: expression.example || "",
    ...(isPremium && expression.simpler ? { simpler: expression.simpler } : {}),
    ...(isPremium && expression.moreNative ? { moreNative: expression.moreNative } : {}),
    ...(isPremium && expression.analysis ? { analysis: expression.analysis } : {}),
  };
}

async function runHowToSay(
  openai: OpenAI,
  message: string,
  recent: string[],
  langs: ChatLanguages,
  isPremium: boolean,
): Promise<ExpressionPayload> {
  const completion = await completeChat(openai, "howToSay", {
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

  const { userId, isPremium, tier, terms } = await resolveRequestEntitlement(request);
  // Messages a day on this plan (billing/plans.ts); null for none.
  const chatLimit = terms.dailyChat;

  let body: {
    message?: string;
    mode?: string;
    locale?: string;
    interfaceLanguage?: string;
    targetLanguage?: string;
    recent?: unknown;
    imageDataUrl?: unknown;
    conversationMode?: unknown;
    ownLanguage?: unknown;
    expressionOnly?: unknown;
    purpose?: unknown;
    practice?: unknown;
    stream?: unknown;
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

  // A conversation started from "try this" or the map: what it is for
  // (learner/practice.ts). Opening it costs nothing, like any opening line.
  const practice = parsePracticeGoal(body.practice);

  if (mode === "start") {
    const recent = parseRecent(body.recent);
    if (!openai) {
      return jsonWithCors(request, starterPayload(pickStarter(recent), langs));
    }
    try {
      void meterRequest(request, "chatStart");
      const data = await runStart(openai, recent, langs, practice);
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

  // An expression card opened under a line already sent is not a new chat:
  // what is counted is what the learner sends, whatever language it is in.
  const expressionOnly = mode === "how_to_say" && body.expressionOnly === true;
  if (expressionOnly) {
    // 말하는 방 힌트(본인만 보는 "이렇게 말해 보세요"): 같은 카드지만 따로 세고 하루 상한.
    const roomHint = body.purpose === "roomHint";
    if (roomHint && !(await takeRoomHint(userId))) {
      return jsonWithCors(request, { error: "HINT_LIMIT" }, { status: 429 });
    }
    // 표현 카드·다듬어 보기·학습 언어로(누를 때만 도는 AI 도움, server/aiHelp.ts). 방 힌트는 위의 자기 한도.
    if (!roomHint) {
      const help = await takeAiHelp(request, "help");
      if (!help.ok) return jsonWithCors(request, { error: help.error, limit: help.limit }, { status: 429 });
    }
    try {
      void meterRequest(request, roomHint ? "roomHint" : "howToSayCard");
      const card = await runHowToSayCard(openai, message, parseRecent(body.recent), langs, isPremium);
      return jsonWithCors(request, card);
    } catch (error) {
      console.error("[chat-card]", error);
      return jsonWithCors(request, { error: "CARD_FAILED" }, { status: 502 });
    }
  }

  if (
    (mode === "chat" || mode === "how_to_say") &&
    chatLimit !== null &&
    (await getDailyUsed(userId)) >= chatLimit + (await chatBonusToday(userId, tier))
  ) {
    return jsonWithCors(request, { error: "DAILY_LIMIT_REACHED" }, { status: 403 });
  }

  // 답이 나간 뒤의 기록들(문장은 저장하지 않고 표현·지표만). 옛 앱은 답 뒤에, 새 앱은 교정까지 보낸 뒤에.
  const chatBookkeeping = async (data: ChatPayload) => {
      const jobs: Promise<unknown>[] = [];
      const later = (job: () => Promise<unknown> | unknown) => {
        jobs.push(Promise.resolve().then(job).catch((error) => console.error("[chat-after]", error)));
      };
      // The sentence is read for the constructions in it once the reply is on
      // its way (learner/profile.ts). Only a sentence written in the language
      // being learned is practice; a question asked in the learner's own
      // language is not read.
      const practised =
        Boolean(message) &&
        writtenInLearningLanguage(message, langs.targetLanguage, langs.interfaceLanguage);
      // And both lines are held against what they have looked up before: the
      // reply as an appearance, their sentence as use (learner/comprehension.ts).
      // And into the expression ledger: their sentence as output, the reply as
      // something heard (learner/ledger.ts).
      // How the turn went, without the words (learnerMetrics.ts): whether it
      // needed correcting is what the learner brief reads for chat.
      if (practised) {
        later(async () => {
          await recordLearnerTurn({
            userId,
            surface: "chat",
            language: langs.targetLanguage,
            uiLanguage: langs.interfaceLanguage,
            sessionId: null,
            turnIndex: null,
            text: message,
            spoken: false,
            corrected: data.correction?.corrected ?? "",
            appVersion: requestAppVersion(request.headers),
            now: Date.now(),
          });
          await forgetLearnerBrief(userId, langs.targetLanguage);
          // The My tab's elements (learner/growth.ts): a line needing no
          // correction grows accuracy, and one already as natural as it gets
          // grows naturalness too.
          const same = (a: string, b: string) => a.replace(/\s+/g, " ").trim().toLowerCase() === b.replace(/\s+/g, " ").trim().toLowerCase();
          const corrected = data.correction?.corrected ?? "";
          const natural = data.correction?.natural ?? "";
          await recordGrowthTurn({
            userId,
            language: langs.targetLanguage,
            turn: {
              surface: "chat",
              corrected: corrected ? !same(corrected, message) : null,
              alreadyNatural: !natural || nearlySame(natural, message),
            },
          });
        });
      }
      later(() =>
        recordTurn({
          userId,
          language: langs.targetLanguage,
          where: "chat",
          tutorLine: data.assistantMessage ?? "",
          ...(practised
            ? { learner: { sentence: message, corrected: data.correction?.corrected ?? "" } }
            : {}),
        }),
      );
      later(() =>
        observeChatLines({
          userId,
          language: langs.targetLanguage,
          tutorLine: data.assistantMessage ?? "",
          ...(practised
            ? { learnerLine: { sentence: message, corrected: data.correction?.corrected ?? "" } }
            : {}),
        }),
      );
      if (practised) {
        // A phrase on their study map, said here, is output they produced on
        // their own (curriculum/missions.ts).
        // Then, one after the other since both write the map's items: a
        // mistake of a kind they keep making goes onto the map to learn
        // (curriculum/weakPoints.ts).
        later(async () => {
          await observeMapUse({
            userId,
            language: langs.targetLanguage,
            sentence: message,
            corrected: data.correction?.corrected ?? "",
            where: "chat",
          });
          await observeWeakPoints({
            openai,
            userId,
            language: langs.targetLanguage,
            sentence: message,
            corrected: data.correction?.corrected ?? "",
            meter: (op) => void meterRequest(request, op),
          });
        });
        later(async () => {
          await observeChatTurn({
            openai,
            userId,
            language: langs.targetLanguage,
            sentence: message,
            corrected: data.correction?.corrected ?? "",
            meter: () => void meterRequest(request, "learnerObserve"),
          });
        });
      }

      await Promise.all(jobs);
  };

  try {
    if (mode === "how_to_say") {
      void meterRequest(request, "howToSay");
      const data = await runHowToSay(
        openai,
        message,
        parseRecent(body.recent),
        langs,
        isPremium,
      );
      await incrementDailyUsed(userId);
      return jsonWithCors(request, data);
    }

    // Counted here rather than by the daily limiter, which answers how many
    // messages someone sent and not what they cost. The reread is counted as it
    // happens, so the two together say how often a correction is large enough
    // to need the reply written twice.
    void meterRequest(request, "chat");
    // What their own practice shows — mistakes that recur, learned phrases to
    // bring back, whether to ease off or stretch (learner/brief.ts). Built from
    // what is kept and cached for minutes; empty when there is nothing yet.
    const brief = (await readLearnerBrief(userId, langs.targetLanguage)).prompt;
    const turnOptions: ChatTurnOptions = {
      conversationMode,
      imageDataUrl,
      ownLanguage: body.ownLanguage === true,
      brief,
      practice,
    };
    const recentLines = parseRecent(body.recent);

    // 새 앱(2026-10-22~): 답을 먼저 보내고 교정은 도착하면(NDJSON 두 줄).
    // 답 호출과 교정 호출이 나란히 돌아, 답은 짧은 호출만큼만 기다린다. 옛 앱은 아래 한 덩어리 그대로.
    if (body.stream === true) {
      void meterRequest(request, "chatReply");
      const encoder = new TextEncoder();
      const ownLanguage = turnOptions.ownLanguage === true;
      const correctionCall: Promise<ChatPayload | null> = ownLanguage
        ? Promise.resolve(null)
        : runChat(openai, message, langs, recentLines, { ...turnOptions, skipReread: true });
      // 교정 호출이 실패해도 답은 간다 — 처리 안 된 거부로 남지 않게 미리 받아 둔다.
      const correctionSafe = correctionCall.catch((error) => {
        console.error("[chat-stream-correction]", error);
        return null;
      });
      const replyCall = runChatReply(openai, message, langs, recentLines, turnOptions);
      let finish: (data: ChatPayload | null) => void = () => {};
      const finished = new Promise<ChatPayload | null>((resolve) => {
        finish = resolve;
      });
      after(async () => {
        const data = await finished;
        if (data) await chatBookkeeping(data);
      });
      const stream = new ReadableStream<Uint8Array>({
        async start(controller) {
          const send = (line: unknown) => controller.enqueue(encoder.encode(`${JSON.stringify(line)}\n`));
          let reply: { assistantMessage: string; spokenReply: string } | null = null;
          let replyError: unknown = null;
          try {
            reply = await replyCall;
          } catch (error) {
            replyError = error;
            console.error("[chat-stream-reply]", error);
            // 답 호출이 안 되면 교정 호출이 같이 쓴 답으로.
            const fallback = await correctionSafe;
            if (fallback?.assistantMessage) {
              reply = { assistantMessage: fallback.assistantMessage, spokenReply: fallback.spokenReply ?? "" };
            }
          }
          if (!reply) {
            const detail = simErrorDetail(replyError ?? new Error("reply failed"));
            send({ type: "error", error: "CHAT_FAILED", ...(detail ? { detail } : {}) });
            controller.close();
            finish(null);
            return;
          }
          await incrementDailyUsed(userId);
          send({ type: "reply", ...reply });
          const corrected = await correctionSafe;
          const correction = ownLanguage
            ? { corrected: message, natural: message, explanation: "" }
            : corrected?.correction ?? null;
          send({ type: "correction", correction });
          controller.close();
          // 교정이 없으면(실패) 기록을 건너뛴다 — 맞은 줄로 잘못 세지 않게.
          finish(correction ? { ...reply, correction } : null);
        },
      });
      return streamWithCors(request, stream);
    }

    const data = await runChat(
      openai,
      message,
      langs,
      recentLines,
      {
        ...turnOptions,
        // 옛 앱(스트림 없음): Claude는 틀린 줄도 뜻한 대로 알아듣고 답해서 다시 답하기를 뺀다 —
        // 두 번 기다리면 약 4.5초, 빼면 약 2초(2026-10-22 비교). OpenAI 모델이면 예전처럼.
        skipReread: routeFor("chat").provider === "anthropic",
        onReread: () => void meterRequest(request, "chatReread"),
      },
    );
    await incrementDailyUsed(userId);
    after(() => chatBookkeeping(data));
    return jsonWithCors(request, data);
  } catch (error) {
    console.error("[chat]", error);
    const detail = simErrorDetail(error);
    return jsonWithCors(request, { error: "CHAT_FAILED", ...(detail ? { detail } : {}) }, { status: 500 });
  }
}
