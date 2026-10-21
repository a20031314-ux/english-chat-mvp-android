/**
 * 고친 문장을 버려야 할 때 — 모델이 고칠 게 없는 줄을 "고쳤다"고 돌려준 경우.
 *
 * 가상 사용자 점검(2026-10-21, 영어↔한국어)에서 나온 것:
 * - "?"·이모지만 보냈는데 튜터 말 같은 문장을 고친 문장으로 넣음
 * - 마침표 하나만 붙이고 "더 자연스러워요" 설명을 붙임
 * - "음…"·"글쎄요" 같은 짧은 답을 학습자가 하지 않은 문장으로 늘림
 * 셋 다 학습자 말이 그대로 맞다는 뜻이므로 고침·설명을 비운다.
 */

const LETTER = /\p{L}/u;

/** 문장부호·기호를 빼고 공백을 하나로, 소문자로 — 띄어쓰기 차이는 남긴다(한국어 띄어쓰기는 고칠 수 있음). */
function surface(text: string): string {
  return text
    .normalize("NFC")
    .toLowerCase()
    .replace(/[\p{P}\p{S}]/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

function words(text: string): number {
  const t = surface(text);
  return t ? t.split(" ").length : 0;
}

/** 글자만 보고 알 수 있는 학습 언어 — 학습자 줄에 이 글자가 하나도 없는데 고친 문장에 생겼으면 고침이 아니라 번역이다. */
const TARGET_SCRIPT: Partial<Record<string, RegExp>> = {
  ko: /\p{Script=Hangul}/u,
  ja: /[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}]/u,
  zh: /\p{Script=Han}/u,
  th: /\p{Script=Thai}/u,
  ru: /\p{Script=Cyrillic}/u,
  ar: /\p{Script=Arabic}/u,
  hi: /\p{Script=Devanagari}/u,
};

/** 한국어 짧은 존댓말 답(별로요·그냥요·아마도요·몰라요 등): 낱말 두 개 이하 + 요로 끝남. */
const KO_SHORT_POLITE = /^[\p{Script=Hangul}\s]{1,12}요[.!?~…\s]*$/u;

export function shouldKeepLearnerLine(message: string, corrected: string, target?: string): boolean {
  const original = message.trim();
  if (!original) return true;
  if (!LETTER.test(original)) return true;
  const script = target ? TARGET_SCRIPT[target] : undefined;
  if (script && !script.test(original) && script.test(corrected)) return true;
  if (target === "ko" && KO_SHORT_POLITE.test(original) && words(original) <= 2) return true;
  if (surface(original) === surface(corrected)) return true;
  const before = words(original);
  if (before <= 2 && words(corrected) >= before + 3) return true;
  return false;
}
