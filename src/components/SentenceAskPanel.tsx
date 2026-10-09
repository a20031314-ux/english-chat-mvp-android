"use client";

import { useState } from "react";
import type { UICopy } from "@/lib/copy";
import { requestExpressionAsk } from "@/lib/requestExpressionAsk";
import {
  saveAskTurn,
  threadForWords,
  type SentenceNote,
} from "@/lib/sentenceNotes";

/**
 * Ask your own question about the words picked in the sentence sheet.
 *
 * The answer is kept as a note on those words (lib/sentenceNotes): the next
 * question about the same words is a follow-up in the same thread, and the
 * thread is there the next time the sentence is opened.
 */
export function SentenceAskPanel({
  ui,
  sentence,
  selected,
  wholeSentence,
  note,
  context,
  uiLanguage,
  targetLanguage,
  onNote,
  onDelete,
}: {
  ui: UICopy;
  sentence: string;
  /** The words being asked about; the whole sentence when nothing is picked. */
  selected: string;
  wholeSentence: boolean;
  note: SentenceNote | null;
  context?: string[];
  uiLanguage: string;
  targetLanguage: string;
  onNote: (note: SentenceNote | null) => void;
  onDelete: (threadId: string) => void;
}) {
  const [question, setQuestion] = useState("");
  const [pending, setPending] = useState("");
  const [error, setError] = useState("");
  const thread = threadForWords(note, selected);

  const placeholder = thread
    ? ui.askFollowUpPlaceholder
    : wholeSentence
      ? ui.askSentencePlaceholder
      : ui.askPlaceholder;

  type Preset = "meaning" | "form" | "alternatives";
  const presets: Array<{ id: Preset; label: string }> = [
    { id: "meaning", label: ui.quickAskMeaning },
    { id: "form", label: ui.quickAskForm },
    { id: "alternatives", label: ui.quickAskAlternatives },
  ];

  // A typed question, or a one-tap one (its label is what the thread shows;
  // the server words the question itself and counts it on its own allowance).
  const send = async (preset?: { id: Preset; label: string }) => {
    const asked = preset ? preset.label : question.replace(/\s+/g, " ").trim();
    if (!asked || pending) return;
    setPending(asked);
    setError("");
    const result = await requestExpressionAsk({
      sentence,
      selected,
      question: asked,
      ...(preset ? { preset: preset.id } : {}),
      history: thread?.turns,
      context,
      interfaceLanguage: uiLanguage,
      targetLanguage,
    });
    setPending("");
    if (!result.ok) {
      setError(
        result.reason === "limit"
          ? ui.askLimitReached.replace("{limit}", String(result.limit || ""))
          : ui.askFailed,
      );
      return;
    }
    if (!preset) setQuestion("");
    onNote(
      saveAskTurn(
        { sentence, language: targetLanguage, uiLanguage },
        selected,
        { question: asked, answer: result.answer },
      ),
    );
  };

  return (
    <section className="mt-4">
      {thread || pending ? (
        <div className="relative mb-3 rounded-xl bg-white/5 px-3 py-3">
          {thread && !pending ? (
            <button
              type="button"
              onClick={() => onDelete(thread.id)}
              aria-label={ui.askDeleteThread}
              className="absolute right-1.5 top-1.5 rounded-lg px-2 py-1 text-xs text-slate-500 hover:bg-white/10 hover:text-slate-200"
            >
              ✕
            </button>
          ) : null}
        <ol className="space-y-3 pr-6">
          {thread?.turns.map((turn, index) => (
            <li key={`${turn.at}-${index}`}>
              <p className="text-sm font-semibold leading-relaxed text-slate-100">
                {turn.question}
              </p>
              <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-[#e4e4e0]">
                {turn.answer}
              </p>
            </li>
          ))}
          {pending ? (
            <li>
              <p className="text-sm font-semibold leading-relaxed text-slate-100">
                {pending}
              </p>
              <p className="mt-1 text-sm text-slate-400">{ui.askLoading}</p>
            </li>
          ) : null}
        </ol>
        </div>
      ) : null}

      {/* One tap for the questions almost everyone has — what the old fixed
          analysis answered, now kept as part of the thread. */}
      <div className="mb-2 flex flex-wrap gap-1.5">
        {presets.map((preset) => (
          <button
            key={preset.id}
            type="button"
            disabled={Boolean(pending)}
            onClick={() => void send(preset)}
            className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[13px] text-slate-200 hover:bg-white/10 disabled:opacity-40"
          >
            {preset.label}
          </button>
        ))}
      </div>

      <form
        className="flex items-end gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          void send();
        }}
      >
        <textarea
          value={question}
          onChange={(event) => setQuestion(event.target.value.slice(0, 300))}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
              event.preventDefault();
              void send();
            }
          }}
          rows={1}
          placeholder={placeholder}
          aria-label={placeholder}
          disabled={Boolean(pending)}
          className="min-h-[44px] min-w-0 flex-1 resize-none rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-white/30 focus:outline-none disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={!question.trim() || Boolean(pending)}
          className="h-[44px] shrink-0 rounded-xl bg-[#e8e8e4] px-4 text-sm font-medium text-neutral-900 hover:bg-[#f5f5f3] disabled:opacity-40"
        >
          {ui.askSend}
        </button>
      </form>
      {error ? <p className="mt-2 text-sm text-rose-300">{error}</p> : null}
    </section>
  );
}

/** The questions already asked about this sentence, as a list to jump back to. */
export function SentenceAskThreads({
  ui,
  note,
  current,
  onOpen,
  onDelete,
}: {
  ui: UICopy;
  note: SentenceNote | null;
  /** The words the panel is on now; that thread is shown open, not listed. */
  current: string;
  onOpen: (selected: string) => void;
  onDelete: (threadId: string) => void;
}) {
  const others = (note?.threads ?? []).filter(
    (thread) => thread.id !== threadForWords(note, current)?.id,
  );
  if (others.length === 0) return null;
  const order = new Map((note?.threads ?? []).map((thread, index) => [thread.id, index + 1]));
  return (
    <section className="mt-5">
      <p className="text-[11px] font-semibold tracking-wide text-slate-500">
        {ui.askNotesTitle}
      </p>
      <ul className="mt-2 space-y-2">
        {others.map((thread) => (
          <li key={thread.id} className="flex items-start gap-2">
            <button
              type="button"
              onClick={() => onOpen(thread.selected)}
              className="min-w-0 flex-1 rounded-lg bg-white/5 px-3 py-2 text-left hover:bg-white/10"
            >
              <span className="mr-1.5 text-[11px] font-semibold text-amber-200/90">
                {order.get(thread.id)}
              </span>
              <span className="text-sm font-medium text-slate-100">
                {thread.selected}
              </span>
              <span className="mt-0.5 block truncate text-xs text-slate-400">
                {thread.turns[thread.turns.length - 1]?.question}
              </span>
            </button>
            <button
              type="button"
              onClick={() => onDelete(thread.id)}
              aria-label={ui.askDeleteThread}
              className="shrink-0 rounded-lg px-2 py-2 text-sm text-slate-500 hover:bg-white/10 hover:text-slate-200"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
