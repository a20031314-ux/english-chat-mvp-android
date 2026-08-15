"use client";

import { FormEvent, useMemo, useState } from "react";
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

function warningMessage(code: string, ui: UICopy): string {
  if (code === "YOUTUBE_UNAVAILABLE") return ui.discoverYoutubeUnavailable;
  if (code === "YOUTUBE_QUOTA") return ui.discoverProviderQuota;
  if (code === "YOUTUBE_FAILED" || code === "NEWS_FAILED") {
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
  const [candidates, setCandidates] = useState<ContentCandidate[]>([]);

  const effectiveType = fixedContentType || contentType;

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

  const search = async (event?: FormEvent) => {
    event?.preventDefault();
    const trimmedNatural = naturalQuery.trim();
    if (!topicCategory && !trimmedNatural) {
      setError(ui.discoverNeedTopic);
      return;
    }

    setLoading(true);
    setError(null);
    setCandidates([]);
    try {
      const response = await fetch(apiUrl("/api/content-discovery"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetLanguage,
          contentType: effectiveType,
          topicCategory,
          naturalQuery: trimmedNatural || undefined,
          preferredDuration: duration,
          learnerLevel: level || undefined,
          interfaceLanguage: locale,
          locale,
          ...(effectiveType === "video"
            ? { requireOriginalCaptions }
            : {}),
        }),
      });
      const data = (await response.json()) as {
        candidates?: ContentCandidate[];
        warnings?: string[];
        error?: string;
      };
      if (!response.ok) {
        setError(ui.discoverFailed);
        return;
      }
      const list = Array.isArray(data.candidates) ? data.candidates : [];
      setCandidates(list);
      if (list.length === 0) {
        const warning = data.warnings?.[0];
        setError(
          warning ? warningMessage(warning, ui) : ui.discoverEmpty,
        );
      } else if (data.warnings?.length) {
        setError(null);
      }
    } catch {
      setError(ui.discoverFailed);
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return (
      <div className={compact ? "mt-4" : "mt-6"}>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="w-full rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100"
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
    <div
      className={`rounded-2xl border border-slate-200 bg-slate-50 ${
        compact ? "mt-4 p-3" : "mt-6 p-4"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-slate-900">
            {ui.discoverTitle}
          </p>
          <p className="mt-0.5 text-xs text-slate-500">{ui.discoverSubtitle}</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            setError(null);
          }}
          className="rounded-lg px-2 py-1 text-xs text-slate-500 hover:bg-white"
        >
          {ui.discoverClose}
        </button>
      </div>

      <form onSubmit={search} className="mt-3 flex flex-col gap-3">
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
                    ? "bg-slate-900 text-white"
                    : "border border-slate-300 bg-white text-slate-700"
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
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500"
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
                    ? "bg-slate-900 text-white"
                    : "border border-slate-300 bg-white text-slate-700"
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
                    ? "bg-slate-900 text-white"
                    : "border border-slate-300 bg-white text-slate-700"
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
                    ? "bg-slate-900 text-white"
                    : "border border-slate-300 bg-white text-slate-700"
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
                      ? "bg-slate-900 text-white"
                      : "border border-slate-300 bg-white text-slate-700"
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
          className="w-full rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
        >
          {loading ? ui.discoverSearching : ui.discoverSearch}
        </button>
      </form>

      {error ? (
        <p className="mt-3 text-center text-sm text-rose-700">{error}</p>
      ) : null}

      {candidates.length > 0 ? (
        <ul className="mt-4 space-y-3">
          {candidates.map((item) => (
            <li
              key={item.id}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
            >
              {item.thumbnail ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.thumbnail}
                  alt=""
                  className="h-36 w-full object-cover"
                />
              ) : null}
              <div className="p-3">
                <p className="text-sm font-semibold leading-snug text-slate-900">
                  {item.title}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {[
                    item.authorOrChannel,
                    item.type === "video"
                      ? formatDuration(item.durationSeconds)
                      : item.estimatedReadingMinutes
                        ? ui.discoverReadingMinutes.replace(
                            "{minutes}",
                            String(item.estimatedReadingMinutes),
                          )
                        : "",
                    item.hasOriginalCaptions ? ui.discoverCaptionsBadge : "",
                    item.source,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
                {item.preview ? (
                  <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-600">
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
                    className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-center text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    {item.type === "video"
                      ? ui.discoverOpenPreview
                      : ui.discoverOpenRead}
                  </a>
                  <button
                    type="button"
                    onClick={() => onSelect(item)}
                    className="flex-1 rounded-xl bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800"
                  >
                    {ui.discoverLearn}
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
