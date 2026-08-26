import { apiUrl } from "@/lib/apiBase";

/** Why the learner is flagging a piece of AI output. */
export const REPORT_REASONS = [
  "offensive",
  "inaccurate",
  "unsafe",
  "other",
] as const;

export type ReportReason = (typeof REPORT_REASONS)[number];

/** Which surface produced the content, so a report can be traced to a prompt. */
export type ReportSurface = "chat" | "call" | "analysis" | "subtitle";

export type ContentReport = {
  surface: ReportSurface;
  reason: ReportReason;
  /** The flagged AI output, trimmed. Empty when the learner reports from a menu. */
  excerpt: string;
  note: string;
  locale: string;
  learningLanguage: string;
};

export const REPORT_NOTE_MAX = 500;
export const REPORT_EXCERPT_MAX = 1000;

export function isReportReason(value: unknown): value is ReportReason {
  return (
    typeof value === "string" &&
    (REPORT_REASONS as readonly string[]).includes(value)
  );
}

/** Never throws: a failed report should tell the learner, not break the chat. */
export async function submitContentReport(
  report: ContentReport,
): Promise<boolean> {
  try {
    const response = await fetch(apiUrl("/api/report"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...report,
        excerpt: report.excerpt.slice(0, REPORT_EXCERPT_MAX),
        note: report.note.slice(0, REPORT_NOTE_MAX),
      }),
      signal: AbortSignal.timeout(12000),
    });
    return response.ok;
  } catch {
    return false;
  }
}
