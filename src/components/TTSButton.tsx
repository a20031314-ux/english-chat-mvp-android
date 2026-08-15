"use client";

import { Capacitor } from "@capacitor/core";
import { useState } from "react";
import { useLearningLanguageOptional } from "@/contexts/LearningLanguageContext";
import {
  DEFAULT_LEARNING_LANGUAGE_CODE,
  learningLanguageSpeechTag,
} from "@/lib/learningLanguages";

type TTSButtonProps = {
  text: string;
  className?: string;
  ariaLabel?: string;
  /** Override BCP-47 speech language (defaults to current learning language). */
  lang?: string;
};

async function speakNative(text: string, lang: string) {
  const { TextToSpeech } = await import(
    "@capacitor-community/text-to-speech"
  );
  await TextToSpeech.stop();
  await TextToSpeech.speak({
    text,
    lang,
    rate: 1.0,
    pitch: 1.0,
    volume: 1.0,
    category: "playback",
  });
}

function speakWeb(text: string, lang: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;

  const voices = window.speechSynthesis.getVoices();
  const prefix = lang.slice(0, 2).toLowerCase();
  const match =
    voices.find((v) => v.lang === lang) ??
    voices.find((v) => v.lang.toLowerCase().startsWith(prefix));
  if (match) {
    utterance.voice = match;
  }

  window.speechSynthesis.speak(utterance);
}

export function TTSButton({ text, className, ariaLabel, lang }: TTSButtonProps) {
  const [busy, setBusy] = useState(false);
  const learningLanguage = useLearningLanguageOptional();
  const speechLang =
    lang ||
    learningLanguageSpeechTag(
      learningLanguage?.targetLanguage ?? DEFAULT_LEARNING_LANGUAGE_CODE,
    );

  const handleSpeak = async () => {
    const trimmed = text.trim();
    if (!trimmed || busy) {
      return;
    }

    setBusy(true);
    try {
      if (Capacitor.isNativePlatform()) {
        await speakNative(trimmed, speechLang);
      } else {
        speakWeb(trimmed, speechLang);
      }
    } catch (error) {
      console.error("TTS failed:", error);
      // Last resort: try Web Speech API even on native if plugin fails
      try {
        speakWeb(trimmed, speechLang);
      } catch {
        // ignore
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      onClick={() => {
        void handleSpeak();
      }}
      disabled={busy || !text.trim()}
      aria-label={ariaLabel ?? "Listen"}
      aria-busy={busy}
      className={`rounded-md border border-slate-300 bg-white px-2 py-1 text-sm transition hover:bg-slate-50 disabled:opacity-50 ${className ?? ""}`}
    >
      🔊
    </button>
  );
}
