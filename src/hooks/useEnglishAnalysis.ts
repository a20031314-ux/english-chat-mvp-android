"use client";

import { useCallback, useRef, useState } from "react";
import { useLearningLanguageOptional } from "@/contexts/LearningLanguageContext";
import type { Locale } from "@/lib/copy";
import type {
  EnglishAnalysisTarget,
  EnglishInputAnalysis,
} from "@/lib/englishAnalysis";
import { isSameAnalysisSpan } from "@/lib/englishAnalysis";
import {
  clickRangeForText,
  listClickableSpans,
  textForClickRange,
} from "@/lib/learningSpans";
import { DEFAULT_LEARNING_LANGUAGE_CODE } from "@/lib/learningLanguages";
import {
  loadSentenceNote,
  saveSentenceTranslation,
} from "@/lib/sentenceNotes";
import { translateUtterance } from "@/lib/translateUtterance";
import { noteComprehension } from "@/lib/learner/comprehensionClient";

export type InspectTab = "sentence" | "word";

export type EnglishAnalysisSession = {
  target: EnglishAnalysisTarget;
  tab: InspectTab;
  focusText: string;
  rangeActive: boolean;
  rangeStart: number;
  rangeEnd: number;
  sentenceAnalysis: EnglishInputAnalysis | null;
  sentenceLoading: boolean;
  sentenceFailed: boolean;
};

function resolveTab(target: EnglishAnalysisTarget): InspectTab {
  return target.intent === "word" ? "word" : "sentence";
}

function seedSentenceAnalysis(
  input: string,
  translation?: string,
): EnglishInputAnalysis {
  return {
    input,
    elements: [],
    chunks: [],
    ...(translation ? { translation } : {}),
  };
}

