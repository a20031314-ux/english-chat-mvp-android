import {
  getLearningLanguage,
  learningLanguageName,
  type LearningLanguageCode,
} from "./learningLanguages.ts";

export type ChatPartner = {
  givenName: string;
  countryEn: string;
  flagCountry: string;
  languageCode: LearningLanguageCode;
};

const PARTNERS: Record<LearningLanguageCode, { givenName: string; countryEn: string }> = {
  en: { givenName: "Alex", countryEn: "the United States" },
  ko: { givenName: "Minjun", countryEn: "Korea" },
  ja: { givenName: "Yuki", countryEn: "Japan" },
  zh: { givenName: "Chen", countryEn: "China" },
  es: { givenName: "Sofía", countryEn: "Spain" },
  fr: { givenName: "Camille", countryEn: "France" },
  it: { givenName: "Luca", countryEn: "Italy" },
  pt: { givenName: "Maria", countryEn: "Portugal" },
  ru: { givenName: "Anya", countryEn: "Russia" },
  ar: { givenName: "Omar", countryEn: "Saudi Arabia" },
  id: { givenName: "Raka", countryEn: "Indonesia" },
  vi: { givenName: "Linh", countryEn: "Vietnam" },
  th: { givenName: "Niran", countryEn: "Thailand" },
  hi: { givenName: "Arjun", countryEn: "India" },
};

export function chatPartnerForLanguage(
  code: LearningLanguageCode | string | null | undefined,
): ChatPartner {
  const lang = getLearningLanguage(code);
  const profile = PARTNERS[lang.code];
  return {
    givenName: profile.givenName,
    countryEn: profile.countryEn,
    flagCountry: lang.flagCountry,
    languageCode: lang.code,
  };
}

/** Identity block for chat/start prompts. Partner is a person, not a tutor. */
export function conversationPartnerIdentity(
  targetLanguage: LearningLanguageCode | string | null | undefined,
): string {
  const partner = chatPartnerForLanguage(targetLanguage);
  const language = learningLanguageName(partner.languageCode);
  return `You are ${partner.givenName}, a native ${language} speaker from ${partner.countryEn}. You are the person they are messaging — not a language teacher and not a classroom tutor. Stay in character as ${partner.givenName}.`;
}
