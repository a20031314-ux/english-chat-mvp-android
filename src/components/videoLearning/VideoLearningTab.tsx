"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CurrentSubtitleCard } from "@/components/videoLearning/CurrentSubtitleCard";
import { SavedVideoSessions } from "@/components/videoLearning/SavedVideoSessions";
import { EnglishSentenceList } from "@/components/videoLearning/StudyMaterialsList";
import { SubtitleDebugPanel } from "@/components/videoLearning/SubtitleDebugPanel";
import { SubtitleGenerationStatus } from "@/components/videoLearning/SubtitleGenerationStatus";
import { VideoWatchFullscreenDock } from "@/components/videoLearning/VideoWatchFullscreenDock";
import {
  VideoPlayer,
  type VideoPlayerHandle,
} from "@/components/videoLearning/VideoPlayer";
import { CatalogLibrary } from "@/components/videoLearning/CatalogLibrary";
import { VideoUrlInput } from "@/components/videoLearning/VideoUrlInput";
import { onAppIntent } from "@/lib/appIntents";
import { ContentDiscoveryPanel } from "@/components/contentDiscovery/ContentDiscoveryPanel";
import { useBillingUi } from "@/components/BillingScreen";
import { usePremium } from "@/contexts/PremiumContext";
import type { Locale, UICopy } from "@/lib/copy";
import {
  evaluateVideoAccess,
  importPointsForDuration,
  maxVideoPrepSeconds,
  monthlyImportPoints,
  videoPrepMinutes,
} from "@/lib/billing/videoPrep";
import { FREE_CATALOG_TRIAL_COUNT } from "@/lib/billing/config";
import {
  getBilledImportVideoIds,
  getCatalogTrialVideoIds,
  getImportPointsUsed,
  recordCatalogTrial,
  recordImportCharge,
} from "@/lib/billing/videoPrepQuota";
import {
  bundledListing,
  fetchLibraryListing,
  type LibraryListing,
} from "@/lib/videoLibrary/libraryService";
import { useActiveSubtitle } from "@/hooks/useActiveSubtitle";
import { parseYouTubeInput, type VideoSubtitle } from "@/lib/videoLearning";
import { cuesLookUserEdited, mergeVideoCues, newCueIds, splitVideoCue } from "@/lib/videoCueEdit";
import {
  prepareEnglishWatch,
  regroupStudyCues,
  VideoSubtitleClientError,
  type PreparedTranscript,
} from "@/lib/videoLearningService";
import {
  deleteVideoStudySession,
  filterVideoStudySessionsByLanguage,
  loadVideoStudySessions,
  storedCuesToSubtitles,
  upsertVideoStudySession,
  type VideoStudySession,
} from "@/lib/videoStudySessions";
import { useLearningLanguageOptional } from "@/contexts/LearningLanguageContext";
import { setLedgerVideoPlace } from "@/lib/learner/comprehensionClient";
import { DEFAULT_LEARNING_LANGUAGE_CODE } from "@/lib/learningLanguages";

type CueEditKind = "merge" | "split";

type CueEditSnapshot = {
  kind: CueEditKind;
  cues: VideoSubtitle[];
};

function cloneCues(cues: VideoSubtitle[]): VideoSubtitle[] {
  return cues.map((cue) => ({ ...cue }));
}

function resolveSegmentEndFor(
  item: VideoSubtitle,
  index: number,
  cues: VideoSubtitle[],
  maxSpan = 24,
): number {
  const next = index >= 0 ? cues[index + 1] : undefined;
  let end = item.endTime;
  if (next && next.startTime > item.startTime) {
    end = Math.min(end, next.startTime);
  }
  if (!(end > item.startTime + 0.25)) {
    end = Math.min(
      item.startTime + 0.3,
      next?.startTime ?? item.startTime + 0.3,
    );
  }
  return Math.min(end, item.startTime + maxSpan);
}

type Phase = "input" | "extracting" | "watching";

