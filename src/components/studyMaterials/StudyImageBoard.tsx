"use client";

import { ZoomableStage } from "@/components/studyMaterials/ZoomableStage";
import type {
  StudyImageOverlay,
  StudyParagraph,
  StudySection,
  StudySentence,
} from "@/lib/studyMaterials/types";

export function StudyImageBoard({
  section,
  selectedId,
  zoomInLabel,
  zoomOutLabel,
  onAnalyze,
}: {
  section: StudySection;
  selectedId: string | null;
  zoomInLabel: string;
  zoomOutLabel: string;
  onAnalyze: (input: {
    overlay: StudyImageOverlay;
    paragraph: StudyParagraph;
    sentence: StudySentence;
    text: string;
  }) => void;
}) {
  const image = section.imageDataUrl;
  const sentences = section.paragraphs.flatMap((paragraph) =>
    paragraph.sentences.map((sentence) => ({ paragraph, sentence })),
  );

  if (!image) return null;

  return (
    <div className="flex h-full min-h-0 flex-col bg-slate-100">
      <div className="min-h-0 flex-1">
        <ZoomableStage zoomInLabel={zoomInLabel} zoomOutLabel={zoomOutLabel}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt=""
            className="block h-auto w-full select-none"
            draggable={false}
          />
        </ZoomableStage>
      </div>
      {sentences.length > 0 ? (
        <div className="max-h-[42%] shrink-0 overflow-y-auto border-t border-slate-200 bg-white">
          <ol className="divide-y divide-slate-100">
            {sentences.map(({ paragraph, sentence }, index) => {
              const selected = selectedId === sentence.id;
              return (
                <li key={sentence.id}>
                  <button
                    type="button"
                    onClick={() =>
                      onAnalyze({
                        overlay: {
                          sentenceId: sentence.id,
                          paragraphId: paragraph.id,
                          x: 0,
                          y: 0,
                          w: 0,
                          h: 0,
                        },
                        paragraph,
                        sentence,
                        text: sentence.text,
                      })
                    }
                    className={`flex w-full items-start gap-2 px-3 py-2.5 text-left text-[15px] leading-6 ${
                      selected
                        ? "bg-amber-50 text-slate-900"
                        : "text-slate-800 hover:bg-slate-50"
                    }`}
                  >
                    <span className="mt-0.5 w-5 shrink-0 text-[11px] text-slate-400">
                      {index + 1}
                    </span>
                    <span>{sentence.text}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      ) : null}
    </div>
  );
}
