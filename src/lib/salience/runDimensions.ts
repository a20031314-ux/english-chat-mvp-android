import { buildAllDimensionPrompts } from "./dimensionPrompts.ts";
import {
  getLanguageProfile,
  languageDisplayName,
} from "./languageProfiles.ts";
import type {
  AnalysisDimension,
  AnalysisResult,
  DimensionCall,
  SalienceCandidate,
} from "./types.ts";

export type DimensionCaller = (
  call: DimensionCall,
) => Promise<string>;

export type RunDimensionsInput = {
  sentence: string;
  language: string;
  nativeLanguage: string;
  explanationLanguage?: string;
  candidate: Pick<SalienceCandidate, "tokenRange" | "originalText" | "signalTags">;
  translation?: string;
  salienceReason?: string;
  callDimension: DimensionCaller;
};

function keepDimensionText(text: string): string | null {
  const trimmed = text.trim();
  if (!trimmed || /^skip$/i.test(trimmed)) return null;
  return trimmed;
}

/**
 * Looks up the language profile and calls only those dimensions, in parallel.
 * No `if (language === "en")` here — new languages are profile rows only.
 */
export async function runActiveDimensions(
  input: RunDimensionsInput,
): Promise<AnalysisResult> {
  const profile = getLanguageProfile(input.language);
  const explanationLanguage = input.explanationLanguage ?? input.nativeLanguage;
  const calls = buildAllDimensionPrompts(profile.activeDimensions, {
    language: profile.languageCode,
    languageName: languageDisplayName(input.language),
    nativeLanguage: input.nativeLanguage,
    explanationLanguage,
    sentence: input.sentence,
    spanText: input.candidate.originalText,
    signalTags: input.candidate.signalTags,
    focusByDimension: profile.dimensionFocus,
  });

  const entries = await Promise.all(
    calls.map(async (call) => {
      const raw = await input.callDimension(call);
      const kept = keepDimensionText(raw);
      return kept ? ([call.dimension, kept] as const) : null;
    }),
  );

  const dimensionResults: Partial<Record<AnalysisDimension, string>> = {};
  for (const entry of entries) {
    if (!entry) continue;
    dimensionResults[entry[0]] = entry[1];
  }

  return {
    tokenRange: input.candidate.tokenRange,
    originalText: input.candidate.originalText,
    translation: input.translation ?? "",
    dimensionResults,
    salienceReason: input.salienceReason ?? input.candidate.signalTags.join(", "),
    examples: [],
    calledDimensions: calls.map((c) => c.dimension),
  };
}

export function recordingDimensionCaller(sink: AnalysisDimension[]): DimensionCaller {
  return async (call) => {
    sink.push(call.dimension);
    return `[stub:${call.dimension}] ${call.prompt.slice(0, 40)}`;
  };
}
