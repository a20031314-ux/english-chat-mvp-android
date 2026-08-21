"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { useExpressionInsightOptional } from "@/contexts/ExpressionInsightContext";
import { useEnglishAnalysisOptional } from "@/contexts/EnglishAnalysisContext";
import { useLearningLanguageOptional } from "@/contexts/LearningLanguageContext";
import { useVocabPreviewOptional } from "@/contexts/VocabPreviewContext";
import { selectionFitsSentence } from "@/lib/expressionInsight";
import { DEFAULT_LEARNING_LANGUAGE_CODE, learningLanguageTextDir } from "@/lib/learningLanguages";
import {
  findLearningSpan,
  tokensFromLearningSpans,
  type LearningSpan,
} from "@/lib/learningSpans";
import type { TranslationSourceType } from "@/lib/naturalTranslation";
import { isSameAnalysisSpan } from "@/lib/englishAnalysis";
import { splitSentences } from "@/lib/studyMaterials/splitSentences";
import { isWordToken, tokenize } from "@/lib/textTokens";
import { prefetchExpressionUnits } from "@/lib/requestExpressionUnits";
import { prefetchLearningSpans, loadLearningSpans } from "@/lib/requestLearningSpans";
import {
  correctedHighlightParts,
  originalHighlightParts,
} from "@/lib/textDiff";
import { normalizeVocabHeadword } from "@/lib/vocabulary";

type AnalyzableEnglishProps = {
  sentence: string;
  className?: string;
  analyzeLabel?: string;
  tone?: "default" | "onDark";
  inline?: boolean;
  context?: string[];
  onAnalyze?: (selected: string) => void;
  children?: ReactNode;
  sourceType?: TranslationSourceType;
  language?: string;
  /** Existing UI-language line to reuse in the sentence inspect sheet. */
  translation?: string;
  /** Inside a sentence sheet: pick words/phrases only, no sentence rail. */
  elementsOnly?: boolean;
  diff?: {
    original: string;
    corrected: string;
    side: "original" | "corrected";
  };
};

function rangeText(tokens: string[], start: number, end: number) {
  const from = Math.min(start, end);
  const to = Math.max(start, end);
  return tokens
    .slice(from, to + 1)
    .join("")
    .replace(/\s+/g, " ")
    .trim();
}

