"use client";

import {
  useRef,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { useEnglishAnalysisOptional } from "@/contexts/EnglishAnalysisContext";
import { useLearningLanguageOptional } from "@/contexts/LearningLanguageContext";
import type { EnglishChunk } from "@/lib/englishAnalysis";
import { DEFAULT_LEARNING_LANGUAGE_CODE } from "@/lib/learningLanguages";
import type { TranslationSourceType } from "@/lib/naturalTranslation";
import { snapToExpressionUnit } from "@/lib/expressionUnits";
import {
  loadExpressionUnits,
  prefetchExpressionUnits,
} from "@/lib/requestExpressionUnits";
import { normalizeVocabHeadword } from "@/lib/vocabulary";

function tokenize(sentence: string): string[] {
  const parts = sentence.split(/(\s+)/).filter((part) => part.length > 0);
  const out: string[] = [];
  for (const part of parts) {
    if (/^\s+$/.test(part)) {
      out.push(part);
      continue;
    }
    if (/[\u3040-\u30ff\u3400-\u9fff\uac00-\ud7af]/.test(part)) {
      out.push(...Array.from(part));
      continue;
    }
    out.push(...splitAffixedPunctuation(part));
  }
  return out;
}

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

function isWordToken(token: string) {
  if (!token || /^\s+$/.test(token)) return false;
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
  const learningLanguage = useLearningLanguageOptional();
  const targetLanguage =
    learningLanguage?.targetLanguage ?? DEFAULT_LEARNING_LANGUAGE_CODE;
  const rootRef = useRef<HTMLParagraphElement>(null);
  const dragRef = useRef<{
    start: number;
    end: number;
    x: number;
    y: number;
    scrolling: boolean;
  } | null>(null);
  const suppressClickRef = useRef(false);

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
                  language: language || targetLanguage,
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
    prefetchExpressionUnits(sentence, targetLanguage);
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

  const onPointerMove = (event: ReactPointerEvent<HTMLParagraphElement>) => {
    const drag = dragRef.current;
    if (!drag) return;
    const dy = Math.abs(event.clientY - drag.y);
    const dx = Math.abs(event.clientX - drag.x);
    if (dy > 12 && dy > dx) {
      drag.scrolling = true;
      return;
    }
    if (dx < 24 && dy < 24) return;
    const index = tokenIndexFromPoint(event.clientX, event.clientY);
    if (index != null && isWordToken(tokens[index])) {
      drag.end = index;
    }
  };

  const onPointerUp = (event: ReactPointerEvent<HTMLParagraphElement>) => {
    const drag = dragRef.current;
    dragRef.current = null;
    if (!drag || drag.scrolling) return;
    let from = Math.min(drag.start, drag.end);
    let to = Math.max(drag.start, drag.end);
    while (from <= to && !isWordToken(tokens[from])) from += 1;
    while (to >= from && !isWordToken(tokens[to])) to -= 1;
    const pickedRaw = from <= to ? rangeText(tokens, from, to) : "";
    const picked = pickedRaw
      ? normalizeVocabHeadword(pickedRaw) || pickedRaw
      : "";
    if (!picked) return;
    suppressClickRef.current = true;
    event.preventDefault();
    event.stopPropagation();
    window.getSelection()?.removeAllRanges();
    const dist = Math.hypot(event.clientX - drag.x, event.clientY - drag.y);
    const isTap = dist < 24 || drag.start === drag.end;
    const hint = tokenStartOffset(tokens, isTap ? drag.start : from);
    const selectedPick = isTap
      ? normalizeVocabHeadword(tokens[drag.start]) || tokens[drag.start]
      : picked;
    void (async () => {
      let selectedText = selectedPick;
      if (!isTap) {
        const units = await loadExpressionUnits(sentence, targetLanguage);
        const snapped = snapToExpressionUnit(
          sentence,
          picked,
          units,
          hint,
        );
        selectedText = snapped
          ? normalizeVocabHeadword(snapped.text) || snapped.text
          : picked;
      }
      analysis.open({
        selectedText,
        contextSentence: sentence,
        ...(sourceType ? { sourceType } : {}),
        language: language || targetLanguage,
      });
    })();
  };

  const onClick = (event: ReactMouseEvent<HTMLParagraphElement>) => {
    if (!suppressClickRef.current) return;
    suppressClickRef.current = false;
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <p
      ref={rootRef}
      translate="no"
      className={`select-none whitespace-pre-wrap ${className}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onClick={onClick}
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
