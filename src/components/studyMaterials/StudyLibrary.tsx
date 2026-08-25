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
  if (document.type !== "pdf" && document.type !== "image") return null;
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
      <header className="flex shrink-0 items-center justify-between gap-2 border-b border-white/10 px-4 py-3">
        <h1 className="text-base font-semibold text-white">
          {ui.studyLibraryTitle}
        </h1>
        <button
          type="button"
          onClick={onAdd}
          className="rounded-full bg-[#e8e8e4] px-3 py-1.5 text-sm font-medium text-neutral-900 hover:bg-[#f5f5f3]"
        >
          {ui.studyAdd}
        </button>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        {documents.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 px-4 py-10 text-center">
            <p className="whitespace-pre-line text-sm leading-relaxed text-slate-300">
              {ui.studyEmpty}
            </p>
            <button
              type="button"
              onClick={onAdd}
              className="mt-4 rounded-full bg-[#e8e8e4] px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-[#f5f5f3]"
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
                  className="rounded-2xl border border-white/10 bg-[#121212] p-4 shadow-sm"
                >
                  <button
                    type="button"
                    onClick={() => onOpen(document)}
                    className="w-full text-left"
                  >
                  <p className="text-sm font-semibold text-slate-100">
                    {document.title}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {typeLabel(document)}
                    {pages ? ` · ${pages}` : ""}
                  </p>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-[#e8e8e4]"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500">{percent}%</p>
                  <p className="mt-2 text-xs text-slate-300">
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
                  </button>
                  <div className="mt-3 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onOpen(document)}
                      className="rounded-full bg-[#e8e8e4] px-3 py-1.5 text-xs font-medium text-neutral-900 hover:bg-[#f5f5f3]"
                    >
                      {percent > 0 ? ui.studyContinue : ui.studyOpen}
                    </button>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        onDelete(document.id);
                      }}
                      className="rounded-full px-3 py-1.5 text-xs text-slate-500 hover:bg-white/10 hover:text-rose-300"
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
