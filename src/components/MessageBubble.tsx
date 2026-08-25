"use client";

import { useState } from "react";
import { TTSButton } from "./TTSButton";
import { SelectableEnglishText } from "./SelectableEnglishText";
import { AnalyzableEnglish } from "./AnalyzableEnglish";

type MessageBubbleProps = {
  role: "user" | "assistant";
  message: string;
  /** English line attached under a how-to-say user message */
  attachedEnglish?: string;
  /** Inline correction attached to a chat user message */
  correction?: { original: string; corrected: string } | null;
  /** Conversational reading in the UI language — not a second translation */
  reading?: string;
  pickMode?: boolean;
  isWordSaved?: (word: string) => boolean;
  savingWord?: string | null;
  onWordClick?: (word: string) => void;
  labels: {
    listen: string;
    reading?: string;
  };
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
  correction,
  reading,
  pickMode = false,
  isWordSaved,
  savingWord = null,
  onWordClick,
  labels,
  imageUrl,
}: MessageBubbleProps) {
  const isUser = role === "user";
  const readingText = reading?.replace(/\s+/g, " ").trim() || "";
  const [readingOpen, setReadingOpen] = useState(false);
  const correctedLine = correction?.corrected.trim() || "";
  const showCorrection = Boolean(correctedLine);
  const listenText = showCorrection
    ? correctedLine
    : attachedEnglish?.trim() || message;
  const tone = isUser ? "default" : "onDark";
  const analyzeMain =
    !attachedEnglish?.trim() &&
    !showCorrection &&
    (!isUser ||
      /[A-Za-z\u0400-\u04FF\u3040-\u30ff\u3400-\u9fff\uac00-\ud7af]/.test(
        message,
      ));

  return (
    <div className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm sm:max-w-[75%] ${
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

        <div className="mt-3 flex flex-wrap items-center gap-2">
          {isUser ? (
            <TTSButton
              text={listenText}
              ariaLabel={labels.listen}
              className="border-slate-600 bg-slate-800 text-white hover:bg-slate-700"
            />
          ) : (
            <TTSButton text={message} ariaLabel={labels.listen} />
          )}

          {readingText && labels.reading ? (
            <button
              type="button"
              aria-expanded={readingOpen}
              onClick={() => setReadingOpen((open) => !open)}
              className={`rounded-md border px-2 py-1 text-xs transition ${
                isUser
                  ? "border-slate-600 bg-slate-800 text-white hover:bg-slate-700"
                  : "border-white/10 bg-white/5 text-slate-200 hover:bg-white/10"
              }`}
            >
              {labels.reading}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
