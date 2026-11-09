"use client";

/**
 * Languagebank 묶음 넘겨 보기(2026-11-08 사용자 "사전에서도 학습 알고리즘 — 특정 묶음만 연속으로 보는 기능, 카드 일부를 가리는 기능" → "진행해줘"):
 * 묶음 ▶ → 그 묶음 단어 카드를 한 장씩(사전 단어 화면 DictionaryBody 그대로, mask로 한 칸만 가림).
 * 가리기 셋 — 뜻 · 단어 · 예문 빈칸(이 폰 bankFlipHide.v1에 기억). 가린 곳은 [보기]를 눌러야 열림.
 * 순서·알고리즘(curriculum/bankFlip.ts): New·적용이 힘듦 먼저, 알아요는 뒤. 열고 나서 [헷갈려요 | 알아요]:
 *   헷갈려요 → 같은 판에서 3~5장 뒤에 다시(두 번까지), 알아요 → 이 판에서 빠짐.
 *   스스로 누른 알아요는 체크 셋에 넣지 않는다(사용자 2026-11-08 결정 — 써서 맞힌 기록과 섞지 않음). 연 카드는 장부에 찾아봄.
 * 끝: n장 중 m장 알아요 + 헷갈린 것이 남으면 ▶ Quizbank(그 열쇠부터, curriculum/quizFocus.ts).
 */
import { useMemo, useState } from "react";
import { BodyLayer } from "@/components/FullScreenLayer";
import { DictionaryBody, type CardMask } from "@/components/studyMap/Dictionary";
import type { UICopy } from "@/lib/copy";
import { FLIP_HIDES, flipNext, startFlip, type FlipHide, type FlipRound } from "@/lib/curriculum/bankFlip";
import { checkStates } from "@/lib/curriculum/checkState";
import { readLedger } from "@/lib/curriculum/logLedger";
import { focusQuiz } from "@/lib/curriculum/quizFocus";
import { wordKey } from "@/lib/curriculum/vocabBank";

const HIDE_KEY = "bankFlipHide.v1";

function readHide(): FlipHide {
  try {
    const raw = localStorage.getItem(HIDE_KEY);
    if (raw && (FLIP_HIDES as readonly string[]).includes(raw)) return raw as FlipHide;
  } catch {
    // 이번에만.
  }
  return "meaning";
}

export function BankFlip({ ui, language, locale, words, onClose }: { ui: UICopy; language: string; locale: string; words: readonly string[]; onClose: () => void }) {
  const [hide, setHide] = useState<FlipHide>(readHide);
  const [round, setRound] = useState<FlipRound>(() => {
    const states = checkStates(readLedger(language));
    return startFlip(words, (word) => states.get(wordKey(word))?.level ?? "new");
  });
  const [shown, setShown] = useState(false);
  const current = round.queue[0] ?? null;
  const mask: CardMask = useMemo(() => ({ hide, shown, onShow: () => setShown(true) }), [hide, shown]);
  const pickHide = (one: FlipHide) => {
    setHide(one);
    setShown(false);
    try {
      localStorage.setItem(HIDE_KEY, one);
    } catch {
      // 이번에만.
    }
  };
  const answer = (known: boolean) => {
    setRound((now) => flipNext(now, known, `${language}|${now.seen}`));
    setShown(false);
  };
  const hideName: Record<FlipHide, string> = { meaning: ui.flipHideMeaning, word: ui.flipHideWord, example: ui.flipHideExample };
  const leftover = round.unsure.filter((word) => !round.known.includes(word));
  return (
    <BodyLayer>
      <div className="fixed inset-0 z-[90] flex items-end justify-center bg-black/60 sm:items-center" onClick={onClose}>
        <div
          role="dialog"
          aria-modal="true"
          aria-label={ui.flipStart}
          data-bank-flip
          onClick={(event) => event.stopPropagation()}
          className="flex max-h-[88vh] w-full max-w-md flex-col gap-3 rounded-t-2xl border border-line bg-surface p-4 sm:rounded-2xl"
        >
          <div className="flex items-center gap-2">
            <span className="text-meta tabular-nums text-slate-400">{current ? `${round.seen + 1} / ${round.total}` : ""}</span>
            <span className="flex-1" />
            <button type="button" aria-label={ui.billingClose} onClick={onClose} className="rounded-lg px-2 py-1 text-note text-slate-400 hover:bg-white/10">
              ✕
            </button>
          </div>
          {current ? (
            <>
              <div className="flex flex-wrap gap-1.5" role="group" aria-label={ui.flipStart}>
                {FLIP_HIDES.map((one) => (
                  <button
                    key={one}
                    type="button"
                    data-flip-hide={one}
                    aria-pressed={hide === one}
                    onClick={() => pickHide(one)}
                    className={`rounded-lg border px-2.5 py-1 text-caption ${hide === one ? "border-status-learned/50 bg-status-learned/10 font-semibold text-status-learned" : "border-line text-slate-400"}`}
                  >
                    {hideName[one]}
                  </button>
                ))}
              </div>
              <div data-flip-card className="-mt-3 flex min-h-0 flex-col overflow-y-auto">
                <DictionaryBody key={current} ui={ui} language={language} locale={locale} word={current} search={false} mask={mask} />
              </div>
              {shown ? (
                <div className="flex gap-2">
                  <button type="button" data-flip-answer="unsure" onClick={() => answer(false)} className="flex-1 rounded-xl border border-line py-2.5 text-note text-slate-200 hover:bg-white/5">
                    {ui.flipAgainBtn}
                  </button>
                  <button type="button" data-flip-answer="known" onClick={() => answer(true)} className="flex-1 rounded-xl bg-white/90 py-2.5 text-note font-semibold text-slate-900">
                    {ui.flipGotBtn}
                  </button>
                </div>
              ) : (
                <button type="button" data-flip-reveal onClick={() => setShown(true)} className="rounded-xl bg-white/90 py-2.5 text-note font-semibold text-slate-900">
                  {ui.flipReveal}
                </button>
              )}
            </>
          ) : (
            <div data-flip-done className="flex flex-col items-center gap-3 py-6">
              <p className="text-title font-semibold text-ink">{ui.flipDone.replace("{n}", String(round.total)).replace("{m}", String(round.known.length))}</p>
              {leftover.length ? (
                <button
                  type="button"
                  data-flip-quiz
                  onClick={() => {
                    focusQuiz(language, leftover.map(wordKey));
                    onClose();
                  }}
                  className="rounded-full bg-white/90 px-4 py-2 text-note font-semibold text-slate-900"
                >
                  ▶ {ui.keepTitle}
                </button>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </BodyLayer>
  );
}
