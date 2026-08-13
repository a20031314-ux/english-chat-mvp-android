import type { ChatMessage } from "@/components/ArchivePanel";
import { apiUrl } from "@/lib/apiBase";
import { PREMIUM_CLIENT_HEADER } from "@/lib/billing/config";
import type { Locale } from "@/lib/copy";
import {
  buildHeuristicConversationAnalysis,
  extractAnalysisTurns,
  mergeConversationAnalysis,
  normalizeConversationAnalysis,
  type ConversationAnalysis,
} from "@/lib/conversationAnalysis";

export class ReportDailyLimitError extends Error {
  constructor() {
    super("REPORT_DAILY_LIMIT_REACHED");
    this.name = "ReportDailyLimitError";
  }
}

export async function requestConversationAnalysis(
  messages: ChatMessage[],
  locale: Locale,
  options?: { isPremium?: boolean },
): Promise<ConversationAnalysis | null> {
  const turns = extractAnalysisTurns(messages).slice(0, 40);
  if (turns.length === 0) return null;
  const fallback = buildHeuristicConversationAnalysis(messages, locale);

  try {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    if (options?.isPremium) {
      headers[PREMIUM_CLIENT_HEADER] = "1";
    }
    const response = await fetch(apiUrl("/api/report-analysis"), {
      method: "POST",
      headers,
      body: JSON.stringify({ locale, turns }),
      signal: AbortSignal.timeout(20000),
    });
    if (response.status === 403) {
      const errorBody = (await response.json().catch(() => ({}))) as {
        error?: string;
      };
      if (errorBody.error === "REPORT_DAILY_LIMIT_REACHED") {
        throw new ReportDailyLimitError();
      }
    }
    if (!response.ok) return fallback.insights.length ? fallback : null;
    const data: unknown = await response.json();
    const ai = normalizeConversationAnalysis(data, turns);
    if (!ai) return fallback.insights.length ? fallback : null;
    return mergeConversationAnalysis(ai, fallback);
  } catch (error) {
    if (error instanceof ReportDailyLimitError) throw error;
    return fallback.insights.length ? fallback : null;
  }
}
