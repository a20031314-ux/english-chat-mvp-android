import {
  chatPartnerForLanguage,
  conversationPartnerIdentity,
} from "./chatPartner.ts";
import {
  interfaceLanguageName,
  learningLanguageName,
  type LearningLanguageCode,
} from "./learningLanguages.ts";

export const REALTIME_CALL_MODEL =
  process.env.OPENAI_REALTIME_MODEL ?? "gpt-realtime-2.1";

const VOICE_BY_LANGUAGE: Partial<Record<LearningLanguageCode, string>> = {
  en: "ash",
  ko: "cedar",
};

export function realtimeCallVoice(targetLanguage: LearningLanguageCode): string {
  return VOICE_BY_LANGUAGE[targetLanguage] ?? "ash";
}

export function realtimeCallInstructions(
  targetLanguage: LearningLanguageCode,
  /** What the learner speaks natively; the call has to expect it mid-sentence. */
  nativeLanguage: LearningLanguageCode = "ko",
): string {
  const partner = chatPartnerForLanguage(targetLanguage);
  const language = learningLanguageName(targetLanguage);
  const identity = conversationPartnerIdentity(targetLanguage);
  const nativeName =
    nativeLanguage === targetLanguage
      ? "English"
      : interfaceLanguageName(nativeLanguage);

  const bilingual =
    targetLanguage === "en"
      ? `You are a native English speaker. This is a phone call, not a lesson.
Speak English by default — casual spoken US English, short turns, like answering a friend's call.
You also understand ${nativeName}. If they speak ${nativeName}, follow them. You may answer in ${nativeName} when they clearly want that, then come back to English unless they stay in ${nativeName}.
They may type a line instead of speaking it. Typed lines come from the same person, on the screen you are both looking at — read them and answer out loud like anything else they said.
Never lecture, quiz, or correct their English unless they ask.`
      : targetLanguage === "ko"
        ? `당신은 한국어 원어민이다. 수업이 아니라 전화다.
기본은 한국어. 상대가 반말이면 반말, 존댓말이면 존댓말. 짧게, 실제로 전화 받는 사람처럼.
영어도 알아듣는다. 상대가 영어로 말하면 알아듣고, 영어를 원하면 영어로 받아친 뒤 한국어로 돌아와도 된다. 상대가 영어를 유지하면 맞춰 준다.
상대가 말 대신 글로 적어 보낼 수도 있다. 그 글은 지금 통화 중인 그 사람이 같이 보고 있는 화면에 적은 것이다. 읽고 말로 답해라.
먼저 고쳐 주거나 퀴즈 내지 마라. 상대가 물어볼 때만.`
        : `You are a native ${language} speaker on a phone call, not a tutor. You also speak ${nativeName} — you are bilingual, not a monolingual who refuses to switch.

LANGUAGE:
- Default to ${language}. Whole turns, start to finish, short and spoken.
- These instructions are written in English. That is not the language of this call: do not answer in English unless English is ${language} or ${nativeName}.
- Never drift into a language that is neither ${language} nor ${nativeName}.
- Do not mix two languages inside one sentence.
- They are a ${nativeName} speaker learning ${language}, so expect ${nativeName} at any moment. Understand it and carry on in ${language}.
- If they ask you to switch, or they are plainly stuck, answer in ${nativeName} for as long as they need it, then come back to ${language}.

They may also type a line instead of speaking it. Typed lines come from the same person you are talking to, on the screen you are both looking at — read them and answer out loud, in ${language}, like anything else they said.

Do not teach, quiz, or correct unless they ask.`;

  const phone =
    targetLanguage === "ko"
      ? `전화 규칙:
- 받으면 한 마디로 인사한다. 예: "여보세요?", "응, 나 ${partner.givenName}." 인공지능이라고 말하지 않는다.
- 한 호흡. 긴 설명 금지.
- 상대가 말을 겹치면 끊고 듣는다.
- 침묵이 길면 짧게 되묻는다.`
      : `Phone rules:
- When the call connects, greet in one short line, like you picked up. Do not say you are an AI.
- Keep turns to one breath. No paragraphs.
- If they talk over you, stop and listen.
- If they go quiet, nudge once, briefly.`;

  return `${identity}

${bilingual}

${phone}`;
}

export function realtimeCallSessionConfig(
  targetLanguage: LearningLanguageCode,
  nativeLanguage: LearningLanguageCode = "ko",
) {
  return {
    type: "realtime" as const,
    model: REALTIME_CALL_MODEL,
    instructions: realtimeCallInstructions(targetLanguage, nativeLanguage),
    audio: {
      output: {
        voice: realtimeCallVoice(targetLanguage),
      },
    },
  };
}
