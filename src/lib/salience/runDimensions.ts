import {
  buildAllDimensionPrompts,
} from "./dimensionPrompts.ts";
import {
  getLanguageProfile,
  languageDisplayName,
} from "./languageProfiles.ts";
import { isLearnerFacingSalienceReason } from "./rankCandidates.ts";
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

const DROP_WHEN_OVERLAP: AnalysisDimension[] = [
  "etymology",
  "syntax",
  "phonology",
  "pragmatics",
];

function contentTokens(text: string): Set<string> {
  const stripped = text.replace(/[「『」』"'"`]/g, " ");
  const tokens = new Set<string>();
  for (const word of stripped.match(/[A-Za-z]{3,}/g) ?? []) {
    tokens.add(word.toLowerCase());
  }
  const hangul = stripped.replace(/[^\uac00-\ud7af]/g, "");
  for (let i = 0; i < hangul.length - 1; i++) {
    tokens.add(hangul.slice(i, i + 2));
  }
  return tokens;
}

function overlapRatio(a: string, b: string): number {
  const left = contentTokens(a);
  const right = contentTokens(b);
  if (left.size === 0 || right.size === 0) return 0;
  let shared = 0;
  for (const token of left) {
    if (right.has(token)) shared += 1;
  }
  return shared / Math.min(left.size, right.size);
}

/** Drop sections that mostly repeat a sibling (etymology/syntax first). */
export function dropRedundantDimensions(
  results: Partial<Record<AnalysisDimension, string>>,
): Partial<Record<AnalysisDimension, string>> {
  const kept: Partial<Record<AnalysisDimension, string>> = { ...results };
  for (const candidate of DROP_WHEN_OVERLAP) {
    const text = kept[candidate];
    if (!text) continue;
    const duplicate = Object.entries(kept).some(([key, other]) => {
      if (key === candidate || !other) return false;
      return overlapRatio(text, other) >= 0.55;
    });
    if (duplicate) delete kept[candidate];
  }
  const usage = kept.usageInContext;
  const morphology = kept.morphology;
  if (usage && morphology && overlapRatio(usage, morphology) >= 0.7) {
    delete kept.morphology;
  }
  return kept;
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
    dimensionResults: dropRedundantDimensions(dimensionResults),
    salienceReason: isLearnerFacingSalienceReason(input.salienceReason)
      ? (input.salienceReason ?? "").trim()
      : "",
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
