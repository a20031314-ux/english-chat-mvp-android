"use client";

import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { apiUrl } from "@/lib/apiBase";
import type { UICopy } from "@/lib/copy";
import {
  DISCOVERY_TOPIC_CATEGORIES,
  discoveryTopicLabelKey,
  type DiscoveryTopicId,
} from "@/lib/contentDiscovery/topicCategories";
import type {
  ContentCandidate,
  ContentDiscoveryType,
  PreferredDurationBucket,
} from "@/lib/contentDiscovery/types";
import type { LearningLanguageCode } from "@/lib/learningLanguages";
import type { LearnerLevel } from "@/lib/languageAnalysisPrompt";
import {
  loadSavedDiscoveryChannels,
  removeDiscoveryChannel,
  saveDiscoveryChannel,
  type SavedDiscoveryChannel,
} from "@/lib/contentDiscovery/savedChannels";
import { importPointsForDuration } from "@/lib/billing/videoPrep";
import { PointsIcon } from "@/components/PointsIcon";

const INITIAL_VISIBLE = 8;
const REVEAL_COUNT = 8;
const BUFFER_TARGET = 24;

type DiscoveryResponse = {
  candidates?: ContentCandidate[];
  warnings?: string[];
  error?: string;
  nextPageToken?: string;
  searchQuery?: string;
};

type ChannelSearchHit = {
  channelId: string;
  name: string;
  url: string;
  thumbnailUrl?: string | null;
  description?: string;
  subscriberCount?: number;
};

