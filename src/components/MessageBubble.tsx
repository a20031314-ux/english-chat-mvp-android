"use client";

import { useState } from "react";
import { SelectableEnglishText } from "./SelectableEnglishText";
import { AnalyzableEnglish } from "./AnalyzableEnglish";
import { CorrectionChip, LineTools } from "./conversation/LineTools";

type MessageBubbleProps = {
  role: "user" | "assistant";
  message: string;
  /** English line attached under a how-to-say user message */
  attachedEnglish?: string;
  /** User line only: offer sentence analysis because it is in the learning language. */
  analyzeUserLine?: boolean;
  /** Inline correction attached to a chat user message */
  correction?: { original: string; corrected: string } | null;
  /**
   * A correction that exists but is folded away ("눌러서 보기", lib/correctionView.ts):
   * a chip under the line opens it. Ignored while `correction` is shown.
   */
  correctionChip?: { label: string; busyLabel: string; busy: boolean; onOpen: () => void } | null;
  /** Conversational reading in the UI language — not a second translation */
  reading?: string;
  pickMode?: boolean;
  isWordSaved?: (word: string) => boolean;
  savingWord?: string | null;
  onWordClick?: (word: string) => void;
  labels: {
    listen: string;
    reading?: string;
    report?: string;
    /** 줄을 눌렀을 때 "분석"(학습 언어 줄만). */
    analyze?: string;
  };
  /** Present on AI output only, so learners can flag what the model said. */
  onReport?: () => void;
  imageUrl?: string;
};

function EnglishLine({
  text,
  pickMode,
  tone,
  isWordSaved,
  savingWord,
  onWordClick,
  className,
  translation,
}: {
  text: string;
  pickMode: boolean;
  tone: "default" | "onDark";
  isWordSaved?: (word: string) => boolean;
  savingWord?: string | null;
  onWordClick?: (word: string) => void;
  className?: string;
  translation?: string;
}) {
  return (
    <AnalyzableEnglish
      sentence={text}
      tone={tone}
      className={className}
      translation={translation}
      sentenceRail={false}
    >
      {pickMode && onWordClick ? (
        <SelectableEnglishText
          text={text}
          pickMode={pickMode}
          tone={tone}
          isWordSaved={isWordSaved}
          savingWord={savingWord}
          onWordClick={onWordClick}
        />
      ) : undefined}
    </AnalyzableEnglish>
  );
}

