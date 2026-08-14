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
    <div className="mt-8 border-t border-slate-100 pt-6">
      <p className="text-center text-[11px] font-semibold tracking-wide text-slate-500">
        {ui.videoLearnSavedSessions}
      </p>
      <ul className="mt-3 space-y-2">
        {sessions.map((session) => {
          const preview = session.cues[0]?.original ?? "";
          return (
            <li key={session.id}>
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
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
                    className="h-[4.5rem] w-28 shrink-0 rounded-lg object-cover bg-slate-100"
                  />
                  <span className="min-w-0 flex-1 py-0.5">
                    <span className="block text-[11px] tabular-nums text-slate-400">
                      {formatSubtitleTime(session.durationSeconds)}
                      {" · "}
                      {session.cues.length}
                      {ui.videoLearnSessionLines}
                    </span>
                    <span className="mt-1 line-clamp-2 block text-sm leading-snug text-slate-900">
                      {preview || session.videoUrl}
                    </span>
                  </span>
                </button>
                <div className="flex items-center gap-2 border-t border-slate-100 px-2.5 py-2">
                  <button
                    type="button"
                    onClick={() => onOpen(session)}
                    className="rounded-lg bg-slate-900 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-slate-800"
                  >
                    {ui.videoLearnOpenSession}
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(session)}
                    className="rounded-lg px-2.5 py-1.5 text-xs text-slate-500 hover:bg-slate-100"
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