const TAP_MOVE_PX = 24;

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
  sourceType,
  language,
  translation: attachedTranslation,
  elementsOnly = false,
  diff,
}: AnalyzableEnglishProps) {
  const insight = useExpressionInsightOptional();
  const analysis = useEnglishAnalysisOptional();
  const vocab = useVocabPreviewOptional();
  const learningLanguage = useLearningLanguageOptional();
  const targetLanguage =
    learningLanguage?.targetLanguage ?? DEFAULT_LEARNING_LANGUAGE_CODE;
  const label = analyzeLabel ?? insight?.analyzeLabel;
  const reusedTranslation = attachedTranslation?.replace(/\s+/g, " ").trim() || "";
  const inspect = useCallback(
    (
      selected: string,
      intent: "sentence" | "word",
      span?: LearningSpan | null,
    ) => {
      analysis?.open({
        selectedText: selected,
        contextSentence: sentence,
        context,
        sourceType: sourceType ?? "conversation",
        language: language || targetLanguage,
        intent,
        ...(reusedTranslation ? { translation: reusedTranslation } : {}),
        ...(span?.inner?.length ? { innerUnits: span.inner } : {}),
        ...(span?.kind === "expression" || span?.kind === "grammar_unit"
          ? { allowVocabSave: true }
          : {}),
      });
    },
    [
      analysis,
      context,
      language,
      reusedTranslation,
      sentence,
      sourceType,
      targetLanguage,
    ],
  );
  const handleAnalyze =
    onAnalyze ??
    (analysis
      ? (selected: string) => inspect(selected, "sentence")
      : insight
        ? (selected: string) => insight.open({ sentence, selected, context })
        : undefined);
  const canAnalyze = Boolean(label && handleAnalyze);
  const canSave = Boolean(analysis || vocab?.open);
  const hasContent =
    targetLanguage === "en"
      ? /[A-Za-z]/.test(sentence)
      : sentence.trim().length > 0;
  const enabled = (canAnalyze || canSave) && hasContent;
  const [learningSpans, setLearningSpans] = useState<LearningSpan[] | null>(
    null,
  );
  useEffect(() => {
    if (targetLanguage === "en") {
      setLearningSpans(null);
      return;
    }
    let cancelled = false;
    void loadLearningSpans(sentence, targetLanguage).then((spans) => {
      if (!cancelled) setLearningSpans(spans);
    });
    return () => {
      cancelled = true;
    };
  }, [sentence, targetLanguage]);
  const tokens =
    targetLanguage === "en" || !learningSpans
      ? tokenize(sentence)
      : tokensFromLearningSpans(sentence, learningSpans);
  const useTokens = enabled && !children;

  const rootRef = useRef<HTMLSpanElement>(null);
  const wrapRef = useRef<HTMLSpanElement>(null);
  const dragRef = useRef<{
    start: number;
    end: number;
    x: number;
    y: number;
    scrolling: boolean;
  } | null>(null);
  const suppressClickRef = useRef(false);
  const skipTokenClickRef = useRef(false);

  const commit = useCallback(
    (picked: string | null, isTap = true) => {
      const cleaned = picked
        ? normalizeVocabHeadword(picked) || picked.trim()
        : "";
      if (!cleaned || !selectionFitsSentence(sentence, cleaned)) return;
      if (isSameAnalysisSpan(cleaned, sentence)) {
        if (onAnalyze) {
          onAnalyze(cleaned);
          return;
        }
        if (analysis) inspect(sentence, "sentence");
        return;
      }
      if (onAnalyze) {
        onAnalyze(cleaned);
        return;
      }
      if (analysis) {
        inspect(
          cleaned,
          isTap ? "word" : "sentence",
          isTap ? findLearningSpan(learningSpans, cleaned) : null,
        );
        return;
      }
      if (!isTap && handleAnalyze) {
        handleAnalyze(cleaned);
        return;
      }
      vocab?.open(cleaned, sentence);
    },
    [analysis, handleAnalyze, inspect, learningSpans, onAnalyze, sentence, vocab],
  );

  const syncNativeSelection = useCallback(() => {
    const root = rootRef.current;
    if (!root) return;
    commit(readNativeSelection(root, sentence), false);
  }, [commit, sentence]);

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

  const onPointerDown = (event: ReactPointerEvent<HTMLSpanElement>) => {
    if (targetLanguage === "en") {
      prefetchExpressionUnits(sentence, targetLanguage);
    } else {
      prefetchLearningSpans(sentence, targetLanguage);
    }
    if (!useTokens) return;
    const index = tokenIndexFromPoint(event.clientX, event.clientY);
    if (index == null || !isWordToken(tokens[index])) {
      dragRef.current = null;
      return;
    }
    suppressClickRef.current = true;
    window.getSelection()?.removeAllRanges();
    event.stopPropagation();
    dragRef.current = {
      start: index,
      end: index,
      x: event.clientX,
      y: event.clientY,
      scrolling: false,
    };
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLSpanElement>) => {
    const drag = dragRef.current;
    if (!drag) return;
    const dy = Math.abs(event.clientY - drag.y);
    const dx = Math.abs(event.clientX - drag.x);
    if (dy > 12 && dy > dx) {
      drag.scrolling = true;
      return;
    }
    // Ignore jitter so a click does not grow into a sentence-wide drag.
    if (dx < TAP_MOVE_PX && dy < TAP_MOVE_PX) return;
    const index = tokenIndexFromPoint(event.clientX, event.clientY);
    if (index != null && isWordToken(tokens[index])) {
      drag.end = index;
    }
  };

  const onPointerUp = (event: ReactPointerEvent<HTMLSpanElement>) => {
    if (useTokens) {
      const drag = dragRef.current;
      dragRef.current = null;
      if (drag && !drag.scrolling) {
        const dist = Math.hypot(
          event.clientX - drag.x,
          event.clientY - drag.y,
        );
        const isTap = dist < TAP_MOVE_PX || drag.start === drag.end;
        suppressClickRef.current = true;
        event.stopPropagation();
        window.getSelection()?.removeAllRanges();
        if (isTap) {
          skipTokenClickRef.current = true;
          event.preventDefault();
          commit(tokens[drag.start], true);
          return;
        }
        let from = Math.min(drag.start, drag.end);
        let to = Math.max(drag.start, drag.end);
        while (from <= to && !isWordToken(tokens[from])) from += 1;
        while (to >= from && !isWordToken(tokens[to])) to -= 1;
        const picked = from <= to ? rangeText(tokens, from, to) : "";
        if (picked) {
          skipTokenClickRef.current = true;
          event.preventDefault();
          commit(picked, false);
        }
      }
      return;
    }
    window.setTimeout(syncNativeSelection, 0);
    window.setTimeout(syncNativeSelection, 280);
  };

  const onClick = (event: ReactMouseEvent<HTMLSpanElement>) => {
    if (!suppressClickRef.current) return;
    suppressClickRef.current = false;
    event.preventDefault();
    event.stopPropagation();
  };

  if (!enabled) {
    return (
      <span
        translate="no"
        className={`${inline ? "" : "block"} whitespace-pre-wrap ${className}`}
      >
        {children ?? sentence}
      </span>
    );
  }

  if (!elementsOnly && !children && !diff) {
    const parts = splitSentences(sentence);
    if (parts.length > 1) {
      return (
        <span
          className={`relative min-w-0 flex-col gap-2 ${
            inline ? "inline-flex max-w-full" : "flex flex-1"
          }`}
        >
          {parts.map((part, index) => (
            <AnalyzableEnglish
              key={`${index}-${part.slice(0, 20)}`}
              sentence={part}
              className={className}
              analyzeLabel={analyzeLabel}
              tone={tone}
              context={context}
              onAnalyze={onAnalyze}
              sourceType={sourceType}
              language={language}
            />
          ))}
        </span>
      );
    }
  }

  const showSentenceRail = useTokens && !elementsOnly;
  const sentenceLabel = label ?? "sentence";

  const marks = diff ? tokenDiffMarks(diff) : null;
  const markStyles = diffMarkClass[tone];
  const renderToken = (token: string, index: number) => {
    if (!isWordToken(token)) {
      return <span key={`${index}-s`}>{token}</span>;
    }
    const mark = marks?.get(index);
    return (
      <span
        key={`${index}-${token}`}
        data-token-index={index}
        role="button"
        tabIndex={0}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          if (skipTokenClickRef.current) {
            skipTokenClickRef.current = false;
            return;
          }
          commit(token, true);
        }}
        onKeyDown={(event) => {
          if (event.key !== "Enter" && event.key !== " ") return;
          event.preventDefault();
          commit(token, true);
        }}
        className={`relative cursor-pointer rounded-sm ${
          mark ? markStyles[mark] : "hover:bg-amber-100/70"
        }`}
      >
        {token}
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
      className={`relative min-w-0 ${
        showSentenceRail
          ? inline
            ? "inline-flex max-w-full items-stretch gap-1.5"
            : "flex flex-1 items-stretch gap-1.5"
          : inline
            ? "inline-block max-w-full"
            : "block flex-1"
      }`}
    >
      {showSentenceRail ? (
        <button
          type="button"
          aria-label={sentenceLabel}
          title={sentenceLabel}
          onPointerDown={(event) => {
            event.preventDefault();
            event.stopPropagation();
          }}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            if (analysis) {
              inspect(sentence, "sentence");
              return;
            }
            commit(sentence, false);
          }}
          className={`w-1 shrink-0 self-stretch rounded-full ${
            tone === "onDark"
              ? "bg-white/35 hover:bg-white/70"
              : "bg-slate-300 hover:bg-teal-500"
          }`}
        />
      ) : null}
      <span className={showSentenceRail ? "min-w-0 flex-1" : "min-w-0"}>
        <span
          ref={rootRef}
          translate="no"
          className={`${inline ? "" : "block"} whitespace-pre-wrap ${
            useTokens
              ? "select-none"
              : "[user-select:text] [-webkit-user-select:text]"
          } ${className}`}
          dir={learningLanguageTextDir(targetLanguage)}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onClick={onClick}
        >
          {children ? children : tokenNodes}
        </span>
      </span>
    </span>
  );
}
