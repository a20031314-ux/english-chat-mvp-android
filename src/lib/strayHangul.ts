/**
 * 한국어와 상관없는 대화(학습·앱 언어 둘 다 한국어가 아님)에 섞여 나온 한글을 걸러 낸다.
 *
 * 가상 사용자 점검(2026-10-22, Haiku 전환 뒤): ru 학습·ja 앱의 뜻 답 괄호에 「(완전 지친 상태, 완전に疲れ切っている…)」,
 * en 학습·id 앱의 고침 설명이 통째로 한국어. 지시문 곳곳의 한국어 예가 새는 것으로 보이고 다시 돌리면 잘 안 나와서,
 * 어디서 새든 나가기 전에 거른다 — 설명은 앱 언어로 다시 쓰게 하고, 답은 한글 덩어리만 뺀다.
 */

const HANGUL = /\p{Script=Hangul}/u;

/** 이 대화에 한글이 나오면 안 되는가. */
export function hangulIsStray(text: string, interfaceLanguage: string, targetLanguage: string): boolean {
  if (interfaceLanguage === "ko" || targetLanguage === "ko") return false;
  return HANGUL.test(text);
}

/**
 * 한글 낱말 덩어리(사이의 띄어쓰기·문장부호 포함)를 빼고, 비게 된 괄호와 남은 쉼표·띄어쓰기를 정리한다.
 * 한글이 없으면 그대로 돌려준다.
 */
export function stripHangul(text: string): string {
  if (!HANGUL.test(text)) return text;
  return text
    .replace(/[\p{Script=Hangul}]+(?:[\s.,!?~·…'"]*[\p{Script=Hangul}]+)*[.!?~…]*[\s,、，]*/gu, "")
    .replace(/\(\s*[,、，]?\s*/g, "(")
    .replace(/\s*[,、，]?\s*\)/g, ")")
    .replace(/[(（]\s*[)）]/g, "")
    .replace(/\s{2,}/g, " ")
    .replace(/\s+([.,!?、。！？])/g, "$1")
    .trim();
}
