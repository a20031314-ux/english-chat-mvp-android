"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnalyzableEnglish } from "@/components/AnalyzableEnglish";
import {
  canUseOriginalViewer,
  InteractiveContentViewer,
} from "@/components/studyMaterials/InteractiveContentViewer";
import { useEnglishAnalysisOptional } from "@/contexts/EnglishAnalysisContext";
import { useLearningLanguageOptional } from "@/contexts/LearningLanguageContext";
import { useVocabPreviewOptional } from "@/contexts/VocabPreviewContext";
import type { Locale, UICopy } from "@/lib/copy";
import { rememberEnglishAnalysis } from "@/lib/englishAnalysisRecent";
import { DEFAULT_LEARNING_LANGUAGE_CODE } from "@/lib/learningLanguages";
import type { ContentSelection } from "@/lib/studyMaterials/contentSelection";
import {
  locationForSentence,
  neighborContext,
  selectionAnalysisTarget,
  sentenceAnalysisTarget,
} from "@/lib/studyMaterials/analysisAdapter";
import {
  applyOcrToImageSection,
  requestStudyImageOcr,
} from "@/lib/studyMaterials/extractImage";
import { imageOverlaysNeedRefresh, OCR_LAYOUT_VERSION } from "@/lib/studyMaterials/mergeSentences";
import {
  addStudyAnnotation,
  saveStudyDocument,
  updateStudyProgress,
} from "@/lib/studyMaterials/storage";
import type {
  StudyDocument,
  StudyParagraph,
  StudySection,
  StudySentence,
} from "@/lib/studyMaterials/types";
import { isSentenceVocabUnit } from "@/lib/vocabulary";

