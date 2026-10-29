"use client";

/**
 * 지속 학습의 빈도 단어(curriculum/vocabBank.ts): 목록을 불러오고, 아직 모르는 첫 낱말이 든 50개 묶음(과 다음 묶음)의 카드를 받아
 * 퀴즈 재료로 넘긴다(quiz.ts registerQuizSources — 예문 빈칸·뜻·듣기·말하기). 카드는 이 폰에도 묶음·앱 언어마다 남겨 다시 받지 않는다.
 * 돌려주는 것: 목록 크기·이미 앎·배우는 중 수, 다음에 낼 낱말 열쇠(순위 순, 이미 앎·확인 중 빼고).
 */
import { useEffect, useMemo, useState } from "react";
import { apiUrl } from "@/lib/apiBase";
import { BANK_CHUNK, hasBank, loadBank, peekBank, wordKey, type BankWord } from "@/lib/curriculum/vocabBank";
import { knownState, type KnownMap } from "@/lib/curriculum/known";
import { registerQuizSources, type QuizSource } from "@/lib/curriculum/quiz";

type Card = { w: string; piece: string; example: string; gloss: string; exampleGloss: string; reading?: string };
const CACHE = "wordCards.v1";
const NEXT_MAX = 40;

function readCached(language: string, ui: string, chunk: number): Card[] | null {
  try {
    const raw = JSON.parse(localStorage.getItem(`${CACHE}.${language}.${ui}.${chunk}`) ?? "null") as Card[] | null;
    return Array.isArray(raw) && raw.length ? raw : null;
  } catch {
    return null;
  }
}

function sourcesOf(card: Card): QuizSource[] {
  return [{ text: card.example, gloss: { en: "", raw: card.exampleGloss }, from: wordKey(card.w), stage: 0, piece: card.piece, who: "me" }];
}

/** 낱말 뜻(앱 언어) — 퀴즈 제목 옆 등. */
const glossOf = new Map<string, string>();
export function wordGloss(language: string, word: string): string {
  return glossOf.get(`${language}|${word}`) ?? "";
}

export function useWordBank(language: string, ui: string, known: KnownMap) {
  const [bank, setBank] = useState<readonly BankWord[] | null>(() => peekBank(language));
  const [ready, setReady] = useState<Set<string>>(new Set());
  useEffect(() => {
    if (!hasBank(language)) return;
    let alive = true;
    void loadBank(language).then((list) => alive && setBank(list));
    return () => {
      alive = false;
    };
  }, [language]);
  const list = bank && bank.length && hasBank(language) ? bank : null;
  // 아직 모르는(이미 앎·확인 중이 아닌) 첫 낱말의 묶음.
  const firstOpen = useMemo(() => (list ? list.findIndex((word) => !known[wordKey(word.w)]) : -1), [list, known]);
  const chunk = firstOpen < 0 ? -1 : Math.floor(firstOpen / BANK_CHUNK);
  useEffect(() => {
    if (!list || chunk < 0) return;
    let alive = true;
    const want = [chunk, chunk + 1].filter((c) => c * BANK_CHUNK < list.length);
    void Promise.all(
      want.map(async (c) => {
        const cached = readCached(language, ui, c);
        if (cached) return cached;
        const body = await fetch(apiUrl(`/api/curriculum/words?lang=${encodeURIComponent(language)}&ui=${encodeURIComponent(ui)}&chunk=${c}`))
          .then((response) => (response.ok ? (response.json() as Promise<{ cards?: Card[] }>) : null))
          .catch(() => null);
        const cards = Array.isArray(body?.cards) ? body!.cards! : [];
        if (cards.length) {
          try {
            localStorage.setItem(`${CACHE}.${language}.${ui}.${c}`, JSON.stringify(cards));
          } catch {
            // 이번에만.
          }
        }
        return cards;
      }),
    ).then((groups) => {
      if (!alive) return;
      const cards = groups.flat();
      registerQuizSources(language, cards.map((card) => ({ key: wordKey(card.w), sources: sourcesOf(card) })));
      for (const card of cards) glossOf.set(`${language}|${card.w}`, card.gloss);
      setReady(new Set(cards.map((card) => wordKey(card.w))));
    });
    return () => {
      alive = false;
    };
  }, [list, chunk, language, ui]);
  return useMemo(() => {
    if (!list) return null;
    let knownCount = 0;
    let learning = 0;
    for (const word of list) {
      const state = knownState(known, wordKey(word.w));
      if (state === "known") knownCount += 1;
      else if (state === "checking") learning += 1;
    }
    const next = list
      .map((word) => wordKey(word.w))
      .filter((key) => !known[key] && ready.has(key))
      .slice(0, NEXT_MAX);
    return { total: list.length, known: knownCount, learning, next };
  }, [list, known, ready]);
}
