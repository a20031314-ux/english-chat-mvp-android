"use client";

import type { UICopy } from "@/lib/copy";
import { formatSubtitleTime } from "@/lib/videoLearning";
import {
  type LibraryClip,
  libraryWatchUrl,
} from "@/lib/videoLibrary/catalog";

function youtubeThumb(videoId: string) {
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
}

export function CatalogLibrary({
  ui,
  clips,
  usedVideoIds,
  freeVideoIds,
  trialLimit,
  isPremium,
  onOpen,
  onLocked,
  preparingVideoId = null,
  progressPercent = 0,
}: {
  ui: UICopy;
  clips: LibraryClip[];
  /** Library clips this learner has already opened. */
  usedVideoIds: string[];
  /**
   * The clips a free learner may open, as the server names them.
   *
   * This used to be "the first three on screen", which is the rule the
   * charging gate uses too — until the two are reading different lists, which
   * is what happens while a build carries a month the deployment has moved
   * past. They come from the list the gate will charge against now.
   */
  freeVideoIds: string[];
  trialLimit: number;
  isPremium: boolean;
  onOpen: (url: string, durationSeconds: number) => void;
  onLocked: () => void;
  /** The clip being prepared, so the wait shows on the card that started it. */
  preparingVideoId?: string | null;
  progressPercent?: number;
}) {
  if (clips.length === 0) {
    return (
      <div className="mt-8 border-t border-white/10 pt-6">
        <p className="text-center text-[11px] font-semibold tracking-wide text-[#e4e4e0]">
          {ui.videoLearnLibraryTitle}
        </p>
        <p className="mt-2 text-center text-sm text-slate-500">
          {ui.videoLearnLibraryEmpty}
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8 border-t border-white/10 pt-6">
      <p className="text-center text-[11px] font-semibold tracking-wide text-[#e4e4e0]">
        {ui.videoLearnLibraryTitle}
      </p>
      <p className="mt-1 text-center text-xs leading-relaxed text-slate-500">
        {isPremium
          ? ui.videoLearnLibrarySubtitlePremium
          : ui.videoLearnLibrarySubtitleFree
              .replace("{used}", String(usedVideoIds.length))
              .replace("{limit}", String(trialLimit))}
      </p>
      <ul className="mt-3 space-y-2">
        {clips.map((clip) => {
          const unlocked =
            isPremium ||
            usedVideoIds.includes(clip.videoId) ||
            (usedVideoIds.length < trialLimit &&
              freeVideoIds.includes(clip.videoId));
          const preparing = clip.videoId === preparingVideoId;
          return (
            <li key={clip.videoId} className="relative">
              <button
                type="button"
                disabled={preparing}
                onClick={() => {
                  if (unlocked) {
                    onOpen(libraryWatchUrl(clip.videoId), clip.durationSeconds);
                  } else {
                    onLocked();
                  }
                }}
                className={`flex w-full gap-3 overflow-hidden rounded-xl border border-white/10 bg-white/5 p-2.5 text-left ${
                  preparing ? "opacity-60" : ""
                }`}
              >
                <span className="relative h-[4.5rem] w-28 shrink-0 overflow-hidden rounded-lg bg-white/10">
                  <img
                    src={youtubeThumb(clip.videoId)}
                    alt=""
                    width={128}
                    height={72}
                    className="h-full w-full object-cover"
                  />
                  {!unlocked ? (
                    <span className="absolute inset-0 flex items-center justify-center bg-slate-900/45 text-xs font-medium text-white">
                      {ui.videoLearnLibraryLocked}
                    </span>
                  ) : !isPremium && freeVideoIds.includes(clip.videoId) ? (
                    <span className="absolute left-1 top-1 rounded bg-slate-900/80 px-1.5 py-0.5 text-[10px] font-medium text-white">
                      {ui.videoLearnLibraryTrial}
                    </span>
                  ) : null}
                </span>
                <span className="min-w-0 flex-1 py-0.5">
                  <span className="line-clamp-2 block text-sm leading-snug text-slate-100">
                    {clip.title}
                  </span>
                  <span className="mt-1 block text-[11px] tabular-nums text-slate-400">
                    {formatSubtitleTime(clip.durationSeconds)}
                  </span>
                </span>
              </button>
              {preparing ? (
                <span
                  className="absolute inset-x-2.5 bottom-1.5 block h-1 overflow-hidden rounded-full bg-white/10"
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.round(progressPercent)}
                  aria-label={ui.videoLearnGenerating}
                >
                  <span
                    className="block h-full rounded-full bg-[#e8e8e4] transition-[width] duration-300 ease-out"
                    style={{
                      width: `${Math.max(0, Math.min(100, Math.round(progressPercent)))}%`,
                    }}
                  />
                </span>
              ) : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
