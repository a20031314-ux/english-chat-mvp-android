import { apiUrl } from "@/lib/apiBase";
import { entitlementHeaders } from "@/lib/billing/billingService";
import {
  ROLEPLAY_POINTS_CLIENT_HEADER,
  ROLEPLAY_SESSION_HEADER,
} from "@/lib/billing/config";
import {
  HISTORY_LINES,
  type Direction,
  type DirectorRequest,
  type SpokenLine,
} from "@/lib/roleplay/director";
import {
  REVIEW_LINES,
  type Review,
  type StuckTurn,
} from "@/lib/roleplay/review";
import type { Practice } from "@/lib/roleplay/practice";

/**
 * Recording a learner's turn and getting it back as text.
 *
 * The roleplay's half of listening. It is deliberately not the realtime call:
 * a scripted turn does not need a live session held open, and holding one is
 * what a call costs even when nobody is speaking. Record, send, get words back,
 * and pay for the seconds that had speech in them.
 *
 * Reuses the transcription route the video pipeline already had, because it
 * already does exactly this — bytes in, text out — and a second one would have
 * been the same route with a different name.
 */

export type Recorder = {
  /** Resolve with what was heard, or an empty string if nothing usable was. */
  stop: () => Promise<string>;
  /** Give up without transcribing, for a turn the learner abandoned. */
  cancel: () => void;
  /**
   * When the learner's voice began, or null if none was ever detected.
   *
   * This, not the moment the turn was sent, is where their hesitation ends.
   * Since the turn started ending itself, "sent" means speaking plus the pause
   * that closes it — and measured that way every ordinary sentence read as a
   * struggle, pulling the level down until the matcher waved through anything
   * sharing a word with an answer.
   */
  speechStartedAt: () => number | null;
};

/** Below this, the recording is a click or a breath rather than an answer. */
const MIN_AUDIO_BYTES = 1200;

function preferredMimeType(): string {
  // Chrome and the Android WebView give webm/opus; Safari gives mp4. Asking for
  // something unsupported makes MediaRecorder throw rather than fall back.
  for (const type of ["audio/webm;codecs=opus", "audio/webm", "audio/mp4"]) {
    if (typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(type)) {
      return type;
    }
  }
  return "";
}

async function toBase64(blob: Blob): Promise<string> {
  const buffer = new Uint8Array(await blob.arrayBuffer());
  let binary = "";
  // Chunked, because spreading a whole recording into String.fromCharCode
  // overflows the argument limit on anything but the shortest turn.
  for (let i = 0; i < buffer.length; i += 8192) {
    binary += String.fromCharCode(...buffer.subarray(i, i + 8192));
  }
  return btoa(binary);
}

async function transcribe(
  blob: Blob,
  mimeType: string,
  language: string,
  isPremium: boolean,
): Promise<string> {
  const response = await fetch(apiUrl("/api/video-subtitles/transcribe-chunk"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...entitlementHeaders(isPremium),
    },
    body: JSON.stringify({
      audioBase64: await toBase64(blob),
      filename: mimeType.includes("mp4") ? "turn.mp4" : "turn.webm",
      mimeType: mimeType || "audio/webm",
      language,
    }),
  });
  if (!response.ok) {
    console.error("[roleplay] transcribe failed with", response.status);
    return "";
  }
  const body = (await response.json()) as {
    segments?: { text?: unknown }[];
    text?: unknown;
  };
  if (typeof body.text === "string" && body.text.trim()) return body.text.trim();
  return (body.segments ?? [])
    .map((segment) => (typeof segment.text === "string" ? segment.text : ""))
    .join(" ")
    .trim();
}

/**
 * Start recording the learner's turn.
 *
 * The microphone is opened per turn and closed again, rather than held for the
 * scenario. A scripted roleplay spends most of its time playing audio, and a
 * live microphone through all of it is a recording light on for no reason.
 */
/**
 * When a turn has started and when it has ended, worked out from the sound.
 *
 * The learner used to hold a button down while speaking, which is the one thing
 * on this screen that a conversation never asks of anybody. Listening for the
 * speech instead costs nothing — it is measured in the browser, and the turn
 * still leaves as a single transcription — and it removes the last obviously
 * mechanical step from a mode meant to read as a conversation that continues.
 *
 * A live session would also have removed the button, and would have cost about
 * fifty times as much: what is expensive about a call is the tutor generating
 * speech, not the microphone being open, so paying for one to avoid a button
 * would be buying the wrong thing.
 */

