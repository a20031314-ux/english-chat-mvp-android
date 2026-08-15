"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { useExpressionInsightOptional } from "@/contexts/ExpressionInsightContext";
import { useEnglishAnalysisOptional } from "@/contexts/EnglishAnalysisContext";
import { useLearningLanguageOptional } from "@/contexts/LearningLanguageContext";
import { useVocabPreviewOptional } from "@/contexts/VocabPreviewContext";
import { selectionFitsSentence } from "@/lib/expressionInsight";
import {
  snapToExpressionUnit,
  type ExpressionUnitSpan,
} from "@/lib/expressionUnits";
import { DEFAULT_LEARNING_LANGUAGE_CODE } from "@/lib/learningLanguages";
import {
  loadExpressionUnits,
  prefetchExpressionUnits,
} from "@/lib/requestExpressionUnits";
import {
  correctedHighlightParts,
  originalHighlightParts,
} from "@/lib/textDiff";
import { normalizeVocabHeadword, isVocabLookupEligible } from "@/lib/vocabulary";
import {
  isPronounceableAlphabetLetter,
  letterPronunciation,
} from "@/lib/letterPronunciation";

type AnalyzableEnglishProps = {
  sentence: string;
  className?: string;
  analyzeLabel?: string;
  tone?: "default" | "onDark";
  inline?: boolean;
  context?: string[];
  onAnalyze?: (selected: string) => void;
  children?: ReactNode;
  diff?: {
    original: string;
    corrected: string;
    side: "original" | "corrected";
  };
};

function tokenize(sentence: string): string[] {
  const parts = sentence.split(/(\s+)/).filter((part) => part.length > 0);
  const out: string[] = [];
  for (const part of parts) {
    if (/^\s+$/.test(part)) {
      out.push(part);
      continue;
    }
    // Character-level tokens for scripts without spaces / letter-study alphabets.
    if (/[\u3040-\u30ff\u3400-\u9fff\uac00-\ud7af\u0400-\u04FF]/.test(part)) {
      out.push(...Array.from(part));
      continue;
    }
    // Peel punctuation from Latin/Cyrillic tokens: "imbatível." → word + "."
    out.push(...splitAffixedPunctuation(part));
  }
  return out;
}

/** Split leading/trailing punctuation while keeping the word intact. */
function splitAffixedPunctuation(part: string): string[] {
  const re =
    /([^\p{L}\p{M}\p{N}'’_-]+)|([\p{L}\p{M}\p{N}]+(?:['’_-][\p{L}\p{M}\p{N}]+)*)/gu;
  const pieces: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = re.exec(part)) !== null) {
    pieces.push(match[0]);
  }
  return pieces.length > 0 ? pieces : [part];
}

function isCjkMeaningChar(text: string) {
  // Kanji / Hanzi / Hangul syllable — meaning lookup, not alphabet sound tip.
  return /^[\u3400-\u9fff\uac00-\ud7af]$/u.test(text);
}

function tokenIndexAtStart(tokens: string[], start: number) {
  let offset = 0;
  for (let i = 0; i < tokens.length; i += 1) {
    const next = offset + tokens[i].length;
    if (start >= offset && start < next) return i;
    offset = next;
  }
  return null;
}

function isWordToken(token: string) {
  if (!token || /^\s+$/.test(token)) return false;
  // Punctuation-only is not a word.
  if (!/[\p{L}\p{M}]/u.test(token)) return false;
  return true;
}

