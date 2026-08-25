"use client";

import { useEffect, useRef } from "react";
import type { UICopy } from "@/lib/copy";
import type { VideoSubtitle } from "@/lib/videoLearning";
import { formatSubtitleTime } from "@/lib/videoLearning";

/**
 * Transparent subtitle text over the video + a slim cue strip for segment play.
 * Meant to sit absolutely at the bottom of the fullscreen stage.
 */
export function VideoWatchFullscreenDock({
  ui,
  cues,
  activeCue,
  playingId,
  onPlayCue,
  onExit,
}: {
  ui: UICopy;
  cues: VideoSubtitle[];
  activeCue: VideoSubtitle | null;
  playingId: string | null;
  onPlayCue: (cue: VideoSubtitle) => void;
  onExit: () => void;
}) {
  const activeRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [activeCue?.id, playingId]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onExit();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onExit]);

  const original = activeCue?.original?.trim() || "";
  const translation = activeCue?.translation?.trim() || "";

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex flex-col justify-end pb-[max(0.5rem,env(safe-area-inset-bottom))]">
      {/* Transparent caption layer — text only */}
      {(original || translation) && (
        <div className="mx-auto mb-2 max-w-[min(92vw,40rem)] px-3 text-center">
          {original ? (
            <p
              className="text-[15px] font-medium leading-snug text-white sm:text-base"
              style={{
                textShadow:
                  "0 1px 2px rgba(0,0,0,0.85), 0 0 10px rgba(0,0,0,0.55)",
              }}
            >
              {original}
            </p>
          ) : null}
          {translation ? (
            <p
              className="mt-1 text-[13px] leading-snug text-white/90 sm:text-sm"
              style={{
                textShadow:
                  "0 1px 2px rgba(0,0,0,0.8), 0 0 8px rgba(0,0,0,0.5)",
              }}
            >
              {translation}
            </p>
          ) : null}
        </div>
      )}

      {/* Slim segment strip */}
      <div className="pointer-events-auto px-2">
        <div
          className="flex h-5 items-stretch gap-px overflow-x-auto rounded-md bg-black/25 p-0.5 backdrop-blur-[1px]"
          title={ui.videoLearnFullscreenHint}
        >
          {cues.map((cue) => {
            const span = Math.max(0.35, cue.endTime - cue.startTime);
            const active = cue.id === activeCue?.id || cue.id === playingId;
            return (
              <button
                key={cue.id}
                ref={active ? activeRef : undefined}
                type="button"
                title={`${formatSubtitleTime(cue.startTime)} ${cue.original}`}
                onClick={() => onPlayCue(cue)}
                style={{
                  flexGrow: span,
                  flexBasis: `${Math.min(48, span * 12)}px`,
                }}
                className={`min-w-[6px] max-w-[4.5rem] shrink-0 rounded-sm transition ${
                  active
                    ? "bg-[#121212]"
                    : "bg-white/35 hover:bg-white/60"
                }`}
              >
                <span className="sr-only">
                  {formatSubtitleTime(cue.startTime)} {cue.original}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
