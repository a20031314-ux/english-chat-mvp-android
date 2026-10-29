"use client";

/**
 * 0단계 — 글자·소리(2026-10-29 사용자 "아예 초보인 사람(자음·모음도 모름)" → "0단계로 진행해줘").
 * 학습 언어 글자가 라틴 문자가 아닐 때만(일본어·한국어·중국어 병음·태국어·아랍어·러시아어·힌디어): 처음 고르기 화면 "글자·소리부터" 또는 사다리 0 →
 * 일일 학습 자리에 글자 묶음(curriculum/scripts, 이미 있던 글자·소리 기초), 다 하면 "1단계 ›". 1~5단계를 고르면 꺼짐. 학습 언어마다 이 폰에만.
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