function rangeText(tokens: string[], start: number, end: number) {
  const from = Math.min(start, end);
  const to = Math.max(start, end);
  return tokens
    .slice(from, to + 1)
    .join("")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenStartOffset(tokens: string[], index: number) {
  return tokens.slice(0, index).join("").length;
}

function tokenOverlapsSpan(
  tokens: string[],
  index: number,
  span: ExpressionUnitSpan,
) {
  const start = tokenStartOffset(tokens, index);
  const end = start + tokens[index].length;
  return start < span.end && end > span.start;
}

function tokenDiffMarks(diff: {
  original: string;
  corrected: string;
  side: "original" | "corrected";
}) {
  const marks = new Map<number, "error" | "added">();
  if (diff.side === "original") {
    let index = 0;
    for (const part of originalHighlightParts(diff.original, diff.corrected)) {
      if (part.missingHint) continue;
      if (part.error) marks.set(index, "error");
      index += 1;
    }
    return marks;
  }
  let index = 0;
  for (const part of correctedHighlightParts(diff.original, diff.corrected)) {
    if (part.added) marks.set(index, "added");
    index += 1;
  }
  return marks;
}

const diffMarkClass = {
  default: {
    error:
      "bg-rose-500/15 font-semibold text-rose-700 underline decoration-2 decoration-rose-500 underline-offset-2",
    added:
      "bg-teal-500/15 font-semibold text-teal-800 underline decoration-2 decoration-teal-600 underline-offset-2",
    gap: "mx-0.5 inline-flex items-center rounded-sm border border-dashed border-rose-400 bg-rose-50 px-1 py-0.5 text-[11px] font-semibold leading-none text-rose-700",
  },
  onDark: {
    error:
      "bg-rose-400/35 font-semibold text-rose-100 underline decoration-2 decoration-rose-300 underline-offset-2",
    added:
      "bg-teal-400/30 font-semibold text-teal-100 underline decoration-2 decoration-teal-200 underline-offset-2",
    gap: "mx-0.5 inline-flex items-center rounded-sm border border-dashed border-rose-200/80 bg-rose-400/20 px-1 py-0.5 text-[11px] font-semibold leading-none text-rose-100",
  },
};

function SaveWordIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
      <path
        d="M7 4.25h10A1.75 1.75 0 0 1 18.75 6v13.35a.75.75 0 0 1-1.18.62L12 16.05l-5.57 3.92a.75.75 0 0 1-1.18-.62V6A1.75 1.75 0 0 1 7 4.25Z"
        className="fill-rose-500"
      />
    </svg>
  );
}

function AnalyzeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
      <circle cx="10.5" cy="10.5" r="6.25" className="fill-teal-500" />
      <circle cx="10.5" cy="10.5" r="2.4" fill="white" />
      <path
        d="M15.4 15.4 20 20"
        className="stroke-teal-600"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function readNativeSelection(root: HTMLElement, sentence: string): string | null {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
    return null;
  }
  const range = selection.getRangeAt(0);
  if (!root.contains(range.commonAncestorContainer)) return null;
  const picked = selection.toString().replace(/\s+/g, " ").trim();
  if (!selectionFitsSentence(sentence, picked)) return null;
  return picked;
}