export function MessageBubble({
  role,
  message,
  attachedEnglish,
  analyzeUserLine = false,
  correction,
  correctionChip,
  reading,
  pickMode = false,
  isWordSaved,
  savingWord = null,
  onWordClick,
  labels,
  imageUrl,
  onReport,
}: MessageBubbleProps) {
  const isUser = role === "user";
  const readingText = reading?.replace(/\s+/g, " ").trim() || "";
  const [readingOpen, setReadingOpen] = useState(false);
  // 줄을 누르면 할 일 한 줄(듣기·번역·분석·신고)이 열린다 — 말풍선에 버튼을 늘 달지 않는다(conversation/LineTools).
  const [toolsOpen, setToolsOpen] = useState(false);
  const correctedLine = correction?.corrected.trim() || "";
  const showCorrection = Boolean(correctedLine);
  const listenText = showCorrection
    ? correctedLine
    : attachedEnglish?.trim() || message;
  const tone = isUser ? "default" : "onDark";
  // The learner's own line gets the analysis bar only when it is in the
  // language they are learning. Any letter used to be enough, so a line typed
  // in the app's own language was offered up for analysis as if it were
  // practice.
  const analyzeMain =
    !attachedEnglish?.trim() &&
    !showCorrection &&
    (!isUser || analyzeUserLine);

  return (
    <div className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        role="button"
        tabIndex={0}
        aria-expanded={toolsOpen}
        onClick={() => setToolsOpen((open) => !open)}
        onKeyDown={(event) => {
          if (event.target !== event.currentTarget) return;
          if (event.key !== "Enter" && event.key !== " ") return;
          event.preventDefault();
          setToolsOpen((open) => !open);
        }}
        className={`max-w-[85%] cursor-pointer rounded-2xl px-4 py-3 text-sm shadow-sm sm:max-w-[75%] ${
          isUser
            ? "rounded-br-sm bg-[#e8e8e4] text-neutral-900 shadow-[0_0_18px_rgba(255,255,255,0.28)]"
            : "rounded-bl-sm border border-white/10 bg-[#161616] text-slate-50"
        }`}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt=""
            className="mb-2 max-h-52 w-full rounded-xl object-cover"
          />
        ) : null}
        {showCorrection && correction ? (
          <AnalyzableEnglish
            sentence={correction.original}
            tone={tone}
            sentenceRail={false}
            diff={{
              original: correction.original,
              corrected: correction.corrected,
              side: "original",
            }}
          />
        ) : analyzeMain ? (
          <EnglishLine
            text={message}
            pickMode={pickMode}
            tone={tone}
            isWordSaved={isWordSaved}
            savingWord={savingWord}
            onWordClick={onWordClick}
            translation={readingText || undefined}
          />
        ) : (
          <p>
            <SelectableEnglishText
              text={message}
              pickMode={pickMode}
              tone={tone}
              isWordSaved={isWordSaved}
              savingWord={savingWord}
              onWordClick={onWordClick}
            />
          </p>
        )}

        {correctionChip && !showCorrection ? (
          <CorrectionChip
            label={correctionChip.label}
            busyLabel={correctionChip.busyLabel}
            busy={correctionChip.busy}
            onOpen={correctionChip.onOpen}
            tone={isUser ? "light" : "dark"}
          />
        ) : null}

        {showCorrection && correction ? (
          <div
            className={`mt-2 border-t pt-2 ${
              isUser ? "border-slate-600" : "border-white/10"
            }`}
          >
            <AnalyzableEnglish
              sentence={correction.corrected}
              tone={tone}
              className={`text-sm leading-relaxed ${
                isUser ? "text-neutral-800" : ""
              }`}
              sentenceRail={false}
              diff={{
                original: correction.original,
                corrected: correction.corrected,
                side: "corrected",
              }}
              translation={readingText || undefined}
            />
          </div>
        ) : attachedEnglish?.trim() ? (
          <div
            className={`mt-2 border-t pt-2 ${
              isUser ? "border-slate-600" : "border-white/10"
            }`}
          >
            <EnglishLine
              text={attachedEnglish}
              pickMode={pickMode}
              tone={tone}
              isWordSaved={isWordSaved}
              savingWord={savingWord}
              onWordClick={onWordClick}
              translation={message}
              className={`text-sm leading-relaxed ${
                isUser ? "text-neutral-800" : ""
              }`}
            />
          </div>
        ) : null}

        {readingText && readingOpen ? (
          <p
            className={`mt-2 border-t pt-2 text-xs leading-relaxed ${
              isUser
                ? "border-neutral-400 text-neutral-700"
                : "border-white/10 text-slate-300"
            }`}
          >
            {readingText}
          </p>
        ) : null}

        {toolsOpen ? (
          <LineTools
            text={listenText}
            listenLabel={labels.listen}
            analyzeLabel={analyzeMain || showCorrection || attachedEnglish?.trim() ? labels.analyze : undefined}
            translation={
              readingText && labels.reading
                ? { label: labels.reading, shown: readingOpen, onToggle: () => setReadingOpen((open) => !open) }
                : null
            }
            tone={isUser ? "light" : "dark"}
            extra={
              !isUser && onReport && labels.report ? (
                <button
                  type="button"
                  onClick={onReport}
                  aria-label={labels.report}
                  title={labels.report}
                  className="rounded-lg border border-white/15 px-2 py-0.5 text-xs text-slate-400 hover:bg-white/10"
                >
                  ⚑
                </button>
              ) : null
            }
          />
        ) : null}
      </div>
    </div>
  );
}
