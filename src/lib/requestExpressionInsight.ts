import { apiUrl } from "@/lib/apiBase";
import { entitlementHeaders, readCachedTier } from "@/lib/billing/billingService";
import {
  normalizeExpressionInsight,
  type ExpressionInsight,
  type ExpressionInsightRequest,
} from "@/lib/expressionInsight";

export async function requestExpressionInsight(
  input: ExpressionInsightRequest,
): Promise<ExpressionInsight | null> {
  const response = await fetch(apiUrl("/api/expression-insight"), {
    method: "POST",
    // 누가 물었는지 서버가 알아야 AI 도움 하루 한도를 센다(server/aiHelp.ts).
    headers: { "Content-Type": "application/json", ...entitlementHeaders(readCachedTier() !== "free") },
    body: JSON.stringify({
      sentence: input.sentence,
      selected: input.selected,
      locale: input.locale,
      interfaceLanguage: input.interfaceLanguage ?? input.locale,
      ...(input.targetLanguage ? { targetLanguage: input.targetLanguage } : {}),
      ...(input.context?.length ? { context: input.context } : {}),
    }),
    signal: AbortSignal.timeout(20000),
  });
  if (response.status === 429) throw new Error("AI_HELP_LIMIT");
  if (!response.ok) return null;
  const data: unknown = await response.json();
  return normalizeExpressionInsight(data, input.selected);
}