export function VideoLearningTab({
  locale,
  ui,
  active = true,
}: {
  locale: Locale;
  ui: UICopy;
  active?: boolean;
}) {
  const learningLanguage = useLearningLanguageOptional();
  const { isPremium, tier } = usePremium();
  // Every library video is premium's (billing/plans.ts); 3,900 and 5,500 won
  // keep the trial, and import with points they bought.
  const libraryOpen = tier === "premium";
  const { openBilling } = useBillingUi();
  const [quotaVersion, setQuotaVersion] = useState(0);
  const targetLanguage =
    learningLanguage?.targetLanguage ?? DEFAULT_LEARNING_LANGUAGE_CODE;
  /**
   * This month's clips. The build's own copy is the first answer, so the list
   * is there on a train, and the deployment's copy replaces it when it
   * arrives — that is what lets a new month ship without a release.
   */
  const [library, setLibrary] = useState<LibraryListing>(() =>
    bundledListing(targetLanguage),
  );
  useEffect(() => {
    const controller = new AbortController();
    setLibrary(bundledListing(targetLanguage));
    void fetchLibraryListing(targetLanguage, controller.signal).then(
      (listing) => {
        if (listing) setLibrary(listing);
      },
    );
    return () => controller.abort();
  }, [targetLanguage]);
  const playerRef = useRef<VideoPlayerHandle>(null);
  const loadSeq = useRef(0);
  const abortRef = useRef<AbortController | null>(null);
  const [draftUrl, setDraftUrl] = useState("");
  const [urlError, setUrlError] = useState<string | null>(null);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [phase, setPhase] = useState<Phase>("input");
  // Nothing reads the step while the bar is a bare gauge; the setters stay so a
  // stage readout can come back without rewiring every progress callback.
  const [, setStepIndex] = useState(0);
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
  const [rangeIds, setRangeIds] = useState<string[]>([]);
  const [watchFullscreen, setWatchFullscreen] = useState(false);
  const preparedRef = useRef<PreparedTranscript | null>(null);
  /** Original cues before any merge/split (refreshed while untouched). */
  const baselineCuesRef = useRef<VideoSubtitle[]>([]);
  const editHistoryRef = useRef<CueEditSnapshot[]>([]);
  const [editHistoryLen, setEditHistoryLen] = useState(0);
  const [lastEditKind, setLastEditKind] = useState<CueEditKind | null>(null);
  const [canRestoreOriginal, setCanRestoreOriginal] = useState(false);
  /** After merge/split, ignore bulk interpretation overwrites. */
  const cuesDirtyRef = useRef(false);
  const englishCuesRef = useRef<VideoSubtitle[]>([]);
  const playingIdRef = useRef<string | null>(null);
  englishCuesRef.current = englishCues;
  playingIdRef.current = playingId;

  const cancelPreparation = useCallback(() => {
    loadSeq.current += 1;
    abortRef.current?.abort();
    abortRef.current = null;
    setPhase("input");
    setVideoId(null);
    setProgressPercent(0);
    setStepIndex(0);
  }, []);

  const replaceBaseline = useCallback((cues: VideoSubtitle[]) => {
    baselineCuesRef.current = cloneCues(cues);
    editHistoryRef.current = [];
    setEditHistoryLen(0);
    setLastEditKind(null);
    setCanRestoreOriginal(false);
  }, []);

  const reset = useCallback(() => {
    loadSeq.current += 1;
    abortRef.current?.abort();
    preparedRef.current = null;
    cuesDirtyRef.current = false;
    replaceBaseline([]);
    setPhase("input");
    setVideoId(null);
    setVideoUrl("");
    setEnglishCues([]);
    setSituationSummary("");
    setDurationSeconds(0);
    setCurrentTime(0);
    setProgressPercent(0);
    setStepIndex(0);
    setSelectedId(null);
    setPlayingId(null);
    setPlayingIds([]);
    setRangeIds([]);
    setWatchFullscreen(false);
    setToast(null);
  }, [replaceBaseline]);

  const languageRef = useRef(targetLanguage);
  useEffect(() => {
    if (languageRef.current === targetLanguage) return;
    languageRef.current = targetLanguage;
    reset();
    setDraftUrl("");
    setUrlError(null);
  }, [targetLanguage, reset]);

  const cue = useActiveSubtitle(currentTime, englishCues, "english");
  const displayCue =
    (selectedId
      ? englishCues.find((row) => row.id === selectedId)
      : null) ?? cue;

  // The scene on screen, for the expression ledger: a phrase looked up now
  // is filed under this video and this moment (learner/ledger.ts).
  useEffect(() => {
    setLedgerVideoPlace(videoId ? { videoId, ...(displayCue ? { t: displayCue.startTime } : {}) } : null);
  }, [videoId, displayCue]);
  useEffect(() => () => setLedgerVideoPlace(null), []);

  useEffect(() => {
    setSavedSessions(
      filterVideoStudySessionsByLanguage(
        loadVideoStudySessions(),
        targetLanguage,
      ),
    );
    setSessionsReady(true);
  }, [sessionsVersion, targetLanguage]);

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
        baselineCues:
          baselineCuesRef.current.length > 0 ? baselineCuesRef.current : cues,
        languageCode: targetLanguage,
      });
      setSessionsVersion((value) => value + 1);
    },
    [videoId, videoUrl, durationSeconds, situationSummary, targetLanguage],
  );

  // Subtitles open in the learning language only. A line's translation comes
  // when the learner taps its bar (the sentence sheet translates it then, with
  // the video's summary and the lines around it as context), instead of every
  // line being translated up front whether anyone reads it or not — which was
  // most of what a video cost, and held playback while it ran.
  const openWatch = useCallback(
    (
      prepared: PreparedTranscript,
      videoMeta: { videoId: string; videoUrl: string },
      cues: VideoSubtitle[],
    ) => {
      const summary = prepared.context.summary?.trim() || "";
      setSituationSummary(summary);
      setEnglishCues(cues);
      setProgressPercent(100);
      setPhase("watching");
      upsertVideoStudySession({
        videoId: videoMeta.videoId,
        videoUrl: videoMeta.videoUrl,
        situationSummary: summary || undefined,
        durationSeconds: prepared.durationSeconds,
        cues,
        baselineCues:
          baselineCuesRef.current.length > 0 ? baselineCuesRef.current : cues,
        languageCode: targetLanguage,
      });
      setSessionsVersion((value) => value + 1);
      setToast(ui.videoLearnSessionSavedToast);
    },
    [targetLanguage, ui.videoLearnSessionSavedToast],
  );

  // What the sentence sheet reads alongside a tapped line: what the video is
  // about and the lines either side, so its translation and any question about
  // the line are answered for this scene rather than for the words alone.
  const cueContext = useCallback(
    (item: VideoSubtitle): string[] => {
      const index = englishCues.findIndex((row) => row.id === item.id);
      const previous = index > 0 ? englishCues[index - 1]?.original.trim() : "";
      const next = index >= 0 ? englishCues[index + 1]?.original.trim() : "";
      const summary = situationSummary.trim();
      return [
        ...(summary ? [`Video: ${summary}`] : []),
        ...(previous ? [`Previous line: ${previous}`] : []),
        ...(next ? [`Next line: ${next}`] : []),
      ];
    },
    [englishCues, situationSummary],
  );

  const onTimeUpdate = useCallback((seconds: number) => {
    setCurrentTime(seconds);
  }, []);

  const onSegmentEnded = useCallback(() => {
    setPlayingId(null);
    setPlayingIds([]);
  }, []);

  const resolveSegmentEnd = useCallback(
    (item: VideoSubtitle, index: number, maxSpan = 24) =>
      resolveSegmentEndFor(item, index, englishCues, maxSpan),
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
      const end = resolveSegmentEnd(item, index, 24);

      setRangeIds([]);
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

  const clearRange = useCallback(() => {
    setRangeIds([]);
  }, []);

  const onBundleRange = useCallback((ids: string[]) => {
    setRangeIds(ids);
  }, []);

  const applyEditedCues = useCallback(
    (
      next: VideoSubtitle[] | null,
      kind: CueEditKind,
      failMessage?: string,
    ) => {
      if (!next) {
        if (failMessage) setToast(failMessage);
        return null;
      }
      const createdIds = newCueIds(englishCues, next);
      editHistoryRef.current = [
        ...editHistoryRef.current,
        { kind, cues: cloneCues(englishCues) },
      ];
      setEditHistoryLen(editHistoryRef.current.length);
      setLastEditKind(kind);
      cuesDirtyRef.current = true;
      setCanRestoreOriginal(true);
      setEnglishCues(next);
      setPlayingId(null);
      setPlayingIds([]);
      clearRange();
      const preferred =
        next.find((cue) => createdIds.includes(cue.id))?.id ??
        next[0]?.id ??
        null;
      setSelectedId(preferred);
      persistSession(next);
      setToast(ui.videoLearnCuesEditedToast);

      return next;
    },
    [
      clearRange,
      englishCues,
      persistSession,
      ui.videoLearnCuesEditedToast,
    ],
  );

  const onUndoLastEdit = useCallback(() => {
    const history = editHistoryRef.current;
    if (history.length === 0) return;
    const last = history[history.length - 1]!;
    editHistoryRef.current = history.slice(0, -1);
    setEditHistoryLen(editHistoryRef.current.length);
    setLastEditKind(editHistoryRef.current.at(-1)?.kind ?? null);
    if (editHistoryRef.current.length === 0) {
      cuesDirtyRef.current = false;
      setCanRestoreOriginal(false);
    }
    const restored = cloneCues(last.cues);
    setEnglishCues(restored);
    setPlayingId(null);
    setPlayingIds([]);
    clearRange();
    setSelectedId(restored[0]?.id ?? null);
    persistSession(restored);
    setToast(
      last.kind === "merge"
        ? ui.videoLearnUndoMergeToast
        : ui.videoLearnUndoSplitToast,
    );
  }, [
    clearRange,
    persistSession,
    ui.videoLearnUndoMergeToast,
    ui.videoLearnUndoSplitToast,
  ]);

  const onResetAllCues = useCallback(() => {
    const baseline = baselineCuesRef.current;
    if (baseline.length === 0) return;
    editHistoryRef.current = [];
    setEditHistoryLen(0);
    setLastEditKind(null);
    cuesDirtyRef.current = false;
    setCanRestoreOriginal(false);
    const restored = cloneCues(baseline);
    setEnglishCues(restored);
    setPlayingId(null);
    setPlayingIds([]);
    clearRange();
    setSelectedId(restored[0]?.id ?? null);
    persistSession(restored);
    setToast(ui.videoLearnResetAllCuesToast);
  }, [clearRange, persistSession, ui.videoLearnResetAllCuesToast]);

  const onMergeRange = useCallback(
    (ids: string[]) => {
      applyEditedCues(
        mergeVideoCues(englishCues, ids),
        "merge",
        ui.videoLearnMergeNeedRange,
      );
    },
    [applyEditedCues, englishCues, ui.videoLearnMergeNeedRange],
  );

  const onSplitCue = useCallback(
    (cue: VideoSubtitle, cutOffset: number) => {
      applyEditedCues(
        splitVideoCue(englishCues, cue.id, cutOffset),
        "split",
        ui.videoLearnSplitTooShort,
      );
    },
    [applyEditedCues, englishCues, ui.videoLearnSplitTooShort],
  );

  const openSession = (session: VideoStudySession) => {
    loadSeq.current += 1;
    abortRef.current?.abort();
    preparedRef.current = null;
    cuesDirtyRef.current = false;
    setUrlError(null);
    setDraftUrl(session.videoUrl);
    setVideoId(session.videoId);
    setVideoUrl(session.videoUrl);
    const current = storedCuesToSubtitles(session.cues);
    const restored = cuesLookUserEdited(current)
      ? current
      : regroupStudyCues(current);
    setEnglishCues(restored);
    const baseline = session.baselineCues?.length
      ? storedCuesToSubtitles(session.baselineCues)
      : restored;
    replaceBaseline(baseline);
    setCanRestoreOriginal(
      baseline.length > 0 &&
        (restored.length !== baseline.length ||
          restored.some(
            (cue, index) =>
              cue.id !== baseline[index]?.id ||
              cue.original !== baseline[index]?.original,
          )),
    );
    setSituationSummary(session.situationSummary ?? "");
    setDurationSeconds(session.durationSeconds);
    setCurrentTime(0);
    setSelectedId(null);
    setPlayingId(null);
    setPlayingIds([]);
    setRangeIds([]);
    setWatchFullscreen(false);
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

  const loadVideo = (rawUrl?: string, durationSeconds?: number) => {
    const parsed = parseYouTubeInput(rawUrl ?? draftUrl);
    if (!parsed.ok) {
      setUrlError(ui.videoLearnInvalidUrl);
      return;
    }
    setDraftUrl(parsed.url);

    const existing = savedSessions.find(
      (session) => session.videoId === parsed.videoId,
    );
    if (existing) {
      openSession(existing);
      return;
    }

    const localDecision = evaluateVideoAccess({
      isPremium,
      videoId: parsed.videoId,
      language: targetLanguage,
      durationSeconds,
      usedPoints: getImportPointsUsed(),
      billedVideoIds: getBilledImportVideoIds(),
      trialVideoIds: getCatalogTrialVideoIds(),
      libraryOpen,
      grant: libraryOpen ? monthlyImportPoints(true) : 0,
    });
    // This device cannot see points bought separately, which imports may
    // spend once the month's grant is gone. A subscriber who looks out of
    // quota here is therefore sent on, and the server — which knows both
    // pots — refuses with VIDEO_QUOTA if they really are out.
    const decision: typeof localDecision =
      !localDecision.ok && localDecision.reason === "quota" && isPremium
        ? {
            ok: true,
            kind: "import",
            billablePoints: importPointsForDuration(durationSeconds ?? 0),
          }
        : localDecision;
    if (!decision.ok) {
      if (decision.reason === "too_long") {
        setUrlError(
          ui.videoLearnTooLong.replace(
            "{max}",
            String(videoPrepMinutes(decision.maxSeconds)),
          ),
        );
      } else if (decision.reason === "import_locked") {
        setUrlError(ui.videoLearnImportLocked);
        openBilling();
      } else if (decision.reason === "catalog_locked") {
        setUrlError(ui.videoLearnCatalogLocked);
        openBilling();
      } else {
        setUrlError(ui.videoLearnQuotaReached);
        if (!isPremium) openBilling();
      }
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
    setRangeIds([]);
    preparedRef.current = null;
    abortRef.current?.abort();
    const abort = new AbortController();
    abortRef.current = abort;
    const seq = ++loadSeq.current;
    cuesDirtyRef.current = false;
    void (async () => {
      try {
        const { prepared, englishCues: cues } = await prepareEnglishWatch(
          parsed.url,
          {
            locale,
            interfaceLanguage: locale,
            targetLanguage,
            isPremium,
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
        if (decision.kind === "library") {
          if (!libraryOpen) recordCatalogTrial(parsed.videoId);
        } else if (decision.billablePoints > 0) {
          recordImportCharge(parsed.videoId, decision.billablePoints);
        }
        setQuotaVersion((value) => value + 1);
        replaceBaseline(cues);
        setDurationSeconds(prepared.durationSeconds);
        openWatch(
          prepared,
          { videoId: parsed.videoId, videoUrl: parsed.url },
          cues,
        );
      } catch (error) {
        // Only a newer load may leave this alone — it owns the screen now.
        // Anything else has to put the screen back, including a request that
        // was aborted: bailing out early left the loading state up for good.
        if (seq !== loadSeq.current) return;
        setPhase("input");
        setVideoId(null);
        if (abort.signal.aborted) return;
        const code =
          error instanceof VideoSubtitleClientError ? error.code : "";
        setUrlError(
            code === "NO_SPEECH" ||
            code === "NO_AUDIO"
            ? ui.videoLearnNoSpeech
            : code === "UNKNOWN_LANGUAGE"
              ? ui.videoLearnWrongLanguage
              : code === "VIDEO_QUOTA"
                ? ui.videoLearnQuotaReached
                : code === "IMPORT_LOCKED"
                  ? ui.videoLearnImportLocked
                  : code === "CATALOG_LOCKED"
                    ? ui.videoLearnCatalogLocked
                : code === "VIDEO_TOO_LONG"
                  ? ui.videoLearnTooLong.replace(
                      "{max}",
                      String(videoPrepMinutes(maxVideoPrepSeconds(isPremium))),
                    )
                  : ui.videoLearnFailed,
        );
        if (
          (code === "VIDEO_QUOTA" ||
            code === "IMPORT_LOCKED" ||
            code === "CATALOG_LOCKED") &&
          (!isPremium || (code === "CATALOG_LOCKED" && !libraryOpen))
        ) {
          openBilling();
        }
      }
    })();
  };

  // The study map can ask for a video at a scene: load it, and seek once
  // it is watchable. The ref keeps the listener on the current loadVideo.
  const loadVideoRef = useRef<((url?: string, duration?: number) => void) | null>(null);
  const pendingSeekRef = useRef<number | null>(null);
  useEffect(() => {
    loadVideoRef.current = loadVideo;
  });
  useEffect(
    () =>
      onAppIntent("openVideo", ({ url, startSeconds, durationSeconds }) => {
        pendingSeekRef.current = startSeconds ?? null;
        loadVideoRef.current?.(url, durationSeconds);
      }),
    [],
  );
  useEffect(() => {
    if (phase !== "watching" || pendingSeekRef.current == null) return;
    const seconds = pendingSeekRef.current;
    pendingSeekRef.current = null;
    // The player mounts with the watching phase; give it a moment to be ready.
    const timer = window.setTimeout(() => playerRef.current?.seekTo(seconds), 800);
    return () => window.clearTimeout(timer);
  }, [phase]);

  const durationHint = Math.max(
    durationSeconds,
    preparedRef.current?.durationSeconds ?? 0,
    englishCues.length > 0
      ? englishCues[englishCues.length - 1]!.endTime + 4
      : 70,
  );

  return (
    <div className="relative flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a]">
      <header className="flex shrink-0 items-center justify-between gap-2 border-b border-white/10 px-4 py-3">
        <div className="flex min-w-0 items-center gap-2">
          {phase !== "input" ? (
            <button
              type="button"
              onClick={reset}
              className="shrink-0 text-sm text-slate-400 hover:text-white"
            >
              {ui.videoLearnBack}
            </button>
          ) : null}
          <h1 className="truncate text-base font-semibold text-white">
            {ui.homeTabVideo}
          </h1>
        </div>
      </header>

      {phase === "input" || phase === "extracting" ? (
        <div className="min-h-0 flex-1 overflow-y-auto">
          {phase === "extracting" ? (
            <div className="sticky top-0 z-10 border-b border-white/10 bg-white/95 backdrop-blur-[2px]">
              <SubtitleGenerationStatus
                ui={ui}
                progressPercent={progressPercent}
                onCancel={cancelPreparation}
              />
            </div>
          ) : null}
          <VideoUrlInput
            ui={ui}
            value={draftUrl}
            error={urlError}
            hint={
              libraryOpen
                ? ui.videoLearnQuotaHint
                    .replace("{used}", String(getImportPointsUsed()))
                    .replace(
                      "{limit}",
                      String(monthlyImportPoints(true)),
                    )
                : ui.videoLearnQuotaHint
                    .replace(
                      "{used}",
                      String(getCatalogTrialVideoIds().length),
                    )
                    .replace("{limit}", String(FREE_CATALOG_TRIAL_COUNT))
            }
            onChange={(value) => {
              setDraftUrl(value);
              setUrlError(null);
            }}
            onSubmit={() => loadVideo()}
            library={
              <CatalogLibrary
                ui={ui}
                clips={library.clips}
                usedVideoIds={getCatalogTrialVideoIds()}
                freeVideoIds={library.trialVideoIds}
                trialLimit={FREE_CATALOG_TRIAL_COUNT}
                isPremium={libraryOpen}
                preparingVideoId={phase === "extracting" ? videoId : null}
                progressPercent={progressPercent}
                onOpen={(url, durationSeconds) => loadVideo(url, durationSeconds)}
                onLocked={() => {
                  setUrlError(ui.videoLearnCatalogLocked);
                  openBilling();
                }}
              />
            }
          >
            {isPremium ? (
            <ContentDiscoveryPanel
              ui={ui}
              locale={locale}
              targetLanguage={targetLanguage}
              fixedContentType="video"
              compact
              onSelect={(candidate) => {
                loadVideo(candidate.url, candidate.durationSeconds);
              }}
            />
            ) : null}
            <SavedVideoSessions
              ui={ui}
              sessions={savedSessions}
              onOpen={openSession}
              onDelete={onDeleteSession}
            />
          </VideoUrlInput>
        </div>
      ) : (
        <div
          className={
            watchFullscreen
              ? "fixed inset-0 z-[80] flex flex-col bg-black"
              : "flex min-h-0 flex-1 flex-col overflow-hidden"
          }
        >
          {videoId ? (
            <div
              className={
                watchFullscreen
                  ? "relative flex min-h-0 flex-1 flex-col"
                  : "relative shrink-0"
              }
            >
              <VideoPlayer
                ref={playerRef}
                videoId={videoId}
                active={active}
                autoPlay
                fill={watchFullscreen}
                hideChrome={watchFullscreen}
                durationHint={durationHint}
                onTimeUpdate={onTimeUpdate}
                onSegmentEnd={onSegmentEnded}
              />
              {!watchFullscreen ? (
                <button
                  type="button"
                  onClick={() => setWatchFullscreen(true)}
                  className="absolute right-2 top-2 z-10 rounded-lg bg-black/55 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-black/75"
                >
                  {ui.videoLearnFullscreen}
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setWatchFullscreen(false)}
                    className="absolute right-3 top-3 z-30 rounded-lg bg-black/40 px-2.5 py-1.5 text-xs font-medium text-white backdrop-blur-[2px] hover:bg-black/55"
                  >
                    {ui.videoLearnFullscreenExit}
                  </button>
                  <VideoWatchFullscreenDock
                    ui={ui}
                    cues={englishCues}
                    activeCue={displayCue}
                    playingId={playingId}
                    onPlayCue={playCueSegment}
                    onExit={() => setWatchFullscreen(false)}
                  />
                </>
              )}
            </div>
          ) : null}

          {!watchFullscreen ? (
            <div className="min-h-0 flex-1 overflow-y-auto">
              <CurrentSubtitleCard
                ui={ui}
                cue={displayCue}
                videoId={videoId}
                context={displayCue ? cueContext(displayCue) : undefined}
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
                videoId={videoId}
                contextFor={cueContext}
                activeId={selectedId ?? cue?.id ?? null}
                playingId={playingId}
                playingIds={playingIds}
                rangeIds={rangeIds}
                canUndoEdit={editHistoryLen > 0}
                lastEditKind={lastEditKind}
                canResetAllCues={editHistoryLen > 0 || canRestoreOriginal}
                onBundleRange={onBundleRange}
                onClearRange={clearRange}
                onPlaySegment={playCueSegment}
                onPlayRange={playCueRange}
                onMergeRange={onMergeRange}
                onSplitCue={onSplitCue}
                onUndoLastEdit={onUndoLastEdit}
                onResetAllCues={onResetAllCues}
              />
            </div>
          ) : null}
        </div>
      )}

      {toast ? (
        <div
          className="pointer-events-none absolute bottom-4 left-1/2 z-20 max-w-[min(90vw,20rem)] -translate-x-1/2 px-4"
          role="status"
        >
          <div className="rounded-xl border border-white/10 bg-[#121212] px-4 py-2.5 text-center text-sm text-slate-100 shadow-lg">
            {toast}
          </div>
        </div>
      ) : null}
    </div>
  );
}
