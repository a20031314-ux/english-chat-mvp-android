"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnalyzableEnglish } from "@/components/AnalyzableEnglish";
import { useEnglishAnalysisOptional } from "@/contexts/EnglishAnalysisContext";
import { useLearningLanguageOptional } from "@/contexts/LearningLanguageContext";
import type { Locale, UICopy } from "@/lib/copy";
import { rememberEnglishAnalysis } from "@/lib/englishAnalysisRecent";
import { DEFAULT_LEARNING_LANGUAGE_CODE } from "@/lib/learningLanguages";
import {
  locationForSentence,
  neighborContext,
  sentenceAnalysisTarget,
} from "@/lib/studyMaterials/analysisAdapter";
import {
  addStudyAnnotation,
  updateStudyProgress,
} from "@/lib/studyMaterials/storage";
import type {
  StudyDocument,
  StudyParagraph,
  StudySection,
  StudySentence,
} from "@/lib/studyMaterials/types";

export function StudyReader({
  document,
  locale,
  ui,
  onBack,
  onDocumentChange,
}: {
  document: StudyDocument;
  locale: Locale;
  ui: UICopy;
  onBack: () => void;
  onDocumentChange: (next: StudyDocument) => void;
}) {
  const analysis = useEnglishAnalysisOptional();
  const learning = useLearningLanguageOptional();
  const targetLanguage =
    learning?.targetLanguage ?? DEFAULT_LEARNING_LANGUAGE_CODE;
  const scrollerRef = useRef<HTMLDivElement>(null);
  const documentRef = useRef(document);
  const progressTimer = useRef<number | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(
    document.progress.sentenceId ?? null,
  );

  const restoredFor = useRef<string | null>(null);

  documentRef.current = document;

  useEffect(() => {
    if (restoredFor.current === document.id) return;
    restoredFor.current = document.id;
    const sectionId = document.progress.sectionId;
    const sentenceId = document.progress.sentenceId;
    const root = scrollerRef.current;
    if (!root) return;
    const targetId = sentenceId || sectionId;
    if (!targetId) return;
    const attr = sentenceId ? "data-sentence-id" : "data-section-id";
    const node = root.querySelector(
      `[${attr}="${targetId.replace(/["\\]/g, "")}"]`,
    );
    if (node instanceof HTMLElement) {
      node.scrollIntoView({ block: "start" });
    }
  }, [document.id, document.progress.sectionId, document.progress.sentenceId]);

  const recordProgress = (
    section: StudySection,
    paragraph?: StudyParagraph,
    sentence?: StudySentence,
  ) => {
    const current = documentRef.current;
    const index = current.sections.findIndex((row) => row.id === section.id);
    const total = current.sections.length || 1;
    const progressPercent = Math.round(((index + 1) / total) * 100);
    if (progressTimer.current) window.clearTimeout(progressTimer.current);
    progressTimer.current = window.setTimeout(() => {
      void updateStudyProgress(current.id, {
        sectionId: section.id,
        paragraphId: paragraph?.id,
        sentenceId: sentence?.id,
        page: section.page,
        progressPercent,
      }).then((next) => {
        if (next) onDocumentChange(next);
      });
    }, 400);
  };

  useEffect(() => {
    return () => {
      if (progressTimer.current) window.clearTimeout(progressTimer.current);
    };
  }, []);

  useEffect(() => {
    const root = scrollerRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        const sectionId = visible[0]?.target.getAttribute("data-section-id");
        if (!sectionId) return;
        const section = documentRef.current.sections.find(
          (row) => row.id === sectionId,
        );
        if (section) recordProgress(section);
      },
      { root, threshold: 0.15 },
    );
    root.querySelectorAll("[data-section-id]").forEach((node) => {
      observer.observe(node);
    });
    return () => observer.disconnect();
  }, [document.id, document.sections.length]);

  const analyzeSentence = (
    section: StudySection,
    paragraph: StudyParagraph,
    sentence: StudySentence,
  ) => {
    setSelectedId(sentence.id);
    void addStudyAnnotation(
      locationForSentence({
        document,
        section,
        paragraph,
        sentence,
        kind: "sentence",
      }),
    );
    recordProgress(section, paragraph, sentence);
    rememberEnglishAnalysis({ input: sentence.text });
    analysis?.open(
      sentenceAnalysisTarget({
        sentence,
        paragraph,
        language: targetLanguage,
      }),
    );
  };

  const analyzeSpan = (
    section: StudySection,
    paragraph: StudyParagraph,
    sentence: StudySentence,
    selected: string,
  ) => {
    setSelectedId(sentence.id);
    void addStudyAnnotation(
      locationForSentence({
        document,
        section,
        paragraph,
        sentence,
        selectedText: selected,
        kind: "span",
      }),
    );
    recordProgress(section, paragraph, sentence);
    analysis?.open(
      sentenceAnalysisTarget({
        sentence,
        paragraph,
        selectedText: selected,
        language: targetLanguage,
      }),
    );
  };

  const typeLabel =
    document.type === "epub"
      ? "EPUB"
      : document.type === "pdf"
        ? "PDF"
        : document.type === "txt"
          ? "TXT"
          : "IMG";

  const resumeHint = useMemo(() => {
    if (document.progress.progressPercent <= 0) return null;
    return ui.studyResumeHint.replace(
      "{percent}",
      String(document.progress.progressPercent),
    );
  }, [document.progress.progressPercent, ui.studyResumeHint]);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <header className="flex shrink-0 items-center gap-2 border-b border-slate-200 px-3 py-2.5">
        <button
          type="button"
          onClick={onBack}
          className="shrink-0 rounded-lg px-2 py-1.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900"
        >
          {ui.studyBack}
        </button>
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-sm font-semibold text-slate-900">
            {document.title}
          </h2>
          <p className="text-[11px] text-slate-500">
            {typeLabel}
            {typeof document.progress.page === "number"
              ? ` · p. ${document.progress.page}`
              : ""}
            {document.progress.progressPercent > 0
              ? ` · ${document.progress.progressPercent}%`
              : ""}
          </p>
        </div>
      </header>
      {resumeHint ? (
        <p className="shrink-0 bg-amber-50 px-4 py-1.5 text-center text-[11px] text-amber-900">
          {resumeHint}
        </p>
      ) : null}

      <div
        ref={scrollerRef}
        className="min-h-0 flex-1 overflow-y-auto px-4 py-6"
      >
        <article className="mx-auto w-full max-w-prose">
          {document.sections.map((section) => (
            <section
              key={section.id}
              data-section-id={section.id}
              className="mb-8"
            >
              {section.title ? (
                <h3 className="mb-3 text-base font-semibold tracking-tight text-slate-900">
                  {section.title}
                </h3>
              ) : null}
              {section.paragraphs.map((paragraph) => {
                const selectedSentence = paragraph.sentences.find(
                  (row) => row.id === selectedId,
                );
                return (
                  <div key={paragraph.id} className="mb-4">
                    <p className="text-[17px] leading-8 text-slate-800">
                      {paragraph.sentences.map((sentence, index) => {
                        const selected = selectedId === sentence.id;
                        return (
                          <span
                            key={sentence.id}
                            data-sentence-id={sentence.id}
                            onPointerDown={() => {
                              setSelectedId(sentence.id);
                              recordProgress(section, paragraph, sentence);
                            }}
                          >
                            {index > 0 ? " " : null}
                            <AnalyzableEnglish
                              inline
                              sentence={sentence.text}
                              context={neighborContext(paragraph, sentence)}
                              analyzeLabel={ui.insightAnalyze}
                              sourceType="web"
                              language={targetLanguage}
                              className={
                                selected
                                  ? "rounded-md bg-amber-50 px-0.5 text-[17px] leading-8 text-slate-800"
                                  : "rounded-md px-0.5 text-[17px] leading-8 text-slate-800"
                              }
                              onAnalyze={(selectedText) =>
                                analyzeSpan(
                                  section,
                                  paragraph,
                                  sentence,
                                  selectedText,
                                )
                              }
                            />
                          </span>
                        );
                      })}
                    </p>
                    {selectedSentence ? (
                      <button
                        type="button"
                        onClick={() =>
                          analyzeSentence(
                            section,
                            paragraph,
                            selectedSentence,
                          )
                        }
                        className="mt-1 rounded-full bg-slate-900 px-3 py-1 text-[11px] font-medium text-white hover:bg-slate-800"
                      >
                        {ui.exploreSubmit}
                      </button>
                    ) : null}
                  </div>
                );
              })}
            </section>
          ))}
        </article>
      </div>
    </div>
  );
}
