import { apiUrl } from "@/lib/apiBase";
import type { LearnerLevel } from "@/lib/languageAnalysisPrompt";
import type { TranslationSourceType } from "@/lib/naturalTranslation";
import type { AnalysisResult, RankedSalienceCandidate } from "@/lib/salience/types";

export async function fetchSalienceRecommendations(input: {
  sentence: string;
  language: string;
  nativeLanguage: string;
  sourceType?: TranslationSourceType;
  learnerLevel?: LearnerLevel;
  topN?: number;
}): Promise<RankedSalienceCandidate[]> {
  const sentence = input.sentence.replace(/\s+/g, " ").trim();
  if (!sentence) return [];
  const response = await fetch(apiUrl("/api/salience/recommend"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sentence,
      language: input.language,
      nativeLanguage: input.nativeLanguage,
      ...(input.sourceType ? { sourceType: input.sourceType } : {}),
      ...(input.learnerLevel ? { learnerLevel: input.learnerLevel } : {}),
      ...(input.topN ? { topN: input.topN } : {}),
    }),
    signal: AbortSignal.timeout(25000),
  });
  if (!response.ok) return [];
  const data: unknown = await response.json();
  if (!data || typeof data !== "object") return [];
  const rows = (data as { recommendations?: unknown }).recommendations;
  if (!Array.isArray(rows)) return [];
  return rows.filter(isRankedCandidate);
}

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

function isRankedCandidate(value: unknown): value is RankedSalienceCandidate {
  if (!value || typeof value !== "object") return false;
  const o = value as RankedSalienceCandidate;
  return (
    typeof o.originalText === "string" &&
    typeof o.charStart === "number" &&
    typeof o.charEnd === "number" &&
    typeof o.tokenRange?.start === "number" &&
    typeof o.tokenRange?.end === "number"
  );
}
