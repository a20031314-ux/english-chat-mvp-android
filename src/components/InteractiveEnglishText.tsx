"use client";

import {
  useRef,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { useEnglishAnalysisOptional } from "@/contexts/EnglishAnalysisContext";
import type { EnglishChunk } from "@/lib/englishAnalysis";
import type { TranslationSourceType } from "@/lib/naturalTranslation";
import { snapToExpressionUnit } from "@/lib/expressionUnits";
import {
  loadExpressionUnits,
  prefetchExpressionUnits,
} from "@/lib/requestExpressionUnits";

function tokenize(sentence: string): string[] {
  return sentence.split(/(\s+)/).filter((part) => part.length > 0);
}

function isWordToken(token: string) {
  return /[A-Za-z]/.test(token);
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

export function InteractiveEnglishText({
  sentence,
  chunks,
  className = "",
  sourceType,
  language,
}: {
  sentence: string;
  chunks?: EnglishChunk[];
  className?: string;
  sourceType?: TranslationSourceType;
  language?: string;
}) {
  const analysis = useEnglishAnalysisOptional();
  const rootRef = useRef<HTMLParagraphElement>(null);
  const dragRef = useRef<{
    start: number;
    end: number;
    x: number;
    y: number;
    scrolling: boolean;
  } | null>(null);

  if (!analysis) {
    return (
      <p translate="no" className={`whitespace-pre-wrap ${className}`}>
        {sentence}
      </p>
    );
  }

  if (chunks && chunks.length > 0) {
    return (
      <p translate="no" className={`whitespace-pre-wrap ${className}`}>
        {chunks.map((chunk, index) => (
          <span key={`${index}-${chunk.text}`}>
            {index > 0 ? (
              <span className="px-0.5 text-slate-300" aria-hidden>
                |
              </span>
            ) : null}
            <button
              type="button"
              onClick={() =>
                analysis.open({
                  selectedText: chunk.text,
                  contextSentence: sentence,
                  ...(sourceType ? { sourceType } : {}),
                  ...(language ? { language } : {}),
                })
              }
              className={`rounded-sm px-0.5 align-baseline transition ${
                chunk.analysisRecommended
                  ? "bg-amber-100 font-medium text-slate-900 hover:bg-amber-200"
                  : "text-slate-800 hover:bg-amber-50"
              }`}
            >
              {chunk.text}
            </button>
          </span>
        ))}
      </p>
    );
  }

  const tokens = tokenize(sentence);

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

  const onPointerDown = (event: ReactPointerEvent<HTMLParagraphElement>) => {
    prefetchExpressionUnits(sentence);
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
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLParagraphElement>) => {
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

  const onPointerUp = (event: ReactPointerEvent<HTMLParagraphElement>) => {
    const drag = dragRef.current;
    dragRef.current = null;
    if (!drag || drag.scrolling) return;
    const picked = rangeText(tokens, drag.start, drag.end);
    if (!picked) return;
    event.preventDefault();
    const hint = tokenStartOffset(tokens, Math.min(drag.start, drag.end));
    void (async () => {
      const units = await loadExpressionUnits(sentence);
      const snapped = snapToExpressionUnit(sentence, picked, units, hint);
      analysis.open({
        selectedText: snapped?.text || picked,
        contextSentence: sentence,
        ...(sourceType ? { sourceType } : {}),
        ...(language ? { language } : {}),
      });
    })();
  };

  return (
    <p
      ref={rootRef}
      translate="no"
      className={`whitespace-pre-wrap ${className}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      {tokens.map((token, index) =>
        isWordToken(token) ? (
          <span
            key={`${index}-${token}`}
            data-token-index={index}
            className="cursor-pointer rounded-sm hover:bg-amber-100/70"
          >
            {token}
          </span>
        ) : (
          <span key={`${index}-s`}>{token}</span>
        ),
      )}
    </p>
  );
}
