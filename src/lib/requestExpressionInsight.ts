import { apiUrl } from "@/lib/apiBase";
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
    headers: { "Content-Type": "application/json" },
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
  if (!response.ok) return null;
  const data: unknown = await response.json();
  return normalizeExpressionInsight(data, input.selected);
}
