"use client";

import { Capacitor } from "@capacitor/core";
import { useState } from "react";

type TTSButtonProps = {
  text: string;
  className?: string;
  ariaLabel?: string;
};

async function speakNative(text: string) {
  const { TextToSpeech } = await import(
    "@capacitor-community/text-to-speech"
  );
  await TextToSpeech.stop();
  await TextToSpeech.speak({
    text,
    lang: "en-US",
    rate: 1.0,
    pitch: 1.0,
    volume: 1.0,
    category: "playback",
  });
}

function speakWeb(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";

  const voices = window.speechSynthesis.getVoices();
  const en =
    voices.find((v) => v.lang === "en-US") ??
    voices.find((v) => v.lang.startsWith("en"));
  if (en) {
    utterance.voice = en;
  }

  window.speechSynthesis.speak(utterance);
}

export function TTSButton({ text, className, ariaLabel }: TTSButtonProps) {
  const [busy, setBusy] = useState(false);

  const handleSpeak = async () => {
    const trimmed = text.trim();
    if (!trimmed || busy) {
      return;
    }

    setBusy(true);
    try {
      if (Capacitor.isNativePlatform()) {
        await speakNative(trimmed);
      } else {
        speakWeb(trimmed);
      }
    } catch (error) {
      console.error("TTS failed:", error);
      // Last resort: try Web Speech API even on native if plugin fails
      try {
        speakWeb(trimmed);
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
