"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { LanguageSelector } from "@/components/LanguageSelector";
import { CurrentSubtitleCard } from "@/components/videoLearning/CurrentSubtitleCard";
import { SavedVideoSessions } from "@/components/videoLearning/SavedVideoSessions";
import { EnglishSentenceList } from "@/components/videoLearning/StudyMaterialsList";
import { SubtitleDebugPanel } from "@/components/videoLearning/SubtitleDebugPanel";
import { SubtitleGenerationStatus } from "@/components/videoLearning/SubtitleGenerationStatus";
import {
  VideoPlayer,
  type VideoPlayerHandle,
} from "@/components/videoLearning/VideoPlayer";
import { VideoUrlInput } from "@/components/videoLearning/VideoUrlInput";
import type { Locale, UICopy } from "@/lib/copy";
import { useActiveSubtitle } from "@/hooks/useActiveSubtitle";
import { parseYouTubeInput, type VideoSubtitle } from "@/lib/videoLearning";
import {
  generateLineInterpretations,
  prepareEnglishWatch,
  regroupStudyCues,
  VideoSubtitleClientError,
  type PreparedTranscript,
} from "@/lib/videoLearningService";
import {
  deleteVideoStudySession,
  loadVideoStudySessions,
  storedCuesToSubtitles,
  upsertVideoStudySession,
  type VideoStudySession,
} from "@/lib/videoStudySessions";

type Phase = "input" | "extracting" | "watching";

