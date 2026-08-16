"use client";

import type { UICopy } from "@/lib/copy";
import type { StudyDocument } from "@/lib/studyMaterials/types";

function typeLabel(document: StudyDocument): string {
  if (document.type === "epub") return "EPUB";
  if (document.type === "pdf") return "PDF";
  if (document.type === "txt") return "TXT";
  return "IMG";
}

function pageHint(document: StudyDocument, ui: UICopy): string | null {
  if (document.type !== "pdf") return null;
  const total = document.sections.length;
  const current = document.progress.page ?? 0;
  if (!total) return null;
  return ui.studyPages
    .replace("{current}", String(current || 1))
    .replace("{total}", String(total));
}

export function StudyLibrary({
  documents,
  ui,
  onAdd,
  onOpen,
  onDelete,
}: {
  documents: StudyDocument[];
  ui: UICopy;
  onAdd: () => void;
  onOpen: (document: StudyDocument) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <header className="flex shrink-0 items-center justify-between gap-2 border-b border-slate-200 px-4 py-3">
        <h1 className="text-base font-semibold text-slate-900">
          {ui.studyLibraryTitle}
        </h1>
        <button
          type="button"
          onClick={onAdd}
          className="rounded-full bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-800"
        >
          {ui.studyAdd}
        </button>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        {documents.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-10 text-center">
            <p className="whitespace-pre-line text-sm leading-relaxed text-slate-600">
              {ui.studyEmpty}
            </p>
            <button
              type="button"
              onClick={onAdd}
              className="mt-4 rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
            >
              {ui.studyAdd}
            </button>
          </div>
        ) : (
          <ul className="space-y-3">
            {documents.map((document) => {
              const percent = Math.max(
                0,
                Math.min(100, document.progress.progressPercent || 0),
              );
              const pages = pageHint(document, ui);
              return (
                <li
                  key={document.id}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <p className="text-sm font-semibold text-slate-900">
                    {document.title}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {typeLabel(document)}
                    {pages ? ` · ${pages}` : ""}
                  </p>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-amber-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500">{percent}%</p>
                  <p className="mt-2 text-xs text-slate-600">
                    {ui.studySavedExpressions.replace(
                      "{count}",
                      String(document.stats.savedExpressions),
                    )}
                    {" · "}
                    {ui.studyAnalyzedSentences.replace(
                      "{count}",
                      String(document.stats.analyzedSentences),
                    )}
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onOpen(document)}
                      className="rounded-full bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800"
                    >
                      {percent > 0 ? ui.studyContinue : ui.studyOpen}
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(document.id)}
                      className="rounded-full px-3 py-1.5 text-xs text-slate-500 hover:bg-slate-50 hover:text-rose-700"
                    >
                      {ui.studyDelete}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
