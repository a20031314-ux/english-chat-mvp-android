"use client";

import { DictNotesToggle } from "@/components/studyMap/DictNotes";
/**
 * 표현 카드(2026-11-03 사용자 "🔤 칩은 표현 카드로"): 통화 정리·Logbank·Quizbank 다시 보기에서 표현(e|)을 누르면 Stagebank 수업 대신
 * Quizbank 어휘 탭과 같은 표현 카드 — 표현 · 뜻 · 예문(그 표현 칠함)·예문 뜻 · 들려주기. 통화에서 왔으면 그 문장도 위에.
 * 카드는 server/expressionCards.ts(이 폰 exprCards.v2 — useExpressionCards와 같은 저장). 카드가 없으면 부르는 쪽이 예전 수업으로.
 */
import { useContext, useEffect, useState } from "react";
import { FullScreenLayer, LayerAboveContext } from "@/components/FullScreenLayer";
import { NativeAdSlot } from "@/components/NativeAdSlot";
import { SceneCard } from "@/components/studyMap/FrameLesson";
import { TTSButton } from "@/components/TTSButton";
import { apiUrl } from "@/lib/apiBase";
import type { UICopy } from "@/lib/copy";
import type { LessonScene } from "@/lib/curriculum/lessonKey";
import { pieceOf } from "@/lib/curriculum/quiz";
import { SCRIPT_VOICES } from "@/lib/curriculum/stageScripts";
import { learningLanguageSpeechTag, type LearningLanguageCode } from "@/lib/learningLanguages";

type Card = { w: string; piece: string; example: string; gloss: string; exampleGloss: string };

async function cardFor(language: string, ui: string, stage: number, expression: string): Promise<Card | null> {
  const key = `exprCards.v2.${language}.${ui}.${stage}`;
  try {
    const cached = JSON.parse(localStorage.getItem(key) ?? "null") as Card[] | null;
    const hit = cached?.find((card) => card.w === expression);
    if (hit) return hit;
  } catch {
    // 서버에서.
  }
  const body = await fetch(apiUrl(`/api/curriculum/words?lang=${encodeURIComponent(language)}&ui=${encodeURIComponent(ui)}&expr=${stage}`))
    .then((response) => (response.ok ? (response.json() as Promise<{ cards?: Card[] }>) : null))
    .catch(() => null);
  const cards = Array.isArray(body?.cards) ? body!.cards! : [];
  if (cards.length) {
    try {
      localStorage.setItem(key, JSON.stringify(cards));
    } catch {
      // 이번에만.
    }
  }
  return cards.find((card) => card.w === expression) ?? null;
}

export function ExpressionCard({
  ui,
  locale,
  language,
  expression,
  stage,
  scene,
  onMissing,
  onClose,
}: {
  ui: UICopy;
  locale: string;
  language: string;
  expression: string;
  stage: number;
  scene?: LessonScene;
  /** 카드가 없을 때(아직 못 만듦) — 부르는 쪽이 예전 수업을 연다. */
  onMissing: () => void;
  onClose: () => void;
}) {
  const [card, setCard] = useState<Card | null | undefined>(undefined);
  useEffect(() => {
    let alive = true;
    void cardFor(language, locale, stage, expression).then((found) => {
      if (!alive) return;
      if (!found) onMissing();
      else setCard(found);
    });
    return () => {
      alive = false;
    };
  }, [language, locale, stage, expression, onMissing]);
  const above = useContext(LayerAboveContext);
  const tag = learningLanguageSpeechTag(language as LearningLanguageCode);
  const at = card ? card.example.indexOf(card.piece) : -1;
  return (
    <FullScreenLayer>
      <header className="flex shrink-0 items-start gap-2 border-b border-line px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <h2 dir="auto" data-expression-card className="min-w-0 flex-1 text-body font-semibold text-ink">
          {expression}
        </h2>
        <TTSButton text={card?.piece ?? expression} lang={tag} voice={SCRIPT_VOICES.me} className="shrink-0" />
        <button type="button" onClick={onClose} aria-label={ui.billingClose} className="rounded-lg px-2 py-1 text-note text-slate-400 hover:bg-white/10">
          ✕
        </button>
      </header>
      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-4 py-3">
        {scene ? <SceneCard scene={scene} piece={pieceOf(scene.line, expression)} tag={tag} /> : null}
        {card === undefined ? <p className="text-caption text-slate-400">…</p> : null}
        {card ? (
          <>
            <section data-expression-meaning>
              <h3 className="text-meta font-semibold text-slate-400">{ui.aboutMeaning}</h3>
              <p dir="auto" className="mt-0.5 text-note text-ink">
                {card.gloss}
              </p>
            </section>
            <section data-expression-example>
              <h3 className="text-meta font-semibold text-slate-400">{ui.example}</h3>
              <div className="mt-1 flex flex-wrap items-start gap-2 rounded-xl bg-white/[0.06] px-3 py-2">
                <span className="min-w-0 flex-1">
                  <span dir="auto" className="block text-chat text-ink">
                    {at >= 0 ? (
                      <>
                        {card.example.slice(0, at)}
                        <span className="rounded-lg bg-status-learned/25 px-0.5">{card.piece}</span>
                        {card.example.slice(at + card.piece.length)}
                      </>
                    ) : (
                      card.example
                    )}
                  </span>
                  <span dir="auto" className="mt-0.5 block text-meta text-slate-400">
                    {card.exampleGloss}
                  </span>
                </span>
                <DictNotesToggle text={card.example} language={language} label={ui.languagebankTitle} />
                <TTSButton text={card.example} lang={tag} voice={SCRIPT_VOICES.me} className="shrink-0" />
              </div>
            </section>
            {/* 예문 아래 네이티브 하나(읽는 카드 끝 — 대화·통화 위에서 연 카드(above)에는 없음). */}
            {above ? null : <NativeAdSlot feedId="sheets" slotKey="expression-card" spaced />}
          </>
        ) : null}
      </div>
    </FullScreenLayer>
  );
}