export function VideoLearningTab({
  locale,
  ui,
  active = true,
  onLocaleChange,
}: {
  locale: Locale;
  ui: UICopy;
  active?: boolean;
  onLocaleChange: (locale: Locale) => void;
}) {
  const playerRef = useRef<VideoPlayerHandle>(null);
  const loadSeq = useRef(0);
  const abortRef = useRef<AbortController | null>(null);
  const [draftUrl, setDraftUrl] = useState("");
  const [urlError, setUrlError] = useState<string | null>(null);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [phase, setPhase] = useState<Phase>("input");
  const [stepIndex, setStepIndex] = useState(0);
  const [englishCues, setEnglishCues] = useState<VideoSubtitle[]>([]);
  const [situationSummary, setSituationSummary] = useState("");
  const [durationSeconds, setDurationSeconds] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const [sessionsVersion, setSessionsVersion] = useState(0);
  const [savedSessions, setSavedSessions] = useState<VideoStudySession[]>([]);
  const [sessionsReady, setSessionsReady] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [playingIds, setPlayingIds] = useState<string[]>([]);
  const [rangeMode, setRangeMode] = useState(false);
  const [rangeIds, setRangeIds] = useState<string[]>([]);
  const rangeAnchorRef = useRef<string | null>(null);
  const preparedRef = useRef<PreparedTranscript | null>(null);

  const cue = useActiveSubtitle(currentTime, englishCues, "english");
  const displayCue =
    (selectedId
      ? englishCues.find((row) => row.id === selectedId)
      : null) ?? cue;

  useEffect(() => {
    setSavedSessions(loadVideoStudySessions());
    setSessionsReady(true);
  }, [sessionsVersion]);

  const sessionSaved = useMemo(() => {
    if (!sessionsReady || !videoId) return false;
    return savedSessions.some((session) => session.videoId === videoId);
  }, [videoId, savedSessions, sessionsReady]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2400);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const persistSession = useCallback(
    (cues: VideoSubtitle[], summary?: string) => {
      if (!videoId || !videoUrl || cues.length === 0) return;
      upsertVideoStudySession({
        videoId,
        videoUrl,
        situationSummary: summary ?? situationSummary,
        durationSeconds: Math.max(
          durationSeconds,
          preparedRef.current?.durationSeconds ?? 0,
          cues[cues.length - 1]!.endTime,
        ),
        cues,
      });
      setSessionsVersion((value) => value + 1);
    },
    [videoId, videoUrl, durationSeconds, situationSummary],
  );

  const startInterpretation = useCallback(
    (
      prepared: PreparedTranscript,
      seq: number,
      signal: AbortSignal,
      videoMeta: { videoId: string; videoUrl: string },
    ) => {
      const summary = prepared.context.summary?.trim() || "";
      if (summary) setSituationSummary(summary);

      void generateLineInterpretations(prepared, {
        locale,
        signal,
        onPartial: (partial, done) => {
          if (seq !== loadSeq.current) return;
          setEnglishCues(partial);
          if (done) {
            upsertVideoStudySession({
              videoId: videoMeta.videoId,
              videoUrl: videoMeta.videoUrl,
              situationSummary: summary || undefined,
              durationSeconds: prepared.durationSeconds,
              cues: partial,
            });
            setSessionsVersion((value) => value + 1);
          }
        },
      }).catch((error) => {
        if (seq !== loadSeq.current || signal.aborted) return;
        console.error("[video-interpret]", error);
      });
    },
    [locale],
  );

  const onTimeUpdate = useCallback((seconds: number) => {
    setCurrentTime(seconds);
  }, []);

  const onSegmentEnded = useCallback(() => {
    setPlayingId(null);
    setPlayingIds([]);
  }, []);

  const resolveSegmentEnd = useCallback(
    (item: VideoSubtitle, index: number, maxSpan = 10) => {
      const next = index >= 0 ? englishCues[index + 1] : undefined;
      let end = item.endTime;
      if (next && next.startTime > item.startTime + 0.2) {
        end = Math.min(end, next.startTime);
      }
      if (!(end > item.startTime + 0.2)) {
        end = item.startTime + 2.5;
      }
      return Math.min(end, item.startTime + maxSpan);
    },
    [englishCues],
  );

  const playCueSegment = useCallback(
    (item: VideoSubtitle) => {
      if (playingId === item.id && playingIds.length <= 1) {
        playerRef.current?.pause();
        setPlayingId(null);
        setPlayingIds([]);
        return;
      }
      const index = englishCues.findIndex((row) => row.id === item.id);
      const end = resolveSegmentEnd(item, index, 10);

      setRangeIds([]);
      rangeAnchorRef.current = null;
      setSelectedId(item.id);
      setPlayingId(item.id);
      setPlayingIds([item.id]);
      setCurrentTime(item.startTime);
      playerRef.current?.playSegment(item.startTime, end);
    },
    [playingId, playingIds.length, englishCues, resolveSegmentEnd],
  );

  const playCueRange = useCallback(
    (ids: string[]) => {
      if (ids.length === 0) return;
      const indexes = ids
        .map((id) => englishCues.findIndex((row) => row.id === id))
        .filter((index) => index >= 0)
        .sort((a, b) => a - b);
      if (indexes.length === 0) return;
      const first = englishCues[indexes[0]!]!;
      const last = englishCues[indexes[indexes.length - 1]!]!;
      const end = resolveSegmentEnd(last, indexes[indexes.length - 1]!, 60);
      const orderedIds = indexes.map((index) => englishCues[index]!.id);

      setSelectedId(first.id);
      setPlayingId(first.id);
      setPlayingIds(orderedIds);
      setCurrentTime(first.startTime);
      playerRef.current?.playSegment(first.startTime, end);
    },
    [englishCues, resolveSegmentEnd],
  );

  const onSelectRangeCue = useCallback(
    (cue: VideoSubtitle) => {
      const anchor = rangeAnchorRef.current;
      if (!anchor || anchor === cue.id) {
        rangeAnchorRef.current = cue.id;
        setRangeIds([cue.id]);
        setSelectedId(cue.id);
        return;
      }
      const startIndex = englishCues.findIndex((row) => row.id === anchor);
      const endIndex = englishCues.findIndex((row) => row.id === cue.id);
      if (startIndex < 0 || endIndex < 0) {
        rangeAnchorRef.current = cue.id;
        setRangeIds([cue.id]);
        return;
      }
      const from = Math.min(startIndex, endIndex);
      const to = Math.max(startIndex, endIndex);
      const ids = englishCues.slice(from, to + 1).map((row) => row.id);
      setRangeIds(ids);
      setSelectedId(cue.id);
      playCueRange(ids);
    },
    [englishCues, playCueRange],
  );

  const clearRange = useCallback(() => {
    rangeAnchorRef.current = null;
    setRangeIds([]);
  }, []);

  const openSession = (session: VideoStudySession) => {
    loadSeq.current += 1;
    abortRef.current?.abort();
    preparedRef.current = null;
    setUrlError(null);
    setDraftUrl(session.videoUrl);
    setVideoId(session.videoId);
    setVideoUrl(session.videoUrl);
    setEnglishCues(regroupStudyCues(storedCuesToSubtitles(session.cues)));
    setSituationSummary(session.situationSummary ?? "");
    setDurationSeconds(session.durationSeconds);
    setCurrentTime(0);
    setSelectedId(null);
    setPlayingId(null);
    setPlayingIds([]);
    setRangeMode(false);
    setRangeIds([]);
    rangeAnchorRef.current = null;
    setProgressPercent(100);
    setPhase("watching");
  };

  const onDeleteSession = (session: VideoStudySession) => {
    deleteVideoStudySession(session.videoId);
    setSessionsVersion((value) => value + 1);
    setToast(ui.videoLearnSessionDeletedToast);
  };

  const onSaveSession = () => {
    persistSession(englishCues);
    setToast(ui.videoLearnSessionSavedToast);
  };

  const loadVideo = () => {
    const parsed = parseYouTubeInput(draftUrl);
    if (!parsed.ok) {
      setUrlError(ui.videoLearnInvalidUrl);
      return;
    }

    const existing = savedSessions.find(
      (session) => session.videoId === parsed.videoId,
    );
    if (existing) {
      openSession(existing);
      return;
    }

    setUrlError(null);
    setVideoId(parsed.videoId);
    setVideoUrl(parsed.url);
    setPhase("extracting");
    setStepIndex(0);
    setProgressPercent(0);
    setEnglishCues([]);
    setSituationSummary("");
    setDurationSeconds(0);
    setCurrentTime(0);
    setSelectedId(null);
    setPlayingId(null);
    setPlayingIds([]);
    setRangeMode(false);
    setRangeIds([]);
    rangeAnchorRef.current = null;
    preparedRef.current = null;
    abortRef.current?.abort();
    const abort = new AbortController();
    abortRef.current = abort;
    const seq = ++loadSeq.current;
    void (async () => {
      try {
        const { prepared, englishCues: cues } = await prepareEnglishWatch(
          parsed.url,
          {
            locale,
            signal: abort.signal,
            onStatus: (step) => {
              if (seq !== loadSeq.current) return;
              setStepIndex(
                { speech: 0, context: 1, translate: 2, cleanup: 3 }[step],
              );
            },
            onProgress: (progress) => {
              if (seq !== loadSeq.current) return;
              setProgressPercent(progress.percent);
              setStepIndex(
                { speech: 0, context: 1, translate: 2, cleanup: 3 }[
                  progress.step
                ],
              );
            },
          },
        );
        if (seq !== loadSeq.current) return;
        preparedRef.current = prepared;
        const summary = prepared.context.summary?.trim() || "";
        setEnglishCues(cues);
        setSituationSummary(summary);
        setDurationSeconds(prepared.durationSeconds);
        setProgressPercent(100);
        setPhase("watching");
        upsertVideoStudySession({
          videoId: parsed.videoId,
          videoUrl: parsed.url,
          situationSummary: summary || undefined,
          durationSeconds: prepared.durationSeconds,
          cues,
        });
        setSessionsVersion((value) => value + 1);
        setToast(ui.videoLearnSessionSavedToast);
        startInterpretation(prepared, seq, abort.signal, {
          videoId: parsed.videoId,
          videoUrl: parsed.url,
        });
      } catch (error) {
        if (seq !== loadSeq.current || abort.signal.aborted) return;
        const code =
          error instanceof VideoSubtitleClientError ? error.code : "";
        setPhase("input");
        setVideoId(null);
        setUrlError(
          code === "NO_SPEECH" ||
            code === "NO_AUDIO" ||
            code === "UNKNOWN_LANGUAGE"
            ? ui.videoLearnNoSpeech
            : ui.videoLearnFailed,
        );
      }
    })();
  };

  const reset = () => {
    loadSeq.current += 1;
    abortRef.current?.abort();
    preparedRef.current = null;
    setPhase("input");
    setVideoId(null);
    setVideoUrl("");
    setEnglishCues([]);
    setSituationSummary("");
    setDurationSeconds(0);
    setCurrentTime(0);
    setProgressPercent(0);
    setSelectedId(null);
    setPlayingId(null);
    setPlayingIds([]);
    setRangeMode(false);
    setRangeIds([]);
    rangeAnchorRef.current = null;
  };

  const durationHint = Math.max(
    durationSeconds,
    preparedRef.current?.durationSeconds ?? 0,
    englishCues.length > 0
      ? englishCues[englishCues.length - 1]!.endTime + 4
      : 70,
  );

  return (
    <div className="relative flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
      <header className="flex shrink-0 items-center justify-between gap-2 border-b border-slate-200 px-4 py-3">
        <div className="flex min-w-0 items-center gap-2">
          {phase !== "input" ? (
            <button
              type="button"
              onClick={reset}
              className="shrink-0 text-sm text-slate-500 hover:text-slate-800"
            >
              {ui.videoLearnBack}
            </button>
          ) : null}
          <h1 className="truncate text-base font-semibold text-slate-900">
            {ui.homeTabVideo}
          </h1>
        </div>
        <LanguageSelector locale={locale} onChange={onLocaleChange} />
      </header>

      {phase === "input" ? (
        <div className="min-h-0 flex-1 overflow-y-auto">
          <VideoUrlInput
            ui={ui}
            value={draftUrl}
            error={urlError}
            onChange={(value) => {
              setDraftUrl(value);
              setUrlError(null);
            }}
            onSubmit={loadVideo}
          >
            <SavedVideoSessions
              ui={ui}
              sessions={savedSessions}
              onOpen={openSession}
              onDelete={onDeleteSession}
            />
          </VideoUrlInput>
        </div>
      ) : phase === "extracting" ? (
        <div className="min-h-0 flex-1 overflow-y-auto">
          <SubtitleGenerationStatus
            ui={ui}
            stepIndex={stepIndex}
            progressPercent={progressPercent}
          />
        </div>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          {videoId ? (
            <VideoPlayer
              ref={playerRef}
              videoId={videoId}
              active={active}
              autoPlay
              durationHint={durationHint}
              onTimeUpdate={onTimeUpdate}
              onSegmentEnd={onSegmentEnded}
            />
          ) : null}

          <div className="min-h-0 flex-1 overflow-y-auto">
            <CurrentSubtitleCard
              ui={ui}
              cue={displayCue}
              playing={Boolean(displayCue && playingId === displayCue.id)}
              sessionSaved={sessionSaved}
              onPlaySegment={() => {
                if (displayCue) playCueSegment(displayCue);
              }}
              onSaveSession={onSaveSession}
            />
            <SubtitleDebugPanel cue={displayCue} />
            <EnglishSentenceList
              ui={ui}
              cues={englishCues}
              activeId={selectedId ?? cue?.id ?? null}
              playingId={playingId}
              playingIds={playingIds}
              rangeMode={rangeMode}
              rangeIds={rangeIds}
              onToggleRangeMode={() => {
                setRangeMode((value) => !value);
                clearRange();
              }}
              onClearRange={clearRange}
              onPlaySegment={playCueSegment}
              onSelectRangeCue={onSelectRangeCue}
              onPlayRange={() => playCueRange(rangeIds)}
            />
          </div>
        </div>
      )}

      {toast ? (
        <div
          className="pointer-events-none absolute bottom-4 left-1/2 z-20 max-w-[min(90vw,20rem)] -translate-x-1/2 px-4"
          role="status"
        >
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-center text-sm text-slate-800 shadow-lg">
            {toast}
          </div>
        </div>
      ) : null}
    </div>
  );
}
