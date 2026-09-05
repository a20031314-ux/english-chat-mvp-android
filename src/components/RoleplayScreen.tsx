"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePremium } from "@/contexts/PremiumContext";
import { learningLanguageName } from "@/lib/learningLanguages";
import { findScenario, sentencesFor } from "@/lib/roleplay/catalog";
import { listenForTurn, type Recorder } from "@/lib/roleplay/listen";
import {
  afterSaying,
  afterTutor,
  currentInstruction,
  startSession,
  submitSpeech,
  tutorHandover,
  type Instruction,
  type SessionState,
} from "@/lib/roleplay/session";
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

export function RoleplayScreen({
  scenarioId,
  ui,
  onClose,
  onWakeTutor,
}: {
  scenarioId: string;
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
    const advance = () => {
      if (cancelled) return;
      const moved = afterSaying(scenario, bank, state, Date.now());
      setState(moved.state);
      setInstruction(moved.instruction);
    };
    audio.addEventListener("ended", advance, { once: true });
    // A missing file should not strand the scenario: the line has been shown,
    // so carrying on silently is better than stopping on a network hiccup.
    audio.addEventListener("error", advance, { once: true });
    void audio.play().catch(advance);
    return () => {
      cancelled = true;
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

  const wakeTutor = instruction?.do === "wakeTutor" ? instruction : null;
  const handover = wakeTutor
    ? tutorHandover(
        wakeTutor.context,
        learningLanguageName(scenario.language),
      )
    : null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#050505]">
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

        {handover ? (
          // Nothing about the scene is in the tutor's context, so the whole
          // handover goes with the call rather than being summarised for it.
          <TutorHandoff
            onCall={() => onWakeTutor(handover)}
            onDone={() => {
              if (!state) return;
              const resumed = afterTutor(scenario, bank, state, Date.now());
              setState(resumed.state);
              setInstruction(resumed.instruction);
            }}
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
    </div>
  );
}

/**
 * The moment the script hands over.
 *
 * Kept as its own piece because it is the expensive one: everything above is a
 * file being played, and this is a live realtime session opening. Making it a
 * button rather than something automatic means the learner chooses to spend it.
 */
function TutorHandoff({
  onCall,
  onDone,
  ui,
}: {
  onCall: () => void;
  onDone: () => void;
  ui: UICopy;
}) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-[12px] text-neutral-400">{ui.chatDuringCall}</p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onCall}
          className="flex-1 rounded-xl bg-[#4f86ff] px-4 py-3 text-sm font-medium text-white"
        >
          {ui.chatCall}
        </button>
        {/* Carrying on without the tutor: the learner may have worked it out
            while the button was sitting there, and should not have to spend a
            call to say so. */}
        <button
          type="button"
          onClick={onDone}
          aria-label="retry"
          className="rounded-xl border border-white/15 px-4 py-3 text-sm text-neutral-300"
        >
          ↻
        </button>
      </div>
    </div>
  );
}