function formatSubscriberCount(count: number, locale: string): string {
  try {
    return new Intl.NumberFormat(locale, {
      notation: "compact",
      compactDisplay: "short",
      maximumFractionDigits: 1,
    }).format(count);
  } catch {
    if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
    if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`;
    return String(count);
  }
}

function channelAvatarSrc(url: string): string {
  try {
    const host = new URL(url).hostname.toLowerCase();
    if (
      host === "yt3.ggpht.com" ||
      host === "yt3.googleusercontent.com" ||
      host.endsWith(".ggpht.com")
    ) {
      return apiUrl(
        `/api/content-discovery/avatar?u=${encodeURIComponent(url)}`,
      );
    }
  } catch {
    return url;
  }
  return url;
}

function ChannelAvatar({
  name,
  thumbnailUrl,
  selected = false,
  size = "lg",
}: {
  name: string;
  thumbnailUrl?: string | null;
  selected?: boolean;
  size?: "sm" | "lg";
}) {
  const [broken, setBroken] = useState(false);
  useEffect(() => {
    setBroken(false);
  }, [thumbnailUrl]);
  const ring = selected
    ? "ring-2 ring-slate-900 ring-offset-2"
    : "ring-1 ring-slate-200";
  const box = size === "sm" ? "h-9 w-9 text-xs" : "h-12 w-12 text-sm";
  if (thumbnailUrl && !broken) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={channelAvatarSrc(thumbnailUrl)}
        alt=""
        referrerPolicy="no-referrer"
        onError={() => setBroken(true)}
        className={`${box} rounded-full object-cover ${ring}`}
      />
    );
  }
  return (
    <span
      className={`flex ${box} items-center justify-center rounded-full bg-white/10 font-semibold ${ring}`}
    >
      {name.slice(0, 1)}
    </span>
  );
}

function channelQueryReady(query: string): boolean {
  const q = query.trim();
  if (!q) return false;
  if (/[\uac00-\ud7af\u3040-\u30ff\u3400-\u9fff]/.test(q)) return q.length >= 1;
  return q.length >= 2;
}

function mergeUnique(
  current: ContentCandidate[],
  incoming: ContentCandidate[],
): ContentCandidate[] {
  const seen = new Set(current.map((row) => row.id));
  const next = [...current];
  for (const item of incoming) {
    if (!item?.id || seen.has(item.id)) continue;
    seen.add(item.id);
    next.push(item);
  }
  return next;
}

type ContentDiscoveryPanelProps = {
  ui: UICopy;
  locale: string;
  targetLanguage: LearningLanguageCode;
  /** Locks content type when embedded in video/read tabs. */
  fixedContentType?: ContentDiscoveryType;
  onSelect: (candidate: ContentCandidate) => void;
  compact?: boolean;
};

function formatDuration(seconds?: number): string {
  if (seconds == null || !Number.isFinite(seconds)) return "";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

function DiscoveryResultMeta({
  item,
  ui,
}: {
  item: ContentCandidate;
  ui: UICopy;
}) {
  const points =
    item.type === "video" && item.durationSeconds
      ? importPointsForDuration(item.durationSeconds)
      : null;
  const bits: Array<string | { points: number }> = [
    item.authorOrChannel,
    item.type === "video"
      ? formatDuration(item.durationSeconds)
      : item.estimatedReadingMinutes
        ? ui.discoverReadingMinutes.replace(
            "{minutes}",
            String(item.estimatedReadingMinutes),
          )
        : "",
    ...(points != null ? [{ points }] : []),
    item.hasOriginalCaptions ? ui.discoverCaptionsBadge : "",
    item.source,
  ].filter(
    (bit): bit is string | { points: number } =>
      typeof bit === "object" || Boolean(bit),
  );

  return (
    <p className="mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs text-slate-500">
      {bits.map((bit, index) => (
        <span key={index} className="inline-flex items-center gap-0.5">
          {index > 0 ? (
            <span aria-hidden className="text-slate-600">
              ·
            </span>
          ) : null}
          {typeof bit === "object" ? (
            <span
              className="inline-flex items-center gap-0.5 text-slate-200"
              aria-label={ui.discoverImportPoints.replace(
                "{n}",
                String(bit.points),
              )}
            >
              <PointsIcon />
              <span className="tabular-nums">{bit.points}</span>
            </span>
          ) : (
            bit
          )}
        </span>
      ))}
    </p>
  );
}

function warningMessage(code: string, ui: UICopy): string {
  if (code === "YOUTUBE_UNAVAILABLE" || code === "SEARCH_UNAVAILABLE") {
    return ui.discoverYoutubeUnavailable;
  }
  if (code === "YOUTUBE_QUOTA") return ui.discoverProviderQuota;
  if (
    code === "YOUTUBE_FAILED" ||
    code === "NEWS_FAILED" ||
    code === "SEARCH_FAILED"
  ) {
    return ui.discoverProviderFailed;
  }
  return ui.discoverFailed;
}

function topicLabel(ui: UICopy, id: DiscoveryTopicId): string {
  const key = discoveryTopicLabelKey(id) as keyof UICopy;
  const value = ui[key];
  return typeof value === "string" ? value : id;
}

export function ContentDiscoveryPanel({
  ui,
  locale,
  targetLanguage,
  fixedContentType,
  onSelect,
  compact = false,
}: ContentDiscoveryPanelProps) {
  const [open, setOpen] = useState(false);
  const [topicCategory, setTopicCategory] =
    useState<DiscoveryTopicId>("daily");
  const [naturalQuery, setNaturalQuery] = useState("");
  const [contentType, setContentType] = useState<ContentDiscoveryType>(
    fixedContentType || "video",
  );
  const [duration, setDuration] = useState<PreferredDurationBucket>("medium");
  const [level, setLevel] = useState<LearnerLevel | "">("");
  const [requireOriginalCaptions, setRequireOriginalCaptions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [found, setFound] = useState<ContentCandidate[]>([]);
  const [revealed, setRevealed] = useState(0);
  const [prefetching, setPrefetching] = useState(false);
  const [hasMorePages, setHasMorePages] = useState(false);
  const [channels, setChannels] = useState<SavedDiscoveryChannel[]>([]);
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(
    null,
  );
  const [channelQuery, setChannelQuery] = useState("");
  const [channelHits, setChannelHits] = useState<ChannelSearchHit[]>([]);
  const [channelSearching, setChannelSearching] = useState(false);
  const [discoverMode, setDiscoverMode] = useState<"channel" | "topic">(
    "topic",
  );
  const [channelInputFocused, setChannelInputFocused] = useState(false);
  const [suggestedChannels, setSuggestedChannels] = useState<
    SavedDiscoveryChannel[]
  >([]);
  const channelSearchSeq = useRef(0);
  const channelBlurTimer = useRef<number | null>(null);
  const nextPageTokenRef = useRef<string | null>(null);
  const searchQueryRef = useRef("");
  const channelIdRef = useRef<string | null>(null);
  const searchSeq = useRef(0);
  const prefetchingRef = useRef(false);

  const effectiveType = fixedContentType || contentType;
  const visible = found.slice(0, revealed);
  const hiddenCount = Math.max(0, found.length - revealed);
  const canReveal = hiddenCount > 0;

  const searchBody = useCallback(
    (
      pageToken?: string,
      extra?: { translatedQuery?: string; youtubeChannelId?: string },
    ) => {
      const channelId = extra?.youtubeChannelId?.trim();
      if (channelId) {
        return {
          targetLanguage,
          contentType: "video" as const,
          youtubeChannelId: channelId,
          interfaceLanguage: locale,
          locale,
          ...(pageToken ? { pageToken } : {}),
        };
      }
      const translatedQuery = extra?.translatedQuery;
      return {
        targetLanguage,
        contentType: effectiveType,
        topicCategory:
          translatedQuery || naturalQuery.trim()
            ? undefined
            : topicCategory,
        naturalQuery: translatedQuery || naturalQuery.trim() || undefined,
        preferredDuration: duration,
        learnerLevel: level || undefined,
        interfaceLanguage: locale,
        locale,
        ...(effectiveType === "video" ? { requireOriginalCaptions } : {}),
        ...(pageToken ? { pageToken } : {}),
      };
    },
    [
      duration,
      effectiveType,
      level,
      locale,
      naturalQuery,
      requireOriginalCaptions,
      targetLanguage,
      topicCategory,
    ],
  );

  const prefetchMore = useCallback(async () => {
    const token = nextPageTokenRef.current;
    const query = searchQueryRef.current;
    if (!token || prefetchingRef.current) return;
    prefetchingRef.current = true;
    setPrefetching(true);
    const seq = searchSeq.current;
    try {
      const response = await fetch(apiUrl("/api/content-discovery"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          searchBody(
            token,
            channelIdRef.current
              ? { youtubeChannelId: channelIdRef.current }
              : { translatedQuery: query },
          ),
        ),
      });
      const data = (await response.json()) as DiscoveryResponse;
      if (seq !== searchSeq.current) return;
      if (!response.ok) {
        nextPageTokenRef.current = null;
        setHasMorePages(false);
        return;
      }
      setFound((current) =>
        mergeUnique(current, Array.isArray(data.candidates) ? data.candidates : []),
      );
      nextPageTokenRef.current = data.nextPageToken?.trim() || null;
      setHasMorePages(Boolean(nextPageTokenRef.current));
    } catch {
      if (seq === searchSeq.current) {
        nextPageTokenRef.current = null;
        setHasMorePages(false);
      }
    } finally {
      if (seq === searchSeq.current) {
        prefetchingRef.current = false;
        setPrefetching(false);
      }
    }
  }, [searchBody]);

  useEffect(() => {
    if (hiddenCount >= BUFFER_TARGET) return;
    if (!nextPageTokenRef.current) return;
    void prefetchMore();
  }, [hiddenCount, found.length, prefetchMore]);

  const durationOptions = useMemo(
    () =>
      [
        { id: "short" as const, label: ui.discoverDurationShort },
        { id: "medium" as const, label: ui.discoverDurationMedium },
        { id: "long" as const, label: ui.discoverDurationLong },
        { id: "any" as const, label: ui.discoverDurationAny },
      ] as const,
    [ui],
  );

  const levelOptions = useMemo(
    () =>
      [
        { id: "" as const, label: ui.discoverLevelAny },
        { id: "beginner" as const, label: ui.discoverLevelBeginner },
        { id: "intermediate" as const, label: ui.discoverLevelIntermediate },
        { id: "advanced" as const, label: ui.discoverLevelAdvanced },
      ] as const,
    [ui],
  );

  const captionOptions = useMemo(
    () =>
      [
        { id: false as const, label: ui.discoverCaptionsAny },
        { id: true as const, label: ui.discoverCaptionsOriginal },
      ] as const,
    [ui],
  );

  const collapse = () => {
    searchSeq.current += 1;
    prefetchingRef.current = false;
    setPrefetching(false);
    setOpen(false);
    setError(null);
  };

  const clearResults = useCallback(() => {
    searchSeq.current += 1;
    prefetchingRef.current = false;
    nextPageTokenRef.current = null;
    searchQueryRef.current = "";
    channelIdRef.current = null;
    setSelectedChannelId(null);
    setFound([]);
    setRevealed(0);
    setHasMorePages(false);
    setPrefetching(false);
    setLoading(false);
    setError(null);
  }, []);

  useEffect(() => {
    clearResults();
    setChannelHits([]);
    setChannelQuery("");
    setDiscoverMode("topic");
    setChannelInputFocused(false);
    setSuggestedChannels([]);
    setChannels(loadSavedDiscoveryChannels(targetLanguage));
  }, [targetLanguage, clearResults]);

  useEffect(() => {
    if (!open || effectiveType !== "video") return;
    let cancelled = false;
    void fetch(
      apiUrl(
        `/api/content-discovery/channels?suggested=1&language=${encodeURIComponent(targetLanguage)}`,
      ),
    )
      .then(async (response) => {
        const data = (await response.json()) as {
          channels?: SavedDiscoveryChannel[];
        };
        if (cancelled) return;
        const list = Array.isArray(data.channels) ? data.channels : [];
        setSuggestedChannels(
          list.filter(
            (row): row is SavedDiscoveryChannel =>
              Boolean(row?.channelId && row?.name && row?.url),
          ),
        );
      })
      .catch(() => {
        if (!cancelled) setSuggestedChannels([]);
      });
    return () => {
      cancelled = true;
    };
  }, [open, effectiveType, targetLanguage]);

  useEffect(() => {
    if (effectiveType !== "video") setDiscoverMode("topic");
  }, [effectiveType]);

  const focusChannels = useMemo(() => {
    const savedIds = new Set(channels.map((row) => row.channelId));
    return suggestedChannels.filter((row) => !savedIds.has(row.channelId));
  }, [channels, suggestedChannels]);

  const findChannels = useCallback(
    async (rawQuery?: string, silent = false) => {
      const query = (rawQuery ?? channelQuery).trim();
      if (!channelQueryReady(query)) {
        setChannelHits([]);
        setChannelSearching(false);
        return;
      }
      const seq = ++channelSearchSeq.current;
      setChannelSearching(true);
      try {
        const response = await fetch(
          apiUrl(
            `/api/content-discovery/channels?q=${encodeURIComponent(query)}&language=${encodeURIComponent(targetLanguage)}`,
          ),
        );
        const data = (await response.json()) as {
          channels?: ChannelSearchHit[];
          warning?: string;
        };
        if (seq !== channelSearchSeq.current) return;
        if (!response.ok) {
          setChannelHits([]);
          if (!silent) setError(ui.discoverChannelSearchEmpty);
          return;
        }
        if (data.warning === "YOUTUBE_UNAVAILABLE") {
          setChannelHits([]);
          if (!silent) setError(warningMessage(data.warning, ui));
          return;
        }
        const list = Array.isArray(data.channels) ? data.channels : [];
        setChannelHits(list);
        if (list.length === 0) {
          if (!silent) setError(ui.discoverChannelSearchEmpty);
        } else {
          setError((current) =>
            current === ui.discoverChannelSearchEmpty ? null : current,
          );
        }
      } catch {
        if (seq !== channelSearchSeq.current) return;
        setChannelHits([]);
        if (!silent) setError(ui.discoverChannelSearchEmpty);
      } finally {
        if (seq === channelSearchSeq.current) setChannelSearching(false);
      }
    },
    [channelQuery, targetLanguage, ui],
  );

  useEffect(() => {
    if (discoverMode !== "channel") return;
    if (!channelQueryReady(channelQuery)) {
      channelSearchSeq.current += 1;
      setChannelHits([]);
      setChannelSearching(false);
      return;
    }
    const timer = window.setTimeout(() => {
      void findChannels(channelQuery, true);
    }, 350);
    return () => window.clearTimeout(timer);
  }, [channelQuery, discoverMode, findChannels]);

  const addChannel = (hit: ChannelSearchHit) => {
    setChannels(
      saveDiscoveryChannel(targetLanguage, {
        channelId: hit.channelId,
        name: hit.name,
        url: hit.url,
        ...(hit.thumbnailUrl ? { thumbnailUrl: hit.thumbnailUrl } : {}),
      }),
    );
  };

  const deleteChannel = (channelId: string) => {
    setChannels(removeDiscoveryChannel(targetLanguage, channelId));
    if (selectedChannelId === channelId) {
      channelIdRef.current = null;
      setSelectedChannelId(null);
    }
  };

  const search = async (
    event?: FormEvent,
    recommendedChannelId?: string,
  ) => {
    event?.preventDefault();
    const trimmedNatural = naturalQuery.trim();
    const channelId = recommendedChannelId?.trim() || "";
    if (discoverMode === "channel" && !channelId) {
      return;
    }
    if (!channelId && !topicCategory && !trimmedNatural) {
      setError(ui.discoverNeedTopic);
      return;
    }

    channelIdRef.current = channelId || null;
    setSelectedChannelId(channelId || null);
    setLoading(true);
    setError(null);
    setFound([]);
    setRevealed(0);
    setHasMorePages(false);
    nextPageTokenRef.current = null;
    searchQueryRef.current = "";
    prefetchingRef.current = false;
    setPrefetching(false);
    const seq = ++searchSeq.current;
    try {
      const response = await fetch(apiUrl("/api/content-discovery"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          searchBody(
            undefined,
            channelId ? { youtubeChannelId: channelId } : undefined,
          ),
        ),
      });
      const data = (await response.json()) as DiscoveryResponse;
      if (seq !== searchSeq.current) return;
      if (!response.ok) {
        setError(ui.discoverFailed);
        return;
      }
      const list = Array.isArray(data.candidates) ? data.candidates : [];
      setFound(list);
      setRevealed(Math.min(INITIAL_VISIBLE, list.length));
      nextPageTokenRef.current = data.nextPageToken?.trim() || null;
      setHasMorePages(Boolean(nextPageTokenRef.current));
      searchQueryRef.current = data.searchQuery?.trim() || trimmedNatural;
      if (list.length === 0) {
        const warning = data.warnings?.[0];
        setError(
          warning ? warningMessage(warning, ui) : ui.discoverEmpty,
        );
      } else {
        setError(null);
      }
    } catch {
      if (seq === searchSeq.current) setError(ui.discoverFailed);
    } finally {
      if (seq === searchSeq.current) setLoading(false);
    }
  };

  if (!open) {
    return (
      <div className={compact ? "mt-4" : "mt-6"}>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="w-full rounded-xl border border-dashed border-white/15 bg-white/5 px-4 py-3 text-sm font-medium text-slate-200 hover:bg-white/10"
        >
          {ui.discoverCta}
        </button>
        <p className="mt-2 text-center text-xs text-slate-500">
          {ui.discoverCtaHint}
        </p>
      </div>
    );
  }

  return (
    <div className={compact ? "mt-4" : "mt-6"}>
      <div className="overflow-hidden rounded-2xl border border-white/10">
        <button
          type="button"
          onClick={collapse}
          className="w-full border-b border-dashed border-white/15 bg-[#121212] px-4 py-2 text-sm font-medium text-slate-300 hover:bg-white/10"
        >
          {ui.discoverClose}
        </button>
        <div className={`bg-white/5 ${compact ? "p-3" : "p-4"}`}>
      <div>
        <p className="text-sm font-semibold text-slate-100">
          {ui.discoverTitle}
        </p>
        <p className="mt-0.5 text-xs text-slate-500">{ui.discoverSubtitle}</p>
      </div>

      {effectiveType === "video" ? (
        <div className="mt-3 flex gap-2">
          {(
            [
              { id: "channel" as const, label: ui.discoverTabChannels },
              { id: "topic" as const, label: ui.discoverTabTopics },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                if (tab.id === discoverMode) return;
                clearResults();
                setDiscoverMode(tab.id);
              }}
              className={`flex-1 rounded-xl px-3 py-2 text-sm font-medium ${
                discoverMode === tab.id
                  ? "bg-[#e8e8e4] text-neutral-900"
                  : "border border-white/15 bg-[#121212] text-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      ) : null}

      <form onSubmit={(event) => void search(event)} className="mt-3 flex flex-col gap-3">
        {effectiveType === "video" && discoverMode === "channel" ? (
          <div>
            <span className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-slate-500">
              {ui.discoverChannelSearch}
            </span>
            <div className="flex gap-2">
              <input
                value={channelQuery}
                onChange={(event) => setChannelQuery(event.target.value)}
                onFocus={() => {
                  if (channelBlurTimer.current) {
                    window.clearTimeout(channelBlurTimer.current);
                    channelBlurTimer.current = null;
                  }
                  setChannelInputFocused(true);
                }}
                onBlur={() => {
                  channelBlurTimer.current = window.setTimeout(() => {
                    setChannelInputFocused(false);
                    channelBlurTimer.current = null;
                  }, 180);
                }}
                onKeyDown={(event) => {
                  if (event.key !== "Enter") return;
                  event.preventDefault();
                  void findChannels(channelQuery, false);
                }}
                placeholder={ui.discoverChannelSearchPlaceholder}
                className="min-w-0 flex-1 rounded-xl border border-white/15 bg-[#121212] px-3 py-2 text-sm text-slate-100 outline-none focus:border-white/40"
              />
              <button
                type="button"
                onClick={() => void findChannels(channelQuery, false)}
                disabled={channelSearching}
                className="shrink-0 rounded-xl border border-white/15 bg-[#121212] px-3 py-2 text-sm font-medium text-slate-200 hover:bg-white/10 disabled:opacity-60"
              >
                {channelSearching
                  ? ui.discoverSearching
                  : ui.discoverChannelSearch}
              </button>
            </div>
            {channelHits.length > 0 ? (
              <div className="mt-2 overflow-hidden rounded-xl border border-white/10">
              <button
                type="button"
                onClick={() => {
                  channelSearchSeq.current += 1;
                  setChannelHits([]);
                  setChannelSearching(false);
                }}
                className="w-full border-b border-dashed border-white/15 bg-[#121212] px-4 py-2 text-sm font-medium text-slate-300 hover:bg-white/10"
              >
                {ui.discoverClose}
              </button>
              <ul className="divide-y divide-slate-100 bg-[#121212]">
                {channelHits.map((hit) => {
                  const added = channels.some(
                    (row) => row.channelId === hit.channelId,
                  );
                  return (
                    <li
                      key={hit.channelId}
                      className="flex items-center gap-2 px-2 py-2"
                    >
                      <button
                        type="button"
                        disabled={loading}
                        title={ui.discoverChannelOpen}
                        onClick={() => {
                          setChannelHits([]);
                          void search(undefined, hit.channelId);
                        }}
                        className="shrink-0 disabled:opacity-60"
                      >
                        <ChannelAvatar
                          name={hit.name}
                          thumbnailUrl={hit.thumbnailUrl}
                          size="sm"
                        />
                      </button>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-slate-100">
                          {hit.name}
                        </p>
                        {typeof hit.subscriberCount === "number" ? (
                          <p className="truncate text-[11px] text-slate-500">
                            {ui.discoverChannelSubscribers.replace(
                              "{count}",
                              formatSubscriberCount(
                                hit.subscriberCount,
                                locale,
                              ),
                            )}
                          </p>
                        ) : null}
                      </div>
                      <button
                        type="button"
                        disabled={added}
                        onClick={() => addChannel(hit)}
                        className="shrink-0 rounded-lg border border-white/10 px-2 py-1 text-xs font-medium text-slate-200 hover:bg-white/10 disabled:opacity-50"
                      >
                        {added
                          ? ui.discoverChannelAdded
                          : ui.discoverChannelAdd}
                      </button>
                    </li>
                  );
                })}
              </ul>
              </div>
            ) : channelInputFocused ? (
              focusChannels.length > 0 ? (
                <div
                  className="mt-2 flex gap-3 overflow-x-auto pb-1"
                  onMouseDown={(event) => event.preventDefault()}
                >
                  {focusChannels.map((channel) => {
                    const saved = channels.some(
                      (row) => row.channelId === channel.channelId,
                    );
                    const selected =
                      selectedChannelId === channel.channelId;
                    return (
                      <div
                        key={channel.channelId}
                        className={`flex w-16 shrink-0 flex-col items-center ${
                          selected ? "text-slate-100" : "text-slate-300"
                        }`}
                      >
                        <div className="relative">
                          <button
                            type="button"
                            disabled={loading}
                            title={ui.discoverChannelOpen}
                            onClick={() =>
                              void search(undefined, channel.channelId)
                            }
                            className="block disabled:opacity-60"
                          >
                            <ChannelAvatar
                              name={channel.name}
                              thumbnailUrl={channel.thumbnailUrl}
                              selected={selected}
                            />
                          </button>
                          {saved ? (
                            <button
                              type="button"
                              title={ui.discoverChannelRemove}
                              onClick={() =>
                                deleteChannel(channel.channelId)
                              }
                              className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-slate-800 text-[10px] leading-none text-white"
                            >
                              ×
                            </button>
                          ) : (
                            <button
                              type="button"
                              title={ui.discoverChannelAdd}
                              onClick={() =>
                                addChannel({
                                  channelId: channel.channelId,
                                  name: channel.name,
                                  url: channel.url,
                                  thumbnailUrl: channel.thumbnailUrl,
                                })
                              }
                              className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-slate-800 text-[10px] leading-none text-white"
                            >
                              +
                            </button>
                          )}
                        </div>
                        <button
                          type="button"
                          disabled={loading}
                          onClick={() =>
                            void search(undefined, channel.channelId)
                          }
                          className="mt-1 w-full truncate text-center text-[10px] leading-tight hover:underline disabled:opacity-60"
                        >
                          {channel.name}
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="mt-2 text-xs text-slate-500">
                  {ui.discoverChannelEmpty}
                </p>
              )
            ) : null}

            <span className="mb-1 mt-3 block text-[11px] font-medium uppercase tracking-wide text-slate-500">
              {ui.discoverChannelsLabel}
            </span>
            {channels.length > 0 ? (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {channels.map((channel) => {
                  const selected = selectedChannelId === channel.channelId;
                  return (
                    <div
                      key={channel.channelId}
                      className={`flex w-16 shrink-0 flex-col items-center ${
                        selected ? "text-slate-100" : "text-slate-300"
                      }`}
                    >
                      <div className="relative">
                        <button
                          type="button"
                          disabled={loading}
                          title={ui.discoverChannelOpen}
                          onClick={() =>
                            void search(undefined, channel.channelId)
                          }
                          className="block disabled:opacity-60"
                        >
                          <ChannelAvatar
                            name={channel.name}
                            thumbnailUrl={channel.thumbnailUrl}
                            selected={selected}
                          />
                        </button>
                        <button
                          type="button"
                          title={ui.discoverChannelRemove}
                          onClick={() => deleteChannel(channel.channelId)}
                          className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-slate-800 text-[10px] leading-none text-white"
                        >
                          ×
                        </button>
                      </div>
                      <button
                        type="button"
                        disabled={loading}
                        onClick={() =>
                          void search(undefined, channel.channelId)
                        }
                        className="mt-1 w-full truncate text-center text-[10px] leading-tight hover:underline disabled:opacity-60"
                      >
                        {channel.name}
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-slate-500">
                {ui.discoverChannelEmpty}
              </p>
            )}
          </div>
        ) : null}

        {discoverMode === "topic" || effectiveType !== "video" ? (
        <>
        <div>
          <span className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-slate-500">
            {ui.discoverTopicLabel}
          </span>
          <div className="flex max-h-36 flex-wrap gap-2 overflow-y-auto">
            {DISCOVERY_TOPIC_CATEGORIES.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => setTopicCategory(category.id)}
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  topicCategory === category.id
                    ? "bg-[#e8e8e4] text-neutral-900"
                    : "border border-white/15 bg-[#121212] text-slate-200"
                }`}
              >
                {topicLabel(ui, category.id)}
              </button>
            ))}
          </div>
        </div>

        <label className="block">
          <span className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-slate-500">
            {ui.discoverNaturalLabel}
          </span>
          <input
            value={naturalQuery}
            onChange={(event) => setNaturalQuery(event.target.value)}
            placeholder={ui.discoverNaturalPlaceholder}
            className="w-full rounded-xl border border-white/15 bg-[#121212] px-3 py-2 text-sm text-slate-100 outline-none focus:border-white/40"
          />
        </label>

        {!fixedContentType ? (
          <div className="flex gap-2">
            {(
              [
                { id: "video" as const, label: ui.discoverTypeVideo },
                { id: "reading" as const, label: ui.discoverTypeReading },
              ] as const
            ).map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setContentType(option.id)}
                className={`flex-1 rounded-xl px-3 py-2 text-sm font-medium ${
                  contentType === option.id
                    ? "bg-[#e8e8e4] text-neutral-900"
                    : "border border-white/15 bg-[#121212] text-slate-200"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        ) : null}

        <div>
          <span className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-slate-500">
            {ui.discoverDurationLabel}
          </span>
          <div className="flex flex-wrap gap-2">
            {durationOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setDuration(option.id)}
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  duration === option.id
                    ? "bg-[#e8e8e4] text-neutral-900"
                    : "border border-white/15 bg-[#121212] text-slate-200"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <span className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-slate-500">
            {ui.discoverLevelLabel}
          </span>
          <div className="flex flex-wrap gap-2">
            {levelOptions.map((option) => (
              <button
                key={option.id || "any"}
                type="button"
                onClick={() => setLevel(option.id)}
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  level === option.id
                    ? "bg-[#e8e8e4] text-neutral-900"
                    : "border border-white/15 bg-[#121212] text-slate-200"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {effectiveType === "video" ? (
          <div>
            <span className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-slate-500">
              {ui.discoverCaptionsLabel}
            </span>
            <div className="flex flex-wrap gap-2">
              {captionOptions.map((option) => (
                <button
                  key={String(option.id)}
                  type="button"
                  onClick={() => setRequireOriginalCaptions(option.id)}
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    requireOriginalCaptions === option.id
                      ? "bg-[#e8e8e4] text-neutral-900"
                      : "border border-white/15 bg-[#121212] text-slate-200"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-[#e8e8e4] shadow-[0_0_14px_rgba(255,255,255,0.28)] px-4 py-2.5 text-sm font-medium text-neutral-900 hover:bg-[#f5f5f3] disabled:opacity-60"
        >
          {loading ? ui.discoverSearching : ui.discoverSearch}
        </button>
        </>
        ) : null}
      </form>

      {error ? (
        <p className="mt-3 text-center text-sm text-rose-300">{error}</p>
      ) : null}

      {visible.length > 0 ? (
        <div
          className={
            discoverMode === "channel"
              ? "mt-4 overflow-hidden rounded-2xl border border-white/10"
              : ""
          }
        >
          {discoverMode === "channel" ? (
            <button
              type="button"
              onClick={clearResults}
              className="w-full border-b border-dashed border-white/15 bg-[#121212] px-4 py-2 text-sm font-medium text-slate-300 hover:bg-white/10"
            >
              {ui.discoverClose}
            </button>
          ) : null}
          <ul
            className={`space-y-3 ${
              discoverMode === "channel" ? "p-3" : "mt-4"
            }`}
          >
          {visible.map((item) => (
            <li
              key={item.id}
              className="overflow-hidden rounded-2xl border border-white/10 bg-[#121212]"
            >
              {item.thumbnail ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.thumbnail}
                  alt=""
                  referrerPolicy="no-referrer"
                  className="h-36 w-full object-cover"
                />
              ) : null}
              <div className="p-3">
                <p className="text-sm font-semibold leading-snug text-slate-100">
                  {item.title}
                </p>
                <DiscoveryResultMeta item={item} ui={ui} />
                {item.preview ? (
                  <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-300">
                    {item.preview}
                  </p>
                ) : null}
                {item.learningReason ? (
                  <p className="mt-2 text-xs leading-relaxed text-emerald-800">
                    {item.learningReason}
                  </p>
                ) : null}
                <div className="mt-3 flex gap-2">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 rounded-xl border border-white/10 bg-[#121212] px-3 py-2 text-center text-sm font-medium text-slate-200 hover:bg-white/10"
                  >
                    {item.type === "video"
                      ? ui.discoverOpenPreview
                      : ui.discoverOpenRead}
                  </a>
                  <button
                    type="button"
                    onClick={() => onSelect(item)}
                    className="flex-1 rounded-xl bg-[#e8e8e4] shadow-[0_0_14px_rgba(255,255,255,0.28)] px-3 py-2 text-sm font-medium text-neutral-900 hover:bg-[#f5f5f3]"
                  >
                    {ui.discoverLearn}
                  </button>
                </div>
              </div>
            </li>
          ))}
          </ul>
          {canReveal || hasMorePages || prefetching ? (
            <button
              type="button"
              disabled={!canReveal}
              onClick={() => {
                setRevealed((count) =>
                  Math.min(found.length, count + REVEAL_COUNT),
                );
                if (hiddenCount - REVEAL_COUNT < BUFFER_TARGET) {
                  void prefetchMore();
                }
              }}
              className={`rounded-xl border border-white/15 bg-[#121212] px-4 py-2 text-sm font-medium text-slate-200 hover:bg-white/10 disabled:opacity-60 ${
                discoverMode === "channel"
                  ? "mx-3 mb-3 w-[calc(100%-1.5rem)]"
                  : "mt-3 w-full"
              }`}
            >
              {canReveal ? ui.discoverMore : ui.discoverFindingMore}
            </button>
          ) : null}
          {discoverMode === "channel" ? (
            <button
              type="button"
              onClick={clearResults}
              className="w-full border-t border-dashed border-white/15 bg-[#121212] px-4 py-2 text-sm font-medium text-slate-300 hover:bg-white/10"
            >
              {ui.discoverClose}
            </button>
          ) : null}
        </div>
      ) : null}
        </div>
      </div>
    </div>
  );
}
