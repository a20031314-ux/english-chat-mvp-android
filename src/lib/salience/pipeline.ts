import { mergeCandidateLists } from "./candidates.ts";
import {
  applyRankedJson,
  buildRankPrompt,
  filterByLearnerLevel,
  rankByScore,
} from "./rankCandidates.ts";
import { runActiveDimensions, type DimensionCaller } from "./runDimensions.ts";
import { scanLinguisticSalience } from "./scanSalience.ts";
import {
  buildSourceExpressionPrompt,
  parseSourceExpressionJson,
  scoreSourceLexicon,
} from "./sourceSignals.ts";
import { sourceContextFromTranslation } from "./sourceContext.ts";
import type {
  AnalysisResult,
  LearnerLevel,
  RankedSalienceCandidate,
  SalienceCandidate,
  SourceContext,
  UdToken,
} from "./types.ts";

export const DEFAULT_TOP_N = 3;

export type JsonCaller = (prompt: string) => Promise<unknown>;

export type RecommendSalienceInput = {
  sentence: string;
  language: string;
  nativeLanguage: string;
  sourceType?: string | null;
  sourceContext?: SourceContext;
  learnerLevel?: LearnerLevel;
  topN?: number;
  /** Optional LLM: extra source expressions as JSON. */
  sourceExpressionJson?: JsonCaller;
  /** Optional LLM: final ranking JSON. */
  rankJson?: JsonCaller;
};

export type RecommendSalienceResult = {
  tokens: UdToken[];
  parser: "english-rules" | "generic-tokenize";
  sourceContext: SourceContext;
  merged: SalienceCandidate[];
  recommendations: RankedSalienceCandidate[];
};

export async function recommendSalience(
  input: RecommendSalienceInput,
): Promise<RecommendSalienceResult> {
  const sourceContext =
    input.sourceContext ?? sourceContextFromTranslation(input.sourceType);
  const learnerLevel = input.learnerLevel ?? "intermediate";
  const topN = Math.max(1, Math.min(6, input.topN ?? DEFAULT_TOP_N));
  const scanned = scanLinguisticSalience({
    sentence: input.sentence,
    language: input.language,
    nativeLanguage: input.nativeLanguage,
  });
  const lexiconHits = scoreSourceLexicon(scanned.tokens, sourceContext);
  let merged = mergeCandidateLists(scanned.candidates, lexiconHits);

  if (input.sourceExpressionJson) {
    try {
      const prompt = buildSourceExpressionPrompt({
        sentence: input.sentence,
        language: input.language,
        sourceContext,
        alreadyFound: merged.map((item) => item.originalText),
      });
      const extra = parseSourceExpressionJson(
        await input.sourceExpressionJson(prompt),
        scanned.tokens,
      );
      merged = mergeCandidateLists(merged, extra);
    } catch (error) {
      console.info("[salience:source-llm]", error);
    }
  }

  const filtered = filterByLearnerLevel(merged, learnerLevel);
  let recommendations = rankByScore(scanned.tokens, filtered, topN);

  if (input.rankJson && filtered.length > 0) {
    try {
      const raw = await input.rankJson(
        buildRankPrompt({
          sentence: input.sentence,
          language: input.language,
          nativeLanguage: input.nativeLanguage,
          learnerLevel,
          topN,
          candidates: filtered,
        }),
      );
      const ranked = applyRankedJson(scanned.tokens, filtered, raw, topN);
      if (ranked && ranked.length > 0) recommendations = ranked;
    } catch (error) {
      console.info("[salience:rank-llm]", error);
    }
  }

  console.info("[salience:recommend]", {
    sentence: input.sentence,
    sourceContext,
    learnerLevel,
    merged: merged.map((item) => ({
      text: item.originalText,
      tags: item.signalTags,
      total: Number(item.totalScore.toFixed(2)),
    })),
    recommendations: recommendations.map((item) => ({
      text: item.originalText,
      reason: item.salienceReason,
      tags: item.signalTags,
    })),
  });

  return {
    tokens: scanned.tokens,
    parser: scanned.parser,
    sourceContext,
    merged,
    recommendations,
  };
}

export async function analyzeRecommendedSpan(input: {
  sentence: string;
  language: string;
  nativeLanguage: string;
  explanationLanguage?: string;
  translation?: string;
  candidate: RankedSalienceCandidate | SalienceCandidate;
  callDimension: DimensionCaller;
}): Promise<AnalysisResult> {
  const salienceReason =
    "salienceReason" in input.candidate
      ? input.candidate.salienceReason
      : input.candidate.signalTags.join(", ");
  return runActiveDimensions({
    sentence: input.sentence,
    language: input.language,
    nativeLanguage: input.nativeLanguage,
    explanationLanguage: input.explanationLanguage,
    translation: input.translation,
    salienceReason,
    candidate: input.candidate,
    callDimension: input.callDimension,
  });
}
