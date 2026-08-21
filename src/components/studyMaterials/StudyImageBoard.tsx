"use client";

import type {
  StudyImageOverlay,
  StudyParagraph,
  StudySection,
  StudySentence,
} from "@/lib/studyMaterials/types";

export function StudyImageBoard({
  section,
  selectedId,
  hint,
  onSelect,
}: {
  section: StudySection;
  selectedId: string | null;
  hint: string;
  onSelect: (input: {
    overlay: StudyImageOverlay;
    paragraph: StudyParagraph;
    sentence: StudySentence;
  }) => void;
}) {
  const image = section.imageDataUrl;
  const overlays = section.overlays ?? [];
  if (!image) return null;

  const lookup = (overlay: StudyImageOverlay) => {
    const paragraph = section.paragraphs.find(
      (row) => row.id === overlay.paragraphId,
    );
    const sentence = paragraph?.sentences.find(
      (row) => row.id === overlay.sentenceId,
    );
    if (!paragraph || !sentence) return;
    onSelect({ overlay, paragraph, sentence });
  };

  return (
    <div>
      <p className="mb-2 text-xs leading-relaxed text-slate-500">{hint}</p>
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt=""
          className="block h-auto w-full select-none"
          draggable={false}
        />
        {overlays.map((overlay) => {
          const selected = overlay.sentenceId === selectedId;
          return (
            <button
              key={overlay.sentenceId}
              type="button"
              data-sentence-id={overlay.sentenceId}
              aria-label={
                section.paragraphs
                  .find((row) => row.id === overlay.paragraphId)
                  ?.sentences.find((row) => row.id === overlay.sentenceId)
                  ?.text || "text"
              }
              onClick={() => lookup(overlay)}
              className={`absolute rounded-sm border transition ${
                selected
                  ? "border-amber-400 bg-amber-300/35"
                  : "border-white/0 bg-amber-200/0 hover:border-amber-300/80 hover:bg-amber-300/25"
              }`}
              style={{
                left: `${overlay.x * 100}%`,
                top: `${overlay.y * 100}%`,
                width: `${overlay.w * 100}%`,
                height: `${overlay.h * 100}%`,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
