"use client";

import { useEffect, useRef, useState } from "react";
import { useCall } from "@/contexts/CallContext";
import type { CallLine } from "@/lib/realtimeCall";

/**
 * The call, as numbered lines you can point at.
 *
 * A call otherwise leaves nothing behind. Miss something and you do not know
 * what you missed, so the question never gets asked and the moment goes past.
 * Every finished turn lands here the moment it is transcribed, and tapping one
 * hands it to the tutor — the line itself, not its number, so nothing rests on
 * the model counting turns.
 *
 * Numbers are for the person: assigned when a turn is finalized and never
 * reassigned, so "the fourth one" still means what it meant a moment ago.
 */
export function CallTranscript() {
  const { lines, askAboutLine, phase } = useCall();
  const [asking, setAsking] = useState<CallLine | null>(null);
  const [question, setQuestion] = useState("");
  const endRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Follow the conversation, but only while it is still running — scrolling the
  // list out from under someone reading it after the call would be the opposite
  // of the point.
  useEffect(() => {
    if (phase === "idle") return;
    endRef.current?.scrollIntoView({ block: "end" });
  }, [lines.length, phase]);

  useEffect(() => {
    if (asking) inputRef.current?.focus();
  }, [asking]);

  if (lines.length === 0) return null;

  const submit = () => {
    if (!asking) return;
    if (askAboutLine(asking, question)) {
      setAsking(null);
      setQuestion("");
    }
  };

  return (
    <section
      aria-label="call transcript"
      className="flex max-h-56 shrink-0 flex-col overflow-y-auto border-b border-white/10 bg-[#0a0a0a]"
    >
      <ol className="flex flex-col gap-px p-2">
        {lines.map((line) => {
          const isTutor = line.role === "tutor";
          const selected = asking?.id === line.id;
          return (
            <li key={line.id}>
              <button
                type="button"
                onClick={() => {
                  setAsking(selected ? null : line);
                  setQuestion("");
                }}
                aria-pressed={selected}
                className={`flex w-full gap-2 rounded-lg px-2 py-1.5 text-left transition ${
                  selected ? "bg-white/10" : "hover:bg-white/5"
                }`}
              >
                <span
                  className="w-5 shrink-0 pt-0.5 text-right text-[10px] tabular-nums text-neutral-500"
                  aria-hidden="true"
                >
                  {line.index}
                </span>
                <span
                  className={`text-[13px] leading-snug ${
                    isTutor ? "text-neutral-100" : "text-neutral-400"
                  }`}
                >
                  {line.text}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
      <div ref={endRef} />

      {asking ? (
        <div className="sticky bottom-0 flex gap-1.5 border-t border-white/10 bg-[#0a0a0a] p-2">
          <input
            ref={inputRef}
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") submit();
              if (event.key === "Escape") setAsking(null);
            }}
            className="min-w-0 flex-1 rounded-full border border-white/20 bg-[#141414] px-3 py-1 text-[13px] text-neutral-100 outline-none"
          />
          <button
            type="button"
            onClick={submit}
            disabled={!question.trim()}
            className="shrink-0 rounded-full bg-white/15 px-3 py-1 text-[12px] text-neutral-100 disabled:opacity-40"
          >
            →
          </button>
        </div>
      ) : null}
    </section>
  );
}
