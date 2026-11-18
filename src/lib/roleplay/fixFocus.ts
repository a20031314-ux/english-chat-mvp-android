import { sentencesOf } from "./reactions.ts";

/** 비교용 낱말(띄어쓰기 없는 글자는 한 글자씩) — 소문자, 부호 없음. */
function tokens(text: string): string[] {
  const out: string[] = [];
  for (const word of text.toLocaleLowerCase().split(/[\p{P}\p{S}\s]+/u)) {
    if (!word) continue;
    if (/[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Thai}]/u.test(word)) out.push(...[...word]);
    else out.push(word);
  }
  return out;
}

/** 두 문장이 얼마나 같은 낱말을 쓰나(0~1, 짧은 쪽 기준). */
export function overlap(a: string, b: string): number {
  const left = tokens(a);
  const right = new Set(tokens(b));
  if (!left.length || !right.size) return 0;
  const shared = left.filter((one) => right.has(one)).length;
  return shared / Math.min(left.length, right.size);
}

/**
 * 고친 말에서 실제로 바뀐 문장만(2026-11-08 · 2026-11-19 가상 사용자 통화 점검 — 셋 다 "맞는 앞 문장에 빨간 줄"):
 * 내 차례가 여러 문장이면 고친 쪽과 같은 문장(부호·대소문자·띄어쓰기 무시)은 빼고, 남은 틀린 문장 ↔ 고친 문장만 돌려준다.
 * 고친 쪽에 틀린 문장만 있으면(맞는 문장은 아예 빠짐) 고친 문장마다 낱말이 가장 많이 겹치는 내 문장 하나씩만 짝짓는다.
 * 짝이 안 지어지면(문장을 합치거나 다 바꿈) 원래 둘 그대로. 띄어쓰기 없는 일본어·중국어(。！？)·아랍어 ؟도 문장으로 자른다.
 */
export function focusFix(said: string, right: string): { said: string; right: string } {
  const norm = (text: string) => text.toLocaleLowerCase().replace(/[\p{P}\p{S}\s]+/gu, "");
  const mine = sentencesOf(said.trim()).map((part) => part.trim()).filter(Boolean);
  const fixed = sentencesOf(right.trim()).map((part) => part.trim()).filter(Boolean);
  const whole = { said: said.trim(), right: right.trim() };
  if (mine.length < 2) return whole;
  const fixedKeys = new Set(fixed.map(norm));
  const mineKeys = new Set(mine.map(norm));
  const wrong = mine.filter((part) => !fixedKeys.has(norm(part)));
  const changed = fixed.filter((part) => !mineKeys.has(norm(part)));
  if (!wrong.length || !changed.length) return whole;
  // 고친 문장마다 가장 닮은 내 문장 하나(낱말 절반 이상 겹칠 때만) — 고친 쪽에 없는 맞는 문장은 띠에 안 나옴.
  const picked = new Set<number>();
  for (const part of changed) {
    let best = -1;
    let score = 0;
    wrong.forEach((one, index) => {
      const value = overlap(part, one);
      if (value > score && !picked.has(index)) {
        best = index;
        score = value;
      }
    });
    if (best < 0 || score < 0.5) return whole;
    picked.add(best);
  }
  const glue = (parts: string[]) => parts.join(/[぀-ヿ㐀-鿿]/.test(parts.join("")) ? "" : " ");
  return { said: glue(wrong.filter((_, index) => picked.has(index))), right: glue(changed) };
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
