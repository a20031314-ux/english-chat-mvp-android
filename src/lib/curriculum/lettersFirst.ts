"use client";

/**
 * 글자부터 — 첫 측정에서 글자를 거의 못 읽은 학습자(글자가 라틴 문자가 아닌 학습 언어만). 따로 단계가 아니라 표시 하나:
 * 오늘의 학습에 Quizbank 다음 줄로 오늘의 글자 묶음(Languagebank 글자·소리 칸), 통화는 자막·뜻을 켠 채 시작하고 끝에 글자 숙제.
 * Quizbank는 늘 열려 있다(사용자 2026-11-23 "0단계를 그냥 Languagebank에 편입"). 학습 언어마다 이 폰에만.
 */
import { useEffect, useState } from "react";

const KEY = "lettersFirst.v1";
const EVENT = "letters-first-changed";
import { needsLetters } from "./letterLangs.ts";

export { LETTER_LANGS, needsLetters } from "./letterLangs.ts";

export function readLettersFirst(language: string): boolean {
  try {
    return needsLetters(language) && localStorage.getItem(`${KEY}.${language}`) === "1";
  } catch {
    return false;
  }
}

export function saveLettersFirst(language: string, on: boolean): void {
  try {
    if (on) localStorage.setItem(`${KEY}.${language}`, "1");
    else localStorage.removeItem(`${KEY}.${language}`);
  } catch {
    // 이번에만.
  }
  window.dispatchEvent(new CustomEvent(EVENT, { detail: { language } }));
}

export function useLettersFirst(language: string): [boolean, (on: boolean) => void] {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const load = () => setOn(readLettersFirst(language));
    load();
    window.addEventListener(EVENT, load);
    return () => window.removeEventListener(EVENT, load);
  }, [language]);
  return [on, (next) => saveLettersFirst(language, next)];
}
