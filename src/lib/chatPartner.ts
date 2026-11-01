import {
  getLearningLanguage,
  learningLanguageName,
  type LearningLanguageCode,
} from "./learningLanguages.ts";

export type TutorGender = "f" | "m";

export type ChatPartner = {
  givenName: string;
  countryEn: string;
  flagCountry: string;
  languageCode: LearningLanguageCode;
  gender: TutorGender;
  /** 프로필 그림(public/tutors/<언어>-<f|m>.webp). */
  photo: string;
  /** The tutor's voice (roleplay/voices.ts) — chat 듣기, the call and anything spoken without a scene voice. */
  voice: string;
};

type Person = { givenName: string; voice: string };

/**
 * 튜터는 언어마다 여자·남자 한 사람씩(사용자 2026-11-01 "음성을 언어별로 남, 녀" → A: 사용자가 고름).
 * `default`는 고르기 전의 사람(사용자 2026-11-01 "그림 속 사람을 기본 튜터로" — 처음 받은 그림이 언어마다 한 사람이라 그 사람).
 * 프로필 그림은 28명 모두 `public/tutors/<언어>-<f|m>.webp`(사용자 2026-11-01 "성별별로 만들었어").
 * `legacy`는 예전 기본(Alex·Minjun·Yuki…) — 튜터를 고르는 칸이 없는 옛 앱(`tutor`·`tutorGender`를 안 보냄)에 서버가 쓴다(`serverTutorGender`). 옛 앱 화면의 이름과 말투·목소리가 맞게.
 * 목소리는 Realtime이 받는 것으로(server/realtimeSpeech.ts — nova·onyx·fable은 가까운 목소리로 바뀜).
 * 그 언어 "그냥 대화"의 녹음된 인사·작별(justTalk.ts `voice`)과 같은 목소리면 녹음을 쓰고, 다르면 그 두 줄도 합성한다.
 * 목소리 성별은 OpenAI가 정해 두지 않아 운영 /api/tts 샘플의 높이(기본 주파수)를 재서 고름(2026-11-01) — 남자 쪽 verse·ballad는 언어에 따라 200Hz 가까이 높게 나와 ash·echo·cedar로.
 */
const PARTNERS: Record<LearningLanguageCode, { countryEn: string; default: TutorGender; legacy: TutorGender; f: Person; m: Person }> = {
  en: { countryEn: "the United States", default: "m", legacy: "m", f: { givenName: "Emma", voice: "marin" }, m: { givenName: "Alex", voice: "ash" } },
  ko: { countryEn: "Korea", default: "f", legacy: "m", f: { givenName: "Seoyeon", voice: "sage" }, m: { givenName: "Minjun", voice: "cedar" } },
  ja: { countryEn: "Japan", default: "m", legacy: "f", f: { givenName: "Yuki", voice: "nova" }, m: { givenName: "Haruto", voice: "echo" } },
  zh: { countryEn: "China", default: "f", legacy: "m", f: { givenName: "Mei", voice: "shimmer" }, m: { givenName: "Chen", voice: "echo" } },
  es: { countryEn: "Spain", default: "m", legacy: "f", f: { givenName: "Sofía", voice: "coral" }, m: { givenName: "Mateo", voice: "ash" } },
  fr: { countryEn: "France", default: "f", legacy: "f", f: { givenName: "Camille", voice: "marin" }, m: { givenName: "Louis", voice: "echo" } },
  it: { countryEn: "Italy", default: "m", legacy: "m", f: { givenName: "Giulia", voice: "coral" }, m: { givenName: "Luca", voice: "cedar" } },
  pt: { countryEn: "Portugal", default: "f", legacy: "f", f: { givenName: "Maria", voice: "alloy" }, m: { givenName: "João", voice: "echo" } },
  ru: { countryEn: "Russia", default: "m", legacy: "f", f: { givenName: "Anya", voice: "sage" }, m: { givenName: "Dima", voice: "ash" } },
  ar: { countryEn: "Saudi Arabia", default: "f", legacy: "m", f: { givenName: "Layla", voice: "shimmer" }, m: { givenName: "Omar", voice: "onyx" } },
  id: { countryEn: "Indonesia", default: "m", legacy: "m", f: { givenName: "Putri", voice: "coral" }, m: { givenName: "Raka", voice: "echo" } },
  vi: { countryEn: "Vietnam", default: "f", legacy: "f", f: { givenName: "Linh", voice: "marin" }, m: { givenName: "Minh", voice: "verse" } },
  th: { countryEn: "Thailand", default: "m", legacy: "m", f: { givenName: "Ploy", voice: "coral" }, m: { givenName: "Niran", voice: "cedar" } },
  hi: { countryEn: "India", default: "f", legacy: "m", f: { givenName: "Priya", voice: "marin" }, m: { givenName: "Arjun", voice: "ash" } },
};

