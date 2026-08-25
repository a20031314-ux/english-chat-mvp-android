"use client";

import { useRef, useState, type DragEvent, type FormEvent } from "react";
import { useLearningLanguageOptional } from "@/contexts/LearningLanguageContext";
import type { UICopy } from "@/lib/copy";
import { DEFAULT_LEARNING_LANGUAGE_CODE } from "@/lib/learningLanguages";
import { importStudyFiles } from "@/lib/studyMaterials/importFile";
import { saveStudyDocument } from "@/lib/studyMaterials/storage";
import {
  StudyImportError,
  type ImportStage,
  type StudyDocument,
} from "@/lib/studyMaterials/types";

const ACCEPT =
  ".pdf,.epub,.txt,.text,application/pdf,application/epub+zip,text/plain";

function stageLabel(stage: ImportStage, ui: UICopy): string {
  if (stage === "reading") return ui.studyStageReading;
  if (stage === "extracting") return ui.studyStageExtracting;
  if (stage === "normalizing") return ui.studyStageNormalizing;
  return ui.studyStageReady;
}

function errorMessage(error: unknown, ui: UICopy): string {
  if (error instanceof StudyImportError) {
    if (error.code === "unsupported") return ui.studyUnsupported;
    if (error.code === "protected") return ui.studyProtected;
    if (error.code === "no_text") return ui.studyNoText;
    if (error.code === "too_large") return ui.studyTooLarge;
    if (error.code === "image_ocr_unavailable") return ui.studyImageSoon;
  }
  return ui.studyFailed;
}

export function StudyUpload({
  ui,
  onImported,
  onCancel,
}: {
  ui: UICopy;
  onImported: (document: StudyDocument) => void;
  onCancel: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const learningLanguage = useLearningLanguageOptional();
  const targetLanguage =
    learningLanguage?.targetLanguage ?? DEFAULT_LEARNING_LANGUAGE_CODE;
  const [dragOver, setDragOver] = useState(false);
  const [stage, setStage] = useState<ImportStage | null>(null);
  const [error, setError] = useState<string | null>(null);
  const busy = stage !== null && stage !== "ready";

  const handleFiles = async (files: FileList | File[]) => {
    if (!files[0] || busy) return;
    setError(null);
    setStage("reading");
    try {
      const document = await importStudyFiles(files, setStage, {
        targetLanguage,
      });
      await saveStudyDocument(document);
      setStage("ready");
      onImported(document);
    } catch (caught) {
      setStage(null);
      setError(errorMessage(caught, ui));
    }
  };

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(false);
    void handleFiles(event.dataTransfer.files);
  };

  const pick = (accept: string, multiple = false) => {
    const input = inputRef.current;
    if (!input) return;
    input.accept = accept;
    input.multiple = multiple;
    input.click();
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <header className="flex shrink-0 items-center gap-2 border-b border-white/10 px-3 py-2.5">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg px-2 py-1.5 text-sm text-slate-300 hover:bg-white/10"
        >
          {ui.studyBack}
        </button>
        <h2 className="text-sm font-semibold text-slate-100">{ui.studyAdd}</h2>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-6">
        <div
          onDragOver={(event) => {
            event.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          className={`rounded-2xl border-2 border-dashed px-4 py-8 text-center ${
            dragOver
              ? "border-slate-700 bg-white/5"
              : "border-white/10 bg-[#121212]"
          }`}
        >
          <p className="whitespace-pre-line text-sm font-medium text-slate-100">
            {ui.studyDropHint}
          </p>
          <form
            onSubmit={(event: FormEvent) => event.preventDefault()}
            className="mt-4 flex flex-wrap justify-center gap-2"
          >
            <button
              type="button"
              disabled={busy}
              onClick={() => pick(".pdf,application/pdf")}
              className="rounded-full border border-white/10 px-3 py-1.5 text-sm text-slate-200 hover:bg-white/10 disabled:opacity-50"
            >
              PDF
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => pick(".epub,application/epub+zip")}
              className="rounded-full border border-white/10 px-3 py-1.5 text-sm text-slate-200 hover:bg-white/10 disabled:opacity-50"
            >
              EPUB
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => pick(".txt,.text,text/plain")}
              className="rounded-full border border-white/10 px-3 py-1.5 text-sm text-slate-200 hover:bg-white/10 disabled:opacity-50"
            >
              TXT
            </button>
          </form>
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPT}
            className="hidden"
            onChange={(event) => {
              if (event.target.files) void handleFiles(event.target.files);
              event.target.value = "";
            }}
          />
        </div>

        {busy || stage === "ready" ? (
          <p className="mt-4 text-center text-sm text-slate-300">
            {stage ? stageLabel(stage, ui) : ui.studyStageReading}
          </p>
        ) : null}
        {error ? (
          <p className="mt-4 text-center text-sm text-rose-300">{error}</p>
        ) : null}
      </div>
    </div>
  );
}
