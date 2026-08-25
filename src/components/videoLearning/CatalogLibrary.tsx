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
  trialVideoIds,
  isPremium,
  onOpen,
  onLocked,
}: {
  ui: UICopy;
  clips: LibraryClip[];
  trialVideoIds: string[];
  isPremium: boolean;
  onOpen: (url: string, durationSeconds: number) => void;
  onLocked: () => void;
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
              .replace("{used}", String(trialVideoIds.length))
              .replace("{limit}", "3")}
      </p>
      <ul className="mt-3 space-y-2">
        {clips.map((clip, index) => {
          const unlocked =
            isPremium ||
            trialVideoIds.includes(clip.videoId) ||
            (trialVideoIds.length < 3 && index < 3);
          return (
            <li key={clip.videoId}>
              <button
                type="button"
                onClick={() => {
                  if (unlocked) {
                    onOpen(libraryWatchUrl(clip.videoId), clip.durationSeconds);
                  } else {
                    onLocked();
                  }
                }}
                className="flex w-full gap-3 overflow-hidden rounded-xl border border-white/10 bg-white/5 p-2.5 text-left"
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
                  ) : !isPremium && index < 3 ? (
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
            </li>
          );
        })}
      </ul>
    </div>
  );
}
