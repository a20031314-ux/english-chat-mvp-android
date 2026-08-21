"use client";

import { useCallback, useMemo, useState } from "react";
import { EpubRenderer } from "@/components/studyMaterials/EpubRenderer";
import { PdfRenderer } from "@/components/studyMaterials/PdfRenderer";
import { StudyImageBoard } from "@/components/studyMaterials/StudyImageBoard";
import type { UICopy } from "@/lib/copy";
import type { ContentSelection } from "@/lib/studyMaterials/contentSelection";
import { neighborsAround } from "@/lib/studyMaterials/contentSelection";
import type { StudyDocument, StudySection } from "@/lib/studyMaterials/types";

export function InteractiveContentViewer({
  document,
  ui,
  selectedId,
  onSelectionAction,
  onProgress,
}: {
  document: StudyDocument;
  ui: UICopy;
  selectedId: string | null;
  onSelectionAction: (
    selection: ContentSelection,
    action: "gloss" | "analyze" | "save",
  ) => void;
  onProgress: (input: {
    section: StudySection;
    page?: number;
    index?: number;
  }) => void;
}) {
  const emit = useCallback(
    (next: ContentSelection | null) => {
      if (!next) return;
      const action =
        next.mode === "span" && next.text.split(/\s+/).length <= 2
          ? "gloss"
          : "analyze";
      onSelectionAction(next, action);
    },
    [onSelectionAction],
  );

  const handleChapter = useCallback(
    (section: StudySection, index: number) => {
      onProgress({ section, index });
    },
    [onProgress],
  );

  const handlePage = useCallback(
    (section: StudySection, page: number) => {
      onProgress({ section, page });
    },
    [onProgress],
  );

  const imageSections = useMemo(
    () => document.sections.filter((section) => section.imageDataUrl),
    [document.sections],
  );
  const [imageIndex, setImageIndex] = useState(() => {
    const page = document.progress.page;
    if (!page) return 0;
    const found = imageSections.findIndex((section) => section.page === page);
    return found >= 0 ? found : Math.min(imageSections.length - 1, page - 1);
  });
  const imageSection = imageSections[imageIndex] ?? imageSections[0];

  const original =
    Boolean(document.sourceFileId) &&
    (document.type === "epub" || document.type === "pdf");

  return (
    <div className="relative flex min-h-0 flex-1 flex-col bg-slate-100">
      {document.type === "epub" && original ? (
        <EpubRenderer
          document={document}
          ui={ui}
          onSelection={emit}
          onChapter={handleChapter}
        />
      ) : document.type === "pdf" && original ? (
        <PdfRenderer
          document={document}
          ui={ui}
          selectedId={selectedId}
          onSelection={emit}
          onPage={handlePage}
        />
      ) : document.type === "image" && imageSection ? (
        <>
          <div className="min-h-0 flex-1">
            <StudyImageBoard
              section={imageSection}
              selectedId={selectedId}
              zoomInLabel={ui.studyZoomIn}
              zoomOutLabel={ui.studyZoomOut}
              onAnalyze={({ text }) => {
                const blocks = imageSection.paragraphs.flatMap((row) =>
                  row.sentences.map((item) => item.text),
                );
                const around = neighborsAround(blocks, text);
                emit({
                  text,
                  contextSentence: around.sentence || text,
                  sectionId: imageSection.id,
                  page: imageSection.page ?? imageIndex + 1,
                  mode: "sentence",
                  ...(around.previous ? { previous: around.previous } : {}),
                  ...(around.next ? { next: around.next } : {}),
                });
                onProgress({
                  section: imageSection,
                  page: imageSection.page ?? imageIndex + 1,
                  index: imageIndex,
                });
              }}
            />
          </div>
          {imageSections.length > 1 ? (
            <div className="flex shrink-0 items-center justify-between gap-2 border-t border-slate-200 bg-white px-3 py-2">
              <button
                type="button"
                disabled={imageIndex <= 0}
                onClick={() => {
                  const next = imageIndex - 1;
                  const row = imageSections[next];
                  if (!row) return;
                  setImageIndex(next);
                  onProgress({
                    section: row,
                    page: row.page ?? next + 1,
                    index: next,
                  });
                }}
                className="rounded-lg px-2 py-1.5 text-xs text-slate-700 disabled:text-slate-300"
              >
                {ui.studyChapterPrev}
              </button>
              <p className="text-[11px] text-slate-500">
                {ui.studyPages
                  .replace("{current}", String(imageIndex + 1))
                  .replace("{total}", String(imageSections.length))}
              </p>
              <button
                type="button"
                disabled={imageIndex >= imageSections.length - 1}
                onClick={() => {
                  const next = imageIndex + 1;
                  const row = imageSections[next];
                  if (!row) return;
                  setImageIndex(next);
                  onProgress({
                    section: row,
                    page: row.page ?? next + 1,
                    index: next,
                  });
                }}
                className="rounded-lg px-2 py-1.5 text-xs text-slate-700 disabled:text-slate-300"
              >
                {ui.studyChapterNext}
              </button>
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  );
}

export function canUseOriginalViewer(document: StudyDocument): boolean {
  if (document.type === "image") {
    return document.sections.some((section) => Boolean(section.imageDataUrl));
  }
  if (document.type === "epub" || document.type === "pdf") {
    return Boolean(document.sourceFileId);
  }
  return false;
}