export function isTutorGender(value: unknown): value is TutorGender {
  return value === "f" || value === "m";
}

/** 고르기 전의 튜터(예전 이름 그대로). */
export function defaultTutorGender(code: LearningLanguageCode | string | null | undefined): TutorGender {
  return PARTNERS[getLearningLanguage(code).code].default;
}

/**
 * 서버가 쓸 튜터: 앱이 보낸 값, 안 보냈으면(튜터 고르기가 없는 옛 앱) 예전 기본 — 옛 앱 화면에 보이는 이름과 맞게.
 */
export function serverTutorGender(code: LearningLanguageCode | string | null | undefined, raw: unknown): TutorGender {
  return isTutorGender(raw) ? raw : PARTNERS[getLearningLanguage(code).code].legacy;
}

/** 이 언어의 여자·남자 튜터 — 고르는 칸에 이름을 보여 줄 때. */
export function tutorChoices(code: LearningLanguageCode | string | null | undefined): Record<TutorGender, string> {
  const profile = PARTNERS[getLearningLanguage(code).code];
  return { f: profile.f.givenName, m: profile.m.givenName };
}

/** 튜터 목소리 — 서버(/api/tts `tutor`)와 통화가 같은 표를 읽는다. */
export function tutorVoice(code: LearningLanguageCode | string | null | undefined, gender?: TutorGender | null): string {
  return chatPartnerForLanguage(code, gender).voice;
}

export function chatPartnerForLanguage(
  code: LearningLanguageCode | string | null | undefined,
  gender?: TutorGender | null,
): ChatPartner {
  const lang = getLearningLanguage(code);
  const profile = PARTNERS[lang.code];
  const who = isTutorGender(gender) ? gender : profile.default;
  return {
    givenName: profile[who].givenName,
    countryEn: profile.countryEn,
    flagCountry: lang.flagCountry,
    languageCode: lang.code,
    gender: who,
    voice: profile[who].voice,
    photo: `/tutors/${lang.code}-${who}.webp`,
  };
}

/** Identity block for chat/start prompts. Partner is a person, not a tutor. */
export function conversationPartnerIdentity(
  targetLanguage: LearningLanguageCode | string | null | undefined,
  gender?: TutorGender | null,
): string {
  const partner = chatPartnerForLanguage(targetLanguage, gender);
  const language = learningLanguageName(partner.languageCode);
  // 성별을 말해 둔다 — 말하는 사람의 성에 따라 꼴이 바뀌는 언어(ru·hi·ar·es·fr·it·pt 등)에서 이름·목소리와 맞게.
  return `You are ${partner.givenName}, a native ${language} speaker from ${partner.countryEn}, a ${partner.gender === "f" ? "woman" : "man"} — use the forms a ${partner.gender === "f" ? "woman" : "man"} uses when speaking about yourself. You are the person they are messaging — not a language teacher and not a classroom tutor. Stay in character as ${partner.givenName}.`;
}
