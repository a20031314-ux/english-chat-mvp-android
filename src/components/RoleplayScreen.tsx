"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { FullScreenLayer } from "@/components/FullScreenLayer";
import { usePremium } from "@/contexts/PremiumContext";
import {
  learningLanguageName,
  learningLanguageSpeechTag,
  type LearningLanguageCode,
} from "@/lib/learningLanguages";
import { findScenario, sentencesFor } from "@/lib/roleplay/catalog";
import { fetchCorrection, listenForTurn, type Recorder } from "@/lib/roleplay/listen";
import {
  afterSaying,
  afterTutor,
  askTutor,
  currentInstruction,
  startSession,
  submitSpeech,
  tutorHandover,
  type Instruction,
  type SessionState,
} from "@/lib/roleplay/session";
import type { RoleplayScenario } from "@/lib/roleplay/script";
import { playTts } from "@/lib/ttsPlayer";
import type { UICopy } from "@/lib/copy";

/**
 * Playing a scripted roleplay.
 *
 * All the deciding happens in session.ts; this does the three things that
 * cannot be pure — play a file, record a turn, and put a live tutor on when the
 * script runs out. Every branch it takes is one the state machine asked for.
 *
 * The transcript builds downward as it goes, so the learner can see what was
 * said rather than having to hold a conversation in their head. That is the
 * same reason the call has one.
 */

type Spoken = { who: "tutor" | "learner"; text: string; translation?: string };

/**
 * How long to wait for a line that has not started playing before carrying on
 * without it. Long enough for a slow connection, short enough that a stall does
 * not read as the app having hung.
 */
const STALLED_AUDIO_MS = 8000;

