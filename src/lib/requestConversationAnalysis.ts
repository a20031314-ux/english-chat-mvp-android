import type { ChatMessage } from "@/components/ArchivePanel";
import { apiUrl } from "@/lib/apiBase";
import type { Locale } from "@/lib/copy";
import {
  buildHeuristicConversationAnalysis,
  extractAnalysisTurns,
  mergeConversationAnalysis,
  normalizeConversationAnalysis,
  type ConversationAnalysis,
} from "@/lib/conversationAnalysis";

export async function requestConversationAnalysis(
  messages: ChatMessage[],
  locale: Locale,
): Promise<ConversationAnalysis | null> {
  const turns = extractAnalysisTurns(messages).slice(0, 40);
  if (turns.length === 0) return null;
  const fallback = buildHeuristicConversationAnalysis(messages, locale);

  try {
    const response = await fetch(apiUrl("/api/report-analysis"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locale, turns }),
      signal: AbortSignal.timeout(20000),
    });
    if (!response.ok) return fallback.insights.length ? fallback : null;
    const data: unknown = await response.json();
    const ai = normalizeConversationAnalysis(data, turns);
    if (!ai) return fallback.insights.length ? fallback : null;
    return mergeConversationAnalysis(ai, fallback);
  } catch {
    return fallback.insights.length ? fallback : null;
  }
}
