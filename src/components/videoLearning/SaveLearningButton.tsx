"use client";

import type { UICopy } from "@/lib/copy";

export function SaveLearningButton({
  ui,
  saved,
  onSave,
}: {
  ui: UICopy;
  saved: boolean;
  onSave: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSave}
      disabled={saved}
      className="rounded-lg px-2.5 py-1.5 text-xs text-slate-600 hover:bg-slate-100 disabled:text-slate-400"
    >
      {saved ? ui.saved : ui.videoLearnSave}
    </button>
  );
}
