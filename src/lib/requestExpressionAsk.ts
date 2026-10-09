import { apiUrl } from "@/lib/apiBase";
import type { AskTurn } from "@/lib/sentenceNotes";

export type ExpressionAskResult =
  | { ok: true; answer: string }
  | { ok: false; reason: "limit"; limit: number }
  | { ok: false; reason: "failed" };

/**
 * Ask `/api/expression-ask` a question about some words in a sentence. The
 * earlier turns on the same words go along so a follow-up ("then why not
 * 'to go'?") is read in their light.
 */
export async function requestExpressionAsk(input: {
  sentence: string;
  selected: string;
  question: string;
  /** A one-tap question; the server asks its own wording, `question` is the label shown. */
  preset?: "meaning" | "form" | "alternatives";
  history?: AskTurn[];
  context?: string[];
  interfaceLanguage: string;
  targetLanguage: string;
}): Promise<ExpressionAskResult> {
  try {
    const response = await fetch(apiUrl("/api/expression-ask"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sentence: input.sentence,
        selected: input.selected,
        question: input.question,
        ...(input.preset ? { preset: input.preset } : {}),
        interfaceLanguage: input.interfaceLanguage,
        targetLanguage: input.targetLanguage,
        ...(input.context?.length ? { context: input.context.slice(-4) } : {}),
        ...(input.history?.length
          ? {
              history: input.history
                .slice(-4)
                .map(({ question, answer }) => ({ question, answer })),
            }
          : {}),
      }),
      signal: AbortSignal.timeout(30000),
    });
    const data = (await response.json().catch(() => ({}))) as {
      answer?: unknown;
      error?: unknown;
      limit?: unknown;
    };
    if (response.status === 429 && data.error === "ASK_LIMIT_REACHED") {
      return {
        ok: false,
        reason: "limit",
        limit: typeof data.limit === "number" ? data.limit : 0,
      };
    }
    const answer = typeof data.answer === "string" ? data.answer.trim() : "";
    if (!response.ok || !answer) return { ok: false, reason: "failed" };
    return { ok: true, answer };
  } catch {
    return { ok: false, reason: "failed" };
  }
}
