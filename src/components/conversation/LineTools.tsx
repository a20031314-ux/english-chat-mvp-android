"use client";

import { useState, type ReactNode } from "react";
import { splitSentences } from "@/lib/splitSentences";
import { TTSButton } from "@/components/TTSButton";
import { useEnglishAnalysisOptional } from "@/contexts/EnglishAnalysisContext";
import { useLearningLanguageOptional } from "@/contexts/LearningLanguageContext";

/**
 * 대화 줄의 할 일 한 줄(2026-10-23, hub/drafts/conversation-unify-2026-10-23.md):
 * 줄에는 버튼을 늘 달지 않고, 줄을 누르면 이 한 줄이 열린다 — AI 채팅·AI 통화·1:1·단체방·Room이 같은 모양.
 * 듣기 · 번역(있을 때) · 분석(학습 언어 줄) + 화면마다 더하는 것(묻기·답하기·신고 등).
 */
export function LineTools({
  text,
  language,
  listenLabel,
  analyzeLabel,
  translation,
  extra,
  tone = "dark",
  listen = true,
}: {
  text: string;
  /** 듣기 버튼. 마이크가 열린 통화 중에는 끈다(소리가 내 말로 받아써지지 않게). */
  listen?: boolean;
  /** 줄의 언어(학습 언어). 없으면 지금 학습 언어. */
  language?: string;
  listenLabel: string;
  /** 없으면 분석 버튼 없음(편한 말로 쓴 줄 등). */
  analyzeLabel?: string;
  translation?: { label: string; shown: boolean; onToggle: () => void } | null;
  extra?: ReactNode;
  /** 밝은 말풍선(내 줄) 위인지. */
  tone?: "dark" | "light";
}) {
  const analysis = useEnglishAnalysisOptional();
  const learning = useLearningLanguageOptional();
  const lineLanguage = language ?? learning?.targetLanguage;
  const button =
    tone === "light"
      ? "rounded-lg border border-slate-400 px-2 py-0.5 text-xs text-slate-800 hover:bg-black/5"
      : "rounded-lg border border-white/15 px-2 py-0.5 text-xs text-slate-300 hover:bg-white/10";
  const clean = text.trim();
  // 여러 문장인 줄은 분석할 문장을 고른다(예전 문장마다 붙던 세로 막대의 몫).
  const [choosing, setChoosing] = useState(false);
  if (!clean) return null;
  const sentences = splitSentences(clean);
  const analyze = (sentence: string) =>
    analysis?.open({
      selectedText: sentence,
      contextSentence: sentence,
      sourceType: "conversation",
      language: lineLanguage!,
      intent: "sentence",
    });
  return (
    <div className="mt-2 flex flex-wrap items-center gap-1.5" onClick={(event) => event.stopPropagation()}>
      {listen ? <TTSButton
        text={clean}
        ariaLabel={listenLabel}
        className={tone === "light" ? "border-slate-400 bg-transparent text-slate-800 hover:bg-black/5" : undefined}
      /> : null}
      {translation ? (
        <button type="button" aria-pressed={translation.shown} onClick={translation.onToggle} className={button}>
          {translation.label}
        </button>
      ) : null}
      {analyzeLabel && analysis && lineLanguage ? (
        <button
          type="button"
          aria-expanded={sentences.length > 1 ? choosing : undefined}
          onClick={() => (sentences.length > 1 ? setChoosing((open) => !open) : analyze(clean))}
          className={button}
        >
          {analyzeLabel}
        </button>
      ) : null}
      {extra}
      {choosing && sentences.length > 1 ? (
        <div className="flex w-full flex-col gap-1">
          {sentences.map((sentence) => (
            <button
              key={sentence}
              type="button"
              dir="auto"
              onClick={() => analyze(sentence)}
              className={`${button} truncate text-start`}
            >
              {sentence}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

/** 내 줄 아래 "✎ 고칠 곳이 있어요" — 채팅·통화·Room·1:1·단체방 같은 칩. */
export function CorrectionChip({
  label,
  busy = false,
  busyLabel,
  onOpen,
  tone = "light",
}: {
  label: string;
  busy?: boolean;
  busyLabel?: string;
  onOpen: () => void;
  tone?: "dark" | "light";
}) {
  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation();
        onOpen();
      }}
      disabled={busy}
      aria-busy={busy}
      className={`mt-2 inline-flex items-center gap-1 rounded-full border border-warn/50 bg-warn/25 px-2.5 py-0.5 text-caption disabled:opacity-70 ${
        tone === "light" ? "text-slate-900" : "text-amber-100"
      }`}
    >
      <span aria-hidden="true">✎</span>
      {busy && busyLabel ? busyLabel : label}
    </button>
  );
}

/** 열린 교정: 고친 문장(+ 설명). 통화·1:1처럼 원문 표시가 따로 없는 곳에서. */
export function CorrectionCard({
  title,
  corrected,
  note,
  extra,
}: {
  title: string;
  corrected: string;
  note?: string | null;
  extra?: ReactNode;
}) {
  return (
    <div className="mt-1.5 border-t border-white/10 pt-1.5">
      <p className="text-meta text-slate-400">✎ {title}</p>
      <div className="mt-0.5 flex items-start gap-2">
        <p dir="auto" className="min-w-0 flex-1 text-note leading-snug text-emerald-200">
          {corrected}
        </p>
        {extra}
      </div>
      {note ? <p className="mt-1 text-meta leading-snug text-slate-400">{note}</p> : null}
    </div>
  );
}