function nearestSentence(
  section: StudySection | undefined,
  text: string,
): { paragraph: StudyParagraph; sentence: StudySentence } | null {
  if (!section) return null;
  const needle = text.replace(/\s+/g, " ").trim().toLowerCase();
  if (!needle) return null;
  for (const paragraph of section.paragraphs) {
    for (const sentence of paragraph.sentences) {
      const hay = sentence.text.toLowerCase();
      if (hay.includes(needle) || needle.includes(hay.slice(0, 48))) {
        return { paragraph, sentence };
      }
    }
  }
  const paragraph = section.paragraphs[0];
  const sentence = paragraph?.sentences[0];
  if (!paragraph || !sentence) return null;
  return { paragraph, sentence };
}

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
  const vocab = useVocabPreviewOptional();
  const learning = useLearningLanguageOptional();
  const targetLanguage =
    learning?.targetLanguage ?? DEFAULT_LEARNING_LANGUAGE_CODE;
  const scrollerRef = useRef<HTMLDivElement>(null);
  const documentRef = useRef(document);
  const progressTimer = useRef<number | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(
    document.progress.sentenceId ?? null,
  );
  const [ocrHint, setOcrHint] = useState("");
  const originalViewer = canUseOriginalViewer(document);

  const restoredFor = useRef<string | null>(null);
  const overlayRepair = useRef<string | null>(null);

  documentRef.current = document;

  useEffect(() => {
    if (document.type !== "image") return;
    const repairKey = `${document.id}:${OCR_LAYOUT_VERSION}`;
    if (overlayRepair.current === repairKey) return;
    const needsRepair = document.sections.some(
      (section) =>
        Boolean(section.imageDataUrl) && imageOverlaysNeedRefresh(section),
    );
    if (!needsRepair) {
      overlayRepair.current = repairKey;
      return;
    }

    let cancelled = false;
    setOcrHint(ui.studyOcrPage);
    void (async () => {
      const sections = [];
      for (const section of document.sections) {
        if (
          !section.imageDataUrl ||
          !imageOverlaysNeedRefresh(section)
        ) {
          sections.push(section);
          continue;
        }
        const ocr = await requestStudyImageOcr({
          image: section.imageDataUrl,
          targetLanguage,
        });
        if (cancelled) return;
        sections.push(applyOcrToImageSection(section, ocr));
      }
      if (cancelled) return;
      overlayRepair.current = repairKey;
      const next = { ...document, sections };
      await saveStudyDocument(next);
      if (cancelled) return;
      onDocumentChange(next);
      setOcrHint("");
    })().catch(() => {
      if (!cancelled) {
        overlayRepair.current = repairKey;
        setOcrHint("");
      }
    });

    return () => {
      cancelled = true;
    };
  }, [document, onDocumentChange, targetLanguage, ui.studyOcrPage]);

  useEffect(() => {
    if (originalViewer) return;
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
  }, [
    document.id,
    document.progress.sectionId,
    document.progress.sentenceId,
    originalViewer,
  ]);

  const recordProgress = useCallback(
    (
      section: StudySection,
      paragraph?: StudyParagraph,
      sentence?: StudySentence,
      page?: number,
    ) => {
      const current = documentRef.current;
      const index = current.sections.findIndex((row) => row.id === section.id);
      const total = current.sections.length || 1;
      const progressPercent = Math.round(((index + 1) / total) * 100);
      const nextPage = page ?? section.page;
      if (
        current.progress.sectionId === section.id &&
        current.progress.page === nextPage &&
        current.progress.progressPercent === progressPercent &&
        current.progress.sentenceId === sentence?.id
      ) {
        return;
      }
      if (progressTimer.current) window.clearTimeout(progressTimer.current);
      progressTimer.current = window.setTimeout(() => {
        void updateStudyProgress(current.id, {
          sectionId: section.id,
          paragraphId: paragraph?.id,
          sentenceId: sentence?.id,
          page: nextPage,
          progressPercent,
        }).then((next) => {
          if (next) onDocumentChange(next);
        });
      }, 400);
    },
    [onDocumentChange],
  );

  useEffect(() => {
    return () => {
      if (progressTimer.current) window.clearTimeout(progressTimer.current);
    };
  }, []);

  useEffect(() => {
    if (originalViewer) return;
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
  }, [document.id, document.sections.length, originalViewer, recordProgress]);

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

  const handleOriginalAction = (
    selection: ContentSelection,
    action: "gloss" | "analyze" | "save",
  ) => {
    const section =
      document.sections.find((row) => row.id === selection.sectionId) ||
      document.sections.find((row) => row.page === selection.page) ||
      document.sections[0];
    const hit = nearestSentence(section, selection.text);
    if (section && hit) {
      setSelectedId(hit.sentence.id);
      void addStudyAnnotation(
        locationForSentence({
          document,
          section,
          paragraph: hit.paragraph,
          sentence: hit.sentence,
          selectedText: selection.text,
          kind: action === "analyze" ? "sentence" : "span",
          ...(selection.boundingBox
            ? { boundingBox: selection.boundingBox }
            : {}),
        }),
      );
      recordProgress(section, hit.paragraph, hit.sentence, selection.page);
    } else if (section) {
      recordProgress(section, undefined, undefined, selection.page);
    }

    const sentenceText =
      selection.mode === "sentence"
        ? selection.text
        : selection.contextSentence || selection.text;
    const target = selectionAnalysisTarget({
      selectedText:
        action === "analyze" || selection.mode === "sentence"
          ? sentenceText
          : selection.text,
      contextSentence: sentenceText,
      previous: selection.previous,
      next: selection.next,
      language: targetLanguage,
      intent:
        action === "analyze" || selection.mode === "sentence"
          ? "sentence"
          : undefined,
    });

    if (action === "analyze") {
      rememberEnglishAnalysis({ input: selection.contextSentence });
      analysis?.open(target);
      return;
    }

    if (isSentenceVocabUnit(selection.text, selection.contextSentence)) {
      analysis?.open({ ...target, intent: "sentence" });
      return;
    }
    vocab?.open(selection.text, selection.contextSentence);
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
      {originalViewer ? (
        <>
          <p className="shrink-0 px-4 py-1.5 text-center text-[11px] text-slate-500">
            {ocrHint ||
              (document.type === "image"
                ? ui.studyImageHint
                : ui.studySelectHint)}
          </p>
          <InteractiveContentViewer
            document={document}
            ui={ui}
            selectedId={selectedId}
            onSelectionAction={handleOriginalAction}
            onProgress={({ section, page }) => {
              recordProgress(section, undefined, undefined, page);
            }}
          />
        </>
      ) : (
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
                      <div className="text-[17px] leading-8 text-slate-800">
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
                      </div>
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
      )}
    </div>
  );
}