/** Loud enough to be someone talking rather than a room being a room. */
const SPEECH_RMS = 0.02;
/** Below this a burst is a cough, a chair, a door — not a turn. */
const MIN_SPEECH_MS = 300;
/**
 * How long a pause has to last before the turn counts as finished.
 *
 * Long enough to survive the gap between words and a moment of thinking
 * mid-sentence; short enough that finishing does not feel like waiting. People
 * pause longer in a language they are learning, which is why this is not the
 * 500ms a native-speaker VAD would use.
 */
const TRAILING_SILENCE_MS = 1400;
/** Nobody's single turn runs this long. A stuck detector should still send. */
const MAX_TURN_MS = 20000;
/** How long to wait for a first word before giving up and calling it silence. */
const NO_SPEECH_MS = 12000;

/**
 * One context for analysis, kept apart from the one the tutor's voice plays
 * through. Created on the first turn, which happens inside the tap that opened
 * the scenario — Safari will not run a context created outside a gesture.
 */
let analysisCtx: AudioContext | null = null;

function analysisContext(): AudioContext {
  if (!analysisCtx) analysisCtx = new AudioContext();
  void analysisCtx.resume().catch(() => undefined);
  return analysisCtx;
}

type VoiceWatch = { stop: () => void; speechStartedAt: () => number | null };

function watchForVoice(
  stream: MediaStream,
  on: { speaking: (yes: boolean) => void; settled: () => void },
): VoiceWatch {
  let source: MediaStreamAudioSourceNode;
  let analyser: AnalyserNode;
  try {
    const ctx = analysisContext();
    source = ctx.createMediaStreamSource(stream);
    analyser = ctx.createAnalyser();
    analyser.fftSize = 1024;
    source.connect(analyser);
  } catch {
    // No analysis available — the caller still has its own control, and a turn
    // that cannot be detected is better than a turn that cannot be spoken.
    return { stop: () => undefined, speechStartedAt: () => null };
  }

  const samples = new Float32Array(analyser.fftSize);
  const startedAt = Date.now();
  let speechSince: number | null = null;
  let silenceSince: number | null = null;
  let spoke = false;
  // The start of the burst that turned out to be speech, not the moment it was
  // confirmed as such: the learner began talking then.
  let firstSpeechAt: number | null = null;
  let done = false;

  const finish = () => {
    if (done) return;
    done = true;
    window.clearInterval(timer);
    try {
      source.disconnect();
    } catch {
      // Already gone with the stream.
    }
    on.settled();
  };

  const timer = window.setInterval(() => {
    analyser.getFloatTimeDomainData(samples);
    let sum = 0;
    for (const sample of samples) sum += sample * sample;
    const level = Math.sqrt(sum / samples.length);
    const now = Date.now();

    if (level >= SPEECH_RMS) {
      silenceSince = null;
      if (speechSince === null) speechSince = now;
      if (!spoke && now - speechSince >= MIN_SPEECH_MS) {
        spoke = true;
        firstSpeechAt = speechSince;
        on.speaking(true);
      }
    } else {
      speechSince = null;
      if (silenceSince === null) silenceSince = now;
      // Only a pause after real speech ends a turn. Silence before it just
      // means they have not started.
      if (spoke && now - silenceSince >= TRAILING_SILENCE_MS) {
        on.speaking(false);
        finish();
        return;
      }
    }

    if (spoke && now - startedAt >= MAX_TURN_MS) {
      on.speaking(false);
      finish();
      return;
    }
    if (!spoke && now - startedAt >= NO_SPEECH_MS) finish();
  }, 60);

  return {
    stop: () => {
      if (done) return;
      done = true;
      window.clearInterval(timer);
      try {
        source.disconnect();
      } catch {
        // Already gone with the stream.
      }
    },
    speechStartedAt: () => firstSpeechAt,
  };
}

