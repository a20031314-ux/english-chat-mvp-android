"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { FullScreenLayer } from "@/components/FullScreenLayer";
import {
  RoleplayLine,
  RoleplayReviewPanel,
  type TranscriptLine,
} from "@/components/RoleplayReview";
import { usePremium } from "@/contexts/PremiumContext";
import {
  learningLanguageSpeechTag,
  type LearningLanguageCode,
} from "@/lib/learningLanguages";
import { findScenario, sentencesFor } from "@/lib/roleplay/catalog";
import {
  fetchContext,
  fetchDirection,
  fetchPractice,
  fetchReview,
  isOutOfPoints,
  listenForTurn,
  listenOnce,
  type Recorder,
} from "@/lib/roleplay/listen";
import {
  EMPTY_MEMORY,
  foldDue,
  rawLines,
  type ConversationMemory,
} from "@/lib/roleplay/memory";
import {
  REVIEW_LINES,
  type Review,
  type StuckTurn,
} from "@/lib/roleplay/review";
import {
  afterSaying,
  applyDirection,
  currentInstruction,
  directionFailed,
  resumeListening,
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
 * Nothing interrupts the conversation. When the script runs out the character
 * simply answers, in the same voice and the same bubble, and the scene carries
 * on whether or not the turn went well.
 *
 * What the learner may do afterwards is look back. A turn the tutor judged a
 * struggle keeps a button, and pressing it stops the scene and explains what
 * happened there — which is where explicit teaching now lives, because under a
 * bubble, mid-turn, with the microphone open, nobody was ever reading it. The
 * button waits rather than expires: deciding inside the two seconds before you
 * must speak is not a choice.
 *
 * The transcript builds downward as it goes, so the learner can see what was
 * said rather than having to hold a conversation in their head.
 */

type Spoken = TranscriptLine;

/**
 * Mark the turn they just struggled on, once the tutor has said so.
 *
 * The learner's line is already in the transcript by then — it went up the
 * moment they stopped speaking — so the evidence is attached to it afterwards
 * rather than held back until the answer arrives.
 */
/**
 * Put what was said about their sentence under their sentence.
 *
 * Either field, because the character uses whichever it reaches for: a rewrite
 * of what they said, a word about it in their own language, or both. What
 * matters is that it lands under the words it is about, where they are looking
 * in the seconds before they are answered.
 */
function markAboutTheirLine(
  lines: Spoken[],
  about: { better?: string; about?: string },
): Spoken[] {
  const index = lines.map((line) => line.who).lastIndexOf("learner");
  if (index < 0) return lines;
  const marked = [...lines];
  marked[index] = { ...marked[index]!, ...about };
  return marked;
}

function markStuck(lines: Spoken[], turn: Omit<StuckTurn, "asked">): Spoken[] {
  const index = lines.map((line) => line.who).lastIndexOf("learner");
  if (index < 0) return lines;
  const asked =
    lines
      .slice(0, index)
      .reverse()
      .find((line) => line.who === "tutor")?.text ?? "";
  const marked = [...lines];
  marked[index] = { ...marked[index], stuck: { ...turn, asked } };
  return marked;
}

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
  // Bumped when the microphone decides a turn has ended. An effect does the
  // sending rather than the callback itself: the callback is created once, at
  // the start of the turn, and would still be holding that moment's state.
  const [settled, setSettled] = useState(0);
  // The wait between their last word and the character's first: transcribing
  // what was said, then deciding what to answer. Shown in the conversation as
  // a line being composed, because that is where the learner is looking and
  // what is actually happening.
  const [thinking, setThinking] = useState(false);
  // The director is deciding what the character says. Shown as the character
  // about to speak, not as the app working.
  const [directing, setDirecting] = useState(false);
  const recorderRef = useRef<Recorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  // The tutor's notes on what has left its verbatim view (memory.ts). Kept out
  // of the session state on purpose: a fold lands whenever its request comes
  // back, and every other update here replaces the session state wholesale from
  // the value it started with — so notes stored inside it would be overwritten
  // by the next line that finished playing.
  const [memory, setMemory] = useState<ConversationMemory>(EMPTY_MEMORY);
  // The turn being looked back at, if any. `review` is null while it is being
  // put together, and `failed` says the attempt came back with nothing — the
  // button stays where it was either way.
  const [reviewing, setReviewing] = useState<{
    turn: StuckTurn;
    review: Review | null;
    failed: boolean;
  } | null>(null);
  const folding = useRef(false);
  // Names this conversation to the server, which charges by how long it has
  // been running (billing/config.ts). New on every scene, so a new scene is a
  // new five minutes rather than a continuation of the last one.
  const conversationId = useRef("");
  // Set when a turn could not be paid for. The scene ends on it rather than
  // going quiet, which is what a dropped turn looks like and is not this.
  const [outOfPoints, setOutOfPoints] = useState(false);
  // Bumped per session, so a fold that comes back after the scene changed is
  // dropped rather than applied to the wrong conversation.
  const sessionRef = useRef(0);

  const bank = scenario ? sentencesFor(scenario.language) : {};

  useEffect(() => {
    if (!scenario) return;
    const fresh = startSession(scenario);
    setState(fresh);
    setInstruction(currentInstruction(scenario, bank, fresh));
    setSaid([]);
    setMemory(EMPTY_MEMORY);
    setReviewing(null);
    setOutOfPoints(false);
    conversationId.current =
      globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
    folding.current = false;
    sessionRef.current += 1;
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
      // Verbatim, every line the notes do not cover; the notes for the rest.
      request: {
        ...instruction.request,
        history: rawLines(instruction.request.history, memory),
        context: memory.text,
      },
      nativeLanguage,
      isPremium,
      sessionId: conversationId.current,
    }).then((answer) => {
      if (cancelled) return;
      setDirecting(false);
      // Out of points is not a failed turn: the scene closes and says so,
      // instead of standing there not answering.
      if (isOutOfPoints(answer)) {
        setOutOfPoints(true);
        setInstruction({ do: "finish" });
        return;
      }
      const direction = answer;
      // The tutor's own reading of the turn is what marks it: it is the one
      // judgement in the scene that looked at what they meant, not at whether
      // a recorded phrase happened to match.
      // Anything about the sentence they just said goes under it, rather than
      // under the character's answer. A note only rides with the character's
      // line when they were stuck, where it is help for getting through rather
      // than a word about something they managed to say.
      const better = direction?.better ?? "";
      const about = direction && direction.assessment !== "stuck" ? direction.note : "";
      if (better || about) {
        setSaid((current) =>
          markAboutTheirLine(current, {
            ...(better ? { better } : {}),
            ...(about ? { about } : {}),
          }),
        );
      }
      if (direction?.assessment === "stuck") {
        const pending = state.pending;
        setSaid((current) =>
          markStuck(current, {
            heard: instruction.request.heard,
            attempts: pending?.attempts ?? 1,
            hesitationMs: pending?.hesitationMs ?? 0,
            history: instruction.request.history.slice(-REVIEW_LINES),
          }),
        );
      }
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

  /**
   * Fold what has left the tutor's verbatim view into its notes, in the
   * background. No turn waits on this: the next one simply has the notes if
   * they are back by then, and a failed fold is tried again later.
   */
  const historyLength = state?.history.length ?? 0;
  useEffect(() => {
    if (!scenario || !state || folding.current) return;
    const due = foldDue(state.history, memory);
    if (!due) return;
    folding.current = true;
    const session = sessionRef.current;
    void fetchContext({
      scenarioId: scenario.id,
      previous: memory.text,
      lines: due.lines,
      isPremium,
    }).then((notes) => {
      if (session !== sessionRef.current) return;
      folding.current = false;
      if (!notes) return;
      setMemory((current) =>
        current.upTo < due.upTo ? { text: notes, upTo: due.upTo } : current,
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [historyLength, memory]);

  const answer = useCallback(
    async (heard: string, endedAt: number, speechStartedAt: number | null) => {
      if (!scenario || !state) return;
      setSaid((current) => [...current, { who: "learner", text: heard || "…" }]);
      const result = submitSpeech(scenario, bank, state, heard, endedAt, speechStartedAt);
      setState(result.state);
      setInstruction(result.instruction);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [scenario, state],
  );

  /**
   * Stop the scene and look back at a turn.
   *
   * The microphone closes first. Reading is not answering, and a turn left open
   * would go on counting the silence as theirs — and would send whatever the
   * room said while they read.
   */
  const openReview = useCallback(
    (turn: StuckTurn) => {
      recorderRef.current?.cancel();
      recorderRef.current = null;
      setRecording(false);
      setReviewing({ turn, review: null, failed: false });
      if (!scenario) return;
      void fetchReview({
        scenarioId: scenario.id,
        turn,
        nativeLanguage,
        isPremium,
      }).then((review) => {
        setReviewing((current) =>
          current && current.turn === turn
            ? { ...current, review, failed: review === null }
            : current,
        );
      });
    },
    [scenario, nativeLanguage, isPremium],
  );

  /**
   * Back to the scene, on the same turn, with the clock started again.
   *
   * The question has not changed and the tries already spent still stand; only
   * the silence is forgiven, because it was spent reading.
   */
  /**
   * Say a line from the review back, and read what came out.
   *
   * Its own microphone. The scene's stays shut for as long as the panel is up,
   * which is what keeps a line said in practice from arriving as the next turn
   * of the conversation.
   */
  const sayItBack = useCallback(
    async (target: string) => {
      if (!scenario) return { heard: "", practice: null };
      const { heard } = await listenOnce({
        language: scenario.language,
        isPremium,
      });
      const practice = await fetchPractice({
        scenarioId: scenario.id,
        target,
        heard,
        nativeLanguage,
        isPremium,
      });
      return { heard, practice };
    },
    [scenario, nativeLanguage, isPremium],
  );

  const closeReview = useCallback(() => {
    setReviewing(null);
    if (!scenario || !state) return;
    const resumed = resumeListening(scenario, bank, state, Date.now());
    setState(resumed.state);
    setInstruction(resumed.instruction);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenario, state]);

  const startRecording = async () => {
    if (recording || recorderRef.current || !scenario) return;
    try {
      recorderRef.current = await listenForTurn({
        language: scenario.language,
        isPremium,
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
    // Both read before transcribing: the wait for the words to come back is the
    // network's time, not the learner's.
    const endedAt = Date.now();
    const speechStartedAt = recorder.speechStartedAt();
    setRecording(false);
    setThinking(true);
    const heard = await recorder.stop();
    setThinking(false);
    await answer(heard, endedAt, speechStartedAt);
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
    if (instruction?.do !== "listen" || reviewing) return;
    void startRecording();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [instruction, reviewing]);

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
          <RoleplayLine key={index} line={line} ui={ui} onReview={openReview} />
        ))}
        {directing || thinking ? (
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
          </div>
        ) : null}

        {instruction?.do === "finish" && outOfPoints ? (
          <p className="mb-2 text-[13px] leading-relaxed text-neutral-300">
            {ui.roleplayOutOfPoints}
          </p>
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

      {reviewing ? (
        <RoleplayReviewPanel
          turn={reviewing.turn}
          review={reviewing.review}
          failed={reviewing.failed}
          ui={ui}
          onClose={closeReview}
          onSayItBack={sayItBack}
        />
      ) : null}
    </FullScreenLayer>
  );
}
