"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { LanguageSelector } from "@/components/LanguageSelector";
import { CurrentSubtitleCard } from "@/components/videoLearning/CurrentSubtitleCard";
import { SubtitleAnalysisCard } from "@/components/videoLearning/SubtitleAnalysisCard";
import { SubtitleGenerationStatus } from "@/components/videoLearning/SubtitleGenerationStatus";
import { TranscriptList } from "@/components/videoLearning/TranscriptList";
import {
  VideoPlayer,
  type VideoPlayerHandle,
} from "@/components/videoLearning/VideoPlayer";
import { VideoUrlInput } from "@/components/videoLearning/VideoUrlInput";
import type { Locale, UICopy } from "@/lib/copy";
import { useActiveSubtitle } from "@/hooks/useActiveSubtitle";
import { saveVideoLearningItem } from "@/lib/saveVideoLearning";
import {
  isVideoSubtitleSaved,
  loadVideoLearningSaves,
  parseYouTubeInput,
  type VideoSubtitle,
  type VideoSubtitleAnalysis,
} from "@/lib/videoLearning";
import {
  generateSubtitles,
  analyzeSubtitle,
  VideoSubtitleClientError,
} from "@/lib/videoLearningService";

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
  const [phase, setPhase] = useState<"input" | "generating" | "ready">("input");
  const [stepIndex, setStepIndex] = useState(0);
  const [subtitles, setSubtitles] = useState<VideoSubtitle[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [analysisOpen, setAnalysisOpen] = useState(false);
  const [analysis, setAnalysis] = useState<VideoSubtitleAnalysis | null>(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [transcriptOpen, setTranscriptOpen] = useState(false);
  const [moreGenerating, setMoreGenerating] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [savedVersion, setSavedVersion] = useState(0);

  const cue = useActiveSubtitle(currentTime, subtitles);
  const saved = useMemo(() => {
    if (!cue) return false;
    return isVideoSubtitleSaved(loadVideoLearningSaves(), {
      videoUrl,
      original: cue.original,
      timestamp: cue.startTime,
    });
  }, [cue, videoUrl, savedVersion]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2400);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    setAnalysisOpen(false);
    setAnalysis(null);
  }, [cue?.id]);

  const onTimeUpdate = useCallback((seconds: number) => {
    setCurrentTime(seconds);
  }, []);

  const loadVideo = () => {
    const parsed = parseYouTubeInput(draftUrl);
    if (!parsed.ok) {
      setUrlError(ui.videoLearnInvalidUrl);
      return;
    }
    setUrlError(null);
    setVideoId(parsed.videoId);
    setVideoUrl(parsed.url);
    setPhase("generating");
    setStepIndex(0);
    setSubtitles([]);
    setCurrentTime(0);
    setTranscriptOpen(false);
    setAnalysisOpen(false);
    setMoreGenerating(false);
    abortRef.current?.abort();
    const abort = new AbortController();
    abortRef.current = abort;
    const seq = ++loadSeq.current;
    void (async () => {
      let gotCues = false;
      try {
        await generateSubtitles(parsed.url, {
          locale,
          signal: abort.signal,
          onStatus: (step) => {
            if (seq !== loadSeq.current) return;
            setStepIndex(
              { speech: 0, context: 1, translate: 2, cleanup: 3 }[step],
            );
          },
          onPartial: (cues, done) => {
            if (seq !== loadSeq.current) return;
            if (cues.length > 0) gotCues = true;
            setSubtitles(cues);
            if (cues.length > 0) {
              setPhase("ready");
              setMoreGenerating(!done);
            }
            if (done) setMoreGenerating(false);
          },
        });
        if (seq !== loadSeq.current) return;
        setPhase("ready");
        setMoreGenerating(false);
      } catch (error) {
        if (seq !== loadSeq.current || abort.signal.aborted) return;
        setMoreGenerating(false);
        if (gotCues) {
          setPhase("ready");
          return;
        }
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
    setPhase("input");
    setVideoId(null);
    setVideoUrl("");
    setSubtitles([]);
    setCurrentTime(0);
    setAnalysisOpen(false);
    setTranscriptOpen(false);
    setMoreGenerating(false);
  };

  const onToggleAnalysis = () => {
    if (!cue) return;
    if (analysisOpen) {
      setAnalysisOpen(false);
      return;
    }
    setAnalysisOpen(true);
    if (analysis?.subtitleId === cue.id) return;
    setAnalysisLoading(true);
    void analyzeSubtitle(cue.id).then((result) => {
      setAnalysis(result);
      setAnalysisLoading(false);
    });
  };

  const onSave = () => {
    if (!cue) return;
    const result = saveVideoLearningItem({
      original: cue.original,
      translation: cue.translation,
      explanation: analysis?.meaningInSentence || cue.translation,
      videoUrl,
      timestamp: cue.startTime,
    });
    setSavedVersion((value) => value + 1);
    if (!result.alreadySaved) {
      setToast(ui.videoLearnSavedToast);
    }
  };

  const durationHint =
    subtitles.length > 0 ? subtitles[subtitles.length - 1]!.endTime + 4 : 70;

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
          />
        </div>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          {videoId ? (
            <VideoPlayer
              ref={playerRef}
              videoId={videoId}
              active={active}
              durationHint={durationHint}
              onTimeUpdate={onTimeUpdate}
            />
          ) : null}

          <div className="min-h-0 flex-1 overflow-y-auto">
            {phase === "generating" ? (
              <SubtitleGenerationStatus ui={ui} stepIndex={stepIndex} />
            ) : (
              <>
                {moreGenerating ? (
                  <p className="px-4 pt-3 text-center text-xs text-slate-500">
                    {ui.videoLearnMoreGenerating}
                  </p>
                ) : null}
                <CurrentSubtitleCard
                  ui={ui}
                  cue={cue}
                  analysisOpen={analysisOpen}
                  saved={saved}
                  onToggleAnalysis={onToggleAnalysis}
                  onSave={onSave}
                />
                {analysisOpen ? (
                  <SubtitleAnalysisCard
                    ui={ui}
                    analysis={analysis}
                    loading={analysisLoading}
                  />
                ) : null}
                <div className="px-4 pb-3">
                  <button
                    type="button"
                    onClick={() => setTranscriptOpen((open) => !open)}
                    className="text-xs text-slate-500 hover:text-slate-800"
                  >
                    {transcriptOpen
                      ? ui.videoLearnTranscriptHide
                      : ui.videoLearnTranscriptShow}
                  </button>
                </div>
                {transcriptOpen ? (
                  <TranscriptList
                    ui={ui}
                    cues={subtitles}
                    activeId={cue?.id ?? null}
                    onSeek={(seconds) => {
                      playerRef.current?.seekTo(seconds);
                      setCurrentTime(seconds);
                    }}
                  />
                ) : null}
              </>
            )}
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
