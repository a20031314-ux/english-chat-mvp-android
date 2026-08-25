"use client";

import type { UICopy } from "@/lib/copy";
import { formatSubtitleTime } from "@/lib/videoLearning";
import type { VideoStudySession } from "@/lib/videoStudySessions";

function youtubeThumbnailUrl(videoId: string): string {
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
}

export function SavedVideoSessions({
  ui,
  sessions,
  onOpen,
  onDelete,
}: {
  ui: UICopy;
  sessions: VideoStudySession[];
  onOpen: (session: VideoStudySession) => void;
  onDelete: (session: VideoStudySession) => void;
}) {
  if (sessions.length === 0) return null;

  return (
    <div className="mt-8 border-t border-white/10 pt-6">
      <p className="text-center text-[11px] font-semibold tracking-wide text-[#e4e4e0]">
        {ui.videoLearnSavedSessions}
      </p>
      <ul className="mt-3 space-y-2">
        {sessions.map((session) => {
          const preview = session.cues[0]?.original ?? "";
          return (
            <li key={session.id}>
              <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5">
                <button
                  type="button"
                  onClick={() => onOpen(session)}
                  className="flex w-full gap-3 p-2.5 text-left"
                >
                  <img
                    src={youtubeThumbnailUrl(session.videoId)}
                    alt=""
                    width={128}
                    height={72}
                    loading="lazy"
                    className="h-[4.5rem] w-28 shrink-0 rounded-lg object-cover bg-white/10"
                  />
                  <span className="min-w-0 flex-1 py-0.5">
                    <span className="block text-[11px] tabular-nums text-slate-400">
                      {formatSubtitleTime(session.durationSeconds)}
                      {" · "}
                      {session.cues.length}
                      {ui.videoLearnSessionLines}
                    </span>
                    <span className="mt-1 line-clamp-2 block text-sm leading-snug text-slate-100">
                      {preview || session.videoUrl}
                    </span>
                  </span>
                </button>
                <div className="flex items-center gap-2 border-t border-white/10 px-2.5 py-2">
                  <button
                    type="button"
                    onClick={() => onOpen(session)}
                    className="rounded-lg bg-[#e8e8e4] px-2.5 py-1.5 text-xs font-medium text-neutral-900 hover:bg-[#f5f5f3]"
                  >
                    {ui.videoLearnOpenSession}
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(session)}
                    className="rounded-lg px-2.5 py-1.5 text-xs text-slate-400 hover:bg-white/10"
                  >
                    {ui.videoLearnDeleteSession}
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
