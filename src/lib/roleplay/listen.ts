import { apiUrl } from "@/lib/apiBase";
import { entitlementHeaders } from "@/lib/billing/billingService";

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
export async function listenForTurn(input: {
  language: string;
  isPremium: boolean;
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

  const release = () => {
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
  };
}

/**
 * Ask for a correction the scenario did not have written.
 *
 * The rung between a recorded line and a call: one sentence, made now because
 * nobody anticipated this particular miss. Null when it could not be made, so
 * the caller can offer a retry rather than showing a failure the learner had
 * nothing to do with.
 */
export async function fetchCorrection(input: {
  context: { setting: string; tutorRole: string; goal: string; heard: string };
  targetLanguage: string;
  nativeLanguage: string;
  isPremium: boolean;
}): Promise<{ text: string; translation: string } | null> {
  try {
    const response = await fetch(apiUrl("/api/roleplay/correct"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...entitlementHeaders(input.isPremium),
      },
      body: JSON.stringify({
        ...input.context,
        targetLanguage: input.targetLanguage,
        interfaceLanguage: input.nativeLanguage,
      }),
    });
    if (!response.ok) {
      console.error("[roleplay] correction failed with", response.status);
      return null;
    }
    const body = (await response.json()) as {
      text?: unknown;
      translation?: unknown;
    };
    if (typeof body.text !== "string" || !body.text.trim()) return null;
    return {
      text: body.text.trim(),
      translation:
        typeof body.translation === "string" ? body.translation.trim() : "",
    };
  } catch (error) {
    console.error("[roleplay] correction threw", error);
    return null;
  }
}
