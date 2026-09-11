"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { FullScreenLayer } from "@/components/FullScreenLayer";
import { usePremium } from "@/contexts/PremiumContext";
import {
  learningLanguageSpeechTag,
  type LearningLanguageCode,
} from "@/lib/learningLanguages";
import { findScenario, sentencesFor } from "@/lib/roleplay/catalog";
import { fetchDirection, listenForTurn, type Recorder } from "@/lib/roleplay/listen";
import {
  afterSaying,
  applyDirection,
  currentInstruction,
  directionFailed,
  startSession,
  submitSpeech,
  type Instruction,
  type SessionState,
} from "@/lib/roleplay/session";
import { playTts, stopTts } from "@/lib/ttsPlayer";
import type { UICopy } from "@/lib/copy";

/**
 * Playing a roleplay.
 *
 * All the deciding happens in session.ts; this does the things that cannot be
 * pure — play a line, record a turn, and ask the director when the script
 * cannot take one. Every branch it takes is one the state machine asked for.
 *
 * There is deliberately nothing here that looks like a correction or a way to
 * summon help. When the script runs out the character simply answers, in the
 * same voice and the same bubble, and any explicit teaching sits in the line
 * under it. The learner is meant to feel one conversation carrying on.
 *
 * The transcript builds downward as it goes, so the learner can see what was
 * said rather than having to hold a conversation in their head.
 */

type Spoken = { who: "tutor" | "learner"; text: string; translation?: string };

/**
 * How long to wait for a line that has not started playing before carrying on
 * without it. Long enough for a slow connection, short enough that a stall does
 * not read as the app having hung.
 */
const STALLED_AUDIO_MS = 8000;

/**
 * The same, for a line synthesised on the spot. It streams, so it starts before
 * it has fully arrived, but the whole of it has to play before the turn passes.
 */
const GENERATED_AUDIO_MS = 30000;

