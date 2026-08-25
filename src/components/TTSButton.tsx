"use client";

import { useEffect, useRef, useState } from "react";
import { useLearningLanguageOptional } from "@/contexts/LearningLanguageContext";
import {
  DEFAULT_LEARNING_LANGUAGE_CODE,
  learningLanguageSpeechTag,
} from "@/lib/learningLanguages";
import { playTts, prefetchTts } from "@/lib/ttsPlayer";

type TTSButtonProps = {
  text: string;
  className?: string;
  ariaLabel?: string;
  /** Override BCP-47 speech language (defaults to current learning language). */
  lang?: string;
};

export function TTSButton({ text, className, ariaLabel, lang }: TTSButtonProps) {
  const [busy, setBusy] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const learningLanguage = useLearningLanguageOptional();
  const speechLang =
    lang ||
    learningLanguageSpeechTag(
      learningLanguage?.targetLanguage ?? DEFAULT_LEARNING_LANGUAGE_CODE,
    );

  useEffect(() => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const node = buttonRef.current;
    let visible = !node;
    let debounce: number | undefined;

    const queue = () => {
      window.clearTimeout(debounce);
      debounce = window.setTimeout(() => {
        if (visible) prefetchTts(trimmed, speechLang);
      }, 400);
    };

    if (!node || typeof IntersectionObserver === "undefined") {
      queue();
      return () => window.clearTimeout(debounce);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        visible = entries.some((entry) => entry.isIntersecting);
        if (visible) queue();
      },
      { rootMargin: "160px" },
    );
    observer.observe(node);

    return () => {
      observer.disconnect();
      window.clearTimeout(debounce);
    };
  }, [text, speechLang]);

  const handleSpeak = async () => {
    const trimmed = text.trim();
    if (!trimmed || busy) {
      return;
    }

    setBusy(true);
    try {
      await playTts(trimmed, speechLang);
    } catch (error) {
      console.error("TTS failed:", error);
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      ref={buttonRef}
      type="button"
      onPointerDown={() => {
        const trimmed = text.trim();
        if (trimmed) prefetchTts(trimmed, speechLang);
      }}
      onClick={() => {
        void handleSpeak();
      }}
      disabled={busy || !text.trim()}
      lang={speechLang}
      aria-label={ariaLabel ?? "Listen"}
      aria-busy={busy}
      className={`rounded-md border border-white/15 bg-[#121212] px-2 py-1 text-sm transition hover:bg-white/10 disabled:opacity-50 ${className ?? ""}`}
    >
      🔊
    </button>
  );
}
