import { apiUrl } from "@/lib/apiBase";
import { entitlementHeaders } from "@/lib/billing/billingService";
import { createCallLineReader, type CallLine } from "@/lib/callLines";
import {
  learningLanguageName,
  type LearningLanguageCode,
} from "@/lib/learningLanguages";

export type { CallLine };

export type RealtimeCall = {
  setMuted: (muted: boolean) => void;
  hangUp: () => void;
  /** Hand the tutor a line the learner typed. False if the channel is not open. */
  sendText: (text: string) => boolean;
};

export class RealtimeCallError extends Error {
  readonly code: "mic" | "connect" | "trial";

  constructor(code: "mic" | "connect" | "trial", message: string) {
    super(message);
    this.code = code;
    this.name = "RealtimeCallError";
  }
}

const SDP_CR = String.fromCharCode(13);
const SDP_LF = String.fromCharCode(10);
const SDP_EOL = SDP_CR + SDP_LF;

/**
 * Restore the answer's CRLF endings. On Android the CapacitorHttp bridge hands
 * the body back with bare newlines, and WebRTC rejects the whole description on
 * the first line it cannot parse.
 */
function normalizeAnswerSdp(raw: string): string {
  const lines = raw
    .split(SDP_LF)
    .map((line) => (line.endsWith(SDP_CR) ? line.slice(0, -1) : line));
  while (lines.length > 0 && lines[lines.length - 1]!.trim() === "") {
    lines.pop();
  }
  return lines.length > 0 ? lines.join(SDP_EOL) + SDP_EOL : "";
}

function waitForIce(pc: RTCPeerConnection, timeoutMs = 2500): Promise<void> {
  if (pc.iceGatheringState === "complete") return Promise.resolve();
  return new Promise((resolve) => {
    const finish = () => {
      pc.removeEventListener("icegatheringstatechange", onChange);
      window.clearTimeout(timer);
      resolve();
    };
    const onChange = () => {
      if (pc.iceGatheringState === "complete") finish();
    };
    const timer = window.setTimeout(finish, timeoutMs);
    pc.addEventListener("icegatheringstatechange", onChange);
  });
}