export function RoleplayScreen({
  scenarioId,
  nativeLanguage,
  ui,
  onClose,
}: {
  scenarioId: string;
  /** What the learner speaks, so the director's notes are written in it. */
  nativeLanguage: LearningLanguageCode;
  ui: UICopy;
  onClose: () => void;
}) {
  const { isPremium } = usePremium();
  const scenario = findScenario(scenarioId);
  const [state, setState] = useState<SessionState | null>(null);
  const [instruction, setInstruction] = useState<Instruction | null>(null);
  const [said, setSaid] = useState<Spoken[]>([]);
  const [recording, setRecording] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  // Bumped when the microphone decides a turn has ended. An effect does the
  // sending rather than the callback itself: the callback is created once, at
  // the start of the turn, and would still be holding that moment's state.
  const [settled, setSettled] = useState(0);
  const [thinking, setThinking] = useState(false);
  // The director is deciding what the character says. Shown as the character
  // about to speak, not as the app working.
  const [directing, setDirecting] = useState(false);
  const recorderRef = useRef<Recorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const bank = scenario ? sentencesFor(scenario.language) : {};

  useEffect(() => {
    if (!scenario) return;
    const fresh = startSession(scenario);
    setState(fresh);
    setInstruction(currentInstruction(scenario, bank, fresh));
    setSaid([]);
    // The bank is derived from the scenario, so it moves with it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenarioId]);

  /** Play the current line, then hand control back to the state machine. */
  useEffect(() => {
    if (!scenario || !state || instruction?.do !== "say") return;
    let cancelled = false;
    setSaid((current) => [
      ...current,
      { who: "tutor", text: instruction.text, translation: instruction.translation },
    ]);
    let advanced = false;
    let watchdog = 0;
    const advance = () => {
      if (cancelled || advanced) return;
      advanced = true;
      window.clearTimeout(watchdog);
      const moved = afterSaying(scenario, bank, state, Date.now());
      setState(moved.state);
      setInstruction(moved.instruction);
    };

    if (!instruction.audioPath) {
      // Written by the director just now, so there is no file: it is spoken in
      // the scene's own voice, which is what keeps it the same person.
      watchdog = window.setTimeout(advance, GENERATED_AUDIO_MS);
      void playTts(
        instruction.text,
        learningLanguageSpeechTag(scenario.language),
        instruction.voice,
      ).then(advance, advance);
      return () => {
        cancelled = true;
        window.clearTimeout(watchdog);
        stopTts();
      };
    }

    const audio = new Audio(instruction.audioPath);
    audioRef.current = audio;
    /**
     * Audio that never finishes must not take the scenario with it.
     *
     * `error` covers a file that is missing, but a load that stalls raises
     * nothing at all — it simply never ends, and the line stays on screen with
     * no way forward. The text has already been shown by this point, so going
     * on without the voice is a worse lesson but not a dead one.
     */
    watchdog = window.setTimeout(advance, STALLED_AUDIO_MS);
    audio.addEventListener(
      "loadedmetadata",
      () => {
        if (!Number.isFinite(audio.duration)) return;
        window.clearTimeout(watchdog);
        // Its own length plus a moment, once that length is actually known.
        watchdog = window.setTimeout(advance, audio.duration * 1000 + 2000);
      },
      { once: true },
    );
    audio.addEventListener("ended", advance, { once: true });
    audio.addEventListener("error", advance, { once: true });
    void audio.play().catch(advance);
    return () => {
      cancelled = true;
      window.clearTimeout(watchdog);
      audio.pause();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [instruction]);

  /**
   * The script could not take the turn: the director decides the next line.
   *
   * If it cannot be reached the scene falls back on what it has recorded, so a
   * failed request is heard as the character carrying on, not as an error.
   */
  useEffect(() => {
    if (!scenario || !state || instruction?.do !== "direct") return;
    let cancelled = false;
    setDirecting(true);
    void fetchDirection({
      request: instruction.request,
      nativeLanguage,
      isPremium,
    }).then((direction) => {
      if (cancelled) return;
      setDirecting(false);
      const moved = direction
        ? applyDirection(scenario, bank, state, direction, Date.now())
        : directionFailed(scenario, bank, state, Date.now());
      setState(moved.state);
      setInstruction(moved.instruction);
    });
    return () => {
      cancelled = true;
      setDirecting(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [instruction]);

  const answer = useCallback(
    async (heard: string) => {
      if (!scenario || !state) return;
      setSaid((current) => [...current, { who: "learner", text: heard || "…" }]);
      const result = submitSpeech(scenario, bank, state, heard, Date.now());
      setState(result.state);
      setInstruction(result.instruction);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [scenario, state],
  );

  const startRecording = async () => {
    if (recording || recorderRef.current || !scenario) return;
    try {
      recorderRef.current = await listenForTurn({
        language: scenario.language,
        isPremium,
        onSpeaking: setSpeaking,
        onSettled: () => setSettled((count) => count + 1),
      });
      setRecording(true);
    } catch {
      // No microphone, or it was refused. The scenario cannot continue without
      // one, and stranding them on a turn they cannot answer is worse than
      // ending it.
      setInstruction({ do: "finish" });
    }
  };

  const stopRecording = async () => {
    const recorder = recorderRef.current;
    if (!recorder) return;
    recorderRef.current = null;
    setRecording(false);
    setSpeaking(false);
    setThinking(true);
    const heard = await recorder.stop();
    setThinking(false);
    await answer(heard);
  };

  /**
   * The microphone opens with the turn rather than with a button.
   *
   * Holding a button down to speak is the one thing on this screen a
   * conversation never asks of anyone, and it was the last obviously mechanical
   * step left in a mode meant to read as a conversation that carries on. The
   * turn is still one transcription, so this costs nothing.
   */
  useEffect(() => {
    if (instruction?.do !== "listen") return;
    void startRecording();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [instruction]);

  // Sent from here, where the closure is this render's, rather than from the
  // callback that was made when the turn began.
  useEffect(() => {
    if (settled === 0) return;
    void stopRecording();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settled]);

  useEffect(() => {
    return () => {
      recorderRef.current?.cancel();
      audioRef.current?.pause();
    };
  }, []);

  if (!scenario) return null;

  return (
    <FullScreenLayer>
      <header className="flex shrink-0 items-center justify-between border-b border-white/10 px-4 py-3">
        <div>
          <h2 className="text-sm font-semibold text-white">{scenario.title}</h2>
          <p className="text-[11px] text-neutral-500">{scenario.tutorRole}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-white/15 px-3 py-1.5 text-[12px] text-neutral-300 hover:bg-white/10"
        >
          {ui.billingClose}
        </button>
      </header>

      <ol className="min-h-0 flex-1 overflow-y-auto p-3">
        {said.map((line, index) => (
          <li
            key={index}
            className={`mb-2 flex ${line.who === "learner" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-3 py-2 ${
                line.who === "learner"
                  ? "bg-white/10 text-neutral-200"
                  : "bg-[#141414] text-neutral-100"
              }`}
            >
              <p className="text-[14px] leading-snug">{line.text}</p>
              {line.translation ? (
                <p className="mt-1 text-[12px] text-neutral-500">{line.translation}</p>
              ) : null}
            </div>
          </li>
        ))}
        {directing ? (
          <li className="mb-2 flex justify-start">
            <div className="rounded-2xl bg-[#141414] px-3 py-2 text-[14px] text-neutral-500">
              …
            </div>
          </li>
        ) : null}
      </ol>

      <footer className="shrink-0 border-t border-white/10 p-3 pb-[env(safe-area-inset-bottom)]">
        {instruction?.do === "listen" ? (
          <div className="flex flex-col gap-2">
            {instruction.goal ? (
              <p className="text-[13px] text-neutral-300">{instruction.goal}</p>
            ) : null}
            {instruction.hint ? (
              <p className="text-[12px] text-neutral-500">{instruction.hint}</p>
            ) : null}
            {/* Not how you speak any more — the microphone is already open and
                sends when you stop. This is for finishing early, and for the
                room too quiet or too loud for the level to be read. */}
            <button
              type="button"
              onClick={() => void stopRecording()}
              disabled={thinking || !recording}
              className={`w-full rounded-xl px-4 py-3 text-sm font-medium transition ${
                speaking
                  ? "bg-[#b91c3c] text-white"
                  : "bg-white/15 text-neutral-100 hover:bg-white/20"
              } disabled:opacity-50`}
            >
              {thinking ? "…" : `${speaking ? "●" : "🎙"} ${ui.send}`}
            </button>
          </div>
        ) : null}

        {instruction?.do === "finish" ? (
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl bg-white/15 px-4 py-3 text-sm text-neutral-100"
          >
            {ui.billingClose}
          </button>
        ) : null}
      </footer>
    </FullScreenLayer>
  );
}
