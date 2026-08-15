import { apiUrl } from "@/lib/apiBase";
import {
  normalizeEnglishElementAnalysis,
  normalizeEnglishInputAnalysis,
  type EnglishElementAnalysis,
  type EnglishInputAnalysis,
} from "@/lib/englishAnalysis";
import type { LearnerLevel } from "@/lib/languageAnalysisPrompt";
import type { TranslationSourceType } from "@/lib/naturalTranslation";

export async function analyzeEnglishInput(input: {
  text: string;
  locale: string;
  interfaceLanguage?: string;
  targetLanguage?: string;
  sourceType?: TranslationSourceType;
  language?: string;
  learnerLevel?: LearnerLevel;
}): Promise<EnglishInputAnalysis | null> {
  const text = input.text.replace(/\s+/g, " ").trim();
  if (!text) return null;
  const response = await fetch(apiUrl("/api/english-analysis/input"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text,
      locale: input.locale,
      interfaceLanguage: input.interfaceLanguage ?? input.locale,
      ...(input.targetLanguage ? { targetLanguage: input.targetLanguage } : {}),
      ...(input.sourceType ? { sourceType: input.sourceType } : {}),
      ...(input.language ? { language: input.language } : {}),
      ...(input.learnerLevel ? { learnerLevel: input.learnerLevel } : {}),
    }),
    signal: AbortSignal.timeout(25000),
  });
  if (!response.ok) return null;
  const data: unknown = await response.json();
  return normalizeEnglishInputAnalysis(data, text);
}

export async function analyzeEnglishElement(input: {
  selectedText: string;
  contextSentence: string;
  locale: string;
  interfaceLanguage?: string;
  targetLanguage?: string;
  context?: string[];
  sourceType?: TranslationSourceType;
  language?: string;
  learnerLevel?: LearnerLevel;
}): Promise<EnglishElementAnalysis | null> {
  const selectedText = input.selectedText.replace(/\s+/g, " ").trim();
  const contextSentence = input.contextSentence.replace(/\s+/g, " ").trim();
  if (!selectedText || !contextSentence) return null;
  const response = await fetch(apiUrl("/api/english-analysis/element"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      selectedText,
      contextSentence,
      locale: input.locale,
      interfaceLanguage: input.interfaceLanguage ?? input.locale,
      ...(input.targetLanguage ? { targetLanguage: input.targetLanguage } : {}),
      ...(input.context?.length ? { context: input.context } : {}),
      ...(input.sourceType ? { sourceType: input.sourceType } : {}),
      ...(input.language ? { language: input.language } : {}),
      ...(input.learnerLevel ? { learnerLevel: input.learnerLevel } : {}),
    }),
    signal: AbortSignal.timeout(25000),
  });
  if (!response.ok) return null;
  const data: unknown = await response.json();
  return normalizeEnglishElementAnalysis(data, selectedText, contextSentence);
}