export function useEnglishAnalysis(locale: Locale) {
  const learningLanguage = useLearningLanguageOptional();
  const targetLanguage =
    learningLanguage?.targetLanguage ?? DEFAULT_LEARNING_LANGUAGE_CODE;
  const [session, setSession] = useState<EnglishAnalysisSession | null>(null);
  const sessionRef = useRef(session);
  sessionRef.current = session;
  const sentenceReqRef = useRef(0);

  const close = useCallback(() => {
    sentenceReqRef.current += 1;
    setSession(null);
  }, []);

  const loadSentence = useCallback(
    async (target: EnglishAnalysisTarget) => {
      const provided = target.translation?.replace(/\s+/g, " ").trim() || "";
      if (provided) {
        setSession((prev) =>
          prev
            ? {
                ...prev,
                sentenceAnalysis: seedSentenceAnalysis(
                  target.contextSentence,
                  provided,
                ),
                sentenceLoading: false,
                sentenceFailed: false,
              }
            : prev,
        );
        return;
      }

      const req = sentenceReqRef.current + 1;
      sentenceReqRef.current = req;
      const identity = {
        sentence: target.contextSentence,
        language: targetLanguage,
        uiLanguage: locale,
      };
      // The same sentence opened again reads the translation it got the first
      // time, rather than asking again and getting it worded another way.
      const kept = loadSentenceNote(identity)?.translation;
      if (kept) {
        setSession((prev) =>
          prev
            ? {
                ...prev,
                sentenceAnalysis: seedSentenceAnalysis(target.contextSentence, kept),
                sentenceLoading: false,
                sentenceFailed: false,
              }
            : prev,
        );
        return;
      }
      setSession((prev) =>
        prev
          ? { ...prev, sentenceLoading: true, sentenceFailed: false }
          : prev,
      );
      try {
        const translation = await translateUtterance({
          text: target.contextSentence,
          locale,
          interfaceLanguage: locale,
          targetLanguage,
          sourceType: target.sourceType,
          context: target.context,
        });
        if (translation) saveSentenceTranslation(identity, translation);
        if (sentenceReqRef.current !== req) return;
        setSession((prev) =>
          prev
            ? {
                ...prev,
                sentenceAnalysis: seedSentenceAnalysis(
                  target.contextSentence,
                  translation || undefined,
                ),
                sentenceLoading: false,
                sentenceFailed: false,
              }
            : prev,
        );
      } catch {
        if (sentenceReqRef.current !== req) return;
        setSession((prev) =>
          prev
            ? {
                ...prev,
                sentenceAnalysis: seedSentenceAnalysis(target.contextSentence),
                sentenceLoading: false,
                sentenceFailed: true,
              }
            : prev,
        );
      }
    },
    [locale, targetLanguage],
  );

  const open = useCallback(
    (next: EnglishAnalysisTarget) => {
      const selectedText = next.selectedText.replace(/\s+/g, " ").trim();
      const contextSentence = next.contextSentence.replace(/\s+/g, " ").trim();
      if (!selectedText || !contextSentence) return;

      const target = { ...next, selectedText, contextSentence };
      const tab = resolveTab(target);
      // A word or phrase opened for its meaning is one they did not know.
      if (tab === "word" && !isSameAnalysisSpan(selectedText, contextSentence)) {
        noteComprehension(targetLanguage, { kind: "lookup", text: selectedText });
      }
      const prev = sessionRef.current;
      const sameSentence =
        prev != null &&
        isSameAnalysisSpan(prev.target.contextSentence, contextSentence);
      const subsetRange =
        tab === "sentence" && !isSameAnalysisSpan(selectedText, contextSentence)
          ? clickRangeForText(contextSentence, selectedText, targetLanguage)
          : null;
      const words = listClickableSpans(contextSentence, targetLanguage);
      const partialRange =
        subsetRange &&
        words.length > 0 &&
        !(subsetRange.start === 0 && subsetRange.end === words.length - 1)
          ? subsetRange
          : null;

      if (sameSentence && prev && tab === "word") {
        setSession({
          ...prev,
          target: { ...prev.target, ...target, innerUnits: target.innerUnits },
          tab: "word",
          focusText: selectedText,
        });
        return;
      }

      const range = partialRange
        ? partialRange
        : sameSentence && prev
          ? { start: prev.rangeStart, end: prev.rangeEnd }
          : { start: 0, end: 0 };
      const rangeActive = Boolean(
        partialRange || (sameSentence && prev?.rangeActive),
      );
      const focusText =
        tab === "word"
          ? selectedText
          : partialRange
            ? textForClickRange(
                contextSentence,
                partialRange.start,
                partialRange.end,
                targetLanguage,
              )
            : sameSentence && prev?.rangeActive
              ? prev.focusText
              : contextSentence;

      if (!sameSentence || !prev) {
        sentenceReqRef.current += 1;
        const provided = target.translation?.replace(/\s+/g, " ").trim() || "";
        const needsTranslate = !provided && locale !== targetLanguage;
        setSession({
          target,
          tab,
          focusText,
          rangeActive: Boolean(partialRange),
          rangeStart: partialRange?.start ?? 0,
          rangeEnd: partialRange?.end ?? 0,
          sentenceAnalysis: seedSentenceAnalysis(
            contextSentence,
            provided || undefined,
          ),
          sentenceLoading: needsTranslate,
          sentenceFailed: false,
        });
        if (needsTranslate) void loadSentence(target);
        return;
      }

      setSession({
        ...prev,
        target: { ...prev.target, ...target, innerUnits: target.innerUnits },
        tab,
        focusText,
        rangeActive,
        rangeStart: range.start,
        rangeEnd: range.end,
      });

      if (!prev.sentenceAnalysis && !prev.sentenceLoading) {
        void loadSentence(prev.target);
      }
    },
    [loadSentence, locale, targetLanguage],
  );

  const setRange = useCallback((start: number, end: number) => {
    const prev = sessionRef.current;
    if (!prev) return;
    const words = listClickableSpans(prev.target.contextSentence, targetLanguage);
    if (words.length === 0) return;
    const from = Math.max(0, Math.min(start, end, words.length - 1));
    const to = Math.min(words.length - 1, Math.max(start, end));
    const focusText = textForClickRange(
      prev.target.contextSentence,
      from,
      to,
      targetLanguage,
    );
    setSession({
      ...prev,
      tab: "sentence",
      focusText,
      rangeActive: true,
      rangeStart: from,
      rangeEnd: to,
    });
  }, [targetLanguage]);

  const setTab = useCallback(
    (tab: InspectTab) => {
      const prev = sessionRef.current;
      if (!prev) return;
      setSession({ ...prev, tab });
      if (tab === "sentence" && !prev.sentenceAnalysis && !prev.sentenceLoading) {
        void loadSentence(prev.target);
      }
    },
    [loadSentence],
  );

  return {
    session,
    open,
    setTab,
    setRange,
    close,
  };
}
