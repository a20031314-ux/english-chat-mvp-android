import { apiUrl } from "@/lib/apiBase";
import type { AnalysisResult, RankedSalienceCandidate } from "@/lib/salience/types";

export async function fetchSalienceAnalysis(input: {
  sentence: string;
  language: string;
  nativeLanguage: string;
  explanationLanguage?: string;
  translation?: string;
  candidate: RankedSalienceCandidate;
}): Promise<AnalysisResult | null> {
  const response = await fetch(apiUrl("/api/salience/analyze"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sentence: input.sentence,
      language: input.language,
      nativeLanguage: input.nativeLanguage,
      explanationLanguage: input.explanationLanguage ?? input.nativeLanguage,
      ...(input.translation ? { translation: input.translation } : {}),
      originalText: input.candidate.originalText,
      tokenRange: input.candidate.tokenRange,
      signalTags: input.candidate.signalTags,
      salienceReason: input.candidate.salienceReason,
    }),
    signal: AbortSignal.timeout(40000),
  });
  if (!response.ok) return null;
  const data: unknown = await response.json();
  if (!data || typeof data !== "object") return null;
  const o = data as AnalysisResult;
  if (!o.originalText || !o.dimensionResults) return null;
  return o;
}
