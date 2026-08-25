"use client";

import type { VideoSubtitle } from "@/lib/videoLearning";

/** Development-only panel: native understanding + scene + final caption. */
export function SubtitleDebugPanel({ cue }: { cue: VideoSubtitle | null }) {
  if (process.env.NODE_ENV !== "development") return null;
  if (!cue?.debug && !cue?.nativeUnderstanding) return null;
  const d = cue.debug;
  const native = cue.nativeUnderstanding ?? d?.nativeUnderstanding;
  return (
    <aside className="mx-3 mb-2 max-h-56 overflow-auto rounded-lg border border-white/10 bg-[#121212] px-3 py-2 text-[11px] leading-snug text-slate-200">
      <div className="mb-1 font-semibold uppercase tracking-wide text-[#e4e4e0]">
        Subtitle debug
      </div>
      <div>
        <span className="text-amber-700">Original:</span>{" "}
        {d?.original ?? cue.original}
      </div>
      {native ? (
        <>
          <div>
            <span className="text-amber-700">Native understanding:</span>{" "}
            {native.understoodMeaning}
          </div>
          {native.references && native.references.length > 0 ? (
            <div>
              <span className="text-amber-700">References:</span>{" "}
              {native.references
                .map((row) => `${row.expression} → ${row.refersTo}`)
                .join(" · ")}
            </div>
          ) : null}
          {native.intent ? (
            <div>
              <span className="text-amber-700">Intent:</span> {native.intent}
            </div>
          ) : null}
          {native.tone ? (
            <div>
              <span className="text-amber-700">Tone:</span> {native.tone}
            </div>
          ) : null}
        </>
      ) : null}
      <div>
        <span className="text-amber-700">Scene:</span>{" "}
        {d?.scene?.setting || d?.scene?.situation
          ? [d.scene.setting, d.scene.situation, d.scene.mood]
              .filter(Boolean)
              .join(" · ")
          : "(none — dialogue/memory fallback)"}
      </div>
      <div>
        <span className="text-amber-700">Previous:</span>{" "}
        {d?.previous?.length ? d.previous.join(" / ") : "—"}
      </div>
      <div>
        <span className="text-amber-700">Next:</span>{" "}
        {d?.next?.length ? d.next.join(" / ") : "—"}
      </div>
      <div>
        <span className="text-amber-700">Final:</span>{" "}
        {d?.finalSubtitle ?? cue.translation}
      </div>
    </aside>
  );
}