export async function startRealtimeCall(input: {
  targetLanguage: LearningLanguageCode;
  /** What the learner speaks natively, so the call expects it mid-sentence. */
  nativeLanguage: LearningLanguageCode;
  signal?: AbortSignal;
  /** Decides whether this call spends one of the free trial calls. */
  isPremium?: boolean;
  onConnected: () => void;
  onDisconnected: () => void;
  /** Fires once per finished turn, tutor's and learner's alike. */
  onLine?: (line: CallLine) => void;
}): Promise<RealtimeCall> {
  if (!navigator.mediaDevices?.getUserMedia) {
    throw new RealtimeCallError("mic", "getUserMedia unavailable");
  }

  let pc: RTCPeerConnection | null = null;
  let mic: MediaStream | null = null;
  let remoteAudio: HTMLAudioElement | null = null;
    let dataChannel: RTCDataChannel | null = null;
    let closed = false;
    let notifiedConnected = false;

    const notifyConnected = () => {
      if (closed || notifiedConnected) return;
      notifiedConnected = true;
      input.onConnected();
    };

  const cleanup = () => {
    if (closed) return;
    closed = true;
    try {
      dataChannel?.close();
    } catch {
      /* ignore */
    }
    dataChannel = null;
    for (const track of mic?.getTracks() ?? []) {
      track.stop();
    }
    mic = null;
    if (pc) {
      for (const sender of pc.getSenders()) {
        try {
          sender.track?.stop();
        } catch {
          /* ignore */
        }
      }
      pc.close();
      pc = null;
    }
    if (remoteAudio) {
      remoteAudio.srcObject = null;
      remoteAudio.remove();
      remoteAudio = null;
    }
  };

  const throwIfAborted = () => {
    if (input.signal?.aborted) {
      cleanup();
      throw new DOMException("Aborted", "AbortError");
    }
  };

  try {
    mic = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
    });
    throwIfAborted();

    pc = new RTCPeerConnection();
    remoteAudio = document.createElement("audio");
    remoteAudio.autoplay = true;
    remoteAudio.setAttribute("playsinline", "true");
    document.body.appendChild(remoteAudio);

    pc.ontrack = (event) => {
      if (remoteAudio && event.streams[0]) {
        remoteAudio.srcObject = event.streams[0];
        void remoteAudio.play().catch(() => undefined);
      }
    };

    const micTrack = mic.getAudioTracks()[0];
    if (micTrack) pc.addTrack(micTrack, mic);

    dataChannel = pc.createDataChannel("oai-events");
    dataChannel.addEventListener("open", () => {
      if (closed || dataChannel?.readyState !== "open") return;
      dataChannel.send(
        JSON.stringify({
          type: "response.create",
          response: {
            // In English this opened the call in English and, told not to mix
            // languages, it never came back out of it.
            instructions: `The call just connected. Greet them in ${learningLanguageName(
              input.targetLanguage,
            )} in one short spoken line, as if you picked up the phone. Speak only ${learningLanguageName(
              input.targetLanguage,
            )}.`,
          },
        }),
      );
    });

    // One reader per call, so the numbering starts at 1 with the call.
    const lineReader = createCallLineReader();

    dataChannel.addEventListener("message", (event) => {
      if (closed || !input.onLine) return;
      const line = lineReader.read(event.data);
      if (line) input.onLine(line);
    });

    pc.onconnectionstatechange = () => {
      const state = pc?.connectionState;
      if (state === "connected") {
        notifyConnected();
      }
      if (state === "failed" || state === "closed") {
        const alreadyClosed = closed;
        cleanup();
        if (!alreadyClosed) input.onDisconnected();
      }
    };

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    await waitForIce(pc);
    throwIfAborted();

    const response = await fetch(apiUrl("/api/realtime/call"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Without these the server cannot tell a subscriber from a trial user,
        // and would spend a free call on someone who has paid.
        ...entitlementHeaders(input.isPremium),
      },
      body: JSON.stringify({
        sdp: pc.localDescription?.sdp ?? offer.sdp,
        targetLanguage: input.targetLanguage,
        interfaceLanguage: input.nativeLanguage,
      }),
      signal: input.signal,
    });
    const rawAnswer = await response.text();
    if (response.status === 403 && rawAnswer.includes("CALL_TRIAL_USED")) {
      throw new RealtimeCallError("trial", "CALL_TRIAL_USED");
    }
    const answerSdp = normalizeAnswerSdp(rawAnswer);
    if (!response.ok || !answerSdp.includes("v=")) {
      throw new RealtimeCallError("connect", "REALTIME_FAILED");
    }
    throwIfAborted();
    await pc.setRemoteDescription({ type: "answer", sdp: answerSdp });
    notifyConnected();
  } catch (error) {
    cleanup();
    if (error instanceof DOMException && error.name === "AbortError") {
      throw error;
    }
    if (error instanceof RealtimeCallError) throw error;
    if (
      error instanceof DOMException &&
      (error.name === "NotAllowedError" || error.name === "NotFoundError")
    ) {
      throw new RealtimeCallError("mic", error.name);
    }
    throw new RealtimeCallError("connect", "REALTIME_FAILED");
  }

  return {
    setMuted(muted) {
      for (const track of mic?.getAudioTracks() ?? []) {
        track.enabled = !muted;
      }
    },
    hangUp() {
      cleanup();
    },
    sendText(text) {
      const line = text.trim();
      if (!line || dataChannel?.readyState !== "open") return false;
      // The learner is looking at the same screen; what they type is part of
      // the same conversation, so it goes to the tutor as their own turn.
      dataChannel.send(
        JSON.stringify({
          type: "conversation.item.create",
          item: {
            type: "message",
            role: "user",
            content: [{ type: "input_text", text: line }],
          },
        }),
      );
      dataChannel.send(JSON.stringify({ type: "response.create" }));
      return true;
    },
  };
}
