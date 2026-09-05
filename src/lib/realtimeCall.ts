import { apiUrl } from "@/lib/apiBase";
import { entitlementHeaders } from "@/lib/billing/billingService";
import {
  CALL_BLOCK_CLIENT_HEADER,
  CALL_BLOCK_SECONDS_HEADER,
  CALL_HOLD_HEADER,
} from "@/lib/billing/config";
import {
  createCallLineReader,
  pointedLineNote,
  type CallLine,
} from "@/lib/callLines";
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
  /**
   * Put a transcript line in front of the tutor without asking for an answer,
   * so a question spoken straight afterwards has something to refer to.
   * False if the channel is not open.
   */
  pointAtLine: (text: string) => boolean;
  /**
   * The points hold this call was opened against, or null when nothing was
   * charged. Handed back when the call ends so the unused part is returned.
   */
  holdId: string | null;
  /**
   * How long the block bought, or null when the call is not on one. The app
   * hangs up at this mark: the server cannot end a call, so a build that asked
   * to be charged in blocks is the thing that has to honour them.
   */
  blockSeconds: number | null;
};

export class RealtimeCallError extends Error {
  readonly code: "mic" | "connect" | "trial" | "points";

  constructor(code: "mic" | "connect" | "trial" | "points", message: string) {
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

/**
 * Read one response header, tolerating a client that has none.
 *
 * On Android the request goes through the CapacitorHttp bridge rather than the
 * browser's own fetch, and a bridge that hands back a plain object instead of
 * Headers should cost the call its refund, not the call itself.
 */
function readHeader(response: Response, name: string): string | null {
  try {
    return response.headers?.get(name) ?? null;
  } catch {
    return null;
  }
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
  /**
   * What to say instead of picking up the phone.
   *
   * A call opened from a roleplay is not a call starting: the learner is
   * part-way through a scene the tutor has been silent for, and greeting them
   * would be answering a question nobody asked. `scene` is put into the
   * conversation first, with no response, so the tutor has somewhere to arrive;
   * `ask` is what it is then asked to do.
   */
  opening?: { scene: string; ask: string };
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
    // Filled from the answer's headers when the server charged for a block.
    let holdId: string | null = null;
    let blockSeconds: number | null = null;

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
      if (input.opening) {
        // The scene goes in without asking for an answer, so the tutor speaks
        // once — about the thing it was called for — rather than twice.
        addUserItem(input.opening.scene);
        dataChannel.send(
          JSON.stringify({
            type: "response.create",
            response: { instructions: input.opening.ask },
          }),
        );
        return;
      }
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
        // Says this build will hang up when its block runs out. The server
        // charges points only against that promise, because it cannot enforce
        // the block itself once the audio is running.
        [CALL_BLOCK_CLIENT_HEADER]: "1",
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
    if (response.status === 402) {
      throw new RealtimeCallError("points", "NO_POINTS");
    }
    const answerSdp = normalizeAnswerSdp(rawAnswer);
    if (!response.ok || !answerSdp.includes("v=")) {
      throw new RealtimeCallError("connect", "REALTIME_FAILED");
    }
    holdId = readHeader(response, CALL_HOLD_HEADER);
    const soldSeconds = Number(readHeader(response, CALL_BLOCK_SECONDS_HEADER));
    blockSeconds =
      Number.isFinite(soldSeconds) && soldSeconds > 0 ? soldSeconds : null;
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

  /** Append a turn from the learner. Says nothing about who answers next. */
  const addUserItem = (text: string) => {
    dataChannel?.send(
      JSON.stringify({
        type: "conversation.item.create",
        item: {
          type: "message",
          role: "user",
          content: [{ type: "input_text", text }],
        },
      }),
    );
  };

  return {
    holdId,
    blockSeconds,
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
      addUserItem(line);
      dataChannel.send(JSON.stringify({ type: "response.create" }));
      return true;
    },
    pointAtLine(text) {
      const note = pointedLineNote(text);
      if (!note || dataChannel?.readyState !== "open") return false;
      // Deliberately no `response.create`. Pointing is not a question, and a
      // tutor who answered the tap would be talking over a learner who is
      // still deciding what to ask. The note simply waits in the conversation
      // for whatever they say or type next.
      addUserItem(note);
      return true;
    },
  };
}
