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
import { ContentDiscoveryPanel } from "@/components/contentDiscovery/ContentDiscoveryPanel";
import { useBillingUi } from "@/components/BillingScreen";
import { usePremium } from "@/contexts/PremiumContext";
import type { Locale, UICopy } from "@/lib/copy";
import {
  evaluateVideoAccess,
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
import { currentLibraryPack } from "@/lib/videoLibrary/catalog";
import { useActiveSubtitle } from "@/hooks/useActiveSubtitle";
import { parseYouTubeInput, type VideoSubtitle, cueHasUiLanguage, openingCuesHaveUiLanguage } from "@/lib/videoLearning";
import { cuesLookUserEdited, mergeVideoCues, newCueIds, splitVideoCue } from "@/lib/videoCueEdit";
import {
  generateLineInterpretations,
  glossStudyCues,
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

function shouldHoldForGloss(cues: VideoSubtitle[], time: number): boolean {
  const upcoming = cues.find(
    (cue) =>
      cue.original.trim().length > 0 &&
      cue.endTime > time + 0.05 &&
      !cueHasUiLanguage(cue),
  );
  if (!upcoming) return false;
  return upcoming.startTime <= time + 0.45;
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
  const { isPremium } = usePremium();
  const { openBilling } = useBillingUi();
  const [quotaVersion, setQuotaVersion] = useState(0);
  const targetLanguage =
    learningLanguage?.targetLanguage ?? DEFAULT_LEARNING_LANGUAGE_CODE;
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
  const [rangeIds, setRangeIds] = useState<string[]>([]);
  const [watchFullscreen, setWatchFullscreen] = useState(false);
  const preparedRef = useRef<PreparedTranscript | null>(null);
  /** Original cues before any merge/split (refreshed while untouched). */
  const baselineCuesRef = useRef<VideoSubtitle[]>([]);
  const editHistoryRef = useRef<CueEditSnapshot[]>([]);
  const [editHistoryLen, setEditHistoryLen] = useState(0);
  const [lastEditKind, setLastEditKind] = useState<CueEditKind | null>(null);
  const [canRestoreOriginal, setCanRestoreOriginal] = useState(false);
  const [waitingGloss, setWaitingGloss] = useState(false);
  /** After merge/split, ignore bulk interpretation overwrites. */
  const cuesDirtyRef = useRef(false);
  const englishCuesRef = useRef<VideoSubtitle[]>([]);
  const glossInFlightRef = useRef(false);
  const pausedForGlossRef = useRef(false);
  const pendingPlayIdRef = useRef<string | null>(null);
  const currentTimeRef = useRef(0);
  const playingIdRef = useRef<string | null>(null);
  englishCuesRef.current = englishCues;
  playingIdRef.current = playingId;

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
    setWaitingGloss(false);
    setToast(null);
    glossInFlightRef.current = false;
    pausedForGlossRef.current = false;
    pendingPlayIdRef.current = null;
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

  const startInterpretation = useCallback(
    (
      prepared: PreparedTranscript,
      seq: number,
      signal: AbortSignal,
      videoMeta: { videoId: string; videoUrl: string },
      initialCues: VideoSubtitle[],
    ) => {
      const summary = prepared.context.summary?.trim() || "";
      if (summary) setSituationSummary(summary);
      glossInFlightRef.current = true;
      let openedWatch = false;

      const openWatch = (partial: VideoSubtitle[]) => {
        if (openedWatch || seq !== loadSeq.current) return;
        openedWatch = true;
        setEnglishCues(partial);
        setProgressPercent(100);
        setPhase("watching");
        upsertVideoStudySession({
          videoId: videoMeta.videoId,
          videoUrl: videoMeta.videoUrl,
          situationSummary: summary || undefined,
          durationSeconds: prepared.durationSeconds,
          cues: partial,
          baselineCues:
            baselineCuesRef.current.length > 0
              ? baselineCuesRef.current
              : partial,
          languageCode: targetLanguage,
        });
        setSessionsVersion((value) => value + 1);
        setToast(ui.videoLearnSessionSavedToast);
      };

      const resumeIfReady = (partial: VideoSubtitle[]) => {
        const pendingId = pendingPlayIdRef.current;
        if (pendingId) {
          const pending = partial.find((cue) => cue.id === pendingId);
          if (pending && cueHasUiLanguage(pending)) {
            pendingPlayIdRef.current = null;
            setWaitingGloss(false);
            const index = partial.findIndex((cue) => cue.id === pending.id);
            const end = resolveSegmentEndFor(pending, index, partial);
            setPlayingId(pending.id);
            setPlayingIds([pending.id]);
            setCurrentTime(pending.startTime);
            playerRef.current?.playSegment(pending.startTime, end);
          }
        }
        if (pausedForGlossRef.current && !shouldHoldForGloss(partial, currentTimeRef.current)) {
          pausedForGlossRef.current = false;
          setWaitingGloss(false);
          playerRef.current?.play();
        }
      };

      void generateLineInterpretations(prepared, {
        locale,
        interfaceLanguage: locale,
        targetLanguage,
        cues: initialCues,
        signal,
        onProgress: (progress) => {
          if (seq !== loadSeq.current) return;
          setStepIndex(
            { speech: 0, context: 1, translate: 2, cleanup: 3 }[progress.step],
          );
          setProgressPercent(55 + Math.round(progress.percent * 0.4));
        },
        onPartial: (partial, done) => {
          if (seq !== loadSeq.current) return;
          if (cuesDirtyRef.current) {
            if (done) glossInFlightRef.current = false;
            return;
          }
          setEnglishCues(partial);
          if (editHistoryRef.current.length === 0) {
            baselineCuesRef.current = cloneCues(partial);
          }
          if (!openedWatch && (openingCuesHaveUiLanguage(partial) || done)) {
            openWatch(partial);
          }
          resumeIfReady(partial);
          if (done) {
            glossInFlightRef.current = false;
            if (!openedWatch) openWatch(partial);
            upsertVideoStudySession({
              videoId: videoMeta.videoId,
              videoUrl: videoMeta.videoUrl,
              situationSummary: summary || undefined,
              durationSeconds: prepared.durationSeconds,
              cues: partial,
              baselineCues:
                baselineCuesRef.current.length > 0
                  ? baselineCuesRef.current
                  : partial,
              languageCode: targetLanguage,
            });
            setSessionsVersion((value) => value + 1);
          }
        },
      }).catch((error) => {
        if (seq !== loadSeq.current || signal.aborted) return;
        glossInFlightRef.current = false;
        setWaitingGloss(false);
        if (!openedWatch) openWatch(englishCuesRef.current);
        if (
          error instanceof VideoSubtitleClientError &&
          error.code === "TIMEOUT"
        ) {
          return;
        }
      });
    },
    [locale, targetLanguage, ui.videoLearnSessionSavedToast],
  );

  const onTimeUpdate = useCallback((seconds: number) => {
    currentTimeRef.current = seconds;
    setCurrentTime(seconds);
    if (playingIdRef.current) return;
    if (!glossInFlightRef.current) {
      if (pausedForGlossRef.current) {
        pausedForGlossRef.current = false;
        setWaitingGloss(false);
        playerRef.current?.play();
      }
      return;
    }
    if (shouldHoldForGloss(englishCuesRef.current, seconds)) {
      if (!pausedForGlossRef.current) {
        pausedForGlossRef.current = true;
        setWaitingGloss(true);
        playerRef.current?.pause();
      }
      return;
    }
    if (pausedForGlossRef.current) {
      pausedForGlossRef.current = false;
      setWaitingGloss(false);
      playerRef.current?.play();
    }
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
        pendingPlayIdRef.current = null;
        return;
      }
      if (glossInFlightRef.current && !cueHasUiLanguage(item)) {
        pendingPlayIdRef.current = item.id;
        setSelectedId(item.id);
        setWaitingGloss(true);
        return;
      }
      pendingPlayIdRef.current = null;
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

      if (createdIds.length > 0) {
        const seq = loadSeq.current;
        const context =
          preparedRef.current?.context ??
          ({
            topic: situationSummary || "video",
            domain: "general",
            summary: situationSummary || "",
            speakerStyle: "spoken",
            terminology: [],
          } as PreparedTranscript["context"]);
        void glossStudyCues(next, createdIds, {
          locale,
          interfaceLanguage: locale,
          targetLanguage,
          context,
        })
          .then((glossed) => {
            if (seq !== loadSeq.current) return;
            const filled = createdIds.filter((id) =>
              glossed.some(
                (cue) => cue.id === id && cue.translation.trim().length > 0,
              ),
            );
            if (filled.length === 0) {
              console.error("[video-edit-gloss] no translations matched", {
                createdIds,
              });
              return;
            }
            setEnglishCues((current) => {
              const byId = new Map(
                glossed
                  .filter((cue) => createdIds.includes(cue.id))
                  .map((cue) => [cue.id, cue] as const),
              );
              const merged = current.map((cue) => {
                const updated = byId.get(cue.id);
                if (!updated?.translation.trim()) return cue;
                return {
                  ...cue,
                  translation: updated.translation,
                  meaning: updated.meaning,
                  literalMeaning: updated.literalMeaning,
                  translationStatus: updated.translationStatus,
                };
              });
              persistSession(merged);
              return merged;
            });
          })
          .catch((error) => {
            console.error("[video-edit-gloss]", error);
          });
      }

      return next;
    },
    [
      clearRange,
      englishCues,
      locale,
      persistSession,
      situationSummary,
      targetLanguage,
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
    setWaitingGloss(false);
    glossInFlightRef.current = false;
    pausedForGlossRef.current = false;
    pendingPlayIdRef.current = null;
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

    const decision = evaluateVideoAccess({
      isPremium,
      videoId: parsed.videoId,
      language: targetLanguage,
      durationSeconds,
      usedPoints: getImportPointsUsed(),
      billedVideoIds: getBilledImportVideoIds(),
      trialVideoIds: getCatalogTrialVideoIds(),
    });
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
          if (!isPremium) recordCatalogTrial(parsed.videoId);
        } else if (decision.billablePoints > 0) {
          recordImportCharge(parsed.videoId, decision.billablePoints);
        }
        setQuotaVersion((value) => value + 1);
        const summary = prepared.context.summary?.trim() || "";
        setEnglishCues(cues);
        replaceBaseline(cues);
        setSituationSummary(summary);
        setDurationSeconds(prepared.durationSeconds);
        setStepIndex(2);
        setProgressPercent(55);
        startInterpretation(prepared, seq, abort.signal, {
          videoId: parsed.videoId,
          videoUrl: parsed.url,
        }, cues);
      } catch (error) {
        if (seq !== loadSeq.current || abort.signal.aborted) return;
        const code =
          error instanceof VideoSubtitleClientError ? error.code : "";
        setPhase("input");
        setVideoId(null);
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
          !isPremium
        ) {
          openBilling();
        }
      }
    })();
  };

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
                stepIndex={stepIndex}
                progressPercent={progressPercent}
              />
            </div>
          ) : null}
          <VideoUrlInput
            ui={ui}
            value={draftUrl}
            error={urlError}
            hint={
              isPremium
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
                clips={currentLibraryPack(targetLanguage)?.clips ?? []}
                trialVideoIds={getCatalogTrialVideoIds()}
                isPremium={isPremium}
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
              {waitingGloss ? (
                <p className="absolute bottom-12 left-2 right-2 z-10 rounded-lg bg-black/70 px-2.5 py-1.5 text-center text-[11px] text-white">
                  {ui.videoLearnWaitingGloss}
                </p>
              ) : null}
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
