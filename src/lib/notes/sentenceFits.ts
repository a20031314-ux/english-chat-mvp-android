import { looksLikeLanguage } from "../roleplay/transcript.ts";

/**
 * 노트 "질문"에 보여 줄 만큼 그 학습 언어의 문장인가(2026-10-23, 사용자: 일본어 노트에 중국어 문장이 들어옴).
 *
 * 글자 검사(`looksLikeLanguage`)는 일본어 글자에 한자를 함께 넣어서, 가나 하나 없는 중국어 문장도 일본어로 통과했다.
 * 그래서 일본어는 한자가 여럿인데 가나가 하나도 없으면 아니라고 보고, 중국어는 가나가 섞이면 아니라고 본다.
 * 짧은 말(한자 네 글자 이하 — "最近", "大丈夫")은 가나 없이도 일본어일 수 있어 그대로 둔다.
 */
const KANA = /[\p{Script=Hiragana}\p{Script=Katakana}]/u;
const HAN = /\p{Script=Han}/gu;

export function sentenceFitsLanguage(text: string, language: string): boolean {
  if (!looksLikeLanguage(text, language)) return false;
  const han = text.match(HAN)?.length ?? 0;
  if (language === "ja") return KANA.test(text) || han <= 4;
  if (language === "zh") return !KANA.test(text);
  return true;
}
