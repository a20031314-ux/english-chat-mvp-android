"use client";

import type { UICopy } from "@/lib/copy";

export function SelectionActionBar({
  selectedText,
  ui,
  onGloss,
  onAnalyze,
  onSave,
  onClose,
}: {
  selectedText: string;
  ui: UICopy;
  onGloss: () => void;
  onAnalyze: () => void;
  onSave: () => void;
  onClose: () => void;
}) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-center p-3">
      <div className="pointer-events-auto flex max-w-full items-center gap-1 rounded-2xl border border-slate-200 bg-white/95 px-2 py-1.5 shadow-lg backdrop-blur">
        <p className="max-w-[9rem] truncate px-2 text-xs font-medium text-slate-700">
          {selectedText}
        </p>
        <button
          type="button"
          onClick={onGloss}
          className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-800 hover:bg-slate-200"
        >
          {ui.studySelectGloss}
        </button>
        <button
          type="button"
          onClick={onAnalyze}
          className="rounded-full bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800"
        >
          {ui.insightAnalyze}
        </button>
        <button
          type="button"
          onClick={onSave}
          className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-800 hover:bg-slate-200"
        >
          {ui.vocabPreviewSave}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full px-2 py-1.5 text-xs text-slate-500 hover:bg-slate-50"
          aria-label={ui.insightClose}
        >
          ×
        </button>
      </div>
    </div>
  );
}
