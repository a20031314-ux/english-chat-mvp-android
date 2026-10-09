"use client";

import { useState } from "react";
import { SayItBack } from "@/components/RoleplayReview";
import { TTSButton } from "@/components/TTSButton";
import type { UICopy } from "@/lib/copy";
import type { LearningLanguageCode } from "@/lib/learningLanguages";
import { fetchPractice, listenOnce } from "@/lib/roleplay/listen";
import { justTalkId } from "@/lib/roleplay/justTalk";
import type { Practice } from "@/lib/roleplay/practice";

/**
 * Saying a sentence of their own choosing, and hearing back what came through.
 *
 * The review already hands a learner a line and lets them say it back. This is
 * the same check with the line in their hands: something from a show, a
 * sentence they will need tomorrow, a word they are never sure of. They can hear
 * it first, then say it, and the words that did not survive the trip are marked
 * (roleplay/practice.ts) with a sentence about them.
 *
 * Like the review, it can only say which word came out as which. A transcript
 * carries no stress or intonation, so neither is claimed here.
 *
 * At the door rather than inside a call: it opens its own microphone once per
 * attempt, and spends no call time.
 */
export function RoleplayOwnLine({
  targetLanguage,
  nativeLanguage,
  isPremium,
  ui,
}: {
  targetLanguage: LearningLanguageCode;
  nativeLanguage: LearningLanguageCode;
  isPremium: boolean;
  ui: UICopy;
}) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [target, setTarget] = useState("");

  const listen = async (line: string): Promise<{ heard: string; practice: Practice | null }> => {
    try {
      const { heard } = await listenOnce({ language: targetLanguage, isPremium });
      if (!heard) return { heard: "", practice: null };
      const practice = await fetchPractice({
        scenarioId: justTalkId(targetLanguage),
        target: line,
        heard,
        nativeLanguage,
        isPremium,
      });
      return { heard, practice };
    } catch {
      // No microphone, or it was refused: nothing came through.
      return { heard: "", practice: null };
    }
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full max-w-xs rounded-2xl border border-white/15 px-6 py-3 text-[14px] text-neutral-300 transition hover:bg-white/10"
      >
        {ui.roleplayOwnLineOpen}
      </button>
    );
  }

  return (
    <div className="w-full max-w-xs rounded-2xl border border-white/10 bg-white/5 p-3 text-left">
      <div className="flex items-center justify-between">
        <p className="text-[13px] font-medium text-neutral-100">{ui.roleplayOwnLineOpen}</p>
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            setTarget("");
          }}
          aria-label={ui.billingClose}
          className="rounded-lg px-2 py-1 text-[12px] text-neutral-500 hover:bg-white/10 hover:text-neutral-200"
        >
          ✕
        </button>
      </div>
      <p className="mt-1 text-[12px] leading-relaxed text-neutral-500">{ui.roleplayOwnLineHint}</p>
      <form
        className="mt-2 flex items-end gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          const line = draft.replace(/\s+/g, " ").trim().slice(0, 200);
          if (line) setTarget(line);
        }}
      >
        <textarea
          value={draft}
          onChange={(event) => setDraft(event.target.value.slice(0, 200))}
          rows={2}
          placeholder={ui.roleplayOwnLinePlaceholder}
          aria-label={ui.roleplayOwnLinePlaceholder}
          className="min-w-0 flex-1 resize-none rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-[14px] text-neutral-100 placeholder:text-neutral-500 focus:border-white/30 focus:outline-none"
        />
        <button
          type="submit"
          disabled={!draft.trim()}
          className="shrink-0 rounded-xl bg-white/15 px-3 py-2 text-[13px] text-neutral-100 hover:bg-white/20 disabled:opacity-40"
        >
          {ui.roleplayOwnLineUse}
        </button>
      </form>

      {target ? (
        <div className="mt-3 rounded-xl bg-black/30 p-3">
          <div className="flex items-start gap-2">
            <p className="min-w-0 flex-1 text-[14px] leading-snug text-neutral-100">{target}</p>
            <TTSButton text={target} ariaLabel={ui.listen} />
          </div>
          <SayItBack key={target} target={target} ui={ui} onListen={listen} onGrew={() => undefined} />
        </div>
      ) : null}
    </div>
  );
}
