import type { SentenceSpanAnalysis } from "@/lib/salience/sentenceSpanPrompt";
import { parseDimensionResults } from "@/lib/englishAnalysis";
import { legacyDimensionProse } from "@/lib/salience/dimensionLabels";
import type { AnalysisDimension } from "@/lib/salience/types";

export type ExpressionInsightExample = {
  english: string;
  translation?: string;
};

export type ExpressionInsightComparison = {
  expression: string;
  explanation: string;
};

export type ExpressionInsight = {
  selectedText: string;
  title?: string;
  meaning?: string;
  /** Pronunciation or reading for the span, when the language has one worth showing. */
  reading?: string;
  explanation?: string;
  roleInSentence?: string;
  pattern?: string;
  examples?: ExpressionInsightExample[];
  tip?: string;
  comparison?: ExpressionInsightComparison;
  /** Per-axis notes from the sentence-span prompt, already in the interface language. */
  dimensionResults?: Partial<Record<AnalysisDimension, string>>;
};

export type ExpressionInsightRequest = {
  sentence: string;
  selected: string;
  context?: string[];
  locale: string;
  interfaceLanguage?: string;
  targetLanguage?: string;
};

function asLine(value: unknown): string {
  return typeof value === "string" ? value.replace(/\s+/g, " ").trim() : "";
}

/** Grammar titles should be a noun ("동명사"), not "동명사 사용". */
function compactInsightTitle(value: string): string {
  let title = value.replace(/\s+/g, " ").trim();
  title = title.replace(
    /(?:의)?\s*(?:사용|용법|활용|쓰기|쓰임|쓰임새)$/u,
    "",
  );
  title = title.replace(
    /\s+(?:usage|use|using|pattern|form)$/iu,
    "",
  );
  title = title.replace(/^(?:using|use of)\s+/iu, "");
  title = title.replace(/^(?:uso de)\s+/iu, "");
  return title.replace(/\s+/g, " ").trim();
}

function asExamples(value: unknown): ExpressionInsightExample[] {
  if (!Array.isArray(value)) return [];
  const out: ExpressionInsightExample[] = [];
  for (const item of value) {
    if (!item || typeof item !== "object") continue;
    const o = item as Record<string, unknown>;
    const english =
      asLine(o.sentence) || asLine(o.text) || asLine(o.english);
    if (!english) continue;
    const translation = asLine(o.translation);
    out.push(translation ? { english, translation } : { english });
    if (out.length >= 2) break;
  }
  return out;
}

export function normalizeExpressionInsight(
  raw: unknown,
  selected: string,
): ExpressionInsight | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const selectedText = asLine(o.selectedText) || selected;
  const meaning = asLine(o.meaning) || asLine(o.meaningInContext);
  const explanation =
    asLine(o.explanation) || asLine(o.whyUsed) || asLine(o.usageExplanation);
  const roleInSentence =
    asLine(o.roleInSentence) || asLine(o.contextExplanation);
  const reading = asLine(o.reading);
  const dimensionResults = parseDimensionResults(o);
  // A sentence-span answer can be dimensions and nothing else; that is not empty.
  if (!meaning && !explanation && !roleInSentence && !dimensionResults) {
    return null;
  }

  const title = compactInsightTitle(asLine(o.title));
  const pattern = asLine(o.pattern);
  const tip = asLine(o.tip);
  const examples = asExamples(o.examples);
  let comparison: ExpressionInsightComparison | undefined;
  if (o.comparison && typeof o.comparison === "object") {
    const c = o.comparison as Record<string, unknown>;
    const expression = asLine(c.expression);
    const cExpl = asLine(c.explanation);
    if (expression && cExpl) {
      comparison = { expression, explanation: cExpl };
    }
  }

  return {
    selectedText,
    ...(title ? { title } : {}),
    ...(meaning ? { meaning } : {}),
    ...(reading ? { reading } : {}),
    ...(explanation ? { explanation } : {}),
    ...(roleInSentence ? { roleInSentence } : {}),
    ...(pattern ? { pattern } : {}),
    ...(examples.length ? { examples } : {}),
    ...(tip ? { tip } : {}),
    ...(comparison ? { comparison } : {}),
    ...(dimensionResults ? { dimensionResults } : {}),
  };
}

export function selectionFitsSentence(sentence: string, selected: string): boolean {
  const hay = sentence.replace(/\s+/g, " ").trim().toLowerCase();
  const needle = selected.replace(/\s+/g, " ").trim().toLowerCase();
  if (!hay || !needle || needle.length > 160) return false;
  return hay.includes(needle);
}

/**
 * The sentence-span prompt answers along the learning language's own axes, not
 * in the flat explanation/role/pattern slots this sheet was built around. The
 * dimensions therefore travel as themselves rather than being flattened back
 * into one paragraph — flattening is what that prompt exists to undo.
 */
export function mapSentenceSpanToExpressionInsight(
  analysis: SentenceSpanAnalysis,
  interfaceLanguage?: string,
): ExpressionInsight {
  const dimensionResults = Object.keys(analysis.dimensionResults).length
    ? analysis.dimensionResults
    : undefined;
  // Sheets older than the dimension list render explanation, not dimensions.
  const legacyExplanation =
    dimensionResults && interfaceLanguage
      ? legacyDimensionProse(interfaceLanguage, dimensionResults)
      : "";
  return {
    selectedText: analysis.selectedText,
    title: analysis.selectedText,
    ...(analysis.meaningInContext ? { meaning: analysis.meaningInContext } : {}),
    ...(analysis.reading ? { reading: analysis.reading } : {}),
    ...(analysis.examples.length
      ? {
          examples: analysis.examples.map((example) => ({
            english: example.sentence,
            translation: example.meaning,
          })),
        }
      : {}),
    ...(legacyExplanation ? { explanation: legacyExplanation } : {}),
    ...(dimensionResults ? { dimensionResults } : {}),
  };
}