export async function listenForTurn(input: {
  language: string;
  isPremium: boolean;
  /** Whether the learner is audibly speaking, so the screen can show it. */
  onSpeaking?: (speaking: boolean) => void;
  /** Their turn has plainly ended. The caller stops and sends. */
  onSettled?: () => void;
}): Promise<Recorder> {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
  });
  const mimeType = preferredMimeType();
  const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
  const chunks: Blob[] = [];
  recorder.addEventListener("dataavailable", (event) => {
    if (event.data.size > 0) chunks.push(event.data);
  });
  recorder.start();

  const watch = watchForVoice(stream, {
    speaking: (yes) => input.onSpeaking?.(yes),
    settled: () => input.onSettled?.(),
  });

  const release = () => {
    watch.stop();
    for (const track of stream.getTracks()) track.stop();
  };

  return {
    stop: () =>
      new Promise<string>((resolve) => {
        recorder.addEventListener(
          "stop",
          () => {
            release();
            const blob = new Blob(chunks, { type: mimeType || "audio/webm" });
            // Nothing worth sending: an empty answer reads as a miss, which is
            // what a turn nobody spoke in should be.
            if (blob.size < MIN_AUDIO_BYTES) {
              resolve("");
              return;
            }
            void transcribe(blob, mimeType, input.language, input.isPremium)
              .then(resolve)
              .catch(() => resolve(""));
          },
          { once: true },
        );
        if (recorder.state !== "inactive") recorder.stop();
        else release();
      }),
    cancel: () => {
      if (recorder.state !== "inactive") recorder.stop();
      release();
    },
    speechStartedAt: () => watch.speechStartedAt(),
  };
}

/**
 * Ask the director what the character says to a turn the script could not take.
 *
 * Null when it could not be reached or answered with nothing usable, so the
 * caller can fall back on the scene's recorded lines rather than showing a
 * failure the learner had nothing to do with.
 */
/**
 * A turn that could not be paid for, told apart from a turn that failed.
 *
 * They look the same over the wire and must not look the same on screen: a
 * failure is a dropped turn the learner should simply say again, and this is a
 * conversation that has to end. Returned rather than thrown so the caller
 * decides what the scene does about it.
 */
export type OutOfPoints = { outOfPoints: true };

export function isOutOfPoints(value: unknown): value is OutOfPoints {
  return typeof value === "object" && value !== null && "outOfPoints" in value;
}

export async function fetchDirection(input: {
  request: Omit<DirectorRequest, "targetLanguage" | "nativeLanguage">;
  nativeLanguage: string;
  isPremium: boolean;
  /** Names this conversation, so the server can keep its clock between turns. */
  sessionId: string;
}): Promise<Direction | OutOfPoints | null> {
  try {
    const response = await fetch(apiUrl("/api/roleplay/turn"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...entitlementHeaders(input.isPremium),
        // Says this build will show the learner what a refusal means, which is
        // what makes it safe for the server to refuse (billing/config.ts).
        [ROLEPLAY_POINTS_CLIENT_HEADER]: "1",
        [ROLEPLAY_SESSION_HEADER]: input.sessionId,
      },
      body: JSON.stringify({
        ...input.request,
        // The caller has already cut this to the lines the notes do not cover;
        // the ceiling is for when the notes have fallen behind.
        history: input.request.history.slice(-HISTORY_LINES),
        context: input.request.context ?? "",
        nativeLanguage: input.nativeLanguage,
      }),
    });
    if (response.status === 402) return { outOfPoints: true };
    if (!response.ok) {
      console.error("[roleplay] direction failed with", response.status);
      return null;
    }
    const body = (await response.json()) as Partial<Direction>;
    // The server already held the answer to the scene; this only makes sure
    // it has the shape the session expects before it is acted on.
    if (!body.say || !body.next || !body.assessment) return null;
    return {
      assessment: body.assessment,
      say: body.say,
      note: typeof body.note === "string" ? body.note : "",
      next: body.next,
      ...(typeof body.follow === "string" ? { follow: body.follow } : {}),
    };
  } catch (error) {
    console.error("[roleplay] direction threw", error);
    return null;
  }
}

/**
 * Fold lines the tutor no longer reads verbatim into its notes.
 *
 * Fired beside the conversation, not in front of it: nothing waits on this,
 * and null just means the notes stay as they were and the fold is tried again
 * on a later turn.
 */
