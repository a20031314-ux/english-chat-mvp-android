"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FullScreenLayer } from "@/components/FullScreenLayer";
import { PracticeBanner, type PracticeRequest } from "@/components/NextStepCard";
import { RoleplayLine, RoleplayReviewPanel, type TranscriptLine } from "@/components/RoleplayReview";
import { CallControls, CallFooter, CallHeader, CallPages, CallStage, CallSummary, LearnerComposing, MeFace, TutorFace, type CallSpeaker } from "@/components/roleplay/CallParts";
import { CallRecap } from "@/components/roleplay/CallRecap";
import { useCallRecap, useCallTimeLine, useStoredToggle } from "@/components/roleplay/callHooks";
import { CALL_CAPTIONS_KEY } from "@/components/speech/CallKit";
import { TurnDiagBox } from "@/components/roleplay/TurnDiagBox";
import { useEnglishAnalysisOptional } from "@/contexts/EnglishAnalysisContext";
import { usePremium } from "@/contexts/PremiumContext";
import { maybeShowInterstitial } from "@/lib/ads";
import { sendAppIntent } from "@/lib/appIntents";
import type { UICopy } from "@/lib/copy";
import { refreshLedgerSoon } from "@/lib/learner/ledgerClient";
import { saidPhrase } from "@/lib/learner/practice";
import type { LearningLanguageCode } from "@/lib/learningLanguages";
import { handOffFrame } from "@/lib/notes/locateHandoff";
import { captureSceneSoon, enterScene } from "@/lib/notes/sceneShots";
import { turnDiagnosticsEnabled } from "@/lib/platform";
import { findScenario, sentencesFor } from "@/lib/roleplay/catalog";
import { BANK_GLOSS_LANGUAGE } from "@/lib/roleplay/justTalk";
import { playTutorLine, warmLine, warmNextLine } from "@/lib/roleplay/linePlayer";
import { learnerLineView } from "@/lib/roleplay/lineView";
import {
  fetchContext,
  fetchDirection,
  fetchPractice,
  fetchReview,
  heardUnsure,
  isOutOfPoints,
  listenForTurn,
  listenOnce,
  primeMicrophone,
  type Recorder,
} from "@/lib/roleplay/listen";
import { EMPTY_MEMORY, foldDue, rawLines, type ConversationMemory } from "@/lib/roleplay/memory";
import { REVIEW_LINES, type Review, type StuckTurn } from "@/lib/roleplay/review";
import { resumeFrom, titleFor, type SavedConversation } from "@/lib/roleplay/saved";
import {
  afterSaying,
  applyDirection,
  currentInstruction,
  directionFailed,
  missedLine,
  resumeListening,
  startSession,
  submitSpeech,
  type Instruction,
  type SessionState,
} from "@/lib/roleplay/session";
import { markAboutTheirLine, markMissed, markStuck, tallyCall, tipOnLastTutorLine, withTranslation } from "@/lib/roleplay/transcriptMarks";
import { soundsUnfinished } from "@/lib/roleplay/unfinished";
import { sayLine } from "@/lib/speech/sayLine";
import { translateUtterance } from "@/lib/translateUtterance";
import { tutorIsBilingual } from "@/lib/tutorLanguage";
import { readTutorGender } from "@/lib/tutorGender";
import { withTutorGender } from "@/lib/roleplay/justTalk";

/** How long to wait for the rest of a sentence the pause cut off. */
const REST_OF_SENTENCE_MS = 3500;

const SHOW_TRANSLATIONS_KEY = "roleplayShowTranslations";
/**
 * 통화 중 자막(튜터가 마지막에 한 말 한 줄): 기본은 꺼짐 — 실제 통화처럼 듣고 말하기(사용자 2026-11-01 "기본은 가리고 선택적으로",
 * 0~1단계도 똑같이 끔). 켜면 이 기기에 남는다. 내 말·고친 말은 통화 중에 안 보이고 끝난 뒤 대본에서.
 */
