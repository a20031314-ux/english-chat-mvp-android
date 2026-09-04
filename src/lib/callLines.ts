/**
 * Turning realtime events into the numbered lines the transcript shows.
 *
 * Kept apart from the WebRTC plumbing in `realtimeCall.ts` so it can be run
 * without a peer connection. What goes wrong here is not the socket: it is
 * which events count as a finished turn, what happens when one arrives twice,
 * and whether a number still means the line it meant a moment ago. None of
 * that needs a call to exercise, and all of it is invisible until a learner
 * is looking at a transcript that has quietly gone empty or renumbered itself.
 */

/**
 * One finished turn of a call, as text.
 *
 * A call leaves nothing behind to point at: a learner who missed something does
 * not know what they missed, so the question never gets asked. These are the
 * handles that make asking possible.
 *
 * `index` is assigned when the turn is finalized and never reassigned — the
 * number on screen has to still mean the same line a second later. Only
 * completed turns become lines; the streaming deltas are dropped, which is what
 * keeps the numbering still.
 */
export type CallLine = {
  /** Stable across repeats of the same event. */
  id: string;
  /** 1-based, in the order turns were finalized. */
  index: number;
  role: "tutor" | "learner";
  text: string;
  at: number;
};

/** The event carrying the learner's own turn, transcribed alongside the call. */
const LEARNER_TRANSCRIPT_DONE =
  "conversation.item.input_audio_transcription.completed";

/**
 * The tutor's transcript event has been spelled `response.audio_transcript.done`
 * and `response.output_audio_transcript.done` across realtime versions, so it is
 * matched on its tail. The next rename in that family lands here as a tutor line
 * instead of the transcript going quietly half-empty.
 */
const TUTOR_TRANSCRIPT_DONE_SUFFIX = "audio_transcript.done";

export type CallLineReader = {
  /**
   * Read one datachannel message. Returns the line it finished, or null for
   * everything else — deltas, other event types, malformed frames, and repeats
   * of a turn already counted.
   */
  read: (raw: unknown) => CallLine | null;
};

/**
 * A reader for one call. It holds the numbering, so a new call starts at 1.
 *
 * `now` is injectable only so tests can pin the timestamp; callers pass nothing.
 */
export function createCallLineReader(now: () => number = Date.now): CallLineReader {
  let lineCount = 0;
  const emitted = new Set<string>();

  const finish = (
    itemId: string | undefined,
    role: CallLine["role"],
    rawText: string,
  ): CallLine | null => {
    const text = rawText.trim();
    if (!text) return null;
    // The same completion can arrive twice; a repeat must not take a number.
    const id = `${role}:${itemId ?? text}`;
    if (emitted.has(id)) return null;
    emitted.add(id);
    lineCount += 1;
    return { id, index: lineCount, role, text, at: now() };
  };

  return {
    read(raw) {
      if (typeof raw !== "string") return null;
      let payload: { type?: unknown; item_id?: unknown; transcript?: unknown };
      try {
        payload = JSON.parse(raw);
      } catch {
        return null;
      }
      if (typeof payload !== "object" || payload === null) return null;

      const type = typeof payload.type === "string" ? payload.type : "";
      const transcript =
        typeof payload.transcript === "string" ? payload.transcript : "";
      if (!type || !transcript) return null;
      const itemId =
        typeof payload.item_id === "string" ? payload.item_id : undefined;

      if (type === LEARNER_TRANSCRIPT_DONE) {
        return finish(itemId, "learner", transcript);
      }
      if (type.endsWith(TUTOR_TRANSCRIPT_DONE_SUFFIX)) {
        return finish(itemId, "tutor", transcript);
      }
      return null;
    },
  };
}
