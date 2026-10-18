/**
 * 남의 말을 집어 "이거 무슨 뜻이에요?" 묻기(말하는 방·1:1 메시지 공통).
 *
 * 앱은 집은 줄의 번호(seq)만 보내고, 서버가 그 줄을 찾아 인용을 채운다 — 남이 하지 않은
 * 말을 인용으로 꾸며 넣지 못하게. 질문 문장은 묻는 사람의 학습 언어로 미리 써 둔 고정 문구라
 * 모델을 부르지 않는다(묻는 것 자체가 학습 언어로 말해 보는 연습).
 */

import type { LearningLanguageCode } from "../learningLanguages.ts";

/** 인용으로 남기는 글자 수(글자 단위, 태국어·힌디어 모음 기호는 자르지 않음). */
export const QUOTE_MAX_CHARS = 140;

export type LineQuote = {
  /** 방: 자막 줄 번호, 메시지: 메시지 번호. */
  seq: number;
  /** 메시지의 통화 기록 안 몇 번째 줄인지(통화 기록을 집었을 때만). */
  index?: number;
  nickname: string;
  text: string;
  /** 방에서 말한 사람의 이름표 — 내 말을 누가 물었는지 알아보는 데. */
  peerId?: string;
  /** 말한 사람의 계정(메시지·방 모두, 없을 수 있음). */
  accountId?: string | null;
};

const ASK_PHRASES: Record<LearningLanguageCode, string> = {
  en: "What does this mean?",
  ko: "이거 무슨 뜻이에요?",
  ja: "これ、どういう意味ですか？",
  zh: "这是什么意思？",
  es: "¿Qué significa esto?",
  fr: "Ça veut dire quoi ?",
  it: "Che cosa significa?",
  pt: "O que significa isto?",
  ru: "Что это значит?",
  ar: "ماذا يعني هذا؟",
  id: "Ini artinya apa?",
  vi: "Câu này nghĩa là gì?",
  th: "อันนี้แปลว่าอะไร",
  hi: "इसका मतलब क्या है?",
};

/** 묻는 사람의 학습 언어로 된 질문 문장. 모르는 언어면 영어. */
export function askPhrase(language: string): string {
  return ASK_PHRASES[language as LearningLanguageCode] ?? ASK_PHRASES.en;
}

export function allAskPhrases(): string[] {
  return Object.values(ASK_PHRASES);
}

/** 글자(자소 묶음) 단위로 자른다 — 코드 단위로 자르면 결합 문자가 떨어져 나간다. */
export function clipQuote(text: string, max = QUOTE_MAX_CHARS): string {
  const clean = text.replace(/\s+/g, " ").trim();
  const Segmenter = (Intl as { Segmenter?: typeof Intl.Segmenter }).Segmenter;
  const parts = Segmenter
    ? Array.from(new Segmenter(undefined, { granularity: "grapheme" }).segment(clean), (part) => part.segment)
    : Array.from(clean);
  return parts.length > max ? `${parts.slice(0, max).join("")}…` : clean;
}

/** 이 줄을 집어 물은 질문 수(줄 옆 "❓ n" 표시). */
export function questionCount<T extends { quote?: LineQuote; ask?: boolean }>(rows: T[], seq: number, index?: number): number {
  return rows.filter((row) => row.ask && row.quote?.seq === seq && (row.quote.index ?? -1) === (index ?? -1)).length;
}