const SHOW_CAPTIONS_KEY = CALL_CAPTIONS_KEY;

/**
 * Playing a roleplay.
 *
 * All the deciding happens in session.ts; this does the things that cannot be
 * pure — play a line (lib/roleplay/linePlayer.ts), record a turn, and ask the
 * director when the script cannot take one. Every branch it takes is one the
 * state machine asked for. 곁가지 상태는 roleplay/callHooks.ts, 머리·바닥은
 * roleplay/CallParts.tsx, 대본 표시는 lib/roleplay/transcriptMarks.ts(2026-11-01 통화 구조 정리).
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

export function RoleplayScreen({
  scenarioId,
  nativeLanguage,
  ui,
  onClose,
  resume,
  onSaved,
  practice: practiceRequest,
}: {
  scenarioId: string;
  /** What the learner speaks, so the director's notes are written in it. */
  nativeLanguage: LearningLanguageCode;
  ui: UICopy;
  onClose: () => void;
  /**
   * A conversation to carry on with rather than a new one. Its billing id is
   * deliberately not carried over — see saved.ts: the server charges by how long
   * the conversation has been running, so a resumed one starts a new clock.
   */
  resume?: SavedConversation | null;
  /**
   * Called with the conversation as it stands, every time it changes. Writing
   * it down is the caller's business; this only says what there is to write.
   */
  onSaved?: (saved: SavedConversation) => void;
  /**
   * What this conversation was started to practise, from "try this" or the
   * map: sent with every turn so the character keeps to it, and shown above
   * the conversation with each phrase ticked once said (learner/practice.ts).
   */
  practice?: PracticeRequest | null;
}) {
  // "My에서 찾기"가 화면을 찍어도 되는 곳인지(lib/notes/sceneShots.ts — 사람끼리 대화는 안 찍음).
  useEffect(() => enterScene("call"), []);
  const { isPremium } = usePremium();
  const timeLine = useCallTimeLine(ui, isPremium);
  // 그냥 대화는 고른 튜터(여자·남자)의 목소리로 — 통화 동안은 처음 값 그대로(lib/tutorGender.ts, 2026-11-01).
  const catalogScene = findScenario(scenarioId);
  const [tutorGender] = useState(() => readTutorGender(catalogScene?.language));
  const scenario = useMemo(() => (catalogScene ? withTutorGender(catalogScene, tutorGender) : null), [catalogScene, tutorGender]);
  const analysis = useEnglishAnalysisOptional();
  const [state, setState] = useState<SessionState | null>(null);
  const [instruction, setInstruction] = useState<Instruction | null>(null);
  const [said, setSaid] = useState<Spoken[]>([]);
  const [practiceStopped, setPracticeStopped] = useState(false);
  const practice = practiceStopped ? null : (practiceRequest ?? null);
  const practiceSaid = useMemo(() => {
    const done = new Set<string>();
    if (!scenario) return done;
    for (const phrase of practice?.goal.phrases ?? []) {
      if (said.some((line) => line.who === "learner" && saidPhrase(line.text, phrase, scenario.language))) {
        done.add(phrase);
      }
    }
    return done;
  }, [practice, said, scenario]);
  // The character's translations: folded by default, each one a tap away, or
  // all on show — the learner's choice, kept for next time. Nothing waits on
  // a translation either way; this is about what is on screen.
  const [showTranslations, toggleTranslations] = useStoredToggle(SHOW_TRANSLATIONS_KEY);
  const [showCaptions, toggleCaptions] = useStoredToggle(SHOW_CAPTIONS_KEY);
  /** 두 번 연속 못 알아들은 튜터 줄(번호) — 자막을 꺼 두었어도 이 줄만 뜻과 함께 보여 준다. */
  const [forcedCaption, setForcedCaption] = useState(-1);
  /** 못 알아들었다고 해서 감독이 다시 말하는 중 — 그 줄(들)에 again 표시. 다음 내 차례가 오면 끝. */
  const rephrasingRef = useRef(false);
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
  /** What they have said of a sentence the pause cut off, while the rest is awaited. */
  const [pending, setPending] = useState("");
  /**
   * 학습자가 말을 시작했다 — 받아쓴 글이 올 때까지 학습자 쪽에 "…" 말풍선(말하는 방과 같은 방식).
   * 예전에는 말하는 동안 화면에 아무것도 없다가, 다 끝난 뒤에야 튜터 쪽 "…"가 떴다.
   */
  const [learnerTalking, setLearnerTalking] = useState(false);
  /** Lets a review or a close release the wait for the rest of a sentence. */
  const releaseRestRef = useRef<() => void>(() => undefined);
  // The director is deciding what the character says. Shown as the character
  // about to speak, not as the app working.
  const [directing, setDirecting] = useState(false);
  const recorderRef = useRef<Recorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  /** 고친 줄의 화면 찍기 — 다음 튜터 줄을 다 말한 뒤에(오늘의 학습 "화면 함께"). */
  const sceneShotRef = useRef<{ language: string; heard: string } | null>(null);
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
  /** Lines already asked about, so a second tap does not ask twice. */
  const translating = useRef(new Set<string>());
  // Names this conversation to the server, which charges by how long it has
  // been running (billing/config.ts). New on every scene, so a new scene is a
  // new five minutes rather than a continuation of the last one.
  const conversationId = useRef("");
  // Set when a turn could not be paid for. The scene ends on it rather than
  // going quiet, which is what a dropped turn looks like and is not this.
  // "daily" when a plan's free talk for today is what ran out (billing/plans.ts).
  const [outOfPoints, setOutOfPoints] = useState<false | "points" | "daily">(false);
  // Bumped per session, so a fold that comes back after the scene changed is
  // dropped rather than applied to the wrong conversation.
  const sessionRef = useRef(0);

  const bank = scenario ? sentencesFor(scenario.language) : {};

  // Which saved conversation this is, kept so that every write replaces the
  // same row instead of leaving a trail of one row per turn.
  const savedId = useRef("");
  const startedAt = useRef(0);

  useEffect(() => {
    if (!scenario) return;
    let cancelled = false;
    // 아이폰은 마이크 권한부터(처음 한 번, listen.ts primeMicrophone) — 그다음 첫마디.
    void primeMicrophone().then(() => {
    if (cancelled) return;
    // Carrying one on, or starting one. A resumed conversation comes back
    // where it can be spoken to: the queue and the turn in flight are the
    // middle of a moment that did not survive the screen going away.
    const carrying = resume && resume.scenarioId === scenarioId ? resume : null;
    // A resumed conversation is brought up to its own transcript first: a line
    // is written down when it starts being said and the state moves past it
    // only when the audio ends, so a scene closed on its greeting comes back
    // about to say it again, on top of a transcript that already has it
    // (saved.ts).
    const picked = carrying ? resumeFrom(carrying, scenario, bank, Date.now()) : null;
    const fresh = picked ? picked.state : startSession(scenario);
    setState(fresh);
    setInstruction(currentInstruction(scenario, bank, fresh));
    setSaid(picked ? picked.said : []);
    setMemory(carrying ? carrying.memory : EMPTY_MEMORY);
    savedId.current =
      carrying?.id ??
      globalThis.crypto?.randomUUID?.() ??
      `${Date.now()}-${Math.random()}`;
    startedAt.current = carrying?.startedAt ?? Date.now();
    setReviewing(null);
    setOutOfPoints(false);
    translating.current = new Set();
    conversationId.current =
      globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
    folding.current = false;
    sessionRef.current += 1;
    });
    return () => {
      cancelled = true;
    };
    // The bank is derived from the scenario, so it moves with it. `resume` is
    // read once, on the way in: the caller hands back every row this saves, and
    // reacting to that would restart the conversation on its own first turn.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenarioId]);

  /**
   * Write the conversation down as it happens.
   *
   * Not on the way out. A scene can end because the microphone was refused, or
   * because the app was killed while the phone rang, and neither of those calls
   * anything on the way out — the version worth keeping is the one from the
   * last thing that was said.
   */
  useEffect(() => {
    if (!scenario || !state || !onSaved || !savedId.current) return;
    if (said.length === 0) return;
    const now = Date.now();
    onSaved({
      id: savedId.current,
      scenarioId: scenario.id,
      language: scenario.language,
      title: titleFor(said, scenario.title),
      startedAt: startedAt.current || now,
      updatedAt: now,
      ...(state.finished ? { finishedAt: now } : {}),
      state,
      said,
      memory,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [said, state, memory]);

  // 통화가 끝까지 끝났을 때 한 번: 무료 사용자에게 전면 광고를 띄울 수 있는
  // 자연스러운 끝(lib/ads.ts). 작별 인사가 끝난 뒤로 조금 미룬다. 중간에 끊고 나간 통화에는 띄우지 않는다.
  const adShownForCall = useRef(false);
  useEffect(() => {
    if (!scenario) return;
    if (!(state?.finished || instruction?.do === "finish")) {
      adShownForCall.current = false; // 새 통화
      return;
    }
    if (adShownForCall.current) return;
    adShownForCall.current = true;
    window.setTimeout(() => void maybeShowInterstitial("callEnd"), 1500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state?.finished, instruction?.do]);

  /** Play the current line, then hand control back to the state machine. */
  useEffect(() => {
    if (!scenario || !state || instruction?.do !== "say") return;
    /**
     * The gloss that ships with a recorded line, if it is any use to this
     * learner.
     *
     * Every gloss written into the bank is Korean, which is free and checked
     * and worth keeping for the people who read Korean. Anyone else was being
     * shown it anyway: a French speaker learning Japanese got the Japanese
     * greeting with a Korean line underneath. Dropping it is the whole fix,
     * because a line with no gloss is asked about as soon as it has been said
     * and comes back in the language they actually speak.
     */
    const gloss =
      nativeLanguage === BANK_GLOSS_LANGUAGE ? instruction.translation : undefined;
    setSaid((current) => [
      ...current,
      {
        who: "tutor",
        text: instruction.text,
        translation: gloss,
        ...(instruction.tip ? { tip: instruction.tip } : {}),
        ...(rephrasingRef.current ? { again: true } : {}),
      },
    ]);
    // Nothing waits on this: it is the next line being fetched behind this one.
    warmNextLine(scenario, state);
    return playTutorLine({
      text: instruction.text,
      audioPath: instruction.audioPath,
      language: scenario.language,
      voice: instruction.voice,
      onAudio: (audio) => {
        audioRef.current = audio;
      },
      onDone: () => {
        // Now that it has been said, ask what it meant.
        //
        // The gloss was taken out of the director's answer because it was half of
        // what came back and none of it was ever spoken, so the sound could not
        // start until words nobody had asked to read had finished being written.
        // Fetching it here costs that nothing: the line has already been said —
        // about three per cent of what a minute costs, which is not a reason
        // to make somebody press something to find out what they just heard.
        if (!gloss) translateLine(instruction.text);
        // 고친 줄의 화면은 튜터 말이 끝난 뒤에 찍는다(찍는 동안 화면이 멈춰 소리가 밀림).
        const shot = sceneShotRef.current;
        sceneShotRef.current = null;
        if (shot) captureSceneSoon(shot.language, shot.heard);
        const moved = afterSaying(scenario, bank, state, Date.now());
        setState(moved.state);
        setInstruction(moved.instruction);
      },
    });
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
        ...(tutorIsBilingual(scenario.language, nativeLanguage) ? { bilingual: true } : {}),
        ...(scenario.openEnded ? { tutorGender } : {}),
      },
      nativeLanguage,
      isPremium,
      practice: practice?.goal ?? null,
      sessionId: conversationId.current,
      signals: state.pending
        ? { hesitationMs: state.pending.hesitationMs, attempts: state.pending.attempts }
        : undefined,
      // Named before the rest of the answer exists, so the audio is on its way
      // while the note and the rewrite are still being written (listen.ts).
      onLead: (id) => {
        const text = bank[id]?.text;
        if (text) warmLine(scenario, bank, text);
      },
    }).then((answer) => {
      if (cancelled) return;
      setDirecting(false);
      // Out of points is not a failed turn: the scene closes and says so,
      // instead of standing there not answering.
      if (isOutOfPoints(answer)) {
        setOutOfPoints(answer.daily ? "daily" : "points");
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
      // 못 알아들었어요로 부른 차례: 학습자 줄이 없으니 고친 말·막힘 표시를 붙이지 않는다.
      const missedTurn = Boolean(instruction.request.missed);
      const better = missedTurn ? "" : (direction?.better ?? "");
      const meant = missedTurn ? "" : (direction?.meant ?? "");
      const about = !missedTurn && direction && direction.assessment !== "stuck" ? direction.note : "";
      // 고쳐 준 줄은 이 기기에 그 순간 화면을 찍어 둔다(오늘의 학습 "화면 함께", lib/notes/sceneShots.ts).
      if ((better || meant) && instruction.request.heard) sceneShotRef.current = { language: scenario.language, heard: instruction.request.heard };
      if (better || meant || about) {
        setSaid((current) =>
          markAboutTheirLine(current, {
            ...(better ? { better } : {}),
            ...(meant ? { meant } : {}),
            ...(about ? { about } : {}),
          }),
        );
      }
      if (direction?.assessment === "stuck" && !missedTurn) {
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
      setSaid((current) => [...current, { who: "learner", text: heard || "…", ...(heardUnsure(heard) ? { unsure: true } : {}) }]);
      if (heard) refreshLedgerSoon(scenario.language, 6000);
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
      releaseRestRef.current();
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
  /**
   * Fetch the gloss of a line the character wrote, because they asked for it.
   *
   * Written lines come back without one so that the sound can start as soon as
   * the words exist. Most are never asked about — the learner is listening, not
   * reading — and the ones that are cost a small call at the moment of asking
   * rather than a wait on every turn.
   */
  const translateLine = useCallback(
    (text: string) => {
      if (!scenario || translating.current.has(text)) return;
      // A scene that already speaks their language has nothing to say twice.
      if (scenario.language === nativeLanguage) return;
      translating.current.add(text);
      void translateUtterance({
        text,
        locale: nativeLanguage,
        interfaceLanguage: nativeLanguage,
        targetLanguage: scenario.language,
        sourceType: "conversation",
      })
        .then((translated) => {
          if (!translated) return;
          setSaid((current) => withTranslation(current, text, translated));
        })
        .catch(() => {
          // Nothing to show and nothing to say about it: the line is still
          // there to tap again.
          translating.current.delete(text);
        });
    },
    [scenario, nativeLanguage],
  );

  // With translations on show, a line the character wrote just now is
  // translated as it appears — after it is said, so the voice never waits.
  useEffect(() => {
    if (!showTranslations) return;
    for (const line of said) {
      if (line.who === "tutor" && !line.translation && line.text.trim()) translateLine(line.text);
    }
  }, [showTranslations, said, translateLine]);

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

  /**
   * 💡 힌트 — 막힌 그 자리에서 대화를 멈추고(마이크 닫음), 하려던 말을 짐작한 문장을 보여 준다.
   * 닫으면 같은 턴으로 돌아가 처음부터 다시 말한다(사용자 2026-10-30 "막힐 시 버튼 → 일시정지 → 확인 → 재개").
   * 끊긴 앞부분(pending)은 보내지 않고 힌트의 재료로만 쓴다.
   */
  const openHelp = useCallback(() => {
    if (!state) return;
    const started = pending.trim();
    const asked = [...state.history].reverse().find((line) => line.who === "tutor")?.text ?? "";
    openReview({
      asked,
      heard: started,
      attempts: Math.max(1, state.attempts + 1),
      hesitationMs: state.listeningSince ? Math.max(0, Date.now() - state.listeningSince) : 0,
      history: [...state.history, ...(started ? [{ who: "learner" as const, text: started }] : [])].slice(-REVIEW_LINES),
      live: true,
    });
  }, [state, pending, openReview]);

  /**
   * 🙉 못 알아들었어요(2026-11-01) — 실제 통화처럼 "다시 말해 줄래?". 마이크를 닫고 그 튜터 줄에 표시를 남긴 뒤
   * 감독에게 같은 말을 더 쉽게 다시 해 달라고 한다(session.missedLine → 감독 한 차례, 통화 시간 안).
   * 쉽게 다시 한 줄을 또 못 알아들으면 감독을 부르지 않고 그 줄을 뜻과 함께 자막으로 보여 주고 내 차례로 돌아온다.
   */
  const missLine = useCallback(() => {
    if (!scenario || !state || instruction?.do !== "listen" || reviewing) return;
    const tutorAt = said.map((line) => line.who).lastIndexOf("tutor");
    if (tutorAt < 0) return;
    recorderRef.current?.cancel();
    recorderRef.current = null;
    releaseRestRef.current();
    setRecording(false);
    setLearnerTalking(false);
    setPending("");
    setSaid((current) => markMissed(current, tutorAt));
    if (said[tutorAt]!.again) {
      setForcedCaption(tutorAt);
      if (!said[tutorAt]!.translation) translateLine(said[tutorAt]!.text);
      const back = resumeListening(scenario, bank, state, Date.now());
      setState(back.state);
      setInstruction(back.instruction);
      return;
    }
    const asking = missedLine(scenario, bank, state);
    rephrasingRef.current = true;
    setState(asking.state);
    setInstruction(asking.instruction);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenario, state, instruction, reviewing, said, translateLine]);

  const closeReview = useCallback(() => {
    // 통화 중 힌트로 받은 문장은 그 질문(튜터 줄) 아래 도움말로 남긴다 — 끝난 뒤 돌아보기에서도 보이게.
    const hinted = reviewing?.turn.live && reviewing.review?.say ? reviewing.review : null;
    if (hinted) {
      const tip = hinted.meaning ? `${hinted.say} — ${hinted.meaning}` : hinted.say;
      setSaid((current) => tipOnLastTutorLine(current, tip));
    }
    setReviewing(null);
    if (!scenario || !state) return;
    const resumed = resumeListening(scenario, bank, state, Date.now());
    setState(resumed.state);
    setInstruction(resumed.instruction);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenario, state, reviewing]);

  const startRecording = async () => {
    if (recording || recorderRef.current || !scenario) return;
    try {
      recorderRef.current = await listenForTurn({
        language: scenario.language,
        isPremium,
        onSpeaking: (yes) => {
          if (yes) setLearnerTalking(true);
        },
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
    let heard = await recorder.stop();
    setThinking(false);
    setLearnerTalking(false);
    let lastEnd = endedAt;

    // Cut off mid-sentence by the pause that ends a turn: "…coffee and". Give
    // them the rest of it before anyone answers, at most twice, and show what
    // has been heard so far so they can see the turn is still theirs.
    for (let more = 0; more < 2 && soundsUnfinished(heard, scenario?.language ?? "en"); more += 1) {
      setPending(heard);
      const rest = await listenForRest();
      if (rest === null) {
        // Closed or put down while waiting: this turn is no longer being sent.
        setPending("");
        setLearnerTalking(false);
        return;
      }
      if (!rest.text) break;
      heard = `${heard} ${rest.text}`.trim();
      lastEnd = rest.endedAt;
    }
    setPending("");
    await answer(heard, lastEnd, speechStartedAt);
  };

  /**
   * The rest of a sentence the pause cut off. Its own short wait for a first
   * word, so a turn that really was over goes after a moment, not after the
   * twelve seconds a fresh turn allows. Empty text when nothing more was said;
   * null when the microphone was taken away (review, close) meanwhile.
   */
  const listenForRest = async (): Promise<{ text: string; endedAt: number } | null> => {
    if (!scenario) return { text: "", endedAt: Date.now() };
    let settle: () => void = () => undefined;
    const settledOnce = new Promise<void>((resolve) => {
      settle = resolve;
    });
    releaseRestRef.current = () => settle();
    let more: Awaited<ReturnType<typeof listenForTurn>>;
    try {
      more = await listenForTurn({
        language: scenario.language,
        isPremium,
        noSpeechMs: REST_OF_SENTENCE_MS,
        onSpeaking: (yes) => {
          if (yes) setLearnerTalking(true);
        },
        onSettled: () => settle(),
      });
    } catch {
      return { text: "", endedAt: Date.now() };
    }
    recorderRef.current = more;
    setRecording(true);
    await settledOnce;
    if (recorderRef.current !== more) return null;
    recorderRef.current = null;
    setRecording(false);
    const endedAt = Date.now();
    if (more.speechStartedAt() === null) {
      // Nothing was said: no recording worth paying to transcribe.
      more.cancel();
      return { text: "", endedAt };
    }
    setThinking(true);
    const text = await more.stop();
    setThinking(false);
    setLearnerTalking(false);
    return { text, endedAt };
  };

  /**
   * The microphone opens with the turn rather than with a button.
   *
   * Holding a button down to speak is the one thing on this screen a
   * conversation never asks of anyone, and it was the last obviously mechanical
   * step left in a mode meant to read as a conversation that carries on. The
   * turn is still one transcription, so this costs nothing.
   */
  // 다시 말해 준 줄(들)이 끝나고 내 차례가 오면 "다시 말하는 중"도 끝.
  useEffect(() => {
    if (instruction?.do === "listen") rephrasingRef.current = false;
  }, [instruction]);

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
      recorderRef.current = null;
      releaseRestRef.current();
      audioRef.current?.pause();
    };
  }, []);

  const callOver = Boolean(state?.finished || instruction?.do === "finish");
  const { recap, saved: recapSaved } = useCallRecap(callOver, scenario?.language ?? null, said, isPremium);
  // 통화가 끝난 때 — 끝난 화면 요약 한 줄의 통화 시간(이어서 한 통화는 처음 시작부터, 통화 기록과 같은 셈).
  const [overAt, setOverAt] = useState(0);
  if (callOver && !overAt) setOverAt(Date.now());
  if (!scenario) return null;

  // Lines open in the sentence sheet once the scene is over and the
  // microphone is shut for good; while it is going they stay as they are.
  const sceneOver = callOver;
  const analyzeLine = (text: string) =>
    analysis?.open({
      selectedText: text,
      contextSentence: text,
      sourceType: "conversation",
      language: scenario.language,
      intent: "sentence",
    });

  if (sceneOver) {
    // 끝난 뒤: 전체 대본(튜터 말·번역·내 말·고친 말)을 한눈에 + 통화 정리.
    return (
      <FullScreenLayer>
        {turnDiagnosticsEnabled() ? <TurnDiagBox /> : null}
        <CallHeader
          ui={ui}
          title={scenario.title}
          subtitle={timeLine ?? scenario.tutorRole}
          showTranslations={showTranslations}
          onToggleTranslations={toggleTranslations}
          onClose={onClose}
        />
        <CallSummary
          gender={tutorGender}
          ui={ui}
          language={scenario.language}
          seconds={Math.max(0, Math.round(((overAt || startedAt.current) - startedAt.current) / 1000))}
          tally={tallyCall(said)}
        />
      {practice ? (
        <div className="shrink-0 border-b border-white/10 px-3 py-2">
          <PracticeBanner
            ui={ui}
            request={practice}
            said={practiceSaid}
            targetLanguage={scenario.language}
            onStop={() => setPracticeStopped(true)}
          />
        </div>
      ) : null}
      <CallPages ui={ui}>
        {said.map((line, index) => {
          const view = learnerLineView(said, index, { showAll: true, over: true });
          if (view === "hidden") return null;
          if (view === "waiting") return <LearnerComposing key={index} />;
          return (
          <RoleplayLine
            key={index}
            line={line}
            ui={ui}
            face={line.who === "learner" ? <MeFace /> : <TutorFace />}
            flat
            onReview={openReview}
            onTranslate={translateLine}
            showTranslation={showTranslations}
            ledgerLanguage={scenario.language}
            onLooked={() =>
              setSaid((current) => current.map((one, at) => (at === index ? { ...one, looked: true } : one)))
            }
            onAnalyze={analyzeLine}
            onSayAgain={(target) => sayLine(target, { targetLanguage: scenario.language, nativeLanguage, isPremium })}
          />
          );
        })}
        {recap.length ? (
          <li>
            <CallRecap
              ui={ui}
              language={scenario.language}
              locale={nativeLanguage}
              items={recap}
              saved={recapSaved}
              onOpenFrame={(frame) => {
                handOffFrame({ language: scenario.language, stage: frame.stage, id: frame.id });
                onClose();
                sendAppIntent("openTab", { tab: "map" });
              }}
              onLeave={onClose}
            />
          </li>
        ) : null}
      </CallPages>
        <CallFooter ui={ui} instruction={instruction} outOfPoints={outOfPoints} onClose={onClose} />
      </FullScreenLayer>
    );
  }

  // 통화 중: 실제 통화처럼 — 얼굴·시간·누가 말하는지, 자막은 켰을 때만 한 줄.
  const lastTutorAt = said.map((line) => line.who).lastIndexOf("tutor");
  const lastTutor = lastTutorAt >= 0 ? said[lastTutorAt]! : null;
  const forced = lastTutorAt >= 0 && forcedCaption === lastTutorAt;
  const caption =
    lastTutor && (showCaptions || forced)
      ? { text: lastTutor.text, ...(forced && lastTutor.translation ? { meaning: lastTutor.translation } : {}) }
      : null;
  const speaker: CallSpeaker =
    instruction?.do === "say"
      ? "tutor"
      : learnerTalking || pending
        ? "learner"
        : directing || thinking
          ? "thinking"
          : recording
            ? "listening"
            : null;
  const canAnswer = instruction?.do === "listen" && !reviewing && !thinking;

  return (
    <FullScreenLayer>
      {turnDiagnosticsEnabled() ? <TurnDiagBox /> : null}
      {practice ? (
        <div className="shrink-0 border-b border-white/10 px-3 py-2">
          <PracticeBanner
            ui={ui}
            request={practice}
            said={practiceSaid}
            targetLanguage={scenario.language}
            onStop={() => setPracticeStopped(true)}
          />
        </div>
      ) : null}
      <CallStage
        gender={tutorGender}
        language={scenario.language}
        speaker={speaker}
        timeLeft={timeLine}
        caption={caption}
        goal={instruction?.do === "listen" && instruction.goal ? instruction.goal : undefined}
      />
      <CallControls
        ui={ui}
        canAnswer={canAnswer}
        captions={showCaptions}
        onMissed={missLine}
        onToggleCaptions={toggleCaptions}
        onHint={openHelp}
        onEnd={onClose}
      />

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
