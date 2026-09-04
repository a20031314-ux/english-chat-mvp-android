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
  const { lines, askAboutLine, pointAtLine, phase } = useCall();
  const [asking, setAsking] = useState<CallLine | null>(null);
  const [question, setQuestion] = useState("");
  const endRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  /** The tapped line, so it can be kept in view once the list shrinks. */
  const selectedRef = useRef<HTMLButtonElement | null>(null);

  // Follow the conversation, but only while it is still running — scrolling the
  // list out from under someone reading it after the call would be the opposite
  // of the point.
  useEffect(() => {
    if (phase === "idle") return;
    endRef.current?.scrollIntoView({ block: "end" });
  }, [lines.length, phase]);

  // Opening the ask bar takes height away from the list, which can push the
  // tapped line out of sight even though the bar no longer covers it. Focus
  // without scrolling, then put that line back on screen — you should be able
  // to read the sentence while typing the question about it.
  useEffect(() => {
    if (!asking) return;
    inputRef.current?.focus({ preventScroll: true });
    selectedRef.current?.scrollIntoView({ block: "nearest" });
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
      className="flex max-h-56 shrink-0 flex-col border-b border-white/10 bg-[#0a0a0a]"
    >
      {/*
        The list scrolls; the ask bar below does not sit inside it. Sticky
        inside the scroller put the bar on top of the line it was asking
        about — tap the last line and the sentence disappeared behind the
        input you were typing the question into.
      */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        <ol className="flex flex-col gap-px p-2">
        {lines.map((line) => {
          const isTutor = line.role === "tutor";
          const selected = asking?.id === line.id;
          return (
            <li key={line.id}>
              <button
                type="button"
                ref={selected ? selectedRef : null}
                onClick={() => {
                  setAsking(selected ? null : line);
                  setQuestion("");
                  // Hand the line over on the tap, not on submit, so the
                  // question can just as well be spoken. Untapping sends
                  // nothing — there is no unpointing a sentence already said.
                  if (!selected) pointAtLine(line);
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
      </div>

      {asking ? (
        <div className="flex shrink-0 gap-1.5 border-t border-white/10 bg-[#0a0a0a] p-2">
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