export async function fetchContext(input: {
  scenarioId: string;
  previous: string;
  lines: SpokenLine[];
  isPremium: boolean;
}): Promise<string | null> {
  try {
    const response = await fetch(apiUrl("/api/roleplay/context"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...entitlementHeaders(input.isPremium),
      },
      body: JSON.stringify({
        scenarioId: input.scenarioId,
        previous: input.previous,
        lines: input.lines,
      }),
    });
    if (!response.ok) {
      console.error("[roleplay] context failed with", response.status);
      return null;
    }
    const body = (await response.json()) as { notes?: unknown };
    return typeof body.notes === "string" && body.notes.trim() ? body.notes.trim() : null;
  } catch (error) {
    console.error("[roleplay] context threw", error);
    return null;
  }
}

/**
 * Look back at a turn the learner got stuck on, because they asked to.
 *
 * Nothing in the scene waits on this — the conversation already carried on
 * without it — so a failure is simply nothing to show, and the button stays
 * where it was for them to try again.
 */
export async function fetchReview(input: {
  scenarioId: string;
  turn: StuckTurn;
  nativeLanguage: string;
  isPremium: boolean;
}): Promise<Review | null> {
  try {
    const response = await fetch(apiUrl("/api/roleplay/review"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...entitlementHeaders(input.isPremium),
      },
      body: JSON.stringify({
        scenarioId: input.scenarioId,
        asked: input.turn.asked,
        heard: input.turn.heard,
        attempts: input.turn.attempts,
        hesitationMs: input.turn.hesitationMs,
        history: input.turn.history.slice(-REVIEW_LINES),
        nativeLanguage: input.nativeLanguage,
      }),
    });
    if (!response.ok) {
      console.error("[roleplay] review failed with", response.status);
      return null;
    }
    const body = (await response.json()) as { why?: unknown };
    return typeof body.why === "string" && body.why.trim() ? (body as Review) : null;
  } catch (error) {
    console.error("[roleplay] review threw", error);
    return null;
  }
}

/**
 * Listen once and hand back the words, for a line said outside the scene.
 *
 * The scene's own microphone is closed while a review is open, on purpose —
 * reading is not answering, and whatever the room says while they read must not
 * be sent as their next turn. Saying a line back needs a microphone of its own,
 * opened and closed inside that moment, and this is it: one turn, one
 * transcript, nothing left running.
 */
export async function listenOnce(input: {
  language: string;
  isPremium: boolean;
  onSpeaking?: (speaking: boolean) => void;
}): Promise<{ heard: string; cancel: () => void }> {
  let settle: (() => void) | null = null;
  const settled = new Promise<void>((resolve) => {
    settle = resolve;
  });
  const recorder = await listenForTurn({
    language: input.language,
    isPremium: input.isPremium,
    onSpeaking: input.onSpeaking,
    onSettled: () => settle?.(),
  });
  let given = false;
  const cancel = () => {
    if (given) return;
    given = true;
    recorder.cancel();
    settle?.();
  };
  await settled;
  if (given) return { heard: "", cancel };
  given = true;
  return { heard: await recorder.stop(), cancel };
}

/**
 * Read one attempt at a line the review handed them.
 *
 * Null is nothing to show rather than a failure to report: the comparison the
 * learner can already see on screen stands on its own, and the sentence about
 * it is the part that did not arrive.
 */
export async function fetchPractice(input: {
  scenarioId: string;
  target: string;
  heard: string;
  nativeLanguage: string;
  isPremium: boolean;
}): Promise<Practice | null> {
  try {
    const response = await fetch(apiUrl("/api/roleplay/practice"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...entitlementHeaders(input.isPremium),
      },
      body: JSON.stringify({
        scenarioId: input.scenarioId,
        target: input.target,
        heard: input.heard,
        nativeLanguage: input.nativeLanguage,
      }),
    });
    if (!response.ok) {
      console.error("[roleplay] practice failed with", response.status);
      return null;
    }
    const body = (await response.json()) as { note?: unknown; good?: unknown };
    if (typeof body.note !== "string" || !body.note.trim()) return null;
    return { good: body.good === true, note: body.note.trim() };
  } catch (error) {
    console.error("[roleplay] practice threw", error);
    return null;
  }
}
