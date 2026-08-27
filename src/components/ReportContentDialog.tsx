"use client";

import { useEffect, useState } from "react";
import type { UICopy } from "@/lib/copy";
import {
  REPORT_NOTE_MAX,
  REPORT_REASONS,
  submitContentReport,
  type ReportReason,
  type ReportSurface,
} from "@/lib/reportContent";

export type ReportTarget = {
  surface: ReportSurface;
  /** The flagged AI output. Empty when opened from a menu rather than a message. */
  excerpt: string;
};

const REASON_LABEL: Record<ReportReason, keyof UICopy> = {
  offensive: "reportReasonOffensive",
  inaccurate: "reportReasonInaccurate",
  unsafe: "reportReasonUnsafe",
  other: "reportReasonOther",
};

/** Lets a learner flag AI-generated output. Required for generative AI apps on Play. */
export function ReportContentDialog({
  ui,
  locale,
  learningLanguage,
  target,
  onClose,
  onSent,
}: {
  ui: UICopy;
  locale: string;
  learningLanguage: string;
  target: ReportTarget;
  onClose: () => void;
  onSent: (ok: boolean) => void;
}) {
  const [reason, setReason] = useState<ReportReason>("offensive");
  const [note, setNote] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const send = async () => {
    setSending(true);
    const ok = await submitContentReport({
      surface: target.surface,
      reason,
      excerpt: target.excerpt,
      note,
      locale,
      learningLanguage,
    });
    setSending(false);
    onSent(ok);
    if (ok) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center overflow-y-auto bg-black/60 p-3 sm:items-center"
      onClick={onClose}
    >
      {/* The actions live in the header. A footer can be pushed off a short
          screen by the keyboard; a header cannot, whatever the content does. */}
      <div
        className="flex max-h-[85%] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#121212] shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex shrink-0 items-center gap-2 border-b border-white/10 px-3 py-2">
          <button
            type="button"
            onClick={onClose}
            disabled={sending}
            className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-slate-200 hover:bg-white/10 disabled:opacity-60"
          >
            {ui.reportCancel}
          </button>
          <h2 className="min-w-0 flex-1 truncate text-center text-sm font-semibold text-white">
            {ui.reportTitle}
          </h2>
          <button
            type="button"
            onClick={() => void send()}
            disabled={sending}
            className="rounded-lg bg-[#e8e8e4] px-3 py-1.5 text-xs font-medium text-neutral-900 hover:bg-white disabled:opacity-60"
          >
            {ui.reportSubmit}
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <p className="px-4 pt-3 text-xs leading-relaxed text-slate-400">
            {ui.reportSubtitle}
          </p>

          {target.excerpt ? (
            <p className="mx-4 mt-2 max-h-20 overflow-y-auto rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-300">
              {target.excerpt}
            </p>
          ) : null}

          <div className="space-y-1 px-4 py-3">
            {REPORT_REASONS.map((value) => (
              <label
                key={value}
                className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-slate-100 hover:bg-white/5"
              >
                <input
                  type="radio"
                  name="report-reason"
                  value={value}
                  checked={reason === value}
                  onChange={() => setReason(value)}
                  className="accent-white"
                />
                {ui[REASON_LABEL[value]]}
              </label>
            ))}
          </div>

          <div className="px-4 pb-4">
            <label
              htmlFor="report-note"
              className="block text-[11px] text-slate-400"
            >
              {ui.reportNoteLabel}
            </label>
            <textarea
              id="report-note"
              value={note}
              maxLength={REPORT_NOTE_MAX}
              onChange={(event) => setNote(event.target.value)}
              rows={3}
              className="mt-1 w-full resize-none rounded-lg border border-white/15 bg-[#0a0a0a] px-3 py-2 text-xs text-slate-100 outline-none focus:border-white/30"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
