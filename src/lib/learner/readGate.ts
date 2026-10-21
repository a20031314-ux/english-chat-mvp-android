import { segmentWords } from "../wordSegments.ts";

/**
 * 채팅 한 줄을 문장 읽기(learnerObserve — 어떤 구문을 썼는지 모델로 읽어 프로필에)에 보낼지.
 *
 * 대부분의 채팅은 "I love you" 같은 짧은 문장이고, 고칠 데 없는 짧은 문장에서는
 * 읽어도 프로필에 남길 게 거의 없다 — 그런데 한 통 비용의 절반(모델 한 번)이 든다(2026-10-21 사용자).
 * 그래서 너무 짧은 줄과, 고칠 데 없는 짧은 줄은 건너뛴다. 틀린 줄은 짧아도 읽는다(무엇이 틀렸는지가 기록할 거리).
 *
 * 단어는 `segmentWords`로 센다 — 띄어쓰기로 세면 일본어·중국어·태국어 문장은 늘 한 단어라 한 번도 읽히지 않았다.
 * 문장부호만 있는 조각은 단어로 치지 않는다. 비교에서 `\p{M}`(태국어·힌디어 모음 기호)은 지우지 않는다.
 */
export const READ_MIN_WORDS = 3;
export const READ_SHORT_CORRECT_MAX_WORDS = 5;

const bare = (text: string) => text.toLowerCase().replace(/[^\p{L}\p{M}\p{N}]/gu, "");

export function wordCount(text: string, language?: string): number {
  return segmentWords(text, language).filter((word) => /[\p{L}\p{N}]/u.test(word)).length;
}

export function shouldReadChatTurn(sentence: string, corrected: string, language?: string): boolean {
  const words = wordCount(sentence, language);
  if (words < READ_MIN_WORDS) return false;
  const unchanged = !corrected.trim() || bare(sentence) === bare(corrected);
  return !(unchanged && words <= READ_SHORT_CORRECT_MAX_WORDS);
}
