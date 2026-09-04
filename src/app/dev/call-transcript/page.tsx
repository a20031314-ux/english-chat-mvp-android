"use client";

/**
 * A look at the call transcript without placing a call.
 *
 * The transcript only exists during and after a realtime call, which costs
 * credits and needs a microphone, so the one thing nobody could easily do was
 * look at it. This page renders the real `CallTranscript` — real styles, real
 * tap-to-ask behaviour — over lines built by the real `createCallLineReader`
 * from the event frames the realtime API actually sends. Only the socket and
 * the tutor are fake.
 *
 * Dev-only: reachable at /dev/call-transcript in `next dev`. It is not linked
 * from anywhere in the app, and it stays out of the APK because
 * `scripts/build-capacitor.mjs` moves this whole folder aside for the static
 * export — a static export would otherwise take every page it found, this one
 * included.
 */

import { useMemo, useState } from "react";
import { CallTranscript } from "@/components/CallTranscript";
import { CallContext, type CallContextValue } from "@/contexts/CallContext";
import type { CallPhase } from "@/lib/callSession";
import { copy } from "@/lib/copy";
import {
  askAboutLineText,
  createCallLineReader,
  pointedLineNote,
  type CallLine,
} from "@/lib/callLines";

/** Frames in the shape the realtime datachannel delivers them. */
const TRANSCRIPT_FRAMES = [
  { type: "response.output_audio_transcript.done", item_id: "t1", transcript: "Hey! How's your day going so far?" },
  { type: "conversation.item.input_audio_transcription.completed", item_id: "l1", transcript: "It was pretty busy. I had three meetings back to back." },
  { type: "response.output_audio_transcript.delta", item_id: "t2", transcript: "Oh" },
  { type: "response.output_audio_transcript.done", item_id: "t2", transcript: "Oh, back to back meetings are rough. Did you get a chance to eat lunch?" },
  { type: "conversation.item.input_audio_transcription.completed", item_id: "l2", transcript: "I ate a sandwich very fast between the meeting." },
  { type: "response.output_audio_transcript.done", item_id: "t3", transcript: "Between meetings — you'd want the plural there. And \"wolfed down a sandwich\" is what people usually say when they eat that fast." },
  // A repeat of t3, as the API sometimes sends. It must not take a fourth number.
  { type: "response.output_audio_transcript.done", item_id: "t3", transcript: "Between meetings — you'd want the plural there. And \"wolfed down a sandwich\" is what people usually say when they eat that fast." },
  { type: "conversation.item.input_audio_transcription.completed", item_id: "l3", transcript: "Ah okay. Wolfed down. I will remember that one." },
] as const;

function buildLines(): CallLine[] {
  const reader = createCallLineReader();
  const lines: CallLine[] = [];
  for (const frame of TRANSCRIPT_FRAMES) {
    const line = reader.read(JSON.stringify(frame));
    if (line) lines.push(line);
  }
  return lines;
}

export default function CallTranscriptPreview() {
  const allLines = useMemo(() => buildLines(), []);
  const [shown, setShown] = useState(allLines.length);
  const [sent, setSent] = useState<string[]>([]);
  // Ending a call is what folds the transcript down, so the preview has to be
  // able to end one.
  const [phase, setPhase] = useState<CallPhase>("connected");

  const value: CallContextValue = useMemo(
    () => ({
      phase,
      muted: false,
      startedAt: null,
      start: async () => ({ ok: true }),
      hangUp: () => {},
      stop: () => {},
      toggleMuted: () => {},
      sendText: () => true,
      // The tap's own message, the one that makes a spoken question work.
      pointAtLine: (line) => {
        const note = pointedLineNote(line.text);
        if (note) setSent((current) => [...current, note]);
        return note !== null;
      },
      lines: allLines.slice(0, shown),
      // Show what the tutor would receive instead of sending it. The tap's note
      // already went out, so a typed question travels on its own.
      askAboutLine: (line, question) => {
        const text = askAboutLineText(line.text, question, {
          alreadyPointed: true,
        });
        if (text) setSent((current) => [...current, text]);
        return text !== null;
      },
      subscribeEnded: () => () => {},
    }),
    [allLines, phase, shown],
  );

  return (
    <div className="min-h-screen bg-[#050505] text-neutral-200">
      <div className="mx-auto flex max-w-4xl flex-col">
        <div className="border-b border-white/10 px-4 py-2 text-[11px] text-neutral-500">
          /dev/call-transcript — the real component, fake call
        </div>

        <CallContext.Provider value={value}>
          <CallTranscript ui={copy.ko} />
        </CallContext.Provider>

        <div className="flex flex-wrap items-center gap-2 px-4 pt-4 text-[12px]">
          <span className="text-neutral-500">call:</span>
          {(["connected", "idle"] as const).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setPhase(value)}
              className={`rounded-full px-2.5 py-1 ${
                phase === value
                  ? "bg-white/20 text-white"
                  : "bg-white/5 text-neutral-400 hover:bg-white/10"
              }`}
            >
              {value === "connected" ? "on a call" : "ended"}
            </button>
          ))}
          <span className="text-neutral-600">
            (ending a call folds the transcript to its header)
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 p-4 text-[12px]">
          <span className="text-neutral-500">lines shown:</span>
          {Array.from({ length: allLines.length + 1 }, (_, n) => (
            <button
              key={n}
              type="button"
              onClick={() => setShown(n)}
              className={`rounded-full px-2.5 py-1 ${
                shown === n
                  ? "bg-white/20 text-white"
                  : "bg-white/5 text-neutral-400 hover:bg-white/10"
              }`}
            >
              {n}
            </button>
          ))}
          <span className="text-neutral-600">
            (0 = nothing rendered at all, which is the idle state)
          </span>
        </div>

        <div className="px-4 pb-8 text-[12px]">
          <div className="mb-1 text-neutral-500">
            what the tutor would receive, in order:
          </div>
          {sent.length === 0 ? (
            <div className="text-neutral-600">
              tap a line above — the tap alone sends the first message, so the
              question can be spoken instead of typed
            </div>
          ) : (
            <ol className="flex flex-col gap-2">
              {sent.map((text, n) => (
                <li
                  key={n}
                  className="whitespace-pre-wrap rounded-lg bg-white/5 p-2 text-neutral-300"
                >
                  {text}
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </div>
  );
}