export function RoleplayScreen({
  scenarioId,
  nativeLanguage,
  ui,
  onClose,
  onWakeTutor,
}: {
  scenarioId: string;
  /** What the learner speaks, so a made correction can be explained to them. */
  nativeLanguage: LearningLanguageCode;
  ui: UICopy;
  onClose: () => void;
  /**
   * Open a live call with this opening. Owned by the caller because a call is
   * a thing there should only ever be one of, and this screen is not the only
   * place one can start.
   */
  onWakeTutor: (opening: { scene: string; ask: string }) => void;
}) {
  const { isPremium } = usePremium();
  const scenario = findScenario(scenarioId);
  const [state, setState] = useState<SessionState | null>(null);
  const [instruction, setInstruction] = useState<Instruction | null>(null);
  const [said, setSaid] = useState<Spoken[]>([]);
  const [recording, setRecording] = useState(false);
  const [thinking, setThinking] = useState(false);
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
    const audio = new Audio(instruction.audioPath);
    audioRef.current = audio;
    let advanced = false;
    const advance = () => {
      if (cancelled || advanced) return;
      advanced = true;
      window.clearTimeout(watchdog);
      const moved = afterSaying(scenario, bank, state, Date.now());
      setState(moved.state);
      setInstruction(moved.instruction);
    };
    /**
     * Audio that never finishes must not take the scenario with it.
     *
     * `error` covers a file that is missing, but a load that stalls raises
     * nothing at all — it simply never ends, and the line stays on screen with
     * no way forward. The text has already been shown by this point, so going
     * on without the voice is a worse lesson but not a dead one.
     */
    let watchdog = window.setTimeout(advance, STALLED_AUDIO_MS);
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
    if (recording || !scenario) return;
    try {
      recorderRef.current = await listenForTurn({
        language: scenario.language,
        isPremium,
      });
      setRecording(true);
    } catch {
      setInstruction({ do: "finish" });
    }
  };

  const stopRecording = async () => {
    const recorder = recorderRef.current;
    if (!recorder) return;
    recorderRef.current = null;
    setRecording(false);
    setThinking(true);
    const heard = await recorder.stop();
    setThinking(false);
    await answer(heard);
  };

  useEffect(() => {
    return () => {
      recorderRef.current?.cancel();
      audioRef.current?.pause();
    };
  }, []);

  if (!scenario) return null;

  const correcting = instruction?.do === "correct" ? instruction : null;

  /** Deliver the correction, then put them back at the same question. */
  const afterCorrection = () => {
    if (!state) return;
    const resumed = afterTutor(scenario, bank, state, Date.now());
    setState(resumed.state);
    setInstruction(resumed.instruction);
  };

  /**
   * The only door to a live session, and it is a button.
   *
   * A correction is one sentence and a recording delivers it; a question about
   * the correction is a conversation, which is what a call is for. Keeping them
   * apart means nobody is charged for a call by missing a turn.
   */
  const callTutor = () => {
    if (!state || !correcting) return;
    const asked = askTutor(scenario, state, correcting.context.heard);
    if (asked.do !== "wakeTutor") return;
    onWakeTutor(
      tutorHandover(asked.context, learningLanguageName(scenario.language)),
    );
    afterCorrection();
  };

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
      </ol>

      <footer className="shrink-0 border-t border-white/10 p-3 pb-[env(safe-area-inset-bottom)]">
        {instruction?.do === "listen" ? (
          <div className="flex flex-col gap-2">
            <p className="text-[13px] text-neutral-300">{instruction.goal}</p>
            {instruction.hint ? (
              <p className="text-[12px] text-neutral-500">{instruction.hint}</p>
            ) : null}
            <button
              type="button"
              onPointerDown={() => void startRecording()}
              onPointerUp={() => void stopRecording()}
              onPointerLeave={() => void (recording && stopRecording())}
              disabled={thinking}
              className={`w-full rounded-xl px-4 py-3 text-sm font-medium transition ${
                recording
                  ? "bg-[#b91c3c] text-white"
                  : "bg-white/15 text-neutral-100 hover:bg-white/20"
              } disabled:opacity-50`}
            >
              {thinking ? "…" : recording ? "●" : "🎙"}
            </button>
          </div>
        ) : null}

        {correcting ? (
          <Correction
            spoken={correcting.spoken}
            context={correcting.context}
            scenario={scenario}
            nativeLanguage={nativeLanguage}
            isPremium={isPremium}
            onRetry={afterCorrection}
            onCall={callTutor}
            ui={ui}
          />
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

/**
 * What to do when the script cannot take the answer.
 *
 * `spoken` is a line the scenario wrote for this turn, generated with every
 * other line and free to play. When it is missing the trouble here was not
 * predictable, and a correction has to be made — still a fraction of opening a
 * live session for what is usually one sentence of advice.
 */
function Correction({
  spoken,
  context,
  scenario,
  nativeLanguage,
  isPremium,
  onRetry,
  onCall,
  ui,
}: {
  spoken?: { text: string; translation?: string; audioPath: string };
  context: { setting: string; tutorRole: string; goal: string; heard: string };
  scenario: RoleplayScenario;
  nativeLanguage: LearningLanguageCode;
  isPremium: boolean;
  onRetry: () => void;
  onCall: () => void;
  ui: UICopy;
}) {
  const [made, setMade] = useState<{ text: string; translation: string } | null>(
    null,
  );
  const [failed, setFailed] = useState(false);

  // A written correction plays from a file. Anything else has to be made, and
  // then read aloud through the same voice, so the tutor stays one person.
  useEffect(() => {
    if (spoken) {
      const audio = new Audio(spoken.audioPath);
      void audio.play().catch(() => undefined);
      return () => audio.pause();
    }
    let cancelled = false;
    void (async () => {
      const correction = await fetchCorrection({
        context,
        targetLanguage: scenario.language,
        nativeLanguage,
        isPremium,
      });
      if (cancelled) return;
      if (!correction) {
        setFailed(true);
        return;
      }
      setMade(correction);
      void playTts(
        correction.text,
        learningLanguageSpeechTag(scenario.language),
      ).catch(() => undefined);
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spoken]);

  const shown = spoken ?? made;

  return (
    <div className="flex flex-col gap-2">
      {shown ? (
        <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
          <p className="text-[14px] text-neutral-100">{shown.text}</p>
          {shown.translation ? (
            <p className="mt-1 text-[12px] text-neutral-400">{shown.translation}</p>
          ) : null}
        </div>
      ) : (
        // Not an error the learner caused, and not a call that failed: the
        // scenario simply had nothing written for this and the making of one is
        // still in flight, or did not work.
        <p className="text-[13px] text-neutral-500">{failed ? ui.roleplayNoHelp : "…"}</p>
      )}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onRetry}
          aria-label="retry"
          className="flex-1 rounded-xl bg-white/15 px-4 py-3 text-sm text-neutral-100"
        >
          ↻
        </button>
        {/* Asking back is the only thing that opens a call, and it is chosen. */}
        <button
          type="button"
          onClick={onCall}
          className="rounded-xl border border-white/15 px-4 py-3 text-sm text-neutral-300"
        >
          {ui.chatCall}
        </button>
      </div>
    </div>
  );
}
