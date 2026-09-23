"use client";

import { FullScreenLayer } from "@/components/FullScreenLayer";
import { RoleplayLine } from "@/components/RoleplayReview";
import type { SavedConversation } from "@/lib/roleplay/saved";
import type { UICopy } from "@/lib/copy";

/**
 * A conversation that has already happened, read back.
 *
 * The same lines the scene drew, with everything that was learned about them
 * still attached — the gloss somebody tapped for, their own sentence said
 * better, the note under it. The one thing missing is the offer to look back at
 * a turn they got stuck on: that asks the model about a conversation in
 * progress, and this is not one. The evidence is still on the line, so the
 * button can be given back the day it makes sense to ask afterwards.
 *
 * Read-only on purpose. A conversation is carried on from the door, where the
 * microphone is opened deliberately, not from a page somebody was reading.
 */
export function RoleplayPast({
  saved,
  ui,
  onClose,
}: {
  saved: SavedConversation;
  ui: UICopy;
  onClose: () => void;
}) {
  return (
    <FullScreenLayer>
      <header className="flex shrink-0 items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
        <div className="min-w-0">
          <h2 className="truncate text-sm font-semibold text-white">{saved.title}</h2>
          <p className="text-[11px] text-neutral-500">
            {new Date(saved.startedAt).toLocaleString()}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 rounded-lg border border-white/15 px-3 py-1.5 text-[12px] text-neutral-300 hover:bg-white/10"
        >
          {ui.billingClose}
        </button>
      </header>

      <ol className="min-h-0 flex-1 overflow-y-auto p-3">
        {saved.said.map((line, index) => (
          <RoleplayLine
            key={index}
            // Nothing here asks the model anything, so the line is drawn
            // without the two things that would: looking back at a stuck turn,
            // and fetching a gloss that was never fetched at the time.
            line={line.stuck ? { ...line, stuck: undefined } : line}
            ui={ui}
            onReview={() => undefined}
          />
        ))}
      </ol>
    </FullScreenLayer>
  );
}
