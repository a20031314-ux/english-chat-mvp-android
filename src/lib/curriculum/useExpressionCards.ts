"use client";

/**
 * Quizbank 어휘 탭에 섞는 표현(2026-11-03, curriculum/expressionDeck.ts): 1~지금 단계 덩어리 표현의 카드(예문·뜻·예문 뜻)를 받아
 * 퀴즈 재료로 넘긴다(quiz.ts registerQuizSources e|). 카드는 단계·앱 언어마다 이 폰에도 남긴다(그 단계 표현이 다 찬 것만).
 * 돌려줌: 순서대로 표현 목록(deck)과 카드가 온 표현 열쇠(ready).
 */
import { useEffect, useMemo, useState } from "react";
import { apiUrl } from "@/lib/apiBase";
import { deckExpressions } from "@/lib/curriculum/expressionDeck";
import { registerQuizSources, type QuizSource } from "@/lib/curriculum/quiz";

type Card = { w: string; piece: string; example: string; gloss: string; exampleGloss: string };
const CACHE = "exprCards.v2";

function readCached(language: string, ui: string, stage: number): Card[] | null {
  try {
    const raw = JSON.parse(localStorage.getItem(`${CACHE}.${language}.${ui}.${stage}`) ?? "null") as Card[] | null;
    return Array.isArray(raw) && raw.length ? raw : null;
  } catch {
    return null;
  }
}

function sourceOf(card: Card, stage: number): QuizSource {
  return { text: card.example, gloss: { en: "", raw: card.exampleGloss }, from: `e|${card.w}`, stage, piece: card.piece, who: "me", wordGloss: card.gloss };
}

/** 표현 뜻(앱 언어) — 카드가 온 것만. */
const meaningOf = new Map<string, string>();
export function useExpressionCards(language: string, ui: string, upTo: number) {
  const deck = useMemo(() => deckExpressions(language, Math.max(1, Math.min(5, upTo))), [language, upTo]);
  const [ready, setReady] = useState<Set<string>>(() => new Set());
  const stages = useMemo(() => [...new Set(deck.map((one) => one.stage))], [deck]);
  useEffect(() => {
    if (!stages.length) return;
    let alive = true;
    void Promise.all(
      stages.map(async (stage) => {
        const want = deck.filter((one) => one.stage === stage).length;
        const cached = readCached(language, ui, stage);
        if (cached && cached.length >= want) return { stage, cards: cached };
        const body = await fetch(apiUrl(`/api/curriculum/words?lang=${encodeURIComponent(language)}&ui=${encodeURIComponent(ui)}&expr=${stage}`))
          .then((response) => (response.ok ? (response.json() as Promise<{ cards?: Card[] }>) : null))
          .catch(() => null);
        const cards = Array.isArray(body?.cards) ? body!.cards! : (cached ?? []);
        if (cards.length) {
          try {
            localStorage.setItem(`${CACHE}.${language}.${ui}.${stage}`, JSON.stringify(cards));
          } catch {
            // 이번에만.
          }
        }
        return { stage, cards };
      }),
    ).then((groups) => {
      if (!alive) return;
      const entries = groups.flatMap(({ stage, cards }) => cards.map((card) => ({ key: `e|${card.w}`, sources: [sourceOf(card, stage)] })));
      registerQuizSources(language, entries);
      for (const { cards } of groups) for (const card of cards) meaningOf.set(`${language}|${card.w}`, card.gloss);
      setReady(new Set(entries.map((entry) => entry.key)));
    });
    return () => {
      alive = false;
    };
  }, [language, ui, deck, stages]);
  return { deck, ready };
}