export function AnalyzableEnglish({
  sentence,
  className = "",
  analyzeLabel,
  tone = "default",
  inline = false,
  context,
  onAnalyze,
  children,
  diff,
}: AnalyzableEnglishProps) {
  const insight = useExpressionInsightOptional();
  const analysis = useEnglishAnalysisOptional();
  const vocab = useVocabPreviewOptional();
  const learningLanguage = useLearningLanguageOptional();
  const targetLanguage =
    learningLanguage?.targetLanguage ?? DEFAULT_LEARNING_LANGUAGE_CODE;
  const label = analyzeLabel ?? insight?.analyzeLabel;
  const handleAnalyze =
    onAnalyze ??
    (analysis
      ? (selected: string) =>
          analysis.open({
            selectedText: selected,
            contextSentence: sentence,
            context,
            sourceType: "conversation",
            language: targetLanguage,
          })
      : insight
        ? (selected: string) => insight.open({ sentence, selected, context })
        : undefined);
  const canAnalyze = Boolean(label && handleAnalyze);
  const canSave = Boolean(vocab?.open);
  const hasContent =
    targetLanguage === "en"
      ? /[A-Za-z]/.test(sentence)
      : sentence.trim().length > 0;
  const enabled = (canAnalyze || canSave) && hasContent;
  const tokens = tokenize(sentence);
  const useTokens = enabled && !children;

  const rootRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLSpanElement>(null);
  const [pending, setPending] = useState<ExpressionUnitSpan | null>(null);
  const [snapping, setSnapping] = useState(false);
  const [letterTip, setLetterTip] = useState<{
    index: number;
    sound: string;
  } | null>(null);
  const commitIdRef = useRef(0);
  const letterTipTimerRef = useRef<number | null>(null);
  const dragRef = useRef<{
    start: number;
    end: number;
    x: number;
    y: number;
    scrolling: boolean;
  } | null>(null);

  const showLetterTip = useCallback((index: number, sound: string) => {
    if (letterTipTimerRef.current) {
      window.clearTimeout(letterTipTimerRef.current);
      letterTipTimerRef.current = null;
    }
    setLetterTip({ index, sound });
    letterTipTimerRef.current = window.setTimeout(() => {
      setLetterTip(null);
      letterTipTimerRef.current = null;
    }, 1800);
  }, []);

  useEffect(() => {
    return () => {
      if (letterTipTimerRef.current) {
        window.clearTimeout(letterTipTimerRef.current);
      }
    };
  }, []);

  const commit = useCallback(
    (picked: string | null, hintStart?: number) => {
      const cleaned = picked ? normalizeVocabHeadword(picked) || picked.trim() : "";
      if (!cleaned || !selectionFitsSentence(sentence, cleaned)) return;

      // Unfamiliar alphabet / syllabary letter: show sound tip immediately.
      if (isPronounceableAlphabetLetter(cleaned)) {
        const sound = letterPronunciation(cleaned);
        commitIdRef.current += 1;
        setPending(null);
        setSnapping(false);
        if (sound) {
          const index =
            hintStart != null
              ? tokenIndexAtStart(tokenize(sentence), hintStart)
              : null;
          if (index != null) showLetterTip(index, sound);
        }
        return;
      }

      // Kanji / Hanzi / Hangul: open character gloss immediately (no phrase snap).
      if (isCjkMeaningChar(cleaned) && vocab?.open) {
        commitIdRef.current += 1;
        setPending(null);
        setSnapping(false);
        setLetterTip(null);
        void vocab.open(cleaned);
        return;
      }

      setLetterTip(null);

      const id = commitIdRef.current + 1;
      commitIdRef.current = id;
      const optimisticStart =
        hintStart ?? sentence.toLowerCase().indexOf(cleaned.toLowerCase());
      // Only flash a chip for clearly lookup-worthy taps; bare contractions
      // wait for snap in case they expand into a fixed phrase.
      if (isVocabLookupEligible(cleaned) && optimisticStart >= 0) {
        setPending({
          text: cleaned,
          start: optimisticStart,
          end: optimisticStart + cleaned.length,
        });
      } else {
        setPending(null);
      }
      setSnapping(true);
      void (async () => {
        try {
          const units = await loadExpressionUnits(sentence, targetLanguage);
          if (commitIdRef.current !== id) return;
          const snapped = snapToExpressionUnit(
            sentence,
            cleaned,
            units,
            hintStart,
          );
          if (commitIdRef.current !== id) return;
          if (snapped) {
            const snappedText =
              normalizeVocabHeadword(snapped.text) || snapped.text;
            // Only keep units that are content words or idioms/phrases.
            if (!isVocabLookupEligible(snappedText)) {
              setPending(null);
              return;
            }
            // Re-locate after stripping edge punctuation from model units.
            const start =
              snappedText === snapped.text
                ? snapped.start
                : sentence
                    .toLowerCase()
                    .indexOf(snappedText.toLowerCase(), snapped.start);
            setPending({
              text: snappedText,
              start: start >= 0 ? start : snapped.start,
              end:
                start >= 0
                  ? start + snappedText.length
                  : snapped.start + snappedText.length,
            });
          } else if (isVocabLookupEligible(cleaned)) {
            // Model missed a clear content word — still allow lookup.
            setPending({
              text: cleaned,
              start: optimisticStart >= 0 ? optimisticStart : 0,
              end:
                (optimisticStart >= 0 ? optimisticStart : 0) + cleaned.length,
            });
          } else {
            // Function word / bare contraction / non-unit fragment.
            setPending(null);
          }
        } catch {
          if (commitIdRef.current !== id) return;
          if (isVocabLookupEligible(cleaned)) {
            setPending({
              text: cleaned,
              start: optimisticStart >= 0 ? optimisticStart : 0,
              end:
                (optimisticStart >= 0 ? optimisticStart : 0) + cleaned.length,
            });
          } else {
            setPending(null);
          }
        } finally {
          if (commitIdRef.current === id) setSnapping(false);
        }
      })();
    },
    [sentence, targetLanguage, vocab, showLetterTip],
  );

  const syncNativeSelection = useCallback(() => {
    const root = rootRef.current;
    if (!root) return;
    commit(readNativeSelection(root, sentence));
  }, [commit, sentence]);

  useEffect(() => {
    if (!enabled) return;
    const onDocPointerDown = (event: PointerEvent) => {
      const wrap = wrapRef.current;
      if (!wrap) return;
      if (event.target instanceof Node && wrap.contains(event.target)) return;
      commitIdRef.current += 1;
      setPending(null);
      setSnapping(false);
      setLetterTip(null);
    };
    document.addEventListener("pointerdown", onDocPointerDown);
    return () => document.removeEventListener("pointerdown", onDocPointerDown);
  }, [enabled]);

  const tokenIndexFromPoint = (clientX: number, clientY: number) => {
    const root = rootRef.current;
    if (!root) return null;
    const el = document.elementFromPoint(clientX, clientY);
    if (!(el instanceof Element) || !root.contains(el)) return null;
    const node =
      el instanceof HTMLElement && el.dataset.tokenIndex != null
        ? el
        : el.closest("[data-token-index]");
    if (!(node instanceof HTMLElement)) return null;
    const index = Number(node.dataset.tokenIndex);
    return Number.isInteger(index) ? index : null;
  };

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    prefetchExpressionUnits(sentence, targetLanguage);
    if (!useTokens) return;
    const index = tokenIndexFromPoint(event.clientX, event.clientY);
    if (index == null || !isWordToken(tokens[index])) {
      dragRef.current = null;
      return;
    }
    dragRef.current = {
      start: index,
      end: index,
      x: event.clientX,
      y: event.clientY,
      scrolling: false,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag) return;
    const dy = Math.abs(event.clientY - drag.y);
    const dx = Math.abs(event.clientX - drag.x);
    if (dy > 12 && dy > dx) {
      drag.scrolling = true;
      return;
    }
    const index = tokenIndexFromPoint(event.clientX, event.clientY);
    if (index != null && isWordToken(tokens[index])) {
      drag.end = index;
    }
  };

  const onPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (useTokens) {
      const drag = dragRef.current;
      dragRef.current = null;
      if (drag && !drag.scrolling) {
        let from = Math.min(drag.start, drag.end);
        let to = Math.max(drag.start, drag.end);
        // Drop leading/trailing punctuation tokens so "imbatível." → "imbatível".
        while (from <= to && !isWordToken(tokens[from])) from += 1;
        while (to >= from && !isWordToken(tokens[to])) to -= 1;
        const picked = from <= to ? rangeText(tokens, from, to) : "";
        if (picked) {
          event.preventDefault();
          commit(picked, tokenStartOffset(tokens, from));
        }
      }
      return;
    }
    window.setTimeout(syncNativeSelection, 0);
    window.setTimeout(syncNativeSelection, 280);
  };

  const clearPending = () => {
    window.getSelection()?.removeAllRanges();
    commitIdRef.current += 1;
    setPending(null);
    setSnapping(false);
  };

  if (!enabled) {
    return (
      <div translate="no" className={`whitespace-pre-wrap ${className}`}>
        {children ?? sentence}
      </div>
    );
  }

  const tabClass =
    "inline-flex items-center justify-center px-3 py-1.5 transition";
  const ready = Boolean(pending) && !snapping;

  const marks = diff ? tokenDiffMarks(diff) : null;
  const markStyles = diffMarkClass[tone];
  const renderToken = (token: string, index: number) => {
    if (!isWordToken(token)) {
      return <span key={`${index}-s`}>{token}</span>;
    }
    const mark = marks?.get(index);
    const tip = letterTip?.index === index ? letterTip.sound : null;
    return (
      <span
        key={`${index}-${token}`}
        data-token-index={index}
        className={`relative cursor-pointer rounded-sm ${
          pending && tokenOverlapsSpan(tokens, index, pending)
            ? tone === "onDark"
              ? "bg-white/25"
              : "bg-amber-200/80"
            : tip
              ? tone === "onDark"
                ? "bg-white/30"
                : "bg-amber-200/90"
              : mark
                ? markStyles[mark]
                : "hover:bg-amber-100/70"
        }`}
      >
        {token}
        {tip ? (
          <span
            className={`pointer-events-none absolute bottom-full left-1/2 z-20 mb-1 -translate-x-1/2 whitespace-nowrap rounded-md px-2 py-0.5 text-sm font-semibold shadow-md ${
              tone === "onDark"
                ? "bg-white text-slate-900"
                : "bg-slate-900 text-white"
            }`}
            role="status"
          >
            {tip}
          </span>
        ) : null}
      </span>
    );
  };
  const tokenNodes = (() => {
    if (!diff || diff.side !== "original") {
      return tokens.map((token, index) => renderToken(token, index));
    }
    const parts = originalHighlightParts(diff.original, diff.corrected);
    const nodes: ReactNode[] = [];
    let tokenIndex = 0;
    parts.forEach((part, partIndex) => {
      if (part.missingHint) {
        nodes.push(
          <span
            key={`gap-${partIndex}`}
            className={markStyles.gap}
            title={part.missingHint}
          >
            +{part.missingHint}
          </span>,
        );
        return;
      }
      const token = tokens[tokenIndex];
      if (token === undefined) return;
      nodes.push(renderToken(token, tokenIndex));
      tokenIndex += 1;
    });
    while (tokenIndex < tokens.length) {
      nodes.push(renderToken(tokens[tokenIndex], tokenIndex));
      tokenIndex += 1;
    }
    return nodes;
  })();

  return (
    <span
      ref={wrapRef}
      className={`relative min-w-0 ${inline ? "inline-block max-w-full" : "block flex-1"}`}
    >
      <div
        ref={rootRef}
        translate="no"
        className={`whitespace-pre-wrap [user-select:text] [-webkit-user-select:text] ${className}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        {children ? children : tokenNodes}
      </div>
      {pending ? (
        <div
          className={`mt-2 inline-flex max-w-full overflow-hidden rounded-full border text-[11px] shadow-sm ${
            tone === "onDark"
              ? "border-white/30 bg-white"
              : "border-slate-200 bg-white"
          } ${snapping ? "opacity-70" : ""}`}
        >
          {canSave ? (
            <button
              type="button"
              disabled={!ready}
              onPointerDown={(event) => event.preventDefault()}
              onClick={() => {
                if (!pending || snapping) return;
                vocab?.open(pending.text);
                clearPending();
              }}
              className={`${tabClass} hover:bg-rose-50 disabled:opacity-50`}
              aria-label={vocab?.saveLabel}
              title={vocab?.saveLabel}
            >
              <SaveWordIcon />
            </button>
          ) : null}
          {canSave && canAnalyze ? (
            <span className="w-px bg-slate-200" aria-hidden />
          ) : null}
          {canAnalyze ? (
            <button
              type="button"
              disabled={!ready}
              onPointerDown={(event) => event.preventDefault()}
              onClick={() => {
                if (!pending || snapping) return;
                vocab?.close();
                handleAnalyze?.(pending.text);
                clearPending();
              }}
              className={`${tabClass} hover:bg-teal-50 disabled:opacity-50`}
              aria-label={label}
              title={label}
            >
              <AnalyzeIcon />
            </button>
          ) : null}
        </div>
      ) : null}
    </span>
  );
}
