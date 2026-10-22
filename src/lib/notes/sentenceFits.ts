import { looksLikeLanguage } from "../roleplay/transcript.ts";

/**
 * 노트 "질문"에 보여 줄 만큼 그 학습 언어의 문장인가(2026-10-23, 사용자: 일본어 노트에 중국어 문장이 들어옴).
 * 받아쓰기 검사와 같은 규칙(`looksLikeLanguage` — 일본어는 한자 다섯 자 이상에 가나가 없으면 아님, 중국어는 가나가 많으면 아님).
 */
export function sentenceFitsLanguage(text: string, language: string): boolean {
  return looksLikeLanguage(text, language);
}
