"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { AnalyzableEnglish } from "@/components/AnalyzableEnglish";
import { SegmentPlayButton } from "@/components/videoLearning/SegmentPlayButton";
import type { UICopy } from "@/lib/copy";
import { cutOffsetFromRatio } from "@/lib/videoCueEdit";
import type { VideoSubtitle } from "@/lib/videoLearning";
import { formatSubtitleTime } from "@/lib/videoLearning";

function previewParts(
  original: string,
  ratio: number,
): {
  left: string;
  right: string;
  cut: number | null;
} {
  const text = original.replace(/\s+/g, " ").trim();
  const cut = cutOffsetFromRatio(text, ratio);
  if (cut == null) {
    return { left: text, right: "", cut: null };
  }
  return {
    left: text.slice(0, cut).trim(),
    right: text.slice(cut).trim(),
    cut,
  };
}

/** Vertical gauge: whole list is the track; drag up/down from the anchor cue. */
function BundleRangeGauge({
  total,
  anchor,
  from,
  to,
  upLabel,
  downLabel,
  ariaLabel,
  onChange,
}: {
  total: number;
  anchor: number;
  from: number;
  to: number;
  upLabel: string;
  downLabel: string;
  ariaLabel: string;
  onChange: (from: number, to: number) => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragMode = useRef<"from" | "to" | null>(null);
  const fromRef = useRef(from);
  const toRef = useRef(to);
  fromRef.current = from;
  toRef.current = to;

  const indexFromClientY = (clientY: number) => {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect || total <= 0) return anchor;
    const t = (clientY - rect.top) / Math.max(1, rect.height);
    return Math.max(0, Math.min(total - 1, Math.floor(t * total)));
  };

  const applyPointer = (clientY: number, mode: "from" | "to" | "auto") => {
    const index = indexFromClientY(clientY);
    if (mode === "from" || (mode === "auto" && index <= anchor)) {
      onChange(Math.min(index, anchor), toRef.current);
      return;
    }
    onChange(fromRef.current, Math.max(index, anchor));
  };

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    const index = indexFromClientY(event.clientY);
    const mode = index <= anchor ? "from" : "to";
    dragMode.current = mode;
    applyPointer(event.clientY, mode);
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragMode.current) return;
    applyPointer(event.clientY, dragMode.current);
  };

  const onPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    dragMode.current = null;
    try {
      event.currentTarget.releasePointerCapture(event.pointerId);
    } catch {
      // ignore
    }
  };

  const heightPx = Math.min(220, Math.max(112, total * 14));

  return (
    <div className="flex items-stretch gap-3">
      <div className="flex w-8 flex-col items-center justify-between py-0.5 text-[10px] text-slate-400">
        <span>{upLabel}</span>
        <span>{downLabel}</span>
      </div>
      <div
        ref={trackRef}
        role="slider"
        tabIndex={0}
        aria-label={ariaLabel}
        aria-valuemin={0}
        aria-valuemax={Math.max(0, total - 1)}
        aria-valuenow={anchor}
        aria-valuetext={`${from + 1}–${to + 1} / ${total}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onKeyDown={(event) => {
          if (event.key === "ArrowUp") {
            event.preventDefault();
            onChange(Math.max(0, from - 1), to);
          } else if (event.key === "ArrowDown") {
            event.preventDefault();
            onChange(from, Math.min(total - 1, to + 1));
          } else if (event.key === "ArrowLeft") {
            event.preventDefault();
            onChange(Math.min(from + 1, anchor), to);
          } else if (event.key === "ArrowRight") {
            event.preventDefault();
            onChange(from, Math.max(to - 1, anchor));
          }
        }}
        className="relative w-10 shrink-0 cursor-ns-resize touch-none rounded-full bg-white/10 ring-1 ring-white/15"
        style={{ height: heightPx }}
      >
        {/* Full-list texture: one tick per cue */}
        <div className="pointer-events-none absolute inset-x-1.5 inset-y-1 flex flex-col justify-between">
          {Array.from({ length: total }, (_, index) => (
            <span
              key={index}
              className={`mx-auto block h-0.5 w-full rounded-full ${
                index >= from && index <= to ? "bg-slate-400/40" : "bg-slate-300/70"
              }`}
            />
          ))}
        </div>

        {/* Selected band */}
        <div
          className="pointer-events-none absolute inset-x-0 rounded-full bg-white/80"
          style={{
            top: `${(from / total) * 100}%`,
            height: `${((to - from + 1) / total) * 100}%`,
          }}
        />

        {/* Current cue marker */}
        <div
          className="pointer-events-none absolute left-1/2 z-10 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-rose-500 ring-2 ring-white"
          style={{
            top: `${((anchor + 0.5) / total) * 100}%`,
          }}
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-1 text-[11px] leading-snug text-slate-500">
        <p>
          {from + 1}–{to + 1}
          <span className="text-slate-400"> / {total}</span>
        </p>
        <p className="text-slate-400">
          #{anchor + 1}
        </p>
      </div>
    </div>
  );
}

export function EnglishSentenceList({
  ui,
  cues,
  activeId,
  playingId,
  playingIds,
  rangeIds,
  canUndoEdit = false,
  lastEditKind = null,
  canResetAllCues = false,
  onBundleRange,
  onClearRange,
  onPlaySegment,
  onPlayRange,
  onMergeRange,
  onSplitCue,
  onUndoLastEdit,
  onResetAllCues,
}: {
  ui: UICopy;
  cues: VideoSubtitle[];
  activeId: string | null;
  playingId: string | null;
  playingIds: string[];
  rangeIds: string[];
  canUndoEdit?: boolean;
  lastEditKind?: "merge" | "split" | null;
  canResetAllCues?: boolean;
  onBundleRange: (ids: string[]) => void;
  onClearRange: () => void;
  onPlaySegment: (cue: VideoSubtitle) => void;
  onPlayRange: (ids: string[]) => void;
  onMergeRange: (ids: string[]) => void;
  onSplitCue: (cue: VideoSubtitle, cutOffset: number) => void;
  onUndoLastEdit?: () => void;
  onResetAllCues?: () => void;
}) {
  const [splittingId, setSplittingId] = useState<string | null>(null);
  const [splitRatio, setSplitRatio] = useState(0.5);
  const [bundlingId, setBundlingId] = useState<string | null>(null);
  const [bundleFrom, setBundleFrom] = useState(0);
  const [bundleTo, setBundleTo] = useState(0);

  useEffect(() => {
    if (splittingId && !cues.some((cue) => cue.id === splittingId)) {
      setSplittingId(null);
    }
  }, [cues, splittingId]);

  useEffect(() => {
    if (bundlingId && !cues.some((cue) => cue.id === bundlingId)) {
      setBundlingId(null);
      onClearRange();
    }
  }, [bundlingId, cues, onClearRange]);

  const splittingCue = useMemo(
    () => cues.find((cue) => cue.id === splittingId) ?? null,
    [cues, splittingId],
  );
  const splitPreview = useMemo(
    () =>
      splittingCue
        ? previewParts(splittingCue.original, splitRatio)
        : { left: "", right: "", cut: null },
    [splittingCue, splitRatio],
  );

  const bundlingIndex = useMemo(() => {
    if (!bundlingId) return -1;
    return cues.findIndex((cue) => cue.id === bundlingId);
  }, [bundlingId, cues]);

  const syncBundleRange = (from: number, to: number) => {
    const lo = Math.max(0, Math.min(from, to));
    const hi = Math.min(cues.length - 1, Math.max(from, to));
    setBundleFrom(lo);
    setBundleTo(hi);
    onBundleRange(cues.slice(lo, hi + 1).map((cue) => cue.id));
  };

  /** Click another cue while bundling: expand range to include it (keeps the other end). */
  const selectCueIntoBundle = (index: number) => {
    if (bundlingIndex < 0 || index < 0) return;
    if (index === bundlingIndex) {
      syncBundleRange(bundlingIndex, bundlingIndex);
      return;
    }
    // Already an endpoint → tap again to shrink that side back toward the anchor.
    if (index === bundleFrom && index < bundlingIndex) {
      syncBundleRange(Math.min(index + 1, bundlingIndex), bundleTo);
      return;
    }
    if (index === bundleTo && index > bundlingIndex) {
      syncBundleRange(bundleFrom, Math.max(index - 1, bundlingIndex));
      return;
    }
    syncBundleRange(
      Math.min(bundleFrom, index, bundlingIndex),
      Math.max(bundleTo, index, bundlingIndex),
    );
  };

  if (cues.length === 0) {
    return (
      <div className="px-4 py-6 text-center text-sm text-slate-500">
        {ui.videoLearnStudyEmpty}
      </div>
    );
  }

  const rangeSet = new Set(rangeIds);
  const playingSet = new Set(playingIds);
  const canPlayRange = rangeIds.length >= 2;
  const canMergeRange = rangeIds.length >= 2;

  const beginSplit = (cue: VideoSubtitle) => {
    setBundlingId(null);
    onClearRange();
    setSplittingId(cue.id);
    setSplitRatio(0.5);
  };

  const beginBundle = (cue: VideoSubtitle) => {
    const index = cues.findIndex((row) => row.id === cue.id);
    if (index < 0) return;
    setSplittingId(null);
    setBundlingId(cue.id);
    setBundleFrom(index);
    setBundleTo(index);
    onBundleRange([cue.id]);
  };

  const confirmSplit = () => {
    if (!splittingCue || splitPreview.cut == null) return;
    onSplitCue(splittingCue, splitPreview.cut);
    setSplittingId(null);
  };

  const closeBundle = () => {
    setBundlingId(null);
    onClearRange();
  };

  return (
    <div className="border-t border-white/10 px-4 py-3">
      <p className="text-[11px] leading-snug text-slate-400">
        {bundlingId
          ? ui.videoLearnBundleClickHint
          : `${ui.videoLearnRangeHint} ${ui.videoLearnSplitHint}`}
      </p>
      {canUndoEdit || canResetAllCues ? (
        <div className="mt-2 flex flex-wrap gap-2">
          {canUndoEdit && onUndoLastEdit ? (
            <button
              type="button"
              onClick={onUndoLastEdit}
              className="rounded-lg border border-white/15 bg-[#121212] px-2.5 py-1.5 text-xs font-medium text-slate-100 hover:bg-white/10"
            >
              {lastEditKind === "merge"
                ? ui.videoLearnUndoMerge
                : lastEditKind === "split"
                  ? ui.videoLearnUndoSplit
                  : ui.videoLearnUndoEdit}
            </button>
          ) : null}
          {canResetAllCues && onResetAllCues ? (
            <button
              type="button"
              onClick={onResetAllCues}
              className="rounded-lg border border-white/15 bg-[#121212] px-2.5 py-1.5 text-xs font-medium text-slate-100 hover:bg-white/10"
            >
              {ui.videoLearnResetAllCues}
            </button>
          ) : null}
        </div>
      ) : null}
      <ul className="mt-3 space-y-2">
        {cues.map((cue, cueIndex) => {
          const active = cue.id === activeId;
          const playing = cue.id === playingId || playingSet.has(cue.id);
          const inRange = rangeSet.has(cue.id);
          const interpretation = cue.translation.trim();
          const isSplitting = cue.id === splittingId;
          const isBundling = cue.id === bundlingId;
          const bundlePicking = Boolean(bundlingId);
          const editing = isSplitting || isBundling;
          const rangeActive = inRange && bundlePicking;
          const highlighted =
            !editing && (active || playing || rangeActive);
          const canSplit = cue.endTime - cue.startTime >= 0.8;
          const canBundle = cues.length >= 2;

          return (
            <li key={cue.id}>
              <div
                role={isSplitting ? undefined : "button"}
                tabIndex={isSplitting ? undefined : 0}
                onClick={() => {
                  if (isSplitting) return;
                  if (bundlePicking) {
                    selectCueIntoBundle(cueIndex);
                    return;
                  }
                  onPlaySegment(cue);
                }}
                onKeyDown={(event) => {
                  if (isSplitting) return;
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    if (bundlePicking) {
                      selectCueIntoBundle(cueIndex);
                      return;
                    }
                    onPlaySegment(cue);
                  }
                }}
                className={`rounded-xl px-3 py-2.5 text-left transition ${
                  isBundling
                    ? "bg-[#121212] ring-2 ring-white/50"
                    : isSplitting
                      ? "bg-[#121212] ring-1 ring-white/20"
                      : inRange && bundlePicking
                        ? "cursor-pointer bg-[#e8e8e4] text-neutral-900 ring-2 ring-white/50"
                        : highlighted
                          ? "cursor-pointer bg-[#e8e8e4] text-neutral-900"
                          : bundlePicking
                            ? "cursor-pointer bg-white/5 ring-1 ring-white/15 hover:ring-white/40"
                            : "cursor-pointer bg-white/5 hover:bg-white/10"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <p
                    className={`text-[11px] tabular-nums ${
                      highlighted ? "text-neutral-500" : "text-slate-400"
                    }`}
                  >
                    {formatSubtitleTime(cue.startTime)}
                    {" – "}
                    {formatSubtitleTime(cue.endTime)}
                  </p>
                  <div className="flex shrink-0 items-center gap-1">
                    {!editing && !bundlePicking && canBundle ? (
                      <button
                        type="button"
                        title={ui.videoLearnRangeHint}
                        onClick={(event) => {
                          event.stopPropagation();
                          beginBundle(cue);
                        }}
                        className={`rounded-md px-1.5 py-0.5 text-[10px] font-medium ${
                          highlighted
                            ? "bg-black/10 text-neutral-800 hover:bg-black/15"
                            : "bg-[#121212] text-slate-300 hover:bg-white/10"
                        }`}
                      >
                        {ui.videoLearnRangeMode}
                      </button>
                    ) : null}
                    {!editing && !bundlePicking && canSplit ? (
                      <button
                        type="button"
                        title={ui.videoLearnSplitHint}
                        onClick={(event) => {
                          event.stopPropagation();
                          beginSplit(cue);
                        }}
                        className={`rounded-md px-1.5 py-0.5 text-[10px] font-medium ${
                          highlighted
                            ? "bg-black/10 text-neutral-800 hover:bg-black/15"
                            : "bg-[#121212] text-slate-300 hover:bg-white/10"
                        }`}
                      >
                        {ui.videoLearnSplitCue}
                      </button>
                    ) : null}
                    {!editing && !bundlePicking ? (
                      <SegmentPlayButton
                        ariaLabel={ui.listen}
                        playing={playing}
                        onPlay={() => onPlaySegment(cue)}
                        tone={highlighted ? "onDark" : "light"}
                      />
                    ) : null}
                    {bundlePicking && inRange ? (
                      <span
                        className={`rounded-md px-1.5 py-0.5 text-[10px] font-medium ${
                          highlighted
                            ? "bg-white/20 text-white"
                            : "bg-white/10 text-neutral-200"
                        }`}
                      >
                        {isBundling ? `#${cueIndex + 1}` : "✓"}
                      </span>
                    ) : null}
                  </div>
                </div>

                {isBundling && bundlingIndex >= 0 ? (
                  <div
                    className="mt-3 space-y-3"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <p className="text-[11px] leading-snug text-slate-500">
                      {ui.videoLearnBundleGaugeHint} {ui.videoLearnBundleClickHint}
                    </p>
                    <BundleRangeGauge
                      total={cues.length}
                      anchor={bundlingIndex}
                      from={bundleFrom}
                      to={bundleTo}
                      upLabel={ui.videoLearnBundleUp}
                      downLabel={ui.videoLearnBundleDown}
                      ariaLabel={ui.videoLearnBundleGaugeHint}
                      onChange={syncBundleRange}
                    />
                    <p className="line-clamp-3 text-[12px] leading-snug text-slate-300">
                      {cues
                        .slice(bundleFrom, bundleTo + 1)
                        .map((row) => row.original.trim())
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        disabled={!canPlayRange}
                        onClick={() => onPlayRange(rangeIds)}
                        className="rounded-lg bg-[#e8e8e4] shadow-[0_0_12px_rgba(255,255,255,0.22)] px-2.5 py-1.5 text-xs font-medium text-neutral-900 hover:bg-[#f5f5f3] disabled:opacity-50"
                      >
                        {ui.videoLearnPlayRange}
                      </button>
                      <button
                        type="button"
                        disabled={!canMergeRange}
                        onClick={() => {
                          onMergeRange(rangeIds);
                          setBundlingId(null);
                        }}
                        className="rounded-lg border border-white/15 bg-[#121212] px-2.5 py-1.5 text-xs font-medium text-slate-100 hover:bg-white/10 disabled:opacity-50"
                      >
                        {ui.videoLearnMergeCues}
                      </button>
                      <button
                        type="button"
                        onClick={closeBundle}
                        className="rounded-lg px-2.5 py-1.5 text-xs text-slate-500 hover:bg-white/10"
                      >
                        {ui.videoLearnClearRange}
                      </button>
                      {canResetAllCues && onResetAllCues ? (
                        <button
                          type="button"
                          onClick={() => {
                            closeBundle();
                            onResetAllCues();
                          }}
                          className="rounded-lg border border-white/15 bg-[#121212] px-2.5 py-1.5 text-xs font-medium text-slate-100 hover:bg-white/10"
                        >
                          {ui.videoLearnResetAllCues}
                        </button>
                      ) : null}
                    </div>
                  </div>
                ) : isSplitting ? (
                  <div
                    className="mt-2 space-y-3"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <p className="text-[11px] leading-snug text-slate-500">
                      {ui.videoLearnSplitSliderHint}
                    </p>
                    <p className="text-sm leading-snug">
                      <span className="font-medium text-slate-100">
                        {splitPreview.left}
                      </span>
                      <span className="mx-1 inline-block h-4 w-px align-middle bg-rose-500" />
                      <span className="text-slate-400">{splitPreview.right}</span>
                    </p>
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[10px] uppercase tracking-wide text-slate-400">
                        <span>{ui.videoLearnSplitFront}</span>
                        <span>{ui.videoLearnSplitBack}</span>
                      </div>
                      <input
                        type="range"
                        min={8}
                        max={92}
                        step={1}
                        value={Math.round(splitRatio * 100)}
                        aria-label={ui.videoLearnSplitSliderHint}
                        onChange={(event) =>
                          setSplitRatio(Number(event.target.value) / 100)
                        }
                        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-white/15 accent-neutral-200 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#e8e8e4]"
                      />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        disabled={splitPreview.cut == null}
                        onClick={confirmSplit}
                        className="rounded-lg bg-[#e8e8e4] shadow-[0_0_12px_rgba(255,255,255,0.22)] px-2.5 py-1.5 text-xs font-medium text-neutral-900 hover:bg-[#f5f5f3] disabled:opacity-50"
                      >
                        {ui.videoLearnSplitConfirm}
                      </button>
                      <button
                        type="button"
                        onClick={() => setSplittingId(null)}
                        className="rounded-lg px-2.5 py-1.5 text-xs text-slate-500 hover:bg-white/10"
                      >
                        {ui.videoLearnSplitCancel}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-1.5">
                    <AnalyzableEnglish
                      sentence={cue.original}
                      analyzeLabel={ui.insightAnalyze}
                      sourceType="subtitle"
                      translation={interpretation || undefined}
                      analysisTranslation={cue.analysisTranslation}
                      tone={
                        highlighted || (inRange && bundlePicking)
                          ? "default"
                          : "onDark"
                      }
                      className={`text-sm leading-snug ${
                        highlighted || (inRange && bundlePicking)
                          ? "font-medium text-neutral-900"
                          : "text-slate-100"
                      }`}
                    />
                    {interpretation ? (
                      <p
                        className={`mt-1.5 text-[13px] leading-snug ${
                            highlighted || (inRange && bundlePicking)
                            ? "text-neutral-700"
                            : "text-slate-300"
                        }`}
                      >
                        {interpretation}
                      </p>
                    ) : null}
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
