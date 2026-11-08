import { sentencesOf } from "./reactions.ts";

/**
 * 고친 말에서 실제로 바뀐 문장만(2026-11-08 가상 사용자 통화 점검 — 셋 다 "맞는 앞 문장에 빨간 줄"):
 * 내 차례가 여러 문장이면 고친 쪽과 같은 문장(부호·대소문자·띄어쓰기 무시)은 빼고, 남은 틀린 문장 ↔ 고친 문장만 돌려준다.
 * 어느 쪽이 비면(문장을 합치거나 다 바꿈) 원래 둘 그대로. 띄어쓰기 없는 일본어·중국어(。！？)·아랍어 ؟도 문장으로 자른다.
 */
export function focusFix(said: string, right: string): { said: string; right: string } {
  const norm = (text: string) => text.toLocaleLowerCase().replace(/[\p{P}\p{S}\s]+/gu, "");
  const mine = sentencesOf(said.trim()).map((part) => part.trim()).filter(Boolean);
  const fixed = sentencesOf(right.trim()).map((part) => part.trim()).filter(Boolean);
  if (mine.length < 2 && fixed.length < 2) return { said: said.trim(), right: right.trim() };
  const fixedKeys = new Set(fixed.map(norm));
  const mineKeys = new Set(mine.map(norm));
  const wrong = mine.filter((part) => !fixedKeys.has(norm(part)));
  const changed = fixed.filter((part) => !mineKeys.has(norm(part)));
  if (!wrong.length || !changed.length) return { said: said.trim(), right: right.trim() };
  const glue = (parts: string[]) => parts.join(/[぀-ヿ㐀-鿿]/.test(parts.join("")) ? "" : " ");
  return { said: glue(wrong), right: glue(changed) };
}

/** 글자 갈래가 학습 언어 문장에 없는 것이 섞였나(내가 막혀서 앱 언어로 말한 낱말 — 한글·아랍 글자 등). */
export function mixedScript(wrong: string, right: string): boolean {
  const scripts = (text: string) =>
    new Set(
      [...text.matchAll(/\p{L}/gu)].map(([ch]) =>
        /\p{Script=Hangul}/u.test(ch) ? "hangul"
        : /\p{Script=Arabic}/u.test(ch) ? "arabic"
        : /\p{Script=Thai}/u.test(ch) ? "thai"
        : /\p{Script=Devanagari}/u.test(ch) ? "deva"
        : /\p{Script=Cyrillic}/u.test(ch) ? "cyr"
        : /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]/u.test(ch) ? "cjk"
        : "latin",
      ),
    );
  const ok = scripts(right);
  return [...scripts(wrong)].some((one) => !ok.has(one));
}
